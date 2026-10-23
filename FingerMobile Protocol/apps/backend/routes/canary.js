/**
 * Canary & Advertising Router
 * FingerMobile Protocol™ - Internal Advertising, Marketing & Ad Creator Engine
 * Routes mounted at /api/canary, /api/ads, /api/campaigns, /api/marketing
 */

const express = require('express');
const canaryAdsController = require('../controllers/canaryAdsController');

const router = express.Router();

// 0. Base Ads List (For /api/ads and /api/canary root)
router.get('/', canaryAdsController.getAllAds);

// 1. Advertiser Registration & Profile
router.post('/advertiser/register', canaryAdsController.registerAdvertiser);
router.get('/advertiser/me', canaryAdsController.getAdvertiserProfile);
router.post('/advertiser/disclaimer', canaryAdsController.acceptDisclaimer);

// 2. Campaigns
router.get('/campaigns', canaryAdsController.getCampaigns);
router.post('/campaigns', canaryAdsController.createCampaign);
router.get('/campaigns/:id', canaryAdsController.getCampaignById);
router.put('/campaigns/:id/status', canaryAdsController.updateCampaignStatus);
router.delete('/campaigns/:id', canaryAdsController.deleteCampaign);
router.post('/campaigns/:id/checkout', canaryAdsController.processPayment);
router.get('/campaigns/:id/analytics', canaryAdsController.getCampaignAnalytics);
router.get('/advertiser/analytics/:campaignId', canaryAdsController.getCampaignAnalytics);

// 3. Ad Groups & Creatives
router.post('/campaigns/:id/ad-groups', canaryAdsController.createAdGroup);
router.post('/ad-groups/:adGroupId/creatives', canaryAdsController.addCreative);
// Adding the missing route for creatives creation (using a simpler route)
router.post('/creatives', canaryAdsController.addCreative);

// 4. Public Ad Delivery & Tracking
router.get('/delivery/:placement', canaryAdsController.getDeliveryAds);
router.post('/track/impression', canaryAdsController.trackImpression);
router.post('/track/click', canaryAdsController.trackClick);

// 5. SuperAdmin RBAC Review Queue & Moderation
router.get('/admin/queue', canaryAdsController.getAdminQueue);
router.put('/admin/moderate/:creativeId', canaryAdsController.moderateCreative);

// 6. Whitelist Publishers for Instant Articles
router.get('/publishers/whitelist', canaryAdsController.getWhitelistedPublishers);
router.post('/publishers/whitelist', canaryAdsController.whitelistPublisher);

// 7. Marketing Overview & Analytics
router.get('/marketing/overview', canaryAdsController.getMarketingOverview);
router.get('/overview', canaryAdsController.getMarketingOverview);
router.get('/stats', canaryAdsController.getMarketingOverview);

// 8. Canary Announcements (CanaryPage.tsx)
router.get('/announcements', canaryAdsController.getAnnouncements);
router.post('/announcements', canaryAdsController.createAnnouncement);
router.post('/announcements/:id/like', canaryAdsController.likeAnnouncement);

module.exports = router;
