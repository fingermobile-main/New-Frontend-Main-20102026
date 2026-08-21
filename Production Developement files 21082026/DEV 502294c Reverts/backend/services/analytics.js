// Analytics Dashboard and Reporting Service for FingerMobile P2P Matching System

const db = require("../db");
const logger = require("../utils/logger"); // Add logger import

class AnalyticsService {
  constructor() {
    this.REPORT_TEMPLATES = {
      MATCHING_EFFICIENCY: {
        title: "Matching Efficiency Report",
        description: "Analysis of P2P matching performance and effectiveness",
        metrics: [
          "total_matches_created",
          "match_acceptance_rate",
          "average_match_score",
          "match_completion_rate"
        ]
      },
      FRAUD_DETECTION: {
        title: "Fraud Detection Report",
        description: "Analysis of fraud patterns and detection effectiveness",
        metrics: [
          "total_fraud_indicators",
          "fraud_cases_flagged",
          "false_positive_rate",
          "risk_score_distribution"
        ]
      },
      SPENDING_PATTERNS: {
        title: "Spending Patterns Report",
        description: "Analysis of procurement and financial spending patterns",
        metrics: [
          "total_spend",
          "average_transaction_value",
          "spending_trends",
          "category_wise_spend"
        ]
      },
      SUPPLIER_PERFORMANCE: {
        title: "Supplier Performance Report",
        description: "Analysis of supplier performance and reliability",
        metrics: [
          "on_time_delivery_rate",
          "invoice_accuracy",
          "dispute_resolution_time",
          "supplier_risk_score"
        ]
      }
    };
  }

  /**
   * Generate matching efficiency analytics
   * @param {Object} options - Report options
   * @returns {Object} Matching efficiency report
   */
  async generateMatchingEfficiencyReport(options = {}) {
    try {
      const { startDate, endDate, category, memberId } = options;

      // Base query for date range
      let whereClause = "WHERE 1=1";
      const params = [];

      if (startDate) {
        params.push(startDate);
        whereClause += ` AND created_at >= $${params.length}`;
      }

      if (endDate) {
        params.push(endDate);
        whereClause += ` AND created_at <= $${params.length}`;
      }

      if (category) {
        params.push(category);
        whereClause += ` AND match_category = $${params.length}`;
      }

      if (memberId) {
        params.push(memberId);
        whereClause += ` AND (member1_id = $${params.length} OR member2_id = $${params.length})`;
        // Need to increment for the second parameter
        params.push(memberId);
      }

      // Total matches created
      const totalMatchesResult = await db.query(
        `SELECT COUNT(*) as count FROM fm_p2p_matches ${whereClause}`,
        params,
      );
      const totalMatches = parseInt(totalMatchesResult.rows[0].count);

      // Match acceptance rate
      const acceptanceRateResult = await db.query(
        `SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN match_status = 'accepted' THEN 1 END) as accepted
            FROM fm_p2p_matches ${whereClause}`,
        params,
      );
      const acceptanceRate =
        totalMatches > 0
          ? (acceptanceRateResult.rows[0].accepted / totalMatches) * 100
          : 0;

      // Average match score
      const avgScoreResult = await db.query(
        `SELECT AVG(match_score) as avg_score FROM fm_p2p_matches ${whereClause}`,
        params,
      );
      const averageScore = parseFloat(avgScoreResult.rows[0].avg_score) || 0;

      // Match completion rate
      const completionRateResult = await db.query(
        `SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN match_status = 'active' THEN 1 END) as active
            FROM fm_p2p_matches ${whereClause}`,
        params,
      );
      const completionRate =
        totalMatches > 0
          ? (completionRateResult.rows[0].active / totalMatches) * 100
          : 0;

      // Category distribution
      const categoryDistributionResult = await db.query(
        `SELECT match_category, COUNT(*) as count 
            FROM fm_p2p_matches ${whereClause}
            GROUP BY match_category`,
        params,
      );
      const categoryDistribution = categoryDistributionResult.rows;

      // Daily trend
      const dailyTrendResult = await db.query(
        `SELECT 
                DATE(created_at) as date, 
                COUNT(*) as count
            FROM fm_p2p_matches ${whereClause}
            GROUP BY DATE(created_at)
            ORDER BY date`,
        params,
      );
      const dailyTrend = dailyTrendResult.rows;

      const report = {
        report_type: "matching_efficiency",
        title: "Matching Efficiency Report",
        generated_at: new Date().toISOString(),
        period: { start_date: startDate, end_date: endDate },
        summary: {
          total_matches_created: totalMatches,
          match_acceptance_rate: acceptanceRate,
          average_match_score: averageScore,
          match_completion_rate: completionRate
        },
        category_distribution: categoryDistribution,
        daily_trend: dailyTrend,
        insights: this.generateMatchingInsights({
          totalMatches,
          acceptanceRate,
          averageScore,
          completionRate
        })
      };

      // Save the report to database
      const savedReport = await this.saveAnalyticsReport(report);

      return {
        ...report,
        report_id: savedReport.id
      };
    } catch (error) {
      logger.error('Error in generateMatchingEfficiencyReport:', error);
      throw error;
    }
  }

