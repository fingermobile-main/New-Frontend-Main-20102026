const logger = require('../utils/logger');
/**
 * CommerceService
 * Service for commerce and transactions
 * Created: June 8, 2026
 */

const db = require('../database/connection');

class CommerceService {
  async getTransactions(userId, filters = {}) {
    try {
      const { limit = 50, offset = 0, type, status, startDate, endDate } = filters;

      let query = db('commerce_transactions')
        .where({ user_id: userId });

      if (type) query = query.where({ type });
      if (status) query = query.where({ status });
      if (startDate) query = query.where('created_at', '>=', startDate);
      if (endDate) query = query.where('created_at', '<=', endDate);

      query = query.orderBy('created_at', 'DESC').limit(limit).offset(offset);

      const transactions = await query;
      const [{ total }] = await db('commerce_transactions')
        .where({ user_id: userId })
        .count('* as total');

      return { data: transactions, total: parseInt(total), limit, offset };
    } catch (error) {
      logger.error('Error in CommerceService.getTransactions:', error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  async createTransaction(data) {
    try {
      const now = new Date();
      const [transaction] = await db('commerce_transactions').insert({
        ...data,
        status: 'pending',
        created_at: now,
        updated_at: now
      }).returning('*');

      return transaction;
    } catch (error) {
      logger.error('Error in CommerceService.createTransaction:', error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  async updateTransactionStatus(transactionId, status, metadata = {}) {
    try {
      const [updated] = await db('commerce_transactions')
        .where({ id: transactionId })
        .update({
          status,
          metadata,
          updated_at: new Date()
        })
        .returning('*');

      return updated;
    } catch (error) {
      logger.error('Error in CommerceService.updateTransactionStatus:', error);
      throw new Error(`Failed to update transaction: ${error.message}`);
    }
  }

  async getCommerceStats(userId) {
    try {
      const totalSpent = await db('commerce_transactions')
        .where({ user_id: userId, type: 'purchase', status: 'completed' })
        .sum('amount as total');

      const totalEarned = await db('commerce_transactions')
        .where({ user_id: userId, type: 'sale', status: 'completed' })
        .sum('amount as total');

      const transactionCount = await db('commerce_transactions')
        .where({ user_id: userId })
        .count('* as count');

      return {
        totalSpent: parseFloat(totalSpent[0].total || 0),
        totalEarned: parseFloat(totalEarned[0].total || 0),
        transactionCount: parseInt(transactionCount[0].count)
      };
    } catch (error) {
      logger.error('Error in CommerceService.getCommerceStats:', error);
      throw new Error(`Failed to fetch stats: ${error.message}`);
    }
  }
}

module.exports = new CommerceService();
