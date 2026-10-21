import React, { useState } from 'react';
import FingerMobileEditorStudio from '../../components/editor/FingerMobileEditorStudio';
import { PlatformOwnershipCard } from '../../components/ownership/PlatformOwnershipCard';

const FingerMobileEditorStudioPage: React.FC = () => {
  const [showOwnership, setShowOwnership] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <header className="bg-slate-900 text-white p-4 shadow-lg border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">
              FingerMobile Protocol - Editor Studio
            </h1>
            <p className="text-xs text-slate-300 font-semibold mt-0.5">Visual Studio Builder & Canvas Operations</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowOwnership(prev => !prev)}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {showOwnership ? 'Hide Clearance' : 'Ownership & Clearance'}
            </button>
            <span className="text-sm font-bold text-slate-300">Super Admin Dashboard</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border border-blue-400">
              <span className="text-xs font-black text-white">SA</span>
            </div>
          </div>
        </div>
      </header>

      {showOwnership && (
        <div className="p-4 bg-slate-100 border-b border-slate-300">
          <PlatformOwnershipCard />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-slate-800 text-slate-200 px-4 py-2 text-xs font-bold flex items-center justify-between border-b border-slate-700">
          <span>Editor Studio / Builder Active Canvas</span>
          <span className="text-[11px] text-emerald-400 font-mono">Live Rendering Engine Active</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <FingerMobileEditorStudio />
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-300 font-semibold text-xs p-2 text-center border-t border-slate-800">
        FingerMobile Protocol Editor Studio v1.0 | Guardian AI Assistant Enabled
      </footer>
    </div>
  );
};

export default FingerMobileEditorStudioPage;
