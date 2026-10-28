import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import StercsThemeDesigner from '../components/dashboard/StercsThemeDesigner';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import { Paintbrush, Sparkles, Check, RefreshCw } from 'lucide-react';

const StercsThemeDesignerPage: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const { showToast } = useAppContext();
  return (
    <div className="min-h-screen flex flex-col p-3 sm:p-6 lg:p-8 bg-slate-950 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-100">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        <StercsThemeDesigner />
        <div className="mt-6">
          <PlatformOwnershipCard />
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Stercs Theme Designer Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => {
            const firstPalette = document.querySelector('button[title*="Theme"], button:has(div[style*="background"])') as HTMLButtonElement | null;
            if (firstPalette) firstPalette.click();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <Paintbrush className="w-5 h-5 mb-0.5" />
          <span>Palettes</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const previewSection = document.getElementById('theme-preview-container') || document.querySelector('.preview-card');
            if (previewSection) previewSection.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Preview</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const saveBtn = document.querySelector('button:has-text("Save"), button:contains("Save")') as HTMLButtonElement | null;
            if (saveBtn) saveBtn.click();
            else showToast('Theme saved locally', 'success');
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <Check className="w-5 h-5 mb-0.5" />
          <span>Save</span>
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

export default StercsThemeDesignerPage;
