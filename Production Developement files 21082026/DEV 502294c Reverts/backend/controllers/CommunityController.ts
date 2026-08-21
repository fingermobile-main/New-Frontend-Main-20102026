import { Request, Response } from 'express';
const CommunityService = require('../services/CommunityService');
const logger = require('../utils/logger');

/**
 * CommunityController
 * Handles community management and interactions
 */

class CommunityController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, category, type, search, sortBy, order } = req.query;
      
      const result = await CommunityService.getAllCommunities({
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 20,
        category: category as string,
        type: type as string,
        search: search as string,
        sortBy: sortBy as string,
        order: order as string
      });
      
      res.json({
        success: true,
        data: result.communities,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      logger.error('CommunityController.getAll error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve communities' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      
      const community = await CommunityService.getCommunityById(id, userId);
      
      res.json({ 
        success: true, 
        data: community 
      });
    } catch (error) {
      logger.error('CommunityController.getById error:', error);
      if (error instanceof Error && error.message === 'Community not found') {
        res.status(404).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Failed to retrieve community' });
      }
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { name, description, type, category, tags, avatar_url, cover_image_url, rules, settings } = req.body;
      
      // Validation
      if (!name || name.trim().length === 0) {
        res.status(400).json({ success: false, message: 'Community name is required' });
        return;
      }
      
      if (name.length > 255) {
        res.status(400).json({ success: false, message: 'Community name must be less than 255 characters' });
        return;
      }
      
      const community = await CommunityService.createCommunity(userId, {
        name,
        description,
        type,
        category,
        tags,
        avatar_url,
        cover_image_url,
        rules,
        settings
      });
      
      res.status(201).json({ 
        success: true, 
        message: 'Community created successfully', 
        data: community 
      });
    } catch (error) {
      logger.error('CommunityController.create error:', error);
      if (error instanceof Error && error.message.includes('already exists')) {
        res.status(409).json({ success: false, message: error.message });
      } else {
        res.status(500).json({ success: false, message: 'Failed to create community' });
      }
    }
  }

  async join(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { communityId } = req.params;
      
      const result = await CommunityService.joinCommunity(communityId, userId);
      
      res.json({ 
        success: true, 
        message: result.message,
        data: { status: result.status }
      });
    } catch (error) {
      logger.error('CommunityController.join error:', error);
      const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 
                        error instanceof Error && error.message.includes('banned') ? 403 : 400;
      res.status(statusCode).json({ success: false, message: error instanceof Error ? error.message : 'Failed to join community' });
    }
  }

  async leave(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { communityId } = req.params;
      
      const result = await CommunityService.leaveCommunity(communityId, userId);
      
      res.json({ 
        success: true, 
        message: result.message 
      });
    } catch (error) {
      logger.error('CommunityController.leave error:', error);
      const statusCode = error instanceof Error && error.message.includes('not a member') ? 400 : 500;
      res.status(statusCode).json({ success: false, message: error instanceof Error ? error.message : 'Failed to leave community' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { id } = req.params;
      const updates = req.body;
      
      const community = await CommunityService.updateCommunity(id, userId, updates);
      
      res.json({ 
        success: true, 
        message: 'Community updated successfully', 
        data: community 
      });
    } catch (error) {
      logger.error('CommunityController.update error:', error);
      const statusCode = error instanceof Error && error.message.includes('permissions') ? 403 : 500;
      res.status(statusCode).json({ success: false, message: error instanceof Error ? error.message : 'Failed to update community' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }
      
      const { id } = req.params;
      
      const result = await CommunityService.deleteCommunity(id, userId);
      
      res.json({ 
        success: true, 
        message: result.message,
        data: result.community
      });
    } catch (error) {
      logger.error('CommunityController.delete error:', error);
      const statusCode = error instanceof Error && error.message.includes('owner') ? 403 : 500;
      res.status(statusCode).json({ success: false, message: error instanceof Error ? error.message : 'Failed to delete community' });
    }
  }

  async getMembers(req: Request, res: Response): Promise<void> {
    try {
      const { communityId } = req.params;
      const { page, limit, role, search } = req.query;
      
      const result = await CommunityService.getCommunityMembers(communityId, {
        page: parseInt(page as string) || 1,
        limit: parseInt(limit as string) || 50,
        role: role as string,
        search: search as string
      });
      
      res.json({
        success: true,
        data: result.members,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total
        }
      });
    } catch (error) {
      logger.error('CommunityController.getMembers error:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve members' });
    }
  }
}

export default new CommunityController();
