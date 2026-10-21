/* eslint-disable no-unused-vars */
const logger = require('./utils/logger');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const rateLimit = require('express-rate-limit');
const path = require('path');
const helmet = require('helmet');

// Import new middleware
const compressionMiddleware = require('./middleware/compression');
const auditTrail = require('./middleware/auditTrail');
const { sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } = require('./middleware/errorTracking');
const { performanceMonitoring, healthCheck, readinessProbe, livenessProbe } = require('./middleware/performanceMonitoring');

// Additional security and utility middleware
const authenticate = require('./middleware/authenticate');
const apiKeyAuth = require('./middleware/apiKeyAuth');
const cognitiveLoad = require('./middleware/cognitiveLoad');
const fileUpload = require('./middleware/fileUpload');
const ipWhitelist = require('./middleware/ipWhitelist');
const oauthMiddleware = require('./middleware/oauthMiddleware');
const rateLimiter = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const searchValidation = require('./middleware/searchValidation');
const securityHeaders = require('./middleware/securityHeaders');
const securityMiddleware = require('./middleware/securityMiddleware');
const sentinelControl = require('./middleware/sentinel-control');
const webhookSignature = require('./middleware/webhookSignature');
const websocketAuth = require('./middleware/websocketAuth');
const { errorHandler } = require('./middleware/errorHandler'); // Global error handler
const inputValidation = require('./middleware/inputValidation'); // Input validation middleware

// Import routes
const walletRoutes = require('./routes/wallet');
const ficRoutesAdvanced = require('./routes/ficRoutes'); // Advanced FIC routes
const permanenceRoutes = require('./routes/permanence');
const identityRoutes = require('./routes/identity');
const monetizationRoutes = require('./routes/monetization');
const notificationRoutes = require('./routes/notifications');
const marketplaceRoutes = require('./routes/marketplace');
const gemsRoutes = require('./routes/gems');
const courseContentRoutes = require('./routes/course-content');
const aiCreditBalanceRoutes = require('./routes/ai-credit-balance');
const gradingSystemRoutes = require('./routes/grading-system');
const forumsRoutes = require('./routes/forums');
const communityRoutes = require('./routes/community');
const analyticsRoutes = require('./routes/analytics');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const messagesRoutes = require('./routes/messages');

// Import the new enhanced wallet routes
const enhancedWalletRoutes = require('./routes/enhanced_wallet');

// Import the video editor routes
const videoEditorRoutes = require('./routes/video_editor');

// Import the mobile video editor routes
const mobileVideoEditorRoutes = require('./routes/mobile_video_editor');

// Import the MeisheSDK video editor routes
const meisheVideoEditorRoutes = require('./routes/meishe_video_editor');

// Import UGC and media processing routes
const ugcMediaRoutes = require('./routes/ugc_media_routes');

// Import CSV import routes
const csvImportRoutes = require('./routes/csvImport');


// Auto-generated route imports
const fingerluxRoutes = require('./routes/fingerlux');
const fingerwarsRoutes = require('./routes/fingerwars');
const commissionsRoutes = require('./routes/commissions');
const communitiesRoutes = require('./routes/communities');
const helpcenterRoutes = require('./routes/helpcenter');
// const achievementsRoutes = require("./routes/achievements"); // DISABLED - missing controller
const giftcardsRoutes = require('./routes/giftcards');
const gameonRoutes = require('./routes/gameon');
const camusRoutes = require('./routes/camus');
const commerceRoutes = require('./routes/commerce');
const blogsRoutes = require('./routes/blogs');
const leaderboardsRoutes = require('./routes/leaderboards');
const ficRoutes = require('./routes/fic');
const fingershortsRoutes = require('./routes/fingershorts');
const flamingoRoutes = require('./routes/flamingo');
const beatwaveRoutes = require('./routes/beatwave');
const luminaRoutes = require('./routes/lumina');
const seadsRoutes = require('./routes/seads');
const ownitRoutes = require('./routes/ownit');
const publiciteeRoutes = require('./routes/publicitee');
const lushpressiesRoutes = require('./routes/lushpressies');
const hallmarksRoutes = require('./routes/hallmarks');
const photocreditsRoutes = require('./routes/photocredits');
const miiRoutes = require('./routes/mii');
const governanceRoutes = require('./routes/governance');
const nyscRoutes = require('./routes/nysc');
const Loansqroutes = require('./routes/lendsq');
const p2pmatchingRoutes = require('./routes/p2p-matching');
const cdnRoutes = require('./routes/cdn');
const contentModerationRoutes = require('./routes/contentModeration');
const exportRoutes = require('./routes/export');
const featureflagsRoutes = require('./routes/feature-flags');
const securityRoutes = require('./routes/security');
const webhookdeliveriesRoutes = require('./routes/webhook-deliveries');

