import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Edit3,
  Plus,
  Trash2,
  CheckCircle,
  Shield,
  Zap,
  RotateCcw,
  Save,
  Check,
  Crown,
  Radio,
  FileText,
  Users,
  Search,
  Filter,
  Layers,
  ArrowRight,
  ExternalLink,
  PlayCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  Copy,
  Files,
  CheckSquare,
  Square,
  FolderInput,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface EditableSubscriptionModel {
  id: string;
  category: 'platform' | 'creator_channel' | 'gems_broadcast' | 'content_paywall';
  name: string;
  badge: string;
  description: string;
  monthlyFIC: number;
  monthlyNaira: number;
  billingCycle: 'monthly' | 'weekly' | 'annual' | 'per_item';
  isFreeTier: boolean;
  freeTrialDays: number;
  features: string[];
  targetPage: string;
  pageRoute: string;
  isPopular?: boolean;
  status: 'active' | 'draft' | 'archived';
  subscriberCount?: number;
}

const STORAGE_KEY = 'fingermobile_curated_subscription_models';
const ACTIVE_TEST_KEY = 'fingermobile_active_test_subscription';

export const CURATED_DEFAULT_MODELS: EditableSubscriptionModel[] = [
  // 1. Core Platform Membership Plans (/subscriptions)
  {
    id: 'sub_platform_free',
    category: 'platform',
    name: 'Sovereign Explorer (Free Tier)',
    badge: 'Free Forever',
    description: 'Basic social discovery, standard P2P encrypted messaging, and free entry-level vault.',
    monthlyFIC: 0,
    monthlyNaira: 0,
    billingCycle: 'monthly',
    isFreeTier: true,
    freeTrialDays: 365,
    features: [
      'Basic Social Posting & Discovery Feeds',
      'Encrypted P2P Sovereign Messaging',
      '10 GB Local Media Vault Quota',
      'Standard Video & Music Streaming',
      'Community Directory Access'
    ],
    targetPage: 'Subscriptions Page',
    pageRoute: '/subscriptions',
    status: 'active',
    subscriberCount: 14250
  },
  {
    id: 'sub_platform_rising',
    category: 'platform',
    name: 'Rising Creator',
    badge: 'Starter Pack',
    description: 'Designed for emerging artists, streamers, and photographers entering monetization.',
    monthlyFIC: 1,
    monthlyNaira: 100,
    billingCycle: 'monthly',
    isFreeTier: false,
    freeTrialDays: 7,
    features: [
      'Verified Creator Badge',
      'AI Hashtag & Caption Optimizer',
      'Basic Analytics & Follower Graphs',
      'Creator Storefront Setup (5.0% fee)',
      'Audio Stem Downloads (5/mo)'
    ],
    targetPage: 'Subscriptions Page',
    pageRoute: '/subscriptions',
    status: 'active',
    subscriberCount: 3820
  },
  {
    id: 'sub_platform_growth',
    category: 'platform',
    name: 'Growth Creator',
    badge: 'Visibility Pack',
    description: 'Boost discoverability by 500% across the global feed and unlock 4K streaming.',
    monthlyFIC: 5,
    monthlyNaira: 500,
    billingCycle: 'monthly',
    isFreeTier: false,
    freeTrialDays: 14,
    isPopular: true,
    features: [
      '5x Algorithm Recommendation Priority',
      '4K HDR Livestreaming on Dancia-4Tv',
      'Affiliate Storefront & Paylink Tools',
      'Lower Storefront Commission (3.5%)',
      'Unlimited Audio Stem Downloads',
      'Priority Support Queue'
    ],
    targetPage: 'Subscriptions Page',
    pageRoute: '/subscriptions',
    status: 'active',
    subscriberCount: 8940
  },
  {
    id: 'sub_platform_pro',
    category: 'platform',
    name: 'Professional Creator',
    badge: 'Monetization Pro',
    description: 'For full-time independent creators with active follower communities and product sales.',
    monthlyFIC: 20,
    monthlyNaira: 2000,
    billingCycle: 'monthly',
    isFreeTier: false,
    freeTrialDays: 14,
    features: [
      'Gold Verified Sovereign Checkmark',
      'Ad Revenue Sharing (70/30 split)',
      'Custom Channel Subscription Creator',
      'Lowest Storefront Commission (2.0%)',
      '7-Day Accelerated Escrow Releases',
      'AI Video Enhancement & Mastering'
    ],
    targetPage: 'Subscriptions Page',
    pageRoute: '/subscriptions',
    status: 'active',
    subscriberCount: 2150
  },
  {
    id: 'sub_platform_enterprise',
    category: 'platform',
    name: 'Enterprise / Sovereign',
    badge: 'Media Network',
    description: 'For media companies, record labels, and sovereign franchise operators.',
    monthlyFIC: 100,
    monthlyNaira: 10000,
    billingCycle: 'monthly',
    isFreeTier: false,
    freeTrialDays: 30,
    features: [
      'Platinum Sovereign Network Badge',
      'Ultra-Low Storefront Fee (0.75%)',
      'Ultra-Fast 3-Day Escrow Payouts',
      'Dedicated Account Executive',
      'Custom Domain Routing & API Access',
      'White-Label Telemetry Dashboards'
    ],
    targetPage: 'Subscriptions Page',
    pageRoute: '/subscriptions',
    status: 'active',
    subscriberCount: 420
  },

  // 2. Creator Channel Memberships (/monetization)
  {
    id: 'sub_creator_free_supporter',
    category: 'creator_channel',
    name: 'Free Community Supporter',
    badge: 'Supporter Tier',
    description: 'Complimentary tier for channel followers to participate in community chats.',
    monthlyFIC: 0,
    monthlyNaira: 0,
    billingCycle: 'monthly',
    isFreeTier: true,
    freeTrialDays: 365,
    features: [
      'Public Video & Community Post Feed',
      'Channel Supporter Chat Badge',
      'Open Forum Discussion Access',
      'Creator Notification Alerts'
    ],
    targetPage: 'Creator Monetization & Channels',
    pageRoute: '/monetization',
    status: 'active',
    subscriberCount: 9600
  },
  {
    id: 'sub_creator_vip_pass',
    category: 'creator_channel',
    name: 'VIP Backstage Pass',
    badge: 'Exclusive VIP',
    description: 'Direct backstage access, exclusive livestream replay archives, and stem files.',
    monthlyFIC: 15,
    monthlyNaira: 1500,
    billingCycle: 'monthly',
    isFreeTier: false,
    freeTrialDays: 7,
    features: [
      'Master FLAC Audio Stem Downloads',
      'Behind-the-Scenes Vlogs & Early Releases',
      'Exclusive VIP Live Stream Access',
      'Direct Creator Question Upvoting'
    ],
    targetPage: 'Creator Monetization & Channels',
    pageRoute: '/monetization',
    status: 'active',
    subscriberCount: 1870
  },

  // 3. Gems & Broadcast Subscriptions (/gems)
  {
    id: 'sub_gems_basic_broadcast',
    category: 'gems_broadcast',
    name: 'Basic Broadcast Feed (Free Tier)',
    badge: 'Free Broadcast',
    description: 'Essential real-time notifications and up to 5 daily discovery broadcast updates.',
    monthlyFIC: 0,
    monthlyNaira: 0,
    billingCycle: 'monthly',
    isFreeTier: true,
    freeTrialDays: 365,
    features: [
      '5 Daily Live Broadcast Updates',
      'Standard Audio/Video Bitrate',
      'Public Broadcast Channels',
      'Standard Push Notifications'
    ],
    targetPage: 'Gems & Broadcast Settings',
    pageRoute: '/gems',
    status: 'active',
    subscriberCount: 18400
  },
  {
    id: 'sub_gems_premium_broadcast',
    category: 'gems_broadcast',
    name: 'Premium Crystal Broadcast',
    badge: 'Ultra High Speed',
    description: 'High-frequency broadcast updates, instant priority alerts, and low-latency audio.',
    monthlyFIC: 10,
    monthlyNaira: 1000,
    billingCycle: 'monthly',
    isFreeTier: false,
    freeTrialDays: 7,
    features: [
      '20+ High-Priority Daily Updates',
      'Ultra Low Latency Broadcast Channels',
      'High-Definition 4K Streaming Feeds',
      'Instant Emergency & Price Alerts'
    ],
    targetPage: 'Gems & Broadcast Settings',
    pageRoute: '/gems',
    status: 'active',
    subscriberCount: 3120
  },

  // 4. Content Paywall Subscriptions (/post-publishing-settings)
  {
    id: 'sub_paywall_public_free',
    category: 'content_paywall',
    name: 'Free Public Media Feed',
    badge: 'Open Access',
    description: 'Standard public publishing tier accessible to every authenticated platform user.',
    monthlyFIC: 0,
    monthlyNaira: 0,
    billingCycle: 'per_item',
    isFreeTier: true,
    freeTrialDays: 365,
    features: [
      'Unrestricted Public Post Reading',
      'Standard Photo & Video Viewing',
      'Public Comments & Likes',
      'Social Share Links'
    ],
    targetPage: 'Post Publishing Settings',
    pageRoute: '/post-publishing-settings',
    status: 'active',
    subscriberCount: 45000
  },
  {
    id: 'sub_paywall_subscriber_pass',
    category: 'content_paywall',
    name: 'Subscriber-Only Media Pass',
    badge: 'Paywalled Content',
    description: 'Episodic short dramas, master audio tracks, and premium masterclasses.',
    monthlyFIC: 8,
    monthlyNaira: 800,
    billingCycle: 'monthly',
    isFreeTier: false,
    freeTrialDays: 3,
    features: [
      'Full Access to Paywalled Posts',
      'Auto-Unlock Short Dramas on Dancia',
      'High-Resolution Raw Photo Downloads',
      'Masterclass Video Tutorials'
    ],
    targetPage: 'Post Publishing Settings',
    pageRoute: '/post-publishing-settings',
    status: 'active',
    subscriberCount: 5230
  }
];

