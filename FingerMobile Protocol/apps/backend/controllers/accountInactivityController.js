const logger = require('../utils/logger');
const accountInactivityService = require('../services/accountInactivityService');
const db = require('../db'); // Add database import

class AccountInactivityController {
  // Get account inactivity status
  async getStatus(req, res) {
    try {
      const userId = req.user.id;
      
      const result = await db.query(`
        SELECT u.account_status, u.last_login_at,
               ail.status as inactivity_status, ail.last_login_date, 
               ail.freeze_date, ail.notification_count, ail.liability_amount
        FROM users u
        LEFT JOIN account_inactivity_log ail ON u.id = ail.user_id
        WHERE u.id = $1
      `, [userId]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const userData = result.rows[0];
      
      res.status(200).json({
        success: true,
        data: {
          accountStatus: userData.account_status,
          inactivityStatus: userData.inactivity_status,
          lastLoginDate: userData.last_login_at || userData.last_login_date,
          freezeDate: userData.freeze_date,
          notificationCount: userData.notification_count,
          liabilityAmount: userData.liability_amount
        }
      });
    } catch (error) {
      logger.error('Error getting account inactivity status:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve account inactivity status'
      });
    }
  }

  // Force account reactivation (admin only)
  async forceReactivate(req, res) {
    try {
      const { userId } = req.params;
      
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      const reactivated = await accountInactivityService.reactivateAccount(userId);
      
      if (reactivated) {
        res.status(200).json({
          success: true,
          message: 'Account reactivated successfully'
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Account could not be reactivated'
        });
      }
    } catch (error) {
      logger.error('Error forcing account reactivation:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reactivate account'
      });
    }
  }

  // Update user last login (call this when user logs in)
  async updateLastLogin(req, res) {
    try {
      const userId = req.user.id;
      
      const updatedRecord = await accountInactivityService.updateUserLastLogin(userId);
      
      res.status(200).json({
        success: true,
        data: updatedRecord,
        message: 'Last login updated successfully'
      });
    } catch (error) {
      logger.error('Error updating last login:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update last login'
      });
    }
  }

  // Manually trigger inactivity check (admin only)
  async triggerInactivityCheck(req, res) {
    try {
      // Check if user is admin
      if (!req.user.isAdmin) {
        return res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }

      await accountInactivityService.checkInactiveAccounts();
      
      res.status(200).json({
        success: true,
        message: 'Inactivity check triggered successfully'
      });
    } catch (error) {
      logger.error('Error triggering inactivity check:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to trigger inactivity check'
      });
    }
  }
}

module.exports = new AccountInactivityController();