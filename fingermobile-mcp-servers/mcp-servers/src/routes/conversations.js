const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get all conversations for the authenticated member
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  conversationController.getConversations,
);

// Get messages for a specific conversation
router.get(
  "/:memberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  conversationController.getConversationMessages,
);

// Send a message in a conversation
router.post(
  "/:memberId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  conversationController.sendConversationMessage,
);

// Mark all messages in a conversation as read
router.put(
  "/:memberId/read",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  conversationController.markConversationAsRead,
);

// Get unread message count for all conversations
router.get(
  "/unread/count",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  conversationController.getUnreadCount,
);

module.exports = router;
