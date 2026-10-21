/**
 * UenhancedUwalletController
 * Auto-generated controller for enhanced_wallet routes
 * Generated: 2026-06-08 13:55:22
 */

const UenhancedUwalletControllerService = require('../services/enhanced_wallet_service');
const logger = require('../utils/logger');

class UenhancedUwalletController {
  /**
   * GET /api/enhanced-wallet
   * Get all items
   */
  async getAll(req, res) {
    try {
      const filters = {
        limit: req.query.limit || 50,
        offset: req.query.offset || 0,
        ...req.query
      };

      const data = await UenhancedUwalletControllerService.getAll(filters);

      res.json({
        success: true,
        data,
        count: data.length,
        filters // Fixed: Added missing comma
      });
    } catch (error) {
      logger.error('Error in UenhancedUwalletController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/enhanced-wallet/:id
   * Get item by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const data = await UenhancedUwalletControllerService.getById(id);

      if (!data) {
        return res.status(404).json({
          success: false, message: 'enhanced_wallet not found'
        });
      }

      res.json({
        success: true, // Fixed: Added missing comma
        data
      });
    } catch (error) {
      logger.error('Error in UenhancedUwalletController.getById:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/enhanced-wallet
   * Create new item
   */
  async create(req, res) {
    try {
      const data = req.body;

      // Basic validation
      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false, message: 'Request body is required'
        });
      }

      const result = await UenhancedUwalletControllerService.create(data);

      res.status(201).json({
        success: true, message: 'enhanced_wallet created successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UenhancedUwalletController.create:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/enhanced-wallet/:id
   * Update existing item
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({
          success: false, message: 'Request body is required'
        });
      }

      const result = await UenhancedUwalletControllerService.update(id, data);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'enhanced_wallet not found'
        });
      }

      res.json({
        success: true, message: 'enhanced_wallet updated successfully', data: result
      });
    } catch (error) {
      logger.error('Error in UenhancedUwalletController.update:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/enhanced-wallet/:id
   * Delete item
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await UenhancedUwalletControllerService.delete(id);

      if (!result) {
        return res.status(404).json({
          success: false, message: 'enhanced_wallet not found'
        });
      }

      res.json({
        success: true, message: 'enhanced_wallet deleted successfully'
      });
    } catch (error) {
      logger.error('Error in UenhancedUwalletController.delete:', error);
      res.status(500).json({
        success: false, message: 'Internal server error', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/enhanced-wallet/spend-store-credit
   */
  async spendStoreCredit(req, res) {
    try {
      const memberId = req.user?.id || req.body.memberId;
      const { amount, storeName, orderId, description } = req.body;

      if (!memberId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const result = await UenhancedUwalletControllerService.spendStoreCredit(
        memberId,
        amount,
        storeName,
        orderId,
        description
      );

      res.json(result);
    } catch (error) {
      logger.error('Error in spendStoreCredit:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to spend store credit'
      });
    }
  }

  /**
   * GET /api/enhanced-wallet/store-credit-transactions
   */
  async getStoreCreditTransactions(req, res) {
    try {
      const memberId = req.user?.id || req.query.memberId;
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      if (!memberId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const transactions = await UenhancedUwalletControllerService.getStoreCreditTransactions(
        memberId,
        limit,
        offset
      );

      res.json({
        success: true,
        data: transactions,
        count: transactions.length
      });
    } catch (error) {
      logger.error('Error in getStoreCreditTransactions:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve transactions' });
    }
  }

  /**
   * POST /api/enhanced-wallet/grant-store-credit
   */
  async grantStoreCredit(req, res) {
    try {
      const { memberId, amount, reason } = req.body;
      const adminId = req.user?.id || 'admin';

      if (!memberId || !amount) {
        return res.status(400).json({ success: false, message: 'memberId and amount are required' });
      }

      const result = await UenhancedUwalletControllerService.grantStoreCredit(
        memberId,
        amount,
        reason,
        adminId
      );

      res.json(result);
    } catch (error) {
      logger.error('Error in grantStoreCredit:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/enhanced-wallet/refund-store-credit
   */
  async refundStoreCredit(req, res) {
    try {
      const { memberId, amount, orderId, reason } = req.body;
      if (!memberId || !amount) {
        return res.status(400).json({ success: false, message: 'memberId and amount are required' });
      }

      const result = await UenhancedUwalletControllerService.refundStoreCredit(
        memberId,
        amount,
        orderId,
        reason
      );

      res.json(result);
    } catch (error) {
      logger.error('Error in refundStoreCredit:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/enhanced-wallet/earning-split-calculator
   */
  async calculateSplit(req, res) {
    try {
      const gross = parseFloat(req.query.gross || req.query.amount || 1000);
      const split = UenhancedUwalletControllerService.calculateEarningSplit(gross);
      res.json({ success: true, data: split });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UenhancedUwalletController();
