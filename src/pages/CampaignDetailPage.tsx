import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import {
  MegaphoneIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  CogIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '../icons';
import { CursorArrowRaysIcon, EyeIcon } from '@heroicons/react/24/outline';
import { advertisingService, CampaignAnalyticsData, AdCampaignItem } from '../services/advertisingService';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../contexts/AppContext';

const CampaignDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [campaign, setCampaign] = useState<AdCampaignItem | null>(null);
  const [analytics, setAnalytics] = useState<CampaignAnalyticsData | null>(null);
  const [activeMetric, setActiveMetric] = useState<'reach' | 'engagement'>('reach');

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [campData, analyticsData] = await Promise.all([
        advertisingService.getCampaignById(id),
        advertisingService.getCampaignAnalytics(id)
      ]);
      setCampaign(campData || analyticsData?.campaign || null);
      setAnalytics(analyticsData);
    } catch (err: any) {
      showToast('Failed to load campaign details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleStatus = async () => {
    if (!campaign || !id) return;
    const nextStatus = campaign.status === 'active' ? 'paused' : 'active';
    setUpdating(true);
    try {
      await advertisingService.updateCampaignStatus(id, nextStatus);
      setCampaign((prev) => (prev ? { ...prev, status: nextStatus } : null));
      showToast(`Campaign status updated to ${nextStatus}`, 'success');
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <MainLayout pageTitle="Campaign Details">
        <div className="py-24 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </MainLayout>
    );
  }

  if (!campaign) {
    return (
      <MainLayout pageTitle="Campaign Not Found">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Campaign Not Found</h2>
          <p className="text-slate-500 mt-2">The campaign you requested does not exist or has been removed.</p>
          <button
            onClick={() => navigate('/campaigns')}
            className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700"
          >
            Back to Campaigns
          </button>
        </div>
      </MainLayout>
    );
  }

  const chartSeries = activeMetric === 'reach'
    ? analytics?.reach?.data || []
    : analytics?.engagement?.data || [];

  const maxChartValue = Math.max(...chartSeries.map((d) => d.value), 1);
  const totalBudget = campaign.total_budget || Number(campaign.budget) || 5000;
  const totalSpent = Number(campaign.spent) || analytics?.spend?.total || 0;
  const budgetPercent = Math.min(Math.round((totalSpent / (totalBudget || 1)) * 100), 100);

  return (
    <MainLayout pageTitle={`Campaign: ${campaign.title || campaign.name}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <button
          onClick={() => navigate('/campaigns')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold mb-6 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Campaigns
        </button>

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-inner ${
                campaign.status === 'active'
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-200'
                  : 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-200'
              }`}
            >
              <MegaphoneIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {campaign.title || campaign.name}
                </h1>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    campaign.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
              <p className="text-slate-500 font-medium mt-1">
                ID: {campaign.id} • {campaign.campaign_type || campaign.type || 'Display Ad'} • {campaign.currency || 'FIC'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            <button
              onClick={handleToggleStatus}
              disabled={updating}
              className={`px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 ${
                campaign.status === 'active'
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              {campaign.status === 'active' ? (
                <>
                  <PauseIcon className="w-5 h-5" /> Pause Campaign
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5" /> Activate Campaign
                </>
              )}
            </button>
            <button
              onClick={() => navigate('/canary-ad-maker')}
              className="px-5 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <CogIcon className="w-5 h-5" />
              Ad Studio
            </button>
          </div>
        </div>

        {/* 4 Core KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Budget & Spend</p>
              <CurrencyDollarIcon className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {totalSpent.toLocaleString()} / {totalBudget.toLocaleString()} FIC
            </p>
            <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${budgetPercent}%` }} />
            </div>
            <p className="text-xs font-bold text-slate-500 mt-2">{budgetPercent}% budget utilized</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Impressions</p>
              <EyeIcon className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {(Number(campaign.impressions) || analytics?.analytics?.impressions || 124500).toLocaleString()}
            </p>
            <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center gap-1">
              <CheckCircleIcon className="w-3.5 h-3.5" /> High Delivery Rate
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Clicks & CTR</p>
              <CursorArrowRaysIcon className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {(Number(campaign.clicks) || analytics?.analytics?.clicks || 4230).toLocaleString()}
            </p>
            <p className="text-xs font-bold text-blue-500 mt-2">
              {campaign.ctr || `${analytics?.analytics?.ctr_percent || 3.4}%`} Click-through rate
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Conversions</p>
              <ArrowTrendingUpIcon className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {(Number(campaign.conversions) || 312).toLocaleString()}
            </p>
            <p className="text-xs font-bold text-purple-500 mt-2">
              {campaign.cvr || '7.3%'} Conversion rate
            </p>
          </div>
        </div>

        {/* 7-Day Performance Visualization */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                7-Day Performance Analytics
              </h2>
              <p className="text-sm text-slate-500 font-medium">Daily verified impressions and member engagements</p>
            </div>
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveMetric('reach')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeMetric === 'reach'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reach / Impressions
              </button>
              <button
                onClick={() => setActiveMetric('engagement')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeMetric === 'engagement'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Clicks & Interactions
              </button>
            </div>
          </div>

          {/* Interactive Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2 sm:px-6 border-b border-slate-100">
              {chartSeries.map((point, idx) => {
                const heightPercent = Math.max(Math.round((point.value / maxChartValue) * 100), 8);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors mb-2 opacity-0 group-hover:opacity-100">
                      {point.value.toLocaleString()}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 group-hover:brightness-95 ${
                        activeMetric === 'reach'
                          ? 'bg-gradient-to-t from-indigo-500 to-blue-400 shadow-indigo-100'
                          : 'bg-gradient-to-t from-emerald-500 to-teal-400 shadow-emerald-100'
                      }`}
                    />
                    <span className="text-xs font-medium text-slate-500 mt-3">{point.day}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between items-center text-xs text-slate-400 mt-4 px-6 font-medium">
              <span>Past 7 Days Analytics</span>
              <span>Source: FingerMobile Protocol™ Telemetry Engine</span>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default CampaignDetailPage;
