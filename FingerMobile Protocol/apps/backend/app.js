// Global polyfills for Node 18 compatibility with modern HTTP clients (undici/fetch)
if (typeof globalThis.File === 'undefined') {
  try {
    const { File, Blob } = require('node:buffer');
    if (File) globalThis.File = File;
    if (Blob && typeof globalThis.Blob === 'undefined') globalThis.Blob = Blob;
  } catch (_) {
    class FilePolyfill extends (globalThis.Blob || class {}) {
      constructor(chunks, name, opts) {
        super(chunks, opts);
        this.name = name;
        this.lastModified = opts?.lastModified || Date.now();
      }
    }
    globalThis.File = FilePolyfill;
  }
}

const express = require('express');
const cors = require('cors');
const session = require('express-session');

const helmet = require('helmet');
const logger = require('./utils/logger');

// Import new middleware
const compressionMiddleware = require('./middleware/compression');
const auditTrail = require('./middleware/auditTrail');
const { sentryRequestHandler, sentryTracingHandler, sentryErrorHandler } = require('./middleware/errorTracking');
const { performanceMonitoring, healthCheck, readinessProbe, livenessProbe } = require('./middleware/performanceMonitoring');

// Additional security and utility middleware
const apiKeyAuth = require('./middleware/apiKeyAuth');
const fileUpload = require('./middleware/fileUpload');
const ipWhitelist = require('./middleware/ipWhitelist');
const oauthMiddleware = require('./middleware/oauthMiddleware');
const rateLimiter = require('./middleware/rateLimiter');
const requestLogger = require('./middleware/requestLogger');
const securityHeaders = require('./middleware/securityHeaders');
const securityMiddleware = require('./middleware/securityMiddleware');
const { sentinelControl } = require('./middleware/sentinel-control');
const webhookSignature = require('./middleware/webhookSignature');
const { errorHandler } = require('./middleware/errorHandler'); // Global error handler
const inputValidation = require('./middleware/inputValidation'); // Input validation middleware
const setupSwagger = require('./swagger');

// Import routes
const walletRoutes = require('./routes/wallet');
const stercsRoutes = require('./routes/stercs'); // STERCS Protection System routes
const ficRoutesAdvanced = require('./routes/ficRoutes'); // Advanced FIC routes
const permanenceRoutes = require('./routes/permanence');
const identityRoutes = require('./routes/identity');
const monetizationRoutes = require('./routes/monetization');
const voiceRoutes = require('./routes/voice');
const businessHubRoutes = require('./routes/businessHub');

const danciaRoutes = require('./routes/dancia');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const gemsRoutes = require('./routes/gemsRoutes');
const courseContentRoutes = require('./routes/course-content');
const aiCreditBalanceRoutes = require('./routes/ai-credit-balance');
const gradingSystemRoutes = require('./routes/grading-system');
const forumsRoutes = require('./routes/forums');
const communityRoutes = require('./routes/community');
const platformThemesRoutes = require('./routes/platformThemes');
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

// Cluster 2: Wallet, Banking, FIC Vault & Financials
const ficVaultRoutes = require('./routes/fic_vault');
const loyaltyRoutes = require('./routes/loyalty');
const referralsRoutes = require('./routes/referrals');
const billingRoutes = require('./routes/billing');
const payoutsRoutes = require('./routes/payouts');

