import React, {} from 'react';
import { useAppContext } from '../../contexts/AppContext';
import AdminDashboard from '../../components/admin/AdminDashboard';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="admin-dashboard-page">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
};
export default AdminDashboardPage;
