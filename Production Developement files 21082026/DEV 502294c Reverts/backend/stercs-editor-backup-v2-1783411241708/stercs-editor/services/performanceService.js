const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class PerformanceService {
  // Create a new performance monitoring configuration
  static async createPerformanceConfig(memberId, configData) {
    try {
      const { name, description, projectId, settings } = configData;

      if (!name || !projectId) {
        throw new Error(
          "Performance configuration name and project ID are required",
        );
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_performance_configs 
         (member_id, project_id, name, description, settings)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [memberId, projectId, name, description || "", settings || {}],
      );

      // Log security event
      await logSecurityEvent(memberId, "PERFORMANCE_CONFIG_CREATE", {configId: result.rows[0].id,
  configName: name
      });

      return {success: true,
  config: result.rows[0],
  message: "Performance configuration created successfully"
      };
    } catch (error) {
      logger.error("Error creating performance, configuration:", error);
      throw error;
    }
  }

  // Get performance configurations for a member
  static async getPerformanceConfigs(memberId, projectId = null) {
    try {
      let query = `SELECT * FROM stercs_performance_configs WHERE member_id = $1`;
      const params = [memberId];

      if (projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(projectId);
      }

      query += ` ORDER BY created_at DESC`;

      const result = await identityDb.query(query, params);

      return {success: true,
  configs: result.rows,
  message: "Performance configurations retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting performance, configurations:", error);
      throw error;
    }
  }

  // Update a performance configuration
  static async updatePerformanceConfig(memberId, configId, configData) {
    try {
      // Verify config belongs to member
      const configResult = await identityDb.query(
        `SELECT * FROM stercs_performance_configs WHERE id = $1 AND member_id = $2`,
        [configId, memberId],
      );

      if (configResult.rows.length === 0) {
        throw new Error(
          "Performance configuration not found or not owned by member",
        );
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is configId

      if (configData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(configData.name);
        paramIndex++;
      }

      if (configData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(configData.description);
        paramIndex++;
      }

      if (configData.settings) {
        updateFields.push(`settings = $${paramIndex}`);
        updateValues.push(configData.settings);
        paramIndex++;
      }

      updateValues.push(configId); // Add configId as last value

      const query = `UPDATE stercs_performance_configs SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "PERFORMANCE_CONFIG_UPDATE", {configId: result.rows[0].id,
  configName: result.rows[0].name
      });

      return {success: true,
  config: result.rows[0],
  message: "Performance configuration updated successfully"
      };
    } catch (error) {
      logger.error("Error updating performance, configuration:", error);
      throw error;
    }
  }

  // Delete a performance configuration
  static async deletePerformanceConfig(memberId, configId) {
    try {
      // Verify config belongs to member
      const configResult = await identityDb.query(
        `SELECT * FROM stercs_performance_configs WHERE id = $1 AND member_id = $2`,
        [configId, memberId],
      );

      if (configResult.rows.length === 0) {
        throw new Error(
          "Performance configuration not found or not owned by member",
        );
      }

      await identityDb.query(
        `DELETE FROM stercs_performance_configs WHERE id = $1`,
        [configId],
      );

      // Log security event
      await logSecurityEvent(memberId, "PERFORMANCE_CONFIG_DELETE", {
        configId
      });

      return {success: true,
  message: "Performance configuration deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting performance, configuration:", error);
      throw error;
    }
  }

  // Create a new performance metric
  static async createPerformanceMetric(memberId, metricData) {
    try {
      const {
        configId,
        projectId,
        metricType,
        value,
        unit,
        timestamp,
        metadata
      } = metricData;

      if (!configId || !projectId || !metricType || value === undefined) {
        throw new Error(
          "Configuration ID, Project ID, metric type, and value are required for performance metric",
        );
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_performance_metrics 
         (member_id, config_id, project_id, metric_type, value, unit, timestamp, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          memberId,
          configId,
          projectId,
          metricType,
          value,
          unit || "",
          timestamp || new Date(),
          metadata || {}
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "PERFORMANCE_METRIC_CREATE", {metricId: result.rows[0].id,
  configId: configId,
  metricType: metricType
      });

      return {success: true,
  metric: result.rows[0],
  message: "Performance metric recorded successfully"
      };
    } catch (error) {
      logger.error("Error creating performance, metric:", error);
      throw error;
    }
  }

  // Get performance metrics for a project
  static async getPerformanceMetrics(memberId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_performance_metrics WHERE member_id = $1`;
      const params = [memberId];

      if (options.projectId) {
        query += ` AND project_id = $${params.length + 1}`;
        params.push(options.projectId);
      }

      if (options.configId) {
        query += ` AND config_id = $${params.length + 1}`;
        params.push(options.configId);
      }

      if (options.metricType) {
        query += ` AND metric_type = $${params.length + 1}`;
        params.push(options.metricType);
      }

      if (options.startDate) {
        query += ` AND timestamp >= $${params.length + 1}`;
        params.push(options.startDate);
      }

      if (options.endDate) {
        query += ` AND timestamp <= $${params.length + 1}`;
        params.push(options.endDate);
      }

      query += ` ORDER BY timestamp DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  metrics: result.rows,
  message: "Performance metrics retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting performance, metrics:", error);
      throw error;
    }
  }

  // Get performance summary for a project
  static async getPerformanceSummary(memberId, projectId) {
    try {
      // Get the most recent metrics for each metric type for the project
      const query = `
        SELECT DISTINCT ON (metric_type) 
          metric_type, 
          value, 
          unit, 
          timestamp,
          metadata
        FROM stercs_performance_metrics 
        WHERE member_id = $1 AND project_id = $2 
        ORDER BY metric_type, timestamp DESC
      `;

      const result = await identityDb.query(query, [memberId, projectId]);

      return {success: true,
  summary: result.rows,
  message: "Performance summary retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting performance, summary:", error);
      throw error;
    }
  }
}

module.exports = PerformanceService;
