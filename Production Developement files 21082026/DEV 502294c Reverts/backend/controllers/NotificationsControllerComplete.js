/**
 * NotificationsController - Extracted from notifications.js route handlers
 * Date: June 9, 2026
 * Purpose: Separate business logic from route definitions
 */

const communicationDb = require("../db");
const logger = require('../utils/logger');

class NotificationsController {
  
  /**
   * GET /api/notifications
   * Get member's notifications with filtering options
   */
  async getNotifications(req, res) {
    try {
      const member_id = req.member.id;
      const { is_read, is_archived, limit = 20, offset = 0 } = req.query;

      let query = `SELECT n.*, notifier.membername as notifier_membername
                   FROM notifications n
                   LEFT JOIN members notifier ON n.notifier_id = notifier.id
                   WHERE n.member_id = $1`;
      const params = [member_id];
      let paramIndex = 1;

      if (is_read !== undefined) {
        paramIndex++;
        query += ` AND n.is_read = $${paramIndex}`;
        params.push(is_read === "true");
      }

      if (is_archived !== undefined) {
        paramIndex++;
        query += ` AND n.is_archived = $${paramIndex}`;
        params.push(is_archived === "true");
      }

      query += ` ORDER BY n.created_at DESC
                LIMIT $${paramIndex + 1} OFFSET $${paramIndex + 2}`;
      params.push(limit, offset);

      const { rows } = await communicationDb.query(query, params);

      res.json({
        success: true,
        notifications: rows });
    } catch (err) {
      logger.error("Error fetching notifications:", err);
      res.status(500).json({
        success: false, message: "Server error" });
    }
  }

  /**
   * PUT /api/notifications/:id
   * Update a notification (mark as read, archive)
   */
  async updateNotification(req, res) {
    try {
      const member_id = req.member.id;
      const { id } = req.params;
      const { is_read, is_archived } = req.body;

      // Check if notification exists and belongs to member
      const notificationResult = await communicationDb.query(
        "SELECT * FROM notifications WHERE id = $1 AND member_id = $2",
        [id, member_id],
      );

      if (notificationResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: "Notification not found"
        });
      }

      const { rows } = await communicationDb.query(
        `UPDATE notifications 
         SET is_read = COALESCE($1, is_read), 
             is_archived = COALESCE($2, is_archived),
             read_at = CASE 
               WHEN $1 = true THEN NOW()
               ELSE read_at
             END
         WHERE id = $3
         RETURNING *`,
        [is_read, is_archived, id],
      );

