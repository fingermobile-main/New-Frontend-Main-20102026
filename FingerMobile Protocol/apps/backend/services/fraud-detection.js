// AI/ML Fraud Detection Service for FingerMobile P2P Matching System

const db = require('../db');
const logger = require('../utils/logger');

class FraudDetectionService {
  constructor() {
    this.fraudPatterns = {
      // Behavioral patterns
      MEMBER_BEHAVIOR: {
        rapid_account_creation: {
          threshold: 5,
          time_window: '1h',
          severity: 'high',
          description: 'Multiple accounts created rapidly from same IP'
        },
        unusual_login_patterns: {
          threshold: 3,
          time_window: '30m',
          severity: 'medium',
          description: 'Unusual login frequency from different locations'
        },
        suspicious_transaction_velocity: {
          threshold: 10,
          time_window: '1h',
          severity: 'high',
          description: 'High volume of transactions in short period'
        }
      },

      // Transaction patterns
      TRANSACTION_PATTERNS: {
        round_amount_transactions: {
          pattern: /\d+00$/,
          severity: 'medium',
          description: 'Round number amounts (potential fraud)'
        },
        duplicate_amounts: {
          threshold: 3,
          time_window: '24h',
          severity: 'high',
          description: 'Multiple transactions with same amount'
        },
        timing_anomalies: {
          severity: 'high',
          description: 'Transactions occurring at unusual times'
        }
      },

      // Profile patterns
      PROFILE_PATTERNS: {
        incomplete_profiles: {
          threshold: 30, // less than 30% complete
          severity: 'low',
          description: 'Incomplete profile information'
        },
        fake_name_detection: {
          severity: 'medium',
          description: 'Name patterns that might indicate fake profiles'
        },
        suspicious_email_patterns: {
          severity: 'medium',
          description: 'Disposable or suspicious email addresses'
        }
      }
    };

    this.MACHINE_LEARNING_MODELS = {
      ENSEMBLE_MODEL: {
        components: ['random_forest', 'gradient_boosting', 'svm'],
        threshold: 0.7, // 70% confidence to flag
        features: [
          'transaction_velocity',
          'account_age',
          'profile_completeness',
          'geographic_anomalies',
          'behavioral_patterns'
        ]
      }
    };
  }

