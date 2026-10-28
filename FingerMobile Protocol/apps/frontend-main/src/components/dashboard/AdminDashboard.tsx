import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
interface AdminDashboardProps {
  adminId: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminId }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any | null>(null);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, [adminId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
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
      setError(err instanceof Error ? err.message : 'Failed to load admin dashboard');
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
    <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-slate-700 mt-1">Platform overview and management</p>
        </div>
        <button
          onClick={loadDashboard}
          className="min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
        >
          Refresh Data
        </button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white border border-slate-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">👥</span>
            <span className={`text-sm font-medium ${stats.users.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.users.growth >= 0 ? '↑' : '↓'} {Math.abs(stats.users.growth)}%
            </span>
          </div>
          <p className="text-sm text-slate-700 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{stats.users.total.toLocaleString()}</p>
          <p className="text-xs text-slate-700 mt-2">{stats.users.active.toLocaleString()} active</p>
        </div>

        {/* Content Posts */}
        <div className="bg-white border border-slate-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">📝</span>
            <span className="px-2 py-1 bg-amber-100 text-amber-950 border border-amber-400 font-bold rounded-full text-xs">
              {stats.content.flagged} flagged
            </span>
          </div>
          <p className="text-sm text-slate-700 mb-1">Total Posts</p>
          <p className="text-3xl font-bold text-gray-900">{stats.content.totalPosts.toLocaleString()}</p>
          <p className="text-xs text-slate-700 mt-2">{stats.content.postsToday} today</p>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💰</span>
            <span className={`text-sm font-medium ${stats.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenue.growth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenue.growth)}%
            </span>
          </div>
          <p className="text-sm text-green-800 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-green-950">{formatCurrency(stats.revenue.total)}</p>
          <p className="text-xs text-green-800 mt-2">{formatCurrency(stats.revenue.thisMonth)} this month</p>
        </div>

        {/* System Health */}
        <div className="bg-white border border-slate-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">⚙️</span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              stats.system.uptime >= 99 ? 'bg-green-100 text-green-950 border border-green-400' : 'bg-red-100 text-red-950 border border-red-400'
            }`}>
              {stats.system.uptime}% uptime
            </span>
          </div>
          <p className="text-sm text-slate-700 mb-1">System Status</p>
          <p className="text-3xl font-bold text-gray-900">{stats.system.activeSessions}</p>
          <p className="text-xs text-slate-700 mt-2">Active sessions</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-slate-300 rounded-lg p-6">
        <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link
            to="/admin/rbac"
            className="p-4 border-2 border-slate-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center block min-h-[44px]"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="font-bold text-sm text-slate-900">Manage Users</div>
          </Link>

          <Link
            to="/analytics"
            className="p-4 border-2 border-slate-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center block min-h-[44px]"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-bold text-sm text-slate-900">View Reports</div>
          </Link>

          <Link
            to="/moderation"
            className="p-4 border-2 border-slate-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all text-center block min-h-[44px]"
          >
            <div className="text-2xl mb-2">🚩</div>
            <div className="font-bold text-sm text-slate-900">Moderation Queue</div>
          </Link>

          <Link
            to="/settings"
            className="p-4 border-2 border-slate-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-center block min-h-[44px]"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <div className="font-bold text-sm text-slate-900">System Settings</div>
          </Link>
        </div>
      </div>

      {/* Alerts & Notifications */}
      {(stats.content.flagged > 0 || stats.system.errors > 0) && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <h3 className="font-bold text-red-950 mb-3">⚠️ Action Required</h3>
          <div className="space-y-2">
            {stats.content.flagged > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-red-900 font-medium">{stats.content.flagged} posts flagged for review</span>
                <Link
                  to="/moderation"
                  className="min-h-[44px] px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 flex items-center justify-center self-start sm:self-auto"
                >
                  Review Now
                </Link>
              </div>
            )}
            {stats.system.errors > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-red-900 font-medium">{stats.system.errors} system errors detected</span>
                <Link
                  to="/security"
                  className="min-h-[44px] px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 flex items-center justify-center self-start sm:self-auto"
                >
                  View Logs
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity Summary */}
      <div className="bg-white border border-slate-300 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Today's Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 mb-1 font-medium">New Users</p>
            <p className="text-2xl font-bold text-blue-950">{stats.users.newToday}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800 mb-1 font-medium">New Posts</p>
            <p className="text-2xl font-bold text-purple-950">{stats.content.postsToday}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 mb-1 font-medium">Server Load</p>
            <p className="text-2xl font-bold text-green-950">{stats.system.serverLoad}%</p>
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <button
          onClick={loadDashboard}
          aria-label="Refresh Dashboard"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🔄</span>
          <span>Refresh</span>
        </button>
        <Link
          to="/admin/rbac"
          aria-label="Manage Users"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">👤</span>
          <span>Users</span>
        </Link>
        <Link
          to="/analytics"
          aria-label="View Reports"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">📊</span>
          <span>Reports</span>
        </Link>
        <Link
          to="/moderation"
          aria-label="Moderation"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🚩</span>
          <span>Queue</span>
        </Link>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
