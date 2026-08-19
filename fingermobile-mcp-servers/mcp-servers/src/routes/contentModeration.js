const express = require("express");
const router = express.Router();
const contentModerationController = require("../controllers/contentModerationController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Moderate content before publishing
router.post(
  "/content",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  contentModerationController.moderateContent,
);

// Moderate comment before posting
router.post(
  "/comment",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  contentModerationController.moderateComment,
);

// Flag inappropriate content
router.post(
  "/flag",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  contentModerationController.flagContent,
);

// Get flagged content (admin only)
router.get(
  "/flagged",
  authenticateToken,
  authorizeRoles(["admin"]),
  contentModerationController.getFlaggedContent,
);

// Review and moderate flagged content (admin only)
router.put(
  "/review",
  authenticateToken,
  authorizeRoles(["admin"]),
  contentModerationController.reviewContent,
);

module.exports = router;