// FIXED: Added previously unregistered route imports
const aiRoutesEnhanced = require('./routes/ai.routes');
const authEnhancedRoutes = require('./routes/auth.routes');
const videoTranslationRoutes = require('./routes/videoTranslation');

// NEW: Previously unregistered route imports
const activityRoutes = require('./routes/activity');
const apiDocumentationRoutes = require('./routes/apiDocumentation');
const apiKeysRoutes = require('./routes/apiKeys');
const authenticatorRoutes = require('./routes/authenticator');
const biometricRoutes = require('./routes/biometric');
const blockingRoutes = require('./routes/blocking');
const canaryRoutes = require('./routes/canary');
const connectionsRoutes = require('./routes/connections');
const contentmanagementRoutes = require('./routes/contentmanagement');
const creatorInfluenceSubscriptionRoutes = require('./routes/creatorInfluenceSubscriptionRoutes');
const discoverRoutes = require('./routes/discover');
const elearningRoutes = require('./routes/elearning');
const externalServicesRoutes = require('./routes/externalServices');
const forumcategoriesRoutes = require('./routes/forumcategories');
const gamificationRoutes = require('./routes/gamification');
const groupsRoutes = require('./routes/groups');
const integrationsModuleRoutes = require('./routes/integrations-module');
const integrationsRoutes = require('./routes/integrations');
const itemsRoutes = require('./routes/items');
const luminaMediaRoutes = require('./routes/lumina-media');
const luminaUploadRoutes = require('./routes/lumina-upload');
const marketplaceTmsRoutes = require('./routes/marketplace-tms');
const memberprofilesRoutes = require('./routes/memberprofiles');
const mylearningRoutes = require('./routes/mylearning');
const oauth2Routes = require('./routes/oauth2');
const permanenceDataRoutes = require('./routes/permanence-data');
const permanenceMonetizationRoutes = require('./routes/permanence_monetization');
const platformThemesRoutes = require('./routes/platformThemes');
const protocolRoutes = require('./routes/protocol');
const registrationLockRoutes = require('./routes/registrationLock');
const searchElasticsearchRoutes = require('./routes/search-elasticsearch');
const searchRoutes = require('./routes/search');
const storefrontRoutes = require('./routes/storefront');
const superviAchievementsRoutes = require('./routes/supervi_achievements');
const superviLeaderboardsRoutes = require('./routes/supervi_leaderboards');
const tmsRoutes = require('./routes/tms');
const trendsRoutes = require('./routes/trends');
const voicefeedRoutes = require('./routes/voicefeed');
const voicelinesRoutes = require('./routes/voicelines');

// Remaining unregistered routes
const aiRoutes = require('./routes/ai');
const developerRoutes = require('./routes/developer');
const generalRoutes = require('./routes/general');
const generalEndpointsRoutes = require('./routes/generalEndpoints');
const indexRoutes = require('./routes/index');
const mediaRoutes = require('./routes/media');
const moderationRoutes = require('./routes/moderation');
const twoFactorAuthRoutes = require('./routes/twoFactorAuth');
const webhooksRoutes = require('./routes/webhooks');
const widgetsRoutes = require('./routes/widgets');

// Import new API endpoints
const authEnhancementsRoutes = require('./routes/authEnhancements');
const userManagementRoutes = require('./routes/userManagement');
const contentOperationsRoutes = require('./routes/contentOperations');
const paymentRoutes = require('./routes/payments');
const paymentWebhooksRoutes = require('./routes/payment-webhooks');
const fraudAlertsRoutes = require('./routes/fraud-alerts'); // NEW: Fraud detection
const backupRoutes = require('./routes/backups'); // NEW: Backup management
const metricsRoutes = require('./routes/metrics'); // NEW: Prometheus metrics
const notificationsRoutes = require('./routes/notifications'); // NEW: Notifications
const stercsRoutes = require('./routes/stercs'); // NEW: Stercs integration
const recommendationsRoutes = require('./routes/recommendations'); // NEW: Recommendations
const sentientRoutes = require('./routes/sentient'); // NEW: Sentient AI behavioral analytics
const promptsRoutes = require('./routes/prompts'); // NEW: PROMPTS threat analyzer
const nexusgnnRoutes = require('./routes/nexusgnn'); // NEW: NexusGNN P2P matching

