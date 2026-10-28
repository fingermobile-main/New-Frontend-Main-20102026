import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Plus, Cpu, Sliders } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import MasterTrendsSwarmConsole from '../../components/dashboard/MasterTrendsSwarmConsole';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const TrendsSwarmMasterConsolePage: React.FC = () => {
  const navigate = useNavigate();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <MainLayout>
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <MasterTrendsSwarmConsole key={refreshTrigger} />
        <div className="pt-4">
          <PlatformOwnershipCard />
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-4 md:hidden shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => setRefreshTrigger(prev => prev + 1)}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-600 font-bold"
            aria-label="Refresh Swarm"
          >
            <RefreshCw className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Refresh</span>
          </button>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Manage Trends"
          >
            <Sliders className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Manage</span>
          </button>
          <button
            onClick={() => navigate('/trends')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Trends Feed"
          >
            <Cpu className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Feed</span>
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Admin Hub"
          >
            <Plus className="w-5 h-5 mb-1 rotate-45" />
            <span className="text-[10px]">Admin</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default TrendsSwarmMasterConsolePage;
