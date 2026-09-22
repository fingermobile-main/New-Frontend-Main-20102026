import React from 'react';
import { 
  createBrowserRouter, 
  createRoutesFromElements, 
  Route,
  Navigate
} from 'react-router-dom';
import { AuthLayout } from '../layouts/AuthLayout';
import { RequireAuth, RequireRole } from '../guards/RouteGuards';

// Import only the pages that are actually used in routes
const LoginPage = React.lazy(() => import('../pages/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/RegisterPage'));
const ProfilePage = React.lazy(() => import('../pages/ProfilePage'));
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'));

// Business suite related pages
const AdminPage = React.lazy(() => import('../../AdminPage'));
const MonetizationPage = React.lazy(() => import('../../MonetizationPage'));
const RevenuePage = React.lazy(() => import('../../RevenuePage'));
const OverviewPage = React.lazy(() => import('../../OverviewPage'));
const VerificationPage = React.lazy(() => import('../../VerificationPage'));
const AffiliatePage = React.lazy(() => import('../../AffiliatePage'));

// Main router configuration
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Public Routes */}
      <Route path="login" element={
        <AuthLayout>
          <LoginPage />
        </AuthLayout>
      } />
      <Route path="register" element={
        <AuthLayout>
          <RegisterPage />
        </AuthLayout>
      } />
      
      {/* Protected routes */}
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/monetization" element={<MonetizationPage />} />
        <Route path="/revenue" element={<RevenuePage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/affiliate" element={<AffiliatePage />} />
      </Route>
      
      {/* Admin routes */}
      <Route element={<RequireRole allowedRoles={['admin']} />}>
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
);

export default router;