import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteLoadingSpinner } from '../components/RouteLoadingSpinner';

export const AdminLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full bg-black text-emerald-400 font-mono text-sm"> {/* Admin layout with specified styling */}
      <aside className="w-72 border-r border-zinc-800 p-4 flex flex-col gap-2 shrink-0"> {/* Left sidebar with specified styling */}
        <div className="text-xs text-red-500 uppercase font-black tracking-widest mb-4">PLATFORM OPS TERMINAL</div>
        <nav className="space-y-1">
          <a href="/admindashboard" className="block py-2 text-emerald-400 hover:text-white">Dashboard</a>
          <a href="/moderationqueue" className="block py-2 text-emerald-400 hover:text-white">Moderation Queue</a>
          <a href="/userreports" className="block py-2 text-emerald-400 hover:text-white">User Reports</a>
          <a href="/auditlogadmin" className="block py-2 text-emerald-400 hover:text-white">Audit Logs</a>
          <a href="/rbacmanagement" className="block py-2 text-emerald-400 hover:text-white">RBAC Management</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto"> {/* Main content area */}
        <Suspense fallback={<RouteLoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
