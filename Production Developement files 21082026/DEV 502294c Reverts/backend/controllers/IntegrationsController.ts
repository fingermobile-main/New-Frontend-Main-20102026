/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * IntegrationsController
 * Service integrations - API connections, webhooks
 */

class IntegrationsController {
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
        SELECT * FROM service_integrations
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await this.db.query(query, [limit, offset]);
      
      const countQuery = `SELECT COUNT(*) as total FROM service_integrations`;
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
      logger.error('Service_integrationsController.getAll error:', error);
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
        SELECT * FROM service_integrations
        WHERE id = $1
      `;
      
      const result = await this.db.query(query, [id]);

      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Service integrations not found'
        });
        return;
      }

      res.json({
        success: true,
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Service_integrationsController.getById error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute getById',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/service_integrations
   * Create new service_integrations
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
        INSERT INTO service_integrations (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, []);

      res.status(201).json({
        success: true,
        message: 'Service_integrations created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Service_integrationsController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create service_integrations',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * PUT /api/service_integrations/:id
   * Update service_integrations
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
        UPDATE service_integrations
        SET updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Service_integrations not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Service_integrations updated successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Service_integrationsController.update error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update service_integrations',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/service_integrations/:id
   * Delete service_integrations
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
        DELETE FROM service_integrations
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Service_integrations not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Service_integrations deleted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Service_integrationsController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete service_integrations',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new IntegrationsController();
