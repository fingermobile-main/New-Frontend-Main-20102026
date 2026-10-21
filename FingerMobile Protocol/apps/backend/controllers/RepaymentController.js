/**
 * Repayment Controller
 * Handles loan repayment operations
 */

const { Repayment, Loan, User } = require('../models');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op, fn, col } = require('sequelize');

class RepaymentController {
  // Create a new repayment
  async createRepayment(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { loanId, amount, paymentDate, paymentMethod, status } = req.body;
      const userId = req.user.id; // Assuming user is authenticated

      // Find the loan
      const loan = await Loan.findByPk(loanId);
      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }

      // Verify user owns the loan
      if (loan.borrowerId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to make repayments for this loan'
        });
      }

      // Create the repayment
      const repayment = await Repayment.create({
        loanId,
        amount,
        paymentDate: paymentDate || new Date(),
        paymentMethod,
        status: status || 'pending'
      });

      res.status(201).json({
        success: true,
        message: 'Repayment created successfully',
        repayment
      });
    } catch (error) {
      logger.error('Error creating repayment:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while creating repayment',
        error: error.message
      });
    }
  }

  // Get all repayments with pagination and filtering
  async getAllRepayments(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        loanId = '',
        status = '',
        startDate = '',
        endDate = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      // Convert to integers
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = {};

      if (loanId) {
        whereConditions.loanId = loanId;
      }

      if (status) {
        whereConditions.status = status;
      }

      if (startDate) {
        whereConditions.paymentDate = { [Op.gte]: new Date(startDate) };
      }
      if (endDate) {
        whereConditions.paymentDate = whereConditions.paymentDate ?
          { ...whereConditions.paymentDate, [Op.lte]: new Date(endDate) } :
          { [Op.lte]: new Date(endDate) };
      }

      // Only allow users to see their own repayments unless they are admins
      const userRole = req.user.role;
      if (userRole !== 'admin' && userRole !== 'moderator') {
        // Get user's loans to filter repayments
        const userLoans = await Loan.findAll({
          where: { borrowerId: req.user.id },
          attributes: ['id']
        });
        const loanIds = userLoans.map(loan => loan.id);
        whereConditions.loanId = { [Op.in]: loanIds };
      }

      // Fetch repayments with pagination
      const repayments = await Repayment.findAndCountAll({
        where: whereConditions,
        include: [{
          model: Loan,
          as: 'loan',
          attributes: ['id', 'principalAmount', 'status'],
          include: [{
            model: User,
            as: 'borrower',
            attributes: ['id', 'username', 'displayName']
          }]
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      // Calculate pagination info
      const totalPages = Math.ceil(repayments.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        repayments: repayments.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalRepayments: repayments.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching repayments:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching repayments',
        error: error.message
      });
    }
  }

  // Get a single repayment by ID
  async getRepaymentById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Find the repayment
      let repaymentQuery = {
        where: { id },
        include: [{
          model: Loan,
          as: 'loan',
          attributes: ['id', 'principalAmount', 'status'],
          include: [{
            model: User,
            as: 'borrower',
            attributes: ['id', 'username', 'displayName']
          }]
        }]
      };

      // Regular users can only see repayments for their loans
      if (userRole !== 'admin' && userRole !== 'moderator') {
        // Get user's loans to filter repayments
        const userLoans = await Loan.findAll({
          where: { borrowerId: userId },
          attributes: ['id']
        });
        const loanIds = userLoans.map(loan => loan.id);
        repaymentQuery.where.loanId = { [Op.in]: loanIds };
      }

      const repayment = await Repayment.findOne(repaymentQuery);

      if (!repayment) {
        return res.status(404).json({
          success: false,
          message: 'Repayment not found'
        });
      }

      res.status(200).json({
        success: true,
        repayment
      });
    } catch (error) {
      logger.error('Error fetching repayment:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching repayment',
        error: error.message
      });
    }
  }

  // Update a repayment
  async updateRepayment(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      // Find the repayment
      const repayment = await Repayment.findByPk(id);
      if (!repayment) {
        return res.status(404).json({
          success: false,
          message: 'Repayment not found'
        });
      }

      // Find the associated loan to verify ownership
      const loan = await Loan.findByPk(repayment.loanId);
      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Associated loan not found'
        });
      }

      // Check if user owns the loan (only owner can update repayment unless admin)
      const userRole = req.user.role;
      if (loan.borrowerId !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this repayment'
        });
      }

      // Update the repayment
      await repayment.update(updates);

      res.status(200).json({
        success: true,
        message: 'Repayment updated successfully',
        repayment
      });
    } catch (error) {
      logger.error('Error updating repayment:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating repayment',
        error: error.message
      });
    }
  }

  // Delete a repayment
  async deleteRepayment(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find the repayment
      const repayment = await Repayment.findByPk(id);
      if (!repayment) {
        return res.status(404).json({
          success: false,
          message: 'Repayment not found'
        });
      }

      // Find the associated loan to verify ownership
      const loan = await Loan.findByPk(repayment.loanId);
      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Associated loan not found'
        });
      }

      // Check if user owns the loan (only owner can delete repayment unless admin)
      const userRole = req.user.role;
      if (loan.borrowerId !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this repayment'
        });
      }

      // Delete the repayment
      await repayment.destroy();

      res.status(200).json({
        success: true,
        message: 'Repayment deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting repayment:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while deleting repayment',
        error: error.message
      });
    }
  }

  // Get repayments by loan
  async getRepaymentsByLoan(req, res) {
    try {
      const { loanId } = req.params;
      const userId = req.user.id;
      const { page = 1, limit = 10, status = '' } = req.query;

      // Verify user owns the loan
      const loan = await Loan.findByPk(loanId);
      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }

      const userRole = req.user.role;
      if (loan.borrowerId !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view repayments for this loan'
        });
      }

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      let whereConditions = { loanId };
      if (status) {
        whereConditions.status = status;
      }

      const repayments = await Repayment.findAndCountAll({
        where: whereConditions,
        include: [{
          model: Loan,
          as: 'loan',
          attributes: ['id', 'principalAmount', 'status']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [['paymentDate', 'ASC']]
      });

      const totalPages = Math.ceil(repayments.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        repayments: repayments.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalRepayments: repayments.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching loan repayments:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching loan repayments',
        error: error.message
      });
    }
  }

  // Get repayment statistics
  async getRepaymentStats(req, res) {
    try {
      const userId = req.user.id;

      // Get user's loans
      const userLoans = await Loan.findAll({
        where: { borrowerId: userId },
        attributes: ['id']
      });
      const loanIds = userLoans.map(loan => loan.id);

      // Get repayment statistics
      const stats = await Repayment.findAll({
        where: { loanId: { [Op.in]: loanIds } },
        attributes: [
          [fn('SUM', col('amount')), 'totalPaid'],
          [fn('COUNT', col('id')), 'totalRepayments'],
          [fn('AVG', col('amount')), 'averageRepayment']
        ]
      });

      const statsResult = stats[0].dataValues;

      res.status(200).json({
        success: true,
        stats: {
          totalPaid: parseFloat(statsResult.totalPaid) || 0,
          totalRepayments: parseInt(statsResult.totalRepayments) || 0,
          averageRepayment: parseFloat(statsResult.averageRepayment) || 0
        }
      });
    } catch (error) {
      logger.error('Error fetching repayment stats:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching repayment stats',
        error: error.message
      });
    }
  }
}

module.exports = new RepaymentController();
