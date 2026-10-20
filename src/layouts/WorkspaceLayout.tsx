import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';

export const WorkspaceLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-zinc-900 text-zinc-100"> {/* Workspace layout with specified styling */}
      <header className="h-12 border-b border-zinc-800 px-4 flex items-center justify-between"> {/* Header with specified styling */}
        <span className="text-xs font-mono font-bold tracking-widest text-zinc-300">STUDIO ENVIRONMENT</span>
      </header>
      <div className="flex-1 overflow-hidden"> {/* Main content area */}
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};
