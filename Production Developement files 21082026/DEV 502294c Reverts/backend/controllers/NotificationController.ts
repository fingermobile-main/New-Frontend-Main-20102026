/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import NotificationService from '../services/NotificationService';

/**
 * NotificationController
 * Handles all notification-related operations
 */

class NotificationController {
  /**
   * GET /api/notifications
   * Get user notifications with pagination
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { page = 1, limit = 20, unreadOnly = false } = req.query;
      
      const notifications = await NotificationService.getUserNotifications(
        userId,
        parseInt(page as string),
        parseInt(limit as string),
        unreadOnly === 'true'
      );

      res.json({
        success: true,
        data: notifications,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: notifications.length
        }
      });
    } catch (error) {
      logger.error('NotificationController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve notifications'
      });
    }
  }

  /**
   * GET /api/notifications/unread-count
   * Get count of unread notifications
   */
  async getUnreadCount(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const count = await NotificationService.getUnreadCount(userId);

      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      logger.error('NotificationController.getUnreadCount error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get unread count'
      });
    }
  }

  /**
   * PUT /api/notifications/:id/read
   * Mark notification as read
   */
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      await NotificationService.markAsRead(parseInt(id as string), userId);

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      logger.error('NotificationController.markAsRead error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read'
      });
    }
  }

  /**
   * PUT /api/notifications/read-all
   * Mark all notifications as read
   */
  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      await NotificationService.markAllAsRead(userId);

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      logger.error('NotificationController.markAllAsRead error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark all notifications as read'
      });
    }
  }

  /**
   * DELETE /api/notifications/:id
   * Delete notification
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = (req as any).params;
      await NotificationService.deleteNotification(parseInt(id as string), userId);

      res.json({
        success: true,
        message: 'Notification deleted'
      });
    } catch (error) {
      logger.error('NotificationController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification'
      });
    }
  }

  /**
   * POST /api/notifications/preferences
   * Update notification preferences
   */
  async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const preferences = req.body;
      await NotificationService.updatePreferences(userId, preferences);

      res.json({
        success: true,
        message: 'Notification preferences updated'
      });
    } catch (error) {
      logger.error('NotificationController.updatePreferences error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update preferences'
      });
    }
  }
}

export default new NotificationController();
