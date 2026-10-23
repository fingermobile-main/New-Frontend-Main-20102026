const { pool } = require('../db');
const crypto = require('crypto');

class CreatorTierModel {
  /**
   * Get all tier rules for a country
   */
  static async getTierRules(countryCode) {
    const res = await pool.query(
      `SELECT country_code, tier, max_capacity, reserved_count, current_active, 
              registration_status, admission_mode, min_followers_required, kyc_required, updated_at
       FROM regional_creator_tier_rules
       WHERE country_code = $1
       ORDER BY tier ASC`,
      [countryCode.toUpperCase()]
    );
    return res.rows;
  }

  /**
   * Get active cohorts and waitlist cohorts for a country
   */
  static async getAvailability(countryCode) {
    const code = countryCode.toUpperCase();

    // 1. Fetch cohorts
    const cohortRes = await pool.query(
      `SELECT id, cohort_name, cohort_type, total_seats, claimed_seats, 
              (total_seats - claimed_seats) AS available_seats,
              ROUND((claimed_seats::NUMERIC / NULLIF(total_seats, 0)) * 100, 1) AS percentage_filled,
              closes_at, is_accepting_signups
       FROM creator_registration_cohorts
       WHERE country_code = $1 AND is_visible_publicly = TRUE
       ORDER BY starts_at DESC`,
      [code]
    );

    const activeCohortRow = cohortRes.rows.find(c => c.cohort_type === 'ACTIVE_REGISTRATION');
    const waitlistCohortRow = cohortRes.rows.find(c => c.cohort_type === 'WAITLIST');

    // 2. Fetch tier capacities
    const tiersRes = await pool.query(
      `SELECT tier, max_capacity, reserved_count, current_active, registration_status, admission_mode
       FROM regional_creator_tier_rules
       WHERE country_code = $1`,
      [code]
    );

    const activeCohort = activeCohortRow ? {
      id: activeCohortRow.id,
      name: activeCohortRow.cohort_name,
      totalSeats: parseInt(activeCohortRow.total_seats, 10),
      claimedSeats: parseInt(activeCohortRow.claimed_seats, 10),
      availableSeats: Math.max(0, parseInt(activeCohortRow.available_seats, 10)),
      percentageFilled: parseFloat(activeCohortRow.percentage_filled || 0),
      closesAt: activeCohortRow.closes_at,
      status: parseInt(activeCohortRow.available_seats, 10) > 0 ? 'AVAILABLE' : 'FULL'
    } : null;

    const waitlistCohort = waitlistCohortRow ? {
      id: waitlistCohortRow.id,
      name: waitlistCohortRow.cohort_name,
      totalSeats: parseInt(waitlistCohortRow.total_seats, 10),
      claimedSeats: parseInt(waitlistCohortRow.claimed_seats, 10),
      availableSeats: Math.max(0, parseInt(waitlistCohortRow.available_seats, 10)),
      percentageFilled: parseFloat(waitlistCohortRow.percentage_filled || 0),
      closesAt: waitlistCohortRow.closes_at,
      status: 'OPEN'
    } : null;

    return {
      countryCode: code,
      activeCohort,
      waitlistCohort,
      tiers: tiersRes.rows
    };
  }

