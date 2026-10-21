const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../utils/logger');
const crypto = require('crypto');

const getPool = () => db.pool || db;

function generateRandomToken(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

/**
 * GET /api/access-keys/:seshatPageId
 * List all access keys for a page
 */
router.get('/:seshatPageId', async (req, res) => {
  try {
    const { seshatPageId } = req.params;
    const result = await getPool().query(
      'SELECT * FROM access_keys WHERE seshat_page_id = $1 ORDER BY created_at DESC',
      [seshatPageId]
    );
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    logger.error('Error fetching access keys:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch access keys', error: error.message });
  }
});

/**
 * POST /api/access-keys
 * Create and persist a new access key
 */
router.post('/', async (req, res) => {
  try {
    const { seshatPageId = 'page_default', keyType = 'MEMBERSHIP', expiryDays = 30 } = req.body;
    const raw = generateRandomToken(16);
    const keyToken = `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (expiryDays || 30));

    const result = await getPool().query(
      `INSERT INTO access_keys (seshat_page_id, key_token, key_type, expires_at, is_active)
       VALUES ($1, $2, $3, $4, true)
       RETURNING *`,
      [seshatPageId, keyToken, keyType, expiresAt]
    );

    res.status(201).json({
      success: true,
      message: 'Access key created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error creating access key:', error);
    res.status(500).json({ success: false, message: 'Failed to create access key', error: error.message });
  }
});

/**
 * DELETE /api/access-keys/:id
 * Revoke an access key
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getPool().query(
      'UPDATE access_keys SET is_active = false WHERE id::text = $1 OR key_token = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Access key not found' });
    }

    res.json({ success: true, message: 'Access key revoked successfully', data: result.rows[0] });
  } catch (error) {
    logger.error('Error revoking access key:', error);
    res.status(500).json({ success: false, message: 'Failed to revoke access key', error: error.message });
  }
});

/**
 * POST /api/access-keys/validate
 * Validate if an access key token is valid and active
 */
router.post('/validate', async (req, res) => {
  try {
    const { keyToken } = req.body;
    if (!keyToken) {
      return res.status(400).json({ success: false, message: 'keyToken is required' });
    }

    const result = await getPool().query(
      'SELECT * FROM access_keys WHERE key_token = $1 AND is_active = true AND expires_at > NOW()',
      [keyToken.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, valid: false, message: 'Invalid or expired access key' });
    }

    res.json({ success: true, valid: true, data: result.rows[0] });
  } catch (error) {
    logger.error('Error validating access key:', error);
    res.status(500).json({ success: false, message: 'Failed to validate access key', error: error.message });
  }
});

module.exports = router;
