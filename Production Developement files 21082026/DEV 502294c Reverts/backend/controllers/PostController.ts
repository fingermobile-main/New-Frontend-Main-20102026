/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import PostService from '../services/PostService';

/**
 * PostController
 * Handles post creation, retrieval, and management
 */

class PostController {
  /**
   * GET /api/posts
   * Get posts feed with filtering
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      const { page = 1, limit = 20, type, authorId, hashtag } = req.query;
      
      const posts = await PostService.getPosts(
        parseInt(page as string),
        parseInt(limit as string),
        type as string,
        authorId ? parseInt(authorId as string) : undefined,
        hashtag as string,
        userId
      );

      res.json({
        success: true,
        data: posts,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string)
        }
      });
    } catch (error) {
      logger.error('PostController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve posts'
      });
    }
  }

  /**
   * GET /api/posts/:id
   * Get single post by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      
      const post = await PostService.getPostById(parseInt(id as string), userId);

      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Post not found'
        });
        return;
      }

      res.json({
        success: true,
        data: post
      });
    } catch (error) {
      logger.error('PostController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve post'
      });
    }
  }

  /**
   * POST /api/posts
   * Create new post
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const postData = req.body;
      const post = await PostService.createPost(userId, postData);

      res.status(201).json({
        success: true,
        message: 'Post created successfully',
        data: post
      });
    } catch (error) {
      logger.error('PostController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create post'
      });
    }
  }

  /**
   * PUT /api/posts/:id
   * Update post
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const updates = req.body;
      
      const post = await PostService.updatePost(parseInt(id as string), userId, updates);

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: post
      });
    } catch (error) {
      logger.error('PostController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update post'
      });
    }
  }

  /**
   * DELETE /api/posts/:id
   * Delete post
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      await PostService.deletePost(parseInt(id as string), userId);

      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      logger.error('PostController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete post'
      });
    }
  }

  /**
   * POST /api/posts/:id/like
   * Like a post
   */
  async like(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      await PostService.likePost(parseInt(id as string), userId);

      res.json({
        success: true,
        message: 'Post liked'
      });
    } catch (error) {
      logger.error('PostController.like error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like post'
      });
    }
  }

  /**
   * DELETE /api/posts/:id/like
   * Unlike a post
   */
  async unlike(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      await PostService.unlikePost(parseInt(id as string), userId);

      res.json({
        success: true,
        message: 'Post unliked'
      });
    } catch (error) {
      logger.error('PostController.unlike error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unlike post'
      });
    }
  }

  /**
   * POST /api/posts/:id/share
   * Share a post
   */
  async share(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      await PostService.sharePost(parseInt(id as string), userId);

      res.json({
        success: true,
        message: 'Post shared'
      });
    } catch (error) {
      logger.error('PostController.share error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to share post'
      });
    }
  }

  /**
   * POST /api/posts/:id/bookmark
   * Bookmark a post
   */
  async bookmark(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      await PostService.bookmarkPost(parseInt(id as string), userId);

      res.json({
        success: true,
        message: 'Post bookmarked'
      });
    } catch (error) {
      logger.error('PostController.bookmark error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to bookmark post'
      });
    }
  }

  /**
   * DELETE /api/posts/:id/bookmark
   * Remove bookmark
   */
  async removeBookmark(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id ? parseInt(req.user.id) : undefined;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      await PostService.removeBookmark(parseInt(id as string), userId);

      res.json({
        success: true,
        message: 'Bookmark removed'
      });
    } catch (error) {
      logger.error('PostController.removeBookmark error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove bookmark'
      });
    }
  }
}

export default new PostController();
