/**
 * Lush Pressies — Standalone Verification & PIN Router
 * Handles 8-digit PIN exchange (7-day TTL), identity verification,
 * selfie checks, and verified member badge status.
 * Date: October 6, 2026 - Phase 2 Ecosystem
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const logger = require('../utils/logger');

// POST /api/lushpressies-verification/pin/generate - Generate 8-digit PIN with 7-day TTL
router.post('/pin/generate', async (req, res) => {
  try {
    const senderId = req.user?.id || req.body.senderId;
    const { receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ success: false, message: 'senderId and receiverId are required' });
    }

    // Generate random 8-digit alphanumeric PIN
    const pinCode = Math.floor(10000000 + Math.random() * 90000000).toString();

    // Expire any existing pending pins between these members
    await pool.query(
      `UPDATE lush_pins
       SET status = 'expired'
       WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending'`,
      [senderId, receiverId]
    );

    const result = await pool.query(
      `INSERT INTO lush_pins (sender_id, receiver_id, pin_code, status, expires_at, created_at)
       VALUES ($1, $2, $3, 'pending', NOW() + INTERVAL '7 days', NOW())
       RETURNING *`,
      [senderId, receiverId, pinCode]
    );

    res.status(201).json({
      success: true,
      message: '8-digit PIN generated successfully (valid for 7 days)',
      data: {
        pinId: result.rows[0].id,
        pinCode: result.rows[0].pin_code,
        expiresAt: result.rows[0].expires_at
      }
    });
  } catch (error) {
    logger.error('Error generating verification PIN:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PIN' });
  }
});

// POST /api/lushpressies-verification/pin/verify - Verify 8-digit PIN exchange
router.post('/pin/verify', async (req, res) => {
  try {
    const receiverId = req.user?.id || req.body.receiverId;
    const { senderId, pinCode } = req.body;

    if (!receiverId || !senderId || !pinCode) {
      return res.status(400).json({ success: false, message: 'receiverId, senderId, and pinCode are required' });
    }

    const check = await pool.query(
      `SELECT * FROM lush_pins
       WHERE sender_id = $1 AND receiver_id = $2 AND pin_code = $3
         AND status = 'pending' AND expires_at > NOW()`,
      [senderId, receiverId, pinCode.trim()]
    );

    if (check.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid, already used, or expired PIN. Please request a new PIN.'
      });
    }

    // Mark as accepted
    await pool.query(
      `UPDATE lush_pins
       SET status = 'accepted'
       WHERE id = $1`,
      [check.rows[0].id]
    );

    res.json({
      success: true,
      verified: true,
      message: 'PIN successfully verified! Unlimited chat access unlocked.'
    });
  } catch (error) {
    logger.error('Error verifying PIN:', error);
    res.status(500).json({ success: false, message: 'Failed to verify PIN' });
  }
});

// GET /api/lushpressies-verification/status/:userId - Check verified badge and key status
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userRes = await pool.query(
      'SELECT id, username, email_verified, phone_verified FROM users WHERE id = $1',
      [userId]
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const verificationRecord = await pool.query(
      'SELECT * FROM lush_verifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    const hasBadge = verificationRecord.rows.length > 0 && verificationRecord.rows[0].status === 'verified';

    res.json({
      success: true,
      data: {
        userId,
        isEmailVerified: Boolean(userRes.rows[0].email_verified),
        isPhoneVerified: Boolean(userRes.rows[0].phone_verified),
        isVerifiedMember: hasBadge,
        badgeType: hasBadge ? 'Official Lush Verified Member' : 'Standard Member',
        verifiedAt: verificationRecord.rows[0]?.verified_at || null
      }
    });
  } catch (error) {
    logger.error('Error checking verification status:', error);
    res.status(500).json({ success: false, message: 'Failed to get verification status' });
  }
});

module.exports = router;
