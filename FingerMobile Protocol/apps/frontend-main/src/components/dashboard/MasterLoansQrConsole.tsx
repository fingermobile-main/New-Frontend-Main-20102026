import React, { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  Percent,
  ShieldCheck,
  PauseCircle,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  Upload,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Cpu,
  Lock,
  Layers,
  Landmark,
  ShieldAlert
} from 'lucide-react';
import {
  LoansQrItem,
  LoansQrOverview,
  LoansQrSpawnedConsole,
  CreateLoansQrPayload,
  LoansQrCategory
} from '../../types/loansqrConsole';
import { loansqrConsoleService, ReorderEntry } from '../../services/loansqrConsoleService';
import superViAudio from '../../services/SuperViAudioEngine';

const CATEGORY_LABELS: Record<LoansQrCategory, string> = {
  MERCHANT_INVENTORY: 'Merchant Inventory',
  SME_WORKING_CAPITAL: 'SME Working Capital',
  POS_AGENT_FLOAT: 'POS Agent Float',
  INVOICE_FACTORING: 'Invoice Factoring',
  EQUIPMENT_LEASING: 'Equipment Leasing',
  AGRIC_CROP_SEASONAL: 'Agric Seasonal'
};

export const MasterLoansQrConsole: React.FC = () => {
  // 1. Core State
  const [overview, setOverview] = useState<LoansQrOverview | null>(null);
  const [items, setItems] = useState<LoansQrItem[]>([]);
  const [spawns, setSpawns] = useState<LoansQrSpawnedConsole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<LoansQrCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeOnlyFilter, setActiveOnlyFilter] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // 2. Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<LoansQrItem | null>(null);
  const [isMoratoriumModalOpen, setIsMoratoriumModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);

  // 3. Form States
  const [formData, setFormData] = useState<CreateLoansQrPayload>({
    name: '',
    product_code: 'LQR-' + Math.floor(Math.random() * 9000 + 1000),
    category: 'SME_WORKING_CAPITAL',
    min_amount: 100000,
    max_amount: 2500000,
    interest_rate_monthly: 3.2,
    tenure_months_min: 1,
    tenure_months_max: 12,
    processing_fee_percent: 1.5,
    moratorium_days: 14,
    risk_score_min: 640,
    collateral_required: false,
    collateral_ratio_percent: 120
  });

  const [spawnData, setSpawnData] = useState({
    title: '',
    domain: 'loansqr_lending',
    badge: 'LQR-SHARD-0' + Math.floor(Math.random() * 9 + 3),
    description: '',
    instances: 1
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedDocUrl, setUploadedDocUrl] = useState<string>('');

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success', voiceLine?: 'gbaski' | 'wahala' | 'boom' | 'blessings' | 'awesome') => {
    setNotification({ message, type });
    if (voiceLine) {
      superViAudio.playVoiceLine(voiceLine);
    }
    setTimeout(() => setNotification(null), 4500);
  };

  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [overviewData, itemsData, spawnsData] = await Promise.all([
        loansqrConsoleService.getOverview(),
        loansqrConsoleService.getItems(selectedCategory, searchQuery, activeOnlyFilter),
        loansqrConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch (err: any) {
      console.error('Failed to load LoansQR data:', err);
      showNotification(err.message || 'Error syncing with PostgreSQL', 'error', 'wahala');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery, activeOnlyFilter]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Handle direct file upload to Express backend
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadRes = await loansqrConsoleService.uploadCollateralDoc(file);
      setUploadedDocUrl(uploadRes.url);
      showNotification(`Underwriting covenant deed uploaded: ${uploadRes.filename}`, 'success', 'gbaski');
    } catch (err: any) {
      showNotification(err.message || 'Underwriting upload failed', 'error', 'wahala');
    } finally {
      setIsUploading(false);
    }
  };

  // Create Product
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.product_code) {
      showNotification('Product Name and Code are required', 'error', 'wahala');
      return;
    }
    try {
      const created = await loansqrConsoleService.createItem(formData);
      setItems(prev => [...prev, created]);
      setIsAddModalOpen(false);
      showNotification(`Facility "${created.name}" created and published live!`, 'success', 'gbaski');
      loansqrConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to create facility', 'error', 'wahala');
    }
  };

  // Edit Product
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const updated = await loansqrConsoleService.updateItem(editingItem.id, {
        name: editingItem.name,
        category: editingItem.category,
        min_amount: editingItem.min_amount,
        max_amount: editingItem.max_amount,
        interest_rate_monthly: editingItem.interest_rate_monthly,
        tenure_months_min: editingItem.tenure_months_min,
        tenure_months_max: editingItem.tenure_months_max,
        processing_fee_percent: editingItem.processing_fee_percent,
        moratorium_days: editingItem.moratorium_days,
        risk_score_min: editingItem.risk_score_min,
        collateral_required: editingItem.collateral_required,
        collateral_ratio_percent: editingItem.collateral_ratio_percent,
        is_active: editingItem.is_active,
        moratorium_hold_active: editingItem.moratorium_hold_active
      });
      setItems(prev => prev.map(item => item.id === updated.id ? updated : item));
      setIsEditModalOpen(false);
      setEditingItem(null);
      showNotification(`Facility "${updated.name}" updated in PostgreSQL`, 'success', 'blessings');
      loansqrConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to update facility', 'error', 'wahala');
    }
  };

  // Delete Product
  const handleDeleteItem = async (id: number) => {
    if (!window.confirm(`Permanently remove loan product #${id}?`)) return;
    try {
      await loansqrConsoleService.deleteItem(id);
      setItems(prev => prev.filter(i => i.id !== id));
      showNotification(`Facility #${id} removed`, 'info');
      loansqrConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete facility', 'error', 'wahala');
    }
  };

  // Reorder Product (Atomic swap)
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const reorders: ReorderEntry[] = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems);

    try {
      await loansqrConsoleService.reorderItems(reorders);
      showNotification('Lending product sequence updated atomically', 'success');
    } catch (err: any) {
      showNotification(err.message || 'Failed to persist order', 'error', 'wahala');
      loadAllData();
    }
  };

  // Toggle Moratorium Hold
  const handleToggleMoratorium = async (scope: 'all' | LoansQrCategory, active: boolean) => {
    try {
      const res = await loansqrConsoleService.toggleMoratoriumHold(scope, active);
      showNotification(res.message, 'success', active ? 'boom' : 'blessings');
      setIsMoratoriumModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to toggle moratorium', 'error', 'wahala');
    }
  };

  // Spawn Console
  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnData.title || !spawnData.badge) {
      showNotification('Title and Badge are required', 'error', 'wahala');
      return;
    }
    try {
      const created = await loansqrConsoleService.spawnConsole(spawnData);
      setSpawns(prev => [...prev, created]);
      setIsSpawnModalOpen(false);
      showNotification(`Spawned sovereign shard "${created.title}"`, 'success', 'gbaski');
      loansqrConsoleService.getOverview().then(setOverview);
    } catch (err: any) {
      showNotification(err.message || 'Failed to spawn shard', 'error', 'wahala');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-bold shadow-lg transition-all ${
          notification.type === 'success'
            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
            : notification.type === 'error'
            ? 'bg-rose-100 text-rose-950 border-rose-400'
            : 'bg-indigo-100 text-indigo-950 border-indigo-400'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-800 hover:text-slate-900 font-bold ml-4">
            ✕
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-emerald-100 border border-emerald-400 text-emerald-950 rounded-xl">
                <Landmark className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  LoansQR Micro-Lending & SME Underwriting Console
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                    Phase 11 Live
                  </span>
                </h1>
                <p className="text-sm font-medium text-slate-700">
                  Autonomous Underwriting Matrix, APR Tiers, Multi-Sig Escrow Vaults & CBN Debt Moratorium Holds
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsMoratoriumModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <PauseCircle className="w-4 h-4" />
              Debt Moratorium Control
            </button>
            <button
              onClick={() => setIsSpawnModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <Cpu className="w-4 h-4" />
              Spawn Lending Shard
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              Create Loan Facility
            </button>
            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="p-2 border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-800 transition"
              title="Refresh Live DB"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Pillar 1: Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Total Facilities</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.total_facilities ?? '...'}
          </div>
          <div className="text-xs font-semibold text-emerald-800 mt-1">
            {overview?.active_facilities ?? '0'} active in market
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Disbursed Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 mt-2 truncate">
            ₦{overview?.cumulative_disbursed ? (Number(overview.cumulative_disbursed) / 1000000).toFixed(1) + 'M' : '...'}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">
            {overview?.total_active_loans ?? '0'} active loans
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Average Monthly APR</span>
            <Percent className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.avg_monthly_rate ?? '3.08'}%
          </div>
          <div className="text-xs font-semibold text-blue-800 mt-1">
            Risk-adjusted yield
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Repayment Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.avg_repayment_rate ?? '98.4'}%
          </div>
          <div className="text-xs font-semibold text-emerald-800 mt-1">
            NPL default rate: 1.6%
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Collateral Escrows</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.collateralized_facilities ?? '...'}
          </div>
          <div className="text-xs font-semibold text-amber-800 mt-1">
            Multi-sig smart vaults
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase">
            <span>Moratorium Holds</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {overview?.moratorium_active_count ?? '0'}
          </div>
          <div className="text-xs font-semibold text-slate-700 mt-1">
            {overview?.active_shards ?? '0'} underwriting shards
          </div>
        </div>
      </div>

      {/* Pillar 2: Controls & Category Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search facilities by name or product code (e.g. LQR-TIIC-01)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value as LoansQrCategory | 'all')}
            className="px-3 py-2 text-sm font-bold text-slate-800 border border-slate-300 rounded-xl bg-white"
          >
            <option value="all">All Loan Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
              <option key={cat} value={cat}>{label}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={activeOnlyFilter}
              onChange={e => setActiveOnlyFilter(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 border-slate-300"
            />
            Active Only
          </label>
        </div>
      </div>

      {/* Pillar 3: Active Underwriting Facilities Directory */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-600" />
            Underwriting Facilities & APR Matrix ({items.length})
          </h2>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-300">
            Real-Time PostgreSQL Sync
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-800">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 uppercase">
              <tr>
                <th className="py-3 px-4 w-16">Seq</th>
                <th className="py-3 px-4">Facility Name & Code</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Amount Range</th>
                <th className="py-3 px-4">Monthly Rate / Tenor</th>
                <th className="py-3 px-4">Underwriting Gate</th>
                <th className="py-3 px-4">Disbursed / Volume</th>
                <th className="py-3 px-4">Status & Moratorium</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-slate-600 font-medium">
                    No lending facilities found matching criteria. Click &quot;Create Loan Facility&quot; to ingest.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleReorder(index, 'up')}
                          className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-5 text-center font-mono">{item.display_order}</span>
                        <button
                          disabled={index === items.length - 1}
                          onClick={() => handleReorder(index, 'down')}
                          className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="font-mono text-xs font-semibold text-indigo-700">{item.product_code}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        ₦{Number(item.min_amount).toLocaleString()} - ₦{Number(item.max_amount).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-600">Fee: {item.processing_fee_percent}%</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-emerald-800">{item.interest_rate_monthly}% / mo</div>
                      <div className="text-xs text-slate-700">{item.tenure_months_min} - {item.tenure_months_max} months</div>
                      <div className="text-[11px] text-slate-500 font-semibold">{item.moratorium_days}d grace period</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-bold text-slate-900">
                        Min Score: <span className="font-mono text-indigo-700">{item.risk_score_min}</span>
                      </div>
                      {item.collateral_required ? (
                        <span className="inline-flex items-center gap-1 mt-0.5 text-[11px] font-bold text-amber-950 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-400">
                          <Lock className="w-3 h-3 text-amber-700" />
                          {item.collateral_ratio_percent}% Collateral
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-600">Unsecured Underwrite</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">₦{(Number(item.total_disbursed) / 1000000).toFixed(2)}M</div>
                      <div className="text-xs text-slate-700">{item.active_loans_count} borrowers</div>
                      <div className="text-[11px] font-semibold text-emerald-800">{item.repayment_rate_percent}% payback</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold inline-block ${
                          item.is_active
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : 'bg-slate-100 text-slate-800 border border-slate-300'
                        }`}>
                          {item.is_active ? 'Active' : 'Paused'}
                        </span>
                        {item.moratorium_hold_active && (
                          <div className="text-[10px] font-bold text-rose-950 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-400 flex items-center gap-1">
                            <PauseCircle className="w-3 h-3 text-rose-600" />
                            MORATORIUM HOLD
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100"
                          title="Edit Facility"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-rose-700 hover:text-rose-900 border border-rose-300 rounded-lg hover:bg-rose-50"
                          title="Delete Facility"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Pillar 4: Spawned Underwriting Shards Directory */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Active LoansQR Underwriting Shards & Sentinels ({spawns.length})
            </h3>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="px-3 py-1.5 text-xs font-bold text-indigo-950 bg-indigo-100 hover:bg-indigo-200 border border-indigo-400 rounded-xl flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Spawn Lending Shard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spawns.map(spawn => (
            <div key={spawn.id} className="p-4 rounded-xl border border-slate-300 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-indigo-950 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-400">
                  {spawn.badge}
                </span>
                <span className="text-xs font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-400">
                  {spawn.status}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{spawn.title}</h4>
              <p className="text-xs text-slate-700">{spawn.description || 'Autonomous credit assessment cluster'}</p>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
                <span>Instances: <strong className="text-slate-900">{spawn.active_instances}</strong></span>
                <span className="font-mono text-[11px]">{new Date(spawn.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Create Facility */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-600" />
                Create New Loan Underwriting Facility
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Facility Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Lagos Retailers Stock Loan"
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Product Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.product_code}
                    onChange={e => setFormData({ ...formData, product_code: e.target.value })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as LoansQrCategory })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
                      <option key={cat} value={cat}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Monthly Interest Rate (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.interest_rate_monthly}
                    onChange={e => setFormData({ ...formData, interest_rate_monthly: parseFloat(e.target.value) || 3.0 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Min Amount (₦)</label>
                  <input
                    type="number"
                    value={formData.min_amount}
                    onChange={e => setFormData({ ...formData, min_amount: parseFloat(e.target.value) || 50000 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Max Amount (₦)</label>
                  <input
                    type="number"
                    value={formData.max_amount}
                    onChange={e => setFormData({ ...formData, max_amount: parseFloat(e.target.value) || 2000000 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Min Tenure (Mo)</label>
                  <input
                    type="number"
                    value={formData.tenure_months_min}
                    onChange={e => setFormData({ ...formData, tenure_months_min: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Max Tenure (Mo)</label>
                  <input
                    type="number"
                    value={formData.tenure_months_max}
                    onChange={e => setFormData({ ...formData, tenure_months_max: parseInt(e.target.value, 10) || 12 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Min Risk Score</label>
                  <input
                    type="number"
                    value={formData.risk_score_min}
                    onChange={e => setFormData({ ...formData, risk_score_min: parseInt(e.target.value, 10) || 620 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              {/* Direct Multipart Underwriting Covenant Upload */}
              <div className="p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 space-y-2">
                <label className="block text-xs font-bold text-emerald-950 uppercase flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-emerald-600" />
                  Upload Underwriting Covenant / Deed Template (PDF/DOC)
                </label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="w-full text-xs font-bold text-slate-800 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700"
                />
                {uploadedDocUrl && (
                  <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Covenant doc stored: {uploadedDocUrl}
                  </p>
                )}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-600" />
                    Require Collateral Escrow Lockup
                  </span>
                  <input
                    type="checkbox"
                    checked={formData.collateral_required}
                    onChange={e => setFormData({ ...formData, collateral_required: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                  />
                </div>
                {formData.collateral_required && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Collateral Ratio (%)</label>
                    <input
                      type="number"
                      value={formData.collateral_ratio_percent}
                      onChange={e => setFormData({ ...formData, collateral_ratio_percent: parseFloat(e.target.value) || 120 })}
                      className="w-36 px-3 py-1.5 text-sm font-bold text-slate-900 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
                >
                  Publish Loan Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Facility */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Edit Facility: {editingItem.name} ({editingItem.product_code})
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Facility Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={e => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Monthly Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingItem.interest_rate_monthly}
                    onChange={e => setEditingItem({ ...editingItem, interest_rate_monthly: parseFloat(e.target.value) || 3.0 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Grace Period (Days)</label>
                  <input
                    type="number"
                    value={editingItem.moratorium_days}
                    onChange={e => setEditingItem({ ...editingItem, moratorium_days: parseInt(e.target.value, 10) || 14 })}
                    className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.is_active}
                    onChange={e => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300"
                  />
                  Active In Market
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-rose-900 bg-rose-50 p-3 rounded-xl border border-rose-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.moratorium_hold_active}
                    onChange={e => setEditingItem({ ...editingItem, moratorium_hold_active: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 border-rose-300"
                  />
                  Debt Moratorium Hold
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: DefCon Debt Moratorium Control */}
      {isMoratoriumModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-amber-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-amber-950 flex items-center gap-2">
                <PauseCircle className="w-5 h-5 text-amber-600" />
                DefCon Debt Moratorium Control Plane
              </h3>
              <button onClick={() => setIsMoratoriumModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-700">
              When activated, debt moratorium freezes all automatic debit collection attempts, pauses penalty interest, and extends loan maturity dates in accordance with regulatory relief policies.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleToggleMoratorium('all', true)}
                className="w-full p-3 rounded-xl border border-amber-400 bg-amber-50 hover:bg-amber-100 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-amber-950 text-sm">ACTIVATE Platform-Wide Moratorium</div>
                  <div className="text-xs text-amber-800">Freezes all collections across all 6 lending categories</div>
                </div>
                <PauseCircle className="w-5 h-5 text-amber-600" />
              </button>

              <button
                onClick={() => handleToggleMoratorium('all', false)}
                className="w-full p-3 rounded-xl border border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-emerald-950 text-sm">DEACTIVATE & Resume Collections</div>
                  <div className="text-xs text-emerald-800">Resumes standard settlement and debit schedules</div>
                </div>
                <PlayCircle className="w-5 h-5 text-emerald-600" />
              </button>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setIsMoratoriumModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Spawn Underwriting Shard */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-600" />
                Spawn Sovereign Underwriting Shard
              </h3>
              <button onClick={() => setIsSpawnModalOpen(false)} className="text-slate-600 hover:text-slate-900 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSpawnSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Shard Title *</label>
                <input
                  type="text"
                  required
                  value={spawnData.title}
                  onChange={e => setSpawnData({ ...spawnData, title: e.target.value })}
                  placeholder="e.g. Kano & Kaduna POS Float Shard"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Badge ID *</label>
                <input
                  type="text"
                  required
                  value={spawnData.badge}
                  onChange={e => setSpawnData({ ...spawnData, badge: e.target.value })}
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
                <textarea
                  value={spawnData.description}
                  onChange={e => setSpawnData({ ...spawnData, description: e.target.value })}
                  placeholder="Target state, credit scoring threshold, or specialized portfolio rules"
                  className="w-full px-3 py-2 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm"
                >
                  Spawn Shard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterLoansQrConsole;
