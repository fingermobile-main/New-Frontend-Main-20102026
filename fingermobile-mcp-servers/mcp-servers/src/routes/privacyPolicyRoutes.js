const express = require("express");
const router = express.Router();
const privacyPolicyController = require("../controllers/privacyPolicyController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Route to get the current privacy policy
router.get("/", privacyPolicyController.getPrivacyPolicy);

// Route to create or update the privacy policy (admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin"]),
  privacyPolicyController.createOrUpdatePrivacyPolicy,
);

module.exports = router;
