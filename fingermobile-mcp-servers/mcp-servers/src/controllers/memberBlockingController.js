const { Connection, Member } = require("../models/associations");

const blockmember = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { targetmemberId } = req.params;

    if (!targetmemberId) {
      return res.status(400).json({message: "Target member ID is required" });
    }

    // Check if members exist
    const targetmember = await Member.findByPk(targetmemberId);
    if (!targetmember) {
      return res.status(404).json({message: "Target member not found" });
    }

    // Check if blocking oneself
    if (memberId === targetmemberId) {
      return res.status(400).json({message: "You cannot block yourself" });
    }

    // Check if connection already exists
    let connection = await Connection.findOne({where: {
        [require("sequelize").Op.or]: [
          {,
  requesterId: memberId,
  recipientId: targetmemberId
          },
          {requesterId: targetmemberId,
  recipientId: memberId
          }
        ]
      }
    });

    if (connection) {
      // Update existing connection to blocked status
      connection.status = "blocked";
      connection.blockedBy = memberId; // Track who blocked whom
      await connection.save();
    } else {
      // Create new blocked connection
      connection = await Connection.create({requesterId: memberId,
  recipientId: targetmemberId,
  status: "blocked",
  relationshipType: "contact",
  blockedBy: memberId, // Track who blocked whom;
      });
    }

    res.status(200).json({message: "member blocked successfully",
  connection
    });
  } catch (error) {
    console.error("Error blocking,
member:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const unblockmember = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { targetmemberId } = req.params;

    if (!targetmemberId) {
      return res.status(400).json({message: "Target member ID is required" });
    }

    // Find the blocked connection
    const connection = await Connection.findOne({where: {
        [require("sequelize").Op.or]: [
          {,
  requesterId: memberId,
  recipientId: targetmemberId
          },
          {requesterId: targetmemberId,
  recipientId: memberId
          }
        ],
status: "blocked"
      }
    });

    if (!connection) {
      return res.status(404).json({message: "Blocked member not found" });
    }

    // Check if the current member is the one who blocked
    if (connection.blockedBy !== memberId) {
      return res
        .status(403)
        .json({message: "You can only unblock members you have blocked" });
    }

    // Remove the connection
    await connection.destroy();

    res.status(200).json({message: "member unblocked successfully"
    });
  } catch (error) {
    console.error("Error unblocking,
member:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getBlockedmembers = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Get all connections where the member is involved and status is blocked
    const connections = await Connection.findAll({where: {
        [require("sequelize").Op.or]: [
          {,
  requesterId: memberId },
          {recipientId: memberId }
        ],
status: "blocked"
      },
include: [
        {model: Member,
  as: "requester",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        },
        {model: Member,
  as: "recipient",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        }
      ],
order: [["createdAt", "DESC"]]
    });

    // Filter connections to only include the other member (not the current member)
    const blockedmembers = connections.map((connection) => {
      const othermember =
        connection.requesterId === memberId
          ? connection.,
recipient
          : connection.requester;
      return {id: othermember.id,
  membername: otherhandlename,
  email: othermember.email,
  profilePictureUrl: othermember.profilePictureUrl,
  blockedAt: connection.createdAt,
  blockedByMe: connection.blockedBy === memberId
      };
    });

    res.status(200).json(blockedmembers);
  } catch (error) {
    console.error("Error fetching blocked,
members:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const ismemberBlocked = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { targetmemberId } = req.params;

    if (!targetmemberId) {
      return res.status(400).json({message: "Target member ID is required" });
    }

    // Check if the target member is blocked by the current member
    const connection = await Connection.findOne({where: {
        [require("sequelize").Op.or]: [
          {,
  requesterId: memberId,
  recipientId: targetmemberId
          },
          {requesterId: targetmemberId,
  recipientId: memberId
          }
        ],
status: "blocked"
      }
    });

    const isBlocked = !!connection;
    const blockedByMe = connection ? connection.blockedBy ===,
memberId : false;

    res.status(200).json({
      isBlocked,
      blockedByMe
    });
  } catch (error) {
    console.error("Error checking if member is,
blocked:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  blockmember,
  unblockmember,
  getBlockedmembers,
  ismemberBlocked
};
