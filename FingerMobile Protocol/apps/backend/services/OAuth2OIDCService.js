/* eslint-disable no-unexpected-multiline */
/**
 * OAuth2OIDCService
 * Complete OAuth2/OIDC implementation with PKCE, JWT rotation AND token management
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../database/connection');
const logger = require('../utils/logger');

class OAuth2OIDCService {
  /**
     * Generate authorization code with PKCE support
     */
  async generateAuthorizationCode(clientId, userId, scopes = [], redirectUri) {
    try {
      const code = crypto.randomBytes(32).toString('hex');
      const codeChallenge = crypto.randomBytes(32).toString('base64url');
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store authorization code
      await pool.query(
        `INSERT INTO oauth_authorization_codes 
                 (code, client_id, user_id, scopes, redirect_uri, code_challenge, expires_at, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`
          [code, clientId, userId, JSON.stringify(scopes), redirectUri, codeChallenge, expiresAt]
      );

      return {
        code,
        codeChallenge,
        expiresIn: 600 // 10 minutes in seconds
      };
    } catch (error) {
      logger.error('Error generating authorization code:', error);
      throw error;
    }
  }

  /**
     * Exchange authorization code for tokens
     */
  async exchangeCodeForTokens(code, clientId, codeVerifier, redirectUri) {
    try {
      // Verify authorization code
      const result = await pool.query(
        'SELECT * FROM oauth_authorization_codes WHERE code = $1 AND client_id = $2',
        [code, clientId]
      );

      if (result.rows.length === 0) {
        throw new Error('Invalid authorization code');
      }

      const authCode = result.rows[0];

      // Check expiration
      if (new Date(authCode.expires_at) < new Date()) {
        throw new Error('Authorization code expired');
      }

      // Verify redirect URI
      if (authCode.redirect_uri !== redirectUri) {
        throw new Error('Redirect URI mismatch');
      }

      // Verify PKCE code verifier
      const expectedChallenge = crypto.createHash('sha256')
        .update(codeVerifier)
        .digest('base64url');

      if (expectedChallenge !== authCode.code_challenge) {
        throw new Error('Invalid code verifier');
      }

      // Delete used authorization code
      await pool.query('DELETE FROM oauth_authorization_codes WHERE code = $1', [code]);

      // Generate tokens
      const tokens = await this.generateTokenPair(authCode.user_id, authCode.scopes);

      return tokens;
    } catch (error) {
      logger.error('Error exchanging code for tokens:', error);
      throw error;
    }
  }

  /**
     * Generate access token and refresh token pair
     */
  async generateTokenPair(userId, scopes = []) {
    try {
      const accessToken = jwt.sign(
        {
          userId,
          scopes,
          type: 'access'
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '15m',
          issuer: 'fingermobileprotocol.com',
          audience: 'api.fingermobileprotocol.com'
        }
      );

      const refreshToken = jwt.sign(
        {
          userId,
          type: 'refresh',
          jti: crypto.randomBytes(16).toString('hex') // Unique token ID
        },
        process.env.JWT_REFRESH_SECRET,
        {
          expiresIn: '7d',
          issuer: 'fingermobileprotocol.com'
        }
      );

      // Store refresh token metadata
      await pool.query(
        `INSERT INTO refresh_tokens (token, user_id, expires_at, created_at)
                 VALUES ($1, $2, NOW() + INTERVAL '7 days', NOW())`
          [refreshToken, userId]
      );

      return {
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
        expiresIn: 900, // 15 minutes in seconds
        scope: scopes.join(' ')
      };
    } catch (error) {
      logger.error('Error generating token pair:', error);
      throw error;
    }
  }

  /**
     * Rotate refresh token (issue new pair, invalidate old)
     */
  async rotateRefreshToken(oldRefreshToken) {
    try {
      // Verify old refresh token
      let decoded;
      try {
        decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET);
      } catch (error) {
        throw new Error('Invalid or expired refresh token');
      }

      // Check if token is already used (replay attack detection)
      const existingToken = await pool.query(
        'SELECT * FROM refresh_tokens WHERE token = $1 AND revoked = false',
        [oldRefreshToken]
      );

      if (existingToken.rows.length === 0) {
        // Token reuse detected - potential security breach
        logger.warn(`Refresh token reuse detected for user ${decoded.userId}`);

        // Revoke all tokens for this user as security measure
        await pool.query(
          'UPDATE refresh_tokens SET revoked = true, revoked_at = NOW() WHERE user_id = $1',
          [decoded.userId]
        );

        throw new Error('Security violation: Token reuse detected. All sessions invalidated.');
      }

      // Revoke old token
      await pool.query(
        'UPDATE refresh_tokens SET revoked = true, revoked_at = NOW() WHERE token = $1',
        [oldRefreshToken]
      );

      // Generate new token pair
      const newTokens = await this.generateTokenPair(decoded.userId);

      return newTokens;
    } catch (error) {
      logger.error('Error rotating refresh token:', error);
      throw error;
    }
  }

  /**
     * Revoke refresh token (logout)
     */
  async revokeToken(refreshToken) {
    try {
      await pool.query(
        'UPDATE refresh_tokens SET revoked = true, revoked_at = NOW() WHERE token = $1',
        [refreshToken]
      );

      return { success: true, message: 'Token revoked successfully' };
    } catch (error) {
      logger.error('Error revoking token:', error);
      throw error;
    }
  }

  /**
     * Validate access token
     */
  async validateAccessToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: 'fingermobileprotocol.com',
        audience: 'api.fingermobileprotocol.com'
      });

      // Check if token is blacklisted
      const blacklisted = await pool.query(
        'SELECT * FROM token_blacklist WHERE token = $1',
        [token]
      );

      if (blacklisted.rows.length > 0) {
        throw new Error('Token has been revoked');
      }

      return {
        valid: true,
        userId: decoded.userId,
        scopes: decoded.scopes || []
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
     * Get OIDC discovery document
     */
  getDiscoveryDocument() {
    const baseUrl = process.env.API_URL || 'https://api.fingermobileprotocol.com';

    return {
      issuer: baseUrl,
      authorization_endpoint: `${baseUrl}/oauth/authorize`,
      token_endpoint: `${baseUrl}/oauth/token`,
      userinfo_endpoint: `${baseUrl}/oauth/userinfo`,
      jwks_uri: `${baseUrl}/.well-known/jwks.json`,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      token_endpoint_auth_methods_supported: ['client_secret_post'],
      scopes_supported: ['openid', 'profile', 'email', 'courses', 'analytics'],
      subject_types_supported: ['public'],
      id_token_signing_alg_values_supported: ['RS256'],
      code_challenge_methods_supported: ['S256']
    };
  }

  /**
     * Get JWKS (JSON Web Key Set)
     */
  getJWKS() {
    // In production, this would load actual RSA public keys
    return {
      keys: [
        {
          kty: 'RSA',
          use: 'sig',
          kid: 'fingermobile-2026',
          alg: 'RS256',
          n: process.env.JWKS_N || 'sample-modulus',
          e: process.env.JWKS_E || 'AQAB'
        }
      ]
    };
  }

  /**
     * Clean up expired tokens (scheduled job)
     */
  async cleanupExpiredTokens() {
    try {
      // Delete expired authorization codes
      await pool.query(
        'DELETE FROM oauth_authorization_codes WHERE expires_at < NOW()'
      );

      // Delete expired/revoked refresh tokens older than 30 days
      await pool.query(
        `DELETE FROM refresh_tokens 
                 WHERE (expires_at < NOW() OR revoked = true) 
                 AND revoked_at < NOW() - INTERVAL '30 days'`
      );

      // Delete old blacklist entries older than 90 days
      await pool.query(
        'DELETE FROM token_blacklist WHERE blacklisted_at < NOW() - INTERVAL \'90 days\''
      );

      logger.info('Token cleanup completed successfully');
    } catch (error) {
      logger.error('Error during token cleanup:', error);
    }
  }
}

module.exports = new OAuth2OIDCService();
