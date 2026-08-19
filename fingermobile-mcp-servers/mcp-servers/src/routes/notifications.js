const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticateToken } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");

// Get notifications for the authenticated member
router.get(
  "/",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  notificationController.getNotifications,
);

// Get unread notification count
router.get(
  "/unread-count",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  notificationController.getUnreadNotificationCount,
);

// Mark a notification as read
router.put(
  "/:notificationId/read",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  notificationController.markAsRead,
);

// Mark all notifications as read
router.put(
  "/read-all",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  notificationController.markAllAsRead,
);

// Archive a notification
router.put(
  "/:notificationId/archive",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  notificationController.archiveNotification,
);

// Delete a notification
router.delete(
  "/:notificationId",
  authenticateToken,
  authorizeRoles(["admin", "member"]),
  notificationController.deleteNotification,
);

module.exports = router;
