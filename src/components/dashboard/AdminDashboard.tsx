import React, { useEffect, useState } from 'react';
interface AdminDashboardProps {
  adminId: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any | null>(null);

  useEffect(() => {
    loadDashboard();
  }, [adminId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData = {
        users: {
          total: 45678,
          active: 32145,
          newToday: 234,
          growth: 12.5
        },
        content: {
          totalPosts: 123456,
          postsToday: 567,
          flagged: 23,
          pending: 45
        },
        revenue: {
          total: 125430.50,
          thisMonth: 12345.60,
          growth: 8.3
        },
        system: {
          uptime: 99.9,
          activeSessions: 1234,
          serverLoad: 45,
          errors: 3
        }
      };
      setStats(mockData);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Failed to load dashboard data</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and management</p>
        </div>
        <button
          onClick={loadDashboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">👥</span>
            <span className={`text-sm font-medium ${stats.users.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.users.growth >= 0 ? '↑' : '↓'} {Math.abs(stats.users.growth)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats.users.total.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">{stats.users.active.toLocaleString()} active</p>
        </div>

        {/* Content Posts */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📝</span>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
              {stats.content.flagged} flagged
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Posts</p>
          <p className="text-3xl font-bold text-gray-900">{stats.content.totalPosts.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">{stats.content.postsToday} today</p>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💰</span>
            <span className={`text-sm font-medium ${stats.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenue.growth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenue.growth)}%
            </span>
          </div>
          <p className="text-sm text-green-700 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-green-900">{formatCurrency(stats.revenue.total)}</p>
          <p className="text-xs text-green-600 mt-2">{formatCurrency(stats.revenue.thisMonth)} this month</p>
        </div>

        {/* System Health */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">⚙️</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              stats.system.uptime >= 99 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {stats.system.uptime}% uptime
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">System Status</p>
          <p className="text-3xl font-bold text-gray-900">{stats.system.activeSessions}</p>
          <p className="text-xs text-gray-500 mt-2">Active sessions</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
            <div className="text-2xl mb-2">👤</div>
            <div className="font-medium text-sm">Manage Users</div>
          </button>
          
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-sm">View Reports</div>
          </button>
          
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all">
            <div className="text-2xl mb-2">🚩</div>
            <div className="font-medium text-sm">Moderation Queue</div>
          </button>
          
          <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-medium text-sm">System Settings</div>
          </button>
        </div>
      </div>

      {/* Alerts & Notifications */}
      {(stats.content.flagged > 0 || stats.system.errors > 0) && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-900 mb-3">⚠️ Action Required</h3>
          <div className="space-y-2">
            {stats.content.flagged > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-red-800">{stats.content.flagged} posts flagged for review</span>
                <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                  Review Now
                </button>
              </div>
            )}
            {stats.system.errors > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-red-800">{stats.system.errors} system errors detected</span>
                <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                  View Logs
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Today's Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 mb-1">New Users</p>
            <p className="text-2xl font-bold text-blue-900">{stats.users.newToday}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700 mb-1">New Posts</p>
            <p className="text-2xl font-bold text-purple-900">{stats.content.postsToday}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700 mb-1">Server Load</p>
            <p className="text-2xl font-bold text-green-900">{stats.system.serverLoad}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
