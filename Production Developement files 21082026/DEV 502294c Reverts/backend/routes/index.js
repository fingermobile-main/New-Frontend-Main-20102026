const express = require("express");
const { body, param, query, validationResult } = require("express-validator");
const { authenticate } = require("../middleware/authenticate");
const BlockMuteController = require("../controllers/BlockMuteController");
const LiveStreamController = require("../controllers/LiveStreamController");

// Import existing JS route files
const walletRoutes = require('./wallet');
const authRoutes = require('./auth');
const aiRoutes = require('./ai');
const paymentWebhooksModule = require('../dist/routes/payment.webhooks');
const paymentWebhooks = paymentWebhooksModule.default || paymentWebhooksModule;
const paymentsRoutes = require('./payments');

// Video Translation Routes
const videoTranslationRoutes = require('./videoTranslation');

// Critical route imports - Minimal set for auth testing
const notificationRoutes = require('./notifications');
const messageRoutes = require('./messages');
const postRoutes = require('./posts');
const marketplaceRoutes = require('./marketplace');
const communityRoutes = require('./community');
const commentRoutes = require('./comments');
const memberRoutes = require('./members');
const helpcenterRoutes = require('./helpcenter');
const forumsRoutes = require('./forums');

// FIXED: Added previously uninstantiated routes causing runtime execution crashes
const achievementsRoutes = require('./achievements'); 
const blogsRoutes = require('./blogs');
const authEnhancementsRoutes = require('./authEnhancements');

// Additional route imports (previously unregistered)
const cacheManagementRoutes = require('./cache-management');
const contentManagementRoutes = require('./contentmanagement');
const metricsRoutes = require('./metrics');
const rateLimitConfigRoutes = require('./rate-limit-config');
const voiceFeedRoutes = require('./voicefeed');
const voiceLinesRoutes = require('./voicelines');
const creatorInfluenceSubscriptionRoutes = require('./creatorInfluenceSubscriptionRoutes');

