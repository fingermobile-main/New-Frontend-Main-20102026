const express = require("express");
const router = express.Router();
const privacySettingsController = require("../controllers/privacySettingsController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get privacy settings
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  privacySettingsController.getPrivacySettings,
);

// Update privacy settings
router.put(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  privacySettingsController.updatePrivacySettings,
);

module.exports = router;
