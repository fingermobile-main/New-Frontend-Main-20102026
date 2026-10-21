/**
 * Hallmarks Controller
 * Badges, achievements, credentials & community entity platform for FingerMobile Protocol™
 * Strictly PostgreSQL
 */

const db = require('../db');
const logger = require('../utils/logger');
const _hallmarkService = require('../services/hallmarkService');

const logErr = (msg, err) => {
  if (logger && typeof logger.error === 'function') logger.error(msg, err);
  // eslint-disable-next-line no-console
  else console.error(msg, err);
};

const getPool = () => db.pool || db;

class HallmarksController {
  constructor() {
    this.getAllHallmarks = this.getAllHallmarks.bind(this);
    this.getUserHallmarks = this.getUserHallmarks.bind(this);
    this.getUserAchievements = this.getUserAchievements.bind(this);
    this.getQuota = this.getQuota.bind(this);
    this.createHallmark = this.createHallmark.bind(this);
    this.deleteHallmark = this.deleteHallmark.bind(this);
    this.warnHallmark = this.warnHallmark.bind(this);
    this.suspendHallmark = this.suspendHallmark.bind(this);
    this.freezeHallmark = this.freezeHallmark.bind(this);
    this.unfreezeHallmark = this.unfreezeHallmark.bind(this);
    this.unsuspendHallmark = this.unsuspendHallmark.bind(this);
    this.getModerationAudit = this.getModerationAudit.bind(this);
    this.awardHallmark = this.awardHallmark.bind(this);

    // Aliases for compatibility
    this.award = this.awardHallmark;
    this.getAll = this.getAllHallmarks;
    this.create = this.createHallmark;
    this.delete = this.deleteHallmark;

    this.revoke = async (req, res) => {
      try {
        const { userId, hallmarkId } = req.body;
        await getPool().query('DELETE FROM user_hallmarks WHERE user_id = $1 AND hallmark_id = $2', [userId, hallmarkId]);
        res.status(200).json({ success: true, message: 'Revoked hallmark' });
      } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to revoke hallmark' });
      }
    };

