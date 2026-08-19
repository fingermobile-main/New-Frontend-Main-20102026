const express = require("express");
const router = express.Router();
const developerPortalController = require("../controllers/developerPortalController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Developer Applications
router.post(
  "/applications",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.createApplication,
);
router.get(
  "/applications",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.getApplications,
);
router.get(
  "/applications/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.getApplicationById,
);
router.put(
  "/applications/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.updateApplication,
);
router.delete(
  "/applications/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.deleteApplication,
);

// API Keys
router.post(
  "/applications/:applicationId/api-keys",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.createApiKey,
);
router.get(
  "/applications/:applicationId/api-keys",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.getApiKeys,
);
router.get(
  "/api-keys/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.getApiKeyById,
);
router.delete(
  "/api-keys/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.deleteApiKey,
);

// Webhook Endpoints
router.post(
  "/applications/:applicationId/webhook-endpoints",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.createWebhookEndpoint,
);
router.get(
  "/applications/:applicationId/webhook-endpoints",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.getWebhookEndpoints,
);
router.get(
  "/webhook-endpoints/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.getWebhookEndpointById,
);
router.put(
  "/webhook-endpoints/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.updateWebhookEndpoint,
);
router.delete(
  "/webhook-endpoints/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.deleteWebhookEndpoint,
);

// API Rate Limits
router.post(
  "/api-keys/:apiKeyId/rate-limits",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.createApiRateLimit,
);
router.get(
  "/api-keys/:apiKeyId/rate-limits",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.getApiRateLimits,
);
router.get(
  "/api-rate-limits/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.getApiRateLimitById,
);
router.put(
  "/api-rate-limits/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.updateApiRateLimit,
);
router.delete(
  "/api-rate-limits/:id",
  authenticateToken,
  authorizeRoles(["admin", "developer"]),
  developerPortalController.deleteApiRateLimit,
);

module.exports = router;
