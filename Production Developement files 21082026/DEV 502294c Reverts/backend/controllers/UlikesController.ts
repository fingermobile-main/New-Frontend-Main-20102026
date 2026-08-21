import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * UlikesController
 * Likes/reactions system - Like, unlike, get likes for content
 */

class UlikesController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * POST /api/likes
   * Like a target (post, comment, etc.)
   */
  async like(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { targetType, targetId } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!targetType || !targetId) {
        res.status(400).json({
          success: false,
          message: 'Target type and ID are required'
        });
        return;
      }

      // Check if already liked
      const existingQuery = 'SELECT id FROM likes WHERE user_id = $1 AND target_type = $2 AND target_id = $3';
      const existingResult = await this.db.query(existingQuery, [userId, targetType, targetId]);

      if (existingResult.rows.length > 0) {
        res.status(400).json({
          success: false,
          message: 'Already liked'
        });
        return;
      }

      const insertQuery = `
        INSERT INTO likes (user_id, target_type, target_id, created_at)
        VALUES ($1, $2, $3, NOW())
      `;
      
      await this.db.query(insertQuery, [userId, targetType, targetId]);

      res.status(201).json({
        success: true,
        message: 'Liked successfully'
      });
    } catch (error) {
      logger.error('UlikesController.like error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to like',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/likes
   * Unlike a target
   */
  async unlike(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { targetType, targetId } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!targetType || !targetId) {
        res.status(400).json({
          success: false,
          message: 'Target type and ID are required'
        });
        return;
      }

      const deleteQuery = 'DELETE FROM likes WHERE user_id = $1 AND target_type = $2 AND target_id = $3 RETURNING id';
      const result = await this.db.query(deleteQuery, [userId, targetType, targetId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Like not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Unliked successfully'
      });
    } catch (error) {
      logger.error('UlikesController.unlike error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to unlike',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/likes/:targetType/:targetId
   * Get likes for a specific target
   */
  async getLikes(req: Request, res: Response): Promise<void> {
    try {
      const { targetType, targetId } = req.params;
      const userId = (req as any).user?.id;

      if (!targetType || !targetId) {
        res.status(400).json({
          success: false,
          message: 'Target type and ID are required'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;

      const query = `
        SELECT l.*, 
               u.id as liker_id,
               u.name as liker_name,
               u.avatar_url,
               CASE WHEN $4 IS NOT NULL THEN 
                 EXISTS(SELECT 1 FROM likes WHERE user_id = $4 AND target_type = $1 AND target_id = $2)
               ELSE false END as is_liked_by_user
        FROM likes l
        JOIN users u ON l.user_id = u.id
        WHERE l.target_type = $1 AND l.target_id = $2
        ORDER BY l.created_at DESC
        LIMIT $3 OFFSET $4
      `;
      
      const result = await this.db.query(query, [targetType, targetId, limit, userId || null]);

      const countQuery = 'SELECT COUNT(*) as total FROM likes WHERE target_type = $1 AND target_id = $2';
      const countResult = await this.db.query(countQuery, [targetType, targetId]);
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
      logger.error('UlikesController.getLikes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve likes',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/likes/count/:targetType/:targetId
   * Get like count for a target
   */
  async getLikeCount(req: Request, res: Response): Promise<void> {
    try {
      const { targetType, targetId } = req.params;

      if (!targetType || !targetId) {
        res.status(400).json({
          success: false,
          message: 'Target type and ID are required'
        });
        return;
      }

      const query = 'SELECT COUNT(*) as count FROM likes WHERE target_type = $1 AND target_id = $2';
      const result = await this.db.query(query, [targetType, targetId]);

      res.json({
        success: true,
        data: {
          count: parseInt(result.rows[0]?.count || '0')
        }
      });
    } catch (error) {
      logger.error('UlikesController.getLikeCount error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve like count',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/likes/my-likes
   * Get all items liked by current user
   */
  async getMyLikes(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;
      const { targetType } = req.query;

      let query = `
        SELECT l.*, 
               CASE 
                 WHEN l.target_type = 'post' THEN p.title
                 WHEN l.target_type = 'comment' THEN c.content
                 ELSE NULL
               END as target_preview
        FROM likes l
        LEFT JOIN posts p ON l.target_type = 'post' AND l.target_id = p.id
        LEFT JOIN comments c ON l.target_type = 'comment' AND l.target_id = c.id
        WHERE l.user_id = $1
      `;
      
      const params: any[] = [userId];
      let paramIndex = 2;

      if (targetType) {
        query += ` AND l.target_type = $${paramIndex}`;
        params.push(targetType);
        paramIndex++;
      }

      query += ` ORDER BY l.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(limit, offset);

      const result = await this.db.query(query, params);

      const countQuery = `
        SELECT COUNT(*) as total FROM likes WHERE user_id = $1
        ${targetType ? ` AND target_type = '${targetType}'` : ''}
      `;
      
      const countResult = await this.db.query(countQuery, [userId]);
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
      logger.error('UlikesController.getMyLikes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve liked items',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/likes/batch
   * Batch like/unlike multiple targets
   */
  async batchOperation(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { operations } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      if (!operations || !Array.isArray(operations)) {
        res.status(400).json({
          success: false,
          message: 'Operations array is required'
        });
        return;
      }

      const client = await this.db.connect();

      try {
        await client.query('BEGIN');

        const results = [];

        for (const op of operations) {
          const { action, targetType, targetId } = op;

          if (action === 'like') {
            // Check if already liked
            const existingQuery = 'SELECT id FROM likes WHERE user_id = $1 AND target_type = $2 AND target_id = $3';
            const existingResult = await client.query(existingQuery, [userId, targetType, targetId]);

            if (existingResult.rows.length === 0) {
              await client.query(
                'INSERT INTO likes (user_id, target_type, target_id, created_at) VALUES ($1, $2, $3, NOW())',
                [userId, targetType, targetId]
              );
              results.push({ targetType, targetId, action: 'liked', success: true });
            } else {
              results.push({ targetType, targetId, action: 'already_liked', success: false });
            }
          } else if (action === 'unlike') {
            const deleteResult = await client.query(
              'DELETE FROM likes WHERE user_id = $1 AND target_type = $2 AND target_id = $3 RETURNING id',
              [userId, targetType, targetId]
            );

            if (deleteResult.rows.length > 0) {
              results.push({ targetType, targetId, action: 'unliked', success: true });
            } else {
              results.push({ targetType, targetId, action: 'not_found', success: false });
            }
          }
        }

        await client.query('COMMIT');

        res.json({
          success: true,
          message: 'Batch operation completed',
          data: results
        });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('UlikesController.batchOperation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process batch operation',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new UlikesController();
