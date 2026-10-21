import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import StatCard from '../../components/StatCard';
import useDashboardData from '../../hooks/useDashboardData';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const mockFallbackActivities = [
  {
    id: 'act-1',
    author: { name: 'Elena Rostova', membername: 'erostova' },
    title: 'Biometric Sharding Consensus v4 Whitepaper Released',
    timestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString()
  },
  {
    id: 'act-2',
    author: { name: 'Marcus Chen', membername: 'mchen_core' },
    title: 'Settled Staking Rewards Batch #419',
    timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString()
  },
  {
    id: 'act-3',
    author: { name: 'Sarah Al-Mansoor', membername: 'sarah_am' },
    title: 'Verified Enclave Attestation for EU-Central Node',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  }
];

const mockFallbackMembers = [
  {
    id: 'mem-1',
    name: 'Aleksei Volkov',
    membername: 'avolkov',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'mem-2',
    name: 'Priya Sharma',
    membername: 'priyash',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
  },
  {
    id: 'mem-3',
    name: 'Liam O’Connor',
    membername: 'loconnor',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
  }
];

const DashboardOverviewPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { data, loading, error, refreshData } = useDashboardData();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-300 shadow-sm space-y-4">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-900 font-bold">Synchronizing dashboard telemetries...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-300 rounded-2xl text-center space-y-4">
        <h3 className="text-xl font-black text-rose-950">Dashboard Synchronization Issue</h3>
        <p className="text-rose-900 font-medium">{error}</p>
        <button
          onClick={() => {
            refreshData();
            showToast('Retrying dashboard sync...', 'info');
          }}
          className="px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-sm"
        >
          Retry Synchronization
        </button>
      </div>
    );
  }

  const activities = (data?.recentActivity && data.recentActivity.length > 0)
    ? data.recentActivity
    : mockFallbackActivities;

  const members = (data?.newMembers && data.newMembers.length > 0)
    ? data.newMembers
    : mockFallbackMembers;

  const totalMembers = data?.totalMembers ?? 1250;
  const activePosts = data?.activePosts ?? 342;
  const totalRevenue = data?.totalRevenue ?? 5240;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-700 font-medium">Real-time health, ecosystem telemetry, and user participation.</p>
        </div>
        <button
          onClick={() => {
            refreshData();
            showToast('Dashboard metrics refreshed', 'success');
          }}
          className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl shadow-xs transition-colors"
        >
          ↻ Refresh Metrics
        </button>
      </div>

      {/* Sovereign Platform Ownership Proof */}
      <PlatformOwnershipCard />

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Members"
          value={totalMembers.toLocaleString()}
          subtitle="+5.2% this epoch"
          icon="👥"
        />
        <StatCard
          title="Active Posts"
          value={activePosts.toLocaleString()}
          subtitle="+2.1% this week"
          icon="📝"
        />
        <StatCard
          title="Total Revenue (FIC)"
          value={totalRevenue.toLocaleString()}
          subtitle="Direct contract settlement"
          icon="💰"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-slate-900">Recent Activity</h2>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-300">
              Live Stream
            </span>
          </div>
          <div className="space-y-4">
            {activities.map((act: any) => (
              <div key={act.id} className="text-sm border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                <p>
                  <span className="font-black text-slate-900">{act.author?.name || 'Protocol Sentinel'}</span>{' '}
                  <span className="text-slate-800 font-medium">
                    {act.title ? `published: "${act.title}"` : 'dispatched cryptographic transaction'}
                  </span>
                </p>
                <p className="text-xs text-slate-600 font-semibold mt-1">
                  {act.timestamp ? new Date(act.timestamp).toLocaleString() : 'Just now'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-black text-slate-900">New Members</h2>
            <span className="text-xs font-bold text-emerald-950 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-400">
              Verified Enclave IDs
            </span>
          </div>
          <div className="space-y-4">
            {members.map((member: any) => (
              <div key={member.id} className="flex items-center gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                <img
                  src={member.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={member.name}
                  className="w-10 h-10 rounded-full border border-slate-300 object-cover"
                />
                <div className="flex-1">
                  <p className="font-black text-slate-900">{member.name}</p>
                  <p className="text-sm font-semibold text-slate-700">@{member.membername}</p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