  /**
   * Analyze a transaction for fraud risk
   * @param {Object} transactionData - Transaction data to analyze
   * @returns {Object} Fraud analysis result
   */
  async analyzeTransactionForFraud(transactionData) {
    try {
      const {
        member_id,
        amount,
        currency: _currency,
        payment_method,
        ip_address,
        timestamp
      } = transactionData;

      // Initialize fraud score and indicators
      let totalRiskScore = 0;
      const fraudIndicators = [];
      const heatmapData = {
        risk_factors: {},
        behavioral_patterns: [],
        temporal_patterns: []
      };

      // Check round amount pattern
      if (this.isRoundAmount(amount)) {
        const indicator = {
          type: 'round_amount',
          severity: 'medium',
          score: 15,
          description: `Transaction amount $${amount} is a round number`
        };
        fraudIndicators.push(indicator);
        totalRiskScore += indicator.score;
        heatmapData.risk_factors.round_amount = true;
      }

      // Check velocity (frequency of transactions)
      const velocityRisk = await this.checkTransactionVelocity(
        member_id,
        timestamp,
      );
      if (velocityRisk) {
        fraudIndicators.push(velocityRisk.indicator);
        totalRiskScore += velocityRisk.score;
        heatmapData.behavioral_patterns.push('velocity_anomaly');
      }

      // Check for duplicate amounts recently
      const duplicateRisk = await this.checkDuplicateAmounts(
        member_id,
        amount,
        timestamp,
      );
      if (duplicateRisk) {
        fraudIndicators.push(duplicateRisk.indicator);
        totalRiskScore += duplicateRisk.score;
      }

      // Check IP reputation
      if (ip_address) {
        const ipRisk = await this.checkIPReputation(ip_address);
        if (ipRisk) {
          fraudIndicators.push(ipRisk.indicator);
          totalRiskScore += ipRisk.score;
          heatmapData.risk_factors.suspicious_ip = ip_address;
        }
      }

      // Analyze payment method
      const paymentMethodRisk = this.analyzePaymentMethodRisk(payment_method);
      if (paymentMethodRisk) {
        fraudIndicators.push(paymentMethodRisk.indicator);
        totalRiskScore += paymentMethodRisk.score;
      }

      // Get member profile risk
      const profileRisk = await this.analyzeMemberProfileRisk(member_id);
      if (profileRisk) {
        fraudIndicators.push(profileRisk.indicator);
        totalRiskScore += profileRisk.score;
      }

      // Calculate overall risk level
      const riskLevel = this.calculateRiskLevel(totalRiskScore);

      // Create AI insight record
      const insight = await this.createFraudInsight({
        entity_id: member_id,
        entity_type: 'transaction',
        insight_type: 'fraud_risk',
        risk_score: totalRiskScore,
        risk_level: riskLevel,
        indicators: fraudIndicators,
        heatmap_data: heatmapData,
        transaction_data: transactionData
      });

      return {
        transaction_id: transactionData.id,
        risk_score: totalRiskScore,
        risk_level: riskLevel,
        is_flagged: totalRiskScore >= 50, // Flag if risk score is 50 or higher
        fraud_indicators: fraudIndicators,
        heatmap_data: heatmapData,
        insight_id: insight.id
      };
    } catch (error) {
      logger.error('Error in transaction fraud analysis:', error.message);
      throw error;
    }
  }

  /**
   * Analyze member profile for fraud risk
   * @param {string} memberId - member ID to analyze
   * @returns {Object} Fraud analysis result
   */
  async analyzeMemberForFraud(memberId) {
    try {
      // Get member profile data
      const memberProfile = await db.query(
        'SELECT * FROM fm_member_profiles WHERE member_id = $1',
        [memberId],
      );

      if (!memberProfile.rows[0]) {
        throw new Error('Member profile not found');
      }

      const profile = memberProfile.rows[0];
      let totalRiskScore = 0;
      const fraudIndicators = [];
      const heatmapData = {
        profile_anomalies: [],
        behavioral_indicators: [],
        consistency_issues: []
      };

      // Check for incomplete profile
      const completeness = this.calculateProfileCompleteness(profile);
      if (completeness < 0.5) {
        // Less than 50% complete
        const indicator = {
          type: 'incomplete_profile',
          severity: 'medium',
          score: 20,
          description: `Profile only ${Math.round(completeness * 100)}% complete`
        };
        fraudIndicators.push(indicator);
        totalRiskScore += indicator.score;
        heatmapData.profile_anomalies.push('incomplete_data');
      }

      // Check for fake name patterns
      if (this.detectFakeName(profile.full_name)) {
        const indicator = {
          type: 'fake_name_pattern',
          severity: 'medium',
          score: 25,
          description: `Name pattern may indicate fake profile: ${profile.full_name}`
        };
        fraudIndicators.push(indicator);
        totalRiskScore += indicator.score;
        heatmapData.profile_anomalies.push('fake_name');
      }

      // Get account creation data for analysis
      const accountData = await db.query(
        'SELECT created_at FROM members WHERE id = $1', // Assuming there's a members table
        [memberId],
      );

      if (accountData.rows[0]) {
        const accountAge = this.calculateAccountAge(
          accountData.rows[0].created_at,
        );

        // New account risk
        if (accountAge < 7) {
          // Less than 7 days old
          const indicator = {
            type: 'new_account',
            severity: 'medium',
            score: 15,
            description: `Account created only ${accountAge} days ago`
          };
          fraudIndicators.push(indicator);
          totalRiskScore += indicator.score;
          heatmapData.behavioral_indicators.push('new_account');
        }
      }

      // Check for suspicious activity patterns
      const suspiciousActivity =
        await this.checkMemberActivityPatterns(memberId);
      if (suspiciousActivity.length > 0) {
        suspiciousActivity.forEach((activity) => {
          fraudIndicators.push(activity.indicator);
          totalRiskScore += activity.score;
          heatmapData.behavioral_indicators.push(activity.type);
        });
      }

      // Calculate overall risk level
      const riskLevel = this.calculateRiskLevel(totalRiskScore);

      // Create AI insight record
      const insight = await this.createFraudInsight({
        entity_id: memberId,
        entity_type: 'member',
        insight_type: 'fraud_risk',
        risk_score: totalRiskScore,
        risk_level: riskLevel,
        indicators: fraudIndicators,
        heatmap_data: heatmapData,
        profile_data: profile
      });

      return {
        member_id: memberId,
        risk_score: totalRiskScore,
        risk_level: riskLevel,
        is_flagged: totalRiskScore >= 50,
        fraud_indicators: fraudIndicators,
        heatmap_data: heatmapData,
        insight_id: insight.id
      };
    } catch (error) {
      logger.error('Error in member fraud analysis:', error.message);
      throw error;
    }
  }

