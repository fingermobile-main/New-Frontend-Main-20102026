const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");
const FICWalletService = require("./fic_wallet_service");
const FICTransactionservice = require("./fic_transaction_service");
const FICExchangeService = require("./fic_exchange_service");
const FICPaymentGatewayService = require("./fic_payment_gateway_service");
const FICBiometricService = require("./fic_biometric_service");
const FICTransactionMonitoringService = require("./fic_transaction_monitoring_service");
const FICAnonymityService = require("./fic_anonymity_service");
const FICSubscriptionPaymentService = require("./fic_subscription_payment_service");
const FICPaylinkService = require("./fic_paylink_service");

class FICService {
  // Initialize member wallet
  static async initializeMemberWallet(memberId) {
    try {
      // Check if member already has a wallet
      const existingWallet =
        await FICWalletService.getWalletBymemberId(memberId);

      if (existingWallet) {
        return existingWallet;
      }

      // Create new wallet for member
      const newWallet = await FICWalletService.createWallet(memberId);

      // Log security event
      await logSecurityEvent(memberId, "FIC_WALLET_INITIALIZED", {
        walletId: newWallet.id
      });

      return newWallet;
    } catch (error) {
      logger.error("Error initializing member wallet:", error);
      throw error;
    }
  }

  // Get member's FIC wallet information
  static async getMemberWallet(memberId) {
    try {
      const wallet = await FICWalletService.getWalletBymemberId(memberId);

      if (!wallet) {
        // Initialize wallet if it doesn't exist
        return await this.initializeMemberWallet(memberId);
      }

      return wallet;
    } catch (error) {
      logger.error("Error getting member wallet:", error);
      throw error;
    }
  }

  // Process FIC transaction
  static async processTransaction(
    memberId,
    amount,
    transactionType,
    description,
    fromAccount,
    toAccount,
  ) {
    try {
      // Get member's wallet
      const wallet = await FICWalletService.getWalletBymemberId(memberId);

      // Create transaction
      const transactionResult = await FICTransactionservice.createTransaction(
        wallet.id,
        amount,
        transactionType,
        description,
        fromAccount,
        toAccount,
      );

      // Monitor transaction for suspicious activity
      await FICTransactionMonitoringService.calculateRiskScore(
        transactionResult.transaction.id,
      );

      return transactionResult;
    } catch (error) {
      logger.error("Error processing transaction:", error);
      throw error;
    }
  }

  // Process USD to FIC exchange
  static async processExchange(memberId, amountUSD, direction = "usd_to_fic") {
    try {
      if (direction === "usd_to_fic") {
        return await FICExchangeService.convertUSDToFIC(memberId, amountUSD);
      } else {
        return await FICExchangeService.convertFICtoUSD(memberId, amountUSD);
      }
    } catch (error) {
      logger.error("Error processing exchange:", error);
      throw error;
    }
  }

  // Process payment through external gateway
  static async processPaymentThroughGateway(gatewayName, amountUSD, memberId) {
    try {
      return await FICPaymentGatewayService.processPayment(
        gatewayName,
        amountUSD,
        memberId,
      );
    } catch (error) {
      logger.error("Error processing payment through gateway:", error);
      throw error;
    }
  }

  // Process payout through external gateway
  static async processPayoutThroughGateway(gatewayName, amountFIC, memberId) {
    try {
      return await FICPaymentGatewayService.processPayout(
        gatewayName,
        amountFIC,
        memberId,
      );
    } catch (error) {
      logger.error("Error processing payout through gateway:", error);
      throw error;
    }
  }

  // Register biometric for member
  static async registerBiometric(memberId, biometricType) {
    try {
      return await FICBiometricService.registerBiometric(
        memberId,
        biometricType,
      );
    } catch (error) {
      logger.error("Error registering biometric:", error);
      throw error;
    }
  }

  // Verify biometric for transaction
  static async verifyBiometric(memberId, biometricType, providedTemplate) {
    try {
      return await FICBiometricService.verifyBiometric(
        memberId,
        biometricType,
        providedTemplate,
      );
    } catch (error) {
      logger.error("Error verifying biometric:", error);
      throw error;
    }
  }

  // Get member's anonymity settings
  static async getMemberAnonymitySettings(memberId) {
    try {
      return await FICAnonymityService.getMemberAnonymitySettings(memberId);
    } catch (error) {
      logger.error("Error getting anonymity settings:", error);
      throw error;
    }
  }

  // Update member's anonymity settings
  static async updateMemberAnonymitySettings(memberId, settings) {
    try {
      return await FICAnonymityService.updateAnonymitySettings(
        memberId,
        settings,
      );
    } catch (error) {
      logger.error("Error updating anonymity settings:", error);
      throw error;
    }
  }

  // Process subscription payment with FIC
  static async processSubscriptionPayment(memberId, subscriptionLevel) {
    try {
      return await FICSubscriptionPaymentService.processSubscriptionPaymentWithFIC(
        memberId,
        subscriptionLevel,
      );
    } catch (error) {
      logger.error("Error processing subscription payment:", error);
      throw error;
    }
  }

  // Create a paylink
  static async createPaylink(memberId, amount, description, expiryHours) {
    try {
      return await FICPaylinkService.createPaylink(
        memberId,
        amount,
        description,
        expiryHours,
      );
    } catch (error) {
      logger.error("Error creating paylink:", error);
      throw error;
    }
  }

  // Redeem a paylink
  static async redeemPaylink(paylinkId, receivermemberId) {
    try {
      return await FICPaylinkService.redeemPaylink(paylinkId, receivermemberId);
    } catch (error) {
      logger.error("Error redeeming paylink:", error);
      throw error;
    }
  }

  // Get member's paylinks
  static async getMemberPaylinks(memberId, options) {
    try {
      return await FICPaylinkService.getMemberPaylinks(memberId, options);
    } catch (error) {
      logger.error("Error getting member paylinks:", error);
      throw error;
    }
  }

  // Cancel a paylink
  static async cancelPaylink(paylinkId, memberId) {
    try {
      return await FICPaylinkService.cancelPaylink(paylinkId, memberId);
    } catch (error) {
      logger.error("Error cancelling paylink:", error);
      throw error;
    }
  }

  // Get member's transaction history
  static async getMemberTransactionHistory(memberId, options) {
    try {
      return await FICTransactionservice.getMemberTransactions(
        memberId,
        options,
      );
    } catch (error) {
      logger.error("Error getting transaction history:", error);
      throw error;
    }
  }

  // Get current exchange rate
  static async getCurrentExchangeRate() {
    try {
      return await FICExchangeService.getExchangeRate();
    } catch (error) {
      logger.error("Error getting exchange rate:", error);
      throw error;
    }
  }

  // Get supported payment gateways
  static async getSupportedPaymentGateways() {
    try {
      return await FICPaymentGatewayService.getSupportedGateways();
    } catch (error) {
      logger.error("Error getting payment gateways:", error);
      throw error;
    }
  }

  // Get member's biometric records
  static async getMemberBiometricRecords(memberId) {
    try {
      return await FICBiometricService.getBiometricRecords(memberId);
    } catch (error) {
      logger.error("Error getting biometric records:", error);
      throw error;
    }
  }
}

module.exports = FICService;
