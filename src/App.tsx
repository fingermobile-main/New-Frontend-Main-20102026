import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
/* eslint-disable no-console */

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/common/NotFoundPage';
import ProfileEnhancement from './components/ProfileEnhancement';
import BusinessPageFeatures from './components/BusinessPageFeatures';
import CommunityGroupFeatures from './components/CommunityGroupFeatures';
import ComboEmoticonDisplay from './components/ComboEmoticonDisplay';

// Import the new components
import PremiumPages from './components/PremiumPages';
import CreatorMode from './components/CreatorMode';
import AIAvatarGenerator from './components/AIAvatarGenerator';

// Import ALL page components for comprehensive routing
import ForumPage from './pages/ForumPage';
import TrendsPage from './pages/TrendsPage';
import CommunitiesPage from './pages/CommunitiesPage';
import HallmarksPage from './pages/HallmarksPage';
import GemsPage from './pages/GemsPage';
import BlogsPage from './pages/BlogsPage';
import MarketplacePage from './pages/MarketplacePage';
import PhotoCreditsPage from './pages/PhotoCreditsPage';
import BeatwaveNGPage from './pages/BeatwaveNGPage';
import Dancia4TvPage from './pages/Dancia4TvPage';
import GameOnPage from './pages/GameOnPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import GroupsPage from './pages/GroupsPage';
import MessagesPage from './pages/messages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import WalletPage from './pages/WalletPage';
import JobsPage from './pages/JobsPage';
import EventsPage from './pages/EventsPage';
import SearchPage from './pages/SearchPage';
import MyWalletPage from './pages/MyWalletPage';
import MemberEarningPage from './pages/MemberEarningPage';

// NEW: Monitoring & Management Pages
import MonitoringDashboardPage from './pages/MonitoringDashboardPage';
import PrometheusMetricsPage from './pages/PrometheusMetricsPage';
import GrafanaEmbedPage from './pages/GrafanaEmbedPage';
import DeveloperPortalPage from './pages/DeveloperPortalPage';
import AuditLogAdminPage from './pages/AuditLogAdminPage';
import RateLimitConfigPage from './pages/RateLimitConfigPage';
import CacheManagementPage from './pages/CacheManagementPage';

// Content & Media Pages
import VideosPage from './pages/VideosPage';
import PhotosPage from './pages/PhotosPage';
import GalleryPage from './pages/GalleryPage';
import LiveStreamingPage from './pages/LiveStreamingPage';
import FingerShortsPage from './pages/FingerShortsPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import PublishedPage from './pages/PublishedPage';
import PublishingToolsPage from './pages/PublishingToolsPage';

// Community & Social Pages
import GroupDetailPage from './pages/GroupDetailPage';
import CreateGroupPage from './pages/CreateGroupPage';
import TopicsPage from './pages/TopicsPage';
import PrivateMessagesPage from './pages/PrivateMessagesPage';
import CommunityPage from './pages/CommunityPage';
import CommunityManagementPage from './pages/CommunityManagementPage';
import MembersPage from './pages/MembersPage';

// Monetization & Financial Pages
import MonetizationPage from './pages/MonetizationPage';
import MonetizationDashboardPage from './pages/MonetizationDashboardPage';
import FinancialsPage from './pages/FinancialsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import CouponsPage from './pages/CouponsPage';
import PaylinksPage from './pages/PaylinksPage';
import WalletFundingPage from './pages/WalletFundingPage';
import WalletAndPayPage from './pages/WalletAndPayPage';
import FICVaultPage from './pages/FICVaultPage';
import CheckoutPage from './pages/CheckoutPage';

// Creator & Business Pages
import CreatorDashboardPage from './pages/CreatorDashboardPage';
import CreatorInfluencePage from './pages/CreatorInfluencePage';
import StorefrontPage from './pages/StorefrontPage';
import StorefrontsPage from './pages/StorefrontsPage';
import StorefrontDetailPage from './pages/StorefrontDetailPage';
import MyStorefrontPage from './pages/MyStorefrontPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CataloguePage from './pages/CataloguePage';
import PortfolioPage from './pages/PortfolioPage';
import MyPages from './pages/MyPages';

// Gaming & Entertainment Pages
import FingerWarsPage from './pages/FingerWarsPage';
import AdvancedFingerWarPage from './pages/AdvancedFingerWarPage';
import FlamingoPage from './pages/FlamingoPage';
import OwnitPage from './pages/OwnitPage';
import MiiPage from './pages/MiiPage';

