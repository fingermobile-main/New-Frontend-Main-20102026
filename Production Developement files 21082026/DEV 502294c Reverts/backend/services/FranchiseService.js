/**
 * FranchiseService
 * Franchise management with territory control, revenue sharing, and performance tracking
 */

const pool = require('../database/connection');

class FranchiseService {
  /**
   * Create new franchise
   */
  async createFranchise(ownerId, options = {}) {
    try {
      const { name, territory, initial_fee, revenue_share_percentage } = options;
      
      const query = `
        INSERT INTO franchises (
          owner_id, name, territory, initial_fee,
          revenue_share_percentage, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, 'active', NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [
        ownerId,
        name,
        JSON.stringify(territory),
        initial_fee,
        revenue_share_percentage
      ]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating franchise:', error);
      throw error;
    }
  }
  
  /**
   * Record franchise revenue
   */
  async recordRevenue(franchiseId, amount, period) {
    try {
      const query = `
        INSERT INTO franchise_revenue_shares (
          franchise_id, gross_revenue, period, calculated_at
        ) VALUES ($1, $2, $3, NOW())
        RETURNING *
      `;
      
      const result = await pool.query(query, [franchiseId, amount, period]);
      
      // Calculate revenue share
      await this.calculateRevenueShare(result.rows[0].id);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error recording revenue:', error);
      throw error;
    }
  }
  
  /**
   * Calculate revenue share
   */
  async calculateRevenueShare(revenueId) {
    try {
      const query = `
        UPDATE franchise_revenue_shares frs
        SET 
          platform_share = frs.gross_revenue * (f.revenue_share_percentage / 100.0),
          franchisee_share = frs.gross_revenue * ((100 - f.revenue_share_percentage) / 100.0),
          status = 'calculated'
        FROM franchises f
        WHERE frs.franchise_id = f.id
          AND frs.id = $1
        RETURNING frs.*
      `;
      
      const result = await pool.query(query, [revenueId]);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error calculating revenue share:', error);
      throw error;
    }
  }
}

module.exports = new FranchiseService();
