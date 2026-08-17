import React, {} from 'react';
import { useAppContext } from '../../../contexts/AppContext';

import StatCardUgc from './StatCardUgc';
import type { UgcAnalyticsData } from '../../../types/missing';

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
      id: "hm-1",
      name: "Jane's Art Hub",
      type: "Hallmark",
      memberGrowth: [
        { month: "Jan", members: 500 },
        { month: "Feb", members: 800 },
        { month: "Mar", members: 1200 },
        { month: "Apr", members: 1500 }
      ],
      engagementRate: 12.5
    },
    {
      id: "gem-1",
      name: "Tech Talks",
      type: "Gem",
      memberGrowth: [
        { month: "Jan", members: 100 },
        { month: "Feb", members: 300 },
        { month: "Mar", members: 450 },
        { month: "Apr", members: 600 }
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
    <div className="bg-gray-50 p-4 rounded-lg h-56 flex items-end justify-around gap-2">
      {data.map((item) => (
        <div
          key={item.month}
          className="flex-1 flex flex-col items-center justify-end h-full"
        >
          <div
            className="w-full bg-brand-blue rounded-t-md"
            style={{ height: `${(item.members / maxValue) * 100}%` }}
            title={`${item.members.toLocaleString()} members`}
          ></div>
          <span className="text-xs font-semibold mt-2">{item.month}</span>
        </div>
      ))}
    </div>
  );
};

const UgcAnalyticsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const analytics = MOCK_ANALYTICS;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">UGC Analytics</h1>
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

      <div className="space-y-8">
        {analytics.communities.map((community: AnalyticsCommunity) => (
          <div
            key={community.id}
            className="bg-white p-6 rounded-xl shadow-sm border"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold">{community.name}</h2>
                <p className="text-sm font-semibold text-brand-blue">
                  {community.type}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {community.engagementRate}%
                </p>
                <p className="text-xs text-gray-500">Engagement Rate</p>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Member Growth</h3>
              <BarChart data={community.memberGrowth} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UgcAnalyticsPage;
