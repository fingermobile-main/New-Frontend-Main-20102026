import React from 'react';
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route,
  Navigate
} from 'react-router-dom';
import { ShellLayout } from '../layouts/ShellLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { RequireAuth, RequireRole } from '../guards/RouteGuards';

// Existing page components
const HomePage = React.lazy(() => import('../pages/Home'));
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));
const ProfilePage = React.lazy(() => import('../pages/ProfilePage'));
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'));

// Placeholder components for missing pages
const AdminLoginPage = React.lazy(() => import('../pages/LoginPage')); // Using existing login as placeholder
const VerificationPage = React.lazy(() => Promise.resolve({ default: () => <div>Verification Page</div> }));
const SecuritySetupPage = React.lazy(() => Promise.resolve({ default: () => <div>Security Setup Page</div> }));
const ChangePasswordPage = React.lazy(() => Promise.resolve({ default: () => <div>Change Password Page</div> }));
const AccountDeletionPage = React.lazy(() => Promise.resolve({ default: () => <div>Account Deletion Page</div> }));
const DataSubjectRequestPage = React.lazy(() => Promise.resolve({ default: () => <div>Data Subject Request Page</div> }));
const CheckoutPage = React.lazy(() => Promise.resolve({ default: () => <div>Checkout Page</div> }));
const DiscoverPage = React.lazy(() => Promise.resolve({ default: () => <div>Discover Page</div> }));
const MarketplacePage = React.lazy(() => Promise.resolve({ default: () => <div>Marketplace Page</div> }));
const WalletPage = React.lazy(() => Promise.resolve({ default: () => <div>Wallet Page</div> }));
const AdminDashboardPage = React.lazy(() => import('../pages/DashboardPage')); // Using existing dashboard as placeholder
const ContentAdminDashboardPage = React.lazy(() => Promise.resolve({ default: () => <div>Content Admin Dashboard Page</div> }));
const ModerationQueuePage = React.lazy(() => Promise.resolve({ default: () => <div>Moderation Queue Page</div> }));
const UserReportsPage = React.lazy(() => Promise.resolve({ default: () => <div>User Reports Page</div> }));
const AuditLogAdminPage = React.lazy(() => Promise.resolve({ default: () => <div>Audit Log Admin Page</div> }));
const RbacManagementPage = React.lazy(() => Promise.resolve({ default: () => <div>RBAC Management Page</div> }));
const CreatorStudioPage = React.lazy(() => Promise.resolve({ default: () => <div>Creator Studio Page</div> }));

// Legal pages
const PrivacyPolicyPage = React.lazy(() => Promise.resolve({ default: () => <div>Privacy Policy Page</div> }));
const TermsOfServicePage = React.lazy(() => Promise.resolve({ default: () => <div>Terms of Service Page</div> }));
const CookiePolicyPage = React.lazy(() => Promise.resolve({ default: () => <div>Cookie Policy Page</div> }));
const CommunityGuidelinesPage = React.lazy(() => Promise.resolve({ default: () => <div>Community Guidelines Page</div> }));

// Business suite pages
const BusinessSuiteDashboard = React.lazy(() => Promise.resolve({ default: () => <div>Business Suite Dashboard</div> }));
const AffiliateManagement = React.lazy(() => Promise.resolve({ default: () => <div>Affiliate Management</div> }));
const CommissionTracking = React.lazy(() => Promise.resolve({ default: () => <div>Commission Tracking</div> }));
const PayoutManagement = React.lazy(() => Promise.resolve({ default: () => <div>Payout Management</div> }));
const PerformanceAnalytics = React.lazy(() => Promise.resolve({ default: () => <div>Performance Analytics</div> }));

// Creator studio pages
const ContentCreation = React.lazy(() => Promise.resolve({ default: () => <div>Content Creation</div> }));
const MediaLibrary = React.lazy(() => Promise.resolve({ default: () => <div>Media Library</div> }));

