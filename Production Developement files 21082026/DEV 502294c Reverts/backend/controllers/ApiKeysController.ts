/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * ApiKeysController
 * API key management - Create, revoke, manage API keys
 */

class ApiKeysController {
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
        SELECT * FROM api_keys
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await this.db.query(query, [limit, offset]);
      
      const countQuery = `SELECT COUNT(*) as total FROM api_keys`;
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
      logger.error('Api_keysController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute getAll',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: getById
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const query = `
        SELECT * FROM api_keys
        WHERE id = $1
      `;
      
      const result = await this.db.query(query, [id]);

      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Api keys not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Api_keysController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute getById',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/api_keys
   * Create new api_keys
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
        INSERT INTO api_keys (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, []);

      res.status(201).json({
        success: true,
        message: 'Api_keys created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Api_keysController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create api_keys',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/api_keys/:id
   * Update api_keys
   */
  async update(req: Request, res: Response): Promise<void> {
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
      const updates = req.body;
      
      const query = `
        UPDATE api_keys
        SET updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Api_keys not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Api_keys updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Api_keysController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update api_keys',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/api_keys/:id
   * Delete api_keys
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
        DELETE FROM api_keys
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Api_keys not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Api_keys deleted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Api_keysController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete api_keys',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new ApiKeysController();
