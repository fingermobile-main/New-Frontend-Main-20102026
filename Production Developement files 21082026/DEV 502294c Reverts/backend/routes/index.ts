import express from "express";
const { body, param, query } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const BlockMuteController = require("../controllers/BlockMuteController");
const LiveStreamController = require("../controllers/LiveStreamController");
const walletRoutes = require("./wallet.routes");
const authRoutes = require("./auth.routes");
const aiRoutes = require("./ai.routes");
const paymentWebhooks = require("./payment.webhooks");

// Phase 1 Critical Infrastructure Routes
const paymentRoutes = require('./payments');
const stercsRoutes = require('./stercs');
const searchElasticsearchRoutes = require('./search-elasticsearch');
const metricsRoutes = require('./metrics');

// Phase 2 Business Logic Routes
const recommendationsRoutes = require('./recommendations');
const featureFlagsRoutes = require('./feature-flags');

// Phase 3 Security & AI Routes
const promptsRoutes = require('./prompts');
const sentientRoutes = require('./sentient');

// Critical route imports
const notificationRoutes = require('./notifications');
const messageRoutes = require('./messages');
const postRoutes = require('./posts');
const marketplaceRoutes = require('./marketplace');
const communityRoutes = require('./community');
const commentRoutes = require('./comments');
const commerceRoutes = require('./commerce');
const memberRoutes = require('./members');
const gameonRoutes = require('./gameon');
const camusRoutes = require('./camus');
// Additional route imports - Batch 1 (High Priority)
const gradingSystemRoutes = require('./grading-system');
const aiCreditBalanceRoutes = require('./ai-credit-balance');
// const achievementsRoutes = require('./achievements'); // DISABLED - missing controller
const activityRoutes = require('./activity');
const adminRoutes = require('./admin');
const analyticsRoutes = require('./analytics');
const apiKeysRoutes = require('./apiKeys');
const authenticatorRoutes = require('./authenticator');
const beatwaveRoutes = require('./beatwave');
const biometricRoutes = require('./biometric');
const blockingRoutes = require('./blocking');
// const blogsRoutes = require('./blogs'); // DISABLED - missing controller
const canaryRoutes = require('./canary');
const connectionsRoutes = require('./connections');
const contentModerationRoutes = require('./contentModeration');
const contentmanagementRoutes = require('./contentmanagement');
const creatorInfluenceSubscriptionRoutes = require('./creatorInfluenceSubscriptionRoutes');
const csvImportRoutes = require('./csvImport');
const dashboardRoutes = require('./dashboard');
const developerRoutes = require('./developer');
const discoverRoutes = require('./discover');
const elearningRoutes = require('./elearning');
const enhancedWalletRoutes = require('./enhanced_wallet');
const externalServicesRoutes = require('./externalServices');
const ficRoutes = require('./fic');
const fingerluxRoutes = require('./fingerlux');
const fingershortsRoutes = require('./fingershorts');
const fingerwarsRoutes = require('./fingerwars');
const flamingoRoutes = require('./flamingo');
const forumcategoriesRoutes = require('./forumcategories');
const forumsRoutes = require('./forums');
const gamificationRoutes = require('./gamification');
const gemsRoutes = require('./gems');
const generalRoutes = require('./general');
const generalEndpointsRoutes = require('./generalEndpoints');
const giftcardsRoutes = require('./giftcards');
const groupsRoutes = require('./groups');
const hallmarksRoutes = require('./hallmarks');
const governanceRoutes = require('./governance');
const helpcenterRoutes = require('./helpcenter');
const integrationsModuleRoutes = require('./integrations-module');
const integrationsRoutes = require('./integrations');
const itemsRoutes = require('./items');
const leaderboardsRoutes = require('./leaderboards');
const lendsqRoutes = require('./lendsq');
const likesRoutes = require('./likes');
const luminaMediaRoutes = require('./lumina-media');
const luminaUploadRoutes = require('./lumina-upload');
const luminaRoutes = require('./lumina');
const lushpressiesRoutes = require('./lushpressies');
const marketplaceTmsRoutes = require('./marketplace-tms');
const mediaRoutes = require('./media');
const meisheVideoEditorRoutes = require('./meishe_video_editor');
const memberprofilesRoutes = require('./memberprofiles');
const miiRoutes = require('./mii');
const mobileVideoEditorRoutes = require('./mobile_video_editor');
const moderationRoutes = require('./moderation');
const mylearningRoutes = require('./mylearning');
const nyscRoutes = require('./nysc');
const ownitRoutes = require('./ownit');
const p2pMatchingRoutes = require('./p2p-matching');
const permanenceDataRoutes = require('./permanence-data');
const permanenceRoutes = require('./permanence');
const permanenceMonetizationRoutes = require('./permanence_monetization');
const photocreditsRoutes = require('./photocredits');
const platformThemesRoutes = require('./platformThemes');
const protocolRoutes = require('./protocol');
const publiciteeRoutes = require('./publicitee');
const registrationLockRoutes = require('./registrationLock');
const seadsRoutes = require('./seads');
const searchRoutes = require('./search');
const securityRoutes = require('./security');
const storefrontRoutes = require('./storefront');
const superviAchievementsRoutes = require('./supervi_achievements');
const superviLeaderboardsRoutes = require('./supervi_leaderboards');
const tmsRoutes = require('./tms');
const trendsRoutes = require('./trends');
const twoFactorAuthRoutes = require('./twoFactorAuth');
const ugcMediaRoutesRoutes = require('./ugc_media_routes');
const uploadsRoutes = require('./uploads');
const videoEditorRoutes = require('./video_editor');
const voicefeedRoutes = require('./voicefeed');
const voicelinesRoutes = require('./voicelines');

