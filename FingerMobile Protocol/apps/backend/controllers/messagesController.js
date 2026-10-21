/**
 * MessagesController - Complete Implementation
 * Updated to use Sequelize models with conversations
 */

const { Message } = require('../models/Message');
// Removed unused Conversation import
const { Op } = require('sequelize');
const logger = require('../utils/logger');

// Import User model - using dynamic import to avoid circular dependencies
let User;
const getUserModel = () => {
  if (!User) {
    User = require('../models/User');
  }
  return User;
};

class MessagesController {
  /**
   * GET /api/messages/conversations
   * Get member's conversations
   */
  async getConversations(req, res) {
    try {
      const memberId = req.user?.id || req.member?.id; // Handle both user and member patterns

      if (!memberId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Get all messages where the member is either sender or receiver
      // Group by conversation or by the other party in direct messages
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: memberId },
            { receiverId: memberId }
          ]
        },
        order: [['sentAt', 'DESC']],
        limit: 100 // Limit to prevent excessive data
      });

      // Group messages by conversation partner for direct messages
      const conversationMap = {};
      messages.forEach(msg => {
        // For direct messages, identify the other party
        const otherMemberId = msg.senderId === memberId ? msg.receiverId : msg.senderId;

        if (!conversationMap[otherMemberId]) {
          conversationMap[otherMemberId] = {
            id: otherMemberId,
            lastMessage: msg.content,
            updatedAt: msg.sentAt,
            unreadCount: 0,
            participants: [msg.senderId, msg.receiverId]
          };
        } else if (new Date(msg.sentAt) > new Date(conversationMap[otherMemberId].updatedAt)) {
          conversationMap[otherMemberId].lastMessage = msg.content;
          conversationMap[otherMemberId].updatedAt = msg.sentAt;
        }
      });

      // Count unread messages for each conversation
      const unreadMessages = await Message.findAll({
        where: {
          receiverId: memberId,
          isRead: false
        }
      });

      Object.values(conversationMap).forEach(conv => {
        const unreadForThisUser = unreadMessages.filter(msg =>
          msg.senderId === conv.id &&
          msg.receiverId === memberId &&
          !msg.isRead
        ).length;
        conv.unreadCount = unreadForThisUser;
      });

      // Fetch user details for conversation partners
      const otherUserIds = Object.keys(conversationMap);
      const User = getUserModel();
      const users = await User.findAll({
        where: { id: otherUserIds }
      });
      const userLookup = {};
      users.forEach(u => {
        userLookup[u.id] = u;
      });

      // Format as conversation objects
      const conversations = Object.values(conversationMap).map(conv => {
        const u = userLookup[conv.id];
        const participantName = u ? `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username : `User ${conv.id}`;
        return {
          id: String(conv.id),
          participants: [{
            id: String(conv.id),
            username: u ? u.username : `user_${conv.id}`,
            name: participantName,
            avatar: u?.avatarUrl || `https://picsum.photos/seed/user${conv.id}/100/100`
          }],
          name: participantName,
          avatarUrl: u?.avatarUrl || `https://picsum.photos/seed/user${conv.id}/100/100`,
          lastMessage: conv.lastMessage,
          updatedAt: conv.updatedAt,
          unreadCount: conv.unreadCount
        };
      });

      res.json({
        success: true,
        data: conversations
      });
    } catch (err) {
      logger.error('Error in getConversations:', err);
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }

  /**
   * GET /api/messages/conversations/:otherMemberId
   * Get messages with a specific member
   */
  async getConversationMessages(req, res) {
    try {
      const memberId = req.user?.id || req.member?.id; // Handle both user and member patterns
      const otherMemberId = req.params.otherMemberId;
      const { limit = 50, offset = 0 } = req.query;

      if (!memberId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Check if other member exists
      const User = getUserModel();
      const otherMember = await User.findByPk(otherMemberId);
      if (!otherMember) {
        return res.status(404).json({
          success: false,
          error: 'Other member not found'
        });
      }

      // Get messages between the two members
      const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: memberId, receiverId: otherMemberId },
            { senderId: otherMemberId, receiverId: memberId }
          ]
        },
        order: [['sentAt', 'ASC']], // Oldest first for chat display
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // Mark messages as read if the current member is the receiver
      await Message.update(
        { isRead: true, readAt: new Date() },
        {
          where: {
            senderId: otherMemberId,
            receiverId: memberId,
            isRead: false
          }
        }
      );

      res.json({
        success: true,
        data: messages
      });
    } catch (err) {
      logger.error('Error in getConversationMessages:', err);
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }

  /**
   * POST /api/messages
   * Send a new message
   */
  async create(req, res) {
    try {
      const senderId = req.user?.id || req.member?.id; // Handle both user and member patterns
      const recipientId = req.body.recipient_id || req.body.receiver_id || req.body.receiverId;
      const { content, subject, message_type = 'text' } = req.body;

      if (!senderId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Validate inputs
      if (!recipientId || !content) {
        return res.status(400).json({
          success: false,
          error: 'Recipient ID and content are required'
        });
      }

      // Check if recipient exists
      const User = getUserModel();
      const recipient = await User.findByPk(Number(recipientId));
      if (!recipient) {
        return res.status(404).json({
          success: false,
          error: 'Recipient not found'
        });
      }

      // Check if sender and recipient are the same
      if (Number(senderId) === Number(recipientId)) {
        return res.status(400).json({
          success: false,
          error: 'Cannot send message to yourself'
        });
      }

      // Create the message
      const conversationId = req.body.conversation_id || req.body.conversationId || `conv_${Math.min(senderId, recipientId)}_${Math.max(senderId, recipientId)}`;
      const message = await Message.create({
        senderId: Number(senderId),
        receiverId: Number(recipientId),
        subject: subject || null,
        content,
        messageType: message_type || req.body.messageType || 'text',
        conversationId
      });

      const messageObj = message.toJSON();
      const normalizedMessage = {
        ...messageObj,
        sender_id: messageObj.senderId,
        receiver_id: messageObj.receiverId,
        message_type: messageObj.messageType,
        is_read: messageObj.isRead,
        sent_at: messageObj.sentAt
      };

      res.status(201).json({
        success: true,
        data: normalizedMessage
      });
    } catch (err) {
      logger.error('Error in create message:', err);
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }

  /**
   * GET /api/messages/:messageId
   * Get a specific message
   */
  async getById(req, res) {
    try {
      const memberId = req.user?.id || req.member?.id; // Handle both user and member patterns
      const messageId = req.params.messageId;

      if (!memberId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const message = await Message.findOne({
        where: {
          id: messageId,
          [Op.or]: [
            { senderId: memberId },
            { receiverId: memberId }
          ]
        }
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found'
        });
      }

      // Mark message as read if the current member is the receiver
      if (message.receiverId === memberId && !message.isRead) {
        await Message.update(
          { isRead: true, readAt: new Date() },
          { where: { id: messageId } }
        );
      }

      res.json({
        success: true,
        data: message
      });
    } catch (err) {
      logger.error('Error in getById:', err);
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }

  /**
   * PUT /api/messages/:messageId
   * Update a message (for editing)
   */
  async update(req, res) {
    try {
      const memberId = req.user?.id || req.member?.id; // Handle both user and member patterns
      const messageId = req.params.messageId;
      const { content, subject } = req.body;

      if (!memberId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Check if message exists and belongs to the member (as sender)
      const message = await Message.findOne({
        where: {
          id: messageId,
          senderId: memberId
        }
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found or unauthorized'
        });
      }

      // Check if message is too old to edit (e.g., older than 1 hour)
      const messageTime = new Date(message.sentAt);
      const now = new Date();
      const timeDiff = (now - messageTime) / (1000 * 60); // difference in minutes

      if (timeDiff > 60) { // 1 hour limit
        return res.status(400).json({
          success: false,
          error: 'Cannot edit message older than 1 hour'
        });
      }

      // Update the message
      await Message.update(
        {
          content: content || message.content,
          subject: subject || message.subject
        },
        { where: { id: messageId } }
      );

      const updatedMessage = await Message.findByPk(messageId);

      res.json({
        success: true,
        data: updatedMessage
      });
    } catch (err) {
      logger.error('Error in update:', err);
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }

  /**
   * DELETE /api/messages/:messageId
   * Delete a message
   */
  async delete(req, res) {
    try {
      const memberId = req.user?.id || req.member?.id; // Handle both user and member patterns
      const messageId = req.params.messageId;

      if (!memberId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Check if message exists and belongs to the member (as sender)
      const message = await Message.findOne({
        where: {
          id: messageId,
          senderId: memberId
        }
      });

      if (!message) {
        return res.status(404).json({
          success: false,
          error: 'Message not found or unauthorized'
        });
      }

      // In a real implementation, you might want to soft delete
      // For now, we'll hard delete the message
      await Message.destroy({
        where: { id: messageId }
      });

      res.json({
        success: true,
        message: 'Message deleted successfully'
      });
    } catch (err) {
      logger.error('Error in delete:', err);
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }

  /**
   * POST /api/messages/mark-as-read
   * Mark messages as read
   */
  async markAsRead(req, res) {
    try {
      const memberId = req.user?.id || req.member?.id; // Handle both user and member patterns
      const { conversation_partner_id } = req.body;

      if (!memberId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Update all messages from the conversation partner that are addressed to the current member
      const [updatedRowsCount] = await Message.update(
        { isRead: true, readAt: new Date() },
        {
          where: {
            senderId: conversation_partner_id,
            receiverId: memberId,
            isRead: false
          }
        }
      );

      res.json({
        success: true,
        message: 'Messages marked as read',
        updatedCount: updatedRowsCount
      });
    } catch (err) {
      logger.error('Error in markAsRead:', err);
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }

  /**
   * GET /api/messages/unread-count
   * Get unread message count
   */
  async getUnreadCount(req, res) {
    try {
      const memberId = req.user?.id || req.member?.id; // Handle both user and member patterns

      if (!memberId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const unreadCount = await Message.count({
        where: {
          receiverId: memberId,
          isRead: false
        }
      });

      res.json({
        success: true,
        unread_count: unreadCount
      });
    } catch (err) {
      logger.error('Error in getUnreadCount:', err);
      res.status(500).json({
        success: false,
        error: 'Server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
      });
    }
  }
}

module.exports = new MessagesController();
