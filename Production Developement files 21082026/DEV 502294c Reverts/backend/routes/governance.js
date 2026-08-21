const express = require('express');
const governance = require('../controllers/GovernanceController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// Policy Management Routes
router.get("/policies", authenticate, governance.getAllPolicies);
router.get("/policies/:id", authenticate, governance.getPolicyById);
router.post("/policies", authenticate, governance.createPolicy);
router.put("/policies/:id", authenticate, governance.updatePolicy);
router.delete("/policies/:id", authenticate, governance.deletePolicy);

// Consent Management Routes
router.post("/consent", authenticate, governance.grantConsent);
router.delete("/consent/:policyId", authenticate, governance.withdrawConsent);
router.get("/consent/user", authenticate, governance.getUserConsents);

// Action Validation Route
router.post("/validate", authenticate, governance.validateAction);

// Audit Log Routes
router.get("/audit-logs", authenticate, governance.getAuditLogs);

module.exports = router;