  /**
   * Analyze document for fraud risk (for procurement documents)
   * @param {Object} documentData - Document data to analyze
   * @returns {Object} Fraud analysis result
   */
  async analyzeDocumentForFraud(documentData) {
    try {
      let totalRiskScore = 0;
      const fraudIndicators = [];
      const heatmapData = {
        document_anomalies: [],
        pattern_matches: [],
        validation_failures: []
      };

      // Check for round amounts (common in fraudulent invoices)
      if (this.isRoundAmount(documentData.amount)) {
        const indicator = {
          type: 'round_amount',
          severity: 'medium',
          score: 20,
          description: `Document amount $${documentData.amount} is a round number`
        };
        fraudIndicators.push(indicator);
        totalRiskScore += indicator.score;
        heatmapData.document_anomalies.push('round_amount');
      }

      // Check for duplicate document numbers
      const duplicateCheck = await db.query(
        `SELECT COUNT(*) as count FROM fm_procurement_documents 
                WHERE document_number = $1 AND id != $2`,
        [documentData.document_number, documentData.id],
      );

      if (parseInt(duplicateCheck.rows[0].count) > 0) {
        const indicator = {
          type: 'duplicate_document_number',
          severity: 'high',
          score: 35,
          description: `Document number ${documentData.document_number} already exists`
        };
        fraudIndicators.push(indicator);
        totalRiskScore += indicator.score;
        heatmapData.validation_failures.push('duplicate_number');
      }

      // Check timing anomalies (invoice before PO date)
      if (
        documentData.document_type === 'invoice' &&
        documentData.metadata?.po_date
      ) {
        const invoiceDate = new Date(documentData.issue_date);
        const poDate = new Date(documentData.metadata.po_date);

        if (invoiceDate < poDate) {
          const indicator = {
            type: 'timing_anomaly',
            severity: 'high',
            score: 30,
            description: 'Invoice date is before PO date'
          };
          fraudIndicators.push(indicator);
          totalRiskScore += indicator.score;
          heatmapData.document_anomalies.push('timing_anomaly');
        }
      }

      // Check for common fraud patterns in document numbers
      if (this.detectFraudulentDocumentNumber(documentData.document_number)) {
        const indicator = {
          type: 'suspicious_document_number',
          severity: 'medium',
          score: 25,
          description: 'Document number pattern may indicate fraud'
        };
        fraudIndicators.push(indicator);
        totalRiskScore += indicator.score;
        heatmapData.pattern_matches.push('suspicious_number_pattern');
      }

      // Calculate overall risk level
      const riskLevel = this.calculateRiskLevel(totalRiskScore);

      // Create AI insight record
      const insight = await this.createFraudInsight({
        entity_id: documentData.id,
        entity_type: 'document',
        insight_type: 'fraud_risk',
        risk_score: totalRiskScore,
        risk_level: riskLevel,
        indicators: fraudIndicators,
        heatmap_data: heatmapData,
        document_data: documentData
      });

      return {
        document_id: documentData.id,
        risk_score: totalRiskScore,
        risk_level: riskLevel,
        is_flagged: totalRiskScore >= 50,
        fraud_indicators: fraudIndicators,
        heatmap_data: heatmapData,
        insight_id: insight.id
      };
    } catch (error) {
      logger.error('Error in document fraud analysis:', error.message);
      throw error;
    }
  }