      res.json({
        success: true,
        notification: rows[0] });
    } catch (err) {
      logger.error("Error updating notification:", err);
      res.status(500).json({
        success: false, message: "Server error"
      });
    }
  }

  /**
   * PUT /api/notifications
   * Bulk update notifications (mark all as read, archive all read)
   */
  async bulkUpdateNotifications(req, res) {
    try {
      const member_id = req.member.id;
      const { mark_all_read, archive_all_read } = req.body;

      if (mark_all_read) {
        await communicationDb.query(
          `UPDATE notifications 
           SET is_read = true,
               read_at = NOW()
           WHERE member_id = $1 AND is_read = false`,
          [member_id],
        );
      }

      if (archive_all_read) {
        await communicationDb.query(
          `UPDATE notifications 
           SET is_archived = true
           WHERE member_id = $1 AND is_read = true AND is_archived = false`,
          [member_id],
        );
      }

      res.json({
        success: true, message: "Notifications updated successfully" });
    } catch (err) {
      logger.error("Error bulk updating notifications:", err);
      res.status(500).json({
        success: false, message: "Server error"
      });
    }
  }

  /**
   * GET /api/notifications/unread-count
   * Get count of unread notifications
   */
  async getUnreadCount(req, res) {
    try {
      const member_id = req.member.id;

      const { rows } = await communicationDb.query(
        `SELECT COUNT(*) as unread_count
         FROM member_notifications
         WHERE member_id = $1 AND is_read = false AND is_archived = false`,
        [member_id],
      );

      res.json({
        success: true,
        unread_count: parseInt(rows[0].unread_count) });
    } catch (err) {
      logger.error("Error getting unread count:", err);
      res.status(500).json({
        success: false, message: "Server error"
      });
    }
  }

  /**
   * POST /api/notifications
   * Create a notification (internal use)
   */
  async createNotification(req, res) {
    try {
      const {
        recipient_id,
        notification_type,
        title,
        message,
        related_entity_type,
        related_entity_id
      } = req.body;

      // Basic validation
      if (!recipient_id || !notification_type) {
        return res.status(400).json({
          success: false, message: "Recipient ID and notification type are required"
        });
      }

      const { rows } = await communicationDb.query(
        `INSERT INTO notifications 
         (member_id, notification_type, title, message, related_entity_type, related_entity_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          recipient_id,
          notification_type,
          title,
          message,
          related_entity_type,
          related_entity_id
        ],
      );

      res.json({
        success: true,
        notification: rows[0] });
    } catch (err) {
      logger.error("Error creating notification:", err);
      res.status(500).json({
        success: false, message: "Server error" });
    }
  }

  /**
   * DELETE /api/notifications/:notificationId
   * Delete a notification
   */
  async deleteNotification(req, res) {
    try {
      const member_id = req.member.id;
      const { notificationId } = req.params;

      // Check if notification exists and belongs to member
      const notificationResult = await communicationDb.query(
        "SELECT * FROM member_notifications WHERE id = $1 AND member_id = $2",
        [notificationId, member_id],
      );

      if (notificationResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: "Notification not found" });
      }

      await communicationDb.query(
        "DELETE FROM member_notifications WHERE id = $1",
        [notificationId],
      );

      res.json({
        success: true, message: "Notification deleted successfully" });
    } catch (err) {
      logger.error("Error deleting notification:", err);
      res.status(500).json({
        success: false, message: "Server error" });
    }
  }

  /**
   * PUT /api/notifications/:notificationId/read
   * Mark a notification as read
   */
  async markAsRead(req, res) {
    try {
      const member_id = req.member.id;
      const { notificationId } = req.params;

      // Check if notification exists and belongs to member
      const notificationResult = await communicationDb.query(
        "SELECT * FROM member_notifications WHERE id = $1 AND member_id = $2",
        [notificationId, member_id],
      );

      if (notificationResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: "Notification not found"
        });
      }

      const { rows } = await communicationDb.query(
        `UPDATE member_notifications 
         SET is_read = true,
             read_at = NOW(),
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [notificationId],
      );

      res.json({
        success: true,
        notification: rows[0] });
    } catch (err) {
      logger.error("Error marking notification as read:", err);
      res.status(500).json({
        success: false, message: "Server error"
      });
    }
  }

  /**
   * PUT /api/notifications/:memberId/read-all
   * Mark all notifications as read
   */
  async markAllAsRead(req, res) {
    try {
      const { memberId } = req.params;

      // Verify member identity
      if (req.member.id !== memberId) {
        return res.status(403).json({
          success: false, message: "Forbidden"
        });
      }

      await communicationDb.query(
        `UPDATE member_notifications 
         SET is_read = true,
             read_at = NOW(),
             updated_at = NOW()
         WHERE member_id = $1 AND is_read = false`,
        [memberId],
      );

      res.json({
        success: true, message: "All notifications marked as read" });
    } catch (err) {
      logger.error("Error marking all notifications as read:", err);
      res.status(500).json({
        success: false, message: "Server error" });
    }
  }

  /**
   * PUT /api/notifications/:notificationId/archive
   * Archive a notification
   */
  async archiveNotification(req, res) {
    try {
      const member_id = req.member.id;
      const { notificationId } = req.params;

      // Check if notification exists and belongs to member
      const notificationResult = await communicationDb.query(
        "SELECT * FROM member_notifications WHERE id = $1 AND member_id = $2",
        [notificationId, member_id],
      );

      if (notificationResult.rows.length === 0) {
        return res.status(404).json({
          success: false, message: "Notification not found"
        });
      }

      const { rows } = await communicationDb.query(
        `UPDATE member_notifications 
         SET is_archived = true,
             updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [notificationId],
      );

      res.json({
        success: true,
        notification: rows[0] });
    } catch (err) {
      logger.error("Error archiving notification:", err);
      res.status(500).json({
        success: false, message: "Server error"
      });
    }
  }
}

module.exports = new NotificationsController();
