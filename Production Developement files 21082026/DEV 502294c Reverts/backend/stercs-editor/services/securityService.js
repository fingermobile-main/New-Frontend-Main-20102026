const { identityDb } = require("../../db");
const { logSecurityEvent } = require("../../utils/securityLogger");

class SecurityService {
  // Create a new security policy
  static async createSecurityPolicy(memberId, policyData) {
    try {
      const { name, description, settings, enabled } = policyData;

      if (!name) {
        throw new Error("Policy name is required");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_security_policies 
         (member_id, name, description, settings, enabled)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [memberId, name, description || "", settings || {}, enabled !== false],
      );

      // Log security event
      await logSecurityEvent(memberId, "SECURITY_POLICY_CREATE", {policyId: result.rows[0].id,
  policyName: name
      });

      return {success: true,
  policy: result.rows[0],
  message: "Security policy created successfully"
      };
    } catch (error) {
      logger.error("Error creating security, policy:", error);
      throw error;
    }
  }

  // Get security policies for a member
  static async getSecurityPolicies(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_security_policies WHERE member_id = $1 ORDER BY created_at DESC`,
        [memberId],
      );

      return {success: true,
  policies: result.rows,
  message: "Security policies retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting security, policies:", error);
      throw error;
    }
  }

  // Update a security policy
  static async updateSecurityPolicy(memberId, policyId, policyData) {
    try {
      // Verify policy belongs to member
      const policyResult = await identityDb.query(
        `SELECT * FROM stercs_security_policies WHERE id = $1 AND member_id = $2`,
        [policyId, memberId],
      );

      if (policyResult.rows.length === 0) {
        throw new Error("Security policy not found or not owned by member");
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is policyId

      if (policyData.name) {
        updateFields.push(`name = $${paramIndex}`);
        updateValues.push(policyData.name);
        paramIndex++;
      }

      if (policyData.description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        updateValues.push(policyData.description);
        paramIndex++;
      }

      if (policyData.settings) {
        updateFields.push(`settings = $${paramIndex}`);
        updateValues.push(policyData.settings);
        paramIndex++;
      }

      if (policyData.enabled !== undefined) {
        updateFields.push(`enabled = $${paramIndex}`);
        updateValues.push(policyData.enabled);
        paramIndex++;
      }

      updateValues.push(policyId); // Add policyId as last value

      const query = `UPDATE stercs_security_policies SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "SECURITY_POLICY_UPDATE", {policyId: result.rows[0].id,
  policyName: result.rows[0].name
      });

