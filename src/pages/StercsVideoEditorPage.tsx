import React from 'react';
import StercsVideoEditor from '../components/dashboard/StercsVideoEditor';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const StercsVideoEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 space-y-6 bg-slate-950">
      <StercsVideoEditor />
      <div className="mt-6">
        <PlatformOwnershipCard />
      </div>
    </div>
  );
};

export default StercsVideoEditorPage;
