/**
 * User Consent Controller
 * FingerMobile Protocol™ Sovereign Operations Control Plane
 * Implements NDPA 2023 Section 31, GDPR Art. 6/9, and EU AI Act Art. 52
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

const DEFAULT_FLAGS = {
  essential: true,
  functional: false,
  analytics: false,
  marketing: false,
  ai_training: false
};

const userConsentController = {
  /**
   * GET /api/v1/users/consent
   * Retrieve current consent flags for user
   */
  async getConsent(req, res) {
    try {
      const userId = req.user?.id || req.query.user_id || 'anonymous_user';

      const query = `
        SELECT consent_version, flags, has_consented, updated_at
        FROM platform_user_consents
        WHERE user_id = $1
        LIMIT 1;
      `;
      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        return res.json({
          success: true,
          consent_version: 0,
          has_consented: false,
          flags: DEFAULT_FLAGS,
          updated_at: new Date().toISOString()
        });
      }

      const row = result.rows[0];
      return res.json({
        success: true,
        consent_version: row.consent_version,
        has_consented: row.has_consented,
        flags: { ...DEFAULT_FLAGS, ...(row.flags || {}), essential: true },
        updated_at: row.updated_at
      });
    } catch (err) {
      logger.error('Error fetching user consent:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve user consent records',
        flags: DEFAULT_FLAGS
      });
    }
  },

  /**
   * POST /api/v1/users/consent
   * Record or update user consent flags
   */
  async updateConsent(req, res) {
    try {
      const userId = req.user?.id || req.body.user_id || 'anonymous_user';
      const inputFlags = req.body.flags || {};
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const sanitizedFlags = {
        essential: true, // Non-negotiable regulatory baseline
        functional: Boolean(inputFlags.functional),
        analytics: Boolean(inputFlags.analytics),
        marketing: Boolean(inputFlags.marketing),
        ai_training: Boolean(inputFlags.ai_training)
      };

      const upsertQuery = `
        INSERT INTO platform_user_consents (user_id, consent_version, flags, has_consented, ip_address, user_agent, updated_at)
        VALUES ($1, 1, $2, true, $3, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id)
        DO UPDATE SET
          consent_version = platform_user_consents.consent_version + 1,
          flags = $2,
          has_consented = true,
          ip_address = $3,
          user_agent = $4,
          updated_at = CURRENT_TIMESTAMP
        RETURNING consent_version, flags, updated_at;
      `;

      const result = await pool.query(upsertQuery, [
        userId,
        JSON.stringify(sanitizedFlags),
        ipAddress,
        userAgent
      ]);

      const updated = result.rows[0];

      // Record immutable audit event (NDPA 2023 / GDPR WORM compliance)
      await pool.query(
        `INSERT INTO platform_consent_audit_logs (user_id, action, flags, legal_basis, ip_address, user_agent)
         VALUES ($1, 'CONSENT_UPDATED', $2, $3, $4, $5);`,
        [
          userId,
          JSON.stringify(sanitizedFlags),
          sanitizedFlags.ai_training
            ? 'NDPA 2023 Section 31 + EU AI Act Art. 52 Explicit Consent'
            : 'NDPA 2023 Section 31 + GDPR Art. 6(1)(a)',
          ipAddress,
          userAgent
        ]
      ).catch(e => logger.warn('Failed to write consent audit log:', e));

      return res.json({
        success: true,
        message: 'Consent preferences recorded and persisted to PostgreSQL',
        consent_version: updated.consent_version,
        flags: updated.flags,
        updated_at: updated.updated_at
      });
    } catch (err) {
      logger.error('Error recording user consent:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to record user consent preferences'
      });
    }
  },

  /**
   * GET /api/v1/users/consent/export
   * Export user consent & audit logs for data portability (GDPR Art. 20)
   */
  async exportConsent(req, res) {
    try {
      const userId = req.user?.id || req.query.user_id || 'anonymous_user';

      const consentResult = await pool.query(
        `SELECT * FROM platform_user_consents WHERE user_id = $1 LIMIT 1;`,
        [userId]
      );

      const auditResult = await pool.query(
        `SELECT * FROM platform_consent_audit_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50;`,
        [userId]
      );

      return res.json({
        success: true,
        user_id: userId,
        exported_at: new Date().toISOString(),
        current_consent: consentResult.rows[0] || null,
        audit_trail: auditResult.rows
      });
    } catch (err) {
      logger.error('Error exporting consent data:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to export consent records'
      });
    }
  },

  /**
   * POST /api/v1/users/consent/revoke
   * Revoke all non-essential consent flags
   */
  async revokeConsent(req, res) {
    try {
      const userId = req.user?.id || req.body.user_id || 'anonymous_user';
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Unknown';

      const revokedFlags = {
        essential: true,
        functional: false,
        analytics: false,
        marketing: false,
        ai_training: false
      };

      const result = await pool.query(
        `UPDATE platform_user_consents
         SET flags = $2,
             consent_version = consent_version + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $1
         RETURNING consent_version, flags, updated_at;`,
        [userId, JSON.stringify(revokedFlags)]
      );

      await pool.query(
        `INSERT INTO platform_consent_audit_logs (user_id, action, flags, legal_basis, ip_address, user_agent)
         VALUES ($1, 'CONSENT_REVOKED', $2, 'GDPR Art. 7(3) & NDPA 2023 Consent Revocation', $3, $4);`,
        [userId, JSON.stringify(revokedFlags), ipAddress, userAgent]
      ).catch(e => logger.warn('Failed to write revocation audit log:', e));

      return res.json({
        success: true,
        message: 'All non-essential consent privileges revoked',
        flags: revokedFlags
      });
    } catch (err) {
      logger.error('Error revoking consent:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to revoke consent'
      });
    }
  }
};

module.exports = userConsentController;
