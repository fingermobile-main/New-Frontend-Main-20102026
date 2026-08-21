import { AICreditBalanceModel } from '../models/AICreditBalanceModel';
const pool = require('../db');
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
      return await this.model.deductCredits(userId, amount, usageType, metadata);
    } catch (error) {
      logger.error('deductCredits error:', error);
      throw error;
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

module.exports = new AICreditBalanceService();