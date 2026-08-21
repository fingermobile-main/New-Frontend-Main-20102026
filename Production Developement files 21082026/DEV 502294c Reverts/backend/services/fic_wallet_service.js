const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");

class FICWalletService {
  // Create member wallet
  static async createWallet(memberId) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO fics_wallets (member_id, balance, locked_balance)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [memberId, 0.0, 0.0],
      );

      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: "WALLET_CREATED",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `Wallet created for member ${memberId}`,
        sourceModule: "FICWalletService",
        details: {
          walletId: result.rows[0].id
        }
      });

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Get member wallet
  static async getWalletBymemberId(memberId) {
    const result = await monetizationDb.query(
      `SELECT * FROM fics_wallets WHERE member_id = $1`,
      [memberId],
    );
    return result.rows[0];
  }

  // Update wallet balance
  static async updateWalletBalance(walletId, newBalance, newLockedBalance) {
    const result = await monetizationDb.query(
      `UPDATE fics_wallets 
       SET balance = $1, locked_balance = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [newBalance, newLockedBalance, walletId],
    );
    return result.rows[0];
  }
}

module.exports = FICWalletService;
