const { Op } = require('sequelize');
const FICTransaction = require('../models/FICTransaction');
const FICTransactionMonitoring = require('../models/FICTransactionMonitoring');
const { logSecurityEvent } = require('../utils/securityLogger');

class FICTransactionMonitoringService {
  // Risk assessment thresholds
  static getRiskThresholds() {
    return {
      largeTransactionAmount: 10000, // FIC amount threshold for large transactions
      rapidTransactions: 5,          // Number of transactions in short period that triggers alert
      rapidTransactionWindow: 300,   // Time window in seconds for rapid transaction detection
      dailyTransactionLimit: 50000,  // Daily transaction amount limit
      suspiciousCountries: ['AF', 'SY', 'KP', 'VE'],
      highRiskMerchants: ['gambling', 'cryptocurrency', 'adult'],

      // Risk scoring weights
      weights: {
        amount: 0.3,
        frequency: 0.25,
        location: 0.15,
        merchant: 0.2,
        pattern: 0.1
      }
    };
  }

  /**
   * Calculate risk score for a FIC transaction and persist a monitoring record.
   */
  static async calculateRiskScore(transactionId) {
    const thresholds = this.getRiskThresholds();

    // Fetch the target transaction
    const transaction = await FICTransaction.findByPk(transactionId);
    if (!transaction) {
      throw new Error(`Transaction not found: ${transactionId}`);
    }

    // Fetch the member's last 24h transactions on the same wallet
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const memberTransactions = await FICTransaction.findAll({
      where: {
        walletId: transaction.walletId,
        createdAt: { [Op.gte]: oneDayAgo }
      },
      order: [['createdAt', 'DESC']]
    });

    let riskScore = 0;

    // Check for large transaction amount
    if (parseFloat(transaction.amount) > thresholds.largeTransactionAmount) {
      riskScore += thresholds.weights.amount;
    }

    // Check for rapid transactions within the time window
    if (memberTransactions.length > thresholds.rapidTransactions) {
      const windowStart = new Date(Date.now() - thresholds.rapidTransactionWindow * 1000);
      const recentTxs = memberTransactions.filter(
        t => new Date(t.createdAt) > windowStart
      );
      if (recentTxs.length > thresholds.rapidTransactions) {
        riskScore += thresholds.weights.frequency;
      }
    }

    // Check daily transaction total
    const dailyTotal = memberTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount), 0
    );
    if (dailyTotal > thresholds.dailyTransactionLimit) {
      riskScore += thresholds.weights.amount * 0.5;
    }

    // Normalise to 0-100
    riskScore = Math.min(100, Math.max(0, riskScore * 100));
    const isSuspicious = riskScore > 70;

    // Persist monitoring record
    const monitoringRecord = await FICTransactionMonitoring.create({
      transactionId,
      riskScore,
      suspiciousActivity: isSuspicious,
      monitoringNotes: `Risk score: ${riskScore.toFixed(2)} — ${isSuspicious ? 'Suspicious activity detected' : 'No suspicious activity detected'}`
    });

    // Raise a security event for suspicious cases
    if (isSuspicious) {
      await logSecurityEvent({
        memberId: transaction.walletId,
        eventType: 'SUSPICIOUS_ACTIVITY_DETECTED',
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: 'HIGH',
        description: `Suspicious FIC activity detected for transaction ${transactionId}`,
        sourceModule: 'FICTransactionMonitoringService',
        details: {
          monitoringId: monitoringRecord.id,
          riskScore,
          transactionId
        }
      });
    }

    return monitoringRecord.toJSON();
  }

  /**
   * Retrieve the monitoring record for a given transactionId.
   */
  static async getTransactionMonitoring(transactionId) {
    const record = await FICTransactionMonitoring.findOne({
      where: { transactionId }
    });
    return record ? record.toJSON() : null;
  }
}

module.exports = FICTransactionMonitoringService;

