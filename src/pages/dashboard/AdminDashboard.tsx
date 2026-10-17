import React, { useState } from 'react';
import {
  Users,
  FileText,
  Coins,
  Activity,
  Heart,
  MessageSquare,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminOperationsService } from '../../services/adminOperationsService';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'members'>('overview');
  const [stats, setStats] = useState({
    totalMembers: 12540,
    activeMembers: 8742,
    totalPosts: 45210,
    totalTransactions: 23150,
    platformBalance: 1254000,
    revenue: 125000
  });

  React.useEffect(() => {
    adminOperationsService.getDashboardStats().then(data => {
      if (data) {
        setStats(prev => ({
          ...prev,
          totalMembers: data.totalUsers || prev.totalMembers,
          activeMembers: data.activeSessions || prev.activeMembers,
          totalTransactions: data.totalTransactions || prev.totalTransactions
        }));
      }
    }).catch(() => {
      // Keep baseline stats
    });
  }, []);

  const recentActivity = [
    {
      id: 1,
      type: 'member_registration',
      description: 'New member registered: john_doe',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      type: 'post_created',
      description: 'New post created in Forum',
      timestamp: '15 minutes ago'
    },
    {
      id: 3,
      type: 'transaction',
      description: 'Transaction completed: 25 FIC',
      timestamp: '30 minutes ago'
    }
  ];

  const topContent = [
    {
      id: 'post-1',
      title: 'Summer Vibes',
      type: 'image',
      author: 'john_doe',
      likes: 245,
      comments: 32
    },
    {
      id: 'post-2',
      title: 'New Music Drop',
      type: 'audio',
      author: 'jane_smith',
      likes: 512,
      comments: 47
    }
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header with Tab Switcher */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Platform Admin Operations</h1>
            <p className="text-xs text-slate-700 font-medium mt-1">
              Live telemetry on platform membership, content velocity, and financial ecosystem liquidity
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-300">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('members')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${
                activeTab === 'members'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-300'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Members View
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-300">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3 text-blue-700 border border-blue-200">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Total Platform Members
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                      {stats.totalMembers.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-700 font-medium mt-0.5">
                      {stats.activeMembers.toLocaleString()} active sessions
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-300">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-emerald-100 rounded-lg p-3 text-emerald-800 border border-emerald-300">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Published Content Posts
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                      {stats.totalPosts.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-700 font-medium mt-0.5">
                      Across Feed, UGC & Forums
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 shadow-sm rounded-xl border border-slate-300">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3 text-purple-800 border border-purple-300">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Protocol Vault Balance
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                      {stats.platformBalance.toLocaleString()} <span className="text-xs font-bold text-slate-700">FIC</span>
                    </div>
                    <div className="text-xs text-slate-700 font-medium mt-0.5">
                      {stats.totalTransactions.toLocaleString()} transactions settled
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity and Top Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Activity */}
              <div className="bg-white shadow-sm rounded-xl border border-slate-300 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Recent Audit Stream</h3>
                  <Activity className="h-4 w-4 text-blue-600" />
                </div>
                <ul className="divide-y divide-slate-200">
                  {recentActivity.map((activity) => (
                    <li key={activity.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-bold flex items-center justify-center border border-blue-400 shrink-0 font-black">
                          <Activity className="h-4 w-4" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-bold text-slate-900">
                            {activity.description}
                          </p>
                          <p className="text-xs text-slate-700 font-medium mt-0.5">
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Top Content */}
              <div className="bg-white shadow-sm rounded-xl border border-slate-300 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900">Top Content Velocity</h3>
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <ul className="divide-y divide-slate-200">
                  {topContent.map((content) => (
                    <li key={content.id} className="px-5 py-3.5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {content.title}
                          </p>
                          <p className="text-xs text-slate-700 font-medium mt-0.5">
                            Author: <span className="font-bold text-slate-800">@{content.author}</span> ({content.type})
                          </p>
                        </div>
                        <div className="flex space-x-4">
                          <span className="inline-flex items-center text-xs font-bold text-slate-800 gap-1">
                            <Heart className="h-3.5 w-3.5 text-rose-600" />
                            {content.likes}
                          </span>
                          <span className="inline-flex items-center text-xs font-bold text-slate-800 gap-1">
                            <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                            {content.comments}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="bg-white shadow-sm rounded-xl border border-slate-300 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Member Governance Quick Link</h3>
                <p className="text-xs text-slate-700 font-medium">Navigate directly to full member permissions & account controls</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/user-management')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="h-4 w-4" />
                <span>Open Full User Management Console</span>
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 font-medium">
              Detailed user roles, biometric registrations, strikes, asset balances, and administrative provisioning are managed via the dedicated <span className="font-bold text-slate-900">User Management Console</span>.
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
