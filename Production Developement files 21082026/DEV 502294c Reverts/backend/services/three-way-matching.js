// Three-Way Matching Service for FingerMobile P2P Matching System
// Handles procurement document matching (PO, GRN, Invoice)

const db = require("../db");

class ThreeWayMatchingService {
  constructor() {
    this.MATCH_THRESHOLD = 95; // 95% match threshold for automatic approval
  }

  /**
   * Perform three-way matching between Purchase Order, Goods Receipt Note, and Invoice
   * @param {string} poId - Purchase Order ID
   * @param {string} grnId - Goods Receipt Note ID
   * @param {string} invoiceId - Invoice ID
   * @returns {Object} Match result with confidence score and details
   */
  async performThreeWayMatch(poId, grnId, invoiceId) {
    try {
      // Validate document IDs
      if (!this.isValidUUID(poId) || !this.isValidUUID(invoiceId)) {
        throw new Error("Invalid PO or Invoice ID format");
      }

      if (grnId && !this.isValidUUID(grnId)) {
        throw new Error("Invalid GRN ID format");
      }

      // Fetch all documents
      const po = await this.getDocumentById(poId);
      const invoice = await this.getDocumentById(invoiceId);
      const grn = grnId ? await this.getDocumentById(grnId) : null;

      if (!po || po.document_type !== "purchase_order") {
        throw new Error("Valid Purchase Order not found");
      }

      if (!invoice || invoice.document_type !== "invoice") {
        throw new Error("Valid Invoice not found");
      }

      if (grnId && (!grn || grn.document_type !== "goods_receipt")) {
        throw new Error("Valid Goods Receipt Note not found");
      }

      // Perform matching analysis
      const matchResult = await this.analyzeMatch(po, grn, invoice);

      // Calculate overall confidence score
      const confidenceScore = this.calculateConfidenceScore(matchResult);

      // Determine match status
      const matchStatus = this.determineMatchStatus(
        confidenceScore,
        matchResult,
      );

      // Create match record
      const matchRecord = await this.createMatchRecord({
        poId,
        grnId: grnId || null,
        invoiceId,
        matchResult,
        confidenceScore,
        matchStatus
      });

      // Log the matching result
      await this.logMatchActivity(matchRecord, po, invoice, grn);

      return {
        ...matchRecord,
        match_details: matchResult
      };
    } catch (error) {
      logger.error("Three-way matching error:", error.message);
      throw error;
    }
  }

  /**
   * Analyze matching between documents
   * @param {Object} po - Purchase Order
   * @param {Object} grn - Goods Receipt Note
   * @param {Object} invoice - Invoice
   * @returns {Object} Detailed match analysis
   */
  async analyzeMatch(po, grn, invoice) {
    const analysis = {
      purchase_order: {
        matches: true,
        details: {}
      },
      goods_receipt: {
        matches: true,
        details: {}
      },
      invoice: {
        matches: true,
        details: {}
      },
      overall: {
        matches: true,
        reasons: []
      }
    };

    // PO vs Invoice matching
    analysis.purchase_order.details.po_number_match =
      po.document_number === invoice.metadata?.po_number;
    analysis.purchase_order.details.amount_match = po.amount === invoice.amount;
    analysis.purchase_order.details.currency_match =
      po.currency === invoice.currency;
    analysis.purchase_order.details.date_match = this.datesMatch(
      po.issue_date,
      invoice.issue_date,
      30,
    ); // 30-day tolerance
    analysis.purchase_order.details.item_details_match = this.itemDetailsMatch(
      po.metadata?.items,
      invoice.metadata?.items,
    );

    // Calculate PO-Invoice match status
    analysis.purchase_order.matches = Object.values(
      analysis.purchase_order.details,
    ).every(Boolean);

    if (!analysis.purchase_order.matches) {
      analysis.overall.matches = false;
      analysis.overall.reasons.push("PO and Invoice do not match");
    }

    // If GRN exists, match with PO and Invoice
    if (grn) {
      analysis.goods_receipt.details.quantity_match =
        grn.metadata?.quantity === po.metadata?.quantity;
      analysis.goods_receipt.details.item_details_match = this.itemDetailsMatch(
        grn.metadata?.items,
        po.metadata?.items,
      );
      analysis.goods_receipt.details.delivery_date_match = this.datesMatch(
        grn.issue_date,
        po.due_date,
        7,
      ); // 7-day tolerance

      // GRN vs Invoice
      analysis.goods_receipt.details.invoice_match =
        grn.metadata?.invoice_number === invoice.document_number ||
        grn.metadata?.invoice_number === invoice.metadata?.invoice_number;

      // Calculate GRN match status
      analysis.goods_receipt.matches = Object.values(
        analysis.goods_receipt.details,
      ).every(Boolean);

      if (!analysis.goods_receipt.matches) {
        analysis.overall.matches = false;
        analysis.overall.reasons.push(
          "GRN does not match with other documents",
        );
      }
    }

    return analysis;
  }

