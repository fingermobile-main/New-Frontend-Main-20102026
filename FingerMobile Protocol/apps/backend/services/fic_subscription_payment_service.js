const FICSubscription = require('../models/FICSubscription');
const { logSecurityEvent } = require('../utils/securityLogger');
const FICWalletService = require('./fic_wallet_service');
const FICTransactionservice = require('./fic_transaction_service');
const FICExchangeService = require('./fic_exchange_service');
const FICSubscriptionService = require('./fic-subscription');

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
    // Calculate FIC amount needed for subscription
    const paymentDetails = await this.calculateFICAmount(subscriptionLevel);

    // Get member's wallet
    const wallet = await FICWalletService.getWalletBymemberId(memberId);
    if (!wallet) throw new Error(`No FIC wallet found for member ${memberId}`);

    // Check if member has sufficient balance
    if (parseFloat(wallet.balance) < paymentDetails.ficAmount) {
      throw new Error(
        `Insufficient FIC balance. Required: ${paymentDetails.ficAmount} Available: ${wallet.balance}`
      );
    }

    // Create transaction for subscription payment (handles atomicity internally)
    const transactionResult = await FICTransactionservice.createTransaction(
      wallet.id,
      paymentDetails.ficAmount,
      'subscription_payment',
      `Payment for FIC ${subscriptionLevel} subscription`,
      'FIC_WALLET',
      'FIC_PLATFORM'
    );

    // Process the subscription
    const subscriptionResult = await FICSubscriptionService.createSubscription({
      member_id: memberId,
      subscription_level: subscriptionLevel,
      subscription_type: 'FIC_Platform',
      payment_method_id: transactionResult.transaction.id
    });

    await logSecurityEvent({
      memberId,
      eventType: 'SUBSCRIPTION_PAYMENT_FIC',
      ipAddress: null,
      memberAgent: null,
      success: true,
      severity: 'LOW',
      description: `FIC subscription payment processed for member ${memberId}`,
      sourceModule: 'FICSubscriptionPaymentService',
      details: {
        transactionId: transactionResult.transaction.id,
        subscriptionId: subscriptionResult.id,
        amount: paymentDetails.ficAmount,
        subscriptionLevel
      }
    });

    return {
      success: true,
      transaction: transactionResult.transaction,
      subscription: subscriptionResult,
      paymentDetails
    };
  }

  // Process subscription upgrade payment using FIC
  static async processSubscriptionUpgradeWithFIC(memberId, newLevel) {
    const currentSubscription = await FICSubscriptionService.getmembersubscription(memberId);
    if (!currentSubscription) {
      throw new Error('No active subscription found for member');
    }

    const paymentDetails = await this.calculateFICAmount(newLevel);
    const wallet = await FICWalletService.getWalletBymemberId(memberId);
    if (!wallet) throw new Error(`No FIC wallet found for member ${memberId}`);

    if (parseFloat(wallet.balance) < paymentDetails.ficAmount) {
      throw new Error(
        `Insufficient FIC balance. Required: ${paymentDetails.ficAmount} Available: ${wallet.balance}`
      );
    }

    const transactionResult = await FICTransactionservice.createTransaction(
      wallet.id,
      paymentDetails.ficAmount,
      'subscription_upgrade',
      `Payment for FIC subscription upgrade to ${newLevel}`,
      'FIC_WALLET',
      'FIC_PLATFORM'
    );

    const upgradeResult = await FICSubscriptionService.upgradeSubscription(memberId, newLevel);

    await logSecurityEvent({
      memberId,
      eventType: 'SUBSCRIPTION_UPGRADE_FIC',
      ipAddress: null,
      memberAgent: null,
      success: true,
      severity: 'LOW',
      description: `FIC subscription upgrade processed for member ${memberId}`,
      sourceModule: 'FICSubscriptionPaymentService',
      details: {
        transactionId: transactionResult.transaction.id,
        subscriptionId: upgradeResult.id,
        amount: paymentDetails.ficAmount,
        previousLevel: currentSubscription.subscription_level,
        newLevel
      }
    });

    return {
      success: true,
      transaction: transactionResult.transaction,
      subscription: upgradeResult,
      paymentDetails
    };
  }

  // Process subscription renewal payment using FIC
  static async processSubscriptionRenewalWithFIC(subscriptionId) {
    // Fetch subscription via Sequelize model
    const sub = await FICSubscription.findByPk(subscriptionId);
    if (!sub) throw new Error('Subscription not found');

    const memberId = sub.memberId;
    const paymentDetails = await this.calculateFICAmount(sub.subscriptionLevel);

    const wallet = await FICWalletService.getWalletBymemberId(memberId);
    if (!wallet) throw new Error(`No FIC wallet found for member ${memberId}`);

    if (parseFloat(wallet.balance) < paymentDetails.ficAmount) {
      throw new Error(
        `Insufficient FIC balance. Required: ${paymentDetails.ficAmount} Available: ${wallet.balance}`
      );
    }

    const transactionResult = await FICTransactionservice.createTransaction(
      wallet.id,
      paymentDetails.ficAmount,
      'subscription_renewal',
      `Payment for FIC ${sub.subscriptionLevel} subscription renewal`,
      'FIC_WALLET',
      'FIC_PLATFORM'
    );

    const renewalResult = await FICSubscriptionService.processRenewal(subscriptionId);

    await logSecurityEvent({
      memberId,
      eventType: 'SUBSCRIPTION_RENEWAL_FIC',
      ipAddress: null,
      memberAgent: null,
      success: true,
      severity: 'LOW',
      description: `FIC subscription renewal processed for member ${memberId}`,
      sourceModule: 'FICSubscriptionPaymentService',
      details: {
        transactionId: transactionResult.transaction.id,
        subscriptionId: renewalResult?.id,
        amount: paymentDetails.ficAmount,
        subscriptionLevel: sub.subscriptionLevel
      }
    });

    return {
      success: true,
      transaction: transactionResult.transaction,
      subscription: renewalResult,
      paymentDetails
    };
  }

  // Get subscription payment history with FIC
  static async getSubscriptionPaymentHistory(memberId) {
    // Get FIC transactions related to subscriptions
    const transactions = await FICTransactionservice.getMemberTransactions(
      memberId,
      {
        type: 'subscription_payment',
        limit: 50
      }
    );

    // Get subscription history
    const subscriptionHistory =
      await FICSubscriptionService.getBillingHistory(memberId);

    // Combine both histories
    const combinedHistory = [
      ...transactions.map((t) => ({
        type: 'transaction',
        id: t.id,
        date: t.created_at,
        amount: t.amount,
        description: t.description,
        transaction_type: t.transaction_type
      })),
      ...subscriptionHistory.map((s) => ({
        type: 'subscription',
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
