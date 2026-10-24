import React, { useState, useEffect, useCallback } from 'react';
import {
  GlobeAltIcon,
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
  ServerStackIcon
} from '@heroicons/react/24/outline';
import {
  DomainEdgeItem,
  DomainEdgeOverview,
  DomainEdgeSpawn,
  CreateDomainEdgePayload
} from '../../types/domainEdgeConsole';
import { domainEdgeConsoleService } from '../../services/domainEdgeConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterDomainEdgeConsole: React.FC = () => {
  const [items, setItems] = useState<DomainEdgeItem[]>([]);
  const [overview, setOverview] = useState<DomainEdgeOverview | null>(null);
  const [spawns, setSpawns] = useState<DomainEdgeSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<DomainEdgeItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<DomainEdgeItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Edge DNS & Routing');
  const [formQpsCapacity, setFormQpsCapacity] = useState<number>(100000);
  const [formSslGrade, setFormSslGrade] = useState<string>('A+');
  const [formCacheHitPct, setFormCacheHitPct] = useState<number>(98.5);
  const [formDescription, setFormDescription] = useState<string>('');

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnEndpoint, setSpawnEndpoint] = useState<string>('/api/domain-edge-console/spawns');
  const [spawnCategory, setSpawnCategory] = useState<string>('Edge DNS & Routing');

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
        domainEdgeConsoleService.getOverview(),
        domainEdgeConsoleService.getItems({
          category: selectedCategory === 'ALL' ? undefined : selectedCategory,
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
          search: searchQuery.trim() || undefined
        }),
        domainEdgeConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch (_err: any) {
      showToast('Error syncing with Edge Network control plane', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (item: DomainEdgeItem) => {
    try {
      const updated = await domainEdgeConsoleService.toggleFreeze(item.id);
      setItems(prev => prev.map(i => (i.id === item.id ? updated : i)));
      if (updated.status === 'frozen') {
        showToast(`Route ${updated.name} frozen securely!`, 'wahala');
      } else {
        showToast(`Route ${updated.name} restored to active operational status!`, 'sweet');
      }
      loadData();
    } catch (err: any) {
      showToast('Failed to switch route freeze status', 'see_gobe');
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const sourceItem = items[currentIndex];
    const targetItem = items[targetIndex];

    try {
      const reordered = await domainEdgeConsoleService.reorderItems(sourceItem.id, targetItem.id);
      setItems(reordered);
      showToast('Edge route prioritization resequenced!', 'gbaski');
    } catch (err: any) {
      showToast('Failed to reorder edge routes in PostgreSQL', 'wahala');
    }
  };

  const handleDelete = async (item: DomainEdgeItem) => {
    if (!window.confirm(`Are you sure you want to decommission edge node "${item.name}"?`)) return;

    try {
      await domainEdgeConsoleService.deleteItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast(`Node ${item.name} decommissioned successfully`, 'owo_ni_koko');
      loadData();
    } catch (err: any) {
      showToast('Failed to decommission edge node', 'see_gobe');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) {
      showToast('Route Code and Name are mandatory', 'wahala');
      return;
    }

    try {
      const payload: CreateDomainEdgePayload = {
        name: formName,
        code: formCode,
        category: formCategory,
        qps_capacity: Number(formQpsCapacity),
        ssl_grade: formSslGrade,
        cache_hit_pct: Number(formCacheHitPct),
        description: formDescription
      };
      const created = await domainEdgeConsoleService.createItem(payload);
      setItems(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
      showToast(`Edge Route ${created.name} provisioned!`, 'blessings');
      loadData();
    } catch (err: any) {
      showToast('Error creating Edge route node', 'see_gobe');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      const payload: Partial<CreateDomainEdgePayload> = {
        name: formName,
        code: formCode,
        category: formCategory,
        qps_capacity: Number(formQpsCapacity),
        ssl_grade: formSslGrade,
        cache_hit_pct: Number(formCacheHitPct),
        description: formDescription
      };
      const updated = await domainEdgeConsoleService.updateItem(activeItem.id, payload);
      setItems(prev => prev.map(i => (i.id === activeItem.id ? updated : i)));
      setIsEditModalOpen(false);
      setActiveItem(null);
      resetForm();
      showToast(`Edge Route ${updated.name} updated!`, 'madt_o');
      loadData();
    } catch (err: any) {
      showToast('Failed to update edge route configuration', 'wahala');
    }
  };

  const handleSpawn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnName || !spawnSlug) {
      showToast('Sub-Console Name and Slug are required', 'wahala');
      return;
    }

    try {
      const spawned = await domainEdgeConsoleService.spawnSubConsole({
        sub_console_name: spawnName,
        slug: spawnSlug,
        endpoint: spawnEndpoint,
        category: spawnCategory
      });
      setSpawns(prev => [spawned, ...prev]);
      setIsSpawnModalOpen(false);
      setSpawnName('');
      setSpawnSlug('');
      showToast(`Domain Sub-Console "${spawned.sub_console_name}" spawned live!`, 'colossal_combo');
      loadData();
    } catch (err: any) {
      showToast('Failed to spawn edge sub-console', 'see_gobe');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Please select a certificate/spec file', 'wahala');
      return;
    }

    try {
      setUploading(true);
      const res = await domainEdgeConsoleService.uploadAsset(
        selectedItemForUpload ? selectedItemForUpload.id : null,
        uploadFile
      );
      showToast(`Asset uploaded to Express: ${res.filename}`, 'great_combo');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setSelectedItemForUpload(null);
      loadData();
    } catch (err: any) {
      showToast('Multipart upload failed', 'wahala');
    } finally {
      setUploading(false);
    }
  };

  const openEditModal = (item: DomainEdgeItem) => {
    setActiveItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormQpsCapacity(item.qps_capacity);
    setFormSslGrade(item.ssl_grade);
    setFormCacheHitPct(item.cache_hit_pct);
    setFormDescription(item.description || '');
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormCode('');
    setFormCategory('Edge DNS & Routing');
    setFormQpsCapacity(100000);
    setFormSslGrade('A+');
    setFormCacheHitPct(98.5);
    setFormDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 transition-all animate-bounce">
          <SparklesIcon className="w-6 h-6 text-emerald-400" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl border border-blue-400">
              <GlobeAltIcon className="w-8 h-8 text-blue-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Domain & Edge Network Master Console
              </h1>
              <p className="text-sm text-slate-700">
                Sovereign DNS Routing, Edge CDN Anycast, TLS Offloading & Multi-Region Gateway Micromanagement
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Provision Route</span>
          </button>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <ServerStackIcon className="w-5 h-5" />
            <span>Spawn Sub-Console</span>
          </button>
          <button
            onClick={() => {
              setSelectedItemForUpload(null);
              setIsUploadModalOpen(true);
            }}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <ArrowUpTrayIcon className="w-5 h-5" />
            <span>Upload Cert/Asset</span>
          </button>
          <button
            onClick={loadData}
            className="p-2.5 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
            title="Refresh Operational State"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Telemetry Overview Metrics */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Edge Routes</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{overview.summary.total_items}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Anycast</span>
            <p className="text-2xl font-black text-emerald-800 mt-1">{overview.summary.active_count}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Frozen BGP Routes</span>
            <p className="text-2xl font-black text-rose-800 mt-1">{overview.summary.frozen_count}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total QPS Capacity</span>
            <p className="text-2xl font-black text-blue-900 mt-1">{Number(overview.summary.total_qps_capacity).toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avg Cache Hit %</span>
            <p className="text-2xl font-black text-indigo-900 mt-1">{Number(overview.summary.avg_cache_hit_pct).toFixed(1)}%</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Spawned Consoles</span>
            <p className="text-2xl font-black text-purple-900 mt-1">{overview.totalSpawns}</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Network Layers</option>
            <option value="Edge DNS & Routing">Edge DNS & Routing</option>
            <option value="CDN Anycast & PoPs">CDN Anycast & PoPs</option>
            <option value="TLS Offload & Certificates">TLS Offload & Certificates</option>
            <option value="WAF & DDoS Mitigation">WAF & DDoS Mitigation</option>
            <option value="Global Traffic Director">Global Traffic Director</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Operational Statuses</option>
            <option value="active">Active Routes Only</option>
            <option value="frozen">Frozen Routes Only</option>
          </select>
        </div>

        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search edge nodes, hostnames, IP pools..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
          </input>
        </div>
      </div>

      {/* Main Microservices Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-extrabold text-slate-900 text-lg">
            Operational Microservices & Edge Nodes ({items.length})
          </h2>
          <span className="text-xs font-semibold text-slate-700 bg-slate-200 px-3 py-1 rounded-full">
            Transactional Ordering Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 text-xs uppercase font-black border-b border-slate-200 tracking-wider">
                <th className="py-3.5 px-4">Priority / Sort</th>
                <th className="py-3.5 px-4">Node / Route Details</th>
                <th className="py-3.5 px-4">Layer / Category</th>
                <th className="py-3.5 px-4">QPS Capacity</th>
                <th className="py-3.5 px-4">SSL Grade</th>
                <th className="py-3.5 px-4">Cache Hit %</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-700 font-bold">
                    No edge routes matching filters.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      item.status === 'frozen' ? 'bg-rose-50/40' : ''
                    }`}
                  >
                    {/* Order & Priority */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-black text-slate-900 w-6 text-center">{item.display_order}</span>
                        <div className="flex flex-col space-y-0.5">
                          <button
                            onClick={() => handleReorder(index, 'UP')}
                            disabled={index === 0}
                            className={`p-1 rounded hover:bg-slate-200 text-slate-700 disabled:opacity-30 ${
                              index === 0 ? 'cursor-not-allowed' : ''
                            }`}
                            title="Move Up (Transaction Priority)"
                          >
                            <ArrowUpIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorder(index, 'DOWN')}
                            disabled={index === items.length - 1}
                            className={`p-1 rounded hover:bg-slate-200 text-slate-700 disabled:opacity-30 ${
                              index === items.length - 1 ? 'cursor-not-allowed' : ''
                            }`}
                            title="Move Down (Transaction Priority)"
                          >
                            <ArrowDownIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Name & Code */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs font-mono text-slate-700 flex items-center space-x-2">
                        <span className="bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded text-[11px] font-bold">
                          {item.code}
                        </span>
                        {item.asset_url && (
                          <span className="text-emerald-700 font-semibold underline text-[11px]">
                            Cert Linked
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <div className="text-xs text-slate-700 mt-0.5 max-w-xs truncate">
                          {item.description}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-md">
                        {item.category}
                      </span>
                    </td>

                    {/* QPS Capacity */}
                    <td className="py-3 px-4 text-slate-800 font-semibold font-mono">
                      {item.qps_capacity.toLocaleString()} QPS
                    </td>

                    {/* SSL Grade */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-black text-emerald-950 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded">
                        {item.ssl_grade}
                      </span>
                    </td>

                    {/* Cache Hit % */}
                    <td className="py-3 px-4 text-slate-800 font-semibold">
                      {item.cache_hit_pct}%
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {item.status === 'active' ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-950 border border-rose-400">
                          Frozen
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Toggle Freeze */}
                        <button
                          onClick={() => handleToggleFreeze(item)}
                          className={`p-1.5 rounded-lg border transition ${
                            item.status === 'active'
                              ? 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
                              : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          }`}
                          title={item.status === 'active' ? 'Freeze Route Node' : 'Unfreeze Route Node'}
                        >
                          {item.status === 'active' ? (
                            <PauseIcon className="w-4 h-4" />
                          ) : (
                            <PlayIcon className="w-4 h-4" />
                          )}
                        </button>

                        {/* Upload Asset */}
                        <button
                          onClick={() => {
                            setSelectedItemForUpload(item);
                            setIsUploadModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                          title="Upload Spec or SSL Cert"
                        >
                          <ArrowUpTrayIcon className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                          title="Edit Route"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 transition"
                          title="Decommission Route"
                        >
                          <TrashIcon className="w-4 h-4" />
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

      {/* Spawned Sub-Consoles Panel */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ServerStackIcon className="w-6 h-6 text-blue-900" />
            <h3 className="text-lg font-black text-slate-900">
              Active Domain & Edge Sub-Consoles ({spawns.length})
            </h3>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition"
          >
            Spawn Another Sub-Console
          </button>
        </div>

        {spawns.length === 0 ? (
          <p className="text-sm font-semibold text-slate-700">No sub-consoles spawned yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spawns.map(spawn => (
              <div
                key={spawn.id}
                className="border border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-white hover:border-blue-400 transition shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900 text-sm">{spawn.sub_console_name}</span>
                  <span className="text-[11px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 px-2 py-0.5 rounded">
                    {spawn.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-700 mt-2">Slug: {spawn.slug}</div>
                <div className="text-xs font-mono text-slate-700 truncate mt-0.5">Endpoint: {spawn.endpoint}</div>
                <div className="text-xs font-bold text-slate-800 mt-2 bg-slate-200 inline-block px-2 py-0.5 rounded">
                  {spawn.category}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Add Route Node */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Provision Edge Route Node</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Route Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DNS-AFRICA-01"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Route Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Anycast Node"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Network Layer / Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Edge DNS & Routing">Edge DNS & Routing</option>
                  <option value="CDN Anycast & PoPs">CDN Anycast & PoPs</option>
                  <option value="TLS Offload & Certificates">TLS Offload & Certificates</option>
                  <option value="WAF & DDoS Mitigation">WAF & DDoS Mitigation</option>
                  <option value="Global Traffic Director">Global Traffic Director</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">QPS Capacity</label>
                  <input
                    type="number"
                    value={formQpsCapacity}
                    onChange={e => setFormQpsCapacity(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">SSL Grade</label>
                  <input
                    type="text"
                    value={formSslGrade}
                    onChange={e => setFormSslGrade(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Cache Hit %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formCacheHitPct}
                    onChange={e => setFormCacheHitPct(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Operational specifications, anycast BGP communities, failover policies..."
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition"
                >
                  Provision Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Route Node */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Modify Route: {activeItem?.name}</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Route Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Route Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Network Layer / Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Edge DNS & Routing">Edge DNS & Routing</option>
                  <option value="CDN Anycast & PoPs">CDN Anycast & PoPs</option>
                  <option value="TLS Offload & Certificates">TLS Offload & Certificates</option>
                  <option value="WAF & DDoS Mitigation">WAF & DDoS Mitigation</option>
                  <option value="Global Traffic Director">Global Traffic Director</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">QPS Capacity</label>
                  <input
                    type="number"
                    value={formQpsCapacity}
                    onChange={e => setFormQpsCapacity(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">SSL Grade</label>
                  <input
                    type="text"
                    value={formSslGrade}
                    onChange={e => setFormSslGrade(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Cache Hit %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formCacheHitPct}
                    onChange={e => setFormCacheHitPct(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Spawn Sub-Console */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Spawn Domain & Edge Sub-Console</h3>
              <button
                onClick={() => setIsSpawnModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSpawn} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Sub-Console Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. West Africa PoP Gateway"
                  value={spawnName}
                  onChange={e => setSpawnName(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Console URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. west-africa-pop"
                  value={spawnSlug}
                  onChange={e => setSpawnSlug(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">API Endpoint</label>
                <input
                  type="text"
                  required
                  value={spawnEndpoint}
                  onChange={e => setSpawnEndpoint(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Network Layer / Category</label>
                <select
                  value={spawnCategory}
                  onChange={e => setSpawnCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Edge DNS & Routing">Edge DNS & Routing</option>
                  <option value="CDN Anycast & PoPs">CDN Anycast & PoPs</option>
                  <option value="TLS Offload & Certificates">TLS Offload & Certificates</option>
                  <option value="WAF & DDoS Mitigation">WAF & DDoS Mitigation</option>
                  <option value="Global Traffic Director">Global Traffic Director</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
                >
                  Spawn Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Direct Multipart Form-Data Upload (Zero Client Fallback) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">
                {selectedItemForUpload ? `Upload Cert for ${selectedItemForUpload.name}` : 'Upload SSL/Config Asset'}
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                  Select File (Direct Multipart/Form-Data to Express)
                </label>
                <input
                  type="file"
                  required
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm focus:outline-none"
                />
                <p className="text-xs text-slate-700 mt-2">
                  No localStorage fallback. File streams straight to Express backend storage.
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition disabled:opacity-50"
                >
                  {uploading ? 'Streaming to Express...' : 'Upload Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