  /**
   * Generate fraud detection analytics
   * @param {Object} options - Report options
   * @returns {Object} Fraud detection report
   */
  async generateFraudDetectionReport(options = {}) {
    try {
      const { startDate, endDate, severity } = options;

      let whereClause = "WHERE 1=1";
      const params = [];

      if (startDate) {
        params.push(startDate);
        whereClause += ` AND created_at >= $${params.length}`;
      }

      if (endDate) {
        params.push(endDate);
        whereClause += ` AND created_at <= $${params.length}`;
      }

      if (severity) {
        params.push(severity);
        whereClause += ` AND severity_level = $${params.length}`;
      }

      // Total fraud indicators
      const totalIndicatorsResult = await db.query(
        `SELECT COUNT(*) as count FROM fm_ai_insights 
            ${whereClause} AND insight_type = 'fraud_risk'`,
        params,
      );
      const totalIndicators = parseInt(totalIndicatorsResult.rows[0].count);

      // Fraud cases flagged
      const flaggedCasesResult = await db.query(
        `SELECT COUNT(*) as count FROM fm_ai_insights 
            ${whereClause} AND insight_type = 'fraud_risk' AND is_flagged = true`,
        params,
      );
      const flaggedCases = parseInt(flaggedCasesResult.rows[0].count);

      // Risk score distribution
      const riskDistributionResult = await db.query(
        `SELECT 
                severity_level, 
                COUNT(*) as count
            FROM fm_ai_insights 
            ${whereClause} AND insight_type = 'fraud_risk'
            GROUP BY severity_level`,
        params,
      );
      const riskDistribution = riskDistributionResult.rows;

      // Entity type distribution
      const entityTypeResult = await db.query(
        `SELECT 
                entity_type, 
                COUNT(*) as count
            FROM fm_ai_insights 
            ${whereClause} AND insight_type = 'fraud_risk'
            GROUP BY entity_type`,
        params,
      );
      const entityTypeDistribution = entityTypeResult.rows;

      // Daily fraud trend
      const dailyTrendResult = await db.query(
        `SELECT 
                DATE(created_at) as date, 
                COUNT(*) as count
            FROM fm_ai_insights 
            ${whereClause} AND insight_type = 'fraud_risk'
            GROUP BY DATE(created_at)
            ORDER BY date`,
        params,
      );
      const dailyTrend = dailyTrendResult.rows;

      // Top fraud indicators
      const topIndicatorsResult = await db.query(
        `
            SELECT 
                insights_data->'indicators'->0->>'type' as indicator_type,
                COUNT(*) as count
            FROM fm_ai_insights 
            ${whereClause} AND insight_type = 'fraud_risk'
            AND insights_data->'indicators' IS NOT NULL
            GROUP BY insights_data->'indicators'->0->>'type'
            ORDER BY count DESC
            LIMIT 10
        `,
        params,
      );
      const topFraudIndicators = topIndicatorsResult.rows;

      const report = {
        report_type: "fraud_detection",
        title: "Fraud Detection Report",
        generated_at: new Date().toISOString(),
        period: { start_date: startDate, end_date: endDate },
        summary: {
          total_fraud_indicators: totalIndicators,
          fraud_cases_flagged: flaggedCases,
          false_positive_rate: this.calculateFalsePositiveRate(
            totalIndicators,
            flaggedCases,
          ),
          total_investigated: await this.getInvestigatedCount(startDate, endDate)
        },
        risk_distribution: riskDistribution,
        entity_type_distribution: entityTypeDistribution,
        daily_trend: dailyTrend,
        top_fraud_indicators: topFraudIndicators,
        insights: this.generateFraudInsights({
          totalIndicators,
          flaggedCases,
          riskDistribution
        })
      };

      // Save the report to database
      const savedReport = await this.saveAnalyticsReport(report);

      return {
        ...report,
        report_id: savedReport.id
      };
    } catch (error) {
      logger.error('Error in generateFraudDetectionReport:', error);
      throw error;
    }
  }

