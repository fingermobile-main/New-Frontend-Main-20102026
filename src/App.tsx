import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GlobalProviders } from './components/GlobalProviders'; // Import GlobalProviders
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import SettingsPage from './pages/settings/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/messages/MessagesPage';
import GroupsPage from './pages/GroupsPage';
import MarketplacePage from './pages/MarketplacePage';
import DiscoverPage from './pages/DiscoverPage';
import MyWalletPage from './pages/financials/MyWalletPage';
import FinancialsPage from './pages/financials/FinancialsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ContentPage from './pages/ContentPage';
import CommercePage from './pages/CommercePage';
import CommunityPage from './pages/CommunityPage';
import MonetizationPage from './pages/MonetizationPage';
import LiveStreamingPage from './pages/LiveStreamingPage';
import AIGovernancePage from './pages/AiGovernancePage';
import CompliancePage from './pages/CompliancePage';
import GuardianAiPage from './pages/GuardianAiPage';
import MembersPage from './pages/MembersPage';
import SecurityPage from './pages/SecurityPage';
import StercsDashboardPage from './pages/StercsDashboardPage';
import MasterDashboardPage from './pages/MasterDashboardPage';
import StercsModulesPage from './pages/StercsModulesPage';
import StercsPoliciesPage from './pages/StercsPoliciesPage';
import StercsPage from './pages/StercsPage';
import ForumPage from './pages/ForumPage';
import ForumPageDraft from './pages/ForumPageDraft';
import PhotoCreditsPage from './pages/PhotoCreditsPage';
import GalleryPage from './pages/GalleryPage';
import StercsCurationDashboard from './pages/super-admin/StercsCurationDashboard';
import ConnectorArtifactConsole from './components/dashboard/ConnectorArtifactConsole';
import OnboardingPage from './pages/OnboardingPage';
import AboutPage from './pages/about/AboutPage';
import SupportPage from './pages/SupportPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsOfServicePage from './pages/legal/TermsOfServicePage';
import PlatformServiceOfUsePage from './pages/legal/PlatformServiceOfUsePage';
import LegalPage from './pages/legal/LegalPage';
import NotFoundPage from './pages/common/NotFoundPage';
import UserManagementPage from './pages/UserManagementPage';
import ContentManagementPage from './pages/ContentManagementPage';
import EcommercePage from './pages/EcommercePage';
import BusinessOfficesPage from './pages/BusinessOfficesPage';
import CamusPage from './pages/CamusPage';
import FingerShortsPage from './pages/FingerShortsPage';
import PubliciteePage from './pages/PubliciteePage';
import DPOPage from './pages/DPOPage';
import BeatwaveNGPage from './pages/BeatwaveNGPage';
import LoanSqrPage from './pages/LoanSqrPage';
import OwnitPage from './pages/OwnitPage';
import FlamingoPage from './pages/FlamingoPage';
import StorefrontPage from './pages/StorefrontPage';
import StorefrontsPage from './pages/StorefrontsPage';
import MiiPage from './pages/MiiPage';
import GemsPage from './pages/GemsPage';
import HallmarksPage from './pages/HallmarksPage';
import BlogsPage from './pages/BlogsPage';
import TrendsPage from './pages/TrendsPage';
import ProgramsPage from './pages/ProgramsPage';
import EventsPage from './pages/EventsPage';
import FranchisePage from './pages/FranchisePage'; // Correct import
import CataloguePage from './pages/CataloguePage';
import PortfolioPage from './pages/PortfolioPage';
import UGCDashboardPage from './pages/UGCDashboardPage';
import UniversalSearchModal from './components/common/UniversalSearchModal';
import SuccessPage from './pages/common/SuccessPage'; // Import SuccessPage

// Aliases for route mapping
const LandingPage = HomePage;
const ContactPage = SupportPage;
const FriendsPage = MembersPage;
const TransactionsPage = FinancialsPage;
const WithdrawalsPage = FinancialsPage;
const EarningsPage = MonetizationPage;
const SubscriptionsPage = MonetizationPage;

