const { Op } = require('sequelize');
const ExchangeRate = require('../models/ExchangeRate');
const FICWallet = require('../models/FICWallet');
const { logSecurityEvent } = require('../utils/securityLogger');
const FICTransactionservice = require('./fic_transaction_service');

// Exchange rate configuration
const DEFAULT_FIC_RATE = 16; // 16 FIC = $1 USD
const RATE_EXPIRY_HOURS = 24;

class FICExchangeService {
  /**
   * Get the current active FIC exchange rate.
   * If none exists or all have expired, a fresh rate is created automatically.
   */
  static async getExchangeRate() {
    const rate = await ExchangeRate.findOne({
      where: {
        targetCurrency: 'FIC',
        rateExpiry: { [Op.gt]: new Date() }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!rate) {
      return this.createExchangeRate();
    }

    return rate.toJSON();
  }

  /**
   * Create a new FIC exchange rate valid for RATE_EXPIRY_HOURS.
   */
  static async createExchangeRate() {
    const rateExpiry = new Date();
    rateExpiry.setHours(rateExpiry.getHours() + RATE_EXPIRY_HOURS);

    const newRate = await ExchangeRate.create({
      baseCurrency: 'USD',
      targetCurrency: 'FIC',
      rate: DEFAULT_FIC_RATE,
      rateExpiry
    });

    await logSecurityEvent({
      memberId: null,
      eventType: 'EXCHANGE_RATE_UPDATED',
      ipAddress: null,
      memberAgent: null,
      success: true,
      severity: 'LOW',
      description: 'FIC exchange rate refreshed',
      sourceModule: 'FICExchangeService',
      details: {
        rateId: newRate.id,
        rate: DEFAULT_FIC_RATE,
        expiresAt: rateExpiry
      }
    });

    return newRate.toJSON();
  }

  /**
   * Convert USD amount to FIC and record the exchange transaction.
   * @returns {{ usdAmount, ficAmount, rate, transaction }}
   */
  static async convertUSDToFIC(memberId, amountUSD) {
    const rateRecord = await this.getExchangeRate();
    const rate = parseFloat(rateRecord.rate);
    const ficAmount = amountUSD * rate;

    // Resolve wallet via Sequelize model directly
    const wallet = await FICWallet.findOne({ where: { memberId } });
    if (!wallet) {
      throw new Error(`No FIC wallet found for member ${memberId}`);
    }

    const transactionResult = await FICTransactionservice.createTransaction(
      wallet.id,
      ficAmount,
      'exchange_in',
      `Exchange of $${amountUSD} USD to ${ficAmount} FIC`,
      'USD',
      'FIC'
    );

    return {
      usdAmount: amountUSD,
      ficAmount,
      rate,
      transaction: transactionResult.transaction
    };
  }

  /**
   * Convert FIC amount to USD and record the exchange transaction.
   * @returns {{ ficAmount, usdAmount, rate, transaction }}
   */
  static async convertFICtoUSD(memberId, amountFIC) {
    const rateRecord = await this.getExchangeRate();
    const rate = parseFloat(rateRecord.rate);
    const usdAmount = amountFIC / rate;

    const wallet = await FICWallet.findOne({ where: { memberId } });
    if (!wallet) {
      throw new Error(`No FIC wallet found for member ${memberId}`);
    }

    const transactionResult = await FICTransactionservice.createTransaction(
      wallet.id,
      amountFIC,
      'exchange_out',
      `Exchange of ${amountFIC} FIC to $${usdAmount} USD`,
      'FIC',
      'USD'
    );

    return {
      ficAmount: amountFIC,
      usdAmount,
      rate,
      transaction: transactionResult.transaction
    };
  }
}

module.exports = FICExchangeService;
