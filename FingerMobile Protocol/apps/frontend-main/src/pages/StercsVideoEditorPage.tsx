import React from 'react';
import StercsVideoEditor from '../components/dashboard/StercsVideoEditor';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const StercsVideoEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 bg-slate-950">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        <StercsVideoEditor />
        <div className="mt-6">
          <PlatformOwnershipCard />
        </div>
      </div>
    </div>
  );
};

export default StercsVideoEditorPage;