function App() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    const handleOpenSearch = () => setIsSearchOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-universal-search', handleOpenSearch);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-universal-search', handleOpenSearch);
    };
  }, []);

  return (
    <GlobalProviders> {/* Wrap the entire app with GlobalProviders */}
      <Router>
        <div className="App relative min-h-screen">
          <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          {/* Floating Quick Search Hotkey Trigger */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-400 bg-zinc-900/90 border border-emerald-500/30 rounded-full shadow-lg backdrop-blur hover:bg-zinc-800 hover:border-emerald-400 transition-all focus:outline-none"
            title="Search Platform Screens & Dashboards (Cmd+K / Ctrl+K)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Search (Cmd+K)</span>
          </button>

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/success" element={<SuccessPage />} /> {/* Add the success route */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/platform-service-of-use" element={<PlatformServiceOfUsePage />} />
            <Route path="/platformserviceofuse" element={<PlatformServiceOfUsePage />} />
            <Route path="/service-of-use" element={<PlatformServiceOfUsePage />} />
            <Route path="/serviceofuse" element={<PlatformServiceOfUsePage />} />
            <Route path="/terms-of-use" element={<PlatformServiceOfUsePage />} />
            <Route path="/termsofuse" element={<PlatformServiceOfUsePage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/legal/platform-service-of-use" element={<PlatformServiceOfUsePage />} />
            <Route path="/legal/service-of-use" element={<PlatformServiceOfUsePage />} />
            <Route path="/legal/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/my-wallet" element={<MyWalletPage />} />
            <Route path="/financials" element={<FinancialsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/withdrawals" element={<WithdrawalsPage />} />
            <Route path="/earnings" element={<EarningsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/commerce" element={<CommercePage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/monetization" element={<MonetizationPage />} />
            <Route path="/live-streaming" element={<LiveStreamingPage />} />
            <Route path="/ai-governance" element={<AIGovernancePage />} />
            <Route path="/compliance" element={<CompliancePage />} />
            <Route path="/guardian" element={<GuardianAiPage />} />
            <Route path="/dashboard/members" element={<MembersPage />} />
            <Route path="/dashboard/content" element={<ContentManagementPage />} />
            <Route path="/dashboard/commerce" element={<CommercePage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/security" element={<SecurityPage />} />
            <Route path="/dashboard/community" element={<CommunityPage />} />
            <Route path="/dashboard/monetization" element={<MonetizationPage />} />
            <Route path="/dashboard/live-streaming" element={<LiveStreamingPage />} />
            <Route path="/dashboard/streaming" element={<LiveStreamingPage />} />
            <Route path="/dashboard/ai-governance" element={<AIGovernancePage />} />
            <Route path="/dashboard/compliance" element={<CompliancePage />} />
            <Route path="/dashboard/guardian" element={<GuardianAiPage />} />
            <Route path="/stercs-dashboard" element={<StercsDashboardPage />} />
            <Route path="/master-dashboard" element={<MasterDashboardPage />} />
            <Route path="/stercs/modules" element={<StercsModulesPage />} />
            <Route path="/stercs/policies" element={<StercsPoliciesPage />} />
            <Route path="/stercs/sentient-control" element={<StercsModulesPage />} />
            <Route path="/stercs/guardian-ai" element={<GuardianAiPage />} />
            <Route path="/dashboard/security" element={<SecurityPage />} />
            <Route path="/stercs/core" element={<StercsModulesPage />} />
            <Route path="/stercs/curation" element={<StercsModulesPage />} />
            <Route path="/stercs/editor" element={<StercsModulesPage />} />
            <Route path="/stercs/media-library" element={<StercsModulesPage />} />
            <Route path="/stercs/theme-designer" element={<StercsModulesPage />} />
            <Route path="/stercs/video-editor" element={<StercsModulesPage />} />
            <Route path="/stercs/audio-editor" element={<StercsModulesPage />} />
            <Route path="/stercs/translation" element={<StercsModulesPage />} />
            <Route path="/stercs/analytics" element={<AnalyticsPage />} />
            <Route path="/stercs/security" element={<SecurityPage />} />
            <Route path="/stercs/policies/content-moderation" element={<StercsPoliciesPage />} />
            <Route path="/stercs/features/ai-filtering" element={<AIGovernancePage />} />
            <Route path="/stercs/compliance/gdpr" element={<CompliancePage />} />
            <Route path="/stercs/features/spend-cap" element={<MonetizationPage />} />
            <Route path="/stercs/settings/inactivity" element={<SettingsPage />} />
            <Route path="/stercs/policies/verification" element={<StercsPoliciesPage />} />
            <Route path="/stercs/controls/compliance-checks" element={<CompliancePage />} />
            <Route path="/stercs/features/real-time-monitoring" element={<AnalyticsPage />} />
            <Route path="/dashboard/guardian" element={<GuardianAiPage />} />
            <Route path="/stercs/policies/ai-transparency" element={<StercsPoliciesPage />} />
            <Route path="/stercs/policies/data-privacy" element={<StercsPoliciesPage />} />
            <Route path="/dashboard/compliance" element={<CompliancePage />} />
            <Route path="/reports/analytics" element={<AnalyticsPage />} />
            <Route path="/stercs/policies/community-guidelines" element={<StercsPoliciesPage />} />
            <Route path="/stercs/policies/accessibility" element={<StercsPoliciesPage />} />
            <Route path="/stercs/compliance/checks/gdpr" element={<CompliancePage />} />
            <Route path="/stercs/compliance/checks/content-moderation" element={<CompliancePage />} />
            <Route path="/stercs/compliance/checks/ai-bias" element={<CompliancePage />} />
            <Route path="/stercs/compliance/checks/accessibility" element={<CompliancePage />} />
            <Route path="/stercs/compliance/checks/security" element={<CompliancePage />} />
            <Route path="/dashboard/users" element={<UserManagementPage />} />
            <Route path="/dashboard/users/:id/activity" element={<UserManagementPage />} />
            {/* Additional routes based on the requirements document */}
            <Route path="/dashboard/forum" element={<CommunityPage />} />
            <Route path="/dashboard/gems" element={<CommunityPage />} />
            <Route path="/dashboard/hallmarks" element={<CommunityPage />} />
            <Route path="/dashboard/groups" element={<CommunityPage />} />
            <Route path="/dashboard/blogs" element={<CommunityPage />} />
            <Route path="/dashboard/mi" element={<AnalyticsPage />} />
            <Route path="/dashboard/trends" element={<CommunityPage />} />
            <Route path="/dashboard/fingerlux" element={<LiveStreamingPage />} />
            <Route path="/dashboard/fingerwars" element={<LiveStreamingPage />} />
            <Route path="/dashboard/publicitee" element={<MonetizationPage />} />
            <Route path="/dashboard/discovery" element={<DiscoverPage />} />
            <Route path="/dashboard/storefronts" element={<MarketplacePage />} />
            <Route path="/dashboard/flamingo" element={<MarketplacePage />} />
            <Route path="/dashboard/ownit" element={<MarketplacePage />} />
            <Route path="/dashboard/photocredits" element={<ContentPage />} />
            <Route path="/dashboard/gallery" element={<ContentPage />} />
            <Route path="/dashboard/beatwaven" element={<LiveStreamingPage />} />
            <Route path="/dashboard/dancia4tv" element={<LiveStreamingPage />} />
            <Route path="/dashboard/member-pages" element={<MembersPage />} />
            <Route path="/dashboard/contacts" element={<MembersPage />} />
            <Route path="/dashboard/profiles" element={<ProfilePage />} />
            <Route path="/dashboard/site-editor" element={<SettingsPage />} />
            <Route path="/dashboard/animations" element={<ContentPage />} />
            <Route path="/dashboard/image-tools" element={<ContentPage />} />
            <Route path="/dashboard/videobox" element={<LiveStreamingPage />} />
            <Route path="/dashboard/ecommerce" element={<EcommercePage />} />
            <Route path="/dashboard/ecommerce/products/:id/view" element={<EcommercePage />} />
            <Route path="/dashboard/ecommerce/products/:id/edit" element={<EcommercePage />} />
            <Route path="/dashboard/ecommerce/products/:id/analytics" element={<EcommercePage />} />
            <Route path="/dashboard/ecommerce/orders/:id/view" element={<EcommercePage />} />
            <Route path="/dashboard/ecommerce/orders/:id/analytics" element={<EcommercePage />} />
            <Route path="/dashboard/marketing" element={<MonetizationPage />} />
            <Route path="/dashboard/seo" element={<AnalyticsPage />} />
            <Route path="/dashboard/ai-tools" element={<AIGovernancePage />} />
            <Route path="/dashboard/templates" element={<SettingsPage />} />
            <Route path="/dashboard/forms" element={<SettingsPage />} />
            <Route path="/dashboard/collaboration" element={<SettingsPage />} />
            <Route path="/dashboard/content/:id/view" element={<ContentManagementPage />} />
            <Route path="/dashboard/content/:id/edit" element={<ContentManagementPage />} />
            <Route path="/dashboard/content/:id/analytics" element={<ContentManagementPage />} />

            {/* Forum, Media & Curation Controls */}
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/forum-draft" element={<ForumPageDraft />} />
            <Route path="/photocredits" element={<PhotoCreditsPage />} />
            <Route path="/photo-credits" element={<PhotoCreditsPage />} />
            <Route path="/luminagallery" element={<GalleryPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/stercs" element={<StercsPage />} />
            <Route path="/super-admin/stercs-curation" element={<StercsCurationDashboard />} />
            <Route path="/dashboard/connectors" element={<div className="p-6 max-w-7xl mx-auto"><ConnectorArtifactConsole /></div>} />
            <Route path="/connectors" element={<div className="p-6 max-w-7xl mx-auto"><ConnectorArtifactConsole /></div>} />

            {/* Autonomous Governance, AI & Sovereign Security */}
            <Route path="/guardian-protection" element={<GuardianAiPage />} />
            <Route path="/guardian-ai" element={<GuardianAiPage />} />

            {/* Business & Corporate Hubs */}
            <Route path="/business" element={<BusinessOfficesPage />} />
            <Route path="/business-offices" element={<BusinessOfficesPage />} />
            <Route path="/businessoffices" element={<BusinessOfficesPage />} />

            {/* Camus & Systems Intelligence */}
            <Route path="/camus" element={<CamusPage />} />
            <Route path="/camus/dashboard" element={<CamusPage />} />
            <Route path="/camusdashboard" element={<CamusPage />} />

            {/* Entertainment, Video & Shorts */}
            <Route path="/fingershorts" element={<FingerShortsPage />} />
            <Route path="/shorts" element={<FingerShortsPage />} />

            {/* Advertising & Monetization Portals */}
            <Route path="/publicitee" element={<PubliciteePage />} />
            <Route path="/dpo" element={<DPOPage />} />
            <Route path="/admin/dpo" element={<DPOPage />} />

            {/* Audio, Radio & Streaming Hub */}
            <Route path="/beatwave-ng" element={<BeatwaveNGPage />} />
            <Route path="/beatwave" element={<BeatwaveNGPage />} />
            <Route path="/beatwaven" element={<BeatwaveNGPage />} />
            <Route path="/beatwaveng" element={<BeatwaveNGPage />} />

            {/* Lush Pressies & Feed Routes */}
            <Route path="/lush-pressies" element={<LushPressiesPage />} />
            <Route path="/lushpressies" element={<LushPressiesPage />} />
            <Route path="/feed" element={<CategoryFeedPage />} />
            <Route path="/trends-feed" element={<TrendsFeedPage />} />

            {/* Wallet Routes */}
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/my-wallet" element={<MyWalletPage />} />

            {/* Dancia4TV Route */}
            <Route path="/dancia4tv" element={<Dancia4TvPage />} />

            {/* Micro-Financing & SME Float */}
            <Route path="/loansqr" element={<LoanSqrPage />} />
            <Route path="/loansq" element={<LoanSqrPage />} />
            <Route path="/Loansqr" element={<LoanSqrPage />} />
            <Route path="/admin/loansqr" element={<LoanSqrPage />} />

            {/* Financials with nested routes */}
            <Route path="/financials" element={<FinancialsPage />}>
              <Route path="wallet" element={<WalletPage />} />
              <Route path="vault" element={<div>Vault section would go here</div>} />
              <Route path="subscriptions" element={<SubscriptionsPage />} />
              <Route path="monetization" element={<MonetizationPage />} />
              <Route path="referrals" element={<div>Referrals section would go here</div>} />
              <Route path="loyalty" element={<div>Loyalty section would go here</div>} />
              <Route path="giftcards" element={<div>Gift Cards section would go here</div>} />
            </Route>

            {/* Quad-Separation Luxury & Merchant E-Commerce */}
            <Route path="/ownit" element={<OwnitPage />} />
            <Route path="/ownit/tracking" element={<OwnitPage />} />
            <Route path="/flamingo" element={<FlamingoPage />} />
            <Route path="/flamingo/tracking" element={<FlamingoPage />} />
            <Route path="/storefront" element={<StorefrontPage />} />
            <Route path="/storefronts" element={<StorefrontsPage />} />

            {/* Social Micro-Features & Community */}
            <Route path="/mii" element={<MiiPage />} />
            <Route path="/gems" element={<GemsPage />} />
            <Route path="/hallmarks" element={<HallmarksPage />} />
            <Route path="/blogs" element={<BlogsPage />} />

            {/* Content Discovery & Creator Economy */}
            <Route path="/trends" element={<TrendsPage />} />
            <Route path="/trending" element={<TrendsPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/franchise" element={<FranchisePage />} />
            <Route path="/catalogue" element={<CataloguePage />} />
            <Route path="/catalog" element={<CataloguePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/ugc-dashboard" element={<UGCDashboardPage />} />
            <Route path="/ugc" element={<UGCDashboardPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </GlobalProviders>
  );
}

export default App;