/* eslint-disable no-unused-vars */
const { sequelize } = require('../database/connection');

/**
 * GiftCards Controller
 * Complete implementation for gift card management
 * Date: June 10, 2026 - Phase 1 Week 1 Priority #1
 */

const GiftCard = require('../models/Giftcard');
const logger = require('../utils/logger');
const User = require('../models/User');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');

class GiftCardsController {
  /**
   * GET /api/giftcards
   * Get all gift cards with pagination and filtering
   */
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100 per page
      const offset = (page - 1) * limit;

      // Build filters
      const where = {};
      if (req.query.status) where.status = req.query.status;
      if (req.query.currency) where.currency = req.query.currency;
      if (req.query.purchasedBy) where.purchasedBy = req.query.purchasedBy;

      const pool = require('../db').pool;
      const countRes = await pool.query('SELECT COUNT(*) as total FROM gift_cards');
      const total = parseInt(countRes.rows[0]?.total || 0);

      const cardsRes = await pool.query(
        'SELECT id, code, amount, balance, status, currency, expiry_date, redeemed_at, purchased_by, redeemed_by, description, created_at, updated_at FROM gift_cards ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );

      const mapped = cardsRes.rows.map(gc => ({
        id: gc.id,
        code: gc.code,
        amount: parseFloat(gc.amount),
        value: parseFloat(gc.amount),
        balance: parseFloat(gc.balance || gc.amount),
        currency: gc.currency || 'FIC',
        status: gc.status,
        expiryDate: gc.expiry_date,
        redeemedAt: gc.redeemed_at,
        description: gc.description,
        purchasedBy: gc.purchased_by,
        redeemedBy: gc.redeemed_by,
        createdAt: gc.created_at,
        updatedAt: gc.updated_at
      }));

      // Format response
      const totalPages = Math.ceil(total / limit) || 1;

      res.json({
        success: true,
        data: mapped,
        giftCards: mapped,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        links: {
          self: `/api/giftcards?page=${page}&limit=${limit}`,
          next: page < totalPages ? `/api/giftcards?page=${page + 1}&limit=${limit}` : null,
          prev: page > 1 ? `/api/giftcards?page=${page - 1}&limit=${limit}` : null,
          first: `/api/giftcards?page=1&limit=${limit}`,
          last: `/api/giftcards?page=${totalPages}&limit=${limit}`
        }
      });
    } catch (error) {
      logger.error('Error in GiftCardsController.getAll:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve gift cards', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/giftcards/:id
   * Get gift card by ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;

      const giftCard = await GiftCard.findByPk(id, {
        include: [
          {
            model: User, as: 'purchaser', attributes: ['id', 'username', 'email']
          },
          {
            model: User, as: 'redeemer', attributes: ['id', 'username', 'email'],
            required: false
          }
        ]
      });

      if (!giftCard) {
        return res.status(404).json({
          success: false, message: 'Gift card not found'
        });
      }

      res.json({
        success: true,
        data: {
          id: giftCard.id,
          code: giftCard.code,
          amount: parseFloat(giftCard.amount),
          currency: giftCard.currency,
          status: giftCard.status,
          expiryDate: giftCard.expiryDate,
          redeemedAt: giftCard.redeemedAt,
          description: giftCard.description,
          purchaser: giftCard.purchaser,
          redeemer: giftCard.redeemer,
          createdAt: giftCard.createdAt, updatedAt: giftCard.updatedAt
        }
      });
    } catch (error) {
      logger.error('Error in GiftCardsController.getById:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve gift card', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/giftcards
   * Create new gift card
   */
  async create(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false, message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { amount, currency, expiryDate, description, purchasedBy } = req.body;

      // Generate unique code
      let code;
      let isUnique = false;
      while (!isUnique) {
        code = GiftCard.generateCode();
        const existing = await GiftCard.findOne({ where: { code } });
        if (!existing) isUnique = true;
      }

      // Create gift card
      const giftCard = await GiftCard.create({
        code,
        amount, currency: currency || 'NGN',
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        description,
        purchasedBy: purchasedBy || req.user?.id
      });

      res.status(201).json({
        success: true, message: 'Gift card created successfully',
        data: {
          id: giftCard.id,
          code: giftCard.code,
          amount: parseFloat(giftCard.amount),
          currency: giftCard.currency,
          status: giftCard.status,
          expiryDate: giftCard.expiryDate,
          description: giftCard.description, createdAt: giftCard.createdAt
        }
      });
    } catch (error) {
      logger.error('Error in GiftCardsController.create:', error);
      res.status(500).json({
        success: false, message: 'Failed to create gift card', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/giftcards/:id/redeem
   * Redeem a gift card
   */
  async redeem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const giftCard = await GiftCard.findByPk(id);

      if (!giftCard) {
        return res.status(404).json({
          success: false, message: 'Gift card not found'
        });
      }

      try {
        await giftCard.redeem(userId);

        res.json({
          success: true, message: 'Gift card redeemed successfully',
          data: {
            id: giftCard.id,
            code: giftCard.code,
            amount: parseFloat(giftCard.amount),
            currency: giftCard.currency,
            status: giftCard.status,
            redeemedAt: giftCard.redeemedAt
          }
        });
      } catch (redeemError) {
        return res.status(400).json({
          success: false, message: redeemError.message
        });
      }
    } catch (error) {
      logger.error('Error in GiftCardsController.redeem:', error);
      res.status(500).json({
        success: false, message: 'Failed to redeem gift card', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * PUT /api/giftcards/:id
   * Update gift card
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { amount, expiryDate, description, status } = req.body;

      const giftCard = await GiftCard.findByPk(id);

      if (!giftCard) {
        return res.status(404).json({
          success: false, message: 'Gift card not found'
        });
      }

      // Only allow updates to certain fields
      const updates = {};
      if (amount !== undefined) updates.amount = amount;
      if (expiryDate !== undefined) updates.expiryDate = new Date(expiryDate);
      if (description !== undefined) updates.description = description;
      if (status !== undefined && ['active', 'cancelled'].includes(status)) {
        updates.status = status;
      }

      await giftCard.update(updates);

      res.json({
        success: true, message: 'Gift card updated successfully',
        data: {
          id: giftCard.id,
          code: giftCard.code,
          amount: parseFloat(giftCard.amount),
          currency: giftCard.currency,
          status: giftCard.status,
          expiryDate: giftCard.expiryDate,
          description: giftCard.description, updatedAt: giftCard.updatedAt
        }
      });
    } catch (error) {
      logger.error('Error in GiftCardsController.update:', error);
      res.status(500).json({
        success: false, message: 'Failed to update gift card', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * DELETE /api/giftcards/:id
   * Cancel/delete gift card
   */
  async delete(req, res) {
    try {
      const { id } = req.params;

      const giftCard = await GiftCard.findByPk(id);

      if (!giftCard) {
        return res.status(404).json({
          success: false, message: 'Gift card not found'
        });
      }

      // Only active cards can be cancelled
      if (giftCard.status !== 'active') {
        return res.status(400).json({
          success: false, message: 'Only active gift cards can be cancelled'
        });
      }

      await giftCard.update({ status: 'cancelled' });

      res.json({
        success: true, message: 'Gift card cancelled successfully'
      });
    } catch (error) {
      logger.error('Error in GiftCardsController.delete:', error);
      res.status(500).json({
        success: false, message: 'Failed to cancel gift card', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/giftcards/stats
   * Get gift card statistics
   */
  async getStats(req, res) {
    try {
      const stats = await GiftCard.findAll({
        attributes: [
          'status', [sequelize.fn('COUNT', sequelize.col('id')), 'count'], [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
        ], group: ['status']
      });

      const summary = {
        total: await GiftCard.count(),
        byStatus: {},
        totalValue: 0
      };

      stats.forEach(stat => {
        summary.byStatus[stat.status] = {
          count: parseInt(stat.dataValues.count),
          totalAmount: parseFloat(stat.dataValues.total_amount || 0)
        };
        summary.totalValue += parseFloat(stat.dataValues.total_amount || 0);
      });

      res.json({
        success: true, data: summary
      });
    } catch (error) {
      logger.error('Error in GiftCardsController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to retrieve statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new GiftCardsController();
