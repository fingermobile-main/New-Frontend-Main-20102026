/**
 * Lush Pressies — Standalone Chat & Messaging Router
 * Handles first-contact messaging gates (3 per 72h for free tier),
 * private message exchanges, and conversation lists.
 * Date: October 6, 2026 - Phase 2 Ecosystem
 */

const express = require('express');
const router = express.Router();
const matchCtrl = require('../controllers/lushpressiesMatchingController');
const { pool } = require('../db');
const logger = require('../utils/logger');

// POST /api/lushpressies-chat/first-contact - Enforces 3 messages per 72h limit
router.post('/first-contact', (req, res) => matchCtrl.sendFirstContact(req, res));

// GET /api/lushpressies-chat/conversations - List active conversations
router.get('/conversations', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Retrieve conversation threads based on first contacts and mutual roll likes
    const result = await pool.query(
      `SELECT DISTINCT ON (partner_id)
        partner_id,
        u.username as partner_username,
        u.avatar_url as partner_avatar,
        last_msg.message as last_message,
        last_msg.created_at as last_message_at
       FROM (
         SELECT
           CASE WHEN sender_id = $1 THEN recipient_id ELSE sender_id END as partner_id,
           message,
           created_at
         FROM lush_first_contacts
         WHERE sender_id = $1 OR recipient_id = $1
         ORDER BY created_at DESC
       ) last_msg
       JOIN users u ON u.id = last_msg.partner_id
       ORDER BY partner_id, last_msg.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    logger.error('Error fetching LushPressies conversations:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve conversations' });
  }
});

// GET /api/lushpressies-chat/messages/:partnerId - Retrieve chat history with partner
router.get('/messages/:partnerId', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    const { partnerId } = req.params;
    const { limit = 50 } = req.query;

    if (!userId || !partnerId) {
      return res.status(400).json({ success: false, message: 'User ID and partner ID required' });
    }

    const result = await pool.query(
      `SELECT
        id, sender_id, recipient_id, message, created_at,
        CASE WHEN sender_id = $1 THEN true ELSE false END as is_mine
       FROM lush_first_contacts
       WHERE (sender_id = $1 AND recipient_id = $2)
          OR (sender_id = $2 AND recipient_id = $1)
       ORDER BY created_at ASC
       LIMIT $3`,
      [userId, partnerId, parseInt(limit, 10)]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    logger.error('Error fetching chat messages:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve messages' });
  }
});

// POST /api/lushpressies-chat/messages - Send a direct message
router.post('/messages', async (req, res) => {
  try {
    const senderId = req.user?.id || req.body.senderId;
    const { recipientId, message } = req.body;

    if (!senderId || !recipientId || !message) {
      return res.status(400).json({ success: false, message: 'Sender, recipient, and message are required' });
    }

    const result = await pool.query(
      `INSERT INTO lush_first_contacts (sender_id, recipient_id, message, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [senderId, recipientId, message]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error sending chat message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

module.exports = router;
