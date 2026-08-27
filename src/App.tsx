import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import MainLayout from './components/layout/MainLayout';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth(); // Removed isAuthenticated since it doesn't exist in AuthContextType
  const isAuthenticated = user !== null; // Determine authentication status by checking if user is not null
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is verified (not just authenticated)
  if (!user?.isVerified) {
    return <Navigate to="/verification" replace />;
  }
  
  return children;
};

// Lazy loaded pages (only including files that exist in the project)
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const PhotosPage = lazy(() => import('./pages/PhotosPage'));
const TrendsPage = lazy(() => import('./pages/TrendsPage'));
const StorefrontPage = lazy(() => import('./pages/StorefrontPage'));
const PublishedPage = lazy(() => import('./pages/PublishedPage'));
const ProtocolDemoPage = lazy(() => import('./pages/ProtocolDemoPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Additional pages that were not previously routed
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const AccountDeletionPage = lazy(() => import('./pages/AccountDeletionPage'));
const AdminControlDashboard = lazy(() => import('./pages/AdminControlDashboard'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdvancedAnalyticsPage = lazy(() => import('./pages/AdvancedAnalyticsPage'));
const AdvancedFingerWarPage = lazy(() => import('./pages/AdvancedFingerWarPage'));
const AdvancedGiftingPage = lazy(() => import('./pages/AdvancedGiftingPage'));
const AdvancedMediaEditorPage = lazy(() => import('./pages/AdvancedMediaEditorPage'));
const AdvancedVoicePage = lazy(() => import('./pages/AdvancedVoicePage'));
const AiPlaylistPage = lazy(() => import('./pages/AiPlaylistPage'));
const AnalyticsCommercePage = lazy(() => import('./pages/AnalyticsCommercePage'));
const AuditLogAdminPage = lazy(() => import('./pages/AuditLogAdminPage'));
const BeatwaveNGPage = lazy(() => import('./pages/BeatwaveNGPage'));
const BlogsPage = lazy(() => import('./pages/BlogsPage'));
const BusinessOfficesPage = lazy(() => import('./pages/BusinessOfficesPage'));
const BusinessPageFeatures = lazy(() => import('./pages/BusinessPageFeatures'));
const CacheDemoPage = lazy(() => import('./pages/CacheDemoPage'));
const CacheManagementPage = lazy(() => import('./pages/CacheManagementPage'));
const CamusDashboardPage = lazy(() => import('./pages/CamusDashboardPage'));
const CamusPage = lazy(() => import('./pages/CamusPage'));
const CanaryAdsPage = lazy(() => import('./pages/CanaryAdsPage'));
const CanaryPage = lazy(() => import('./pages/CanaryPage'));
const CataloguePage = lazy(() => import('./pages/CataloguePage'));
const CategoryFeedPage = lazy(() => import('./pages/CategoryFeedPage'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const ComboEmoticonDisplay = lazy(() => import('./pages/ComboEmoticonDisplay'));
const CommerceDashboardPage = lazy(() => import('./pages/CommerceDashboardPage'));
const CommunitiesPage = lazy(() => import('./pages/CommunitiesPage'));
const CommunityGroupFeatures = lazy(() => import('./pages/CommunityGroupFeatures'));
const CommunityGuidelinesPage = lazy(() => import('./pages/CommunityGuidelinesPage'));
const CommunityManagementPage = lazy(() => import('./pages/CommunityManagementPage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const CommunityPageEnhanced = lazy(() => import('./pages/CommunityPageEnhanced'));
const CommunityPages = lazy(() => import('./pages/CommunityPages'));
const ConferencePage = lazy(() => import('./pages/ConferencePage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const CouponsPage = lazy(() => import('./pages/CouponsPage'));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage'));
const CreateGroupPage = lazy(() => import('./pages/CreateGroupPage'));
const CreatePostPage = lazy(() => import('./pages/CreatePostPage'));
const CreatorDashboardPage = lazy(() => import('./pages/CreatorDashboardPage'));
const CreatorInfluencePage = lazy(() => import('./pages/CreatorInfluencePage'));
const CreatorMode = lazy(() => import('./pages/CreatorMode'));
const CsvImportPage = lazy(() => import('./pages/CsvImportPage'));
const CustomerManagementPage = lazy(() => import('./pages/CustomerManagementPage'));
const Dancia4TvPage = lazy(() => import('./pages/Dancia4TvPage'));
const Dancie4TvPage = lazy(() => import('./pages/Dancie4TvPage'));
const DashboardHomePage = lazy(() => import('./pages/DashboardHomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DataImportPage = lazy(() => import('./pages/DataImportPage'));
const DataSubjectRequestPage = lazy(() => import('./pages/DataSubjectRequestPage'));
const DatabaseIntegrationDashboard = lazy(() => import('./pages/DatabaseIntegrationDashboard'));
const DatabaseIntegrationReportPage = lazy(() => import('./pages/DatabaseIntegrationReportPage'));
const DatabaseIntegrationSummary = lazy(() => import('./pages/DatabaseIntegrationSummary'));
const AIAvatarGenerator = lazy(() => import('./pages/AIAvatarGenerator'));

const App = () => {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <MainLayout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/photos" element={<PhotosPage />} />
                <Route path="/trends" element={<TrendsPage />} />
                <Route path="/storefront" element={<StorefrontPage />} />
                <Route path="/published/:id" element={<PublishedPage />} />
                <Route path="/protocol-demo" element={<ProtocolDemoPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                
                {/* Additional pages that were not previously accessible */}
                <Route path="/about-us" element={<AboutUsPage />} />
                <Route path="/account-deletion" element={<AccountDeletionPage />} />
                <Route path="/admin-control" element={
                  <ProtectedRoute>
                    <AdminControlDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin-dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/advanced-analytics" element={<AdvancedAnalyticsPage />} />
                <Route path="/advanced-fingerwar" element={<AdvancedFingerWarPage />} />
                <Route path="/advanced-gifting" element={<AdvancedGiftingPage />} />
                <Route path="/advanced-media-editor" element={<AdvancedMediaEditorPage />} />
                <Route path="/advanced-voice" element={<AdvancedVoicePage />} />
                <Route path="/ai-playlist" element={<AiPlaylistPage />} />
                <Route path="/analytics-commerce" element={<AnalyticsCommercePage />} />
                <Route path="/audit-log" element={
                  <ProtectedRoute>
                    <AuditLogAdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/beatwave-ng" element={<BeatwaveNGPage />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/business-offices" element={<BusinessOfficesPage />} />
                <Route path="/business-features" element={<BusinessPageFeatures />} />
                <Route path="/cache-demo" element={<CacheDemoPage />} />
                <Route path="/cache-management" element={
                  <ProtectedRoute>
                    <CacheManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/camus-dashboard" element={
                  <ProtectedRoute>
                    <CamusDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/camus" element={<CamusPage />} />
                <Route path="/canary-ads" element={<CanaryAdsPage />} />
                <Route path="/canary" element={<CanaryPage />} />
                <Route path="/catalogue" element={<CataloguePage />} />
                <Route path="/category-feed" element={<CategoryFeedPage />} />
                <Route path="/change-password" element={
                  <ProtectedRoute>
                    <ChangePasswordPage />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/combo-emoticon" element={<ComboEmoticonDisplay />} />
                <Route path="/commerce-dashboard" element={<CommerceDashboardPage />} />
                <Route path="/communities" element={<CommunitiesPage />} />
                <Route path="/community-features" element={<CommunityGroupFeatures />} />
                <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
                <Route path="/community-management" element={
                  <ProtectedRoute>
                    <CommunityManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/community-enhanced" element={<CommunityPageEnhanced />} />
                <Route path="/community-pages" element={<CommunityPages />} />
                <Route path="/conference" element={<ConferencePage />} />
                <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                <Route path="/coupons" element={<CouponsPage />} />
                <Route path="/course-detail" element={<CourseDetailPage />} />
                <Route path="/create-group" element={
                  <ProtectedRoute>
                    <CreateGroupPage />
                  </ProtectedRoute>
                } />
                <Route path="/create-post" element={
                  <ProtectedRoute>
                    <CreatePostPage />
                  </ProtectedRoute>
                } />
                <Route path="/creator-dashboard" element={
                  <ProtectedRoute>
                    <CreatorDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="/creator-influence" element={<CreatorInfluencePage />} />
                <Route path="/creator-mode" element={<CreatorMode />} />
                <Route path="/csv-import" element={
                  <ProtectedRoute>
                    <CsvImportPage />
                  </ProtectedRoute>
                } />
                <Route path="/customer-management" element={
                  <ProtectedRoute>
                    <CustomerManagementPage />
                  </ProtectedRoute>
                } />
                <Route path="/dancia4tv" element={<Dancia4TvPage />} />
                <Route path="/dancie4tv" element={<Dancie4TvPage />} />
                <Route path="/dashboard-home" element={<DashboardHomePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/data-import" element={
                  <ProtectedRoute>
                    <DataImportPage />
                  </ProtectedRoute>
                } />
                <Route path="/data-subject-request" element={
                  <ProtectedRoute>
                    <DataSubjectRequestPage />
                  </ProtectedRoute>
                } />
                <Route path="/database-integration-dashboard" element={
                  <ProtectedRoute>
                    <DatabaseIntegrationDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/database-integration-report" element={
                  <ProtectedRoute>
                    <DatabaseIntegrationReportPage />
                  </ProtectedRoute>
                } />
                <Route path="/database-integration-summary" element={
                  <ProtectedRoute>
                    <DatabaseIntegrationSummary />
                  </ProtectedRoute>
                } />
                <Route path="/ai-avatar-generator" element={<AIAvatarGenerator />} />
                
                {/* Catch-all route for undefined paths */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </MainLayout>
        </AuthProvider>
      </div>
    </Router>
  );
};

export default App;