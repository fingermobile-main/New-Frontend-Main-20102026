import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StercsVideoEditor from '../components/dashboard/StercsVideoEditor';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import { Video, Film, Scissors, Sparkles, Layers, ArrowLeft } from 'lucide-react';

const StercsVideoEditorPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col p-3 sm:p-6 lg:p-8 bg-slate-950 text-white w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-6">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Link
              to="/videos"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition"
              aria-label="Back to Videos Gallery"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/80 text-red-300 border border-red-800/80 text-[11px] font-black uppercase mb-1">
                Stercs &bull; Professional Video Studio
              </div>
              <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">Timeline Video Editor</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/stercs/media-library"
              className="min-h-[44px] inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition active:scale-95"
            >
              <Layers className="w-4 h-4 mr-1.5 text-blue-400" />
              Media Library
            </Link>
          </div>
        </div>

        <StercsVideoEditor />

        <div className="mt-6">
          <PlatformOwnershipCard />
        </div>
      </div>

      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="stercs-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <Link
          to="/videos"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black text-slate-400 hover:text-white transition-colors"
        >
          <Film className="w-5 h-5 mb-0.5" />
          <span>Videos</span>
        </Link>

        <button
          onClick={() => {
            const splitBtn = document.querySelector('[data-testid="stercs-split-btn"]') as HTMLButtonElement;
            if (splitBtn) splitBtn.click();
          }}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black text-red-400 hover:text-red-300 transition-colors"
        >
          <Scissors className="w-5 h-5 mb-0.5" />
          <span>Cut</span>
        </button>

        <button
          onClick={() => {
            const transBtn = document.querySelector('[data-testid="stercs-transition-btn"]') as HTMLButtonElement;
            if (transBtn) transBtn.click();
          }}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 rounded-xl text-[10px] font-black text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span>FX</span>
        </button>

        <Link
          to="/stercs/media-library"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-[10px] font-black text-white shadow-md active:scale-95 transition"
        >
          <Layers className="w-5 h-5 mb-0.5" />
          <span>Media</span>
        </Link>
      </div>
    </div>
  );
};

export default StercsVideoEditorPage;
