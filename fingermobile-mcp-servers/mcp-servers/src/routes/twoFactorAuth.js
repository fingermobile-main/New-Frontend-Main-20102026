const express = require("express");
const router = express.Router();
const twoFactorAuthController = require("../controllers/twoFactorAuthController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Enable two-factor authentication
router.post(
  "/enable",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  twoFactorAuthController.enableTwoFactor,
);

// Verify two-factor authentication setup
router.post(
  "/verify-setup",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  twoFactorAuthController.verifyTwoFactorSetup,
);

// Disable two-factor authentication
router.post(
  "/disable",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  twoFactorAuthController.disableTwoFactor,
);

// Generate backup codes
router.post(
  "/backup-codes",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  twoFactorAuthController.generateBackupCodes,
);

// Verify backup code
router.post(
  "/verify-backup",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  twoFactorAuthController.verifyBackupCode,
);

module.exports = router;
