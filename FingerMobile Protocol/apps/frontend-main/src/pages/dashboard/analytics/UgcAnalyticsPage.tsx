import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import StatCardUgc from './StatCardUgc';
import type { UgcAnalyticsData } from '../../../types/missing';
import { PlatformOwnershipCard } from '../../../components/ownership/PlatformOwnershipCard';

// Local interface for community in analytics
interface AnalyticsCommunity {
  id: string;
  name: string;
  type: string;
  memberGrowth: { month: string; members: number }[];
  engagementRate: number;
}

// Mock Data for demonstration
const MOCK_ANALYTICS: any = {
  summary: {
    totalCommunities: 3,
    totalMembers: 6850,
    totalRevenue: 12500
  },
  communities: [
    {
      id: 'hm-1',
      name: 'Jane\'s Art Hub',
      type: 'Hallmark',
      memberGrowth: [
        { month: 'Jan', members: 500 },
        { month: 'Feb', members: 800 },
        { month: 'Mar', members: 1200 },
        { month: 'Apr', members: 1500 }
      ],
      engagementRate: 12.5
    },
    {
      id: 'gem-1',
      name: 'Tech Talks',
      type: 'Gem',
      memberGrowth: [
        { month: 'Jan', members: 100 },
        { month: 'Feb', members: 300 },
        { month: 'Mar', members: 450 },
        { month: 'Apr', members: 600 }
      ],
      engagementRate: 8.2
    }
  ]
};

const BarChart: React.FC<{ data: { month: string; members: number }[] }> = ({
  data
}) => {
  const maxValue = Math.max(...data.map((d) => d.members));
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-56 flex items-end justify-around gap-2">
      {data.map((item) => (
        <div
          key={item.month}
          className="flex-1 flex flex-col items-center justify-end h-full"
        >
          <div
            className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-colors"
            style={{ height: `${(item.members / maxValue) * 100}%` }}
            title={`${item.members.toLocaleString()} members`}
          ></div>
          <span className="text-xs font-bold text-slate-800 mt-2">{item.month}</span>
        </div>
      ))}
    </div>
  );
};

const UgcAnalyticsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const analytics = MOCK_ANALYTICS;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">UGC Analytics</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">Creator communities, hallmark growth, and member engagement statistics</p>
        </div>
      </div>

      <PlatformOwnershipCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCardUgc
          title="Total Communities"
          value={analytics.summary.totalCommunities}
        />
        <StatCardUgc
          title="Total Members"
          value={analytics.summary.totalMembers.toLocaleString()}
        />
        <StatCardUgc
          title="Total Revenue (FIC)"
          value={analytics.summary.totalRevenue.toLocaleString()}
        />
      </div>

      <div className="space-y-6">
        {analytics.communities.map((community: AnalyticsCommunity) => (
          <div
            key={community.id}
            className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-black text-slate-900">{community.name}</h2>
                <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border border-blue-400 font-black">
                  {community.type}
                </span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-900">
                  {community.engagementRate}%
                </p>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mt-0.5">Engagement Rate</p>
              </div>
            </div>
            <div className="mt-5">
              <h3 className="font-bold text-slate-900 mb-2">Member Growth</h3>
              <BarChart data={community.memberGrowth} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UgcAnalyticsPage;