  /**
   * Generate spending patterns report
   * @param {Object} options - Report options
   * @returns {Object} Spending patterns report
   */
  async generateSpendingPatternsReport(options = {}) {
    try {
      const { startDate, endDate, category, supplierId } = options;

      let whereClause = "WHERE 1=1";
      const params = [];

      if (startDate) {
        params.push(startDate);
        whereClause += ` AND created_at >= $${params.length}`;
      }

      if (endDate) {
        params.push(endDate);
        whereClause += ` AND created_at <= $${params.length}`;
      }

      if (category) {
        params.push(category);
        whereClause += ` AND document_type = $${params.length}`;
      }

      if (supplierId) {
        params.push(supplierId);
        whereClause += ` AND entity_id = $${params.length}`;
      }

      // Total spend
      const totalSpendResult = await db.query(
        `SELECT SUM(amount) as total FROM fm_procurement_documents ${whereClause}`,
        params,
      );
      const totalSpend = parseFloat(totalSpendResult.rows[0].total) || 0;

      // Average transaction value
      const avgValueResult = await db.query(
        `SELECT AVG(amount) as avg_amount FROM fm_procurement_documents ${whereClause}`,
        params,
      );
      const averageTransactionValue =
        parseFloat(avgValueResult.rows[0].avg_amount) || 0;

      // Spending by category
      const categorySpendResult = await db.query(
        `SELECT 
                document_type as category, 
                SUM(amount) as total_spend,
                COUNT(*) as transaction_count,
                AVG(amount) as avg_amount
            FROM fm_procurement_documents ${whereClause}
            GROUP BY document_type`,
        params,
      );
      const categorySpend = categorySpendResult.rows;

      // Monthly spending trend
      const monthlyTrendResult = await db.query(
        `SELECT 
                DATE_TRUNC('month', created_at) as month,
                SUM(amount) as total_spend,
                COUNT(*) as transaction_count
            FROM fm_procurement_documents ${whereClause}
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY month`,
        params,
      );
      const monthlyTrend = monthlyTrendResult.rows;

      // Top suppliers
      const topSuppliersResult = await db.query(
        `
            SELECT 
                entity_id,
                SUM(amount) as total_spend,
                COUNT(*) as transaction_count
            FROM fm_procurement_documents ${whereClause}
            GROUP BY entity_id
            ORDER BY total_spend DESC
            LIMIT 10
        `,
        params,
      );
      const topSuppliers = topSuppliersResult.rows;

      // Spending by currency
      const currencyDistributionResult = await db.query(
        `SELECT 
                currency,
                SUM(amount) as total_amount,
                COUNT(*) as transaction_count
            FROM fm_procurement_documents ${whereClause}
            GROUP BY currency`,
        params,
      );
      const currencyDistribution = currencyDistributionResult.rows;

      const report = {
        report_type: "spending_patterns",
        title: "Spending Patterns Report",
        generated_at: new Date().toISOString(),
        period: { start_date: startDate, end_date: endDate },
        summary: {
          total_spend: totalSpend,
          average_transaction_value: averageTransactionValue,
          transaction_count: await this.getTransactionCount(startDate, endDate),
          highest_spending_category: categorySpend[0]?.category || "N/A"
        },
        category_breakdown: categorySpend,
        monthly_trend: monthlyTrend,
        top_suppliers: topSuppliers,
        currency_distribution: currencyDistribution,
        insights: this.generateSpendingInsights({
          totalSpend,
          averageTransactionValue,
          categorySpend,
          monthlyTrend
        })
      };

      // Save the report to database
      const savedReport = await this.saveAnalyticsReport(report);

      return {
        ...report,
        report_id: savedReport.id
      };
    } catch (error) {
      logger.error('Error in generateSpendingPatternsReport:', error);
      throw error;
    }
  }

