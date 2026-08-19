const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Record a new event
router.post(
  "/events",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  analyticsController.recordEvent,
);

// Get analytics data with optional filters
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  analyticsController.getAnalytics,
);

// Get aggregated analytics data
router.get(
  "/aggregated",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  analyticsController.getAggregatedAnalytics,
);

module.exports = router;