// Additional route imports - Missing registrations
const commissionsRoutes = require('./commissions');
const communitiesRoutes = require('./communities');
const helpcenterRoutesFile = require('./helpcenter');
const achievementsRoutesFile = require('./achievements');
const giftcardsRoutesFile = require('./giftcards');
const gradingSystemRoutesFile = require('./grading-system');
const gameonRoutesFile = require('./gameon');
const camusRoutesFile = require('./camus');
const aiCreditBalanceRoutesFile = require('./ai-credit-balance');
// const blogsRoutesFile = require('./blogs'); // DISABLED - missing controller
const forumsRoutesFile = require('./forums');
const leaderboardsRoutesFile = require('./leaderboards');
const gemsRoutesFile = require('./gems');
const ficRoutesFile = require('./fic');
const ficRoutesAlt = require('./ficRoutes');
const fingershortsRoutesFile = require('./fingershorts');
const flamingoRoutesFile = require('./flamingo');
const beatwaveRoutesFile = require('./beatwave');
const luminaRoutesFile = require('./lumina');
const seadsRoutesFile = require('./seads');
const nexusgnnRoutes = require('./nexusgnn');
const stercsRoutesFile = require('./stercs');
const ownitRoutesFile = require('./ownit');
const publiciteeRoutesFile = require('./publicitee');
const lushpressiesRoutesFile = require('./lushpressies');
const hallmarksRoutesFile = require('./hallmarks');
const photocreditsRoutesFile = require('./photocredits');
const miiRoutesFile = require('./mii');
const sentientRoutesFile = require('./sentient');
const permanenceRoutesFile = require('./permanence');
const governanceRoutesFile = require('./governance');
const nyscRoutesFile = require('./nysc');
const lendsqRoutesFile = require('./lendsq');
const p2pMatchingRoutesFile = require('./p2p-matching');
const adminRoutesFile = require('./admin');
const analyticsRoutesFile = require('./analytics');
const auditLogAdminRoutes = require('./audit-log-admin');
const backupsRoutes = require('./backups');
const cdnRoutes = require('./cdn');
const contentModerationRoutesFile = require('./contentModeration');
const exportRoutes = require('./export');
const featureFlagsRoutesFile = require('./feature-flags');
const fraudAlertsRoutes = require('./fraud-alerts');
const securityRoutesFile = require('./security');
const userManagementRoutes = require('./userManagement');
const webhookDeliveriesRoutes = require('./webhook-deliveries');
const widgetsRoutes = require('./widgets');
const webhooksRoutes = require('./webhooks');
const fingerluxRoutesFile = require('./fingerlux');
const fingerwarsRoutesFile = require('./fingerwars');