// NEW: Monitoring & Management routes
const auditLogAdminRoutes = require('./routes/audit-log-admin'); // NEW: Audit log admin
const rateLimitConfigRoutes = require('./routes/rate-limit-config'); // NEW: Rate limit config
const cacheManagementRoutes = require('./routes/cache-management'); // NEW: Cache management
const developerPortalRoutes = require('./routes/developer-portal'); // NEW: Developer portal

// NEW: Additional missing routes that need to be imported and registered
const aiRoutesTS = require('./routes/ai.routes'); // From the warning: routes/ai.routes.ts
const authRoutesTS = require('./routes/auth.routes'); // From the warning: routes/auth.routes.ts
const ficRoutesJS = require('./routes/ficRoutes'); // From the warning: routes/ficRoutes.js
const ugcMediaRoutesJS = require('./routes/ugc_media_routes'); // From the warning: routes/ugc_media_routes.js
const walletRoutesTS = require('./routes/wallet.routes'); // NEW: TypeScript wallet routes

// Other essential routes
const authRoutes = require('./routes/auth');
const membersRoutes = require('./routes/members');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const likesRoutes = require('./routes/likes');
const uploadRoutes = require('./routes/uploads');

const app = express();

// NEW: Sentry request handler (must be first)
if (process.env.SENTRY_DSN) {
  app.use(sentryRequestHandler);
  app.use(sentryTracingHandler);
}

// NEW: Compression middleware
app.use(compressionMiddleware);

// NEW: Metrics tracking middleware (before routes)
if (process.env.ENABLE_METRICS !== 'false') {
  const MetricsMiddleware = require('./middleware/metricsMiddleware');
  app.use(MetricsMiddleware.requestTracker());
  MetricsMiddleware.collectSystemMetrics();
  logger.info('✅ Metrics tracking enabled');
}

// Middleware
app.use(helmet());
app.use(securityHeaders); // Enhanced security headers
app.use(securityMiddleware); // Additional security checks