// Learning & Education Pages
import ELearningPage from './pages/ELearningPage';
import LmsPage from './pages/LmsPage';
import CamusPage from './pages/CamusPage';
import CamusDashboardPage from './pages/CamusDashboardPage';
import CourseDetailPage from './pages/CourseDetailPage';
import MyLearningPage from './pages/MyLearningPage';
import ProgramsPage from './pages/ProgramsPage';

// Discovery & Analytics Pages
import DiscoverPage from './pages/DiscoverPage';
import DiscoveryPage from './pages/DiscoveryPage';
import InsightsPage from './pages/InsightsPage';
import AdvancedAnalyticsPage from './pages/AdvancedAnalyticsPage';
import TrendsFeedPage from './pages/TrendsFeedPage';
import CategoryFeedPage from './pages/CategoryFeedPage';

// Admin & Management Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminControlDashboard from './pages/AdminControlDashboard';
import AdminLoginPage from './pages/AdminLoginPage';
import ModerationQueuePage from './pages/ModerationQueuePage';
import UserReportsPage from './pages/UserReportsPage';
import RbacManagementPage from './pages/RbacManagementPage';
import SecuritySetupPage from './pages/SecuritySetupPage';
import GovernancePage from './pages/GovernancePage';
import FranchiseManagementPage from './pages/FranchiseManagementPage';
import BusinessOfficesPage from './pages/BusinessOfficesPage';

// Special Features Pages
import CanaryPage from './pages/CanaryPage';
import CanaryAdsPage from './pages/CanaryAdsPage';
import SeadsPage from './pages/SeadsPage';
import PubliciteePage from './pages/PubliciteePage';
import FingerLuxPage from './pages/FingerLuxPage';
import LendsqrPage from './pages/LendsqrPage';
import NyscPage from './pages/NyscPage';
import ConferencePage from './pages/ConferencePage';
import AdvancedVoicePage from './pages/AdvancedVoicePage';
import AdvancedMediaEditorPage from './pages/AdvancedMediaEditorPage';
import EnhancedEditorPage from './pages/EnhancedEditorPage';
import EditorPage from './pages/EditorPage';
import AiPlaylistPage from './pages/AiPlaylistPage';
import AdvancedGiftingPage from './pages/AdvancedGiftingPage';

// STERCS Editor Pages
import StercsEditorPage from './pages/StercsEditorPage';
import StercsMediaLibraryPage from './pages/StercsMediaLibraryPage';
import StercsThemeDesignerPage from './pages/StercsThemeDesignerPage';
import StercsVideoEditorPage from './pages/StercsVideoEditorPage';

// Tracking & Demo Pages
import FlamingoTrackingPage from './pages/FlamingoTrackingPage';
import OwnitTrackingPage from './pages/OwnitTrackingPage';
import MarketplaceTrackingPage from './pages/MarketplaceTrackingPage';
import StorefrontTrackingPage from './pages/StorefrontTrackingPage';
import ProtocolDemoPage from './pages/ProtocolDemoPage';
import DatabaseIntegrationDashboard from './pages/DatabaseIntegrationDashboard';
import DatabaseIntegrationReportPage from './pages/DatabaseIntegrationReportPage';
import DatabaseIntegrationSummary from './pages/DatabaseIntegrationSummary';
import CacheDemoPage from './pages/CacheDemoPage';

// UGC & Data Pages
import UGCDashboardPage from './pages/UGCDashboardPage';
import CsvImportPage from './pages/CsvImportPage';
import DataImportPage from './pages/DataImportPage';
import MyDownloadsPage from './pages/MyDownloadsPage';

// Legal & Support Pages
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import CommunityGuidelinesPage from './pages/CommunityGuidelinesPage';
import AboutPage from './pages/AboutPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import SupportPage from './pages/SupportPage';
import InvestorRelationsPage from './pages/InvestorRelationsPage';
import ServicesPage from './pages/ServicesPage';
import MarketingPage from './pages/MarketingPage';

// Account & Verification Pages
import VerificationPage from './pages/VerificationPage';
import AccountDeletionPage from './pages/AccountDeletionPage';
import DataSubjectRequestPage from './pages/DataSubjectRequestPage';
import ShowcasePage from './pages/ShowcasePage';
import PermanencePage from './pages/PermanencePage';
import OrganizeThesePage from './pages/OrganizeThesePage';
import UnifiedDashboardPage from './pages/UnifiedDashboardPage';
import DashboardHomePage from './pages/DashboardHomePage';
import MemberLandingPage from './pages/MemberLandingPage';
import PhotoCreditDetailPage from './pages/PhotoCreditDetailPage';
import PostPublishingSettingsPage from './pages/PostPublishingSettingsPage';
import LushPressiesPage from './pages/LushPressiesPage';

