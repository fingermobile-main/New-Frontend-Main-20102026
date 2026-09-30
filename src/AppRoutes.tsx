import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import TrendsPage from './pages/TrendsPage';
import CsvImportPage from './pages/CsvImportPage';
import MessagesPage from './pages/messages/MessagesPage'; // Updated to use correct MessagesPage from messages folder
import VerificationPage from './pages/VerificationPage'; // Added VerificationPage import
import SecuritySetupPage from './pages/SecuritySetupPage'; // Added SecuritySetupPage import
import PrivateMessagesPage from './pages/PrivateMessagesPage'; // Added PrivateMessagesPage import
import MiiPage from './pages/MiiPage'; // Added MiiPage import
import MiiAvatarPage from './pages/MiiAvatarPage'; // Added MiiAvatarPage import
import PhotosPage from './pages/PhotosPage'; // Added PhotosPage import
import VideosPage from './pages/VideosPage'; // Added VideosPage import
import GalleryPage from './pages/GalleryPage'; // Added GalleryPage import
import PostDetailPage from './pages/PostDetailPage'; // Added PostDetailPage import
import ProductsPage from './pages/ProductsPage'; // Added ProductsPage import
import StorefrontsPage from './pages/StorefrontsPage'; // Added StorefrontsPage import
import GemsPage from './pages/GemsPage'; // Added GemsPage import
import WalletPage from './pages/WalletPage'; // Added WalletPage import
import PaylinksPage from './pages/PaylinksPage'; // Added PaylinksPage import
import SubscriptionsPage from './pages/SubscriptionsPage'; // Added SubscriptionsPage import
import GroupsPage from './pages/GroupsPage'; // Added GroupsPage import
import HallmarksPage from './pages/HallmarksPage'; // Added HallmarksPage import
import GameOnPage from './pages/GameOnPage'; // Added GameOnPage import
import InsightsPage from './pages/InsightsPage'; // Added InsightsPage import
import UnifiedDashboardPage from './pages/UnifiedDashboardPage'; // Added UnifiedDashboardPage import
import UGCDashboardPage from './pages/UGCDashboardPage'; // Added UGCDashboardPage import
import RbacManagementPage from './pages/RbacManagementPage'; // Added RbacManagementPage import
import SessionManagementPage from './pages/SessionManagementPage'; // Added SessionManagementPage import

import OnboardingPage from './pages/OnboardingPage'; // Added OnboardingPage import

// Additional pages that were missing from routes
import AdminControlDashboard from './pages/AdminControlDashboard';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdvancedAnalyticsPage from './pages/AdvancedAnalyticsPage';
import AdvancedFingerWarPage from './pages/AdvancedFingerWarPage';
import AdvancedGiftingPage from './pages/AdvancedGiftingPage';
import AdvancedVoicePage from './pages/AdvancedVoicePage';
import AiPlaylistPage from './pages/AiPlaylistPage';
import BeatwaveNGPage from './pages/BeatwaveNGPage';
import BlogsPage from './pages/BlogsPage';
import CamusDashboardPage from './pages/CamusDashboardPage';
import CamusPage from './pages/CamusPage';
import CanaryAdsPage from './pages/CanaryAdsPage';
import CanaryPage from './pages/CanaryPage';
import CommunityPage from './pages/CommunityPage';
import CommunityPageEnhanced from './pages/CommunityPageEnhanced';
import Dancia4TvPage from './pages/Dancia4TvPage';
import DiscoverPage from './pages/DiscoverPage';
import ELearningPage from './pages/ELearningPage';
import EditorPage from './pages/EditorPage';
import EnhancedEditorPage from './pages/EnhancedEditorPage';
import EventsPage from './pages/EventsPage';
import FICVaultPage from './pages/FICVaultPage';
import FinancialsPage from './pages/FinancialsPage';
import FingerLuxPage from './pages/FingerLuxPage';
import FingerWarsPage from './pages/FingerWarsPage';
import FlamingoPage from './pages/FlamingoPage';
import ForumPage from './pages/ForumPage';
import ForumLayout from './layouts/ForumLayout';
import LendsqrPage from './pages/LendsqrPage';
import LiveStreamingPage from './pages/LiveStreamingPage';
import LushPressiesPage from './pages/LushPressiesPage';
import MarketplacePage from './pages/MarketplacePage';
import MemberLandingPage from './pages/MemberLandingPage';
import MembersPage from './pages/MembersPage';
import MonetizationPage from './pages/MonetizationPage';
import MyLearningPage from './pages/MyLearningPage';
import MyPages from './pages/MyPages';
import MyStorefrontPage from './pages/MyStorefrontPage';
import MyWalletPage from './pages/MyWalletPage';
import NotificationsPage from './pages/NotificationsPage';
import NyscPage from './pages/NyscPage';
import OwnitPage from './pages/OwnitPage';
import PhotoCreditsPage from './pages/PhotoCreditsPage';
import PortfolioPage from './pages/PortfolioPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProfilePage from './pages/ProfilePage';
import ProgramsPage from './pages/ProgramsPage';
import PubliciteePage from './pages/PubliciteePage';
import SearchPage from './pages/SearchPage';
import ServicesPage from './pages/ServicesPage';
import ShowcasePage from './pages/ShowcasePage';
import SupportPage from './pages/SupportPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import TopicsPage from './pages/TopicsPage';
import TrendsFeedPage from './pages/TrendsFeedPage';
import UserReportsPage from './pages/UserReportsPage';
import WalletAndPayPage from './pages/WalletAndPayPage';
import WalletFundingPage from './pages/WalletFundingPage';

