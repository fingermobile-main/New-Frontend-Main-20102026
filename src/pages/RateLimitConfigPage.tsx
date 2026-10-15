import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import {
  ShieldCheckIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  // eslint-disable-next-line no-unused-vars
  ChartBarIcon,
  UserCircleIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon
} from '../icons';

interface RateLimitConfig {
  id: string;
  name: string;
  endpointPattern: string;
  userRole?: string;
  userId?: string;
  maxRequests: number;
  windowMs: number;
  isActive: boolean;
  createdAt: string;
}

const RateLimitConfigPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [configs, setConfigs] = useState<RateLimitConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newConfig, setNewConfig] = useState<Partial<RateLimitConfig>>({
    name: '',
    endpointPattern: '',
    maxRequests: 100,
    windowMs: 900000, // 15 minutes
    isActive: true
  });

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const { api } = await import('../services/api');
      const response = await api.get('/admin/rate-limit');

      const rateLimits = response.data?.limits || response.data?.rateLimits || response.data || [];

      if (Array.isArray(rateLimits) && rateLimits.length > 0) {
        setConfigs(rateLimits.map((r: any) => ({
          id: r.id,
          name: r.name,
          endpointPattern: r.endpoint_pattern || r.endpointPattern,
          maxRequests: r.max_requests || r.maxRequests || 100,
          windowMs: r.window_ms || r.windowMs || 900000,
          isActive: r.is_active !== undefined ? r.is_active : r.isActive,
          createdAt: r.created_at || r.createdAt || new Date().toISOString()
        })));
      } else {
        // Fallback simulated configs if none exist in the DB yet
        setConfigs([
          {
            id: '1',
            name: 'Default API Rate Limit',
            endpointPattern: '/api/*',
            maxRequests: 100,
            windowMs: 900000,
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ]);
      }
      setLoading(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch rate limit configs:', error);
      showToast('Failed to load rate limit configurations', 'error');
      setLoading(false);
    }
  };

  const handleCreateConfig = async () => {
    if (!newConfig.name || !newConfig.endpointPattern) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      const { api } = await import('../services/api');
      const response = await api.post('/admin/rate-limit', newConfig);

      const config = response.data?.rateLimit || response.data || {
        ...newConfig,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      setConfigs([config, ...configs]);
      setNewConfig({
        name: '',
        endpointPattern: '',
        maxRequests: 100,
        windowMs: 900000,
        isActive: true
      });
      setShowCreateModal(false);
      showToast('Rate limit configuration created', 'success');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create rate limit config:', error);
      showToast('Failed to create rate limit configuration', 'error');
    }
  };

  const handleToggleConfig = (configId: string) => {
    setConfigs(configs.map(config =>
      config.id === configId ? { ...config, isActive: !config.isActive } : config
    ));
    showToast('Configuration updated', 'success');
  };

  const handleDeleteConfig = (configId: string) => {
    if (confirm('Are you sure you want to delete this rate limit configuration?')) {
      setConfigs(configs.filter(config => config.id !== configId));
      showToast('Configuration deleted', 'success');
    }
  };

  const formatWindowMs = (ms: number): string => {
    if (ms < 60000) return `${ms / 1000}s`;
    if (ms < 3600000) return `${ms / 60000}m`;
    return `${ms / 3600000}h`;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-3 rounded-xl">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">Rate Limit Configuration</h1>
                <p className="text-gray-600">Manage dynamic rate limiting rules for API endpoints</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Rate Limit Rule
            </button>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Rules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {configs.filter(c => c.isActive).length}
                </p>
              </div>
              <ShieldCheckIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Violations (24h)</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">1,247</p>
              </div>
              <ExclamationTriangleIcon className="h-10 w-10 text-red-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Blocked IPs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">42</p>
              </div>
              <UserCircleIcon className="h-10 w-10 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Rate Limit Configurations */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {configs.map((config) => (
              <div key={config.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        config.isActive ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {config.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Endpoint Pattern</p>
                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded block">
                          {config.endpointPattern}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Max Requests</p>
                        <p className="text-sm font-medium text-gray-900">{config.maxRequests}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Time Window</p>
                        <p className="text-sm font-medium text-gray-900">{formatWindowMs(config.windowMs)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Scope</p>
                        <p className="text-sm font-medium text-gray-900">
                          {config.userRole && <span className="inline-flex items-center"><UserCircleIcon className="h-4 w-4 mr-1" />{config.userRole}</span>}
                          {config.userId && <span className="inline-flex items-center"><UserCircleIcon className="h-4 w-4 mr-1" />User #{config.userId}</span>}
                          {!config.userRole && !config.userId && <GlobeAltIcon className="h-4 w-4 inline mr-1" />}
                          {!config.userRole && !config.userId && 'Global'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Created: {new Date(config.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleToggleConfig(config.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        config.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={config.isActive ? 'Disable' : 'Enable'}
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteConfig(config.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Rate Limit Rule</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    value={newConfig.name}
                    onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                    placeholder="e.g., Premium User Rate Limit"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endpoint Pattern *
                  </label>
                  <input
                    type="text"
                    value={newConfig.endpointPattern}
                    onChange={(e) => setNewConfig({ ...newConfig, endpointPattern: e.target.value })}
                    placeholder="e.g., /api/users/* or /api/payments/process"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Use * as wildcard. Example: /api/* matches all API routes</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Requests
                    </label>
                    <input
                      type="number"
                      value={newConfig.maxRequests}
                      onChange={(e) => setNewConfig({ ...newConfig, maxRequests: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Window
                    </label>
                    <select
                      value={newConfig.windowMs}
                      onChange={(e) => setNewConfig({ ...newConfig, windowMs: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value={60000}>1 minute</option>
                      <option value={300000}>5 minutes</option>
                      <option value={600000}>10 minutes</option>
                      <option value={900000}>15 minutes</option>
                      <option value={3600000}>1 hour</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apply To
                  </label>
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.startsWith('role:')) {
                        setNewConfig({ ...newConfig, userRole: value.substring(5), userId: undefined });
                      } else if (value === 'global') {
                        setNewConfig({ ...newConfig, userRole: undefined, userId: undefined });
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="global">All Users (Global)</option>
                    <option value="role:admin">Admin Users</option>
                    <option value="role:premium">Premium Users</option>
                    <option value="role:user">Regular Users</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newConfig.isActive}
                    onChange={(e) => setNewConfig({ ...newConfig, isActive: e.target.checked })}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Enable this rule immediately
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleCreateConfig}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 transition-colors"
                >
                  Create Rule
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default RateLimitConfigPage;
