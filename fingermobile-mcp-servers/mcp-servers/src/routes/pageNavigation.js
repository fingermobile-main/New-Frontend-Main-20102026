const express = require("express");
const router = express.Router();
const pageNavigationController = require("../controllers/pageNavigationController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Record a page navigation event (public endpoint for tracking)
router.post("/", pageNavigationController.recordPageNavigation);

// Get member journey/path analysis (admin only)
router.get(
  "/journey",
  authenticateToken,
  authorizeRoles(["admin", "superadmin", "rbs_admin", "moderator"]),
  pageNavigationController.getmemberJourney,
);

// Get page analytics (admin only)
router.get(
  "/analytics",
  authenticateToken,
  authorizeRoles(["admin", "superadmin", "rbs_admin", "moderator"]),
  pageNavigationController.getPageAnalytics,
);

// Get real-time member tracking (admin only)
router.get(
  "/realtime",
  authenticateToken,
  authorizeRoles(["admin", "superadmin", "rbs_admin", "moderator"]),
  pageNavigationController.getRealTimeTracking,
);

// Get member path analysis (admin only)
router.get(
  "/path-analysis",
  authenticateToken,
  authorizeRoles(["admin", "superadmin", "rbs_admin", "moderator"]),
  pageNavigationController.getmemberPathAnalysis,
);

module.exports = router;
