const express = require("express");
const router = express.Router();
const loginAnalyticsController = require("../controllers/loginAnalyticsController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get login analytics for a specific member (admin only)
router.get(
  "/members/:memberId",
  authenticateToken,
  authorizeRoles(["admin"]),
  loginAnalyticsController.getmemberLoginAnalytics,
);

// Get aggregated login analytics across all members (admin only)
router.get(
  "/aggregated",
  authenticateToken,
  authorizeRoles(["admin"]),
  loginAnalyticsController.getAggregatedLoginAnalytics,
);

// Get real-time login statistics (admin only) - commented out since function doesn't exist
// router.get('/realtime', authenticateToken, authorizeRoles(['admin']), loginAnalyticsController.getRealTimeLoginStats);

module.exports = router;
