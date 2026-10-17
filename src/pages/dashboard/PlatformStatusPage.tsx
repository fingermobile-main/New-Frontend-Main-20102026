import React, { useState, useEffect } from 'react';
import { adminOperationsService, SystemHealthNode } from '../../services/adminOperationsService';
import { useAppContext } from '../../contexts/AppContext';

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
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-950 border border-green-400 font-bold dark:bg-green-900/30 dark:text-green-400 font-black">Operational</span>;
    case 'degraded':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-950 border border-amber-400 font-bold dark:bg-yellow-900/30 dark:text-yellow-400 font-black">Degraded</span>;
    case 'offline':
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-950 border border-red-400 font-bold dark:bg-red-900/30 dark:text-red-400 font-black">Offline</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-950 dark:bg-gray-800 dark:text-gray-300 border border-gray-400 font-black">Maintenance</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Operations & Node Status</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Live PostgreSQL-backed cluster telemetry and service heartbeats</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition shadow-sm text-sm"
        >
          {loading ? 'Polling Nodes...' : 'Run Diagnostics'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nodes.map((node) => (
          <div key={node.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-slate-300 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-base">{node.service_name}</h3>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-700">{node.category}</span>
              </div>
              {getStatusBadge(node.status)}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-gray-700/50 text-sm">
              <div>
                <span className="text-xs text-slate-700 block">Latency</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{node.latency_ms} ms</span>
              </div>
              <div>
                <span className="text-xs text-slate-700 block">Uptime</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{node.uptime_pct}%</span>
              </div>
              <div>
                <span className="text-xs text-slate-700 block">Version</span>
                <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{node.version}</span>
              </div>
              <div>
                <span className="text-xs text-slate-700 block">Last Check</span>
                <span className="text-xs text-gray-700 dark:text-gray-300">{node.last_check_at ? new Date(node.last_check_at).toLocaleTimeString() : 'Just now'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformStatusPage;
