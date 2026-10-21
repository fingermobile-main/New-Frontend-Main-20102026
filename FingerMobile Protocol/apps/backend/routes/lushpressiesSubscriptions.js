/**
 * Lush Pressies — Standalone Subscriptions Router
 * Handles subscription tiers (Radiate, Radiate++, VIP Passport),
 * automated billing checks, and 30-minute matching boost sessions.
 * Date: October 6, 2026 - Phase 2 Ecosystem
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const logger = require('../utils/logger');

// GET /api/lushpressies-subscriptions/plans - Available LushPressies tiers
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 'free',
        name: 'Standard Member',
        priceMonthly: 0,
        features: [
          'Standard Swipe Deck',
          '3 First-Contact Messages per 72 Hours',
          'Standard Profile Visibility'
        ]
      },
      {
        id: 'radiate',
        name: 'Radiate Boost Member',
        priceMonthly: 15.00,
        features: [
          '5x Profile Visibility in Discover Queue',
          'Unlimited First-Contact Messages',
          'Reverse Roll (1 Rewind per day)',
          'PIN Protected Chats'
        ]
      },
      {
        id: 'radiate_plus',
        name: 'Radiate++ Top Tier',
        priceMonthly: 35.00,
        features: [
          'Priority #1 in All Matching Queues',
          'Unlimited Reverse Roll Rewinds',
          'Full Qwen AI Compatibility Breakdown',
          'Extended 2-Day Collaboration Mode',
          'Ghost Mode & Invisible Browsing'
        ]
      },
      {
        id: 'vip_passport',
        name: 'Global VIP Passport',
        priceMonthly: 50.00,
        features: [
          'Cross-Border Matching Across All Continents',
          'Continental Radius Expansion (35km - 75km & National)',
          'All Radiate++ Benefits Included',
          'Zero Commission on Gift Store Trades'
        ]
      }
    ]
  });
});

// GET /api/lushpressies-subscriptions/current - Get current user subscription
router.get('/current', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const sub = await pool.query(
      `SELECT * FROM lush_subscriptions
       WHERE user_id = $1 AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (sub.rows.length === 0) {
      return res.json({
        success: true,
        data: {
          plan: 'free',
          tierName: 'Standard Member',
          isActive: true,
          expiresAt: null
        }
      });
    }

    res.json({
      success: true,
      data: sub.rows[0]
    });
  } catch (error) {
    logger.error('Error fetching LushPressies subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve subscription' });
  }
});

// POST /api/lushpressies-subscriptions/subscribe - Activate subscription tier
router.post('/subscribe', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { planId = 'radiate_plus' } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const validPlans = ['free', 'radiate_plus', 'passport', 'visa', 'elite'];
    const chosenPlan = validPlans.includes(planId) ? planId : 'radiate_plus';

    // Create new active subscription with 30-day term
    const newSub = await pool.query(
      `INSERT INTO lush_subscriptions (user_id, plan, started_at, expires_at, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW() + INTERVAL '30 days', NOW(), NOW())
       RETURNING *`,
      [userId, chosenPlan]
    );

    res.status(201).json({
      success: true,
      message: `Successfully upgraded to ${chosenPlan.replace('_', ' ').toUpperCase()}!`,
      data: newSub.rows[0]
    });
  } catch (error) {
    logger.error('Error creating subscription:', error);
    res.status(500).json({ success: false, message: 'Failed to process subscription' });
  }
});

// POST /api/lushpressies-subscriptions/radiate - Activate 30-min Radiate boost session
router.post('/radiate', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { tier = 'radiate' } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Upsert 30-minute boost session
    const session = await pool.query(
      `INSERT INTO lush_radiate_sessions (user_id, tier, expires_at, created_at)
       VALUES ($1, $2, NOW() + INTERVAL '30 minutes', NOW())
       RETURNING *`,
      [userId, tier]
    );

    res.status(201).json({
      success: true,
      message: '🚀 Radiate Boost activated! Your profile is prioritized in the discovery deck for the next 30 minutes.',
      data: {
        sessionId: session.rows[0].id,
        expiresAt: session.rows[0].expires_at,
        durationMinutes: 30
      }
    });
  } catch (error) {
    logger.error('Error activating Radiate boost session:', error);
    res.status(500).json({ success: false, message: 'Failed to activate boost session' });
  }
});

module.exports = router;
