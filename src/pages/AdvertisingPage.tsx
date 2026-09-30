import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import {
  MegaphoneIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  PlusIcon,
  TagIcon,
  UserGroupIcon,
  PlayIcon,
  PauseIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '../icons';
import { advertisingService, type AdCampaignItem, type MarketingStats } from '../services/advertisingService';
import LoadingSpinner from '../components/LoadingSpinner';

const AdvertisingPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'create' | 'analytics'>('campaigns');

  const [campaigns, setCampaigns] = useState<AdCampaignItem[]>([]);
  const [stats, setStats] = useState<MarketingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Create campaign form state
  const [title, setTitle] = useState('');
  const [campaignType, setCampaignType] = useState('display');
  const [dailyBudget, setDailyBudget] = useState('25');
  const [totalBudget, setTotalBudget] = useState('175');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('All Users');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [campList, overviewStats] = await Promise.all([
        advertisingService.getCampaigns(true),
        advertisingService.getMarketingOverview()
      ]);
      setCampaigns(campList);
      setStats(overviewStats);
    } catch (err) {
      console.error('Error fetching advertising data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a campaign name', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await advertisingService.createCampaign({
        title: title.trim(),
        description: description.trim(),
        campaign_type: campaignType,
        daily_budget: parseFloat(dailyBudget) || 25,
        total_budget: parseFloat(totalBudget) || 175,
        currency: 'FIC',
        targeting: { audience: targetAudience, geo: 'Global' }
      });
      showToast('Campaign created and launched successfully!', 'success');
      setTitle('');
      setDescription('');
      setActiveTab('campaigns');
      fetchData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to create campaign', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (e: React.MouseEvent, id: string, currentStatus: string) => {
    e.stopPropagation();
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await advertisingService.updateCampaignStatus(id, nextStatus);
      showToast(`Campaign ${nextStatus === 'active' ? 'activated' : 'paused'}`, 'success');
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <MainLayout pageTitle="Advertising Studio">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner">
              <MegaphoneIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Advertising Studio</h1>
              <p className="text-slate-500 font-medium mt-1">Create, manage, and analyze your promotional campaigns</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('create')}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            New Campaign
          </button>
        </div>

        <div className="flex space-x-2 mb-8 bg-slate-100/50 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'campaigns' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            Active Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'create' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'analytics' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
            }`}
          >
            Analytics
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {activeTab === 'campaigns' && (
              <div>
                {loading ? (
                  <div className="flex justify-center p-12">
                    <LoadingSpinner />
                  </div>
                ) : campaigns.length === 0 ? (
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-8 text-center animate-in fade-in duration-300">
                    <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center mb-6">
                      <TagIcon className="w-12 h-12 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No Active Campaigns</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">Reach thousands of users on FingerMobile by starting your first targeted ad campaign today.</p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all"
                    >
                      Create Campaign
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((camp) => (
                      <div
                        key={camp.id}
                        onClick={() => navigate(`/campaigns/${camp.id}`)}
                        className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <MegaphoneIcon className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                                  {camp.name || camp.title}
                                </h3>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${camp.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {camp.status}
                                </span>
                              </div>
                              <p className="text-sm text-slate-500 mt-0.5">
                                {camp.type || camp.campaign_type} • ID: {camp.id.substring(0, 8)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 self-end sm:self-center">
                            <div className="text-right">
                              <p className="text-xs font-bold text-slate-400 uppercase">Spent / Budget</p>
                              <p className="text-sm font-black text-slate-800">{camp.spent} / {camp.budget}</p>
                            </div>
                            <button
                              onClick={(e) => handleToggleStatus(e, camp.id, camp.status)}
                              className={`p-2.5 rounded-xl border font-bold transition-all ${camp.status === 'active' ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                              title={camp.status === 'active' ? 'Pause Campaign' : 'Activate Campaign'}
                            >
                              {camp.status === 'active' ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                            </button>
                            <ArrowRightIcon className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                          </div>
                        </div>

                        {camp.description && (
                          <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100">
                            {camp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'create' && (
              <form onSubmit={handleCreateCampaign} className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-8 animate-in fade-in duration-300">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Create New Campaign</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Name</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Summer Mega Promo 2026"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe target goals and products promoted..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Campaign Type</label>
                      <select
                        value={campaignType}
                        onChange={(e) => setCampaignType(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-700 font-medium"
                      >
                        <option value="display">Display Ad (H2 Banner & Banners)</option>
                        <option value="video">Video Ad (In-Feed & In-Stream)</option>
                        <option value="discovery">Discovery & Sponsored Post</option>
                        <option value="search">Search Keywords Intent</option>
                        <option value="performance_max">Performance Max (Automated ROI)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Target Audience</label>
                      <select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none text-slate-700 font-medium"
                      >
                        <option value="All Users">All FingerMobile Members</option>
                        <option value="Gamers">Gamers & FingerWars</option>
                        <option value="Creators">Content Creators & Beatwave</option>
                        <option value="Shoppers">Marketplace Active Buyers</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Daily Budget (FIC)</label>
                      <input
                        type="number"
                        min="5"
                        required
                        value={dailyBudget}
                        onChange={(e) => setDailyBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Total Budget (FIC)</label>
                      <input
                        type="number"
                        min="20"
                        required
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('campaigns')}
                      className="px-6 py-3 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 disabled:opacity-50"
                    >
                      {submitting ? 'Launching...' : 'Launch Campaign'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Reach</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats?.reach || '45K'}</p>
                    <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5" /> High impressions
                    </p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clicks</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{(stats?.totalClicks || 2100).toLocaleString()}</p>
                    <p className="text-xs text-blue-600 font-bold mt-2">Verified anti-fraud</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/60 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Conversions</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stats?.conversions || '12%'}</p>
                    <p className="text-xs text-purple-600 font-bold mt-2">CVR Benchmark</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/60 shadow-sm text-center">
                  <ChartBarIcon className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-slate-900 mb-2">Campaign Performance Overview</h3>
                  <p className="text-slate-500 max-w-lg mx-auto text-sm">
                    Select any individual campaign from the Active Campaigns tab to inspect 7-day daily reach and engagement breakdowns with live hourly pacing.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/20 rounded-full blur-[30px] group-hover:bg-white/30 transition-colors" />

              <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-200 mb-2 flex items-center gap-2 relative z-10">
                <CurrencyDollarIcon className="w-4 h-4" />
                Ad Account Balance
              </h3>
              <p className="text-4xl font-black tracking-tight mb-6 relative z-10">
                {ficBalance.toFixed(2)} <span className="text-xl text-emerald-200">FIC</span>
              </p>

              <button
                onClick={() => navigate('/financials')}
                className="w-full py-3 bg-white hover:bg-slate-50 text-emerald-700 rounded-xl font-bold transition-all active:scale-95 shadow-lg relative z-10"
              >
                Deposit / Manage FIC
              </button>
            </div>

            <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-100">
              <h3 className="font-bold text-emerald-900 mb-3 text-sm flex items-center gap-2">
                <UserGroupIcon className="w-5 h-5 text-emerald-600" />
                Audience Reach
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-end border-b border-emerald-200/50 pb-2">
                  <span className="text-emerald-800 font-medium text-sm">Monthly Active</span>
                  <span className="text-emerald-900 font-black">2.4M</span>
                </div>
                <div className="flex justify-between items-end border-b border-emerald-200/50 pb-2">
                  <span className="text-emerald-800 font-medium text-sm">Avg. CTR</span>
                  <span className="text-emerald-900 font-black">4.2%</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-emerald-800 font-medium text-sm">Min. CPC</span>
                  <span className="text-emerald-900 font-black">2 FIC</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">Canary Guidelines</h3>
              <ul className="space-y-3 text-sm text-slate-600 font-medium">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  Stories ads require 14% (250px) top/bottom safe area.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  Thumbnail image text must not exceed 20% total area.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdvertisingPage;