      return {success: true,
  policy: result.rows[0],
  message: "Security policy updated successfully"
      };
    } catch (error) {
      logger.error("Error updating security, policy:", error);
      throw error;
    }
  }

  // Delete a security policy
  static async deleteSecurityPolicy(memberId, policyId) {
    try {
      // Verify policy belongs to member
      const policyResult = await identityDb.query(
        `SELECT * FROM stercs_security_policies WHERE id = $1 AND member_id = $2`,
        [policyId, memberId],
      );

      if (policyResult.rows.length === 0) {
        throw new Error("Security policy not found or not owned by member");
      }

      await identityDb.query(
        `DELETE FROM stercs_security_policies WHERE id = $1`,
        [policyId],
      );

      // Log security event
      await logSecurityEvent(memberId, "SECURITY_POLICY_DELETE", {
        policyId
      });

      return {success: true,
  message: "Security policy deleted successfully"
      };
    } catch (error) {
      logger.error("Error deleting security, policy:", error);
      throw error;
    }
  }

  // Create a new firewall rule
  static async createFirewallRule(memberId, ruleData) {
    try {
      const {
        name,
        description,
        sourceIp,
        destinationIp,
        protocol,
        port,
        action,
        enabled
      } = ruleData;

      if (!name || !sourceIp || !action) {
        throw new Error("Rule name, source IP, and action are required");
      }

      const result = await identityDb.query(
        `INSERT INTO stercs_security_firewall_rules 
         (member_id, name, description, source_ip, destination_ip, protocol, port, action, enabled)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          memberId,
          name,
          description || "",
          sourceIp,
          destinationIp || null,
          protocol || "any",
          port || null,
          action, // 'allow' or 'deny'
          enabled !== false
        ],
      );

      // Log security event
      await logSecurityEvent(memberId, "FIREWALL_RULE_CREATE", {ruleId: result.rows[0].id,
  ruleName: name
      });

      return {success: true,
  rule: result.rows[0],
  message: "Firewall rule created successfully"
      };
    } catch (error) {
      logger.error("Error creating firewall, rule:", error);
      throw error;
    }
  }

  // Get firewall rules for a member
  static async getFirewallRules(memberId) {
    try {
      const result = await identityDb.query(
        `SELECT * FROM stercs_security_firewall_rules WHERE member_id = $1 ORDER BY created_at DESC`,
        [memberId],
      );

      return {success: true,
  rules: result.rows,
  message: "Firewall rules retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting firewall, rules:", error);
      throw error;
    }
  }

  // Update a firewall rule
  static async updateFirewallRule(memberId, ruleId, ruleData) {
    try {
      // Verify rule belongs to member
      const ruleResult = await identityDb.query(
        `SELECT * FROM stercs_security_firewall_rules WHERE id = $1 AND member_id = $2`,
        [ruleId, memberId],
      );

      if (ruleResult.rows.length === 0) {
        throw new Error("Firewall rule not found or not owned by member");
      }

      // Build update query dynamically
      let updateFields = [];
      let updateValues = [];
      let paramIndex = 2; // First param is ruleId

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

      if (ruleData.sourceIp) {
        updateFields.push(`source_ip = $${paramIndex}`);
        updateValues.push(ruleData.sourceIp);
        paramIndex++;
      }

      if (ruleData.destinationIp !== undefined) {
        updateFields.push(`destination_ip = $${paramIndex}`);
        updateValues.push(ruleData.destinationIp);
        paramIndex++;
      }

      if (ruleData.protocol) {
        updateFields.push(`protocol = $${paramIndex}`);
        updateValues.push(ruleData.protocol);
        paramIndex++;
      }

      if (ruleData.port !== undefined) {
        updateFields.push(`port = $${paramIndex}`);
        updateValues.push(ruleData.port);
        paramIndex++;
      }

      if (ruleData.action) {
        updateFields.push(`action = $${paramIndex}`);
        updateValues.push(ruleData.action);
        paramIndex++;
      }

      if (ruleData.enabled !== undefined) {
        updateFields.push(`enabled = $${paramIndex}`);
        updateValues.push(ruleData.enabled);
        paramIndex++;
      }

      updateValues.push(ruleId); // Add ruleId as last value

      const query = `UPDATE stercs_security_firewall_rules SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
      const result = await identityDb.query(query, updateValues);

      // Log security event
      await logSecurityEvent(memberId, "FIREWALL_RULE_UPDATE", {ruleId: result.rows[0].id,
  ruleName: result.rows[0].name
      });

      return {success: true,
  rule: result.rows[0],
  message: "Firewall rule updated successfully"
      };
    } catch (error) {
      logger.error("Error updating firewall, rule:", error);
      throw error;
    }
  }

  // Log a security event
  static async logSecurityEvent(memberId, eventType, eventData) {
    try {
      const result = await identityDb.query(
        `INSERT INTO stercs_security_events 
         (member_id, event_type, event_data)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [memberId, eventType, eventData],
      );

      return {success: true,
  eventId: result.rows[0].id,
  message: "Security event logged successfully"
      };
    } catch (error) {
      logger.error("Error logging security, event:", error);
      throw error;
    }
  }

  // Get security events for a member
  static async getSecurityEvents(memberId, options = {}) {
    try {
      let query = `SELECT * FROM stercs_security_events WHERE member_id = $1`;
      const params = [memberId];

      if (options.eventType) {
        query += ` AND event_type = $${params.length + 1}`;
        params.push(options.eventType);
      }

      if (options.startDate) {
        query += ` AND created_at >= $${params.length + 1}`;
        params.push(options.startDate);
      }

      if (options.endDate) {
        query += ` AND created_at <= $${params.length + 1}`;
        params.push(options.endDate);
      }

      query += ` ORDER BY created_at DESC`;

      if (options.limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(options.limit);
      }

      const result = await identityDb.query(query, params);

      return {success: true,
  events: result.rows,
  message: "Security events retrieved successfully"
      };
    } catch (error) {
      logger.error("Error getting security, events:", error);
      throw error;
    }
  }
}

module.exports = SecurityService;