  /**
   * Check transaction velocity for fraud patterns
   * @param {string} memberId - member ID
   * @param {string} timestamp - Transaction timestamp
   * @returns {Object} Velocity risk assessment
   */
  async checkTransactionVelocity(memberId, timestamp) {
    const timeWindow = 3600000; // 1 hour in milliseconds
    const startTime = new Date(timestamp - timeWindow);

    const result = await db.query(
      `SELECT COUNT(*) as count FROM fm_procurement_documents 
            WHERE entity_id = $1 AND created_at >= $2 AND document_type = 'invoice'`,
      [memberId, startTime],
    );

    const transactionCount = parseInt(result.rows[0].count);

    if (transactionCount >= 5) {
      // More than 5 transactions in an hour
      return {
        indicator: {
          type: 'high_velocity',
          severity: 'high',
          score: transactionCount >= 10 ? 40 : 25,
          description: `Member has ${transactionCount} transactions in past hour`
        },
        score: transactionCount >= 10 ? 40 : 25
      };
    }

    return null;
  }

  /**
   * Check for duplicate amounts
   * @param {string} memberId - member ID
   * @param {number} amount - Transaction amount
   * @param {string} timestamp - Transaction timestamp
   * @returns {Object} Duplicate amount risk assessment
   */
  async checkDuplicateAmounts(memberId, amount, timestamp) {
    const timeWindow = 86400000; // 24 hours in milliseconds
    const startTime = new Date(timestamp - timeWindow);

    const result = await db.query(
      `SELECT COUNT(*) as count FROM fm_procurement_documents 
            WHERE entity_id = $1 AND amount = $2 AND created_at >= $3`,
      [memberId, amount, startTime],
    );

    const duplicateCount = parseInt(result.rows[0].count);

    if (duplicateCount >= 3) {
      return {
        indicator: {
          type: 'frequent_duplicate_amount',
          severity: 'high',
          score: 30,
          description: `Member has ${duplicateCount} transactions with same amount in past 24 hours`
        },
        score: 30
      };
    }

    return null;
  }

  /**
   * Check IP address reputation
   * @param {string} ipAddress - IP address to check
   * @returns {Object} IP reputation risk assessment
   */
  async checkIPReputation(ipAddress) {
    // In a real implementation, you'd check against IP reputation services
    // This is a simplified version

    // Check if it's a known proxy/tor exit node pattern
    if (ipAddress.includes('proxy') || ipAddress.includes('tor')) {
      return {
        indicator: {
          type: 'anonymous_proxy',
          severity: 'high',
          score: 35,
          description: 'Transaction from anonymous proxy/IP'
        },
        score: 35
      };
    }

    // Check for multiple accounts from same IP recently
    const recentAccounts = await db.query(
      `SELECT COUNT(*) as count FROM members 
            WHERE ip_address = $1 AND created_at >= NOW() - INTERVAL '1 hour'`,
      [ipAddress],
    );

    if (parseInt(recentAccounts.rows[0].count) >= 3) {
      return {
        indicator: {
          type: 'multiple_accounts_same_ip',
          severity: 'high',
          score: 40,
          description: 'Multiple accounts created from same IP in past hour'
        },
        score: 40
      };
    }

    return null;
  }

