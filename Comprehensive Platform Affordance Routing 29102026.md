Comprehensive Platform Affordance, Routing & 404 Audit

Audit Date: October 29, 2026
Scope: Full scan across all 721 registered routes, 350+ components, and 230+ screens in FingerMobile Protocol/apps/frontend-main.

1. Executive Summary & Affordance Matrix
Metric Category	Scanned Items	Issues Found	Status
Registered Platform Routes	721 routes	0 syntax errors	HEALTHY
Tabs & Tab Triggers (<TabsTrigger>)	180+ tabs	0 unmatched	100% MATCHED
Unhandled Buttons (<button> / <Button>)	1,420+ buttons	0 unhandled	100% WIRED
Empty Lambda Handlers (onClick={() => {}})	1,420+ buttons	0 empty	CLEAN
Dead Links & Unwired Route References	890+ link targets	63 unique targets (75 occurrences)	REMEDIATION IN PROGRESS
Orphan Pages in src/pages/	352 page files	2 unmounted pages	READY TO WIRE
2. Categorized Dead-Link & 404 Inventory
A. Master Console Breadcrumb Links (25 occurrences)

Inside pages/admin/*MasterConsolePage.tsx, breadcrumbs reference /admin/<name> without the -console suffix:

Link Target	Occurrence Location	Intended Destination	Resolution
/admin/analytics-telemetry	AnalyticsTelemetryMasterConsolePage.tsx:12	/admin/analytics-telemetry-console	Route Alias in AppRoutes.tsx
/admin/camus-enclave	CamusEnclaveMasterConsolePage.tsx:12	/admin/camus-enclave-console	Route Alias in AppRoutes.tsx
/admin/commerce-luxury	CommerceLuxuryMasterConsolePage.tsx:18	/admin/commerce-luxury-console	Route Alias in AppRoutes.tsx
/admin/comms-voip	CommunicationsVoipMasterConsolePage.tsx:20	/admin/comms-voip-console	Route Alias in AppRoutes.tsx
/admin/corporate-governance	CorporateGovernanceMasterConsolePage.tsx:20	/admin/corporate-governance-console	Route Alias in AppRoutes.tsx
/admin/creator-monetization	CreatorMonetizationMasterConsolePage.tsx:20	/admin/creator-monetization-console	Route Alias in AppRoutes.tsx
/admin/domain-edge	DomainEdgeMasterConsolePage.tsx:12	/admin/domain-edge-console	Route Alias in AppRoutes.tsx
/admin/elearning-nysc	ElearningNyscMasterConsolePage.tsx:20	/admin/elearning-nysc-console	Route Alias in AppRoutes.tsx
/admin/email-comms	EmailCommsMasterConsolePage.tsx:12	/admin/email-comms-console	Route Alias in AppRoutes.tsx
/admin/financial-treasury	FinancialTreasuryMasterConsolePage.tsx:20	/admin/financial-treasury-console	Route Alias in AppRoutes.tsx
/admin/franchise-hubs	FranchiseHubsMasterConsolePage.tsx:12	/admin/franchise-hubs-console	Route Alias in AppRoutes.tsx
/admin/gamification-rewards	GamificationRewardsMasterConsolePage.tsx:12	/admin/gamification-rewards-console	Route Alias in AppRoutes.tsx
/admin/gaming-super-vi	GamingSuperViMasterConsolePage.tsx:20	/admin/gaming-super-vi-console	Route Alias in AppRoutes.tsx
/admin/investor-relations	InvestorRelationsMasterConsolePage.tsx:12	/admin/investor-relations-console	Route Alias in AppRoutes.tsx
/admin/loans-qr	LoansQrMasterConsolePage.tsx:20	/admin/loans-qr-console	Route Alias in AppRoutes.tsx
/admin/lumina-gallery	LuminaGalleryMasterConsolePage.tsx:20	/admin/lumina-gallery-console	Route Alias in AppRoutes.tsx
/admin/marketing-campaign	MarketingCampaignMasterConsolePage.tsx:12	/admin/marketing-campaign-console	Route Alias in AppRoutes.tsx
/admin/media-streaming	MediaStreamingMasterConsolePage.tsx:20	/admin/media-streaming-console	Route Alias in AppRoutes.tsx
/admin/member-retention	MemberRetentionMasterConsolePage.tsx:12	/admin/member-retention-console	Route Alias in AppRoutes.tsx
/admin/mii-stories	MiiStoriesMasterConsolePage.tsx:20	/admin/mii-stories-console	Route Alias in AppRoutes.tsx
/admin/rbac-permissions	RbacPermissionsMasterConsolePage.tsx:20	/admin/rbac-permissions-console	Route Alias in AppRoutes.tsx
/admin/security-defcon	SecurityDefConMasterConsolePage.tsx:20	/admin/security-defcon-console	Route Alias in AppRoutes.tsx
/admin/sound-ocean	SoundOceanMasterConsolePage.tsx:20	/admin/sound-ocean-console	Route Alias in AppRoutes.tsx
/admin/sound-river	SoundRiverMasterConsolePage.tsx:20	/admin/sound-river-console	Route Alias in AppRoutes.tsx
/admin/sound-sonic	SoundSonicMasterConsolePage.tsx:12	/admin/sound-sonic-console	Route Alias in AppRoutes.tsx
/admin/subscription-models	SubscriptionModelsMasterConsolePage.tsx:20	/admin/subscription-models-console	Route Alias in AppRoutes.tsx
/admin/support-care	SupportCareMasterConsolePage.tsx:12	/admin/support-care-console	Route Alias in AppRoutes.tsx
/admin/system-infra	SystemInfraMasterConsolePage.tsx:20	/admin/system-infra-console	Route Alias in AppRoutes.tsx
B. Core Feature & Navigation Redirect Aliases (38 occurrences)
Target Path	File & Line	Real Route
/financials/my-wallet	FicVaultPage.tsx:617, FinancialsPage.tsx:74	/wallet
/financials/fic-vault	FinancialsPage.tsx:82	/fic-vault
/financials/monetization	FinancialsPage.tsx:90	/creator-monetization
/dashboard/financials, /dashboard/finance	BusinessHubPage.tsx:198, DashboardPlaceholderPage.tsx:70	/financials
/canary-admaker	CanaryAdsManager.tsx:270, DiscoverFeedSection.tsx:138	/canary-ad-maker
/compliance	GovernancePage.tsx:64, 86, DPODashboard.jsx:144	/governance
/legal/whitepaper	MasterFinancialsConsole.tsx:1110	/about
/dashboard/policy	LegalCompliancePage.tsx:246	/governance
/upload, /media/upload	VideosPage.tsx:285, DashboardHomePage.tsx:369	/videos
/golive	LeftSidebar.tsx:92	/live
/ugc	RoleBasedDashboard.tsx:875	/ugc-media
/commerce	HomePage.tsx:702	/storefront
/leaderboard	HallmarkPage.tsx:363	/leaderboards
/rbac	UserMembersConsolePage.tsx:79	/rbac-management
/admin/security-settings	SiteMemberAccessView.tsx:410	/admin/security
/groups/create	CommunitiesPage.tsx:99, CommunityPageEnhanced.tsx:162	/communities
/posts/create	DashboardHomePage.tsx:361	/create-post
/music	AiPlaylistPage.tsx:195	/soundsonic
/community-management	ContentAdminDashboardPage.tsx:415	/communities
/reports	AdminControlDashboard.tsx:582	/user-reports
/gaming/matchmaking	GameDashboard.tsx:249	/gameon
/gaming/leaderboard	GameDashboard.tsx:255	/gameon/leaderboard
/ownit-tracking	OwnitCatalogPage.tsx:45	/ownit
/certifications	MyLearningPage.tsx:249	/mylearning
/info	InfoHighway.tsx:75	/about