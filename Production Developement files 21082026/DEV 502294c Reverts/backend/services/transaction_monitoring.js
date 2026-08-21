import { monetizationDb } from "../../db";
import { logSecurityEvent } from "../../utils/securityLogger";
import { calculateRiskScore } from "../services/fic_transaction_monitoring_service";

class TransactionMonitoringService {
  // Monitor transaction for suspicious activity
  static async monitorTransaction(transactionId, memberId) {
    try {
      // Calculate risk score using FIC monitoring service
      const monitoringRecord = await calculateRiskScore(transactionId);

      // Log security event if suspicious activity detected
      if (monitoringRecord.suspicious_activity) {
        await logSecurityEvent(memberId, "FIC_SUSPICIOUS_ACTIVITY", {
          monitoringId: monitoringRecord.id,
          riskScore: monitoringRecord.risk_score,
          transactionId: transactionId
        });
      }

      return monitoringRecord;
    } catch (error) {
      logger.error("Error monitoring transaction:", error);
      throw error;
    }
  }

  // Get transaction monitoring details
  static async getTransactionMonitoringDetails(transactionId) {
    const result = await monetizationDb.query(
      `SELECT * FROM fics_transaction_monitoring WHERE transaction_id = $1`,
      [transactionId],
    );
    return result.rows[0];
  }
}

module.exports = TransactionMonitoringService;
