import React, { useState, useEffect, useCallback } from 'react';
import {
  LifebuoyIcon,
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
  SupportCareItem,
  SupportCareOverview,
  SupportCareSpawn,
  CreateSupportCarePayload
} from '../../types/supportCareConsole';
import { supportCareConsoleService } from '../../services/supportCareConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterSupportCareConsole: React.FC = () => {
  const [items, setItems] = useState<SupportCareItem[]>([]);
  const [overview, setOverview] = useState<SupportCareOverview | null>(null);
  const [spawns, setSpawns] = useState<SupportCareSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<SupportCareItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<SupportCareItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Tier-1 Care');
  const [formResponseMin, setFormResponseMin] = useState<number>(2.0);
  const [formResolutionRate, setFormResolutionRate] = useState<number>(95.0);
  const [formSlaCompliance, setFormSlaCompliance] = useState<number>(99.0);
  const [formCsatScore, setFormCsatScore] = useState<number>(4.85);
  const [formDescription, setFormDescription] = useState<string>('');

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnEndpoint, setSpawnEndpoint] = useState<string>('/api/support-care-console/spawns');
  const [spawnCategory, setSpawnCategory] = useState<string>('Care Tier');

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) audioEngine.playVoiceLine(voice);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, itms, sps] = await Promise.all([
        supportCareConsoleService.getOverview(),
        supportCareConsoleService.getItems({
          category: selectedCategory,
          status: selectedStatus,
          search: searchQuery
        }),
        supportCareConsoleService.getSpawns()
      ]);
      setOverview(ov);
      setItems(itms);
      setSpawns(sps);
    } catch (err: any) {
      showToast(err.message || 'Error fetching support care data', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (id: number) => {
    try {
      const updated = await supportCareConsoleService.toggleFreeze(id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      showToast(`Queue #${id} status changed to ${updated.status.toUpperCase()}`, 'wahala');
      loadData();
    } catch (_err) {
      showToast('Error toggling queue freeze state', 'wahala');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    try {
      const updatedItems = await supportCareConsoleService.reorderItems(items[index].id, items[targetIndex].id);
      setItems(updatedItems);
      showToast('Care queues reordered in PostgreSQL', 'gbaski');
    } catch (_err) {
      showToast('Error reordering care queues', 'wahala');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Purge queue #${id} permanently from database?`)) return;
    try {
      await supportCareConsoleService.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      showToast(`Purged queue #${id}`, 'madt_o');
      loadData();
    } catch (_err) {
      showToast('Error purging support care queue', 'wahala');
    }
  };

  const handleCreateQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: CreateSupportCarePayload = {
        code: formCode,
        name: formName,
        category: formCategory,
        avg_first_response_min: formResponseMin,
        resolution_rate_pct: formResolutionRate,
        sla_compliance_pct: formSlaCompliance,
        csat_score: formCsatScore,
        description: formDescription,
        status: 'active'
      };
      await supportCareConsoleService.createItem(payload);
      showToast(`Care Queue "${formName}" provisioned live!`, 'blessings');
      setIsAddModalOpen(false);
      resetForm();
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error creating care queue', 'wahala');
    }
  };

  const handleEditQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    try {
      await supportCareConsoleService.updateItem(activeItem.id, {
        name: formName,
        category: formCategory,
        avg_first_response_min: formResponseMin,
        resolution_rate_pct: formResolutionRate,
        sla_compliance_pct: formSlaCompliance,
        csat_score: formCsatScore,
        description: formDescription
      });
      showToast(`Queue "${formName}" updated successfully!`, 'sweet');
      setIsEditModalOpen(false);
      setActiveItem(null);
      resetForm();
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error updating care queue', 'wahala');
    }
  };

  const openEditModal = (item: SupportCareItem) => {
    setActiveItem(item);
    setFormCode(item.code);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormResponseMin(item.avg_first_response_min);
    setFormResolutionRate(item.resolution_rate_pct);
    setFormSlaCompliance(item.sla_compliance_pct);
    setFormCsatScore(item.csat_score);
    setFormDescription(item.description);
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormCode('');
    setFormName('');
    setFormCategory('Tier-1 Care');
    setFormResponseMin(2.0);
    setFormResolutionRate(95.0);
    setFormSlaCompliance(99.0);
    setFormCsatScore(4.85);
    setFormDescription('');
  };

  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await supportCareConsoleService.createSpawn({
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
      await supportCareConsoleService.uploadAsset(selectedItemForUpload?.id || null, uploadFile);
      showToast('Dispute evidence / Transcript ingested directly to server!', 'blessings');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setSelectedItemForUpload(null);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Evidence upload failed', 'wahala');
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
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-emerald-700/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-2xl">
                <LifebuoyIcon className="w-7 h-7" />
              </span>
              <span className="text-xs font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 rounded-full">
                Sovereign Customer Care & SLA Citadel
              </span>
            </div>
            <h1 className="text-3xl font-black mt-3 tracking-tight text-white">
              Support, SLA & Customer Care Operations Console
            </h1>
            <p className="text-emerald-200/80 text-sm mt-1 max-w-2xl font-medium">
              Autonomous multi-tier care triage (Tier-1 AI / Tier-2 Human / Tier-3 Engineering), automated SLA breach penalty compensations, merchant trade dispute chambers, and real-time CSAT telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Create Care Queue
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
              <span className="text-xs text-emerald-200/70 font-semibold uppercase tracking-wider">Active Queues</span>
              <div className="text-2xl font-black text-white mt-1">
                {overview.summary.total_items}
              </div>
              <span className="text-[11px] text-emerald-300 font-bold">
                {overview.summary.active_count} Active · {overview.summary.frozen_count} Frozen
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-emerald-200/70 font-semibold uppercase tracking-wider">Avg Response Time</span>
              <div className="text-2xl font-black text-emerald-300 mt-1">
                {parseFloat(overview.summary.overall_avg_response_min || '0').toFixed(1)}
                <span className="text-xs font-normal text-emerald-200/70 ml-1">min</span>
              </div>
              <span className="text-[11px] text-emerald-200/70 font-medium">Sub-Second AI Triage</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-emerald-200/70 font-semibold uppercase tracking-wider">Resolution Rate</span>
              <div className="text-2xl font-black text-amber-300 mt-1">
                {parseFloat(overview.summary.overall_resolution_pct || '0').toFixed(1)}%
              </div>
              <span className="text-[11px] text-emerald-300 font-bold">SLA: {parseFloat(overview.summary.overall_sla_compliance_pct || '0').toFixed(1)}%</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <span className="text-xs text-emerald-200/70 font-semibold uppercase tracking-wider">Platform CSAT</span>
              <div className="text-2xl font-black text-indigo-300 mt-1">
                {parseFloat(overview.summary.overall_csat_score || '0').toFixed(2)} / 5.0
              </div>
              <span className="text-[11px] text-emerald-200/70 font-medium">{overview.totalSpawns} Sub-Consoles</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Tier-1 Care', 'Tier-2 Care', 'Tier-3 Engineering', 'Merchant Disputes', 'Financial Disputes', 'Gaming Care', 'VIP Concierge', 'SLA Operations', 'Sentiment & Audits', 'Community Care', 'Trust & Safety', 'Self-Service'].map((cat) => (
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
            placeholder="Search queue, code..."
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
              Autonomous Support Queues & Dispute Chambers ({items.length})
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
                <th className="py-3 px-4">Code / Queue Name</th>
                <th className="py-3 px-4">Care Tier</th>
                <th className="py-3 px-4 text-right">Avg Response</th>
                <th className="py-3 px-4 text-right">Resolution</th>
                <th className="py-3 px-4 text-right">SLA / CSAT</th>
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

                  {/* Queue Name and Code */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] text-slate-700 flex items-center gap-2 mt-0.5">
                      <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-300">
                        {item.code}
                      </span>
                      <span>{item.description}</span>
                    </div>
                  </td>

                  {/* Care Tier */}
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                      {item.category}
                    </span>
                  </td>

                  {/* Avg Response */}
                  <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                    {item.avg_first_response_min} min
                  </td>

                  {/* Resolution Rate */}
                  <td className="py-3 px-4 text-right font-black text-emerald-700 font-mono">
                    {item.resolution_rate_pct}%
                  </td>

                  {/* SLA / CSAT */}
                  <td className="py-3 px-4 text-right">
                    <div className="font-black text-slate-900 font-mono">{item.csat_score} / 5.0</div>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {item.sla_compliance_pct}% SLA
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
                        className="p-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200"
                        title="Upload Evidence / Transcript"
                      >
                        <ArrowUpTrayIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-1.5 bg-slate-50 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-300"
                        title="Edit Queue"
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200"
                        title="Delete Queue"
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
            <BuildingOffice2Icon className="w-5 h-5 text-emerald-600" />
            Registered Sovereign Sub-Consoles ({spawns.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spawns.map((s) => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="font-bold text-slate-900 text-sm">{s.sub_console_name}</div>
                <div className="text-xs text-slate-600 font-mono mt-1">{s.slug}</div>
                <div className="text-[11px] text-emerald-700 mt-2 flex items-center justify-between">
                  <span>{s.category}</span>
                  <span className="text-emerald-700 font-bold uppercase">{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Create Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-300 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-black text-slate-900">Provision Support Care Queue</h3>
              <button type="button" aria-label="Close" onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateQueue} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Queue Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. SUPP-T1-WHATSAPP"
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Queue Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. WhatsApp Fast-Track Care Chamber"
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Care Tier</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="Tier-1 Care">Tier-1 Care</option>
                    <option value="Tier-2 Care">Tier-2 Care</option>
                    <option value="Tier-3 Engineering">Tier-3 Engineering</option>
                    <option value="Merchant Disputes">Merchant Disputes</option>
                    <option value="Financial Disputes">Financial Disputes</option>
                    <option value="Gaming Care">Gaming Care</option>
                    <option value="VIP Concierge">VIP Concierge</option>
                    <option value="SLA Operations">SLA Operations</option>
                    <option value="Sentiment & Audits">Sentiment & Audits</option>
                    <option value="Community Care">Community Care</option>
                    <option value="Trust & Safety">Trust & Safety</option>
                    <option value="Self-Service">Self-Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Avg Response (min)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formResponseMin}
                    onChange={(e) => setFormResponseMin(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Resolution %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formResolutionRate}
                    onChange={(e) => setFormResolutionRate(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">SLA %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formSlaCompliance}
                    onChange={(e) => setFormSlaCompliance(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">CSAT (1-5)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formCsatScore}
                    onChange={(e) => setFormCsatScore(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Escalation protocol, NLP intents, SLA trigger rules..."
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
                  className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
                >
                  Provision Queue Live
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
              <h3 className="text-lg font-black text-slate-900">Edit Queue: {activeItem.code}</h3>
              <button type="button" aria-label="Close" onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditQueue} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Queue Name</label>
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
                  <label className="block text-xs font-bold text-slate-800 mb-1">Care Tier</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="Tier-1 Care">Tier-1 Care</option>
                    <option value="Tier-2 Care">Tier-2 Care</option>
                    <option value="Tier-3 Engineering">Tier-3 Engineering</option>
                    <option value="Merchant Disputes">Merchant Disputes</option>
                    <option value="Financial Disputes">Financial Disputes</option>
                    <option value="Gaming Care">Gaming Care</option>
                    <option value="VIP Concierge">VIP Concierge</option>
                    <option value="SLA Operations">SLA Operations</option>
                    <option value="Sentiment & Audits">Sentiment & Audits</option>
                    <option value="Community Care">Community Care</option>
                    <option value="Trust & Safety">Trust & Safety</option>
                    <option value="Self-Service">Self-Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Avg Response (min)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formResponseMin}
                    onChange={(e) => setFormResponseMin(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Resolution %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formResolutionRate}
                    onChange={(e) => setFormResolutionRate(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">SLA %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formSlaCompliance}
                    onChange={(e) => setFormSlaCompliance(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">CSAT (1-5)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formCsatScore}
                    onChange={(e) => setFormCsatScore(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
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
                  className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md"
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
              <button type="button" aria-label="Close" onClick={() => setIsSpawnModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSpawnSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Sub-Console Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Merchant Dispute Sub-Console"
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
                  placeholder="e.g. vip-merchant-disputes"
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
                <DocumentTextIcon className="w-5 h-5 text-emerald-600" />
                Upload Dispute Evidence / Transcript
              </h3>
              <button type="button" aria-label="Close" onClick={() => setIsUploadModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div className="text-xs text-slate-700">
                Direct multipart/form-data ingestion to Express storage (<code className="font-mono text-slate-900">/uploads/support/*</code>). Zero client localStorage fallback.
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50">
                <input
                  type="file"
                  id="support-file-input"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="support-file-input" className="cursor-pointer block">
                  <ArrowUpTrayIcon className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                  <span className="text-xs font-bold text-slate-800">
                    {uploadFile ? uploadFile.name : 'Click to select evidence, PDF, or audit log'}
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
                  className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-xl shadow-md flex items-center gap-2"
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
