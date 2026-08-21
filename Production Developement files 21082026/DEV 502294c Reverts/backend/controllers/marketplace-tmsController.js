/**
 * Marketplace TMS Controller
 * Complete implementation for marketplace transaction management system
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class MarketplaceTmsController {
  /**
   * GET /api/marketplace-tms/transactions
   * Get marketplace transactions
   */
  async getTransactions(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { limit = 50, offset = 0, status, type } = req.query;

      let whereClause = ['(buyer_id = $1 OR seller_id = $1)'];
      let queryParams = [userId];
      let paramCount = 2;

      if (status) {
        whereClause.push(`status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      if (type) {
        whereClause.push(`transaction_type = $${paramCount}`);
        queryParams.push(type);
        paramCount++;
      }

      const result = await pool.query('SELECT t.*, ub.username as buyer_username, us.username as seller_username p.name as product_name FROM marketplace_transactions t JOIN users ub ON t.buyer_id = ub.id JOIN users us ON t.seller_id = us.id LEFT JOIN products p ON t.product_id = p.id WHERE $1 ORDER BY t.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}', [...queryParams, parseInt(limit), parseInt(offset), whereClause.join(' AND ')]);

      res.json({
        success: true,
        data: result.rows.map(transaction => ({
          ...transaction,
          amount: parseFloat(transaction.amount)
        })),
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset), total: result.rows.length
        }
      });
    } catch (error) {
      logger.error('Error in MarketplaceTmsController.getTransactions:', error);
      res.status(500).json({
        success: false, message: 'Failed to get transactions', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/marketplace-tms/create
   * Create marketplace transaction
   */
  async createTransaction(req, res) {
    try {
      const userId = req.user?.id;
      const { productId, sellerId, amount, paymentMethod } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!productId || !sellerId || !amount) {
        return res.status(400).json({
          success: false, message: 'Product ID, seller ID, and amount are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO marketplace_transactions 
         (buyer_id, seller_id, product_id, amount, payment_method, status, created_at)
         VALUES ($1, $2, $3, $4, $5, 'pending', NOW())
         RETURNING *`,
        [userId, sellerId, productId, parseFloat(amount), paymentMethod || null]
      );

      res.status(201).json({
        success: true, message: 'Transaction created successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in MarketplaceTmsController.createTransaction:', error);
      res.status(500).json({
        success: false, message: 'Failed to create transaction', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/marketplace-tms/:id/complete
   * Complete transaction
   */
  async completeTransaction(req, res) {
    try {
      const userId = req.user?.id;
      const { id: transactionId } = req.params;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `UPDATE marketplace_transactions 
         SET status = 'completed', completed_at = NOW()
         WHERE id = $1 AND (buyer_id = $2 OR seller_id = $2) AND status = 'pending'
         RETURNING *`,
        [transactionId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Transaction not found or already completed'
        });
      }

      res.json({
        success: true, message: 'Transaction completed successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in MarketplaceTmsController.completeTransaction:', error);
      res.status(500).json({
        success: false, message: 'Failed to complete transaction', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/marketplace-tms/:id/cancel
   * Cancel transaction
   */
  async cancelTransaction(req, res) {
    try {
      const userId = req.user?.id;
      const { id: transactionId } = req.params;
      const { reason } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const result = await pool.query(
        `UPDATE marketplace_transactions 
         SET status = 'cancelled', cancellation_reason = $1, cancelled_at = NOW()
         WHERE id = $2 AND (buyer_id = $3 OR seller_id = $3) AND status = 'pending'
         RETURNING *`,
        [reason || null, transactionId, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Transaction not found or already processed'
        });
      }

      res.json({
        success: true, message: 'Transaction cancelled successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in MarketplaceTmsController.cancelTransaction:', error);
      res.status(500).json({
        success: false, message: 'Failed to cancel transaction', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/marketplace-tms/stats
   * Get transaction statistics
   */
  async getStats(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const stats = await pool.query(
        `SELECT 
          COUNT(*) FILTER (WHERE status = 'pending') as pending_count COUNT(*) FILTER (WHERE status = 'completed') as completed_count COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count COALESCE(SUM(amount) FILTER (WHERE status = 'completed'), 0) as total_revenue COALESCE(AVG(amount) FILTER (WHERE status = 'completed'), 0) as avg_transaction_value
         FROM marketplace_transactions
         WHERE buyer_id = $1 OR seller_id = $1`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          pendingCount: parseInt(stats.rows[0].pending_count) || 0,
          completedCount: parseInt(stats.rows[0].completed_count) || 0,
          cancelledCount: parseInt(stats.rows[0].cancelled_count) || 0,
          totalRevenue: parseFloat(stats.rows[0].total_revenue) || 0, avgTransactionValue: parseFloat(stats.rows[0].avg_transaction_value) || 0
        }
      });
    } catch (error) {
      logger.error('Error in MarketplaceTmsController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to get statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new MarketplaceTmsController();
