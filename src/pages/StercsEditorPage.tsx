import React from 'react';
import StercsEditorDashboard from '../components/dashboard/StercsEditorDashboard';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const StercsEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 space-y-6 bg-slate-950">
      <StercsEditorDashboard />
      <div className="mt-6">
        <PlatformOwnershipCard />
      </div>
    </div>
  );
};

export default StercsEditorPage;