const router = express.Router();

// Authentication Routes
router.use("/auth", authRoutes);

// Wallet Routes
router.use(walletRoutes);

// AI Routes
router.use("/ai", aiRoutes);

// Payment Webhooks (no authentication required)
router.use("/webhooks", paymentWebhooks);

// Block/Mute Routes
router.post(
  "/block",
  authMiddleware,
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
        "indefinite",
        "24hrs",
        "two_weeks",
        "one_month",
        "three_months",
        "six_months",
        "one_year"
      ])
      .withMessage("Invalid duration specified")
  ],
  BlockMuteController.blockUser,
);

router.post(
  "/mute/notifications",
  authMiddleware,
  [
    body("mutedUserId")
      .isString()
      .notEmpty()
      .withMessage("Muted user ID is required")
  ],
  BlockMuteController.muteNotifications,
);

router.post(
  "/mute/ugc",
  authMiddleware,
  [
    body("mutedUserId")
      .isString()
      .notEmpty()
      .withMessage("Muted user ID is required")
  ],
  BlockMuteController.muteUgc,
);

router.delete(
  "/block/:blockedId/:muteType",
  authMiddleware,
  [
    param("blockedId")
      .isString()
      .notEmpty()
      .withMessage("Blocked user ID is required"),
    param("muteType")
      .isIn(["block", "mute_profile", "mute_notifications", "mute_ugc"])
      .withMessage("Invalid mute type")
  ],
  BlockMuteController.unblockUser,
);

router.get(
  "/blocks",
  authMiddleware,
  [
    query("muteType")
      .optional()
      .isIn(["block", "mute_profile", "mute_notifications", "mute_ugc"])
      .withMessage("Invalid mute type")
  ],
  BlockMuteController.getBlockedMutedUsers,
);

router.get(
  "/block-status/:targetUserId",
  authMiddleware,
  [
    param("targetUserId")
      .isString()
      .notEmpty()
      .withMessage("Target user ID is required")
  ],
  BlockMuteController.checkBlockStatus,
);

// Live Streaming Routes
router.post(
  "/live-stream",
  authMiddleware,
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
        "influencer",
        "content_creator",
        "blogger",
        "course_creator",
        "business",
        "coach",
        "musician",
        "gamer",
        "podcaster",
        "marketer",
        "agency",
        "freelancer",
        "media_professional",
        "nonprofit"
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
  LiveStreamController.createLiveStream,
);

router.post(
  "/live-stream/:streamId/start",
  authMiddleware,
  [param("streamId").isUUID().withMessage("Valid stream ID is required")],
  LiveStreamController.startLiveStream,
);

router.post(
  "/live-stream/:streamId/end",
  authMiddleware,
  [param("streamId").isUUID().withMessage("Valid stream ID is required")],
  LiveStreamController.endLiveStream,
);

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
        "influencer",
        "content_creator",
        "blogger",
        "course_creator",
        "business",
        "coach",
        "musician",
        "gamer",
        "podcaster",
        "marketer",
        "agency",
        "freelancer",
        "media_professional",
        "nonprofit"
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
  LiveStreamController.getActiveStreams,
);

router.get(
  "/live-stream/:streamId",
  [param("streamId").isUUID().withMessage("Valid stream ID is required")],
  LiveStreamController.getLiveStream,
);

router.patch(
  "/live-stream/:streamId/viewers",
  [
    param("streamId").isUUID().withMessage("Valid stream ID is required"),
    body("viewerCount")
      .isInt({ min: 0 })
      .withMessage("Viewer count must be a non-negative integer")
  ],
  LiveStreamController.updateViewerCount,
);

router.get("/can-go-live", authMiddleware, LiveStreamController.canGoLive);

// ==========================================
// CRITICAL ROUTES - Top 10 Priority Features
// ==========================================