// Batch 1: Core platform routes
const activityRoutes = require('./activity');
const adminRoutes = require('./admin');
const analyticsRoutes = require('./analytics');
const apiDocumentationRoutes = require('./apiDocumentation');
const apiKeysRoutes = require('./apiKeys');
const auditLogAdminRoutes = require('./audit-log-admin');
const authenticatorRoutes = require('./authenticator');
const backupsRoutes = require('./backups');
const beatwaveRoutes = require('./beatwave');
const biometricRoutes = require('./biometric');
const blockingRoutes = require('./blocking');
const camusRoutes = require('./camus');
const canaryRoutes = require('./canary');
const cdnRoutes = require('./cdn');
const commerceRoutes = require('./commerce');
const commissionsRoutes = require('./commissions');
const communitiesRoutes = require('./communities');
const connectionsRoutes = require('./connections');
const contentModerationRoutes = require('./contentModeration');
const contentOperationsRoutes = require('./contentOperations');
const courseContentRoutes = require('./course-content');
const csvImportRoutes = require('./csvImport');
const dashboardRoutes = require('./dashboard');
const developerRoutes = require('./developer');
const discoverRoutes = require('./discover');
const elearningRoutes = require('./elearning');
const enhancedWalletRoutes = require('./enhanced_wallet');
const exportRoutes = require('./export');
const externalServicesRoutes = require('./externalServices');
const featureFlagsRoutes = require('./feature-flags');
const ficRoutes = require('./fic');
const ficRoutesFull = require('./ficRoutes');
const fingerluxRoutes = require('./fingerlux');
const fingershortsRoutes = require('./fingershorts');
const fingerwarsRoutes = require('./fingerwars');
const flamingoRoutes = require('./flamingo');
const forumCategoriesRoutes = require('./forumcategories');
const fraudAlertsRoutes = require('./fraud-alerts');
const gameonRoutes = require('./gameon');
const gamificationRoutes = require('./gamification');
const gemsRoutes = require('./gems');
const generalRoutes = require('./general');
const generalEndpointsRoutes = require('./generalEndpoints');
const giftcardsRoutes = require('./giftcards');
const governanceRoutes = require('./governance');
const gradingSystemRoutes = require('./grading-system');
const groupsRoutes = require('./groups');
const hallmarksRoutes = require('./hallmarks');
const identityRoutes = require('./identity');
const integrationsRoutes = require('./integrations');
const integrationsModuleRoutes = require('./integrations-module');
const itemsRoutes = require('./items');
const leaderboardsRoutes = require('./leaderboards');
const lendsqRoutes = require('./lendsq');
const likesRoutes = require('./likes');
const luminaRoutes = require('./lumina');
const luminaMediaRoutes = require('./lumina-media');
const luminaUploadRoutes = require('./lumina-upload');
const lushpressiesRoutes = require('./lushpressies');
const marketplaceTmsRoutes = require('./marketplace-tms');
const mediaRoutes = require('./media');
const meisheVideoEditorRoutes = require('./meishe_video_editor');
const memberProfilesRoutes = require('./memberprofiles');
const miiRoutes = require('./mii');
const mobileVideoEditorRoutes = require('./mobile_video_editor');
const moderationRoutes = require('./moderation');
const monetizationRoutes = require('./monetization');
const myLearningRoutes = require('./mylearning');
const nexusGnnRoutes = require('./nexusgnn');
const nyscRoutes = require('./nysc');
const oauth2Routes = require('./oauth2');
const ownitRoutes = require('./ownit');
const p2pMatchingRoutes = require('./p2p-matching');
const paymentWebhookRoutes = require('./payment-webhooks');
const permanenceRoutes = require('./permanence');
const permanenceDataRoutes = require('./permanence-data');
const permanenceMonetizationRoutes = require('./permanence_monetization');
const photoCreditsRoutes = require('./photocredits');
const platformThemesRoutes = require('./platformThemes');
const promptsRoutes = require('./prompts');
const protocolRoutes = require('./protocol');
const publiciteeRoutes = require('./publicitee');
const recommendationsRoutes = require('./recommendations');
const registrationLockRoutes = require('./registrationLock');
const seadsRoutes = require('./seads');
const searchRoutes = require('./search');
const searchElasticsearchRoutes = require('./search-elasticsearch');
const securityRoutes = require('./security');
const sentientRoutes = require('./sentient');
const stercsRoutes = require('./stercs');
const storefrontRoutes = require('./storefront');
const superviAchievementsRoutes = require('./supervi_achievements');
const superviLeaderboardsRoutes = require('./supervi_leaderboards');
const tmsRoutes = require('./tms');
const trendsRoutes = require('./trends');
const twoFactorAuthRoutes = require('./twoFactorAuth');
const ugcMediaRoutesRoutes = require('./ugc_media_routes');
const uploadsRoutes = require('./uploads');
const userManagementRoutes = require('./userManagement');
const videoEditorRoutes = require('./video_editor');
const webhookDeliveriesRoutes = require('./webhook-deliveries');
const webhooksRoutes = require('./webhooks');
const widgetsRoutes = require('./widgets');

// FIXED: Adding missing route import for ai-credit-balance
const aiCreditBalanceRoutes = require('./ai-credit-balance');

const router = express.Router();

// Add rate limiting middleware for specific routes to prevent abuse
const rateLimit = require('express-rate-limit');

// General rate limiter for authenticated users
const authenticatedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Special rate limiter for sensitive operations
const sensitiveOperationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit to 10 requests for sensitive operations
  message: {
    success: false,
    message: 'Too many requests for sensitive operations, please try again later.'
  }
});

// Authentication Routes
router.use("/auth", authRoutes);

// Add validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Wallet Routes (Mounted to base or explicit path if required)
router.use('/wallet', authenticate, walletRoutes);

// AI Routes
router.use("/ai", authenticate, aiRoutes);

// Payment Webhooks (no authentication required - these come from external services)
router.use("/webhooks", paymentWebhooks);

// Video Translation Routes
router.use("/video-translation", authenticate, videoTranslationRoutes);