  /**
   * Calculate confidence score based on match analysis
   * @param {Object} matchResult - Match analysis result
   * @returns {number} Confidence score (0-100)
   */
  calculateConfidenceScore(matchResult) {
    let totalChecks = 0;
    let passedChecks = 0;

    // Count PO checks
    for (const [key, value] of Object.entries(
      matchResult.purchase_order.details,
    )) {
      totalChecks++;
      if (value) passedChecks++;
    }

    // Count GRN checks if GRN exists
    if (Object.keys(matchResult.goods_receipt.details).length > 0) {
      for (const [key, value] of Object.entries(
        matchResult.goods_receipt.details,
      )) {
        totalChecks++;
        if (value) passedChecks++;
      }
    }

    return totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 0;
  }

  /**
   * Determine match status based on confidence score
   * @param {number} confidenceScore - Calculated confidence score
   * @param {Object} matchResult - Match analysis result
   * @returns {string} Match status
   */
  determineMatchStatus(confidenceScore, matchResult) {
    if (
      matchResult.overall.matches &&
      confidenceScore >= this.MATCH_THRESHOLD
    ) {
      return "matched";
    } else if (confidenceScore >= 70) {
      return "partial_match";
    } else {
      return "mismatched";
    }
  }

  /**
   * Create a record of the three-way match
   * @param {Object} data - Match data
   * @returns {Object} Created match record
   */
  async createMatchRecord(data) {
    const {
      poId,
      grnId,
      invoiceId,
      matchResult,
      confidenceScore,
      matchStatus
    } = data;

    const result = await db.query(
      `INSERT INTO fm_three_way_matches (
                po_id, grn_id, invoice_id, match_status, 
                match_result, confidence_score
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
      [poId, grnId, invoiceId, matchStatus, matchResult, confidenceScore],
    );

    return result.rows[0];
  }

  /**
   * Log match activity for audit trail
   * @param {Object} matchRecord - Match record
   * @param {Object} po - Purchase Order
   * @param {Object} invoice - Invoice
   * @param {Object} grn - Goods Receipt Note
   */
  async logMatchActivity(matchRecord, po, invoice, grn) {
    await db.query(
      `INSERT INTO fm_sentinel_logs (
                log_type, severity, entity_id, entity_type, 
                action_taken, details
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        "three_way_match",
        matchRecord.confidence_score >= this.MATCH_THRESHOLD
          ? "info"
          : "warning",
        matchRecord.id,
        "three_way_match",
        matchRecord.match_status,
        {
          po_id: po.id,
          invoice_id: invoice.id,
          grn_id: grn?.id || null,
          confidence_score: matchRecord.confidence_score,
          match_status: matchRecord.match_status,
          timestamp: new Date().toISOString()
        }
      ],
    );
  }

