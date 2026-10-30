/**
 * Canary & Advertising Router
 * FingerMobile Protocol™ - Internal Advertising, Marketing & Ad Creator Engine
 * Routes mounted at /api/canary, /api/ads, /api/campaigns, /api/marketing
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const canaryAdsController = require('../controllers/canaryAdsController');

const router = express.Router();

// Multer storage for Canary ad media (images, cover photos, videos)
const canaryUploadDir = path.join(__dirname, '../public/uploads/canary');
if (!fs.existsSync(canaryUploadDir)) {
  fs.mkdirSync(canaryUploadDir, { recursive: true });
}

const canaryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, canaryUploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.webp';
    const clean = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `canary_${Date.now()}_${clean}${ext}`);
  }
});

const canaryUpload = multer({
  storage: canaryStorage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for high-res video and banners
});

// Canary Media Upload (Supports image, cover photo, video)
router.post('/upload-media', canaryUpload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'cover', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 }
]), canaryAdsController.uploadMedia);
router.post('/upload', canaryUpload.single('file'), canaryAdsController.uploadMedia);

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

// 9. Dynamic Pricing & Rates Rules
router.get('/pricing-rules', canaryAdsController.getPricingRules);
router.put('/pricing-rules/:id', canaryAdsController.updatePricingRule);

module.exports = router;
