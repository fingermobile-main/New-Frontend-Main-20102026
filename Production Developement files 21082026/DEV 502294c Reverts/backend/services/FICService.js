/**
 * FICService - FingerMobile Internal Currency Service
 * Manages virtual currency transactions, balances, and transfers
 */

const pool = require('../database/connection');

class FICService {
  /**
   * Get user's FIC balance
   */
  async getBalance(userId) {
    try {
      const query = `
        SELECT COALESCE(SUM(
          CASE 
            WHEN type IN ('credit', 'deposit', 'reward', 'refund') THEN amount
            WHEN type IN ('debit', 'withdrawal', 'purchase', 'fee') THEN -amount
            ELSE 0
          END
        ), 0) as balance
        FROM fic_transactions
        WHERE user_id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      return parseFloat(result.rows[0].balance) || 0;
    } catch (error) {
      logger.error('Error in FICService.getBalance:', error);
      throw error;
    }
  }
  
  /**
   * Credit FIC to user account
   */
  async credit(userId, amount, description, metadata = {}) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create transaction record
      const transactionQuery = `
        INSERT INTO fic_transactions (
          user_id, type, amount, description, metadata, status, created_at
        ) VALUES ($1, 'credit', $2, $3, $4, 'completed', NOW())
        RETURNING *
      `;
      
      const result = await client.query(transactionQuery, [
        userId,
        amount,
        description,
        JSON.stringify(metadata)
      ]);
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error in FICService.credit:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Debit FIC from user account
   */
  async debit(userId, amount, description, metadata = {}) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check balance
      const balance = await this.getBalance(userId);
      
      if (balance < amount) {
        throw new Error(`Insufficient balance. Available: ${balance} Required: ${amount}`);
      }
      
      // Create transaction record
      const transactionQuery = `
        INSERT INTO fic_transactions (
          user_id, type, amount, description, metadata, status, created_at
        ) VALUES ($1, 'debit', $2, $3, $4, 'completed', NOW())
        RETURNING *
      `;
      
      const result = await client.query(transactionQuery, [
        userId,
        amount,
        description,
        JSON.stringify(metadata)
      ]);
      
      await client.query('COMMIT');
      
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error in FICService.debit:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Transfer FIC between users (P2P)
   */
  async transfer(fromUserId, toUserId, amount, description) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    
    if (fromUserId === toUserId) {
      throw new Error('Cannot transfer to same user');
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check sender balance
      const senderBalance = await this.getBalance(fromUserId);
      
      if (senderBalance < amount) {
        throw new Error(`Insufficient balance. Available: ${senderBalance} Required: ${amount}`);
      }
      
      // Debit from sender
      await client.query(`
        INSERT INTO fic_transactions (
          user_id, type, amount, description, status, created_at
        ) VALUES ($1, 'debit', $2, $3, 'completed', NOW())
      `, [fromUserId, amount, `Transfer to user ${toUserId}: ${description}`]);
      
      // Credit to recipient
      await client.query(`
        INSERT INTO fic_transactions (
          user_id, type, amount, description, status, created_at
        ) VALUES ($1, 'credit', $2, $3, 'completed', NOW())
      `, [toUserId, amount, `Transfer from user ${fromUserId}: ${description}`]);
      
      await client.query('COMMIT');
      
      return {
        success: true,
        amount,
        from: fromUserId,
        to: toUserId,
        description
      };
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error in FICService.transfer:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Get transaction history for user
   */
  async getTransactions(userId, limit = 50, offset = 0) {
    try {
      const query = `
        SELECT * FROM fic_transactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      
      const result = await pool.query(query, [userId, limit, offset]);
      
      return {
        transactions: result.rows,
        total: result.rows.length,
        limit,
        offset
      };
    } catch (error) {
      logger.error('Error in FICService.getTransactions:', error);
      throw error;
    }
  }
  
  /**
   * Purchase FIC with real money (integration point)
   */
  async purchase(userId, amountUSD, paymentIntentId) {
    // Conversion rate: 1 USD = 100 FIC (example)
    const conversionRate = 100;
    const ficAmount = amountUSD * conversionRate;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Record purchase transaction
      await client.query(`
        INSERT INTO fic_transactions (
          user_id, type, amount, description, metadata, status, created_at
        ) VALUES ($1, 'deposit', $2, $3, $4, 'completed', NOW())
      `, [
        userId,
        ficAmount,
        `Purchased ${ficAmount} FIC for $${amountUSD}`,
        JSON.stringify({ payment_intent: paymentIntentId, usd_amount: amountUSD })
      ]);
      
      await client.query('COMMIT');
      
      return ficAmount;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error in FICService.purchase:', error);
      throw error;
    } finally {
      client.release();
    }
  }
  
  /**
   * Get platform statistics
   */
  async getPlatformStats() {
    try {
      const stats = await pool.query(`
        SELECT 
          COUNT(DISTINCT user_id) as total_users,
          SUM(CASE WHEN type IN ('credit', 'deposit', 'reward') THEN amount ELSE 0 END) as total_issued,
          SUM(CASE WHEN type IN ('debit', 'withdrawal', 'purchase') THEN amount ELSE 0 END) as total_spent,
          COUNT(*) as total_transactions
        FROM fic_transactions
      `);
      
      return stats.rows[0];
    } catch (error) {
      logger.error('Error in FICService.getPlatformStats:', error);
      throw error;
    }
  }
}

module.exports = new FICService();
