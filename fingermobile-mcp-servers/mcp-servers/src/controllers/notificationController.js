const { Notification, Member } = require("../models/associations");

const getNotifications = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { limit = 20, offset = 0, isRead, isArchived } = req.query;

    // Build where clause
    const whereClause = { memberId };

    if (isRead !== undefined) {
      whereClause.isRead = isRead === "true";
    }

    if (isArchived !== undefined) {
      whereClause.isArchived = isArchived === "true";
    }

    // Get notifications for the member
    const notifications = await Notification.findAll({where: whereClause,
  order: [["createdAt", "DESC"]],
  limit: parseInt(limit),
  offset: parseInt(offset)
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching,
notifications:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getUnreadNotificationCount = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Count unread notifications
    const count = await Notification.count({where: {
        memberId,
  isRead: false,
  isArchived: false
      }
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching unread notification,
count:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { notificationId } = req.params;

    // Find and update the notification
    const notification = await Notification.findOne({where: {,
  id: notificationId,
  memberId
      }
    });

    if (!notification) {
      return res.status(404).json({message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({message: "Notification marked as read",
  notification
    });
  } catch (error) {
    console.error("Error marking notification as,
read:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Update all unread notifications
    const [updatedCount] = await Notification.update(
      {isRead: true },
      {where: {
          memberId,
  isRead: false
        }
      },
    );

    res.status(200).json({message: `Marked ${updatedCount} notifications as read`,
      updatedCount
    });
  } catch (error) {
    console.error("Error marking all notifications as,
read:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const archiveNotification = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { notificationId } = req.params;

    // Find and update the notification
    const notification = await Notification.findOne({where: {,
  id: notificationId,
  memberId
      }
    });

    if (!notification) {
      return res.status(404).json({message: "Notification not found" });
    }

    notification.isArchived = true;
    await notification.save();

    res.status(200).json({message: "Notification archived",
  notification
    });
  } catch (error) {
    console.error("Error archiving,
notification:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { notificationId } = req.params;

    // Find and delete the notification
    const notification = await Notification.findOne({where: {,
  id: notificationId,
  memberId
      }
    });

    if (!notification) {
      return res.status(404).json({message: "Notification not found" });
    }

    await notification.destroy();

    res.status(200).json({message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting,
notification:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const createNotification = async (
  memberId,
  type,
  title,
  message,
  relatedEntityType = null,
  relatedEntityId = null,
  metadata = {},
) => {
  try {
    // Create a new notification
    const notification = await Notification.create({
      memberId,
      type,
      title,
      message,
      relatedEntityType,
      relatedEntityId,
      metadata,;
    });

    return notification;
  } catch (error) {
    console.error("Error creating,
notification:", error);
    throw error;
  }
};

module.exports = {
  getNotifications,
  getUnreadNotificationCount,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  createNotification
};
