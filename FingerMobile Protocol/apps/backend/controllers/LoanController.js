/**
 * Loan Controller
 * Handles loan-related operations
 */

const { Loan, User } = require('../models');
const logger = require('../utils/logger');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class LoanController {
  constructor() {
    this.createLoan = this.createLoan.bind(this);
    this.getAllLoans = this.getAllLoans.bind(this);
    this.getLoanById = this.getLoanById.bind(this);
    this.updateLoan = this.updateLoan.bind(this);
    this.deleteLoan = this.deleteLoan.bind(this);
    this.getLoansByUser = this.getLoansByUser.bind(this);
    this.getRepaymentSchedule = this.getRepaymentSchedule.bind(this);
  }
  // Create a new loan
  async createLoan(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        principalAmount,
        interestRate,
        termMonths,
        startDate,
        endDate,
        status,
        purpose,
        collateral
      } = req.body;
      const borrowerId = req.user.id; // Assuming user is authenticated

      // Create the loan
      const loan = await Loan.create({
        borrowerId,
        principalAmount,
        interestRate,
        termMonths,
        startDate: startDate || new Date(),
        endDate,
        status: status || 'pending',
        purpose,
        collateral
      });

      res.status(201).json({
        success: true,
        message: 'Loan created successfully',
        loan
      });
    } catch (error) {
      logger.error('Error creating loan:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while creating loan',
        error: error.message
      });
    }
  }

  // Get all loans with pagination and filtering
  async getAllLoans(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        status = '',
        startDate = '',
        endDate = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        borrowerId = ''
      } = req.query;

      // Convert to integers
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Build filter conditions
      let whereConditions = {};

      if (status) {
        whereConditions.status = status;
      }

      if (startDate) {
        whereConditions.startDate = { [Op.gte]: new Date(startDate) };
      }
      if (endDate) {
        whereConditions.endDate = whereConditions.endDate ?
          { ...whereConditions.endDate, [Op.lte]: new Date(endDate) } :
          { [Op.lte]: new Date(endDate) };
      }

      if (borrowerId) {
        whereConditions.borrowerId = borrowerId;
      }

      // Only allow users to see their own loans unless they are admins
      const userRole = req.user.role;
      if (userRole !== 'admin' && userRole !== 'moderator') {
        whereConditions.borrowerId = req.user.id;
      }

      // Fetch loans with pagination
      const loans = await Loan.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'borrower',
          attributes: ['id', 'username', 'email', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [[sortBy, sortOrder.toUpperCase()]]
      });

      // Calculate pagination info
      const totalPages = Math.ceil(loans.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        loans: loans.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalLoans: loans.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching loans:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching loans',
        error: error.message
      });
    }
  }

  // Get a single loan by ID
  async getLoanById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Find the loan
      let loanQuery = {
        where: { id },
        include: [{
          model: User,
          as: 'borrower',
          attributes: ['id', 'username', 'email', 'displayName']
        }]
      };

      // Regular users can only see their own loans
      if (userRole !== 'admin' && userRole !== 'moderator') {
        loanQuery.where.borrowerId = userId;
      }

      const loan = await Loan.findOne(loanQuery);

      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }

      res.status(200).json({
        success: true,
        loan
      });
    } catch (error) {
      logger.error('Error fetching loan:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching loan',
        error: error.message
      });
    }
  }

  // Update a loan
  async updateLoan(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      // Find the loan
      const loan = await Loan.findByPk(id);
      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }

      // Check if user owns the loan (only owner can update unless admin)
      const userRole = req.user.role;
      if (loan.borrowerId !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this loan'
        });
      }

      // Update the loan
      await loan.update(updates);

      res.status(200).json({
        success: true,
        message: 'Loan updated successfully',
        loan
      });
    } catch (error) {
      logger.error('Error updating loan:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while updating loan',
        error: error.message
      });
    }
  }

  // Delete a loan
  async deleteLoan(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Find the loan
      const loan = await Loan.findByPk(id);
      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }

      // Check if user owns the loan (only owner can delete unless admin)
      const userRole = req.user.role;
      if (loan.borrowerId !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this loan'
        });
      }

      // Delete the loan
      await loan.destroy();

      res.status(200).json({
        success: true,
        message: 'Loan deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting loan:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while deleting loan',
        error: error.message
      });
    }
  }

  // Get loans by user
  async getLoansByUser(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status = '' } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      let whereConditions = { borrowerId: userId };
      if (status) {
        whereConditions.status = status;
      }

      const loans = await Loan.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'borrower',
          attributes: ['id', 'username', 'email', 'displayName']
        }],
        limit: limitNum,
        offset: (pageNum - 1) * limitNum,
        order: [['createdAt', 'DESC']]
      });

      const totalPages = Math.ceil(loans.count / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      res.status(200).json({
        success: true,
        loans: loans.rows,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalLoans: loans.count,
          hasNextPage,
          hasPrevPage,
          limit: limitNum
        }
      });
    } catch (error) {
      logger.error('Error fetching user loans:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while fetching user loans',
        error: error.message
      });
    }
  }

  // Get loan repayment schedule
  async getRepaymentSchedule(req, res) {
    try {
      const { id } = req.params;

      // This would typically involve calculating the repayment schedule
      // based on the loan terms. For now, returning a placeholder response.
      const loan = await Loan.findByPk(id);
      if (!loan) {
        return res.status(404).json({
          success: false,
          message: 'Loan not found'
        });
      }

      // Calculate repayment schedule
      const schedule = this.calculateRepaymentSchedule(loan);

      res.status(200).json({
        success: true,
        schedule
      });
    } catch (error) {
      logger.error('Error getting repayment schedule:', error);
      res.status(500).json({
        success: false,
        message: 'Server error occurred while getting repayment schedule',
        error: error.message
      });
    }
  }

  // Helper method to calculate repayment schedule
  calculateRepaymentSchedule(loan) {
    // This is a simplified calculation - in reality, you'd use more complex financial formulas
    const monthlyPayment = this.calculateMonthlyPayment(
      loan.principalAmount,
      loan.interestRate,
      loan.termMonths
    );

    const schedule = [];
    let balance = loan.principalAmount;
    const startDate = new Date(loan.startDate);

    for (let month = 1; month <= loan.termMonths; month++) {
      const interestPayment = balance * (loan.interestRate / 100 / 12);
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month,
        paymentDate: new Date(startDate.getFullYear(), startDate.getMonth() + month, startDate.getDate()),
        monthlyPayment,
        principalPayment,
        interestPayment,
        remainingBalance: Math.max(0, balance)
      });
    }

    return schedule;
  }

  // Helper method to calculate monthly payment
  calculateMonthlyPayment(principal, annualInterestRate, months) {
    const monthlyRate = annualInterestRate / 100 / 12;
    return principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
           (Math.pow(1 + monthlyRate, months) - 1);
  }
}

module.exports = new LoanController();
