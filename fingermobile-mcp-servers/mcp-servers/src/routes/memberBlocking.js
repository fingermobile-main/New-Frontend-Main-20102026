const express = require("express");
const router = express.Router();
const memberBlockingController = require("../controllers/memberBlockingController"); // This should now point to the renamed controller
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Block a member
router.post(
  "/:targetmemberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  memberBlockingController.blockmember,
);

// Unblock a member
router.delete(
  "/:targetmemberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  memberBlockingController.unblockmember,
);

// Get all blocked members
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  memberBlockingController.getBlockedmembers,
);

// Check if a member is blocked
router.get(
  "/:targetmemberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  memberBlockingController.ismemberBlocked,
);

module.exports = router;
