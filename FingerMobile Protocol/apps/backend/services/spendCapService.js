const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const logger = require('../utils/logger');
const notificationService = require('./NotificationService');

class SpendCapService {
  constructor() {
    this.initializeMonthlyResetJob();
  }

  // Get or create spend cap record for user
  async getSpendCap(userId) {
    try {
      const result = await db.query(`
        SELECT * FROM spend_caps 
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `, [userId]);

      if (result.rows.length === 0) {
        // Create default record if none exists
        const newCap = await this.createDefaultSpendCap(userId);
        return newCap;
      }

      const cap = result.rows[0];
      
      // Check if we need to reset the monthly spending
      if (this.shouldResetMonthlySpending(cap.reset_date)) {
        await this.resetMonthlySpending(userId);
      }

      return cap;
    } catch (error) {
      logger.error('Error getting spend cap:', error);
      throw error;
    }
  }

  // Create default spend cap record
  async createDefaultSpendCap(userId) {
    try {
      const resetDate = this.getNextResetDate();
      const result = await db.query(`
        INSERT INTO spend_caps (user_id, monthly_cap_amount, current_month_spending, reset_date)
        VALUES ($1, NULL, 0, $2)
        RETURNING *
      `, [userId, resetDate]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error creating default spend cap:', error);
      throw error;
    }
  }

  // Update spend cap limit
  async updateSpendCap(userId, capAmount) {
    try {
      const cap = await this.getSpendCap(userId);
      const resetDate = cap.reset_date || this.getNextResetDate();
      
      let result;
      if (cap) {
        result = await db.query(`
          UPDATE spend_caps 
          SET monthly_cap_amount = $1, updated_at = NOW()
          WHERE user_id = $2
          RETURNING *
        `, [capAmount, userId]);
      } else {
        result = await db.query(`
          INSERT INTO spend_caps (user_id, monthly_cap_amount, current_month_spending, reset_date)
          VALUES ($1, $2, 0, $3)
          RETURNING *
        `, [userId, capAmount, resetDate]);
      }

      return result.rows[0];
    } catch (error) {
      logger.error('Error updating spend cap:', error);
      throw error;
    }
  }

  // Record spending and check cap
  async recordSpending(userId, amount) {
    try {
      const cap = await this.getSpendCap(userId);
      
      // If no cap is set, allow spending
      if (cap.monthly_cap_amount === null) {
        await this.incrementMonthlySpending(userId, amount);
        return { success: true, message: 'Spending recorded successfully' };
      }

      const newTotal = parseFloat(cap.current_month_spending) + parseFloat(amount);
      
      if (newTotal > parseFloat(cap.monthly_cap_amount)) {
        return { 
          success: false, 
          message: 'Monthly spending cap exceeded',
          currentSpending: cap.current_month_spending,
          capAmount: cap.monthly_cap_amount,
          attemptedAmount: amount
        };
      }

      await this.incrementMonthlySpending(userId, amount);
      return { 
        success: true, 
        message: 'Spending recorded successfully',
        remaining: cap.monthly_cap_amount - newTotal
      };
    } catch (error) {
      logger.error('Error recording spending:', error);
      throw error;
    }
  }

  // Increment monthly spending
  async incrementMonthlySpending(userId, amount) {
    try {
      await db.query(`
        UPDATE spend_caps 
        SET current_month_spending = current_month_spending + $1, updated_at = NOW()
        WHERE user_id = $2
      `, [parseFloat(amount), userId]);
    } catch (error) {
      logger.error('Error incrementing monthly spending:', error);
      throw error;
    }
  }

  // Reset monthly spending
  async resetMonthlySpending(userId) {
    try {
      const resetDate = this.getNextResetDate();
      await db.query(`
        UPDATE spend_caps 
        SET current_month_spending = 0, reset_date = $1, updated_at = NOW()
        WHERE user_id = $2
      `, [resetDate, userId]);
    } catch (error) {
      logger.error('Error resetting monthly spending:', error);
      throw error;
    }
  }

  // Check if monthly reset is needed
  shouldResetMonthlySpending(resetDate) {
    if (!resetDate) return true;
    const today = new Date();
    const reset = new Date(resetDate);
    return today >= reset;
  }

  // Get next reset date (first day of next month)
  getNextResetDate() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.toISOString();
  }

  // Initialize monthly reset job
  initializeMonthlyResetJob() {
    // Run daily at midnight to check for monthly resets
    setInterval(async () => {
      try {
        await this.processMonthlyResets();
      } catch (error) {
        logger.error('Error in monthly reset job:', error);
      }
    }, 24 * 60 * 60 * 1000); // Run daily
  }

  // Process monthly resets
  async processMonthlyResets() {
    const today = new Date();
    const result = await db.query(`
      SELECT user_id, monthly_cap_amount, current_month_spending
      FROM spend_caps 
      WHERE reset_date <= $1
    `, [today.toISOString()]);

    for (const cap of result.rows) {
      await this.resetMonthlySpending(cap.user_id);
      // Optionally notify user about reset
    }
  }
}

module.exports = new SpendCapService();