import React from 'react';
import StercsEditorDashboard from '../components/dashboard/StercsEditorDashboard';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const StercsEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        <StercsEditorDashboard />
        <div className="mt-6">
          <PlatformOwnershipCard />
        </div>
      </div>
    </div>
  );
};

export default StercsEditorPage;
