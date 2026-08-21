const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");
const FICWalletService = require("./fic_wallet_service");
const FICTransactionservice = require("./fic_transaction_service");
const FICExchangeService = require("./fic_exchange_service");
const FICSubscriptionService = require("./fic-subscription");

class FICSubscriptionPaymentService {
  // Calculate FIC amount for subscription payment
  static async calculateFICAmount(subscriptionLevel) {
    // Get subscription tier details
    const tier =
      FICSubscriptionService.SUBSCRIPTION_TIERS[
        subscriptionLevel.toUpperCase()
      ];

    if (!tier) {
      throw new Error(`Invalid subscription level: ${subscriptionLevel}`);
    }

    // Get current exchange rate
    const exchangeRate = await FICExchangeService.getExchangeRate();

    // Convert USD price to FIC
    const ficAmount = tier.price * exchangeRate.rate;

    return {
      usdAmount: tier.price,
      ficAmount: ficAmount,
      exchangeRate: exchangeRate.rate,
      subscriptionLevel: subscriptionLevel
    };
  }

  // Process subscription payment using FIC
  static async processSubscriptionPaymentWithFIC(memberId, subscriptionLevel) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Calculate FIC amount needed for subscription
      const paymentDetails = await this.calculateFICAmount(subscriptionLevel);

      // Get member's wallet
      const wallet = await FICWalletService.getWalletBymemberId(memberId);

      // Check if member has sufficient balance
      if (wallet.balance < paymentDetails.ficAmount) {
        throw new Error(
          `Insufficient FIC balance. Required: ${paymentDetails.ficAmount} Available: ${wallet.balance}`,
        );
      }

      // Create transaction for subscription payment
      const transactionResult = await FICTransactionservice.createTransaction(
        wallet.id,
        paymentDetails.ficAmount,
        "subscription_payment",
        `Payment for FIC ${subscriptionLevel} subscription`,
        "FIC_WALLET",
        "FIC_PLATFORM",
      );

      // Process the subscription
      const subscriptionResult =
        await FICSubscriptionService.createSubscription({
          member_id: memberId,
          subscription_level: subscriptionLevel,
          subscription_type: "FIC_Platform",
          payment_method_id: transactionResult.transaction.id
        });

      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: "SUBSCRIPTION_PAYMENT_FIC",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `FIC subscription payment processed for member ${memberId}`,
        sourceModule: "FICSubscriptionPaymentService",
        details: {
          transactionId: transactionResult.transaction.id,
          subscriptionId: subscriptionResult.id,
          amount: paymentDetails.ficAmount,
          subscriptionLevel: subscriptionLevel
        }
      });

      await client.query("COMMIT");

      return {
        success: true,
        transaction: transactionResult.transaction,
        subscription: subscriptionResult,
        paymentDetails: paymentDetails
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Process subscription upgrade payment using FIC
  static async processSubscriptionUpgradeWithFIC(memberId, newLevel) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Get current subscription
      const currentSubscription =
        await FICSubscriptionService.getmembersubscription(memberId);

      if (!currentSubscription) {
        throw new Error("No active subscription found for member");
      }

      // Calculate FIC amount for new subscription level
      const paymentDetails = await this.calculateFICAmount(newLevel);

      // Get member's wallet
      const wallet = await FICWalletService.getWalletBymemberId(memberId);

      // Check if member has sufficient balance
      if (wallet.balance < paymentDetails.ficAmount) {
        throw new Error(
          `Insufficient FIC balance. Required: ${paymentDetails.ficAmount} Available: ${wallet.balance}`,
        );
      }

      // Create transaction for subscription upgrade payment
      const transactionResult = await FICTransactionservice.createTransaction(
        wallet.id,
        paymentDetails.ficAmount,
        "subscription_upgrade",
        `Payment for FIC subscription upgrade to ${newLevel}`,
        "FIC_WALLET",
        "FIC_PLATFORM",
      );

      // Process the subscription upgrade
      const upgradeResult = await FICSubscriptionService.upgradeSubscription(
        memberId,
        newLevel,
      );

      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: "SUBSCRIPTION_UPGRADE_FIC",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `FIC subscription upgrade processed for member ${memberId}`,
        sourceModule: "FICSubscriptionPaymentService",
        details: {
          transactionId: transactionResult.transaction.id,
          subscriptionId: upgradeResult.id,
          amount: paymentDetails.ficAmount,
          previousLevel: currentSubscription.subscription_level,
          newLevel: newLevel
        }
      });

      await client.query("COMMIT");

      return {
        success: true,
        transaction: transactionResult.transaction,
        subscription: upgradeResult,
        paymentDetails: paymentDetails
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Process subscription renewal payment using FIC
  static async processSubscriptionRenewalWithFIC(subscriptionId) {
    const client = await monetizationDb.connect();
    try {
      await client.query("BEGIN");

      // Get subscription details
      const subscription = await monetizationDb.query(
        "SELECT * FROM fm_fic_subscriptions WHERE id = $1",
        [subscriptionId],
      );

      if (subscription.rows.length === 0) {
        throw new Error("Subscription not found");
      }

      const sub = subscription.rows[0];
      const memberId = sub.member_id;

      // Calculate FIC amount for renewal
      const paymentDetails = await this.calculateFICAmount(
        sub.subscription_level,
      );

      // Get member's wallet
      const wallet = await FICWalletService.getWalletBymemberId(memberId);

      // Check if member has sufficient balance
      if (wallet.balance < paymentDetails.ficAmount) {
        throw new Error(
          `Insufficient FIC balance. Required: ${paymentDetails.ficAmount} Available: ${wallet.balance}`,
        );
      }

      // Create transaction for subscription renewal payment
      const transactionResult = await FICTransactionservice.createTransaction(
        wallet.id,
        paymentDetails.ficAmount,
        "subscription_renewal",
        `Payment for FIC ${sub.subscription_level} subscription renewal`,
        "FIC_WALLET",
        "FIC_PLATFORM",
      );

      // Process the renewal
      const renewalResult =
        await FICSubscriptionService.processRenewal(subscriptionId);

      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: "SUBSCRIPTION_RENEWAL_FIC",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `FIC subscription renewal processed for member ${memberId}`,
        sourceModule: "FICSubscriptionPaymentService",
        details: {
          transactionId: transactionResult.transaction.id,
          subscriptionId: renewalResult?.id,
          amount: paymentDetails.ficAmount,
          subscriptionLevel: sub.subscription_level
        }
      });

      await client.query("COMMIT");

      return {
        success: true,
        transaction: transactionResult.transaction,
        subscription: renewalResult,
        paymentDetails: paymentDetails
      };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Get subscription payment history with FIC
  static async getSubscriptionPaymentHistory(memberId) {
    // Get FIC transactions related to subscriptions
    const transactions = await FICTransactionservice.getMemberTransactions(
      memberId,
      {
        type: "subscription_payment",
        limit: 50
      }
    );

    // Get subscription history
    const subscriptionHistory =
      await FICSubscriptionService.getBillingHistory(memberId);

    // Combine both histories
    const combinedHistory = [
      ...transactions.map((t) => ({
        type: "transaction",
        id: t.id,
        date: t.created_at,
        amount: t.amount,
        description: t.description,
        transaction_type: t.transaction_type
      })),
      ...subscriptionHistory.map((s) => ({
        type: "subscription",
        id: s.id,
        date: s.date,
        level: s.level,
        description: s.description,
        period: s.period
      }))
    ];

    // Sort by date, newest first
    combinedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

    return combinedHistory;
  }
}

module.exports = FICSubscriptionPaymentService;
