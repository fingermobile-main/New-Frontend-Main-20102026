const express = require('express');
const router = express.Router();

// Automatically unwrap ES/TS default exports for Express router middleware
const originalUse = router.use.bind(router);
router.use = function(...args) {
  const unwrapped = args.map(arg => (arg && typeof arg === 'object' && arg.default ? arg.default : arg));
  return originalUse(...unwrapped);
};

// Import individual route modules
const userRoutes = require('./userManagement');
const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const orderRoutes = require('./orders');
const cartRoutes = require('./cart');
const reviewRoutes = require('./reviews');
const blogRoutes = require('./blogs');
const groupRoutes = require('./groups');
const gemsRoutes = require('./gems');
const hallmarksRoutes = require('./hallmarks');
const miiRoutes = require('./mii');
const shareRoutes = require('./share');
const tagRoutes = require('./tag');
const saveRoutes = require('./save');
const downloadRoutes = require('./download');
const durationRoutes = require('./duration');
const loansRoutes = require('./loans');
const repaymentsRoutes = require('./repayments');
const marketplaceRoutes = require('./marketplaceRoutes');
const ownitRoutes = require('./ownit');
const camusRoutes = require('./camus');
const fingerluxLegacyRoutes = require('./fingerlux');
const elearningRoutes = require('./elearning');
const fingerwarsRoutes = require('./fingerwars');
const flamingoRoutes = require('./flamingoRoutes');
const loansqrRoutes = require('./loansqrRoutes');
const danciaRoutes = require('./dancia');
const lushpressiesRoutes = require('./lushpressies');
const lushSwipeRoutes = require('./lushpressiesSwipe');
const lushChatRoutes = require('./lushpressiesChat');
const lushVerificationRoutes = require('./lushpressiesVerification');
const lushAnalyticsRoutes = require('./lushpressiesAnalytics');
const lushGeoRoutes = require('./lushpressiesGeo');
const lushSubscriptionRoutes = require('./lushpressiesSubscriptions');
const lushCommitRoutes = require('./lushpressiesCommit');
const lushGamificationRoutes = require('./lushpressiesGamification');
const masterDashboardRoutes = require('./masterDashboardRoutes');
const tributRoutes = require('./tributRoutes');
const creatorRulesRoutes = require('./creatorRules');
const forumRoutes = require('./forums');
const communitiesRoutes = require('./communities');
const forumcategoriesRoutes = require('./forumcategories');
const photocreditsRoutes = require('./photocredits');
const canaryRoutes = require('./canary');
const eventsRoutes = require('./events');
const storefrontRoutes = require('./storefront');
const subscriptionsRoutes = require('./subscriptionsRoutes');
const trendsRoutes = require('./trendsRoutes');
const discoverRoutes = require('./discover');
const postsRoutes = require('./posts');
const searchRoutes = require('./search');
const leaderboardsRoutes = require('./leaderboards');
const permanenceRoutes = require('./permanence');
const gameonRoutes = require('./gameonRoutes');
const programsRoutes = require('./programsRoutes');
const catalogRoutes = require('./catalogRoutes');
const franchisesRoutes = require('./franchisesRoutes');
const spendCapsRoutes = require('./spendCaps'); // Add spend caps routes
const accountInactivityRoutes = require('./accountInactivity');
const campaignsRoutes = require('./campaigns');
const marketingRoutes = require('./marketing');
const metricsRoutes = require('./metrics');
const dpoRoutes = require('./dpo');
const voicelinesRoutes = require('./voicelines');
const emojiRoutes = require('./emojis');
const voicefeedRoutes = require('./voicefeed');
const publiciteeRoutes = require('./publicitee');
const fingershortsRoutes = require('./fingershorts');
const liveStreamRoutes = require('./liveStream');
const seadsRoutes = require('./seads');
const businessOfficesRoutes = require('./businessOfficesRoutes');
const beatwaveRoutes = require('./beatwaveRoutes');
const jobsRoutes = require('./jobs');
const guardianRoutes = require('./guardian');
const stercesRoutes = require('./sterces');
const stercsRoutes = require('./stercs');
const collaboratorsRoutes = require('./collaborators');
const rolesRoutes = require('./roles');
const memberAccessRoutes = require('./memberAccess');
const badgesRoutes = require('./badges');
const crossStoreSearchRoutes = require('./crossStoreSearch');
const walletRoutes = require('./wallet');
const revenueWalletRoutes = require('./revenue_wallet');
const enhancedWalletRoutes = require('./enhanced_wallet');
const treasuryWalletRoutes = require('./treasury_wallet_funding');
const ficVaultRoutes = require('./fic_vault');
const corporateGovernanceRoutes = require('./corporateGovernanceRoutes');
const financialEcosystemRoutes = require('./financialEcosystemRoutes');
const superviGameRoutes = require('./supervi_game');
const superviAchievementsRoutes = require('./supervi_achievements');
const conferenceRoutes = require('./conferenceRoutes');
const fingerluxRoutes = require('./fingerluxRoutes');
const videoTranslationRoutes = require('./videoTranslation');
const giftcardsRoutes = require('./giftcards');
const superviLeaderboardsRoutes = require('./supervi_leaderboards');
const rbacConsolesRoutes = require('./rbacConsoles');
const adminRoutes = require('./admin');
const operationsRoutes = require('./operations');
const monetizationRoutes = require('./monetization');
const payoutsRoutes = require('./payouts');
const contentModerationRoutes = require('./contentModeration');
const moderationRoutes = require('./moderation');
const uploadsRoutes = require('./uploads');
const mediaRoutes = require('./media');
const auditLogsRoutes = require('./audit-log-admin');
const securityRoutes = require('./security');

