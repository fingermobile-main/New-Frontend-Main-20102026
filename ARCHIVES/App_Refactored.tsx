import React, { Suspense, lazy, useEffect, Component, ReactNode, ComponentType } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Context Providers
import { ToastProvider } from './contexts/ToastContext';
import { HapticFeedbackProvider } from './contexts/HapticFeedbackContext';
import { SuperViAuthProvider } from './contexts/SuperViAuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { IdentityAuthProvider } from './contexts/IdentityAuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { MonetizationProvider } from './contexts/MonetizationContext';
import { ContentProvider } from './contexts/ContentContext';
import { PostProvider } from './contexts/PostContext';
import { GroupProvider } from './contexts/GroupContext';
import { BeatwaveNGProvider } from './contexts/BeatwaveNGContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotFoundPage from './pages/NotFoundPage';
import LoadingSpinner from './components/LoadingSpinner';
import PushNotificationInitializer from './components/PushNotificationInitializer';

// Styles
import './styles/tailwind.css';
import './styles/custom.css';
import './styles/overrides.css';
import './styles/animations.css';
import './styles/responsive.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/theme.css';

// Lazy loaded pages (Added .js extensions to satisfy TypeScript linter while allowing bundler to resolve .tsx files)
const HomePage = lazy(() => import('./pages/HomePage.js'));
const LoginPage = lazy(() => import('./pages/LoginPage.js'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.js'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage.js'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.js'));
const DashboardHomePage = lazy(() => import('./pages/DashboardHomePage.js'));
const UnifiedDashboardPage = lazy(() => import('./pages/UnifiedDashboardPage.js'));

// Core Feature Pages
const ForumPage = lazy(() => import('./pages/ForumPage.js'));
const TrendsPage = lazy(() => import('./pages/TrendsPage.js'));
const CommunitiesPage = lazy(() => import('./pages/CommunitiesPage.js'));
const CommunityPage = lazy(() => import('./pages/CommunityPage.js'));
const CommunityManagementPage = lazy(() => import('./pages/CommunityManagementPage.js'));
const HallmarksPage = lazy(() => import('./pages/HallmarksPage.js'));
const GemsPage = lazy(() => import('./pages/GemsPage.js'));
const BlogsPage = lazy(() => import('./pages/BlogsPage.js'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage.js'));
const MarketplaceTrackingPage = lazy(() => import('./pages/MarketplaceTrackingPage.js'));
const PhotoCreditsPage = lazy(() => import('./pages/PhotoCreditsPage.js'));
const PhotoCreditDetailPage = lazy(() => import('./pages/PhotoCreditDetailPage.js'));
const BeatwaveNGPage = lazy(() => import('./pages/BeatwaveNGPage.js'));
const Dancia4TvPage = lazy(() => import('./pages/Dancia4TvPage.js'));
const GameOnPage = lazy(() => import('./pages/GameOnPage.js'));

// Content & Media Pages
const VideosPage = lazy(() => import('./pages/VideosPage.js'));
const PhotosPage = lazy(() => import('./pages/PhotosPage.js'));
const GalleryPage = lazy(() => import('./pages/GalleryPage.js'));
const LiveStreamingPage = lazy(() => import('./pages/LiveStreamingPage.js'));
const FingerShortsPage = lazy(() => import('./pages/FingerShortsPage.js'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage.js'));
const CreatePostPage = lazy(() => import('./pages/CreatePostPage.js'));
const EditPostPage = lazy(() => import('./pages/EditPostPage.js'));
const PublishedPage = lazy(() => import('./pages/PublishedPage.js'));
const PublishingToolsPage = lazy(() => import('./pages/PublishingToolsPage.js'));
const PostPublishingSettingsPage = lazy(() => import('./pages/PostPublishingSettingsPage.js'));
const ProtocolDemoPage = lazy(() => import('./pages/ProtocolDemoPage.js'));

// User Pages
const ProfilePage = lazy(() => import('./pages/ProfilePage.js'));
const ShowcasePage = lazy(() => import('./pages/ShowcasePage.js'));
const GroupsPage = lazy(() => import('./pages/GroupsPage.js'));
const GroupDetailPage = lazy(() => import('./pages/GroupDetailPage.js'));
const CreateGroupPage = lazy(() => import('./pages/CreateGroupPage.js'));
const TopicsPage = lazy(() => import('./pages/TopicsPage.js'));
const MessagesPage = lazy(() => import('./pages/MessagesPage.js'));
const PrivateMessagesPage = lazy(() => import('./pages/PrivateMessagesPage.js'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage.js'));
const WalletPage = lazy(() => import('./pages/WalletPage.js'));
const MyWalletPage = lazy(() => import('./pages/MyWalletPage.js'));
const WalletFundingPage = lazy(() => import('./pages/WalletFundingPage.js'));
const WalletAndPayPage = lazy(() => import('./pages/WalletAndPayPage.js'));
const MemberEarningPage = lazy(() => import('./pages/MemberEarningPage.js'));
const JobsPage = lazy(() => import('./pages/JobsPage.js'));
const EventsPage = lazy(() => import('./pages/EventsPage.js'));
const SearchPage = lazy(() => import('./pages/SearchPage.js'));
const SettingsPage = lazy(() => import('./pages/SettingsPage.js'));
const MembersPage = lazy(() => import('./pages/MembersPage.js'));

// Monetization & Financial Pages
const MonetizationPage = lazy(() => import('./pages/MonetizationPage.js'));
const MonetizationDashboardPage = lazy(() => import('./pages/MonetizationDashboardPage.js'));
const FinancialsPage = lazy(() => import('./pages/FinancialsPage.js'));
const SubscriptionsPage = lazy(() => import('./pages/SubscriptionsPage.js'));
const CouponsPage = lazy(() => import('./pages/CouponsPage.js'));
const PaylinksPage = lazy(() => import('./pages/PaylinksPage.js'));
const FICVaultPage = lazy(() => import('./pages/FICVaultPage.js'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.js'));

// Creator & Business Pages
const CreatorDashboardPage = lazy(() => import('./pages/CreatorDashboardPage.js'));
const CreatorInfluencePage = lazy(() => import('./pages/CreatorInfluencePage.js'));
const StorefrontPage = lazy(() => import('./pages/StorefrontPage.js'));
const StorefrontsPage = lazy(() => import('./pages/StorefrontsPage.js'));
const StorefrontTrackingPage = lazy(() => import('./pages/StorefrontTrackingPage.js'));
const StorefrontDetailPage = lazy(() => import('./pages/StorefrontDetailPage.js'));
const MyStorefrontPage = lazy(() => import('./pages/MyStorefrontPage.js'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.js'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage.js'));
const CataloguePage = lazy(() => import('./pages/CataloguePage.js'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage.js'));
const MyPages = lazy(() => import('./pages/MyPages.js'));

// Gaming & Entertainment Pages
const FingerWarsPage = lazy(() => import('./pages/FingerWarsPage.js'));
const AdvancedFingerWarPage = lazy(() => import('./pages/AdvancedFingerWarPage.js'));
const FlamingoPage = lazy(() => import('./pages/FlamingoPage.js'));
const FlamingoTrackingPage = lazy(() => import('./pages/FlamingoTrackingPage.js'));
const OwnitPage = lazy(() => import('./pages/OwnitPage.js'));
const OwnitTrackingPage = lazy(() => import('./pages/OwnitTrackingPage.js'));
const MiiPage = lazy(() => import('./pages/MiiPage.js'));

// Learning & Education Pages
const ELearningPage = lazy(() => import('./pages/ELearningPage.js'));
const LmsPage = lazy(() => import('./pages/LmsPage.js'));
const CamusPage = lazy(() => import('./pages/CamusPage.js'));
const CamusDashboardPage = lazy(() => import('./pages/CamusDashboardPage.js'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage.js'));
const MyLearningPage = lazy(() => import('./pages/MyLearningPage.js'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage.js'));

// Discovery & Analytics Pages
const DiscoverPage = lazy(() => import('./pages/DiscoverPage.js'));
const DiscoveryPage = lazy(() => import('./pages/DiscoveryPage.js'));
const InsightsPage = lazy(() => import('./pages/InsightsPage.js'));
const AdvancedAnalyticsPage = lazy(() => import('./pages/AdvancedAnalyticsPage.js'));
const TrendsFeedPage = lazy(() => import('./pages/TrendsFeedPage.js'));
const CategoryFeedPage = lazy(() => import('./pages/CategoryFeedPage.js'));

// Admin & Management Pages
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.js'));
const AdminControlDashboard = lazy(() => import('./pages/AdminControlDashboard.js'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.js'));
const ModerationQueuePage = lazy(() => import('./pages/ModerationQueuePage.js'));
const UserReportsPage = lazy(() => import('./pages/UserReportsPage.js'));
const RbacManagementPage = lazy(() => import('./pages/RbacManagementPage.js'));
const SecuritySetupPage = lazy(() => import('./pages/SecuritySetupPage.js'));
const GovernancePage = lazy(() => import('./pages/GovernancePage.js'));
const FranchiseManagementPage = lazy(() => import('./pages/FranchiseManagementPage.js'));
const BusinessOfficesPage = lazy(() => import('./pages/BusinessOfficesPage.js'));

// Special Features Pages
const CanaryPage = lazy(() => import('./pages/CanaryPage.js'));
const CanaryAdsPage = lazy(() => import('./pages/CanaryAdsPage.js'));
const SeadsPage = lazy(() => import('./pages/SeadsPage.js'));
const PubliciteePage = lazy(() => import('./pages/PubliciteePage.js'));
const FingerLuxPage = lazy(() => import('./pages/FingerLuxPage.js'));
const LendsqrPage = lazy(() => import('./pages/LendsqrPage.js'));
const NyscPage = lazy(() => import('./pages/NyscPage.js'));
const ConferencePage = lazy(() => import('./pages/ConferencePage.js'));
const AdvancedVoicePage = lazy(() => import('./pages/AdvancedVoicePage.js'));
const AdvancedMediaEditorPage = lazy(() => import('./pages/AdvancedMediaEditorPage.js'));

// Enhanced Features
const ProfileEnhancement = lazy(() => import('./pages/ProfileEnhancement.js'));
const CommunityGroupFeatures = lazy(() => import('./pages/CommunityGroupFeatures.js'));
const ComboEmoticonDisplay = lazy(() => import('./pages/ComboEmoticonDisplay.js'));
const PremiumPages = lazy(() => import('./pages/PremiumPages.js'));
const CreatorMode = lazy(() => import('./pages/CreatorMode.js'));
const AIAvatarGenerator = lazy(() => import('./pages/AIAvatarGenerator.js'));
const MemberLandingPage = lazy(() => import('./pages/MemberLandingPage.js'));
const LushPressiesPage = lazy(() => import('./pages/LushPressiesPage.js'));
const BusinessPageFeatures = lazy(() => import('./pages/BusinessPageFeatures.js'));

// UGC & Data Pages
const UGCDashboardPage = lazy(() => import('./pages/UGCDashboardPage.js'));
const CsvImportPage = lazy(() => import('./pages/CsvImportPage.js'));
const DataImportPage = lazy(() => import('./pages/DataImportPage.js'));
const MyDownloadsPage = lazy(() => import('./pages/MyDownloadsPage.js'));

// Legal & Support Pages
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage.js'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage.js'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage.js'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage.js'));
const CommunityGuidelinesPage = lazy(() => import('./pages/CommunityGuidelinesPage.js'));
const AboutPage = lazy(() => import('./pages/AboutPage.js'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage.js'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage.js'));
const SupportPage = lazy(() => import('./pages/SupportPage.js'));
const InvestorRelationsPage = lazy(() => import('./pages/InvestorRelationsPage.js'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.js'));
const MarketingPage = lazy(() => import('./pages/MarketingPage.js'));

// Account & Verification Pages
const VerificationPage = lazy(() => import('./pages/VerificationPage.js'));
const AccountDeletionPage = lazy(() => import('./pages/AccountDeletionPage.js'));
const DataSubjectRequestPage = lazy(() => import('./pages/DataSubjectRequestPage.js'));
const PermanencePage = lazy(() => import('./pages/PermanencePage.js'));
const OrganizeThesePage = lazy(() => import('./pages/OrganizeThesePage.js'));

// Stercs Editor Pages
const StercsEditorPage = lazy(() => import('./pages/StercsEditorPage.js'));
const StercsMediaLibraryPage = lazy(() => import('./pages/StercsMediaLibraryPage.js'));
const StercsThemeDesignerPage = lazy(() => import('./pages/StercsThemeDesignerPage.js'));
const StercsVideoEditorPage = lazy(() => import('./pages/StercsVideoEditorPage.js'));

// Monitoring & Infrastructure Pages
const MonitoringDashboardPage = lazy(() => import('./pages/MonitoringDashboardPage.js'));
const PrometheusMetricsPage = lazy(() => import('./pages/PrometheusMetricsPage.js'));
const GrafanaEmbedPage = lazy(() => import('./pages/GrafanaEmbedPage.js'));
const AuditLogAdminPage = lazy(() => import('./pages/AuditLogAdminPage.js'));
const RateLimitConfigPage = lazy(() => import('./pages/RateLimitConfigPage.js'));
const CacheManagementPage = lazy(() => import('./pages/CacheManagementPage.js'));
const DeveloperPortalPage = lazy(() => import('./pages/DeveloperPortalPage.js'));

// Demo & Tracking Pages
const CacheDemoPage = lazy(() => import('./pages/CacheDemoPage.js'));
const DatabaseIntegrationDashboard = lazy(() => import('./pages/DatabaseIntegrationDashboard.js'));
const DatabaseIntegrationReportPage = lazy(() => import('./pages/DatabaseIntegrationReportPage.js'));
const DatabaseIntegrationSummary = lazy(() => import('./pages/DatabaseIntegrationSummary.js'));

// FIX 1: Proper Error Boundary Implementation
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen text-center">
          <h2 className="text-2xl font-bold">Something went wrong. Please refresh the page.</h2>
        </div>
      );
    }
    return this.props.children;
  }
}

// FIX 2: Helper to cleanly compose multiple context providers
const ComposeProviders = ({ providers, children }: { providers: ComponentType<{children: ReactNode}>[], children: ReactNode }) => {
  return (
    <>
      {providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
      }, children)}
    </>
  );
};

const AppContent: React.FC = () => {
  // Removed unused `useAuth` destructuring

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/home" element={<DashboardHomePage />} />
        <Route path="/dashboard/unified" element={<UnifiedDashboardPage />} />

        {/* Keeping original route payload inline as requested */}
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/trends/feed" element={<TrendsFeedPage />} />
        <Route path="/communities" element={<CommunitiesPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/manage" element={<CommunityManagementPage />} />
        <Route path="/hallmarks" element={<HallmarksPage />} />
        <Route path="/gems" element={<GemsPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/tracking" element={<MarketplaceTrackingPage />} />
        <Route path="/photocredits" element={<PhotoCreditsPage />} />
        <Route path="/photocredit/:id" element={<PhotoCreditDetailPage />} />
        <Route path="/beatwaveng" element={<BeatwaveNGPage />} />
        <Route path="/dancia4tv" element={<Dancia4TvPage />} />
        <Route path="/gameon" element={<GameOnPage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/photos" element={<PhotosPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/live" element={<LiveStreamingPage />} />
        <Route path="/shorts" element={<FingerShortsPage />} />
        <Route path="/post/:id" element={<PostDetailPage />} />
        <Route path="/post/create" element={<CreatePostPage />} />
        <Route path="/post/edit/:id" element={<EditPostPage />} />
        <Route path="/published" element={<PublishedPage />} />
        <Route path="/publishing/tools" element={<PublishingToolsPage />} />
        <Route path="/publishing/settings" element={<PostPublishingSettingsPage />} />
        <Route path="/protocol-communication/service-providers" element={<ProtocolDemoPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/showcase" element={<ShowcasePage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/group/:id" element={<GroupDetailPage />} />
        <Route path="/group/create" element={<CreateGroupPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/messages/private" element={<PrivateMessagesPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/my-wallet" element={<MyWalletPage />} />
        <Route path="/wallet/fund" element={<WalletFundingPage />} />
        <Route path="/wallet/pay" element={<WalletAndPayPage />} />
        <Route path="/earnings" element={<MemberEarningPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/network" element={<CommunitiesPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/monetization" element={<MonetizationPage />} />
        <Route path="/monetization/dashboard" element={<MonetizationDashboardPage />} />
        <Route path="/financials" element={<FinancialsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/paylinks" element={<PaylinksPage />} />
        <Route path="/fic-vault" element={<FICVaultPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/creator/dashboard" element={<CreatorDashboardPage />} />
        <Route path="/creator/influence" element={<CreatorInfluencePage />} />
        <Route path="/storefront" element={<StorefrontPage />} />
        <Route path="/storefronts" element={<StorefrontsPage />} />
        <Route path="/storefront/tracking" element={<StorefrontTrackingPage />} />
        <Route path="/storefront/:id" element={<StorefrontDetailPage />} />
        <Route path="/my-storefront" element={<MyStorefrontPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/catalogue" element={<CataloguePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/my-pages" element={<MyPages />} />
        <Route path="/business-page" element={<BusinessPageFeatures />} />
        <Route path="/business/offices" element={<BusinessOfficesPage />} />
        <Route path="/fingerwars" element={<FingerWarsPage />} />
        <Route path="/fingerwars/advanced" element={<AdvancedFingerWarPage />} />
        <Route path="/flamingo" element={<FlamingoPage />} />
        <Route path="/flamingo/tracking" element={<FlamingoTrackingPage />} />
        <Route path="/ownit" element={<OwnitPage />} />
        <Route path="/ownit/tracking" element={<OwnitTrackingPage />} />
        <Route path="/mii" element={<MiiPage />} />
        <Route path="/elearning" element={<ELearningPage />} />
        <Route path="/lms" element={<LmsPage />} />
        <Route path="/camus" element={<CamusPage />} />
        <Route path="/camus/dashboard" element={<CamusDashboardPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/my-learning" element={<MyLearningPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/discovery" element={<DiscoveryPage />} />
        <Route path="/discovery/category/:category" element={<CategoryFeedPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/analytics" element={<AdvancedAnalyticsPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/control" element={<AdminControlDashboard />} />
        <Route path="/admin/moderation" element={<ModerationQueuePage />} />
        <Route path="/admin/reports" element={<UserReportsPage />} />
        <Route path="/admin/rbac" element={<RbacManagementPage />} />
        <Route path="/admin/security" element={<SecuritySetupPage />} />
        <Route path="/admin/governance" element={<GovernancePage />} />
        <Route path="/admin/franchise" element={<FranchiseManagementPage />} />
        <Route path="/admin/monitoring" element={<MonitoringDashboardPage />} />
        <Route path="/admin/metrics" element={<PrometheusMetricsPage />} />
        <Route path="/admin/grafana" element={<GrafanaEmbedPage />} />
        <Route path="/admin/audit-logs" element={<AuditLogAdminPage />} />
        <Route path="/admin/rate-limits" element={<RateLimitConfigPage />} />
        <Route path="/admin/cache" element={<CacheManagementPage />} />
        <Route path="/developer" element={<DeveloperPortalPage />} />
        <Route path="/canary" element={<CanaryPage />} />
        <Route path="/canary/ads" element={<CanaryAdsPage />} />
        <Route path="/seads" element={<SeadsPage />} />
        <Route path="/publicitee" element={<PubliciteePage />} />
        <Route path="/fingerlux" element={<FingerLuxPage />} />
        <Route path="/lendsqr" element={<LendsqrPage />} />
        <Route path="/nysc" element={<NyscPage />} />
        <Route path="/conference" element={<ConferencePage />} />
        <Route path="/voice" element={<AdvancedVoicePage />} />
        <Route path="/media-editor" element={<AdvancedMediaEditorPage />} />
        <Route path="/profile-enhancement" element={<ProfileEnhancement />} />
        <Route path="/community-group" element={<CommunityGroupFeatures />} />
        <Route path="/emojis" element={<ComboEmoticonDisplay />} />
        <Route path="/premium-pages" element={<PremiumPages />} />
        <Route path="/creator-mode" element={<CreatorMode />} />
        <Route path="/ai-avatar-generator" element={<AIAvatarGenerator />} />
        <Route path="/member-landing" element={<MemberLandingPage />} />
        <Route path="/lush-pressies" element={<LushPressiesPage />} />
        <Route path="/ugc/dashboard" element={<UGCDashboardPage />} />
        <Route path="/csv-import" element={<CsvImportPage />} />
        <Route path="/data-import" element={<DataImportPage />} />
        <Route path="/downloads" element={<MyDownloadsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/terms-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/cookies" element={<CookiePolicyPage />} />
        <Route path="/guidelines" element={<CommunityGuidelinesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/investors" element={<InvestorRelationsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/marketing" element={<MarketingPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/account/delete" element={<AccountDeletionPage />} />
        <Route path="/data-request" element={<DataSubjectRequestPage />} />
        <Route path="/permanence" element={<PermanencePage />} />
        <Route path="/organize" element={<OrganizeThesePage />} />
        <Route path="/stercs/editor" element={<StercsEditorPage />} />
        <Route path="/stercs/media-library" element={<StercsMediaLibraryPage />} />
        <Route path="/stercs/theme-designer" element={<StercsThemeDesignerPage />} />
        <Route path="/stercs/video-editor" element={<StercsVideoEditorPage />} />
        <Route path="/protocol-demo" element={<ProtocolDemoPage />} />
        <Route path="/database-dashboard" element={<DatabaseIntegrationDashboard />} />
        <Route path="/database-report" element={<DatabaseIntegrationReportPage />} />
        <Route path="/database-summary" element={<DatabaseIntegrationSummary />} />
        <Route path="/cache-demo" element={<CacheDemoPage />} />
        
        {/* FALLBACK */}
        <Route path="/not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Suspense>
  );
};

// FIX 3: Centralized provider list
const appProviders = [
  ToastProvider,
  HapticFeedbackProvider,
  SuperViAuthProvider,
  AuthProvider,
  AppProvider,
  IdentityAuthProvider,
  ProfileProvider,
  MonetizationProvider,
  ContentProvider,
  PostProvider,
  GroupProvider,
  BeatwaveNGProvider,
];

const App: React.FC = () => {
  useEffect(() => {
    console.log('🎨 Tailwind CSS loaded successfully');
    
    if (process.env.NODE_ENV === 'development') {
      const verifyCSSInjection = () => {
        const styleTags = document.querySelectorAll('style');
        let hasTailwind = false;
        
        styleTags.forEach((tag) => {
          const cssText = tag.textContent || '';
          if (cssText.includes('--tw-') || cssText.includes('min-h-screen')) {
            hasTailwind = true;
          }
        });
        
        if (!hasTailwind && styleTags.length === 0) {
          console.error('❌ [CSS Diagnostic] NO CSS INJECTED - Critical issue!');
        }
      };
      
      const timer = setTimeout(verifyCSSInjection, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Router>
      <ComposeProviders providers={appProviders}>
        <div className="flex flex-col min-h-screen">
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>
  
          <Navbar />
          <main id="main-content" className="flex-grow" role="main" aria-label="Main content">
            <PushNotificationInitializer />
    
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
    
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
      </ComposeProviders>
    </Router>
  );
};

export default App;