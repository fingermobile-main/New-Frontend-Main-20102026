import React, { lazy } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

// Layout Wrappers
// For now, using basic divs as placeholders for layout components
const ShellLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
const WorkspaceLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;
const ReaderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => <div>{children}</div>;

// Guard Rails
// For now, using basic components as placeholders for guard components
const RequireAuth: React.FC<{ children: React.ReactNode, enforceMfa?: boolean }> = ({ children }) => <>{children}</>;
const RequireRole: React.FC<{ children: React.ReactNode, allowedRoles: string[] }> = ({ children }) => <>{children}</>;

// Mock UserRole enum
enum UserRole {
  GUEST = 'GUEST',
  VERIFIED_USER = 'VERIFIED_USER',
  CREATOR = 'CREATOR',
  MERCHANT = 'MERCHANT',
  MODERATOR = 'MODERATOR',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  SYSTEM_ENGINEER = 'SYSTEM_ENGINEER',
}

// -----------------------------------------------------------------------------
// CODE-SPLIT LAZY LOADED IMPORTS
// -----------------------------------------------------------------------------

// Module 1: Auth & Account Security
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const AdminLoginPage = lazy(() => import('../pages/AdminLoginPage'));
const VerificationPage = lazy(() => import('../pages/VerificationPage'));
const SecuritySetupPage = lazy(() => import('../pages/SecuritySetupPage'));
const ChangePasswordPage = lazy(() => import('../pages/ChangePasswordPage'));
const AccountDeletionPage = lazy(() => import('../pages/AccountDeletionPage'));

// Module 2: Core Social, Discovery & Consumption
const HomePage = lazy(() => import('../pages/HomePage'));
const DiscoverPage = lazy(() => import('../pages/DiscoverPage'));
const DiscoveryPage = lazy(() => import('../pages/DiscoveryPage'));
const CategoryFeedPage = lazy(() => import('../pages/CategoryFeedPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const TrendsPage = lazy(() => import('../pages/TrendsPage'));
const TrendsFeedPage = lazy(() => import('../pages/TrendsFeedPage'));
const TopicsPage = lazy(() => import('../pages/TopicsPage'));
const PostDetailPage = lazy(() => import('../pages/PostDetailPage'));
const VideosPage = lazy(() => import('../pages/VideosPage'));
const FingerShortsPage = lazy(() => import('../pages/FingerShortsPage'));
const PhotosPage = lazy(() => import('../pages/PhotosPage'));
const GalleryPage = lazy(() => import('../pages/GalleryPage'));
const ShowcasePage = lazy(() => import('../pages/ShowcasePage'));

// Module 4: Creator Ecosystem, Monetization & Competitions
const CreatorDashboardPage = lazy(() => import('../pages/CreatorDashboardPage'));
const CreatorInfluencePage = lazy(() => import('../pages/CreatorInfluencePage'));
const MonetizationDashboardPage = lazy(() => import('../pages/MonetizationDashboardPage'));
const MonetizationPage = lazy(() => import('../pages/MonetizationPage'));
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
const CommunityManagementPage = lazy(() => import('../pages/CommunityManagementPage'));
const CommunityGuidelinesPage = lazy(() => import('../pages/CommunityGuidelinesPage'));
const GroupsPage = lazy(() => import('../pages/GroupsPage'));
const GroupDetailPage = lazy(() => import('../pages/GroupDetailPage'));
const CreateGroupPage = lazy(() => import('../pages/CreateGroupPage'));
const ForumPage = lazy(() => import('../pages/ForumPage'));
const ConferencePage = lazy(() => import('../pages/ConferencePage'));
const LiveStreamingPage = lazy(() => import('../pages/LiveStreamingPage'));
const EventsPage = lazy(() => import('../pages/EventsPage'));

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
const MarketplaceTrackingPage = lazy(() => import('../pages/MarketplaceTrackingPage'));
const StorefrontTrackingPage = lazy(() => import('../pages/StorefrontTrackingPage'));
const FingerLuxPage = lazy(() => import('../pages/FingerLuxPage'));
const LushPressiesPage = lazy(() => import('../pages/LushPressiesPage'));
const MyDownloadsPage = lazy(() => import('../pages/MyDownloadsPage'));

// Module 8: Wallets, Payments & Financial Operations
const WalletPage = lazy(() => import('../pages/WalletPage'));
const WalletAndPayPage = lazy(() => import('../pages/WalletAndPayPage'));
const WalletFundingPage = lazy(() => import('../pages/WalletFundingPage'));
const PaylinksPage = lazy(() => import('../pages/PaylinksPage'));
const FinancialsPage = lazy(() => import('../pages/FinancialsPage'));
const FICVaultPage = lazy(() => import('../pages/FICVaultPage'));
const LendsqrPage = lazy(() => import('../pages/LendsqrPage'));

// Module 9: E-Learning, Education & Programs
const ELearningPage = lazy(() => import('../pages/ELearningPage'));
const CourseDetailPage = lazy(() => import('../pages/CourseDetailPage'));
const MyLearningPage = lazy(() => import('../pages/MyLearningPage'));
const LmsPage = lazy(() => import('../pages/LmsPage'));
const ProgramsPage = lazy(() => import('../pages/ProgramsPage'));
const NyscPage = lazy(() => import('../pages/NyscPage'));

// Module 10: User Identity, Settings & Internal Operations
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const PrivateMessagesPage = lazy(() => import('../pages/PrivateMessagesPage'));
const MembersPage = lazy(() => import('../pages/MembersPage'));
const MemberLandingPage = lazy(() => import('../pages/MemberLandingPage'));
const SubscriptionsPage = lazy(() => import('../pages/SubscriptionsPage'));
const PortfolioPage = lazy(() => import('../pages/PortfolioPage'));
const MiiPage = lazy(() => import('../pages/MiiPage'));
const MyPages = lazy(() => import('../pages/MyPages'));
const PhotoCreditsPage = lazy(() => import('../pages/PhotoCreditsPage'));
const PhotoCreditDetailPage = lazy(() => import('../pages/PhotoCreditDetailPage'));
const JobsPage = lazy(() => import('../pages/JobsPage'));

// Module 12: Analytics, Operations & Admin Dashboards
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const DashboardHomePage = lazy(() => import('../pages/DashboardHomePage'));
const UnifiedDashboardPage = lazy(() => import('../pages/UnifiedDashboardPage'));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));
const AdminControlDashboard = lazy(() => import('../pages/AdminControlDashboard'));
const AdvancedAnalyticsPage = lazy(() => import('../pages/AdvancedAnalyticsPage'));
const InsightsPage = lazy(() => import('../pages/InsightsPage'));
const AuditLogAdminPage = lazy(() => import('../pages/AuditLogAdminPage'));
const ModerationQueuePage = lazy(() => import('../pages/ModerationQueuePage'));
const UserReportsPage = lazy(() => import('../pages/UserReportsPage'));
const UGCDashboardPage = lazy(() => import('../pages/UGCDashboardPage'));
const RbacManagementPage = lazy(() => import('../pages/RbacManagementPage'));

