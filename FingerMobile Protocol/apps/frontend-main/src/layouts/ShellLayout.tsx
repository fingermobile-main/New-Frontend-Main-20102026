import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';

export const ShellLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-50 lg:flex-row relative">
      <main className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      {/* Background audio/video mini-player hook container */}
      <div id="global-mini-player-mount" />
    </div>
  );
};
