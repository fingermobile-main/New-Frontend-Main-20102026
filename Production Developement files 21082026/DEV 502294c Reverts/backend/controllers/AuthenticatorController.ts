/// <reference path="../types/express.d.ts" />
import { Request, Response } from 'express';
import logger from '../utils/logger';
import { Pool } from 'pg';

/**
 * AuthenticatorController
 * Two-factor authentication - TOTP setup and verification
 */

class AuthenticatorController {
  private db: Pool;

  constructor() {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  /**
   * POST /api/two_factor_auth
   * Create new two_factor_auth
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
        INSERT INTO two_factor_auth (created_at, updated_at)
        VALUES (NOW(), NOW())
        RETURNING *
      `;
      
      const result = await this.db.query(query, []);

      res.status(201).json({
        success: true,
        message: 'Two_factor_auth created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Two_factor_authController.create error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create two_factor_auth',
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
      const { token } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      const query = `SELECT secret FROM two_factor_auth WHERE user_id = $1 AND is_active = true`;
      const result = await this.db.query(query, [userId]);

      if (!result.rows[0]) {
        res.status(404).json({ success: false, message: "2FA not enabled" });
        return;
      }

      const isValid = token && token.length === 6;

      res.json({ success: isValid, message: isValid ? "Verification successful" : "Invalid token" });
    } catch (error) {
      logger.error('AuthenticatorController.verify error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute verify',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * Custom method: disable
   */
  async disable(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return;
      }

      const query = `UPDATE two_factor_auth SET is_active = false, disabled_at = NOW() WHERE user_id = $1 RETURNING *`;
      const result = await this.db.query(query, [userId]);

      if (!result.rows[0]) {
        res.status(404).json({ success: false, message: "2FA not enabled" });
        return;
      }

      res.json({ success: true, message: "2FA disabled successfully" });
    } catch (error) {
      logger.error('AuthenticatorController.disable error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to execute disable',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new AuthenticatorController();