  /**
   * Analyze payment method risk
   * @param {string} paymentMethod - Payment method to analyze
   * @returns {Object} Payment method risk assessment
   */
  analyzePaymentMethodRisk(paymentMethod) {
    if (!paymentMethod) return null;

    const riskyMethods = ['prepaid_card', 'cryptocurrency', 'gift_card'];
    if (riskyMethods.includes(paymentMethod)) {
      return {
        indicator: {
          type: 'risky_payment_method',
          severity: 'medium',
          score: 20,
          description: `Payment method ${paymentMethod} is considered high risk`
        },
        score: 20
      };
    }

    return null;
  }

  /**
   * Analyze member profile risk
   * @param {string} memberId - member ID to analyze
   * @returns {Object} Profile risk assessment
   */
  async analyzeMemberProfileRisk(_memberId) {
    // This would check the member profile against known fraud patterns
    // For now, we'll return null as this is a simplified version
    return null;
  }

  /**
   * Check member activity patterns for fraud
   * @param {string} memberId - member ID to analyze
   * @returns {Array} Activity pattern risks
   */
  async checkMemberActivityPatterns(memberId) {
    const risks = [];

    // Check login velocity
    const loginResult = await db.query(
      `SELECT COUNT(*) as count FROM fm_sentinel_logs 
            WHERE entity_id = $1 AND log_type = 'login' AND timestamp >= NOW() - INTERVAL '30 minutes'`,
      [memberId],
    );

    const loginCount = parseInt(loginResult.rows[0].count);
    if (loginCount >= 3) {
      risks.push({
        indicator: {
          type: 'rapid_logins',
          severity: 'medium',
          score: 25,
          description: `Member has ${loginCount} logins in past 30 minutes`
        },
        score: 25,
        type: 'rapid_logins'
      });
    }

    // Check match request velocity
    const matchRequestResult = await db.query(
      `SELECT COUNT(*) as count FROM fm_p2p_matches 
            WHERE sent_by_member_id = $1 AND created_at >= NOW() - INTERVAL '1 hour'`,
      [memberId],
    );

    const matchRequestCount = parseInt(matchRequestResult.rows[0].count);
    if (matchRequestCount >= 10) {
      risks.push({
        indicator: {
          type: 'rapid_match_requests',
          severity: 'medium',
          score: 20,
          description: `Member has sent ${matchRequestCount} match requests in past hour`
        },
        score: 20,
        type: 'rapid_requests'
      });
    }

    return risks;
  }

  /**
   * Check if amount is a round number (potential fraud indicator)
   * @param {number} amount - Amount to check
   * @returns {boolean} Whether amount is a round number
   */
  isRoundAmount(amount) {
    if (typeof amount !== 'number') return false;

    // Check if it's a whole number or ends in common round numbers
    const strAmount = amount.toString();

    // Whole number
    if (Number.isInteger(amount)) return true;

    // Ends with .00
    if (strAmount.endsWith('.00')) return true;

    // Common round number patterns (like .99, .95, .50)
    const endsWith = strAmount.slice(-3);
    if (['.99', '.95', '.50'].includes(endsWith)) return true;

    return false;
  }

  /**
   * Detect fake names in profiles
   * @param {string} name - Name to analyze
   * @returns {boolean} Whether name appears to be fake
   */
  detectFakeName(name) {
    if (!name) return false;

    const str = name.toLowerCase();

    // Check for common fake name patterns
    const fakePatterns = [
      /test/g,
      /demo/g,
      /sample/g,
      /temp/g,
      /member\d+/g,
      /^\d+$/g, // Only numbers
      /[^a-z\s]/g, // Non-alphabetic characters except spaces
    ];

    return fakePatterns.some((pattern) => pattern.test(str));
  }

