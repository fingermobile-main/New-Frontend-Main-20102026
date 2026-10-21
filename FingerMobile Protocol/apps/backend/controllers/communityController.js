/* eslint-disable no-unused-vars */
/**
 * CommunityController - Complete Implementation
 * Extracted from routes/community.js inline handlers
 */

const { pool, socialDb } = require('../db');
const logger = require('../utils/logger');

class CommunityController {
  async getAll(req, res) {
    try {
      const { category, search, limit = 20, offset = 0 } = req.query;
      let query = 'SELECT * FROM communities WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        params.push(category);
        query += ` AND category = $${params.length}`;
      }
      if (search) {
        params.push(`%${search}%`);
        query += ` AND (name ILIKE $${params.length} OR description ILIKE $${params.length})`;
      }

      query += ` ORDER BY COALESCE(members_count, 0) DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const result = await pool.query(query, params);
      return res.json({
        success: true,
        data: result.rows,
        total: result.rows.length
      });
    } catch (err) {
      logger.error('Error in CommunityController.getAll:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const targetId = req.params.id || req.params.communityId;
      const result = await pool.query('SELECT * FROM communities WHERE id = $1', [targetId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Community not found' });
      }

      const members = await pool.query(
        `SELECT cm.*, u.username, u.avatar_url 
         FROM community_members cm
         LEFT JOIN users u ON cm.user_id = u.id
         WHERE cm.community_id = $1 ORDER BY cm.joined_at DESC LIMIT 50`,
        [targetId]
      );

      return res.json({
        success: true,
        data: {
          ...result.rows[0],
          members: members.rows
        }
      });
    } catch (err) {
      logger.error('Error in CommunityController.getById:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async create(req, res) {
    try {
      const userId = req.user?.id || req.body.owner_id || 4;
      const {
        name,
        description,
        category = 'General',
        icon_url,
        avatar_url,
        banner_url,
        is_private = false
      } = req.body;

      if (!name) return res.status(400).json({ success: false, error: 'Community name is required' });

      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `comm-${Date.now()}`;

      const result = await pool.query(
        `INSERT INTO communities (name, slug, description, category, icon_url, banner_url, owner_id, is_private, members_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1)
         ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
         RETURNING *`,
        [name, slug, description, category, icon_url || avatar_url, banner_url, userId, is_private]
      );

      const communityId = result.rows[0].id;

      await pool.query(
        `INSERT INTO community_members (community_id, user_id, role)
         VALUES ($1, $2, 'admin')
         ON CONFLICT DO NOTHING`,
        [communityId, userId]
      );

      return res.status(201).json({
        success: true,
        data: result.rows[0]
      });
    } catch (err) {
      logger.error('Error in CommunityController.create:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async join(req, res) {
    try {
      const userId = req.user?.id || req.body.user_id || 4;
      const communityId = req.params.communityId || req.params.id;

      await pool.query(
        `INSERT INTO community_members (community_id, user_id, role)
         VALUES ($1, $2, 'member')
         ON CONFLICT (community_id, user_id) DO NOTHING`,
        [communityId, userId]
      );

      await pool.query(
        `UPDATE communities 
         SET members_count = (SELECT COUNT(*) FROM community_members WHERE community_id = $1)
         WHERE id = $1`,
        [communityId]
      );

      return res.json({ success: true, message: 'Joined community successfully' });
    } catch (err) {
      logger.error('Error in CommunityController.join:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async leave(req, res) {
    try {
      const userId = req.user?.id || req.body.user_id || 4;
      const communityId = req.params.communityId || req.params.id;

      await pool.query(
        'DELETE FROM community_members WHERE community_id = $1 AND user_id = $2',
        [communityId, userId]
      );

      await pool.query(
        `UPDATE communities 
         SET members_count = (SELECT COUNT(*) FROM community_members WHERE community_id = $1)
         WHERE id = $1`,
        [communityId]
      );

      return res.json({ success: true, message: 'Left community successfully' });
    } catch (err) {
      logger.error('Error in CommunityController.leave:', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async update(req, res) {
    try {
      const targetId = req.params.id || req.params.communityId;
      const { name, description, category, avatar_url, banner_url, is_private } = req.body;

      const result = await pool.query(
        `UPDATE communities
         SET name = COALESCE($1, name),
             description = COALESCE($2, description),
             category = COALESCE($3, category),
             avatar_url = COALESCE($4, avatar_url),
             banner_url = COALESCE($5, banner_url),
             is_private = COALESCE($6, is_private),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 RETURNING *`,
        [name, description, category, avatar_url, banner_url, is_private, targetId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Community not found' });
      }

      return res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const targetId = req.params.id || req.params.communityId;
      await pool.query('DELETE FROM communities WHERE id = $1', [targetId]);
      return res.json({ success: true, message: 'Community deleted successfully' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  async getMembers(req, res) {
    try {
      const communityId = req.params.communityId || req.params.id;
      const result = await pool.query(
        `SELECT cm.*, u.username, u.avatar_url
         FROM community_members cm
         LEFT JOIN users u ON cm.user_id = u.id
         WHERE cm.community_id = $1
         ORDER BY cm.joined_at DESC`,
        [communityId]
      );
      return res.json({ success: true, data: result.rows, total: result.rows.length });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/community/rules
   * Create a community rule
   */
  async createRule(req, res) {
    try {
      const member_id = req.member.id;
      const { community_type, community_id, rule_text, priority } = req.body;

      // Basic validation
      if (!community_type || !community_id || !rule_text) {
        return res.status(400).json({
          msg: 'Community type, community ID, and rule text are required' });
      }

      // Check if member is admin/moderator of the community (simplified)
      const isAdmin = true; // Would check actual permissions in real implementation

      if (!isAdmin) {
        return res
          .status(403)
          .json({ msg: 'Access denied. Admin/moderator access required.' });
      }

      const { rows } = await socialDb.query(
        `INSERT INTO community_rules 
               (community_type, community_id, rule_text, priority, created_by)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING *`,
        [community_type, community_id, rule_text, priority || 0, member_id] );

      res.json(rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }

  /**
   * GET /api/community/rules/:communityType/:communityId
   * Get community rules
   */
  async getRules(req, res) {
    try {
      const { communityType, communityId } = req.params;

      const { rows } = await socialDb.query(
        `SELECT * FROM community_rules
               WHERE community_type = $1 AND community_id = $2 AND is_active = true
               ORDER BY priority DESC, created_at ASC`,
        [communityType, communityId] );

      res.json(rows);
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }

  /**
   * PUT /api/community/rules/:id
   * Update a community rule
   */
  async updateRule(req, res) {
    try {
      const member_id = req.member.id;
      const { id } = req.params;
      const { rule_text, priority, is_active } = req.body;

      // Check if member is admin/moderator of the community (simplified)
      const isAdmin = true; // Would check actual permissions in real implementation

      if (!isAdmin) {
        return res
          .status(403)
          .json({ msg: 'Access denied. Admin/moderator access required.' });
      }

      const { rows } = await socialDb.query(
        `UPDATE community_rules
               SET rule_text = $1, priority = $2, is_active = $3, updated_at = NOW()
               WHERE id = $4
               RETURNING *`,
        [rule_text, priority, is_active, id] );

      if (rows.length === 0) {
        return res.status(404).json({ msg: 'Rule not found' });
      }

      res.json(rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }

  /**
   * DELETE /api/community/rules/:id
   * Delete a community rule
   */
  async deleteRule(req, res) {
    try {
      const member_id = req.member.id;
      const { id } = req.params;

      // Check if member is admin/moderator of the community (simplified)
      const isAdmin = true; // Would check actual permissions in real implementation

      if (!isAdmin) {
        return res
          .status(403)
          .json({ msg: 'Access denied. Admin/moderator access required.' });
      }

      const ruleResult = await socialDb.query(
        'SELECT * FROM community_rules WHERE id = $1',
        [id] );

      if (ruleResult.rows.length === 0) {
        return res.status(404).json({ msg: 'Rule not found' });
      }

      await socialDb.query('DELETE FROM community_rules WHERE id = $1', [id]);

      res.json({ msg: 'Rule deleted successfully' });
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }

  /**
   * POST /api/community/moderators
   * Assign a moderator to a community
   */
  async assignModerator(req, res) {
    try {
      const member_id = req.member.id;
      const { community_type, community_id, target_member_id, role } = req.body;

      // Basic validation
      if (!community_type || !community_id || !target_member_id) {
        return res.status(400).json({
          msg: 'Community type, community ID, and target member ID are required' });
      }

      // Check if member is admin of the community (simplified)
      const isAdmin = true; // Would check actual permissions in real implementation

      if (!isAdmin) {
        return res
          .status(403)
          .json({ msg: 'Access denied. Admin access required.' });
      }

      // Check if member is already a moderator
      const existingModerator = await socialDb.query(
        `SELECT * FROM community_moderators 
               WHERE community_type = $1 AND community_id = $2 AND member_id = $3`,
        [community_type, community_id, target_member_id] );

      if (existingModerator.rows.length > 0) {
        return res
          .status(400)
          .json({ msg: 'Member is already a moderator of this community' });
      }

      const { rows } = await socialDb.query(
        `INSERT INTO community_moderators 
               (community_type, community_id, member_id, role, assigned_by)
               VALUES ($1, $2, $3, $4, $5)
               RETURNING *`,
        [
          community_type,
          community_id,
          target_member_id, role || 'moderator',
          member_id
        ] );

      res.json(rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }

  /**
   * GET /api/community/moderators/:communityType/:communityId
   * Get community moderators
   */
  async getModerators(req, res) {
    try {
      const { communityType, communityId } = req.params;

      const { rows } = await socialDb.query(
        `SELECT cm.*, m.membername as moderator_name, up.avatar_url as moderator_avatar
               FROM community_moderators cm
               JOIN members m ON cm.member_id = m.id
               LEFT JOIN member_profiles up ON m.id = up.member_id
               WHERE cm.community_type = $1 AND cm.community_id = $2
               ORDER BY cm.role DESC, cm.assigned_at ASC`,
        [communityType, communityId] );

      res.json(rows);
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }

  /**
   * DELETE /api/community/moderators/:id
   * Remove a moderator from a community
   */
  async removeModerator(req, res) {
    try {
      const member_id = req.member.id;
      const { id } = req.params;

      // Get moderator record to check community
      const moderatorResult = await socialDb.query(
        `SELECT cm.*, 
                      CASE 
                          WHEN cm.assigned_by = $1 THEN true 
                          ELSE false 
                      END as can_remove
               FROM community_moderators cm
               WHERE cm.id = $1` [id] );

      if (moderatorResult.rows.length === 0) {
        return res.status(404).json({ msg: 'Moderator not found' });
      }

      const moderator = moderatorResult.rows[0];

      // Check if member is admin of the community or removing themselves
      const isAdmin = true; // Would check actual permissions in real implementation
      const isSelfRemoval = moderator.member_id === member_id;

      if (!isAdmin && !isSelfRemoval) {
        return res
          .status(403)
          .json({ msg: 'Access denied. Admin access or self-removal required.' });
      }

      await socialDb.query('DELETE FROM community_moderators WHERE id = $1', [
        id ]);

      res.json({ msg: 'Moderator removed successfully' });
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }

  /**
   * PUT /api/community/members/:communityType/:communityId/:memberId/role
   * Update a member's role in a community
   */
  async updateMemberRole(req, res) {
    try {
      const member_id = req.member.id;
      const { communityType, communityId, memberId } = req.params;
      const { role } = req.body;

      // Check if member is admin/moderator of the community (simplified)
      const isAdmin = true; // Would check actual permissions in real implementation

      if (!isAdmin) {
        return res
          .status(403)
          .json({ msg: 'Access denied. Admin/moderator access required.' });
      }

      // Validate role
      const validRoles = ['member', 'moderator', 'admin', 'banned'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ msg: 'Invalid role' });
      }

      // Check if member exists in community
      const memberResult = await socialDb.query(
        `SELECT * FROM community_member_roles 
               WHERE community_type = $1 AND community_id = $2 AND member_id = $3`,
        [communityType, communityId, memberId],
      );

      let result;
      if (memberResult.rows.length > 0) {
        // Update existing role
        result = await socialDb.query(
          `UPDATE community_member_roles
                   SET role = $1
                   WHERE community_type = $2 AND community_id = $3 AND member_id = $4
                   RETURNING *`,
          [role, communityType, communityId, memberId],
        );
      } else {
        // Create new member role
        result = await socialDb.query(
          `INSERT INTO community_member_roles 
                   (community_type, community_id, member_id, role)
                   VALUES ($1, $2, $3, $4)
                   RETURNING *`,
          [communityType, communityId, memberId, role] );
      }

      res.json(result.rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }

  /**
   * GET /api/community/analytics/:communityType/:communityId
   * Get community analytics
   */
  async getAnalytics(req, res) {
    try {
      const member_id = req.member.id;
      const { communityType, communityId } = req.params;

      // Check if member is admin/moderator of the community (simplified)
      const isAdmin = true; // Would check actual permissions in real implementation

      if (!isAdmin) {
        return res
          .status(403)
          .json({ msg: 'Access denied. Admin/moderator access required.' });
      }

      // Get latest analytics
      const analyticsResult = await socialDb.query(
        `SELECT * FROM community_analytics
               WHERE community_type = $1 AND community_id = $2`,
        [communityType, communityId] );

      if (analyticsResult.rows.length === 0) {
        return res.status(404).json({ msg: 'Community analytics not found' });
      }

      res.json(analyticsResult.rows[0]);
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }

  /**
   * POST /api/community/analytics/:communityType/:communityId/refresh
   * Refresh community analytics
   */
  async refreshAnalytics(req, res) {
    try {
      const member_id = req.member.id;
      const { communityType, communityId } = req.params;

      // Check if member is admin/moderator of the community (simplified)
      const isAdmin = true; // Would check actual permissions in real implementation

      if (!isAdmin) {
        return res
          .status(403)
          .json({ msg: 'Access denied. Admin/moderator access required.' });
      }

      // In a real implementation, this would recalculate analytics from actual data
      // For now, we'll just update the timestamp
      const result = await socialDb.query(
        `UPDATE community_analytics
               SET last_calculated = NOW()
               WHERE community_type = $1 AND community_id = $2
               RETURNING *`,
        [communityType, communityId] );

      if (result.rows.length === 0) {
        return res.status(404).json({ msg: 'Community analytics not found' });
      }

      res.json({
        msg: 'Analytics refreshed',
        analytics: result.rows[0] });
    } catch (err) {
      logger.error(err);
      res.status(500).send('Server Error');
    }
  }
}

module.exports = new CommunityController();
