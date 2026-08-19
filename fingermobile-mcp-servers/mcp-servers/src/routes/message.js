const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Send a new message
router.post(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  messageController.sendMessage,
);

// Get messages (direct or group)
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  messageController.getMessages,
);

// Mark messages as read
router.put(
  "/read",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  messageController.markAsRead,
);

// Delete a message by ID
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles(["admin"]),
  messageController.deleteMessage,
);

module.exports = router;
