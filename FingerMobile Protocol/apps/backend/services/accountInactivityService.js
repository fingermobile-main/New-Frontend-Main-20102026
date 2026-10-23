const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const logger = require('../utils/logger');
const notificationService = require('./NotificationService');
const paymentService = require('./PaymentService'); // Import payment service

class AccountInactivityService {
  constructor() {
    this.inactivityCheckInterval = 24 * 60 * 60 * 1000; // 24 hours
    this.startInactivityCheckJob();
  }

  // Mark user as inactive (called when user logs in)
  async updateUserLastLogin(userId) {
    try {
      const now = new Date();
      const result = await db.query(`
        INSERT INTO account_inactivity_log (user_id, last_login_date, status)
        VALUES ($1, $2, 'active')
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          last_login_date = $2,
          status = CASE 
            WHEN account_inactivity_log.status = 'frozen' THEN 'active'
            ELSE 'active'
          END,
          updated_at = NOW()
        RETURNING *
      `, [userId, now]);

      // Update users table as well
      await db.query(`
        UPDATE users 
        SET last_login_at = $1, account_status = 'active'
        WHERE id = $2
      `, [now, userId]);

      return result.rows[0];
    } catch (error) {
      logger.error('Error updating user last login:', error);
      throw error;
    }
  }

  // Check for inactive accounts
  async checkInactiveAccounts() {
    try {
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      // Find accounts that haven't logged in for 60+ days and are still active
      const inactiveResult = await db.query(`
        SELECT u.id, u.email, u.phone, u.first_name, u.last_name,
               ail.last_login_date, ail.notification_count, ail.status as inactivity_status
        FROM users u
        LEFT JOIN account_inactivity_log ail ON u.id = ail.user_id
        WHERE (u.last_login_at IS NULL OR u.last_login_at < $1)
          AND (ail.status IS NULL OR ail.status = 'active' OR ail.status = 'inactive_pending')
          AND u.account_status = 'active'
      `, [sixtyDaysAgo]);

      for (const user of inactiveResult.rows) {
        await this.handleInactiveAccount(user);
      }

      // Check for accounts that need reconciliation notifications
      await this.checkReconciliationNotifications();

      // Check for accounts that should be closed after 2-3 years
      await this.checkLongTermInactiveAccounts();

      logger.info(`Processed ${inactiveResult.rows.length} potentially inactive accounts`);
    } catch (error) {
      logger.error('Error checking inactive accounts:', error);
      throw error;
    }
  }

  // Handle inactive account
  async handleInactiveAccount(user) {
    try {
      const now = new Date();
      const result = await db.query(`
        INSERT INTO account_inactivity_log (user_id, last_login_date, status, freeze_date)
        VALUES ($1, $2, 'frozen', $3)
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          last_login_date = $2,
          status = 'frozen',
          freeze_date = CASE 
            WHEN account_inactivity_log.status != 'frozen' THEN $3
            ELSE account_inactivity_log.freeze_date
          END,
          updated_at = NOW()
        RETURNING *
      `, [user.id, user.last_login_date, now]);

      // Update users table to frozen status
      await db.query(`
        UPDATE users 
        SET account_status = 'frozen'
        WHERE id = $1
      `, [user.id]);

      // Send notification about account freeze
      await notificationService.sendNotification({
        userId: user.id,
        type: 'ACCOUNT_FROZEN',
        title: 'Account Frozen Due to Inactivity',
        message: 'Your account has been frozen due to 60+ days of inactivity. Please log in to reactivate.',
        priority: 'high'
      });

      logger.info(`Account ${user.id} frozen due to inactivity`);
    } catch (error) {
      logger.error('Error handling inactive account:', error);
      throw error;
    }
  }

  // Check and send reconciliation notifications
  async checkReconciliationNotifications() {
    try {
      const now = new Date();
      const result = await db.query(`
        SELECT u.id, u.email, u.phone, u.first_name, u.last_name,
               ail.liability_amount, ail.notification_count, ail.freeze_date
        FROM users u
        JOIN account_inactivity_log ail ON u.id = ail.user_id
        WHERE ail.status = 'frozen'
          AND ail.liability_amount > 0
          AND ail.liability_paid = FALSE
      `);

      for (const user of result.rows) {
        // Calculate notification schedule
        const daysSinceFreeze = Math.floor((now - new Date(user.freeze_date)) / (1000 * 60 * 60 * 24));

        let shouldNotify = false;
        if (daysSinceFreeze <= 21) { // First 3 weeks: 3 times per week
          // Notify every 2.33 days (approx 3 times per week)
          if (user.notification_count < 9 && daysSinceFreeze >= Math.ceil(user.notification_count * 2.33)) {
            shouldNotify = true;
          }
        } else { // After 3 weeks: once per week
          // Notify every 7 days after first 3 weeks
          const weeksAfterInitial = Math.floor((daysSinceFreeze - 21) / 7);
          if (weeksAfterInitial >= user.notification_count - 9) {
            shouldNotify = true;
          }
        }

        if (shouldNotify) {
          await this.sendLiabilityNotification(user);
        }
      }
    } catch (error) {
      logger.error('Error checking reconciliation notifications:', error);
      throw error;
    }
  }

  // Send liability notification
  async sendLiabilityNotification(user) {
    try {
      await db.query(`
        UPDATE account_inactivity_log 
        SET notification_count = notification_count + 1
        WHERE user_id = $1
      `, [user.id]);

      await notificationService.sendNotification({
        userId: user.id,
        type: 'LIABILITY_REMINDER',
        title: 'Outstanding Liability Reminder',
        message: `You have an outstanding liability of ${user.liability_amount} FIC that needs to be settled. Your account remains frozen until payment is made.`,
        priority: 'high'
      });
    } catch (error) {
      logger.error('Error sending liability notification:', error);
      throw error;
    }
  }

