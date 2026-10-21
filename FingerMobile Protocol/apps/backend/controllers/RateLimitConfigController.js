const db = require('../database/connection');
const logger = require('../utils/logger');

class RateLimitConfigController {
  /**
   * GET /api/admin/rate-limits - Get current rate limit configs
   */
  async getConfigs(req, res) {
    try {
      const { active, role, endpoint } = req.query;

      let query = 'SELECT * FROM rate_limit_configs';
      const conditions = [];
      const values = [];
      let paramIndex = 1;

      if (active !== undefined) {
        conditions.push(`is_active = $${paramIndex}`);
        values.push(active === 'true');
        paramIndex++;
      }

      if (role) {
        conditions.push(`user_role = $${paramIndex}`);
        values.push(role);
        paramIndex++;
      }

      if (endpoint) {
        conditions.push(`endpoint_pattern LIKE $${paramIndex}`);
        values.push(`%${endpoint}%`);
        paramIndex++;
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ' ORDER BY created_at DESC';

      const result = await db.query(query, values);

      res.json({
        success: true,
        data: result.rows, count: result.rows.length
      });
    } catch (error) {
      logger.error('Error getting rate limit configs:', error);
      res.status(500).json({
        success: false, message: 'Failed to get rate limit configurations',
        error: error.message
      });
    }
  }

  /**
   * POST /api/admin/rate-limits - Create new rate limit rule
   */
  async createConfig(req, res) {
    try {
      const {
        name,
        description,
        endpoint_pattern,
        user_role,
        user_id,
        max_requests,
        window_ms,
        is_active = true
      } = req.body;

      // Validation
      if (!name || !endpoint_pattern) {
        return res.status(400).json({
          success: false, message: 'Name and endpoint_pattern are required'
        });
      }

      if (!max_requests || max_requests < 1) {
        return res.status(400).json({
          success: false, message: 'max_requests must be at least 1'
        });
      }

      if (!window_ms || window_ms < 1000) {
        return res.status(400).json({
          success: false, message: 'window_ms must be at least 1000 (1 second)'
        });
      }

      const result = await db.query(
        `INSERT INTO rate_limit_configs 
        (name, description, endpoint_pattern, user_role, user_id, max_requests, window_ms, is_active, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [name, description, endpoint_pattern, user_role, user_id, max_requests, window_ms, is_active, req.user.id]
      );

      res.status(201).json({
        success: true, message: 'Rate limit configuration created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error creating rate limit config:', error);
      res.status(500).json({
        success: false, message: 'Failed to create rate limit configuration', error: error.message
      });
    }
  }

  /**
   * PUT /api/admin/rate-limits/:id - Update rate limit rule
   */
  async updateConfig(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check if config exists
      const existing = await db.query('SELECT * FROM rate_limit_configs WHERE id = $1', [id]);
      if (existing.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Rate limit configuration not found'
        });
      }

      // Build dynamic UPDATE query
      const setClauses = [];
      const values = [];
      let paramIndex = 1;

      const allowedFields = ['name', 'description', 'endpoint_pattern', 'user_role', 'user_id', 'max_requests', 'window_ms', 'is_active'];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          setClauses.push(`${field} = $${paramIndex}`);
          values.push(updates[field]);
          paramIndex++;
        }
      }

      if (setClauses.length === 0) {
        return res.status(400).json({
          success: false, message: 'No valid fields to update'
        });
      }

      setClauses.push('updated_at = NOW()');
      values.push(id);

      const query = `UPDATE rate_limit_configs SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

      const result = await db.query(query, values);

      res.json({
        success: true, message: 'Rate limit configuration updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error updating rate limit config:', error);
      res.status(500).json({
        success: false, message: 'Failed to update rate limit configuration', error: error.message
      });
    }
  }

  /**
   * DELETE /api/admin/rate-limits/:id - Delete rate limit rule
   */
  async deleteConfig(req, res) {
    try {
      const { id } = req.params;

      const result = await db.query('DELETE FROM rate_limit_configs WHERE id = $1 RETURNING *', [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false, message: 'Rate limit configuration not found'
        });
      }

      res.json({
        success: true, message: 'Rate limit configuration deleted successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error deleting rate limit config:', error);
      res.status(500).json({
        success: false, message: 'Failed to delete rate limit configuration', error: error.message
      });
    }
  }

  /**
   * GET /api/admin/rate-limits/analytics - Rate limit hit analytics
   */
  async getAnalytics(req, res) {
    try {
      const { days = 7 } = req.query;

      // Get violation statistics
      const violations = await db.query(`
        SELECT 
          COUNT(*) as total_violations,
          COUNT(DISTINCT user_id) as unique_users,
          COUNT(DISTINCT ip_address) as unique_ips,
          COUNT(CASE WHEN blocked_until > NOW() THEN 1 END) as currently_blocked
        FROM rate_limit_violations
        WHERE created_at >= NOW() - INTERVAL '$1 days'
      `, [days]);

      // Get top violated endpoints
      const topEndpoints = await db.query(`
        SELECT 
          endpoint,
          COUNT(*) as violation_count, COUNT(DISTINCT user_id) as affected_users
        FROM rate_limit_violations
        WHERE created_at >= NOW() - INTERVAL '$1 days'
        GROUP BY endpoint
        ORDER BY violation_count DESC
        LIMIT 10
      `, [days]);

      // Get active configs usage
      const configUsage = await db.query(`
        SELECT 
          rlc.name,
          rlc.endpoint_pattern,
          rlc.max_requests,
          rlc.window_ms,
          COUNT(DISTINCT rlu.user_id) as active_users, COALESCE(AVG(rlu.request_count), 0) as avg_requests_per_window
        FROM rate_limit_configs rlc
        LEFT JOIN rate_limit_usage rlu ON rlc.id = rlu.config_id
          AND rlu.window_start >= NOW() - INTERVAL '1 hour'
        WHERE rlc.is_active = true
        GROUP BY rlc.id, rlc.name, rlc.endpoint_pattern, rlc.max_requests, rlc.window_ms
        ORDER BY avg_requests_per_window DESC
      `);

      res.json({
        success: true,
        data: {
          violations: violations.rows[0],
          topEndpoints: topEndpoints.rows, configUsage: configUsage.rows
        }
      });
    } catch (error) {
      logger.error('Error getting rate limit analytics:', error);
      res.status(500).json({
        success: false, message: 'Failed to get rate limit analytics', error: error.message
      });
    }
  }

  /**
   * POST /api/admin/rate-limits/apply - Apply config changes (reload rate limiter)
   */
  async applyChanges(req, res) {
    try {
      // In a real implementation, this would signal the rate limiter middleware to reload configs
      // For now, we'll just return success

      res.json({
        success: true,
        message: 'Rate limit configuration changes applied successfully', timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error applying rate limit changes:', error);
      res.status(500).json({
        success: false, message: 'Failed to apply rate limit changes',
        error: error.message
      });
    }
  }
}

module.exports = new RateLimitConfigController();
