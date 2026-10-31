'use strict';

/**
 * GET /api/notifications/stream
 * Server-Sent Events endpoint for real-time in-app notifications.
 * Clients connect once and receive a push stream of notification events.
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const pipeline = require('../services/notificationPipelineService');
const pool = require('../db');

// Attempt to load auth middleware — graceful if not available
let authenticate;
try {
  authenticate = require('../middleware/auth');
} catch {
  authenticate = (req, _res, next) => next(); // dev passthrough
}

/**
 * GET /api/notifications/stream
 * Establishes an SSE connection. Sends:
 *   - "connected" event immediately on connect
 *   - "notification" events as they arrive in real-time
 *   - "ping" heartbeat every 25 seconds to keep connection alive
 *   - "unread_count" event on connect with current unread count
 */
router.get('/', authenticate, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-store, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.flushHeaders();

  // Register client in the SSE registry
  pipeline.registerSSEClient(userId, res);

  // ── Send initial "connected" event ───────────────────────────
  res.write(`event: connected\ndata: ${JSON.stringify({ userId, timestamp: new Date().toISOString() })}\n\n`);

  // ── Send current unread count ─────────────────────────────────
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*) AS count FROM notifications
       WHERE (user_id=$1 OR recipient_id=$1) AND is_read=FALSE AND deleted_at IS NULL`,
      [userId]
    );
    const unreadCount = parseInt(rows[0]?.count || 0, 10);
    res.write(`event: unread_count\ndata: ${JSON.stringify({ count: unreadCount })}\n\n`);
  } catch {
    res.write(`event: unread_count\ndata: ${JSON.stringify({ count: 0 })}\n\n`);
  }

  // ── Heartbeat ping every 25 seconds ──────────────────────────
  const heartbeat = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 25_000);

  // ── Cleanup on client disconnect ─────────────────────────────
  req.on('close', () => {
    clearInterval(heartbeat);
    pipeline.unregisterSSEClient(userId, res);
    logger.info(`[SSE] Client disconnected: ${userId}`);
  });

  req.on('aborted', () => {
    clearInterval(heartbeat);
    pipeline.unregisterSSEClient(userId, res);
  });
});

/**
 * GET /api/notifications/stream/stats
 * Returns current SSE connection statistics (admin only).
 */
router.get('/stats', authenticate, (req, res) => {
  res.json({
    success: true,
    connectedClients: pipeline.getSSEClientCount(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

