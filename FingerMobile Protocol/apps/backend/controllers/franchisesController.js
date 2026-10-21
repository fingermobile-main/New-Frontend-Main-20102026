/**
 * franchisesController.js
 * Production controller for Franchise Management module
 */
const { pool } = require('../db');
const logger = require('../utils/logger');

class FranchisesController {
  // GET /api/franchises
  async getAll(req, res) {
    try {
      const result = await pool.query(`
        SELECT f.*, 
               COUNT(fl.id)::int as total_locations,
               COALESCE(SUM(frs.gross_revenue), 0)::float as total_gross_revenue,
               COALESCE(SUM(frs.net_payout), 0)::float as total_net_payout
        FROM franchises f
        LEFT JOIN franchise_locations fl ON f.id = fl.franchise_id
        LEFT JOIN franchise_revenue_shares frs ON f.id = frs.franchise_id
        GROUP BY f.id
        ORDER BY f.created_at DESC
      `);
      return res.json({
        success: true,
        data: result.rows,
        count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in franchisesController.getAll:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch franchises', error: error.message });
    }
  }

  // GET /api/franchises/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const franchiseRes = await pool.query('SELECT * FROM franchises WHERE id = $1', [id]);
      if (franchiseRes.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Franchise not found' });
      }
      const locationsRes = await pool.query('SELECT * FROM franchise_locations WHERE franchise_id = $1 ORDER BY created_at DESC', [id]);
      const revenueRes = await pool.query('SELECT * FROM franchise_revenue_shares WHERE franchise_id = $1 ORDER BY period_end DESC', [id]);

      return res.json({
        success: true,
        data: {
          ...franchiseRes.rows[0],
          locations: locationsRes.rows,
          revenue_shares: revenueRes.rows
        }
      });
    } catch (error) {
      logger.error('Error in franchisesController.getById:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch franchise details', error: error.message });
    }
  }

  // POST /api/franchises
  async create(req, res) {
    try {
      const { name, owner_id, tier = 'standard', revenue_share_percentage = 15.0, operating_license_no } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, message: 'Franchise name is required' });
      }
      const result = await pool.query(`
        INSERT INTO franchises (name, owner_id, tier, revenue_share_percentage, operating_license_no, status)
        VALUES ($1, $2, $3, $4, $5, 'active')
        RETURNING *
      `, [name, owner_id || req.user?.id || 'admin', tier, revenue_share_percentage, operating_license_no || `LIC-${Date.now()}`]);

      return res.status(201).json({
        success: true,
        message: 'Franchise created successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in franchisesController.create:', error);
      return res.status(500).json({ success: false, message: 'Failed to create franchise', error: error.message });
    }
  }

  // POST /api/franchises/:id/locations
  async addLocation(req, res) {
    try {
      const { id } = req.params;
      const { location_name, address, city, country, contact_phone, manager_name, coordinates } = req.body;
      if (!location_name || !address) {
        return res.status(400).json({ success: false, message: 'Location name and address are required' });
      }
      const result = await pool.query(`
        INSERT INTO franchise_locations (franchise_id, location_name, address, city, country, contact_phone, manager_name, coordinates, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'operational')
        RETURNING *
      `, [id, location_name, address, city || '', country || '', contact_phone || '', manager_name || '', JSON.stringify(coordinates || {})]);

      return res.status(201).json({
        success: true,
        message: 'Location added successfully',
        data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in franchisesController.addLocation:', error);
      return res.status(500).json({ success: false, message: 'Failed to add location', error: error.message });
    }
  }

  // GET /api/franchises/metrics/overview
  async getOverview(req, res) {
    try {
      const totalFranchises = await pool.query('SELECT COUNT(*)::int as count FROM franchises WHERE status = \'active\'');
      const totalLocations = await pool.query('SELECT COUNT(*)::int as count FROM franchise_locations WHERE status = \'operational\'');
      const totalRevenue = await pool.query('SELECT COALESCE(SUM(gross_revenue), 0)::float as sum FROM franchise_revenue_shares');

      return res.json({
        success: true,
        data: {
          active_franchises: totalFranchises.rows[0]?.count || 0,
          operational_locations: totalLocations.rows[0]?.count || 0,
          total_revenue: totalRevenue.rows[0]?.sum || 0
        }
      });
    } catch (error) {
      logger.error('Error in franchisesController.getOverview:', error);
      return res.status(500).json({ success: false, message: 'Failed to fetch overview metrics', error: error.message });
    }
  }
}

module.exports = new FranchisesController();
