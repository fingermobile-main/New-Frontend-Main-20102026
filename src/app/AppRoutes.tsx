import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

// Layout Wrappers
import { RootPlatformLayout } from '../layouts/RootPlatformLayout';
import { ShellLayout } from '../layouts/ShellLayout';
import { WorkspaceLayout } from '../layouts/WorkspaceLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ReaderLayout } from '../layouts/ReaderLayout';

// Guard Rails
import { RequireAuth } from './guards/RequireAuth';
import { RequireRole } from './guards/RequireRole';
import { UserRole } from '../types/auth';

// -----------------------------------------------------------------------------
// CODE-SPLIT LAZY LOADED IMPORTS (162 Screens)
// -----------------------------------------------------------------------------

// Module 1: Auth & Account Security
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage'));
const VerificationPage = lazy(() => import('../pages/VerificationPage'));
const SecuritySetupPage = lazy(() => import('../pages/auth/SecuritySetupPage'));
const ChangePasswordPage = lazy(() => import('../pages/ChangePasswordPage'));
const AccountDeletionPage = lazy(() => import('../pages/AccountDeletionPage'));
const OnboardingPage = lazy(() => import('../pages/OnboardingPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));

// Module 2: Core Social, Discovery & Consumption
const HomePage = lazy(() => import('../pages/HomePage'));
const DiscoverPage = lazy(() => import('../pages/DiscoverPage'));
const DiscoveryPage = lazy(() => import('../pages/DiscoveryPage'));
const CategoryFeedPage = lazy(() => import('../pages/CategoryFeedPage'));
const SearchPage = lazy(() => import('../pages/search/SearchPage'));
const TrendsPage = lazy(() => import('../pages/TrendsPage'));
const TrendsFeedPage = lazy(() => import('../pages/TrendsFeedPage'));
const TopicsPage = lazy(() => import('../pages/TopicsPage'));
const PostDetailPage = lazy(() => import('../pages/PostDetailPage'));
const VideosPage = lazy(() => import('../pages/VideosPage'));
const FingerShortsPage = lazy(() => import('../pages/FingerShortsPage'));
const PhotosPage = lazy(() => import('../pages/PhotosPage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const ShowcasePage = lazy(() => import('../pages/ShowcasePage'));

// Module 3: Creation, Editing & Media Production
const CreatePostPage = lazy(() => import('../pages/CreatePostPage'));
const EditPostPage = lazy(() => import('../pages/EditPostPage'));
const EditorPage = lazy(() => import('../pages/EditorPage'));
const EnhancedEditorPage = lazy(() => import('../pages/EnhancedEditorPage'));
const AdvancedMediaEditorPage = lazy(() => import('../pages/AdvancedMediaEditorPage'));
const StercsEditorPage = lazy(() => import('../pages/StercsEditorPage'));
const StercsMediaLibraryPage = lazy(() => import('../pages/StercsMediaLibraryPage'));
const StercsThemeDesignerPage = lazy(() => import('../pages/StercsThemeDesignerPage'));
const StercsVideoEditorPage = lazy(() => import('../pages/StercsVideoEditorPage'));
const PublishingToolsPage = lazy(() => import('../pages/PublishingToolsPage'));
const PostPublishingSettingsPage = lazy(() => import('../pages/PostPublishingSettingsPage'));
const PublishedPage = lazy(() => import('../pages/PublishedPage'));

// Module 4: Creator Ecosystem, Monetization & Competitions
const CreatorDashboardPage = lazy(() => import('../pages/CreatorDashboardPage'));
const CreatorsCenterPage = lazy(() => import('../pages/CreatorsCenterPage'));
const CreatorInfluencePage = lazy(() => import('../pages/CreatorInfluencePage'));
const MonetizationDashboardPage = lazy(() => import('../pages/MonetizationDashboardPage'));
const MonetizationPage = lazy(() => import('../pages/financials/MonetizationPage'));
const MemberEarningPage = lazy(() => import('../pages/MemberEarningPage'));
const AdvancedGiftingPage = lazy(() => import('../pages/AdvancedGiftingPage'));
const GemsPage = lazy(() => import('../pages/GemsPage'));
const FingerWarsPage = lazy(() => import('../pages/FingerWarsPage'));
const AdvancedFingerWarPage = lazy(() => import('../pages/AdvancedFingerWarPage'));
const HallmarkPage = lazy(() => import('../pages/HallmarkPage'));
const HallmarksPage = lazy(() => import('../pages/HallmarksPage'));
const GameOnPage = lazy(() => import('../pages/GameOnPage'));

// Module 5: Communities, Groups & Collaboration
const CommunitiesPage = lazy(() => import('../pages/CommunitiesPage'));
const CommunityPage = lazy(() => import('../pages/CommunityPage'));
const CommunityPageEnhanced = lazy(() => import('../pages/CommunityPageEnhanced'));
const CommunityPages = lazy(() => import('../pages/CommunityPages'));
const CommunityManagementPage = lazy(() => import('../pages/dashboard/community/CommunityManagementPage'));
const CommunityGuidelinesPage = lazy(() => import('../pages/legal/CommunityGuidelinesPage'));
const CommunityStandardsNudityPage = lazy(() => import('../pages/legal/CommunityStandardsNudityPage'));
const GroupsPage = lazy(() => import('../pages/GroupsPage')); // Consolidated standard
const GroupDetailPage = lazy(() => import('../pages/groups/GroupDetailPage')); // Consolidated standard
const CreateGroupPage = lazy(() => import('../pages/CreateGroupPage'));
const ForumPage = lazy(() => import('../pages/ForumPage'));
const ConferencePage = lazy(() => import('../pages/ConferencePage'));
const LiveStreamingPage = lazy(() => import('../pages/LiveStreamingPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));

// Module 6: Audio, Streaming & Rich Media
const BeatwaveNGPage = lazy(() => import('../pages/BeatwaveNGPage'));
const AiPlaylistPage = lazy(() => import('../pages/music/AiPlaylistPage'));
const AdvancedVoicePage = lazy(() => import('../pages/AdvancedVoicePage'));
const Dancia4TvPage = lazy(() => import('../pages/Dancia4TvPage'));
const VideoTranslationDashboard = lazy(() => import('../pages/VideoTranslationDashboard')); // Fixed missing route

// Module 7: E-Commerce, Storefronts & Physical Commerce
const MarketplacePage = lazy(() => import('../pages/MarketplacePage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const CataloguePage = lazy(() => import('../pages/CataloguePage'));
const StorefrontPage = lazy(() => import('../pages/StorefrontPage'));
const StorefrontsPage = lazy(() => import('../pages/StorefrontsPage'));
const StorefrontDetailPage = lazy(() => import('../pages/StorefrontDetailPage'));
const MyStorefrontPage = lazy(() => import('../pages/MyStorefrontPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const CouponsPage = lazy(() => import('../pages/CouponsPage'));
const MarketplaceTrackingPage = lazy(() => import('../pages/marketplace/MarketplaceTrackingPage'));
const StorefrontTrackingPage = lazy(() => import('../pages/StorefrontTrackingPage'));
const FingerLuxPage = lazy(() => import('../pages/FingerLuxPage'));
const LushPressiesPage = lazy(() => import('../pages/LushPressiesPage')); // Consolidated standard
const MyDownloadsPage = lazy(() => import('../pages/MyDownloadsPage'));

// Module 8: Wallets, Payments & Financial Operations
const WalletPage = lazy(() => import('../pages/WalletPage'));
const WalletAndPayPage = lazy(() => import('../pages/WalletAndPayPage'));
const WalletFundingPage = lazy(() => import('../pages/WalletFundingPage'));
const PaylinksPage = lazy(() => import('../pages/PaylinksPage'));
const FinancialsPage = lazy(() => import('../pages/financials/FinancialsPage'));
const FICVaultPage = lazy(() => import('../pages/FICVaultPage'));
const LoanSqrPage = lazy(() => import('../pages/LoanSqrPage'));

// Module 9: E-Learning, Education & Programs
const ELearningPage = lazy(() => import('../pages/ELearningPage'));
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage'));
const MyLearningPage = lazy(() => import('../pages/MyLearningPage'));
const LmsPage = lazy(() => import('../pages/LmsPage'));
const ProgramsPage = lazy(() => import('../pages/ProgramsPage'));
const NyscPage = lazy(() => import('../pages/NyscPage'));

// Module 10: User Identity, Settings & Internal Operations
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const MessagesPage = lazy(() => import('../pages/messages/MessagesPage'));
const PrivateMessagesPage = lazy(() => import('../pages/PrivateMessagesPage'));
const MembersPage = lazy(() => import('../pages/dashboard/MembersPage'));
const MemberLandingPage = lazy(() => import('../pages/MemberLandingPage'));
const SubscriptionsPage = lazy(() => import('../pages/financials/SubscriptionsPage'));
const PortfolioPage = lazy(() => import('../pages/PortfolioPage'));
const MiiPage = lazy(() => import('../pages/MiiPage'));
const MyPages = lazy(() => import('../pages/MyPages'));
const PhotoCreditsPage = lazy(() => import('../pages/PhotoCreditsPage'));
const PhotoCreditDetailPage = lazy(() => import('../pages/PhotoCreditDetailPage'));
const JobsPage = lazy(() => import('../pages/JobsPage'));
const OfficialVerificationPage = lazy(() => import('../pages/OfficialVerificationPage'));

// Module 11: Enterprise, Tracking & Campaign Tools
const SeadsPage = lazy(() => import('../pages/SeadsPage'));
const CanaryPage = lazy(() => import('../pages/CanaryPage'));
const CanaryAdsPage = lazy(() => import('../pages/CanaryAdsPage'));
const CanaryAdMakerPage = lazy(() => import('../pages/CanaryAdMakerPage'));
const AdvertisingPage = lazy(() => import('../pages/dashboard/AdvertisingPage'));
const CanaryAdsManagementPage = lazy(() => import('../pages/admin/CanaryAdsManagementPage'));
const DPODashboardPage = lazy(() => import('../pages/admin/DPODashboardPage'));
const PubliciteePage = lazy(() => import('../pages/PubliciteePage'));
const FlamingoPage = lazy(() => import('../pages/FlamingoPage'));
const FlamingoTrackingPage = lazy(() => import('../pages/FlamingoTrackingPage'));
const OwnitPage = lazy(() => import('../pages/OwnitPage'));
const OwnitTrackingPage = lazy(() => import('../pages/OwnitTrackingPage'));
const BusinessOfficesPage = lazy(() => import('../pages/BusinessOfficesPage'));
const FranchisePage = lazy(() => import('../pages/FranchisePage'));
const FranchiseManagementPage = lazy(() => import('../pages/dashboard/FranchiseManagementPage'));
const OrganizeThesePage = lazy(() => import('../pages/OrganizeThesePage'));
const PermanencePage = lazy(() => import('../pages/PermanencePage'));

// Module 12: Analytics, Operations & Admin Dashboards
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const DashboardHomePage = lazy(() => import('../pages/dashboard/DashboardHomePage'));
const UnifiedDashboardPage = lazy(() => import('../pages/UnifiedDashboardPage'));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage'));
const AdminUserManagementPage = lazy(() => import('../pages/admin/AdminUserManagement'));
const AdminControlDashboard = lazy(() => import('../pages/AdminControlDashboard'));
const AdvancedAnalyticsPage = lazy(() => import('../pages/AdvancedAnalyticsPage'));
const InsightsPage = lazy(() => import('../pages/InsightsPage'));
const AuditLogAdminPage = lazy(() => import('../pages/AuditLogAdminPage'));
const ModerationQueuePage = lazy(() => import('../pages/ModerationQueuePage'));
const UserReportsPage = lazy(() => import('../pages/UserReportsPage'));
const UGCDashboardPage = lazy(() => import('../pages/UGCDashboardPage'));
const RbacManagementPage = lazy(() => import('../pages/RbacManagementPage'));
const MasterDashboardPage = lazy(() => import('../pages/MasterDashboardPage'));
const UserMembersConsolePage = lazy(() => import('../pages/UserMembersConsolePage'));
const StercsDashboardPage = lazy(() => import('../pages/StercsDashboardPage'));
const StercsPage = lazy(() => import('../pages/StercsPage'));
const GuardianAiPage = lazy(() => import('../pages/GuardianAiPage'));

// Module 13: Systems Engineering, Data, Dev & Cloud Infrastructure
const DeveloperPortalPage = lazy(() => import('../pages/dashboard/DeveloperPortalPage'));
const DatabaseIntegrationDashboard = lazy(() => import('../pages/DatabaseIntegrationDashboard'));
const DatabaseIntegrationReportPage = lazy(() => import('../pages/DatabaseIntegrationReportPage'));
const DatabaseIntegrationSummary = lazy(() => import('../pages/DatabaseIntegrationSummary'));
const DataImportPage = lazy(() => import('../pages/DataImportPage'));
const CsvImportPage = lazy(() => import('../pages/CsvImportPage'));
const CacheManagementPage = lazy(() => import('../pages/CacheManagementPage'));
const CacheDemoPage = lazy(() => import('../pages/CacheDemoPage'));
const MonitoringDashboardPage = lazy(() => import('../pages/MonitoringDashboardPage'));
const PrometheusMetricsPage = lazy(() => import('../pages/PrometheusMetricsPage'));
const GrafanaEmbedPage = lazy(() => import('../pages/GrafanaEmbedPage'));
const RateLimitConfigPage = lazy(() => import('../pages/RateLimitConfigPage'));
const ProtocolDemoPage = lazy(() => import('../pages/ProtocolDemoPage'));
const CamusPage = lazy(() => import('../pages/CamusPage'));
const CamusDashboardPage = lazy(() => import('../pages/CamusDashboardPage'));

// Module 14: Corporate, Legal, Compliance & Information
const AboutPage = lazy(() => import('../pages/about/AboutPage'));
const AboutUsPage = lazy(() => import('../pages/AboutUsPage'));
const BlogsPage = lazy(() => import('../pages/BlogsPage'));
const BlogTemplatesPage = lazy(() => import('../pages/BlogTemplatesPage'));
const ContactUsPage = lazy(() => import('../pages/ContactUsPage'));
const SupportPage = lazy(() => import('../pages/SupportPage'));
const GovernancePage = lazy(() => import('../pages/GovernancePage'));
const InvestorRelationsPage = lazy(() => import('../pages/InvestorRelationsPage'));
const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/legal/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('../pages/legal/TermsOfServicePage'));
const PlatformServiceOfUsePage = lazy(() => import('../pages/legal/PlatformServiceOfUsePage'));
const LegalPage = lazy(() => import('../pages/legal/LegalPage'));
const LegalIndexPage = lazy(() => import('../pages/legal/IndexPage'));
const TermsAndConditionsPage = lazy(() => import('../pages/TermsAndConditionsPage'));
const CookiePolicyPage = lazy(() => import('../pages/CookiePolicyPage'));
const DataSubjectRequestPage = lazy(() => import('../pages/DataSubjectRequestPage'));
const MarketingPage = lazy(() => import('../pages/MarketingPage'));
const FAQPage = lazy(() => import('../pages/info/FAQPage'));
const ContactSupportPage = lazy(() => import('../pages/support/ContactSupportPage'));
const HelpPage = lazy(() => import('../pages/support/HelpPage'));

// Module 15: Legacy Utility and Feature Routes kept for backwards compatibility
const ProfileEnhancement = lazy(() => import('../components/ProfileEnhancement'));
const BusinessPageFeatures = lazy(() => import('../components/BusinessPageFeatures'));
const CommunityGroupFeatures = lazy(() => import('../components/CommunityGroupFeatures'));
const ComboEmoticonDisplay = lazy(() => import('../components/ComboEmoticonDisplay'));
const PremiumPages = lazy(() => import('../components/PremiumPages'));
const CreatorMode = lazy(() => import('../components/CreatorMode'));
const AIAvatarGenerator = lazy(() => import('../components/AIAvatarGenerator'));

// Module 16: Enterprise Roles, Permissions, Member Access & Badges Studio
const SettingsHubPage = lazy(() => import('../pages/dashboard/settings/SettingsHubPage'));
const RolesPermissionsPage = lazy(() => import('../pages/dashboard/roles/RolesPermissionsPage'));
const ManageRolesPage = lazy(() => import('../pages/dashboard/roles/ManageRolesPage'));
const SiteMemberAccessPage = lazy(() => import('../pages/dashboard/roles/SiteMemberAccessPage'));
const BadgesManagementPage = lazy(() => import('../pages/dashboard/badges/BadgesManagementPage'));
const EmailServiceConsolePage = lazy(() => import('../pages/dashboard/email/EmailServiceConsolePage'));

// Module 17: Platform Consoles, Governance & Intelligence
const ContactsPage = lazy(() => import('../pages/ContactsPage'));
const EcommercePage = lazy(() => import('../pages/EcommercePage'));
const MediaIntelligencePage = lazy(() => import('../pages/MediaIntelligencePage'));
const AiGovernancePage = lazy(() => import('../pages/AiGovernancePage'));
const SecurityPage = lazy(() => import('../pages/SecurityPage'));
const ContentModeratorDashboardPage = lazy(() => import('../pages/ContentModeratorDashboardPage'));
const FinanceDashboardPage = lazy(() => import('../pages/dashboard/FinanceDashboardPage'));
const ModerationDashboardPage = lazy(() => import('../pages/dashboard/ModerationDashboardPage'));
const CompliancePage = lazy(() => import('../pages/CompliancePage'));
const SessionManagementPage = lazy(() => import('../pages/SessionManagementPage'));

const redirectTo = (to: string) => <Navigate to={to} replace />;

// -----------------------------------------------------------------------------
// ROUTING DEFINITION
// -----------------------------------------------------------------------------

export const routes: RouteObject[] = [
  {
    element: <RootPlatformLayout />,
    children: [
      // ---------------------------------------------------------------------------
      // AUTH SCAFFOLD (S2) - Unauthenticated / Minimal Identity Entry
      // ---------------------------------------------------------------------------
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> },
          { path: '/admin', element: redirectTo('/adminlogin') },
          { path: '/adminlogin', element: <AdminLoginPage /> },
          { path: '/verification', element: <VerificationPage /> },
          { path: '/official-verification', element: <OfficialVerificationPage /> },
          { path: '/admin/security', element: redirectTo('/securitysetup') },
          { path: '/securitysetup', element: <SecuritySetupPage /> },
          { path: '/change-password', element: redirectTo('/changepassword') },
          { path: '/changepassword', element: <ChangePasswordPage /> },
          { path: '/data-request', element: redirectTo('/datasubjectrequest') },
          { path: '/datasubjectrequest', element: <DataSubjectRequestPage /> },
          { path: '/forgot-password', element: <ForgotPasswordPage /> },
          { path: '/forgotpassword', element: redirectTo('/forgot-password') },
          { path: '/reset-password', element: redirectTo('/forgot-password') },
          { path: '/checkout', element: <CheckoutPage /> },
        ],
      },

      // ---------------------------------------------------------------------------
      // READER SCAFFOLD (S5) - Documentation & Legal Texts (Publicly Accessible)
      // ---------------------------------------------------------------------------
      {
        element: <ReaderLayout />,
        children: [
          { path: '/about', element: <AboutPage /> },
          { path: '/about-us', element: redirectTo('/aboutus') },
          { path: '/aboutus', element: <AboutUsPage /> },
          { path: '/contact', element: redirectTo('/contactus') },
          { path: '/contactus', element: <ContactUsPage /> },
          { path: '/support', element: <SupportPage /> },
          { path: '/contact-support', element: <ContactSupportPage /> },
          { path: '/help', element: <HelpPage /> },
          { path: '/faq', element: <FAQPage /> },
          { path: '/investors', element: redirectTo('/investorrelations') },
          { path: '/investorrelations', element: <InvestorRelationsPage /> },
          { path: '/services', element: <ServicesPage /> },
          { path: '/marketing', element: <MarketingPage /> },
          { path: '/guidelines', element: redirectTo('/communityguidelines') },
          { path: '/communityguidelines', element: <CommunityGuidelinesPage /> },
          { path: '/community-standards-nudity', element: <CommunityStandardsNudityPage /> },
          { path: '/legal/community-standards-nudity', element: <CommunityStandardsNudityPage /> },
          { path: '/legal/nudity-policy', element: <CommunityStandardsNudityPage /> },
          { path: '/privacy', element: redirectTo('/privacypolicy') },
          { path: '/privacy-policy', element: redirectTo('/privacypolicy') },
          { path: '/privacypolicy', element: <PrivacyPolicyPage /> },
          { path: '/platform-service-of-use', element: <PlatformServiceOfUsePage /> },
          { path: '/platformserviceofuse', element: <PlatformServiceOfUsePage /> },
          { path: '/service-of-use', element: redirectTo('/platform-service-of-use') },
          { path: '/serviceofuse', element: redirectTo('/platform-service-of-use') },
          { path: '/terms-of-use', element: redirectTo('/platform-service-of-use') },
          { path: '/termsofuse', element: redirectTo('/platform-service-of-use') },
          { path: '/legal/service-of-use', element: redirectTo('/platform-service-of-use') },
          { path: '/legal/platform-service-of-use', element: redirectTo('/platform-service-of-use') },
          { path: '/legal', element: <LegalPage /> },
          { path: '/legal/hub', element: <LegalPage /> },
          { path: '/legal/index', element: <LegalIndexPage /> },
          { path: '/legal/terms-of-service', element: redirectTo('/termsofservice') },
          { path: '/legal/terms', element: redirectTo('/termsofservice') },
          { path: '/legal/privacy', element: redirectTo('/privacypolicy') },
          { path: '/legal/privacy-policy', element: redirectTo('/privacypolicy') },
          { path: '/terms', element: redirectTo('/termsofservice') },
          { path: '/terms-of-service', element: redirectTo('/termsofservice') },
          { path: '/termsofservice', element: <TermsOfServicePage /> },
          { path: '/terms-conditions', element: redirectTo('/termsandconditions') },
          { path: '/termsandconditions', element: <TermsAndConditionsPage /> },
          { path: '/cookies', element: redirectTo('/cookiepolicy') },
          { path: '/cookie-policy', element: redirectTo('/cookiepolicy') },
          { path: '/cookiepolicy', element: <CookiePolicyPage /> },
          { path: '/developer', element: redirectTo('/developerportal') },
          { path: '/developerportal', element: <DeveloperPortalPage /> },
        ],
      },

      // ---------------------------------------------------------------------------
      // SHELL SCAFFOLD (S1) - Public / Unauthenticated Discovery Views
      // ---------------------------------------------------------------------------
      {
        element: <ShellLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/discover', element: <DiscoverPage /> },
          { path: '/discovery', element: <DiscoveryPage /> },
          { path: '/discovery/category/:category', element: <CategoryFeedPage /> },
          { path: '/categoryfeed', element: <CategoryFeedPage /> },
          { path: '/search', element: <SearchPage /> },
          { path: '/trends', element: <TrendsPage /> },
          { path: '/trends/feed', element: <TrendsFeedPage /> },
          { path: '/trendsfeed', element: <TrendsFeedPage /> },
          { path: '/videos', element: <VideosPage /> },
          { path: '/fingershorts', element: <FingerShortsPage /> },
          { path: '/shorts', element: redirectTo('/fingershorts') },
          { path: '/photos', element: <PhotosPage /> },
          { path: '/gallery', element: <GalleryPage /> },
          { path: '/showcase', element: <ShowcasePage /> },
          { path: '/blogs', element: <BlogsPage /> },
          { path: '/blogs/templates', element: <BlogTemplatesPage /> },
          { path: '/blog-templates', element: <BlogTemplatesPage /> },
          { path: '/dancia4tv', element: <Dancia4TvPage /> },
          { path: '/dancia-4tv', element: redirectTo('/dancia4tv') },
          { path: '/dancie4tv', element: <Navigate to="/dancia4tv" replace /> }, // Canonical Redirection
          { path: '/beatwave-ng', element: redirectTo('/beatwaveng') },
          { path: '/beatwave', element: redirectTo('/beatwaveng') },
          { path: '/marketplace', element: <MarketplacePage /> },
          { path: '/products', element: <ProductsPage /> },
          { path: '/product/:id', element: <ProductDetailPage /> },
          { path: '/productdetail', element: <ProductDetailPage /> },
          { path: '/catalogue', element: <CataloguePage /> },
          { path: '/storefront', element: <StorefrontPage /> },
          { path: '/storefronts', element: <StorefrontsPage /> },
          { path: '/storefront/:id', element: <StorefrontDetailPage /> },
          { path: '/storefrontdetail', element: <StorefrontDetailPage /> },
          { path: '/fingerlux', element: <FingerLuxPage /> },
          { path: '/lush-pressies', element: redirectTo('/lushpressies') },
          { path: '/lushpressies', element: <LushPressiesPage /> },
          { path: '/elearning', element: <ELearningPage /> },
          { path: '/course/:id', element: <CourseDetailPage /> },
          { path: '/coursedetail', element: <CourseDetailPage /> },
          { path: '/programs', element: <ProgramsPage /> },
          { path: '/jobs', element: <JobsPage /> },
          { path: '/communities', element: <CommunitiesPage /> },
          { path: '/community', element: <CommunityPage /> },
          { path: '/forum', element: <ForumPage /> },
          { path: '/forum-draft', element: redirectTo('/forum') },
          { path: '/events', element: <EventsPage /> },
          { path: '/fingerwars', element: <FingerWarsPage /> },
          { path: '/finger-wars', element: redirectTo('/fingerwars') },
          { path: '/gameon', element: <GameOnPage /> },
          { path: '/game-on', element: redirectTo('/gameon') },
          { path: '/canaryads', element: <CanaryAdsPage /> },
          { path: '/canary-ads', element: redirectTo('/canaryads') },
          { path: '/photo-credits', element: redirectTo('/photocredits') },
          { path: '/photocredits', element: <PhotoCreditsPage /> },
          { path: '/luminagallery', element: <GalleryPage /> },
          { path: '/business', element: <BusinessOfficesPage /> },
          { path: '/business-offices', element: redirectTo('/businessoffices') },
          { path: '/business/offices', element: redirectTo('/businessoffices') },
          { path: '/businessoffices', element: <BusinessOfficesPage /> },
          { path: '/guardian-protection', element: <GuardianAiPage /> },
          { path: '/guardian-ai', element: <GuardianAiPage /> },
          { path: '/guardian', element: <GuardianAiPage /> },
          { path: '/master-dashboard', element: <MasterDashboardPage /> },
          { path: '/masterdashboard', element: <MasterDashboardPage /> },
          { path: '/seo', element: redirectTo('/masterdashboard?tab=seo') },
          { path: '/guardian/seo', element: redirectTo('/masterdashboard?tab=seo') },
          { path: '/financials', element: redirectTo('/masterdashboard?tab=financials') },
          { path: '/stercs-dashboard', element: <StercsDashboardPage /> },
          { path: '/stercsdashboard', element: <StercsDashboardPage /> },
          { path: '/stercs', element: <StercsPage /> },
          { path: '/stercs/compliance', element: <StercsDashboardPage /> },
          { path: '/stercs/modules', element: <StercsDashboardPage /> },
          { path: '/dashboard/roles', element: <StercsDashboardPage /> },
          { path: '/settings-hub', element: <SettingsHubPage /> },
          { path: '/system-settings', element: redirectTo('/settings-hub') },
          { path: '/settings/roles-permissions', element: <RolesPermissionsPage /> },
          { path: '/dashboard/roles-permissions', element: redirectTo('/settings/roles-permissions') },
          { path: '/settings/roles-permissions/manage-roles', element: <ManageRolesPage /> },
          { path: '/contacts/site-members/site-member-access', element: <SiteMemberAccessPage /> },
          { path: '/settings/member-access', element: redirectTo('/contacts/site-members/site-member-access') },
          { path: '/settings/badges', element: <BadgesManagementPage /> },
          { path: '/badges', element: redirectTo('/settings/badges') },
          { path: '/franchise', element: <FranchisePage /> },
          { path: '/ugc-dashboard', element: redirectTo('/ugcdashboard') },
          { path: '/my-downloads', element: redirectTo('/mydownloads') },
          { path: '/downloads', element: redirectTo('/mydownloads') },
          { path: '/pricing', element: redirectTo('/subscriptions') },
          { path: '/hallmark', element: <HallmarkPage /> },
          { path: '/photocredit/:id', element: <PhotoCreditDetailPage /> },
          { path: '/photocreditdetail', element: <PhotoCreditDetailPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/post/:id', element: <PostDetailPage /> },
          { path: '/postdetail', element: <PostDetailPage /> },
          { path: '/profile-enhancement', element: <ProfileEnhancement /> },
          { path: '/community-group', element: <CommunityGroupFeatures /> },
          { path: '/emojis', element: <ComboEmoticonDisplay /> },
          { path: '/premium-pages', element: <PremiumPages /> },
          { path: '/creator-mode', element: <CreatorMode /> },
          { path: '/ai-avatar-generator', element: <AIAvatarGenerator /> },
          { path: '/business-page', element: <BusinessPageFeatures /> },
          { path: '/onboarding', element: <OnboardingPage /> },

          // Consolidated Route Aliases & Redirects to Prevent 404s
          { path: '/communities/discover', element: redirectTo('/communities') },
          { path: '/communities/create', element: redirectTo('/creategroup') },
          { path: '/terminal', element: redirectTo('/developer') },
          { path: '/security-setup', element: redirectTo('/securitysetup') },
          { path: '/careers', element: redirectTo('/about') },
          { path: '/brand', element: redirectTo('/about') },
          { path: '/blog', element: redirectTo('/news') },
          { path: '/diversity', element: redirectTo('/about') },
          { path: '/accessibility', element: redirectTo('/settings') },
          { path: '/features', element: redirectTo('/discover') },
          { path: '/integrations', element: redirectTo('/developer') },
          { path: '/status', element: redirectTo('/monitoringdashboard') },
          { path: '/adchoices', element: redirectTo('/privacy') },
          { path: '/language', element: redirectTo('/settings') },
          { path: '/country', element: redirectTo('/settings') },
          { path: '/network/suggestions', element: redirectTo('/network') },
          { path: '/splash', element: redirectTo('/') },
          { path: '/feedback', element: redirectTo('/contact-support') },
          { path: '/contact-us', element: redirectTo('/contact-support') },
          { path: '/feed', element: redirectTo('/discovery') },
          { path: '/auth', element: redirectTo('/login') },
          { path: '/auth/signup', element: redirectTo('/register') },
          { path: '/member/landing', element: redirectTo('/memberlanding') },
          { path: '/member/subscriptions', element: redirectTo('/subscriptions') },
          { path: '/creator', element: redirectTo('/creatordashboard') },
          { path: '/logout', element: redirectTo('/login') },
          { path: '/privacy/data-subject-request', element: redirectTo('/privacy') },
          { path: '/financials/subscriptions', element: redirectTo('/subscriptions') },
          { path: '/settings/verification', element: redirectTo('/verification') },
          { path: '/user-policy', element: redirectTo('/terms') },
          { path: '/ai-policy', element: redirectTo('/terms') },
          { path: '/disclaimer', element: redirectTo('/terms') },
          { path: '/advertising', element: <AdvertisingPage /> },
          { path: '/ai-assistant', element: redirectTo('/camus') },
          { path: '/ads-manager', element: redirectTo('/canaryads') },
          { path: '/dancia-tv', element: redirectTo('/dancia4tv') },
          { path: '/live-streaming', element: redirectTo('/livestreaming') },
          { path: '/canary-ad-maker', element: <CanaryAdMakerPage /> },
          { path: '/forum/new', element: redirectTo('/forum') },
          { path: '/orders', element: redirectTo('/marketplacetracking') },
          { path: '/hallmark/create', element: redirectTo('/hallmarks') },
          { path: '/hallmark/:id', element: redirectTo('/hallmarks') },
          { path: '/hallmark/manage/:id', element: redirectTo('/hallmarks') },
          { path: '/dashboard/moderation/hallmarks', element: redirectTo('/moderationqueue') },
          { path: '/unified-dashboard', element: redirectTo('/masterdashboard') },
          { path: '/camus/dashboard/courses', element: redirectTo('/camusdashboard') },
          { path: '/advanced-finger-war', element: redirectTo('/advancedfingerwar') },
          { path: '/camus/explore', element: redirectTo('/camus') },
          { path: '/calendar', element: redirectTo('/events') },
          { path: '/campaigns', element: redirectTo('/advertising') },
          { path: '/create-post', element: redirectTo('/createpost') },
          { path: '/resources', element: redirectTo('/mydownloads') },
          { path: '/success', element: redirectTo('/onboarding') },
          { path: '/community-guidelines', element: redirectTo('/communityguidelines') },
          { path: '/csae-policy', element: redirectTo('/csaepolicy') },
          { path: '/live-spaces', element: redirectTo('/livestreaming') },
          { path: '/fic/wallet', element: redirectTo('/wallet') },
          { path: '/financials/vault', element: redirectTo('/vault') },
          { path: '/financials/giftcards', element: redirectTo('/gems') },
          { path: '/financials/wallet', element: redirectTo('/wallet') },
          { path: '/dashboard/campaigns', element: redirectTo('/advertising') },
          { path: '/dashboard/hub', element: redirectTo('/creatordashboard') },
          { path: '/api-docs', element: redirectTo('/developer') },
          { path: '/api/developer/examples/curl', element: redirectTo('/developer') },
          { path: '/dashboard/payouts', element: redirectTo('/wallet') },
          { path: '/billing', element: redirectTo('/subscriptions') },
          { path: '/dashboard/policies', element: redirectTo('/legalcompliance') },
          { path: '/dashboard/site/menus', element: redirectTo('/sitepagesmenus') },
          { path: '/dashboard/analytics', element: redirectTo('/advancedanalytics') },
          { path: '/dashboard/moderation', element: redirectTo('/moderationqueue') },
          { path: '/dashboard/members', element: redirectTo('/admin/user-management') },
          { path: '/dashboard/content', element: redirectTo('/publishingtools') },
          { path: '/dashboard/commerce', element: redirectTo('/storefronttracking') },
          { path: '/dashboard/community', element: redirectTo('/communitymanagement') },
          { path: '/dashboard/settings', element: redirectTo('/settings') },
          { path: '/dashboard/monetization', element: redirectTo('/monetizationdashboard') },
          { path: '/dashboard/live-streaming', element: redirectTo('/livestreaming') },
          { path: '/dashboard/membership', element: redirectTo('/subscriptions') },
          { path: '/mint-inspectorate', element: redirectTo('/masterdashboard?tab=financials&subtab=inspectorate') },
          { path: '/inspectorate', element: redirectTo('/masterdashboard?tab=financials&subtab=inspectorate') },
          { path: '/fic-minting', element: redirectTo('/masterdashboard?tab=financials&subtab=fic-engine') },
          { path: '/treasury', element: redirectTo('/masterdashboard?tab=financials&subtab=treasury') },
          { path: '/cic-ledger', element: redirectTo('/masterdashboard?tab=financials&subtab=cic-ledger') },
          { path: '/fic-purchase', element: redirectTo('/masterdashboard?tab=financials&subtab=member-purchase') },
          { path: '/fiat-rules', element: redirectTo('/masterdashboard?tab=financials&subtab=fiat-rules') },
          { path: '/members-console', element: <UserMembersConsolePage /> },
          { path: '/user-members-console', element: <UserMembersConsolePage /> },
          { path: '/members-management', element: <UserMembersConsolePage /> },
        ],
      },

      // ---------------------------------------------------------------------------
      // AUTHENTICATED CORE - General Member Tier
      // ---------------------------------------------------------------------------
      {
        element: <RequireAuth />,
        children: [
          {
            element: <ShellLayout />,
            children: [
              { path: '/dashboard', element: <DashboardPage /> },
              { path: '/dashboard/home', element: redirectTo('/dashboardhome') },
              { path: '/dashboardhome', element: <DashboardHomePage /> },
              { path: '/onboarding', element: <OnboardingPage /> },
              { path: '/member-landing', element: redirectTo('/memberlanding') },
              { path: '/memberlanding', element: <MemberLandingPage /> },
              { path: '/settings', element: <SettingsPage /> },
              { path: '/settings-hub', element: <SettingsHubPage /> },
              { path: '/system-settings', element: redirectTo('/settings-hub') },
              { path: '/settings/roles-permissions', element: <RolesPermissionsPage /> },
              { path: '/dashboard/roles-permissions', element: redirectTo('/settings/roles-permissions') },
              { path: '/settings/roles-permissions/manage-roles', element: <ManageRolesPage /> },
              { path: '/contacts/site-members/site-member-access', element: <SiteMemberAccessPage /> },
              { path: '/settings/member-access', element: redirectTo('/contacts/site-members/site-member-access') },
              { path: '/settings/badges', element: <BadgesManagementPage /> },
              { path: '/badges', element: redirectTo('/settings/badges') },
              { path: '/messages', element: <MessagesPage /> },
              { path: '/notifications', element: <NotificationsPage /> },
              { path: '/email-service', element: <EmailServiceConsolePage /> },
              { path: '/dashboard/email', element: <EmailServiceConsolePage /> },
              { path: '/admin/email', element: <EmailServiceConsolePage /> },
              { path: '/settings/email-service', element: redirectTo('/email-service') },
              { path: '/messages/private', element: redirectTo('/privatemessages') },
              { path: '/privatemessages', element: <PrivateMessagesPage /> },
              { path: '/network', element: <MembersPage /> },
              { path: '/subscriptions', element: <SubscriptionsPage /> },
              { path: '/portfolio', element: <PortfolioPage /> },
              { path: '/account/delete', element: redirectTo('/accountdeletion') },
              { path: '/accountdeletion', element: <AccountDeletionPage /> },
              { path: '/topics', element: <TopicsPage /> },
              { path: '/communityenhanced', element: <CommunityPageEnhanced /> },
              { path: '/communitys', element: <CommunityPages /> },
              { path: '/groups', element: <GroupsPage /> },
              { path: '/group/:id', element: <GroupDetailPage /> },
              { path: '/groupdetail', element: <GroupDetailPage /> },
              { path: '/group/create', element: redirectTo('/creategroup') },
              { path: '/creategroup', element: <CreateGroupPage /> },
              { path: '/conference', element: <ConferencePage /> },
              { path: '/live', element: redirectTo('/livestreaming') },
              { path: '/livestreaming', element: <LiveStreamingPage /> },
              { path: '/advancedvoice', element: <AdvancedVoicePage /> },
              { path: '/beatwaveng', element: <BeatwaveNGPage /> },
              { path: '/aiplaylist', element: <AiPlaylistPage /> },
              { path: '/advancedfingerwar', element: <AdvancedFingerWarPage /> },
              { path: '/gameon', element: <GameOnPage /> },
              { path: '/hallmarks', element: <HallmarksPage /> },
              { path: '/gems', element: <GemsPage /> },
              { path: '/advancedgifting', element: <AdvancedGiftingPage /> },
              { path: '/coupons', element: <CouponsPage /> },
              { path: '/marketplace/tracking', element: redirectTo('/marketplacetracking') },
              { path: '/marketplacetracking', element: <MarketplaceTrackingPage /> },
              { path: '/storefront/tracking', element: redirectTo('/storefronttracking') },
              { path: '/storefronttracking', element: <StorefrontTrackingPage /> },
              { path: '/downloads', element: redirectTo('/mydownloads') },
              { path: '/mydownloads', element: <MyDownloadsPage /> },
              { path: '/wallet', element: <WalletPage /> },
              { path: '/mywallet', element: <Navigate to="/wallet" replace /> }, // Alias canonicalization
              { path: '/my-wallet', element: redirectTo('/wallet') },
              { path: '/wallet/fund', element: redirectTo('/walletfunding') },
              { path: '/walletandpay', element: <WalletAndPayPage /> },
              { path: '/wallet/pay', element: redirectTo('/walletandpay') },
              { path: '/walletfunding', element: <WalletFundingPage /> },
              { path: '/paylinks', element: <PaylinksPage /> },
              { path: '/earnings', element: redirectTo('/memberearning') },
              { path: '/memberearning', element: <MemberEarningPage /> },
              { path: '/loansqr', element: <LoanSqrPage /> },
              { path: '/loansq', element: <LoanSqrPage /> },
              { path: '/Loansqr', element: <LoanSqrPage /> },
              { path: '/lendsq', element: <LoanSqrPage /> },
              { path: '/my-learning', element: redirectTo('/mylearning') },
              { path: '/mylearning', element: <MyLearningPage /> },
              { path: '/nysc', element: <NyscPage /> },
              { path: '/mii', element: <MiiPage /> },
              { path: '/my-pages', element: redirectTo('/mys') },
              { path: '/mys', element: <MyPages /> },
              { path: '/governance', element: <GovernancePage /> },
              { path: '/published', element: <PublishedPage /> },
              { path: '/communitymanagement', element: <CommunityManagementPage /> },
              // Master Dashboard & Framework Consoles Direct Access
              { path: '/member-pages', element: <MyPages /> },
              { path: '/contacts', element: <ContactsPage /> },
              { path: '/members', element: <MembersPage /> },
              { path: '/profiles', element: redirectTo('/profile') },
              { path: '/media-intelligence', element: <MediaIntelligencePage /> },
              { path: '/videobox', element: redirectTo('/videos') },
              { path: '/ecommerce', element: <EcommercePage /> },
              { path: '/site-editor', element: redirectTo('/editor') },
              { path: '/animations', element: <StercsThemeDesignerPage /> },
              { path: '/image-tools', element: <AdvancedMediaEditorPage /> },
              { path: '/templates', element: <BlogTemplatesPage /> },
              { path: '/forms', element: redirectTo('/connectors') },
              { path: '/collaboration', element: <ConferencePage /> },
              { path: '/seo', element: <DeveloperPortalPage /> },
              { path: '/ai-tools', element: redirectTo('/guardian-ai') },
              { path: '/monitoring', element: <MonitoringDashboardPage /> },
              { path: '/security', element: <SecurityPage /> },
              { path: '/moderation', element: <ModerationDashboardPage /> },
              { path: '/finance', element: <FinanceDashboardPage /> },
              { path: '/connectors', element: <DatabaseIntegrationDashboard /> },
              { path: '/ai-governance', element: <AiGovernancePage /> },
              { path: '/admin/settings', element: redirectTo('/settings-hub') },
              { path: '/governance/audit', element: <AuditLogAdminPage /> },
              { path: '/admin/sessions', element: <SessionManagementPage /> },
              { path: '/dashboard/ai-governance', element: redirectTo('/ai-governance') },
              { path: '/dashboard/guardian', element: redirectTo('/guardian-ai') },
              { path: '/dashboard/compliance', element: <CompliancePage /> },
              { path: '/profile/enhance', element: redirectTo('/profile-enhancement') },
              { path: '/dashboard/video-translation', element: redirectTo('/videotranslation') },
              { path: '/admin/data-import', element: redirectTo('/dataimport') },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------------------
      // CREATOR & WORKSPACE TIER (S3 Workspace Scaffold)
      // ---------------------------------------------------------------------------
      {
        element: <RequireAuth />,
        children: [
          {
            element: (
              <RequireRole
                allowedRoles={[
                  UserRole.CREATOR,
                  UserRole.MERCHANT,
                  UserRole.PLATFORM_ADMIN,
                  UserRole.SYSTEM_ENGINEER,
                ]}
              />
            ),
            children: [
              {
                element: <WorkspaceLayout />,
                children: [
                  { path: '/post/create', element: redirectTo('/createpost') },
                  { path: '/createpost', element: <CreatePostPage /> },
                  { path: '/post/edit/:id', element: <EditPostPage /> },
                  { path: '/posts/edit/:id', element: <EditPostPage /> },
                  { path: '/edit-post/:id', element: <EditPostPage /> },
                  { path: '/edit-post', element: redirectTo('/editpost') },
                  { path: '/editpost', element: <EditPostPage /> },
                  { path: '/editor', element: <EditorPage /> },
                  { path: '/editor/enhanced', element: redirectTo('/enhancededitor') },
                  { path: '/enhancededitor', element: <EnhancedEditorPage /> },
                  { path: '/media-editor', element: redirectTo('/advancedmediaeditor') },
                  { path: '/advancedmediaeditor', element: <AdvancedMediaEditorPage /> },
                  { path: '/stercs/editor', element: redirectTo('/stercseditor') },
                  { path: '/stercseditor', element: <StercsEditorPage /> },
                  { path: '/stercs/media-library', element: redirectTo('/stercsmedialibrary') },
                  { path: '/stercsmedialibrary', element: <StercsMediaLibraryPage /> },
                  { path: '/stercs/theme-designer', element: redirectTo('/stercsthemedesigner') },
                  { path: '/stercsthemedesigner', element: <StercsThemeDesignerPage /> },
                  { path: '/stercs/video-editor', element: redirectTo('/stercsvideoeditor') },
                  { path: '/stercsvideoeditor', element: <StercsVideoEditorPage /> },
                  { path: '/publishing/tools', element: redirectTo('/publishingtools') },
                  { path: '/publishingtools', element: <PublishingToolsPage /> },
                  { path: '/publishing/settings', element: redirectTo('/postpublishingsettings') },
                  { path: '/postpublishingsettings', element: <PostPublishingSettingsPage /> },
                  { path: '/my-storefront', element: redirectTo('/mystorefront') },
                  { path: '/mystorefront', element: <MyStorefrontPage /> },
                  { path: '/lms', element: <LmsPage /> },
                  { path: '/videotranslation', element: <VideoTranslationDashboard /> }, // Resolved missing route
                ],
              },
              {
                element: <ShellLayout />,
                children: [
                  { path: '/creator/dashboard', element: redirectTo('/creatordashboard') },
                  { path: '/creatordashboard', element: <CreatorDashboardPage /> },
                  { path: '/creator/influence', element: redirectTo('/creatorinfluence') },
                  { path: '/creatorinfluence', element: <CreatorInfluencePage /> },
                  { path: '/creators-center', element: <CreatorsCenterPage /> },
                  { path: '/monetization/dashboard', element: redirectTo('/monetizationdashboard') },
                  { path: '/monetizationdashboard', element: <MonetizationDashboardPage /> },
                  { path: '/monetization', element: <MonetizationPage /> },
                  { path: '/financials', element: <FinancialsPage /> },
                  { path: '/ficvault', element: <FICVaultPage /> },
                  { path: '/fic-vault', element: <FICVaultPage /> },
                  { path: '/fic/vault', element: <FICVaultPage /> },
                  { path: '/insights', element: <InsightsPage /> },
                  { path: '/seads', element: <SeadsPage /> },
                  { path: '/canary', element: <CanaryPage /> },
                  { path: '/canary/ads', element: redirectTo('/canaryads') },
                  { path: '/canaryads', element: <CanaryAdsPage /> },
                  { path: '/canary/ad-maker', element: <CanaryAdMakerPage /> },
                  { path: '/admin/canary', element: <CanaryAdsManagementPage /> },
                  { path: '/admin/dpo', element: <DPODashboardPage /> },
                  { path: '/dpo', element: <DPODashboardPage /> },
                  { path: '/publicitee', element: <PubliciteePage /> },
                  { path: '/flamingo', element: <FlamingoPage /> },
                  { path: '/flamingo/tracking', element: redirectTo('/flamingotracking') },
                  { path: '/flamingotracking', element: <FlamingoTrackingPage /> },
                  { path: '/ownit', element: <OwnitPage /> },
                  { path: '/ownit/tracking', element: redirectTo('/ownittracking') },
                  { path: '/ownittracking', element: <OwnitTrackingPage /> },
                  { path: '/business/offices', element: redirectTo('/businessoffices') },
                  { path: '/businessoffices', element: <BusinessOfficesPage /> },
                  { path: '/admin/franchise', element: redirectTo('/franchisemanagement') },
                  { path: '/franchisemanagement', element: <FranchiseManagementPage /> },
                  { path: '/organizethese', element: <OrganizeThesePage /> },
                  { path: '/permanence', element: <PermanencePage /> },
                ],
              },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------------------
      // ADMINISTRATIVE & INFRASTRUCTURE TIER (S4 Admin Scaffold)
      // ---------------------------------------------------------------------------
      {
        element: <RequireAuth enforceMfa={true} />,
        children: [
          {
            element: (
              <RequireRole
                allowedRoles={[
                  UserRole.MODERATOR,
                  UserRole.PLATFORM_ADMIN,
                  UserRole.SYSTEM_ENGINEER,
                ]}
              />
            ),
            children: [
              {
                element: <AdminLayout />,
                children: [
                  { path: '/admin/dashboard', element: redirectTo('/admindashboard') },
                  { path: '/admindashboard', element: <AdminDashboardPage /> },
                  { path: '/admin/users', element: <AdminUserManagementPage /> },
                  { path: '/admin/members-console', element: <UserMembersConsolePage /> },
                  { path: '/admin/control', element: redirectTo('/admincontroldashboard') },
                  { path: '/admincontroldashboard', element: <AdminControlDashboard /> },
                  { path: '/dashboard/unified', element: redirectTo('/unifieddashboard') },
                  { path: '/unifieddashboard', element: <UnifiedDashboardPage /> },
                  { path: '/analytics', element: redirectTo('/advancedanalytics') },
                  { path: '/advancedanalytics', element: <AdvancedAnalyticsPage /> },
                  { path: '/admin/audit-logs', element: redirectTo('/auditlogadmin') },
                  { path: '/auditlogadmin', element: <AuditLogAdminPage /> },
                  { path: '/admin/moderation', element: redirectTo('/moderationqueue') },
                  { path: '/moderationqueue', element: <ModerationQueuePage /> },
                  { path: '/contentmoderator', element: <ContentModeratorDashboardPage /> },
                  { path: '/dashboard/moderator', element: <ContentModeratorDashboardPage /> },
                  { path: '/dashboard/moderation/*', element: redirectTo('/moderationqueue') },
                  { path: '/dashboard/security', element: redirectTo('/security') },
                  { path: '/dashboard/security/*', element: redirectTo('/security') },
                  { path: '/admin/reports', element: redirectTo('/userreports') },
                  { path: '/userreports', element: <UserReportsPage /> },
                  { path: '/ugc/dashboard', element: redirectTo('/ugcdashboard') },
                  { path: '/ugcdashboard', element: <UGCDashboardPage /> },
                  { path: '/admin/rbac', element: redirectTo('/rbacmanagement') },
                  { path: '/rbacmanagement', element: <RbacManagementPage /> },
                  { path: '/admin/governance', element: redirectTo('/governance') },
                  { path: '/database-integration-dashboard', element: <DatabaseIntegrationDashboard /> },
                  { path: '/database-integration', element: redirectTo('/database-integration-dashboard') },
                  { path: '/database-dashboard', element: redirectTo('/database-integration-dashboard') },
                  { path: '/databaseintegrationdashboard', element: <DatabaseIntegrationDashboard /> },
                  { path: '/database-report', element: redirectTo('/databaseintegrationreport') },
                  { path: '/databaseintegrationreport', element: <DatabaseIntegrationReportPage /> },
                  { path: '/database-summary', element: redirectTo('/databaseintegrationsummary') },
                  { path: '/databaseintegrationsummary', element: <DatabaseIntegrationSummary /> },
                  { path: '/data-import', element: redirectTo('/dataimport') },
                  { path: '/dataimport', element: <DataImportPage /> },
                  { path: '/csv-import', element: redirectTo('/csvimport') },
                  { path: '/csvimport', element: <CsvImportPage /> },
                  { path: '/admin/cache', element: redirectTo('/cachemanagement') },
                  { path: '/cachemanagement', element: <CacheManagementPage /> },
                  { path: '/cache-demo', element: redirectTo('/cachedemo') },
                  { path: '/cachedemo', element: <CacheDemoPage /> },
                  { path: '/admin/monitoring', element: redirectTo('/monitoringdashboard') },
                  { path: '/monitoringdashboard', element: <MonitoringDashboardPage /> },
                  { path: '/admin/metrics', element: redirectTo('/prometheusmetrics') },
                  { path: '/prometheusmetrics', element: <PrometheusMetricsPage /> },
                  { path: '/admin/grafana', element: redirectTo('/grafanaembed') },
                  { path: '/grafanaembed', element: <GrafanaEmbedPage /> },
                  { path: '/admin/rate-limits', element: redirectTo('/ratelimitconfig') },
                  { path: '/ratelimitconfig', element: <RateLimitConfigPage /> },
                  { path: '/protocol-demo', element: redirectTo('/protocoldemo') },
                  { path: '/protocoldemo', element: <ProtocolDemoPage /> },
                  { path: '/camus', element: <CamusPage /> },
                  { path: '/camus/dashboard', element: redirectTo('/camusdashboard') },
                  { path: '/camusdashboard', element: <CamusDashboardPage /> },
                ],
              },
            ],
          },
        ],
      },

      // ---------------------------------------------------------------------------
      // 404 / CATCH-ALL ROUTE
      // ---------------------------------------------------------------------------
      {
        path: '*',
        element: (
          <div className="flex h-screen w-screen flex-col items-center justify-center bg-zinc-950 text-center font-mono">
            <h1 className="text-6xl font-extrabold text-emerald-400">404</h1>
            <p className="mt-2 text-zinc-400">The requested platform screen does not exist.</p>
            <a
              href="/"
              className="mt-6 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-300 rounded hover:bg-emerald-500/20"
            >
          Return Home
            </a>
          </div>
        ),
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