  /**
   * Process creator signup with atomic row lock & transaction
   */
  static async processCreatorSignup({ userId, countryCode, tier, isGeoSuspect = false, rawToken = null }) {
    const client = await pool.connect();
    const code = countryCode.toUpperCase();
    const targetTier = tier.toUpperCase();

    try {
      await client.query('BEGIN');

      // 1. Fetch tier rule with pessimistic row lock
      const ruleRes = await client.query(
        `SELECT registration_status, admission_mode, max_capacity, reserved_count, current_active
         FROM regional_creator_tier_rules
         WHERE country_code = $1 AND tier = $2
         FOR UPDATE`,
        [code, targetTier]
      );

      if (ruleRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return { success: false, reason: 'INVALID_CONFIG', message: 'No configuration found for this region/tier' };
      }

      const rule = ruleRes.rows[0];

      // 2. Evaluate Registration Status Toggle
      if (rule.registration_status === 'CLOSED') {
        await client.query('ROLLBACK');
        return { success: false, reason: 'REGISTRATION_CLOSED', message: 'Registrations are currently closed for this tier/region.' };
      }

      // If WAITLIST only or full, place in waitlist table
      if (rule.registration_status === 'WAITLIST' || rule.reserved_count >= rule.max_capacity) {
        await client.query(
          `INSERT INTO creator_waitlist (user_id, country_code, target_tier, status)
           VALUES ($1, $2, $3, 'QUEUED')
           ON CONFLICT (user_id) DO UPDATE SET target_tier = EXCLUDED.target_tier, status = 'QUEUED'`,
          [userId, code, targetTier]
        );

        await client.query(
          `INSERT INTO creator_profiles (user_id, country_code, tier, status, is_geo_suspect)
           VALUES ($1, $2, $3, 'WAITLISTED', $4)
           ON CONFLICT (user_id) DO UPDATE SET status = 'WAITLISTED', tier = EXCLUDED.tier`,
          [userId, code, targetTier, isGeoSuspect]
        );

        await client.query('COMMIT');
        return {
          success: true,
          status: 'WAITLISTED',
          message: 'Capacity full or waitlist active. You have been added to the Priority Waitlist.'
        };
      }

      // 3. Check for INVITE_ONLY admission mode
      if (rule.admission_mode === 'INVITE_ONLY') {
        if (!rawToken) {
          await client.query('ROLLBACK');
          return { success: false, reason: 'INVITE_TOKEN_REQUIRED', message: 'This tier requires an exclusive invitation token.' };
        }

        const tokenHash = crypto.createHash('sha256').update(rawToken.trim()).digest('hex');
        const tokenRes = await client.query(
          `UPDATE creator_invite_tokens
           SET is_redeemed = TRUE, redeemed_by = $1, redeemed_at = NOW()
           WHERE token_hash = $2 AND country_code = $3 AND tier = $4 AND is_redeemed = FALSE AND expires_at > NOW()
           RETURNING id`,
          [userId, tokenHash, code, targetTier]
        );

        if (tokenRes.rowCount === 0) {
          await client.query('ROLLBACK');
          return { success: false, reason: 'INVALID_TOKEN', message: 'Invite token is invalid, expired, or region-mismatched.' };
        }
      }

      // 4. Atomically claim seat
      const atomicClaimQuery = `
        UPDATE regional_creator_tier_rules
        SET reserved_count = reserved_count + 1,
            updated_at = NOW()
        WHERE country_code = $1 
          AND tier = $2 
          AND reserved_count < max_capacity
        RETURNING reserved_count, max_capacity;
      `;
      const claimRes = await client.query(atomicClaimQuery, [code, targetTier]);

      if (claimRes.rows.length === 0) {
        // Flashed capacity filled concurrently
        await client.query(
          `INSERT INTO creator_waitlist (user_id, country_code, target_tier, status)
           VALUES ($1, $2, $3, 'QUEUED')
           ON CONFLICT (user_id) DO UPDATE SET target_tier = EXCLUDED.target_tier, status = 'QUEUED'`,
          [userId, code, targetTier]
        );
        await client.query('COMMIT');
        return { success: true, status: 'WAITLISTED', message: 'Capacity filled under concurrent load. Queued in waitlist.' };
      }

      // 5. Determine status from admission mode (downgrade to manual review if suspect)
      let targetStatus = (rule.admission_mode === 'AUTO_ADMIT' && !isGeoSuspect)
        ? 'ACTIVE'
        : 'PENDING_APPROVAL';

      // 6. Insert or update creator profile
      const profileRes = await client.query(
        `INSERT INTO creator_profiles (user_id, country_code, tier, status, is_geo_suspect)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id) DO UPDATE 
           SET country_code = EXCLUDED.country_code, 
               tier = EXCLUDED.tier, 
               status = EXCLUDED.status, 
               is_geo_suspect = EXCLUDED.is_geo_suspect,
               updated_at = NOW()
         RETURNING id`,
        [userId, code, targetTier, targetStatus, isGeoSuspect]
      );

      // If active, increment current_active
      if (targetStatus === 'ACTIVE') {
        await client.query(
          `UPDATE regional_creator_tier_rules 
           SET current_active = current_active + 1 
           WHERE country_code = $1 AND tier = $2`,
          [code, targetTier]
        );
      }

      await client.query('COMMIT');

      return {
        success: true,
        status: targetStatus,
        profileId: profileRes.rows[0].id,
        message: targetStatus === 'ACTIVE'
          ? 'Creator seat claimed and account activated successfully.'
          : 'Application received and submitted for administrative review.'
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Claim seat in a dated cohort
   */
  static async claimCohortSeat(cohortId, userId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const claimRes = await client.query(
        `UPDATE creator_registration_cohorts
         SET claimed_seats = claimed_seats + 1
         WHERE id = $1
           AND is_accepting_signups = TRUE
           AND NOW() BETWEEN starts_at AND closes_at
           AND claimed_seats < total_seats
         RETURNING id, country_code, cohort_type`,
        [cohortId]
      );

      if (claimRes.rowCount === 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          error: 'This cohort is either fully booked, closed, or outside the eligibility window.'
        };
      }

      const { cohort_type, country_code } = claimRes.rows[0];
      const initialStatus = cohort_type === 'WAITLIST' ? 'WAITLISTED' : 'PENDING_APPROVAL';

      await client.query(
        `INSERT INTO creator_profiles (user_id, country_code, tier, cohort_id, status)
         VALUES ($1, $2, 'TIER_3', $3, $4)
         ON CONFLICT (user_id) DO UPDATE 
           SET cohort_id = EXCLUDED.cohort_id, status = EXCLUDED.status, updated_at = NOW()`,
        [userId, country_code, cohortId, initialStatus]
      );

      await client.query('COMMIT');
      return { success: true, status: initialStatus };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Auto-promote next candidate from waitlist when seat is freed
   */
  static async promoteNextInWaitlist(countryCode, tier) {
    const client = await pool.connect();
    const code = countryCode.toUpperCase();
    const targetTier = tier.toUpperCase();

    try {
      await client.query('BEGIN');

      const capCheck = await client.query(
        `SELECT max_capacity, reserved_count 
         FROM regional_creator_tier_rules 
         WHERE country_code = $1 AND tier = $2 
         FOR UPDATE`,
        [code, targetTier]
      );

      const rule = capCheck.rows[0];
      if (!rule || rule.reserved_count >= rule.max_capacity) {
        await client.query('ROLLBACK');
        return null;
      }

      const candidateRes = await client.query(
        `SELECT id, user_id FROM creator_waitlist
         WHERE country_code = $1 
           AND target_tier = $2 
           AND status = 'QUEUED'
         ORDER BY priority_score DESC, created_at ASC
         LIMIT 1
         FOR UPDATE SKIP LOCKED`,
        [code, targetTier]
      );

      if (candidateRes.rowCount === 0) {
        await client.query('ROLLBACK');
        return null;
      }

      const candidate = candidateRes.rows[0];

      await client.query(
        `UPDATE regional_creator_tier_rules 
         SET reserved_count = reserved_count + 1 
         WHERE country_code = $1 AND tier = $2`,
        [code, targetTier]
      );

      await client.query(
        `UPDATE creator_waitlist
         SET status = 'OFFERED',
             offered_at = NOW(),
             offer_expires_at = NOW() + INTERVAL '48 hours'
         WHERE id = $1`,
        [candidate.id]
      );

      await client.query('COMMIT');
      return candidate.user_id;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  /**
   * Update regional tier configuration by SuperAdmin with audit logging
   */
  static async updateCountryTierRules({ countryCode, tier, maxCapacity, registrationStatus, admissionMode, adminId, ipAddress }) {
    const client = await pool.connect();
    const code = countryCode.toUpperCase();
    const targetTier = tier.toUpperCase();

    try {
      await client.query('BEGIN');

      const oldStateRes = await client.query(
        'SELECT * FROM regional_creator_tier_rules WHERE country_code = $1 AND tier = $2 FOR UPDATE',
        [code, targetTier]
      );

      if (oldStateRes.rowCount === 0) {
        await client.query('ROLLBACK');
        return { success: false, notFound: true, message: 'Tier configuration not found.' };
      }

      const previousState = oldStateRes.rows[0];

      if (maxCapacity < previousState.reserved_count) {
        await client.query('ROLLBACK');
        return {
          success: false,
          invalidCapacity: true,
          message: `Capacity cannot be lower than current active creator count (${previousState.reserved_count}).`
        };
      }

      const updateRes = await client.query(
        `UPDATE regional_creator_tier_rules
         SET max_capacity = $1,
             registration_status = $2,
             admission_mode = $3,
             updated_at = NOW()
         WHERE country_code = $4 AND tier = $5
         RETURNING *`,
        [maxCapacity, registrationStatus, admissionMode, code, targetTier]
      );

      await client.query(
        `INSERT INTO admin_creator_audit_logs 
         (admin_id, action_type, country_code, tier, previous_state, new_state, ip_address)
         VALUES ($1, 'UPDATE_CAPACITY_AND_MODE', $2, $3, $4, $5, $6)`,
        [adminId || 'SUPER_ADMIN_SYSTEM', code, targetTier, JSON.stringify(previousState), JSON.stringify(updateRes.rows[0]), ipAddress || '127.0.0.1']
      );

      await client.query('COMMIT');
      return { success: true, data: updateRes.rows[0] };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = CreatorTierModel;
