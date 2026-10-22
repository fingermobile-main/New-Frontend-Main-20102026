import React, { useState, useEffect } from 'react';
import { adminOperationsService, SystemHealthNode } from '../../services/adminOperationsService';
import { useAppContext } from '../../contexts/AppContext';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const PlatformStatusPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [nodes, setNodes] = useState<SystemHealthNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const data = await adminOperationsService.getSystemStatus();
      setNodes(data);
    } catch {
      showToast('Error loading platform status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const data = await adminOperationsService.triggerHealthCheck();
      setNodes(data);
      showToast('Health checks dispatched across all nodes', 'success');
    } catch {
      showToast('Health check failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
    case 'healthy':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">Operational</span>;
    case 'degraded':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-400">Degraded</span>;
    case 'offline':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-950 border border-rose-400">Offline</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-900 border border-slate-400">Maintenance</span>;
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Operations &amp; Node Status</h1>
          <p className="text-sm text-slate-700 mt-1 font-medium">Live PostgreSQL-backed cluster telemetry, node latency and service heartbeats</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm text-sm cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Polling Nodes...' : 'Run Diagnostics'}
        </button>
      </div>

      <PlatformOwnershipCard />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-slate-300 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{node.service_name}</h3>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-700 font-bold">{node.category}</span>
              </div>
              {getStatusBadge(node.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-gray-700/50 text-sm">
              <div>
                <span className="text-xs text-slate-700 font-bold block mb-0.5">Latency</span>
                <span className="font-bold text-slate-900 dark:text-gray-100">{node.latency_ms} ms</span>
              </div>
              <div>
                <span className="text-xs text-slate-700 font-bold block mb-0.5">Uptime</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{node.uptime_pct}%</span>
              </div>
              <div>
                <span className="text-xs text-slate-700 font-bold block mb-0.5">Version</span>
                <span className="font-mono text-xs text-slate-800 dark:text-gray-200 font-bold">{node.version}</span>
              </div>
              <div>
                <span className="text-xs text-slate-700 font-bold block mb-0.5">Last Check</span>
                <span className="text-xs text-slate-800 dark:text-gray-200 font-bold">{node.last_check_at ? new Date(node.last_check_at).toLocaleTimeString() : 'Just now'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformStatusPage;