// Enhanced CORS configuration with multiple allowed origins and strict controls
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [
    'http://localhost:5173',    // Vite dev server
    'http://localhost:3000',    // Alternative dev port
    'https://fingermobileprotocol.com', // Production
    'https://www.fingermobileprotocol.com', // Production www
    'https://app.fingermobileprotocol.com' // App subdomain
  ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        logger.warn(`⚠️  CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset'
    ],
    maxAge: 86400 // 24 hours (preflight cache)
  }),
);

// Request logging
app.use(requestLogger);

// Rate limiting (custom middleware)
app.use(rateLimiter);

// IP whitelist for admin routes
app.use('/api/admin', ipWhitelist);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Input validation middleware
app.use(inputValidation);

// File upload handling
app.use(fileUpload);

// API key authentication for developer endpoints
app.use('/api/developer', apiKeyAuth);

// OAuth middleware for social auth routes
app.use('/api/auth/oauth', oauthMiddleware);

// Webhook signature verification
app.use('/api/payment-webhooks', webhookSignature);

// Sentinel control for AI features
app.use('/api/sentient', sentinelControl);
app.use('/api/prompts', sentinelControl);

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a_very_secret_session_key_of_32_chars_!!!!',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  }),
);

// NEW: Performance monitoring middleware
app.use(performanceMonitoring);

// NEW: Audit trail middleware
app.use(auditTrail);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'FingerMobile Protocol Backend API is running!' });
});

// Health check endpoints
app.get('/health', healthCheck);
app.get('/ready', readinessProbe);
app.get('/live', livenessProbe);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', authEnhancementsRoutes); // NEW: Auth enhancements
app.use('/api/members', membersRoutes);
app.use('/api/users', userManagementRoutes); // NEW: User management
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/content', contentOperationsRoutes); // NEW: Content operations
app.use('/api/payments', paymentRoutes); // NEW: Payment processing
app.use('/api/payment-webhooks', paymentWebhooksRoutes); // NEW: Payment webhooks
app.use('/api/fraud-alerts', fraudAlertsRoutes); // NEW: Fraud detection
app.use('/api/backups', backupRoutes); // NEW: Backup management
app.use('/api/notifications', notificationsRoutes); // NEW: Notifications
app.use('/api/stercs', stercsRoutes); // NEW: Stercs integration
app.use('/api/recommendations', recommendationsRoutes); // NEW: Recommendations
app.use('/api/sentient', sentientRoutes); // NEW: Sentient AI behavioral analytics
app.use('/api/prompts', promptsRoutes); // NEW: PROMPTS threat analyzer
app.use('/api/nexusgnn', nexusgnnRoutes); // NEW: NexusGNN P2P matching

// NEW: Monitoring & Management routes
app.use('/api/admin/audit-logs', auditLogAdminRoutes); // NEW: Audit log admin
app.use('/api/admin/rate-limits', rateLimitConfigRoutes); // NEW: Rate limit config
app.use('/api/admin/cache', cacheManagementRoutes); // NEW: Cache management
app.use('/api/developer', developerPortalRoutes); // NEW: Developer portal

app.use('/api/wallet', walletRoutes);

// Metrics endpoint (no /api prefix for Prometheus)
app.use('/metrics', metricsRoutes); // NEW: Prometheus metrics

app.use('/api/fic', ficRoutes);
app.use('/api/permanence', permanenceRoutes);
app.use('/api/identity', identityRoutes);
app.use('/api/monetization', monetizationRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/gems', gemsRoutes);
app.use('/api/course-content', courseContentRoutes);
app.use('/api/ai-credit-balance', aiCreditBalanceRoutes);
app.use('/api/grading-system', gradingSystemRoutes);
app.use('/api/forums', forumsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/messages', messagesRoutes);

// New enhanced wallet routes
app.use('/api/enhanced-wallet', enhancedWalletRoutes);

// Video editor routes
app.use('/api/video-editor', videoEditorRoutes);

// Mobile video editor routes (mobile-first approach)
app.use('/api/mobile-video-editor', mobileVideoEditorRoutes);

// MeisheSDK video editor routes (professional-grade editing)
app.use('/api/meishe-video-editor', meisheVideoEditorRoutes);

// UGC and media processing routes
app.use('/api/ugc-media', ugcMediaRoutes);

// CSV Import routes
app.use('/api/csv-import', csvImportRoutes);


// Auto-generated route registrations
app.use('/api/fingerlux', fingerluxRoutes);
app.use('/api/fingerwars', fingerwarsRoutes);
app.use('/api/commissions', commissionsRoutes);
app.use('/api/communities', communitiesRoutes);
app.use('/api/helpcenter', helpcenterRoutes);
// app.use("/api/achievements", achievementsRoutes); // DISABLED - missing controller
app.use('/api/giftcards', giftcardsRoutes);
app.use('/api/gameon', gameonRoutes);
app.use('/api/camus', camusRoutes);
app.use('/api/commerce', commerceRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/leaderboards', leaderboardsRoutes);
app.use('/api/fic-advanced', ficRoutesAdvanced); // NEW: Advanced FIC routes
app.use('/api/fingershorts', fingershortsRoutes);
app.use('/api/flamingo', flamingoRoutes);
app.use('/api/beatwave', beatwaveRoutes);
app.use('/api/lumina', luminaRoutes);
app.use('/api/seads', seadsRoutes);
app.use('/api/ownit', ownitRoutes);
app.use('/api/publicitee', publiciteeRoutes);
app.use('/api/lushpressies', lushpressiesRoutes);
app.use('/api/hallmarks', hallmarksRoutes);
app.use('/api/photocredits', photocreditsRoutes);
app.use('/api/mii', miiRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/nysc', nyscRoutes);
app.use('/api/lendsq', Loansqroutes);
app.use('/api/p2p-matching', p2pmatchingRoutes);
app.use('/api/cdn', cdnRoutes);
app.use('/api/content-moderation', contentModerationRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/feature-flags', featureflagsRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/webhook-deliveries', webhookdeliveriesRoutes);
app.use('/api/audit-log-admin', auditLogAdminRoutes); // NEW: Audit log admin management

// NEW: Previously unregistered route registrations
app.use('/api/activity', activityRoutes);
app.use('/api/api-documentation', apiDocumentationRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/authenticator', authenticatorRoutes);
app.use('/api/biometric', biometricRoutes);
app.use('/api/blocking', blockingRoutes);
app.use('/api/canary', canaryRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/content-management', contentmanagementRoutes);
app.use('/api/creator-subscriptions', creatorInfluenceSubscriptionRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/elearning', elearningRoutes);
app.use('/api/external-services', externalServicesRoutes);
app.use('/api/forum-categories', forumcategoriesRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/integrations-module', integrationsModuleRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/lumina-media', luminaMediaRoutes);
app.use('/api/lumina-upload', luminaUploadRoutes);
app.use('/api/marketplace-tms', marketplaceTmsRoutes);
app.use('/api/member-profiles', memberprofilesRoutes);
app.use('/api/mylearning', mylearningRoutes);
app.use('/api/oauth2', oauth2Routes);
app.use('/api/permanence-data', permanenceDataRoutes);
app.use('/api/permanence-monetization', permanenceMonetizationRoutes);
app.use('/api/platform-themes', platformThemesRoutes);
app.use('/api/protocol', protocolRoutes);
app.use('/api/registration-lock', registrationLockRoutes);
app.use('/api/search-elasticsearch', searchElasticsearchRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/storefront', storefrontRoutes);
app.use('/api/supervi-achievements', superviAchievementsRoutes);
app.use('/api/supervi-leaderboards', superviLeaderboardsRoutes);
app.use('/api/tms', tmsRoutes);
app.use('/api/trends', trendsRoutes);
app.use('/api/voicefeed', voicefeedRoutes);
app.use('/api/voicelines', voicelinesRoutes);

// FIXED: Registered previously unregistered routes
app.use('/api/auth-enhanced', authEnhancedRoutes);
app.use('/api/video-translation', videoTranslationRoutes);

// Remaining unregistered route registrations
app.use('/api/developer', developerRoutes);
app.use('/api/general', generalRoutes);
app.use('/api/general-endpoints', generalEndpointsRoutes);
app.use('/api/index', indexRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/two-factor-auth', twoFactorAuthRoutes);
app.use('/api/webhooks', webhooksRoutes);
app.use('/api/widgets', widgetsRoutes);

// NEW: Register the 15 unregistered routes with their EXACT paths as specified in the warning
// These are the routes that were reported as unregistered:
app.use('/api/ai.routes', aiRoutesEnhanced); // routes/ai.routes.ts → /api/ai.routes
app.use('/api/auth.routes', authEnhancedRoutes); // routes/auth.routes.ts → /api/auth.routes
app.use('/api/auth-enhancements', authEnhancementsRoutes); // routes/authEnhancements.js → /api/auth-enhancements
app.use('/api/cache-management', cacheManagementRoutes); // routes/cache-management.js → /api/cache-management
app.use('/api/content-operations', contentOperationsRoutes); // routes/contentOperations.js → /api/content-operations
app.use('/api/contentmanagement', contentmanagementRoutes); // routes/contentmanagement.js → /api/contentmanagement
app.use('/api/creator-influence-subscription-routes', creatorInfluenceSubscriptionRoutes); // routes/creatorInfluenceSubscriptionRoutes.js → /api/creator-influence-subscription-routes
app.use('/api/fic-routes', ficRoutesAdvanced); // routes/ficRoutes.js → /api/fic-routes
app.use('/api/forumcategories', forumcategoriesRoutes); // routes/forumcategories.js → /api/forumcategories
app.use('/api/memberprofiles', memberprofilesRoutes); // routes/memberprofiles.js → /api/memberprofiles
app.use('/api/metrics', metricsRoutes); // routes/metrics.js → /api/metrics
app.use('/api/rate-limit-config', rateLimitConfigRoutes); // routes/rate-limit-config.js → /api/rate-limit-config
app.use('/api/ugc-media-routes', ugcMediaRoutes); // routes/ugc_media_routes.js → /api/ugc-media-routes
app.use('/api/user-management', userManagementRoutes); // routes/userManagement.js → /api/user-management
app.use('/api/wallet.routes', walletRoutesTS); // routes/wallet.routes.ts → /api/wallet.routes

// Error handling middleware - NEW: Sentry error handler
app.use(sentryErrorHandler);

// Global error handler (TypeScript)
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404).json({
      success: false,
      message: `API endpoint ${req.originalUrl} not found`
    });
    return;
  }

  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

module.exports = app;
