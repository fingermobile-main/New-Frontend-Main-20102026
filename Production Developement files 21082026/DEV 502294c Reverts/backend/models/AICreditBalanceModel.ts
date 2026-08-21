const { Pool } = require('pg');

export class AICreditBalanceModel {
pool: any; // Add type declaration for pool property
  
  constructor(
pool: any) {
    this.pool = pool;
  }

  async getBalance(
userId: string) {
    const query = `
      SELECT user_id, balance, monthly_allocation, used_this_month, rollover_credits
      FROM ai_credit_balances
      WHERE user_id = $1
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows[0] || null;
  }

  async deductCredits(
userId: string,
amount: number,
usageType: string, metadata?: any) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      const updateQuery = `
        UPDATE ai_credit_balances
        SET balance = balance - $1,
            used_this_month = used_this_month + $1,
            updated_at = NOW()
        WHERE user_id = $2 AND balance >= $1
        RETURNING *;
      `;
      const result = await client.query(updateQuery, [amount, userId]);
      
      if (result.rowCount === 0) {
        throw new Error('Insufficient credits');
      }

      // Log usage
      await client.query(
        'INSERT INTO ai_credit_usage (user_id, amount, usage_type, metadata) VALUES ($1, $2, $3, $4)',
        [userId, amount, usageType, metadata ? JSON.stringify(metadata) : null]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async addCredits(
userId: string,
amount: number,
reason: string) {
    const query = `
      INSERT INTO ai_credit_balances (user_id, balance, monthly_allocation, reason)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) DO UPDATE
      SET balance = ai_credit_balances.balance + $2,
          updated_at = NOW()
      RETURNING *;
    `;
    const result = await this.pool.query(query, [userId, amount, amount, reason]);
    return result.rows[0];
  }

  async getUsageHistory(
userId: string,
limit: number = 50) {
    const query = `
      SELECT * FROM ai_credit_usage
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const result = await this.pool.query(query, [userId, limit]);
    return result.rows;
  }
}

module.exports = AICreditBalanceModel;
