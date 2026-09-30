import { Routes, Route } from 'react-router-dom';
import React, { lazy, Suspense, ComponentType } from 'react';

import LoadingSpinner from '../components/LoadingSpinner';
import AdminLayout from '../components/admin/AdminLayout';

const AdminDashboardPage = lazy<ComponentType<any>>(
  () => import('../pages/admin/AdminDashboardPage.js').then(module => ({ default: module.default as unknown as ComponentType<any> })),
);
const AdminMembersPage = lazy<ComponentType<any>>(() => import('../pages/admin/MemberManagementPage.js').then(module => ({ default: module.default as unknown as ComponentType<any> })));
const AdminSecurityEventsPage = lazy<ComponentType<any>>(
  () => import('../pages/admin/AdminSecurityEventsPage.js').then(module => ({ default: module.default as unknown as ComponentType<any> })),
);
const AdminSecuritySettingsPage = lazy<ComponentType<any>>(
  () => import('../pages/admin/AdminSecuritySettingsPage.js').then(module => ({ default: module.default as unknown as ComponentType<any> })),
);

const AdminRoutes: React.FC = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/dashboard" element={<AdminDashboardPage />} />
          <Route path="/members" element={<AdminMembersPage />} />
          <Route
            path="/security-events"
            element={<AdminSecurityEventsPage />}
          />
          <Route
            path="/security-settings"
            element={<AdminSecuritySettingsPage />}
          />
          {/* Add other admin routes here */}
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default AdminRoutes;