  /**
   * Generate supplier performance report
   * @param {Object} options - Report options
   * @returns {Object} Supplier performance report
   */
  async generateSupplierPerformanceReport(options = {}) {
    try {
      const { startDate, endDate, supplierId } = options;

      let whereClause = "WHERE 1=1";
      const params = [];

      if (startDate) {
        params.push(startDate);
        whereClause += ` AND pd.created_at >= $${params.length}`;
      }

      if (endDate) {
        params.push(endDate);
        whereClause += ` AND pd.created_at <= $${params.length}`;
      }

      if (supplierId) {
        params.push(supplierId);
        whereClause += ` AND pd.entity_id = $${params.length}`;
      }

      // Get supplier data with document counts
      const supplierReportResult = await db.query(
        `
            SELECT 
                pd.entity_id as supplier_id,
                COUNT(*) as total_documents,
                COUNT(CASE WHEN pd.status = 'verified' THEN 1 END) as verified_documents,
                COUNT(CASE WHEN pd.status = 'completed' THEN 1 END) as completed_documents,
                AVG(pd.amount) as avg_transaction_value,
                COUNT(DISTINCT pd.document_type) as document_types_used
            FROM fm_procurement_documents pd
            ${whereClause}
            GROUP BY pd.entity_id
        `,
        params,
      );

      const suppliers = supplierReportResult.rows;

      // Get fraud indicators for each supplier
      for (const supplier of suppliers) {
        const fraudResult = await db.query(
          `SELECT COUNT(*) as fraud_count FROM fm_ai_insights 
                WHERE entity_id = $1 AND insight_type = 'fraud_risk'`,
          [supplier.supplier_id],
        );
        supplier.fraud_indicators = parseInt(fraudResult.rows[0].fraud_count);

        // Calculate risk score based on fraud indicators and verified documents
        const verificationRate =
          supplier.total_documents > 0
            ? (supplier.verified_documents / supplier.total_documents) * 100
            : 0;

        supplier.risk_score =
          supplier.fraud_indicators > 0
            ? Math.min(
                100,
                supplier.fraud_indicators * 20 + (100 - verificationRate),
              )
            : Math.max(0, 100 - verificationRate);
      }

      // Get three-way match statistics for suppliers
      const matchStatsResult = await db.query(
        `
            SELECT 
                pd.entity_id as supplier_id,
                COUNT(twm.id) as total_matches,
                COUNT(CASE WHEN twm.match_status = 'matched' THEN 1 END) as successful_matches,
                COUNT(CASE WHEN twm.match_status = 'mismatched' THEN 1 END) as failed_matches
            FROM fm_procurement_documents pd
            LEFT JOIN fm_three_way_matches twm ON pd.id = twm.po_id
            ${whereClause}
            GROUP BY pd.entity_id
        `,
        params,
      );

      const matchStats = matchStatsResult.rows;

      // Add match statistics to suppliers
      suppliers.forEach((supplier) => {
        const matchStat = matchStats.find(
          (ms) => ms.supplier_id === supplier.supplier_id,
        );
        if (matchStat) {
          supplier.total_matches = matchStat.total_matches;
          supplier.successful_matches = matchStat.successful_matches;
          supplier.failed_matches = matchStat.failed_matches;
          supplier.match_success_rate =
            matchStat.total_matches > 0
              ? (matchStat.successful_matches / matchStat.total_matches) * 100
              : 0;
        } else {
          supplier.total_matches = 0;
          supplier.successful_matches = 0;
          supplier.failed_matches = 0;
          supplier.match_success_rate = 0;
        }
      });

      const report = {
        report_type: "supplier_performance",
        title: "Supplier Performance Report",
        generated_at: new Date().toISOString(),
        period: { start_date: startDate, end_date: endDate },
        summary: {
          total_suppliers: suppliers.length,
          total_documents_processed: suppliers.reduce(
            (sum, s) => sum + s.total_documents,
            0,
          ),
          average_verification_rate:
            suppliers.length > 0
              ? suppliers.reduce(
                  (sum, s) =>
                    sum + (s.verified_documents / s.total_documents) * 100,
                  0,
                ) / suppliers.length
              : 0
        },
        suppliers: suppliers.map((supplier) => ({
          ...supplier,
          performance_rating: this.calculatePerformanceRating(supplier)
        })),
        insights: this.generateSupplierInsights(suppliers)
      };

      // Save the report to database
      const savedReport = await this.saveAnalyticsReport(report);

      return {
        ...report,
        report_id: savedReport.id
      };
    } catch (error) {
      logger.error('Error in generateSupplierPerformanceReport:', error);
      throw error;
    }
  }