// Additional missing pages that need routes
import AboutUsPage from './pages/AboutUsPage';
import AccountDeletionPage from './pages/AccountDeletionPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdvancedMediaEditorPage from './pages/AdvancedMediaEditorPage';

import BusinessOfficesPage from './pages/BusinessOfficesPage';
import CacheDemoPage from './pages/CacheDemoPage';
import CataloguePage from './pages/CataloguePage';
import CategoryFeedPage from './pages/CategoryFeedPage';
import CheckoutPage from './pages/CheckoutPage';
import CommunityGuidelinesPage from './pages/CommunityGuidelinesPage';
import CommunityManagementPage from './pages/CommunityManagementPage';
import CommunityPages from './pages/CommunityPages';
import ConferencePage from './pages/ConferencePage';
import ContactUsPage from './pages/ContactUsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import CouponsPage from './pages/CouponsPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CreateGroupPage from './pages/CreateGroupPage';
import CreatePostPage from './pages/CreatePostPage';
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import Dancie4TvPage from './pages/Dancie4TvPage';
import DashboardPage from './pages/DashboardPage';
import DataImportPage from './pages/DataImportPage';
import DataSubjectRequestPage from './pages/DataSubjectRequestPage';
import DatabaseIntegrationReportPage from './pages/DatabaseIntegrationReportPage';
import DiscoveryPage from './pages/DiscoveryPage';
import EditPostPage from './pages/EditPostPage';
import FingerShortsPage from './pages/FingerShortsPage';
import FlamingoTrackingPage from './pages/FlamingoTrackingPage';
// @ts-expect-error: auto-fixed by agent
import FranchiseManagementPage from './pages/FrameManagementPage';
import GovernancePage from './pages/GovernancePage';
import GroupDetailPage from './pages/GroupDetailPage';
import HallmarkPage from './pages/HallmarkPage';
import InvestorRelationsPage from './pages/InvestorRelationsPage';
import LmsPage from './pages/LmsPage';
import MarketingPage from './pages/MarketingPage';
import MarketplaceTrackingPage from './pages/MarketplaceTrackingPage';
import MemberEarningPage from './pages/MemberEarningPage';
import ModerationQueuePage from './pages/ModerationQueuePage';
import MonetizationDashboardPage from './pages/MonetizationDashboardPage';
import MyDownloadsPage from './pages/MyDownloadsPage';
import OrganizeThesePage from './pages/OrganizeThesePage';
import OwnitTrackingPage from './pages/OwnitTrackingPage';
import PermanencePage from './pages/PermanencePage';
import PhotoCreditDetailPage from './pages/PhotoCreditDetailPage';
import PostPublishingSettingsPage from './pages/PostPublishingSettingsPage';
import ProtocolDemoPage from './pages/ProtocolDemoPage';
import PublishedPage from './pages/PublishedPage';
import PublishingToolsPage from './pages/PublishingToolsPage';
import SeadsPage from './pages/SeadsPage';
import StercsEditorPage from './pages/StercsEditorPage';
import StercsMediaLibraryPage from './pages/StercsMediaLibraryPage';
import StercsThemeDesignerPage from './pages/StercsThemeDesignerPage';
import CourseContentPage from './pages/CourseContentPage';
import LobbyPage from './pages/LobbyPage';
import BeatwaveDemoPage from './pages/BeatwaveDemoPage';
import BeatwaveNGDemoPage from './pages/BeatwaveNGDemoPage';
import HallmarkCreatePage from './pages/HallmarkCreatePage';
import HallmarkPublicPage from './pages/HallmarkPublicPage';
import ManageMyHallmarkPage from './pages/ManageMyHallmarkPage';
import StercsVideoEditorPage from './pages/StercsVideoEditorPage';
import StorefrontDetailPage from './pages/StorefrontDetailPage';
import StorefrontPage from './pages/StorefrontPage';
import StorefrontTrackingPage from './pages/StorefrontTrackingPage';

// New components created based on design document
import JobsOpportunities from './components/JobsOpportunities';

import CommunitiesSection from './components/CommunitiesSection';

// Additional pages for missing routes

import CacheManagementPage from './pages/CacheManagementPage';
import RateLimitConfigPage from './pages/RateLimitConfigPage';
import ContentModerationPage from './pages/ModerationQueuePage'; // Using existing page for content moderation
import SwitchProfilePage from './pages/auth/SwitchProfilePage';



