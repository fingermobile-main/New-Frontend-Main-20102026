import { Routes, Route } from 'react-router-dom';
import React, { lazy, Suspense } from 'react';

import AdminLayout from './components/admin/AdminLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load admin pages with proper typing using unknown intermediate cast
const AdminDashboardPage = lazy(
  () => import('./pages/admin/AdminDashboardPage.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
const MemberManagementPage = lazy(
  () => import('./pages/admin/MemberManagementPage.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
const SuperAdminDashboard = lazy(
  () => import('./components/dashboard/SuperAdminDashboard.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
const UGCDashboard = lazy(
  () => import('./components/dashboard/UGCDashboard.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
const AdsDashboard = lazy(
  () => import('./components/dashboard/AdsDashboard.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
const CreatorDashboard = lazy(
  () => import('./components/dashboard/CreatorDashboard.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
const BlogsManagement = lazy(
  () => import('./components/dashboard/BlogsManagement.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
const EventsCalendar = lazy(
  () => import('./components/dashboard/EventsCalendar.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
const Messaging = lazy(
  () => import('./components/dashboard/Messaging.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
const PublishingTools = lazy(
  () => import('./components/dashboard/PublishingTools.js').then(module => ({ default: module.default as unknown as React.ComponentType<any> })),
);
// constContentManagementPage = lazy(() => import(/* @vite-ignore */ './pages/admin/ContentManagementPage'));
// constFinancialsPage = lazy(() => import(/* @vite-ignore */ './pages/admin/FinancialsPage'));
// const AnalyticsPage = lazy(() => import(/* @vite-ignore */'./pages/admin/AnalyticsPage'));
// const SettingsPage = lazy(() => import(/* @vite-ignore */ './pages/admin/SettingsPage'));

const AdminRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route
          index
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="members"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <MemberManagementPage />
            </Suspense>
          }
        />
        <Route
          path="super-admin"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <SuperAdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="ugc"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <UGCDashboard />
            </Suspense>
          }
        />
        <Route
          path="ads"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdsDashboard />
            </Suspense>
          }
        />
        <Route
          path="creator"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <CreatorDashboard />
            </Suspense>
          }
        />
        <Route
          path="blogs"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <BlogsManagement />
            </Suspense>
          }
        />
        <Route
          path="events"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <EventsCalendar />
            </Suspense>
          }
        />
        <Route
          path="messaging"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <Messaging />
            </Suspense>
          }
        />
        <Route
          path="publishing"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PublishingTools />
            </Suspense>
          }
        />
        {/* <Route path="content" element={<Suspense fallback={<LoadingSpinner />}><ContentManagementPage /></Suspense>} /> */}
        {/* <Route path="financials" element={<Suspense fallback={<LoadingSpinner />}><FinancialsPage /></Suspense>} /> */}
        {/* <Route path="analytics" element={<Suspense fallback={<LoadingSpinner />}><AnalyticsPage /></Suspense>} /> */}
        {/* <Route path="settings" element={<Suspense fallback={<LoadingSpinner />}><SettingsPage /></Suspense>} /> */}
      </Routes>
    </AdminLayout>
  );
};
export default AdminRoutes;
