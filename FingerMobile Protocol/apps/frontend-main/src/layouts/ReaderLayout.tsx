import React, { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';

export const ReaderLayout: React.FC = () => {
  const location = useLocation();

  const getHeaderTitle = () => {
    const p = location.pathname.toLowerCase();
    if (p.includes('/support') || p.includes('/help') || p.includes('/contact')) {
      return 'Support & Help Center';
    }
    if (p.includes('/privacy') || p.includes('/terms') || p.includes('/legal') || p.includes('/guidelines')) {
      return 'Legal, Privacy & Compliance Hub';
    }
    if (p.includes('/about')) {
      return 'About FingerMobile Protocol';
    }
    if (p.includes('/faq')) {
      return 'Frequently Asked Questions (FAQ)';
    }
    return 'FingerMobile Documentation';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Header with pl-14 sm:pl-28 clearance for the Sovereign Menu Trigger */}
      <header className="bg-white border-b border-slate-200 shadow-2xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto pl-14 sm:pl-28 pr-4 sm:pr-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {getHeaderTitle()}
            </h1>
            <p className="text-xs text-slate-700 font-semibold hidden sm:block">
              FingerMobile Protocol Sovereign Public Knowledge Base
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
              Verified Public Node
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="bg-white mt-8 border-t border-slate-300">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-700 font-medium">
            &copy; 2026 FingerMobile Protocol™. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
