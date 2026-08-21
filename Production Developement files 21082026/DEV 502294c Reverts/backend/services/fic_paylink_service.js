const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");
const FICWalletService = require("./fic_wallet_service");
const FICTransactionservice = require("./fic_transaction_service");

class FICPaylinkService {
  // Create a new paylink
  static async createPaylink(memberId, amount, description, expiryHours = 24) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Get member's wallet
      const wallet = await FICWalletService.getWalletBymemberId(memberId);

      // Check if member has sufficient balance
      if (wallet.balance < amount) {
        throw new Error(
          `Insufficient FIC balance. Required: ${amount} Available: ${wallet.balance}`,
        );
      }

      // Create paylink record
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + expiryHours);

      const paylinkResult = await client.query(
        `INSERT INTO fics_paylinks 
         (creator_id, amount, description, expiry_date)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [memberId, amount, description, expiryDate],
      );

      // Lock the amount in the wallet until redeemed or expired
      const updatedWallet = await FICWalletService.updateWalletBalance(
        wallet.id,
        wallet.balance - amount,
        wallet.locked_balance + amount,
      );

      // Create transaction to lock the funds
      const transactionResult = await FICTransactionservice.createTransaction(
        wallet.id,
        amount,
        "locked",
        `Funds locked for paylink: ${description}`,
        "FIC_WALLET",
        "FIC_PAYLINK",
      );

      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: "PAYLINK_CREATED",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `Paylink created by member ${memberId}`,
        sourceModule: "FICPaylinkService",
        details: {
          paylinkId: paylinkResult.rows[0].id,
          amount: amount,
          creatorId: memberId
        }
      });

      await client.query("COMMIT");

      return {
        success: true,
        paylink: paylinkResult.rows[0],
        transaction: transactionResult.transaction
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Redeem a paylink
  static async redeemPaylink(paylinkId, receivermemberId) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Get paylink details
      const paylinkResult = await client.query(
        `SELECT * FROM fics_paylinks 
         WHERE id = $1 AND is_redeemable = true`,
        [paylinkId],
      );

      if (paylinkResult.rows.length === 0) {
        throw new Error("Paylink not found or already redeemed");
      }

      const paylink = paylinkResult.rows[0];

      // Check if paylink has expired
      if (paylink.expiry_date && new Date(paylink.expiry_date) < new Date()) {
        // Mark as non-redeemable
        await client.query(
          `UPDATE fics_paylinks SET is_redeemable = false WHERE id = $1`,
          [paylinkId],
        );

        throw new Error("Paylink has expired");
      }

      // Get receiver's wallet
      const receiverWallet =
        await FICWalletService.getWalletBymemberId(receivermemberId);

      // Get creator's wallet to unlock funds
      const creatorWallet = await FICWalletService.getWalletBymemberId(
        paylink.creator_id,
      );

      // Update receiver's wallet balance
      const updatedReceiverWallet = await FICWalletService.updateWalletBalance(
        receiverWallet.id,
        receiverWallet.balance + paylink.amount,
        receiverWallet.locked_balance,
      );

      // Unlock the amount in the creator's wallet
      const updatedCreatorWallet = await FICWalletService.updateWalletBalance(
        creatorWallet.id,
        creatorWallet.balance,
        creatorWallet.locked_balance - paylink.amount,
      );

      // Create transaction for receiver (credit)
      const receiverTransaction = await FICTransactionservice.createTransaction(
        receiverWallet.id,
        paylink.amount,
        "paylink",
        `Received FIC via paylink: ${paylink.description}`,
        "FIC_PAYLINK",
        "FIC_WALLET",
      );

      // Mark paylink as redeemed
      await client.query(
        `UPDATE fics_paylinks 
         SET is_redeemable = false, last_redeemed_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [paylinkId],
      );

      // Log security event
      await logSecurityEvent({
        memberId: receivermemberId,
        eventType: "PAYLINK_REDEEMED",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `Paylink redeemed by member ${receivermemberId}`,
        sourceModule: "FICPaylinkService",
        details: {
          paylinkId: paylinkId,
          amount: paylink.amount,
          receiverId: receivermemberId,
          creatorId: paylink.creator_id
        }
      });

      await client.query("COMMIT");

      return {
        success: true,
        paylink: paylink,
        receiverTransaction: receiverTransaction.transaction,
        receiverWallet: updatedReceiverWallet
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Get member's created paylinks
  static async getMemberPaylinks(memberId, options = {}) {
    let query = `SELECT * FROM fics_paylinks WHERE creator_id = $1`;
    const params = [memberId];

    if (options.status) {
      if (options.status === "active") {
        query += ` AND is_redeemable = true`;
        query += ` AND (expiry_date IS NULL OR expiry_date > CURRENT_TIMESTAMP)`;
      } else if (options.status === "redeemed") {
        query += ` AND is_redeemable = false AND last_redeemed_at IS NOT NULL`;
      } else if (options.status === "expired") {
        query += ` AND is_redeemable = false AND last_redeemed_at IS NULL`;
      }
    }

    query += ` ORDER BY created_at DESC`;

    if (options.limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(options.limit);
    }

    const result = await monetizationDb.query(query, params);
    return result.rows;
  }

  // Cancel a paylink and return funds to creator
  static async cancelPaylink(paylinkId, memberId) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Get paylink details
      const paylinkResult = await client.query(
        `SELECT * FROM fics_paylinks 
         WHERE id = $1 AND creator_id = $2`,
        [paylinkId, memberId],
      );

      if (paylinkResult.rows.length === 0) {
        throw new Error("Paylink not found or does not belong to member");
      }

      const paylink = paylinkResult.rows[0];

      // Check if already redeemed
      if (!paylink.is_redeemable) {
        throw new Error("Cannot cancel paylink that is already redeemed");
      }

      // Get creator's wallet
      const wallet = await FICWalletService.getWalletBymemberId(memberId);

      // Return the locked amount to the wallet
      const updatedWallet = await FICWalletService.updateWalletBalance(
        wallet.id,
        wallet.balance + paylink.amount,
        wallet.locked_balance - paylink.amount,
      );

      // Mark paylink as non-redeemable
      await client.query(
        `UPDATE fics_paylinks SET is_redeemable = false WHERE id = $1`,
        [paylinkId],
      );

      // Create transaction to return funds
      const transactionResult = await FICTransactionservice.createTransaction(
        wallet.id,
        paylink.amount,
        "unlocked",
        `Funds unlocked from cancelled paylink: ${paylink.description}`,
        "FIC_PAYLINK",
        "FIC_WALLET",
      );

      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: "PAYLINK_CANCELLED",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `Paylink cancelled by member ${memberId}`,
        sourceModule: "FICPaylinkService",
        details: {
          paylinkId: paylinkId,
          amount: paylink.amount,
          creatorId: memberId
        }
      });

      await client.query("COMMIT");

      return {
        success: true,
        paylink: paylink,
        transaction: transactionResult.transaction,
        wallet: updatedWallet
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = FICPaylinkService;
