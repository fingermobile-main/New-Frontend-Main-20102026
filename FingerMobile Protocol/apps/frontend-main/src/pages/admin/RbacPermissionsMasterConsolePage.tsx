import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import MasterRbacPermissionsConsole from '../../components/dashboard/MasterRbacPermissionsConsole';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const RbacPermissionsMasterConsolePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12">
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <MasterRbacPermissionsConsole />
          <div className="pt-4">
            <PlatformOwnershipCard />
          </div>
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
          <a
            href="/admin/rbac-permissions"
            aria-label="RBAC Permissions Console"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
          >
            <span className="text-base">🛡️</span>
            <span>RBAC</span>
          </a>
          <button
            onClick={() => { const el = document.querySelector('input[type="text"]') as HTMLInputElement; if (el) { el.focus(); el.scrollIntoView({ behavior: 'smooth' }); } }}
            aria-label="Search RBAC"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
          >
            <span className="text-base">🔍</span>
            <span>Search</span>
          </button>
          <button
            onClick={() => window.location.reload()}
            aria-label="Reload RBAC"
            className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
          >
            <span className="text-base">🔄</span>
            <span>Sync</span>
          </button>
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
    </MainLayout>
  );
};

export default RbacPermissionsMasterConsolePage;
