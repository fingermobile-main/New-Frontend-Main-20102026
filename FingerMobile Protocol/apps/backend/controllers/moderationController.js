/**
 * Moderation Controller
 * Complete implementation for content moderation and review system
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class ModerationController {
  /**
   * GET /api/moderation/queue
   * Get moderation queue (pending items)
   */
  async getQueue(req, res) {
    try {
      // Check moderator permission
      if (!req.user?.isModerator && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Moderator access required'
        });
      }

      const {
        limit = 50,
        offset = 0, contentType = 'all', priority = 'all', reportedBy
      } = req.query;

      let whereClause = ['m.status = \'pending\''];
      let queryParams = [];
      let paramCount = 1;

      if (contentType !== 'all') {
        whereClause.push(`m.content_type = $${paramCount}`);
        queryParams.push(contentType);
        paramCount++;
      }

      if (priority !== 'all') {
        whereClause.push(`m.priority = $${paramCount}`);
        queryParams.push(priority);
        paramCount++;
      }

      if (reportedBy) {
        whereClause.push(`m.reported_by = $${paramCount}`);
        queryParams.push(reportedBy);
        paramCount++;
      }

      const whereSQL = whereClause.join(' AND ');

      const result = await pool.query(`SELECT 
          m.id,
          m.content_type,
          m.content_id,
          m.reason,
          m.priority,
          m.status,
          m.reported_by,
          rb.username as reporter_username,
          m.created_at, CASE m.content_type
            WHEN 'post' THEN p.title
            WHEN 'comment' THEN c.content
            WHEN 'user' THEN u.username
            ELSE NULL
          END as content_preview
         FROM moderation_queue m
         LEFT JOIN users rb ON m.reported_by::text = rb.id::text
         LEFT JOIN posts p ON m.content_type = 'post' AND m.content_id::text = p.id::text
         LEFT JOIN comments c ON m.content_type = 'comment' AND m.content_id::text = c.id::text
         LEFT JOIN users u ON m.content_type = 'user' AND m.content_id::text = u.id::text
         WHERE ${whereSQL}
         ORDER BY 
           CASE m.priority
             WHEN 'high' THEN 1
             WHEN 'medium' THEN 2
             WHEN 'low' THEN 3
           END ASC, m.created_at ASC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`, [...queryParams, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows.map(item => ({
          ...item,
          contentPreview: item.content_preview?.substring(0, 200) || null
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in ModerationController.getQueue:', error);
      res.status(500).json({
        success: false, message: 'Failed to get moderation queue', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/moderation/report
   * Report content for moderation
   */
  async reportContent(req, res) {
    try {
      const userId = req.user?.id;
      const { contentType, contentId, reason, description } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!contentType || !contentId || !reason) {
        return res.status(400).json({
          success: false, message: 'Content type, content ID, and reason are required'
        });
      }

      // Check if already reported by this user
      const existingReport = await pool.query(
        `SELECT id FROM moderation_queue 
         WHERE content_type = $1 AND content_id = $2 AND reported_by = $3 AND status = 'pending'`,
        [contentType, contentId, userId]
      );

      if (existingReport.rows.length > 0) {
        return res.status(400).json({
          success: false, message: 'You have already reported this content'
        });
      }

      // Determine priority based on reason
      let priority = 'medium';
      if (['illegal', 'violence', 'terrorism'].includes(reason)) {
        priority = 'high';
      } else if (['spam', 'off-topic'].includes(reason)) {
        priority = 'low';
      }

      await pool.query(
        `INSERT INTO moderation_queue 
         (content_type, content_id, reason, description, priority, reported_by, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())`,
        [contentType, contentId, reason, description || null, priority, userId]
      );

      res.status(201).json({
        success: true, message: 'Content reported successfully. Our moderation team will review it.'
      });
    } catch (error) {
      logger.error('Error in ModerationController.reportContent:', error);
      res.status(500).json({
        success: false, message: 'Failed to report content', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/moderation/:id/approve
   * Approve reported content (moderator only)
   */
  async approveContent(req, res) {
    try {
      // Check moderator permission
      if (!req.user?.isModerator && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Moderator access required'
        });
      }

      const { id } = req.params;
      const moderatorId = req.user.id;
      const { notes } = req.body;

      await pool.query(
        `UPDATE moderation_queue 
         SET status = 'approved', reviewed_by = $1, reviewed_at = NOW(), notes = $2
         WHERE id = $3 AND status = 'pending'
         RETURNING id`,
        [moderatorId, notes || null, id]
      );

      res.json({
        success: true, message: 'Content approved'
      });
    } catch (error) {
      logger.error('Error in ModerationController.approveContent:', error);
      res.status(500).json({
        success: false, message: 'Failed to approve content', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/moderation/:id/reject
   * Reject/remove reported content (moderator only)
   */
  async rejectContent(req, res) {
    try {
      // Check moderator permission
      if (!req.user?.isModerator && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Moderator access required'
        });
      }

      const { id } = req.params;
      const moderatorId = req.user.id;
      const { notes, action } = req.body;

      if (!action || !['remove_content', 'warn_user', 'suspend_user', 'ban_user'].includes(action)) {
        return res.status(400).json({
          success: false, message: 'Valid action is required'
        });
      }

      // Get moderation item details
      const modItem = await pool.query(
        'SELECT * FROM moderation_queue WHERE id = $1',
        [id]
      );

      if (modItem.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Moderation item not found'
        });
      }

      const item = modItem.rows[0];

      // Update moderation status
      await pool.query(
        `UPDATE moderation_queue 
         SET status = 'rejected', reviewed_by = $1, reviewed_at = NOW(), notes = $2
         WHERE id = $3`, [moderatorId, notes || null, id]
      );

      // Take action based on decision
      if (action === 'remove_content') {
        await this.removeContent(item.content_type, item.content_id);
      } else if (action.includes('user')) {
        await this.takeUserAction(item.content_id, action);
      }

      res.json({
        success: true, message: 'Content rejected and action taken', data: { action }
      });
    } catch (error) {
      logger.error('Error in ModerationController.rejectContent:', error);
      res.status(500).json({
        success: false, message: 'Failed to reject content', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/moderation/history
   * Get moderation history (admin/moderator)
   */
  async getHistory(req, res) {
    try {
      // Check moderator permission
      if (!req.user?.isModerator && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Moderator access required'
        });
      }

      const {
        limit = 50,
        offset = 0, status = 'all',
        moderatorId,
        startDate, endDate
      } = req.query;

      let whereClause = [];
      let queryParams = [];
      let paramCount = 1;

      if (status !== 'all') {
        whereClause.push(`status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      if (moderatorId) {
        whereClause.push(`reviewed_by = $${paramCount}`);
        queryParams.push(moderatorId);
        paramCount++;
      }

      if (startDate) {
        whereClause.push(`reviewed_at >= $${paramCount}`);
        queryParams.push(startDate);
        paramCount++;
      }

      if (endDate) {
        whereClause.push(`reviewed_at <= $${paramCount}`);
        queryParams.push(endDate);
        paramCount++;
      }

      const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

      const result = await pool.query(`SELECT 
          m.*, rv.username as reviewer_username
         FROM moderation_queue m
         LEFT JOIN users rv ON m.reviewed_by = rv.id
         ${whereSQL}
         ORDER BY m.reviewed_at DESC NULLS LAST
         LIMIT $${paramCount} OFFSET $${paramCount + 1}`, [...queryParams, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in ModerationController.getHistory:', error);
      res.status(500).json({
        success: false, message: 'Failed to get moderation history', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/moderation/stats
   * Get moderation statistics (admin/moderator)
   */
  async getStats(req, res) {
    try {
      // Check moderator permission
      if (!req.user?.isModerator && !req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Moderator access required'
        });
      }

      const stats = await pool.query(
        `SELECT 
          COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
          COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
          COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count,
          COUNT(*) FILTER (WHERE priority = 'high' AND status = 'pending') as high_priority_pendinging,
          AVG(EXTRACT(EPOCH FROM (reviewed_at - created_at))) FILTER (WHERE reviewed_at IS NOT NULL) as avg_review_time_seconds
         FROM moderation_queue`
      );

      res.json({
        success: true,
        data: {
          pending: parseInt(stats.rows[0].pending_count) || 0,
          approved: parseInt(stats.rows[0].approved_count) || 0,
          rejected: parseInt(stats.rows[0].rejected_count) || 0,
          highPriorityPending: parseInt(stats.rows[0].high_priority_pendinging) || 0, avgReviewTimeSeconds: parseFloat(stats.rows[0].avg_review_time_seconds) || 0
        }
      });
    } catch (error) {
      logger.error('Error in ModerationController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to get moderation statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Helper: Remove content
   */
  async removeContent(contentType, contentId) {
    try {
      switch (contentType) {
      case 'post':
        {
          // Try community_posts first, then other prefixed tables
          const postResult = await pool.query('UPDATE community_posts SET is_published = false WHERE id = $1', [contentId]);
          if (postResult.rowCount === 0) {
            await pool.query('UPDATE lumina_posts SET is_published = false WHERE id = $1', [contentId]);
          }
        }
        break;
      case 'comment':
        {
          const commentResult = await pool.query('DELETE FROM community_comments WHERE id = $1', [contentId]);
          if (commentResult.rowCount === 0) {
            await pool.query('DELETE FROM lumina_comments WHERE id = $1', [contentId]);
          }
        }
        break;
      case 'media':
        {
          const mediaResult = await pool.query('UPDATE lumina_media SET is_active = false WHERE id = $1', [contentId]);
          if (mediaResult.rowCount === 0) {
            await pool.query('UPDATE ugc_media SET is_active = false WHERE id = $1', [contentId]);
          }
        }
        break;
      default:
        logger.warn(`Unknown content type: ${contentType}`);
      }
    } catch (error) {
      logger.error(`Error removing ${contentType} ${contentId}:`, error.message);
    }
  }

  /**
   * Helper: Take action on user
   */
  async takeUserAction(userId, action) {
    try {
      const updates = {};

      if (action === 'warn_user') {
        updates.warning_count = 1;
      } else if (action === 'suspend_user') {
        updates.is_suspended = true;
        updates.suspension_end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      } else if (action === 'ban_user') {
        updates.is_banned = true;
        updates.banned_at = new Date();
      }

      if (Object.keys(updates).length > 0) {
        const setClauses = Object.keys(updates).map((key, idx) => `${key} = $${idx + 1}`).join(', ');
        const values = Object.values(updates);
        values.push(userId);

        await pool.query(
          `UPDATE users SET ${setClauses} WHERE id = $${values.length}`, values
        );
      }
    } catch (error) {
      logger.error('takeUserAction error:', error);
      throw error;
    }
  }
  async getReports(req, res) {
    try {
      const { status = 'all', limit = 50, offset = 0 } = req.query;
      let query = 'SELECT * FROM user_reports';
      const params = [];
      if (status !== 'all') {
        query += ' WHERE status = $1';
        params.push(status);
      }
      query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));
      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (err) {
      logger.error('Error in getReports:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch reports' });
    }
  }

  async createReport(req, res) {
    try {
      const { targetType, targetId, reason, description } = req.body;
      const reporterId = req.user?.id || null;
      const result = await pool.query(
        'INSERT INTO user_reports (reporter_id, target_type, target_id, reason, description, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [reporterId, targetType || 'post', targetId || 'target-1', reason || 'inappropriate', description || '', 'open']
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      logger.error('Error in createReport:', err);
      res.status(500).json({ success: false, message: 'Failed to create report' });
    }
  }

  async updateReport(req, res) {
    try {
      const { reportId } = req.params;
      const { status, resolutionNotes, resolutionAction } = req.body;
      const resolvedBy = req.user?.id || null;
      const result = await pool.query(
        'UPDATE user_reports SET status = COALESCE($1, status), resolution_notes = COALESCE($2, resolution_notes), resolution_action = COALESCE($3, resolution_action), resolved_by = $4, resolved_at = NOW(), updated_at = NOW() WHERE id = $5 RETURNING *',
        [status, resolutionNotes, resolutionAction, resolvedBy, reportId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (err) {
      logger.error('Error in updateReport:', err);
      res.status(500).json({ success: false, message: 'Failed to update report' });
    }
  }

  async getCategoryItems(req, res) {
    try {
      const { category } = req.params;
      const { status = 'pending', limit = 50, offset = 0 } = req.query;
      const result = await pool.query(
        'SELECT * FROM moderation_queue WHERE content_type = $1 AND ($2 = \'all\' OR status = $2) ORDER BY created_at DESC LIMIT $3 OFFSET $4',
        [category, status, parseInt(limit, 10), parseInt(offset, 10)]
      );
      res.json({ success: true, data: result.rows });
    } catch (err) {
      logger.error(`Error in getCategoryItems (${req.params.category}):`, err);
      res.status(500).json({ success: false, message: 'Failed to fetch items' });
    }
  }

  async approveCategoryItem(req, res) {
    try {
      const { id } = req.params;
      const notes = req.body?.notes || 'Approved by administrator';
      const reviewer = req.user?.id || null;
      const result = await pool.query(
        'UPDATE moderation_queue SET status = \'approved\', reviewed_by = $1, reviewed_at = NOW(), notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [reviewer, notes, id]
      );
      res.json({ success: true, message: 'Item approved successfully', data: result.rows[0] });
    } catch (err) {
      logger.error('Error approving item:', err);
      res.status(500).json({ success: false, message: 'Failed to approve item' });
    }
  }

  async rejectCategoryItem(req, res) {
    try {
      const { id } = req.params;
      const notes = req.body?.notes || 'Rejected by administrator';
      const reviewer = req.user?.id || null;
      const result = await pool.query(
        'UPDATE moderation_queue SET status = \'rejected\', reviewed_by = $1, reviewed_at = NOW(), notes = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
        [reviewer, notes, id]
      );
      res.json({ success: true, message: 'Item rejected successfully', data: result.rows[0] });
    } catch (err) {
      logger.error('Error rejecting item:', err);
      res.status(500).json({ success: false, message: 'Failed to reject item' });
    }
  }

  async getAll(req, res) {
    return this.getReports(req, res);
  }
  async getById(req, res) {
    const { reportId } = req.params;
    const result = await pool.query('SELECT * FROM user_reports WHERE id = $1', [reportId]);
    res.json({ success: true, data: result.rows[0] || null });
  }
  async create(req, res) {
    return this.createReport(req, res);
  }
  async update(req, res) {
    return this.updateReport(req, res);
  }
}

module.exports = new ModerationController();
