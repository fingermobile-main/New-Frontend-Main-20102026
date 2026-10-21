import AICreditBalanceModel from '../models/AICreditBalanceModel';
import pool from '../db';
import logger from '../utils/logger';

class AICreditBalanceService {
  model: any; // Add type declaration for model property
  
  constructor() {
    this.model = new AICreditBalanceModel(pool);
  }

  async getBalance(userId: string) {
    try {
      let balance = await this.model.getBalance(userId);
      
      if (!balance) {
        // Initialize with default allocation
        balance = await this.model.addCredits(userId, 100, 'Initial allocation');
      }
      
      return balance;
    } catch (error) {
      logger.error('getBalance error:', error);
      throw error;
    }
  }

  async deductCredits(userId: string, amount: number, usageType: string, metadata?: any) {
    try {
      const result = await this.model.deductCredits(userId, amount, usageType, metadata);
      
      // If balance drops below a critical threshold (e.g., 10), trigger Guardian SI alert
      if (result && result.balance < 10) {
        this.triggerGuardianAlert(userId, result.balance);
      }
      
      return result;
    } catch (error) {
      logger.error('deductCredits error:', error);
      throw error;
    }
  }

  private async triggerGuardianAlert(userId: string, remainingBalance: number) {
    try {
      // Import axios dynamically to avoid circular dependencies if any
      const axios = require('axios');
      const commsUrl = process.env.COMMS_SERVICE_URL || 'http://localhost:3002/api/guardian/trigger';
      
      await axios.post(commsUrl, {
        triggerType: 'system_event',
        triggerSource: 'AICreditBalanceService',
        messageTemplate: 'anomaly_detected', // or low_balance depending on SI configuration
        targetUsers: [userId],
        customData: {
          title: 'Low AI Credit Balance',
          content: `Your AI credit balance is critically low (${remainingBalance} credits remaining). Please top up to continue using AI services without interruption.`,
          type: 'alert'
        },
        priority: 'high',
        actionRequired: true,
        threatLevel: 'low'
      }, {
        headers: {
          'Authorization': 'Bearer GUARDIAN_INTERNAL_SECURE_TOKEN_2026',
          'Content-Type': 'application/json'
        }
      });
      logger.info(`Guardian SI alert triggered for user ${userId} regarding low balance`);
    } catch (error: any) {
      logger.error('Failed to trigger Guardian SI alert:', error.message);
      // We don't throw here to avoid disrupting the main deduction flow
    }
  }

  async addCredits(userId: string, amount: number, reason: string) {
    try {
      return await this.model.addCredits(userId, amount, reason);
    } catch (error) {
      logger.error('addCredits error:', error);
      throw error;
    }
  }

  async getUsageHistory(userId: string, limit: number = 50) {
    try {
      return await this.model.getUsageHistory(userId, limit);
    } catch (error) {
      logger.error('getUsageHistory error:', error);
      throw error;
    }
  }

  async resetMonthlyAllocation(userId: string) {
    try {
      const query = `
        UPDATE ai_credit_balances
        SET used_this_month = 0,
            balance = balance + rollover_credits,
            updated_at = NOW()
        WHERE user_id = $1
      `;
      await pool.query(query, [userId]);
    } catch (error) {
      logger.error('resetMonthlyAllocation error:', error);
      throw error;
    }
  }
}

export default new AICreditBalanceService();