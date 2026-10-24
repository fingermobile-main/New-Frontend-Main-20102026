import React, { useState, useEffect, useCallback } from 'react';
import {
  GlobeAmericasIcon,
  PlayIcon,
  PauseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilSquareIcon,
  SparklesIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  DocumentTextIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import {
  FranchiseHubItem,
  FranchiseHubsOverview,
  FranchiseHubSpawn,
  CreateFranchiseHubPayload
} from '../../types/franchiseHubsConsole';
import { franchiseHubsConsoleService } from '../../services/franchiseHubsConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterFranchiseHubsConsole: React.FC = () => {
  const [items, setItems] = useState<FranchiseHubItem[]>([]);
  const [overview, setOverview] = useState<FranchiseHubsOverview | null>(null);
  const [spawns, setSpawns] = useState<FranchiseHubSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<FranchiseHubItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<FranchiseHubItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('West Africa');
  const [formTerritory, setFormTerritory] = useState<string>('Nigeria - Lagos & SW Zone');
  const [formMerchants, setFormMerchants] = useState<number>(500);
  const [formRevenueShare, setFormRevenueShare] = useState<number>(12.0);
  const [formTaxStatus, setFormTaxStatus] = useState<string>('Compliant');
  const [formCurrency, setFormCurrency] = useState<string>('NGN');
  const [formDescription, setFormDescription] = useState<string>('');

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnEndpoint, setSpawnEndpoint] = useState<string>('/api/franchise-hubs-console/spawns');
  const [spawnCategory, setSpawnCategory] = useState<string>('Regional Hub');

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) audioEngine.playVoiceLine(voice);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, itms, sps] = await Promise.all([
        franchiseHubsConsoleService.getOverview(),
        franchiseHubsConsoleService.getItems({
          category: selectedCategory,
          status: selectedStatus,
          search: searchQuery
        }),
        franchiseHubsConsoleService.getSpawns()
      ]);
      setOverview(ov);
      setItems(itms);
      setSpawns(sps);
    } catch (err: any) {
      showToast(err.message || 'Error fetching franchise hubs data', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (id: number) => {
    try {
      const updated = await franchiseHubsConsoleService.toggleFreeze(id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      showToast(`Hub #${id} status changed to ${updated.status.toUpperCase()}`, 'wahala');
      loadData();
    } catch (_err) {
      showToast('Error toggling hub freeze state', 'wahala');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    try {
      const updatedItems = await franchiseHubsConsoleService.reorderItems(items[index].id, items[targetIndex].id);
      setItems(updatedItems);
      showToast('Franchise hubs reordered successfully in PostgreSQL', 'gbaski');
    } catch (_err) {
      showToast('Error reordering franchise hubs', 'wahala');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Purge franchise hub #${id} permanently from database?`)) return;
    try {
      await franchiseHubsConsoleService.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      showToast(`Purged hub #${id}`, 'madt_o');
      loadData();
    } catch (_err) {
      showToast('Error purging franchise hub', 'wahala');
    }
  };

  const handleCreateHub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: CreateFranchiseHubPayload = {
        code: formCode,
        name: formName,
        category: formCategory,
        territory: formTerritory,
        merchants: formMerchants,
        revenue_share_pct: formRevenueShare,
        tax_compliance_status: formTaxStatus,
        currency: formCurrency,
        description: formDescription,
        status: 'active'
      };
      await franchiseHubsConsoleService.createItem(payload);
      showToast(`Franchise Hub "${formName}" provisioned live!`, 'blessings');
      setIsAddModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error creating franchise hub', 'wahala');
    }
  };

  const handleEditHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    try {
      await franchiseHubsConsoleService.updateItem(activeItem.id, {
        name: formName,
        category: formCategory,
        territory: formTerritory,
        merchants: formMerchants,
        revenue_share_pct: formRevenueShare,
        tax_compliance_status: formTaxStatus,
        currency: formCurrency,
        description: formDescription
      });
      showToast(`Hub "${formName}" updated successfully!`, 'sweet');
      setIsEditModalOpen(false);
      setActiveItem(null);
      resetForm();
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error updating franchise hub', 'wahala');
    }
  };

  const openEditModal = (item: FranchiseHubItem) => {
    setActiveItem(item);
    setFormCode(item.code);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormTerritory(item.territory);
    setFormMerchants(item.merchants);
    setFormRevenueShare(item.revenue_share_pct);
    setFormTaxStatus(item.tax_compliance_status);
    setFormCurrency(item.currency);
    setFormDescription(item.description);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormCode('');
    setFormName('');
    setFormCategory('West Africa');
    setFormTerritory('Nigeria - Lagos & SW Zone');
    setFormMerchants(500);
    setFormRevenueShare(12.0);
    setFormTaxStatus('Compliant');
    setFormCurrency('NGN');
    setFormDescription('');
  };

  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await franchiseHubsConsoleService.createSpawn({
        sub_console_name: spawnName,
        slug: spawnSlug,
        endpoint: spawnEndpoint,
        category: spawnCategory
      });
      showToast(`Sub-Console "${spawnName}" registered in PostgreSQL!`, 'owo_ni_koko');
      setIsSpawnModalOpen(false);
      setSpawnName('');
      setSpawnSlug('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Failed to spawn sub-console', 'wahala');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    try {
      setUploading(true);
      await franchiseHubsConsoleService.uploadAsset(selectedItemForUpload?.id || null, uploadFile);
      showToast('Franchise charter/asset ingested directly to server!', 'blessings');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setSelectedItemForUpload(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Asset upload failed', 'wahala');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <SparklesIcon className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-blue-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-2xl">
                <GlobeAmericasIcon className="w-7 h-7" />
              </span>
              <span className="text-xs font-black tracking-widest uppercase bg-blue-500/20 text-blue-200 border border-blue-400/30 px-3 py-1 rounded-full">
                Sovereign Territory Protocol
              </span>
            </div>
            <h1 className="text-3xl font-black mt-3 tracking-tight text-white">
              Franchise & Regional Hubs Management Console
            </h1>
            <p className="text-blue-200/80 text-sm mt-1 max-w-2xl font-medium">
              Autonomous administration of sovereign regional licensing, territorial geo-zones, merchant accreditation, localized payout rails, and cross-border tax compliance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Provision Franchise Hub
            </button>
            <button
              onClick={() => setIsSpawnModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-black rounded-xl transition-all flex items-center gap-2"
            >
              <BuildingOffice2Icon className="w-4 h-4" />
              Spawn Sub-Console
            </button>
            <button
              onClick={loadData}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl transition-all"
              title="Refresh Live Data"
            >
              <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 4 Overview Metrics */}
        {overview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-blue-200/70 font-semibold uppercase tracking-wider">Total Hubs</span>
              <div className="text-2xl font-black text-white mt-1">
                {overview.summary.total_items}
              </div>
              <span className="text-[11px] text-emerald-300 font-bold">
                {overview.summary.active_count} Active · {overview.summary.frozen_count} Frozen
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-blue-200/70 font-semibold uppercase tracking-wider">Accredited Merchants</span>
              <div className="text-2xl font-black text-emerald-300 mt-1">
                {parseInt(overview.summary.total_merchants || '0', 10).toLocaleString()}
              </div>
              <span className="text-[11px] text-blue-200/70 font-medium">Global Network</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-blue-200/70 font-semibold uppercase tracking-wider">Avg Revenue Share</span>
              <div className="text-2xl font-black text-amber-300 mt-1">
                {parseFloat(overview.summary.avg_revenue_share_pct || '0').toFixed(1)}%
              </div>
              <span className="text-[11px] text-blue-200/70 font-medium">Protocol Royalty</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-blue-200/70 font-semibold uppercase tracking-wider">Territories & Currencies</span>
              <div className="text-2xl font-black text-indigo-300 mt-1">
                {overview.summary.total_territories} / {overview.summary.total_currencies}
              </div>
              <span className="text-[11px] text-blue-200/70 font-medium">{overview.totalSpawns} Sub-Consoles</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'West Africa', 'East Africa', 'Southern Africa', 'Diaspora & EMEA', 'Diaspora & Americas', 'North Africa', 'Middle East', 'Governance & Audits'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="frozen">Frozen Only</option>
          </select>

          <input
            type="text"
            placeholder="Search hub, code, territory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl w-60 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Autonomous Franchise Hubs Registry ({items.length})
            </h3>
            <p className="text-xs text-slate-700">
              Live transactional resequencing (Up/Down) directly persisted in PostgreSQL
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-black text-slate-800 uppercase tracking-wider">
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4">Code / Hub Name</th>
                <th className="py-3 px-4">Region / Territory</th>
                <th className="py-3 px-4 text-right">Merchants</th>
                <th className="py-3 px-4 text-right">Rev Share</th>
                <th className="py-3 px-4">Tax / Currency</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Resequencing Up / Down */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUpIcon className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono font-bold text-slate-800 w-5 text-center">
                        {item.display_order}
                      </span>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDownIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Hub Name and Code */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-700 flex items-center gap-2 mt-0.5">
                      <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-300">
                        {item.code}
                      </span>
                      <span>{item.description}</span>
                    </div>
                  </td>

                  {/* Territory & Region */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.territory}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-950 border border-blue-400">
                      {item.category}
                    </span>
                  </td>

                  {/* Merchants */}
                  <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                    {item.merchants.toLocaleString()}
                  </td>

                  {/* Rev Share */}
                  <td className="py-3 px-4 text-right font-black text-amber-700 font-mono">
                    {item.revenue_share_pct}%
                  </td>

                  {/* Tax & Currency */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{item.tax_compliance_status}</div>
                    <span className="text-[11px] font-mono font-black text-slate-700">
                      {item.currency}
                    </span>
                  </td>

                  {/* Freeze Killswitch */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleFreeze(item.id)}
                      className={`px-2.5 py-1 text-[11px] font-black rounded-lg border flex items-center justify-center gap-1 mx-auto transition-all ${
                        item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                      }`}
                    >
                      {item.status === 'active' ? (
                        <>
                          <PlayIcon className="w-3 h-3 text-emerald-700" />
                          ACTIVE
                        </>
                      ) : (
                        <>
                          <PauseIcon className="w-3 h-3 text-rose-700" />
                          FROZEN
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions: Upload, Edit, Delete */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItemForUpload(item);
                          setIsUploadModalOpen(true);
                        }}
                        className="p-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg border border-blue-200"
                        title="Upload Charter / Cert"
                      >
                        <ArrowUpTrayIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 bg-slate-50 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-300"
                        title="Edit Hub"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200"
                        title="Delete Hub"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spawned Sub-Consoles Card */}
      {spawns.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <BuildingOffice2Icon className="w-5 h-5 text-blue-600" />
            Registered Sovereign Sub-Consoles ({spawns.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spawns.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="font-bold text-slate-900 text-sm">{s.sub_console_name}</div>
                <div className="text-xs text-slate-600 font-mono mt-1">{s.slug}</div>
                <div className="text-[11px] text-blue-700 mt-2 flex items-center justify-between">
                  <span>{s.category}</span>
                  <span className="text-emerald-700 font-bold uppercase">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Provision Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Provision Regional Franchise Hub</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateHub} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Hub Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. FRAN-GH-ACCRA"
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Hub Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Accra Digital Trade Hub"
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Region Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="West Africa">West Africa</option>
                    <option value="East Africa">East Africa</option>
                    <option value="Southern Africa">Southern Africa</option>
                    <option value="Diaspora & EMEA">Diaspora & EMEA</option>
                    <option value="Diaspora & Americas">Diaspora & Americas</option>
                    <option value="North Africa">North Africa</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Governance & Audits">Governance & Audits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Territory</label>
                  <input
                    type="text"
                    required
                    value={formTerritory}
                    onChange={(e) => setFormTerritory(e.target.value)}
                    placeholder="e.g. Ghana - Greater Accra"
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Merchants</label>
                  <input
                    type="number"
                    value={formMerchants}
                    onChange={(e) => setFormMerchants(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Rev Share %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formRevenueShare}
                    onChange={(e) => setFormRevenueShare(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Currency</label>
                  <input
                    type="text"
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Tax Compliance Status</label>
                <input
                  type="text"
                  value={formTaxStatus}
                  onChange={(e) => setFormTaxStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Operational details, customs treaties, banking partners..."
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
                >
                  Provision Hub Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Edit Franchise Hub: {activeItem.code}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditHub} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Hub Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Region Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="West Africa">West Africa</option>
                    <option value="East Africa">East Africa</option>
                    <option value="Southern Africa">Southern Africa</option>
                    <option value="Diaspora & EMEA">Diaspora & EMEA</option>
                    <option value="Diaspora & Americas">Diaspora & Americas</option>
                    <option value="North Africa">North Africa</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Governance & Audits">Governance & Audits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Territory</label>
                  <input
                    type="text"
                    required
                    value={formTerritory}
                    onChange={(e) => setFormTerritory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Merchants</label>
                  <input
                    type="number"
                    value={formMerchants}
                    onChange={(e) => setFormMerchants(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Rev Share %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formRevenueShare}
                    onChange={(e) => setFormRevenueShare(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Currency</label>
                  <input
                    type="text"
                    value={formCurrency}
                    onChange={(e) => setFormCurrency(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Tax Compliance Status</label>
                <input
                  type="text"
                  value={formTaxStatus}
                  onChange={(e) => setFormTaxStatus(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-Console Spawner Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Spawn Sovereign Sub-Console</h3>
              <button onClick={() => setIsSpawnModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSpawnSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Sub-Console Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kenya Silicon Savannah Console"
                  value={spawnName}
                  onChange={(e) => setSpawnName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. kenya-savannah-hub"
                  value={spawnSlug}
                  onChange={(e) => setSpawnSlug(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">API Endpoint</label>
                <input
                  type="text"
                  required
                  value={spawnEndpoint}
                  onChange={(e) => setSpawnEndpoint(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                <input
                  type="text"
                  value={spawnCategory}
                  onChange={(e) => setSpawnCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-black text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Register Sub-Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Multipart File Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                Upload Franchise Asset
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div className="text-xs text-slate-700">
                Direct multipart/form-data ingestion to Express storage (<code className="font-mono text-slate-900">/uploads/franchise/*</code>). Zero client localStorage fallback.
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50">
                <input
                  type="file"
                  id="franchise-file-input"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="franchise-file-input" className="cursor-pointer block">
                  <ArrowUpTrayIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-800">
                    {uploadFile ? uploadFile.name : 'Click to select franchise charter or cert (PDF, PNG, JSON)'}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Up to 50MB</p>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadFile || uploading}
                  className="px-5 py-2 text-xs font-black text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl shadow-md flex items-center gap-2"
                >
                  {uploading ? 'Ingesting...' : 'Ingest to Server'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
