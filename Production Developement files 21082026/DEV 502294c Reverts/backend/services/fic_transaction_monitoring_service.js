const { monetizationDb } = require("../db");
const { logSecurityEvent } = require("../utils/securityLogger");

class FICTransactionMonitoringService {
  // Risk assessment thresholds
  static getRiskThresholds() {
    return {
      largeTransactionAmount: 10000, // FIC amount threshold for large transactions
      rapidTransactions: 5, // Number of transactions in short period that triggers alert
      rapidTransactionWindow: 300, // Time window in seconds for rapid transaction detection
      dailyTransactionLimit: 50000, // Daily transaction amount limit
      suspiciousCountries: ["AF", "SY", "KP", "VE"], // Suspicious country codes
      highRiskMerchants: ["gambling", "cryptocurrency", "adult"], // High risk merchant categories

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

  // Calculate risk score for transaction
  static async calculateRiskScore(transactionId) {
    const thresholds = this.getRiskThresholds();

    // Get transaction details
    const transactionResult = await monetizationDb.query(
      `SELECT * FROM fics_transactions WHERE id = $1`,
      [transactionId],
    );

    if (transactionResult.rows.length === 0) {
      throw new Error(`Transaction not found: ${transactionId}`);
    }

    const transaction = transactionResult.rows[0];

    // Get member's transaction history
    const historyResult = await monetizationDb.query(
      `SELECT * FROM fics_transactions 
       WHERE wallet_id = $1 AND created_at > NOW() - INTERVAL '24 HOURS'
       ORDER BY created_at DESC`,
      [transaction.wallet_id],
    );

    const memberTransactions = historyResult.rows;

    let riskScore = 0;

    // Check for large transaction amount
    if (transaction.amount > thresholds.largeTransactionAmount) {
      riskScore += thresholds.weights.amount;
    }

    // Check for rapid transactions
    if (memberTransactions.length > thresholds.rapidTransactions) {
      const recentTransactions = memberTransactions.filter(
        (t) =>
          new Date(t.created_at) >
          new Date(Date.now() - thresholds.rapidTransactionWindow * 1000),
      );

      if (recentTransactions.length > thresholds.rapidTransactions) {
        riskScore += thresholds.weights.frequency;
      }
    }

    // Check for daily transaction limit
    const dailyTotal = memberTransactions.reduce((sum, t) => sum + t.amount, 0);
    if (dailyTotal > thresholds.dailyTransactionLimit) {
      riskScore += thresholds.weights.amount * 0.5;
    }

    // Calculate final risk score (0-100)
    riskScore = Math.min(100, Math.max(0, riskScore * 100));

    // Create monitoring record
    const monitoringResult = await monetizationDb.query(
      `INSERT INTO fics_transaction_monitoring 
       (transaction_id, risk_score, suspicious_activity, monitoring_notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        transactionId,
        riskScore,
        riskScore > 70, // Mark as suspicious if score > 70
        `Risk score calculated as ${riskScore.toFixed(2)} - ${riskScore > 70 ? "Suspicious activity detected" : "No suspicious activity detected"}`
      ],
    );

    // Log security event if suspicious activity detected
    if (riskScore > 70) {
      await logSecurityEvent({
        memberId: transaction.wallet_id,
        eventType: "SUSPICIOUS_ACTIVITY_DETECTED",
        ipAddress: null,
        memberAgent: null,
        success: true,
        severity: "HIGH",
        description: `Suspicious activity detected for transaction ${transactionId}`,
        sourceModule: "FICTransactionMonitoringService",
        details: {
          monitoringId: monitoringResult.rows[0].id,
          riskScore: riskScore,
          transactionId: transactionId
        }
      });
    }

    return monitoringResult.rows[0];
  }

  // Get transaction monitoring details
  static async getTransactionMonitoring(transactionId) {
    const result = await monetizationDb.query(
      `SELECT * FROM fics_transaction_monitoring WHERE transaction_id = $1`,
      [transactionId],
    );
    return result.rows[0];
  }
}

module.exports = FICTransactionMonitoringService;