export const SUBSCRIPTION_PAGES_DIRECTORY = [
  {
    route: '/subscriptions',
    name: 'Platform Subscriptions & Plans',
    component: 'SubscriptionsPage.tsx',
    category: 'Financials & Membership',
    description: 'Platform Explorer, Rising Creator, Growth, Pro, and Enterprise membership subscriptions.'
  },
  {
    route: '/monetization',
    name: 'Creator Channel Monetization',
    component: 'MonetizationPage.tsx',
    category: 'Creator Economy',
    description: 'Channel memberships, VIP backstage passes, and custom creator tier builders.'
  },
  {
    route: '/gems',
    name: 'Broadcast & Gems Subscriptions',
    component: 'GemsPage.tsx',
    category: 'Media & Realtime',
    description: 'Basic (Free) and Premium high-frequency broadcast stream updates.'
  },
  {
    route: '/post-publishing-settings',
    name: 'Post Publishing & Paywalls',
    component: 'PostPublishingSettingsPage.tsx',
    category: 'Content Publishing',
    description: 'Configure subscription-based content access, paywalled articles, and episodic media.'
  },
  {
    route: '/onboarding',
    name: 'User Onboarding Tier Selector',
    component: 'OnboardingPage.tsx',
    category: 'User Identity',
    description: 'Free tier user onboarding vs. 14-day creator/pro free trial enrollment.'
  },
  {
    route: '/legal/terms',
    name: 'Platform Service Agreement & Subscriptions',
    component: 'PlatformServiceOfUsePage.tsx',
    category: 'Legal & Compliance',
    description: 'Section 9: Subscription Tiers, auto-renewal policies, and terms of service.'
  }
];

