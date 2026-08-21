/**
 * Authenticator Controller
 * Complete implementation for 2FA/MFA authentication system
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const speakeasy = require('speakeasy');
const logger = require('../utils/logger');
const QRCode = require('qrcode');
const User = require('../models/user');

class AuthenticatorController {
  /**
   * POST /api/authenticator/setup
   * Setup 2FA for user - generates secret and QR code
   */
  async setup(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `FingerMobile (${req.user.email || userId})`,
        length: 20
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

      // Store secret temporarily (user must verify before enabling)
      res.json({
        success: true,
        data: {
          secret: secret.base32,
          qrCode: qrCodeUrl,
          otpauth_url: secret.otpauth_url
        }, message: 'Scan QR code with your authenticator app'
      });
    } catch (error) {
      logger.error('Error in AuthenticatorController.setup:', error);
      res.status(500).json({
        success: false, message: 'Failed to setup 2FA', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/authenticator/verify
   * Verify 2FA setup with token
   */
  async verify(req, res) {
    try {
      const userId = req.user?.id;
      const { token, secret } = req.body;

      if (!userId || !token || !secret) {
        return res.status(400).json({
          success: false, message: 'User ID, token, and secret are required'
        });
      }

      // Verify token
      const verified = speakeasy.totp.verify({
        secret: secret, encoding: 'base32',
        token: token,
        window: 2
      });

      if (!verified) {
        return res.status(400).json({
          success: false, message: 'Invalid verification code'
        });
      }

      // Enable 2FA for user
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false, message: 'User not found'
        });
      }

      await user.update({
        twoFactorEnabled: true,
        twoFactorSecret: secret
      });

      res.json({
        success: true, message: '2FA enabled successfully', data: {
          backupCodes: this.generateBackupCodes()
        }
      });
    } catch (error) {
      logger.error('Error in AuthenticatorController.verify:', error);
      res.status(500).json({
        success: false, message: 'Failed to verify 2FA', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/authenticator/disable
   * Disable 2FA for user
   */
  async disable(req, res) {
    try {
      const userId = req.user?.id;
      const { token } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const user = await User.findByPk(userId);
      if (!user || !user.twoFactorEnabled) {
        return res.status(400).json({
          success: false, message: '2FA is not enabled'
        });
      }

      // Verify current token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret, encoding: 'base32',
        token: token,
        window: 2
      });

      if (!verified) {
        return res.status(400).json({
          success: false, message: 'Invalid verification code'
        });
      }

      // Disable 2FA
      await user.update({
        twoFactorEnabled: false,
        twoFactorSecret: null
      });

      res.json({
        success: true, message: '2FA disabled successfully'
      });
    } catch (error) {
      logger.error('Error in AuthenticatorController.disable:', error);
      res.status(500).json({
        success: false, message: 'Failed to disable 2FA', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/authenticator/validate
   * Validate 2FA token during login
   */
  async validate(req, res) {
    try {
      const { userId, token } = req.body;

      if (!userId || !token) {
        return res.status(400).json({
          success: false, message: 'User ID and token are required'
        });
      }

      const user = await User.findByPk(userId);
      if (!user || !user.twoFactorEnabled) {
        return res.status(400).json({
          success: false, message: '2FA is not enabled for this user'
        });
      }

      // Verify token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret, encoding: 'base32',
        token: token,
        window: 2
      });

      if (!verified) {
        return res.status(400).json({
          success: false, message: 'Invalid verification code'
        });
      }

      res.json({
        success: true, message: '2FA validation successful'
      });
    } catch (error) {
      logger.error('Error in AuthenticatorController.validate:', error);
      res.status(500).json({
        success: false, message: 'Failed to validate 2FA', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/authenticator/status
   * Get 2FA status for current user
   */
  async getStatus(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const user = await User.findByPk(userId, {
        attributes: ['id', 'email', 'twoFactorEnabled']
      });

      if (!user) {
        return res.status(404).json({
          success: false, message: 'User not found'
        });
      }

      res.json({
        success: true, data: {
          enabled: user.twoFactorEnabled || false
        }
      });
    } catch (error) {
      logger.error('Error in AuthenticatorController.getStatus:', error);
      res.status(500).json({
        success: false, message: 'Failed to get 2FA status', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Generate backup codes for 2FA recovery
   */
  generateBackupCodes(count = 8) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }
}

module.exports = new AuthenticatorController();
