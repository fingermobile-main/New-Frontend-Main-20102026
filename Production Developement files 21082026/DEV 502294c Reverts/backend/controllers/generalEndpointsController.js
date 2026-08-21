/**
 * General Endpoints Controller
 * Complete implementation for additional general endpoints
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class GeneralEndpointsController {
  /**
   * GET /api/general-endpoints/notifications
   * Get user notifications
   */
  async getNotifications(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { limit = 50, offset = 0, isRead } = req.query;

      let whereClause = ['user_id = $1'];
      let queryParams = [userId];
      let paramCount = 2;

      if (isRead !== undefined) {
        whereClause.push(`is_read = $${paramCount}`);
        queryParams.push(isRead === 'true');
        paramCount++;
      }

      const result = await pool.query('SELECT * FROM notifications WHERE $1 ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}', [...queryParams, parseInt(limit), parseInt(offset), whereClause.join(' AND ')]);

      res.json({
        success: true,
        data: result.rows.map(notification => ({
          ...notification, metadata: typeof notification.metadata === 'string' ? JSON.parse(notification.metadata) : notification.metadata
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in GeneralEndpointsController.getNotifications:', error);
      res.status(500).json({
        success: false, message: 'Failed to get notifications', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/general-endpoints/notifications/:id/read
   * Mark notification as read
   */
  async markNotificationRead(req, res) {
    try {
      const userId = req.user?.id;
      const { id: notificationId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      await pool.query(
        `UPDATE notifications 
         SET is_read = true, read_at = NOW()
         WHERE id = $1 AND user_id = $2`,
        [notificationId, userId]
      );

      res.json({
        success: true, message: 'Notification marked as read'
      });
    } catch (error) {
      logger.error('Error in GeneralEndpointsController.markNotificationRead:', error);
      res.status(500).json({
        success: false, message: 'Failed to mark notification as read', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/general-endpoints/notifications/mark-all-read
   * Mark all notifications as read
   */
  async markAllNotificationsRead(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      await pool.query(
        `UPDATE notifications 
         SET is_read = true, read_at = NOW()
         WHERE user_id = $1 AND is_read = false`,
        [userId]
      );

      res.json({
        success: true, message: 'All notifications marked as read'
      });
    } catch (error) {
      logger.error('Error in GeneralEndpointsController.markAllNotificationsRead:', error);
      res.status(500).json({
        success: false, message: 'Failed to mark all notifications as read', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/general-endpoints/activity-feed
   * Get user activity feed
   */
  async getActivityFeed(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { limit = 50, offset = 0 } = req.query;

      const result = await pool.query(
        `SELECT * FROM user_activities
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, parseInt(limit), parseInt(offset)]
      );

      res.json({
        success: true,
        data: result.rows.map(activity => ({
          ...activity, activityData: typeof activity.activity_data === 'string' ? JSON.parse(activity.activity_data) : activity.activity_data
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in GeneralEndpointsController.getActivityFeed:', error);
      res.status(500).json({
        success: false, message: 'Failed to get activity feed', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/general-endpoints/analytics
   * Get user analytics
   */
  async getAnalytics(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const analytics = await pool.query(
        `SELECT 
          COUNT(DISTINCT p.id) as posts_created,
          COUNT(DISTINCT c.id) as comments_made,
          COUNT(DISTINCT l.id) as likes_given,
          COUNT(DISTINCT f.follower_id) as followers_count,
          COUNT(DISTINCT ff.following_id) as following_count
         FROM users u
         LEFT JOIN posts p ON u.id = p.author_id
         LEFT JOIN comments c ON u.id = c.user_id
         LEFT JOIN likes l ON u.id = l.user_id
         LEFT JOIN followers f ON u.id = f.following_id
         LEFT JOIN followers ff ON u.id = ff.follower_id
         WHERE u.id = $1
         GROUP BY u.id`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          postsCreated: parseInt(analytics.rows[0]?.posts_created) || 0,
          commentsMade: parseInt(analytics.rows[0]?.comments_made) || 0,
          likesGiven: parseInt(analytics.rows[0]?.likes_given) || 0,
          followersCount: parseInt(analytics.rows[0]?.followers_count) || 0, followingCount: parseInt(analytics.rows[0]?.following_count) || 0
        }
      });
    } catch (error) {
      logger.error('Error in GeneralEndpointsController.getAnalytics:', error);
      res.status(500).json({
        success: false, message: 'Failed to get analytics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new GeneralEndpointsController();
