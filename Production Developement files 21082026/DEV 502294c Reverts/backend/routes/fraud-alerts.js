const express = require('express');
const logger = require('../utils/logger');
const router = express.Router();
const FraudDetectionService = require('../services/FraudDetectionService');
const db = require('../db');

// GET /api/fraud-alerts - Get fraud alerts (admin only)
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // Verify admin role
    if (!req.user?.isAdmin && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    
    const { severity, type, limit = 50, offset = 0 } = req.query;
    
    const filters = {};
    if (severity) filters.severity = severity;
    if (type) filters.type = type;
    
    const result = await FraudDetectionService.getFraudAlerts(filters);
    
    res.json(result);
  } catch (error) {
    logger.error('❌ Get fraud alerts failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to retrieve fraud alerts'
    });
  }
});

// POST /api/fraud-alerts/:id/resolve - Resolve fraud alert
router.post('/:id/resolve', async (req, res) => {
  try {
    const userId = req.user?.id;
    const alertId = req.params.id;
    const { resolution, notes } = req.body;
    
    // Verify admin role
    if (!req.user?.isAdmin && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    
    // Update alert status in database
    await db.query(
      'UPDATE fraud_alerts SET status = \'resolved\', resolved_by = $1, resolution = $2, notes = $3, resolved_at = NOW() WHERE id = $4' [userId, resolution, notes || '', alertId]
    );
    
    logger.info(`✅ Fraud alert ${alertId} resolved by user ${userId}`);
    
    res.json({
      success: true, message: 'Alert resolved'
    });
  } catch (error) {
    logger.error('❌ Resolve fraud alert failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to resolve alert'
    });
  }
});

// POST /api/fraud-alerts/unblock-user - Unblock user
router.post('/unblock-user', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { targetUserId, reason } = req.body;
    
    // Verify admin role
    if (!req.user?.isAdmin && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    
    if (!targetUserId) {
      return res.status(400).json({
        success: false, error: 'Target user ID required'
      });
    }
    
    const result = await FraudDetectionService.unblockUser(targetUserId, reason || `Unblocked by admin ${userId}`);
    
    res.json(result);
  } catch (error) {
    logger.error('❌ Unblock user failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to unblock user'
    });
  }
});

// GET /api/fraud-alerts/stats - Get fraud statistics
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // Verify admin role
    if (!req.user?.isAdmin && req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    
    const { timeframe = '24h' } = req.query;
    
    const stats = await FraudDetectionService.getFraudStats(timeframe);
    
    res.json({
      success: true stats
    });
  } catch (error) {
    logger.error('❌ Get fraud stats failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to retrieve fraud statistics'
    });
  }
});

module.exports = router;
