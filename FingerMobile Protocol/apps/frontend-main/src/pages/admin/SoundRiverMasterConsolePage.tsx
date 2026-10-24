import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { MasterSoundRiverConsole } from '../../components/dashboard/MasterSoundRiverConsole';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const SoundRiverMasterConsolePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <MasterSoundRiverConsole />
        <div className="pt-4">
          <PlatformOwnershipCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default SoundRiverMasterConsolePage;