// Block/Mute Routes
router.post(
  "/block",
  authenticate,
  [
    body("blockedId")
      .isString()
      .notEmpty()
      .withMessage("Blocked user ID is required"),
    body("muteType")
      .optional()
      .isIn(["block", "mute_profile", "mute_notifications", "mute_ugc"])
      .withMessage("Invalid mute type"),
    body("reason").optional().isString().withMessage("Reason must be a string"),
    body("duration")
      .optional()
      .isIn([
        "indefinite", "24hrs", "two_weeks", "one_month", "three_months", "six_months", "one_year"
      ])
      .withMessage("Invalid duration specified")
  ],
  validate,
  BlockMuteController.blockUser);

router.post(
  "/mute/notifications",
  authenticate,
  [
    body("mutedUserId")
      .isString()
      .notEmpty()
      .withMessage("Muted user ID is required")
  ],
  validate,
  BlockMuteController.muteNotifications);

router.post(
  "/mute/ugc",
  authenticate,
  [
    body("mutedUserId")
      .isString()
      .notEmpty()
      .withMessage("Muted user ID is required")
  ],
  validate,
  BlockMuteController.muteUgc);

router.delete(
  "/block/:blockedId/:muteType",
  authenticate,
  [
    param("blockedId")
      .isString()
      .notEmpty()
      .withMessage("Blocked user ID is required"),
    param("muteType")
      .isIn(["block", "mute_profile", "mute_notifications", "mute_ugc"])
      .withMessage("Invalid mute type")
  ],
  validate,
  BlockMuteController.unblockUser);

router.get(
  "/blocks",
  authenticate,
  [
    query("muteType")
      .optional()
      .isIn(["block", "mute_profile", "mute_notifications", "mute_ugc"])
      .withMessage("Invalid mute type")
  ],
  validate,
  BlockMuteController.getBlockedMutedUsers);

router.get(
  "/block-status/:targetUserId",
  authenticate,
  [
    param("targetUserId")
      .isString()
      .notEmpty()
      .withMessage("Target user ID is required")
  ],
  validate,
  BlockMuteController.checkBlockStatus);

