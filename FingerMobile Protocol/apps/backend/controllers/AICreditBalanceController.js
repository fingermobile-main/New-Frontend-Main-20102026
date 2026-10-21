/* eslint-disable no-unused-vars */
/**
 * AICreditBalanceController
 * Manages AI credit balances, transactions, and usage tracking
 */

const pool = require('../database/connection');
const logger = require('../utils/logger');
const AICreditBalanceModel = require('../models/AICreditBalanceModel');
const AICreditBalanceService = require('../services/AICreditBalanceService');

const aiCreditModel = new AICreditBalanceModel(pool);

class AICreditBalanceController {
  /**
   * Get user's AI credit balance
   */
  async getBalance(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false, error: 'User authentication required'
        });
      }

      let balance = await aiCreditModel.getBalance(userId);

      // Initialize with default allocation if no balance exists
      if (!balance) {
        balance = await aiCreditModel.addCredits(userId, 100, 'Initial allocation');
      }

      res.json({
        success: true, message: 'AI credit balance retrieved successfully', data: balance
      });
    } catch (error) {
      logger.error('Error in AICreditBalanceController.getBalance:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve AI credit balance', details: error.message
      });
    }
  }

  /**
   * Add credits to user's balance
   */
  async addCredits(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { amount, reason } = req.body;

      // Validation
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid credit amount is required (must be > 0)'
        });
      }

      if (!reason) {
        return res.status(400).json({
          success: false, error: 'Reason for adding credits is required'
        });
      }

      const updatedBalance = await aiCreditModel.addCredits(userId, amount, reason);

      res.status(201).json({
        success: true, message: 'Credits added successfully', data: updatedBalance
      });
    } catch (error) {
      logger.error('Error in AICreditBalanceController.addCredits:', error);
      res.status(500).json({
        success: false, error: 'Failed to add credits', details: error.message
      });
    }
  }

  /**
   * Deduct credits from user's balance
   */
  async deductCredits(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const { amount, usage_type, metadata } = req.body;

      // Validation
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Valid credit amount is required (must be > 0)'
        });
      }

      if (!usage_type) {
        return res.status(400).json({
          success: false, error: 'Usage type is required'
        });
      }

      const updatedBalance = await aiCreditModel.deductCredits(
        userId,
        amount,
        usage_type,
        metadata
      );

      res.json({
        success: true, message: 'Credits deducted successfully', data: updatedBalance
      });
    } catch (error) {
      logger.error('Error in AICreditBalanceController.deductCredits:', error);

      if (error.message === 'Insufficient credits') {
        return res.status(402).json({
          success: false, error: 'Insufficient credits', message: 'You do not have enough credits for this operation'
        });
      }

      res.status(500).json({
        success: false, error: 'Failed to deduct credits',
        details: error.message
      });
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(req, res) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const limit = parseInt(req.query.limit) || 50;

      if (!userId) {
        return res.status(401).json({
          success: false, error: 'User authentication required'
        });
      }

      const transactions = await aiCreditModel.getUsageHistory(userId, limit);

      res.json({
        success: true, message: 'Transaction history retrieved successfully',
        data: {
          transactions,
          total: transactions.length,
          limit
        }
      });
    } catch (error) {
      logger.error('Error in AICreditBalanceController.getTransactions:', error);
      res.status(500).json({
        success: false, error: 'Failed to retrieve transaction history',
        details: error.message
      });
    }
  }
}

module.exports = new AICreditBalanceController();
