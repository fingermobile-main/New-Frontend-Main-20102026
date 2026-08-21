const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");
const FICExchangeService = require("./fic_exchange_service");
const FICTransactionservice = require("./fic_transaction_service");

// Mock payment gateway implementations
const paymentGateways = {
  alipay: {
    processPayment: async (amount, currency, memberId) => {
      // In a real implementation, this would call Alipay's API
      return {
        success: true,
        transactionId: `ALIPAY-${Date.now()}-${memberId}`,
        amount: amount,
        currency: currency
      };
    },

    processPayout: async (amount, currency, memberId) => {

    // In a real implementation, this would call Alipay's API
      return {
        success: true,
        transactionId: `ALIPAY-PAYOUT-${Date.now()}-${memberId}`,
        amount: amount,
        currency: currency
      };
    }
  },

  wechatpay: {
    processPayment: async (amount, currency, memberId) => {
      // In a real implementation, this would call WeChat Pay's API
      return {
        success: true,
        transactionId: `WECHAT-${Date.now()}-${memberId}`,
        amount: amount,
        currency: currency
      };
    },

    processPayout: async (amount, currency, memberId) => {
      // In a real implementation, this would call WeChat Pay's API
      return {
        success: true,
        transactionId: `WECHAT-PAYOUT-${Date.now()}-${memberId}`,
        amount: amount,
        currency: currency
      };
    }
  },

  opay: {
    processPayment: async (amount, currency, memberId) => {
      // In a real implementation, this would call Opay's API
      return {
        success: true,
        transactionId: `OPAY-${Date.now()}-${memberId}`,
        amount: amount,
        currency: currency
      };
    },

    processPayout: async (amount, currency, memberId) => {
      // In a real implementation, this would call Opay's API
      return {
        success: true,
        transactionId: `OPAY-PAYOUT-${Date.now()}-${memberId}`,
        amount: amount,
        currency: currency
      };
    }
  },

  moniepoint: {
    processPayment: async (amount, currency, memberId) => {
      // In a real implementation, this would call Moniepoint's API
      return {
        success: true,
        transactionId: `MONIEPOINT-${Date.now()}-${memberId}`,
        amount: amount,
        currency: currency
      };
    },

    processPayout: async (amount, currency, memberId) => {
      // In a real implementation, this would call Moniepoint's API
      return {
        success: true,
        transactionId: `MONIEPOINT-PAYOUT-${Date.now()}-${memberId}`,
        amount: amount,
        currency: currency
      };
    }
  }
};

class FICPaymentGatewayService {
  // Get all supported payment gateways
  static async getSupportedGateways() {
    return Object.keys(paymentGateways);
  }

  // Get gateway configuration
  static async getGatewayConfig(gatewayName) {
    const result = await monetizationDb.query(
      `SELECT * FROM fics_payment_gateways WHERE name = $1`,
      [gatewayName],
    );
    return result.rows[0];
  }

  // Process payment through gateway
  static async processPayment(gatewayName, amountUSD, memberId) {
    if (!paymentGateways[gatewayName]) {
      throw new Error(`Unsupported payment gateway: ${gatewayName}`);
    }

    // Process payment with the gateway
    const paymentResult = await paymentGateways[gatewayName].processPayment(
      amountUSD,
      "USD",
      memberId,
    );

    if (paymentResult.success) {
      // Convert USD to FIC
      const exchangeResult = await FICExchangeService.convertUSDToFIC(
        memberId,
        amountUSD,
      );

      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: "PAYMENT_PROCESSED",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `Payment processed through ${gatewayName}`,
        sourceModule: "FICPaymentGatewayService",
        details: {
          gateway: gatewayName,
          usdAmount: amountUSD,
          ficAmount: exchangeResult.ficAmount,
          transactionId: paymentResult.transactionId
        }
      });

      return {
        success: true,
        gateway: gatewayName,
        usdAmount: amountUSD,
        ficAmount: exchangeResult.ficAmount,
        rate: exchangeResult.rate,
        paymentTransactionId: paymentResult.transactionId,
        ficTransactionId: exchangeResult.transaction.id
      };
    }

    throw new Error(`Payment failed through ${gatewayName}`);
  }

  // Process payout through gateway
  static async processPayout(gatewayName, amountFIC, memberId) {
    if (!paymentGateways[gatewayName]) {
      throw new Error(`Unsupported payment gateway: ${gatewayName}`);
    }

    // Convert FIC to USD
    const exchangeResult = await FICExchangeService.convertFICtoUSD(
      memberId,
      amountFIC,
    );

    // Process payout with the gateway
    const payoutResult = await paymentGateways[gatewayName].processPayout(
      exchangeResult.usdAmount,
      "USD",
      memberId,
    );

    if (payoutResult.success) {
      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: "PAYOUT_PROCESSED",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "LOW",
        description: `Payout processed through ${gatewayName}`,
        sourceModule: "FICPaymentGatewayService",
        details: {
          gateway: gatewayName,
          usdAmount: exchangeResult.usdAmount,
          ficAmount: amountFIC,
          transactionId: payoutResult.transactionId
        }
      });

      return {
        success: true,
        gateway: gatewayName,
        usdAmount: exchangeResult.usdAmount,
        ficAmount: amountFIC,
        rate: exchangeResult.rate,
        payoutTransactionId: payoutResult.transactionId,
        ficTransactionId: exchangeResult.transaction.id
      };
    }

    throw new Error(`Payout failed through ${gatewayName}`);
  }
}

module.exports = FICPaymentGatewayService;