// Notification Routes
router.use('/notifications', authMiddleware, notificationRoutes);

// Messaging Routes
router.use('/messages', authMiddleware, messageRoutes);

// Post/Social Feed Routes
router.use('/posts', authMiddleware, postRoutes);

// Marketplace Routes
router.use('/marketplace', authMiddleware, marketplaceRoutes);

// Community Routes
router.use('/community', authMiddleware, communityRoutes);

// Comment Routes
router.use('/comments', authMiddleware, commentRoutes);

// Commerce Routes
router.use('/commerce', authMiddleware, commerceRoutes);

// Member Routes
router.use('/members', authMiddleware, memberRoutes);

// GameOn Routes
router.use('/gameon', authMiddleware, gameonRoutes);

// Camus (Learning) Routes
router.use('/camus', authMiddleware, camusRoutes);

// ==========================================
// ADDITIONAL ROUTES - Batch Registration
// ==========================================

// Grading System Routes
router.use('/grading-system', authMiddleware, gradingSystemRoutes);

// AI Credit Balance Routes
router.use('/ai-credit-balance', authMiddleware, aiCreditBalanceRoutes);

// User Engagement & Gamification
// router.use('/achievements', authMiddleware, achievementsRoutes); // DISABLED - missing controller
router.use('/activity', authMiddleware, activityRoutes);
router.use('/gamification', authMiddleware, gamificationRoutes);
router.use('/gems', authMiddleware, gemsRoutes);
router.use('/leaderboards', authMiddleware, leaderboardsRoutes);
router.use('/likes', authMiddleware, likesRoutes);

// Admin & Management
router.use('/admin', authMiddleware, adminRoutes);
router.use('/analytics', authMiddleware, analyticsRoutes);
router.use('/api-keys', authMiddleware, apiKeysRoutes);
router.use('/dashboard', authMiddleware, dashboardRoutes);

// Security & Authentication
router.use('/authenticator', authMiddleware, authenticatorRoutes);
router.use('/biometric', authMiddleware, biometricRoutes);
router.use('/blocking', authMiddleware, blockingRoutes);
router.use('/registration-lock', authMiddleware, registrationLockRoutes);
router.use('/security', authMiddleware, securityRoutes);
router.use('/two-factor-auth', authMiddleware, twoFactorAuthRoutes);

// Content & Media
router.use('/beatwave', authMiddleware, beatwaveRoutes);
// router.use('/blogs', authMiddleware, blogsRoutes); // DISABLED - missing controller
router.use('/canary', authMiddleware, canaryRoutes);
router.use('/content-moderation', authMiddleware, contentModerationRoutes);
router.use('/content-management', authMiddleware, contentmanagementRoutes);
router.use('/fingershorts', authMiddleware, fingershortsRoutes);
router.use('/fingerwars', authMiddleware, fingerwarsRoutes);
router.use('/flamingo', authMiddleware, flamingoRoutes);
router.use('/lumina', authMiddleware, luminaRoutes);
router.use('/lumina-media', authMiddleware, luminaMediaRoutes);
router.use('/lumina-upload', authMiddleware, luminaUploadRoutes);
router.use('/lushpressies', authMiddleware, lushpressiesRoutes);
router.use('/media', authMiddleware, mediaRoutes);
router.use('/meishe-video-editor', authMiddleware, meisheVideoEditorRoutes);
router.use('/mobile-video-editor', authMiddleware, mobileVideoEditorRoutes);
router.use('/uploads', authMiddleware, uploadsRoutes);
router.use('/video-editor', authMiddleware, videoEditorRoutes);
router.use('/voicefeed', authMiddleware, voicefeedRoutes);
router.use('/voicelines', authMiddleware, voicelinesRoutes);

// Social & Community
router.use('/connections', authMiddleware, connectionsRoutes);
router.use('/forum-categories', authMiddleware, forumcategoriesRoutes);
router.use('/forums', authMiddleware, forumsRoutes);
router.use('/groups', authMiddleware, groupsRoutes);

