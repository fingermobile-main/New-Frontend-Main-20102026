/*
 * FingerMobile Protocol™ - Analytics Routes
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

// Published UGC Analytics
router.get('/published/:userId', authMiddleware.requireAuth, analyticsController.getPublishedUGC);
router.get('/published/:contentId/watch-segments', authMiddleware.requireAuth, analyticsController.getWatchSegments);
router.get('/published/:contentId/distribution', authMiddleware.requireAuth, analyticsController.getDistributionMetrics);

// Scheduled UGC Analytics
router.get('/scheduled/:userId', authMiddleware.requireAuth, analyticsController.getScheduledUGC);
router.get('/drafts/:userId', authMiddleware.requireAuth, analyticsController.getDrafts);

// Export functionality
router.post('/export/csv', authMiddleware.requireAuth, analyticsController.exportToCSV);
router.post('/export/pdf', authMiddleware.requireAuth, analyticsController.exportToPDF);

// Real-time metrics
router.get('/live-metrics/:contentId', authMiddleware.requireAuth, analyticsController.getLiveMetrics);

module.exports = router;