// Import the new service providers
import { IdentityAuthProvider } from './contexts/IdentityAuthContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { MonetizationProvider } from './contexts/MonetizationContext';
import { ContentProvider } from './contexts/ContentContext';
import { AppProvider } from './contexts/AppContext';
import PostProvider from './contexts/PostContext';
import GroupProvider from './contexts/GroupContext';
import { BeatwaveNGProvider } from './contexts/BeatwaveNGContext';
import { HapticFeedbackProvider } from './contexts/HapticFeedbackContext';
import { AuthProvider } from './contexts/AuthContext';
import { SuperViAuthProvider } from './contexts/SuperViAuthContext';
import { ToastProvider } from './components/Toast';

// Import push notification service
import { pushNotificationService } from './services/PushNotificationService';
import { showNotification } from './utils/notificationToast';

/**
 * PushNotificationInitializer Component
 * Initializes Firebase push notifications when user is authenticated
 */
const PushNotificationInitializer: React.FC = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  useEffect(() => {
    const initPushNotifications = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
        
        if (!token) {
          console.info('⏭️ Skipping push notification init - user not logged in');
          return;
        }

        // Check if already initialized
        const alreadyInitialized = sessionStorage.getItem('push_notifications_initialized');
        if (alreadyInitialized === 'true') {
          console.info('✅ Push notifications already initialized');
          return;
        }

        console.info('🔔 Initializing push notifications...');
        
        // Request permission and register device
        const fcmToken = await pushNotificationService.requestPermission();
        
        if (fcmToken) {
          console.info('✅ Push notifications enabled successfully');
          
          // Listen for foreground messages
          pushNotificationService.onMessageReceived((payload: Record<string, unknown>) => {
            console.info('📨 Foreground message received:', payload);
            
            const notification = payload.notification as { title?: string; body?: string } | undefined;
            const data = payload.data as { url?: string } | undefined;
            
            // Show toast notification
            showNotification({
              title: notification?.title || 'New Notification',
              body: notification?.body || '',
              url: data?.url,
              type: 'info'
            });
          });
          
          // Mark as initialized
          sessionStorage.setItem('push_notifications_initialized', 'true');
        } else {
          console.info('⚠️ Push notification permission denied or token unavailable');
        }
      } catch (error) {
        console.error('❌ Failed to initialize push notifications:', error);
        // Don't block app functionality if push notifications fail
      }
    };

    // Initialize with a slight delay to ensure app is ready
    timerRef.current = setTimeout(initPushNotifications, 2000);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