// Business & Commerce
router.use('/creator-influence-subscription', authMiddleware, creatorInfluenceSubscriptionRoutes);
router.use('/csv-import', authMiddleware, csvImportRoutes);
router.use('/external-services', authMiddleware, externalServicesRoutes);
router.use('/fic', authMiddleware, ficRoutes);
router.use('/fingerlux', authMiddleware, fingerluxRoutes);
router.use('/giftcards', authMiddleware, giftcardsRoutes);
router.use('/items', authMiddleware, itemsRoutes);
router.use('/marketplace-tms', authMiddleware, marketplaceTmsRoutes);
router.use('/permanence', authMiddleware, permanenceRoutes);
router.use('/permanence-data', authMiddleware, permanenceDataRoutes);
router.use('/permanence-monetization', authMiddleware, permanenceMonetizationRoutes);
router.use('/photocredits', authMiddleware, photocreditsRoutes);
router.use('/platform-themes', authMiddleware, platformThemesRoutes);
router.use('/publicitee', authMiddleware, publiciteeRoutes);
router.use('/storefront', authMiddleware, storefrontRoutes);
router.use('/tms', authMiddleware, tmsRoutes);

// Learning & Development
router.use('/elearning', authMiddleware, elearningRoutes);
router.use('/mylearning', authMiddleware, mylearningRoutes);

// Specialized Apps
router.use('/developer', authMiddleware, developerRoutes);
router.use('/discover', authMiddleware, discoverRoutes);
router.use('/enhanced-wallet', authMiddleware, enhancedWalletRoutes);
router.use('/fingerlux', authMiddleware, fingerluxRoutes);
router.use('/general', authMiddleware, generalRoutes);
router.use('/general-endpoints', authMiddleware, generalEndpointsRoutes);
router.use('/hallmarks', authMiddleware, hallmarksRoutes);
router.use('/governance', authMiddleware, governanceRoutes);
router.use('/help-center', authMiddleware, helpcenterRoutes);
router.use('/integrations', authMiddleware, integrationsRoutes);
router.use('/integrations-module', authMiddleware, integrationsModuleRoutes);
router.use('/lendsq', authMiddleware, lendsqRoutes);
router.use('/member-profiles', authMiddleware, memberprofilesRoutes);
router.use('/mii', authMiddleware, miiRoutes);
router.use('/moderation', authMiddleware, moderationRoutes);
router.use('/nysc', authMiddleware, nyscRoutes);
router.use('/ownit', authMiddleware, ownitRoutes);
router.use('/p2p-matching', authMiddleware, p2pMatchingRoutes);
router.use('/protocol', authMiddleware, protocolRoutes);
router.use('/seads', authMiddleware, seadsRoutes);
router.use('/search', authMiddleware, searchRoutes); // Legacy SQL-based search
router.use('/search-es', authMiddleware, searchElasticsearchRoutes); // Elasticsearch-powered search
router.use('/supervi-achievements', authMiddleware, superviAchievementsRoutes);
router.use('/supervi-leaderboards', authMiddleware, superviLeaderboardsRoutes);
router.use('/trends', authMiddleware, trendsRoutes);
router.use('/ugc-media', authMiddleware, ugcMediaRoutesRoutes);

// Phase 1 Critical Infrastructure Routes
router.use('/payments', authMiddleware, paymentRoutes);
router.use('/stercs', stercsRoutes); // Public routes for shows/episodes
router.use('/payment-webhooks', paymentWebhooks); // Webhook endpoint (no auth)
router.use('/metrics', metricsRoutes); // Prometheus metrics (public for scraping)

// Phase 2 Business Logic Routes
router.use('/recommendations', recommendationsRoutes);
router.use('/feature-flags', featureFlagsRoutes);

// Phase 3 Security & AI Routes
router.use('/sentient', authMiddleware, sentientRoutes);
router.use('/prompts', promptsRoutes);

// ==========================================
// MISSING ROUTE REGISTRATIONS - Batch Fix
// ==========================================

// Commerce & Marketplace Extensions
router.use('/commissions', authMiddleware, commissionsRoutes);
router.use('/communities', authMiddleware, communitiesRoutes);

