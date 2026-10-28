import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import DatabaseIntegrationReport from '../components/DatabaseIntegrationReport';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import { ServerIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const DatabaseIntegrationReportPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout pageTitle="Database Integration Report">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-300 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-900 border border-blue-400 rounded-2xl shadow-sm">
              <ServerIcon className="w-8 h-8 text-blue-700" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Database Integration Report</h1>
              <p className="text-slate-700 font-medium text-sm mt-1">
                Cluster synchronization metrics, table records, connection latency, and storage allocations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/database-integration-dashboard')}
              className="px-4 py-2 bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
            >
              <ArrowLeftIcon className="w-4 h-4 text-slate-700" /> Back to Dashboard
            </button>
          </div>
        </div>

        {/* Integration Report Card */}
        <DatabaseIntegrationReport />

        {/* Sovereign Platform Ownership Directive */}
        <PlatformOwnershipCard />

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => navigate('/database-integration-dashboard')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-blue-600 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mb-0.5 text-slate-600" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-blue-700 bg-blue-50 rounded-lg transition-colors"
          >
            <ServerIcon className="w-5 h-5 mb-0.5 text-blue-600" />
            <span>Report</span>
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-blue-600 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">⬆️</span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default DatabaseIntegrationReportPage;
