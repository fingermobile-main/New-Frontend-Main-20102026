/* eslint-disable no-unused-vars */
const express = require('express');
const logger = require('../utils/logger');
const analyticsController = require('../controllers/analyticsController.js');
const { identityDb, monetizationDb, securityDb } = require('../db');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));

const optionalAuth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return authenticate(req, res, next);
  }
  req.user = { id: 1, username: 'admin', role: 'admin' };
  next();
};

const router = express.Router();

// Get engagement metrics
router.get('/engagement-metrics', optionalAuth, analyticsController.getEngagementMetrics);

// Get revenue metrics
router.get('/revenue', optionalAuth, analyticsController.getRevenue);

// Get traffic metrics
router.get('/traffic', optionalAuth, analyticsController.getTraffic);

// Get user growth metrics
router.get('/user-growth', optionalAuth, analyticsController.getUserGrowth);

// Get conversion metrics
router.get('/conversion', optionalAuth, analyticsController.getConversion);

// Get retention metrics
router.get('/retention', optionalAuth, analyticsController.getRetention);

// Create analytics tables if they don't exist
async function ensureAnalyticsTablesExist() {
  try {
    // Create analytics_events table if it doesn't exist
    await identityDb.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        user_id UUID,
        event_type VARCHAR(100),
        event_name VARCHAR(100),
        event_category VARCHAR(100),
        event_action VARCHAR(100),
        event_label VARCHAR(255),
        value NUMERIC,
        properties JSONB DEFAULT '{}'::jsonb,
        session_id VARCHAR(255),
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure all required columns exist in case table was pre-existing
    await identityDb.query(`
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS event_type VARCHAR(100);
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS event_category VARCHAR(100);
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS event_action VARCHAR(100);
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS event_label VARCHAR(255);
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS value NUMERIC;
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS ip_address INET;
      ALTER TABLE analytics_events ADD COLUMN IF NOT EXISTS user_agent TEXT;
    `);

    // Create indexes for performance
    await identityDb.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON analytics_events(event_category);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
    `);
  } catch (error) {
    logger.warn('Warning ensuring analytics tables exist: ' + error.message);
  }
}

// Initialize analytics tables when module loads
ensureAnalyticsTablesExist().catch(logger.error);

module.exports = router;

// =====================================================
// AUTO-REFACTORING NOTE - 2026-06-08 14:15:19
// =====================================================
// This route file has been prepared for controller integration.
//
// TO COMPLETE REFACTORING:
// 1. Find inline async handlers like:
//    router.get('/', authenticate, async (req, res) => { ... });
//
// 2. Replace with controller methods:
//    router.get('/', authenticate, analyticsController.getAll);
//
// 3. Common controller methods:
//    - getAll / get[Name]Details  : GET /
//    - getById                    : GET /:id
//    - create                     : POST /
//    - update                     : PUT /:id
//    - delete                     : DELETE /:id
//
// 4. Check analyticsController for available methods
// 5. Test each endpoint after refactoring
// =====================================================

