/* eslint-disable no-unused-vars */
const logger = require('../utils/logger');
const { monetizationDb, identityDb } = require('../db');
const { logSecurityEvent } = require('../utils/securityLogger');
const FICWalletService = require('./fic_wallet_service');
const FICTransactionservice = require('./fic_transaction_service');
const FICExchangeService = require('./fic_exchange_service');

class WalletService {
  // Get member's complete wallet information (FIC and fiat)
  static async getWalletInfo(memberId) {
    try {
      // Get FIC wallet
      const ficWallet = await FICWalletService.getWalletBymemberId(memberId);

      // Get fiat wallet
      const fiatWalletResult = await monetizationDb.query(
        'SELECT * FROM wallets WHERE member_id = $1',
        [memberId],
      );

      let fiatWallet = fiatWalletResult.rows[0];

      // Create fiat wallet if it doesn't exist
      if (!fiatWallet) {
        const newFiatWalletResult = await monetizationDb.query(
          `INSERT INTO wallets (member_id, currency_code, balance)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [memberId, 'USD', 0.0],
        );
        fiatWallet = newFiatWalletResult.rows[0];
      }

      // Get current FIC to USD exchange rate
      const exchangeRate = await FICExchangeService.getExchangeRate();

      // Calculate USD equivalent of FIC balance
      const ficUsdValue = ficWallet.balance * exchangeRate.rate;

      return {
        fic_wallet: ficWallet,
        fiat_wallet: fiatWallet,
        exchange_rate: exchangeRate.rate,
        fic_usd_value: ficUsdValue,
        total_usd_value: ficUsdValue + parseFloat(fiatWallet.balance)
      };
    } catch (error) {
      logger.error('Error getting wallet info:', error);
      throw error;
    }
  }

  // Get transaction history for both FIC and fiat
  static async getTransactionHistory(memberId, options = {}) {
    try {
      // Get FIC transactions
      const ficTransactions = await FICTransactionservice.getMemberTransactions(
        memberId,
        options,
      );

      // Get fiat transactions
      const fiatWalletResult = await monetizationDb.query(
        'SELECT id FROM wallets WHERE member_id = $1',
        [memberId],
      );

      if (fiatWalletResult.rows.length === 0) {
        return {
          fic_transactions: ficTransactions,
          fiat_transactions: []
        };
      }

      const walletId = fiatWalletResult.rows[0].id;
      let query = 'SELECT * FROM transactions WHERE wallet_id = $1';
      const params = [walletId];

      if (options.type) {
        query += ` AND transaction_type = $${params.length + 1}`;
        params.push(options.type);
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      if (options.offset) {
        query += ` OFFSET $${params.length + 1}`;
        params.push(options.offset);
      }

      const fiatTransactionsResult = await monetizationDb.query(query, params);

      return {
        fic_transactions: ficTransactions,
        fiat_transactions: fiatTransactionsResult.rows
      };
    } catch (error) {
      logger.error('Error getting transaction history:', error);
      throw error;
    }
  }

  // Convert fiat to FIC
  static async convertFiatToFIC(memberId, fiatAmount) {
    const client = await monetizationDb.connect();
    try {
      await client.query('BEGIN');

      // Get wallets
      const walletInfo = await this.getWalletInfo(memberId);

      // Check if member has enough fiat balance
      if (walletInfo.fiat_wallet.balance < fiatAmount) {
        throw new Error(
          `Insufficient fiat balance. Required: ${fiatAmount} Available: ${walletInfo.fiat_wallet.balance}`,
        );
      }

      // Get exchange rate
      const exchangeRate = await FICExchangeService.getExchangeRate();
      const ficAmount = fiatAmount * exchangeRate.rate;

      // Deduct from fiat wallet
      await client.query(
        `UPDATE wallets 
         SET balance = balance - $1, updated_at = NOW()
         WHERE id = $2`,
        [fiatAmount, walletInfo.fiat_wallet.id],
      );

      // Add to FIC wallet
      await FICWalletService.updateWalletBalance(
        walletInfo.fic_wallet.id,
        walletInfo.fic_wallet.balance + ficAmount,
        walletInfo.fic_wallet.locked_balance,
      );

      // Record fiat transaction
      await client.query(
        `INSERT INTO transactions (wallet_id, transaction_type, amount, currency_code, description, reference_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          walletInfo.fiat_wallet.id,
          'debit',
          fiatAmount,
          'USD',
          `Converted to FIC at rate ${exchangeRate.rate}`,
          'conversion'
        ],
      );

      // Record FIC transaction
      const transactionResult = await FICTransactionservice.createTransaction(
        walletInfo.fic_wallet.id,
        ficAmount,
        'exchange_in',
        `Converted from USD at rate ${exchangeRate.rate}`,
        'FIAT_EXCHANGE',
        'FIC_WALLET',
      );

      // Log security event
      await logSecurityEvent(memberId, 'FIAT_TO_FIC_CONVERSION', {
        memberId,
        fiatAmount,
        ficAmount,
        exchangeRate: exchangeRate.rate
      });

      await client.query('COMMIT');

      return {
        success: true,
        fiat_deducted: fiatAmount,
        fic_added: ficAmount,
        exchange_rate: exchangeRate.rate
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Convert FIC to fiat
  static async convertFICToFiat(memberId, ficAmount) {
    const client = await monetizationDb.connect();
    try {
      await client.query('BEGIN');

      // Get wallets
      const walletInfo = await this.getWalletInfo(memberId);

      // Check if member has enough FIC balance
      if (walletInfo.fic_wallet.balance < ficAmount) {
        throw new Error(
          `Insufficient FIC balance. Required: ${ficAmount} Available: ${walletInfo.fic_wallet.balance}`,
        );
      }

      // Get exchange rate
      const exchangeRate = await FICExchangeService.getExchangeRate();
      const fiatAmount = ficAmount / exchangeRate.rate;

      // Deduct from FIC wallet
      await FICWalletService.updateWalletBalance(
        walletInfo.fic_wallet.id,
        walletInfo.fic_wallet.balance - ficAmount,
        walletInfo.fic_wallet.locked_balance,
      );

      // Add to fiat wallet
      await client.query(
        `UPDATE wallets 
         SET balance = balance + $1, updated_at = NOW()
         WHERE id = $2`,
        [fiatAmount, walletInfo.fiat_wallet.id],
      );

      // Record FIC transaction
      const transactionResult = await FICTransactionservice.createTransaction(
        walletInfo.fic_wallet.id,
        ficAmount,
        'exchange_out',
        `Converted to USD at rate ${exchangeRate.rate}`,
        'FIC_WALLET',
        'FIAT_EXCHANGE',
      );

      // Record fiat transaction
      await client.query(
        `INSERT INTO transactions (wallet_id, transaction_type, amount, currency_code, description, reference_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          walletInfo.fiat_wallet.id,
          'credit',
          fiatAmount,
          'USD',
          `Converted from FIC at rate ${exchangeRate.rate}`,
          'conversion'
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, 'FIC_TO_FIAT_CONVERSION', {
        memberId,
        ficAmount,
        fiatAmount,
        exchangeRate: exchangeRate.rate
      });

      await client.query('COMMIT');

      return {
        success: true,
        fic_deducted: ficAmount,
        fiat_added: fiatAmount,
        exchange_rate: exchangeRate.rate
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Transfer FIC to another member
  static async transferFIC(memberId, recipientId, amount, description) {
    try {
      // Validate input
      if (!recipientId || !amount || amount <= 0) {
        throw new Error('Recipient and valid amount are required');
      }

      // Check if recipient exists
      const recipientResult = await identityDb.query(
        'SELECT id FROM members WHERE id = $1',
        [recipientId],
      );

      if (recipientResult.rows.length === 0) {
        throw new Error('Recipient not found');
      }

      // Perform FIC transfer using FIC service
      return await FICTransactionservice.createTransaction(
        memberId,
        amount,
        'transfer',
        description || `Transfer to member ${recipientId}`,
        'FIC_WALLET',
        `MEMBER_${recipientId}`,
      );
    } catch (error) {
      logger.error('Error transferring FIC:', error);
      throw error;
    }
  }

  // Deposit fiat via external payment gateway
  static async depositFiat(memberId, amount, gatewayName) {
    try {
      // In a real implementation, this would call the external payment gateway
      // For now, we'll simulate the successful deposit

      // Get fiat wallet
      const walletInfo = await this.getWalletInfo(memberId);

      // Update fiat wallet balance
      const client = await monetizationDb.connect();
      try {
        await client.query('BEGIN');

        await client.query(
          `UPDATE wallets 
           SET balance = balance + $1, updated_at = NOW()
           WHERE id = $2`,
          [amount, walletInfo.fiat_wallet.id],
        );

        // Record transaction
        await client.query(
          `INSERT INTO transactions (wallet_id, transaction_type, amount, currency_code, description, reference_type)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            walletInfo.fiat_wallet.id,
            'credit',
            amount,
            'USD',
            `Deposit via ${gatewayName}`,
            'deposit'
          ],
        );

        await client.query('COMMIT');

        // Log security event
        await logSecurityEvent(memberId, 'FIAT_DEPOSIT', {
          memberId,
          amount,
          gateway: gatewayName
        });

        return {
          success: true,
          message: 'Deposit successful',
          new_balance: walletInfo.fiat_wallet.balance + amount
        };
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error depositing fiat:', error);
      throw error;
    }
  }

  // Withdraw fiat via external payment gateway
  static async withdrawFiat(memberId, amount, gatewayName) {
    try {
      // Get wallet info
      const walletInfo = await this.getWalletInfo(memberId);

      // Check if member has enough balance
      if (walletInfo.fiat_wallet.balance < amount) {
        throw new Error(
          `Insufficient balance. Required: ${amount} Available: ${walletInfo.fiat_wallet.balance}`,
        );
      }

      // Update fiat wallet balance
      const client = await monetizationDb.connect();
      try {
        await client.query('BEGIN');

        await client.query(
          `UPDATE wallets 
           SET balance = balance - $1, updated_at = NOW()
           WHERE id = $2`,
          [amount, walletInfo.fiat_wallet.id],
        );

        // Record transaction
        await client.query(
          `INSERT INTO transactions (wallet_id, transaction_type, amount, currency_code, description, reference_type)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            walletInfo.fiat_wallet.id,
            'debit',
            amount,
            'USD',
            `Withdrawal via ${gatewayName}`,
            'withdrawal'
          ],
        );

        await client.query('COMMIT');

        // Log security event
        await logSecurityEvent(memberId, 'FIAT_WITHDRAWAL', {
          memberId,
          amount,
          gateway: gatewayName
        });

        return {
          success: true,
          message: 'Withdrawal request submitted',
          new_balance: walletInfo.fiat_wallet.balance - amount
        };
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error('Error withdrawing fiat:', error);
      throw error;
    }
  }
}

module.exports = WalletService;