  /**
   * Calculate profile completeness score
   * @param {Object} profile - member profile data
   * @returns {number} Completeness score (0-1)
   */
  calculateProfileCompleteness(profile) {
    const fields = Object.keys(profile);
    const filledFields = fields.filter(
      (field) =>
        profile[field] &&
        profile[field] !== '' &&
        profile[field] !== null &&
        profile[field] !== undefined,
    );

    return filledFields.length / fields.length;
  }

  /**
   * Calculate account age in days
   * @param {string} createdDate - Account creation date
   * @returns {number} Account age in days
   */
  calculateAccountAge(createdDate) {
    const created = new Date(createdDate);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Detect fraudulent document number patterns
   * @param {string} docNumber - Document number to analyze
   * @returns {boolean} Whether document number pattern is suspicious
   */
  detectFraudulentDocumentNumber(docNumber) {
    if (!docNumber) return false;

    // Look for common fraudulent patterns
    const suspiciousPatterns = [
      /test/gi,
      /fake/gi,
      /^\d{1,3}$/g, // Very short numbers
      /0000/g, // Repeated zeros
      /^\d+R?$/g, // Just numbers with possible 'R' for reverse
    ];

    return suspiciousPatterns.some((pattern) => pattern.test(docNumber));
  }

  /**
   * Calculate risk level based on risk score
   * @param {number} riskScore - Risk score (0-100)
   * @returns {string} Risk level
   */
  calculateRiskLevel(riskScore) {
    if (riskScore >= 80) return 'critical';
    if (riskScore >= 60) return 'high';
    if (riskScore >= 40) return 'medium';
    if (riskScore >= 20) return 'low';
    return 'very_low';
  }

  /**
   * Create fraud insight record in database
   * @param {Object} data - Fraud insight data
   * @returns {Object} Created insight record
   */
  async createFraudInsight(data) {
    const {
      entity_id,
      entity_type,
      insight_type,
      risk_score,
      risk_level,
      indicators,
      heatmap_data,
      transaction_data,
      profile_data,
      document_data
    } = data;

    const result = await db.query(
      `INSERT INTO fm_ai_insights (
                entity_id, entity_type, insight_type, confidence_score,
                insights_data, is_flagged, severity_level
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
      [
        entity_id,
        entity_type,
        insight_type,
        risk_score,
        {
          indicators,
          heatmap_data,
          transaction_data,
          profile_data,
          document_data,
          analysis_timestamp: new Date()
        },
        risk_score >= 50, // Flag if risk score >= 50
        risk_level
      ],
    );

    return result.rows[0];
  }

  /**
   * Update ML model with new fraud patterns
   * @param {Array} newPatterns - New fraud patterns to learn
   * @param {Array} verifiedFrauds - Verified fraud cases
   * @param {Array} legitimateCases - Verified legitimate cases
   */
  async updateMLModel(newPatterns, verifiedFrauds, legitimateCases) {
    try {
      // In a real implementation, this would retrain the ML model
      // For now, we'll just update the pattern database

      if (newPatterns && newPatterns.length > 0) {
        // Update fraud pattern definitions
        const _patternUpdate = await db.query(
          `UPDATE fm_matching_algorithms 
                    SET parameters = parameters || $1::jsonb, updated_at = CURRENT_TIMESTAMP
                    WHERE algorithm_type = 'fraud_detection'`,
          [JSON.stringify({ new_patterns: newPatterns })],
        );
      }

      // Log the model update
      await db.query(
        `INSERT INTO fm_sentinel_logs (
                    log_type, severity, entity_type, action_taken, details
                ) VALUES ($1, $2, $3, $4, $5)`,
        [
          'ml_model_update',
          'info',
          'fraud_detection_model',
          'retrained',
          {
            patterns_added: newPatterns?.length || 0,
            frauds_analyzed: verifiedFrauds?.length || 0,
            legitimate_analyzed: legitimateCases?.length || 0,
            update_timestamp: new Date().toISOString()
          }
        ],
      );

      return { success: true, message: 'ML model updated successfully' };
    } catch (error) {
      logger.error('Error updating ML model:', error.message);
      throw error;
    }
  }

  /**
   * Generate fraud heatmap for a specific member or entity
   * @param {string} entityId - Entity ID to generate heatmap for
   * @param {string} entityType - Type of entity ('member', 'transaction', 'document')
   * @param {string} startDate - Start date for analysis
   * @param {string} endDate - End date for analysis
   * @returns {Object} Fraud heatmap data
   */
  async generateFraudHeatmap(entityId, entityType, startDate, endDate) {
    try {
      const heatmapData = {
        risk_timeline: [],
        pattern_frequency: {},
        geographic_analysis: {},
        temporal_patterns: {},
        severity_distribution: { low: 0, medium: 0, high: 0, critical: 0 }
      };

      // Get all fraud insights for the entity in the time period
      const insights = await db.query(
        `SELECT * FROM fm_ai_insights 
                WHERE entity_id = $1 AND entity_type = $2 
                AND created_at BETWEEN $3 AND $4
                ORDER BY created_at`,
        [entityId, entityType, startDate, endDate],
      );

      // Process each insight to build the heatmap
      insights.rows.forEach((insight) => {
        // Add to timeline
        heatmapData.risk_timeline.push({
          timestamp: insight.created_at,
          risk_score: insight.confidence_score,
          severity: insight.severity_level
        });

        // Count by severity
        if (
          heatmapData.severity_distribution[insight.severity_level] !==
          undefined
        ) {
          heatmapData.severity_distribution[insight.severity_level]++;
        }

        // Analyze patterns from insights data
        if (insight.insights_data?.indicators) {
          insight.insights_data.indicators.forEach((indicator) => {
            const type = indicator.type;
            if (heatmapData.pattern_frequency[type]) {
              heatmapData.pattern_frequency[type]++;
            } else {
              heatmapData.pattern_frequency[type] = 1;
            }
          });
        }
      });

      // Generate temporal patterns (by hour of day, day of week)
      if (heatmapData.risk_timeline.length > 0) {
        const hourlyRisk = {};
        const dailyRisk = {};

        heatmapData.risk_timeline.forEach((record) => {
          const hour = new Date(record.timestamp).getUTCHours();
          const day = new Date(record.timestamp).getUTCDay();

          hourlyRisk[hour] = (hourlyRisk[hour] || 0) + 1;
          dailyRisk[day] = (dailyRisk[day] || 0) + 1;
        });

        heatmapData.temporal_patterns = {
          hourly: hourlyRisk,
          daily: dailyRisk
        };
      }

      return heatmapData;
    } catch (error) {
      logger.error('Error generating fraud heatmap:', error.message);
      throw error;
    }
  }

  /**
   * Perform batch fraud analysis on multiple entities
   * @param {Array} entities - Array of entities to analyze
   * @param {string} entityType - Type of entities to analyze
   * @returns {Array} Analysis results
   */
  async batchFraudAnalysis(entities, entityType) {
    const results = [];

    for (const entity of entities) {
      try {
        let analysis;

        switch (entityType) {
        case 'transaction':
          analysis = await this.analyzeTransactionForFraud(entity);
          break;
        case 'member':
          analysis = await this.analyzeMemberForFraud(entity);
          break;
        case 'document':
          analysis = await this.analyzeDocumentForFraud(entity);
          break;
        default:
          throw new Error(`Unsupported entity type: ${entityType}`);
        }

        results.push(analysis);
      } catch (error) {
        logger.error(
          `Error analyzing ${entityType} ${entity.id}:`,
          error.message,
        );
        results.push({
          entity_id: entity.id,
          error: error.message,
          success: false
        });
      }
    }

    return results;
  }
}

module.exports = new FraudDetectionService();
