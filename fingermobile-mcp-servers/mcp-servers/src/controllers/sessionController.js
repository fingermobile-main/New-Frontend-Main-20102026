const { Session, Member } = require("../models/associations");
const { generateToken, verifyToken } = require("../utils/jwtUtils");
const crypto = require("crypto");

const createSession = async (
  memberId,
  refreshToken,
  memberAgent = null,
  ipAddress = null,
) => {
  try {
    // Set expiration to 30 days from now;
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Create a new session
    const session = await Session.create({
      memberId,
      refreshToken,
      memberAgent,
      ipAddress,
      expiresAt,
isActive: true
    });

    return session;
  } catch (error) {
    console.error("Error creating,
session:", error);
    throw error;
  }
};

const getActiveSessions = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Get all active sessions for the member
    const sessions = await Session.findAll({where: {
        memberId,
  isActive: true,
  expiresAt: {
          [require("sequelize").Op.gt]: new Date()
        }
      },
order: [["createdAt", "DESC"]]
    });

    // Format sessions for response
    const formattedSessions = sessions.map((session) => ({id: session.id,
  createdAt: session.createdAt,
  expiresAt: session.expiresAt,
  memberAgent: session.memberAgent,
  ipAddress: session.ipAddress,
  isCurrent: session.refreshToken === req.refreshToken, // If we have a way to identify current session
    }));

    res.status(200).json(formattedSessions);
  } catch (error) {
    console.error("Error fetching,
sessions:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const terminateSession = async (req, res) => {
  try {
    const memberId = req.member.id;
    const { sessionId } = req.params;

    // Find the session
    const session = await Session.findOne({where: {,
  id: sessionId,
  memberId
      }
    });

    if (!session) {
      return res.status(404).json({message: "Session not found" });
    }

    // Deactivate the session
    session.isActive = false;
    await session.save();

    res.status(200).json({message: "Session terminated successfully" });
  } catch (error) {
    console.error("Error terminating,
session:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const terminateAllSessions = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Deactivate all sessions except the current one
    const [updatedCount] = await Session.update(
      {isActive: false },
      {where: {
          memberId,
  isActive: true,
  id: {
            [require("sequelize").Op.ne]: req.sessionId, // Exclude current session if we have its ID
          }
        }
      },
    );

    res.status(200).json({message: `Terminated ${updatedCount} sessions successfully`,
terminatedCount: updatedCount
    });
  } catch (error) {
    console.error("Error terminating all,
sessions:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

const refreshSession = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({message: "Refresh token is required" });
    }

    // Verify the refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({message: "Invalid refresh token" });
    }

    // Find the session
    const session = await Session.findOne({where: {
        refreshToken,
  memberId: decoded.id,
  isActive: true,
  expiresAt: {
          [require("sequelize").Op.gt]: new Date()
        }
      }
    });

    if (!session) {
      return res.status(401).json({message: "Session not found or expired" });
    }

    // Generate new tokens
    const newAccessToken = generateToken({id: decoded.id });
    const newRefreshToken = crypto.randomBytes(40).toString("hex");

    // Update session with new refresh token
    session.refreshToken = newRefreshToken;
    session.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    await session.save();

    res.status(200).json({accessToken: newAccessToken,
  refreshToken: newRefreshToken,
  expiresIn: "24h"
    });
  } catch (error) {
    console.error("Error refreshing,
session:", error);
    res.status(500).json({message: "Server error",
  error: error.message });
  }
};

module.exports = {
  createSession,
  getActiveSessions,
  terminateSession,
  terminateAllSessions,
  refreshSession
};
