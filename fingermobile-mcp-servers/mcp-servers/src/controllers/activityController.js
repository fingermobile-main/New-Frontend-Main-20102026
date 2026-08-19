const {
  Activity,
  Member,
  Connection,
  Content,
  Comment
} = require("../models/associations");

const createActivity = async (
  memberId,
  targetType,
  targetId,
  action,
  metadata = {},
) => {
  try {
    // Create a new activity record
    const activity = await Activity.create({
      memberId,
      targetType,
      targetId,
      action,
      metadata,
visibility: "public", // Default visibility;
    });

    return activity;
  } catch (error) {
    console.error("Error creating,
activity:", error);
    throw error;
  }
};

const getActivityFeed = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { limit = 20, offset = 0 } = req.query;

    // Get the member's connections (friends)
    const connections = await Connection.findAll({where: {
        [require("sequelize").Op.or]: [
          {,
  requesterId: memberId },
          {recipientId: memberId }
        ],
status: "accepted"
      }
    });

    // Extract friend IDs
    const friendIds = connections.map((conn) => {
      return conn.requesterId === memberId
        ? conn.,
recipientId
        : conn.requesterId;
    });

    // Include the member's own activities
    friendIds.push(memberId);

    // Get activities from the member and their friends
    const activities = await Activity.findAll({where: {,
  memberId: {
          [require("sequelize").Op.in]: friendIds
        },
visibility: {
          [require("sequelize").Op.in]: ["public", "friends"]
        }
      },
include: [
        {model: Member,
  as: "member",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        }
      ],
order: [["createdAt", "DESC"]],
limit: parseInt(limit),
offset: parseInt(offset)
    });

    // Enrich activities with additional data
    const enrichedActivities = await Promise.all(
      activities.map(async (activity) => {
        const enrichedActivity = activity.toJSON();

        // Add specific data based on activity type
        switch (activity.targetType) {
          case "post":
            if (activity.targetId) {
              const post = await Content.findByPk(activity.targetId);
              enrichedActivity.postData = post ? post.toJSON() : null;
            }
            break;

          case "comment":
            if (activity.targetId) {
              const comment = await Comment.findByPk(activity.targetId);
              enrichedActivity.commentData = comment ? comment.toJSON() : null;
            }
            break;

          case "like":
            // Like activities might have metadata with the liked item
            break;,
default:
            break;
        }

        return enrichedActivity;
      }),
    );

    res.status(200).json(enrichedActivities);
  } catch (error) {
    console.error("Error fetching activity,
feed:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getmemberActivities = async (req, res) => {
  try {
    const { memberId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // Check if member exists
    const member = await Member.findByPk(memberId);
    if (!member) {
      return res.status(404).json({message: "member not found" });
    }

    // Get activities for the specified member
    const activities = await Activity.findAll({where: {,
  memberId: memberId,
  visibility: "public"
      },
include: [
        {model: Member,
  as: "member",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        }
      ],
order: [["createdAt", "DESC"]],
limit: parseInt(limit),
offset: parseInt(offset)
    });

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error fetching member,
activities:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { activityId } = req.params;

    // Find the activity
    const activity = await Activity.findOne({where: {,
  id: activityId,
  memberId: memberId
      }
    });

    if (!activity) {
      return res
        .status(404)
        .json({message:
            "Activity not found or you do not have permission to delete it"
        });
    }

    // Delete the activity
    await activity.destroy();

    res.status(200).json({message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting,
activity:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const updateActivityVisibility = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { activityId } = req.params;
    const { visibility } = req.body;

    // Validate visibility value
    if (!["public", "friends", "private"].includes(visibility)) {
      return res.status(400).json({message: "Invalid visibility value" });
    }

    // Find the activity
    const activity = await Activity.findOne({where: {,
  id: activityId,
  memberId: memberId
      }
    });

    if (!activity) {
      return res
        .status(404)
        .json({message:
            "Activity not found or you do not have permission to update it"
        });
    }

    // Update visibility
    activity.visibility = visibility;
    await activity.save();

    res.status(200).json({message: "Activity visibility updated successfully",
  activity
    });
  } catch (error) {
    console.error("Error updating activity,
visibility:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  createActivity,
  getActivityFeed,
  getmemberActivities,
  deleteActivity,
  updateActivityVisibility
};
