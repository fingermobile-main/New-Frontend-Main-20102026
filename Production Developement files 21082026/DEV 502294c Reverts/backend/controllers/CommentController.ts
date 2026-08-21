import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * CommentController
 * Comments system - Create, read, update, delete comments with threading and pagination
 */

class CommentController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * GET /api/comments
   * Get all comments with pagination and filtering
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;
      
      const { post_id, author_id, sort = 'newest' } = req.query;
      
      // Build query
      let query = `
        SELECT c.*, 
               u.name as author_name,
               u.avatar_url as author_avatar,
               COUNT(r.id) as reply_count
        FROM comments c
        JOIN users u ON c.author_id = u.id
        LEFT JOIN comments r ON c.id = r.parent_id
        WHERE 1=1
      `;
      
      const params: any[] = [];
      let paramIndex = 0;
      
      // Filter by post
      if (post_id) {
        paramIndex++;
        query += ` AND c.post_id = $${paramIndex}`;
        params.push(post_id);
      }
      
      // Filter by author
      if (author_id) {
        paramIndex++;
        query += ` AND c.author_id = $${paramIndex}`;
        params.push(author_id);
      }
      
      // Only top-level comments (no replies in main list)
      query += ` AND c.parent_id IS NULL`;
      
      // Group by comment
      query += ` GROUP BY c.id, u.name, u.avatar_url`;
      
      // Sorting
      if (sort === 'oldest') {
        query += ` ORDER BY c.created_at ASC`;
      } else if (sort === 'popular') {
        query += ` ORDER BY c.likes_count DESC, c.created_at DESC`;
      } else {
        query += ` ORDER BY c.created_at DESC`;
      }
      
      // Pagination
      paramIndex++;
      query += ` LIMIT $${paramIndex}`;
      params.push(limit);
      
      paramIndex++;
      query += ` OFFSET $${paramIndex}`;
      params.push(offset);
      
      const result = await this.db.query(query, params);
      
      // Get total count
      let countQuery = `SELECT COUNT(*) as total FROM comments WHERE parent_id IS NULL`;
      const countParams: any[] = [];
      let countParamIndex = 0;
      
      if (post_id) {
        countParamIndex++;
        countQuery += ` AND post_id = $${countParamIndex}`;
        countParams.push(post_id);
      }
      
      if (author_id) {
        countParamIndex++;
        countQuery += ` AND author_id = $${countParamIndex}`;
        countParams.push(author_id);
      }
      
      const countResult = await this.db.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0]?.total || '0');
      const totalPages = Math.ceil(total / limit);
      
      res.json({
        success: true,
        data: result.rows.map((comment: any) => ({
          id: comment.id,
          postId: comment.post_id,
          content: comment.content,
          author: {
            id: comment.author_id,
            name: comment.author_name,
            avatarUrl: comment.author_avatar
          },
          likesCount: comment.likes_count || 0,
          replyCount: comment.reply_count || 0,
          parentId: comment.parent_id,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      });
    } catch (error) {
      logger.error('CommentController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve comments',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/comments/:id
   * Get single comment by ID with replies
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const query = `
        SELECT c.*, 
               u.name as author_name,
               u.avatar_url as author_avatar
        FROM comments c
        JOIN users u ON c.author_id = u.id
        WHERE c.id = $1
      `;
      
      const result = await this.db.query(query, [id]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Comment not found'
        });
        return;
      }

      // Get replies
      const repliesQuery = `
        SELECT r.*, 
               u.name as author_name,
               u.avatar_url as author_avatar
        FROM comments r
        JOIN users u ON r.author_id = u.id
        WHERE r.parent_id = $1
        ORDER BY r.created_at ASC
      `;
      
      const repliesResult = await this.db.query(repliesQuery, [id]);

      const comment = result.rows[0];

      res.json({
        success: true,
        data: {
          id: comment.id,
          postId: comment.post_id,
          content: comment.content,
          author: {
            id: comment.author_id,
            name: comment.author_name,
            avatarUrl: comment.author_avatar
          },
          likesCount: comment.likes_count || 0,
          parentId: comment.parent_id,
          createdAt: comment.created_at,
          updatedAt: comment.updated_at,
          replies: repliesResult.rows.map((reply: any) => ({
            id: reply.id,
            content: reply.content,
            author: {
              id: reply.author_id,
              name: reply.author_name,
              avatarUrl: reply.author_avatar
            },
            likesCount: reply.likes_count || 0,
            createdAt: reply.created_at
          }))
        }
      });
    } catch (error) {
      logger.error('CommentController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve comment',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/comments
   * Create new comment
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { postId, content, parentId } = req.body;

      if (!postId || !content) {
        res.status(400).json({
          success: false,
          message: 'Post ID and content are required'
        });
        return;
      }

      // If replying, check parent exists
      if (parentId) {
        const parentQuery = 'SELECT id FROM comments WHERE id = $1';
        const parentResult = await this.db.query(parentQuery, [parentId]);

        if (parentResult.rows.length === 0) {
          res.status(404).json({
            success: false,
            message: 'Parent comment not found'
          });
          return;
        }
      }

      const insertQuery = `
        INSERT INTO comments (post_id, author_id, content, parent_id, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(insertQuery, [postId, userId, content, parentId || null]);

      const comment = result.rows[0];

      res.status(201).json({
        success: true,
        message: 'Comment created successfully',
        data: {
          id: comment.id,
          postId: comment.post_id,
          content: comment.content,
          authorId: comment.author_id,
          parentId: comment.parent_id,
          createdAt: comment.created_at
        }
      });
    } catch (error) {
      logger.error('CommentController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create comment',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/comments/:id
   * Update comment
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { content } = req.body;

      if (!content) {
        res.status(400).json({
          success: false,
          message: 'Content is required'
        });
        return;
      }

      const updateQuery = `
        UPDATE comments 
        SET content = $1, updated_at = NOW()
        WHERE id = $2 AND author_id = $3
        RETURNING *
      `;
      
      const result = await this.db.query(updateQuery, [content, id, userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Comment not found or unauthorized'
        });
        return;
      }

      const comment = result.rows[0];

      res.json({
        success: true,
        message: 'Comment updated successfully',
        data: {
          id: comment.id,
          content: comment.content,
          updatedAt: comment.updated_at
        }
      });
    } catch (error) {
      logger.error('CommentController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update comment',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/comments/:id
   * Delete comment
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const deleteQuery = `
        DELETE FROM comments 
        WHERE id = $1 AND author_id = $2
        RETURNING id
      `;
      
      const result = await this.db.query(deleteQuery, [id, userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Comment not found or unauthorized'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Comment deleted successfully'
      });
    } catch (error) {
      logger.error('CommentController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete comment',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/comments/post/:postId
   * Get all comments for a specific post
   */
  async getByPost(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;

      const query = `
        SELECT c.*, 
               u.name as author_name,
               u.avatar_url as author_avatar,
               COUNT(r.id) as reply_count
        FROM comments c
        JOIN users u ON c.author_id = u.id
        LEFT JOIN comments r ON c.id = r.parent_id
        WHERE c.post_id = $1 AND c.parent_id IS NULL
        GROUP BY c.id, u.name, u.avatar_url
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await this.db.query(query, [postId, limit, offset]);

      const countQuery = 'SELECT COUNT(*) as total FROM comments WHERE post_id = $1 AND parent_id IS NULL';
      const countResult = await this.db.query(countQuery, [postId]);
      const total = parseInt(countResult.rows[0]?.total || '0');

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      logger.error('CommentController.getByPost error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve comments',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new CommentController();