  /**
   * Generate weekly supply/demand policy report
   * @param {Object} data - Policy data
   * @returns {Object} Generated policy
   */
  async generateWeeklySupplyDemandPolicy(data) {
    try {
      const {
        policy_type,
        department,
        period_start,
        period_end,
        demand_forecast,
        supply_analysis,
        inventory_levels,
        recommendations
      } = data;

      // Generate the policy content in markdown format
      const policyContent = `# Weekly ${policy_type.replace("_", " ")} Policy
## Period: ${period_start} to ${period_end}

### Demand Forecast
${demand_forecast ? `- ${demand_forecast}` : "No forecast data available"}

### Supply Analysis
${supply_analysis ? `- ${supply_analysis}` : "No analysis available"}

### Inventory Levels
${inventory_levels ? `- Current levels: ${inventory_levels}` : "No inventory data"}

### Recommendations
${recommendations ? recommendations.map((rec) => `- ${rec}`).join("\n") : "No recommendations"}

### Actions Required
- [ ] Review and approve policy
- [ ] Implement recommended changes
- [ ] Monitor effectiveness

### Generated: ${new Date().toISOString()}
`;

      const policy = await db.query(
        `INSERT INTO fm_supply_demand_policies (
                policy_type, policy_title, policy_content, 
                policy_format, department, generated_at
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
        [
          policy_type,
          `Weekly ${policy_type.replace("_", " ")} Policy - ${period_start} to ${period_end}`,
          policyContent,
          "markdown",
          department,
          new Date()
        ],
      );

      return policy.rows[0];
    } catch (error) {
      logger.error('Error in generateWeeklySupplyDemandPolicy:', error);
      throw error;
    }
  }

  /**
   * Calculate false positive rate
   * @param {number} totalIndicators - Total fraud indicators
   * @param {number} flaggedCases - Flagged fraud cases
   * @returns {number} False positive rate
   */
  calculateFalsePositiveRate(totalIndicators, flaggedCases) {
    // In a real system, you'd need to track manually reviewed cases
    // This is a simplified calculation
    return totalIndicators > 0
      ? ((totalIndicators - flaggedCases) / totalIndicators) * 100
      : 0;
  }

  /**
   * Get number of investigated cases
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {number} Investigated cases count
   */
  async getInvestigatedCount(startDate, endDate) {
    try {
      const params = [];
      let whereClause = "WHERE 1=1";

      if (startDate) {
        params.push(startDate);
        whereClause += ` AND created_at >= $${params.length}`;
      }
      if (endDate) {
        params.push(endDate);
        whereClause += ` AND created_at <= $${params.length}`;
      }

      const result = await db.query(
        `SELECT COUNT(*) as count FROM fm_ai_insights 
            ${whereClause} AND insight_type = 'fraud_risk' AND resolved_by IS NOT NULL`,
        params,
      );

      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Error in getInvestigatedCount:', error);
      throw error;
    }
  }

  /**
   * Get transaction count
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {number} Transaction count
   */
  async getTransactionCount(startDate, endDate) {
    try {
      const params = [];
      let whereClause = "WHERE 1=1";

      if (startDate) {
        params.push(startDate);
        whereClause += ` AND created_at >= $${params.length}`;
      }
      if (endDate) {
        params.push(endDate);
        whereClause += ` AND created_at <= $${params.length}`;
      }

      const result = await db.query(
        `SELECT COUNT(*) as count FROM fm_procurement_documents ${whereClause}`,
        params,
      );

      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Error in getTransactionCount:', error);
      throw error;
    }
  }

  /**
   * Calculate supplier performance rating
   * @param {Object} supplier - Supplier data
   * @returns {string} Performance rating
   */
  calculatePerformanceRating(supplier) {
    const score = supplier.risk_score;

    if (score < 20) return "Excellent";
    if (score < 40) return "Good";
    if (score < 60) return "Fair";
    if (score < 80) return "Poor";
    return "Critical";
  }

  /**
   * Generate matching insights
   * @param {Object} data - Matching data
   * @returns {Array} Insights
   */
  generateMatchingInsights(data) {
    const insights = [];

    if (data.acceptanceRate < 50) {
      insights.push({
        type: "recommendation",
        priority: "high",
        message:
          "Low match acceptance rate detected. Consider adjusting matching algorithms."
      });
    }

    if (data.averageScore < 70) {
      insights.push({
        type: "recommendation",
        priority: "medium",
        message:
          "Average match scores are below optimal threshold. Review matching criteria."
      });
    }

    if (data.completionRate < 30) {
      insights.push({
        type: "warning",
        priority: "high",
        message:
          "Low match completion rate indicates potential issues with follow-through."
      });
    }

    return insights;
  }

  /**
   * Generate fraud insights
   * @param {Object} data - Fraud data
   * @returns {Array} Insights
   */
  generateFraudInsights(data) {
    const insights = [];

    if (data.totalIndicators === 0) {
      insights.push({
        type: "observation",
        priority: "low",
        message: "No fraud indicators detected in the selected period."
      });
    } else if (data.totalIndicators > 100) {
      insights.push({
        type: "alert",
        priority: "high",
        message:
          "High volume of fraud indicators detected. Review fraud detection parameters."
      });
    }

    if (data.flaggedCases === 0) {
      insights.push({
        type: "warning",
        priority: "medium",
        message: "No flagged fraud cases. Review fraud detection sensitivity."
      });
    }

    return insights;
  }

  /**
   * Generate spending insights
   * @param {Object} data - Spending data
   * @returns {Array} Insights
   */
  generateSpendingInsights(data) {
    const insights = [];

    if (data.totalSpend > 1000000) {
      insights.push({
        type: "observation",
        priority: "medium",
        message:
          "High total spending detected. Consider reviewing budget allocations."
      });
    }

    if (data.averageTransactionValue > 10000) {
      insights.push({
        type: "warning",
        priority: "high",
        message:
          "High average transaction value detected. Enhanced verification recommended."
      });
    }

    if (data.monthlyTrend.length > 1) {
      const currentMonth = data.monthlyTrend[data.monthlyTrend.length - 1];
      const previousMonth = data.monthlyTrend[data.monthlyTrend.length - 2];

      if (currentMonth && previousMonth) {
        const change =
          ((currentMonth.total_spend - previousMonth.total_spend) /
            previousMonth.total_spend) *
          100;

        if (Math.abs(change) > 20) {
          insights.push({
            type: change > 0 ? "alert" : "observation",
            priority: "high",
            message: `Significant ${change > 0 ? "increase" : "decrease"} in spending (${Math.abs(change).toFixed(2)}%) compared to previous month.`
          });
        }
      }
    }

    return insights;
  }

  /**
   * Generate supplier insights
   * @param {Array} suppliers - Suppliers data
   * @returns {Array} Insights
   */
  generateSupplierInsights(suppliers) {
    const insights = [];

    const criticalSuppliers = suppliers.filter(
      (s) => s.performance_rating === "Critical",
    );
    if (criticalSuppliers.length > 0) {
      insights.push({
        type: "alert",
        priority: "critical",
        message: `${criticalSuppliers.length} supplier(s) rated as critical. Immediate review recommended.`
      });
    }

    const goodSuppliers = suppliers.filter(
      (s) =>
        s.performance_rating === "Excellent" || s.performance_rating === "Good",
    );
    if (goodSuppliers.length > 0) {
      insights.push({
        type: "positive",
        priority: "low",
        message: `${goodSuppliers.length} supplier(s) performing well. Consider preferred partnerships.`
      });
    }

    const avgRisk =
      suppliers.reduce((sum, s) => sum + s.risk_score, 0) / suppliers.length;
    if (avgRisk > 50) {
      insights.push({
        type: "warning",
        priority: "medium",
        message:
          "Average supplier risk is high. Consider diversifying supplier base."
      });
    }

    return insights;
  }

  /**
   * Save analytics report to database
   * @param {Object} report - Report data
   * @returns {Object} Saved report
   */
  async saveAnalyticsReport(report) {
    try {
      const result = await db.query(
        `INSERT INTO fm_analytics_reports (
                report_type, report_title, report_data, generated_at
            ) VALUES ($1, $2, $3, $4)
            RETURNING *`,
        [report.report_type, report.title, report, new Date()],
      );

      return result.rows[0];
    } catch (error) {
      logger.error('Error in saveAnalyticsReport:', error);
      throw error;
    }
  }

  /**
   * Export report in specified format
   * @param {string} reportId - Report ID
   * @param {string} format - Export format ('csv', 'pdf', 'json', 'markdown')
   * @returns {string} Exported report content
   */
  async exportReport(reportId, format = "json") {
    try {
      const reportResult = await db.query(
        "SELECT * FROM fm_analytics_reports WHERE id = $1",
        [reportId],
      );

      if (reportResult.rows.length === 0) {
        throw new Error("Report not found");
      }

      const report = reportResult.rows[0];

      switch (format.toLowerCase()) {
        case "json":
          return JSON.stringify(report.report_data, null, 2);

        case "csv":
          return this.convertToCSV(report.report_data);

        case "pdf":
          return this.generatePDFReport(report.report_data);

        case "markdown":
          return this.convertToMarkdown(report.report_data);

        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      logger.error('Error in exportReport:', error);
      throw error;
    }
  }

  /**
   * Convert report data to CSV format
   * @param {Object} reportData - Report data
   * @returns {string} CSV content
   */
  convertToCSV(reportData) {
    // Simplified CSV conversion - in a real app you'd need more sophisticated logic
    let csv = "Field,Value\n";

    const flattenObject = (obj, prefix = "") => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (value && typeof value === "object" && !Array.isArray(value)) {
          flattenObject(value, fullKey);
        } else if (Array.isArray(value)) {
          csv += `"${fullKey}","${JSON.stringify(value)}"\n`;
        } else {
          csv += `"${fullKey}","${value}"\n`;
        }
      }
    };

    flattenObject(reportData);

    return csv;
  }

  /**
   * Convert report data to Markdown format
   * @param {Object} reportData - Report data
   * @returns {string} Markdown content
   */
  convertToMarkdown(reportData) {
    let markdown = `# ${reportData.title}\n\n`;
    markdown += `Generated: ${reportData.generated_at}\n\n`;

    if (reportData.period) {
      markdown += `## Period\n`;
      markdown += `- Start: ${reportData.period.start_date || "N/A"}\n`;
      markdown += `- End: ${reportData.period.end_date || "N/A"}\n\n`;
    }

    if (reportData.summary) {
      markdown += `## Summary\n`;
      for (const [key, value] of Object.entries(reportData.summary)) {
        markdown += `- ${this.toTitleCase(key)}: ${typeof value === "number" ? value.toFixed(2) : value}\n`;
      }
      markdown += "\n";
    }

    if (reportData.daily_trend) {
      markdown += `## Daily Trend\n`;
      markdown += "| Date | Count |\n";
      markdown += "|------|-------|\n";
      reportData.daily_trend.slice(0, 10).forEach((item) => {
        markdown += `| ${item.date || item.day} | ${item.count || item.total_spend || 0} |\n`;
      });
      markdown += "\n";
    }

    if (reportData.insights) {
      markdown += `## Insights\n`;
      reportData.insights.forEach((insight) => {
        markdown += `- **${insight.priority.toUpperCase()}**: ${insight.message}\n`;
      });
      markdown += "\n";
    }

    return markdown;
  }

  /**
   * Generate PDF report (placeholder - would use a PDF library in real implementation)
   * @param {Object} reportData - Report data
   * @returns {string} PDF content as placeholder
   */
  generatePDFReport(reportData) {
    // In a real implementation, you would use a PDF generation library like pdf-lib or Puppeteer
    // This is a placeholder that returns a description of what would be done
    return `PDF report for: ${reportData.title}\nReport Type: ${reportData.report_type}\nGenerated: ${reportData.generated_at}\n\nThis would be a formatted PDF report in a real implementation using a PDF generation library.`;
  }

  /**
   * Convert string to title case
   * @param {string} str - String to convert
   * @returns {string} Title case string
   */
  toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    );
  }

