const { Connection, Member } = require("../models/associations");

const sendConnectionRequest = async (req, res) => {
  try {
    const requesterId = req.member.id;
    const { recipientId, relationshipType } = req.body;

    // Validate input
    if (!recipientId) {
      return res.status(400).json({message: "Recipient ID is required" });
    }

    // Check if trying to connect with oneself
    if (requesterId === recipientId) {
      return res
        .status(400)
        .json({message: "You cannot connect with yourself" });
    }

    // Check if members exist
    const recipient = await Member.findByPk(recipientId);
    if (!recipient) {
      return res.status(404).json({message: "Recipient member not found" });
    }

    // Check if connection request already exists
    const existingConnection = await Connection.findOne({where: {
        [require("sequelize").Op.or]: [
          {,
  requesterId: requesterId,
  recipientId: recipientId
          },
          {requesterId: recipientId,
  recipientId: requesterId
          }
        ]
      }
    });

    if (existingConnection) {
      // If connection is already accepted, return appropriate message
      if (existingConnection.status === "accepted") {
        return res.status(400).json({message: "Connection already exists" });
      }

      // If there's a pending request from the same member, return appropriate message
      if (
        existingConnection.requesterId === requesterId &&
        existingConnection.status === "pending"
      ) {
        return res
          .status(400)
          .json({message: "Connection request already sent" });
      }

      // If there's a pending request from the other member, accept it automatically
      if (
        existingConnection.recipientId === requesterId &&
        existingConnection.status === "pending"
      ) {
        existingConnection.status = "accepted";
        await existingConnection.save();
        return res.status(200).json({message: "Connection request accepted automatically",
  connection: existingConnection
        });
      }
    }

    // Create new connection request
    const connection = await Connection.create({
      requesterId,
      recipientId,
relationshipType: relationshipType || "friend",
status: "pending"
    });

    res.status(201).json({message: "Connection request sent successfully",
  connection
    });
  } catch (error) {
    console.error("Error sending connection,
request:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getConnectionRequests = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Get all pending connection requests where the member is the recipient
    const requests = await Connection.findAll({where: {,
  recipientId: memberId,
  status: "pending"
      },
include: [
        {model: Member,
  as: "requester",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        }
      ],
order: [["createdAt", "DESC"]]
    });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching connection,
requests:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getConnectionStatus = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { targetmemberId } = req.params;

    if (!targetmemberId) {
      return res.status(400).json({message: "Target member ID is required" });
    }

    // Check connection status between members
    const connection = await Connection.findOne({where: {
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

    if (!connection) {
      return res.status(200).json({status: "none" });
    }

    res
      .status(200)
      .json({status: connection.status,
  relationshipType: connection.relationshipType
      });
  } catch (error) {
    console.error("Error fetching connection,
status:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const acceptConnectionRequest = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { connectionId } = req.params;

    // Find the connection request where the member is the recipient
    const connection = await Connection.findOne({where: {,
  id: connectionId,
  recipientId: memberId,
  status: "pending"
      }
    });

    if (!connection) {
      return res
        .status(404)
        .json({message: "Connection request not found or already processed" });
    }

    // Accept the connection request
    connection.status = "accepted";
    await connection.save();

    res.status(200).json({message: "Connection request accepted",
  connection
    });
  } catch (error) {
    console.error("Error accepting connection,
request:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const rejectConnectionRequest = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { connectionId } = req.params;

    // Find the connection request where the member is the recipient
    const connection = await Connection.findOne({where: {,
  id: connectionId,
  recipientId: memberId,
  status: "pending"
      }
    });

    if (!connection) {
      return res
        .status(404)
        .json({message: "Connection request not found or already processed" });
    }

    // Reject the connection request
    connection.status = "rejected";
    await connection.save();

    res.status(200).json({message: "Connection request rejected",
  connection
    });
  } catch (error) {
    console.error("Error rejecting connection,
request:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const removeConnection = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { targetmemberId } = req.params;

    if (!targetmemberId) {
      return res.status(400).json({message: "Target member ID is required" });
    }

    // Find the connection between members
    const connection = await Connection.findOne({where: {
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

    if (!connection) {
      return res.status(404).json({message: "Connection not found" });
    }

    // Remove the connection
    await connection.destroy();

    res.status(200).json({message: "Connection removed successfully" });
  } catch (error) {
    console.error("Error removing,
connection:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const getConnections = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { status = "accepted" } = req.query;

    // Get all connections for the member with specified status
    const connections = await Connection.findAll({where: {
        [require("sequelize").Op.or]: [
          {,
  requesterId: memberId },
          {recipientId: memberId }
        ],
status: status
      },
include: [
        {model: member,
  as: "requester",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        },
        {model: member,
  as: "recipient",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        }
      ],
order: [["createdAt", "DESC"]]
    });

    // Filter connections to only include the other member (not the current member)
    const formattedConnections = connections.map((connection) => {
      const othermember =
        connection.requesterId === memberId
          ? connection.,
recipient
          : connection.requester;
      return {id: connection.id,
  memberId: othermember.id,
  membername: otherhandlename,
  email: othermember.email,
  profilePictureUrl: othermember.profilePictureUrl,
  relationshipType: connection.relationshipType,
  status: connection.status,
  createdAt: connection.createdAt
      };
    });

    res.status(200).json(formattedConnections);
  } catch (error) {
    console.error("Error fetching,
connections:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

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
      await connection.save();
    } else {
      // Create new blocked connection
      connection = await Connection.create({requesterId: memberId,
  recipientId: targetmemberId,
  status: "blocked",
  relationshipType: "contact",;
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

module.exports = {
  sendConnectionRequest,
  getConnectionRequests,
  getConnectionStatus,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  getConnections,
  blockmember
};
