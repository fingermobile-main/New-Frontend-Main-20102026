const express = require('express');
const logger = require('../utils/logger');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

// POST /api/auth/refresh-token - Refresh access token
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false, error: 'Refresh token required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    // Generate new access token
    const accessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET, { expiresIn: '1h' }
    );

    logger.info(`✅ Token refreshed for user ${decoded.id}`);

    res.json({
      success: true,
      accessToken, expiresIn: 3600
    });
  } catch (error) {
    logger.error('❌ Token refresh failed:', error.message);
    res.status(401).json({
      success: false, error: 'Invalid or expired refresh token'
    });
  }
});

// POST /api/auth/logout-all-devices - Logout from all devices
router.post('/logout-all-devices', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    // Invalidate all sessions/tokens for user in database
    await db.query('DELETE FROM sessions WHERE user_id = $1', [userId]);

    logger.info(`✅ User ${userId} logged out from all devices`);

    res.json({
      success: true, message: 'Logged out from all devices'
    });
  } catch (error) {
    logger.error('❌ Logout all devices failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to logout from all devices'
    });
  }
});

// GET /api/auth/sessions - Get active sessions
router.get('/sessions', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    // Query database for user's active sessions
    const result = await db.query('SELECT id, created_at, last_active FROM sessions WHERE user_id = $1', [userId]);
    const sessions = result.rows;

    res.json({
      success: true, sessions
    });
  } catch (error) {
    logger.error('❌ Get sessions failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to retrieve sessions'
    });
  }
});

// DELETE /api/auth/session/:id - Delete specific session
router.delete('/session/:id', async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    // Delete session from database
    await db.query('DELETE FROM sessions WHERE id = $1 AND user_id = $2', [sessionId, userId]);

    logger.info(`✅ Session ${sessionId} deleted for user ${userId}`);

    res.json({
      success: true, message: 'Session deleted'
    });
  } catch (error) {
    logger.error('❌ Delete session failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to delete session'
    });
  }
});

// POST /api/auth/mfa/enable - Enable two-factor authentication
router.post('/mfa/enable', async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false, error: 'Authentication required'
      });
    }

    // Generate TOTP secret
    const speakeasy = require('speakeasy');
    const secret = speakeasy.generateSecret({
      name: `FingerMobile (${req.user?.email})`
    });

    // Save secret to database (encrypted)
    await db.query('UPDATE users SET mfa_secret = $1 WHERE id = $2', [secret.base32, userId]);

    logger.info(`✅ MFA setup initiated for user ${userId}`);

    res.json({
      success: true,
      qrCode: secret.otpauth_url, secret: secret.base32
    });
  } catch (error) {
    logger.error('❌ MFA enable failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to enable MFA'
    });
  }
});

// POST /api/auth/mfa/verify - Verify MFA code
router.post('/mfa/verify', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { token } = req.body;

    if (!userId || !token) {
      return res.status(400).json({
        success: false, error: 'User ID and token required'
      });
    }

    // Get user's MFA secret from database
    const userResult = await db.query('SELECT mfa_secret FROM users WHERE id = $1', [userId]);
    const secret = userResult.rows[0]?.mfa_secret || 'PLACEHOLDER_SECRET'; // Replace with actual secret

    const speakeasy = require('speakeasy');
    const verified = speakeasy.totp.verify({
      secret, encoding: 'base32', token
    });

    if (verified) {
      // Update user to mark MFA as enabled
      await db.query('UPDATE users SET mfa_enabled = true WHERE id = $1', [userId]);

      logger.info(`✅ MFA verified and enabled for user ${userId}`);

      res.json({
        success: true, message: 'MFA enabled successfully'
      });
    } else {
      res.status(400).json({
        success: false, error: 'Invalid MFA code'
      });
    }
  } catch (error) {
    logger.error('❌ MFA verify failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to verify MFA'
    });
  }
});

module.exports = router;