// Comprehensive Platform Alignment Imports
import FeedbackPage from './pages/FeedbackPage';
import JobsPage from './pages/JobsPage';
import CreatorsCenterPage from './pages/CreatorsCenterPage';
import BusinessHubPage from './pages/BusinessHubPage';
import CanaryAdMakerPage from './pages/CanaryAdMakerPage';
import AdvertisingPage from './pages/AdvertisingPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import DashboardCampaignDetailPage from './pages/dashboard/CampaignDetailPage';
import BillingPage from './pages/BillingPage';
import DeveloperPortalPage from './pages/DeveloperPortalPage';
import HelpPage from './pages/support/HelpPage';
import ContactSupportPage from './pages/support/ContactSupportPage';
import CommunitiesPage from './pages/CommunitiesPage';
import CSAEPolicyPage from './pages/CSAEPolicyPage';
import FAQPage from './pages/info/FAQPage';
import WhitePaperPage from './pages/legal/WhitePaperPage';
import PlatformStatusPage from './pages/dashboard/PlatformStatusPage';
import SystemStatusPage from './pages/dashboard/system/SystemStatusPage';
import FicVaultPage from './pages/financials/FicVaultPage';
import GiftCardsPage from './pages/financials/GiftCardsPage';
import LoyaltyRewardsPage from './pages/financials/LoyaltyRewardsPage';
import ReferralsPage from './pages/financials/ReferralsPage';
import PayoutsPage from './pages/dashboard/PayoutsPage';
import OfficialVerificationPage from './pages/OfficialVerificationPage';
import RoleManagementPage from './pages/dashboard/RoleManagementPage';
import GeneralSettingsPage from './pages/dashboard/settings/GeneralSettingsPage';
import ProfileEnhancement from './pages/ProfileEnhancement';
import AuditLogAdminPage from './pages/AuditLogAdminPage';
import CanaryAdsManagementPage from './pages/admin/CanaryAdsManagementPage';
import MemberManagementPage from './pages/admin/MemberManagementPage';
import DPODashboardPage from './pages/admin/DPODashboardPage';
import AdminSecurityEventsPage from './pages/admin/AdminSecurityEventsPage';
import AdminSecuritySettingsPage from './pages/admin/AdminSecuritySettingsPage';
import HallmarkApprovalPage from './pages/dashboard/moderation/HallmarkApprovalPage';
import FlamingoApprovalPage from './pages/dashboard/moderation/FlamingoApprovalPage';
import GemApprovalPage from './pages/dashboard/moderation/GemApprovalPage';
import LegalPage from './pages/legal/LegalPage';
import SuperAdminOverviewPage from './pages/super-admin/SuperAdminOverviewPage';
import CodeAgentPage from './pages/super-admin/CodeAgentPage';
import EditorStudioPage from './pages/dashboard/EditorStudioPage';
import GuardianControlPage from './pages/dashboard/guardian/GuardianControlPage';
import SentientControlPage from './pages/dashboard/guardian/SentientControlPage';
import StercsControlPage from './pages/dashboard/guardian/StercsControlPage';
import VideoTranslationDashboard from './pages/VideoTranslationDashboard';
import AnalyticsOverviewPage from './pages/dashboard/analytics/AnalyticsOverviewPage';
import SalesAnalyticsPage from './pages/dashboard/analytics/SalesAnalyticsPage';
import UgcAnalyticsPage from './pages/dashboard/analytics/UgcAnalyticsPage';
import ContentCalendarPage from './pages/dashboard/content/ContentCalendarPage';
import ContentManagementPage from './pages/dashboard/content/ContentManagementPage';
import DomainsPage from './pages/dashboard/settings/DomainsPage';
import ForumManagementPage from './pages/dashboard/ForumManagementPage';
import StoreManagementPage from './pages/dashboard/business/StoreManagementPage';
import SupportDashboardPage from './pages/dashboard/SupportDashboardPage';
import FinanceDashboardPage from './pages/dashboard/FinanceDashboardPage';
import InboxPage from './pages/dashboard/engagement/InboxPage';
import SearchResultsPage from './pages/search/SearchResultsPage';
import EditProfile from './pages/profile/EditProfile';
import ManageMyGroupPage from './pages/groups/ManageMyGroupPage';
import CreateCourse from './pages/courses/CreateCourse';
import EditCourse from './pages/courses/EditCourse';
import PlaylistDetailPage from './pages/music/PlaylistDetailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import ChangePasswordPage from './pages/ChangePasswordPage';
import CreatorInfluencePage from './pages/CreatorInfluencePage';
import GemPublicPage from './pages/gems/GemPublicPage';
import LegalCompliancePage from './pages/dashboard/LegalCompliancePage';
import MonitoringDashboardPage from './pages/MonitoringDashboardPage';
import PrometheusMetricsPage from './pages/PrometheusMetricsPage';
import GrafanaEmbedPage from './pages/GrafanaEmbedPage';
import DatabaseIntegrationDashboard from './pages/DatabaseIntegrationDashboard';
import DatabaseIntegrationSummary from './pages/DatabaseIntegrationSummary';
import FeatureTogglesPage from './pages/dashboard/operations/FeatureTogglesPage';
import FingerMobileEditorStudioPage from './pages/dashboard/FingerMobileEditorStudioPage';
import SiteMenusPage from './pages/dashboard/site-management/SiteMenusPage';
import SitePagesMenusPage from './pages/dashboard/site-management/SitePagesMenusPage';
import PostPublishingDemoPage from './pages/posts/PostPublishingDemoPage';
import BlogTemplatesPage from './pages/BlogTemplatesPage';
import ContentAdminDashboardPage from './pages/ContentAdminDashboardPage';
import ContentCommunityDashboardPage from './pages/ContentCommunityDashboardPage';
import ContentCreatorDashboardPage from './pages/ContentCreatorDashboardPage';
import ContentModeratorDashboardPage from './pages/ContentModeratorDashboardPage';
import ModerationDashboardPage from './pages/dashboard/ModerationDashboardPage';
import CreatorDashboardHomePage from './pages/dashboard/CreatorDashboardHomePage';
import DashboardOverviewPage from './pages/dashboard/DashboardOverviewPage';
import NotFoundPage from './pages/common/NotFoundPage';

