/**
 * LendSqr Controller
 * Complete implementation for lending/finance platform
 * Date: June 11, 2026 - Phase 1 Implementation
 */

const { pool } = require('../db');
const logger = require('../utils/logger');

class LendSqrController {
  /**
   * POST /api/lendsq/loans/apply
   * Apply for a loan
   */
  async applyLoan(req, res) {
    try {
      const userId = req.user?.id;
      const { amount, purpose, durationMonths, collateral } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!amount || !purpose || !durationMonths) {
        return res.status(400).json({
          success: false, message: 'Amount, purpose, and duration are required'
        });
      }

      // Calculate interest (simplified: 5% per month)
      const interestRate = 0.05;
      const totalInterest = parseFloat(amount) * interestRate * parseInt(durationMonths);
      const totalRepayment = parseFloat(amount) + totalInterest;

      const result = await pool.query(
        `INSERT INTO lendsq_loans 
         (user_id, amount, purpose, duration_months, interest_rate, total_interest, total_repayment, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW())
         RETURNING *`,
        [
          userId,
          parseFloat(amount),
          purpose,
          parseInt(durationMonths),
          interestRate,
          totalInterest,
          totalRepayment
        ]
      );

      res.status(201).json({
        success: true, message: 'Loan application submitted successfully',
        data: {
          ...result.rows[0],
          amount: parseFloat(result.rows[0].amount),
          totalInterest: parseFloat(result.rows[0].total_interest), totalRepayment: parseFloat(result.rows[0].total_repayment)
        }
      });
    } catch (error) {
      logger.error('Error in LendSqrController.applyLoan:', error);
      res.status(500).json({
        success: false, message: 'Failed to apply for loan', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/lendsq/loans/my-loans
   * Get user's loans
   */
  async getMyLoans(req, res) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      const { status } = req.query;

      let whereClause = ['user_id = $1'];
      let queryParams = [userId];
      let paramCount = 2;

      if (status) {
        whereClause.push(`status = $${paramCount}`);
        queryParams.push(status);
        paramCount++;
      }

      const result = await pool.query(
        `SELECT * FROM lendsq_loans
         WHERE ${whereClause.join(' AND ')}
         ORDER BY created_at DESC`,
        queryParams
      );

      res.json({
        success: true,
        data: result.rows.map(loan => ({
          ...loan,
          amount: parseFloat(loan.amount),
          totalInterest: parseFloat(loan.total_interest),
          totalRepayment: parseFloat(loan.total_repayment),
          disbursedAmount: loan.disbursed_amount ? parseFloat(loan.disbursed_amount) : null
        })), count: result.rows.length
      });
    } catch (error) {
      logger.error('Error in LendSqrController.getMyLoans:', error);
      res.status(500).json({
        success: false, message: 'Failed to get loans', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/lendsq/loans/:id/approve
   * Approve loan (admin/lender only)
   */
  async approveLoan(req, res) {
    try {
      // Check admin/lender permission
      if (!req.user?.isAdmin && !req.user?.isLender) {
        return res.status(403).json({
          success: false, message: 'Admin or lender access required'
        });
      }

      const { id: loanId } = req.params;
      const { notes } = req.body;

      const result = await pool.query(
        `UPDATE lendsq_loans 
         SET status = 'approved', approved_at = NOW(), approval_notes = $1
         WHERE id = $2 AND status = 'pending'
         RETURNING *`,
        [notes || null, loanId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Loan not found or already processed'
        });
      }

      res.json({
        success: true, message: 'Loan approved successfully', data: result.rows[0]
      });
    } catch (error) {
      logger.error('Error in LendSqrController.approveLoan:', error);
      res.status(500).json({
        success: false, message: 'Failed to approve loan', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/lendsq/loans/:id/disburse
   * Disburse approved loan
   */
  async disburseLoan(req, res) {
    try {
      // Check admin/lender permission
      if (!req.user?.isAdmin && !req.user?.isLender) {
        return res.status(403).json({
          success: false, message: 'Admin or lender access required'
        });
      }

      const { id: loanId } = req.params;
      const { disbursedAmount, paymentMethod } = req.body;

      const loan = await pool.query(
        'SELECT * FROM lendsq_loans WHERE id = $1',
        [loanId]
      );

      if (loan.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Loan not found'
        });
      }

      if (loan.rows[0].status !== 'approved') {
        return res.status(400).json({
          success: false, message: 'Loan must be approved before disbursement'
        });
      }

      await pool.query(
        `UPDATE lendsq_loans 
         SET status = 'disbursed', disbursed_amount = $1, payment_method = $2, disbursed_at = NOW()
         WHERE id = $3`,
        [parseFloat(disbursedAmount || loan.rows[0].amount), paymentMethod || null, loanId]
      );

      res.json({
        success: true, message: 'Loan disbursed successfully'
      });
    } catch (error) {
      logger.error('Error in LendSqrController.disburseLoan:', error);
      res.status(500).json({
        success: false, message: 'Failed to disburse loan', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * POST /api/lendsq/payments
   * Make loan payment
   */
  async makePayment(req, res) {
    try {
      const userId = req.user?.id;
      const { loanId, amount, paymentMethod } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false, message: 'Authentication required'
        });
      }

      if (!loanId || !amount) {
        return res.status(400).json({
          success: false, message: 'Loan ID and amount are required'
        });
      }

      // Verify loan ownership
      const loan = await pool.query(
        'SELECT * FROM lendsq_loans WHERE id = $1 AND user_id = $2',
        [loanId, userId]
      );

      if (loan.rows.length === 0) {
        return res.status(404).json({
          success: false, message: 'Loan not found'
        });
      }

      // Record payment
      await pool.query(
        `INSERT INTO lendsq_payments (loan_id, user_id, amount, payment_method, paid_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [loanId, userId, parseFloat(amount), paymentMethod || null]
      );

      // Update loan balance
      await pool.query(
        `UPDATE lendsq_loans 
         SET remaining_balance = remaining_balance - $1
         WHERE id = $2`,
        [parseFloat(amount), loanId]
      );

      res.status(201).json({
        success: true, message: 'Payment recorded successfully'
      });
    } catch (error) {
      logger.error('Error in LendSqrController.makePayment:', error);
      res.status(500).json({
        success: false, message: 'Failed to make payment', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * GET /api/lendsq/stats
   * Get lending statistics
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
          COUNT(*) FILTER (WHERE status = 'pending') as pending_loans COUNT(*) FILTER (WHERE status = 'approved') as approved_loans COUNT(*) FILTER (WHERE status = 'disbursed') as disbursed_loans COUNT(*) FILTER (WHERE status = 'repaid') as repaid_loans COALESCE(SUM(amount) FILTER (WHERE status = 'disbursed'), 0) as total_disbursed COALESCE(SUM(remaining_balance) FILTER (WHERE status = 'disbursed'), 0) as outstanding_balance
         FROM lendsq_loans
         WHERE user_id = $1`,
        [userId]
      );

      res.json({
        success: true,
        data: {
          pendingLoans: parseInt(stats.rows[0].pending_loans) || 0,
          approvedLoans: parseInt(stats.rows[0].approved_loans) || 0,
          disbursedLoans: parseInt(stats.rows[0].disbursed_loans) || 0,
          repaidLoans: parseInt(stats.rows[0].repaid_loans) || 0,
          totalDisbursed: parseFloat(stats.rows[0].total_disbursed) || 0, outstandingBalance: parseFloat(stats.rows[0].outstanding_balance) || 0
        }
      });
    } catch (error) {
      logger.error('Error in LendSqrController.getStats:', error);
      res.status(500).json({
        success: false, message: 'Failed to get statistics', error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new LendSqrController();
