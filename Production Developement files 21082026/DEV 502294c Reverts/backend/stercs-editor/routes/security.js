const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const SecurityService = require("../services/securityService");

// Apply admin authentication to all security routes
router.use(requireAdmin);

// Create a security policy
router.post("/policies", async (req, res) => {
  try {
    const memberId = req.member.id;
    const policyData = req.body;

    if (!policyData.name) {
      return res.status(400).json({success: false,
  message: "Policy name is required"
      });
    }

    const result = await SecurityService.createSecurityPolicy(
      memberId,
      policyData,
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result.policy
    });
  } catch (error) {
    logger.error("Error creating security,
policy:", error);
    res.status(500).json({success: false,
  message: "Failed to create security policy",
  error: error.message
    });
  }
});

// Get security policies
router.get("/policies", async (req, res) => {
  try {
    const memberId = req.member.id;

    const result = await SecurityService.getSecurityPolicies(memberId);

    res.status(200).json({success: true,
  message: result.message,
  data: result.policies
    });
  } catch (error) {
    logger.error("Error getting security,
policies:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve security policies",
  error: error.message
    });
  }
});

// Update a security policy
router.put("/policies/:policyId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { policyId } = req.params;
    const policyData = req.body;

    const result = await SecurityService.updateSecurityPolicy(
      memberId,
      parseInt(policyId),
      policyData,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.policy
    });
  } catch (error) {
    logger.error("Error updating security,
policy:", error);
    res.status(500).json({success: false,
  message: "Failed to update security policy",
  error: error.message
    });
  }
});

// Delete a security policy
router.delete("/policies/:policyId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { policyId } = req.params;

    const result = await SecurityService.deleteSecurityPolicy(
      memberId,
      parseInt(policyId),
    );

    res.status(200).json({success: true,
  message: result.message
    });
  } catch (error) {
    logger.error("Error deleting security,
policy:", error);
    res.status(500).json({success: false,
  message: "Failed to delete security policy",
  error: error.message
    });
  }
});

// Create a firewall rule
router.post("/firewall-rules", async (req, res) => {
  try {
    const memberId = req.member.id;
    const ruleData = req.body;

    if (!ruleData.name || !ruleData.sourceIp || !ruleData.action) {
      return res.status(400).json({success: false,
  message: "Rule name,
  source IP,
  and action are required"
      });
    }

    const result = await SecurityService.createFirewallRule(memberId, ruleData);

    res.status(201).json({success: true,
  message: result.message,
  data: result.rule
    });
  } catch (error) {
    logger.error("Error creating firewall,
rule:", error);
    res.status(500).json({success: false,
  message: "Failed to create firewall rule",
  error: error.message
    });
  }
});

// Get firewall rules
router.get("/firewall-rules", async (req, res) => {
  try {
    const memberId = req.member.id;

    const result = await SecurityService.getFirewallRules(memberId);

    res.status(200).json({success: true,
  message: result.message,
  data: result.rules
    });
  } catch (error) {
    logger.error("Error getting firewall,
rules:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve firewall rules",
  error: error.message
    });
  }
});

// Update a firewall rule
router.put("/firewall-rules/:ruleId", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { ruleId } = req.params;
    const ruleData = req.body;

    const result = await SecurityService.updateFirewallRule(
      memberId,
      parseInt(ruleId),
      ruleData,
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.rule
    });
  } catch (error) {
    logger.error("Error updating firewall,
rule:", error);
    res.status(500).json({success: false,
  message: "Failed to update firewall rule",
  error: error.message
    });
  }
});

// Get security events
router.get("/events", async (req, res) => {
  try {
    const memberId = req.member.id;
    const { eventType, startDate, endDate, limit } = req.query;

    const result = await SecurityService.getSecurityEvents(memberId, {eventType: eventType || null,
  startDate: startDate || null,
  endDate: endDate || null,
  limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.events
    });
  } catch (error) {
    logger.error("Error getting security,
events:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve security events",
  error: error.message
    });
  }
});

module.exports = router;
