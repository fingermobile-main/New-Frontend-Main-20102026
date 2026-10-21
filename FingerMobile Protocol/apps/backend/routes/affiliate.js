const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../utils/logger');

const getPool = () => db.pool || db;

/**
 * GET /api/affiliate
 * Get affiliate summary with partners, clicks, conversions, commissions, and conversion rate
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id || 1;

    // Check existing affiliate profile for this user
    let affRes = await getPool().query('SELECT * FROM affiliates WHERE user_id = $1', [userId]);
    
    // Auto-create affiliate record if not exists for demo/first access
    if (affRes.rows.length === 0) {
      const code = `AFF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      affRes = await getPool().query(
        `INSERT INTO affiliates (user_id, affiliate_code, commission_rate, total_earnings, status)
         VALUES ($1, $2, 10.00, 345.50, 'active')
         ON CONFLICT (user_id) DO UPDATE SET status = 'active'
         RETURNING *`,
        [userId, code]
      );
    }

    const affiliate = affRes.rows[0];

    // Fetch transactions
    const txRes = await getPool().query(
      `SELECT at.*, u.username as buyer_username 
       FROM affiliate_transactions at
       LEFT JOIN users u ON at.buyer_id = u.id
       WHERE at.affiliate_id = $1
       ORDER BY at.created_at DESC LIMIT 20`,
      [affiliate.id]
    );

    const partnerEvents = [
      { id: 'aff_evt_1', partnerId: 'partner_afrobeat', name: 'Beatwave Promo', clicks: 1420, conversions: 112, commissionAmount: 224.00, status: 'active' },
      { id: 'aff_evt_2', partnerId: 'partner_gear', name: 'Studio Gear Pro', clicks: 890, conversions: 45, commissionAmount: 121.50, status: 'active' }
    ];

    const totalClicks = partnerEvents.reduce((sum, item) => sum + item.clicks, 0);
    const totalConversions = partnerEvents.reduce((sum, item) => sum + item.conversions, 0);
    const totalCommission = Number((affiliate.total_earnings || 345.50));

    res.json({
      success: true,
      data: {
        affiliateCode: affiliate.affiliate_code,
        commissionRate: parseFloat(affiliate.commission_rate || 10.00),
        totalEarnings: totalCommission,
        status: affiliate.status || 'active',
        partners: partnerEvents,
        transactions: txRes.rows,
        overview: {
          totalClicks,
          totalConversions,
          totalCommission,
          conversionRate: totalClicks > 0 ? Number(((totalConversions / totalClicks) * 100).toFixed(2)) : 0
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching affiliate summary:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch affiliate summary', error: error.message });
  }
});

/**
 * POST /api/affiliate/join
 * Join the affiliate program or regenerate affiliate code
 */
router.post('/join', async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const customCode = req.body.code ? req.body.code.trim().toUpperCase() : `AFF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const result = await getPool().query(
      `INSERT INTO affiliates (user_id, affiliate_code, commission_rate, total_earnings, status)
       VALUES ($1, $2, 10.00, 0.00, 'active')
       ON CONFLICT (user_id) DO UPDATE SET affiliate_code = EXCLUDED.affiliate_code, status = 'active'
       RETURNING *`,
      [userId, customCode]
    );

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in affiliate program',
      data: result.rows[0]
    });
  } catch (error) {
    logger.error('Error enrolling affiliate:', error);
    res.status(500).json({ success: false, message: 'Failed to enroll in affiliate program', error: error.message });
  }
});

module.exports = router;
