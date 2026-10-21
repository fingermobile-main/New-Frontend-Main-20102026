/* eslint-disable no-unused-vars */
const { identityDb } = require('../database/connection');

const logger = require('../utils/logger');
const { monetizationDb } = require('../db');
const { logSecurityEvent } = require('../utils/securityLogger');

// Extend notification service to handle FIC-specific notifications
class NotificationService {
  // Create a new notification
  static async createNotification(senderId, notificationData) {
    try {
      const {
        recipientId,
        projectId,
        title,
        message,
        type = 'info',
        priority = 'normal',
        metadata = {}
      } = notificationData;

      if (!recipientId || !title || !message) {
        throw new Error(
          'Recipient ID, title, and message are required for notification',
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
      await logSecurityEvent(senderId, 'NOTIFICATION_SENT', {
        notificationId: result.rows[0].id,
        recipientId: recipientId,
        projectId: projectId
      });

      return {
        success: true,
        notification: result.rows[0],
        message: 'Notification created successfully'
      };
    } catch (error) {
      logger.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create FIC transaction notification
  static async createFICTransactionNotification(
    recipientId,
    transactionType,
    amount,
    transactionId,
  ) {
    const title = `FIC Transaction ${transactionType === 'exchange_in' ? 'Received' : 'Sent'}`;
    const message = `Your FIC account has been ${transactionType === 'exchange_in' ? 'credited' : 'debited'} with ${amount} FIC.`;

    return await this.createNotification(null, {
      recipientId,
      title,
      message,
      type: 'fic',
      metadata: {
        transactionId,
        amount,
        transactionType
      }
    });
  }

  // Get FIC-related notifications
  static async getFICNotifications(recipientId, options = {}) {
    let query = `SELECT n.*, s.membername as sender_membername 
                 FROM stercs_notifications n
                 LEFT JOIN members s ON n.member_id = s.id
                 WHERE n.recipient_id = $1 AND n.type = 'fic'`;
    const params = [recipientId];

    if (options.readStatus !== undefined) {
      query += ` AND n.is_read = $${params.length + 1}`;
      params.push(options.readStatus);
    }

    query += ' ORDER BY n.created_at DESC';

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(options.limit);
    }

    const result = await identityDb.query(query, params);

    return {
      success: true,
      notifications: result.rows,
      message: 'FIC notifications retrieved successfully'
    };
  }
}

module.exports = NotificationService;
