/**
 * Marketing Router
 * FingerMobile Protocol™ - Dedicated Marketing & Analytics Endpoints
 * Routes mounted at /api/marketing
 */

const express = require('express');
const canaryAdsController = require('../controllers/canaryAdsController');

const router = express.Router();

router.get('/', canaryAdsController.getMarketingOverview);
router.get('/overview', canaryAdsController.getMarketingOverview);
router.get('/stats', canaryAdsController.getMarketingOverview);

module.exports = router;
