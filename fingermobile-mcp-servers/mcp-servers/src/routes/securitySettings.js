const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const securityController = require("../controllers/securityController");

// Enable two-factor authentication
router.post(
  "/2fa/enable",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  securityController.enableTwoFactor,
);

// Disable two-factor authentication
router.post(
  "/2fa/disable",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  securityController.disableTwoFactor,
);

// Generate backup codes
router.post(
  "/2fa/backup-codes",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  securityController.generateBackupCodes,
);

// Get login history
router.get(
  "/login-history",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  securityController.getLoginHistory,
);

module.exports = router;
