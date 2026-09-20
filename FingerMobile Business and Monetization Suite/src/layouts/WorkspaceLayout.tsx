import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';

export const WorkspaceLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-zinc-900 text-zinc-100">
      <header className="h-12 border-b border-zinc-800 px-4 flex items-center justify-between">
        <span className="text-xs font-mono tracking-widest text-zinc-400">STUDIO ENVIRONMENT</span>
      </header>
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default WorkspaceLayout;