  // Check for long-term inactive accounts (2-3 years)
  async checkLongTermInactiveAccounts() {
    try {
      const threeYearsAgo = new Date();
      threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

      const result = await db.query(`
        SELECT u.id, u.email, u.phone,
               ail.freeze_date, ail.liability_amount
        FROM users u
        JOIN account_inactivity_log ail ON u.id = ail.user_id
        WHERE ail.freeze_date < $1
          AND ail.status = 'frozen'
      `, [threeYearsAgo]);

      for (const user of result.rows) {
        // Auto-reconcile any liabilities before closing
        if (user.liability_amount > 0) {
          await this.autoReconcileLiability(user.id, user.liability_amount);
        }

        // Close the account
        await this.closeAccount(user.id);
      }
    } catch (error) {
      logger.error('Error checking long-term inactive accounts:', error);
      throw error;
    }
  }

  // Auto-reconcile liability
  async autoReconcileLiability(userId, amount) {
    try {
      // Check if auto-reconcile is enabled for this user
      const userResult = await db.query(`
        SELECT auto_reconcile_enabled FROM users WHERE id = $1
      `, [userId]);

      if (userResult.rows[0]?.auto_reconcile_enabled) {
        // Attempt to reconcile using available funds (wallet first, then payment methods)
        try {
          const reconciliationResult = await paymentService.autoReconcileWithAvailableFunds(userId, amount);

          await db.query(`
            UPDATE account_inactivity_log 
            SET liability_paid = TRUE, liability_amount = 0
            WHERE user_id = $1
          `, [userId]);

          await notificationService.sendNotification({
            userId: userId,
            type: 'LIABILITY_SETTLED',
            title: 'Liability Automatically Settled',
            message: `Your outstanding liability of ${amount} FIC has been automatically settled.`,
            priority: 'medium'
          });
        } catch (paymentError) {
          logger.error(`Error auto-reconciling liability for user ${userId}:`, paymentError);

          // Send notification about failed payment attempt
          await notificationService.sendNotification({
            userId: userId,
            type: 'PAYMENT_FAILED',
            title: 'Liability Settlement Failed',
            message: `We attempted to settle your outstanding liability of ${amount} FIC but encountered an issue. Please update your payment information.`,
            priority: 'high'
          });
        }
      } else {
        // If auto-reconcile is disabled, send final notice
        await notificationService.sendNotification({
          userId: userId,
          type: 'FINAL_LIABILITY_NOTICE',
          title: 'Final Liability Notice',
          message: `Your account has outstanding liabilities of ${amount} FIC. Since auto-reconciliation is disabled, your account will be closed soon.`,
          priority: 'high'
        });
      }
    } catch (error) {
      logger.error('Error auto-reconciling liability:', error);
      throw error;
    }
  }

  // Close account permanently
  async closeAccount(userId) {
    try {
      // Update inactivity log
      await db.query(`
        UPDATE account_inactivity_log 
        SET status = 'closed', scheduled_closure_date = NOW()
        WHERE user_id = $1
      `, [userId]);

      // Update user status
      await db.query(`
        UPDATE users 
        SET account_status = 'closed', updated_at = NOW()
        WHERE id = $1
      `, [userId]);

      await notificationService.sendNotification({
        userId: userId,
        type: 'ACCOUNT_CLOSED',
        title: 'Account Permanently Closed',
        message: 'Your account has been permanently closed due to extended inactivity. All data has been deleted.',
        priority: 'high'
      });

      // Schedule data deletion (could be done by a separate process)
      setTimeout(async () => {
        await this.permanentlyDeleteUserData(userId);
      }, 24 * 60 * 60 * 1000); // Delete data after 24 hours
    } catch (error) {
      logger.error('Error closing account:', error);
      throw error;
    }
  }

  // Permanently delete user data
  async permanentlyDeleteUserData(userId) {
    try {
      // This is a simplified version - in reality, you'd need to delete from multiple tables
      // respecting foreign key constraints
      await db.query('DELETE FROM users WHERE id = $1', [userId]);

      logger.info(`Permanently deleted user data for ${userId}`);
    } catch (error) {
      logger.error('Error permanently deleting user data:', error);
      throw error;
    }
  }

  // Start the inactivity check job
  startInactivityCheckJob() {
    // Run the inactivity check daily
    setInterval(async () => {
      try {
        await this.checkInactiveAccounts();
      } catch (error) {
        logger.error('Error in inactivity check job:', error);
      }
    }, this.inactivityCheckInterval);

    // Run initial check
    setTimeout(async () => {
      try {
        await this.checkInactiveAccounts();
      } catch (error) {
        logger.error('Error in initial inactivity check:', error);
      }
    }, 5000); // Run after 5 seconds to let the system start up
  }

  // Reactivate account after login
  async reactivateAccount(userId) {
    try {
      const result = await db.query(`
        UPDATE account_inactivity_log 
        SET status = 'active', updated_at = NOW()
        WHERE user_id = $1 AND status = 'frozen'
        RETURNING *
      `, [userId]);

      if (result.rowCount > 0) {
        await db.query(`
          UPDATE users 
          SET account_status = 'active', updated_at = NOW()
          WHERE id = $1
        `, [userId]);

        await notificationService.sendNotification({
          userId: userId,
          type: 'ACCOUNT_REACTIVATED',
          title: 'Account Reactivated',
          message: 'Your account has been successfully reactivated after logging in.',
          priority: 'low'
        });
      }

      return result.rowCount > 0;
    } catch (error) {
      logger.error('Error reactivating account:', error);
      throw error;
    }
  }
}

module.exports = new AccountInactivityService();
