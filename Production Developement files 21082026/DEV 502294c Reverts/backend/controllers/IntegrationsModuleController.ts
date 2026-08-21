/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * IntegrationsModuleController
 * Integration modules - Plugin system, extensions
 */

class IntegrationsModuleController {
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
        SELECT * FROM integrations
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await this.db.query(query, [limit, offset]);
      
      const countQuery = `SELECT COUNT(*) as total FROM integrations`;
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
      logger.error('IntegrationsController.getAll error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute getAll',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/integrations
   * Create new integrations
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
        INSERT INTO integrations (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, []);

      res.status(201).json({
        success: true,
        message: 'Integrations created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('IntegrationsController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create integrations',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/integrations/:id
   * Update integrations
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
        UPDATE integrations
        SET updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Integrations not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Integrations updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('IntegrationsController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update integrations',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/integrations/:id
   * Delete integrations
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
        DELETE FROM integrations
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Integrations not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Integrations deleted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('IntegrationsController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete integrations',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new IntegrationsModuleController();
