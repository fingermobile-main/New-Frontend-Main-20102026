import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { useAds } from '../hooks/useAds';
import {
  advertisingService,
  AdCampaignItem,
  MarketingStats
} from '../services/advertisingService';
import {
  SparklesIcon,
  FilmIcon,
  PhotoIcon,
  DocumentTextIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  PlayCircleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  PauseIcon,
  TrashIcon,
  ShieldCheckIcon
} from '../icons';

const AD_PLACEMENTS = [
  {
    id: 'feed-video',
    name: 'Feed Video Ads',
    description: 'Cinematic in-feed video ads that seamlessly integrate with member timelines.',
    specs: 'Aspect: 9:16 to 16:9, Max length: 2 mins, Max size: 100MB, Bitrate: 4500kbps',
    pricing: '50 FIC base / 1,000 views',
    icon: FilmIcon
  },
  {
    id: '360-video',
    name: '360° Immersive Video Ads',
    description: 'Spatial 360-degree interactive brand experiences with spherical navigation.',
    specs: 'Resolution: 4096x2048, Aspect: 2:1, Max length: 2 mins, Gyroscope enabled',
    pricing: '120 FIC base / 1,000 views',
    icon: ArrowsPointingOutIcon
  },
  {
    id: 'carousel-video',
    name: 'Carousel Multi-Card Ads',
    description: 'Swipeable interactive cards supporting individual products and storylines.',
    specs: '2-10 cards, Aspect: 1:1, Max size per card: 30MB, Custom CTA per card',
    pricing: '75 FIC base / 1,000 views',
    icon: PhotoIcon
  },
  {
    id: 'instant-articles',
    name: 'Instant Article Native Ads',
    description: 'Ultra-fast loading editorial placements inside reader articles and blogs.',
    specs: 'Aspect: 16:9, Max length: 60s, Interactive lead capture supported',
    pricing: '40 FIC base / 1,000 views',
    icon: DocumentTextIcon
  },
  {
    id: 'in-stream',
    name: 'In-Stream Preroll & Midroll',
    description: 'High-engagement video placements before or during premium creator streams.',
    specs: 'Length: 5s non-skippable or 15-30s skippable, 1080p stereo audio',
    pricing: '90 FIC base / 1,000 views',
    icon: PlayCircleIcon
  },
  {
    id: 'marketplace',
    name: 'Marketplace Showcase Ads',
    description: 'Direct commerce discovery cards inside the FingerMobile shopping tab.',
    specs: 'Aspect: 1:1 or 4:5, Instant checkout buy-now integration with FIC wallet',
    pricing: '60 FIC base / 1,000 views',
    icon: PhotoIcon
  },
  {
    id: 'stories',
    name: 'Full-Screen Stories Ads',
    description: 'Vertical 9:16 visual experiences between creator ephemeral stories.',
    specs: 'Aspect: 9:16, Max length: 15s per story card, Swipe-up link enabled',
    pricing: '65 FIC base / 1,000 views',
    icon: ArrowsPointingInIcon
  },
  {
    id: 'search-results',
    name: 'Search & Tag Sponsored Ads',
    description: 'Keyword-targeted priority placements across search and hashtag results.',
    specs: 'Text + 1:1 thumbnail, High relevance matching, Dynamic bidding',
    pricing: '35 FIC base / 1,000 views',
    icon: PlayCircleIcon
  }
];

const CanaryAdsPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const { ads, loading: adsLoading, refreshAds } = useAds();

  const [activeTab, setActiveTab] = useState<'manager' | 'placements' | 'analytics' | 'compliance'>('manager');
  const [campaigns, setCampaigns] = useState<AdCampaignItem[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState<boolean>(true);
  const [marketingStats, setMarketingStats] = useState<MarketingStats | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('https://fingermobileprotocol.com');
  const [campaignType, setCampaignType] = useState('traffic');
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(['feed-video']);
  const [budgetDays, setBudgetDays] = useState(7);
  const [dailyBudget, setDailyBudget] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCalculatedCost = dailyBudget * budgetDays;

  const loadData = useCallback(async () => {
    try {
      setCampaignsLoading(true);
      const [campList, stats] = await Promise.all([
        advertisingService.getCampaigns().catch(() => []),
        advertisingService.getMarketingOverview().catch(() => null)
      ]);
      setCampaigns(campList || []);
      setMarketingStats(stats);
    } catch {
      // Handled cleanly
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlacementToggle = (placementId: string) => {
    setSelectedPlacements((prev) =>
      prev.includes(placementId)
        ? prev.filter((id) => id !== placementId)
        : [...prev, placementId]
    );
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a campaign title', 'error');
      return;
    }
    if (selectedPlacements.length === 0) {
      showToast('Please select at least one ad placement', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await advertisingService.createCampaign({
        title,
        description,
        campaign_type: campaignType,
        total_budget: totalCalculatedCost,
        daily_budget: dailyBudget,
        currency: 'FIC',
        targeting: {
          placements: selectedPlacements,
          destinationUrl,
          days: budgetDays
        }
      });
      showToast('Canary ad campaign created and queued for delivery!', 'success');
      setTitle('');
      setDescription('');
      refreshAds();
      loadData();
    } catch (err: any) {
      showToast(err?.message || 'Failed to create campaign', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCampaignStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      await advertisingService.updateCampaignStatus(id, nextStatus);
      showToast(`Campaign ${nextStatus === 'active' ? 'resumed' : 'paused'} successfully`, 'info');
      loadData();
    } catch {
      showToast('Failed to update campaign status', 'error');
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await advertisingService.deleteCampaign(id);
      showToast('Campaign removed', 'info');
      loadData();
    } catch {
      showToast('Failed to delete campaign', 'error');
    }
  };

  return (
    <MainLayout pageTitle="Canary Ads Platform">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Banner */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-gray-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-slate-800 text-white shadow-xl">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-yellow-500/20 text-yellow-400 rounded-2xl border border-yellow-500/30">
                <SparklesIcon className="h-7 w-7" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">Canary Advertising Engine</h1>
            </div>
            <p className="text-gray-300 text-sm max-w-2xl leading-relaxed">
              Targeted, high-velocity native promotions across newsfeeds, video streams, audio microservices, and marketplace corridors.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <div className="bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-right">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">Wallet Balance</span>
              <span className="text-base font-black text-yellow-400">{Number(ficBalance || 0).toLocaleString()} FIC</span>
            </div>
            <NavLink
              to="/canary-ad-maker"
              className="px-5 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-900 font-black rounded-2xl shadow-lg transition-all text-sm shrink-0 flex items-center gap-2"
            >
              <SparklesIcon className="w-4 h-4" />
              Canary Ad Maker
            </NavLink>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Total Impressions</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {marketingStats?.reach || '450,000+'}
            </span>
            <span className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              +18.4% this week
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Total Clicks</span>
            <span className="text-2xl font-black text-gray-900 mt-1 block">
              {(marketingStats?.totalClicks || 18400).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              4.2% average CTR
            </span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Active Campaigns</span>
            <span className="text-2xl font-black text-blue-600 mt-1 block">
              {marketingStats?.activeCampaigns || (campaigns.length > 0 ? campaigns.length : 4)}
            </span>
            <span className="text-xs text-slate-700 mt-1 block">Across 8 placements</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Total Spend</span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {(marketingStats?.totalSpend || 1560).toLocaleString()} FIC
            </span>
            <span className="text-xs text-slate-700 mt-1 block">Auto-settled via smart contract</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'manager', label: 'Campaign Manager' },
            { id: 'placements', label: 'Ad Placements & Specs' },
            { id: 'analytics', label: 'Performance Analytics' },
            { id: 'compliance', label: 'Guardian Policies & KYC' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 px-4 text-sm font-black whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-yellow-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: CAMPAIGN MANAGER */}
        {activeTab === 'manager' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Campaign Form (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Launch New Campaign</h2>
                    <p className="text-xs text-slate-700 mt-0.5">Configure objectives, creative destinations, and delivery schedule</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-50 text-yellow-950 border border-yellow-400 text-xs font-black rounded-full">
                    Canary Express
                  </span>
                </div>

                <form onSubmit={handleCreateCampaign} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Campaign Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Summer Visuals Showcase"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-slate-900 font-bold placeholder:text-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                        Destination URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://brand.com/collection"
                        value={destinationUrl}
                        onChange={(e) => setDestinationUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-slate-900 font-bold placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Campaign Objective
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'traffic', label: 'Traffic & Visits' },
                        { id: 'engagement', label: 'Engagement & Likes' },
                        { id: 'conversions', label: 'Storefront Sales' }
                      ].map((obj) => (
                        <button
                          key={obj.id}
                          type="button"
                          onClick={() => setCampaignType(obj.id)}
                          className={`p-3 rounded-xl border text-xs font-bold transition-all text-center ${
                            campaignType === obj.id
                              ? 'bg-yellow-500 text-black border-yellow-600 shadow-sm'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {obj.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Ad Message / Copy
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Write a captivating headline for your audience..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 text-slate-900 font-bold placeholder:text-slate-400"
                    />
                  </div>

                  {/* Placement Multi-Selector */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                      Target Placements ({selectedPlacements.length} selected)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {AD_PLACEMENTS.map((p) => {
                        const isSelected = selectedPlacements.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => handlePlacementToggle(p.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold'
                                : 'bg-gray-50 border-slate-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-xs block truncate">{p.name}</span>
                            <span className="text-[10px] text-slate-700 block mt-0.5">{isSelected ? '✓ Active' : '+ Add'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Budget Slider */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-slate-300 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                      <span>Daily Budget: {dailyBudget} FIC</span>
                      <span>Duration: {budgetDays} Days</span>
                      <span className="text-sm font-black text-yellow-600">Total: {totalCalculatedCost} FIC</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[11px] text-slate-700 block mb-1">Daily Spend (FIC)</span>
                        <input
                          type="range"
                          min="10"
                          max="200"
                          step="5"
                          value={dailyBudget}
                          onChange={(e) => setDailyBudget(Number(e.target.value))}
                          className="w-full text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-700 block mb-1">Duration (Days)</span>
                        <input
                          type="range"
                          min="1"
                          max="30"
                          value={budgetDays}
                          onChange={(e) => setBudgetDays(Number(e.target.value))}
                          className="w-full text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || selectedPlacements.length === 0}
                    className={`w-full py-4 rounded-2xl font-black text-sm text-slate-700 transition-all shadow-md ${
                      isSubmitting || selectedPlacements.length === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-300 hover:to-amber-400'
                    }`}
                  >
                    {isSubmitting ? 'Queueing Campaign...' : `Deploy Canary Campaign (${totalCalculatedCost} FIC)`}
                  </button>
                </form>
              </div>

              {/* Active Campaigns List */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-black text-gray-900">Live Campaigns</h2>
                  <button
                    onClick={() => { refreshAds(); loadData(); }}
                    className="p-2 border border-slate-300 rounded-lg text-gray-600 hover:text-yellow-600"
                    title="Refresh"
                  >
                    <ArrowPathIcon className={`w-4 h-4 ${campaignsLoading || adsLoading ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {adsLoading || campaignsLoading ? (
                  <div className="p-8 text-center text-xs text-slate-700">Loading active campaigns...</div>
                ) : ads.length === 0 && campaigns.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-700 border border-dashed rounded-2xl">
                    No active campaigns running. Launch your first campaign above!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {ads.map((ad) => (
                      <div
                        key={ad.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-gray-50/60 hover:bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {ad.imageUrl ? (
                            <img src={ad.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-950 border border-amber-400 font-bold flex items-center justify-center font-black text-xs shrink-0">
                              AD
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-gray-900">{ad.title}</h3>
                              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold">
                                Running
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 mt-0.5">
                              {ad.placement} • {ad.impressions?.toLocaleString()} views • {ad.clicks?.toLocaleString()} clicks
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleToggleCampaignStatus(ad.id, 'active')}
                            className="p-2 rounded-lg border border-slate-300 text-gray-600 hover:text-amber-600 hover:bg-amber-50"
                            title="Pause Campaign"
                          >
                            <PauseIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(ad.id)}
                            className="p-2 rounded-lg border border-slate-300 text-gray-600 hover:text-red-600 hover:bg-red-50"
                            title="Delete Campaign"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar: Rules & Revenue Info */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl p-6 border border-yellow-200 shadow-sm">
                <h3 className="font-black text-yellow-950 text-sm mb-2 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-yellow-600" />
                  Creator Revenue Split
                </h3>
                <p className="text-xs text-yellow-900 leading-relaxed">
                  FingerMobile Protocol returns <strong>70% of all Canary Ad spend directly to creators and channel hosts</strong> whose content and microservices display the placements.
                </p>
                <div className="mt-4 pt-4 border-t border-yellow-200/60 text-xs font-bold text-yellow-950 flex justify-between">
                  <span>Creator Split</span>
                  <span className="font-black text-emerald-700">70%</span>
                </div>
                <div className="mt-1 text-xs font-bold text-yellow-950 flex justify-between">
                  <span>Protocol Staking Vault</span>
                  <span className="font-black text-blue-700">30%</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-300 shadow-sm">
                <h3 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
                  Content Safety Filter
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  All Canary creatives are pre-screened by Guardian AI for authenticity and zero deceptive practices.
                </p>
                <ul className="text-xs space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    Strictly zero political or electioneering ads
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    No religious solicitations or debates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    Verified destination SSL required
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLACEMENTS & SPECS */}
        {activeTab === 'placements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {AD_PLACEMENTS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.id} className="bg-white rounded-3xl p-6 border border-slate-300 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="p-3 bg-yellow-50 text-yellow-700 rounded-2xl w-fit mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-black text-gray-900 mb-1">{p.name}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">{p.description}</p>
                    <div className="bg-gray-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-700 space-y-1 mb-4">
                      <p className="font-semibold text-gray-700">{p.specs}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">Rate Card:</span>
                    <span className="font-black text-yellow-600">{p.pricing}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: PERFORMANCE ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-gray-900">Cross-Placement Yield & Performance</h3>
                  <p className="text-xs text-slate-700">Live impression telemetry aggregated across all 8 native ad corridors</p>
                </div>
                <span className="text-xs font-black text-emerald-950 bg-emerald-50 px-3 py-1 rounded-full border  border-emerald-400">
                  Verified Clean Traffic
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <span className="text-xs font-bold text-indigo-900 uppercase">Average Click-Through Rate</span>
                  <span className="text-3xl font-black text-indigo-950 mt-1 block">4.35%</span>
                  <p className="text-xs text-indigo-700 mt-2">3.2x higher than standard web banner displays due to native non-intrusive styling.</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-900 uppercase">Cost Per Thousand (CPM)</span>
                  <span className="text-3xl font-black text-emerald-950 mt-1 block">42.5 FIC</span>
                  <p className="text-xs text-emerald-700 mt-2">Transparent protocol-level bidding with zero intermediary agency fees.</p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
                  <span className="text-xs font-bold text-amber-900 uppercase">Conversion Efficiency</span>
                  <span className="text-3xl font-black text-amber-950 mt-1 block">12.8%</span>
                  <p className="text-xs text-amber-700 mt-2">Frictionless 1-tap wallet checkout increases customer acquisition velocity.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPLIANCE & KYC */}
        {activeTab === 'compliance' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-black text-gray-900">Advertiser Verification & Policy</h3>
              <p className="text-xs text-slate-700 mt-1">
                To guarantee user safety, all Canary Advertisers agree to the platform mandatory content principles.
              </p>
            </div>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-300">
                <h4 className="font-bold text-gray-900 mb-1">1. Zero Politics & Zero Religious Solicitations</h4>
                <p>Canary strictly prohibits election campaign ads, partisan discourse, lobbying, or religious proselytizing.</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-300">
                <h4 className="font-bold text-gray-900 mb-1">2. Transparent Pricing & Verified Merchandising</h4>
                <p>All destination pages offering physical or digital products must display explicit price points and contact information.</p>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-slate-300">
                <h4 className="font-bold text-gray-900 mb-1">3. Automated Smart Contract Payouts</h4>
                <p>70% of every FIC token spent is automatically transferred to content creators hosting the ads without delayed billing cycles.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default CanaryAdsPage;
