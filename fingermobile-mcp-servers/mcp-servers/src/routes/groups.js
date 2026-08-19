const express = require("express");
const router = express.Router();
const groupsController = require("../controllers/groupsController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get all groups
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  groupsController.getGroups,
);

// Create a new group
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  groupsController.createGroup,
);

// Get a specific group by ID
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  groupsController.getGroupById,
);

// Update a group
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  groupsController.updateGroup,
);

// Delete a group
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin", "editor"]),
  groupsController.deleteGroup,
);

// Get group members
router.get(
  "/:id/members",
  authenticateToken,
  authorizeRoles(["admin", "editor", "member"]),
  groupsController.getGroupMembers,
);

// Join a group
router.post(
  "/:id/join",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  groupsController.joinGroup,
);

// Leave a group
router.post(
  "/:id/leave",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  groupsController.leaveGroup,
);

module.exports = router;
