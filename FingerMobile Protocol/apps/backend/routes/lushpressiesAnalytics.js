/**
 * Lush Pressies — Standalone Analytics Router
 * Handles profile impression statistics, view sources (swipe, discover, search),
 * popularity index, and 60/20/20 UGC revenue split metrics.
 * Date: October 6, 2026 - Phase 2 Ecosystem
 */

const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const logger = require('../utils/logger');

// GET /api/lushpressies-analytics/profile - Get profile impression and view metrics
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const viewsSummary = await pool.query(
      `SELECT
        COUNT(*) as total_views,
        COUNT(DISTINCT viewer_id) as unique_viewers,
        COUNT(*) FILTER (WHERE view_source = 'swipe') as swipe_views,
        COUNT(*) FILTER (WHERE view_source = 'discover') as discover_views,
        COUNT(*) FILTER (WHERE view_source = 'search') as search_views,
        COUNT(*) FILTER (WHERE view_source = 'direct') as direct_views
       FROM lush_profile_views
       WHERE viewed_user_id = $1`,
      [userId]
    );

    const matchStats = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE action = 'like') as likes_received,
        COUNT(*) FILTER (WHERE action = 'skip') as skips_received
       FROM lush_roll_actions
       WHERE target_id = $1`,
      [userId]
    );

    const totalLikes = parseInt(matchStats.rows[0].likes_received || 0, 10);
    const totalViews = parseInt(viewsSummary.rows[0].total_views || 0, 10);
    const popularityScore = totalViews > 0 ? Math.min(100, Math.round((totalLikes / totalViews) * 100)) : 50;

    res.json({
      success: true,
      data: {
        totalViews,
        uniqueViewers: parseInt(viewsSummary.rows[0].unique_viewers || 0, 10),
        viewsBySource: {
          swipe: parseInt(viewsSummary.rows[0].swipe_views || 0, 10),
          discover: parseInt(viewsSummary.rows[0].discover_views || 0, 10),
          search: parseInt(viewsSummary.rows[0].search_views || 0, 10),
          direct: parseInt(viewsSummary.rows[0].direct_views || 0, 10)
        },
        likesReceived: totalLikes,
        skipsReceived: parseInt(matchStats.rows[0].skips_received || 0, 10),
        popularityIndex: popularityScore
      }
    });
  } catch (error) {
    logger.error('Error fetching LushPressies profile analytics:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve analytics' });
  }
});

// POST /api/lushpressies-analytics/view - Log profile view with source attribution
router.post('/view', async (req, res) => {
  try {
    const viewerId = req.user?.id || req.body.viewerId;
    const { profileId, source = 'discover' } = req.body;

    if (!profileId) {
      return res.status(400).json({ success: false, message: 'profileId is required' });
    }

    if (viewerId && String(viewerId) === String(profileId)) {
      return res.json({ success: true, message: 'Self views are not counted in analytics' });
    }

    await pool.query(
      `INSERT INTO lush_profile_views (viewed_user_id, viewer_id, view_source, viewed_at)
       VALUES ($1, $2, $3, NOW())`,
      [profileId, viewerId || null, source]
    );

    res.status(201).json({
      success: true,
      message: 'View logged successfully'
    });
  } catch (error) {
    logger.error('Error logging profile view:', error);
    res.status(500).json({ success: false, message: 'Failed to log view' });
  }
});

// GET /api/lushpressies-analytics/ugc-splits - 60/20/20 UGC revenue split breakdown
router.get('/ugc-splits', async (req, res) => {
  try {
    const creatorId = req.user?.id || req.query.creatorId;
    if (!creatorId) {
      return res.status(400).json({ success: false, message: 'creatorId is required' });
    }

    const splits = await pool.query(
      `SELECT
        COUNT(*) as total_sales,
        COALESCE(SUM(creator_amount), 0) as creator_earnings,
        COALESCE(SUM(platform_amount), 0) as platform_cut,
        COALESCE(SUM(retention_amount), 0) as retention_pool,
        COALESCE(SUM(gross_amount), 0) as total_volume
       FROM lush_ugc_splits
       WHERE creator_id = $1`,
      [creatorId]
    );

    res.json({
      success: true,
      data: {
        totalSales: parseInt(splits.rows[0].total_sales || 0, 10),
        creatorEarnings: parseFloat(splits.rows[0].creator_earnings || 0).toFixed(2),
        platformCut: parseFloat(splits.rows[0].platform_cut || 0).toFixed(2),
        retentionPool: parseFloat(splits.rows[0].retention_pool || 0).toFixed(2),
        totalGrossVolume: parseFloat(splits.rows[0].total_volume || 0).toFixed(2),
        splitFormula: '60% Creator / 20% Platform / 20% Community Ecosystem'
      }
    });
  } catch (error) {
    logger.error('Error fetching UGC revenue splits:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve revenue splits' });
  }
});

module.exports = router;
