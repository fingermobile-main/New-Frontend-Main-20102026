import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, RefreshCw, Sliders, Plus, ArrowLeft } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import MasterContentModerationConsole from '../../components/dashboard/MasterContentModerationConsole';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const ContentModerationMasterConsolePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <MasterContentModerationConsole />
        <div className="pt-4">
          <PlatformOwnershipCard />
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <nav
          aria-label="Content Moderation Master Console Mobile Navigation"
          className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
        >
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5 mb-0.5" />
            <span>Citadel</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const refreshBtn = document.querySelector('button:has(svg.lucide-refresh-cw)') as HTMLButtonElement | null;
              if (refreshBtn) refreshBtn.click();
            }}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 mb-0.5" />
            <span>Sync</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const spawnBtn = document.querySelector('button:has(svg.lucide-sliders)') as HTMLButtonElement | null;
              if (spawnBtn) spawnBtn.click();
            }}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <Sliders className="w-5 h-5 mb-0.5" />
            <span>Console</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/masterdashboard')}
            className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mb-0.5" />
            <span>Back</span>
          </button>
        </nav>
      </div>
    </MainLayout>
  );
};

export default ContentModerationMasterConsolePage;
