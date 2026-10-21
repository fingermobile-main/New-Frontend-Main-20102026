/* eslint-env node */

const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const logger = require('./utils/logger');

const ContentModerationService = require('./services/contentModerationService');

// JWT Secret (Should match the one in server.js)
const JWT_SECRET =
  process.env.JWT_SECRET || 'fingermobile_stercs_protocol_v1_secure_2025';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database:
    process.env.COMMUNICATION_DB_NAME || 'fingermobile_communication_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.COMMUNICATION_DB_PORT || process.env.DB_PORT || 5432
});

// Create HTTP server
const server = http.createServer();

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: '*', // In production, specify your frontend URL
    methods: ['GET', 'POST']
  }
});

// Store connected members
const connectedmembers = new Map();

// Authentication middleware for Socket.IO
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication error: No token provided'));
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error: Invalid token'));
    }

    socket.memberId = decoded.id;

    try {
      // Check if user is restricted globally
      const userRes = await pool.query('SELECT is_call_restricted FROM users WHERE id = $1', [socket.memberId]);
      if (userRes.rows.length > 0) {
        socket.is_call_restricted = userRes.rows[0].is_call_restricted;
      }
    } catch (dbErr) {
      // Ignore schema errors if table/column isn't fully migrated yet
      socket.is_call_restricted = false;
    }

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
      // GUARDIAN SI: Pre-flight content moderation check
      const moderationResult = await ContentModerationService.preFlightMessageCheck(socket.memberId, content);

      if (!moderationResult.allowed) {
        logger.warn(`Message blocked for user ${socket.memberId}. Reason: ${moderationResult.reason}`);
        socket.emit('message_error', { error: 'Message blocked by moderation policy', reason: moderationResult.reason });
        return; // Abort send
      }

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
      logger.error('Failed to process message', error);
      socket.emit('message_error', {error: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { recipientId, isTyping } = data;
    const recipientSocket = connectedmembers.get(recipientId);
    if (recipientSocket) {
      recipientSocket.emit('member_typing', { memberId: socket.memberId, isTyping });
    }
  });

  // Handle online status
  socket.on('update_status', (data) => {
    const { status } = data;
    // In a real app, you might want to store this in the database
    socket.broadcast.emit('member_status_changed', { memberId: socket.memberId, status });
  });

  // GUARDIAN SI: In-Memory Temporal Reputation / Rate Limiting State
  const CALL_RATE_LIMIT = 5; // max calls per window
  const CALL_RATE_WINDOW = 60000; // 1 minute

  // Handle WebRTC signaling for video calls
  socket.on('call_member', (data) => {
    // 1. Database-level Restriction Check
    if (socket.is_call_restricted) {
      socket.emit('call_error', { error: 'Your account is restricted from initiating calls.' });
      return;
    }

    // 2. In-Memory Temporal Reputation / Rate Limiting Check
    const now = Date.now();
    if (!socket.callHistory) {
      socket.callHistory = [];
    }

    // Clean up old calls outside the window
    socket.callHistory = socket.callHistory.filter(timestamp => now - timestamp < CALL_RATE_WINDOW);

    if (socket.callHistory.length >= CALL_RATE_LIMIT) {
      logger.warn(`User ${socket.memberId} hit WebRTC call rate limit.`);
      socket.emit('call_error', { error: 'You are making calls too quickly. Please wait before trying again.' });
      return;
    }

    // Record this call
    socket.callHistory.push(now);

    const { memberToCall, signalData, from } = data;
    const recipientSocket = connectedmembers.get(memberToCall);
    if (recipientSocket) {
      recipientSocket.emit('incoming_call', { signal: signalData, from, memberId: socket.memberId });
    }
  });

  socket.on('answer_call', (data) => {
    const { to, signalData } = data;
    const recipientSocket = connectedmembers.get(to);
    if (recipientSocket) {
      recipientSocket.emit('call_accepted', { signal: signalData, memberId: socket.memberId });
    }
  });

  socket.on('call_ended', (data) => {
    const { memberToCall } = data;
    const recipientSocket = connectedmembers.get(memberToCall);
    if (recipientSocket) {
      recipientSocket.emit('call_ended');
    }
  });

  // Join dashboard rooms for real-time CDC updates
  socket.on('join_dashboard', (dashboardType) => {
    if (dashboardType === 'master') {
      socket.join('dashboard_master');
    } else if (dashboardType === 'stercs') {
      socket.join('dashboard_stercs');
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // logger.info(`Member ${socket.memberId} disconnected`);
    connectedmembers.delete(socket.memberId);

    // Notify others that member is offline
    socket.broadcast.emit('member_offline', { memberId: socket.memberId });
  });
});

// PostgreSQL LISTEN for CDC Telemetry and Dynamic Screen Updates
async function startPostgresListener() {
  try {
    const pgClient = await pool.connect();
    await pgClient.query('LISTEN screen_catalog_updates');
    await pgClient.query('LISTEN stercs_policy_updates');

    pgClient.on('notification', (msg) => {
      try {
        const payload = JSON.parse(msg.payload);
        if (msg.channel === 'screen_catalog_updates') {
          io.to('dashboard_master').emit('SCREEN_CATALOG_SYNC', payload);
          io.to('dashboard_stercs').emit('SCREEN_CATALOG_SYNC', payload);
          io.emit(`SCREEN_UPDATED:${payload.slug}`, payload);
        } else if (msg.channel === 'stercs_policy_updates') {
          io.to('dashboard_stercs').emit('STERCS_POLICY_SYNC', payload);
          io.to('dashboard_master').emit('STERCS_POLICY_SYNC', payload);
        }
      } catch (parseErr) {
        logger.error('Failed to parse PG notification payload', parseErr);
      }
    });

    pgClient.on('error', (err) => {
      logger.warn('PG Client error in listener, attempting reconnection...', err);
      setTimeout(startPostgresListener, 5000);
    });
  } catch (listenErr) {
    logger.warn('Could not initialize PostgreSQL CDC listener:', listenErr.message);
  }
}
startPostgresListener();

const PORT = process.env.WS_PORT || 3002;
server.listen(PORT, '0.0.0.0', () => {
  // logger.info(`✅ WebSocket server running at http://localhost:${PORT}`);
});

module.exports = { io, server };