const App: React.FC = () => {
  // CSS Injection Verification Effect
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const verifyCSSInjection = () => {
        const styleTags = document.querySelectorAll('style');
        console.log(`🎨 [CSS Diagnostic] Found ${styleTags.length} <style> tags`);
        
        let hasTailwind = false;
        let totalRules = 0;
        
        styleTags.forEach((tag, idx) => {
          const cssText = tag.textContent || '';
          const ruleCount = (cssText.match(/}/g) || []).length;
          totalRules += ruleCount;
          
          if (cssText.includes('--tw-') || cssText.includes('min-h-screen')) {
            hasTailwind = true;
            console.log(`✅ [CSS Diagnostic] Style tag #${idx}: Tailwind detected (${ruleCount} rules)`);
          }
        });
        
        if (hasTailwind) {
          console.log('✅ [CSS Diagnostic] Tailwind CSS is properly injected');
        } else if (totalRules > 0) {
          console.warn('⚠️ [CSS Diagnostic] CSS injected but Tailwind utilities missing');
        } else {
          console.error('❌ [CSS Diagnostic] NO CSS INJECTED - Critical issue!');
        }
        
        // Check computed styles on body
        const bodyStyle = window.getComputedStyle(document.body);
        console.log('[CSS Diagnostic] Body background:', bodyStyle.backgroundColor);
        console.log('[CSS Diagnostic] Body font-family:', bodyStyle.fontFamily);
      };
      
      // Run after a short delay to ensure DOM is ready
      const timer = setTimeout(verifyCSSInjection, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Router>
      <ToastProvider>
        <HapticFeedbackProvider>
          <SuperViAuthProvider>
            <AuthProvider>
              <AppProvider>
                <IdentityAuthProvider>
                  <ProfileProvider>
                    <MonetizationProvider>
                      <ContentProvider>
                        <PostProvider>
                          <GroupProvider>
                            <BeatwaveNGProvider>
                              <div className="flex flex-col min-h-screen">
                                {/* Skip Navigation Link for Keyboard Users */}
                                <a 
                                  href="#main-content" 
                                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg"
                                >
                                  Skip to main content
                                </a>
                        
                                <Navbar />
                                <main id="main-content" className="flex-grow" role="main" aria-label="Main content">
                                  {/* Initialize push notifications */}
                                  <PushNotificationInitializer />
                          
                                  {/* Toast container for notifications */}
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
                                    <Routes>
                                      {/* ==================== MAIN ROUTES ==================== */}
                                      <Route path="/" element={<HomePage />} />
                                      <Route path="/login" element={<LoginPage />} />
                                      <Route path="/register" element={<RegisterPage />} />
                                      <Route path="/change-password" element={<ChangePasswordPage />} />
                                      <Route path="/dashboard" element={<DashboardPage />} />
                                      <Route path="/dashboard/home" element={<DashboardHomePage />} />
                                      <Route path="/dashboard/unified" element={<UnifiedDashboardPage />} />
                              
                                      {/* ==================== CORE FEATURE ROUTES ==================== */}
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
                              
                                      {/* ==================== CONTENT & MEDIA ROUTES ==================== */}
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
                              
                                      {/* ==================== USER ROUTES ==================== */}
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
                              
                                      {/* ==================== MONETIZATION & FINANCIAL ROUTES ==================== */}
                                      <Route path="/monetization" element={<MonetizationPage />} />
                                      <Route path="/monetization/dashboard" element={<MonetizationDashboardPage />} />
                                      <Route path="/financials" element={<FinancialsPage />} />
                                      <Route path="/subscriptions" element={<SubscriptionsPage />} />
                                      <Route path="/coupons" element={<CouponsPage />} />
                                      <Route path="/paylinks" element={<PaylinksPage />} />
                                      <Route path="/fic-vault" element={<FICVaultPage />} />
                                      <Route path="/checkout" element={<CheckoutPage />} />
                              
                                      {/* ==================== CREATOR & BUSINESS ROUTES ==================== */}
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
                              
                                      {/* ==================== GAMING & ENTERTAINMENT ROUTES ==================== */}
                                      <Route path="/fingerwars" element={<FingerWarsPage />} />
                                      <Route path="/fingerwars/advanced" element={<AdvancedFingerWarPage />} />
                                      <Route path="/flamingo" element={<FlamingoPage />} />
                                      <Route path="/flamingo/tracking" element={<FlamingoTrackingPage />} />
                                      <Route path="/ownit" element={<OwnitPage />} />
                                      <Route path="/ownit/tracking" element={<OwnitTrackingPage />} />
                                      <Route path="/mii" element={<MiiPage />} />
                              
                                      {/* ==================== LEARNING & EDUCATION ROUTES ==================== */}
                                      <Route path="/elearning" element={<ELearningPage />} />
                                      <Route path="/lms" element={<LmsPage />} />
                                      <Route path="/camus" element={<CamusPage />} />
                                      <Route path="/camus/dashboard" element={<CamusDashboardPage />} />
                                      <Route path="/course/:id" element={<CourseDetailPage />} />
                                      <Route path="/my-learning" element={<MyLearningPage />} />
                                      <Route path="/programs" element={<ProgramsPage />} />
                              
                                      {/* ==================== DISCOVERY & ANALYTICS ROUTES ==================== */}
                                      <Route path="/discover" element={<DiscoverPage />} />
                                      <Route path="/discovery" element={<DiscoveryPage />} />
                                      <Route path="/discovery/category/:category" element={<CategoryFeedPage />} />
                                      <Route path="/insights" element={<InsightsPage />} />
                                      <Route path="/analytics" element={<AdvancedAnalyticsPage />} />
                              
                                      {/* ==================== ADMIN & MANAGEMENT ROUTES ==================== */}
                                      <Route path="/admin" element={<AdminLoginPage />} />
                                      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                                      <Route path="/admin/control" element={<AdminControlDashboard />} />
                                      <Route path="/admin/moderation" element={<ModerationQueuePage />} />
                                      <Route path="/admin/reports" element={<UserReportsPage />} />
                                      <Route path="/admin/rbac" element={<RbacManagementPage />} />
                                      <Route path="/admin/security" element={<SecuritySetupPage />} />
                                      <Route path="/admin/governance" element={<GovernancePage />} />
                                      <Route path="/admin/franchise" element={<FranchiseManagementPage />} />
                              
                              {/* NEW: Monitoring & Infrastructure Routes */}
                              <Route path="/admin/monitoring" element={<MonitoringDashboardPage />} />
                              <Route path="/admin/metrics" element={<PrometheusMetricsPage />} />
                              <Route path="/admin/grafana" element={<GrafanaEmbedPage />} />
                              <Route path="/admin/audit-logs" element={<AuditLogAdminPage />} />
                              <Route path="/admin/rate-limits" element={<RateLimitConfigPage />} />
                              <Route path="/admin/cache" element={<CacheManagementPage />} />
                              <Route path="/developer" element={<DeveloperPortalPage />} />
                              
                              {/* ==================== SPECIAL FEATURES ROUTES ==================== */}
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
                              <Route path="/editor/enhanced" element={<EnhancedEditorPage />} />
                              <Route path="/editor" element={<EditorPage />} />
                              <Route path="/ai-playlist" element={<AiPlaylistPage />} />
                              <Route path="/gifting" element={<AdvancedGiftingPage />} />
                              
                              {/* ==================== STERCS EDITOR ROUTES ==================== */}
                              <Route path="/stercs/editor" element={<StercsEditorPage />} />
                              <Route path="/stercs/media-library" element={<StercsMediaLibraryPage />} />
                              <Route path="/stercs/theme-designer" element={<StercsThemeDesignerPage />} />
                              <Route path="/stercs/video-editor" element={<StercsVideoEditorPage />} />
                              
                              {/* ==================== UGC & DATA ROUTES ==================== */}
                              <Route path="/ugc/dashboard" element={<UGCDashboardPage />} />
                              <Route path="/csv-import" element={<CsvImportPage />} />
                              <Route path="/data-import" element={<DataImportPage />} />
                              <Route path="/downloads" element={<MyDownloadsPage />} />
                              
                              {/* ==================== LEGAL & SUPPORT ROUTES ==================== */}
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
                              
                              {/* ==================== ACCOUNT & VERIFICATION ROUTES ==================== */}
                              <Route path="/verification" element={<VerificationPage />} />
                              <Route path="/account/delete" element={<AccountDeletionPage />} />
                              <Route path="/data-request" element={<DataSubjectRequestPage />} />
                              <Route path="/permanence" element={<PermanencePage />} />
                              <Route path="/organize" element={<OrganizeThesePage />} />
                              
                              {/* ==================== ENHANCED FEATURES ==================== */}
                              <Route path="/profile-enhancement" element={<ProfileEnhancement />} />
                              <Route path="/community-group" element={<CommunityGroupFeatures />} />
                              <Route path="/emojis" element={<ComboEmoticonDisplay />} />
                              <Route path="/premium-pages" element={<PremiumPages />} />
                              <Route path="/creator-mode" element={<CreatorMode />} />
                              <Route path="/ai-avatar-generator" element={<AIAvatarGenerator />} />
                              <Route path="/member-landing" element={<MemberLandingPage />} />
                              <Route path="/lush-pressies" element={<LushPressiesPage />} />
                              
                              {/* ==================== DEMO & TRACKING ROUTES ==================== */}
                              <Route path="/protocol-demo" element={<ProtocolDemoPage />} />
                              <Route path="/database-dashboard" element={<DatabaseIntegrationDashboard />} />
                              <Route path="/database-report" element={<DatabaseIntegrationReportPage />} />
                              <Route path="/database-summary" element={<DatabaseIntegrationSummary />} />
                              <Route path="/cache-demo" element={<CacheDemoPage />} />
                              
                              {/* ==================== FALLBACK ==================== */}
                              <Route path="/not-found" element={<NotFoundPage />} />
                              <Route path="*" element={<Navigate to="/not-found" replace />} />
                            </Routes>
                          </ErrorBoundary>
                          </main>
                          <Footer />
                        </div>
                      </BeatwaveNGProvider>
                    </GroupProvider>
                  </PostProvider>
                </ContentProvider>
              </MonetizationProvider>
            </ProfileProvider>
          </IdentityAuthProvider>
        </AppProvider>
      </AuthProvider>
    </SuperViAuthProvider>
  </HapticFeedbackProvider>
</ToastProvider>
</Router>
  );
};

export default App;