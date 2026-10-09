import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { GlobalProviders } from './contexts/GlobalProviders';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Core Auth & Common Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OnboardingPage from './pages/OnboardingPage';
import NotFoundPage from './pages/common/NotFoundPage';
import SplashPage from './pages/common/SplashPage';
import SuccessPage from './pages/common/SuccessPage';

// Lazy-loaded Drawer Menu Target Pages
const ForumPage = lazy(() => import('./pages/ForumPage'));
const ForumPageDraft = lazy(() => import('./pages/ForumPageDraft'));
const HallmarkPage = lazy(() => import('./pages/HallmarkPage'));
const HallmarksPage = lazy(() => import('./pages/HallmarksPage'));
const GemsPage = lazy(() => import('./pages/GemsPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const GroupsPage = lazy(() => import('./pages/GroupsPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const MiiPage = lazy(() => import('./pages/MiiPage'));
const PermanencePage = lazy(() => import('./pages/PermanencePage'));
const LoanSqrPage = lazy(() => import('./pages/LoanSqrPage'));
const LoansqrPage = LoanSqrPage;

const TrendsPage = lazy(() => import('./pages/TrendsPage'));
const BeatwaveNGPage = lazy(() => import('./pages/BeatwaveNGPage'));
const Dancia4TvPage = lazy(() => import('./pages/Dancia4TvPage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const LushPressiesPage = lazy(() => import('./pages/LushPressiesPage'));

const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const StorefrontPage = lazy(() => import('./pages/StorefrontPage'));
const MyStorefrontPage = lazy(() => import('./pages/StorefrontPage'));
const OwnitPage = lazy(() => import('./pages/OwnitPage'));
const FlamingoPage = lazy(() => import('./pages/FlamingoPage'));
const StorefrontsPage = lazy(() => import('./pages/StorefrontPage'));
const SubscriptionsPage = lazy(
  () => import('./pages/financials/SubscriptionsPage')
);

const PhotoCreditsPage = lazy(() => import('./pages/PhotoCreditsPage'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));
const MyDownloadsPage = lazy(() => import('./pages/MyDownloadsPage'));
const FingerLuxPage = lazy(() => import('./pages/FingerLuxPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const CataloguePage = lazy(() => import('./pages/CataloguePage'));

const WalletPage = lazy(() => import('./pages/WalletPage'));
const PaylinksPage = lazy(() => import('./pages/PaylinksPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const FranchisePage = lazy(() => import('./pages/FranchisePage'));
const BusinessOfficesPage = lazy(() => import('./pages/BusinessOfficesPage'));
const MonetizationDashboardPage = lazy(
  () => import('./pages/MonetizationDashboardPage')
);
const FICVaultPage = lazy(() => import('./pages/FICVaultPage'));
const FinancialsPage = lazy(() => import('./pages/financials/FinancialsPage'));
const GiftCardsPage = lazy(() => import('./pages/financials/GiftCardsPage'));
const UGCDashboardPage = lazy(() => import('./pages/UGCDashboardPage'));
const AdvancedGiftingPage = lazy(() => import('./pages/AdvancedGiftingPage'));
const GiftsShopPage = lazy(() => import('./pages/GiftsShopPage'));

const GameOnPage = lazy(() => import('./pages/GameOnPage'));
const FingerWarsPage = lazy(() => import('./pages/FingerWarsPage'));
const CanaryAdsPage = lazy(() => import('./pages/CanaryAdsPage'));
const CanaryPage = lazy(() => import('./pages/CanaryPage'));
const CanaryAdMakerPage = lazy(() => import('./pages/CanaryAdMakerPage'));
const CouponsPage = lazy(() => import('./pages/CouponsPage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));

// Legal & Compliance Pages
const LegalPage = lazy(() => import('./pages/legal/LegalPage'));
const LegalIndexPage = lazy(() => import('./pages/legal/IndexPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(
  () => import('./pages/legal/TermsOfServicePage')
);
const CommunityGuidelinesPage = lazy(
  () => import('./pages/legal/CommunityGuidelinesPage')
);
const CSAEPolicyPage = lazy(() => import('./pages/legal/CSAEPolicyPage'));
const WhitePaperPage = lazy(() => import('./pages/legal/WhitePaperPage'));

// Verification Pages
const VerificationPage = lazy(() => import('./pages/VerificationPage'));
const OfficialVerificationPage = lazy(
  () => import('./pages/OfficialVerificationPage')
);

const DataSubjectRequestPage = lazy(
  () => import('./pages/DataSubjectRequestPage')
);
const AccountDeletionPage = lazy(() => import('./pages/AccountDeletionPage'));
const DPOPage = lazy(() => import('./pages/DPOPage'));
const GuardianProtectionPage = lazy(
  () => import('./pages/GuardianProtectionPage')
);
const PubliciteePage = lazy(() => import('./pages/PubliciteePage'));
const FingerShortsPage = lazy(() => import('./pages/FingerShortsPage'));
const CamusPage = lazy(() => import('./pages/CamusPage'));
const CamusDashboardPage = lazy(() => import('./pages/CamusDashboardPage'));

// Help, FAQs, Support & Admin Canary Pages
const FAQPage = lazy(() => import('./pages/info/FAQPage'));
const CanaryAdsManagementPage = lazy(
  () => import('./pages/admin/CanaryAdsManagementPage')
);
const ContactSupportPage = lazy(
  () => import('./pages/support/ContactSupportPage')
);
const HelpPage = lazy(() => import('./pages/support/HelpPage'));

const App: React.FC = () => {
  return (
    <GlobalProviders>
      <Router>
        <div className="App">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public auth & legal routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/splash" element={<SplashPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/legal" element={<LegalIndexPage />} />
              <Route path="/legal/hub" element={<LegalPage />} />
              <Route
                path="/legal/privacy-policy"
                element={<PrivacyPolicyPage />}
              />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route
                path="/legal/terms-of-service"
                element={<TermsOfServicePage />}
              />
              <Route
                path="/terms-of-service"
                element={<TermsOfServicePage />}
              />
              <Route
                path="/legal/community-guidelines"
                element={<CommunityGuidelinesPage />}
              />
              <Route
                path="/community-guidelines"
                element={<CommunityGuidelinesPage />}
              />
              <Route path="/legal/csae-policy" element={<CSAEPolicyPage />} />
              <Route path="/csae-policy" element={<CSAEPolicyPage />} />
              <Route path="/legal/whitepaper" element={<WhitePaperPage />} />
              <Route path="/verification" element={<VerificationPage />} />
              <Route
                path="/official-verification"
                element={<OfficialVerificationPage />}
              />
              <Route
                path="/privacy/data-subject-request"
                element={<DataSubjectRequestPage />}
              />
              <Route
                path="/data-subject-request"
                element={<DataSubjectRequestPage />}
              />
              <Route path="/account/delete" element={<AccountDeletionPage />} />
              <Route
                path="/account-deletion"
                element={<AccountDeletionPage />}
              />

              {/* Public Help, FAQs, Support, Canary & Wallet Direct Routes */}
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/faqs" element={<FAQPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/help-center" element={<HelpPage />} />
              <Route path="/contact-support" element={<ContactSupportPage />} />
              <Route path="/contact" element={<ContactSupportPage />} />
              <Route path="/support/contact" element={<ContactSupportPage />} />
              <Route path="/admin/canary" element={<CanaryAdsManagementPage />} />
              <Route path="/canary/ad-maker" element={<ProtectedRoute><MainLayout><CanaryAdMakerPage /></MainLayout></ProtectedRoute>} />
              <Route path="/canary-ad-maker" element={<ProtectedRoute><MainLayout><CanaryAdMakerPage /></MainLayout></ProtectedRoute>} />
              <Route path="/ad-maker" element={<ProtectedRoute><MainLayout><CanaryAdMakerPage /></MainLayout></ProtectedRoute>} />
              <Route path="/canary" element={<ProtectedRoute><MainLayout><CanaryPage /></MainLayout></ProtectedRoute>} />
              <Route path="/canary/*" element={<ProtectedRoute><MainLayout><CanaryPage /></MainLayout></ProtectedRoute>} />
              <Route path="/fic/wallet" element={<WalletPage />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/business" element={<ProtectedRoute><MainLayout><BusinessOfficesPage /></MainLayout></ProtectedRoute>} />
              <Route path="/business/*" element={<ProtectedRoute><MainLayout><BusinessOfficesPage /></MainLayout></ProtectedRoute>} />
              <Route path="/dpo" element={<ProtectedRoute><MainLayout><DPOPage /></MainLayout></ProtectedRoute>} />
              <Route path="/dpo/*" element={<ProtectedRoute><MainLayout><DPOPage /></MainLayout></ProtectedRoute>} />
              <Route path="/privacy/dpo" element={<ProtectedRoute><MainLayout><DPOPage /></MainLayout></ProtectedRoute>} />
              <Route path="/guardian-protection" element={<ProtectedRoute><MainLayout><GuardianProtectionPage /></MainLayout></ProtectedRoute>} />
              <Route path="/guardian-protection/*" element={<ProtectedRoute><MainLayout><GuardianProtectionPage /></MainLayout></ProtectedRoute>} />
              <Route path="/guardian" element={<ProtectedRoute><MainLayout><GuardianProtectionPage /></MainLayout></ProtectedRoute>} />
              <Route path="/guardian/*" element={<ProtectedRoute><MainLayout><GuardianProtectionPage /></MainLayout></ProtectedRoute>} />
              <Route path="/publicitee" element={<ProtectedRoute><PubliciteePage /></ProtectedRoute>} />
              <Route path="/publicitee/*" element={<ProtectedRoute><PubliciteePage /></ProtectedRoute>} />
              <Route path="/fingershorts" element={<ProtectedRoute><FingerShortsPage /></ProtectedRoute>} />
              <Route path="/fingershorts/*" element={<ProtectedRoute><FingerShortsPage /></ProtectedRoute>} />
              <Route path="/beatwaveng" element={<ProtectedRoute><MainLayout><BeatwaveNGPage /></MainLayout></ProtectedRoute>} />
              <Route path="/beatwaveng/*" element={<ProtectedRoute><MainLayout><BeatwaveNGPage /></MainLayout></ProtectedRoute>} />
              <Route path="/dancia4tv" element={<ProtectedRoute><MainLayout><Dancia4TvPage /></MainLayout></ProtectedRoute>} />
              <Route path="/dancia4tv/*" element={<ProtectedRoute><MainLayout><Dancia4TvPage /></MainLayout></ProtectedRoute>} />
              <Route path="/fingerwars" element={<ProtectedRoute><MainLayout><FingerWarsPage /></MainLayout></ProtectedRoute>} />
              <Route path="/fingerwars/*" element={<ProtectedRoute><MainLayout><FingerWarsPage /></MainLayout></ProtectedRoute>} />
              <Route path="/camus" element={<ProtectedRoute><CamusPage /></ProtectedRoute>} />
              <Route path="/camus/*" element={<ProtectedRoute><CamusPage /></ProtectedRoute>} />
              <Route path="/camus-dashboard" element={<ProtectedRoute><CamusDashboardPage /></ProtectedRoute>} />
              <Route path="/marketplace" element={<ProtectedRoute><MainLayout><MarketplacePage /></MainLayout></ProtectedRoute>} />
              <Route path="/storefront" element={<ProtectedRoute><MainLayout><StorefrontPage /></MainLayout></ProtectedRoute>} />
              <Route path="/storefronts" element={<ProtectedRoute><MainLayout><StorefrontPage /></MainLayout></ProtectedRoute>} />
              <Route path="/my-storefront" element={<ProtectedRoute><MainLayout><StorefrontPage /></MainLayout></ProtectedRoute>} />
              <Route path="/ownit" element={<ProtectedRoute><MainLayout><OwnitPage /></MainLayout></ProtectedRoute>} />
              <Route path="/flamingo" element={<ProtectedRoute><MainLayout><FlamingoPage /></MainLayout></ProtectedRoute>} />

              {/* Financials Direct Routes */}
              <Route path="/financials" element={<ProtectedRoute><MainLayout><FinancialsPage /></MainLayout></ProtectedRoute>}>
                <Route index element={<Navigate to="wallet" replace />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="vault" element={<FICVaultPage />} />
                <Route path="fic-vault" element={<FICVaultPage />} />
                <Route path="giftcards" element={<GiftCardsPage />} />
                <Route path="gift-cards" element={<GiftCardsPage />} />
                <Route path="subscriptions" element={<SubscriptionsPage />} />
                <Route path="monetization" element={<MonetizationDashboardPage />} />
                <Route path="referrals" element={<MonetizationDashboardPage />} />
              </Route>

              {/* Protected Main App Layout with Drawer Menu */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/forum" replace />} />
                {/* 1. Community & Social Hub */}
                <Route path="forum" element={<ForumPage />} />
                <Route path="forum-draft" element={<ForumPageDraft />} />
                <Route path="home-feed" element={<ForumPage />} />
                <Route path="hallmark" element={<HallmarkPage />} />
                <Route path="hallmark/*" element={<HallmarkPage />} />
                <Route path="hallmarks" element={<HallmarksPage />} />
                <Route path="hallmarks/*" element={<HallmarksPage />} />
                <Route path="gems" element={<GemsPage />} />
                <Route path="blog" element={<BlogsPage />} />
                <Route path="blog/*" element={<BlogsPage />} />
                <Route path="blogs" element={<BlogsPage />} />
                <Route path="blogs/*" element={<BlogsPage />} />
                <Route path="groups" element={<GroupsPage />} />
                <Route path="groups/*" element={<GroupsPage />} />
                <Route path="group/*" element={<GroupsPage />} />
                <Route path="community" element={<CommunityPage />} />
                <Route path="mii" element={<MiiPage />} />
                <Route path="mii/*" element={<MiiPage />} />
                <Route path="permanence" element={<PermanencePage />} />
                <Route path="permanence/*" element={<PermanencePage />} />

                {/* 2. Media, Entertainment & Discovery */}
                <Route path="trends" element={<TrendsPage />} />
                <Route path="beatwave-ng" element={<BeatwaveNGPage />} />
                <Route path="beatwaveng" element={<BeatwaveNGPage />} />
                <Route path="beatwaveng/*" element={<BeatwaveNGPage />} />
                <Route path="dancia-4tv" element={<Dancia4TvPage />} />
                <Route path="dancia4tv" element={<Dancia4TvPage />} />
                <Route path="dancia4tv/*" element={<Dancia4TvPage />} />
                <Route path="publicitee" element={<PubliciteePage />} />
                <Route path="publicitee/*" element={<PubliciteePage />} />
                <Route path="fingershorts" element={<FingerShortsPage />} />
                <Route path="fingershorts/*" element={<FingerShortsPage />} />
                <Route path="fingerwars" element={<FingerWarsPage />} />
                <Route path="finger-wars" element={<FingerWarsPage />} />
                <Route path="camus" element={<CamusPage />} />
                <Route path="camus/*" element={<CamusPage />} />
                <Route path="camus-dashboard" element={<CamusDashboardPage />} />
                <Route path="programs" element={<ProgramsPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                <Route path="lushpressies" element={<LushPressiesPage />} />
                <Route path="lushpressies/*" element={<LushPressiesPage />} />
                <Route path="lush-pressies" element={<LushPressiesPage />} />
                <Route path="lush-pressies/*" element={<LushPressiesPage />} />
                <Route path="messages" element={<LushPressiesPage />} />

                {/* 3. Commerce & Storefronts */}
                <Route path="marketplace" element={<MarketplacePage />} />
                <Route path="marketplace/*" element={<MarketplacePage />} />
                <Route path="storefront" element={<StorefrontPage />} />
                <Route path="storefront/*" element={<StorefrontPage />} />
                <Route path="storefronts" element={<StorefrontPage />} />
                <Route path="storefronts/*" element={<StorefrontPage />} />
                <Route path="my-storefront" element={<StorefrontPage />} />
                <Route path="my-storefront/*" element={<StorefrontPage />} />
                <Route path="ownit" element={<OwnitPage />} />
                <Route path="ownit/*" element={<OwnitPage />} />
                <Route path="flamingo" element={<FlamingoPage />} />
                <Route path="flamingo/*" element={<FlamingoPage />} />
                <Route path="subscriptions" element={<SubscriptionsPage />} />

                {/* 4. Creative Studio & UGC Monetization */}
                <Route path="photocredits" element={<PhotoCreditsPage />} />
                <Route path="photocredits/*" element={<PhotoCreditsPage />} />
                <Route path="photo-credits" element={<PhotoCreditsPage />} />
                <Route path="photo-credits/*" element={<PhotoCreditsPage />} />
                <Route path="photos" element={<PhotosPage />} />
                <Route path="my-downloads" element={<MyDownloadsPage />} />
                <Route path="mydownloads" element={<MyDownloadsPage />} />
                <Route path="fingerlux" element={<FingerLuxPage />} />
                <Route path="portfolio" element={<PortfolioPage />} />
                <Route path="catalogue" element={<CataloguePage />} />

                {/* 5. Finance & Monetization Ops */}
                <Route path="pricing" element={<MonetizationDashboardPage />} />
                <Route path="paylinks" element={<PaylinksPage />} />
                <Route
                  path="referrals"
                  element={<MonetizationDashboardPage />}
                />
                <Route path="loyalty" element={<MonetizationDashboardPage />} />
                <Route path="gift-cards" element={<AdvancedGiftingPage />} />
                <Route
                  path="advanced-gifting"
                  element={<AdvancedGiftingPage />}
                />
                <Route path="gifts" element={<GiftsShopPage />} />
                <Route path="gifts/shop" element={<GiftsShopPage />} />
                <Route path="gifts/*" element={<GiftsShopPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="franchise" element={<FranchisePage />} />
                <Route path="franchise/*" element={<FranchisePage />} />
                <Route
                  path="business"
                  element={<BusinessOfficesPage />}
                />
                <Route
                  path="business/*"
                  element={<BusinessOfficesPage />}
                />
                <Route
                  path="business-offices"
                  element={<BusinessOfficesPage />}
                />
                <Route
                  path="businessoffices"
                  element={<BusinessOfficesPage />}
                />
                <Route
                  path="dpo"
                  element={<DPOPage />}
                />
                <Route
                  path="dpo/*"
                  element={<DPOPage />}
                />
                <Route
                  path="guardian-protection"
                  element={<GuardianProtectionPage />}
                />
                <Route
                  path="guardian-protection/*"
                  element={<GuardianProtectionPage />}
                />
                <Route
                  path="guardian"
                  element={<GuardianProtectionPage />}
                />
                <Route
                  path="guardian/*"
                  element={<GuardianProtectionPage />}
                />
                <Route
                  path="monetization-dashboard"
                  element={<MonetizationDashboardPage />}
                />
                <Route path="fic-vault" element={<FICVaultPage />} />
                <Route path="infinite-coins" element={<FICVaultPage />} />
                <Route path="wallet" element={<WalletPage />} />
                <Route path="ugc-dashboard" element={<UGCDashboardPage />} />
                <Route path="payouts" element={<WalletPage />} />
                <Route path="loansqr" element={<LoanSqrPage />} />
                <Route path="loansqr/*" element={<LoanSqrPage />} />
                <Route path="loansq" element={<LoanSqrPage />} />
                <Route path="loansq/*" element={<LoanSqrPage />} />
                <Route path="Loansqr" element={<LoanSqrPage />} />
                <Route path="Loansqr/*" element={<LoanSqrPage />} />
                <Route path="lendsq" element={<LoanSqrPage />} />
                <Route path="lendsq/*" element={<LoanSqrPage />} />

                {/* Financials Nested Routes */}
                <Route path="financials" element={<FinancialsPage />}>
                  <Route index element={<Navigate to="wallet" replace />} />
                  <Route path="wallet" element={<WalletPage />} />
                  <Route path="vault" element={<FICVaultPage />} />
                  <Route path="fic-vault" element={<FICVaultPage />} />
                  <Route path="giftcards" element={<GiftCardsPage />} />
                  <Route path="gift-cards" element={<GiftCardsPage />} />
                  <Route path="subscriptions" element={<SubscriptionsPage />} />
                  <Route path="monetization" element={<MonetizationDashboardPage />} />
                  <Route path="referrals" element={<MonetizationDashboardPage />} />
                  <Route path="loyalty" element={<MonetizationDashboardPage />} />
                </Route>
                <Route path="financials/giftcards" element={<GiftCardsPage />} />
                <Route path="financials/giftcards/*" element={<GiftCardsPage />} />
                <Route path="financials/gift-cards" element={<GiftCardsPage />} />
                <Route path="financials/gift-cards/*" element={<GiftCardsPage />} />
                <Route path="financials/vault" element={<FICVaultPage />} />
                <Route path="financials/vault/*" element={<FICVaultPage />} />
                <Route path="financials/wallet" element={<WalletPage />} />
                <Route path="financials/wallet/*" element={<WalletPage />} />
                <Route path="financials/subscriptions" element={<SubscriptionsPage />} />
                <Route path="financials/subscriptions/*" element={<SubscriptionsPage />} />

                {/* 6. Gamification, Campaigns & System */}
                <Route path="game-on" element={<GameOnPage />} />
                <Route path="game-on/*" element={<GameOnPage />} />
                <Route path="gameon" element={<GameOnPage />} />
                <Route path="gameon/*" element={<GameOnPage />} />
                <Route path="finger-wars" element={<FingerWarsPage />} />
                <Route path="canary-ads" element={<CanaryAdsPage />} />
                <Route path="canaryads" element={<CanaryAdsPage />} />
                <Route path="canary" element={<CanaryPage />} />
                <Route path="canary/*" element={<CanaryPage />} />
                <Route path="canary/ad-maker" element={<CanaryAdMakerPage />} />
                <Route path="canary-ad-maker" element={<CanaryAdMakerPage />} />
                <Route path="ad-maker" element={<CanaryAdMakerPage />} />
                <Route path="coupons" element={<CouponsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="profile/:id" element={<ProfilePage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </GlobalProviders>
  );
};

export default App;
