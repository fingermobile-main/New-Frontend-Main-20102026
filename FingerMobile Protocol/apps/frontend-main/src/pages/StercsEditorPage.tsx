import React from 'react';
import StercsEditorDashboard from '../components/dashboard/StercsEditorDashboard';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import { Play, Code, Sparkles, RefreshCw } from 'lucide-react';

const StercsEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 py-6 px-3 sm:px-6 lg:px-8 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-100">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        <StercsEditorDashboard />
        <div className="mt-6">
          <PlatformOwnershipCard />
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Stercs Editor Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => {
            const playBtn = document.querySelector('button[title*="Play"], button:has(svg)') as HTMLButtonElement | null;
            if (playBtn) playBtn.click();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <Play className="w-5 h-5 mb-0.5" />
          <span>Preview</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
            if (textarea) textarea.focus();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
        >
          <Code className="w-5 h-5 mb-0.5" />
          <span>DSL</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const firstSnippet = document.querySelector('button:has-text("+ Insert"), button:contains("Insert")') as HTMLButtonElement | null;
            if (firstSnippet) firstSnippet.click();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>Snippets</span>
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

export default StercsEditorPage;