// Auto-generated route imports
const fingerluxRoutes = require('./routes/fingerluxRoutes');
const fingerwarsRoutes = require('./routes/fingerwarsRoutes');
const commissionsRoutes = require('./routes/commissions');
const communitiesRoutes = require('./routes/communities');
const helpcenterRoutes = require('./routes/helpcenter');
// const achievementsRoutes = require("./routes/achievements"); // DISABLED - missing controller
const giftcardsRoutes = require('./routes/giftcards');
const gameonRoutes = require('./routes/gameonRoutes');
const camusRoutes = require('./routes/camusRoutes');
const commerceRoutes = require('./routes/commerce');
const blogsRoutes = require('./routes/blogs');
const leaderboardsRoutes = require('./routes/leaderboards');
const ficRoutes = require('./routes/ficRoutes');
const fingershortsRoutes = require('./routes/fingershortsRoutes');
const flamingoRoutes = require('./routes/flamingoRoutes');
const beatwaveRoutes = require('./routes/beatwaveRoutes');
const luminaRoutes = require('./routes/lumina');
const seadsRoutes = require('./routes/seads');
const ownitRoutes = require('./routes/ownit');
const publiciteeRoutes = require('./routes/publicitee');
const lushpressiesRoutes = require('./routes/lushpressies');
const hallmarksRoutes = require('./routes/hallmarksRoutes');
const photocreditsRoutes = require('./routes/photocredits');
const miiRoutes = require('./routes/miiRoutes');
const verificationsRoutes = require('./routes/verifications');
const governanceRoutes = require('./routes/governance');
const nyscRoutes = require('./routes/nysc');
const jobsRoutes = require('./routes/jobs');
const loansqrRoutes = require('./routes/loansqrRoutes');
const Loansqroutes = loansqrRoutes;
const p2pmatchingRoutes = require('./routes/p2p-matching');
const cdnRoutes = require('./routes/cdn');
const contentModerationRoutes = require('./routes/contentModeration');
const exportRoutes = require('./routes/export');
const featureflagsRoutes = require('./routes/feature-flags');
const securityRoutes = require('./routes/security');
const webhookdeliveriesRoutes = require('./routes/webhook-deliveries');
const legalRoutes = require('./routes/legal');
const supportRoutes = require('./routes/support');
const connectorArtifactRoutes = require('./routes/connectorArtifactRoutes');
const masterDashboardRoutes = require('./routes/masterDashboardRoutes');

// FIXED: Added previously unregistered route imports
const aiRoutesEnhanced = require('./routes/ai');
const authEnhancedRoutes = require('./routes/auth');
const videoTranslationRoutes = require('./routes/videoTranslation');

// NEW: Previously unregistered route imports
const activityRoutes = require('./routes/activity');
const apiDocumentationRoutes = require('./routes/apiDocumentation');
const apiKeysRoutes = require('./routes/apiKeys');
const authenticatorRoutes = require('./routes/authenticator');
const biometricRoutes = require('./routes/biometric');
const blockingRoutes = require('./routes/blocking');
const canaryRoutes = require('./routes/canary');
const campaignsRoutes = require('./routes/campaigns');
const marketingRoutes = require('./routes/marketing');
const cognitiveLegalVaultRoutes = require('./routes/cognitiveLegalVault');
const connectionsRoutes = require('./routes/connections');
const contentmanagementRoutes = require('./routes/contentManagement');
const creatorInfluenceSubscriptionRoutes = require('./routes/creatorInfluenceSubscriptionRoutes');
const creatorRulesRoutes = require('./routes/creatorRules');
const creatorOnboardingController = require('./controllers/creatorOnboardingController');
const discoverRoutes = require('./routes/discover');
const elearningRoutes = require('./routes/elearning');
const externalServicesRoutes = require('./routes/externalServices');
const forumcategoriesRoutes = require('./routes/forumcategories');
const gamificationRoutes = require('./routes/gamification');
const groupsRoutes = require('./routes/groupsRoutes');
const integrationsModuleRoutes = require('./routes/integrations-module');
const integrationsRoutes = require('./routes/integrations');
const itemsRoutes = require('./routes/items');
const luminaMediaRoutes = require('./routes/lumina-media');
const luminaUploadRoutes = require('./routes/lumina-upload');
const marketplaceTmsRoutes = require('./routes/marketplace-tms');
const memberprofilesRoutes = require('./routes/memberprofiles');
const profileCharterRoutes = require('./routes/profileCharterRoutes');
const mylearningRoutes = require('./routes/mylearning');
const oauth2Routes = require('./routes/oauth2');
const permanenceDataRoutes = require('./routes/permanence-data');
const permanenceMonetizationRoutes = require('./routes/permanence_monetization');