interface Props {
  sourceDashboard?: 'MasterDashboard' | 'StercsDashboard';
}

export const SubscriptionModelsConsole: React.FC<Props> = ({ sourceDashboard = 'MasterDashboard' }) => {
  const navigate = useNavigate();
  const [models, setModels] = useState<EditableSubscriptionModel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (_e) {}
    return CURATED_DEFAULT_MODELS;
  });

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFreeTiers, setOnlyFreeTiers] = useState(false);
  const [editingModel, setEditingModel] = useState<EditableSubscriptionModel | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [activeTestTier, setActiveTestTier] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_TEST_KEY) || 'sub_platform_free';
  });
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  // Sync to localStorage
  const saveModelsToStorage = (updated: EditableSubscriptionModel[]) => {
    setModels(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('fingermobile_subscriptions_changed', { detail: updated }));
    setSavedBanner('✅ Subscription models saved & synchronized successfully across platform!');
    setTimeout(() => setSavedBanner(null), 3000);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all subscription models to platform default curated models?')) {
      saveModelsToStorage(CURATED_DEFAULT_MODELS);
    }
  };

  const handleTestFreeTier = (model: EditableSubscriptionModel) => {
    setActiveTestTier(model.id);
    localStorage.setItem(ACTIVE_TEST_KEY, model.id);
    localStorage.setItem('user_active_tier_name', model.name);
    localStorage.setItem('user_active_tier_fic', String(model.monthlyFIC));
    window.dispatchEvent(
      new CustomEvent('fingermobile_tier_test_activated', {
        detail: { modelId: model.id, modelName: model.name, isFreeTier: model.isFreeTier }
      })
    );
    setSavedBanner(`🎉 FREE TIER TEST ACTIVE: "${model.name}" is now live in your session with full free benefits!`);
    setTimeout(() => setSavedBanner(null), 4000);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;

    if (isCreatingNew) {
      const updated = [...models, { ...editingModel, id: `sub_${Date.now()}` }];
      saveModelsToStorage(updated);
    } else {
      const updated = models.map((m) => (m.id === editingModel.id ? editingModel : m));
      saveModelsToStorage(updated);
    }
    setEditingModel(null);
    setIsCreatingNew(false);
  };

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedBuffer, setCopiedBuffer] = useState<EditableSubscriptionModel[]>([]);
  const [targetMoveCategory, setTargetMoveCategory] = useState<'platform' | 'creator_channel' | 'gems_broadcast' | 'content_paywall'>('platform');

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleSelectAll = (visibleIds: string[]) => {
    if (selectedIds.length === visibleIds.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleIds);
    }
  };

  const handleDuplicateSingle = (model: EditableSubscriptionModel) => {
    const clone: EditableSubscriptionModel = {
      ...model,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: `${model.name} (Copy)`,
      badge: `${model.badge}`,
      subscriberCount: 0
    };
    const updated = [...models, clone];
    saveModelsToStorage(updated);
    setSavedBanner(`📋 Duplicated subscription card: "${clone.name}"`);
  };

  const handleDuplicateSelected = () => {
    if (selectedIds.length === 0) return;
    const toClone = models.filter((m) => selectedIds.includes(m.id));
    const clones: EditableSubscriptionModel[] = toClone.map((model, idx) => ({
      ...model,
      id: `sub_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
      name: `${model.name} (Copy)`,
      badge: `${model.badge}`,
      subscriberCount: 0
    }));
    const updated = [...models, ...clones];
    saveModelsToStorage(updated);
    setSelectedIds([]);
    setSavedBanner(`📋 Successfully duplicated ${clones.length} subscription cards!`);
  };

  const handleCopySelected = () => {
    if (selectedIds.length === 0) return;
    const toCopy = models.filter((m) => selectedIds.includes(m.id));
    setCopiedBuffer(toCopy);
    setSavedBanner(`📑 Copied ${toCopy.length} card(s) to clipboard buffer! Ready to paste.`);
  };

  const handlePasteBuffer = () => {
    if (copiedBuffer.length === 0) return;
    const targetCat = activeCategory !== 'all' ? (activeCategory as any) : 'platform';
    const pasted: EditableSubscriptionModel[] = copiedBuffer.map((model, idx) => ({
      ...model,
      id: `sub_${Date.now()}_paste_${idx}`,
      category: targetCat,
      name: `${model.name} (Pasted)`,
      badge: `${model.badge}`,
      subscriberCount: 0
    }));
    const updated = [...models, ...pasted];
    saveModelsToStorage(updated);
    setSavedBanner(`📥 Pasted ${pasted.length} card(s) into category: "${targetCat}"!`);
  };

  const handleMoveSelected = () => {
    if (selectedIds.length === 0) return;
    const updated = models.map((m) => (selectedIds.includes(m.id) ? { ...m, category: targetMoveCategory } : m));
    saveModelsToStorage(updated);
    const count = selectedIds.length;
    setSelectedIds([]);
    setSavedBanner(`🔄 Moved ${count} card(s) to category: "${targetMoveCategory}"!`);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected subscription cards?`)) {
      const updated = models.filter((m) => !selectedIds.includes(m.id));
      saveModelsToStorage(updated);
      setSelectedIds([]);
      setSavedBanner(`🗑️ Deleted ${selectedIds.length} subscription cards.`);
    }
  };

  const handleDeleteModel = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription card?')) {
      const updated = models.filter((m) => m.id !== id);
      saveModelsToStorage(updated);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      setSavedBanner('🗑️ Subscription model removed.');
    }
  };

  const handleSyncToFinancialPnl = () => {
    const totalMonthlyNaira = models.reduce((acc, m) => {
      const subs = m.subscriberCount || 100;
      const nairaRate = m.monthlyNaira || (m.monthlyFIC * 65);
      return acc + (subs * nairaRate);
    }, 0);
    const annualTotalNgn = totalMonthlyNaira * 12;
    localStorage.setItem('fingermobile_synced_subscription_pnl_annual_ngn', String(annualTotalNgn));
    window.dispatchEvent(
      new CustomEvent('fingermobile_subscriptions_pnl_sync', {
        detail: { annualTotalNgn, totalMonthlyNaira, count: models.length }
      })
    );
    setSavedBanner(`📊 Subscriptions synced to Financial P&L! Projected Annual Gross: ₦${annualTotalNgn.toLocaleString()} across ${models.length} active models.`);
  };

  const filteredModels = models.filter((m) => {
    if (activeCategory !== 'all' && m.category !== activeCategory) return false;
    if (onlyFreeTiers && !m.isFreeTier) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchDesc = m.description.toLowerCase().includes(q);
      const matchFeatures = m.features.some((f) => f.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchFeatures) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/30 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/40 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                {sourceDashboard === 'StercsDashboard' ? 'STERCS Curation Engine' : 'Master Control Console'}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                100% Live Editable
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Subscription Models & Free Tier Sandbox
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              Curate, configure, and edit subscription tiers across all platform pages. Test out Free Tiers instantly in the frontend with real session simulation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setEditingModel({
                  id: '',
                  category: 'platform',
                  name: 'New Custom Tier',
                  badge: 'Custom',
                  description: 'Description of the new subscription tier.',
                  monthlyFIC: 10,
                  monthlyNaira: 1000,
                  billingCycle: 'monthly',
                  isFreeTier: false,
                  freeTrialDays: 7,
                  features: ['Feature 1', 'Feature 2'],
                  targetPage: 'Custom Module',
                  pageRoute: '/subscriptions',
                  status: 'active'
                });
                setIsCreatingNew(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Model</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Reset to Curated Platform Defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>

        {savedBanner && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold animate-fadeIn flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{savedBanner}</span>
          </div>
        )}
      </div>

      {/* Pages Directory Accordion / Grid */}
      <div className="rounded-2xl p-5 bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Platform Pages Requiring or Offering Subscriptions ({SUBSCRIPTION_PAGES_DIRECTORY.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Click any page to test its live frontend</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUBSCRIPTION_PAGES_DIRECTORY.map((page) => (
            <div
              key={page.route}
              onClick={() => navigate(page.route)}
              className="group p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800 hover:border-sky-500/50 cursor-pointer transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-sky-400 group-hover:text-sky-300 flex items-center gap-1">
                  {page.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {page.route}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-2">
                {page.description}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
                <span className="font-mono">{page.component}</span>
                <span className="text-sky-400 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Visit <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Models', count: models.length },
            { id: 'platform', label: 'Platform Plans', count: models.filter((m) => m.category === 'platform').length },
            { id: 'creator_channel', label: 'Creator Channels', count: models.filter((m) => m.category === 'creator_channel').length },
            { id: 'gems_broadcast', label: 'Gems Broadcast', count: models.filter((m) => m.category === 'gems_broadcast').length },
            { id: 'content_paywall', label: 'Content Paywall', count: models.filter((m) => m.category === 'content_paywall').length },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({cat.count})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOnlyFreeTiers(!onlyFreeTiers)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 ${
              onlyFreeTiers
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Free Tiers Only</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tiers or perks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 sm:w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-950/70 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Selection, Duplication, Copy/Paste, Move & P&L Sync Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSelectAll(filteredModels.map((m) => m.id))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold flex items-center gap-1.5 transition"
          >
            {selectedIds.length === filteredModels.length && filteredModels.length > 0 ? (
              <CheckSquare className="w-4 h-4 text-blue-400" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
            <span>
              {selectedIds.length === filteredModels.length && filteredModels.length > 0
                ? 'Deselect All'
                : `Select All (${filteredModels.length})`}
            </span>
          </button>

          {selectedIds.length > 0 && (
            <span className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
              {selectedIds.length} card{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          )}

          {/* Duplicate Selected */}
          <button
            onClick={handleDuplicateSelected}
            disabled={selectedIds.length === 0}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              selectedIds.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
            title="Duplicate all selected cards"
          >
            <Files className="w-3.5 h-3.5" />
            <span>Duplicate Selected ({selectedIds.length})</span>
          </button>

          {/* Copy Selected */}
          <button
            onClick={handleCopySelected}
            disabled={selectedIds.length === 0}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition ${
              selectedIds.length > 0
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
            title="Copy selected cards to buffer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy ({selectedIds.length})</span>
          </button>

          {/* Paste Buffer */}
          {copiedBuffer.length > 0 && (
            <button
              onClick={handlePasteBuffer}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 shadow-md animate-pulse"
              title="Paste buffered cards as duplicates into active category"
            >
              <FolderInput className="w-3.5 h-3.5" />
              <span>Paste ({copiedBuffer.length}) Cards</span>
            </button>
          )}

          {/* Move to Category */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-lg border border-slate-700">
              <span className="text-[11px] text-slate-300 font-semibold px-1">Move to:</span>
              <select
                value={targetMoveCategory}
                onChange={(e) => setTargetMoveCategory(e.target.value as any)}
                className="bg-slate-900 text-white text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none"
              >
                <option value="platform">Platform Plans</option>
                <option value="creator_channel">Creator Channel</option>
                <option value="gems_broadcast">Gems Broadcast</option>
                <option value="content_paywall">Content Paywall</option>
              </select>
              <button
                onClick={handleMoveSelected}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                Apply Move
              </button>
            </div>
          )}

          {/* Delete Selected */}
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="px-2.5 py-1.5 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/60 font-bold flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete ({selectedIds.length})</span>
            </button>
          )}
        </div>

        {/* Sync Subscriptions to P&L */}
        <button
          onClick={handleSyncToFinancialPnl}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition ml-auto"
          title="Recalculate subscription revenue and feed into Financial P&L"
        >
          <TrendingUp className="w-4 h-4 text-emerald-200" />
          <span>Sync Subscriptions to Financial P&L</span>
        </button>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModels.map((model) => {
          const isCurrentActiveTest = activeTestTier === model.id;
          const isSelected = selectedIds.includes(model.id);

          return (
            <div
              key={model.id}
              className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all shadow-md ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              } ${
                model.isFreeTier
                  ? 'bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-950 border-emerald-500/30 hover:border-emerald-500/60 shadow-emerald-500/5'
                  : model.isPopular
                  ? 'bg-gradient-to-b from-blue-950/25 via-slate-900 to-slate-950 border-blue-500/40 hover:border-blue-500/70 shadow-blue-500/5'
                  : 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Badges & Select */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(model.id)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer border-slate-700 bg-slate-900"
                      title="Select card for duplication, copy, or move"
                    />
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border ${
                        model.isFreeTier
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      {model.badge}
                    </span>
                    {model.isPopular && (
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        Popular
                      </span>
                    )}
                    {model.isFreeTier && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                        FREE TIER
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Duplicate Single Card */}
                    <button
                      onClick={() => handleDuplicateSingle(model)}
                      className="p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                      title="Duplicate this subscription card"
                    >
                      <Files className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingModel({ ...model });
                        setIsCreatingNew(false);
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                      title="Edit Model"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteModel(model.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Delete Model"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Model Title & Price */}
                <h3 className="text-lg font-black text-white tracking-tight mb-1">
                  {model.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {model.description}
                </p>

                {/* Price Display */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-white">
                        {model.monthlyFIC === 0 ? 'FREE' : `${model.monthlyFIC} FIC`}
                      </span>
                      {model.monthlyFIC > 0 && (
                        <span className="text-xs text-slate-400 ml-1">/{model.billingCycle}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400 block">
                        {model.monthlyNaira === 0 ? '₦0' : `₦${model.monthlyNaira.toLocaleString()}`}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {model.freeTrialDays > 0 ? `${model.freeTrialDays}-Day Free Trial` : 'No Trial'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-1.5 mb-5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Included Capabilities ({model.features.length}):
                  </span>
                  {model.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Target: {model.targetPage}</span>
                  <button
                    onClick={() => navigate(model.pageRoute)}
                    className="text-sky-400 hover:underline flex items-center gap-0.5"
                  >
                    View Page <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

                {model.isFreeTier ? (
                  <button
                    onClick={() => handleTestFreeTier(model)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isCurrentActiveTest
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300'
                    }`}
                  >
                    {isCurrentActiveTest ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Active Session Free Tier</span>
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4 text-emerald-400" />
                        <span>Test Out This Free Tier</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      alert(`Testing paid subscription checkout for "${model.name}" (${model.monthlyFIC} FIC). Redirecting to Subscriptions...`);
                      navigate(model.pageRoute);
                    }}
                    className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Test Tier Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {editingModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                <span>{isCreatingNew ? 'Create New Subscription Model' : 'Edit Subscription Model'}</span>
              </h3>
              <button
                onClick={() => setEditingModel(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Tier Name</label>
                  <input
                    type="text"
                    required
                    value={editingModel.name}
                    onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Badge Label</label>
                  <input
                    type="text"
                    required
                    value={editingModel.badge}
                    onChange={(e) => setEditingModel({ ...editingModel, badge: e.target.value })}
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  required
                  value={editingModel.description}
                  onChange={(e) => setEditingModel({ ...editingModel, description: e.target.value })}
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Monthly FIC</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={editingModel.monthlyFIC}
                    onChange={(e) =>
                      setEditingModel({
                        ...editingModel,
                        monthlyFIC: parseFloat(e.target.value) || 0,
                        isFreeTier: parseFloat(e.target.value) === 0
                      })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Naira (₦)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingModel.monthlyNaira}
                    onChange={(e) =>
                      setEditingModel({ ...editingModel, monthlyNaira: parseInt(e.target.value) || 0 })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Free Trial (Days)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingModel.freeTrialDays}
                    onChange={(e) =>
                      setEditingModel({ ...editingModel, freeTrialDays: parseInt(e.target.value) || 0 })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                  <select
                    value={editingModel.category}
                    onChange={(e) =>
                      setEditingModel({ ...editingModel, category: e.target.value as any })
                    }
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    <option value="platform">Platform Plans</option>
                    <option value="creator_channel">Creator Channel</option>
                    <option value="gems_broadcast">Gems Broadcast</option>
                    <option value="content_paywall">Content Paywall</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Free Tier Model</span>
                  <span className="text-[11px] text-slate-400">
                    Designate this model as a 100% Free Tier for testing and community explorer tier.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={editingModel.isFreeTier}
                  onChange={(e) =>
                    setEditingModel({
                      ...editingModel,
                      isFreeTier: e.target.checked,
                      monthlyFIC: e.target.checked ? 0 : editingModel.monthlyFIC,
                      monthlyNaira: e.target.checked ? 0 : editingModel.monthlyNaira
                    })
                  }
                  className="w-4 h-4 text-emerald-500 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Features (One feature per line)
                </label>
                <textarea
                  rows={4}
                  value={editingModel.features.join('\n')}
                  onChange={(e) =>
                    setEditingModel({
                      ...editingModel,
                      features: e.target.value.split('\n').filter((l) => l.trim().length > 0)
                    })
                  }
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingModel(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionModelsConsole;
