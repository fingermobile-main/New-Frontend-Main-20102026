/**
 * WebSocket Service
 * Socket.io integration for real-time features
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

class WebSocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map();
  }

  /**
   * Initialize Socket.io server
   */
  initialize(httpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    // Authentication middleware
    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        socket.userEmail = decoded.email;
        next();
      } catch (error) {
        logger.error('❌ WebSocket authentication failed:', error.message);
        next(new Error('Invalid token'));
      }
    });

    // Connection handler
    this.io.on('connection', (socket) => {
      logger.info(`✅ User connected: ${socket.userId} (${socket.id})`);
      
      // Track connected user
      this.connectedUsers.set(socket.userId, {
        socketId: socket.id,
        connectedAt: new Date(),
        rooms: []
      });

      // Join user's personal room
      socket.join(`user:${socket.userId}`);
      this.connectedUsers.get(socket.userId).rooms.push(`user:${socket.userId}`);

      // Handle chat messages
      socket.on('chat:message', async (data) => {
        await this.handleChatMessage(socket, data);
      });

      // Handle typing indicator
      socket.on('chat:typing', (data) => {
        this.handleTypingIndicator(socket, data);
      });

      // Handle presence updates
      socket.on('presence:update', (data) => {
        this.handlePresenceUpdate(socket, data);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`❌ User disconnected: ${socket.userId}`);
        this.connectedUsers.delete(socket.userId);
        
        // Broadcast offline status
        this.io.emit('presence:offline', { userId: socket.userId });
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error(`❌ WebSocket error for user ${socket.userId}:`, error.message);
      });
    });

    logger.info('✅ WebSocket server initialized');
    return this.io;
  }

  /**
   * Handle chat message
   */
  async handleChatMessage(socket, data) {
    try {
      const { conversationId, content, type = 'text' } = data;
      
      // TODO: Save message to database
      // const message = await db.messages.insertOne({
      //   conversationId,
      //   senderId: socket.userId,
      //   content,
      //   type,
      //   createdAt: new Date()
      // });

      // Broadcast to conversation room
      this.io.to(`conversation:${conversationId}`).emit('chat:message', {id: Date.now().toString(), // Placeholder
        conversationId,
  senderId: socket.userId,
  content,
  type,
  timestamp: new Date().toISOString()
      });

      logger.info(`💬 Message sent in conversation ${conversationId}`);
    } catch (error) {
      logger.error('❌ Chat message handling failed:', error.message);
      socket.emit('error', {message: 'Failed to send message' });
    }
  }

  /**
   * Handle typing indicator
   */
  handleTypingIndicator(socket, data) {
    const { conversationId, isTyping } = data;
    
    socket.to(`conversation:${conversationId}`).emit('chat:typing', {userId: socket.userId,
  conversationId,
  isTyping
    });
  }

  /**
   * Handle presence update
   */
  handlePresenceUpdate(socket, data) {
    const { status } = data; // 'online', 'away', 'busy', 'offline'
    
    // Broadcast presence change
    this.io.emit('presence:update', {userId: socket.userId,
  status,
  timestamp: new Date().toISOString()
    });
  }

  /**
   * Send notification to specific user
   */
  sendNotification(userId, notification) {
    if (this.connectedUsers.has(userId)) {
      this.io.to(`user:${userId}`).emit('notification', notification);
      logger.info(`🔔 Notification sent to user ${userId}`);
      return true;
    }
    return false;
  }

  /**
   * Send message to conversation
   */
  sendMessageToConversation(conversationId, message) {
    this.io.to(`conversation:${conversationId}`).emit('chat:message', message);
    logger.info(`💬 Message broadcasted to conversation ${conversationId}`);
  }

  /**
   * Get online users count
   */
  getOnlineUsersCount() {
    return this.connectedUsers.size;
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }

  /**
   * Get connected users list
   */
  getConnectedUsers() {
    return Array.from(this.connectedUsers.entries()).map(([userId, data]) => ({
      userId,
socketId: data.socketId,
connectedAt: data.connectedAt
    }));
  }
}

module.exports = new WebSocketService();
