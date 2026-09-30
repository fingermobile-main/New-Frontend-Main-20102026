import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import DashboardCommunityManagementPage from './dashboard/community/CommunityManagementPage';

const CommunityManagementPage: React.FC = () => {
  return (
    <MainLayout pageTitle="Community Management">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <DashboardCommunityManagementPage />
      </div>
    </MainLayout>
  );
};

export default CommunityManagementPage;
