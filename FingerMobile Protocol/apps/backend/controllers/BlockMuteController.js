/**
 * BlockMuteController.js - Complete Implementation
 * User blocking and muting functionality with database persistence
 */

const { identityDb, socialDb } = require('../db');
const logger = require('../utils/logger');

class BlockMuteController {
  /**
   * POST /api/block-mute/block
   * Block a user (prevents them from interacting with you)
   */
  async blockUser(req, res) {
    try {
      const blockerId = req.member.id;
      const { blockedUserId } = req.body;

      if (!blockedUserId) {
        return res.status(400).json({
          success: false, message: 'blockedUserId is required'
        });
      }

      // Prevent self-blocking
      if (blockerId === blockedUserId) {
        return res.status(400).json({
          success: false, message: 'Cannot block yourself'
        });
      }

      // Check if already blocked
      const existingBlock = await identityDb.query(
        'SELECT id FROM user_blocks WHERE blocker_id = $1 AND blocked_id = $2',
        [blockerId, blockedUserId]
      );

      if (existingBlock.rows.length > 0) {
        return res.status(409).json({
          success: false, message: 'User is already blocked'
        });
      }

      // Create block record
      const result = await identityDb.query(
        `INSERT INTO user_blocks (blocker_id, blocked_id, created_at)
         VALUES ($1, $2, NOW())
         RETURNING id, blocker_id, blocked_id, created_at` [blockerId, blockedUserId]
      );

      // Log the action
      await socialDb.query(
        `INSERT INTO activities (actor_id, activity_type, description, target_id, content_type, created_at)
         VALUES ($1, 'user_blocked', 'Blocked a user', $2, 'user', NOW())`,
        [blockerId, blockedUserId]
      );

      res.status(201).json({
        success: true, message: 'User blocked successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in blockUser:', error);
      res.status(500).json({
        success: false, message: 'Failed to block user',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/block-mute/block/:id
   * Unblock a user
   */
  async unblockUser(req, res) {
    try {
      const blockerId = req.member.id;
      const { id } = req.params;

      // Delete block record
      const result = await identityDb.query(
        `DELETE FROM user_blocks
         WHERE id = $1 AND blocker_id = $2
         RETURNING *`,
        [id, blockerId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Block record not found or unauthorized'
        });
      }

      res.json({
        success: true, message: 'User unblocked successfully'
      });
    } catch (error) {
      logger.error('Error in unblockUser:', error);
      res.status(500).json({
        success: false, message: 'Failed to unblock user',
        error: error.message
      });
    }
  }

  /**
   * GET /api/block-mute/blocked
   * Get list of blocked users
   */
  async getBlockedUsers(req, res) {
    try {
      const blockerId = req.member.id;
      const { page = 1, limit = 20 } = req.query;
      const offset = (page - 1) * limit;

      const result = await identityDb.query(
        `SELECT ub.id, ub.blocked_id, ub.created_at,
                m.membername, m.profile_picture_url, m.username
         FROM user_blocks ub
         JOIN members m ON ub.blocked_id = m.id
         WHERE ub.blocker_id = $1
         ORDER BY ub.created_at DESC
         LIMIT $2 OFFSET $3` [blockerId, parseInt(limit), offset]
      );

      // Get total count
      const countResult = await identityDb.query(
        'SELECT COUNT(*) as total FROM user_blocks WHERE blocker_id = $1',
        [blockerId]
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          totalPages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
        }
      });
    } catch (error) {
      logger.error('Error in getBlockedUsers:', error);
      res.status(500).json({
        success: false, message: 'Failed to fetch blocked users', error: error.message
      });
    }
  }

  /**
   * POST /api/block-mute/mute
   * Mute a user (hide their notifications or UGC)
   */
  async muteUser(req, res) {
    try {
      const muterId = req.member.id;
      const { mutedUserId, muteType = 'all' } = req.body;

      if (!mutedUserId) {
        return res.status(400).json({
          success: false, message: 'mutedUserId is required'
        });
      }

      // Validate mute type
      const validMuteTypes = ['notifications', 'ugc', 'all'];
      if (!validMuteTypes.includes(muteType)) {
        return res.status(400).json({
          success: false, message: 'Invalid mute type. Must be: notifications, ugc, or all'
        });
      }

      // Prevent self-muting
      if (muterId === mutedUserId) {
        return res.status(400).json({
          success: false, message: 'Cannot mute yourself'
        });
      }

      // Check if already muted
      const existingMute = await identityDb.query(
        'SELECT id FROM user_mutes WHERE muter_id = $1 AND muted_id = $2 AND mute_type = $3',
        [muterId, mutedUserId, muteType]
      );

      if (existingMute.rows.length > 0) {
        return res.status(409).json({
          success: false, message: 'User is already muted for this type'
        });
      }

      // Create mute record
      const result = await identityDb.query(
        `INSERT INTO user_mutes (muter_id, muted_id, mute_type, created_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING id, muter_id, muted_id, mute_type, created_at`,
        [muterId, mutedUserId, muteType]
      );

      res.status(201).json({
        success: true, message: 'User muted successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in muteUser:', error);
      res.status(500).json({
        success: false, message: 'Failed to mute user',
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/block-mute/mute/:id
   * Unmute a user
   */
  async unmuteUser(req, res) {
    try {
      const muterId = req.member.id;
      const { id } = req.params;

      // Delete mute record
      const result = await identityDb.query(
        `DELETE FROM user_mutes
         WHERE id = $1 AND muter_id = $2
         RETURNING *`,
        [id, muterId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Mute record not found or unauthorized'
        });
      }

      res.json({
        success: true, message: 'User unmuted successfully'
      });
    } catch (error) {
      logger.error('Error in unmuteUser:', error);
      res.status(500).json({
        success: false, message: 'Failed to unmute user', error: error.message
      });
    }
  }

  /**
   * GET /api/block-mute/muted
   * Get list of muted users
   */
  async getMutedUsers(req, res) {
    try {
      const muterId = req.member.id;
      const { page = 1, limit = 20, muteType } = req.query;
      const offset = (page - 1) * limit;

      let query = `SELECT um.id, um.muted_id, um.mute_type, um.created_at m.membername, m.profile_picture_url, m.username
                   FROM user_mutes um
                   JOIN members m ON um.muted_id = m.id
                   WHERE um.muter_id = $1`;

      const params = [muterId];
      let paramCount = 1;

      if (muteType && muteType !== 'all') {
        paramCount++;
        query += ` AND um.mute_type = $${paramCount}`;
        params.push(muteType);
      }

      query += ` ORDER BY um.created_at DESC
                 LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      params.push(parseInt(limit), offset);

      const result = await identityDb.query(query, params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM user_mutes WHERE muter_id = $1';
      const countParams = [muterId];

      if (muteType && muteType !== 'all') {
        countQuery += ' AND mute_type = $2';
        countParams.push(muteType);
      }

      const countResult = await identityDb.query(countQuery, countParams);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          totalPages: Math.ceil(parseInt(countResult.rows[0].total) / parseInt(limit))
        }
      });
    } catch (error) {
      logger.error('Error in getMutedUsers:', error);
      res.status(500).json({
        success: false, message: 'Failed to fetch muted users', error: error.message
      });
    }
  }

  /**
   * POST /api/block-mute/mute-notifications
   * Mute notifications from a specific user
   */
  async muteNotifications(req, res) {
    try {
      const muterId = req.member.id;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false, message: 'userId is required'
        });
      }

      // Create notification mute
      const result = await identityDb.query(
        `INSERT INTO user_mutes (muter_id, muted_id, mute_type, created_at)
         VALUES ($1, $2, 'notifications', NOW())
         ON CONFLICT (muter_id, muted_id, mute_type) DO NOTHING
         RETURNING id, muter_id, muted_id, mute_type, created_at`,
        [muterId, userId]
      );

      res.status(201).json({
        success: true, message: 'Notifications muted successfully', data: result.rows[0] || { message: 'Already muted' }
      });
    } catch (error) {
      logger.error('Error in muteNotifications:', error);
      res.status(500).json({
        success: false, message: 'Failed to mute notifications', error: error.message
      });
    }
  }

  /**
   * POST /api/block-mute/mute-ugc
   * Mute UGC (User Generated Content) from a specific user
   */
  async muteUgc(req, res) {
    try {
      const muterId = req.member.id;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false, message: 'userId is required'
        });
      }

      // Create UGC mute
      const result = await identityDb.query(
        `INSERT INTO user_mutes (muter_id, muted_id, mute_type, created_at)
         VALUES ($1, $2, 'ugc', NOW())
         ON CONFLICT (muter_id, muted_id, mute_type) DO NOTHING
         RETURNING id, muter_id, muted_id, mute_type, created_at`,
        [muterId, userId]
      );

      res.status(201).json({
        success: true, message: 'UGC muted successfully', data: result.rows[0] || { message: 'Already muted' }
      });
    } catch (error) {
      logger.error('Error in muteUgc:', error);
      res.status(500).json({
        success: false, message: 'Failed to mute UGC', error: error.message
      });
    }
  }

  /**
   * GET /api/block-mute/blocked-muted
   * Get combined list of blocked and muted users
   */
  async getBlockedMutedUsers(req, res) {
    try {
      const userId = req.member.id;

      // Get blocked users
      const blockedResult = await identityDb.query(
        `SELECT 'blocked' as type, ub.blocked_id as user_id, ub.created_at,
                m.membername, m.profile_picture_url, m.username
         FROM user_blocks ub
         JOIN members m ON ub.blocked_id = m.id
         WHERE ub.blocker_id = $1` [userId]
      );

      // Get muted users
      const mutedResult = await identityDb.query(
        `SELECT 'muted' as type, um.muted_id as user_id, um.mute_type, um.created_at,
                m.membername, m.profile_picture_url, m.username
         FROM user_mutes um
         JOIN members m ON um.muted_id = m.id
         WHERE um.muter_id = $1`,
        [userId]
      );

      // Combine results
      const combined = [...blockedResult.rows, ...mutedResult.rows]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      res.json({
        success: true,
        data: combined,
        counts: {
          blocked: blockedResult.rows.length,
          muted: mutedResult.rows.length,
          total: combined.length
        }
      });
    } catch (error) {
      logger.error('Error in getBlockedMutedUsers:', error);
      res.status(500).json({
        success: false, message: 'Failed to fetch blocked/muted users', error: error.message
      });
    }
  }

  /**
   * GET /api/block-mute/status/:userId
   * Check if a user is blocked or muted
   */
  async checkBlockStatus(req, res) {
    try {
      const currentUserId = req.member.id;
      const { userId } = req.params;

      // Check if blocked
      const blockCheck = await identityDb.query(
        'SELECT id FROM user_blocks WHERE blocker_id = $1 AND blocked_id = $2',
        [currentUserId, userId]
      );

      // Check if muted (any type)
      const muteCheck = await identityDb.query(
        'SELECT id, mute_type FROM user_mutes WHERE muter_id = $1 AND muted_id = $2',
        [currentUserId, userId]
      );

      res.json({
        success: true,
        data: {
          isBlocked: blockCheck.rows.length > 0,
          isMuted: muteCheck.rows.length > 0,
          muteTypes: muteCheck.rows.map(row => row.mute_type)
        }
      });
    } catch (error) {
      logger.error('Error in checkBlockStatus:', error);
      res.status(500).json({
        success: false, message: 'Failed to check block status',
        error: error.message
      });
    }
  }
}

module.exports = new BlockMuteController();