  /**
   * Enhanced matching with AI/ML fraud detection
   * @param {Object} po - Purchase Order
   * @param {Object} invoice - Invoice
   * @param {Object} grn - Goods Receipt Note
   * @returns {Object} Fraud risk assessment
   */
  async detectFraudRisks(po, invoice, grn) {
    const fraudIndicators = [];

    // Check for duplicate amounts
    const duplicateAmountPO = await db.query(
      `SELECT COUNT(*) as count FROM fm_procurement_documents 
            WHERE document_type = 'purchase_order' AND amount = $1 AND id != $2`,
      [po.amount, po.id],
    );

    if (parseInt(duplicateAmountPO.rows[0].count) > 2) {
      fraudIndicators.push({
        type: "duplicate_amount",
        severity: "high",
        description: "Multiple POs with same amount detected"
      });
    }

    // Check for round number amounts (potential fraud indicator)
    if (this.isRoundNumber(po.amount) || this.isRoundNumber(invoice.amount)) {
      fraudIndicators.push({
        type: "round_number",
        severity: "medium",
        description: "Round number amount detected"
      });
    }

    // Check for unusual timing (invoice before PO)
    if (new Date(invoice.issue_date) < new Date(po.issue_date)) {
      fraudIndicators.push({
        type: "timing_anomaly",
        severity: "high",
        description: "Invoice date is before PO date"
      });
    }

    // Check for entity risk
    if (po.entity_id === invoice.entity_id) {
      fraudIndicators.push({
        type: "same_entity",
        severity: "medium",
        description: "Same entity for PO and Invoice"
      });
    }

    return fraudIndicators;
  }

  /**
   * Fetch document by ID
   * @param {string} id - Document ID
   * @returns {Object} Document or null
   */
  async getDocumentById(id) {
    const result = await db.query(
      "SELECT * FROM fm_procurement_documents WHERE id = $1",
      [id],
    );

    return result.rows[0] || null;
  }

  /**
   * Check if dates match within tolerance
   * @param {string|Date} date1 - First date
   * @param {string|Date} date2 - Second date
   * @param {number} toleranceDays - Tolerance in days
   * @returns {boolean} Whether dates match within tolerance
   */
  datesMatch(date1, date2, toleranceDays = 0) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= toleranceDays;
  }

  /**
   * Compare item details between documents
   * @param {Array} items1 - First items list
   * @param {Array} items2 - Second items list
   * @returns {boolean} Whether items match
   */
  itemDetailsMatch(items1, items2) {
    if (!items1 || !items2) return false;
    if (items1.length !== items2.length) return false;

    // Basic comparison - in real implementation, this would be more sophisticated
    return JSON.stringify(items1.sort()) === JSON.stringify(items2.sort());
  }

  /**
   * Check if amount is a round number
   * @param {number} amount - Amount to check
   * @returns {boolean} Whether it's a round number
   */
  isRoundNumber(amount) {
    if (amount % 1 === 0) return true; // Whole number
    if (amount.toFixed(2).endsWith("00")) return true; // Ends with .00
    return false;
  }

  /**
   * Validate UUID format
   * @param {string} id - UUID string to validate
   * @returns {boolean} Whether UUID is valid
   */
  isValidUUID(id) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  }

  /**
   * Auto-verify eligible matches based on business rules
   * @param {string} matchId - Match ID to verify
   * @param {string} verifiedBy - Member ID of verifier
   * @returns {Object} Verification result
   */
  async autoVerifyMatch(matchId, verifiedBy) {
    const match = await db.query(
      "SELECT * FROM fm_three_way_matches WHERE id = $1",
      [matchId],
    );

    if (match.rows.length === 0) {
      throw new Error("Match not found");
    }

    const matchRecord = match.rows[0];

    // Only auto-verify matches that are clearly matched with high confidence
    if (
      matchRecord.match_status === "matched" &&
      matchRecord.confidence_score >= 98
    ) {
      const updatedMatch = await db.query(
        `UPDATE fm_three_way_matches 
                SET match_status = 'verified', matched_by = $1, matched_at = CURRENT_TIMESTAMP 
                WHERE id = $2 
                RETURNING *`,
        [verifiedBy, matchId],
      );

      // Log verification
      await db.query(
        `INSERT INTO fm_sentinel_logs (
                    log_type, severity, entity_id, entity_type, 
                    action_taken, details
                ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          "match_verified",
          "info",
          matchId,
          "three_way_match",
          "auto_verified",
          {
            verified_by: verifiedBy,
            confidence_score: matchRecord.confidence_score,
            timestamp: new Date().toISOString()
          }
        ],
      );

      return updatedMatch.rows[0];
    }

    throw new Error("Match does not qualify for auto-verification");
  }

  /**
   * Generate fraud report for procurement documents
   * @param {string} startDate - Start date for report
   * @param {string} endDate - End date for report
   * @returns {Object} Fraud report
   */
  async generateFraudReport(startDate, endDate) {
    // Get all three-way matches in the period
    const matches = await db.query(
      `SELECT * FROM fm_three_way_matches 
            WHERE created_at BETWEEN $1 AND $2`,
      [startDate, endDate],
    );

    // Get procurement documents with potential fraud indicators
    const potentialFraudDocs = await db.query(
      `SELECT pd.*, ai.severity_level as fraud_risk 
            FROM fm_procurement_documents pd
            JOIN fm_ai_insights ai ON pd.id = ai.entity_id 
            WHERE ai.insight_type = 'fraud_risk' 
            AND pd.created_at BETWEEN $1 AND $2`,
      [startDate, endDate],
    );

    const report = {
      period: { start: startDate, end: endDate },
      total_matches: matches.rows.length,
      high_risk_matches: matches.rows.filter((m) => m.confidence_score < 70)
        .length,
      potential_fraud_documents: potentialFraudDocs.rows.length,
      fraud_risk_summary: this.summarizeFraudRisks(potentialFraudDocs.rows),
      recommendations: this.generateRecommendations(
        matches.rows,
        potentialFraudDocs.rows,
      )
    };

    // Save report to database
    const savedReport = await db.query(
      `INSERT INTO fm_analytics_reports (
                report_type, report_title, report_data, generated_at
            ) VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [
        "fraud_detection",
        `Procurement Fraud Report - ${startDate} to ${endDate}`,
        report,
        new Date()
      ],
    );

    return { ...report, report_id: savedReport.rows[0].id };
  }

  /**
   * Summarize fraud risks from documents
   * @param {Array} documents - Documents with fraud indicators
   * @returns {Object} Fraud risk summary
   */
  summarizeFraudRisks(documents) {
    const summary = {
      by_severity: {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0
      },
      by_type: {},
      total_risk_score: 0
    };

    documents.forEach((doc) => {
      if (doc.fraud_risk) {
        summary.by_severity[doc.fraud_risk]++;

        // Summarize by document type
        if (summary.by_type[doc.document_type]) {
          summary.by_type[doc.document_type]++;
        } else {
          summary.by_type[doc.document_type] = 1;
        }

        // Add to total risk score (assign values based on severity)
        summary.total_risk_score += this.severityToScore(doc.fraud_risk);
      }
    });

    return summary;
  }

  /**
   * Convert severity to numeric score
   * @param {string} severity - Severity level
   * @returns {number} Numeric score
   */
  severityToScore(severity) {
    switch (severity) {
      case "low":
        return 1;
      case "medium":
        return 3;
      case "high":
        return 7;
      case "critical":
        return 10;
      default:
        return 0;
    }
  }

  /**
   * Generate recommendations based on matches and fraud data
   * @param {Array} matches - Three-way matches
   * @param {Array} fraudDocs - Documents with fraud indicators
   * @returns {Array} Recommendations
   */
  generateRecommendations(matches, fraudDocs) {
    const recommendations = [];

    if (fraudDocs.length > 0) {
      recommendations.push({
        priority: "high",
        title: "Enhanced Verification Required",
        description: `${fraudDocs.length} documents flagged with potential fraud risks. Implement additional verification procedures.`,
        action:
          "Review flagged documents manually and implement additional controls"
      });
    }

    const lowConfidenceMatches = matches.filter((m) => m.confidence_score < 70);
    if (lowConfidenceMatches.length > 0) {
      recommendations.push({
        priority: "medium",
        title: "Low Confidence Matches Detected",
        description: `${lowConfidenceMatches.length} matches have low confidence scores (<70%). These require manual review.`,
        action: "Manual verification of all low confidence matches"
      });
    }

    if (matches.length > 0) {
      const avgConfidence =
        matches.reduce((sum, m) => sum + m.confidence_score, 0) /
        matches.length;
      if (avgConfidence < 85) {
        recommendations.push({
          priority: "medium",
          title: "Overall Matching Quality Concerns",
          description: `Average match confidence is ${avgConfidence.toFixed(2)}%, which is below optimal threshold.`,
          action: "Review matching algorithms and business rules"
        });
      }
    }

    return recommendations;
  }
}

module.exports = new ThreeWayMatchingService();
