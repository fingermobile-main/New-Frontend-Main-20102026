import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ChevronRight, LayoutDashboard, Shield } from 'lucide-react';
import MasterMembersConsole from '../components/dashboard/MasterMembersConsole';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const UserMembersConsolePage: React.FC = () => {
  useEffect(() => {
    document.title = 'User & Members Sovereign RBAC Console | FingerMobile Protocol';
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Link
            to="/master-dashboard"
            className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Master Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-700 dark:text-slate-200 flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-orange-500" />
            User & Members Console
          </span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-orange-600 dark:text-orange-400 font-mono text-[11px] font-bold">
            Sovereign RBAC V4.2
          </span>
        </nav>

        {/* Permanent Platform Ownership Card */}
        <PlatformOwnershipCard />

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                <Shield className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Dedicated User & Members Governance Console
              </h1>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 max-w-3xl">
              Holistic platform member administration, role assignment (SuperAdmin &rarr; Guest), granular screen permission mapping, live session enforcement, and instant access revocation under the FingerMobile Protocol Act.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/master-dashboard?tab=members"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
            >
              Open in Master Dashboard Tab
            </Link>
          </div>
        </div>

        {/* Master Members Console Component */}
        <MasterMembersConsole />
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
        <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
          <Link
            to="/master-dashboard?tab=members"
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-orange-600 hover:text-orange-800"
          >
            <span className="text-base font-black">👥</span>
            <span>Members</span>
          </Link>
          <Link
            to="/rbac"
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            <span className="text-base font-black">🛡️</span>
            <span>RBAC</span>
          </Link>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900"
          >
            <span className="text-base font-black">⌂</span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMembersConsolePage;
