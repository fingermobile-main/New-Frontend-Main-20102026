/**
 * Campaigns Router
 * FingerMobile Protocol™ - Dedicated Campaigns Management Endpoints
 * Routes mounted at /api/campaigns
 */

const express = require('express');
const canaryAdsController = require('../controllers/canaryAdsController');

const router = express.Router();

router.get('/', canaryAdsController.getCampaigns);
router.post('/', canaryAdsController.createCampaign);
router.get('/:id', canaryAdsController.getCampaignById);
router.put('/:id/status', canaryAdsController.updateCampaignStatus);
router.delete('/:id', canaryAdsController.deleteCampaign);
router.get('/:id/analytics', canaryAdsController.getCampaignAnalytics);
router.post('/:id/checkout', canaryAdsController.processPayment);

module.exports = router;