// Live Streaming Routes
router.post(
  "/live-stream",
  authenticate,
  sensitiveOperationLimiter,
  [
    body("title")
      .isLength({ min: 3, max: 100 })
      .withMessage("Title must be between 3 and 100 characters"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("category").isString().notEmpty().withMessage("Category is required"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("affiliatePartnerType")
      .isIn([
        "influencer", "content_creator", "blogger", "course_creator", "business", "coach", "musician", "gamer", "podcaster", "marketer", "agency", "freelancer", "media_professional", "nonprofit"
      ])
      .withMessage("Invalid affiliate partner type"),
    body("maxDuration")
      .optional()
      .isInt({ min: 1, max: 24 })
      .withMessage("Max duration must be between 1 and 24 hours"),
    body("scheduledStartTime")
      .optional()
      .isISO8601()
      .withMessage("Scheduled start time must be a valid date")
  ],
  validate, // FIXED: Added validation gate before controller execution
  LiveStreamController.createLiveStream);

router.post(
  "/live-stream/:streamId/start",
  authenticate,
  sensitiveOperationLimiter,
  [param("streamId").isUUID().withMessage("Valid stream ID is required")],
  validate, // FIXED: Added validation gate
  LiveStreamController.startLiveStream);

router.post(
  "/live-stream/:streamId/end",
  authenticate,
  sensitiveOperationLimiter,
  [param("streamId").isUUID().withMessage("Valid stream ID is required")],
  validate, // FIXED: Added validation gate
  LiveStreamController.endLiveStream);

router.get(
  "/live-streams/active",
  [
    query("category")
      .optional()
      .isString()
      .withMessage("Category must be a string"),
    query("affiliatePartnerType")
      .optional()
      .isIn([
        "influencer", "content_creator", "blogger", "course_creator", "business", "coach", "musician", "gamer", "podcaster", "marketer", "agency", "freelancer", "media_professional", "nonprofit"
      ])
      .withMessage("Invalid affiliate partner type"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("offset")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Offset must be a positive integer")
  ],
  validate, // FIXED: Added validation gate
  LiveStreamController.getActiveStreams);

router.get(
  "/live-stream/:streamId",
  [param("streamId").isUUID().withMessage("Valid stream ID is required")],
  validate, // FIXED: Added validation gate
  LiveStreamController.getLiveStream);

router.patch(
  "/live-stream/:streamId/viewers",
  authenticate,
  [
    param("streamId").isUUID().withMessage("Valid stream ID is required"),
    body("viewerCount")
      .isInt({ min: 0 })
      .withMessage("Viewer count must be a non-negative integer")
  ],
  validate, // FIXED: Added validation gate
  LiveStreamController.updateViewerCount);

router.get("/can-go-live", authenticate, LiveStreamController.canGoLive);

// ==========================================
// AUTHENTICATED ROUTES (All require authentication)
// ==========================================

// Payment Routes
router.use('/payments', authenticate, paymentsRoutes);

// Notification Routes
router.use('/notifications', authenticate, notificationRoutes);

// Messaging Routes
router.use('/messages', authenticate, messageRoutes);

// Post/Social Feed Routes
router.use('/posts', authenticate, postRoutes);

// Cache Management Routes
router.use('/cache-management', authenticate, authenticatedLimiter, cacheManagementRoutes);

// Content Management Routes
router.use('/contentmanagement', authenticate, authenticatedLimiter, contentManagementRoutes);

// Metrics Routes
router.use('/metrics', authenticate, authenticatedLimiter, metricsRoutes);

// Rate Limit Configuration Routes
router.use('/rate-limit-config', authenticate, authenticatedLimiter, rateLimitConfigRoutes);

// Voice Feed Routes
router.use('/voice-feed', authenticate, authenticatedLimiter, voiceFeedRoutes);

// Voice Lines Routes
router.use('/voice-lines', authenticate, authenticatedLimiter, voiceLinesRoutes);

// Creator Influence Subscription Routes
router.use('/creator-influence-subscription-routes', authenticate, authenticatedLimiter, creatorInfluenceSubscriptionRoutes);

// Marketplace Routing Interceptors - Protected sub-routes first
router.use('/marketplace/unified-orders', authenticate, authenticatedLimiter, marketplaceRoutes);
router.use('/marketplace/transactions', authenticate, authenticatedLimiter, marketplaceRoutes);

// Community Routes
router.use('/community', authenticate, authenticatedLimiter, communityRoutes);

// Comment Routes
router.use('/comments', authenticate, authenticatedLimiter, commentRoutes);

// Commerce Routes - ENABLED
router.use('/commerce', authenticate, authenticatedLimiter, commerceRoutes);

// Member Routes
router.use('/members', authenticate, authenticatedLimiter, memberRoutes);

// GameOn Routes - ENABLED
router.use('/gameon', authenticate, authenticatedLimiter, gameonRoutes);

// Camus (Learning) Routes - ENABLED
router.use('/camus', authenticate, authenticatedLimiter, camusRoutes);

// Grading System Routes - ENABLED
router.use('/grading-system', authenticate, authenticatedLimiter, gradingSystemRoutes);

// AI Credit Balance Routes - ENABLED (FIXED: Now properly imported)
router.use('/ai-credit-balance', authenticate, authenticatedLimiter, aiCreditBalanceRoutes);

// Giftcards Routes - ENABLED
router.use('/giftcards', authenticate, authenticatedLimiter, giftcardsRoutes);

// Help Center Routes - ENABLED
router.use('/helpcenter', authenticate, authenticatedLimiter, helpcenterRoutes);

// Achievements Routes - ENABLED
router.use('/achievements', authenticate, authenticatedLimiter, achievementsRoutes);

// ==========================================
// ALL ROUTES ACTIVATED
// ==========================================

// FingerLux Luxury Marketplace - ENABLED
router.use('/fingerlux', authenticate, authenticatedLimiter, fingerluxRoutes);

// Commissions System - ENABLED
router.use('/commissions', authenticate, authenticatedLimiter, commissionsRoutes);

// Recommendations Engine - ENABLED
router.use('/recommendations', authenticate, authenticatedLimiter, recommendationsRoutes);

// UGC Media Uploads - ENABLED
router.use('/ugc-media', authenticate, authenticatedLimiter, ugcMediaRoutes);

// FingerWars Gaming Platform - ENABLED
router.use('/fingerwars', authenticate, authenticatedLimiter, fingerwarsRoutes);

// Blogs Platform - ENABLED
router.use('/blogs', authenticate, authenticatedLimiter, blogsRoutes);

// Discussion Forums (Protected with middleware to secure forum posts)
router.use('/forums', authenticate, authenticatedLimiter, forumsRoutes);

// FIXED: Removed duplicate /marketplace route mounting that caused parameter intercept risks
// Marketplace routes are already mounted at /marketplace/unified-orders and /marketplace/transactions above

// Analytics Dashboard - ENABLED
router.use('/analytics', authenticate, authenticatedLimiter, analyticsRoutes);

// Admin Panel - ENABLED
router.use('/admin', authenticate, authenticatedLimiter, adminRoutes);

// Feature Flags - ENABLED
router.use('/feature-flags', authenticate, authenticatedLimiter, featureFlagsRoutes);

// Governance System - ENABLED
router.use('/governance', authenticate, authenticatedLimiter, governanceRoutes);

// Data Export - ENABLED
router.use('/export', authenticate, authenticatedLimiter, exportRoutes);

// Fraud Alerts - ENABLED
router.use('/fraud-alerts', authenticate, authenticatedLimiter, fraudAlertsRoutes);

// Security Settings - ENABLED
router.use('/security', authenticate, authenticatedLimiter, securityRoutes);

// User Management - ENABLED
router.use('/user-management', authenticate, authenticatedLimiter, userManagementRoutes);

// Leaderboards - ENABLED
router.use('/leaderboards', authenticate, authenticatedLimiter, leaderboardsRoutes);

// Gems Currency - ENABLED
router.use('/gems', authenticate, authenticatedLimiter, gemsRoutes);

// FIC Token - ENABLED
router.use('/fic', authenticate, authenticatedLimiter, ficRoutes);

// Stercs Editor - ENABLED
router.use('/stercs', authenticate, authenticatedLimiter, stercsRoutes);

// Sentient AI - ENABLED
router.use('/sentient', authenticate, authenticatedLimiter, sentientRoutes);

// Backups - ENABLED
router.use('/backups', authenticate, authenticatedLimiter, backupsRoutes);

// Communities (Alternative) - ENABLED
router.use('/communities', authenticate, authenticatedLimiter, communitiesRoutes);

// FingerShorts (Short Videos) - ENABLED
router.use('/fingershorts', authenticate, authenticatedLimiter, fingershortsRoutes);

// Beatwave (Music Platform) - ENABLED
router.use('/beatwave', authenticate, authenticatedLimiter, beatwaveRoutes);

// Lumina (Media Platform) - ENABLED
router.use('/lumina', authenticate, authenticatedLimiter, luminaRoutes);

// Activity Feed - ENABLED
router.use('/activity', authenticate, authenticatedLimiter, activityRoutes);

// API Documentation - ENABLED
router.use('/apiDocumentation', authenticate, authenticatedLimiter, apiDocumentationRoutes);

// API Keys Management - ENABLED
router.use('/apiKeys', authenticate, authenticatedLimiter, apiKeysRoutes);

// Audit Log Admin - ENABLED
router.use('/audit-log-admin', authenticate, authenticatedLimiter, auditLogAdminRoutes);

// Auth Enhancements - ENABLED
router.use('/authEnhancements', authenticate, authenticatedLimiter, authEnhancementsRoutes);

// Authenticator - ENABLED
router.use('/authenticator', authenticate, authenticatedLimiter, authenticatorRoutes);

// Biometric Authentication - ENABLED
router.use('/biometric', authenticate, authenticatedLimiter, biometricRoutes);

// Blocking/Muting - ENABLED
router.use('/blocking', authenticate, authenticatedLimiter, blockingRoutes);

// Canary Deployment - ENABLED
router.use('/canary', authenticate, authenticatedLimiter, canaryRoutes);

// CDN Management - ENABLED
router.use('/cdn', authenticate, authenticatedLimiter, cdnRoutes);

// Connections - ENABLED
router.use('/connections', authenticate, authenticatedLimiter, connectionsRoutes);

// Content Moderation - ENABLED
router.use('/contentModeration', authenticate, authenticatedLimiter, contentModerationRoutes);

// Content Operations - ENABLED
router.use('/contentOperations', authenticate, authenticatedLimiter, contentOperationsRoutes);

// Course Content - ENABLED
router.use('/course-content', authenticate, authenticatedLimiter, courseContentRoutes);

// CSV Import - ENABLED
router.use('/csvImport', authenticate, authenticatedLimiter, csvImportRoutes);

// Dashboard - ENABLED
router.use('/dashboard', authenticate, authenticatedLimiter, dashboardRoutes);

// Developer Portal - ENABLED
router.use('/developer', authenticate, authenticatedLimiter, developerRoutes);

// Discover/Explore - ENABLED
router.use('/discover', authenticate, authenticatedLimiter, discoverRoutes);

// E-Learning Platform - ENABLED
router.use('/elearning', authenticate, authenticatedLimiter, elearningRoutes);

// Enhanced Wallet - ENABLED
router.use('/enhanced-wallet', authenticate, authenticatedLimiter, enhancedWalletRoutes);

// External Services Integration - ENABLED
router.use('/externalServices', authenticate, authenticatedLimiter, externalServicesRoutes);

// FIC Full Routes - ENABLED
router.use('/ficRoutes', authenticate, authenticatedLimiter, ficRoutesFull);

// Flamingo Social - ENABLED
router.use('/flamingo', authenticate, authenticatedLimiter, flamingoRoutes);

// Forum Categories - ENABLED
router.use('/forumcategories', authenticate, authenticatedLimiter, forumCategoriesRoutes);

// Gamification System - ENABLED
router.use('/gamification', authenticate, authenticatedLimiter, gamificationRoutes);

// General Endpoints - ENABLED
router.use('/general', authenticate, authenticatedLimiter, generalRoutes);
router.use('/generalEndpoints', authenticate, authenticatedLimiter, generalEndpointsRoutes);

// Groups - ENABLED
router.use('/groups', authenticate, authenticatedLimiter, groupsRoutes);

// Hallmarks - ENABLED
router.use('/hallmarks', authenticate, authenticatedLimiter, hallmarksRoutes);

// Identity Verification - ENABLED
router.use('/identity', authenticate, authenticatedLimiter, identityRoutes);

// Integrations Module - ENABLED
router.use('/integrations-module', authenticate, authenticatedLimiter, integrationsModuleRoutes);
router.use('/integrations', authenticate, authenticatedLimiter, integrationsRoutes);

// Items/Inventory - ENABLED
router.use('/items', authenticate, authenticatedLimiter, itemsRoutes);

// Lendsq Integration - ENABLED
router.use('/lendsq', authenticate, authenticatedLimiter, lendsqRoutes);

// Likes System - ENABLED
router.use('/likes', authenticate, authenticatedLimiter, likesRoutes);

// Lumina Media - ENABLED
router.use('/lumina-media', authenticate, authenticatedLimiter, luminaMediaRoutes);
router.use('/lumina-upload', authenticate, authenticatedLimiter, luminaUploadRoutes);

// Lushpressies - ENABLED
router.use('/lushpressies', authenticate, authenticatedLimiter, lushpressiesRoutes);

// Marketplace TMS - ENABLED
router.use('/marketplace-tms', authenticate, authenticatedLimiter, marketplaceTmsRoutes);

// Media Management - ENABLED
router.use('/media', authenticate, authenticatedLimiter, mediaRoutes);

// Meishe Video Editor - ENABLED
router.use('/meishe-video-editor', authenticate, authenticatedLimiter, meisheVideoEditorRoutes);

// Member Profiles - ENABLED
router.use('/memberprofiles', authenticate, authenticatedLimiter, memberProfilesRoutes);

// Mii Avatars - ENABLED
router.use('/mii', authenticate, authenticatedLimiter, miiRoutes);

// Mobile Video Editor - ENABLED
router.use('/mobile-video-editor', authenticate, authenticatedLimiter, mobileVideoEditorRoutes);

// Moderation Tools - ENABLED
router.use('/moderation', authenticate, authenticatedLimiter, moderationRoutes);

// Monetization - ENABLED
router.use('/monetization', authenticate, authenticatedLimiter, monetizationRoutes);

// My Learning - ENABLED
router.use('/mylearning', authenticate, authenticatedLimiter, myLearningRoutes);

// NexusGNN - ENABLED
router.use('/nexusgnn', authenticate, authenticatedLimiter, nexusGnnRoutes);

// NYSC Integration - ENABLED
router.use('/nysc', authenticate, authenticatedLimiter, nyscRoutes);

// OAuth2 Authentication - ENABLED
router.use('/oauth2', authenticate, authenticatedLimiter, oauth2Routes);

// Ownit Platform - ENABLED
router.use('/ownit', authenticate, authenticatedLimiter, ownitRoutes);

// P2P Matching - ENABLED
router.use('/p2p-matching', authenticate, authenticatedLimiter, p2pMatchingRoutes);

// Payment Webhooks (Public) - ENABLED
router.use('/payment-webhooks', paymentWebhookRoutes);

// Permanence Data - ENABLED
router.use('/permanence-data', authenticate, authenticatedLimiter, permanenceDataRoutes);

// Permanence System - ENABLED
router.use('/permanence', authenticate, authenticatedLimiter, permanenceRoutes);

// Permanence Monetization - ENABLED
router.use('/permanence-monetization', authenticate, authenticatedLimiter, permanenceMonetizationRoutes);

// Photo Credits - ENABLED
router.use('/photocredits', authenticate, authenticatedLimiter, photoCreditsRoutes);

// Platform Themes - ENABLED
router.use('/platformThemes', authenticate, authenticatedLimiter, platformThemesRoutes);

// Prompts Management - ENABLED
router.use('/prompts', authenticate, authenticatedLimiter, promptsRoutes);

// Protocol Communication - ENABLED
router.use('/protocol', authenticate, authenticatedLimiter, protocolRoutes);

// Publicitee Advertising - ENABLED
router.use('/publicitee', authenticate, authenticatedLimiter, publiciteeRoutes);

// Registration Lock - ENABLED
router.use('/registrationLock', authenticate, authenticatedLimiter, registrationLockRoutes);

// Seads Platform - ENABLED
router.use('/seads', authenticate, authenticatedLimiter, seadsRoutes);

// Search Elasticsearch - ENABLED
router.use('/search-elasticsearch', authenticate, authenticatedLimiter, searchElasticsearchRoutes);

// Search System - ENABLED
router.use('/search', authenticate, authenticatedLimiter, searchRoutes);

// Storefront - ENABLED
router.use('/storefront', authenticate, authenticatedLimiter, storefrontRoutes);

// Supervi Achievements - ENABLED
router.use('/supervi-achievements', authenticate, authenticatedLimiter, superviAchievementsRoutes);

// Supervi Leaderboards - ENABLED
router.use('/supervi-leaderboards', authenticate, authenticatedLimiter, superviLeaderboardsRoutes);

// TMS System - ENABLED
router.use('/tms', authenticate, authenticatedLimiter, tmsRoutes);

// Trends - ENABLED
router.use('/trends', authenticate, authenticatedLimiter, trendsRoutes);

// Two-Factor Authentication - ENABLED
router.use('/twoFactorAuth', authenticate, authenticatedLimiter, twoFactorAuthRoutes);

// File Uploads - ENABLED
router.use('/uploads', authenticate, authenticatedLimiter, uploadsRoutes);

// Video Editor - ENABLED
router.use('/video-editor', authenticate, authenticatedLimiter, videoEditorRoutes);

// Voice Feed - ENABLED (already mounted earlier)
// router.use('/voicefeed', authenticate, voiceFeedRoutes);

// Voice Lines - ENABLED (already mounted earlier)
// router.use('/voicelines', authenticate, voiceLinesRoutes);

// Webhook Deliveries - ENABLED
router.use('/webhook-deliveries', authenticate, authenticatedLimiter, webhookDeliveriesRoutes);

// Webhooks Management - ENABLED
router.use('/webhooks-manage', authenticate, authenticatedLimiter, webhooksRoutes);

// Widgets - ENABLED
router.use('/widgets', authenticate, authenticatedLimiter, widgetsRoutes);

module.exports = router;