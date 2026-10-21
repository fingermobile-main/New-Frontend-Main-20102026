import React, { useEffect, useState, useCallback } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { advertisingService, CampaignAnalyticsData } from '../../services/advertisingService';
import LoadingSpinner from '../../components/LoadingSpinner';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const DashboardCampaignDetailPage: React.FC = () => {
  const { campaignId, id } = useParams<{ campaignId?: string; id?: string }>();
  const effectiveId = campaignId || id;
  const { getCampaignDetails, showToast } = useAppContext();
  const [analytics, setAnalytics] = useState<CampaignAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    if (!effectiveId) return;
    try {
      setIsLoading(true);
      // Prefer AppContext or direct advertisingService
      let data: any = null;
      if (getCampaignDetails) {
        data = await getCampaignDetails(effectiveId);
      }
      if (!data) {
        data = await advertisingService.getCampaignAnalytics(effectiveId);
      }
      setAnalytics(data);
    } catch (err: any) {
      console.error('Failed to load campaign analytics', err);
      showToast('Could not load campaign analytics', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [effectiveId, getCampaignDetails, showToast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const BarChart: React.FC<{
    data: { day: string; value: number }[];
    color: string;
  }> = ({ data, color }) => {
    const maxValue = Math.max(...data.map((d) => d.value), 1);
    return (
      <div className="bg-slate-50 p-6 rounded-2xl h-64 flex items-end justify-around gap-2 border border-slate-100">
        {data.map((item) => (
          <div
            key={item.day}
            className="flex-1 flex flex-col items-center justify-end h-full group"
          >
            <span className="text-[10px] font-bold text-slate-700 group-hover:text-slate-900 transition-colors mb-1.5 opacity-0 group-hover:opacity-100">
              {item.value.toLocaleString()}
            </span>
            <div
              className={`w-full max-w-[40px] ${color} rounded-t-lg hover:brightness-95 transition-all`}
              style={{ height: `${Math.max((item.value / maxValue) * 100, 6)}%` }}
              title={`${item.value.toLocaleString()}`}
            />
            <span className="text-xs font-bold text-slate-700 mt-2">{item.day}</span>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[300px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-700 font-medium">Could not load campaign details.</p>
        <NavLink
          to="/dashboard/campaigns"
          className="text-sm font-semibold text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to Campaigns
        </NavLink>
      </div>
    );
  }

  const campaignTitle = analytics.campaign?.title || analytics.campaign?.name || 'Campaign Details';

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <NavLink
        to="/dashboard/campaigns"
        className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 hover:underline cursor-pointer"
      >
        &larr; Back to Campaigns Management
      </NavLink>

      <PlatformOwnershipCard />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{campaignTitle}</h1>
          <p className="text-xs font-mono text-slate-700 font-bold mt-0.5">Campaign ID: {effectiveId}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
            analytics.campaign?.status === 'active'
              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
              : 'bg-amber-100 text-amber-950 border-amber-400'
          }`}
        >
          {analytics.campaign?.status || 'Active'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Total Reach</h3>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {(analytics.reach?.total || 0).toLocaleString()}
          </p>
          <p className="text-xs text-emerald-800 font-bold mt-1">Verified Member Impressions</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Total Engagement</h3>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {(analytics.engagement?.total || 0).toLocaleString()}
          </p>
          <p className="text-xs text-blue-800 font-bold mt-1">Direct Clicks &amp; Actions</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
          <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Total Spend</h3>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {(analytics.spend?.total || 0).toLocaleString()} FIC
          </p>
          <p className="text-xs text-slate-700 font-bold mt-1">Accredited Escrow Spend</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
          <h3 className="text-base font-black text-slate-900 mb-4">Daily Reach (Past 7 Days)</h3>
          <BarChart data={analytics.reach?.data || []} color="bg-blue-600" />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
          <h3 className="text-base font-black text-slate-900 mb-4">Daily Engagement (Past 7 Days)</h3>
          <BarChart data={analytics.engagement?.data || []} color="bg-emerald-600" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCampaignDetailPage;
