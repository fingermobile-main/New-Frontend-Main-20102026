const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Assign a role to a member (Admin only)
router.post(
  "/assign-role",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminController.assignRole,
);

// Get all members with their roles (Admin only)
router.get(
  "/members-with-roles",
  authenticateToken,
  authorizeRoles(["admin"]),
  adminController.getAllmembersWithRoles,
);

module.exports = router;
