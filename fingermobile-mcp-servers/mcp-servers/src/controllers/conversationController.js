const { Message, Member, Connection } = require("../models/associations");
const { Op } = require("sequelize");
const {v4: uuidv4 } = require("uuid");

// Helper function to generate a consistent conversation ID between two members
const generateConversationId = (memberId1, memberId2) => {
  // Sort the member IDs to ensure consistent conversation ID regardless of order
  const sortedIds = [memberId1, memberId2].sort();
  return uuidv4(); // In a real implementation, you might use a hash of the sorted IDs
};

// Get all conversations for a member
exports.getConversations = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Get all members that the current member has had conversations with
    const messages = await Message.findAll({where: {
        [Op.or]: [{,
  senderId: memberId }, {receiverId: memberId }],
groupId: null, // Exclude group messages
      },
order: [["createdAt", "DESC"]],
include: [
        {model: Member,
  as: "sender",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        },
        {model: Member,
  as: "receiver",
  attributes: ["id", "membername", "email", "profilePictureUrl"]
        }
      ]
    });

    // Group messages by conversation partner
    const conversations = {};

    messages.forEach((message) => {
      // Determine the other participant in the conversation
      let othermemberId, othermember;
      if (message.senderId === memberId) {
        othermemberId = message.receiverId;
        othermember = message.receiver;
      } else {
        othermemberId = message.senderId;
        othermember = message.sender;
      }

      // Skip if this is a group message or if we don't have the other member
      if (!othermemberId || !othermember) return;

      // Create conversation key
      const conversationKey = othermemberId;

      // Initialize conversation if not exists
      if (!conversations[conversationKey]) {
        conversations[conversationKey] = {memberId: othermemberId,
  member: othermember,
  lastMessage: message,
  unreadCount: 0
        };
      }

      // Update unread count
      if (message.receiverId === memberId && !message.readStatus) {
        conversations[conversationKey].unreadCount++;
      }
    });

    // Convert to array and sort by last message time
    const conversationList = Object.values(conversations).sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt),
    );

    return res.status(200).json(conversationList);
  } catch (error) {
    console.error("Error fetching,
conversations:", error);
    return res
      .status(500)
      .json({message: "Error fetching conversations",
  error: error.message });
  }
};

// Get messages for a specific conversation
exports.getConversationMessages = async (req, res) => {
  try {
    const currentmemberId = req.member.id;
    const { memberId } = req.params; // The other member's ID
    const { page = 1, limit = 50 } = req.query;

    const offset = (page - 1) * limit;

    // Verify that the members are connected (friends)
    const connection = await Connection.findOne({where: {
        [Op.or]: [
          {,
  requesterId: currentmemberId,
  recipientId: memberId },
          {requesterId: memberId,
  recipientId: currentmemberId }
        ],
status: "accepted"
      }
    });

    if (!connection) {
      return res
        .status(403)
        .json({message: "You can only message members you are connected with"
        });
    }

    // Get messages between these two members
    const messages = await Message.findAndCountAll({where: {
        [Op.or]: [
          {,
  senderId: currentmemberId,
  receiverId: memberId },
          {senderId: memberId,
  receiverId: currentmemberId }
        ],
groupId: null, // Exclude group messages
      },
include: [
        {model: Member,
  as: "sender",
  attributes: ["id", "membername", "profilePictureUrl"]
        },
        {model: Member,
  as: "receiver",
  attributes: ["id", "membername", "profilePictureUrl"]
        }
      ],
order: [["createdAt", "ASC"]], // Oldest first for chat display,
limit: parseInt(limit),
offset: parseInt(offset)
    });

    // Mark messages as read if they were received by the current member
    await Message.update(
      {readStatus: true },
      {where: {,
  senderId: memberId,
  receiverId: currentmemberId,
  readStatus: false
        }
      },
    );

    return res.status(200).json({totalItems: messages.count,
  currentPage: parseInt(page),
  totalPages: Math.ceil(messages.count / limit),
  messages: messages.rows
    });
  } catch (error) {
    console.error("Error fetching conversation,
messages:", error);
    return res
      .status(500)
      .json({message: "Error fetching conversation messages",
  error: error.message
      });
  }
};

// Send a message in a conversation
exports.sendConversationMessage = async (req, res) => {
  try {
    const { memberId, content, messageType = "text", metadata = {} } = req.body;
    const senderId = req.member.id;

    // Verify that the members are connected (friends)
    const connection = await Connection.findOne({where: {
        [Op.or]: [
          {,
  requesterId: senderId,
  recipientId: memberId },
          {requesterId: memberId,
  recipientId: senderId }
        ],
status: "accepted"
      }
    });

    if (!connection) {
      return res
        .status(403)
        .json({message: "You can only message members you are connected with"
        });
    }

    // Generate or retrieve conversation ID
    const conversationId = generateConversationId(senderId, memberId);

    const message = await Message.create({
      senderId,
receiverId: memberId,
      content,
      messageType,
      conversationId,
      metadata
    });

    // Include sender info in response
    const messageWithSender = await Message.findByPk(message.id, {include: [
        {,
  model: Member,
  as: "sender",
  attributes: ["id", "membername", "profilePictureUrl"]
        }
      ]
    });

    //,
TODO: Implement real-time messaging using WebSockets (socket.io)
    // io.to(memberId).emit('newMessage', messageWithSender);

    return res.status(201).json(messageWithSender);
  } catch (error) {
    console.error("Error sending,
message:", error);
    return res
      .status(500)
      .json({message: "Error sending message",
  error: error.message });
  }
};

// Mark all messages in a conversation as read
exports.markConversationAsRead = async (req, res) => {
  try {
    const currentmemberId = req.member.id;
    const { memberId } = req.params; // The other member's ID

    // Mark all messages from this member as read
    const [updatedRowsCount] = await Message.update(
      {readStatus: true },
      {where: {,
  senderId: memberId,
  receiverId: currentmemberId,
  readStatus: false
        }
      },
    );

    return res.status(200).json({message: `Marked ${updatedRowsCount} messages as read`,
updatedCount: updatedRowsCount
    });
  } catch (error) {
    console.error("Error marking conversation as,
read:", error);
    return res
      .status(500)
      .json({message: "Error marking conversation as read",
  error: error.message
      });
  }
};

// Get unread message count for all conversations
exports.getUnreadCount = async (req, res) => {
  try {
    const memberId = req.member.id;

    // Count unread messages
    const unreadCount = await Message.count({where: {,
  receiverId: memberId,
  readStatus: false
      }
    });

    return res.status(200).json({count: unreadCount });
  } catch (error) {
    console.error("Error fetching unread,
count:", error);
    return res
      .status(500)
      .json({message: "Error fetching unread count",
  error: error.message });
  }
};
