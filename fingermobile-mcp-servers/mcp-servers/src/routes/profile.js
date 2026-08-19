const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Create a new profile (typically done during member registration or first login)
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  profileController.createProfile,
);

// Get a member's profile by memberId
router.get(
  "/:memberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  profileController.getProfileBymemberId,
);

// Update a member's profile by memberId
router.put(
  "/:memberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  profileController.updateProfile,
);

// Delete a member's profile by memberId
router.delete(
  "/:memberId",
  authenticateToken,
  authorizeRoles(["admin"]),
  profileController.deleteProfile,
);

module.exports = router;
