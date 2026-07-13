import React from 'react';
import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { 
  CircleStackIcon, 
  ArrowPathIcon,
  ChartBarIcon,
  TrashIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '../icons';

interface CacheStats {
  totalKeys: number;
  usedMemory: string;
  hitRate: number;
  missRate: number;
  evictedKeys: number;
  connectedClients: number;
}

interface CacheKey {
  key: string;
  type: string;
  ttl: number | null;
  size: string;
  lastAccessed: string;
}

const CacheManagementPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [stats, setStats] = useState<CacheStats>({
    totalKeys: 0,
    usedMemory: '0MB',
    hitRate: 0,
    missRate: 0,
    evictedKeys: 0,
    connectedClients: 0
  });
  const [cacheKeys, setCacheKeys] = useState<CacheKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'keys' | 'analytics'>('overview');
  const [searchPattern, setSearchPattern] = useState('');
  const [invalidationPattern, setInvalidationPattern] = useState('');

  useEffect(() => {
    fetchCacheStats();
    fetchCacheKeys();
  }, []);

  const fetchCacheStats = async () => {
    try {
      // Simulate API call to get cache statistics
      const simulatedStats: CacheStats = {
        totalKeys: 15847,
        usedMemory: '245.6MB',
        hitRate: 94.2,
        missRate: 5.8,
        evictedKeys: 1243,
        connectedClients: 12
      };
      
      setStats(simulatedStats);
    } catch (error) {
      console.error('Failed to fetch cache stats:', error);
      showToast('Failed to load cache statistics', 'error');
    }
  };

  const fetchCacheKeys = async () => {
    try {
      setLoading(true);
      // Simulate API call to list cache keys
      const simulatedKeys: CacheKey[] = [
        { key: 'user:123:profile', type: 'hash', ttl: 3600, size: '2.4KB', lastAccessed: '2026-06-10T14:30:00Z' },
        { key: 'session:abc123xyz', type: 'string', ttl: 1800, size: '1.2KB', lastAccessed: '2026-06-10T14:28:00Z' },
        { key: 'post:456:comments', type: 'list', ttl: 900, size: '15.8KB', lastAccessed: '2026-06-10T14:25:00Z' },
        { key: 'analytics:daily:2026-06-10', type: 'hash', ttl: 86400, size: '8.3KB', lastAccessed: '2026-06-10T14:20:00Z' },
        { key: 'widget:user:789:layout', type: 'string', ttl: null, size: '3.1KB', lastAccessed: '2026-06-10T14:15:00Z' },
        { key: 'rate_limit:ip:192.168.1.100', type: 'string', ttl: 60, size: '0.5KB', lastAccessed: '2026-06-10T14:29:00Z' },
        { key: 'search:results:query_xyz', type: 'string', ttl: 300, size: '12.7KB', lastAccessed: '2026-06-10T14:22:00Z' },
        { key: 'notification:user:456:unread', type: 'set', ttl: null, size: '4.2KB', lastAccessed: '2026-06-10T14:18:00Z' }
      ];
      
      setCacheKeys(simulatedKeys);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch cache keys:', error);
      showToast('Failed to load cache keys', 'error');
      setLoading(false);
    }
  };

  const handleInvalidateCache = () => {
    if (!invalidationPattern.trim()) {
      showToast('Please enter a pattern to invalidate', 'error');
      return;
    }

    if (confirm(`Are you sure you want to invalidate all keys matching "${invalidationPattern}"?`)) {
      // Simulate cache invalidation
      const matchedKeys = cacheKeys.filter(k => k.key.includes(invalidationPattern));
      setCacheKeys(cacheKeys.filter(k => !k.key.includes(invalidationPattern)));
      showToast(`Invalidated ${matchedKeys.length} cache keys`, 'success');
      setInvalidationPattern('');
      fetchCacheStats();
    }
  };

  const handleFlushAll = () => {
    if (confirm('WARNING: This will delete ALL cache data. Are you absolutely sure?')) {
      setCacheKeys([]);
      setStats({ ...stats, totalKeys: 0, usedMemory: '0MB' });
      showToast('All cache data has been flushed', 'success');
    }
  };

  const handleDeleteKey = (key: string) => {
    setCacheKeys(cacheKeys.filter(k => k.key !== key));
    showToast(`Cache key deleted: ${key}`, 'success');
    fetchCacheStats();
  };

  const filteredKeys = searchPattern 
    ? cacheKeys.filter(k => k.key.toLowerCase().includes(searchPattern.toLowerCase()))
    : cacheKeys;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-3 rounded-xl">
                <CircleStackIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">Cache Management</h1>
                <p className="text-gray-600">Monitor and manage Redis cache performance</p>
              </div>
            </div>
            <button
              onClick={() => { fetchCacheStats(); fetchCacheKeys(); }}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Total Keys</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalKeys.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Memory Used</p>
            <p className="text-2xl font-bold text-gray-900">{stats.usedMemory}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Hit Rate</p>
            <p className="text-2xl font-bold text-green-600">{stats.hitRate}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Miss Rate</p>
            <p className="text-2xl font-bold text-red-600">{stats.missRate}%</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Evicted Keys</p>
            <p className="text-2xl font-bold text-gray-900">{stats.evictedKeys.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4">
            <p className="text-xs font-medium text-gray-600 mb-1">Clients</p>
            <p className="text-2xl font-bold text-gray-900">{stats.connectedClients}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto px-6 -mb-px">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'keys', label: 'Cache Keys' },
                { id: 'analytics', label: 'Analytics' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-teal-500 text-teal-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Cache Invalidation */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Invalidation</h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={invalidationPattern}
                      onChange={(e) => setInvalidationPattern(e.target.value)}
                      placeholder="Enter pattern (e.g., user:*, session:*)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleInvalidateCache}
                      className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Invalidate
                    </button>
                    <button
                      onClick={handleFlushAll}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Flush All
                    </button>
                  </div>
                  <p className="text-sm text-yellow-800 mt-2">
                    Use * as wildcard. Example: user:* matches all user-related keys
                  </p>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-semibold mb-2">Cache Efficiency</h4>
                    <div className="flex items-end space-x-2">
                      <span className="text-5xl font-bold">{stats.hitRate}%</span>
                      <span className="text-xl opacity-90">hit rate</span>
                    </div>
                    <p className="text-sm mt-2 opacity-90">Excellent cache performance</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
                    <h4 className="text-lg font-semibold mb-2">Memory Usage</h4>
                    <div className="flex items-end space-x-2">
                      <span className="text-5xl font-bold">{stats.usedMemory}</span>
                    </div>
                    <p className="text-sm mt-2 opacity-90">Across {stats.totalKeys.toLocaleString()} keys</p>
                  </div>
                </div>

                {/* Cache Strategy Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Cache Strategy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                      <strong>Default TTL:</strong> 1 hour (3600s)
                    </div>
                    <div>
                      <strong>Max Memory:</strong> 512MB
                    </div>
                    <div>
                      <strong>Eviction Policy:</strong> allkeys-lru
                    </div>
                    <div>
                      <strong>Persistence:</strong> RDB snapshots every 15min
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'keys' && (
              <div>
                {/* Search */}
                <div className="mb-4">
                  <input
                    type="text"
                    value={searchPattern}
                    onChange={(e) => setSearchPattern(e.target.value)}
                    placeholder="Search cache keys..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                {/* Keys Table */}
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            TTL
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Accessed
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredKeys.map((cacheKey) => (
                          <tr key={cacheKey.key} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              {cacheKey.key}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {cacheKey.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {cacheKey.ttl ? (
                                <span className="flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
                                  {cacheKey.ttl}s
                                </span>
                              ) : (
                                <span className="text-gray-400">No expiry</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {cacheKey.size}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(cacheKey.lastAccessed).toLocaleTimeString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => handleDeleteKey(cacheKey.key)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Analytics</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Hit/Miss Ratio Over Time</h4>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500">Chart visualization would be here</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Memory Usage Trend</h4>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <p className="text-gray-500">Chart visualization would be here</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Top Cached Keys by Access Frequency</h4>
                  <div className="space-y-3">
                    {cacheKeys.slice(0, 5).map((key, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <code className="text-sm font-mono text-gray-900">{key.key}</code>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-gray-600">{key.size}</span>
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CacheManagementPage;
