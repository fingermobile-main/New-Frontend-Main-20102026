const express = require("express");
const router = express.Router();
const thirdPartyIntegrationController = require("../controllers/thirdPartyIntegrationController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// GET member's third-party integrations
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  thirdPartyIntegrationController.getIntegrations,
);

// POST connect a new third-party service
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  thirdPartyIntegrationController.connectIntegration,
);

// PUT update a third-party integration
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  thirdPartyIntegrationController.updateIntegration,
);

// DELETE disconnect a third-party integration
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  thirdPartyIntegrationController.disconnectIntegration,
);

// GET list of supported third-party services
router.get(
  "/services",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  thirdPartyIntegrationController.getSupportedServices,
);

module.exports = router;
