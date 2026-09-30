import React, { useState, useEffect } from 'react';
import { adminOperationsService, SystemHealthNode } from '../../../services/adminOperationsService';
import { useAppContext } from '../../../contexts/AppContext';
import { CpuChipIcon } from '../../../components/icons';

const SystemStatusPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [nodes, setNodes] = useState<SystemHealthNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    try {
      setLoading(true);
      const data = await adminOperationsService.getSystemStatus();
      setNodes(data);
    } catch {
      showToast('Failed to load system nodes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerHealthCheck = async () => {
    try {
      setLoading(true);
      const data = await adminOperationsService.triggerHealthCheck();
      setNodes(data);
      showToast('All nodes pinged and refreshed successfully', 'success');
    } catch {
      showToast('Failed to ping nodes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CpuChipIcon className="w-8 h-8 text-indigo-600"/>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Status & Services</h1>
            <p className="text-sm text-gray-500">Live operational health monitoring</p>
          </div>
        </div>
        <button
          onClick={handleTriggerHealthCheck}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition"
        >
          {loading ? 'Polling...' : 'Trigger Service Heartbeats'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Overall Status</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {nodes.some(n => n.status === 'offline') ? 'System Degradation' : 'All Systems Operational'}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Monitored Nodes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{nodes.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Node Latency</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">
            {nodes.length > 0 ? Math.round(nodes.reduce((acc, curr) => acc + curr.latency_ms, 0) / nodes.length) : 12} ms
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {nodes.map((node) => (
            <div key={node.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${node.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{node.service_name}</p>
                  <p className="text-xs text-gray-400 capitalize">{node.category} &bull; {node.version}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(node.status)}`}>
                  {node.status}
                </span>
                <span className="text-xs font-mono text-gray-500">{node.latency_ms}ms</span>
                <p className="text-xs text-gray-400 hidden sm:block">
                  Checked: {node.last_check_at ? new Date(node.last_check_at).toLocaleTimeString() : 'now'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemStatusPage;
