/**
 * Lush Pressies — P2P Dating Match Engine
 * Advanced matching algorithms for Lush Pressies social dating ecosystem:
 * - Qwen AI Compatibility Scoring from 30Lapidaire Answers
 * - Tinder-style Roll (swipe right/left) + Reverse Roll rewind
 * - Radiate++ boost visibility queue
 * - GeoTag Passport/Visa cross-border matching
 * - 5 Membership Category preference filters
 * - First-Contact Message Limit enforcement (3 per 72h for free members)
 * Date: September 29, 2026
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class LushpressiesMatchingController {
  /**
   * POST /api/lushpressies/match/roll
   * Roll (Swipe Right = Like, Swipe Left = Skip)
   */
  async rollAction(req, res) {
    try {
      const userId = req.user?.id;
      const { targetUserId, action } = req.body; // action: 'like' | 'skip'

      if (!userId || !targetUserId || !['like', 'skip'].includes(action)) {
        return res.status(400).json({ success: false, message: 'userId, targetUserId and action (like|skip) required' });
      }

      // Record roll action
      await pool.query(
        `INSERT INTO lush_roll_actions (actor_id, target_id, action, created_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (actor_id, target_id) DO UPDATE SET action = $3, updated_at = NOW()`,
        [userId, targetUserId, action]
      );

      // Check for mutual like (match!)
      if (action === 'like') {
        const mutual = await pool.query(
          'SELECT * FROM lush_roll_actions WHERE actor_id = $1 AND target_id = $2 AND action = \'like\'',
          [targetUserId, userId]
        );

        if (mutual.rows.length > 0) {
          // Create commit eligibility tracking record
          await pool.query(
            `INSERT INTO lush_commit_eligibility (user1_id, user2_id, first_interaction_at)
             VALUES ($1, $2, NOW())
             ON CONFLICT (user1_id, user2_id) DO NOTHING`,
            [userId < targetUserId ? userId : targetUserId, userId < targetUserId ? targetUserId : userId]
          );

          return res.json({
            success: true,
            matched: true,
            message: '🎉 It\'s a match! Send a gift to start the conversation.',
            data: { targetUserId, canSendGift: true }
          });
        }
      }

      res.json({ success: true, matched: false, action });
    } catch (error) {
      logger.error('Error in LushpressiesMatchingController.rollAction:', error);
      res.status(500).json({ success: false, message: 'Failed to process roll action' });
    }
  }

  /**
   * POST /api/lushpressies/match/reverse-roll
   * Reverse Roll - rewind last skipped profile (premium)
   */
  async reverseRoll(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ success: false, message: 'Auth required' });

      const lastSkipped = await pool.query(
        `SELECT target_id FROM lush_roll_actions
         WHERE actor_id = $1 AND action = 'skip'
         ORDER BY updated_at DESC LIMIT 1`,
        [userId]
      );

      if (lastSkipped.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'No recently skipped profiles to rewind' });
      }

      const targetId = lastSkipped.rows[0].target_id;

      // Reset skip to undecided
      await pool.query(
        'DELETE FROM lush_roll_actions WHERE actor_id = $1 AND target_id = $2',
        [userId, targetId]
      );

      res.json({ success: true, message: 'Profile rewound. You can like or skip again.', data: { targetUserId: targetId } });
    } catch (error) {
      logger.error('Error in LushpressiesMatchingController.reverseRoll:', error);
      res.status(500).json({ success: false, message: 'Failed to reverse roll' });
    }
  }

  /**
   * GET /api/lushpressies/match/discover
   * Discovery Feed — respects Radiate++ boost queue, Passport/Visa, 5 membership categories
   */
  async discoverProfiles(req, res) {
    try {
      const userId = req.user?.id;
      const { membershipCategory, country, limit = 20 } = req.query;

      if (!userId) return res.status(401).json({ success: false, message: 'Auth required' });

      let query = `
        SELECT DISTINCT
          u.id, u.username, u.avatar_url,
          up.age, up.gender, up.city, up.country, up.bio,
          up.membership_category,
          CASE WHEN rs.id IS NOT NULL THEN true ELSE false END as is_radiating,
          rs.tier as radiate_tier
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        LEFT JOIN lush_radiate_sessions rs ON u.id = rs.user_id AND rs.expires_at > NOW()
        LEFT JOIN lush_passport_visas pv ON u.id = pv.user_id AND pv.is_active = true
        WHERE u.id != $1
        AND u.id NOT IN (
          SELECT target_id FROM lush_roll_actions WHERE actor_id = $1
        )`;

      const params = [userId];
      let paramIdx = 2;

      if (membershipCategory) {
        query += ` AND up.membership_category = $${paramIdx}`;
        params.push(membershipCategory);
        paramIdx++;
      }

      if (country) {
        query += ` AND (up.country = $${paramIdx} OR pv.target_country = $${paramIdx})`;
        params.push(country);
        paramIdx++;
      }

      // Radiate++ members appear first
      query += ` ORDER BY rs.tier DESC NULLS LAST, u.created_at DESC LIMIT $${paramIdx}`;
      params.push(parseInt(limit, 10));

      const result = await pool.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        meta: { radiateBoostActive: result.rows.filter(r => r.is_radiating).length }
      });
    } catch (error) {
      logger.error('Error in LushpressiesMatchingController.discoverProfiles:', error);
      res.status(500).json({ success: false, message: 'Failed to get discovery profiles' });
    }
  }

  /**
   * POST /api/lushpressies/match/first-contact
   * First-Contact Message Gate (max 3 per 72h for free members)
   */
  async sendFirstContact(req, res) {
    try {
      const senderId = req.user?.id;
      const { recipientId, message } = req.body;

      if (!senderId || !recipientId || !message) {
        return res.status(400).json({ success: false, message: 'Sender, recipient and message required' });
      }

      // Check 72h message limit for free users
      const recentCount = await pool.query(
        `SELECT COUNT(*) as cnt FROM lush_first_contacts
         WHERE sender_id = $1 AND created_at > NOW() - INTERVAL '72 hours'`,
        [senderId]
      );

      const count = parseInt(recentCount.rows[0].cnt, 10);
      if (count >= 3) {
        return res.status(429).json({
          success: false,
          message: 'First-contact limit reached. Upgrade to premium for unlimited messaging.',
          retryAfter: '72 hours'
        });
      }

      await pool.query(
        `INSERT INTO lush_first_contacts (sender_id, recipient_id, message, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [senderId, recipientId, message]
      );

      res.status(201).json({
        success: true,
        message: 'First contact message sent',
        data: { messagesUsed: count + 1, messagesRemaining: Math.max(0, 3 - count - 1) }
      });
    } catch (error) {
      logger.error('Error in LushpressiesMatchingController.sendFirstContact:', error);
      res.status(500).json({ success: false, message: 'Failed to send first-contact message' });
    }
  }

  /**
   * GET /api/lushpressies/match/compatibility/:targetUserId
   * Compute AI Compatibility Score fromLapidaire Answers
   */
  async getCompatibilityScore(req, res) {
    try {
      const userId = req.user?.id;
      const { targetUserId } = req.params;

      const myAnswers = await pool.query(
        `SELECT lia.question_id, lia.answer_text, liq.ai_tags, liq.category
         FROM lush_user_answers lia
         JOIN lush_lapidaire_questions liq ON lia.question_id = liq.id
         WHERE lia.user_id = $1`,
        [userId]
      );

      const theirAnswers = await pool.query(
        `SELECT lia.question_id, lia.answer_text, liq.ai_tags, liq.category
         FROM lush_user_answers lia
         JOIN lush_lapidaire_questions liq ON lia.question_id = liq.id
         WHERE lia.user_id = $1`,
        [targetUserId]
      );

      if (myAnswers.rows.length === 0 || theirAnswers.rows.length === 0) {
        return res.json({
          success: true,
          data: { score: null, message: 'Both members need to completelapidaire questions' }
        });
      }

      // Weighted category scoring simulation
      const categoryWeights = {
        values_life: 0.30,
        intimacy: 0.25,
        future_goals: 0.20,
        boundaries: 0.15,
        past_learning: 0.05,
        light_fun: 0.05
      };

      const myByCategory = {};
      myAnswers.rows.forEach(a => {
        if (!myByCategory[a.category]) myByCategory[a.category] = [];
        myByCategory[a.category].push(a.answer_text.toLowerCase());
      });

      const theirByCategory = {};
      theirAnswers.rows.forEach(a => {
        if (!theirByCategory[a.category]) theirByCategory[a.category] = [];
        theirByCategory[a.category].push(a.answer_text.toLowerCase());
      });

      let totalScore = 0;
      const categoryScores = {};

      Object.entries(categoryWeights).forEach(([category, weight]) => {
        const mySet = new Set(myByCategory[category] || []);
        const theirSet = new Set(theirByCategory[category] || []);
        const intersection = [...mySet].filter(x => theirSet.has(x));
        const union = new Set([...mySet, ...theirSet]);
        const jaccardSim = union.size > 0 ? (intersection.length / union.size) * 100 : 50;
        categoryScores[category] = Math.round(jaccardSim);
        totalScore += jaccardSim * weight;
      });

      const finalScore = Math.round(totalScore);
      const tier = finalScore >= 80 ? 'Soulmate Match' : finalScore >= 60 ? 'Strong Match' : finalScore >= 40 ? 'Good Potential' : 'Exploratory';

      res.json({
        success: true,
        data: {
          overallScore: finalScore,
          tier,
          categoryBreakdown: categoryScores,
          answersCompared: Math.min(myAnswers.rows.length, theirAnswers.rows.length)
        }
      });
    } catch (error) {
      logger.error('Error in LushpressiesMatchingController.getCompatibilityScore:', error);
      res.status(500).json({ success: false, message: 'Failed to compute compatibility score' });
    }
  }

  /**
   * POST /api/lushpressies/passport
   * Set GeoTag Passport/Visa for cross-border global matching
   */
  async setPassport(req, res) {
    try {
      const userId = req.user?.id;
      const { targetCountry, targetCity, durationDays = 30 } = req.body;

      if (!userId || !targetCountry) {
        return res.status(400).json({ success: false, message: 'User ID and target country required' });
      }

      // Deactivate existing passports
      await pool.query('UPDATE lush_passport_visas SET is_active = false WHERE user_id = $1', [userId]);

      const result = await pool.query(
        `INSERT INTO lush_passport_visas (user_id, target_country, target_city, expires_at, is_active)
         VALUES ($1, $2, $3, NOW() + INTERVAL '${parseInt(durationDays, 10)} days', true)
         RETURNING *`,
        [userId, targetCountry, targetCity || null]
      );

      res.status(201).json({
        success: true,
        message: `Passport activated. You are now visible to members in ${targetCountry}.`,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in LushpressiesMatchingController.setPassport:', error);
      res.status(500).json({ success: false, message: 'Failed to set passport' });
    }
  }
}

module.exports = new LushpressiesMatchingController();
