import { Pool } from 'pg';
import logger from '../utils/logger';

/**
 * NotificationService
 * Business logic for notification management
 */

class NotificationService {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Get user notifications with pagination
   */
  async getUserNotifications(userId: number, page: number = 1, limit: number = 20, unreadOnly: boolean = false): Promise<any[]> {
    try {
    let query = `
      SELECT n.*, u.name as sender_name, u.avatar_url as sender_avatar
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE n.user_id = $1
    `;
    
    const values: any[] = [userId];
    let paramCount = 1;

    if (unreadOnly) {
      paramCount++;
      query += ` AND n.is_read = false`;
    }

    query += ` ORDER BY n.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    values.push(limit, (page - 1) * limit);

    const result = await this.pool.query(query, values);
    return result.rows;
  
    } catch (error) {
      logger.error(`Error in getUserNotifications:`, error);
      throw error;
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: number): Promise<number> {
    try {
    const query = 'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false';
    const result = await this.pool.query(query, [userId]);
    return parseInt(result.rows[0]?.count || '0');
  
    } catch (error) {
      logger.error(`Error in getUnreadCount:`, error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number, userId: number): Promise<void> {
    try {
    const query = 'UPDATE notifications SET is_read = true, read_at = NOW() WHERE id = $1 AND user_id = $2';
    await this.pool.query(query, [notificationId, userId]);
    } catch (error) {
      logger.error(`Error in markAsRead:`, error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: number): Promise<void> {
    try {
    const query = 'UPDATE notifications SET is_read = true, read_at = NOW() WHERE user_id = $1 AND is_read = false';
    await this.pool.query(query, [userId]);
  
    } catch (error) {
      logger.error(`Error in markAllAsRead:`, error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: number, userId: number): Promise<boolean> {
    try {
    const query = 'DELETE FROM notifications WHERE id = $1 AND user_id = $2';
    const result = await this.pool.query(query, [notificationId, userId]);
    return (result.rowCount ?? 0) > 0;
  
    } catch (error) {
      logger.error(`Error in deleteNotification:`, error);
      throw error;
    }
  }

  /**
   * Create notification
   */
  async createNotification(data: {
    userId: number;
    senderId?: number;
    type: string;
    title: string;
    message: string;
    actionUrl?: string;
    metadata?: any;
  }): Promise<any> {
    try {
    const query = `
      INSERT INTO notifications (user_id, sender_id, type, title, message, action_url, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      data.userId,
      data.senderId || null,
      data.type,
      data.title,
      data.message,
      data.actionUrl || null,
      data.metadata ? JSON.stringify(data.metadata) : null
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  
    } catch (error) {
      logger.error(`Error in createNotification:`, error);
      throw error;
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(userId: number, preferences: any): Promise<void> {
    try {
    const query = `
      INSERT INTO notification_preferences (user_id, preferences, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (user_id) DO UPDATE SET preferences = $2, updated_at = NOW()
    `;
    
    await this.pool.query(query, [userId, JSON.stringify(preferences)]);
  
    } catch (error) {
      logger.error(`Error in updatePreferences:`, error);
      throw error;
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(userId: number): Promise<any> {
    try {
    const query = 'SELECT preferences FROM notification_preferences WHERE user_id = $1';
    const result = await this.pool.query(query, [userId]);
    return result.rows[0]?.preferences || {};
  
    } catch (error) {
      logger.error(`Error in getPreferences:`, error);
      throw error;
    }
  }
}

export default new NotificationService(require('../db').default || require('../db'));
