const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get activity feed for the authenticated member
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  activityController.getActivityFeed,
);

// Get activities for a specific member
router.get(
  "/member/:memberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  activityController.getmemberActivities,
);

// Delete an activity
router.delete(
  "/:activityId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  activityController.deleteActivity,
);

// Update activity visibility
router.put(
  "/:activityId/visibility",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  activityController.updateActivityVisibility,
);

module.exports = router;
