/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * BlockingController
 * User blocking system - Block/unblock users
 */

class BlockingController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * Custom method: getAll
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const offset = (page - 1) * limit;
      
      const query = `
        SELECT * FROM user_blocks
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await this.db.query(query, [limit, offset]);
      
      const countQuery = `SELECT COUNT(*) as total FROM user_blocks`;
      const countResult = await this.db.query(countQuery);
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
      logger.error('User_blocksController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute getAll',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/user_blocks
   * Create new user_blocks
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

      const data = req.body;
      
      const query = `
        INSERT INTO user_blocks (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, []);

      res.status(201).json({
        success: true,
        message: 'User_blocks created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('User_blocksController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create user_blocks',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/user_blocks/:id
   * Delete user_blocks
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const { id } = req.params;
      
      const query = `
        DELETE FROM user_blocks
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'User_blocks not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'User_blocks deleted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('User_blocksController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user_blocks',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new BlockingController();
