import React from 'react';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import AdminDashboard from '../../components/admin/AdminDashboard';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="admin-dashboard-page w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12 max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PlatformOwnershipCard />
      <AdminDashboard />

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <a
          href="/admin"
          aria-label="Admin Home"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🏢</span>
          <span>Admin</span>
        </a>
        <a
          href="/admin/security-events"
          aria-label="Security Events"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🛡️</span>
          <span>Security</span>
        </a>
        <a
          href="/admin/users"
          aria-label="User Admin"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">👥</span>
          <span>Users</span>
        </a>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
