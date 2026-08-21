/**
 * NotificationService
 * Multi-channel notification system (in-app, email, push, SMS)
 */

const pool = require('../database/connection');

class NotificationService {
  /**
   * Create in-app notification
   */
  async createNotification(userId, type, title, message, metadata = {}) {
    try {
      const query = `
        INSERT INTO notifications (
          user_id, type, title, message, metadata, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, 'unread', NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        userId,
        type,
        title,
        message,
        JSON.stringify(metadata)
      ]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error in NotificationService.createNotification:', error);
      throw error;
    }
  }
  
  /**
   * Get user's notifications
   */
  async getNotifications(userId, limit = 50, offset = 0, filter = 'all') {
    try {
      let query = 'SELECT * FROM notifications WHERE user_id = $1';
      const params = [userId];
      
      if (filter === 'unread') {
        query += ' AND status = $2';
        params.push('unread');
      } else if (filter === 'read') {
        query += ' AND status = $2';
        params.push('read');
      }
      
      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      
      return {
        notifications: result.rows,
        total: result.rows.length,
        limit,
        offset
      };
    } catch (error) {
      logger.error('Error in NotificationService.getNotifications:', error);
      throw error;
    }
  }
  
  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    try {
      const query = `
        UPDATE notifications
        SET status = 'read', read_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;
      
      const result = await pool.query(query, [notificationId, userId]);
      
      if (result.rows.length === 0) {
        throw new Error('Notification not found');
      }
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error in NotificationService.markAsRead:', error);
      throw error;
    }
  }
  
  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    try {
      const query = `
        UPDATE notifications
        SET status = 'read', read_at = NOW()
        WHERE user_id = $1 AND status = 'unread'
        RETURNING COUNT(*)
      `;
      
      const result = await pool.query(query, [userId]);
      
      return {
        marked_count: parseInt(result.rows[0].count)
      };
    } catch (error) {
      logger.error('Error in NotificationService.markAllAsRead:', error);
      throw error;
    }
  }
  
  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    try {
      const query = `
        DELETE FROM notifications
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;
      
      const result = await pool.query(query, [notificationId, userId]);
      
      if (result.rows.length === 0) {
        throw new Error('Notification not found');
      }
      
      return { success: true };
    } catch (error) {
      logger.error('Error in NotificationService.deleteNotification:', error);
      throw error;
    }
  }
  
  /**
   * Get unread count
   */
  async getUnreadCount(userId) {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM notifications
        WHERE user_id = $1 AND status = 'unread'
      `;
      
      const result = await pool.query(query, [userId]);
      
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Error in NotificationService.getUnreadCount:', error);
      throw error;
    }
  }
  
  /**
   * Send bulk notifications
   */
  async sendBulkNotification(userIds, type, title, message, metadata = {}) {
    try {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        const results = [];
        
        for (const userId of userIds) {
          const result = await client.query(`
            INSERT INTO notifications (
              user_id, type, title, message, metadata, status, created_at
            ) VALUES ($1, $2, $3, $4, $5, 'unread', NOW())
            RETURNING *
          `, [userId, type, title, message, JSON.stringify(metadata)]);
          
          results.push(result.rows[0]);
        }
        
        await client.query('COMMIT');
        
        return {
          success: true,
          sent_count: results.length,
          notifications: results
        };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error in NotificationService.sendBulkNotification:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();
