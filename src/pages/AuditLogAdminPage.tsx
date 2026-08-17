import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";
import { 
  ShieldCheckIcon, 
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ClockIcon,
  DownloadIcon,
  FunnelIcon,
  ExclamationTriangleIcon,
  UserCircleIcon,
  DocumentTextIcon
} from '../icons';

interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ipAddress: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

const AuditLogAdminPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    user: '',
    action: '',
    resourceType: ''
  });
  const [stats, setStats] = useState({
    totalLogs: 0,
    todayLogs: 0,
    uniqueUsers: 0,
    topActions: [] as string[]
  });

  useEffect(() => {
    fetchAuditLogs();
    fetchStats();
  }, [filters]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      // Simulate API call to /api/admin/audit-logs
      const simulatedLogs: AuditLog[] = [
        {
          id: '1',
          userId: 'user123',
          username: 'john.doe',
          action: 'USER_LOGIN',
          resourceType: 'authentication',
          resourceId: 'session_abc123',
          ipAddress: '192.168.1.100',
          timestamp: '2026-06-10T14:30:00Z'
        },
        {
          id: '2',
          userId: 'admin456',
          username: 'admin.user',
          action: 'ROLE_UPDATED',
          resourceType: 'user',
          resourceId: 'user789',
          ipAddress: '10.0.0.50',
          timestamp: '2026-06-10T13:15:00Z',
          details: { oldRole: 'user', newRole: 'admin' }
        },
        {
          id: '3',
          userId: 'user789',
          username: 'jane.smith',
          action: 'POST_CREATED',
          resourceType: 'post',
          resourceId: 'post_456',
          ipAddress: '172.16.0.25',
          timestamp: '2026-06-10T12:45:00Z'
        },
        {
          id: '4',
          userId: 'user101',
          username: 'bob.wilson',
          action: 'PAYMENT_PROCESSED',
          resourceType: 'payment',
          resourceId: 'pay_789xyz',
          ipAddress: '192.168.1.105',
          timestamp: '2026-06-10T11:20:00Z',
          details: { amount: 99.99, currency: 'USD' }
        },
        {
          id: '5',
          userId: 'admin456',
          username: 'admin.user',
          action: 'SETTINGS_UPDATED',
          resourceType: 'system',
          resourceId: 'config_general',
          ipAddress: '10.0.0.50',
          timestamp: '2026-06-10T10:00:00Z'
        }
      ];
      
      setLogs(simulatedLogs);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
      showToast('Failed to load audit logs', 'error');
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    // Simulate stats fetch
    setStats({
      totalLogs: 45821,
      todayLogs: 1247,
      uniqueUsers: 342,
      topActions: ['USER_LOGIN', 'POST_CREATED', 'PAYMENT_PROCESSED']
    });
  };

  const handleExportLogs = () => {
    const csvContent = [
      ['ID', 'User', 'Action', 'Resource Type', 'IP Address', 'Timestamp'].join(','),
      ...logs.map(log => [
        log.id,
        log.username,
        log.action,
        log.resourceType,
        log.ipAddress,
        new Date(log.timestamp).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showToast('Audit logs exported successfully', 'success');
  };

  const handleCleanupLogs = () => {
    if (confirm('Are you sure you want to delete logs older than 90 days? This action cannot be undone.')) {
      showToast('Cleanup job scheduled. Old logs will be deleted.', 'success');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-xl">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">Audit Log Administration</h1>
                <p className="text-gray-600">Monitor and manage system audit trails</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleExportLogs}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DownloadIcon className="h-5 w-5 mr-2" />
                Export CSV
              </button>
              <button
                onClick={handleCleanupLogs}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cleanup Old Logs
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalLogs.toLocaleString()}</p>
              </div>
              <DocumentTextIcon className="h-10 w-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Logs</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayLogs.toLocaleString()}</p>
              </div>
              <ClockIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uniqueUsers}</p>
              </div>
              <UserCircleIcon className="h-10 w-10 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Action</p>
                <p className="text-lg font-bold text-gray-900 mt-2">{stats.topActions[0]}</p>
              </div>
              <ExclamationTriangleIcon className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={filters.user}
                onChange={(e) => setFilters({ ...filters, user: e.target.value })}
                placeholder="Search user..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Actions</option>
                <option value="USER_LOGIN">User Login</option>
                <option value="POST_CREATED">Post Created</option>
                <option value="PAYMENT_PROCESSED">Payment Processed</option>
                <option value="ROLE_UPDATED">Role Updated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
              <select
                value={filters.resourceType}
                onChange={(e) => setFilters({ ...filters, resourceType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Resources</option>
                <option value="user">User</option>
                <option value="post">Post</option>
                <option value="payment">Payment</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{log.username}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>
                          <span className="font-medium">{log.resourceType}</span>
                          <span className="text-gray-500 ml-2">#{log.resourceId}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {log.details ? (
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{logs.length}</span> of{' '}
                <span className="font-medium">{logs.length}</span> results
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default AuditLogAdminPage;