// Main router configuration
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Public Routes */}
      <Route path="login" element={
        <AuthLayout>
          <AdminLoginPage />
        </AuthLayout>
      } />
      <Route path="register" element={
        <AuthLayout>
          <AdminLoginPage /> {/* Using same component for registration */}
        </AuthLayout>
      } />
      
      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        <Route path="/" element={
          <ShellLayout>
            <HomePage />
          </ShellLayout>
        } />
        
        <Route path="/discover" element={
          <ShellLayout>
            <DiscoverPage />
          </ShellLayout>
        } />
        
        <Route path="/marketplace" element={
          <ShellLayout>
            <MarketplacePage />
          </ShellLayout>
        } />
        
        <Route path="/wallet" element={
          <ShellLayout>
            <WalletPage />
          </ShellLayout>
        } />
        
        <Route path="/verification" element={
          <ShellLayout>
            <VerificationPage />
          </ShellLayout>
        } />
        
        <Route path="/security-setup" element={
          <ShellLayout>
            <SecuritySetupPage />
          </ShellLayout>
        } />
        
        <Route path="/change-password" element={
          <ShellLayout>
            <ChangePasswordPage />
          </ShellLayout>
        } />
        
        <Route path="/account-deletion" element={
          <ShellLayout>
            <AccountDeletionPage />
          </ShellLayout>
        } />
        
        <Route path="/data-subject-request" element={
          <ShellLayout>
            <DataSubjectRequestPage />
          </ShellLayout>
        } />
        
        <Route path="/checkout" element={
          <ShellLayout>
            <CheckoutPage />
          </ShellLayout>
        } />
        
        {/* Business Suite Routes */}
        <Route path="/business-suite/dashboard" element={
          <ShellLayout>
            <BusinessSuiteDashboard />
          </ShellLayout>
        } />
        
        <Route path="/business-suite/affiliate-management" element={
          <ShellLayout>
            <AffiliateManagement />
          </ShellLayout>
        } />
        
        <Route path="/business-suite/commission-tracking" element={
          <ShellLayout>
            <CommissionTracking />
          </ShellLayout>
        } />
        
        <Route path="/business-suite/payout-management" element={
          <ShellLayout>
            <PayoutManagement />
          </ShellLayout>
        } />
        
        <Route path="/business-suite/performance-analytics" element={
          <ShellLayout>
            <PerformanceAnalytics />
          </ShellLayout>
        } />
        
        {/* Creator Studio Routes */}
        <Route path="/creator-studio" element={
          <ShellLayout>
            <CreatorStudioPage />
          </ShellLayout>
        } />
        
        <Route path="/creator-studio/content-creation" element={
          <ShellLayout>
            <ContentCreation />
          </ShellLayout>
        } />
        
        <Route path="/creator-studio/media-library" element={
          <ShellLayout>
            <MediaLibrary />
          </ShellLayout>
        } />
        
        {/* Removed routes for missing components */}
        {/* 
        <Route path="/creator-studio/analytics-overview" element={
          <ShellLayout>
            <AnalyticsOverview />
          </ShellLayout>
        } />
        
        <Route path="/creator-studio/monetization-tools" element={
          <ShellLayout>
            <MonetizationTools />
          </ShellLayout>
        } />
        */}
        
        {/* Legal Routes */}
        <Route path="/legal/privacy-policy" element={
          <ShellLayout>
            <PrivacyPolicyPage />
          </ShellLayout>
        } />
        
        <Route path="/legal/terms-of-service" element={
          <ShellLayout>
            <TermsOfServicePage />
          </ShellLayout>
        } />
        
        <Route path="/legal/cookie-policy" element={
          <ShellLayout>
            <CookiePolicyPage />
          </ShellLayout>
        } />
        
        <Route path="/legal/community-guidelines" element={
          <ShellLayout>
            <CommunityGuidelinesPage />
          </ShellLayout>
        } />
        
        {/* Admin Routes - Require Admin Role */}
        <Route element={<RequireRole allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={
            <ShellLayout>
              <AdminDashboardPage />
            </ShellLayout>
          } />
          
          <Route path="/admin/content-dashboard" element={
            <ShellLayout>
              <ContentAdminDashboardPage />
            </ShellLayout>
          } />
          
          <Route path="/admin/moderation-queue" element={
            <ShellLayout>
              <ModerationQueuePage />
            </ShellLayout>
          } />
          
          <Route path="/admin/user-reports" element={
            <ShellLayout>
              <UserReportsPage />
            </ShellLayout>
          } />
          
          <Route path="/admin/audit-log" element={
            <ShellLayout>
              <AuditLogAdminPage />
            </ShellLayout>
          } />
          
          <Route path="/admin/rbac-management" element={
            <ShellLayout>
              <RbacManagementPage />
            </ShellLayout>
          } />
          
          {/* Removed routes for missing components */}
          {/* 
          <Route path="/admin/user-management" element={
            <ShellLayout>
              <UserManagement />
            </ShellLayout>
          } />
          
          <Route path="/admin/content-moderation" element={
            <ShellLayout>
              <ContentModeration />
            </ShellLayout>
          } />
          
          <Route path="/admin/system-configuration" element={
            <ShellLayout>
              <SystemConfiguration />
            </ShellLayout>
          } />
          
          <Route path="/admin/reports-analytics" element={
            <ShellLayout>
              <ReportsAndAnalytics />
            </ShellLayout>
          } />
          */}
        </Route>
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

export default router;