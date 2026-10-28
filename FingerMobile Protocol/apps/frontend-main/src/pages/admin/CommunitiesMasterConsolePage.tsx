import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import MasterCommunitiesConsole from '../../components/dashboard/MasterCommunitiesConsole';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import {
  Layers,
  Upload,
  Plus,
  Compass
} from 'lucide-react';

export const CommunitiesMasterConsolePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <MasterCommunitiesConsole />
        <div className="pt-4">
          <PlatformOwnershipCard />
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Console"
          >
            <Layers className="w-5 h-5 text-purple-400" />
            <span className="text-[10px] font-semibold mt-0.5">Console</span>
          </button>
          <button
            onClick={() => {
              const el = document.querySelector('input[type="text"]');
              (el as HTMLInputElement)?.focus();
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Search"
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-semibold mt-0.5">Search</span>
          </button>
          <button
            onClick={() => {
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Services"
          >
            <Upload className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-semibold mt-0.5">Services</span>
          </button>
          <button
            onClick={() => navigate('/communities')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
            title="Hub"
          >
            <Plus className="w-5 h-5 text-amber-400" />
            <span className="text-[10px] font-semibold mt-0.5">Hub</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunitiesMasterConsolePage;
