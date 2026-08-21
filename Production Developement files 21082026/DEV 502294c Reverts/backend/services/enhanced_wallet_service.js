const { monetizationDb, identityDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");
const FICWalletService = require("./fic_wallet_service");
const FICTransactionservice = require("./fic_transaction_service");
const FICExchangeService = require("./fic_exchange_service");

class EnhancedWalletService {
  // Get member's complete wallet information including all balance types
  static async getWalletInfo(memberId) {
    try {
      // Get enhanced wallet with all balance types
      const walletResult = await monetizationDb.query(
        `SELECT * FROM enhanced_wallets WHERE member_id = $1`,
        [memberId],
      );

      let wallet = walletResult.rows[0];

      // Create wallet if it doesn't exist
      if (!wallet) {
        wallet = await this.createEnhancedWallet(memberId);
      }

      // Get current FIC to USD exchange rate
      const exchangeRate = await FICExchangeService.getExchangeRate();

      // Calculate USD equivalents
      const ficUsdValue = wallet.fic_balance * exchangeRate.rate;
      const storeCreditUsdValue =
        wallet.store_credit_balance * exchangeRate.rate;
      const stakeUsdValue = wallet.stake_balance * exchangeRate.rate;

      return {
        fic_balance: wallet.fic_balance,
        fiat_balance: wallet.fiat_balance,
        store_credit_balance: wallet.store_credit_balance,
        stake_balance: wallet.stake_balance,
        reserved_balance: wallet.reserved_balance,
        exchange_rate: exchangeRate.rate,
        fic_usd_value: ficUsdValue,
        store_credit_usd_value: storeCreditUsdValue,
        stake_usd_value: stakeUsdValue,
        total_usd_value:
          ficUsdValue +
          storeCreditUsdValue +
          stakeUsdValue +
          parseFloat(wallet.fiat_balance)
      };
    } catch (error) {
      logger.error("Error getting enhanced wallet info:", error);
      throw error;
    }
  }

  // Create enhanced wallet for member
  static async createEnhancedWallet(memberId) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO enhanced_wallets 
         (member_id, fic_balance, fiat_balance, store_credit_balance, stake_balance, reserved_balance)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [memberId, 0.0, 0.0, 0.0, 0.0, 0.0],
      );

      await client.query("COMMIT");
      return result.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Calculate and distribute earnings according to the 4-part policy
  static async distributeEarnings(
    memberId,
    grossEarning,
    earningType = "general",
  ) {
    try {
      // Calculate portions according to policy
      const memberRetained = grossEarning * 0.45; // 45%
      const storeCredit = grossEarning * 0.25; // 25%
      const stakeAmount = grossEarning * 0.05; // 5%
      const platformRetained = grossEarning * 0.25; // 25%

      // Update wallet balances
      const client = await monetizationDb.connect();
      try {
        await client.query("BEGIN");

        // Update member's various balances
        const result = await client.query(
          `UPDATE enhanced_wallets 
           SET fic_balance = fic_balance + $1,
               store_credit_balance = store_credit_balance + $2,
               stake_balance = stake_balance + $3,
               updated_at = NOW()
           WHERE member_id = $4
           RETURNING *`,
          [memberRetained, storeCredit, stakeAmount, memberId],
        );

        // Record the distribution
        await client.query(
          `INSERT INTO earning_distributions 
           (member_id, gross_earning, member_retained, store_credit, stake_amount, platform_retained, earning_type)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            memberId,
            grossEarning,
            memberRetained,
            storeCredit,
            stakeAmount,
            platformRetained,
            earningType
          ],
        );

        // Process platform retained earnings (add to platform wallet)
        await this.processPlatformEarnings(platformRetained);

        await client.query("COMMIT");
        return {
          success: true,
          memberRetained,
          storeCredit,
          stakeAmount,
          platformRetained,
          totalEarning: grossEarning
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Error distributing earnings:", error);
      throw error;
    }
  }

  // Process platform retained earnings
  static async processPlatformEarnings(amount) {
    try {
      // Add to platform revenue wallet (could be a specific platform account)
      // Implementation depends on platform's business logic
      logger.info(`Platform retained earnings: ${amount} FIC`);
    } catch (error) {
      logger.error("Error processing platform earnings:", error);
      throw error;
    }
  }

  // Handle stake investments with 1.5% annual interest
  static async createStakeInvestment(memberId, amount) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Check if member has enough stake balance
      const walletResult = await monetizationDb.query(
        `SELECT stake_balance FROM enhanced_wallets WHERE member_id = $1`,
        [memberId],
      );

      if (
        walletResult.rows.length === 0 ||
        walletResult.rows[0].stake_balance < amount
      ) {
        throw new Error(
          `Insufficient stake balance. Required: ${amount} Available: ${walletResult.rows[0]?.stake_balance || 0}`,
        );
      }

      // Calculate maturity date (1 year from now)
      const startDate = new Date();
      const maturityDate = new Date(startDate);
      maturityDate.setFullYear(startDate.getFullYear() + 1);

      // Calculate expected return with 1.5% interest
      const interestRate = 0.015; // 1.5%
      const expectedReturn = amount * interestRate;

      // Create stake investment record
      const stakeResult = await client.query(
        `INSERT INTO stake_investments 
         (member_id, amount, interest_rate, start_date, maturity_date, expected_return)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          memberId,
          amount,
          interestRate,
          startDate,
          maturityDate,
          expectedReturn
        ],
      );

      // Update wallet: move from stake_balance to invested amount
      // In our model, the stake balance remains but is considered "invested"
      await client.query(
        `UPDATE enhanced_wallets 
         SET updated_at = NOW()
         WHERE member_id = $1`,
        [memberId],
      );

      await client.query("COMMIT");
      return stakeResult.rows[0];
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Get stake investments for a member
  static async getMemberStakes(memberId) {
    try {
      const result = await monetizationDb.query(
        `SELECT * FROM stake_investments WHERE member_id = $1 ORDER BY start_date DESC`,
        [memberId],
      );

      return result.rows;
    } catch (error) {
      logger.error("Error getting member stakes:", error);
      throw error;
    }
  }

  // Get earning distribution history for a member
  static async getEarningDistributionHistory(memberId) {
    try {
      const result = await monetizationDb.query(
        `SELECT * FROM earning_distributions WHERE member_id = $1 ORDER BY distribution_date DESC`,
        [memberId],
      );

      return result.rows;
    } catch (error) {
      logger.error("Error getting earning distribution history:", error);
      throw error;
    }
  }

  // Convert store credit to FIC (with restrictions)
  static async convertStoreCreditToFIC(memberId, amount) {
    try {
      const client = await monetizationDb.connect();
      try {
        await client.query("BEGIN");

        // Get wallet to check store credit balance
        const walletResult = await monetizationDb.query(
          `SELECT store_credit_balance FROM enhanced_wallets WHERE member_id = $1`,
          [memberId],
        );

        if (
          walletResult.rows.length === 0 ||
          walletResult.rows[0].store_credit_balance < amount
        ) {
          throw new Error(
            `Insufficient store credit balance. Required: ${amount} Available: ${walletResult.rows[0]?.store_credit_balance || 0}`,
          );
        }

        // Update wallet balances
        await client.query(
          `UPDATE enhanced_wallets 
           SET store_credit_balance = store_credit_balance - $1,
               fic_balance = fic_balance + $1,
               updated_at = NOW()
           WHERE member_id = $2`,
          [amount, memberId],
        );

        // Log the conversion
        await logSecurityEvent(memberId, "STORE_CREDIT_TO_FIC_CONVERSION", {
          memberId,
          amount,
          conversion_type: "store_credit_to_fic"
        });

        await client.query("COMMIT");

        return {
          success: true,
          convertedAmount: amount
        };
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      logger.error("Error converting store credit to FIC:", error);
      throw error;
    }
  }
}

module.exports = EnhancedWalletService;
