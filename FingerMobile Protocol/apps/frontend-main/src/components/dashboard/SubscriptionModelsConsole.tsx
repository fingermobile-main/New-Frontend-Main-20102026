import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Edit3,
  Plus,
  Trash2,
  Search,
  Layers,
  ArrowRight,
  PlayCircle,
  Database,
  ArrowUp,
  ArrowDown,
  Pause,
  Play,
  Upload,
  X,
  TrendingUp,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  SubscriptionModelItem,
  SubscriptionModelsOverview,
  SubscriptionModelsSpawn,
  CreateSubscriptionModelPayload
} from '../../types/subscriptionModelsConsole';
import { subscriptionModelsConsoleService } from '../../services/subscriptionModelsConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

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

export interface Props {
  sourceDashboard?: 'MasterDashboard' | 'StercsDashboard';
}

export const SubscriptionModelsConsole: React.FC<Props> = ({ sourceDashboard = 'MasterDashboard' }) => {
  const navigate = useNavigate();

  // State
  const [items, setItems] = useState<SubscriptionModelItem[]>([]);
  const [overview, setOverview] = useState<SubscriptionModelsOverview | null>(null);
  const [spawns, setSpawns] = useState<SubscriptionModelsSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyFreeTiers, setOnlyFreeTiers] = useState<boolean>(false);
  const [activeTestTier, setActiveTestTier] = useState<string | null>('sub_platform_free');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Form State
  const [editingItem, setEditingItem] = useState<SubscriptionModelItem | null>(null);
  const [formId, setFormId] = useState<string>('');
  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('platform');
  const [formMonthlyFic, setFormMonthlyFic] = useState<number>(0);
  const [formAnnualFic, setFormAnnualFic] = useState<number>(0);
  const [formMonthlyNgn, setFormMonthlyNgn] = useState<number>(0);
  const [formAnnualNgn, setFormAnnualNgn] = useState<number>(0);
  const [formIsFreeTier, setFormIsFreeTier] = useState<boolean>(false);
  const [formBadge, setFormBadge] = useState<string>('Standard');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formFeaturesText, setFormFeaturesText] = useState<string>('');
  const [formTargetVolumeFic, setFormTargetVolumeFic] = useState<number>(0);

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnCategory, setSpawnCategory] = useState<string>('Monetization');
  const [spawnEndpoint, setSpawnEndpoint] = useState<string>('/api/subscription-models-console/spawns');

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) {
      audioEngine.playVoiceLine(voice);
    }
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewData, itemsData, spawnsData] = await Promise.all([
        subscriptionModelsConsoleService.getOverview(),
        subscriptionModelsConsoleService.getItems({
          category: activeCategory === 'all' ? undefined : activeCategory,
          status: selectedStatus === 'all' ? undefined : selectedStatus,
          search: searchQuery.trim() || undefined
        }),
        subscriptionModelsConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch (_err: any) {
      showToast('Error syncing with PostgreSQL Monetization DB', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (item: SubscriptionModelItem) => {
    try {
      const updated = await subscriptionModelsConsoleService.toggleFreeze(item.id);
      setItems(prev => prev.map(i => (i.id === item.id ? updated : i)));
      if (updated.status === 'frozen') {
        showToast(`Tier "${updated.name}" quarantined / frozen from enrollments!`, 'wahala');
      } else {
        showToast(`Tier "${updated.name}" restored to active enrollment catalog!`, 'sweet');
      }
      loadData();
    } catch (err: any) {
      showToast('Failed to switch tier freeze status', 'see_gobe');
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const sourceItem = items[currentIndex];
    const targetItem = items[targetIndex];

    try {
      const reordered = await subscriptionModelsConsoleService.reorderItems(sourceItem.id, targetItem.id);
      setItems(reordered);
      showToast('Subscription tiers resequenced in PostgreSQL!', 'gbaski');
    } catch (err: any) {
      showToast('Failed to reorder subscription tiers in database', 'wahala');
    }
  };

  const handleDelete = async (item: SubscriptionModelItem) => {
    if (!window.confirm(`Are you sure you want to delete tier "${item.name}" from PostgreSQL?`)) return;

    try {
      await subscriptionModelsConsoleService.deleteItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast(`Subscription tier "${item.name}" deleted from database`, 'owo_ni_koko');
      loadData();
    } catch (err: any) {
      showToast('Failed to delete subscription model', 'see_gobe');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) {
      showToast('Tier Name is required', 'wahala');
      return;
    }

    try {
      const parsedFeatures = formFeaturesText.split('\n').map(s => s.trim()).filter(Boolean);
      const generatedId = formId.trim() || `sub_${Date.now()}`;
      const payload: CreateSubscriptionModelPayload = {
        id: generatedId,
        name: formName,
        category: formCategory,
        monthly_fic: Number(formMonthlyFic),
        annual_fic: Number(formAnnualFic) || Number(formMonthlyFic) * 10,
        monthly_ngn: Number(formMonthlyNgn) || Number(formMonthlyFic) * 100,
        annual_ngn: Number(formAnnualNgn) || (Number(formMonthlyNgn) || Number(formMonthlyFic) * 100) * 10,
        is_free_tier: Boolean(formIsFreeTier || Number(formMonthlyFic) === 0),
        badge: formBadge,
        description: formDescription,
        features: parsedFeatures,
        target_annual_volume_fic: Number(formTargetVolumeFic)
      };

      const created = await subscriptionModelsConsoleService.createItem(payload);
      setItems(prev => [...prev, created]);
      setIsAddModalOpen(false);
      resetForm();
      showToast(`Tier "${created.name}" created and committed to PostgreSQL!`, 'great_combo');
      loadData();
    } catch (err: any) {
      showToast('Failed to create subscription tier in PostgreSQL', 'see_gobe');
    }
  };

  const handleOpenEdit = (item: SubscriptionModelItem) => {
    setEditingItem(item);
    setFormId(item.id);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormMonthlyFic(Number(item.monthly_fic));
    setFormAnnualFic(Number(item.annual_fic));
    setFormMonthlyNgn(Number(item.monthly_ngn));
    setFormAnnualNgn(Number(item.annual_ngn));
    setFormIsFreeTier(Boolean(item.is_free_tier));
    setFormBadge(item.badge || 'Standard');
    setFormDescription(item.description || '');
    setFormFeaturesText((item.features || []).join('\n'));
    setFormTargetVolumeFic(Number(item.target_annual_volume_fic || 0));
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const parsedFeatures = formFeaturesText.split('\n').map(s => s.trim()).filter(Boolean);
      const payload: Partial<CreateSubscriptionModelPayload> = {
        name: formName,
        category: formCategory,
        monthly_fic: Number(formMonthlyFic),
        annual_fic: Number(formAnnualFic),
        monthly_ngn: Number(formMonthlyNgn),
        annual_ngn: Number(formAnnualNgn),
        is_free_tier: Boolean(formIsFreeTier || Number(formMonthlyFic) === 0),
        badge: formBadge,
        description: formDescription,
        features: parsedFeatures,
        target_annual_volume_fic: Number(formTargetVolumeFic)
      };

      const updated = await subscriptionModelsConsoleService.updateItem(editingItem.id, payload);
      setItems(prev => prev.map(i => (i.id === editingItem.id ? updated : i)));
      setIsEditModalOpen(false);
      setEditingItem(null);
      resetForm();
      showToast(`Tier "${updated.name}" updated successfully in database!`, 'blessings');
      loadData();
    } catch (err: any) {
      showToast('Failed to update subscription tier', 'wahala');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Please select a tier document or asset', 'wahala');
      return;
    }

    try {
      setUploading(true);
      const res = await subscriptionModelsConsoleService.uploadAsset(uploadFile);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      showToast(`Asset "${res.filename}" uploaded direct to Express backend!`, 'sweet');
    } catch (_err: any) {
      showToast('Upload to backend failed', 'see_gobe');
    } finally {
      setUploading(false);
    }
  };

  const handleSpawn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnName || !spawnSlug) {
      showToast('Sub-Console Name and Slug are required', 'wahala');
      return;
    }

    try {
      const newSpawn = await subscriptionModelsConsoleService.spawnSubConsole({
        sub_console_name: spawnName,
        slug: spawnSlug,
        endpoint: spawnEndpoint,
        category: spawnCategory
      });
      setSpawns(prev => [...prev, newSpawn]);
      setIsSpawnModalOpen(false);
      setSpawnName('');
      setSpawnSlug('');
      showToast(`Monetization Sub-Console "${newSpawn.sub_console_name}" spawned!`, 'colossal_combo');
      loadData();
    } catch (err: any) {
      showToast('Failed to spawn sub-console', 'wahala');
    }
  };

  const handleTestFreeTier = (item: SubscriptionModelItem) => {
    setActiveTestTier(item.id);
    window.dispatchEvent(
      new CustomEvent('fingermobile_tier_test_activated', {
        detail: { modelId: item.id, modelName: item.name, isFreeTier: item.is_free_tier }
      })
    );
    showToast(`FREE TIER TEST ACTIVE: "${item.name}" live in session!`, 'sweet');
  };

  const handleSyncToFinancialPnl = () => {
    const totalMonthlyNaira = items.reduce((acc, m) => {
      const subs = m.subscriber_count || 100;
      const nairaRate = Number(m.monthly_ngn) || (Number(m.monthly_fic) * 100);
      return acc + (subs * nairaRate);
    }, 0);
    const annualTotalNgn = totalMonthlyNaira * 12;

    window.dispatchEvent(
      new CustomEvent('fingermobile_subscriptions_pnl_sync', {
        detail: { annualTotalNgn, totalMonthlyNaira, count: items.length }
      })
    );
    showToast(`P&L Synchronized! Projected Annual Gross: ₦${annualTotalNgn.toLocaleString()}`, 'gbaski');
  };

  const resetForm = () => {
    setFormId('');
    setFormName('');
    setFormCategory('platform');
    setFormMonthlyFic(0);
    setFormAnnualFic(0);
    setFormMonthlyNgn(0);
    setFormAnnualNgn(0);
    setFormIsFreeTier(false);
    setFormBadge('Standard');
    setFormDescription('');
    setFormFeaturesText('');
    setFormTargetVolumeFic(0);
  };

  const filteredItems = items.filter(m => {
    if (onlyFreeTiers && !m.is_free_tier) return false;
    return true;
  });

  return (
    <div className="space-y-6 bg-slate-50 p-6 rounded-2xl border border-slate-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 transition-all">
          <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-sm font-semibold text-slate-100">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-950 border border-blue-400 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-800" />
              <span>{sourceDashboard === 'StercsDashboard' ? 'STERCS Curation Engine' : 'Master Control Console'}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-400 flex items-center space-x-1">
              <Database className="w-3.5 h-3.5 text-emerald-800" />
              <span>PostgreSQL Live Persisted</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Subscription Models & Monetization Tiers Console
          </h1>
          <p className="text-sm font-medium text-slate-700 max-w-3xl">
            Micromanage platform memberships, creator channel passes, and high-frequency gems tiers directly in PostgreSQL. Direct multipart upload with zero client localStorage fallback.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => {
              showToast('Syncing tiers with PostgreSQL Monetization DB...', 'blessings');
              loadData();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Database className="w-4 h-4 text-slate-700" />
            <span>Sync DB</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Upload className="w-4 h-4 text-slate-700" />
            <span>Upload Asset</span>
          </button>

          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 text-xs font-bold flex items-center space-x-1.5 transition"
          >
            <Cpu className="w-4 h-4 text-purple-800" />
            <span>Spawn Sub-Console</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>Create Tier</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Bar */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Total Tiers</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{overview.summary.total_items}</span>
            <span className="text-xs font-semibold text-emerald-800 mt-1 block">Active: {overview.summary.active_count}</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Total Subscribers</span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">
              {Number(overview.summary.total_subscribers || 0).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Active Members</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Avg Monthly FIC</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {Number(overview.summary.avg_monthly_fic || 0).toFixed(0)} FIC
            </span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Pricing Benchmark</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Target Annual Vol</span>
            <span className="text-2xl font-black text-emerald-900 mt-1 block">
              {Number(overview.summary.target_annual_volume_fic || 0).toLocaleString()} FIC
            </span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Projected Volume</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Categories</span>
            <span className="text-2xl font-black text-purple-900 mt-1 block">{overview.summary.total_categories}</span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Pricing Tracks</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Autonomous Spawns</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{spawns.length}</span>
            <span className="text-xs font-semibold text-emerald-800 mt-1 block">Active Sub-Consoles</span>
          </div>
        </div>
      )}

      {/* Pages Directory Grid */}
      <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Platform Pages Offering Subscriptions ({SUBSCRIPTION_PAGES_DIRECTORY.length})
            </h2>
          </div>
          <span className="text-xs text-slate-700 font-semibold">Click any page to test its live frontend</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUBSCRIPTION_PAGES_DIRECTORY.map(page => (
            <div
              key={page.route}
              onClick={() => navigate(page.route)}
              className="group p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-blue-500 cursor-pointer transition shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-extrabold text-blue-900 group-hover:text-blue-700 flex items-center space-x-1">
                  <span>{page.name}</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                  {page.route}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-snug line-clamp-2 mb-2 font-medium">
                {page.description}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200 font-semibold">
                <span className="font-mono">{page.component}</span>
                <span className="text-blue-700 font-bold flex items-center space-x-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Visit</span> <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-300 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'platform', 'creator_channel', 'gems_broadcast', 'content_paywall'].map(cat => (
            <button type="button" aria-label="Action"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition flex items-center space-x-1.5 ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <span className="capitalize">{cat.replace('_', ' ')}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setOnlyFreeTiers(!onlyFreeTiers)}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold border transition flex items-center space-x-1.5 ${
              onlyFreeTiers
                ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Free Tiers Only</span>
          </button>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs font-extrabold text-slate-900 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="frozen">Frozen Only</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tiers or perks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-48 sm:w-60 pl-8 pr-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleSyncToFinancialPnl}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow flex items-center space-x-1.5 transition"
            title="Recalculate subscription revenue and feed into Financial P&L"
          >
            <TrendingUp className="w-3.5 h-3.5 text-white" />
            <span>Sync to P&L</span>
          </button>
        </div>
      </div>

      {/* Subscription Models Table with Transactional Reordering & Freeze Killswitches */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">
            PostgreSQL Monitored Subscription Tiers ({filteredItems.length})
          </h2>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
            Real-Time Postgres Transaction Ordering
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Database className="w-12 h-12 text-blue-500 mx-auto mb-3 animate-pulse" />
            <h3 className="text-base font-bold text-slate-900">Loading subscription models...</h3>
            <p className="text-xs text-slate-700 mt-1">Connecting to PostgreSQL Monetization DB.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <Database className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No subscription models matching criteria</h3>
            <p className="text-xs text-slate-700 mt-1">Adjust filters or create a new tier in PostgreSQL.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-300 text-xs font-black text-slate-900 uppercase tracking-wider">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Tier Name & ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">FIC / Mo</th>
                  <th className="py-3 px-4 text-right">Naira / Mo</th>
                  <th className="py-3 px-4 text-right">Subscribers</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredItems.map((model, idx) => (
                  <tr key={model.id} className="hover:bg-slate-50/80 transition">
                    {/* Resequencing Controls */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-extrabold text-slate-800 w-6 text-center">
                          #{model.sort_order || idx + 1}
                        </span>
                        <div className="flex flex-col space-y-0.5">
                          <button
                            onClick={() => handleReorder(idx, 'UP')}
                            disabled={idx === 0}
                            title="Move Up"
                            aria-label={`Move ${model.name} Up`}
                            className={`p-1 rounded hover:bg-slate-200 text-slate-800 ${
                              idx === 0 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorder(idx, 'DOWN')}
                            disabled={idx === filteredItems.length - 1}
                            title="Move Down"
                            aria-label={`Move ${model.name} Down`}
                            className={`p-1 rounded hover:bg-slate-200 text-slate-800 ${
                              idx === filteredItems.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Name & ID */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900">{model.name}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400">
                          {model.badge}
                        </span>
                        {model.is_free_tier && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                            FREE TIER
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-600 block mt-0.5">{model.id}</span>
                      <p className="text-xs font-medium text-slate-700 line-clamp-1 mt-0.5">
                        {model.description}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-900 border border-slate-300">
                        {model.category}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3 px-4 whitespace-nowrap text-right font-mono font-black text-slate-900">
                      {model.is_free_tier ? 'FREE' : `${Number(model.monthly_fic)} FIC`}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right font-mono font-bold text-amber-900">
                      {model.is_free_tier ? '₦0' : `₦${Number(model.monthly_ngn).toLocaleString()}`}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-right font-mono font-bold text-slate-800">
                      {Number(model.subscriber_count || 0).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                          model.status === 'active'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : 'bg-rose-100 text-rose-950 border border-rose-400'
                        }`}
                      >
                        {model.status === 'active' ? 'Active' : 'Frozen'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {model.is_free_tier && (
                          <button
                            onClick={() => handleTestFreeTier(model)}
                            title="Test session free tier"
                            aria-label={`Test Free Tier ${model.name}`}
                            className={`p-1.5 rounded-lg border text-xs font-bold transition flex items-center space-x-1 ${
                              activeTestTier === model.id
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'border-emerald-300 hover:bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            <PlayCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleToggleFreeze(model)}
                          title={model.status === 'active' ? 'Freeze / Quarantine' : 'Restore'}
                          aria-label={model.status === 'active' ? `Freeze ${model.name}` : `Unfreeze ${model.name}`}
                          className={`p-1.5 rounded-lg border transition ${
                            model.status === 'active'
                              ? 'border-amber-300 hover:bg-amber-100 text-amber-900'
                              : 'border-emerald-300 hover:bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {model.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(model)}
                          title="Edit Tier"
                          aria-label={`Edit ${model.name}`}
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(model)}
                          title="Delete Tier"
                          aria-label={`Delete ${model.name}`}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-100 text-rose-800 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Spawns Panel */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-800" />
              <span>Autonomous Monetization Sub-Consoles & Paywalls ({spawns.length})</span>
            </h3>
            <p className="text-xs font-medium text-slate-700 mt-0.5">
              Isolated sub-consoles for curating episodic video paywalls, VIP backstages, and exclusive creator drops.
            </p>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Sub-Console</span>
          </button>
        </div>

        {spawns.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No monetization sub-consoles spawned yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spawns.map(sp => (
              <div key={sp.id} className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{sp.sub_console_name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-full">
                    {sp.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-700 mt-2">Slug: {sp.slug}</div>
                <div className="text-xs font-mono text-slate-700 mt-0.5 truncate">Endpoint: {sp.endpoint}</div>
                <div className="text-xs font-bold text-blue-900 mt-2">{sp.category}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button type="button" aria-label="Close"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Create Monetization Tier</h3>
            <p className="text-xs font-medium text-slate-700 mb-4">
              Add a new subscription tier with instant PostgreSQL persistence.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Tier Identifier (ID)</label>
                  <input
                    type="text"
                    value={formId}
                    onChange={e => setFormId(e.target.value)}
                    placeholder="sub_custom_plan"
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="platform">Platform Plans</option>
                    <option value="creator_channel">Creator Channel</option>
                    <option value="gems_broadcast">Gems Broadcast</option>
                    <option value="content_paywall">Content Paywall</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Tier Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="VIP Sovereign Member"
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Badge Label</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={e => setFormBadge(e.target.value)}
                    placeholder="VIP Sovereign"
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Monthly FIC</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formMonthlyFic}
                    onChange={e => setFormMonthlyFic(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Monthly ₦</label>
                  <input
                    type="number"
                    min="0"
                    value={formMonthlyNgn}
                    onChange={e => setFormMonthlyNgn(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Annual FIC</label>
                  <input
                    type="number"
                    min="0"
                    value={formAnnualFic}
                    onChange={e => setFormAnnualFic(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Target Annual Vol</label>
                  <input
                    type="number"
                    min="0"
                    value={formTargetVolumeFic}
                    onChange={e => setFormTargetVolumeFic(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block">Free Tier Plan</span>
                  <span className="text-[11px] text-slate-700 font-medium">Designate this model as a 100% Free Explorer Tier.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsFreeTier}
                  onChange={e => setFormIsFreeTier(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Summary of tier value proposition..."
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={formFeaturesText}
                  onChange={e => setFormFeaturesText(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow transition"
                >
                  Create Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button type="button" aria-label="Close"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingItem(null);
              }}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Edit Tier: {editingItem.name}</h3>
            <p className="text-xs font-medium text-slate-700 mb-4">
              Update pricing, quotas, and capabilities directly in PostgreSQL.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Tier Identifier (Locked)</label>
                  <input
                    type="text"
                    disabled
                    value={formId}
                    className="w-full text-xs font-bold text-slate-600 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="platform">Platform Plans</option>
                    <option value="creator_channel">Creator Channel</option>
                    <option value="gems_broadcast">Gems Broadcast</option>
                    <option value="content_paywall">Content Paywall</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Tier Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Badge Label</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={e => setFormBadge(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Monthly FIC</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formMonthlyFic}
                    onChange={e => setFormMonthlyFic(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Monthly ₦</label>
                  <input
                    type="number"
                    min="0"
                    value={formMonthlyNgn}
                    onChange={e => setFormMonthlyNgn(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Annual FIC</label>
                  <input
                    type="number"
                    min="0"
                    value={formAnnualFic}
                    onChange={e => setFormAnnualFic(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Target Annual Vol</label>
                  <input
                    type="number"
                    min="0"
                    value={formTargetVolumeFic}
                    onChange={e => setFormTargetVolumeFic(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block">Free Tier Plan</span>
                  <span className="text-[11px] text-slate-700 font-medium">Designate this model as a 100% Free Explorer Tier.</span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsFreeTier}
                  onChange={e => setFormIsFreeTier(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Features (One per line)</label>
                <textarea
                  rows={3}
                  value={formFeaturesText}
                  onChange={e => setFormFeaturesText(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow transition"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Multipart Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button type="button" aria-label="Close"
              onClick={() => {
                setIsUploadModalOpen(false);
                setUploadFile(null);
              }}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Upload Tier Collateral</h3>
            <p className="text-xs font-medium text-slate-700 mb-4">
              Sends multipart/form-data directly to Express backend with zero client localStorage fallback.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Select Document or Badge Image</label>
                <input
                  type="file"
                  required
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs font-bold text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-100 file:text-blue-950 hover:file:bg-blue-200 border border-slate-300 rounded-xl p-2 bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setUploadFile(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow transition flex items-center space-x-2"
                >
                  <span>{uploading ? 'Uploading to Express...' : 'Upload Direct'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spawn Sub-Console Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button type="button" aria-label="Close"
              onClick={() => setIsSpawnModalOpen(false)}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-800"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Spawn Monetization Sub-Console</h3>
            <p className="text-xs font-medium text-slate-700 mb-4">
              Spawn an autonomous child console node with custom subscription scope.
            </p>

            <form onSubmit={handleSpawn} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Sub-Console Name *</label>
                <input
                  type="text"
                  required
                  value={spawnName}
                  onChange={e => setSpawnName(e.target.value)}
                  placeholder="Creator VIP Backstage Hub"
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Slug Identifier *</label>
                <input
                  type="text"
                  required
                  value={spawnSlug}
                  onChange={e => setSpawnSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="creator-vip-backstage"
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Category / Domain</label>
                <input
                  type="text"
                  value={spawnCategory}
                  onChange={e => setSpawnCategory(e.target.value)}
                  placeholder="Creator Economy"
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Routing Endpoint</label>
                <input
                  type="text"
                  value={spawnEndpoint}
                  onChange={e => setSpawnEndpoint(e.target.value)}
                  className="w-full text-xs font-bold text-slate-600 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-black shadow transition"
                >
                  Spawn Node
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