// Help & Support (re-enable commented routes)
router.use('/help-center-alt', authMiddleware, helpcenterRoutesFile);
router.use('/achievements-alt', authMiddleware, achievementsRoutesFile);
router.use('/giftcards-alt', authMiddleware, giftcardsRoutesFile);
router.use('/grading-system-alt', authMiddleware, gradingSystemRoutesFile);

// Gaming & Learning (re-enable commented routes)
router.use('/gameon-alt', authMiddleware, gameonRoutesFile);
router.use('/camus-alt', authMiddleware, camusRoutesFile);
router.use('/ai-credit-balance-alt', authMiddleware, aiCreditBalanceRoutesFile);

// Content & Community
// router.use('/blogs-alt', authMiddleware, blogsRoutesFile); // DISABLED - missing controller
router.use('/forums-alt', authMiddleware, forumsRoutesFile);
router.use('/leaderboards-alt', authMiddleware, leaderboardsRoutesFile);
router.use('/gems-alt', authMiddleware, gemsRoutesFile);

// FIC & Financial
router.use('/fic-alt', authMiddleware, ficRoutesFile);
router.use('/fic-routes', authMiddleware, ficRoutesAlt);

// Media & Entertainment
router.use('/fingershorts-alt', authMiddleware, fingershortsRoutesFile);
router.use('/flamingo-alt', authMiddleware, flamingoRoutesFile);
router.use('/beatwave-alt', authMiddleware, beatwaveRoutesFile);
router.use('/lumina-alt', authMiddleware, luminaRoutesFile);
router.use('/seads-alt', authMiddleware, seadsRoutesFile);

// Specialized Features
router.use('/nexusgnn', authMiddleware, nexusgnnRoutes);
router.use('/stercs-alt', authMiddleware, stercsRoutesFile);
router.use('/ownit-alt', authMiddleware, ownitRoutesFile);
router.use('/publicitee-alt', authMiddleware, publiciteeRoutesFile);
router.use('/lushpressies-alt', authMiddleware, lushpressiesRoutesFile);
router.use('/hallmarks-alt', authMiddleware, hallmarksRoutesFile);
router.use('/photocredits-alt', authMiddleware, photocreditsRoutesFile);
router.use('/mii', authMiddleware, miiRoutesFile);
router.use('/sentient-alt', authMiddleware, sentientRoutesFile);
router.use('/permanence-alt', authMiddleware, permanenceRoutesFile);
router.use('/governance-alt', authMiddleware, governanceRoutesFile);
router.use('/nysc-alt', authMiddleware, nyscRoutesFile);
router.use('/lendsq-alt', authMiddleware, lendsqRoutesFile);
router.use('/p2p-matching-alt', authMiddleware, p2pMatchingRoutesFile);

// Admin & Infrastructure
router.use('/admin-alt', authMiddleware, adminRoutesFile);
router.use('/analytics-alt', authMiddleware, analyticsRoutesFile);
router.use('/audit-log-admin', authMiddleware, auditLogAdminRoutes);
router.use('/backups', authMiddleware, backupsRoutes);
router.use('/cdn', authMiddleware, cdnRoutes);
router.use('/content-moderation-alt', authMiddleware, contentModerationRoutesFile);
router.use('/export', authMiddleware, exportRoutes);
router.use('/feature-flags-alt', authMiddleware, featureFlagsRoutesFile);
router.use('/fraud-alerts', authMiddleware, fraudAlertsRoutes);
router.use('/security-alt', authMiddleware, securityRoutesFile);
router.use('/user-management', authMiddleware, userManagementRoutes);
router.use('/webhook-deliveries', authMiddleware, webhookDeliveriesRoutes);
router.use('/widgets', authMiddleware, widgetsRoutes);
router.use('/webhooks-app', authMiddleware, webhooksRoutes);

// Luxury & Gaming Markets
router.use('/fingerlux-alt', authMiddleware, fingerluxRoutesFile);
router.use('/fingerwars-alt', authMiddleware, fingerwarsRoutesFile);

export default router;
