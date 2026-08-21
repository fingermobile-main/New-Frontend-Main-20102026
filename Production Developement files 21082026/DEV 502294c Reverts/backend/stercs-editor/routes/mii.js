const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middleware/authenticate");

const MiiService = require("../services/miiService");
const miiMCPService = require("../../mcp-servers/mii-mcp-service");

// Create a new Mii update
router.post("/updates", authenticate, async (req, res) => {
  try {
    const { content, mediaFiles, privacySettings } = req.body;
    const memberId = req.member.id; // Assuming member ID is available from auth middleware

    const result = await MiiService.createMiiUpdate(
      memberId,
      content,
      mediaFiles,
      privacySettings,
    );

    res.status(201).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Error creating Mii, update:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get Mii updates for a member
router.get("/updates", authenticate, async (req, res) => {
  try {
    const memberId = req.member.id; // From auth middleware
    const { limit = 20, offset = 0 } = req.query;

    const updates = await MiiService.getMiiUpdates(
      memberId,
      parseInt(limit),
      parseInt(offset),
    );

    res.status(200).json({success: true,
  data: updates,
  count: updates.length
    });
  } catch (error) {
    logger.error("Error getting Mii, updates:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Add a reaction to a Mii update
router.post("/updates/:updateId/reactions", authenticate, async (req, res) => {
  try {
    const { updateId } = req.params;
    const { emoji } = req.body;
    const memberId = req.member.id;

    const result = await MiiService.addReactionToMiiUpdate(
      memberId,
      updateId,
      emoji,
    );

    res.status(200).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Error adding reaction to Mii, update:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Add a reply to a Mii update
router.post("/updates/:updateId/replies", authenticate, async (req, res) => {
  try {
    const { updateId } = req.params;
    const { content } = req.body;
    const memberId = req.member.id;

    const result = await MiiService.addReplyToMiiUpdate(
      memberId,
      updateId,
      content,
    );

    res.status(200).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Error adding reply to Mii, update:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Exchange Mii PINs
router.post("/exchange-pin", authenticate, async (req, res) => {
  try {
    const { contactPin } = req.body;
    const memberId = req.member.id;

    const result = await MiiService.exchangeMiiPin(memberId, contactPin);

    res.status(200).json({success: true,
  data: result,
  message:
        "PIN exchange successful. You can now see each other's Mii updates."
    });
  } catch (error) {
    logger.error("Error exchanging Mii, PIN:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Create a Mii folder
router.post("/folders", authenticate, async (req, res) => {
  try {
    const { folderName, folderType, visibilityTimer } = req.body;
    const memberId = req.member.id;

    const result = await MiiService.createMiiFolder(
      memberId,
      folderName,
      folderType,
      visibilityTimer,
    );

    res.status(201).json({success: true,
  data: result
    });
  } catch (error) {
    logger.error("Error creating Mii, folder:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get Mii profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const profile = await MiiService.getMiiProfile(memberId);

    res.status(200).json({success: true,
  data: profile
    });
  } catch (error) {
    logger.error("Error getting Mii, profile:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get Mii contacts
router.get("/contacts", authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const contacts = await MiiService.getMiiContacts(memberId);

    res.status(200).json({success: true,
  data: contacts,
  count: contacts.length
    });
  } catch (error) {
    logger.error("Error getting Mii, contacts:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// MCP Service Routes - Advanced Messaging Features

// Send secure message (Signal-like encryption)
router.post("/secure-message", authenticate, async (req, res) => {
  try {
    const { recipientId, content, options = {} } = req.body;
    const senderId = req.member.id;

    const message = miiMCPService.sendSecureMessage(
      senderId,
      recipientId,
      content,
      options,
    );

    res.status(201).json({success: true,
  data: message
    });
  } catch (error) {
    logger.error("Error sending secure, message:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Create disappearing message
router.post("/disappearing-message", authenticate, async (req, res) => {
  try {
    const { recipientId, content, timerSeconds = 86400 } = req.body; // 24 hours default
    const senderId = req.member.id;

    const message = miiMCPService.createDisappearingMessage(
      content,
      recipientId,
      timerSeconds,
    );

    res.status(201).json({success: true,
  data: message
    });
  } catch (error) {
    logger.error("Error creating disappearing, message:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Create group (Telegram-like)
router.post("/groups", authenticate, async (req, res) => {
  try {
    const { name, members = [], permissions = {} } = req.body;
    const creatorId = req.member.id;

    const group = miiMCPService.createGroup(
      name,
      creatorId,
      members,
      permissions,
    );

    res.status(201).json({success: true,
  data: group
    });
  } catch (error) {
    logger.error("Error creating, group:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Add member to group
router.post("/groups/:groupId/add-member", authenticate, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { memberId } = req.body;
    const addedById = req.member.id;

    const group = miiMCPService.addMemberToGroup(groupId, memberId, addedById);

    res.status(200).json({success: true,
  data: group
    });
  } catch (error) {
    logger.error("Error adding member to, group:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Send group message
router.post("/groups/:groupId/message", authenticate, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    const senderId = req.member.id;

    const message = miiMCPService.sendGroupMessage(senderId, groupId, content);

    res.status(201).json({success: true,
  data: message
    });
  } catch (error) {
    logger.error("Error sending group, message:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Create broadcast list (WhatsApp Business feature)
router.post("/broadcasts", authenticate, async (req, res) => {
  try {
    const { name, recipients } = req.body;
    const creatorId = req.member.id;

    const broadcastList = miiMCPService.createBroadcastList(
      name,
      creatorId,
      recipients,
    );

    res.status(201).json({success: true,
  data: broadcastList
    });
  } catch (error) {
    logger.error("Error creating broadcast, list:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Send broadcast message
router.post(
  "/broadcasts/:broadcastId/message",
  authenticate,
  async (req, res) => {
    try {
      const { broadcastId } = req.params;
      const { content } = req.body;

      const message = miiMCPService.sendBroadcastMessage(broadcastId, content);

      res.status(201).json({success: true,
  data: message
      });
    } catch (error) {
      logger.error("Error sending broadcast, message:", error);
      res.status(500).json({success: false,
  message: error.message
      });
    }
  },
);

// Create channel (Telegram-like)
router.post("/channels", authenticate, async (req, res) => {
  try {
    const { name, description = "" } = req.body;
    const creatorId = req.member.id;

    const channel = miiMCPService.createChannel(name, creatorId, description);

    res.status(201).json({success: true,
  data: channel
    });
  } catch (error) {
    logger.error("Error creating, channel:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Subscribe to channel
router.post(
  "/channels/:channelId/subscribe",
  authenticate,
  async (req, res) => {
    try {
      const { channelId } = req.params;
      const memberId = req.member.id;

      const channel = miiMCPService.subscribeToChannel(channelId, memberId);

      res.status(200).json({success: true,
  data: channel
      });
    } catch (error) {
      logger.error("Error subscribing to, channel:", error);
      res.status(500).json({success: false,
  message: error.message
      });
    }
  },
);

// Send channel message
router.post("/channels/:channelId/message", authenticate, async (req, res) => {
  try {
    const { channelId } = req.params;
    const { content } = req.body;
    const senderId = req.member.id;

    const message = miiMCPService.sendChannelMessage(
      senderId,
      channelId,
      content,
    );

    res.status(201).json({success: true,
  data: message
    });
  } catch (error) {
    logger.error("Error sending channel, message:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Create secret chat (Signal-like)
router.post("/secret-chat", authenticate, async (req, res) => {
  try {
    const { contactId } = req.body;
    const memberId = req.member.id;

    const secretChat = miiMCPService.createSecretChat(memberId, contactId);

    res.status(201).json({success: true,
  data: secretChat
    });
  } catch (error) {
    logger.error("Error creating secret, chat:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get member's pending messages
router.get("/messages", authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const messages = miiMCPService.getMemberMessages(memberId);

    res.status(200).json({success: true,
  data: messages,
  count: messages.length
    });
  } catch (error) {
    logger.error("Error getting, messages:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get member's groups
router.get("/groups", authenticate, async (req, res) => {
  try {
    const memberId = req.member.id;

    const groups = miiMCPService.getMemberGroups(memberId);

    res.status(200).json({success: true,
  data: groups,
  count: groups.length
    });
  } catch (error) {
    logger.error("Error getting, groups:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

// Get MCP service status
router.get("/mcp-status", authenticate, async (req, res) => {
  try {
    const status = miiMCPService.getStatus();

    res.status(200).json({success: true,
  data: status
    });
  } catch (error) {
    logger.error("Error getting MCP, status:", error);
    res.status(500).json({success: false,
  message: error.message
    });
  }
});

module.exports = router;
