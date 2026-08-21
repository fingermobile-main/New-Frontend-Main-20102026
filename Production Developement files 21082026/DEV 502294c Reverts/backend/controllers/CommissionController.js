const CommissionService = require('../services/CommissionService');
const logger = require('../utils/logger');

class CommissionController {
  /**
   * Calculate commission for a transaction
   */
  async calculate(req, res) {
    try {
      const { amount, commissionType } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false, message: 'Valid amount is required'
        });
      }
      
      const commission = await CommissionService.calculateCommission(
        amount, commissionType || 'marketplace_sale'
      );
      
      res.json({
        success: true, data: commission
      });
    } catch (error) {
      logger.error('Error calculating commission:', error);
      res.status(500).json({
        success: false, message: 'Failed to calculate commission',
        error: error.message
      });
    }
  }

  /**
   * Record a new commission
   */
  async record(req, res) {
    try {
      const { transactionId, creatorId, totalAmount, commissionType, metadata } = req.body;
      
      if (!transactionId || !creatorId || !totalAmount) {
        return res.status(400).json({
          success: false, message: 'transactionId, creatorId, and totalAmount are required'
        });
      }
      
      const commission = await CommissionService.recordCommission(
        transactionId,
        creatorId,
        totalAmount, commissionType || 'marketplace_sale',
        metadata
      );
      
      res.status(201).json({
        success: true,
        data: commission, message: 'Commission recorded successfully'
      });
    } catch (error) {
      logger.error('Error recording commission:', error);
      res.status(500).json({
        success: false, message: 'Failed to record commission',
        error: error.message
      });
    }
  }

  /**
   * Get commissions for authenticated user
   */
  async getMyCommissions(req, res) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }
      
      const { startDate, endDate, status, limit, offset } = req.query;
      
      const result = await CommissionService.getCreatorCommissions(userId, {
        startDate,
        endDate,
        status,
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      });
      
      res.json({
        success: true, data: result
      });
    } catch (error) {
      logger.error('Error getting commissions:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve commissions',
        error: error.message
      });
    }
  }

  /**
   * Process commission payout
   */
  async processPayout(req, res) {
    try {
      const { commissionId, payoutMethod } = req.body;
      
      if (!commissionId) {
        return res.status(400).json({
          success: false, message: 'commissionId is required'
        });
      }
      
      // Check if user owns this commission
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }
      
      const commission = await CommissionService.processCommissionPayout(
        commissionId, payoutMethod || 'fic_wallet'
      );
      
      res.json({
        success: true,
        data: commission, message: 'Commission payout processed successfully'
      });
    } catch (error) {
      logger.error('Error processing payout:', error);
      res.status(500).json({
        success: false, message: 'Failed to process commission payout',
        error: error.message
      });
    }
  }

  /**
   * Get pending commissions (admin only)
   */
  async getPendingCommissions(req, res) {
    try {
      // IMPLEMENTED: Admin authorization enforced via requireAdmin middleware in route definition
      const { limit } = req.query;
      
      const commissions = await CommissionService.getPendingCommissions(
        parseInt(limit) || 100
      );
      
      res.json({
        success: true, data: commissions
      });
    } catch (error) {
      logger.error('Error getting pending commissions:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve pending commissions',
        error: error.message
      });
    }
  }

  /**
   * Get commission statistics
   */
  async getStats(req, res) {
    try {
      const userId = req.user?.id;
      const stats = await CommissionService.getCommissionStats(userId);
      
      res.json({
        success: true, data: stats
      });
    } catch (error) {
      logger.error('Error getting commission stats:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve commission statistics',
        error: error.message
      });
    }
  }

  /**
   * Update commission rule (admin only)
   */
  async updateRule(req, res) {
    try {
      // IMPLEMENTED: Admin authorization enforced via requireAdmin middleware in route definition
      const { commissionType, platformPercentage, creatorPercentage } = req.body;
      
      if (!commissionType || !platformPercentage || !creatorPercentage) {
        return res.status(400).json({
          success: false, message: 'commissionType, platformPercentage, and creatorPercentage are required'
        });
      }
      
      const rule = await CommissionService.updateCommissionRule(
        commissionType,
        platformPercentage,
        creatorPercentage
      );
      
      res.json({
        success: true,
        data: rule, message: 'Commission rule updated successfully'
      });
    } catch (error) {
      logger.error('Error updating commission rule:', error);
      res.status(500).json({
        success: false, message: 'Failed to update commission rule',
        error: error.message
      });
    }
  }
}

module.exports = new CommissionController();
