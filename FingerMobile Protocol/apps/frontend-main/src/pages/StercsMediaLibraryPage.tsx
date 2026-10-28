import React from 'react';
import StercsMediaLibrary from '../components/dashboard/StercsMediaLibrary';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import { Folder, Upload, Image, RefreshCw } from 'lucide-react';

const StercsMediaLibraryPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col p-3 sm:p-6 lg:p-8 bg-slate-950 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-100">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        <StercsMediaLibrary />
        <div className="mt-6">
          <PlatformOwnershipCard />
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Stercs Media Library Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => {
            const allBtn = document.querySelector('button:has-text("All"), button:contains("All")') as HTMLButtonElement | null;
            if (allBtn) allBtn.click();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <Folder className="w-5 h-5 mb-0.5" />
          <span>Library</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const imgBtn = document.querySelector('button:has-text("Images"), button:contains("Images")') as HTMLButtonElement | null;
            if (imgBtn) imgBtn.click();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
        >
          <Image className="w-5 h-5 mb-0.5" />
          <span>Images</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const uploadBtn = document.querySelector('button:has-text("Upload"), button:contains("Upload")') as HTMLButtonElement | null;
            if (uploadBtn) uploadBtn.click();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <Upload className="w-5 h-5 mb-0.5" />
          <span>Upload</span>
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className="w-5 h-5 mb-0.5" />
          <span>Sync</span>
        </button>
      </nav>
    </div>
  );
};

export default StercsMediaLibraryPage;
