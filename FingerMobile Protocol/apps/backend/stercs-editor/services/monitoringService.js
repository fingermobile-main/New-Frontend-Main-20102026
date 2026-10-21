const logger = require('../../utils/logger');
const { identityDb } = require('../../db');
const { logSecurityEvent } = require('../../utils/securityLogger');

class MonitoringService {
  // Create a new monitoring rule
  static async createRule(memberId, ruleData) {
    try {
      const {
        name,
        description,
        projectId,
        metricType, // 'response_time', 'error_rate', 'cpu_usage', etc.
        condition, // '>', '<', '>=', '<=', '==', '!='
        threshold,
        evaluationWindow, // in seconds
        alertRecipients = [],
        enabled = true,
      } = ruleData;

      if (
        !name ||
        !projectId ||
        !metricType ||
        !condition ||
        threshold === undefined
      ) {
        throw new Error(
          'Name, Project ID, Metric Type, Condition, and Threshold are required for creating a monitoring rule',
        );
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_monitoring_rules 
         (member_id, project_id, name, description, metric_type, condition, threshold, evaluation_window, alert_recipients, enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [
          memberId,
          projectId,
          name,
          description || '',
          metricType,
          condition,
          threshold,
          evaluationWindow || 300, // Default to 5 minutes
          alertRecipients,
          enabled
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, 'MONITORING_RULE_CREATE', {ruleId: result.rows[0].id,
        ruleName: name
      });

      return {success: true,
        rule: result.rows[0],
        message: 'Monitoring rule created successfully'
      };
    } catch (error) {
      logger.error('Error creating monitoring rule:', error);
      throw error;
    }
  }

  // Get monitoring rules for a member
  static async getRules(memberId, options = {}) {
    try {
      let query = 'SELECT * FROM stercs_monitoring_rules WHERE member_id = $1';
      const params = [memberId];

      if (options.projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.enabled !== undefined) {
        query += ` AND enabled = $${params.length + 1}`;
        params.push(options.enabled);
      }

      if (options.search) {
        query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
        params.push(`%${options.search}%`);
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
        rules: result.rows,
        message: 'Monitoring rules retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting monitoring rules:', error);
      throw error;
    }
  }

  // Get monitoring rule by ID
  static async getRuleById(memberId, ruleId) {
    try {
      const result = await identityDb.query(
        'SELECT * FROM stercs_monitoring_rules WHERE id = $1 AND member_id = $2',
        [ruleId, memberId],
      );

      if (result.rows.length === 0) {
        throw new Error('Monitoring rule not found or not owned by member');
      }

      return {success: true,
        rule: result.rows[0],
        message: 'Monitoring rule retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting monitoring rule by ID:', error);
      throw error;
    }
  }

  // Update a monitoring rule
  static async updateRule(memberId, ruleId, ruleData) {
    try {
      // Verify rule belongs to member
      const ruleResult = await identityDb.query(
        'SELECT * FROM stercs_monitoring_rules WHERE id = $1 AND member_id = $2',
        [ruleId, memberId],
      );

      if (ruleResult.rows.length === 0) {
        throw new Error('Monitoring rule not found or not owned by member');
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 3; // First two params are ruleId and memberId

      if (ruleData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(ruleData.name);
        paramIndex++;
      }

      if (ruleData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(ruleData.description);
        paramIndex++;
      }

      if (ruleData.metricType) {
        updateFields.push(`metric_type = $${paramIndex}`);
        updateValues.push(ruleData.metricType);
        paramIndex++;
      }

      if (ruleData.condition) {
        updateFields.push(`condition = $${paramIndex}`);
        updateValues.push(ruleData.condition);
        paramIndex++;
      }

      if (ruleData.threshold !== undefined) {
        updateFields.push(`threshold = $${paramIndex}`);
        updateValues.push(ruleData.threshold);
        paramIndex++;
      }

      if (ruleData.evaluationWindow !== undefined) {
        updateFields.push(`evaluation_window = $${paramIndex}`);
        updateValues.push(ruleData.evaluationWindow);
        paramIndex++;
      }

      if (ruleData.alertRecipients !== undefined) {
        updateFields.push(`alert_recipients = $${paramIndex}`);
        updateValues.push(ruleData.alertRecipients);
        paramIndex++;
      }

      if (ruleData.enabled !== undefined) {
        updateFields.push(`enabled = $${paramIndex}`);
        updateValues.push(ruleData.enabled);
        paramIndex++;
      }

      updateValues.push(ruleId, memberId); // Add ruleId and memberId as last values

      const query = `UPDATE stercs_monitoring_rules SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex - 1} AND member_id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, 'MONITORING_RULE_UPDATE', {ruleId: result.rows[0].id,
        ruleName: result.rows[0].name
      });

      return {success: true,
        rule: result.rows[0],
        message: 'Monitoring rule updated successfully'
      };
    } catch (error) {
      logger.error('Error updating monitoring rule:', error);
      throw error;
    }
  }

  // Delete a monitoring rule
  static async deleteRule(memberId, ruleId) {
    try {
      // Verify rule belongs to member
      const ruleResult = await identityDb.query(
        'SELECT * FROM stercs_monitoring_rules WHERE id = $1 AND member_id = $2',
        [ruleId, memberId],
      );

      if (ruleResult.rows.length === 0) {
        throw new Error('Monitoring rule not found or not owned by member');
      }

      await identityDb.query(
        'DELETE FROM stercs_monitoring_rules WHERE id = $1 AND member_id = $2',
        [ruleId, memberId],
      );

      // Log security event
      await logSecurityEvent(memberId, 'MONITORING_RULE_DELETE', {
        ruleId
      });

      return {success: true,
        message: 'Monitoring rule deleted successfully'
      };
    } catch (error) {
      logger.error('Error deleting monitoring rule:', error);
      throw error;
    }
  }

  // Record a metric value
  static async recordMetric(memberId, metricData) {
    try {
      const { projectId, metricType, value, source = 'system' } = metricData;

      if (!projectId || !metricType || value === undefined) {
        throw new Error(
          'Project ID, Metric Type, and Value are required for recording a metric',
        );
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_monitoring_metrics 
         (member_id, project_id, metric_type, value, source)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [memberId, projectId, metricType, value, source],
      );

      // Check if any rules are triggered
      await MonitoringService.checkRulesForMetric(memberId, result.rows[0]);

      return {success: true,
        metric: result.rows[0],
        message: 'Metric recorded successfully'
      };
    } catch (error) {
      logger.error('Error recording metric:', error);
      throw error;
    }
  }

  // Check if any rules are triggered by a metric
  static async checkRulesForMetric(memberId, metric) {
    try {
      // Get all enabled rules for this member and project that match the metric type
      const rulesResult = await identityDb.query(
        `SELECT * FROM stercs_monitoring_rules 
         WHERE member_id = $1 
         AND project_id = $2
         AND metric_type = $3
         AND enabled = true`,
        [memberId, metric.project_id, metric.metric_type],
      );

      for (const rule of rulesResult.rows) {
        let conditionMet = false;

        switch (rule.condition) {
        case '>':
          conditionMet = metric.value > rule.threshold;
          break;
        case '<':
          conditionMet = metric.value < rule.threshold;
          break;
        case '>=':
          conditionMet = metric.value >= rule.threshold;
          break;
        case '<=':
          conditionMet = metric.value <= rule.threshold;
          break;
        case '==':
          conditionMet = metric.value == rule.threshold;
          break;
        case '!=':
          conditionMet = metric.value != rule.threshold;
          break;
        default:
          logger.error(`Unknown,
condition: ${rule.condition}`);
        }

        if (conditionMet) {
          // Create an alert
          await MonitoringService.createAlert(memberId, {rule_id: rule.id,
            project_id: metric.project_id,
            metric_type: metric.metric_type,
            metric_value: metric.value,
            threshold: rule.threshold,
            condition: rule.condition,
            status: 'triggered'
          });
        }
      }
    } catch (error) {
      logger.error('Error checking rules for metric:', error);
    }
  }

  // Create an alert
  static async createAlert(memberId, alertData) {
    try {
      const {
        rule_id,
        project_id,
        metric_type,
        metric_value,
        threshold,
        condition,
        status = 'triggered',
      } = alertData;

      const result = await identityDb.query(
        `INSERT INTO stercs_monitoring_alerts 
         (member_id, rule_id, project_id, metric_type, metric_value, threshold, condition, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          memberId,
          rule_id,
          project_id,
          metric_type,
          metric_value,
          threshold,
          condition,
          status
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, 'MONITORING_ALERT_CREATE', {alertId: result.rows[0].id,
        ruleId: rule_id
      });

      return {success: true,
        alert: result.rows[0],
        message: 'Alert created successfully'
      };
    } catch (error) {
      logger.error('Error creating alert:', error);
      throw error;
    }
  }

  // Get alerts for a member
  static async getAlerts(memberId, options = {}) {
    try {
      let query = 'SELECT * FROM stercs_monitoring_alerts WHERE member_id = $1';
      const params = [memberId];

      if (options.projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.status) {
        query += ` AND status = $${params.length + 1}`;
        params.push(options.status);
      }

      if (options.metricType) {
        query += ` AND metric_type = $${params.length + 1}`;
        params.push(options.metricType);
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
        alerts: result.rows,
        message: 'Alerts retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting alerts:', error);
      throw error;
    }
  }

  // Get metrics for a member
  static async getMetrics(memberId, options = {}) {
    try {
      let query = 'SELECT * FROM stercs_monitoring_metrics WHERE member_id = $1';
      const params = [memberId];

      if (options.projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.metricType) {
        query += ` AND metric_type = $${params.length + 1}`;
        params.push(options.metricType);
      }

      if (options.fromDate) {
        query += ` AND created_at >= $${params.length + 1}`;
        params.push(options.fromDate);
      }

      if (options.toDate) {
        query += ` AND created_at <= $${params.length + 1}`;
        params.push(options.toDate);
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
        metrics: result.rows,
        message: 'Metrics retrieved successfully'
      };
    } catch (error) {
      logger.error('Error getting metrics:', error);
      throw error;
    }
  }
}

module.exports = MonitoringService;
