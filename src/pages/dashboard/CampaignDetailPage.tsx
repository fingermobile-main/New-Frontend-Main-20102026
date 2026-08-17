import { useParams, NavLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAppContext } from '../../contexts/AppContext';


import type { CampaignAnalytics } from '../../types';

const CampaignDetailPage: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { getCampaignDetails } = useAppContext();
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (campaignId && getCampaignDetails) {
      getCampaignDetails(campaignId).then((data: any) => {
        setAnalytics(data);
        setIsLoading(false);
      });
    }
  }, [campaignId, getCampaignDetails]);

  const BarChart: React.FC<{
    data: { day: string; value: number }[];
    color: string;
  }> = ({ data, color }) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    return (
      <div className="bg-gray-50 p-4 rounded-lg h-56 flex items-end justify-around gap-2">
        {data.map((item) => (
          <div
            key={item.day}
            className="flex-1 flex flex-col items-center justify-end h-full"
          >
            <div
              className={`w-full ${color} rounded-t-md hover:opacity-80 transition-opacity`}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
              title={`${item.value.toLocaleString()}`}
            ></div>
            <span className="text-xs font-semibold mt-2">{item.day}</span>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) return <p>Loading analytics...</p>;
  if (!analytics) return <p>Could not load campaign details.</p>;

  return (
    <div>
      <NavLink
        to="/dashboard/campaigns"
        className="text-sm font-semibold text-brand-blue hover:underline mb-4 inline-block"
      >
        &larr; Back to Campaigns
      </NavLink>
      <h1 className="text-2xl font-bold mb-6">Campaign Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg">Total Reach</h3>
          <p className="text-4xl font-bold">
            {analytics.reach?.total.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg">Total Engagement</h3>
          <p className="text-4xl font-bold">
            {analytics.engagement?.total.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg">Total Spend</h3>
          <p className="text-4xl font-bold">
            {analytics.spend?.total.toLocaleString()} FIC
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4">Daily Reach</h3>
          <BarChart data={analytics.reach?.data || []} color="bg-blue-500" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold mb-4">Daily Engagement</h3>
          <BarChart data={analytics.engagement?.data || []} color="bg-green-500" />
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;