// Mount individual route modules under their respective paths
router.use('/admin', adminRoutes);
router.use('/operations', operationsRoutes);
router.use('/monetization', monetizationRoutes);
router.use('/payouts', payoutsRoutes);
router.use('/content-moderation', contentModerationRoutes);
router.use('/moderation', moderationRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/media', mediaRoutes);
router.use('/audit-logs', auditLogsRoutes);
router.use('/admin/audit-logs', auditLogsRoutes);
router.use('/audit-log-admin', auditLogsRoutes);
router.use('/rbac-consoles', rbacConsolesRoutes);
router.use('/v1/rbac-consoles', rbacConsolesRoutes);
router.use('/supervi', superviGameRoutes);
router.use('/supervi-game', superviGameRoutes);
router.use('/supervi-achievements', superviAchievementsRoutes);
router.use('/supervi-leaderboards', superviLeaderboardsRoutes);
router.use('/publicitee', publiciteeRoutes);
router.use('/fingershorts', fingershortsRoutes);
router.use('/beatwave', beatwaveRoutes);
router.use('/beatwave-ng', beatwaveRoutes);
router.use('/guardian', guardianRoutes);
router.use('/security', securityRoutes);
router.use('/sterces', stercesRoutes);
router.use('/stercs', stercsRoutes);
router.use('/voicelines', voicelinesRoutes);
router.use('/voice-lines', voicelinesRoutes);
router.use('/voice', voicelinesRoutes);
router.use('/voicefeed', voicefeedRoutes);
router.use('/voice-feed', voicefeedRoutes);
router.use('/forums', forumRoutes);
router.use('/forum', forumRoutes);
router.use('/forum-categories', forumcategoriesRoutes);
router.use('/creators', creatorRulesRoutes);
router.use('/users', userRoutes);
router.use('/catalog', catalogRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/reviews', reviewRoutes);
router.use('/blog', blogRoutes);
router.use('/blogs', blogRoutes);
router.use('/groups', groupRoutes);
router.use('/gems', gemsRoutes);
router.use('/emojis', emojiRoutes);
router.use('/hallmarks', hallmarksRoutes);
router.use('/mii', miiRoutes);
router.use('/share', shareRoutes);
router.use('/tag', tagRoutes);
router.use('/save', saveRoutes);
router.use('/download', downloadRoutes);
router.use('/duration', durationRoutes);
router.use('/loans', loansRoutes);
router.use('/repayments', repaymentsRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/ownit', ownitRoutes);
router.use('/camus', camusRoutes);
router.use('/fingerlux', fingerluxRoutes);
router.use('/elearning', elearningRoutes);
router.use('/courses', elearningRoutes);
router.use('/fingerwars', fingerwarsRoutes);
router.use('/finger-wars', fingerwarsRoutes);
router.use('/flamingo', flamingoRoutes);
router.use('/loansqr', loansqrRoutes);
router.use('/Loansqr', loansqrRoutes);
router.use('/lendsq', loansqrRoutes);
router.use('/dancia', danciaRoutes);
router.use('/lushpressies', lushpressiesRoutes);
router.use('/lushpressies/swipe', lushSwipeRoutes);
router.use('/lushpressies-swipe', lushSwipeRoutes);
router.use('/lushpressies/chat', lushChatRoutes);
router.use('/lushpressies-chat', lushChatRoutes);
router.use('/lushpressies/verification', lushVerificationRoutes);
router.use('/lushpressies-verification', lushVerificationRoutes);
router.use('/lushpressies/analytics', lushAnalyticsRoutes);
router.use('/lushpressies-analytics', lushAnalyticsRoutes);
router.use('/lushpressies/geo', lushGeoRoutes);
router.use('/lushpressies-geo', lushGeoRoutes);
router.use('/lushpressies/subscriptions', lushSubscriptionRoutes);
router.use('/lushpressies-subscriptions', lushSubscriptionRoutes);
router.use('/lushpressies/commit', lushCommitRoutes);
router.use('/lushpressies-commit', lushCommitRoutes);
router.use('/lushpressies/gamification', lushGamificationRoutes);
router.use('/lushpressies-gamification', lushGamificationRoutes);
router.use('/master-dashboard', masterDashboardRoutes);
router.use('/photocredits', photocreditsRoutes);
router.use('/photo-credits', photocreditsRoutes);
router.use('/tribut', tributRoutes);
router.use('/gallery', tributRoutes);
router.use('/canary', canaryRoutes);
router.use('/canary-ads', canaryRoutes);
router.use('/ads', canaryRoutes);
router.use('/campaigns', campaignsRoutes);
router.use('/marketing', marketingRoutes);
router.use('/events', eventsRoutes);
router.use('/storefront', storefrontRoutes);
router.use('/storefronts', storefrontRoutes);
router.use('/commerce', storefrontRoutes);
router.use('/subscriptions', subscriptionsRoutes);
router.use('/trends', trendsRoutes);
router.use('/discover', discoverRoutes);
router.use('/posts', postsRoutes);
router.use('/search', searchRoutes);
router.use('/leaderboards', leaderboardsRoutes);
router.use('/permanence', permanenceRoutes);
router.use('/gameon', gameonRoutes);
router.use('/game-on', gameonRoutes);
router.use('/programs', programsRoutes);
router.use('/jobs', jobsRoutes);
router.use('/communities', communitiesRoutes);
router.use('/community', communitiesRoutes);
router.use('/franchise', franchisesRoutes);
router.use('/franchises', franchisesRoutes);
router.use('/live-stream', liveStreamRoutes);
router.use('/live-streams', liveStreamRoutes);
router.use('/seads', seadsRoutes);
router.use('/business/offices', businessOfficesRoutes);
router.use('/business-offices', businessOfficesRoutes);
router.use('/businessoffices', businessOfficesRoutes);
router.use('/offices', businessOfficesRoutes);
// Add the new routes
router.use('/spend-caps', spendCapsRoutes);
router.use('/account-inactivity', accountInactivityRoutes);

// Roles, Permissions, Badges & Member Gatekeeper Suite
router.use('/collaborators', collaboratorsRoutes);
router.use('/v1/collaborators', collaboratorsRoutes);
router.use('/roles', rolesRoutes);
router.use('/v1/roles', rolesRoutes);
router.use('/member-access', memberAccessRoutes);
router.use('/v1/member-access', memberAccessRoutes);
router.use('/badges', badgesRoutes);
router.use('/v1/badges', badgesRoutes);
router.use('/stores', crossStoreSearchRoutes);
router.use('/v1/stores', crossStoreSearchRoutes);

// Wallet, Treasury Rail, Sovereign Vaults & Financials Suite
router.use('/wallet', walletRoutes);
router.use('/wallets', walletRoutes);
router.use('/revenue-wallet', revenueWalletRoutes);
router.use('/enhanced-wallet', enhancedWalletRoutes);
router.use('/treasury', treasuryWalletRoutes);
router.use('/fic-vault', ficVaultRoutes);
router.use('/governance', corporateGovernanceRoutes);
router.use('/corporate-governance', corporateGovernanceRoutes);
router.use('/financials/ecosystem', financialEcosystemRoutes);
router.use('/financial-ecosystem', financialEcosystemRoutes);

// Conference, Luxury Services, AI Video Studio & Gifting Suite
router.use('/conference', conferenceRoutes);
router.use('/conferences', conferenceRoutes);
router.use('/video-translation', videoTranslationRoutes);
router.use('/videotranslation', videoTranslationRoutes);
router.use('/v1/video-translation', videoTranslationRoutes);
router.use('/giftcards', giftcardsRoutes);
router.use('/gifting', giftcardsRoutes);
router.use('/advancedgifting', giftcardsRoutes);
router.use('/metrics', metricsRoutes);
router.use('/v1/vault/dpo', dpoRoutes);
router.use('/vault/dpo', dpoRoutes);
router.use('/dpo', dpoRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Catch-all for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

module.exports = router;
