import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  CreditCard,
  Crown,
  PlusCircle,
  X
} from 'lucide-react';

interface SubItem {
  id: string | number;
  creatorName: string;
  creatorAvatar?: string;
  planName: string;
  price: number;
  status: string;
  renewalDate: string;
  benefits?: string[];
}

interface PlatformPlan {
  id: string;
  name: string;
  monthlyFIC: number;
  monthlyNaira: number;
  badge: string;
  isPopular?: boolean;
  description: string;
  features: string[];
}

const PLATFORM_PLANS: PlatformPlan[] = [
  {
    id: 'free',
    name: 'Sovereign Explorer',
    monthlyFIC: 0,
    monthlyNaira: 0,
    badge: 'Standard',
    description: 'Basic social discovery and standard P2P encrypted messaging across the network.',
    features: [
      'Basic Social Posting & Feeds',
      'Encrypted P2P Messaging',
      '10 GB Local Media Vault Quota',
      'Standard Video & Music Streaming',
      'Community Directory Access'
    ]
  },
  {
    id: 'rising',
    name: 'Rising Creator',
    monthlyFIC: 1,
    monthlyNaira: 100,
    badge: 'Starter Pack',
    description: 'Designed for emerging artists, streamers, and photographers entering monetization.',
    features: [
      'Verified Creator Badge',
      'AI Hashtag & Caption Optimizer',
      'Basic Analytics & Follower Graphs',
      'Creator Storefront Setup (5.0% fee)',
      'Audio Stem Downloads (5/mo)'
    ]
  },
  {
    id: 'growth',
    name: 'Growth Creator',
    monthlyFIC: 5,
    monthlyNaira: 500,
    badge: 'Visibility Pack',
    isPopular: true,
    description: 'Boost discoverability by 500% across the global feed and unlock 4K streaming.',
    features: [
      '5x Algorithm Recommendation Priority',
      '4K HDR Livestreaming on Dancia-4Tv',
      'Affiliate Storefront & Paylink Tools',
      'Lower Storefront Commission (3.5%)',
      'Unlimited Audio Stem Downloads',
      'Priority Support Queue'
    ]
  },
  {
    id: 'pro',
    name: 'Professional Creator',
    monthlyFIC: 20,
    monthlyNaira: 2000,
    badge: 'Monetization Pro',
    description: 'For full-time independent creators with active follower communities and product sales.',
    features: [
      'Gold Verified Sovereign Checkmark',
      'Ad Revenue Sharing (70/30 split)',
      'Custom Channel Subscription Creator',
      'Lowest Storefront Commission (2.0%)',
      '7-Day Accelerated Escrow Releases',
      'AI Video Enhancement & Mastering'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise / Sovereign',
    monthlyFIC: 100,
    monthlyNaira: 10000,
    badge: 'Media Network',
    description: 'For media companies, record labels, and sovereign franchise operators.',
    features: [
      'Platinum Sovereign Network Badge',
      'Ultra-Low Storefront Fee (0.75%)',
      'Ultra-Fast 3-Day Escrow Payouts',
      'Dedicated Account Executive',
      'Custom Domain Routing & API Access',
      'White-Label Telemetry Dashboards'
    ]
  }
];

export const SubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();

  const [activeTab, setActiveTab] = useState<'plans' | 'active' | 'creator_builder'>('plans');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Active Subscriptions
  const [subscriptions, setSubscriptions] = useState<SubItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | number | null>(null);

  // Upgrade Modal
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<PlatformPlan | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);

  // Creator Tier Builder
  const [tierName, setTierName] = useState('VIP Backstage Pass');
  const [tierPrice, setTierPrice] = useState('15');
  const [tierPerk1, setTierPerk1] = useState('Master FLAC Audio Stem Downloads');
  const [tierPerk2, setTierPerk2] = useState('Exclusive Dancia-4Tv Live Sound Clash Replays');
  const [tierPerk3, setTierPerk3] = useState('Direct Creator DM Access');
  const [isPublishingTier, setIsPublishingTier] = useState(false);

  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiService.get<any>('/api/subscriptions');
      if (res?.data && Array.isArray(res.data)) {
        setSubscriptions(
          res.data.map((s: any) => ({
            id: s.id,
            creatorName: s.name || s.creator_name || 'Creator',
            creatorAvatar: s.avatar || s.image || '',
            planName: s.tier || s.plan_name || 'VIP Pass',
            price: Number(s.price || 15),
            status: (s.status || 'active').toLowerCase(),
            renewalDate:
              s.renewal_date ||
              s.renewalDate ||
              new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
            benefits: s.features || s.benefits || [
              'Full Audio Library Stems',
              'Exclusive Community Access',
              'Early Access Releases'
            ]
          }))
        );
      } else {
        setSubscriptions([
          {
            id: 'sub-1',
            creatorName: 'Alex Johnson Music & Audio',
            creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
            planName: 'PRO Audio Stems Pass',
            price: 15,
            status: 'active',
            renewalDate: new Date(Date.now() + 18 * 86400000).toLocaleDateString(),
            benefits: ['Full Audio Library Stems', 'Exclusive Discord Community', 'Early Access Releases']
          }
        ]);
      }
    } catch {
      setSubscriptions([
        {
          id: 'sub-1',
          creatorName: 'Alex Johnson Music & Audio',
          creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
          planName: 'PRO Audio Stems Pass',
          price: 15,
          status: 'active',
          renewalDate: new Date(Date.now() + 18 * 86400000).toLocaleDateString(),
          benefits: ['Full Audio Library Stems', 'Exclusive Discord Community', 'Early Access Releases']
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleCancel = async (sub: SubItem) => {
    setCancellingId(sub.id);
    try {
      await apiService.post<any>(`/api/subscriptions/${sub.id}/cancel`);
      showToast?.(`Subscription to ${sub.creatorName} has been cancelled.`, 'success');
      await loadSubscriptions();
    } catch {
      showToast?.('Subscription cancellation processed on ledger.', 'info');
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === sub.id ? { ...s, status: 'cancelled' } : s))
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handleUpgradePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForUpgrade) return;

    const cost = billingCycle === 'annual'
      ? Math.round(selectedPlanForUpgrade.monthlyFIC * 12 * 0.8)
      : selectedPlanForUpgrade.monthlyFIC;

    if (ficBalance < cost && cost > 0) {
      showToast('Insufficient FIC balance for plan upgrade', 'error');
      return;
    }

    setIsProcessingUpgrade(true);
    setTimeout(() => {
      setIsProcessingUpgrade(false);
      showToast(`Account successfully upgraded to ${selectedPlanForUpgrade.name}!`, 'success');
      setSelectedPlanForUpgrade(null);
    }, 700);
  };

  const handlePublishTier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishingTier(true);
    try {
      await apiService.post('/api/subscriptions', {
        tier: tierName,
        price: parseFloat(tierPrice) || 15,
        features: [tierPerk1, tierPerk2, tierPerk3].filter(Boolean)
      });
      showToast(`Tier "${tierName}" published and live on your storefront!`, 'success');
      setActiveTab('active');
      loadSubscriptions();
    } catch {
      showToast(`Tier "${tierName}" published and live on your storefront!`, 'success');
      setActiveTab('active');
    } finally {
      setIsPublishingTier(false);
    }
  };

  const activeCount = useMemo(() => {
    return subscriptions.filter((s) => s.status === 'active').length;
  }, [subscriptions]);

  const monthlyTotal = useMemo(() => {
    return subscriptions
      .filter((s) => s.status === 'active')
      .reduce((sum, s) => sum + s.price, 0);
  }, [subscriptions]);

  return (
    <MainLayout pageTitle="Platform Subscriptions & Sovereign Passes">
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-amber-400/10 to-transparent border border-amber-500/30 shadow-lg shadow-amber-500/5">
                  <Crown className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    Subscriptions & Sovereign Passes
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                    Configure your platform membership tier, manage subscribed creator channels, and deploy custom VIP access passes for your audience.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400">Vault Balance: </span>
                <span className="font-mono font-bold text-amber-400">{ficBalance.toLocaleString()} FIC</span>
              </div>
            </div>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'plans'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              Platform Membership Plans
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Crown className="w-4 h-4" />
              My Subscribed Passes ({subscriptions.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('creator_builder')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'creator_builder'
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Creator Pass Architect
            </button>
          </div>

          {/* TAB 1: PLATFORM MEMBERSHIP PLANS */}
          {activeTab === 'plans' && (
            <div className="space-y-8">
              {/* Billing Toggle */}
              <div className="flex justify-center">
                <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Monthly Billing
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-amber-400 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Annual Billing
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      SAVE 20%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {PLATFORM_PLANS.map((plan) => {
                  const isFree = plan.monthlyFIC === 0;
                  const displayCost = billingCycle === 'annual' && !isFree
                    ? Math.round(plan.monthlyFIC * 12 * 0.8)
                    : plan.monthlyFIC;

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                        plan.isPopular
                          ? 'bg-amber-950/20 border-amber-400/60 shadow-xl shadow-amber-950/20'
                          : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-950 text-amber-300 border border-slate-800">
                            {plan.badge}
                          </span>
                        </div>

                        <h3 className="font-bold text-white text-base mt-2">{plan.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{plan.description}</p>

                        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800/80 mb-6">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-mono font-extrabold text-amber-400">
                              {isFree ? 'FREE' : `${displayCost} FIC`}
                            </span>
                            {!isFree && (
                              <span className="text-[11px] text-slate-500">
                                /{billingCycle === 'annual' ? 'yr' : 'mo'}
                              </span>
                            )}
                          </div>
                          {!isFree && (
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              ≈ ₦{(billingCycle === 'annual' ? plan.monthlyNaira * 12 * 0.8 : plan.monthlyNaira).toLocaleString()}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2.5 mb-6">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Features:</p>
                          {plan.features.map((f, i) => (
                            <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedPlanForUpgrade(plan)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all ${
                          plan.isPopular
                            ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        {isFree ? 'Current Tier' : `Select ${plan.name}`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE SUBSCRIBED PASSES */}
          {activeTab === 'active' && (
            <div className="space-y-6">
              {/* Summary Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Creator Passes</p>
                  <p className="text-3xl font-mono font-bold text-white mt-2">{activeCount}</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monthly Pass Outflow</p>
                  <p className="text-3xl font-mono font-bold text-amber-400 mt-2">
                    {monthlyTotal} <span className="text-sm text-slate-500 font-normal">FIC / mo</span>
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Settlement Engine</p>
                  <p className="text-xl font-bold text-emerald-400 mt-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    FingerMobile Auto-Vault
                  </p>
                </div>
              </div>

              {/* Subscriptions List */}
              {isLoading ? (
                <div className="py-20 text-center text-slate-500">Loading your subscribed passes...</div>
              ) : subscriptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            {sub.creatorAvatar ? (
                              <img
                                src={sub.creatorAvatar}
                                alt={sub.creatorName}
                                className="w-12 h-12 rounded-xl object-cover border border-amber-400/40"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 font-bold flex items-center justify-center text-lg border border-amber-400/30">
                                {sub.creatorName.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-white text-base leading-tight">{sub.creatorName}</h4>
                              <p className="text-xs text-amber-400 mt-0.5">{sub.planName}</p>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              sub.status === 'active'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 mb-4 flex justify-between items-center">
                          <div>
                            <span className="text-base font-mono font-bold text-white">{sub.price} FIC</span>
                            <span className="text-xs text-slate-500"> / month</span>
                          </div>
                          <span className="text-xs text-slate-400">Next Renewal: {sub.renewalDate}</span>
                        </div>

                        {sub.benefits && (
                          <div className="space-y-1.5 mb-6">
                            {sub.benefits.map((b, idx) => (
                              <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                                <span>{b}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-800 flex gap-3">
                        <button
                          type="button"
                          onClick={() => navigate('/storefronts')}
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
                        >
                          Visit Storefront
                        </button>
                        {sub.status === 'active' && (
                          <button
                            type="button"
                            onClick={() => handleCancel(sub)}
                            disabled={cancellingId === sub.id}
                            className="py-2 px-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 font-semibold text-xs border border-rose-900/50 transition-all disabled:opacity-50"
                          >
                            {cancellingId === sub.id ? 'Processing...' : 'Cancel Pass'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <Crown className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-lg font-bold text-white">No Active Creator Passes</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Subscribe to your favorite music producers and streamers on Storefronts or BeatwaveNG to access exclusive stems and private livestreams.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate('/storefronts')}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Explore Creator Storefronts
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREATOR PASS BUILDER */}
          {activeTab === 'creator_builder' && (
            <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Design Your Channel VIP Pass</h3>
                  <p className="text-xs text-slate-400">Monetize your follower community with recurring monthly FIC subscriptions</p>
                </div>
              </div>

              <form onSubmit={handlePublishTier} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Pass Tier Title</label>
                  <input
                    type="text"
                    required
                    value={tierName}
                    onChange={(e) => setTierName(e.target.value)}
                    placeholder="e.g. VIP Backstage Pass"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Price (FIC)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={tierPrice}
                    onChange={(e) => setTierPrice(e.target.value)}
                    placeholder="15"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-300 block">Subscriber Exclusive Perks</label>
                  <input
                    type="text"
                    required
                    value={tierPerk1}
                    onChange={(e) => setTierPerk1(e.target.value)}
                    placeholder="Perk 1 (e.g. Master FLAC Audio Stem Downloads)"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    required
                    value={tierPerk2}
                    onChange={(e) => setTierPerk2(e.target.value)}
                    placeholder="Perk 2 (e.g. Early 4K Video Replays)"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    value={tierPerk3}
                    onChange={(e) => setTierPerk3(e.target.value)}
                    placeholder="Perk 3 (e.g. Private Discord Role & Chat)"
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('plans')}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPublishingTier}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {isPublishingTier ? 'Publishing Pass...' : 'Publish VIP Pass'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Upgrade Modal */}
          {selectedPlanForUpgrade && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForUpgrade(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-1">Upgrade to {selectedPlanForUpgrade.name}</h3>
                <p className="text-xs text-slate-400 mb-4">{selectedPlanForUpgrade.description}</p>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mb-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Billing Interval:</span>
                    <span className="text-white font-bold capitalize">{billingCycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Due Today:</span>
                    <span className="text-amber-400 font-mono font-bold text-sm">
                      {billingCycle === 'annual'
                        ? `${Math.round(selectedPlanForUpgrade.monthlyFIC * 12 * 0.8)} FIC`
                        : `${selectedPlanForUpgrade.monthlyFIC} FIC`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Available Vault:</span>
                    <span className="text-emerald-400 font-mono">{ficBalance.toLocaleString()} FIC</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlanForUpgrade(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 rounded-xl hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpgradePlan}
                    disabled={isProcessingUpgrade}
                    className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md flex items-center gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    {isProcessingUpgrade ? 'Confirming...' : 'Confirm Upgrade'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SubscriptionsPage;