// Module 14: Corporate, Legal, Compliance & Information
const AboutPage = lazy(() => import('../pages/AboutPage'));
const AboutUsPage = lazy(() => import('../pages/AboutUsPage'));
const BlogsPage = lazy(() => import('../pages/BlogsPage'));
const ContactUsPage = lazy(() => import('../pages/ContactUsPage'));
const SupportPage = lazy(() => import('../pages/SupportPage'));
const GovernancePage = lazy(() => import('../pages/GovernancePage'));
const InvestorRelationsPage = lazy(() => import('../pages/InvestorRelationsPage'));
const ServicesPage = lazy(() => import('../pages/ServicesPage'));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('../pages/TermsOfServicePage'));
const TermsAndConditionsPage = lazy(() => import('../pages/TermsAndConditionsPage'));
const CookiePolicyPage = lazy(() => import('../pages/CookiePolicyPage'));
const DataSubjectRequestPage = lazy(() => import('../pages/DataSubjectRequestPage'));

// Compatibility redirect helper
const redirectTo = (to: string) => <Navigate to={to} replace />;

// -----------------------------------------------------------------------------
// ROUTING DEFINITION
// -----------------------------------------------------------------------------

export const routes: RouteObject[] = [
  // ---------------------------------------------------------------------------
  // AUTH SCAFFOLD - Unauthenticated / Minimal Identity Entry
  // ---------------------------------------------------------------------------
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/adminlogin', element: <AdminLoginPage /> },
      { path: '/verification', element: <VerificationPage /> },
      { path: '/securitysetup', element: <SecuritySetupPage /> },
      { path: '/changepassword', element: <ChangePasswordPage /> },
      { path: '/datasubjectrequest', element: <DataSubjectRequestPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
    ],
  },

  // ---------------------------------------------------------------------------
  // READER SCAFFOLD - Documentation & Legal Texts (Publicly Accessible)
  // ---------------------------------------------------------------------------
  {
    element: <ReaderLayout />,
    children: [
      { path: '/about', element: <AboutPage /> },
      { path: '/aboutus', element: <AboutUsPage /> },
      { path: '/contactus', element: <ContactUsPage /> },
      { path: '/support', element: <SupportPage /> },
      { path: '/investorrelations', element: <InvestorRelationsPage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/communityguidelines', element: <CommunityGuidelinesPage /> },
      { path: '/privacypolicy', element: <PrivacyPolicyPage /> },
      { path: '/termsofservice', element: <TermsOfServicePage /> },
      { path: '/termsandconditions', element: <TermsAndConditionsPage /> },
      { path: '/cookiepolicy', element: <CookiePolicyPage /> },
    ],
  },

  // ---------------------------------------------------------------------------
  // SHELL SCAFFOLD - Public / Unauthenticated Discovery Views
  // ---------------------------------------------------------------------------
  {
    element: <ShellLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/discover', element: <DiscoverPage /> },
      { path: '/discovery', element: <DiscoveryPage /> },
      { path: '/categoryfeed', element: <CategoryFeedPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/trends', element: <TrendsPage /> },
      { path: '/trendsfeed', element: <TrendsFeedPage /> },
      { path: '/videos', element: <VideosPage /> },
      { path: '/fingershorts', element: <FingerShortsPage /> },
      { path: '/photos', element: <PhotosPage /> },
      { path: '/gallery', element: <GalleryPage /> },
      { path: '/showcase', element: <ShowcasePage /> },
      { path: '/blogs', element: <BlogsPage /> },
      { path: '/marketplace', element: <MarketplacePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/productdetail', element: <ProductDetailPage /> },
      { path: '/catalogue', element: <CataloguePage /> },
      { path: '/storefront', element: <StorefrontPage /> },
      { path: '/storefronts', element: <StorefrontsPage /> },
      { path: '/storefrontdetail', element: <StorefrontDetailPage /> },
      { path: '/fingerlux', element: <FingerLuxPage /> },
      { path: '/lushpressies', element: <LushPressiesPage /> },
      { path: '/elearning', element: <ELearningPage /> },
      { path: '/coursedetail', element: <CourseDetailPage /> },
      { path: '/programs', element: <ProgramsPage /> },
      { path: '/jobs', element: <JobsPage /> },
      { path: '/communities', element: <CommunitiesPage /> },
      { path: '/community', element: <CommunityPage /> },
      { path: '/forum', element: <ForumPage /> },
      { path: '/events', element: <EventsPage /> },
      { path: '/fingerwars', element: <FingerWarsPage /> },
      { path: '/hallmark', element: <HallmarkPage /> },
      { path: '/photocredits', element: <PhotoCreditsPage /> },
      { path: '/photocreditdetail', element: <PhotoCreditDetailPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/postdetail', element: <PostDetailPage /> },
      
      // Compatibility aliases and canonical redirects
      { path: '/about-us', element: redirectTo('/aboutus') },
      { path: '/contact', element: redirectTo('/contactus') },
      { path: '/terms', element: redirectTo('/termsofservice') },
      { path: '/privacy', element: redirectTo('/privacypolicy') },
      { path: '/guidelines', element: redirectTo('/communityguidelines') },
      { path: '/shorts', element: redirectTo('/fingershorts') },
    ],
  },

  // ---------------------------------------------------------------------------
  // AUTHENTICATED CORE - General Member Tier
  // ---------------------------------------------------------------------------
  {
    element: <RequireAuth enforceMfa={false} children={<ShellLayout />} />,
    children: [
      {
        element: <ShellLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/dashboardhome', element: <DashboardHomePage /> },
          { path: '/memberlanding', element: <MemberLandingPage /> },
          { path: '/settings', element: <SettingsPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/privatemessages', element: <PrivateMessagesPage /> },
          { path: '/network', element: <MembersPage /> },
          { path: '/subscriptions', element: <SubscriptionsPage /> },
          { path: '/portfolio', element: <PortfolioPage /> },
          { path: '/accountdeletion', element: <AccountDeletionPage /> },
          { path: '/topics', element: <TopicsPage /> },
          { path: '/communityenhanced', element: <CommunityPageEnhanced /> },
          { path: '/communitys', element: <CommunityPages /> },
          { path: '/groups', element: <GroupsPage /> },
          { path: '/groupdetail', element: <GroupDetailPage /> },
          { path: '/creategroup', element: <CreateGroupPage /> },
          { path: '/conference', element: <ConferencePage /> },
          { path: '/livestreaming', element: <LiveStreamingPage /> },
          { path: '/advancedfingerwar', element: <AdvancedFingerWarPage /> },
          { path: '/gameon', element: <GameOnPage /> },
          { path: '/hallmarks', element: <HallmarksPage /> },
          { path: '/gems', element: <GemsPage /> },
          { path: '/advancedgifting', element: <AdvancedGiftingPage /> },
          { path: '/coupons', element: <CouponsPage /> },
          { path: '/marketplacetracking', element: <MarketplaceTrackingPage /> },
          { path: '/storefronttracking', element: <StorefrontTrackingPage /> },
          { path: '/mydownloads', element: <MyDownloadsPage /> },
          { path: '/wallet', element: <WalletPage /> },
          { path: '/mywallet', element: redirectTo('/wallet') }, // Alias canonicalization
          { path: '/walletandpay', element: <WalletAndPayPage /> },
          { path: '/walletfunding', element: <WalletFundingPage /> },
          { path: '/paylinks', element: <PaylinksPage /> },
          { path: '/memberearning', element: <MemberEarningPage /> },
          { path: '/lendsqr', element: <LendsqrPage /> },
          { path: '/mylearning', element: <MyLearningPage /> },
          { path: '/nysc', element: <NyscPage /> },
          { path: '/mii', element: <MiiPage /> },
          { path: '/mys', element: <MyPages /> },
          { path: '/governance', element: <GovernancePage /> },
          { path: '/published', element: <div>Published Page Placeholder</div> },
          { path: '/communitymanagement', element: <CommunityManagementPage /> },
          
          // More compatibility aliases
          { path: '/my-wallet', element: redirectTo('/wallet') },
          { path: '/my-learning', element: redirectTo('/mylearning') },
          { path: '/my-pages', element: redirectTo('/mys') },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // CREATOR & WORKSPACE TIER
  // ---------------------------------------------------------------------------
  {
    element: <RequireAuth enforceMfa={false} children={<ShellLayout />} />,
    children: [
      {
        element: (
          <RequireRole 
            children={<ShellLayout />}
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
            element: <ShellLayout />,
            children: [
              { path: '/creatordashboard', element: <CreatorDashboardPage /> },
              { path: '/creatorinfluence', element: <CreatorInfluencePage /> },
              { path: '/monetizationdashboard', element: <MonetizationDashboardPage /> },
              { path: '/monetization', element: <MonetizationPage /> },
              { path: '/financials', element: <FinancialsPage /> },
              { path: '/ficvault', element: <FICVaultPage /> },
              { path: '/insights', element: <InsightsPage /> },
              
              // Creator workspace pages
              { path: '/mystorefront', element: <MyStorefrontPage /> },
              { path: '/lms', element: <LmsPage /> },
            ],
          },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // ADMINISTRATIVE & INFRASTRUCTURE TIER
  // ---------------------------------------------------------------------------
  {
    element: <RequireAuth enforceMfa={true} children={<ShellLayout />} />,
    children: [
      {
        element: (
          <RequireRole
            children={<ShellLayout />}
            allowedRoles={[
              UserRole.MODERATOR,
              UserRole.PLATFORM_ADMIN,
              UserRole.SYSTEM_ENGINEER,
            ]}
          />
        ),
        children: [
          {
            element: <ShellLayout />,
            children: [
              { path: '/admindashboard', element: <AdminDashboardPage /> },
              { path: '/admincontroldashboard', element: <AdminControlDashboard /> },
              { path: '/unifieddashboard', element: <UnifiedDashboardPage /> },
              { path: '/advancedanalytics', element: <AdvancedAnalyticsPage /> },
              { path: '/auditlogadmin', element: <AuditLogAdminPage /> },
              { path: '/moderationqueue', element: <ModerationQueuePage /> },
              { path: '/userreports', element: <UserReportsPage /> },
              { path: '/ugcdashboard', element: <UGCDashboardPage /> },
              { path: '/rbacmanagement', element: <RbacManagementPage /> },
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
        <a href="/" className="mt-6 border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-emerald-300 rounded hover:bg-emerald-500/20">
          Return Home
        </a>
      </div>
    ),
  },
];

export const router = createBrowserRouter(routes);