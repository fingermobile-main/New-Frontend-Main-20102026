/**
 * Lush Chat Controller
 * Handles all chat-related operations for the Lush Pressies app
 */

const db = require('../config/database');
const { io } = require('../socket'); // Assuming Socket.IO is configured

class LushChatController {
  /**
   * Create a new conversation
   */
  static async createConversation(userId, targetUserId) {
    try {
      // Validate inputs
      if (!userId || !targetUserId) {
        return { success: false, error: 'User IDs are required' };
      }

      // Check if users can chat (must be matched)
      const isMatched = await db.areUsersMatched(userId, targetUserId);
      if (!isMatched) {
        return { success: false, error: 'Users must be matched to start a conversation' };
      }

      // Check if conversation already exists
      const existingConversation = await db.getConversation(userId, targetUserId);
      if (existingConversation) {
        return { success: true, conversation: existingConversation };
      }

      // Create new conversation
      const conversation = await db.createConversation({
        participants: [userId, targetUserId],
        createdAt: new Date(),
        lastMessageAt: null,
        isArchived: false,
        isBlocked: false
      });

      return {
        success: true,
        conversation
      };
    } catch (error) {
      console.error('Error creating conversation:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Send a message
   */
  static async sendMessage(senderId, conversationId, messageContent, messageType = 'text') {
    try {
      // Validate inputs
      if (!senderId || !conversationId || !messageContent) {
        return { success: false, error: 'Sender ID, conversation ID, and message content are required' };
      }

      // Check if sender is part of the conversation
      const conversation = await db.getConversationById(conversationId);
      if (!conversation || !conversation.participants.includes(senderId)) {
        return { success: false, error: 'Sender not part of conversation' };
      }

      // Check if conversation is blocked
      if (conversation.isBlocked) {
        return { success: false, error: 'Conversation is blocked' };
      }

      // Check if sender is blocked by any participant
      for (const participantId of conversation.participants) {
        if (participantId !== senderId) {
          const isBlocked = await db.isUserBlocked(participantId, senderId);
          if (isBlocked) {
            return { success: false, error: 'Sender is blocked by a participant' };
          }
        }
      }

      // Create message
      const message = await db.createMessage({
        conversationId,
        senderId,
        content: messageContent,
        type: messageType,
        timestamp: new Date(),
        status: 'sent'
      });

      // Update conversation's last message
      await db.updateConversationLastMessage(conversationId, message.id, message.timestamp);

      // Emit message to connected participants
      for (const participantId of conversation.participants) {
        if (participantId !== senderId) {
          io.to(`user_${participantId}`).emit('new_message', {
            conversationId,
            message: {
              id: message.id,
              senderId,
              content: message.content,
              type: message.type,
              timestamp: message.timestamp
            }
          });
        }
      }

      return {
        success: true,
        message
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get conversation history
   */
  static async getConversationHistory(userId, conversationId, limit = 50, offset = 0) {
    try {
      // Validate inputs
      if (!userId || !conversationId) {
        return { success: false, error: 'User ID and conversation ID are required' };
      }

      // Check if user is part of the conversation
      const conversation = await db.getConversationById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        return { success: false, error: 'User not part of conversation' };
      }

      // Get messages
      const messages = await db.getMessages(conversationId, limit, offset);

      // Mark messages as seen by the requesting user
      await db.markMessagesAsSeen(conversationId, userId);

      return {
        success: true,
        messages,
        hasMore: messages.length === limit
      };
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user's conversations
   */
  static async getUserConversations(userId, limit = 20, offset = 0) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Get user's conversations
      const conversations = await db.getUserConversations(userId, limit, offset);

      // Get participant details for each conversation
      const conversationsWithDetails = await Promise.all(
        conversations.map(async (conversation) => {
          // Get the other participant (not the current user)
          const otherParticipantId = conversation.participants.find(id => id !== userId);
          const otherParticipant = await db.getUser(otherParticipantId);

          // Get last message details
          let lastMessage = null;
          if (conversation.lastMessageId) {
            lastMessage = await db.getMessage(conversation.lastMessageId);
          }

          // Get unread count
          const unreadCount = await db.getUnreadMessageCount(conversation.id, userId);

          return {
            ...conversation,
            otherParticipant: {
              id: otherParticipant.id,
              username: otherParticipant.username,
              avatar: otherParticipant.avatar,
              isOnline: otherParticipant.isOnline
            },
            lastMessage: lastMessage ? {
              content: lastMessage.content,
              type: lastMessage.type,
              timestamp: lastMessage.timestamp
            } : null,
            unreadCount
          };
        })
      );

      return {
        success: true,
        conversations: conversationsWithDetails,
        count: conversationsWithDetails.length
      };
    } catch (error) {
      console.error('Error getting user conversations:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Delete a message
   */
  static async deleteMessage(userId, messageId) {
    try {
      if (!userId || !messageId) {
        return { success: false, error: 'User ID and message ID are required' };
      }

      // Get the message
      const message = await db.getMessage(messageId);
      if (!message) {
        return { success: false, error: 'Message not found' };
      }

      // Check if user is the sender
      if (message.senderId !== userId) {
        return { success: false, error: 'User is not the sender of the message' };
      }

      // Update message to show as deleted
      await db.updateMessage(messageId, {
        content: 'This message was deleted',
        type: 'deleted',
        isDeleted: true
      });

      // Notify other participants about the deletion
      const conversation = await db.getConversationById(message.conversationId);
      for (const participantId of conversation.participants) {
        if (participantId !== userId) {
          io.to(`user_${participantId}`).emit('message_deleted', {
            conversationId: message.conversationId,
            messageId: message.id,
            timestamp: new Date()
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting message:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Block/unblock a conversation
   */
  static async toggleBlockConversation(userId, conversationId, block = true) {
    try {
      if (!userId || !conversationId) {
        return { success: false, error: 'User ID and conversation ID are required' };
      }

      // Check if user is part of the conversation
      const conversation = await db.getConversationById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        return { success: false, error: 'User not part of conversation' };
      }

      // Update conversation block status
      await db.updateConversation(conversationId, { isBlocked: block });

      // If blocking, delete all messages for the blocking user
      if (block) {
        await db.deleteUserMessagesFromConversation(conversationId, userId);
      }

      // Notify other participants
      for (const participantId of conversation.participants) {
        if (participantId !== userId) {
          io.to(`user_${participantId}`).emit('conversation_blocked', {
            conversationId,
            blockedBy: userId,
            blocked: block
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error toggling conversation block:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Archive/unarchive a conversation
   */
  static async toggleArchiveConversation(userId, conversationId, archive = true) {
    try {
      if (!userId || !conversationId) {
        return { success: false, error: 'User ID and conversation ID are required' };
      }

      // Check if user is part of the conversation
      const conversation = await db.getConversationById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        return { success: false, error: 'User not part of conversation' };
      }

      // Update conversation archive status
      await db.updateConversation(conversationId, { isArchived: archive });

      return { success: true };
    } catch (error) {
      console.error('Error toggling conversation archive:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(userId, conversationId) {
    try {
      if (!userId || !conversationId) {
        return { success: false, error: 'User ID and conversation ID are required' };
      }

      // Check if user is part of the conversation
      const conversation = await db.getConversationById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        return { success: false, error: 'User not part of conversation' };
      }

      // Mark messages as read
      await db.markMessagesAsSeen(conversationId, userId);

      return { success: true };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get user's online status
   */
  static async updateUserOnlineStatus(userId, isOnline) {
    try {
      if (!userId) {
        return { success: false, error: 'User ID is required' };
      }

      // Update user's online status in DB
      await db.updateUserOnlineStatus(userId, isOnline);

      // Update user's online status in socket
      const socketId = await db.getUserSocketId(userId);
      if (socketId) {
        if (isOnline) {
          io.sockets.sockets.get(socketId)?.join(`user_${userId}`);
        } else {
          io.sockets.sockets.get(socketId)?.leave(`user_${userId}`);
        }
      }

      // Notify other participants in active conversations
      const activeConversations = await db.getActiveConversations(userId);
      for (const conversation of activeConversations) {
        for (const participantId of conversation.participants) {
          if (participantId !== userId) {
            io.to(`user_${participantId}`).emit('user_online_status', {
              userId,
              isOnline
            });
          }
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating online status:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Send typing indicator
   */
  static async sendTypingIndicator(userId, conversationId, isTyping) {
    try {
      if (!userId || !conversationId) {
        return { success: false, error: 'User ID and conversation ID are required' };
      }

      // Check if user is part of the conversation
      const conversation = await db.getConversationById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        return { success: false, error: 'User not part of conversation' };
      }

      // Notify other participants
      for (const participantId of conversation.participants) {
        if (participantId !== userId) {
          io.to(`user_${participantId}`).emit('typing_indicator', {
            conversationId,
            userId,
            isTyping
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending typing indicator:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  /**
   * Get conversation statistics
   */
  static async getConversationStats(userId, conversationId) {
    try {
      if (!userId || !conversationId) {
        return { success: false, error: 'User ID and conversation ID are required' };
      }

      // Check if user is part of the conversation
      const conversation = await db.getConversationById(conversationId);
      if (!conversation || !conversation.participants.includes(userId)) {
        return { success: false, error: 'User not part of conversation' };
      }

      // Get conversation stats
      const stats = await db.getConversationStats(conversationId, userId);

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('Error getting conversation stats:', error);
      return { success: false, error: 'Internal server error' };
    }
  }
}

module.exports = LushChatController;

