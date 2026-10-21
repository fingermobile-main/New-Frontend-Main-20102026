const express = require('express');
const cdn = require('../controllers/CDNController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// CDN endpoints
router.post('/invalidate', authenticate, cdn.invalidateCache); // Admin only
router.get('/stats', authenticate, cdn.getCacheStats);
router.get('/performance', authenticate, cdn.getPerformanceMetrics);
router.post('/configure-rules', authenticate, cdn.configureCachingRules); // Admin only

module.exports = router;
