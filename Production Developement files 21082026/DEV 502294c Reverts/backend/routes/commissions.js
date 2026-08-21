const express = require('express');
const router = express.Router();
const CommissionController = require('../controllers/CommissionController');
const { authenticate, requireAdmin } = require('../middleware/authenticate');

/**
 * Commission Routes
 * All routes require authentication unless specified
 */

// Calculate commission (public for estimation)
router.post('/calculate', CommissionController.calculate.bind(CommissionController));

// Record commission (typically called by payment/webhook handlers)
router.post('/record', authenticate, CommissionController.record.bind(CommissionController));

// Get authenticated user's commissions
router.get('/my-commissions', authenticate, CommissionController.getMyCommissions.bind(CommissionController));

// Process payout for a commission
router.post('/payout', authenticate, CommissionController.processPayout.bind(CommissionController));

// Get commission statistics
router.get('/stats', authenticate, CommissionController.getStats.bind(CommissionController));

// Admin routes
router.get('/pending', requireAdmin, CommissionController.getPendingCommissions.bind(CommissionController));
router.put('/rules', requireAdmin, CommissionController.updateRule.bind(CommissionController));

module.exports = router;
