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
  X,
  Search,
  Check,
  Tag,
  Activity
} from 'lucide-react';
import {
  FinancialTreasuryDomain,
  FinancialTreasuryItem,
  FinancialTreasuryOverview,
  FinancialSpawnedConsole,
  CreateFinancialItemPayload,
  PlatformPricingRule,
  PlatformPricingAuditLog,
  PlatformPricingCategory
} from '../../types/financialTreasuryConsole';
import { financialTreasuryConsoleService } from '../../services/financialTreasuryConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const UnifiedFinancialTreasuryConsole: React.FC = () => {
  // Navigation & Domain State
  const [activeDomain, setActiveDomain] = useState<FinancialTreasuryDomain | 'all' | 'dynamic_pricing'>('all');
  const [items, setItems] = useState<FinancialTreasuryItem[]>([]);
  const [overview, setOverview] = useState<FinancialTreasuryOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<FinancialSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Dynamic Pricing State
  const [pricingRules, setPricingRules] = useState<PlatformPricingRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<PlatformPricingAuditLog[]>([]);
  const [pricingCategory, setPricingCategory] = useState<string>('all');
  const [pricingSearch, setPricingSearch] = useState<string>('');
  const [isEditPricingModalOpen, setIsEditPricingModalOpen] = useState<boolean>(false);
  const [isAddPricingModalOpen, setIsAddPricingModalOpen] = useState<boolean>(false);
  const [editingPricingRule, setEditingPricingRule] = useState<PlatformPricingRule | null>(null);
  const [pricingForm, setPricingForm] = useState<{
    category: PlatformPricingCategory;
    item_key: string;
    name: string;
    description: string;
    base_price_usd: number;
    base_price_fic: number;
    multiplier: number;
    billing_interval: 'daily' | 'monthly' | 'per_transaction' | 'one_time';
    min_threshold: number;
    max_threshold: number;
    is_active: boolean;
    reason: string;
  }>({
    category: 'canary_objective',
    item_key: '',
    name: '',
    description: '',
    base_price_usd: 10,
    base_price_fic: 100,
    multiplier: 1,
    billing_interval: 'daily',
    min_threshold: 1,
    max_threshold: 50000,
    is_active: true,
    reason: ''
  });

  // Ledger Modals
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
      const [overviewData, itemsData, spawnsData, pricingData] = await Promise.all([
        financialTreasuryConsoleService.getOverview(),
        activeDomain !== 'dynamic_pricing'
          ? financialTreasuryConsoleService.getItems(activeDomain === 'all' ? undefined : activeDomain)
          : Promise.resolve([]),
        financialTreasuryConsoleService.getSpawns(),
        financialTreasuryConsoleService.getPricingRules()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawnedConsoles(spawnsData);
      if (pricingData && pricingData.rules) {
        setPricingRules(pricingData.rules);
        setAuditLogs(pricingData.auditLogs || []);
      }
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
  const handleDomainFilter = (domain: FinancialTreasuryDomain | 'all' | 'dynamic_pricing') => {
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

      const orders = updated.map((item, idx) => ({
        id: item.id,
        display_order: idx + 1
      }));

      setItems(updated);
      await financialTreasuryConsoleService.reorderItems(orders);
      notify(`Re-sequenced display order for "${temp.name}"`, 'success', 'sweet');
    } catch (err: any) {
      notify(err.message || 'Failed to persist reorder', 'error', 'wahala');
      await fetchData();
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

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const updated = await financialTreasuryConsoleService.updateItem(selectedItem.id, formData);
      setItems((prev) => prev.map((it) => (it.id === selectedItem.id ? updated : it)));
      setIsEditModalOpen(false);
      setSelectedItem(null);
      notify(`Updated "${updated.name}" on the sovereign ledger`, 'success', 'sweet');
      const ov = await financialTreasuryConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to update financial entry', 'error', 'wahala');
    }
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

  // ================= PRICING GOVERNANCE HANDLERS =================
  const openEditPricingModal = (rule: PlatformPricingRule) => {
    setEditingPricingRule(rule);
    setPricingForm({
      category: rule.category,
      item_key: rule.item_key,
      name: rule.name,
      description: rule.description || '',
      base_price_usd: Number(rule.base_price_usd),
      base_price_fic: Number(rule.base_price_fic),
      multiplier: Number(rule.multiplier),
      billing_interval: rule.billing_interval,
      min_threshold: Number(rule.min_threshold || 1),
      max_threshold: Number(rule.max_threshold || 50000),
      is_active: rule.is_active,
      reason: 'CFO / SuperAdmin dynamic adjustment'
    });
    setIsEditPricingModalOpen(true);
  };

  const handleSavePricingRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPricingRule) return;

    try {
      const updated = await financialTreasuryConsoleService.updatePricingRule(editingPricingRule.id, {
        name: pricingForm.name,
        description: pricingForm.description,
        base_price_usd: pricingForm.base_price_usd,
        base_price_fic: pricingForm.base_price_fic,
        multiplier: pricingForm.multiplier,
        billing_interval: pricingForm.billing_interval,
        min_threshold: pricingForm.min_threshold,
        max_threshold: pricingForm.max_threshold,
        is_active: pricingForm.is_active,
        reason: pricingForm.reason || 'CFO dynamic rate adjustment',
        updated_by: 'CFO / SuperAdmin'
      });

      setPricingRules((prev) => prev.map((r) => (r.id === editingPricingRule.id ? updated : r)));
      setIsEditPricingModalOpen(false);
      setEditingPricingRule(null);
      notify(`Pricing rule "${updated.name}" updated in PostgreSQL!`, 'success', 'sweet');

      // Refresh pricing & audit logs
      const fresh = await financialTreasuryConsoleService.getPricingRules();
      if (fresh && fresh.rules) {
        setPricingRules(fresh.rules);
        setAuditLogs(fresh.auditLogs || []);
      }
    } catch (err: any) {
      notify(err.message || 'Failed to update pricing rule', 'error', 'wahala');
    }
  };

  const handleTogglePricingActive = async (rule: PlatformPricingRule) => {
    try {
      const updated = await financialTreasuryConsoleService.updatePricingRule(rule.id, {
        is_active: !rule.is_active,
        reason: `Toggled active state to ${!rule.is_active}`,
        updated_by: 'CFO / SuperAdmin'
      });
      setPricingRules((prev) => prev.map((r) => (r.id === rule.id ? updated : r)));
      notify(`Rule "${rule.name}" is now ${updated.is_active ? 'ACTIVE' : 'PAUSED'}`, 'success', 'sweet');
    } catch (err: any) {
      notify(err.message || 'Failed to toggle rule status', 'error', 'wahala');
    }
  };

  const handleCreatePricingRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await financialTreasuryConsoleService.createPricingRule({
        category: pricingForm.category,
        item_key: pricingForm.item_key,
        name: pricingForm.name,
        description: pricingForm.description,
        base_price_usd: pricingForm.base_price_usd,
        base_price_fic: pricingForm.base_price_fic,
        multiplier: pricingForm.multiplier,
        billing_interval: pricingForm.billing_interval,
        min_threshold: pricingForm.min_threshold,
        max_threshold: pricingForm.max_threshold,
        is_active: true,
        updated_by: 'CFO / SuperAdmin'
      });

      setPricingRules((prev) => [created, ...prev]);
      setIsAddPricingModalOpen(false);
      notify(`New pricing rule "${created.name}" deployed to PostgreSQL!`, 'success', 'blessings');

      const fresh = await financialTreasuryConsoleService.getPricingRules();
      if (fresh && fresh.rules) {
        setPricingRules(fresh.rules);
        setAuditLogs(fresh.auditLogs || []);
      }
    } catch (err: any) {
      notify(err.message || 'Failed to create pricing rule', 'error', 'wahala');
    }
  };

  // Filtered pricing rules calculation
  const filteredPricingRules = useMemo(() => {
    return pricingRules.filter((rule) => {
      const matchesCategory = pricingCategory === 'all' || rule.category === pricingCategory;
      const q = pricingSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        rule.name.toLowerCase().includes(q) ||
        rule.item_key.toLowerCase().includes(q) ||
        (rule.description && rule.description.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [pricingRules, pricingCategory, pricingSearch]);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'canary_objective':
        return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'canary_placement':
        return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'fic_parity':
        return 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold';
      case 'treasury_fee':
        return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'subscription_tier':
        return 'bg-indigo-100 text-indigo-950 border border-indigo-400 font-bold';
      default:
        return 'bg-slate-100 text-slate-900 border border-slate-300 font-bold';
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
          <button
            type="button"
            aria-label="Close"
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
                Master wallet escrows, protocol fee minting, dynamic platform rates governance, SuperVi prize pools, and forensic audit logs.
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

          {activeDomain === 'dynamic_pricing' ? (
            <button
              onClick={() => {
                setPricingForm({
                  category: 'canary_objective',
                  item_key: '',
                  name: '',
                  description: '',
                  base_price_usd: 10,
                  base_price_fic: 100,
                  multiplier: 1,
                  billing_interval: 'daily',
                  min_threshold: 1,
                  max_threshold: 50000,
                  is_active: true,
                  reason: 'New dynamic pricing rule'
                });
                setIsAddPricingModalOpen(true);
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold flex items-center space-x-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dynamic Rate</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold flex items-center space-x-2 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Ledger Item</span>
            </button>
          )}

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
                Automated Esports Clan & Tournament Escrows
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dynamic Pricing Rules Active
              </span>
              <div className="p-2 bg-purple-100 text-purple-950 rounded-md border border-purple-300">
                <Sliders className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900">
                {pricingRules.length} Sovereign Rates
              </div>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Zero Hardcoded Prices • Governed by CFO/SuperAdmin
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Statutory Tax & Reserves Held
              </span>
              <div className="p-2 bg-blue-100 text-blue-950 rounded-md border border-blue-300">
                <DollarSign className="w-4 h-4" />
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

          {/* DYNAMIC PRICING MASTER TAB */}
          <button
            onClick={() => handleDomainFilter('dynamic_pricing')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap flex items-center space-x-1.5 ${
              activeDomain === 'dynamic_pricing'
                ? 'bg-amber-600 text-white font-black shadow-sm'
                : 'bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Dynamic Pricing & FIC Governance ({pricingRules.length})</span>
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

      {/* ================= CONDITIONAL VIEW: DYNAMIC PRICING HUB VS LEDGER ================= */}
      {activeDomain === 'dynamic_pricing' ? (
        <div className="space-y-6">
          {/* Dynamic Pricing Header Card */}
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-400">
                    CFO & SuperAdmin Control Plane
                  </span>
                  <span className="text-xs text-slate-700 font-bold">PostgreSQL Direct Persistence</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                  Dynamic Platform Pricing, Values & FIC Rates Governance Hub
                </h2>
                <p className="text-xs font-semibold text-slate-700 mt-0.5">
                  Platform Policy: No hardcoded costs or static FIC rates. Adjust rates dynamically at random based on market forces, inflation, and fiscal policies.
                </p>
              </div>

              {/* Search & Counter */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={pricingSearch}
                    onChange={(e) => setPricingSearch(e.target.value)}
                    placeholder="Search rate name, key, or category..."
                    className="pl-9 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-3 py-2 rounded-lg">
                  {filteredPricingRules.length} / {pricingRules.length} Rules
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-700 mr-1">Categories:</span>
              {[
                { id: 'all', label: 'All Rates' },
                { id: 'canary_objective', label: 'Canary Objectives (10)' },
                { id: 'canary_placement', label: 'Canary Placements (8)' },
                { id: 'fic_parity', label: 'FIC Currency Parity' },
                { id: 'treasury_fee', label: 'Treasury & Creator Fees' },
                { id: 'subscription_tier', label: 'Subscription Tiers' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setPricingCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    pricingCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Rules Master Table */}
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <th className="px-4 py-3">Rule Key / Specification</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 text-right">Base Price (USD)</th>
                    <th className="px-4 py-3 text-right">Base Price (FIC)</th>
                    <th className="px-4 py-3 text-center">Multiplier</th>
                    <th className="px-4 py-3 text-center">Interval</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Last Modified</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {filteredPricingRules.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-8 text-center text-slate-700 font-bold">
                        No dynamic pricing rules match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPricingRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-extrabold text-slate-900">{rule.name}</div>
                          <div className="text-xs font-mono text-slate-700">{rule.item_key}</div>
                          {rule.description && (
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">{rule.description}</p>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded text-xs ${getCategoryBadge(rule.category)}`}>
                            {rule.category.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <strong className="text-slate-900 font-mono text-sm">
                            ${parseFloat(String(rule.base_price_usd)).toFixed(2)}
                          </strong>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <strong className="text-amber-950 font-mono text-sm bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            {parseFloat(String(rule.base_price_fic)).toFixed(2)} FIC
                          </strong>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs font-mono font-bold text-slate-800">
                            {parseFloat(String(rule.multiplier)).toFixed(2)}x
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs font-bold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                            {rule.billing_interval}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePricingActive(rule)}
                            className={`px-2.5 py-1 rounded text-xs font-black border transition-colors inline-flex items-center space-x-1 ${
                              rule.is_active
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {rule.is_active ? <span>ACTIVE</span> : <span>PAUSED</span>}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-700">
                          <div className="font-bold text-slate-800">{rule.updated_by || 'CFO / SuperAdmin'}</div>
                          <div className="text-[11px] font-mono text-slate-600">
                            {rule.updated_at ? new Date(rule.updated_at).toLocaleString() : 'System Boot'}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => openEditPricingModal(rule)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 ml-auto shadow-sm transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Rate</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-Time Pricing Audit Log Inspector */}
          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  PostgreSQL Rates Governance Audit Trail ({auditLogs.length} Events)
                </h3>
              </div>
              <span className="text-xs text-slate-700 font-semibold">Immutable Historical Logging</span>
            </div>

            <div className="overflow-x-auto max-h-60 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                    <th className="px-3 py-2">Timestamp</th>
                    <th className="px-3 py-2">Rule Key</th>
                    <th className="px-3 py-2">Changed By</th>
                    <th className="px-3 py-2 text-right">USD Shift</th>
                    <th className="px-3 py-2 text-right">FIC Shift</th>
                    <th className="px-3 py-2">Audit Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-center text-slate-600">
                        No price adjustments recorded yet. Live modifications by CFO will appear here instantly.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-mono text-slate-700 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-3 py-2 font-mono font-bold text-slate-900">
                          {log.item_key}
                        </td>
                        <td className="px-3 py-2 font-bold text-slate-800">
                          {log.changed_by}
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          ${parseFloat(String(log.old_price_usd || 0)).toFixed(2)} →{' '}
                          <strong className="text-slate-900">${parseFloat(String(log.new_price_usd || 0)).toFixed(2)}</strong>
                        </td>
                        <td className="px-3 py-2 text-right font-mono">
                          {parseFloat(String(log.old_price_fic || 0)).toFixed(1)} →{' '}
                          <strong className="text-amber-950">{parseFloat(String(log.new_price_fic || 0)).toFixed(1)} FIC</strong>
                        </td>
                        <td className="px-3 py-2 text-slate-700 italic">
                          {log.reason || 'Rate calibration'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= STANDARD LEDGER TABLE ================= */
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
                  <th className="px-4 py-3">Domain</th>
                  <th className="px-4 py-3 text-right">Balance (FIC)</th>
                  <th className="px-4 py-3 text-right">Balance (Fiat)</th>
                  <th className="px-4 py-3">Fee / Custodian</th>
                  <th className="px-4 py-3">Tournament / Vault ID</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {loading && items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-700 font-bold">
                      Loading financial ledger telemetry...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-700 font-bold">
                      No records found in this domain. Click "Add Ledger Item" above.
                    </td>
                  </tr>
                ) : (
                  items.map((item, index) => {
                    const isFrozen = item.status === 'frozen';
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <button
                              disabled={index === 0 || reordering}
                              onClick={() => handleMove(index, 'up')}
                              className="p-1 hover:bg-slate-200 text-slate-700 rounded disabled:opacity-30"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-mono font-bold text-slate-800">{index + 1}</span>
                            <button
                              disabled={index === items.length - 1 || reordering}
                              onClick={() => handleMove(index, 'down')}
                              className="p-1 hover:bg-slate-200 text-slate-700 rounded disabled:opacity-30"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-extrabold text-slate-900">{item.name}</div>
                          <div className="text-xs font-mono text-slate-700">{item.code}</div>
                        </td>

                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded text-xs ${domainConfig[item.domain]?.badgeColor || 'bg-slate-100 text-slate-900 border border-slate-300'}`}>
                            {domainConfig[item.domain]?.label || item.domain}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="font-mono font-black text-slate-900">
                            {parseFloat(String(item.balance_fic)).toLocaleString(undefined, { maximumFractionDigits: 4 })} FIC
                          </div>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="font-mono font-bold text-slate-800">
                            ₦{parseFloat(String(item.balance_fiat)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </td>

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
      )}

      {/* ================= EDIT DYNAMIC PRICING RULE MODAL ================= */}
      {isEditPricingModalOpen && editingPricingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-slate-300 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[11px] font-black uppercase text-amber-900 tracking-wider">
                  CFO Master Rate Control
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Edit Dynamic Rate: {editingPricingRule.name}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => {
                  setIsEditPricingModalOpen(false);
                  setEditingPricingRule(null);
                }}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePricingRule} className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-xs text-amber-950 font-medium">
                Changes saved here persist directly to PostgreSQL <strong>platform_pricing_rules</strong> and take effect immediately across Canary Ad Maker, Storefronts, and Member billing.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Rate Specification Name
                </label>
                <input
                  type="text"
                  required
                  value={pricingForm.name}
                  onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Base Price (USD $) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pricingForm.base_price_usd}
                    onChange={(e) => setPricingForm({ ...pricingForm, base_price_usd: parseFloat(e.target.value) || 0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Base Price (FIC Tokens) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pricingForm.base_price_fic}
                    onChange={(e) => setPricingForm({ ...pricingForm, base_price_fic: parseFloat(e.target.value) || 0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Multiplier Scale
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingForm.multiplier}
                    onChange={(e) => setPricingForm({ ...pricingForm, multiplier: parseFloat(e.target.value) || 1 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Billing Interval
                  </label>
                  <select
                    value={pricingForm.billing_interval}
                    onChange={(e) => setPricingForm({ ...pricingForm, billing_interval: e.target.value as any })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                  >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="per_transaction">Per Transaction</option>
                    <option value="one_time">One-Time Fee</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Min Threshold ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingForm.min_threshold}
                    onChange={(e) => setPricingForm({ ...pricingForm, min_threshold: parseFloat(e.target.value) || 1 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Max Threshold ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={pricingForm.max_threshold}
                    onChange={(e) => setPricingForm({ ...pricingForm, max_threshold: parseFloat(e.target.value) || 50000 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Mandatory Audit Reason (Why this rate is being adjusted) *
                </label>
                <input
                  type="text"
                  required
                  value={pricingForm.reason}
                  onChange={(e) => setPricingForm({ ...pricingForm, reason: e.target.value })}
                  placeholder="e.g. Q4 ad holiday demand calibration or inflation hedge"
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditPricingModalOpen(false);
                    setEditingPricingRule(null);
                  }}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  Save & Commit to PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD DYNAMIC PRICING RULE MODAL ================= */}
      {isAddPricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-slate-300 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-black text-slate-900">
                Add New Dynamic Rate Rule
              </h3>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setIsAddPricingModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePricingRule} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Rate Category *
                  </label>
                  <select
                    value={pricingForm.category}
                    onChange={(e) => setPricingForm({ ...pricingForm, category: e.target.value as any })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                  >
                    <option value="canary_objective">Canary Objective</option>
                    <option value="canary_placement">Canary Placement</option>
                    <option value="fic_parity">FIC Currency Parity</option>
                    <option value="treasury_fee">Treasury & Creator Fee</option>
                    <option value="subscription_tier">Subscription Tier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Unique Key (e.g. rate_vip_pass) *
                  </label>
                  <input
                    type="text"
                    required
                    value={pricingForm.item_key}
                    onChange={(e) => setPricingForm({ ...pricingForm, item_key: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm font-mono"
                    placeholder="rate_creator_boost"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Display Title *
                </label>
                <input
                  type="text"
                  required
                  value={pricingForm.name}
                  onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm"
                  placeholder="e.g. Creator High-Traffic Boost"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Base Price (USD $) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pricingForm.base_price_usd}
                    onChange={(e) => setPricingForm({ ...pricingForm, base_price_usd: parseFloat(e.target.value) || 0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Base Price (FIC Tokens) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={pricingForm.base_price_fic}
                    onChange={(e) => setPricingForm({ ...pricingForm, base_price_fic: parseFloat(e.target.value) || 0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddPricingModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg text-sm font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors"
                >
                  Commit New Rate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Ledger Item Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-slate-300 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xl font-black text-slate-900">
                {isEditModalOpen ? `Edit Financial Entry: ${selectedItem?.code}` : 'Add New Sovereign Financial Entry'}
              </h3>
              <button
                type="button"
                aria-label="Close"
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
              <button
                type="button"
                aria-label="Close"
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