    this.getById = async (req, res) => {
      try {
        const hallmarkId = req.params.id;
        const result = await getPool().query('SELECT * FROM hallmarks WHERE id = $1', [hallmarkId]);
        if (result.rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Hallmark not found' });
        }
        res.status(200).json({ success: true, data: result.rows[0] });
      } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to retrieve hallmark' });
      }
    };

    this.update = async (req, res) => {
      try {
        const hallmarkId = req.params.id;
        const { name, description, category, rarity, status } = req.body;
        const result = await getPool().query(
          `UPDATE hallmarks 
           SET name = COALESCE($1, name), 
               description = COALESCE($2, description), 
               category = COALESCE($3, category), 
               rarity = COALESCE($4, rarity),
               status = COALESCE($5, status), 
               updated_at = NOW() 
           WHERE id = $6 RETURNING *`,
          [name, description, category, rarity, status, hallmarkId]
        );
        res.status(200).json({ success: true, data: result.rows[0] });
      } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update hallmark' });
      }
    };
  }

  /**
   * Helper: Get or rotate 6-month PIN quota for a moderator/badge-holder
   */
  async getOrCreateModQuota(userId, role = 'moderator') {
    const pool = getPool();
    const existing = await pool.query(
      `SELECT * FROM moderator_pin_quotas 
       WHERE user_id = $1 AND period_start <= NOW() AND period_end >= NOW()
       ORDER BY period_end DESC LIMIT 1`,
      [userId]
    );

    if (existing.rows.length > 0) {
      return existing.rows[0];
    }

    // Auto-create next 6-month cycle (e.g. 1st of current month to +6 months)
    const newQuota = await pool.query(
      `INSERT INTO moderator_pin_quotas (user_id, role, total_pins, used_pins, period_start, period_end)
       VALUES ($1, $2, 50, 0, date_trunc('month', NOW()), date_trunc('month', NOW()) + INTERVAL '6 months')
       RETURNING *`,
      [userId, role]
    );
    return newQuota.rows[0];
  }

  /**
   * GET /api/hallmarks
   * Lists all active/moderated hallmarks
   */
  async getAllHallmarks(req, res) {
    try {
      // Auto-expire suspensions and freezes that passed their timestamp
      await getPool().query(`
        UPDATE hallmarks 
        SET is_suspended = FALSE, status = 'active'
        WHERE is_suspended = TRUE AND suspended_until IS NOT NULL AND suspended_until < NOW()
      `);
      await getPool().query(`
        UPDATE hallmarks 
        SET is_frozen = FALSE, status = 'active'
        WHERE is_frozen = TRUE AND frozen_until IS NOT NULL AND frozen_until < NOW()
      `);

      const result = await getPool().query(`
        SELECT h.*, u.username as creator_username
        FROM hallmarks h
        LEFT JOIN members u ON h.creator_id = u.id
        WHERE h.status = 'active'
        ORDER BY h.id ASC
      `);
      res.status(200).json({ success: true, data: result.rows, count: result.rows.length });
    } catch (error) {
      logErr('Error in HallmarksController.getAllHallmarks:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve hallmarks' });
    }
  }

  /**
   * GET /api/hallmarks/quota
   * Returns current user's creation limit (max 2 active) & 50-PIN moderation balance
   */
  async getQuota(req, res) {
    try {
      const userId = req.user?.id || 1;
      const pool = getPool();

      // Check active pages created by this user
      const pagesRes = await pool.query(`
        SELECT * FROM hallmarks 
        WHERE creator_id = $1 AND status != 'deleted'
        ORDER BY created_at DESC
      `, [userId]);

      const activePages = pagesRes.rows.filter(p => {
        const isSusp = p.is_suspended && (!p.suspended_until || new Date(p.suspended_until) > new Date());
        const isFroz = p.is_frozen && (!p.frozen_until || new Date(p.frozen_until) > new Date());
        return p.status === 'active' && !isSusp && !isFroz;
      });

      const activeCount = activePages.length;
      const canCreate = activeCount < 2;

      // Check moderator PIN balance
      const modQuota = await this.getOrCreateModQuota(userId, req.user?.role || 'moderator');
      const remainingPins = Math.max(0, modQuota.total_pins - modQuota.used_pins);

      res.status(200).json({
        success: true,
        data: {
          userId,
          createdCount: activeCount,
          totalCreated: pagesRes.rows.length,
          maxAllowed: 2,
          canCreate,
          myPages: pagesRes.rows,
          moderationQuota: {
            totalPins: modQuota.total_pins,
            usedPins: modQuota.used_pins,
            remainingPins,
            periodStart: modQuota.period_start,
            periodEnd: modQuota.period_end
          }
        }
      });
    } catch (error) {
      logErr('Error in HallmarksController.getQuota:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch hallmarks quota' });
    }
  }

  /**
   * POST /api/hallmarks
   * Creates a new Hallmark page.
   * Strictly enforces:
   * 1. Max 2 active HallMarks pages per Member profile.
   * 2. Naming policy rules.
   */
  async createHallmark(req, res) {
    try {
      const creatorId = req.user?.id || req.body.creatorId || req.body.ownerId || 1;
      const {
        name,
        description,
        tier = 'individual',
        category = 'Technology & Innovation',
        websiteUrl = '',
        idType = 'NIN',
        idNumber = '',
        companyRegNumber = ''
      } = req.body;

      if (!name || name.trim().length <= 3) {
        return res.status(400).json({ success: false, message: 'Hallmark Page name must be longer than 3 characters' });
      }

      const trimmedName = name.trim();

      // Naming validations
      if (/\.com|\.net|\.org|http:\/\/|https:\/\//i.test(trimmedName)) {
        return res.status(400).json({ success: false, message: 'Hallmark Page name cannot contain web links or URLs' });
      }
      if (/\s{2,}/.test(trimmedName)) {
        return res.status(400).json({ success: false, message: 'Irregular spacing is prohibited in Hallmark Page name' });
      }

      const pool = getPool();

      // Check active count (Maximum of 2 active per member profile)
      const countCheck = await pool.query(`
        SELECT COUNT(*) FROM hallmarks 
        WHERE creator_id = $1 
          AND status = 'active'
          AND (is_suspended IS FALSE OR (suspended_until IS NOT NULL AND suspended_until < NOW()))
          AND (is_frozen IS FALSE OR (frozen_until IS NOT NULL AND frozen_until < NOW()))
      `, [creatorId]);

      const activeCount = parseInt(countCheck.rows[0]?.count || '0', 10);
      if (activeCount >= 2) {
        return res.status(403).json({
          success: false,
          message: 'Member Limit Reached: One member/user profile can only create a maximum of two (2) active HallMarks pages. A slot will only open when an existing page is deleted by author/admin, suspended (1-7 days), or frozen (6 hours).'
        });
      }

      // Check duplicate name
      const dupCheck = await pool.query('SELECT id FROM hallmarks WHERE LOWER(name) = LOWER($1)', [trimmedName]);
      if (dupCheck.rows.length > 0) {
        return res.status(409).json({ success: false, message: 'Hallmark Page name already exists. Please choose a unique name.' });
      }

      const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `hm-${Date.now()}`;
      const referenceToken = 'HM-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-2026';

      const insertRes = await pool.query(`
        INSERT INTO hallmarks (
          creator_id, name, slug, description, tier, category,
          members_count, badges_awarded, reference_token, status,
          website_url, id_type, id_number, company_reg_number,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          1, 0, $7, 'active',
          $8, $9, $10, $11,
          NOW(), NOW()
        ) RETURNING *
      `, [creatorId, trimmedName, slug, description || '', tier, category, referenceToken, websiteUrl, idType, idNumber, companyRegNumber]);

      const createdHallmark = insertRes.rows[0];

      // Assign owner role in user_hallmarks
      await pool.query(`
        INSERT INTO user_hallmarks (user_id, hallmark_id, role, awarded_at)
        VALUES ($1, $2, 'owner', NOW())
        ON CONFLICT (user_id, hallmark_id) DO NOTHING
      `, [creatorId, createdHallmark.id]);

      res.status(201).json({
        success: true,
        message: 'HallMarks page application logged successfully.',
        data: createdHallmark
      });
    } catch (error) {
      logErr('Error in HallmarksController.createHallmark:', error);
      res.status(500).json({ success: false, message: 'Failed to create hallmark page' });
    }
  }

  /**
   * DELETE /api/hallmarks/:id
   * Author/Creator or SuperAdmin can delete. Frees up 1 creation slot.
   */
  async deleteHallmark(req, res) {
    try {
      const hallmarkId = req.params.id;
      const requesterId = req.user?.id || 1;
      const requesterRole = req.user?.role || 'user';
      const pool = getPool();

      const existing = await pool.query('SELECT * FROM hallmarks WHERE id = $1', [hallmarkId]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'HallMarks page not found' });
      }

      const hallmark = existing.rows[0];
      const isCreator = hallmark.creator_id === requesterId;
      const isSuperAdmin = requesterRole === 'superadmin' || requesterRole === 'admin';

      if (!isCreator && !isSuperAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Permission denied. Only the author/creator or a SuperAdmin can delete this HallMarks page.'
        });
      }

      await pool.query(
        'UPDATE hallmarks SET status = $1, updated_at = NOW() WHERE id = $2',
        ['deleted', hallmarkId]
      );

      // Log action
      await pool.query(`
        INSERT INTO moderation_pin_actions (moderator_id, hallmark_id, action_type, reason, pin_consumed)
        VALUES ($1, $2, 'delete', $3, FALSE)
      `, [requesterId, hallmarkId, `Deleted by ${isSuperAdmin ? 'SuperAdmin' : 'Author'}`]);

      res.status(200).json({
        success: true,
        message: 'HallMarks page deleted successfully. 1 creation slot has been released for your profile.'
      });
    } catch (error) {
      logErr('Error in HallmarksController.deleteHallmark:', error);
      res.status(500).json({ success: false, message: 'Failed to delete hallmark page' });
    }
  }

  /**
   * POST /api/hallmarks/:id/warn
   * Moderator or Admin issues a formal warning to a community.
   */
  async warnHallmark(req, res) {
    try {
      const hallmarkId = req.params.id;
      const moderatorId = req.user?.id || 1;
      const { reason = 'Community standard policy warning' } = req.body;
      const pool = getPool();

      const updated = await pool.query(`
        UPDATE hallmarks
        SET warning_count = warning_count + 1,
            last_warning_reason = $1,
            last_warning_issued_at = NOW(),
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [reason, hallmarkId]);

      if (updated.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'HallMarks page not found' });
      }

      // Log warning action (does NOT consume a PIN)
      await pool.query(`
        INSERT INTO moderation_pin_actions (moderator_id, hallmark_id, action_type, reason, pin_consumed)
        VALUES ($1, $2, 'warn', $3, FALSE)
      `, [moderatorId, hallmarkId, reason]);

      res.status(200).json({
        success: true,
        message: `Formal warning issued. Current warning count: ${updated.rows[0].warning_count}`,
        data: updated.rows[0]
      });
    } catch (error) {
      logErr('Error in HallmarksController.warnHallmark:', error);
      res.status(500).json({ success: false, message: 'Failed to issue warning' });
    }
  }

  /**
   * POST /api/hallmarks/:id/suspend
   * Suspension by a Moderator (for 1-7 days AFTER a warning).
   * Consumes 1 PIN from the 50 PINs 6-month rotating quota.
   */
  async suspendHallmark(req, res) {
    try {
      const hallmarkId = req.params.id;
      const moderatorId = req.user?.id || 1;
      const { durationDays = 3, reason = 'Community guideline violation' } = req.body;
      const pool = getPool();

      if (durationDays < 1 || durationDays > 7) {
        return res.status(400).json({
          success: false,
          message: 'Suspension duration must be between 1 and 7 days.'
        });
      }

      // Check hallmark status & warning requirement
      const existing = await pool.query('SELECT * FROM hallmarks WHERE id = $1', [hallmarkId]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'HallMarks page not found' });
      }

      const hallmark = existing.rows[0];
      if (!hallmark.warning_count || hallmark.warning_count < 1) {
        return res.status(400).json({
          success: false,
          message: 'Policy Violation: Suspension by a Moderator can only be executed after a prior formal warning has been issued.'
        });
      }

      // Check & consume 50-PIN quota
      const modQuota = await this.getOrCreateModQuota(moderatorId, 'moderator');
      if (modQuota.used_pins >= modQuota.total_pins) {
        return res.status(429).json({
          success: false,
          message: `Anti-Abuse Safeguard: You have reached your limit of 50 PINs for the current 6-month rotation. Next reset: ${new Date(modQuota.period_end).toLocaleDateString()}`
        });
      }

      // Deduct 1 PIN
      await pool.query(`
        UPDATE moderator_pin_quotas 
        SET used_pins = used_pins + 1, updated_at = NOW() 
        WHERE id = $1
      `, [modQuota.id]);

      // Apply suspension
      const suspRes = await pool.query(`
        UPDATE hallmarks
        SET is_suspended = TRUE,
            suspended_until = NOW() + ($1 || ' days')::INTERVAL,
            suspension_reason = $2,
            status = 'suspended',
            updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `, [durationDays, reason, hallmarkId]);

      // Log action
      await pool.query(`
        INSERT INTO moderation_pin_actions (moderator_id, hallmark_id, action_type, duration_hours, reason, pin_consumed)
        VALUES ($1, $2, 'suspend', $3, $4, TRUE)
      `, [moderatorId, hallmarkId, durationDays * 24, reason]);

      const remainingPins = modQuota.total_pins - (modQuota.used_pins + 1);

      res.status(200).json({
        success: true,
        message: `HallMarks page suspended for ${durationDays} days after warning. 1 PIN consumed (${remainingPins}/50 remaining for 6-month cycle).`,
        data: suspRes.rows[0],
        remainingPins
      });
    } catch (error) {
      logErr('Error in HallmarksController.suspendHallmark:', error);
      res.status(500).json({ success: false, message: 'Failed to suspend hallmark page' });
    }
  }

  /**
   * POST /api/hallmarks/:id/freeze
   * Freeze by a Badge-carrying Member (strictly 6 hours).
   * Consumes 1 PIN from the 50 PINs 6-month rotating quota.
   */
  async freezeHallmark(req, res) {
    try {
      const hallmarkId = req.params.id;
      const memberId = req.user?.id || 1;
      const { reason = 'Emergency badge freeze investigation' } = req.body;
      const pool = getPool();

      // Check hallmark
      const existing = await pool.query('SELECT * FROM hallmarks WHERE id = $1', [hallmarkId]);
      if (existing.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'HallMarks page not found' });
      }

      // Check & consume 50-PIN quota
      const modQuota = await this.getOrCreateModQuota(memberId, 'badge_member');
      if (modQuota.used_pins >= modQuota.total_pins) {
        return res.status(429).json({
          success: false,
          message: `Anti-Abuse Safeguard: You have reached your limit of 50 PINs for the current 6-month rotation. Next reset: ${new Date(modQuota.period_end).toLocaleDateString()}`
        });
      }

      // Deduct 1 PIN
      await pool.query(`
        UPDATE moderator_pin_quotas 
        SET used_pins = used_pins + 1, updated_at = NOW() 
        WHERE id = $1
      `, [modQuota.id]);

      // Apply 6-hour freeze
      const freezeRes = await pool.query(`
        UPDATE hallmarks
        SET is_frozen = TRUE,
            frozen_until = NOW() + INTERVAL '6 hours',
            frozen_reason = $1,
            status = 'frozen',
            updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `, [reason, hallmarkId]);

      // Log action
      await pool.query(`
        INSERT INTO moderation_pin_actions (moderator_id, hallmark_id, action_type, duration_hours, reason, pin_consumed)
        VALUES ($1, $2, 'freeze', 6, $3, TRUE)
      `, [memberId, hallmarkId, reason]);

      const remainingPins = modQuota.total_pins - (modQuota.used_pins + 1);

      res.status(200).json({
        success: true,
        message: `HallMarks page frozen for 6 hours by Badge Member. 1 PIN consumed (${remainingPins}/50 remaining for 6-month cycle).`,
        data: freezeRes.rows[0],
        remainingPins
      });
    } catch (error) {
      logErr('Error in HallmarksController.freezeHallmark:', error);
      res.status(500).json({ success: false, message: 'Failed to freeze hallmark page' });
    }
  }

  /**
   * POST /api/hallmarks/:id/unfreeze
   */
  async unfreezeHallmark(req, res) {
    try {
      const hallmarkId = req.params.id;
      const pool = getPool();
      const updated = await pool.query(`
        UPDATE hallmarks
        SET is_frozen = FALSE, frozen_until = NULL, status = 'active', updated_at = NOW()
        WHERE id = $1 RETURNING *
      `, [hallmarkId]);
      res.status(200).json({ success: true, message: 'HallMarks page unfrozen', data: updated.rows[0] });
    } catch (error) {
      logErr('Error in HallmarksController.unfreezeHallmark:', error);
      res.status(500).json({ success: false, message: 'Failed to unfreeze' });
    }
  }

  /**
   * POST /api/hallmarks/:id/unsuspend
   */
  async unsuspendHallmark(req, res) {
    try {
      const hallmarkId = req.params.id;
      const pool = getPool();
      const updated = await pool.query(`
        UPDATE hallmarks
        SET is_suspended = FALSE, suspended_until = NULL, status = 'active', updated_at = NOW()
        WHERE id = $1 RETURNING *
      `, [hallmarkId]);
      res.status(200).json({ success: true, message: 'HallMarks page unsuspended', data: updated.rows[0] });
    } catch (error) {
      logErr('Error in HallmarksController.unsuspendHallmark:', error);
      res.status(500).json({ success: false, message: 'Failed to unsuspend' });
    }
  }

  /**
   * GET /api/hallmarks/moderation/audit
   * Retrieves recent 50-PIN moderation actions
   */
  async getModerationAudit(req, res) {
    try {
      const pool = getPool();
      const actions = await pool.query(`
        SELECT a.*, h.name as hallmark_name, u.username as moderator_username
        FROM moderation_pin_actions a
        JOIN hallmarks h ON a.hallmark_id = h.id
        JOIN users u ON a.moderator_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 50
      `);
      res.status(200).json({ success: true, data: actions.rows });
    } catch (error) {
      logErr('Error in HallmarksController.getModerationAudit:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch moderation audit log' });
    }
  }

  /**
   * GET /api/hallmarks/user/:userId
   */
  async getUserHallmarks(req, res) {
    try {
      const targetUserId = req.params.userId || req.user?.id || 1;
      const result = await getPool().query(
        `SELECT uh.*, h.name, h.description, h.tier, h.category, h.icon_url, h.status 
         FROM user_hallmarks uh 
         JOIN hallmarks h ON uh.hallmark_id = h.id 
         WHERE uh.user_id = $1 
         ORDER BY uh.awarded_at DESC`,
        [targetUserId]
      );
      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      logErr('Error in HallmarksController.getUserHallmarks:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve user hallmarks' });
    }
  }

  async getUserAchievements(req, res) {
    if (!req.user) {
      return res.status(403).json({ success: false, message: 'Forbidden: Authentication required' });
    }
    return this.getUserHallmarks(req, res);
  }

  /**
   * POST /api/hallmarks/award
   */
  async awardHallmark(req, res) {
    try {
      const userId = req.body.userId || req.user?.id || 1;
      const { hallmarkId, role = 'member' } = req.body;
      if (!hallmarkId) {
        return res.status(400).json({ success: false, message: 'Hallmark ID is required' });
      }

      const result = await getPool().query(
        `INSERT INTO user_hallmarks (user_id, hallmark_id, role, awarded_at)
         VALUES ($1, $2, $3, NOW())
         ON CONFLICT (user_id, hallmark_id) DO UPDATE SET awarded_at = NOW()
         RETURNING *`,
        [userId, hallmarkId, role]
      );

      res.status(200).json({
        success: true,
        message: 'Hallmark awarded successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logErr('Error in HallmarksController.awardHallmark:', error);
      res.status(500).json({ success: false, message: 'Failed to award hallmark' });
    }
  }
}

module.exports = new HallmarksController();
