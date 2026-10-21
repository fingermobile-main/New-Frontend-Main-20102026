import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';

export const ReaderLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white"> {/* Reader layout with specified styling */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">FingerMobile Documentation</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8"> {/* Main content area */}
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="bg-white mt-8 border-t border-slate-300">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-700">
            &copy; 2025 FingerMobile. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
