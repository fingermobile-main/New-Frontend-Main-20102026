const logger = require('../utils/logger');
const spendCapService = require('../services/spendCapService');

class SpendCapController {
  // Get user's spend cap
  async getCap(req, res) {
    try {
      const userId = req.user.id;
      const cap = await spendCapService.getSpendCap(userId);

      res.status(200).json({
        success: true,
        data: {
          monthlyCap: cap.monthly_cap_amount,
          currentSpending: cap.current_month_spending,
          resetDate: cap.reset_date,
          remaining: cap.monthly_cap_amount ?
            (cap.monthly_cap_amount - cap.current_month_spending) : null
        }
      });
    } catch (error) {
      logger.error('Error getting spend cap:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve spend cap'
      });
    }
  }

  // Update user's spend cap
  async updateCap(req, res) {
    try {
      const userId = req.user.id;
      const { capAmount } = req.body;

      // Validate input
      if (capAmount !== null && capAmount !== undefined) {
        if (typeof capAmount !== 'number' || capAmount < 0) {
          return res.status(400).json({
            success: false,
            message: 'Invalid cap amount. Must be a non-negative number or null for no cap.'
          });
        }
      }

      const updatedCap = await spendCapService.updateSpendCap(userId, capAmount);

      res.status(200).json({
        success: true,
        data: {
          monthlyCap: updatedCap.monthly_cap_amount,
          currentSpending: updatedCap.current_month_spending,
          resetDate: updatedCap.reset_date
        },
        message: 'Spend cap updated successfully'
      });
    } catch (error) {
      logger.error('Error updating spend cap:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update spend cap'
      });
    }
  }

  // Record spending (internal use)
  async recordSpending(req, res) {
    try {
      const userId = req.user.id;
      const { amount } = req.body;

      // Validate input
      if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount. Must be a positive number.'
        });
      }

      const result = await spendCapService.recordSpending(userId, amount);

      if (result.success) {
        res.status(200).json({
          success: true,
          data: {
            remaining: result.remaining
          },
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          data: {
            currentSpending: result.currentSpending,
            capAmount: result.capAmount,
            attemptedAmount: result.attemptedAmount
          }
        });
      }
    } catch (error) {
      logger.error('Error recording spending:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to record spending'
      });
    }
  }

  // Remove spend cap (set to null)
  async removeCap(req, res) {
    try {
      const userId = req.user.id;

      const updatedCap = await spendCapService.updateSpendCap(userId, null);

      res.status(200).json({
        success: true,
        data: {
          monthlyCap: updatedCap.monthly_cap_amount,
          currentSpending: updatedCap.current_month_spending,
          resetDate: updatedCap.reset_date
        },
        message: 'Spend cap removed successfully'
      });
    } catch (error) {
      logger.error('Error removing spend cap:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to remove spend cap'
      });
    }
  }
}

module.exports = new SpendCapController();
