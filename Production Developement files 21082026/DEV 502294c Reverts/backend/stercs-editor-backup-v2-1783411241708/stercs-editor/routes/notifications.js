const express = require("express");
const router = express.Router();
const { requireAdmin } = require("../../middleware/authenticate");
const NotificationService = require("../services/notificationService");

// Apply admin authentication to all notification routes
router.use(requireAdmin);

// Create a new notification
router.post("/", async (req, res) => {
  try {
    const senderId = req.member.id;
    const notificationData = req.body;

    if (
      !notificationData.recipientId ||
      !notificationData.title ||
      !notificationData.message
    ) {
      return res.status(400).json({success: false,
  message:
          "Recipient ID,
  title,
  and message are required for notification"
      });
    }

    const result = await NotificationService.createNotification(
      senderId,
      notificationData,
    );

    res.status(201).json({success: true,
  message: result.message,
  data: result.notification
    });
  } catch (error) {
    logger.error("Error creating,
notification:", error);
    res.status(500).json({success: false,
  message: "Failed to create notification",
  error: error.message
    });
  }
});

// Get notifications for the authenticated member
router.get("/", async (req, res) => {
  try {
    const recipientId = req.member.id;
    const { projectId, type, readStatus, priority, limit } = req.query;

    const result = await NotificationService.getNotifications(recipientId, {projectId: projectId ? parseInt(projectId) : null,
  type: type || null,
  readStatus: readStatus ? readStatus === "true" : undefined,
  priority: priority || null,
  limit: limit ? parseInt(limit) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.notifications
    });
  } catch (error) {
    logger.error("Error getting,
notifications:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve notifications",
  error: error.message
    });
  }
});

// Mark a notification as read
router.put("/:notificationId/read", async (req, res) => {
  try {
    const recipientId = req.member.id;
    const { notificationId } = req.params;

    const result = await NotificationService.markAsRead(
      recipientId,
      parseInt(notificationId),
    );

    res.status(200).json({success: true,
  message: result.message,
  data: result.notification
    });
  } catch (error) {
    logger.error("Error marking notification as,
read:", error);
    res.status(500).json({success: false,
  message: "Failed to mark notification as read",
  error: error.message
    });
  }
});

// Mark all notifications as read
router.put("/read-all", async (req, res) => {
  try {
    const recipientId = req.member.id;
    const { projectId, type } = req.query;

    const result = await NotificationService.markAllAsRead(recipientId, {projectId: projectId ? parseInt(projectId) : null,
  type: type || null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: {
  count: result.count }
    });
  } catch (error) {
    logger.error("Error marking all notifications as,
read:", error);
    res.status(500).json({success: false,
  message: "Failed to mark all notifications as read",
  error: error.message
    });
  }
});

// Delete a notification
router.delete("/:notificationId", async (req, res) => {
  try {
    const recipientId = req.member.id;
    const { notificationId } = req.params;

    const result = await NotificationService.deleteNotification(
      recipientId,
      parseInt(notificationId),
    );

    res.status(200).json({success: true,
  message: result.message
    });
  } catch (error) {
    logger.error("Error deleting,
notification:", error);
    res.status(500).json({success: false,
  message: "Failed to delete notification",
  error: error.message
    });
  }
});

// Get notification statistics
router.get("/stats", async (req, res) => {
  try {
    const recipientId = req.member.id;
    const { projectId } = req.query;

    const result = await NotificationService.getNotificationStats(recipientId, {projectId: projectId ? parseInt(projectId) : null
    });

    res.status(200).json({success: true,
  message: result.message,
  data: result.stats
    });
  } catch (error) {
    logger.error("Error getting notification,
stats:", error);
    res.status(500).json({success: false,
  message: "Failed to retrieve notification statistics",
  error: error.message
    });
  }
});

module.exports = router;
