/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * LendsqController
 * Lendsq integration - Loan management, credit scoring
 */

class LendsqController {
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
        SELECT * FROM lendsq_loans
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await this.db.query(query, [limit, offset]);
      
      const countQuery = `SELECT COUNT(*) as total FROM lendsq_loans`;
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
      logger.error('Lendsq_loansController.getAll error:', error);
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
        SELECT * FROM lendsq_loans
        WHERE id = $1
      `;
      
      const result = await this.db.query(query, [id]);

      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Lendsq loans not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Lendsq_loansController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute getById',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/lendsq_loans
   * Create new lendsq_loans
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
        INSERT INTO lendsq_loans (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, []);

      res.status(201).json({
        success: true,
        message: 'Lendsq_loans created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Lendsq_loansController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create lendsq_loans',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/lendsq_loans/:id
   * Update lendsq_loans
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
        UPDATE lendsq_loans
        SET updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Lendsq_loans not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Lendsq_loans updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Lendsq_loansController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update lendsq_loans',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new LendsqController();
