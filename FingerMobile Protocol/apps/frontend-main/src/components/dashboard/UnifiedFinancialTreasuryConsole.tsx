import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Coins,
  DollarSign,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Upload,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertTriangle,
  FileText,
  Volume2,
  Landmark,
  Layers,
  Sparkles,
  ExternalLink,
  Trash2,
  Edit,
  X
} from 'lucide-react';
import {
  FinancialTreasuryDomain,
  FinancialTreasuryItem,
  FinancialTreasuryOverview,
  FinancialSpawnedConsole,
  CreateFinancialItemPayload
} from '../../types/financialTreasuryConsole';
import { financialTreasuryConsoleService } from '../../services/financialTreasuryConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const UnifiedFinancialTreasuryConsole: React.FC = () => {
  // State
  const [activeDomain, setActiveDomain] = useState<FinancialTreasuryDomain | 'all'>('all');
  const [items, setItems] = useState<FinancialTreasuryItem[]>([]);
  const [overview, setOverview] = useState<FinancialTreasuryOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<FinancialSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<FinancialTreasuryItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateFinancialItemPayload>({
    domain: 'escrows',
    name: '',
    code: '',
    category: 'Sovereign Treasury',
    balance_fic: 0,
    balance_fiat: 0,
    currency: 'NGN',
    fee_percent: 0,
    recipient_address: '',
    multisig_threshold: '3-of-5 Custodians',
    supervi_tournament_id: '',
    proof_attachment_url: '',
    voice_tag: 'sharp',
    notes: ''
  });

  // Spawn Modal Form State
  const [spawnTitle, setSpawnTitle] = useState<string>('');
  const [spawnDomain, setSpawnDomain] = useState<FinancialTreasuryDomain>('escrows');
  const [spawnBadge, setSpawnBadge] = useState<string>('Treasury Sub-Console');

  // File Upload State
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Trigger Toast & Audio
  const notify = (message: string, type: 'success' | 'error' = 'success', voiceLine?: AfricanVoiceLine) => {
    setNotification({ message, type });
    if (voiceLine) {
      try {
        audioEngine.playVoiceLine(voiceLine);
      } catch (err) {
        console.warn('Audio feedback failed:', err);
      }
    }
    setTimeout(() => setNotification(null), 5000);
  };

  // Load All Data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [overviewData, itemsData, spawnsData] = await Promise.all([
        financialTreasuryConsoleService.getOverview(),
        financialTreasuryConsoleService.getItems(activeDomain),
        financialTreasuryConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawnedConsoles(spawnsData);
    } catch (err: any) {
      notify(err.message || 'Failed to load financial telemetry', 'error', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeDomain]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Domain Change
  const handleDomainFilter = (domain: FinancialTreasuryDomain | 'all') => {
    setActiveDomain(domain);
  };

  // Move Item Up or Down Transactionally
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    try {
      setReordering(true);
      const updated = [...items];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;

      // Assign new sequential order
      const orders = updated.map((item, idx) => ({
        id: item.id,
        display_order: idx + 1
      }));

      // Update UI optimistically
      setItems(updated);

      // Persist atomically to PostgreSQL
      await financialTreasuryConsoleService.reorderItems(orders);
      notify(`Re-sequenced display order for "${temp.name}"`, 'success', 'sweet');
    } catch (err: any) {
      notify(err.message || 'Failed to persist reorder', 'error', 'wahala');
      await fetchData(); // Rollback
    } finally {
      setReordering(false);
    }
  };

  // Toggle Freeze State
  const handleToggleFreeze = async (item: FinancialTreasuryItem) => {
    try {
      const updated = await financialTreasuryConsoleService.toggleFreeze(item.id);
      setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
      const isNowFrozen = updated.status === 'frozen';
      notify(
        `Financial item "${item.name}" is now ${isNowFrozen ? 'FROZEN (Payouts Halted)' : 'ACTIVE'}`,
        isNowFrozen ? 'error' : 'success',
        isNowFrozen ? 'wahala' : 'sweet'
      );
      // Refresh overview counts
      const ov = await financialTreasuryConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to toggle freeze state', 'error', 'wahala');
    }
  };

  // Delete Item
  const handleDelete = async (item: FinancialTreasuryItem) => {
    if (!window.confirm(`Are you certain you want to purge "${item.name}" from the sovereign ledger?`)) return;

    try {
      await financialTreasuryConsoleService.deleteItem(item.id);
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      notify(`Purged "${item.name}" from ledger`, 'success', 'sweet');
      const ov = await financialTreasuryConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to delete item', 'error', 'wahala');
    }
  };

  // Handle Form Submission (Add)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newItem = await financialTreasuryConsoleService.createItem(formData);
      setItems((prev) => [...prev, newItem]);
      setIsAddModalOpen(false);
      notify(`Created "${newItem.name}" on the sovereign ledger`, 'success', 'blessings');
      // Reset form
      setFormData({
        domain: 'escrows',
        name: '',
        code: '',
        category: 'Sovereign Treasury',
        balance_fic: 0,
        balance_fiat: 0,
        currency: 'NGN',
        fee_percent: 0,
        recipient_address: '',
        multisig_threshold: '3-of-5 Custodians',
        supervi_tournament_id: '',
        proof_attachment_url: '',
        voice_tag: 'sharp',
        notes: ''
      });
      const ov = await financialTreasuryConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to create financial entry', 'error', 'wahala');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const updated = await financialTreasuryConsoleService.updateItem(selectedItem.id, formData);
      setItems((prev) => prev.map((it) => (it.id === selectedItem.id ? updated : it)));
      setIsEditModalOpen(false);
      setSelectedItem(null);
      notify(`Updated financial item "${updated.name}"`, 'success', 'sweet');
      const ov = await financialTreasuryConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to update financial item', 'error', 'wahala');
    }
  };

  // Open Edit Modal
  const openEditModal = (item: FinancialTreasuryItem) => {
    setSelectedItem(item);
    setFormData({
      domain: item.domain,
      name: item.name,
      code: item.code,
      category: item.category,
      balance_fic: parseFloat(String(item.balance_fic)),
      balance_fiat: parseFloat(String(item.balance_fiat)),
      currency: item.currency,
      fee_percent: parseFloat(String(item.fee_percent)),
      recipient_address: item.recipient_address || '',
      multisig_threshold: item.multisig_threshold || '',
      supervi_tournament_id: item.supervi_tournament_id || '',
      proof_attachment_url: item.proof_attachment_url || '',
      voice_tag: item.voice_tag || 'sharp',
      notes: item.notes || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle Real Multipart File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(10);
      const uploaded = await financialTreasuryConsoleService.uploadMedia(file, (percent) => {
        setUploadProgress(percent);
      });
      setFormData((prev) => ({ ...prev, proof_attachment_url: uploaded.url }));
      notify(`File "${uploaded.originalName}" uploaded to Express disk storage`, 'success', 'sweet');
    } catch (err: any) {
      notify(err.message || 'File upload failed', 'error', 'wahala');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Spawn New Console
  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnTitle.trim()) return;

    try {
      const spawned = await financialTreasuryConsoleService.spawnConsole({
        console_title: spawnTitle.trim(),
        target_domain: spawnDomain,
        badge_text: spawnBadge.trim() || 'Dynamic Sub-Console',
        icon_name: 'Landmark'
      });
      setSpawnedConsoles((prev) => [spawned, ...prev]);
      setIsSpawnModalOpen(false);
      setSpawnTitle('');
      notify(`Spawned console "${spawned.console_title}" successfully`, 'success', 'colossal_combo');
      const ov = await financialTreasuryConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to spawn console', 'error', 'wahala');
    }
  };

  // Domain labels & badge formatting
  const domainConfig: Record<
    FinancialTreasuryDomain,
    { label: string; badgeColor: string; description: string }
  > = useMemo(
    () => ({
      escrows: {
        label: 'Master Wallet Escrows',
        badgeColor: 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold',
        description: 'Multi-Sig 3-of-5 cold storage vaults, ecosystem incentive pools, and commerce settlement escrows.'
      },
      fee_minting: {
        label: 'Protocol Fee Minting & Splits',
        badgeColor: 'bg-purple-100 text-purple-950 border border-purple-400 font-bold',
        description: 'Cuts across Marketplace (2.5%), Luxury Brokerage (3.8%), Streaming (1.5%), and 10% burn ledgers.'
      },
      prize_pools: {
        label: 'SuperVi Tournament Prize Pools',
        badgeColor: 'bg-amber-100 text-amber-950 border border-amber-400 font-bold',
        description: 'Automated continent-wide esports tournament escrows, weekly bounties, and clan hegemony rewards.'
      },
      vat_tax: {
        label: 'VAT & Statutory Withholding Reserves',
        badgeColor: 'bg-blue-100 text-blue-950 border border-blue-400 font-bold',
        description: 'FIRS 7.5% digital services VAT ledger, state withholding tax (WHT), and automated remittal balances.'
      },
      payout_rails: {
        label: 'Banking & Fintech Settlement Switches',
        badgeColor: 'bg-sky-100 text-sky-950 border border-sky-400 font-bold',
        description: 'Direct NIBSS Instant Payment (NIP) switch, Paystack corporate rails, and Flutterwave clearing.'
      },
      sovereign_audits: {
        label: 'Forensic Audit & CIC Vault Reconciliation',
        badgeColor: 'bg-rose-100 text-rose-950 border border-rose-400 font-bold',
        description: 'Continuous cryptographic call-over verifying that Circulating + Treasury FIC == 48M minted.'
      }
    }),
    []
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-lg border shadow-md flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : 'bg-rose-50 border-rose-300 text-rose-950'
          }`}
        >
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-700 shrink-0" />
            )}
            <span className="font-bold text-sm">{notification.message}</span>
          </div>
          <button type="button" aria-label="Close"
            onClick={() => setNotification(null)}
            className="text-slate-500 hover:text-slate-900 font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-950 rounded-lg border border-emerald-300">
              <Landmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Unified Financials & Treasury Autonomous Control Plane
              </h1>
              <p className="text-sm font-medium text-slate-700">
                Option C: Master wallet escrows, protocol fee minting, automated SuperVi tournament prize pools, and forensic audit logs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => notify('African Voice Protocol active', 'success', 'owo_ni_koko')}
            className="px-3.5 py-2 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-lg text-sm font-bold flex items-center space-x-2 transition-colors"
          >
            <Volume2 className="w-4 h-4" />
            <span>Voice: Owo Ni Koko</span>
          </button>

          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-950 border border-blue-300 rounded-lg text-sm font-bold flex items-center space-x-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Spawn New Console</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center space-x-2 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ledger Item</span>
          </button>

          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Total FIC In Sovereign Escrows
              </span>
              <div className="p-2 bg-emerald-100 text-emerald-950 rounded-md border border-emerald-300">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {parseFloat(String(overview.summary.escrow_fic)).toLocaleString(undefined, { maximumFractionDigits: 0 })} FIC
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Backing Apex Vaults & Multi-Sig 3-of-5 Pools
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                SuperVi Tournament Prize Pools
              </span>
              <div className="p-2 bg-amber-100 text-amber-950 rounded-md border border-amber-300">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {parseFloat(String(overview.summary.prize_pool_fic)).toLocaleString(undefined, { maximumFractionDigits: 0 })} FIC
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Automated Esports & Sprint Leaderboard Payouts
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Protocol Fee Minting & Cuts
              </span>
              <div className="p-2 bg-purple-100 text-purple-950 rounded-md border border-purple-300">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {parseFloat(String(overview.summary.fee_minted_fic)).toLocaleString(undefined, { maximumFractionDigits: 0 })} FIC
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Marketplace, Luxury, Streaming & Burn Ledger
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Statutory VAT & Tax Reserve
              </span>
              <div className="p-2 bg-blue-100 text-blue-950 rounded-md border border-blue-300">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                ₦{parseFloat(String(overview.summary.tax_holding_fiat)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">
                FIRS 7.5% Digital Tax & Withholding Deductions
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Domain Navigation Filter Tabs */}
      <div className="bg-white border border-slate-300 rounded-xl p-2 shadow-sm">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <button
            onClick={() => handleDomainFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
              activeDomain === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            All Ledger Domains ({items.length})
          </button>

          {(Object.keys(domainConfig) as FinancialTreasuryDomain[]).map((dom) => (
            <button
              key={dom}
              onClick={() => handleDomainFilter(dom)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                activeDomain === dom
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {domainConfig[dom].label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamically Spawned Consoles Bar */}
      {spawnedConsoles.length > 0 && (
        <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Spawned Financial Consoles ({spawnedConsoles.length})
              </span>
            </div>
            <span className="text-xs text-slate-700 font-medium">Click to navigate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {spawnedConsoles.map((sc) => (
              <div
                key={sc.id}
                className="p-3 bg-slate-50 border border-slate-300 rounded-lg flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer"
                onClick={() => notify(`Console "${sc.console_title}" route active: ${sc.route}`, 'success', 'blessings')}
              >
                <div>
                  <div className="font-bold text-slate-900 text-sm">{sc.console_title}</div>
                  <div className="text-xs text-slate-700 mt-0.5">{sc.target_domain}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-950 border border-blue-300">
                  {sc.badge_text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Ledger Table */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {activeDomain === 'all'
                ? 'All Sovereign Financial Items'
                : domainConfig[activeDomain]?.label || activeDomain}
            </h2>
            <p className="text-xs font-medium text-slate-700 mt-0.5">
              {activeDomain === 'all'
                ? 'Unified view across escrows, fee minting, prize pools, taxation, and payout rails.'
                : domainConfig[activeDomain]?.description}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded">
              {items.length} Entries
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <th className="px-4 py-3 text-center w-16">Seq</th>
                <th className="px-4 py-3">Code / Name</th>
                <th className="px-4 py-3">Domain & Category</th>
                <th className="px-4 py-3">Balance (FIC / Fiat)</th>
                <th className="px-4 py-3">Fee / Split / Multi-Sig</th>
                <th className="px-4 py-3">Tournament / Vault ID</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-700 font-bold">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-800" />
                    Connecting to PostgreSQL financial ledger...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-700 font-bold">
                    No financial ledger items found for this domain.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const isFrozen = item.status === 'frozen';
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isFrozen ? 'bg-rose-50/50' : ''
                      }`}
                    >
                      {/* Sequencing Controls */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0 || reordering}
                            className="p-1 rounded text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-bold text-xs text-slate-800 w-4">
                            {item.display_order}
                          </span>
                          <button
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === items.length - 1 || reordering}
                            className="p-1 rounded text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Code / Name */}
                      <td className="px-4 py-3">
                        <div className="font-black text-slate-900">{item.name}</div>
                        <div className="text-xs font-bold text-slate-700 flex items-center space-x-1 mt-0.5">
                          <span>{item.code}</span>
                          {item.proof_attachment_url && (
                            <a
                              href={item.proof_attachment_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-700 hover:underline flex items-center space-x-0.5"
                              title="View Verified Audit Deed"
                            >
                              <FileText className="w-3 h-3 ml-1" />
                              <span>Deed</span>
                            </a>
                          )}
                        </div>
                      </td>

                      {/* Domain & Category */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs ${
                            domainConfig[item.domain]?.badgeColor ||
                            'bg-slate-100 text-slate-950 border border-slate-300 font-bold'
                          }`}
                        >
                          {item.domain}
                        </span>
                        <div className="text-xs font-medium text-slate-700 mt-1">
                          {item.category}
                        </div>
                      </td>

                      {/* Balance (FIC / Fiat) */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">
                          {parseFloat(String(item.balance_fic)).toLocaleString(undefined, { maximumFractionDigits: 4 })} FIC
                        </div>
                        <div className="text-xs font-medium text-slate-700">
                          {item.currency} {parseFloat(String(item.balance_fiat)).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </td>

                      {/* Fee / Multi-Sig */}
                      <td className="px-4 py-3">
                        {parseFloat(String(item.fee_percent)) > 0 && (
                          <div className="text-xs font-black text-purple-950 bg-purple-100 border border-purple-300 rounded px-1.5 py-0.5 inline-block">
                            Fee: {item.fee_percent}%
                          </div>
                        )}
                        <div className="text-xs font-medium text-slate-700 mt-0.5">
                          {item.multisig_threshold || item.recipient_address || 'Standard Automated'}
                        </div>
                      </td>

                      {/* Tournament / Vault ID */}
                      <td className="px-4 py-3">
                        <div className="text-xs font-mono text-slate-800">
                          {item.supervi_tournament_id ? (
                            <span className="bg-amber-100 text-amber-950 border border-amber-400 font-bold px-2 py-0.5 rounded inline-block">
                              {item.supervi_tournament_id}
                            </span>
                          ) : (
                            <span className="text-slate-700">None</span>
                          )}
                        </div>
                      </td>

                      {/* Status & Freeze Killswitch */}
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleFreeze(item)}
                          className={`px-2.5 py-1 rounded text-xs font-black border transition-colors inline-flex items-center space-x-1 ${
                            isFrozen
                              ? 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                          }`}
                          title={isFrozen ? 'Click to Unfreeze' : 'Click to Freeze Killswitch'}
                        >
                          {isFrozen ? (
                            <>
                              <Lock className="w-3 h-3 text-rose-800" />
                              <span>FROZEN</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 text-emerald-800" />
                              <span>ACTIVE</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 text-slate-700 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-100 transition-colors"
                            title="Edit Ledger Entry"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 text-rose-700 hover:text-rose-900 border border-rose-300 rounded hover:bg-rose-50 transition-colors"
                            title="Purge Entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Ledger Item Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-slate-300 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-black text-slate-900">
                {isEditModalOpen ? `Edit Financial Entry: ${selectedItem?.code}` : 'Add New Sovereign Financial Entry'}
              </h3>
              <button type="button" aria-label="Close"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedItem(null);
                }}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={isEditModalOpen ? handleEditSubmit : handleCreateSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Domain
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) =>
                      setFormData({ ...formData, domain: e.target.value as FinancialTreasuryDomain })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                  >
                    {(Object.keys(domainConfig) as FinancialTreasuryDomain[]).map((dom) => (
                      <option key={dom} value={dom}>
                        {domainConfig[dom].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Entry Code (e.g. ESC-01, POOL-02)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                    placeholder="ESC-MASTER-05"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Title / Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  placeholder="Apex Sub-Treasury Liquidity Reserve"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Balance (FIC)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.balance_fic}
                    onChange={(e) =>
                      setFormData({ ...formData, balance_fic: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Balance (Fiat)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance_fiat}
                    onChange={(e) =>
                      setFormData({ ...formData, balance_fiat: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Fee Percent (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.fee_percent}
                    onChange={(e) =>
                      setFormData({ ...formData, fee_percent: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Multi-Sig Threshold / Custodian Signers
                  </label>
                  <input
                    type="text"
                    value={formData.multisig_threshold || ''}
                    onChange={(e) => setFormData({ ...formData, multisig_threshold: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                    placeholder="3-of-5 Custodians + PIN"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    SuperVi Tournament ID (Esports)
                  </label>
                  <input
                    type="text"
                    value={formData.supervi_tournament_id || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, supervi_tournament_id: e.target.value })
                    }
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                    placeholder="SUPERVI-SEASON-2026-CHAMPIONS"
                  />
                </div>
              </div>

              {/* Real Multipart File Upload (No localStorage Fallbacks) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Upload Audited Proof / Deed / Rules PDF (Backend Disk Storage)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.json,.csv"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="text-sm text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-slate-200"
                  />
                  {formData.proof_attachment_url && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-1 rounded">
                      Uploaded
                    </span>
                  )}
                </div>
                {isUploading && (
                  <div className="mt-2 space-y-1">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-700">Uploading to /uploads/financial/... {uploadProgress}%</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Internal Ledger Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  placeholder="Mandatory CFO approval notes, compliance statutory dates, or tournament rules."
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  {isEditModalOpen ? 'Save Changes' : 'Confirm & Commit Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* One-Click Console Spawner Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-slate-300 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-black text-slate-900">
                One-Click Console Spawner
              </h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsSpawnModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSpawnConsole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Console Title
                </label>
                <input
                  type="text"
                  required
                  value={spawnTitle}
                  onChange={(e) => setSpawnTitle(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  placeholder="e.g. Cross-Border Remittance Vault"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Target Financial Domain
                </label>
                <select
                  value={spawnDomain}
                  onChange={(e) =>
                    setSpawnDomain(e.target.value as FinancialTreasuryDomain)
                  }
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                >
                  {(Object.keys(domainConfig) as FinancialTreasuryDomain[]).map((dom) => (
                    <option key={dom} value={dom}>
                      {domainConfig[dom].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={spawnBadge}
                  onChange={(e) => setSpawnBadge(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  placeholder="e.g. Sovereign Vault 2026"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  Spawn Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedFinancialTreasuryConsole;
