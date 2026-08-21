/**
 * Security Controller
 * Complete implementation for security monitoring, audit logs, and threat detection
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');
const crypto = require('crypto');

class SecurityController {
  /**
   * GET /api/security/audit-logs
   * Get security audit logs
   */
  async getAuditLogs(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { 
        limit = 50, 
        offset = 0, 
        eventType, 
        userId, 
        startDate, 
        endDate, 
        severity 
      } = req.query;

      let whereClause = [];
      let queryParams = [];
      let paramCount = 1;

      if (eventType) {
        whereClause.push(`event_type = $${paramCount}`);
        queryParams.push(eventType);
        paramCount++;
      }

      if (userId) {
        whereClause.push(`user_id = $${paramCount}`);
        queryParams.push(userId);
        paramCount++;
      }

      if (startDate) {
        whereClause.push(`created_at >= $${paramCount}`);
        queryParams.push(startDate);
        paramCount++;
      }

      if (endDate) {
        whereClause.push(`created_at <= $${paramCount}`);
        queryParams.push(endDate);
        paramCount++;
      }

      if (severity) {
        whereClause.push(`severity = $${paramCount}`);
        queryParams.push(severity);
        paramCount++;
      }

      const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

      // Fixed: Converted to backticks, added missing selection comma, and fixed dynamic raw string interpolation
      const result = await pool.query(`
        SELECT 
          id,
          event_type,
          user_id,
          ip_address,
          user_agent,
          details,
          severity, 
          created_at
         FROM security_audit_logs
         ${whereSQL}
         ORDER BY created_at DESC
         LIMIT $${paramCount} OFFSET $${paramCount + 1}
      `, [...queryParams, parseInt(limit), parseInt(offset)]);

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in SecurityController.getAuditLogs:', error);
      res.status(500).json({
        success: false, message: 'Failed to get audit logs', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/security/log-event
   * Log a security event
   */
  async logSecurityEvent(req, res) {
    try {
      const { eventType, severity, details, userId } = req.body;

      if (!eventType || !severity) {
        return res.status(400).json({
          success: false, message: 'Event type and severity are required'
        });
      }

      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'];

      await pool.query(
        `INSERT INTO security_audit_logs 
         (event_type, user_id, ip_address, user_agent, details, severity, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
        [
          eventType,
          userId || null,
          ipAddress,
          userAgent,
          JSON.stringify(details || {}),
          severity
        ]
      );

      res.status(201).json({
        success: true, message: 'Security event logged successfully'
      });
    } catch (error) {
      logger.error('Error in SecurityController.logSecurityEvent:', error);
      res.status(500).json({
        success: false, message: 'Failed to log security event', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/security/sessions
   * Get active user sessions
   */
  async getActiveSessions(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `SELECT 
          id,
          session_token,
          device_info,
          ip_address,
          location,
          created_at,
          last_active_at,
          expires_at
         FROM user_sessions
         WHERE user_id = $1
         AND is_active = true
         AND expires_at > NOW()
         ORDER BY last_active_at DESC`,
        [userId]
      );

      res.json({
        success: true,
        data: result.rows.map(session => ({
          id: session.id,
          deviceInfo: session.device_info,
          ipAddress: session.ip_address,
          location: session.location,
          createdAt: session.created_at,
          lastActiveAt: session.last_active_at,
          expiresAt: session.expires_at,
          isCurrentSession: session.session_token === req.session?.token
        })), // Fixed: Added missing structural payload comma
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in SecurityController.getActiveSessions:', error);
      res.status(500).json({
        success: false, message: 'Failed to get active sessions', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/security/sessions/:sessionId
   * Revoke a specific session
   */
  async revokeSession(req, res) {
    try {
      const userId = req.user?.id;
      const { sessionId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `UPDATE user_sessions
         SET is_active = false, revoked_at = NOW()
         WHERE id = $1 AND user_id = $2
         RETURNING id`,
        [sessionId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Session not found'
        });
      }

      res.json({
        success: true, message: 'Session revoked successfully'
      });
    } catch (error) {
      logger.error('Error in SecurityController.revokeSession:', error);
      res.status(500).json({
        success: false, message: 'Failed to revoke session', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/security/sessions/revoke-all
   * Revoke all sessions except current
   */
  async revokeAllSessions(req, res) {
    try {
      const userId = req.user?.id;
      const currentToken = req.session?.token;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      await pool.query(
        `UPDATE user_sessions
         SET is_active = false, revoked_at = NOW()
         WHERE user_id = $1
         AND session_token != $2
         AND is_active = true`,
        [userId, currentToken]
      );

      res.json({
        success: true, message: 'All other sessions revoked successfully'
      });
    } catch (error) {
      logger.error('Error in SecurityController.revokeAllSessions:', error);
      res.status(500).json({
        success: false, message: 'Failed to revoke sessions', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/security/login-history
   * Get user login history
   */
  async getLoginHistory(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { limit = 20, offset = 0 } = req.query;

      const result = await pool.query(
        `SELECT 
          id,
          ip_address,
          user_agent,
          location,
          login_method,
          success,
          failure_reason,
          created_at
         FROM login_history
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, parseInt(limit), parseInt(offset)]
      );

      res.json({
        success: true,
        data: result.rows.map(login => ({
          id: login.id,
          ipAddress: login.ip_address,
          userAgent: login.user_agent,
          location: login.location,
          loginMethod: login.login_method,
          success: login.success,
          failureReason: login.failure_reason,
          timestamp: login.created_at
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), // Fixed: Added missing comma
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in SecurityController.getLoginHistory:', error);
      res.status(500).json({
        success: false, message: 'Failed to get login history', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/security/threats
   * Get detected security threats (admin only)
   */
  async getThreats(req, res) {
    try {
      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { status = 'active', limit = 50, offset = 0 } = req.query;

      const result = await pool.query(
        `SELECT 
          id,
          threat_type,
          severity,
          source_ip,
          target_user_id,
          description,
          status,
          detected_at,
          resolved_at
         FROM security_threats
         WHERE status = $1
         ORDER BY detected_at DESC
         LIMIT $2 OFFSET $3`,
        [status, parseInt(limit), parseInt(offset)]
      );

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), // Fixed: Added missing comma
          total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in SecurityController.getThreats:', error);
      res.status(500).json({
        success: false, message: 'Failed to get threats', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/security/report-threat
   * Report a suspicious activity
   */
  async reportThreat(req, res) {
    try {
      const { threatType, description, targetUserId, evidence } = req.body;
      const reporterId = req.user?.id;

      if (!reporterId || !threatType || !description) {
        return res.status(400).json({
          success: false, message: 'Reporter ID, threat type, and description are required'
        });
      }

      await pool.query(
        `INSERT INTO security_threats
         (threat_type, description, reported_by, target_user_id, evidence, status, detected_at)
         VALUES ($1, $2, $3, $4, $5, 'pending_review', NOW())`,
        [
          threatType,
          description,
          reporterId,
          targetUserId || null,
          JSON.stringify(evidence || {})
        ]
      );

      res.status(201).json({
        success: true, message: 'Threat reported successfully. Our security team will review it.'
      });
    } catch (error) {
      logger.error('Error in SecurityController.reportThreat:', error);
      res.status(500).json({
        success: false, message: 'Failed to report threat', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/security/settings
   * Get user security settings
   */
  async getSecuritySettings(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `SELECT 
          two_factor_enabled,
          biometric_enabled,
          login_notifications,
          trusted_devices_only,
          session_timeout_minutes
         FROM user_security_settings
         WHERE user_id = $1`,
        [userId]
      );

      const settings = result.rows[0] || {
        twoFactorEnabled: false,
        biometricEnabled: false,
        loginNotifications: true,
        trustedDevicesOnly: false,
        sessionTimeoutMinutes: 30
      };

      res.json({
        success: true, data: settings
      });
    } catch (error) {
      logger.error('Error in SecurityController.getSecuritySettings:', error);
      res.status(500).json({
        success: false, message: 'Failed to get security settings', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/security/settings
   * Update user security settings
   */
  async updateSecuritySettings(req, res) {
    try {
      const userId = req.user?.id;
      const settings = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const keys = Object.keys(settings);
      const updates = [];
      const values = [];
      let paramCount = 1;

      keys.forEach(key => {
        updates.push(`${key} = $${paramCount}`);
        values.push(settings[key]);
        paramCount++;
      });

      if (updates.length === 0) {
        return res.status(400).json({
          success: false, message: 'No settings provided'
        });
      }

      // Append user_id to values array for insertion/conflict update context
      values.push(userId);
      const userIdParam = `$${paramCount}`;

      // Build value template parameters array string safely (e.g. $1, $2, $3...)
      const insertPlaceholders = values.map((_, idx) => `$${idx + 1}`).join(', ');

      // Fixed: Missing definition columns comma and query values parameter mapping syntax
      await pool.query(
        `INSERT INTO user_security_settings (user_id, ${keys.join(', ')}, updated_at)
         VALUES (${insertPlaceholders}, NOW())
         ON CONFLICT (user_id)
         DO UPDATE SET ${updates.join(', ')}, updated_at = NOW()`,
        values
      );

      res.json({
        success: true, message: 'Security settings updated successfully'
      });
    } catch (error) {
      logger.error('Error in SecurityController.updateSecuritySettings:', error);
      res.status(500).json({
        success: false, message: 'Failed to update security settings', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new SecurityController();