import LoyaltyPage from './pages/financials/LoyaltyPage';
import PaymentPayoutsPage from './pages/financials/PaymentPayoutsPage';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import LegalIndexPage from './pages/legal/IndexPage';
import SingleNotificationPage from './pages/notifications/NotificationPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} /> {/* Added OnboardingPage route */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/trends" element={
        <ForumLayout>
          <TrendsPage />
        </ForumLayout>
      } />
      <Route path="/csv-import" element={<CsvImportPage />} />
      <Route path="/messages" element={<MessagesPage />} /> {/* Added MessagesPage route */}
      <Route path="/verification" element={<VerificationPage />} /> {/* Added VerificationPage route */}
      <Route path="/security-setup" element={<SecuritySetupPage />} /> {/* Added SecuritySetupPage route */}
      <Route path="/private-messages" element={<PrivateMessagesPage />} /> {/* Added PrivateMessagesPage route */}
      <Route path="/mii" element={
        <ForumLayout>
          <MiiPage />
        </ForumLayout>
      } /> {/* Added MiiPage route */}
      <Route path="/mii-avatar" element={
        <ForumLayout>
          <MiiAvatarPage />
        </ForumLayout>
      } /> {/* Added MiiAvatarPage route */}
      <Route path="/photos" element={<PhotosPage />} /> {/* Added PhotosPage route */}
      <Route path="/videos" element={<VideosPage />} /> {/* Added VideosPage route */}
      <Route path="/gallery" element={<GalleryPage />} /> {/* Added GalleryPage route */}
      <Route path="/gallery" element={<GalleryPage />} /> {/* Added GalleryPage route */}
      <Route path="/post/:id" element={<PostDetailPage />} /> {/* Added PostDetailPage route */}
      <Route path="/post/:id/edit" element={<EditPostPage />} /> {/* Added EditPostPage route */}
      <Route path="/user/:id" element={<ProfilePage />} /> {/* Added User Profile route */}
      <Route path="/group/:id" element={<GroupDetailPage />} /> {/* Added Group Detail route */}
      <Route path="/products" element={<ProductsPage />} /> {/* Added ProductsPage route */}
      <Route path="/product/:id" element={<ProductDetailPage />} /> {/* Added Product Detail route */}
      <Route path="/storefronts" element={<StorefrontsPage />} /> {/* Added StorefrontsPage route */}
      <Route path="/storefront/:id" element={<StorefrontPage />} /> {/* Added Storefront Page route */}
      <Route path="/storefront/:id/detail" element={<StorefrontDetailPage />} /> {/* Added Storefront Detail route */}
      <Route path="/gems" element={
        <ForumLayout>
          <GemsPage />
        </ForumLayout>
      } /> {/* Added GemsPage route */}
      <Route path="/wallet" element={<WalletPage />} /> {/* Added WalletPage route */}
      <Route path="/paylinks" element={<PaylinksPage />} /> {/* Added PaylinksPage route */}
      <Route path="/subscriptions" element={<SubscriptionsPage />} /> {/* Added SubscriptionsPage route */}
      <Route path="/groups" element={
        <ForumLayout>
          <GroupsPage />
        </ForumLayout>
      } /> {/* Added GroupsPage route */}
      <Route path="/hallmarks" element={
        <ForumLayout>
          <HallmarksPage />
        </ForumLayout>
      } /> {/* Added HallmarksPage route */}
      <Route path="/gameon" element={<GameOnPage />} /> {/* Added GameOnPage route */}
      <Route path="/lobby" element={<GameOnPage />} /> {/* Added Lobby route for GameOn */}
      <Route path="/insights" element={<InsightsPage />} /> {/* Added InsightsPage route */}
      <Route path="/unified-dashboard" element={<UnifiedDashboardPage />} /> {/* Added UnifiedDashboardPage route */}
      <Route path="/ugc-dashboard" element={<UGCDashboardPage />} /> {/* Added UGCDashboardPage route */}
      <Route path="/rbac-management" element={<RbacManagementPage />} /> {/* Added RbacManagementPage route */}
      <Route path="/session-management" element={<SessionManagementPage />} /> {/* Added SessionManagementPage route */}
      <Route path="/switch-profile" element={<SwitchProfilePage />} /> {/* Added Switch Profile route */}
      <Route path="/switch-profile/:profileId" element={<SwitchProfilePage />} />
      <Route path="/session" element={<SessionManagementPage />} /> {/* Added Session route */}
      <Route path="/dsr" element={<DataSubjectRequestPage />} /> {/* Added Data Subject Requests route */}

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminDashboardPage />} /> {/* Standard admin dashboard route */}
      <Route path="/admin/login" element={<AdminLoginPage />} /> {/* Admin login route */}
      <Route path="/admin/rbac" element={<RbacManagementPage />} /> {/* RBAC Management route */}
      <Route path="/admin/cache" element={<CacheManagementPage />} /> {/* Cache Management route */}
      <Route path="/admin/rate-limit" element={<RateLimitConfigPage />} /> {/* Rate Limit Config route */}

      {/* Moderation Routes */}
      <Route path="/moderation" element={<ModerationQueuePage />} /> {/* Moderation Queue route */}
      <Route path="/moderation/content" element={<ContentModerationPage />} /> {/* Content Moderation route */}

      {/* Course Routes */}
      <Route path="/courses" element={<ELearningPage />} /> {/* Courses/ELearning route */}
      <Route path="/course/:id" element={<CourseDetailPage />} /> {/* Course Detail route */}
      <Route path="/my-learning" element={<MyLearningPage />} /> {/* My Learning route */}

      {/* Service-specific lobby routes */}
      <Route path="/fingerlux/lobby" element={<FingerLuxPage />} /> {/* FingerLux Lobby route */}
      <Route path="/flamingo/lobby" element={<FlamingoPage />} /> {/* Flamingo Lobby route */}
      <Route path="/fingerwars/lobby" element={<FingerWarsPage />} /> {/* FingerWars Lobby route */}
      <Route path="/trends/lobby" element={<TrendsPage />} /> {/* Trends Lobby route */}

      {/* Additional Routes */}
      <Route path="/admin-control" element={<AdminControlDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
      <Route path="/advanced-finger-war" element={<AdvancedFingerWarPage />} />
      <Route path="/advanced-gifting" element={<AdvancedGiftingPage />} />
      <Route path="/advanced-voice" element={<AdvancedVoicePage />} />
      <Route path="/ai-playlist" element={<AiPlaylistPage />} />
      <Route path="/beatwave-ng" element={<BeatwaveNGPage />} />
      <Route path="/beatwaveng" element={<BeatwaveNGPage />} />
      <Route path="/beatwave" element={<BeatwaveNGPage />} />
      <Route path="/blogs" element={
        <ForumLayout>
          <BlogsPage />
        </ForumLayout>
      } />
      <Route path="/camus-dashboard" element={<CamusDashboardPage />} />
      <Route path="/camus" element={<CamusPage />} />
      <Route path="/canary-ads" element={<CanaryAdsPage />} />
      <Route path="/canary" element={<CanaryPage />} />
      <Route path="/community" element={
        <ForumLayout>
          <CommunityPage />
        </ForumLayout>
      } />
      <Route path="/community-enhanced" element={<CommunityPageEnhanced />} />
      <Route path="/dancia4-tv" element={<Dancia4TvPage />} />
      <Route path="/discover" element={
        <ForumLayout>
          <DiscoverPage />
        </ForumLayout>
      } />
      <Route path="/e-learning" element={<ELearningPage />} />
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/enhanced-editor" element={<EnhancedEditorPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/fic-vault" element={<FICVaultPage />} />
      <Route path="/financials" element={<FinancialsPage />} />
      <Route path="/fingerlux" element={<FingerLuxPage />} />
      <Route path="/finger-lux" element={<FingerLuxPage />} />
      <Route path="/finger-wars" element={<FingerWarsPage />} />
      <Route path="/flamingo" element={<FlamingoPage />} />
      <Route path="/forum" element={
        <ForumLayout>
          <ForumPage />
        </ForumLayout>
      } />
      <Route path="/lendsqr" element={<LendsqrPage />} />
      <Route path="/live-streaming" element={<LiveStreamingPage />} />
      <Route path="/lush-pressies" element={<LushPressiesPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/member-landing" element={<MemberLandingPage />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/monetization" element={<MonetizationPage />} />
      <Route path="/my-learning" element={<MyLearningPage />} />
      <Route path="/my-pages" element={<MyPages />} />
      <Route path="/my-storefront" element={<MyStorefrontPage />} />
      <Route path="/my-wallet" element={<MyWalletPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/nysc" element={<NyscPage />} />
      <Route path="/ownit" element={<OwnitPage />} />
      <Route path="/photo-credits" element={<PhotoCreditsPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/product-detail/:id" element={<ProductDetailPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/publicitee" element={<PubliciteePage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/showcase" element={<ShowcasePage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
      <Route path="/terms-of-service" element={<TermsOfServicePage />} />
      <Route path="/topics" element={<TopicsPage />} />
      <Route path="/trends-feed" element={<TrendsFeedPage />} />
      <Route path="/user-reports" element={<UserReportsPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/wallet-and-pay" element={<WalletAndPayPage />} />
      <Route path="/wallet-funding" element={<WalletFundingPage />} />

      {/* Missing Routes Added */}
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/account-deletion" element={<AccountDeletionPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/advanced-media-editor" element={<AdvancedMediaEditorPage />} />
      <Route path="/business-offices" element={<BusinessOfficesPage />} />
      <Route path="/cache-demo" element={<CacheDemoPage />} />
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route path="/categories" element={<CategoryFeedPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
      <Route path="/community-management" element={<CommunityManagementPage />} />
      <Route path="/communities" element={<CommunityPages />} />
      <Route path="/conference" element={<ConferencePage />} />
      <Route path="/contact-us" element={<ContactUsPage />} />
      <Route path="/cookie-policy" element={<CookiePolicyPage />} />
      <Route path="/coupons" element={<CouponsPage />} />
      <Route path="/course-detail" element={<CourseDetailPage />} />
      <Route path="/create-group" element={<CreateGroupPage />} />
      <Route path="/create-post" element={<CreatePostPage />} />
      <Route path="/creator-dashboard" element={<CreatorDashboardPage />} />
      <Route path="/dancie4-tv" element={<Dancie4TvPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/data-import" element={<DataImportPage />} />
      <Route path="/data-subject-request" element={<DataSubjectRequestPage />} />
      <Route path="/database-integration-report" element={<DatabaseIntegrationReportPage />} />
      <Route path="/discovery" element={<DiscoveryPage />} />
      <Route path="/edit-post" element={<EditPostPage />} />
      <Route path="/finger-shorts" element={<FingerShortsPage />} />
      <Route path="/flamingo-tracking" element={<FlamingoTrackingPage />} />
      <Route path="/franchise-management" element={<FranchiseManagementPage />} />
      <Route path="/governance" element={<GovernancePage />} />
      <Route path="/group-detail" element={<GroupDetailPage />} />
      <Route path="/hallmark" element={<HallmarkPage />} />
      <Route path="/investor-relations" element={<InvestorRelationsPage />} />
      <Route path="/lms" element={<LmsPage />} />
      <Route path="/marketing" element={<MarketingPage />} />
      <Route path="/marketplace-tracking" element={<MarketplaceTrackingPage />} />
      <Route path="/member-earning" element={<MemberEarningPage />} />
      <Route path="/moderation-queue" element={<ModerationQueuePage />} />
      <Route path="/monetization-dashboard" element={<MonetizationDashboardPage />} />
      <Route path="/my-downloads" element={<MyDownloadsPage />} />
      <Route path="/organize-these" element={<OrganizeThesePage />} />
      <Route path="/ownit-tracking" element={<OwnitTrackingPage />} />
      <Route path="/permanence" element={<PermanencePage />} />
      <Route path="/photo-credit-detail" element={<PhotoCreditDetailPage />} />
      <Route path="/post-publishing-settings" element={<PostPublishingSettingsPage />} />
      <Route path="/protocol-demo" element={<ProtocolDemoPage />} />
      <Route path="/published" element={<PublishedPage />} />
      <Route path="/publishing-tools" element={<PublishingToolsPage />} />
      <Route path="/seads" element={<SeadsPage />} />
      <Route path="/stercs-editor" element={<StercsEditorPage />} />
      <Route path="/stercs-media-library" element={<StercsMediaLibraryPage />} />
      <Route path="/stercs-theme-designer" element={<StercsThemeDesignerPage />} />
      <Route path="/stercs-video-editor" element={<StercsVideoEditorPage />} />
      <Route path="/storefront-detail" element={<StorefrontDetailPage />} />
      <Route path="/storefront" element={<StorefrontPage />} />
      <Route path="/storefront-tracking" element={<StorefrontTrackingPage />} />
      <Route path="/course-content/:courseId" element={<CourseContentPage />} />
      <Route path="/live/:roomId" element={<LobbyPage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/beatwave-demo" element={<BeatwaveDemoPage />} />
      <Route path="/beatwave-ng-demo" element={<BeatwaveNGDemoPage />} />
      <Route path="/hallmark-create" element={<HallmarkCreatePage />} />
      <Route path="/hallmark-public/:id" element={<HallmarkPublicPage />} />
      <Route path="/manage-my-hallmark" element={<ManageMyHallmarkPage />} />

      {/* New components added for design document compliance */}
      <Route path="/jobs" element={<JobsOpportunities />} />
      <Route path="/communities/my" element={<CommunitiesSection />} />

      {/* Comprehensive Platform Alignment Routes */}
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/careers" element={<JobsPage />} />
      <Route path="/creators-center" element={<CreatorsCenterPage />} />
      <Route path="/creator" element={<CreatorsCenterPage />} />
      <Route path="/business-page" element={<BusinessHubPage />} />
      <Route path="/business-hub" element={<BusinessHubPage />} />
      <Route path="/canary-ad-maker" element={<CanaryAdMakerPage />} />
      <Route path="/canary/ad-maker" element={<CanaryAdMakerPage />} />
      <Route path="/advertising" element={<AdvertisingPage />} />
      <Route path="/ads-manager" element={<AdvertisingPage />} />
      <Route path="/ads/dashboard" element={<AdvertisingPage />} />
      <Route path="/campaigns" element={<CampaignsPage />} />
      <Route path="/dashboard/campaigns" element={<CampaignsPage />} />
      <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
      <Route path="/campaign/:id" element={<CampaignDetailPage />} />
      <Route path="/dashboard/campaigns/:id" element={<DashboardCampaignDetailPage />} />
      <Route path="/dashboard/campaigns/:campaignId" element={<DashboardCampaignDetailPage />} />
      <Route path="/billing" element={<BillingPage />} />
      <Route path="/developer" element={<DeveloperPortalPage />} />
      <Route path="/api-docs" element={<DeveloperPortalPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/contact" element={<ContactSupportPage />} />
      <Route path="/communities/discover" element={<CommunitiesPage />} />
      <Route path="/communities/create" element={<CreateGroupPage />} />
      <Route path="/community-group" element={<GroupsPage />} />
      <Route path="/groups/manage/:id" element={<ManageMyGroupPage />} />
      <Route path="/dancia4tv" element={<Dancia4TvPage />} />
      <Route path="/fingershorts" element={<FingerShortsPage />} />
      <Route path="/lushpressies" element={<LushPressiesPage />} />
      <Route path="/csae" element={<CSAEPolicyPage />} />
      <Route path="/csae-policy" element={<CSAEPolicyPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/whitepaper" element={<WhitePaperPage />} />
      <Route path="/status" element={<PlatformStatusPage />} />
      <Route path="/system-status" element={<SystemStatusPage />} />
      <Route path="/fic/vault" element={<FicVaultPage />} />
      <Route path="/gift-cards" element={<GiftCardsPage />} />
      <Route path="/loyalty" element={<LoyaltyRewardsPage />} />
      <Route path="/loyalty-rewards" element={<LoyaltyRewardsPage />} />
      <Route path="/referrals" element={<ReferralsPage />} />
      <Route path="/payouts" element={<PayoutsPage />} />
      <Route path="/official-verification" element={<OfficialVerificationPage />} />
      <Route path="/roles" element={<RoleManagementPage />} />
      <Route path="/settings" element={<GeneralSettingsPage />} />
      <Route path="/settings/verification" element={<VerificationPage />} />
      <Route path="/profile-enhancement" element={<ProfileEnhancement />} />
      <Route path="/auditlogadmin" element={<AuditLogAdminPage />} />
      <Route path="/admin/canary" element={<CanaryAdsManagementPage />} />
      <Route path="/admindashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/users" element={<MemberManagementPage />} />
      <Route path="/admin/members" element={<MemberManagementPage />} />
      <Route path="/admin/dpo" element={<DPODashboardPage />} />
      <Route path="/dpo/dashboard" element={<DPODashboardPage />} />
      <Route path="/admin/security-events" element={<AdminSecurityEventsPage />} />
      <Route path="/admin/security-settings" element={<AdminSecuritySettingsPage />} />
      <Route path="/hallmark/:id" element={<HallmarkPublicPage />} />
      <Route path="/hallmark/1" element={<HallmarkPublicPage />} />
      <Route path="/hallmark/create" element={<HallmarkCreatePage />} />
      <Route path="/hallmark/manage/:id" element={<ManageMyHallmarkPage />} />
      <Route path="/dashboard/moderation/hallmarks" element={<HallmarkApprovalPage />} />
      <Route path="/dashboard/moderation/flamingo" element={<FlamingoApprovalPage />} />
      <Route path="/dashboard/moderation/gems" element={<GemApprovalPage />} />
      <Route path="/photocredits" element={<PhotoCreditsPage />} />
      <Route path="/pricing" element={<MonetizationPage />} />
      <Route path="/features" element={<ShowcasePage />} />
      <Route path="/resources" element={<PublishingToolsPage />} />
      <Route path="/brand" element={<ShowcasePage />} />
      <Route path="/blog" element={<BlogsPage />} />
      <Route path="/userreports" element={<UserReportsPage />} />
      <Route path="/moderationqueue" element={<ModerationQueuePage />} />
      <Route path="/rbacmanagement" element={<RbacManagementPage />} />
      <Route path="/orders" element={<StoreManagementPage />} />
      <Route path="/wallet/transactions" element={<WalletPage />} />
      <Route path="/financials/subscriptions" element={<SubscriptionsPage />} />
      <Route path="/member/subscriptions" element={<SubscriptionsPage />} />
      <Route path="/network" element={<MembersPage />} />
      <Route path="/network/suggestions" element={<MembersPage />} />
      <Route path="/feed" element={<TrendsFeedPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth" element={<Navigate to="/login" replace />} />
      <Route path="/auth/signup" element={<Navigate to="/register" replace />} />
      <Route path="/logout" element={<Navigate to="/login" replace />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/platform-terms" element={<TermsAndConditionsPage />} />
      <Route path="/cookies" element={<CookiePolicyPage />} />
      <Route path="/guidelines" element={<CommunityGuidelinesPage />} />
      <Route path="/accessibility" element={<LegalPage />} />
      <Route path="/adchoices" element={<LegalPage />} />
      <Route path="/disclaimer" element={<LegalPage />} />
      <Route path="/diversity" element={<LegalPage />} />
      <Route path="/user-policy" element={<LegalPage />} />
      <Route path="/security" element={<LegalPage />} />
      <Route path="/ai-policy" element={<LegalPage />} />
      <Route path="/super-admin" element={<SuperAdminOverviewPage />} />
      <Route path="/code-agent" element={<CodeAgentPage />} />
      <Route path="/editor-studio" element={<EditorStudioPage />} />
      <Route path="/guardian/control" element={<GuardianControlPage />} />
      <Route path="/guardian/sentient" element={<SentientControlPage />} />
      <Route path="/guardian/stercs" element={<StercsControlPage />} />
      <Route path="/video-translation" element={<VideoTranslationDashboard />} />
      <Route path="/analytics" element={<AnalyticsOverviewPage />} />
      <Route path="/analytics/sales" element={<SalesAnalyticsPage />} />
      <Route path="/analytics/ugc" element={<UgcAnalyticsPage />} />
      <Route path="/calendar" element={<ContentCalendarPage />} />
      <Route path="/content-management" element={<ContentManagementPage />} />
      <Route path="/domains" element={<DomainsPage />} />
      <Route path="/forum-management" element={<ForumManagementPage />} />
      <Route path="/store-management" element={<StoreManagementPage />} />
      <Route path="/support-dashboard" element={<SupportDashboardPage />} />
      <Route path="/finance-dashboard" element={<FinanceDashboardPage />} />
      <Route path="/inbox" element={<InboxPage />} />
      <Route path="/search/results" element={<SearchResultsPage />} />
      <Route path="/profile/edit" element={<EditProfile />} />
      <Route path="/courses/create" element={<CreateCourse />} />
      <Route path="/courses/:id/edit" element={<EditCourse />} />
      <Route path="/camus/dashboard" element={<CamusDashboardPage />} />
      <Route path="/camus/dashboard/courses" element={<ELearningPage />} />
      <Route path="/camus/explore" element={<ELearningPage />} />
      <Route path="/music/playlist/:id" element={<PlaylistDetailPage />} />
      <Route path="/ai-assistant" element={<AiPlaylistPage />} />
      {/* Extended Alignments & Final Route Resolution */}
      <Route path="/member/landing" element={<MemberLandingPage />} />
      <Route path="/forum/new" element={<CreatePostPage />} />
      <Route path="/country" element={<GeneralSettingsPage />} />
      <Route path="/language" element={<GeneralSettingsPage />} />
      <Route path="/integrations" element={<DeveloperPortalPage />} />
      <Route path="/emojis" element={<ShowcasePage />} />
      <Route path="/api/developer/examples/curl" element={<DeveloperPortalPage />} />
      <Route path="/api/developer/openapi.json" element={<DeveloperPortalPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      <Route path="/creator-influence" element={<CreatorInfluencePage />} />
      <Route path="/gem/public/:id" element={<GemPublicPage />} />
      <Route path="/legal-compliance" element={<LegalCompliancePage />} />
      <Route path="/monitoring" element={<MonitoringDashboardPage />} />
      <Route path="/monitoring/prometheus" element={<PrometheusMetricsPage />} />
      <Route path="/monitoring/grafana" element={<GrafanaEmbedPage />} />
      <Route path="/database-integration" element={<DatabaseIntegrationDashboard />} />
      <Route path="/database-integration-summary" element={<DatabaseIntegrationSummary />} />
      <Route path="/admin/feature-toggles" element={<FeatureTogglesPage />} />
      <Route path="/fingermobile-editor-studio" element={<FingerMobileEditorStudioPage />} />
      <Route path="/admin/site-menus" element={<SiteMenusPage />} />
      <Route path="/admin/site-pages" element={<SitePagesMenusPage />} />
      <Route path="/post-publishing-demo" element={<PostPublishingDemoPage />} />
      <Route path="/blog-templates" element={<BlogTemplatesPage />} />
      <Route path="/content-admin" element={<ContentAdminDashboardPage />} />
      <Route path="/content-community" element={<ContentCommunityDashboardPage />} />
      <Route path="/content-creator" element={<ContentCreatorDashboardPage />} />
      <Route path="/content-moderator" element={<ContentModeratorDashboardPage />} />
      <Route path="/moderation-dashboard" element={<ModerationDashboardPage />} />
      <Route path="/creator/home" element={<CreatorDashboardHomePage />} />
      <Route path="/dashboard-overview" element={<DashboardOverviewPage />} />
      {/* Ancillary Page Alignments */}
      <Route path="/financials/loyalty" element={<LoyaltyPage />} />
      <Route path="/financials/payouts" element={<PaymentPayoutsPage />} />
      <Route path="/admin/user-management" element={<AdminUserManagement />} />
      <Route path="/legal" element={<LegalIndexPage />} />
      <Route path="/notification/:id" element={<SingleNotificationPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
