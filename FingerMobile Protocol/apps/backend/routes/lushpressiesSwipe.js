/**
 * Lush Pressies — Standalone Roll & Swipe Router
 * Handles Tinder-style roll actions, reverse rolls, discovery queue, and match lists.
 * Date: October 6, 2026 - Phase 2 Ecosystem
 */

const express = require('express');
const router = express.Router();
const matchCtrl = require('../controllers/lushpressiesMatchingController');
const { pool } = require('../db');
const logger = require('../utils/logger');

// POST /api/lushpressies-swipe/roll - Like or skip profile
router.post('/roll', (req, res) => matchCtrl.rollAction(req, res));

// POST /api/lushpressies-swipe/reverse-roll - Rewind last skip
router.post('/reverse-roll', (req, res) => matchCtrl.reverseRoll(req, res));

// GET /api/lushpressies-swipe/discover - Discover feed with Radiate priority
router.get('/discover', (req, res) => matchCtrl.discoverProfiles(req, res));

// GET /api/lushpressies-swipe/matches - Get mutual matches
router.get('/matches', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const result = await pool.query(
      `SELECT
        u.id, u.username, u.avatar_url,
        r1.created_at as matched_at,
        ce.status as commit_status,
        ce.first_interaction_at
       FROM lush_roll_actions r1
       JOIN lush_roll_actions r2 ON r1.actor_id = r2.target_id AND r1.target_id = r2.actor_id
       JOIN users u ON u.id = r1.target_id
       LEFT JOIN lush_commit_eligibility ce ON
         (ce.user1_id = LEAST(r1.actor_id, r1.target_id) AND ce.user2_id = GREATEST(r1.actor_id, r1.target_id))
       WHERE r1.actor_id = $1 AND r1.action = 'like' AND r2.action = 'like'
       ORDER BY r1.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    logger.error('Error fetching mutual matches:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve matches' });
  }
});

// GET /api/lushpressies-swipe/stats - Get swipe statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const stats = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE action = 'like') as likes_sent,
        COUNT(*) FILTER (WHERE action = 'skip') as skips_sent,
        COUNT(*) as total_swipes
       FROM lush_roll_actions
       WHERE actor_id = $1`,
      [userId]
    );

    const received = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE action = 'like') as likes_received
       FROM lush_roll_actions
       WHERE target_id = $1`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        likesSent: parseInt(stats.rows[0].likes_sent || 0, 10),
        skipsSent: parseInt(stats.rows[0].skips_sent || 0, 10),
        totalSwipes: parseInt(stats.rows[0].total_swipes || 0, 10),
        likesReceived: parseInt(received.rows[0].likes_received || 0, 10)
      }
    });
  } catch (error) {
    logger.error('Error fetching swipe stats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve swipe stats' });
  }
});

module.exports = router;
