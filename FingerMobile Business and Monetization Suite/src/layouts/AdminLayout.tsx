import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-black text-emerald-400 font-mono text-sm">
      <aside className="w-72 border-r border-zinc-800 p-4 flex flex-col gap-2 shrink-0">
        <div className="text-xs text-red-500 uppercase font-black tracking-widest mb-4">PLATFORM OPS TERMINAL</div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};

export default AdminLayout;