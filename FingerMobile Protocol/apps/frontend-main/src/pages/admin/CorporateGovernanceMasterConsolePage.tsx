import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import MasterCorporateGovernanceConsole from '../../components/dashboard/MasterCorporateGovernanceConsole';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const CorporateGovernanceMasterConsolePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <MasterCorporateGovernanceConsole />
        <div className="pt-4">
          <PlatformOwnershipCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default CorporateGovernanceMasterConsolePage;