const protocolRoutes = require('./routes/protocol');
const registrationLockRoutes = require('./routes/registrationLock');
const searchElasticsearchRoutes = require('./routes/search-elasticsearch');
const searchRoutes = require('./routes/search');
const storefrontRoutes = require('./routes/storefront');
const simulatorRoutes = require('./stercs-simulator/simulatorRoutes');
const superviAchievementsRoutes = require('./routes/supervi_achievements');
const superviLeaderboardsRoutes = require('./routes/supervi_leaderboards');
const tmsRoutes = require('./routes/tms');
const trendsRoutes = require('./routes/trendsRoutes');
const voicefeedRoutes = require('./routes/voicefeed');
const voicelinesRoutes = require('./routes/voicelines');

// Remaining unregistered routes
const pollsRoutes = require('./routes/polls');
const developerRoutes = require('./routes/developer');
const generalRoutes = require('./routes/general');
const generalEndpointsRoutes = require('./routes/generalEndpoints');
const indexRoutes = require('./routes/index');
const userConsentRoutes = require('./routes/userConsentRoutes');
const mediaRoutes = require('./routes/media');
const moderationRoutes = require('./routes/moderation');
const twoFactorAuthRoutes = require('./routes/twoFactorAuth');
const webhooksRoutes = require('./routes/webhooks');
const widgetsRoutes = require('./routes/widgets');
const postcardsRoutes = require('./routes/postcards');
const liveStreamRoutes = require('./routes/liveStream');

// Import new API endpoints
const authEnhancementsRoutes = require('./routes/authEnhancements');
const userManagementRoutes = require('./routes/userManagement.js');
const contentOperationsRoutes = require('./routes/contentOperations');
const paymentRoutes = require('./routes/payments');
const paymentWebhooksRoutes = require('./routes/payment-webhooks');
const fraudAlertsRoutes = require('./routes/fraud-alerts'); // NEW: Fraud detection
const backupRoutes = require('./routes/backups'); // NEW: Backup management
const metricsRoutes = require('./routes/metrics'); // NEW: Prometheus metrics
const notificationsRoutes = require('./routes/notifications'); // NEW: Notifications
const recommendationsRoutes = require('./routes/recommendations'); // NEW: Recommendations
const sentientRoutes = require('./routes/sentient'); // NEW: Sentient AI behavioral analytics
const promptsRoutes = require('./routes/prompts'); // NEW: PROMPTS threat analyzer
const nexusgnnRoutes = require('./routes/nexusgnn'); // NEW: NexusGNN P2P matching

// Policy Gap Implementation Routes
const relationshipRoutes = require('./routes/relationship');
const organizeTheseRoutes = require('./routes/organizeThese');
const boostRoutes = require('./routes/boost');
const pykwRoutes = require('./routes/pykw');
const copyrightRoutes = require('./routes/copyright');

// NEW: Monitoring & Management routes
const auditLogAdminRoutes = require('./routes/audit-log-admin'); // NEW: Audit log admin
const emailAdminRoutes = require('./routes/emailAdmin'); // Plunk & Deliverability Email Admin
const rateLimitConfigRoutes = require('./routes/rate-limit-config'); // NEW: Rate limit config
const cacheManagementRoutes = require('./routes/cache-management'); // NEW: Cache management
const developerPortalRoutes = require('./routes/developer-portal'); // NEW: Developer portal
const guardianRoutes = require('./routes/guardian'); // Cluster 11: Guardian Security Sentinel
const operationsRoutes = require('./routes/operations'); // Cluster 11: Operations, Health, Site, Franchises

let walletRoutesTS;
try {
  walletRoutesTS = require('./routes/wallet.routes');
} catch (e) {
  walletRoutesTS = null;
}

