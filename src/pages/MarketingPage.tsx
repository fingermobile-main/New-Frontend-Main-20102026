import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import MarketingDashboard from '../components/dashboard/MarketingDashboard';
import { advertisingService, AdCampaignItem } from '../services/advertisingService';
import {
  MegaphoneIcon,
  PlusIcon,
  SparklesIcon,
  ArrowRightIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon
} from '../icons';

const MarketingPage: React.FC = () => {
  const navigate = useNavigate();
  const [recentCampaigns, setRecentCampaigns] = useState<AdCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    advertisingService.getCampaigns(true)
      .then((items) => setRecentCampaigns(items.slice(0, 5)))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout pageTitle="Marketing Hub">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">

        {/* Hero header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 rounded-3xl text-white shadow-xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Marketing Intelligence
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Platform Marketing Hub</h1>
            <p className="text-indigo-200 text-sm mt-1 max-w-xl">
              Track conversion telemetry, launch cross-channel display & video campaigns, and manage platform reach.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/campaigns')}
              className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-xl shadow transition-all text-sm flex items-center gap-2"
            >
              <MegaphoneIcon className="w-4 h-4" /> View All Campaigns
            </button>
            <button
              onClick={() => navigate('/canary-ad-maker')}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-105 text-slate-950 font-black rounded-xl shadow transition-all text-sm flex items-center gap-2"
            >
              <SparklesIcon className="w-4 h-4" /> Canary Ad Studio
            </button>
          </div>
        </div>

        {/* Live Marketing Dashboard widget */}
        <MarketingDashboard />

        {/* Recent Campaigns Overview */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Active Campaign Delivery</h2>
              <p className="text-xs text-slate-500 mt-0.5">Real-time status of top running campaigns</p>
            </div>
            <button
              onClick={() => navigate('/campaigns')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View All <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400 py-6 text-center">Loading campaigns...</p>
          ) : recentCampaigns.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="font-semibold text-sm">No active campaigns running</p>
              <button
                onClick={() => navigate('/canary-ads')}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
              >
                Launch First Campaign
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCampaigns.map((camp) => (
                <div
                  key={camp.id}
                  onClick={() => navigate(`/campaigns/${camp.id}`)}
                  className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      {camp.campaign_type || camp.type || 'Standard'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        camp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {camp.status === 'active' ? <PlayIcon className="w-2.5 h-2.5" /> : <PauseIcon className="w-2.5 h-2.5" />}
                      {camp.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {camp.title || camp.name}
                  </h3>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Spent</span>
                      <p className="font-bold text-slate-800">{camp.spent ? `${camp.spent} FIC` : '0 FIC'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Budget</span>
                      <p className="font-bold text-slate-500">{camp.budget ? `${camp.budget} FIC` : `${camp.total_budget || 0} FIC`}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default MarketingPage;
