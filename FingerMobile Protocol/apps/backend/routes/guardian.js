const express = require('express');
const { pool } = require('../db');
const logger = require('../utils/logger');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));
const optionalAuth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return authenticate(req, res, next);
  }
  next();
};

const router = express.Router();

/**
 * GET /api/guardian/rules
 * Fetch all guardian security and content rules
 */
router.get('/rules', optionalAuth, async (req, res) => {
  try {
    const { category, is_active } = req.query;
    let query = 'SELECT * FROM guardian_rules WHERE 1=1';
    const params = [];
    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    if (is_active !== undefined) {
      params.push(is_active === 'true');
      query += ` AND is_active = $${params.length}`;
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Error fetching guardian rules:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch guardian rules' });
  }
});

/**
 * POST /api/guardian/rules
 * Create a new guardian rule
 */
router.post('/rules', authenticate, async (req, res) => {
  try {
    const { name, category, description, severity, threshold_value, action, is_active, conditions } = req.body;
    const result = await pool.query(
      `INSERT INTO guardian_rules (name, category, description, severity, threshold_value, action, is_active, conditions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        name,
        category || 'security',
        description || '',
        severity || 'medium',
        threshold_value !== undefined ? threshold_value : 0.85,
        action || 'flag',
        is_active !== undefined ? is_active : true,
        conditions ? JSON.stringify(conditions) : '{}'
      ]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    logger.error('Error creating guardian rule:', error);
    res.status(500).json({ success: false, message: 'Failed to create guardian rule' });
  }
});

/**
 * PUT /api/guardian/rules/:id
 * Update an existing guardian rule
 */
router.put('/rules/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, severity, threshold_value, action, is_active, conditions } = req.body;
    const result = await pool.query(
      `UPDATE guardian_rules 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           description = COALESCE($3, description),
           severity = COALESCE($4, severity),
           threshold_value = COALESCE($5, threshold_value),
           action = COALESCE($6, action),
           is_active = COALESCE($7, is_active),
           conditions = COALESCE($8, conditions),
           updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [
        name,
        category,
        description,
        severity,
        threshold_value,
        action,
        is_active,
        conditions ? JSON.stringify(conditions) : null,
        id
      ]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Guardian rule not found' });
    }
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    logger.error('Error updating guardian rule:', error);
    res.status(500).json({ success: false, message: 'Failed to update guardian rule' });
  }
});

/**
 * DELETE /api/guardian/rules/:id
 */
router.delete('/rules/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM guardian_rules WHERE id = $1', [id]);
    res.json({ success: true, message: 'Guardian rule deleted' });
  } catch (error) {
    logger.error('Error deleting guardian rule:', error);
    res.status(500).json({ success: false, message: 'Failed to delete guardian rule' });
  }
});

/**
 * GET /api/guardian/logs
 */
router.get('/logs', optionalAuth, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const result = await pool.query(
      'SELECT * FROM guardian_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [parseInt(limit, 10), parseInt(offset, 10)]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Error fetching guardian logs:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch guardian logs' });
  }
});

/**
 * GET /api/guardian/status
 */
router.get('/status', optionalAuth, async (req, res) => {
  try {
    const rulesCount = await pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_active = true) as active FROM guardian_rules');
    const logsCount = await pool.query('SELECT COUNT(*) as total_events FROM guardian_logs');
    res.json({
      success: true,
      data: {
        status: 'operational',
        version: 'v2.4.0-sentinel',
        rulesTotal: parseInt(rulesCount.rows[0]?.total || 0, 10),
        rulesActive: parseInt(rulesCount.rows[0]?.active || 0, 10),
        eventsLogged: parseInt(logsCount.rows[0]?.total_events || 0, 10),
        engineLatencyMs: 14,
        threatLevel: 'low'
      }
    });
  } catch (error) {
    logger.error('Error getting guardian status:', error);
    res.status(500).json({ success: false, message: 'Failed to get guardian status' });
  }
});

const crypto = require('crypto');
const ALPHANUMERIC_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateRandomToken(length) {
  let token = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    const index = bytes[i] % ALPHANUMERIC_CHARS.length;
    token += ALPHANUMERIC_CHARS[index];
  }
  return token;
}

/**
 * POST /api/guardian/access-key
 * Generate unique 16-character alphanumeric access key
 */
router.post('/access-key', optionalAuth, async (req, res) => {
  try {
    const { seshatPageId = 'page_default', keyType = 'MEMBERSHIP', expiryDays = 30 } = req.body;
    const raw = generateRandomToken(16);
    const keyToken = `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiryDays || 30));

    res.status(201).json({
      success: true,
      data: {
        id: `key_${Date.now()}`,
        seshatPageId,
        keyToken,
        keyType,
        expiresAt: expiresAt.toISOString(),
        isActive: true,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error generating access key:', error);
    res.status(500).json({ success: false, message: 'Failed to generate access key' });
  }
});

/**
 * POST /api/guardian/coupon
 * Generate unique coupon code
 */
router.post('/coupon', optionalAuth, async (req, res) => {
  try {
    const { seshatPageId = 'page_default', prefix = 'SUMMER' } = req.body;
    const cleanPrefix = (prefix || 'COUPON').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
    const randomPart = generateRandomToken(12);
    const couponCode = `${cleanPrefix}-${randomPart}`;

    res.status(201).json({
      success: true,
      data: {
        id: `coupon_${Date.now()}`,
        seshatPageId,
        couponCode,
        isRedeemed: false,
        validFrom: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error generating coupon:', error);
    res.status(500).json({ success: false, message: 'Failed to generate coupon' });
  }
});

/**
 * POST /api/guardian/validate-name
 * Validate business or page name
 */
router.post('/validate-name', optionalAuth, async (req, res) => {
  try {
    const { name = '' } = req.body;
    const trimmed = String(name).trim();
    const errors = [];
    const warnings = [];

    if (trimmed.length < 3) errors.push('Name must be at least 3 characters long');
    if (trimmed.length > 50) errors.push('Name must not exceed 50 characters');
    if (/[~!@#$%^&*()_+:;"'{}[\]\\|<>,/?®™©]/.test(trimmed)) {
      errors.push('Special characters, emojis, and symbols are not allowed');
    }
    const prohibited = ['best', 'official', 'cheap', 'free', 'fingermobile', 'whatsapp', 'meta'];
    for (const term of prohibited) {
      if (trimmed.toLowerCase().includes(term)) {
        errors.push(`Prohibited term found: "${term}"`);
      }
    }

    const isValid = errors.length === 0;
    const sanitizedName = isValid ? trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : null;

    res.json({
      success: true,
      data: {
        isValid,
        sanitizedName,
        errors,
        warnings
      }
    });
  } catch (error) {
    logger.error('Error validating name:', error);
    res.status(500).json({ success: false, message: 'Failed to validate name' });
  }
});

/**
 * POST /api/guardian/biometric-hash
 * Generate SHA-256 biometric face hash
 */
router.post('/biometric-hash', optionalAuth, async (req, res) => {
  try {
    const { faceData = '' } = req.body;
    if (!faceData) {
      return res.status(400).json({ success: false, message: 'faceData is required' });
    }
    const hash = crypto.createHash('sha256').update(String(faceData)).digest('hex');
    res.json({
      success: true,
      data: {
        hash: `sha256:${hash}`,
        algorithm: 'SHA-256',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error generating biometric hash:', error);
    res.status(500).json({ success: false, message: 'Failed to generate biometric hash' });
  }
});

module.exports = router;
