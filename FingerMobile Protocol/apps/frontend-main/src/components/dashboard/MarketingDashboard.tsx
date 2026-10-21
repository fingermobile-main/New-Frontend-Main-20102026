import React, { useState, useEffect } from 'react';
import { MegaphoneIcon, ArrowTrendingUpIcon, EyeIcon, CurrencyDollarIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { advertisingService, MarketingStats } from '../../services/advertisingService';
import LoadingSpinner from '../LoadingSpinner';

const MarketingDashboard: React.FC = () => {
  const [stats, setStats] = useState<MarketingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    advertisingService.getMarketingOverview()
      .then((data) => {
        if (isMounted) setStats(data);
      })
      .catch((err) => console.error('Failed to fetch marketing stats', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-300/80 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <MegaphoneIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">Marketing & Campaign Performance</h3>
            <p className="text-xs text-slate-700 font-medium font-medium">Real-time aggregate platform delivery & conversion telemetry</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-400  font-black">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
        </span>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-gradient-to-br from-indigo-50/80 to-indigo-100/40 rounded-2xl border border-indigo-100 text-left">
            <div className="flex items-center justify-between text-indigo-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Campaigns</span>
              <MegaphoneIcon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-indigo-950">{stats?.campaigns ?? 0}</p>
            <p className="text-[11px] font-semibold text-indigo-600 mt-1">
              {stats?.activeCampaigns ?? 0} currently active
            </p>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-50/80 to-blue-100/40 rounded-2xl border border-blue-100 text-left">
            <div className="flex items-center justify-between text-blue-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Reach</span>
              <EyeIcon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-blue-950">{stats?.reach ?? '0'}</p>
            <p className="text-[11px] font-semibold text-blue-600 mt-1">
              {(stats?.totalReach ?? 0).toLocaleString()} impressions
            </p>
          </div>

          <div className="p-5 bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 rounded-2xl border border-emerald-100 text-left">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Conversions</span>
              <ArrowTrendingUpIcon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-emerald-950">{stats?.conversions ?? '0%'}</p>
            <p className="text-[11px] font-semibold text-emerald-600 mt-1">
              {(stats?.totalConversions ?? 0).toLocaleString()} conversions
            </p>
          </div>

          <div className="p-5 bg-gradient-to-br from-amber-50/80 to-amber-100/40 rounded-2xl border border-amber-100 text-left">
            <div className="flex items-center justify-between text-amber-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Spend</span>
              <CurrencyDollarIcon className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-amber-950">{(stats?.totalSpend ?? 0).toLocaleString()} FIC</p>
            <p className="text-[11px] font-semibold text-amber-600 mt-1">
              {(stats?.totalClicks ?? 0).toLocaleString()} verified clicks
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketingDashboard;
