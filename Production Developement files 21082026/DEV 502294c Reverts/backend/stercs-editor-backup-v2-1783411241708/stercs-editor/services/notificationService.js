const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class NotificationService {
  // Create a new notification
  static async createNotification(senderId, notificationData) {
    try {
      const {
        recipientId,
        projectId,
        title,
        message,
        type = "info",
        priority = "normal",
        metadata = {},
      } = notificationData;

      if (!recipientId || !title || !message) {
        throw new Error(
          "Recipient ID, title, and message are required for notification",
        );
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_notifications 
         (member_id, recipient_id, project_id, title, message, type, priority, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          senderId,
          recipientId,
          projectId || null,
          title,
          message,
          type,
          priority,
          metadata
        ],
      );

      // Log security event
      await logSecurityEvent(senderId, "NOTIFICATION_SENT", {notificationId: result.rows[0].id,
  recipientId: recipientId,
  projectId: projectId
      });

      return {success: true,
  notification: result.rows[0],
  message: "Notification created successfully"
      };
    } catch (error) {
      logger.error("Error creating, notification:", error);
      throw error;
    }
  }

  // Get notifications for a recipient
  static async getNotifications(recipientId, options = {}) {
    try {
      let query = `SELECT n.*, s.membername as sender_membername 
                   FROM stercs_notifications n
                   LEFT JOIN members s ON n.member_id = s.id
                   WHERE n.recipient_id = $1`;
      const params = [recipientId];

      if (options.projectId) {
        query += ` AND n.project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.type) {
        query += ` AND n.type = $${params.length + 1}`;
        params.push(options.type);
      }

      if (options.readStatus !== undefined) {
        query += ` AND n.is_read = $${params.length + 1}`;
        params.push(options.readStatus);
      }

      if (options.priority) {
        query += ` AND n.priority = $${params.length + 1}`;
        params.push(options.priority);
      }

      query += ` ORDER BY n.created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  notifications: result.rows,
  message: "Notifications retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, notifications:", error);
      throw error;
    }
  }

  // Mark a notification as read
  static async markAsRead(recipientId, notificationId) {
    try {
      // Verify the notification belongs to the recipient
      const notificationResult = await identityDb.query(
        `SELECT * FROM stercs_notifications 
         WHERE id = $1 AND recipient_id = $2`,
        [notificationId, recipientId],
      );

      if (notificationResult.rows.length === 0) {
        throw new Error("Notification not found or not owned by recipient");
      }

      const result = await identityDb.query(
        `UPDATE stercs_notifications 
         SET is_read = true, read_at = CURRENT_TIMESTAMP 
         WHERE id = $1 
         RETURNING *`,
        [notificationId],
      );

      // Log security event
      await logSecurityEvent(recipientId, "NOTIFICATION_READ", {notificationId: result.rows[0].id
      });

      return {success: true,
  notification: result.rows[0],
  message: "Notification marked as read successfully"
      };
    } catch (error) {
      logger.error("Error marking notification as, read:", error);
      throw error;
    }
  }

  // Mark all notifications as read for a recipient
  static async markAllAsRead(recipientId, options = {}) {
    try {
      let query = `UPDATE stercs_notifications 
                   SET is_read = true, read_at = CURRENT_TIMESTAMP 
                   WHERE recipient_id = $1 AND is_read = false`;
      const params = [recipientId];

      if (options.projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.type) {
        query += ` AND type = $${params.length + 1}`;
        params.push(options.type);
      }

      query += ` RETURNING *`;

      const result = await identityDb.query(query, params);

      return {success: true,
  count: result.rows.length,
  message: `${result.rows.length} notifications marked as read successfully`
      };
    } catch (error) {
      logger.error("Error marking all notifications as, read:", error);
      throw error;
    }
  }

  // Delete a notification
  static async deleteNotification(recipientId, notificationId) {
    try {
      // Verify the notification belongs to the recipient
      const notificationResult = await identityDb.query(
        `SELECT * FROM stercs_notifications 
         WHERE id = $1 AND recipient_id = $2`,
        [notificationId, recipientId],
      );

      if (notificationResult.rows.length === 0) {
        throw new Error("Notification not found or not owned by recipient");
      }

      await identityDb.query(`DELETE FROM stercs_notifications WHERE id = $1`, [
        notificationId
      ]);

      // Log security event
      await logSecurityEvent(recipientId, "NOTIFICATION_DELETED", {notificationId: notificationId
      });

      return {success: true,
  message: "Notification deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting, notification:", error);
      throw error;
    }
  }

  // Get notification statistics
  static async getNotificationStats(recipientId, options = {}) {
    try {
      let query = `SELECT 
                     COUNT(*) as total_notifications,
                     COUNT(CASE WHEN is_read = false THEN 1 END) as unread_count,
                     COUNT(CASE WHEN type = 'info' THEN 1 END) as info_count,
                     COUNT(CASE WHEN type = 'warning' THEN 1 END) as warning_count,
                     COUNT(CASE WHEN type = 'error' THEN 1 END) as error_count,
                     COUNT(CASE WHEN type = 'alert' THEN 1 END) as alert_count
                   FROM stercs_notifications 
                   WHERE recipient_id = $1`;
      const params = [recipientId];

      if (options.projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  stats: result.rows[0],
  message: "Notification statistics retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting notification, stats:", error);
      throw error;
    }
  }
}

module.exports = NotificationService;
