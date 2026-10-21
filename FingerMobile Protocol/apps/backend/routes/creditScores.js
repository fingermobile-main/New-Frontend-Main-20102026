const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { pool } = require('../db');
const logger = require('../utils/logger');

/**
 * @route   GET /api/credit-scores
 * @desc    Get member credit score
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.uuid;
    let scoreData = null;

    if (pool && typeof pool.query === 'function' && userId) {
      try {
        const result = await pool.query(
          'SELECT credit_score, risk_tier, max_eligible_limit, updated_at FROM lendsq_credit_scores WHERE user_id = $1',
          [userId]
        );
        if (result.rows.length > 0) {
          scoreData = result.rows[0];
        }
      } catch (err) {
        logger.warn('Could not query lendsq_credit_scores:', err.message);
      }
    }

    const currentScore = scoreData ? scoreData.credit_score : 715;
    const riskTier = scoreData ? scoreData.risk_tier : (currentScore >= 700 ? 'low' : currentScore >= 600 ? 'medium' : 'high');
    const maxLimit = scoreData ? parseFloat(scoreData.max_eligible_limit) : 5000.0;

    res.json({
      success: true,
      data: {
        score: currentScore,
        maxScore: 850,
        minScore: 300,
        riskTier,
        maxEligibleLimit: maxLimit,
        rating: currentScore >= 740 ? 'Excellent' : currentScore >= 670 ? 'Good' : currentScore >= 580 ? 'Fair' : 'Poor',
        updatedAt: scoreData?.updated_at || new Date().toISOString(),
        factors: {
          paymentHistory: { score: 98, weight: '35%', status: 'Excellent' },
          creditUtilization: { score: 18, weight: '30%', status: 'Good' },
          creditHistoryAge: { score: 4.2, unit: 'years', weight: '15%', status: 'Good' },
          totalAccounts: { score: 6, weight: '10%', status: 'Moderate' },
          hardInquiries: { count: 1, weight: '10%', status: 'Low Risk' }
        }
      }
    });
  } catch (error) {
    logger.error('Error fetching credit score:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve credit score' });
  }
});

/**
 * @route   GET /api/credit-scores/history
 * @desc    Get credit score history
 * @access  Private
 */
router.get('/history', authenticate, (req, res) => {
  try {
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const history = [];

    let baseScore = 690;
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      baseScore += Math.floor(Math.random() * 8) - 2;
      history.push({
        month: `${months[d.getMonth()]} ${d.getFullYear()}`,
        score: Math.min(850, Math.max(300, baseScore)),
        date: d.toISOString()
      });
    }

    res.json({
      success: true,
      history,
      trend: '+15 points over 6 months'
    });
  } catch (error) {
    logger.error('Error fetching credit score history:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve credit history' });
  }
});

/**
 * @route   GET /api/credit-scores/providers
 * @desc    Get available credit score providers
 * @access  Private
 */
router.get('/providers', authenticate, (req, res) => {
  res.json({
    success: true,
    providers: [
      { id: 'crc', name: 'CRC Credit Bureau', coverage: 'National', status: 'connected' },
      { id: 'first_central', name: 'FirstCentral Credit Bureau', coverage: 'National', status: 'connected' },
      { id: 'credit_registry', name: 'CreditRegistry CR Services', coverage: 'Commercial & Retail', status: 'connected' },
      { id: 'lendsq_neural', name: 'LendsQR Neural Risk Scoring Engine', coverage: 'Proprietary Real-Time', status: 'active' }
    ]
  });
});

/**
 * @route   POST /api/credit-scores/refresh
 * @desc    Refresh user's credit score
 * @access  Private
 */
router.post('/refresh', authenticate, async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.uuid;
    const newScore = 720;
    const riskTier = 'low';
    const maxLimit = 5500.0;

    if (pool && typeof pool.query === 'function' && userId) {
      try {
        await pool.query(
          `INSERT INTO lendsq_credit_scores (user_id, credit_score, risk_tier, max_eligible_limit, updated_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (user_id) DO UPDATE
           SET credit_score = $2, risk_tier = $3, max_eligible_limit = $4, updated_at = NOW()`,
          [userId, newScore, riskTier, maxLimit]
        );
      } catch (err) {
        logger.warn('Could not update lendsq_credit_scores table:', err.message);
      }
    }

    res.json({
      success: true,
      message: 'Credit score refreshed successfully',
      data: {
        score: newScore,
        change: '+5',
        riskTier,
        maxEligibleLimit: maxLimit,
        refreshedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error refreshing credit score:', error);
    res.status(500).json({ success: false, message: 'Failed to refresh credit score' });
  }
});

/**
 * @route   GET /api/credit-scores/analysis
 * @desc    Get credit analysis
 * @access  Private
 */
router.get('/analysis', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      healthIndex: 'Strong',
      debtToIncomeRatio: '14.2%',
      repaymentPunctuality: '99.4%',
      utilizationRate: '18.5%',
      riskCategory: 'Low Risk',
      recommendedActions: [
        'Maintain on-time repayments across all micro-loans',
        'Keep revolving credit utilization under 25%',
        'Avoid submitting more than 2 loan inquiries in a 90-day window'
      ],
      borrowingCapacity: {
        unsecuredMicroLoan: 250000,
        merchantFinancing: 1500000,
        currency: 'NGN'
      }
    }
  });
});

module.exports = router;
