const db = require('../db');
const pool = db.pool || db;
const logger = require('../config/logger');

const getRateLimits = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rate_limit_configs ORDER BY created_at DESC');
    res.json({ success: true, limits: result.rows, rateLimits: result.rows });
  } catch (error) {
    logger.error('Error fetching rate limits:', error);
    res.status(500).json({ success: false, message: 'Server error fetching rate limits' });
  }
};

const updateRateLimit = async (req, res) => {
  try {
    const { id, name, description, endpoint_pattern, max_requests, window_ms, is_active } = req.body;

    if (!id) {
      // Create new
      const result = await pool.query(
        'INSERT INTO rate_limit_configs (name, description, endpoint_pattern, max_requests, window_ms, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name || 'Custom Limit', description || '', endpoint_pattern, max_requests, window_ms, is_active !== undefined ? is_active : true]
      );
      return res.json({ success: true, limit: result.rows[0] });
    } else {
      // Update existing
      const result = await pool.query(
        'UPDATE rate_limit_configs SET name = COALESCE($1, name), description = COALESCE($2, description), endpoint_pattern = COALESCE($3, endpoint_pattern), max_requests = COALESCE($4, max_requests), window_ms = COALESCE($5, window_ms), is_active = COALESCE($6, is_active), updated_at = NOW() WHERE id = $7 RETURNING *',
        [name, description, endpoint_pattern, max_requests, window_ms, is_active, id]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Rate limit configuration not found' });
      }
      return res.json({ success: true, limit: result.rows[0] });
    }
  } catch (error) {
    logger.error('Error updating rate limit:', error);
    res.status(500).json({ success: false, message: 'Server error updating rate limit' });
  }
};

module.exports = {
  getRateLimits,
  updateRateLimit
};
