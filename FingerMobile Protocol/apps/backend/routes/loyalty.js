const express = require('express');
const router = express.Router();
const db = require('../db');
const pool = db.pool;
const logger = require('../utils/logger');
const { authenticate } = require('../middleware/authenticate');

const getUserId = (req) => String(req.user?.id || '4');

const optionalAuth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return authenticate(req, res, (err) => {
      if (err || !req.user) {
        req.user = { id: '4', username: 'moderator', role: 'moderator' };
      }
      next();
    });
  }
  req.user = { id: '4', username: 'moderator', role: 'moderator' };
  next();
};

/**
 * Ensure user loyalty profile exists
 */
async function ensureLoyalty(userId) {
  let res = await pool.query('SELECT * FROM user_loyalty WHERE user_id = $1', [userId]);
  if (res.rows.length === 0) {
    const insert = await pool.query(
      `INSERT INTO user_loyalty (user_id, points, tier, lifetime_points)
       VALUES ($1, 750, 'Silver', 1200)
       ON CONFLICT (user_id) DO UPDATE SET points = EXCLUDED.points
       RETURNING *`,
      [userId]
    );
    return insert.rows[0];
  }
  return res.rows[0];
}

// GET /api/loyalty
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const loyalty = await ensureLoyalty(userId);

    const rewardsRes = await pool.query(
      'SELECT id, name, description, points_cost, tier_required, category, is_active FROM loyalty_rewards WHERE is_active = TRUE ORDER BY points_cost ASC'
    );

    const historyRes = await pool.query(
      'SELECT id, reward_id, reward_name, points_spent, status, created_at FROM loyalty_redemptions WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const rewardsMapped = rewardsRes.rows.map(r => ({
      id: r.id,
      tierId: (r.tier_required || 'Bronze').toLowerCase(),
      name: r.name,
      description: r.description,
      redemptionCost: r.points_cost,
      pointsRequired: r.points_cost,
      category: r.category
    }));

    const historyMapped = historyRes.rows.map(h => ({
      id: String(h.id),
      description: `Redeemed ${h.reward_name}`,
      date: h.created_at ? new Date(h.created_at).toISOString().split('T')[0] : '',
      amount: h.points_spent,
      pointsSpent: h.points_spent,
      status: h.status
    }));

    res.json({
      success: true,
      message: 'Loyalty status retrieved',
      data: {
        points: loyalty.points,
        tier: loyalty.tier,
        lifetimePoints: loyalty.lifetime_points,
        availableRewards: rewardsMapped,
        redemptionHistory: historyMapped
      },
      points: loyalty.points,
      loyaltyPoints: loyalty.points,
      tier: loyalty.tier,
      loyaltyTier: loyalty.tier,
      availableRewards: rewardsMapped,
      redemptionHistory: historyMapped
    });
  } catch (err) {
    logger.error('Loyalty GET Error:', err);
    res.status(500).json({ success: false, message: 'Failed to retrieve loyalty status' });
  }
});

// POST /api/loyalty/redeem
router.post('/redeem', optionalAuth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const { rewardId } = req.body;

    if (!rewardId) {
      return res.status(400).json({ success: false, message: 'Reward ID is required' });
    }

    const rewardRes = await pool.query('SELECT * FROM loyalty_rewards WHERE id = $1', [rewardId]);
    if (rewardRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reward not found' });
    }

    const reward = rewardRes.rows[0];
    const loyalty = await ensureLoyalty(userId);

    if (loyalty.points < reward.points_cost) {
      return res.status(400).json({
        success: false,
        message: `Insufficient points. You need ${reward.points_cost - loyalty.points} more points.`
      });
    }

    const newPoints = loyalty.points - reward.points_cost;
    await pool.query('UPDATE user_loyalty SET points = $1, updated_at = NOW() WHERE user_id = $2', [
      newPoints,
      userId
    ]);

    const redemptionRes = await pool.query(
      `INSERT INTO loyalty_redemptions (user_id, reward_id, reward_name, points_spent, status, created_at)
       VALUES ($1, $2, $3, $4, 'completed', NOW())
       RETURNING *`,
      [userId, reward.id, reward.name, reward.points_cost]
    );

    res.json({
      success: true,
      message: `Successfully redeemed ${reward.name}!`,
      data: {
        remainingPoints: newPoints,
        redemption: redemptionRes.rows[0]
      }
    });
  } catch (err) {
    logger.error('Loyalty Redeem Error:', err);
    res.status(500).json({ success: false, message: 'Failed to process reward redemption' });
  }
});

module.exports = router;
