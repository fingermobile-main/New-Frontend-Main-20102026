/**
 * JWTRefreshService
 * Secure token refresh with rotation and blacklisting
 */

const jwt = require('jsonwebtoken');
const pool = require('../database/connection');
const logger = require('../utils/logger');

class JWTRefreshService {
  async rotateRefreshToken(oldRefreshToken, userId) {
    try {
      // Blacklist old token
      await this.blacklistToken(oldRefreshToken);

      // Generate new tokens
      const newAccessToken = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const newRefreshToken = jwt.sign(
        { userId, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      logger.error('Error rotating refresh token:', error);
      throw error;
    }
  }

  async blacklistToken(token) {
    await pool.query(
      'INSERT INTO token_blacklist (token, blacklisted_at) VALUES ($1, NOW())',
      [token]
    );
  }
}

module.exports = new JWTRefreshService();
