import React from 'react';
import { UsersIcon, ViewListIcon as ViewList, TrendingUpIcon, LiveIcon as SignalIcon } from '../icons';
import { useAppContext } from '../contexts/AppContext';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend }) => (
  <div className="bg-white rounded-xl p-4 border border-slate-300 hover:border-blue-500 shadow-xs transition-all group">
    <div className="flex items-center justify-between mb-3">
      <div className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">{icon}</div>
      {trend && (
        <div className={`text-xs font-bold px-2.5 py-1 rounded-full border ${trend.isPositive ? 'text-emerald-950 bg-emerald-100 border-emerald-400' : 'text-red-950 bg-red-100 border-red-400'}`}>
          {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
        </div>
      )}
    </div>
    <div className="space-y-1">
      <h4 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h4>
      <p className="text-sm font-bold text-slate-800">{title}</p>
      {subtitle && <p className="text-xs text-slate-600 font-semibold">{subtitle}</p>}
    </div>
  </div>
);

const ForumStatCards: React.FC = () => {
  const context = useAppContext();

  const totalMembers = context.members ? context.members.length : 0;
  const totalPosts = context.posts ? context.posts.length : 0;

  // Calculate a mock engagement rate based on posts and members, or default to 64
  const engagementRate = totalMembers > 0 && totalPosts > 0
    ? Math.min(100, Math.round((totalPosts / totalMembers) * 100))
    : 64;

  return (
    <div className="space-y-4">
      <StatCard
        title="Total Members"
        value={totalMembers.toLocaleString()}
        subtitle="Across all communities"
        icon={<UsersIcon className="w-5 h-5 text-blue-500" />}
        trend={{ value: 12.5, isPositive: true }}
      />

      <StatCard
        title="Online Now"
        value={Math.round(totalMembers * 0.1).toLocaleString()}
        subtitle="Active in last 5 minutes"
        icon={<SignalIcon className="w-5 h-5 text-green-500" />}
      />

      <StatCard
        title="Total Posts"
        value={totalPosts.toLocaleString()}
        subtitle="Lifetime community posts"
        icon={<ViewList className="w-5 h-5 text-purple-500" />}
        trend={{ value: 5.2, isPositive: true }}
      />

      <StatCard
        title="Engagement Rate"
        value={`${engagementRate}%`}
        subtitle="Avg. interactions per post"
        icon={<TrendingUpIcon className="w-5 h-5 text-orange-500" />}
        trend={{ value: 2.1, isPositive: true }}
      />
    </div>
  );
};

export default ForumStatCards;
