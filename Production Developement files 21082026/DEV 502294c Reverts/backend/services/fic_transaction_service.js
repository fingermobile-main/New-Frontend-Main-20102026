const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");
const FICWalletService = require("./fic_wallet_service");

class FICTransactionservice {
  // Create transaction
  static async createTransaction(
    walletId,
    amount,
    transactionType,
    description,
    fromAccount,
    toAccount,
  ) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Create transaction record
      const transactionResult = await client.query(
        `INSERT INTO fics_transactions 
         (wallet_id, amount, transaction_type, status, description, from_account, to_account)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          walletId,
          amount,
          transactionType,
          "pending",
          description,
          fromAccount,
          toAccount
        ],
      );

      let updatedWallet;
      // Update wallet based on transaction type
      if (
        transactionType === "deposit" ||
        transactionType === "transfer_in" ||
        transactionType === "exchange_in" ||
        transactionType === "reward" ||
        transactionType === "gift" ||
        transactionType === "paylink"
      ) {
        // Credit transaction
        const wallet = await FICWalletService.getWalletById(walletId);
        updatedWallet = await FICWalletService.updateWalletBalance(
          walletId,
          wallet.balance + amount,
          wallet.locked_balance,
        );
      } else if (
        transactionType === "withdrawal" ||
        transactionType === "transfer_out" ||
        transactionType === "exchange_out"
      ) {
        // Debit transaction
        const wallet = await FICWalletService.getWalletById(walletId);
        if (wallet.balance < amount) {
          throw new Error("Insufficient funds");
        }

        updatedWallet = await FICWalletService.updateWalletBalance(
          walletId,
          wallet.balance - amount,
          wallet.locked_balance + amount, // Lock funds until transaction completes
        );
      }

      // Update transaction status to completed
      await client.query(
        `UPDATE fics_transactions SET status = 'completed' WHERE id = $1`,
        [transactionResult.rows[0].id],
      );

      // Log security event
      await logSecurityEvent({
        memberId: walletId,
        eventType: "TRANSACTION_COMPLETED",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `Transaction completed for wallet ${walletId}`,
        sourceModule: "FICTransactionservice",
        details: {
          transactionId: transactionResult.rows[0].id,
          amount: amount,
          type: transactionType
        }
      });

      await client.query("COMMIT");
      return {
        transaction: transactionResult.rows[0],
        wallet: updatedWallet
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Get member transactions
  static async getMemberTransactions(memberId, options = {}) {
    let query = `SELECT t.*, w.member_id FROM fics_transactions t
                 JOIN fics_wallets w ON t.wallet_id = w.id
                 WHERE w.member_id = $1`;
    const params = [memberId];

    if (options.type) {
      query += ` AND t.transaction_type = $${params.length + 1}`;
      params.push(options.type);
    }

    if (options.status) {
      query += ` AND t.status = $${params.length + 1}`;
      params.push(options.status);
    }

    query += ` ORDER BY t.created_at DESC`;

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(options.limit);
    }

    const result = await monetizationDb.query(query, params);
    return result.rows;
  }
}

module.exports = FICTransactionservice;
