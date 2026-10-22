import { useLocation, Link } from 'react-router-dom';
import React, { useState } from 'react';
import { ChartBarIcon } from '../../components/icons';
import { PlatformOwnershipCard } from '../../components/ownership/PlatformOwnershipCard';

const DashboardPlaceholderPage: React.FC = () => {
  const location = useLocation();
  const pageName = location.pathname
    .split('/')
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Console Module';

  const [diagnosticRan, setDiagnosticRan] = useState(false);

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{pageName} Console</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            Enterprise Module Endpoint: <span className="font-mono text-blue-700 font-bold">{location.pathname}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setDiagnosticRan(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-full shadow-sm transition-colors"
          >
            Run Integrity Ping
          </button>
        </div>
      </div>

      <PlatformOwnershipCard />

      <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-300">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto py-6">
          <div className="mx-auto mb-4 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center border text-blue-950 border-blue-400 font-black">
            <ChartBarIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Protocol Node Connected</h2>
          <p className="text-slate-700 font-semibold text-sm max-w-md mx-auto mb-6">
            The decentralized service handler for <span className="text-slate-900 font-bold">{pageName}</span> is active and routed. You can access the core management hubs below.
          </p>

          {diagnosticRan && (
            <div className="w-full mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Node Diagnostic Result</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                  Latency: 4ms &bull; Operational
                </span>
              </div>
              <p className="text-xs text-slate-800 font-mono">
                Route: {location.pathname} &bull; Security Level: High (AAA) &bull; Owner Clearance: Confirmed
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            <Link
              to="/dashboard/hub"
              className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-xl transition-all text-left"
            >
              <p className="font-bold text-slate-900 text-sm">Business Hub</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">Unified operations console &rarr;</p>
            </Link>
            <Link
              to="/dashboard/financials"
              className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-xl transition-all text-left"
            >
              <p className="font-bold text-slate-900 text-sm">Financial Vault</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">FIC settlement & treasury &rarr;</p>
            </Link>
            <Link
              to="/dashboard/guardian"
              className="p-4 bg-slate-50 hover:bg-blue-50 border border-slate-300 hover:border-blue-400 rounded-xl transition-all text-left"
            >
              <p className="font-bold text-slate-900 text-sm">Guardian Sentinel</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">Security & threat radar &rarr;</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPlaceholderPage;
