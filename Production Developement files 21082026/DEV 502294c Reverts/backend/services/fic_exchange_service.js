const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");
const FICTransactionservice = require("./fic_transaction_service");
const FICWalletService = require("./fic_wallet_service");

// Exchange rate configuration
const EXCHANGE_RATE = 16; // 16 FIC = $1 USD
const RATE_EXPIRY_HOURS = 24; // Rate expires every 24 hours

class FICExchangeService {
  // Get current exchange rate
  static async getExchangeRate() {
    const result = await monetizationDb.query(
      `SELECT * FROM fics_exchange_rates 
       WHERE target_currency = 'FIC' AND rate_expiry > NOW()
       ORDER BY created_at DESC LIMIT 1`,
    );

    // If no current rate exists, create one
    if (result.rows.length === 0) {
      return await this.createExchangeRate();
    }

    return result.rows[0];
  }

  // Create new exchange rate
  static async createExchangeRate() {
    const rateExpiry = new Date();
    rateExpiry.setHours(rateExpiry.getHours() + RATE_EXPIRY_HOURS);

    const result = await monetizationDb.query(
      `INSERT INTO fics_exchange_rates 
       (base_currency, target_currency, rate, rate_expiry)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      ["USD", "FIC", EXCHANGE_RATE, rateExpiry],
    );

    // Log security event
    await logSecurityEvent({
      memberId: null,
      eventType: "EXCHANGE_RATE_UPDATED",
      ipAddress: null,
      memberAgent: null,
      success: true,
      severity: "LOW",
      description: "Exchange rate updated",
      sourceModule: "FICExchangeService",
      details: {
        rateId: result.rows[0].id,
        rate: EXCHANGE_RATE
      }
    });

    return result.rows[0];
  }

  // Convert USD to FIC
  static async convertUSDToFIC(memberId, amountUSD) {
    const { rate } = await this.getExchangeRate();
    const ficAmount = amountUSD * rate;

    // Create transaction
    const wallet = await FICWalletService.getWalletBymemberId(memberId);
    const transactionResult = await FICTransactionservice.createTransaction(
      wallet.id,
      ficAmount,
      "exchange_in",
      `Exchange of $${amountUSD} USD to ${ficAmount} FIC`,
      "USD",
      "FIC",
    );

    return {
      usdAmount: amountUSD,
      ficAmount: ficAmount,
      rate: rate,
      transaction: transactionResult.transaction
    };
  }

  // Convert FIC to USD
  static async convertFICtoUSD(memberId, amountFIC) {
    const { rate } = await this.getExchangeRate();
    const usdAmount = amountFIC / rate;

    // Create transaction
    const wallet = await FICWalletService.getWalletBymemberId(memberId);
    const transactionResult = await FICTransactionservice.createTransaction(
      wallet.id,
      amountFIC,
      "exchange_out",
      `Exchange of ${amountFIC} FIC to $${usdAmount} USD`,
      "FIC",
      "USD",
    );

    return {
      ficAmount: amountFIC,
      usdAmount: usdAmount,
      rate: rate,
      transaction: transactionResult.transaction
    };
  }
}

module.exports = FICExchangeService;
