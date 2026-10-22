import React from 'react';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import AdminDashboard from '../../components/admin/AdminDashboard';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="admin-dashboard-page w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PlatformOwnershipCard />
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;
