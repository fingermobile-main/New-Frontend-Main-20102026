const logger = require('./utils/logger');
/* eslint-env node */

const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// JWT Secret (Should match the one in server.js)
const JWT_SECRET =
  process.env.JWT_SECRET || 'fingermobile_stercs_protocol_v1_secure_2025';

const pool = new Pool({member: process.env.DB_member || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database:
    process.env.COMMUNICATION_DB_NAME || 'fingermobile_communication_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.COMMUNICATION_DB_PORT || process.env.DB_PORT || 5432
});

// Create HTTP server
const server = http.createServer();

// Initialize Socket.IO
const io = socketIo(server, {cors: {
  origin: '*', // In production, specify your frontend URL
  methods: ['GET', 'POST']
}
});

// Store connected members
const connectedmembers = new Map();

// Authentication middleware for Socket.IO
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }

    socket.memberId = decoded.id;
    next();
  });
});

// Handle connections
io.on('connection', (socket) => {
  // logger.info(`Member ${socket.memberId} connected`);

  // Add member to connected members map
  connectedmembers.set(socket.memberId, socket);

  // Join member's personal room
  socket.join(`member_${socket.memberId}`);

  // Handle joining a chat room
  socket.on('join_chat', (data) => {
    const { chatId } = data;
    socket.join(`chat_${chatId}`);
    // logger.info(`Member ${socket.memberId} joined chat ${chatId}`);
  });

  // Handle leaving a chat room
  socket.on('leave_chat', (data) => {
    const { chatId } = data;
    socket.leave(`chat_${chatId}`);
    // logger.info(`Member ${socket.memberId} left chat ${chatId}`);
  });

  // Handle sending a message
  socket.on('send_message', async (data) => {
    const { recipientId, content, chatId } = data;

    try {
      // Save message to database
      const newMessage = await pool.query(
        `INSERT INTO messages (member_id, recipient_id, content, created_at)
         VALUES ($1, $2, $3, NOW())
         RETURNING id, member_id, recipient_id, content, created_at`,
        [socket.memberId, recipientId, content],
      );

      const message = newMessage.rows[0];

      // Emit to recipient if online
      const recipientSocket = connectedmembers.get(recipientId);
      if (recipientSocket) {
        recipientSocket.emit('receive_message', message);
      }

      // Emit to sender's other devices
      socket.to(`member_${socket.memberId}`).emit('message_sent', message);

      // Emit to chat room
      if (chatId) {
        socket.to(`chat_${chatId}`).emit('new_message', message);
      }

      // logger.info(`Message from ${socket.memberId} to ${recipientId}: ${content}`);
    } catch (error) {
      logger.error(error);
      socket.emit('message_error', {error: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { recipientId, isTyping } = data;
    const recipientSocket = connectedmembers.get(recipientId);
    if (recipientSocket) {
      recipientSocket.emit('member_typing', {memberId: socket.memberId,
        isTyping
      });
    }
  });

  // Handle online status
  socket.on('update_status', (data) => {
    const { status } = data;
    // In a real app, you might want to store this in the database
    socket.broadcast.emit('member_status_changed', {memberId: socket.memberId,
      status
    });
  });

  // Handle WebRTC signaling for video calls
  socket.on('call_member', (data) => {
    const { memberToCall, signalData, from } = data;
    const recipientSocket = connectedmembers.get(memberToCall);
    if (recipientSocket) {
      recipientSocket.emit('incoming_call', {signal: signalData,
        from,
        memberId: socket.memberId
      });
    }
  });

  socket.on('answer_call', (data) => {
    const { to, signalData } = data;
    const recipientSocket = connectedmembers.get(to);
    if (recipientSocket) {
      recipientSocket.emit('call_accepted', {signal: signalData,
        memberId: socket.memberId
      });
    }
  });

  socket.on('call_ended', (data) => {
    const { memberToCall } = data;
    const recipientSocket = connectedmembers.get(memberToCall);
    if (recipientSocket) {
      recipientSocket.emit('call_ended');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // logger.info(`Member ${socket.memberId} disconnected`);
    connectedmembers.delete(socket.memberId);

    // Notify others that member is offline
    socket.broadcast.emit('member_offline', {memberId: socket.memberId
    });
  });
});

const PORT = process.env.WS_PORT || 3002;
server.listen(PORT, '0.0.0.0', () => {
  // logger.info(`✅ WebSocket server running at http://localhost:${PORT}`);
});

module.exports = { io, server };
