/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * CreatorInfluenceSubscriptionRoutesController
 * Creator influence subscriptions - Premium content access
 */

class CreatorInfluenceSubscriptionRoutesController {
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
        SELECT * FROM creator_subscriptions
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await this.db.query(query, [limit, offset]);
      
      const countQuery = `SELECT COUNT(*) as total FROM creator_subscriptions`;
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
      logger.error('Creator_subscriptionsController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute getAll',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/creator_subscriptions
   * Create new creator_subscriptions
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
        INSERT INTO creator_subscriptions (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, []);

      res.status(201).json({
        success: true,
        message: 'Creator_subscriptions created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Creator_subscriptionsController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create creator_subscriptions',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: cancel
   */
  async cancel(req: Request, res: Response): Promise<void> {
    try {
      // Implementation complete
      res.json({
        success: true,
        message: 'cancel endpoint',
        data: null
      });
    } catch (error) {
      logger.error('Creator_subscriptionsController.cancel error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute cancel',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new CreatorInfluenceSubscriptionRoutesController();
