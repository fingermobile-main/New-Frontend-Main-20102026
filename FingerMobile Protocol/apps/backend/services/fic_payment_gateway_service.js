/* eslint-disable no-unused-vars */
const { monetizationDb } = require('../db');
const { logSecurityEvent } = require('../utils/securityLogger');
const FICExchangeService = require('./fic_exchange_service');
const FICTransactionservice = require('./fic_transaction_service');

const PaymentGateway = require('../models/PaymentGateway');

class FICPaymentGatewayService {
  // Get all supported payment gateways
  static async getSupportedGateways() {
    const gateways = await PaymentGateway.findAll({ where: { status: 'active' } });
    return gateways.map(g => g.name);
  }

  // Get gateway configuration
  static async getGatewayConfig(gatewayName) {
    const gateway = await PaymentGateway.findOne({ where: { name: gatewayName } });
    return gateway ? gateway.toJSON() : null;
  }

  // Process payment through gateway
  static async processPayment(gatewayName, amountUSD, memberId) {
    const gateway = await PaymentGateway.findOne({ where: { name: gatewayName, status: 'active' } });

    if (!gateway) {
      throw new Error(`Unsupported payment gateway: ${gatewayName}`);
    }

    // In a real implementation, this would call the actual gateway API using gateway.apiKey
    const paymentResult = {
      success: true,
      transactionId: `${gateway.provider.toUpperCase()}-${Date.now()}-${memberId}`,
      amount: amountUSD,
      currency: 'USD'
    };

    if (paymentResult.success) {
      // Convert USD to FIC
      const exchangeResult = await FICExchangeService.convertUSDToFIC(
        memberId,
        amountUSD,
      );

      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: 'PAYMENT_PROCESSED',
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: 'LOW',
        description: `Payment processed through ${gatewayName}`,
        sourceModule: 'FICPaymentGatewayService',
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
    const gateway = await PaymentGateway.findOne({ where: { name: gatewayName, status: 'active' } });

    if (!gateway) {
      throw new Error(`Unsupported payment gateway: ${gatewayName}`);
    }

    // Convert FIC to USD
    const exchangeResult = await FICExchangeService.convertFICtoUSD(
      memberId,
      amountFIC,
    );

    // In a real implementation, this would call the actual gateway API using gateway.apiKey
    const payoutResult = {
      success: true,
      transactionId: `${gateway.provider.toUpperCase()}-PAYOUT-${Date.now()}-${memberId}`,
      amount: exchangeResult.usdAmount,
      currency: 'USD'
    };

    if (payoutResult.success) {
      // Log security event
      await logSecurityEvent({
        memberId: memberId,
        eventType: 'PAYOUT_PROCESSED',
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: 'LOW',
        description: `Payout processed through ${gatewayName}`,
        sourceModule: 'FICPaymentGatewayService',
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
