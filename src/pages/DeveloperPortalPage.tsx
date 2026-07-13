import React from 'react';
import { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { 
  CodeBracketIcon, 
  KeyIcon,
  ChartBarIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  BellAlertIcon
} from '../icons';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  requestCount: number;
  status: 'active' | 'revoked' | 'expired';
}

const DeveloperPortalPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'keys' | 'usage' | 'docs' | 'webhooks'>('keys');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      // Simulate API call to /api/developer/api-keys
      const simulatedKeys: ApiKey[] = [
        {
          id: '1',
          name: 'Production API Key',
          key: 'fk_live_*********************xyz',
          createdAt: '2026-05-15T10:30:00Z',
          lastUsed: '2026-06-10T14:22:00Z',
          requestCount: 45821,
          status: 'active'
        },
        {
          id: '2',
          name: 'Development Key',
          key: 'fk_test_*********************abc',
          createdAt: '2026-04-20T08:15:00Z',
          lastUsed: '2026-06-09T16:45:00Z',
          requestCount: 12453,
          status: 'active'
        },
        {
          id: '3',
          name: 'Old Integration Key',
          key: 'fk_live_*********************def',
          createdAt: '2026-01-10T12:00:00Z',
          lastUsed: '2026-03-15T09:30:00Z',
          requestCount: 8921,
          status: 'revoked'
        }
      ];
      
      setApiKeys(simulatedKeys);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
      showToast('Failed to load API keys', 'error');
      setLoading(false);
    }
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      showToast('Please enter a key name', 'error');
      return;
    }

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `fk_live_${Math.random().toString(36).substring(2, 15)}*********************`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      requestCount: 0,
      status: 'active'
    };

    setApiKeys([newKey, ...apiKeys]);
    setNewKeyName('');
    setShowCreateModal(false);
    showToast('API key created successfully', 'success');
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: 'revoked' as const } : key
    ));
    showToast('API key revoked', 'success');
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    showToast('API key copied to clipboard', 'success');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-3 rounded-xl">
                <CodeBracketIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">Developer Portal</h1>
                <p className="text-gray-600">Manage API keys, view usage, and access documentation</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create API Key
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto px-6 -mb-px">
              {[
                { id: 'keys', label: 'API Keys', icon: KeyIcon },
                { id: 'usage', label: 'Usage Analytics', icon: ChartBarIcon },
                { id: 'docs', label: 'Documentation', icon: DocumentTextIcon },
                { id: 'webhooks', label: 'Webhooks', icon: BellAlertIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 flex items-center ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'keys' && (
              <div>
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold text-gray-900">{apiKey.name}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                apiKey.status === 'active' ? 'bg-green-100 text-green-800' :
                                apiKey.status === 'revoked' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {apiKey.status}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <KeyIcon className="h-4 w-4 mr-1" />
                                <code className="font-mono bg-gray-100 px-2 py-1 rounded">{apiKey.key}</code>
                                <button
                                  onClick={() => handleCopyKey(apiKey.key)}
                                  className="ml-2 text-indigo-600 hover:text-indigo-800"
                                >
                                  Copy
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                              <div>Created: {new Date(apiKey.createdAt).toLocaleDateString()}</div>
                              <div>Last used: {apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : 'Never'}</div>
                              <div>Requests: {apiKey.requestCount.toLocaleString()}</div>
                            </div>
                          </div>
                          {apiKey.status === 'active' && (
                            <button
                              onClick={() => handleRevokeKey(apiKey.id)}
                              className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'usage' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Usage Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
                    <p className="text-sm opacity-90">Total Requests (30 days)</p>
                    <p className="text-3xl font-bold mt-2">125,847</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg p-6 text-white">
                    <p className="text-sm opacity-90">Success Rate</p>
                    <p className="text-3xl font-bold mt-2">99.2%</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-6 text-white">
                    <p className="text-sm opacity-90">Avg Response Time</p>
                    <p className="text-3xl font-bold mt-2">145ms</p>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500">Usage chart visualization would be here</p>
                </div>
              </div>
            )}

            {activeTab === 'docs' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Documentation</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Authentication</h4>
                    <p className="text-sm text-gray-600 mb-2">All API requests require authentication via API key in the header.</p>
                    <code className="block bg-gray-100 p-3 rounded text-sm">Authorization: Bearer YOUR_API_KEY</code>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Rate Limiting</h4>
                    <p className="text-sm text-gray-600">API calls are limited to 1000 requests per hour per API key.</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Endpoints</h4>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/users</code> - List users</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/posts</code> - Create post</li>
                      <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/analytics</code> - Get analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'webhooks' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhook Configuration</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-yellow-800">
                    Webhooks allow you to receive real-time notifications for events in the FingerMobile platform.
                  </p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Configure Webhooks
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create API Key Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create New API Key</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key Name
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateKey}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-colors"
                >
                  Create Key
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

export default DeveloperPortalPage;
