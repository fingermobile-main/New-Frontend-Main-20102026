/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import MessageService from '../services/MessageService';

/**
 * MessageController
 * Handles direct messaging operations
 */

class MessageController {
  /**
   * GET /api/messages/conversations
   * Get user conversations
   */
  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const conversations = await MessageService.getConversations(userId);

      res.json({
        success: true,
        data: conversations
      });
    } catch (error) {
      logger.error('MessageController.getConversations error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve conversations'
      });
    }
  }

  /**
   * GET /api/messages/conversations/:conversationId
   * Get messages in a conversation
   */
  async getConversationMessages(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { conversationId } = req.params;
      const { limit = 50, before } = req.query;
      
      const messages = await MessageService.getConversationMessages(
        parseInt(conversationId as string),
        userId,
        parseInt(limit as string),
        before as string
      );

      res.json({
        success: true,
        data: messages
      });
    } catch (error) {
      logger.error('MessageController.getConversationMessages error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve messages'
      });
    }
  }

  /**
   * POST /api/messages/conversations
   * Create new conversation
   */
  async createConversation(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { participantIds, type = 'direct', name } = req.body;
      
      const conversation = await MessageService.createConversation(
        userId,
        participantIds,
        type,
        name
      );

      res.status(201).json({
        success: true,
        message: 'Conversation created',
        data: conversation
      });
    } catch (error) {
      logger.error('MessageController.createConversation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create conversation'
      });
    }
  }

  /**
   * POST /api/messages
   * Send message
   */
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { conversationId, content, type = 'text', attachments } = req.body;
      
      const message = await MessageService.sendMessage(
        userId,
        parseInt(conversationId as string),
        content,
        type,
        attachments
      );

      res.status(201).json({
        success: true,
        message: 'Message sent',
        data: message
      });
    } catch (error) {
      logger.error('MessageController.sendMessage error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send message'
      });
    }
  }

  /**
   * PUT /api/messages/:messageId/read
   * Mark message as read
   */
  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { messageId } = req.params;
      await MessageService.markMessageAsRead(parseInt(messageId as string), userId);

      res.json({
        success: true,
        message: 'Message marked as read'
      });
    } catch (error) {
      logger.error('MessageController.markAsRead error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark message as read'
      });
    }
  }

  /**
   * PUT /api/messages/conversations/:conversationId/read
   * Mark all messages in conversation as read
   */
  async markConversationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { conversationId } = req.params;
      await MessageService.markConversationAsRead(parseInt(conversationId as string), userId);

      res.json({
        success: true,
        message: 'Conversation marked as read'
      });
    } catch (error) {
      logger.error('MessageController.markConversationAsRead error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark conversation as read'
      });
    }
  }

  /**
   * DELETE /api/messages/:messageId
   * Delete message
   */
  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { messageId } = req.params;
      await MessageService.deleteMessage(parseInt(messageId as string), userId);

      res.json({
        success: true,
        message: 'Message deleted'
      });
    } catch (error) {
      logger.error('MessageController.deleteMessage error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete message'
      });
    }
  }
}

export default new MessageController();
