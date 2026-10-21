/**
 * FICController - FingerMobile Internal Currency Controller
 * Manages virtual currency operations
 */

const FICService = require('../services/FICService');
const logger = require('../utils/logger');

class FICController {
  /**
   * GET /api/fic/balance
   * Get user's FIC balance
   */
  async getBalance(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;

      const balance = await FICService.getBalance(userId);

      res.json({
        success: true, message: 'Balance retrieved successfully',
        data: {
          user_id: userId,
          balance, currency: 'FIC'
        }
      });
    } catch (error) {
      logger.error('Error in FICController.getBalance:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve balance',
        details: error.message
      });
    }
  }

  /**
   * POST /api/fic/transfer
   * Transfer FIC to another user
   */
  async transfer(req, res) {
    try {
      const fromUserId = req.user?.id || req.user?.userId;
      const { to_user_id, amount, description } = req.body;

      // Validation
      if (!to_user_id || !amount) {
        return res.status(400).json({
          success: false, error: 'Recipient ID and amount are required'
        });
      }

      if (amount <= 0) {
        return res.status(400).json({
          success: false, error: 'Amount must be positive'
        });
      }

      const result = await FICService.transfer(fromUserId, to_user_id, amount, description || 'P2P Transfer');

      res.json({
        success: true, message: 'Transfer completed successfully', data: result
      });
    } catch (error) {
      logger.error('Error in FICController.transfer:', error);

      if (error.message.includes('Insufficient balance')) {
        return res.status(402).json({
          success: false,
          error: error.message
        });
      }

      res.status(500).json({
        success: false, error: 'Transfer failed', details: error.message
      });
    }
  }

  /**
   * GET /api/fic/transactions
   * Get user's transaction history
   */
  async getTransactions(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const result = await FICService.getTransactions(userId, limit, offset);

      res.json({
        success: true,
        message: 'Transactions retrieved successfully', data: result
      });
    } catch (error) {
      logger.error('Error in FICController.getTransactions:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve transactions',
        details: error.message
      });
    }
  }

  /**
   * POST /api/fic/purchase
   * Purchase FIC with real money
   */
  async purchase(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { amount_usd, payment_intent_id } = req.body;

      // Validation
      if (!amount_usd || !payment_intent_id) {
        return res.status(400).json({
          success: false, error: 'USD amount and payment intent ID are required'
        });
      }

      const ficAmount = await FICService.purchase(userId, amount_usd, payment_intent_id);

      res.json({
        success: true, message: 'Purchase completed successfully',
        data: {
          usd_amount: amount_usd,
          fic_amount: ficAmount, conversion_rate: ficAmount / amount_usd
        }
      });
    } catch (error) {
      logger.error('Error in FICController.purchase:', error);
      res.status(500).json({
        success: false, error: 'Purchase failed',
        details: error.message
      });
    }
  }

  /**
   * GET /api/fic/stats
   * Get platform statistics (admin only)
   */
  async getStats(req, res) {
    try {
      // IMPLEMENTED: Admin authorization enforced via requireAdmin middleware
      const stats = await FICService.getPlatformStats();

      res.json({
        success: true, message: 'Platform stats retrieved successfully', data: stats
      });
    } catch (error) {
      logger.error('Error in FICController.getStats:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve stats',
        details: error.message
      });
    }
  }
}

module.exports = new FICController();
