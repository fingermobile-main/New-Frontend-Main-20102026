import React from 'react';
import StercsMediaLibrary from '../components/dashboard/StercsMediaLibrary';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const StercsMediaLibraryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 space-y-6 bg-slate-950">
      <StercsMediaLibrary />
      <div className="mt-6">
        <PlatformOwnershipCard />
      </div>
    </div>
  );
};

export default StercsMediaLibraryPage;