  /**
   * Get dashboard metrics for the main analytics dashboard
   * @returns {Object} Dashboard metrics
   */
  async getDashboardMetrics() {
    try {
      // Get recent activity
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Total matches in last week
      const recentMatchesResult = await db.query(
        "SELECT COUNT(*) as count FROM fm_p2p_matches WHERE created_at >= $1",
        [weekAgo],
      );
      const recentMatches = parseInt(recentMatchesResult.rows[0].count);

      // Total fraud indicators in last week
      const recentFraudResult = await db.query(
        `SELECT COUNT(*) as count FROM fm_ai_insights 
            WHERE created_at >= $1 AND insight_type = 'fraud_risk'`,
        [weekAgo],
      );
      const recentFraudIndicators = parseInt(recentFraudResult.rows[0].count);

      // Total procurement documents in last week
      const recentDocumentsResult = await db.query(
        "SELECT COUNT(*) as count FROM fm_procurement_documents WHERE created_at >= $1",
        [weekAgo],
      );
      const recentDocuments = parseInt(recentDocumentsResult.rows[0].count);

      // Total spending in last week
      const recentSpendingResult = await db.query(
        "SELECT SUM(amount) as total FROM fm_procurement_documents WHERE created_at >= $1",
        [weekAgo],
      );
      const recentSpending = parseFloat(recentSpendingResult.rows[0].total) || 0;

      // Active members in last week
      const activemembersResult = await db.query(
        `
            SELECT COUNT(DISTINCT entity_id) as count FROM fm_sentinel_logs 
            WHERE timestamp >= $1 AND entity_type = 'member'
        `,
        [weekAgo],
      );
      const activemembers = parseInt(activemembersResult.rows[0].count);

      // Average match score
      const avgMatchScoreResult = await db.query(
        "SELECT AVG(match_score) as avg_score FROM fm_p2p_matches WHERE created_at >= $1",
        [weekAgo],
      );
      const avgMatchScore =
        parseFloat(avgMatchScoreResult.rows[0].avg_score) || 0;

      // Match acceptance rate
      const acceptanceRateResult = await db.query(
        `
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN match_status = 'accepted' THEN 1 END) as accepted
            FROM fm_p2p_matches WHERE created_at >= $1
        `,
        [weekAgo],
      );
      const acceptanceRate =
        acceptanceRateResult.rows[0].total > 0
          ? (acceptanceRateResult.rows[0].accepted /
              acceptanceRateResult.rows[0].total) *
            100
          : 0;

      return {
        period: "Last 7 days",
        metrics: {
          total_matches_created: recentMatches,
          total_fraud_indicators: recentFraudIndicators,
          total_documents_processed: recentDocuments,
          total_spending: recentSpending,
          active_members: activemembers,
          average_match_score: avgMatchScore,
          match_acceptance_rate: acceptanceRate,
          pending_verifications: await this.getPendingVerifications()
        },
        trends: {
          matches_trend: await this.getMatchesTrend(),
          spending_trend: await this.getSpendingTrend(),
          fraud_trend: await this.getFraudTrend()
        }
      };
    } catch (error) {
      logger.error('Error in getDashboardMetrics:', error);
      throw error;
    }
  }

