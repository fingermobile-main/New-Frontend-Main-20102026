const db = require('../database/connection');
const logger = require('../utils/logger');

/**
 * WebSocket Authentication Middleware
 * Authenticates WebSocket connections using JWT tokens
 */
async function websocketAuth(socket, next) {
  try {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    // Verify JWT token (implement based on your auth system)
    const decoded = await verifyToken(token);

    if (!decoded) {
      return next(new Error('Invalid or expired token'));
    }

    // Attach user info to socket
    socket.user = decoded;

    // Track active connections
    await trackConnection(decoded.userId, socket.id);

    next();
  } catch (error) {
    logger.error('WebSocket authentication error:', error);
    next(new Error('Authentication failed'));
  }
}

/**
 * Verify JWT token
 */
async function verifyToken(token) {
  // Implement JWT verification based on your auth system
  // This is a placeholder - replace with actual implementation
  try {
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET;

    return jwt.verify(token, secret);
  } catch (error) {
    logger.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Track active WebSocket connection
 */
async function trackConnection(userId, socketId) {
  try {
    await db.query(
      `INSERT INTO websocket_connections (user_id, socket_id, connected_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (socket_id) DO UPDATE SET connected_at = NOW()`,
      [userId, socketId]
    );
  } catch (error) {
    logger.error('Error tracking connection:', error);
  }
}

module.exports = websocketAuth;
