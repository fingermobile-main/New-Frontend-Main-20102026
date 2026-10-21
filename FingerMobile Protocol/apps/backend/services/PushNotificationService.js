const logger = require('../utils/logger');
/**
 * PushNotificationService
 * Firebase Cloud Messaging & Apple Push Notification Service
 */

let admin;
try {
  admin = require('firebase-admin');
} catch (error) {
  logger.warn('[PushNotificationService] Firebase Admin SDK not available');
  admin = null;
}

const pool = require('../database/connection');

// Initialize Firebase Admin only if available and configured
if (admin && admin.apps && !admin.apps.length && process.env.FCM_PROJECT_ID) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FCM_PROJECT_ID,
        clientEmail: process.env.FCM_CLIENT_EMAIL,
        privateKey: process.env.FCM_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
  } catch (error) {
    logger.error('[PushNotificationService] Failed to initialize Firebase Admin:', error);
  }
}

class PushNotificationService {
  /**
   * Register device token
   */
  async registerDevice(userId, token, platform, metadata = {}) {
    try {
      const query = `
        INSERT INTO push_subscriptions (
          user_id, device_token, platform, metadata, created_at
        ) VALUES ($1, $2, $3, $4, NOW())
        ON CONFLICT (user_id, device_token)
        DO UPDATE SET updated_at = NOW(), is_active = true
        RETURNING *
      `;

      const result = await pool.query(query, [
        userId,
        token,
        platform, // 'ios', 'android', 'web'
        JSON.stringify(metadata)
      ]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error in PushNotificationService.registerDevice:', error);
      throw error;
    }
  }

  /**
   * Unregister device token
   */
  async unregisterDevice(userId, token) {
    try {
      const query = `
        UPDATE push_subscriptions
        SET is_active = false, deactivated_at = NOW()
        WHERE user_id = $1 AND device_token = $2
        RETURNING *
      `;

      const result = await pool.query(query, [userId, token]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error in PushNotificationService.unregisterDevice:', error);
      throw error;
    }
  }

  /**
   * Send push notification to single device
   */
  async sendToDevice(token, title, body, data = {}, options = {}) {
    try {
      const message = {
        token,
        notification: {
          title,
          body
        },
        data: this.sanitizeData(data),
        android: options.android || {
          priority: 'high',
          notification: {
            sound: 'default',
            click_action: options.clickAction || 'FLUTTER_NOTIFICATION_CLICK'
          }
        },
        apns: options.apns || {
          payload: {
            aps: {
              sound: 'default',
              badge: options.badge || 1
            }
          }
        },
        webpush: options.webpush || {
          headers: {
            Urgency: 'high'
          }
        }
      };

      const response = await admin.messaging().send(message);

      // Log notification sent
      await this.logNotificationSent(null, token, title, body, 'sent', response);

      return {
        success: true,
        messageId: response
      };
    } catch (error) {
      logger.error('Error sending push notification:', error);
      await this.logNotificationSent(null, token, title, body, 'failed', null, error.message);

      // Handle invalid tokens
      if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
        await this.handleInvalidToken(token);
      }

      throw error;
    }
  }

  /**
   * Send push notification to topic (multiple devices)
   */
  async sendToTopic(topic, title, body, data = {}) {
    try {
      const message = {
        topic,
        notification: {
          title,
          body
        },
        data: this.sanitizeData(data)
      };

      const response = await admin.messaging().send(message);

      return {
        success: true,
        messageId: response
      };
    } catch (error) {
      logger.error('Error sending topic notification:', error);
      throw error;
    }
  }

  /**
   * Send push notification to multiple users
   */
  async sendToUsers(userIds, title, body, data = {}) {
    try {
      // Get active device tokens for users
      const query = `
        SELECT DISTINCT device_token, platform
        FROM push_subscriptions
        WHERE user_id = ANY($1::uuid[]) AND is_active = true
      `;

      const result = await pool.query(query, [userIds]);

      const tokens = result.rows.map(row => row.device_token);

      if (tokens.length === 0) {
        return { success: false, reason: 'no_active_devices' };
      }

      // FCM supports up to 500 tokens per multicast message
      const results = [];
      const batchSize = 500;

      for (let i = 0; i < tokens.length; i += batchSize) {
        const batch = tokens.slice(i, i + batchSize);

        const message = {
          tokens: batch,
          notification: {
            title,
            body
          },
          data: this.sanitizeData(data)
        };

        const response = await admin.messaging().sendEachForMulticast(message);

        results.push({
          successCount: response.successCount,
          failureCount: response.failureCount,
          responses: response.responses
        });

        // Log results
        await this.logBatchNotificationSent(userIds, title, body, response);
      }

      return {
        success: true,
        totalTokens: tokens.length,
        results
      };
    } catch (error) {
      logger.error('Error sending multicast notification:', error);
      throw error;
    }
  }

  /**
   * Send notification with action buttons
   */
  async sendWithActions(token, title, body, actions, data = {}) {
    try {
      const message = {
        token,
        notification: {
          title,
          body
        },
        data: this.sanitizeData(data),
        android: {
          notification: {
            actions: actions.map(action => ({
              icon: action.icon || 'notification_icon',
              title: action.title,
              action: action.action
            }))
          }
        },
        apns: {
          payload: {
            aps: {
              category: actions.map(a => a.action).join(',')
            }
          }
        }
      };

      const response = await admin.messaging().send(message);

      return {
        success: true,
        messageId: response
      };
    } catch (error) {
      logger.error('Error sending notification with actions:', error);
      throw error;
    }
  }

  /**
   * Send silent/notification-only push (for background sync)
   */
  async sendSilentNotification(token, data = {}) {
    try {
      const message = {
        token,
        data: this.sanitizeData(data),
        contentAvailable: true, // iOS
        priority: 'high'
      };

      const response = await admin.messaging().send(message);

      return {
        success: true,
        messageId: response
      };
    } catch (error) {
      logger.error('Error sending silent notification:', error);
      throw error;
    }
  }

  /**
   * Subscribe device to topic
   */
  async subscribeToTopic(token, topic) {
    try {
      await admin.messaging().subscribeToTopic(token, topic);

      return { success: true };
    } catch (error) {
      logger.error('Error subscribing to topic:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe device from topic
   */
  async unsubscribeFromTopic(token, topic) {
    try {
      await admin.messaging().unsubscribeFromTopic(token, topic);

      return { success: true };
    } catch (error) {
      logger.error('Error unsubscribing from topic:', error);
      throw error;
    }
  }

  /**
   * Sanitize data for FCM (values must be strings)
   */
  sanitizeData(data) {
    const sanitized = {};

    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }

    return sanitized;
  }

  /**
   * Handle invalid token (remove from database)
   */
  async handleInvalidToken(token) {
    try {
      await pool.query(
        'UPDATE push_subscriptions SET is_active = false WHERE device_token = $1',
        [token]
      );
    } catch (error) {
      logger.error('Error handling invalid token:', error);
    }
  }

  /**
   * Log notification sent
   */
  async logNotificationSent(userId, token, title, body, status, messageId, error = null) {
    try {
      const query = `
        INSERT INTO push_notification_logs (
          user_id, device_token, title, body, 
          status, message_id, error_message, sent_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      `;

      await pool.query(query, [userId, token, title, body, status, messageId, error]);
    } catch (logError) {
      logger.error('Error logging push notification:', logError);
    }
  }

  /**
   * Log batch notification sent
   */
  async logBatchNotificationSent(userIds, title, body, response) {
    try {
      const query = `
        INSERT INTO push_notification_logs (
          user_ids, title, body, status, 
          success_count, failure_count, sent_at
        ) VALUES ($1, $2, $3, 'batch_sent', $4, $5, NOW())
      `;

      await pool.query(query, [
        userIds,
        title,
        body,
        response.successCount,
        response.failureCount
      ]);
    } catch (logError) {
      logger.error('Error logging batch notification:', logError);
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(startDate, endDate) {
    const query = `
      SELECT 
        COUNT(*) as total_sent,
        COUNT(CASE WHEN status = 'sent' THEN 1 END) as successful,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed,
        COUNT(DISTINCT user_id) as unique_users,
        COUNT(DISTINCT device_token) as unique_devices
      FROM push_notification_logs
      WHERE sent_at BETWEEN $1 AND $2
    `;

    const result = await pool.query(query, [startDate, endDate]);

    return result.rows[0];
  }
}

module.exports = new PushNotificationService();