  /**
   * Get pending verifications count
   * @returns {number} Pending verifications count
   */
  async getPendingVerifications() {
    try {
      const result = await db.query(
        `SELECT COUNT(*) as count FROM fm_ai_insights 
            WHERE insight_type = 'fraud_risk' AND is_flagged = true AND resolved_by IS NULL`,
      );
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Error in getPendingVerifications:', error);
      throw error;
    }
  }

  /**
   * Get matches trend for dashboard
   * @returns {Array} Matches trend data
   */
  async getMatchesTrend() {
    try {
      const result = await db.query(`
            SELECT 
                DATE_TRUNC('day', created_at) as day,
                COUNT(*) as count
            FROM fm_p2p_matches 
            WHERE created_at >= NOW() - INTERVAL '14 days'
            GROUP BY DATE_TRUNC('day', created_at)
            ORDER BY day
        `);
      return result.rows;
    } catch (error) {
      logger.error('Error in getMatchesTrend:', error);
      throw error;
    }
  }

  /**
   * Get spending trend for dashboard
   * @returns {Array} Spending trend data
   */
  async getSpendingTrend() {
    try {
      const result = await db.query(`
            SELECT 
                DATE_TRUNC('day', created_at) as day,
                SUM(amount) as total
            FROM fm_procurement_documents 
            WHERE created_at >= NOW() - INTERVAL '14 days'
            GROUP BY DATE_TRUNC('day', created_at)
            ORDER BY day
        `);
      return result.rows;
    } catch (error) {
      logger.error('Error in getSpendingTrend:', error);
      throw error;
    }
  }

