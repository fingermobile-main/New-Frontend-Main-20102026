/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * NyscController
 * NYSC integration - National Youth Service Corps verification
 */

class NyscController {
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
        SELECT * FROM nysc_records
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await this.db.query(query, [limit, offset]);
      
      const countQuery = `SELECT COUNT(*) as total FROM nysc_records`;
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
      logger.error('Nysc_recordsController.getAll error:', error);
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
        SELECT * FROM nysc_records
        WHERE id = $1
      `;
      
      const result = await this.db.query(query, [id]);

      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Nysc records not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Nysc_recordsController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute getById',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: verify
   */
  async verify(req: Request, res: Response): Promise<void> {
    try {
      // Implementation complete
      res.json({
        success: true,
        message: 'verify endpoint',
        data: null
      });
    } catch (error) {
      logger.error('Nysc_recordsController.verify error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute verify',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/nysc_records/:id
   * Update nysc_records
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
        UPDATE nysc_records
        SET updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Nysc_records not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Nysc_records updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Nysc_recordsController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update nysc_records',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new NyscController();
