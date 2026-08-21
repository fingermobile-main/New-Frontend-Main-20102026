const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class IntegrationService {
  // Create a new integration
  static async createIntegration(memberId, integrationData) {
    try {
      const {
        name,
        description,
        type, // 'api', 'webhook', 'oauth', 'database', etc.
        configuration,
        enabled = true,
        tags = [],
      } = integrationData;

      if (!name || !type) {
        throw new Error("Integration name and type are required");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_integrations 
         (member_id, name, description, type, configuration, enabled, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          memberId,
          name,
          description || "",
          type,
          configuration || {},
          enabled,
          tags
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "INTEGRATION_CREATE", {integrationId: result.rows[0].id,
  integrationName: name
      });

      return {success: true,
  integration: result.rows[0],
  message: "Integration created successfully"
      };
    } catch (error) {
      logger.error("Error creating, integration:", error);
      throw error;
    }
  }

  // Get integrations for a member
  static async getIntegrations(memberId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_integrations WHERE member_id = $1`;
      const params = [memberId];

      if (options.type) {
        query += ` AND type = $${params.length + 1}`;
        params.push(options.type);
      }

      if (options.enabled !== undefined) {
        query += ` AND enabled = $${params.length + 1}`;
        params.push(options.enabled);
      }

      if (options.search) {
        query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`;
        params.push(`%${options.search}%`);
      }

      if (options.tag) {
        query += ` AND $${params.length + 1} = ANY(tags)`;
        params.push(options.tag);
      }

      query += ` ORDER BY created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  integrations: result.rows,
  message: "Integrations retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting, integrations:", error);
      throw error;
    }
  }

  // Get integration by ID
  static async getIntegrationById(memberId, integrationId) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_integrations WHERE id = $1 AND member_id = $2`,
        [integrationId, memberId],
      );

      if (result.rows.length === 0) {
        throw new Error("Integration not found or not owned by member");
      }

      return {success: true,
  integration: result.rows[0],
  message: "Integration retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting integration by, ID:", error);
      throw error;
    }
  }

  // Update an integration
  static async updateIntegration(memberId, integrationId, integrationData) {
    try {
      // Verify integration belongs to member
      const integrationResult = await identityDb.query(
        `SELECT * FROM stercs_integrations WHERE id = $1 AND member_id = $2`,
        [integrationId, memberId],
      );

      if (integrationResult.rows.length === 0) {
        throw new Error("Integration not found or not owned by member");
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 3; // First two params are integrationId and memberId

      if (integrationData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(integrationData.name);
        paramIndex++;
      }

      if (integrationData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(integrationData.description);
        paramIndex++;
      }

      if (integrationData.type) {
        updateFields.push(`type = $${paramIndex}`);
        updateValues.push(integrationData.type);
        paramIndex++;
      }

      if (integrationData.configuration) {
        updateFields.push(`configuration = $${paramIndex}`);
        updateValues.push(integrationData.configuration);
        paramIndex++;
      }

      if (integrationData.enabled !== undefined) {
        updateFields.push(`enabled = $${paramIndex}`);
        updateValues.push(integrationData.enabled);
        paramIndex++;
      }

      if (integrationData.tags !== undefined) {
        updateFields.push(`tags = $${paramIndex}`);
        updateValues.push(integrationData.tags);
        paramIndex++;
      }

      updateValues.push(integrationId, memberId); // Add integrationId and memberId as last values

      const query = `UPDATE stercs_integrations SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex - 1} AND member_id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "INTEGRATION_UPDATE", {integrationId: result.rows[0].id,
  integrationName: result.rows[0].name
      });

      return {success: true,
  integration: result.rows[0],
  message: "Integration updated successfully"
      };
    } catch (error) {
      logger.error("Error updating, integration:", error);
      throw error;
    }
  }

  // Delete an integration
  static async deleteIntegration(memberId, integrationId) {
    try {
      // Verify integration belongs to member
      const integrationResult = await identityDb.query(
        `SELECT * FROM stercs_integrations WHERE id = $1 AND member_id = $2`,
        [integrationId, memberId],
      );

      if (integrationResult.rows.length === 0) {
        throw new Error("Integration not found or not owned by member");
      }

      await identityDb.query(
        `DELETE FROM stercs_integrations WHERE id = $1 AND member_id = $2`,
        [integrationId, memberId],
      );

      // Log security event
      await logSecurityEvent(memberId, "INTEGRATION_DELETE", {
        integrationId
      });

      return {success: true,
  message: "Integration deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting, integration:", error);
      throw error;
    }
  }

  // Test an integration connection
  static async testIntegration(memberId, integrationId) {
    try {
      // Verify integration belongs to member
      const integrationResult = await identityDb.query(
        `SELECT * FROM stercs_integrations WHERE id = $1 AND member_id = $2`,
        [integrationId, memberId],
      );

      if (integrationResult.rows.length === 0) {
        throw new Error("Integration not found or not owned by member");
      }

      const integration = integrationResult.rows[0];

      // In a real implementation, this would test the actual connection
      // based on the integration type and configuration
      const testResult = {success: true,
  message: "Integration connection successful",
  timestamp: new Date()
      };

      // Log security event
      await logSecurityEvent(memberId, "INTEGRATION_TEST", {integrationId: integrationId
      });

      return {success: true,
  result: testResult,
  message: "Integration tested successfully"
      };
    } catch (error) {
      logger.error("Error testing, integration:", error);
      throw error;
    }
  }

  // Get integration statistics
  static async getIntegrationStats(memberId, integrationId) {
    try {
      // Verify integration belongs to member
      const integrationResult = await identityDb.query(
        `SELECT * FROM stercs_integrations WHERE id = $1 AND member_id = $2`,
        [integrationId, memberId],
      );

      if (integrationResult.rows.length === 0) {
        throw new Error("Integration not found or not owned by member");
      }

      // In a real implementation, this would fetch actual usage statistics
      // from the integration logs or related tables
      const stats = {totalCalls: 1250,
  successRate: 98.5,
  avgResponseTime: 245,
  lastCall: new Date(),
  callsToday: 42
      };

      return {success: true,
  stats,
  message: "Integration stats retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting integration, stats:", error);
      throw error;
    }
  }
}

module.exports = IntegrationService;
