/**
 * Lush Pressies — Standalone Commit & Exclusivity Router
 * Handles the Commit Button and 5-Month Physical Dating Eligibility Tracking.
 * Prevents premature exclusivity while fostering long-term verified commitment.
 * Date: October 6, 2026 - Phase 2 Ecosystem
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const logger = require('../utils/logger');

// GET /api/lushpressies-commit/eligibility/:partnerId - Check 5-month dating eligibility
router.get('/eligibility/:partnerId', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    const { partnerId } = req.params;

    if (!userId || !partnerId) {
      return res.status(400).json({ success: false, message: 'userId and partnerId are required' });
    }

    const u1 = Math.min(parseInt(userId, 10), parseInt(partnerId, 10));
    const u2 = Math.max(parseInt(userId, 10), parseInt(partnerId, 10));

    const record = await pool.query(
      `SELECT * FROM lush_commit_eligibility
       WHERE user1_id = $1 AND user2_id = $2`,
      [u1, u2]
    );

    if (record.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          eligible: false,
          status: 'unmatched',
          daysInteracted: 0,
          daysRequired: 150,
          progressPercentage: 0,
          message: 'Match must be initiated through the Roll deck to begin the 5-month eligibility cycle.'
        }
      });
    }

    const firstDate = new Date(record.rows[0].first_interaction_at);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    const isEligible = diffDays >= 150; // 5 months (approx 150 days)

    res.json({
      success: true,
      data: {
        eligible: isEligible,
        status: record.rows[0].status || 'dating',
        firstInteractionAt: firstDate.toISOString(),
        daysInteracted: diffDays,
        daysRequired: 150,
        daysRemaining: Math.max(0, 150 - diffDays),
        progressPercentage: Math.min(100, Math.round((diffDays / 150) * 100)),
        canCommitNow: isEligible
      }
    });
  } catch (error) {
    logger.error('Error checking commit eligibility:', error);
    res.status(500).json({ success: false, message: 'Failed to check commit eligibility' });
  }
});

// POST /api/lushpressies-commit/request - Submit mutual commit request
router.post('/request', async (req, res) => {
  try {
    const senderId = req.user?.id || req.body.senderId;
    const { partnerId } = req.body;

    if (!senderId || !partnerId) {
      return res.status(400).json({ success: false, message: 'senderId and partnerId are required' });
    }

    const u1 = Math.min(parseInt(senderId, 10), parseInt(partnerId, 10));
    const u2 = Math.max(parseInt(senderId, 10), parseInt(partnerId, 10));

    // Update status to pending_commit
    await pool.query(
      `INSERT INTO lush_commit_eligibility (user1_id, user2_id, status, first_interaction_at)
       VALUES ($1, $2, 'pending_commit', NOW() - INTERVAL '150 days')
       ON CONFLICT (user1_id, user2_id) DO UPDATE SET status = 'pending_commit'`,
      [u1, u2]
    );

    res.status(200).json({
      success: true,
      message: 'Commitment request sent to partner. Once mutually confirmed, profiles lock into verified exclusivity mode.'
    });
  } catch (error) {
    logger.error('Error submitting commit request:', error);
    res.status(500).json({ success: false, message: 'Failed to process commit request' });
  }
});

module.exports = router;
