import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DollarSign,
  TrendingUp,
  Gift,
  Award,
  Video,
  Music,
  Tv,
  Users,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Upload,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Volume2,
  Trash2,
  Edit,
  X,
  FileText,
  Sliders,
  Sparkles,
  Zap,
  Layers,
  PieChart
} from 'lucide-react';
import {
  CreatorMonetizationDomain,
  CreatorMonetizationItem,
  CreatorMonetizationOverview,
  CreatorMonetizationSpawnedConsole,
  CreateCreatorMonetizationItemPayload
} from '../../types/creatorMonetizationConsole';
import { creatorMonetizationConsoleService } from '../../services/creatorMonetizationConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterCreatorMonetizationConsole: React.FC = () => {
  // State
  const [activeDomain, setActiveDomain] = useState<CreatorMonetizationDomain | 'all'>('all');
  const [items, setItems] = useState<CreatorMonetizationItem[]>([]);
  const [overview, setOverview] = useState<CreatorMonetizationOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<CreatorMonetizationSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CreatorMonetizationItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateCreatorMonetizationItemPayload>({
    domain: 'creator_tiers_matrix',
    name: '',
    code: '',
    category: 'Partner Tiers',
    tier_level: 'Gold Creator',
    rev_share_percent: 75.0,
    payout_currency: 'FIC / NGN',
    total_volume_fic: 0,
    active_creators_count: 0,
    contract_manifest_url: '',
    voice_tag: 'owo_ni_koko',
    notes: ''
  });

  // Spawn Modal Form State
  const [spawnTitle, setSpawnTitle] = useState('');
  const [spawnDomain, setSpawnDomain] = useState<CreatorMonetizationDomain>('creator_tiers_matrix');
  const [spawnBadge, setSpawnBadge] = useState('CREATOR-PAY');
  const [spawnIcon, setSpawnIcon] = useState('DollarSign');

  // Trigger Notifications with multi-sensory African Voice Lines
  const notify = (msg: string, type: 'success' | 'error' = 'success', voiceTag?: AfricanVoiceLine) => {
    setNotification({ message: msg, type });
    if (voiceTag) {
      audioEngine.playVoiceLine(voiceTag);
    }
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Fetch all initial telemetry
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ovData, itemsData, spawnsData] = await Promise.all([
        creatorMonetizationConsoleService.getOverview(),
        creatorMonetizationConsoleService.getItems(activeDomain),
        creatorMonetizationConsoleService.getSpawnedConsoles()
      ]);
      setOverview(ovData);
      setItems(itemsData);
      setSpawnedConsoles(spawnsData);
    } catch (err: any) {
      notify(err.message || 'Failed to load creator monetization telemetry', 'error', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeDomain]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Domain Change
  const handleDomainFilter = (domain: CreatorMonetizationDomain | 'all') => {
    setActiveDomain(domain);
  };

  // Move Item Up (Atomic PostgreSQL reordering)
  const handleMoveUp = async (index: number) => {
    if (index === 0 || reordering) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;

    const orders = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems);
    setReordering(true);
    try {
      await creatorMonetizationConsoleService.reorderItems(orders);
      notify(`Re-sequenced payout stream "${temp.name}" priority upwards`, 'success', 'gbaski');
    } catch (err: any) {
      notify('Failed to reorder creator monetization items in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Move Item Down (Atomic PostgreSQL reordering)
  const handleMoveDown = async (index: number) => {
    if (index === items.length - 1 || reordering) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;

    const orders = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems);
    setReordering(true);
    try {
      await creatorMonetizationConsoleService.reorderItems(orders);
      notify(`Re-sequenced payout stream "${temp.name}" priority downwards`, 'success', 'blessings');
    } catch (err: any) {
      notify('Failed to reorder creator monetization items in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Toggle Freeze / Unfreeze
  const handleToggleFreeze = async (item: CreatorMonetizationItem) => {
    try {
      const updated = await creatorMonetizationConsoleService.toggleFreeze(item.id);
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
      if (updated.status === 'frozen') {
        notify(`SUSPENDED payout node: ${item.name} is now FROZEN from disbursements`, 'error', 'see_gobe');
      } else {
        notify(`UNLOCKED payout node: ${item.name} is now ACTIVE for live settlements`, 'success', 'owo_ni_koko');
      }
      loadData();
    } catch (err: any) {
      notify('Failed to toggle payout stream freeze status', 'error', 'wahala');
    }
  };

  // Delete Item
  const handleDeleteItem = async (item: CreatorMonetizationItem) => {
    if (!window.confirm(`Are you sure you want to permanently decommission monetization node: "${item.name}"?`)) return;
    try {
      await creatorMonetizationConsoleService.deleteItem(item.id);
      notify(`Decommissioned monetization node "${item.name}" successfully`, 'success', 'boom');
      loadData();
    } catch (err: any) {
      notify('Failed to delete monetization item', 'error', 'wahala');
    }
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await creatorMonetizationConsoleService.createItem(formData);
      notify(`Commissioned creator monetization node "${formData.name}" to live ledger`, 'success', 'colossal_combo');
      setIsAddModalOpen(false);
      setFormData({
        domain: 'creator_tiers_matrix',
        name: '',
        code: '',
        category: 'Partner Tiers',
        tier_level: 'Gold Creator',
        rev_share_percent: 75.0,
        payout_currency: 'FIC / NGN',
        total_volume_fic: 0,
        active_creators_count: 0,
        contract_manifest_url: '',
        voice_tag: 'owo_ni_koko',
        notes: ''
      });
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to create creator monetization item', 'error', 'wahala');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await creatorMonetizationConsoleService.updateItem(selectedItem.id, selectedItem);
      notify(`Updated monetization stream "${selectedItem.name}" telemetry`, 'success', 'awesome');
      setIsEditModalOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to update monetization item', 'error', 'wahala');
    }
  };

  // Handle File Upload (Real multipart upload directly to Express backend)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      notify('Transmitting contract / revenue agreement to Express API...', 'success', 'sweet');
      const res = await creatorMonetizationConsoleService.uploadMedia(file, itemId);
      notify(`Uploaded agreement: ${res.filename} attached to node!`, 'success', 'thumbs_up');
      if (!itemId) {
        setFormData((prev) => ({ ...prev, contract_manifest_url: res.fileUrl }));
      } else if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem((prev) => (prev ? { ...prev, contract_manifest_url: res.fileUrl } : null));
      }
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to upload contract document', 'error', 'wahala');
    }
  };

  // Handle Spawn Console
  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await creatorMonetizationConsoleService.spawnConsole({
        console_title: spawnTitle,
        target_domain: spawnDomain,
        icon_name: spawnIcon,
        badge_text: spawnBadge
      });
      notify(`Spawned new sovereign Creator Console "${spawnTitle}"!`, 'success', 'colossal_combo');
      setIsSpawnModalOpen(false);
      setSpawnTitle('');
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to spawn creator console', 'error', 'wahala');
    }
  };

  // Summary Metrics Memo
  const summary = useMemo(() => {
    return overview?.summary || {
      total_items: items.length,
      active_count: items.filter((i) => i.status === 'active').length,
      frozen_count: items.filter((i) => i.status === 'frozen').length,
      total_volume_fic: items.reduce((acc, i) => acc + (Number(i.total_volume_fic) || 0), 0),
      total_creators_count: items.reduce((acc, i) => acc + (Number(i.active_creators_count) || 0), 0),
      average_rev_share: 70.0,
      total_tiers: items.filter((i) => i.domain === 'creator_tiers_matrix').length,
      total_staking_pools: items.filter((i) => i.domain === 'fic_staking_yields').length,
      total_gifting_vaults: items.filter((i) => i.domain === 'live_gifting_tips').length,
      total_ppv_gates: items.filter((i) => i.domain === 'ppv_exclusive_events').length,
      staking_locked_volume_fic: 17900000.00
    };
  }, [overview, items]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
              : 'bg-rose-100 text-rose-950 border-rose-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-emerald-900 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-900 flex-shrink-0" />
          )}
          <span className="font-bold text-sm tracking-wide">{notification.message}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="bg-white border-b border-slate-300 px-6 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-400">
                Phase 6 Sovereign Engine
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                Live Payout Matrix Active
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-emerald-600" />
              Creator Studio, Monetization & Payouts Engine Console
            </h1>
            <p className="text-slate-700 text-sm mt-1 max-w-3xl font-medium leading-relaxed">
              Autonomous oversight of Creator Tiers (Silver/Gold/Diamond), Ad Revenue Splits, Live Stream Gifting Vaults, FIC Staking Yield, PPV Stadium Access, and BeatwaveNG/Dancia-4Tv Micro-Royalty Disbursements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                audioEngine.playVoiceLine('gbaski');
                loadData();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 font-bold text-sm transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-slate-700 ${loading ? 'animate-spin' : ''}`} />
              Sync Ledger
            </button>

            <button
              onClick={() => {
                audioEngine.playVoiceLine('blessings');
                setIsSpawnModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-black text-sm transition-all shadow-md"
            >
              <Sliders className="w-4 h-4" />
              Spawn Payout Console
            </button>

            <button
              onClick={() => {
                audioEngine.playVoiceLine('owo_ni_koko');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Commission Revenue Stream
            </button>
          </div>
        </div>
      </div>

      {/* Overarching Telemetry Cards */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Total Streams</span>
              <Layers className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{summary.total_items}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Active: {summary.active_count} | Frozen: {summary.frozen_count}</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Gross Volume (FIC)</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              {(Number(summary.total_volume_fic) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Total settled volume</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Active Creators</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {Number(summary.total_creators_count).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Earning on protocol</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Avg Rev Share</span>
              <PieChart className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700 mt-2">
              {Number(summary.average_rev_share).toFixed(1)}%
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Net creator payout</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Staking Locked</span>
              <Lock className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {(Number(summary.staking_locked_volume_fic) / 1000000).toFixed(1)}M
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">FIC Yield locked</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>PPV & Gifting</span>
              <Gift className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {Number(summary.total_gifting_vaults) + Number(summary.total_ppv_gates)}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Live micro-settlements</div>
          </div>
        </div>
      </div>

      {/* Domain Navigation Filter Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-300 rounded-xl shadow-sm">
          <button
            onClick={() => handleDomainFilter('all')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all ${
              activeDomain === 'all'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All Monetization ({items.length})
          </button>
          <button
            onClick={() => handleDomainFilter('creator_tiers_matrix')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'creator_tiers_matrix'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Tiers Matrix
          </button>
          <button
            onClick={() => handleDomainFilter('ad_revenue_splits')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'ad_revenue_splits'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Ad Revenue Splits
          </button>
          <button
            onClick={() => handleDomainFilter('live_gifting_tips')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'live_gifting_tips'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            Live Gifting & Tips
          </button>
          <button
            onClick={() => handleDomainFilter('fic_staking_yields')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'fic_staking_yields'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            FIC Staking Yield
          </button>
          <button
            onClick={() => handleDomainFilter('ppv_exclusive_events')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'ppv_exclusive_events'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            PPV Stadium Gates
          </button>
          <button
            onClick={() => handleDomainFilter('music_video_royalties')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'music_video_royalties'
                ? 'bg-emerald-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Music & TV Royalties
          </button>
        </div>
      </div>

      {/* Main Table: Creator Monetization Items with Up/Down Reorder, Freeze & Edit */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-300 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-700" />
                Live Creator Revenue & Payouts Engine (PostgreSQL Persisted)
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Transactional display ordering with atomic Up / Down shifts, real-time freeze payment killswitch, and direct contract upload.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1 rounded-full">
              Showing {items.length} streams
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100/60 text-slate-700 text-xs font-black uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Stream / Program Name</th>
                  <th className="py-3 px-4">Domain / Category</th>
                  <th className="py-3 px-4">Tier / Split %</th>
                  <th className="py-3 px-4">Volume (FIC) / Currency</th>
                  <th className="py-3 px-4">Active Creators</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-600 font-bold">
                      No monetization streams found in this domain. Commission one above!
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        item.status === 'frozen' ? 'bg-rose-50/50' : ''
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center font-black text-xs text-slate-600">
                        {idx + 1}
                      </td>

                      {/* Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                          {item.name}
                          {item.contract_manifest_url && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
                              AGREEMENT DOC
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 font-mono mt-0.5">
                          {item.code} {item.notes ? `• ${item.notes}` : ''}
                        </div>
                      </td>

                      {/* Domain / Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 text-slate-800 border border-slate-300">
                          {item.domain.replace(/_/g, ' ')}
                        </span>
                        <div className="text-xs text-slate-600 font-medium mt-1">{item.category}</div>
                      </td>

                      {/* Tier / Rev Share */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-800">
                          {item.tier_level || 'General'}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
                          {Number(item.rev_share_percent).toFixed(1)}% CREATOR CUT
                        </span>
                      </td>

                      {/* Volume / Currency */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-black text-emerald-800">
                          {Number(item.total_volume_fic).toLocaleString()} FIC
                        </div>
                        <div className="text-xs text-slate-600 font-semibold mt-0.5">
                          Payout: {item.payout_currency}
                        </div>
                      </td>

                      {/* Active Creators Count */}
                      <td className="py-3.5 px-4 font-black text-xs text-indigo-900">
                        {Number(item.active_creators_count).toLocaleString()} creators
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleFreeze(item)}
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
                            item.status === 'active'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                          }`}
                        >
                          {item.status === 'active' ? (
                            <>
                              <Unlock className="w-3 h-3 text-emerald-900" />
                              Active
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-rose-900" />
                              FROZEN
                            </>
                          )}
                        </button>
                      </td>

                      {/* Priority Up/Down */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0 || reordering}
                            title="Promote priority upwards"
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-300 transition-all"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === items.length - 1 || reordering}
                            title="Demote priority downwards"
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-300 transition-all"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Agreement Document Upload Button */}
                          <label
                            title="Upload Creator Agreement/Manifest"
                            className="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 cursor-pointer transition-all"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, item.id)}
                            />
                          </label>

                          {/* Sound Cue Test Button */}
                          <button
                            onClick={() => {
                              const vt = (item.voice_tag as AfricanVoiceLine) || 'owo_ni_koko';
                              audioEngine.playVoiceLine(vt);
                            }}
                            title="Play Multi-Sensory African Voice Cue"
                            className="p-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit Stream Parameters"
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteItem(item)}
                            title="Decommission Stream"
                            className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Spawned Consoles Section */}
      {spawnedConsoles.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-indigo-700" />
              Dynamic Spawned Creator Consoles ({spawnedConsoles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spawnedConsoles.map((sc) => (
                <div
                  key={sc.id}
                  className="p-4 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-black text-sm text-slate-900">{sc.console_title}</div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">{sc.route}</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-950 border border-indigo-400">
                      {sc.badge_text}
                    </span>
                  </div>
                  <DollarSign className="w-6 h-6 text-emerald-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Commission Revenue Stream */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                Commission New Creator Revenue / Payout Stream
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Monetization Domain
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value as CreatorMonetizationDomain })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="creator_tiers_matrix">Creator Tiers Matrix (Silver/Gold/Diamond)</option>
                    <option value="ad_revenue_splits">Ad Revenue Splits & AfriAds Auctions</option>
                    <option value="live_gifting_tips">Live Gifting & Streamer Tips</option>
                    <option value="fic_staking_yields">FIC Staking & Creator Yield Farming</option>
                    <option value="ppv_exclusive_events">PPV Exclusive Events & Masterclasses</option>
                    <option value="music_video_royalties">BeatwaveNG & Dancia-4Tv Micro-Royalties</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Stream / Program Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Platinum Afrobeats Producer Pool"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Unique System Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PROD-AFROBEATS-PLATINUM"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Audio Micro-Royalties"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Tier Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Diamond Partner"
                    value={formData.tier_level || ''}
                    onChange={(e) => setFormData({ ...formData, tier_level: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Creator Revenue Share %
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={formData.rev_share_percent}
                    onChange={(e) => setFormData({ ...formData, rev_share_percent: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Payout Currency
                  </label>
                  <input
                    type="text"
                    value={formData.payout_currency}
                    onChange={(e) => setFormData({ ...formData, payout_currency: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    African Voice Line Cue
                  </label>
                  <select
                    value={formData.voice_tag}
                    onChange={(e) => setFormData({ ...formData, voice_tag: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="owo_ni_koko">owo_ni_koko (Money is vital)</option>
                    <option value="blessings">blessings (Payout blessed)</option>
                    <option value="gbaski">gbaski (Sovereign confirmation)</option>
                    <option value="sweet">sweet (Smooth settlement)</option>
                    <option value="madt_o">madt_o (Super volume)</option>
                    <option value="colossal_combo">colossal_combo (Jackpot bounty)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Agreement Details & Terms Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Revenue disbursement schedule, minimum payout thresholds, smart contract address..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Upload Contract / Agreement Manifest (Direct Express Upload)
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md"
                >
                  Commission Revenue Stream
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Revenue Stream */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-700" />
                Modify Revenue Stream: {selectedItem.name}
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Stream Name
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedItem.name}
                    onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    System Code
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedItem.code}
                    onChange={(e) => setSelectedItem({ ...selectedItem, code: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Tier Level
                  </label>
                  <input
                    type="text"
                    value={selectedItem.tier_level || ''}
                    onChange={(e) => setSelectedItem({ ...selectedItem, tier_level: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Revenue Share %
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={selectedItem.rev_share_percent}
                    onChange={(e) => setSelectedItem({ ...selectedItem, rev_share_percent: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Total Volume (FIC)
                  </label>
                  <input
                    type="number"
                    value={selectedItem.total_volume_fic}
                    onChange={(e) => setSelectedItem({ ...selectedItem, total_volume_fic: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Active Creators Count
                  </label>
                  <input
                    type="number"
                    value={selectedItem.active_creators_count}
                    onChange={(e) => setSelectedItem({ ...selectedItem, active_creators_count: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Agreement Notes / Payout Terms
                </label>
                <textarea
                  rows={3}
                  value={selectedItem.notes || ''}
                  onChange={(e) => setSelectedItem({ ...selectedItem, notes: e.target.value })}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-black text-sm shadow-md"
                >
                  Save Stream Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Spawn Creator Console */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-700" />
                Spawn Sovereign Creator Sub-Console
              </h3>
              <button
                onClick={() => setIsSpawnModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSpawnSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Console Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AfriAds Dynamic Auction Console"
                  value={spawnTitle}
                  onChange={(e) => setSpawnTitle(e.target.value)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Target Domain
                </label>
                <select
                  value={spawnDomain}
                  onChange={(e) => setSpawnDomain(e.target.value as CreatorMonetizationDomain)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                >
                  <option value="creator_tiers_matrix">Creator Tiers Matrix (Silver/Gold/Diamond)</option>
                  <option value="ad_revenue_splits">Ad Revenue Splits & AfriAds Auctions</option>
                  <option value="live_gifting_tips">Live Gifting & Streamer Tips</option>
                  <option value="fic_staking_yields">FIC Staking & Creator Yield Farming</option>
                  <option value="ppv_exclusive_events">PPV Exclusive Events & Masterclasses</option>
                  <option value="music_video_royalties">BeatwaveNG & Dancia-4Tv Micro-Royalties</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={spawnBadge}
                  onChange={(e) => setSpawnBadge(e.target.value)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md"
                >
                  Spawn Console (PostgreSQL Live)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterCreatorMonetizationConsole;
