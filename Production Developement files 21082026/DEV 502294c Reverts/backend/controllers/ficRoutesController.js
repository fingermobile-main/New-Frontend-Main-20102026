/**
 * FIC Routes Controller
 * Complete implementation for FIC routes system
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class FicRoutesController {
  /**
   * GET /api/fic-routes/routes
   * Get all FIC routes
   */
  async getRoutes(req, res) {
    try {
      const { category, status } = req.query;

      let whereClause = [];
      let queryParams = [];
      let paramCount = 1;

      if (category) {
        whereClause.push(`category = $${paramCount}`);
        queryParams.push(category);
        paramCount++;
      }

      if (status) {
        whereClause.push(`status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      const whereSQL = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

      const result = await pool.query(
        `SELECT * FROM fic_routes
         ${whereSQL}
         ORDER BY created_at DESC`,
        queryParams
      );

      res.json({
        success: true,
        data: result.rows.map(route => ({
          ...route, config: typeof route.config === 'string' ? JSON.parse(route.config) : route.config
        })), count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in FicRoutesController.getRoutes:', error);
      res.status(500).json({
        success: false, message: 'Failed to get routes', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/fic-routes/routes
   * Create new FIC route
   */
  async createRoute(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const { name, path, method, category, config } = req.body;

      if (!name || !path || !method) {
        return res.status(400).json({
          success: false, message: 'Name, path, and method are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO fic_routes 
         (name, path, method, category, config, status, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, 'active', $6, NOW())
         RETURNING *`,
        [name, path, method, category || null, JSON.stringify(config || {}), userId]
      );

      res.status(201).json({
        success: true, message: 'Route created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FicRoutesController.createRoute:', error);
      res.status(500).json({
        success: false, message: 'Failed to create route', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/fic-routes/routes/:id
   * Update FIC route
   */
  async updateRoute(req, res) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;
      const updates = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const setClauses = ['updated_at = NOW()'];
      const values = [];
      let paramCount = 1;

      Object.keys(updates).forEach(key => {
        if (['name', 'path', 'method', 'category', 'config', 'status'].includes(key)) {
          if (key === 'config') {
            setClauses.push(`${key} = $${paramCount}`);
            values.push(JSON.stringify(updates[key]));
          } else {
            setClauses.push(`${key} = $${paramCount}`);
            values.push(updates[key]);
          }
          paramCount++;
        }
      });

      if (setClauses.length === 1) {
        return res.status(400).json({
          success: false, message: 'No valid fields to update'
        });
      }

      values.push(id);

      const result = await pool.query(
        `UPDATE fic_routes 
         SET ${setClauses.join(', ')}
         WHERE id = $${paramCount}
         RETURNING *`,
        values
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Route not found'
        });
      }

      res.json({
        success: true, message: 'Route updated successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in FicRoutesController.updateRoute:', error);
      res.status(500).json({
        success: false, message: 'Failed to update route', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/fic-routes/routes/:id
   * Delete FIC route
   */
  async deleteRoute(req, res) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      // Check admin permission
      if (!req.user?.isAdmin) {
        return res.status(403).json({
          success: false, message: 'Admin access required'
        });
      }

      const result = await pool.query(
        'DELETE FROM fic_routes WHERE id = $1 RETURNING id',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Route not found'
        });
      }

      res.json({
        success: true, message: 'Route deleted successfully'
      });
    } catch (error) {
      logger.error('Error in FicRoutesController.deleteRoute:', error);
      res.status(500).json({
        success: false, message: 'Failed to delete route', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new FicRoutesController();