// NEW: Import AI routes to handle route misalignment (loading TS file)
let aiRoutesHandler;
try {
  // Try loading the TypeScript file
  aiRoutesHandler = require('./routes/ai.routes.ts');
} catch (err) {
  // If that fails, try the compiled JS version
  try {
    aiRoutesHandler = require('./routes/ai.routes.js');
  } catch (err2) {
    if (logger && typeof logger.warn === 'function') {
      logger.warn('Warning: Could not load ai.routes file directly');
    }
    aiRoutesHandler = null;
  }
}

// Other essential routes
const authRoutes = require('./routes/auth');
const revenueRoutes = require('./routes/revenue');
const revenueWalletRoutes = require('./routes/revenue_wallet');
const membersRoutes = require('./routes/members');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');
const likesRoutes = require('./routes/likes');
const uploadRoutes = require('./routes/uploads');

// Import mandatory 2FA enforcer
const mandatory2FAEnforcer = require('./utils/mandatory2FAEnforcer');

const app = express();

// Intercept app.use to gracefully unwrap ES Module exports ({ default: router })
const originalAppUse = app.use.bind(app);
app.use = function(...args) {
  const unwrapped = args.map(arg => (arg && typeof arg === 'object' && arg.default ? arg.default : arg));
  return originalAppUse(...unwrapped);
};

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
  if (logger && typeof logger.info === 'function') {
    logger.info('✅ Metrics tracking enabled');
  }
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
if (typeof rateLimiter === 'function') {
  app.use(rateLimiter);
} else if (rateLimiter && typeof rateLimiter.apiLimiter === 'function') {
  app.use(rateLimiter.apiLimiter);
} else {
  app.use((req, res, next) => next());
}

// IP whitelist for admin routes
app.use('/api/admin', ipWhitelist);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Input validation helper class (used per-route)
if (typeof inputValidation === 'function' && inputValidation.length === 3) {
  app.use(inputValidation);
}

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
app.use(auditTrail.logAction || auditTrail);

// Initialize and start the mandatory 2FA enforcer
if (process.env.ENABLE_MANDATORY_2FA_ENFORCEMENT !== 'false') {
  // Start the mandatory 2FA enforcement checker
  mandatory2FAEnforcer.startEnforcement();

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('🛑 SIGTERM received, shutting down gracefully');
    mandatory2FAEnforcer.stopEnforcement();
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('🛑 SIGINT received, shutting down gracefully');
    mandatory2FAEnforcer.stopEnforcement();
    process.exit(0);
  });
}

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'FingerMobile Protocol Backend API is running!' });
});

// Health check endpoints
app.get('/health', healthCheck);
app.get('/api/health', healthCheck);
app.get('/ready', readinessProbe);
app.get('/api/ready', readinessProbe);
app.get('/live', livenessProbe);
app.get('/api/live', livenessProbe);

