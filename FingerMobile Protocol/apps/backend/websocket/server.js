/**
 * WebSocket Service
 * Socket.io integration for real-time features
 */

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

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
        // Allow guest or arcade runners to connect for SuperVi multiplayer
        if (socket.handshake.auth.isGuest || socket.handshake.query.guest === 'true' || socket.handshake.auth.game === 'supervi') {
          socket.userId = `guest_${Math.random().toString(36).substring(2, 9)}`;
          socket.userEmail = `${socket.userId}@guest.fingermobile.net`;
          return next();
        }
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

      // WebRTC & Pipecat Voice/Video Signaling
      socket.on('call:initiate', (data) => this.handleCallInitiate(socket, data));
      socket.on('call:accept', (data) => this.handleCallAccept(socket, data));
      socket.on('call:reject', (data) => this.handleCallReject(socket, data));
      socket.on('call:webrtc-offer', (data) => this.handleWebRtcOffer(socket, data));
      socket.on('call:webrtc-answer', (data) => this.handleWebRtcAnswer(socket, data));
      socket.on('call:ice-candidate', (data) => this.handleIceCandidate(socket, data));
      socket.on('call:hangup', (data) => this.handleCallHangup(socket, data));
      socket.on('call:pipecat-session', (data) => this.handlePipecatSession(socket, data));

      // SuperVi 3D-5D Multiplayer Runners
      socket.on('supervi:join_room', (data) => this.handleSuperViJoinRoom(socket, data));
      socket.on('supervi:leave_room', (data) => this.handleSuperViLeaveRoom(socket, data));
      socket.on('supervi:player_action', (data) => this.handleSuperViPlayerAction(socket, data));
      socket.on('supervi:sync_state', (data) => this.handleSuperViSyncState(socket, data));

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

      // //: Save message to database
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
    this.io.emit('presence:update', {
      userId: socket.userId,
      status,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle WebRTC Call Initiation
   */
  handleCallInitiate(socket, data) {
    const { recipientId, callType = 'audio', callId = `call_${Date.now()}`, callerName, callerAvatar, isPipecatAi = false } = data;
    logger.info(`📞 Call initiated by ${socket.userId} to ${recipientId} (${callType})`);

    this.io.to(`user:${recipientId}`).emit('call:incoming', {
      callId,
      callerId: socket.userId,
      callerName: callerName || socket.userEmail || 'FingerMobile Member',
      callerAvatar: callerAvatar || '',
      callType,
      isPipecatAi,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle Call Acceptance
   */
  handleCallAccept(socket, data) {
    const { callerId, callId } = data;
    logger.info(`📞 Call accepted: ${callId} by ${socket.userId}`);
    this.io.to(`user:${callerId}`).emit('call:accepted', {
      callId,
      recipientId: socket.userId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle Call Rejection
   */
  handleCallReject(socket, data) {
    const { callerId, callId, reason = 'declined' } = data;
    logger.info(`📞 Call rejected: ${callId} by ${socket.userId} (reason: ${reason})`);
    this.io.to(`user:${callerId}`).emit('call:rejected', {
      callId,
      reason,
      recipientId: socket.userId
    });
  }

  /**
   * Handle WebRTC SDP Offer
   */
  handleWebRtcOffer(socket, data) {
    const { recipientId, sdp, callId } = data;
    this.io.to(`user:${recipientId}`).emit('call:webrtc-offer', {
      callId,
      sdp,
      senderId: socket.userId
    });
  }

  /**
   * Handle WebRTC SDP Answer
   */
  handleWebRtcAnswer(socket, data) {
    const { callerId, sdp, callId } = data;
    this.io.to(`user:${callerId}`).emit('call:webrtc-answer', {
      callId,
      sdp,
      senderId: socket.userId
    });
  }

  /**
   * Handle WebRTC ICE Candidate
   */
  handleIceCandidate(socket, data) {
    const { targetUserId, candidate, callId } = data;
    this.io.to(`user:${targetUserId}`).emit('call:ice-candidate', {
      callId,
      candidate,
      senderId: socket.userId
    });
  }

  /**
   * Handle Call Termination / Hangup
   */
  handleCallHangup(socket, data) {
    const { targetUserId, callId } = data;
    logger.info(`📞 Call ended: ${callId} by ${socket.userId}`);
    if (targetUserId) {
      this.io.to(`user:${targetUserId}`).emit('call:ended', {
        callId,
        endedBy: socket.userId
      });
    }
  }

  /**
   * Handle Pipecat AI Conversational Voice Session Request
   */
  handlePipecatSession(socket, data) {
    const { agentId = 'guardian-ai', voiceModel = 'gemini-voice-sovereign' } = data;
    logger.info(`🤖 Pipecat AI session requested for ${socket.userId} with agent: ${agentId}`);

    socket.emit('call:pipecat-ready', {
      sessionId: `pipecat_${socket.userId}_${Date.now()}`,
      agentId,
      voiceModel,
      transport: 'webrtc',
      audioCodec: 'opus',
      sampleRate: 24000,
      sttEngine: 'sovereign-whisper-v3',
      ttsEngine: 'sovereign-neural-stream',
      readyAt: new Date().toISOString()
    });
  }

  /**
   * SuperVi Multiplayer Room Handlers
   */
  handleSuperViJoinRoom(socket, data) {
    const { roomId, characterId, playerName } = data || {};
    if (!roomId) return;
    const roomKey = `supervi:room:${roomId}`;
    socket.join(roomKey);
    logger.info(`🎮 SuperVi Runner ${socket.userId} joined room ${roomId}`);
    this.io.to(roomKey).emit('supervi:player_joined', {
      playerId: socket.userId || socket.id,
      playerName: playerName || `Runner_${String(socket.id).slice(-4)}`,
      characterId: characterId || 'zara',
      joinedAt: new Date().toISOString()
    });
  }

  handleSuperViLeaveRoom(socket, data) {
    const { roomId } = data || {};
    if (!roomId) return;
    const roomKey = `supervi:room:${roomId}`;
    socket.leave(roomKey);
    this.io.to(roomKey).emit('supervi:player_left', {
      playerId: socket.userId || socket.id
    });
  }

  handleSuperViPlayerAction(socket, data) {
    const { roomId, action, payload } = data || {};
    if (!roomId || !action) return;
    socket.to(`supervi:room:${roomId}`).emit('supervi:player_action', {
      playerId: socket.userId || socket.id,
      action,
      payload,
      timestamp: Date.now()
    });
  }

  handleSuperViSyncState(socket, data) {
    const { roomId, position, lane, score, speed, isAlive } = data || {};
    if (!roomId) return;
    socket.to(`supervi:room:${roomId}`).emit('supervi:state_synced', {
      playerId: socket.userId || socket.id,
      position,
      lane,
      score,
      speed,
      isAlive,
      timestamp: Date.now()
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
