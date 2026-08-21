const { pool } = require('../db');
const FICService = require('./FICService');

class CommissionService {
  /**
   * Calculate commission split based on rules
   */
  async calculateCommission(amount, commissionType = 'marketplace_sale') {
    try {
      const ruleQuery = `
        SELECT platform_percentage, creator_percentage 
        FROM commission_rules 
        WHERE commission_type = $1 AND is_active = true
      `;
      
      const ruleResult = await pool.query(ruleQuery, [commissionType]);
      
      if (ruleResult.rows.length === 0) {
        throw new Error(`No active commission rule found for type: ${commissionType}`);
      }
      
      const rule = ruleResult.rows[0];
      const platformFee = (amount * rule.platform_percentage) / 100;
      const creatorCommission = (amount * rule.creator_percentage) / 100;
      
      return {
        totalAmount: parseFloat(amount),
        platformFee: parseFloat(platformFee.toFixed(2)),
        creatorCommission: parseFloat(creatorCommission.toFixed(2)),
        platformPercentage: rule.platform_percentage,
        creatorPercentage: rule.creator_percentage
      };
    } catch (error) {
      logger.error('Error calculating commission:', error);
      throw error;
    }
  }

  /**
   * Record a commission transaction
   */
  async recordCommission(transactionId, creatorId, totalAmount, commissionType, metadata = {}) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Calculate commission split
      const commission = await this.calculateCommission(totalAmount, commissionType);
      
      // Insert commission record
      const insertQuery = `
        INSERT INTO commissions (
          transaction_id, creator_id, total_amount, platform_fee, 
          creator_commission, commission_percentage, commission_type, status, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', $8)
        RETURNING *
      `;
      
      const result = await client.query(insertQuery, [
        transactionId,
        creatorId,
        commission.totalAmount,
        commission.platformFee,
        commission.creatorCommission,
        commission.creatorPercentage,
        commissionType,
        JSON.stringify(metadata)
      ]);
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error recording commission:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get commissions for a creator
   */
  async getCreatorCommissions(creatorId, options = {}) {
    try {
      const { startDate, endDate, status, limit = 50, offset = 0 } = options;
      
      let query = `
        SELECT c.*, t.description as transaction_description
        FROM commissions c
        LEFT JOIN fic_transactions t ON c.transaction_id::text = t.id::text
        WHERE c.creator_id = $1
      `;
      
      const params = [creatorId];
      let paramCount = 1;
      
      if (startDate) {
        paramCount++;
        query += ` AND c.created_at >= $${paramCount}`;
        params.push(startDate);
      }
      
      if (endDate) {
        paramCount++;
        query += ` AND c.created_at <= $${paramCount}`;
        params.push(endDate);
      }
      
      if (status) {
        paramCount++;
        query += ` AND c.status = $${paramCount}`;
        params.push(status);
      }
      
      query += ` ORDER BY c.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      
      // Get total count
      let countQuery = `SELECT COUNT(*) FROM commissions WHERE creator_id = $1`;
      const countParams = [creatorId];
      
      if (startDate) {
        countQuery += ` AND created_at >= '${startDate}'`;
      }
      if (endDate) {
        countQuery += ` AND created_at <= '${endDate}'`;
      }
      if (status) {
        countQuery += ` AND status = '${status}'`;
      }
      
      const countResult = await pool.query(countQuery, countParams);
      
      return {
        commissions: result.rows,
        total: parseInt(countResult.rows[0].count),
        limit,
        offset
      };
    } catch (error) {
      logger.error('Error getting creator commissions:', error);
      throw error;
    }
  }

  /**
   * Process commission payout
   */
  async processCommissionPayout(commissionId, payoutMethod = 'fic_wallet') {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get commission details
      const commissionQuery = `
        SELECT * FROM commissions WHERE id = $1 AND status = 'pending'
      `;
      
      const commissionResult = await client.query(commissionQuery, [commissionId]);
      
      if (commissionResult.rows.length === 0) {
        throw new Error('Commission not found or already processed');
      }
      
      const commission = commissionResult.rows[0];
      
      // Update commission status
      const updateQuery = `
        UPDATE commissions 
        SET status = 'paid', paid_at = NOW(), payout_method = $2
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await client.query(updateQuery, [commissionId, payoutMethod]);
      
      // Integrate with FIC wallet service to credit creator
      if (payoutMethod === 'fic_wallet') {
        await FICService.credit(
          commission.creator_id, 
          commission.creator_commission, 
          `Commission payout for transaction ${commission.transaction_id}`,
          { commissionId }
        );
      }
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error processing commission payout:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get pending commissions for batch processing
   */
  async getPendingCommissions(limit = 100) {
    try {
      const query = `
        SELECT c.*, u.email as creator_email, u.name as creator_name
        FROM commissions c
        JOIN users u ON c.creator_id = u.id
        WHERE c.status = 'pending'
        ORDER BY c.created_at ASC
        LIMIT $1
      `;
      
      const result = await pool.query(query, [limit]);
      
      return result.rows;
    } catch (error) {
      logger.error('Error getting pending commissions:', error);
      throw error;
    }
  }

  /**
   * Get commission statistics
   */
  async getCommissionStats(creatorId = null) {
    try {
      let query = `
        SELECT 
          COUNT(*) as total_commissions,
          SUM(CASE WHEN status = 'pending' THEN creator_commission ELSE 0 END) as pending_amount,
          SUM(CASE WHEN status = 'paid' THEN creator_commission ELSE 0 END) as paid_amount,
          SUM(CASE WHEN status = 'cancelled' THEN creator_commission ELSE 0 END) as cancelled_amount,
          AVG(commission_percentage) as avg_commission_rate
        FROM commissions
      `;
      
      const params = [];
      
      if (creatorId) {
        query += ' WHERE creator_id = $1';
        params.push(creatorId);
      }
      
      const result = await pool.query(query, params);
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error getting commission stats:', error);
      throw error;
    }
  }

  /**
   * Update commission rule
   */
  async updateCommissionRule(commissionType, platformPercentage, creatorPercentage) {
    try {
      if (parseFloat(platformPercentage) + parseFloat(creatorPercentage) !== 100.00) {
        throw new Error('Percentages must sum to 100%');
      }
      
      const query = `
        UPDATE commission_rules
        SET platform_percentage = $2, creator_percentage = $3, updated_at = NOW()
        WHERE commission_type = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [commissionType, platformPercentage, creatorPercentage]);
      
      if (result.rows.length === 0) {
        throw new Error(`Commission rule not found for type: ${commissionType}`);
      }
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating commission rule:', error);
      throw error;
    }
  }
}

module.exports = new CommissionService();