// Universal API Route Prefix Normalizer
// Allows frontend requests without /api prefix to seamlessly map to /api endpoints
app.use((req, res, next) => {
  if (
    !req.url.startsWith('/api') &&
    !req.url.startsWith('/metrics') &&
    !req.url.startsWith('/health') &&
    !req.url.startsWith('/ready') &&
    !req.url.startsWith('/live') &&
    !req.url.startsWith('/api-docs') &&
    req.url !== '/'
  ) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', authEnhancementsRoutes); // NEW: Auth enhancements
app.use('/api/revenue', revenueRoutes);
app.use('/api/revenue-wallet', revenueWalletRoutes);
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
app.use('/api/stercs-simulator', simulatorRoutes); // NEW: Stercs Simulator
app.use('/api/recommendations', recommendationsRoutes); // NEW: Recommendations
app.use('/api/sentient', sentientRoutes); // NEW: Sentient AI behavioral analytics
app.use('/api/prompts', promptsRoutes); // NEW: PROMPTS threat analyzer
app.use('/api/nexusgnn', nexusgnnRoutes); // NEW: NexusGNN P2P matching

// Policy Gap Implementation Endpoints
app.use('/api/relationship', relationshipRoutes);
app.use('/api/organize-these', organizeTheseRoutes);
app.use('/api/boost', boostRoutes);
app.use('/api/pykw', pykwRoutes);
app.use('/api/copyright', copyrightRoutes);

// Super Admin
const superAdminRoutes = require('./routes/superAdminRoutes');
app.use('/api/super-admin', superAdminRoutes);

// Sovereign RBAC & Pages Directory Consoles
const rbacConsolesRoutes = require('./routes/rbacConsoles');
app.use('/api/rbac-consoles', rbacConsolesRoutes);
app.use('/api/v1/rbac-consoles', rbacConsolesRoutes);

// Content Curation
const contentCurationRoutes = require('./routes/contentCurationRoutes');
app.use('/api/curation', contentCurationRoutes);

// NEW: Monitoring & Management routes
app.use('/api/admin/email', emailAdminRoutes); // Plunk & Deliverability Email Admin
app.use('/api/admin/audit-logs', auditLogAdminRoutes); // NEW: Audit log admin
app.use('/api/admin/rate-limits', rateLimitConfigRoutes); // NEW: Rate limit config
app.use('/api/admin/cache', cacheManagementRoutes); // NEW: Cache management
app.use('/api/developer', developerPortalRoutes); // NEW: Developer portal
app.use('/api/guardian', guardianRoutes); // Cluster 11: Guardian Security Sentinel
app.use('/api/operations', operationsRoutes); // Cluster 11: Operations & System Health

app.use('/api/polls', pollsRoutes);
app.use('/api/wallet', walletRoutes);

// Metrics endpoint (no /api prefix for Prometheus)
app.use('/metrics', metricsRoutes); // NEW: Prometheus metrics

app.use('/api/fic', ficRoutes);
app.use('/api/permanence', permanenceRoutes);
app.use('/api/identity', identityRoutes);
app.use('/api/monetization', monetizationRoutes);
app.use('/api/verifications', verificationsRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/business-hub', businessHubRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/dancia', danciaRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/products', marketplaceRoutes);
app.use('/api/orders', marketplaceRoutes);
app.use('/api/connectors', connectorArtifactRoutes);
app.use('/api/gems', gemsRoutes);
app.use('/api/course-content', courseContentRoutes);
app.use('/api/ai-credit-balance', aiCreditBalanceRoutes);
app.use('/api/grading-system', gradingSystemRoutes);
app.use('/api/forums', forumsRoutes);

app.use('/api/community', communityRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/rbac', adminRoutes);
app.use('/api/roles', require('./routes/roles'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/collaborators', require('./routes/collaborators'));
app.use('/api/v1/collaborators', require('./routes/collaborators'));
app.use('/api/member-access', require('./routes/memberAccess'));
app.use('/api/v1/member-access', require('./routes/memberAccess'));
app.use('/api/badges', require('./routes/badges'));
app.use('/api/v1/badges', require('./routes/badges'));
app.use('/api/stores', require('./routes/crossStoreSearch'));
app.use('/api/v1/stores', require('./routes/crossStoreSearch'));
app.use('/api/v1/profiles', profileCharterRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/master-dashboard', masterDashboardRoutes);
app.use('/api/messages', messagesRoutes);

// Regional Creator Tier Rules & Onboarding
app.use('/api/creators', creatorRulesRoutes);
app.use('/api/v1/creators', creatorRulesRoutes);
app.get('/api/admin/creator-rules/:countryCode', creatorOnboardingController.getCountryTierRules);
app.put('/api/admin/creator-rules/:countryCode', creatorOnboardingController.updateCountryTierRules);
app.get('/api/v1/admin/creator-rules/:countryCode', creatorOnboardingController.getCountryTierRules);
app.put('/api/v1/admin/creator-rules/:countryCode', creatorOnboardingController.updateCountryTierRules);

// New enhanced wallet routes
app.use('/api/enhanced-wallet', enhancedWalletRoutes);

// Cluster 2: Wallet, Banking, FIC Vault & Financials
app.use('/api/fic-vault', ficVaultRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/referrals', referralsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/payouts', payoutsRoutes);

// Video editor routes
app.use('/api/video-editor', videoEditorRoutes);

// Mobile video editor routes (mobile-first approach)
app.use('/api/mobile-video-editor', mobileVideoEditorRoutes);

// MeisheSDK video editor routes (professional-grade editing)
app.use('/api/meishe-video-editor', meisheVideoEditorRoutes);

// Stercs Studio Editor routes
app.use('/api/editor', require('./stercs-editor/routes/editor'));

// Published pages endpoint
app.get('/api/pages/:pageId', async (req, res) => {
  res.json({
    success: true,
    data: {
      id: req.params.pageId,
      title: 'Published Studio Page',
      contentBlocks: [],
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    }
  });
});

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
app.use('/api/blog-templates', require('./routes/blogTemplates')); // Free SEO Blog Template Engine
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
app.use('/api/lushpressies/match', require('./routes/lushpressiesMatch'));     // Lush Pressies P2P Match Engine
app.use('/api/lushpressies/privacy', require('./routes/lushpressiesPrivacy')); // Lush Pressies 8-Dimension Privacy Framework
app.use('/api/hallmarks', hallmarksRoutes);
app.use('/api/photocredits', photocreditsRoutes);
app.use('/api/mii', miiRoutes);
app.use('/api/governance', governanceRoutes);
app.use('/api/nysc', nyscRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/loansqr', loansqrRoutes);
app.use('/api/lendsq', loansqrRoutes);
app.use('/api/Loansqr', loansqrRoutes);
app.use('/api/p2p-matching', p2pmatchingRoutes);
app.use('/api/cdn', cdnRoutes);
app.use('/api/content-moderation', contentModerationRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/feature-flags', featureflagsRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/sessions', securityRoutes);
app.use('/api/webhook-deliveries', webhookdeliveriesRoutes);
app.use('/api/audit-log-admin', auditLogAdminRoutes); // NEW: Audit log admin management
app.use('/api/legal', legalRoutes);
app.use('/api/support', supportRoutes);

// Cluster 4 & Community Ecosystem Routes
app.use('/api/creator-influence', require('./routes/creatorInfluenceSubscriptionRoutes'));
app.use('/api/creator-influence-subscriptions', require('./routes/creatorInfluenceSubscriptionRoutes'));
app.use('/api/kyc', require('./routes/verifications'));
app.use('/api/clubs', require('./routes/clubs'));
app.use('/api/events', require('./routes/events'));
app.use('/api/live-spaces', require('./routes/liveSpaces'));
app.use('/api/forum-categories', require('./routes/forumcategories'));

// Target 14 Core Modules Route Registration
app.use('/api/franchises', require('./routes/franchisesRoutes'));
app.use('/api/investor-relations', require('./routes/investorRelationsRoutes'));
app.use('/api/programs', require('./routes/programsRoutes'));
app.use('/api/coupons', require('./routes/couponsRoutes'));
app.use('/api/conference', require('./routes/conferenceRoutes'));
app.use('/api/insights', require('./routes/insightsRoutes'));

// Cluster 1 Core Commerce & Paylinks Route Registrations
app.use('/api/paylinks', require('./routes/paylinksRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionsRoutes'));

// NEW: Previously unregistered route registrations
app.use('/api/activity', activityRoutes);
app.use('/api/api-documentation', apiDocumentationRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/authenticator', authenticatorRoutes);
app.use('/api/biometric', biometricRoutes);
app.use('/api/blocking', blockingRoutes);
app.use('/api/canary', canaryRoutes);
app.use('/api/v1/vault', cognitiveLegalVaultRoutes);
app.use('/api/vault', cognitiveLegalVaultRoutes);
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
app.use('/api/commerce', storefrontRoutes);
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
app.use('/api', indexRoutes);
app.use('/api/index', indexRoutes);
app.use('/api/v1/users', userConsentRoutes);
app.use('/v1/users', userConsentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/moderation', moderationRoutes);
app.use('/api/two-factor-auth', twoFactorAuthRoutes);
app.use('/api/postcards', postcardsRoutes);
app.use('/api/live-stream', liveStreamRoutes);
app.use('/api/live-streams', liveStreamRoutes);
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
if (walletRoutesTS) {
  app.use('/api/wallet.routes', walletRoutesTS); // routes/wallet.routes.ts → /api/wallet.routes
}

// NEW: Add course routes alias to fix frontend/backend misalignment
app.use('/api/courses', courseContentRoutes); // Also expose course-content routes as /api/courses to match frontend expectations

// NEW: Add biometrics route alias to fix frontend/backend misalignment
app.use('/api/biometrics', biometricRoutes); // Also expose biometric routes as /api/biometrics to match frontend expectations

// NEW: Add voice lines route alias to fix frontend/backend misalignment
app.use('/api/voice-lines', voicelinesRoutes); // Also expose voicelines routes as /api/voice-lines to match frontend expectations

// NEW: Add AI routes to fix frontend/backend misalignment (if available)
if (aiRoutesHandler) {
  app.use('/api/ai', aiRoutesHandler); // Directly use AI routes to match frontend expectations
} else {
  // Fallback: try to mount the route directly
  try {
    app.use('/api/ai', require('./routes/ai.routes'));
  } catch (err) {
    if (logger && typeof logger.warn === 'function') {
      logger.warn('Could not mount /api/ai routes: ', err.message);
    }
  }
}

// NEW: Add forum categories route alias to fix frontend/backend misalignment
app.use('/api/forum-categories', forumcategoriesRoutes); // Also expose forumcategories routes as /api/forum-categories to match frontend expectations

// NEW: Add KYC/KYB route aliases to fix frontend/backend misalignment
app.use('/api/kyc', verificationsRoutes); // Also expose verifications routes as /api/kyc to match frontend expectations
app.use('/api/kyb', verificationsRoutes); // Also expose verifications routes as /api/kyb to match frontend expectations

// NEW: Add media processing route aliases to fix frontend/backend misalignment
app.use('/api/media', ugcMediaRoutes); // Also expose ugc-media routes as /api/media to match frontend expectations

// NEW: Frontend compatibility aliases
app.use('/api/beatwaveNG', beatwaveRoutes);
app.use('/api/dancia4tv', danciaRoutes);
app.use('/api/storefronts', storefrontRoutes);
app.use('/api/ads', canaryRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/streams', liveStreamRoutes);
app.use('/api/games', gameonRoutes);
app.use('/api/profiles', memberprofilesRoutes);
app.use('/api/ugc', ugcMediaRoutes);
app.use('/api/forum', forumsRoutes);
app.use('/api/transactions', walletRoutes);
app.use('/api/settings', generalRoutes);

// STERCS Protection System aliases
app.use('/api/stercs-protection', stercsRoutes); // STERCS protection system

// Affiliate & Access Key Management (Business Suite Integration)
app.use('/api/affiliate', require('./routes/affiliate')); // Affiliate partner ledger
app.use('/api/access-keys', require('./routes/accessKeys')); // Access key lifecycle

// Universal Multi-Channel Product & Storefront Catalog Engine
app.use('/api/catalog', require('./routes/catalogRoutes'));

// Setup Swagger documentation
setupSwagger(app);

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

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 FingerMobile Platform Server running on port ${PORT}`);
    logger.info(`📡 Environment: ${process.env.NODE_ENV || 'production'}`);
  });
}

module.exports = app;
