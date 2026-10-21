/**
 * Lush Pressies — Standalone Geo & Location Router
 * Handles GeoTag Passport/Visa cross-border travel, opt-in GPS check-ins,
 * radius-based proximity matching (2km-7km, 10km-15km), and heatmap aggregations.
 * Date: October 6, 2026 - Phase 2 Ecosystem
 */

const express = require('express');
const router = express.Router();
const matchCtrl = require('../controllers/lushpressiesMatchingController');
const { pool } = require('../db');
const logger = require('../utils/logger');

// POST /api/lushpressies-geo/passport - Set GeoTag Passport/Visa for travel mode
router.post('/passport', (req, res) => matchCtrl.setPassport(req, res));

// POST /api/lushpressies-geo/checkin - SocialMe / SeeMi GPS Check-in (Opt-in only)
router.post('/checkin', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { latitude, longitude, venueName, visibility = 'friends' } = req.body;

    if (!userId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ success: false, message: 'userId, latitude, and longitude are required' });
    }

    // Upsert opt-in record
    await pool.query(
      `INSERT INTO lush_location_opt_ins (user_id, is_opted_in, updated_at)
       VALUES ($1, true, NOW())
       ON CONFLICT (user_id) DO UPDATE SET is_opted_in = true, updated_at = NOW()`,
      [userId]
    );

    // Save location event
    const checkin = await pool.query(
      `INSERT INTO lush_socialme_locations (user_id, latitude, longitude, venue_name, checked_in_at, is_active)
       VALUES ($1, $2, $3, $4, NOW(), true)
       RETURNING *`,
      [userId, latitude, longitude, venueName || null]
    );

    res.status(201).json({
      success: true,
      message: 'GPS check-in registered successfully',
      data: checkin.rows[0]
    });
  } catch (error) {
    logger.error('Error recording GPS check-in:', error);
    res.status(500).json({ success: false, message: 'Failed to record check-in' });
  }
});

// GET /api/lushpressies-geo/nearby - Radius Proximity matching (2km-7km Area, 10km-15km District)
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, radiusKm = 10, limit = 20 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'latitude and longitude are required' });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const rad = parseFloat(radiusKm);

    // Approximate Haversine formula calculation for proximity
    const result = await pool.query(
      `SELECT
        s.id as checkin_id,
        s.user_id,
        u.username,
        u.avatar_url,
        s.venue_name,
        s.latitude,
        s.longitude,
        ROUND((
          6371 * acos(
            cos(radians($1)) * cos(radians(s.latitude)) *
            cos(radians(s.longitude) - radians($2)) +
            sin(radians($1)) * sin(radians(s.latitude))
          )
        )::numeric, 2) as distance_km
       FROM lush_socialme_locations s
       JOIN users u ON u.id = s.user_id
       WHERE s.is_active = true
       ORDER BY distance_km ASC
       LIMIT $3`,
      [lat, lng, parseInt(limit, 10)]
    );

    const filtered = result.rows.filter(r => r.distance_km <= rad);

    res.json({
      success: true,
      data: filtered,
      count: filtered.length,
      searchRadiusKm: rad
    });
  } catch (error) {
    logger.error('Error querying nearby members:', error);
    res.status(500).json({ success: false, message: 'Failed to find nearby members' });
  }
});

// GET /api/lushpressies-geo/heatmaps - Heatmap aggregations of active high-traffic zones
router.get('/heatmaps', async (req, res) => {
  try {
    const { city = 'Global' } = req.query;

    const heatmaps = await pool.query(
      `SELECT
        COALESCE(venue_name, 'Urban Hot Zone') as zone_name,
        ROUND(AVG(latitude)::numeric, 4) as center_lat,
        ROUND(AVG(longitude)::numeric, 4) as center_lng,
        COUNT(*) as active_members_count,
        'High Traffic Social Density' as zone_label
       FROM lush_socialme_locations
       WHERE is_active = true
       GROUP BY venue_name
       ORDER BY active_members_count DESC
       LIMIT 20`
    );

    res.json({
      success: true,
      data: heatmaps.rows,
      targetScope: city
    });
  } catch (error) {
    logger.error('Error fetching heatmap aggregations:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve heatmaps' });
  }
});

module.exports = router;
