import { Request, Response } from 'express';
import logger from '../utils/logger';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { Pool } from 'pg';

/**
 * UauthenticatorController
 * Two-Factor Authentication (2FA/MFA) management
 */

class UauthenticatorController {
  private identityDb: Pool;

  constructor() {
    this.identityDb = new Pool({
      connectionString: process.env.IDENTITY_DATABASE_URL
    });
  }

  /**
   * Generate backup codes for 2FA recovery
   */
  private generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  /**
   * POST /api/authenticator/setup
   * Setup 2FA for user - generates secret and QR code
   */
  async setup(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const userEmail = (req as any).user?.email;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `FingerMobile (${userEmail || userId})`,
        length: 20
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      res.json({
        success: true,
        data: {
          secret: secret.base32,
          qrCode: qrCodeUrl,
          otpauth_url: secret.otpauth_url
        },
        message: 'Scan QR code with your authenticator app'
      });
    } catch (error) {
      logger.error('UauthenticatorController.setup error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to setup 2FA',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/authenticator/verify
   * Verify 2FA setup with token
   */
  async verify(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { token, secret } = req.body;

      if (!userId || !token || !secret) {
        res.status(400).json({
          success: false,
          message: 'User ID, token, and secret are required'
        });
        return;
      }

      // Verify token
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      if (!verified) {
        res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
        return;
      }

      // Enable 2FA for user
      const updateQuery = `
        UPDATE users 
        SET two_factor_enabled = true, 
            two_factor_secret = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING id, email, two_factor_enabled
      `;
      
      const result = await this.identityDb.query(updateQuery, [secret, userId]);

      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      // Store backup codes (encrypted in production)
      const backupCodesQuery = `
        INSERT INTO user_backup_codes (user_id, codes, created_at)
        VALUES ($1, $2, NOW())
      `;
      
      await this.identityDb.query(backupCodesQuery, [userId, JSON.stringify(backupCodes)]);

      res.json({
        success: true,
        message: '2FA enabled successfully',
        data: {
          backupCodes: backupCodes,
          user: result.rows[0]
        }
      });
    } catch (error) {
      logger.error('UauthenticatorController.verify error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify 2FA',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/authenticator/disable
   * Disable 2FA for user
   */
  async disable(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { token } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      // Get user's 2FA secret
      const userQuery = 'SELECT id, two_factor_enabled, two_factor_secret FROM users WHERE id = $1';
      const userResult = await this.identityDb.query(userQuery, [userId]);

      if (userResult.rows.length === 0 || !userResult.rows[0].two_factor_enabled) {
        res.status(400).json({
          success: false,
          message: '2FA is not enabled'
        });
        return;
      }

      const user = userResult.rows[0];

      // Verify current token
      const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      if (!verified) {
        res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
        return;
      }

      // Disable 2FA
      const updateQuery = `
        UPDATE users 
        SET two_factor_enabled = false, 
            two_factor_secret = NULL,
            updated_at = NOW()
        WHERE id = $1
        RETURNING id, email, two_factor_enabled
      `;
      
      await this.identityDb.query(updateQuery, [userId]);

      // Delete backup codes
      await this.identityDb.query('DELETE FROM user_backup_codes WHERE user_id = $1', [userId]);

      res.json({
        success: true,
        message: '2FA disabled successfully'
      });
    } catch (error) {
      logger.error('UauthenticatorController.disable error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to disable 2FA',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/authenticator/validate
   * Validate 2FA token during login
   */
  async validate(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { token } = req.body;

      if (!userId || !token) {
        res.status(400).json({
          success: false,
          message: 'User ID and token are required'
        });
        return;
      }

      // Get user's 2FA secret
      const userQuery = 'SELECT id, two_factor_enabled, two_factor_secret FROM users WHERE id = $1';
      const userResult = await this.identityDb.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      const user = userResult.rows[0];

      if (!user.two_factor_enabled) {
        res.status(400).json({
          success: false,
          message: '2FA is not enabled for this user'
        });
        return;
      }

      // Check if it's a backup code
      const backupCodesQuery = 'SELECT codes FROM user_backup_codes WHERE user_id = $1';
      const backupCodesResult = await this.identityDb.query(backupCodesQuery, [userId]);

      if (backupCodesResult.rows.length > 0) {
        const backupCodes: string[] = JSON.parse(backupCodesResult.rows[0].codes);
        const codeIndex = backupCodes.indexOf(token.toUpperCase());

        if (codeIndex !== -1) {
          // Remove used backup code
          backupCodes.splice(codeIndex, 1);
          
          const updateBackupCodesQuery = `
            UPDATE user_backup_codes 
            SET codes = $1, updated_at = NOW()
            WHERE user_id = $2
          `;
          
          await this.identityDb.query(updateBackupCodesQuery, [JSON.stringify(backupCodes), userId]);

          res.json({
            success: true,
            message: 'Backup code validated successfully',
            data: {
              usedBackupCode: true,
              remainingCodes: backupCodes.length
            }
          });
          return;
        }
      }

      // Verify TOTP token
      const verified = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      if (!verified) {
        res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
        return;
      }

      res.json({
        success: true,
        message: '2FA token validated successfully',
        data: {
          usedBackupCode: false
        }
      });
    } catch (error) {
      logger.error('UauthenticatorController.validate error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to validate 2FA token',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * GET /api/authenticator/status
   * Get 2FA status for user
   */
  async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
        return;
      }

      const userQuery = 'SELECT id, two_factor_enabled FROM users WHERE id = $1';
      const userResult = await this.identityDb.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      const user = userResult.rows[0];

      // Get backup codes count if enabled
      let backupCodesCount = 0;
      if (user.two_factor_enabled) {
        const backupCodesQuery = 'SELECT codes FROM user_backup_codes WHERE user_id = $1';
        const backupCodesResult = await this.identityDb.query(backupCodesQuery, [userId]);
        
        if (backupCodesResult.rows.length > 0) {
          const backupCodes: string[] = JSON.parse(backupCodesResult.rows[0].codes);
          backupCodesCount = backupCodes.length;
        }
      }

      res.json({
        success: true,
        data: {
          enabled: user.two_factor_enabled,
          backupCodesRemaining: backupCodesCount
        }
      });
    } catch (error) {
      logger.error('UauthenticatorController.getStatus error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get 2FA status',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }

  /**
   * POST /api/authenticator/regenerate-backup-codes
   * Regenerate backup codes
   */
  async regenerateBackupCodes(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { token } = req.body;

      if (!userId || !token) {
        res.status(400).json({
          success: false,
          message: 'User ID and current 2FA token are required'
        });
        return;
      }

      // Verify current token first
      const userQuery = 'SELECT two_factor_secret FROM users WHERE id = $1 AND two_factor_enabled = true';
      const userResult = await this.identityDb.query(userQuery, [userId]);

      if (userResult.rows.length === 0) {
        res.status(400).json({
          success: false,
          message: '2FA is not enabled'
        });
        return;
      }

      const verified = speakeasy.totp.verify({
        secret: userResult.rows[0].two_factor_secret,
        encoding: 'base32',
        token: token,
        window: 2
      });

      if (!verified) {
        res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
        return;
      }

      // Generate new backup codes
      const newBackupCodes = this.generateBackupCodes();

      // Update backup codes
      const updateQuery = `
        INSERT INTO user_backup_codes (user_id, codes, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET codes = $2, updated_at = NOW()
      `;
      
      await this.identityDb.query(updateQuery, [userId, JSON.stringify(newBackupCodes)]);

      res.json({
        success: true,
        message: 'Backup codes regenerated successfully',
        data: {
          backupCodes: newBackupCodes
        }
      });
    } catch (error) {
      logger.error('UauthenticatorController.regenerateBackupCodes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to regenerate backup codes',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  }
}

export default new UauthenticatorController();
