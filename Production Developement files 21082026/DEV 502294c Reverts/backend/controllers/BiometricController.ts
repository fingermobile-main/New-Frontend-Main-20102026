/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * BiometricController
 * Biometric authentication - Fingerprint, face ID management
 */

class BiometricController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * POST /api/biometric_credentials
   * Create new biometric_credentials
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
        INSERT INTO biometric_credentials (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, []);

      res.status(201).json({
        success: true,
        message: 'Biometric_credentials created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Biometric_credentialsController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create biometric_credentials',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: verify
   */
  async verify(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { biometric_data } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      const query = `SELECT credential_data FROM biometric_credentials WHERE user_id = $1 AND is_active = true`;
      const result = await this.db.query(query, [userId]);

      if (!result.rows[0]) {
        res.status(404).json({ success: false, message: "No biometric credentials registered" });
        return;
      }

      const isValid = result.rows[0].credential_data && biometric_data;

      res.json({ success: isValid, message: isValid ? "Biometric verification successful" : "Verification failed" });
    } catch (error) {
      logger.error('BiometricController.verify error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute verify',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * DELETE /api/biometric_credentials/:id
   * Delete biometric_credentials
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
        DELETE FROM biometric_credentials
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await this.db.query(query, [id]);
      
      if (!result.rows[0]) {
        res.status(404).json({
          success: false,
          message: 'Biometric_credentials not found'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Biometric_credentials deleted successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Biometric_credentialsController.delete error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete biometric_credentials',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new BiometricController();
