import { Routes, Route } from 'react-router-dom';
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
import SettingsPage from './pages/SettingsPage'; // Added SettingsPage import

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
import FranchiseManagementPage from './pages/FranchiseManagementPage';
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
import StercsVideoEditorPage from './pages/StercsVideoEditorPage';
import StorefrontDetailPage from './pages/StorefrontDetailPage';
import StorefrontPage from './pages/StorefrontPage';
import StorefrontTrackingPage from './pages/StorefrontTrackingPage';

// New components created based on design document
import JobsOpportunities from './components/JobsOpportunities';
import ModeSwitcher from './components/ModeSwitcher';
import CommunitiesSection from './components/CommunitiesSection';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
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
      <Route path="/photos" element={<PhotosPage />} /> {/* Added PhotosPage route */}
      <Route path="/videos" element={<VideosPage />} /> {/* Added VideosPage route */}
      <Route path="/gallery" element={<GalleryPage />} /> {/* Added GalleryPage route */}
      <Route path="/post/:id" element={<PostDetailPage />} /> {/* Added PostDetailPage route */}
      <Route path="/products" element={<ProductsPage />} /> {/* Added ProductsPage route */}
      <Route path="/storefronts" element={<StorefrontsPage />} /> {/* Added StorefrontsPage route */}
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
      <Route path="/insights" element={<InsightsPage />} /> {/* Added InsightsPage route */}
      <Route path="/unified-dashboard" element={<UnifiedDashboardPage />} /> {/* Added UnifiedDashboardPage route */}
      <Route path="/ugc-dashboard" element={<UGCDashboardPage />} /> {/* Added UGCDashboardPage route */}
      <Route path="/rbac-management" element={<RbacManagementPage />} /> {/* Added RbacManagementPage route */}
      <Route path="/session-management" element={<SessionManagementPage />} /> {/* Added SessionManagementPage route */}
      <Route path="/settings" element={<SettingsPage />} /> {/* Added SettingsPage route */}
      
      {/* Additional Routes */}
      <Route path="/admin-control" element={<AdminControlDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
      <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
      <Route path="/advanced-finger-war" element={<AdvancedFingerWarPage />} />
      <Route path="/advanced-gifting" element={<AdvancedGiftingPage />} />
      <Route path="/advanced-voice" element={<AdvancedVoicePage />} />
      <Route path="/ai-playlist" element={<AiPlaylistPage />} />
      <Route path="/beatwave-ng" element={<BeatwaveNGPage />} />
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
      
      {/* New components added for design document compliance */}
      <Route path="/jobs" element={<JobsOpportunities />} />
      <Route path="/communities/my" element={<CommunitiesSection />} />
    </Routes>
  );
};

export default AppRoutes;