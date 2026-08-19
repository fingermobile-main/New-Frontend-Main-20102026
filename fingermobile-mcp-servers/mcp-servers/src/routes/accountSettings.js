const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const accountSettingsController = require("../controllers/accountSettingsController");

// Change password
router.put(
  "/password",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  accountSettingsController.changePassword,
);

// Update email
router.put(
  "/email",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  accountSettingsController.updateEmail,
);

// Update notification preferences
router.put(
  "/notifications",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  accountSettingsController.updateNotifications,
);

// Get account settings
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  accountSettingsController.getAccountSettings,
);

module.exports = router;
