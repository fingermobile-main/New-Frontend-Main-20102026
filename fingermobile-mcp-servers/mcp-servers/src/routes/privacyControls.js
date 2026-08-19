const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const privacyController = require("../controllers/privacyController");

// Get privacy settings
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  privacyController.getPrivacySettings,
);

// Update privacy settings
router.put(
  "/",
  authenticateToken,
  authorizeRoles(["member", "admin"]),
  privacyController.updatePrivacySettings,
);

module.exports = router;
