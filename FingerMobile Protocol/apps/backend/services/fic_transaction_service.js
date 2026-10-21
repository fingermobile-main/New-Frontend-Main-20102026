const { Op } = require('sequelize');
const connection = require('../database/connection');
const FICTransaction = require('../models/FICTransaction');
const FICWalletService = require('./fic_wallet_service');
const { logSecurityEvent } = require('../utils/securityLogger');

// Transaction types that credit the wallet
const CREDIT_TYPES = new Set([
  'deposit', 'transfer_in', 'exchange_in', 'reward', 'gift', 'paylink'
]);
// Transaction types that debit the wallet
const DEBIT_TYPES = new Set([
  'withdrawal', 'transfer_out', 'exchange_out'
]);

class FICTransactionservice {
  /**
   * Create a FIC transaction and update the wallet balance atomically.
   * @returns {{ transaction, wallet }}
   */
  static async createTransaction(
    walletId,
    amount,
    transactionType,
    description,
    fromAccount,
    toAccount
  ) {
    const sequelize = connection.sequelize;

    return sequelize.transaction(async (t) => {
      // Create the transaction record in pending state
      const ficTx = await FICTransaction.create({
        walletId,
        amount,
        transactionType,
        status: 'pending',
        description,
        fromAccount,
        toAccount
      }, { transaction: t });

      let updatedWallet;

      if (CREDIT_TYPES.has(transactionType)) {
        // Credit: add funds to wallet
        const wallet = await FICWalletService.getWalletById(walletId);
        if (!wallet) throw new Error(`Wallet ${walletId} not found`);
        updatedWallet = await FICWalletService.updateWalletBalance(
          walletId,
          parseFloat(wallet.balance) + parseFloat(amount),
          parseFloat(wallet.lockedBalance)
        );
      } else if (DEBIT_TYPES.has(transactionType)) {
        // Debit: deduct funds and temporarily lock them
        const wallet = await FICWalletService.getWalletById(walletId);
        if (!wallet) throw new Error(`Wallet ${walletId} not found`);
        if (parseFloat(wallet.balance) < parseFloat(amount)) {
          throw new Error('Insufficient funds');
        }
        updatedWallet = await FICWalletService.updateWalletBalance(
          walletId,
          parseFloat(wallet.balance) - parseFloat(amount),
          parseFloat(wallet.lockedBalance) + parseFloat(amount)
        );
      }

      // Mark transaction as completed
      await ficTx.update({ status: 'completed' }, { transaction: t });

      await logSecurityEvent({
        memberId: walletId,
        eventType: 'TRANSACTION_COMPLETED',
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: 'LOW',
        description: `FIC transaction completed for wallet ${walletId}`,
        sourceModule: 'FICTransactionservice',
        details: {
          transactionId: ficTx.id,
          amount,
          type: transactionType
        }
      });

      return {
        transaction: ficTx.toJSON(),
        wallet: updatedWallet
      };
    });
  }

  /**
   * Get all FIC transactions for a member, optionally filtered by type/status.
   * @param {string} memberId
   * @param {{ type?: string, status?: string, limit?: number }} options
   */
  static async getMemberTransactions(memberId, options = {}) {
    // Find all wallet IDs for this member
    const wallet = await FICWalletService.getWalletBymemberId(memberId);
    if (!wallet) return [];

    const where = { walletId: wallet.id };
    if (options.type) where.transactionType = options.type;
    if (options.status) where.status = options.status;

    const transactions = await FICTransaction.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: options.limit || undefined
    });

    return transactions.map(t => t.toJSON());
  }
}

module.exports = FICTransactionservice;