  /**
   * Get fraud trend for dashboard
   * @returns {Array} Fraud trend data
   */
  async getFraudTrend() {
    try {
      const result = await db.query(`
            SELECT 
                DATE_TRUNC('day', created_at) as day,
                COUNT(*) as count
            FROM fm_ai_insights 
            WHERE insight_type = 'fraud_risk' AND created_at >= NOW() - INTERVAL '14 days'
            GROUP BY DATE_TRUNC('day', created_at)
            ORDER BY day
        `);
      return result.rows;
    } catch (error) {
      logger.error('Error in getFraudTrend:', error);
      throw error;
    }
  }

  /**
   * Get all reports of a specific type
   * @param {string} reportType - Type of report
   * @param {number} limit - Limit results
   * @param {number} offset - Offset results
   * @returns {Array} Reports
   */
  async getReportsByType(reportType, limit = 10, offset = 0) {
    try {
      const result = await db.query(
        `SELECT * FROM fm_analytics_reports 
            WHERE report_type = $1 
            ORDER BY generated_at DESC 
            LIMIT $2 OFFSET $3`,
        [reportType, limit, offset],
      );

      return result.rows;
    } catch (error) {
      logger.error('Error in getReportsByType:', error);
      throw error;
    }
  }
}

module.exports = new AnalyticsService();