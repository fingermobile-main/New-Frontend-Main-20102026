import React, { useState, useEffect, useCallback } from 'react';
import {
  SparklesIcon,
  PhotoIcon,
  PlayIcon,
  PauseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  ShieldCheckIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import {
  LuminaGalleryItem,
  LuminaGalleryOverview,
  LuminaGallerySpawn,
  CreateLuminaGalleryPayload
} from '../../types/luminaGalleryConsole';
import { luminaGalleryConsoleService } from '../../services/luminaGalleryConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterLuminaGalleryConsole: React.FC = () => {
  const [items, setItems] = useState<LuminaGalleryItem[]>([]);
  const [overview, setOverview] = useState<LuminaGalleryOverview | null>(null);
  const [spawns, setSpawns] = useState<LuminaGallerySpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<LuminaGalleryItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<LuminaGalleryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Ancestral Artifacts');
  const [formFloorPrice, setFormFloorPrice] = useState<number>(250);
  const [formRoyaltyPct, setFormRoyaltyPct] = useState<number>(10);
  const [formTotalMinted, setFormTotalMinted] = useState<number>(100);
  const [formDescription, setFormDescription] = useState<string>('');

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnEndpoint, setSpawnEndpoint] = useState<string>('/api/lumina-gallery-console/spawns');
  const [spawnCategory, setSpawnCategory] = useState<string>('Provenance Vault');

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
        luminaGalleryConsoleService.getOverview(),
        luminaGalleryConsoleService.getItems({
          category: selectedCategory === 'ALL' ? undefined : selectedCategory,
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
          search: searchQuery.trim() || undefined
        }),
        luminaGalleryConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch {
      showToast('Error syncing with Lumina Gallery provenance plane', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (item: LuminaGalleryItem) => {
    try {
      const updated = await luminaGalleryConsoleService.toggleFreeze(item.id);
      setItems(prev => prev.map(i => (i.id === item.id ? updated : i)));
      if (updated.status === 'frozen') {
        showToast(`Item "${updated.name}" frozen / vaulted from public trading!`, 'wahala');
      } else {
        showToast(`Item "${updated.name}" restored to active collectible exchange!`, 'sweet');
      }
      loadData();
    } catch (err: any) {
      showToast('Failed to switch item freeze status', 'see_gobe');
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const sourceItem = items[currentIndex];
    const targetItem = items[targetIndex];

    try {
      const reordered = await luminaGalleryConsoleService.reorderItems(sourceItem.id, targetItem.id);
      setItems(reordered);
      showToast('Lumina collectibles priority resequenced in PostgreSQL!', 'gbaski');
    } catch (err: any) {
      showToast('Failed to reorder collectible items in database', 'wahala');
    }
  };

  const handleDelete = async (item: LuminaGalleryItem) => {
    if (!window.confirm(`Are you sure you want to delete collectible "${item.name}" from Lumina Gallery?`)) return;

    try {
      await luminaGalleryConsoleService.deleteItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast(`Collectible "${item.name}" expunged from gallery registry`, 'owo_ni_koko');
      loadData();
    } catch (err: any) {
      showToast('Failed to delete gallery item', 'see_gobe');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) {
      showToast('Item Code and Name are mandatory', 'wahala');
      return;
    }

    try {
      const payload: CreateLuminaGalleryPayload = {
        code: formCode,
        name: formName,
        category: formCategory,
        floor_price_fic: Number(formFloorPrice),
        royalty_pct: Number(formRoyaltyPct),
        total_minted: Number(formTotalMinted),
        description: formDescription
      };

      const created = await luminaGalleryConsoleService.createItem(payload);
      setItems(prev => [...prev, created]);
      setIsAddModalOpen(false);
      resetForm();
      showToast(`Collectible "${created.name}" minted into Lumina Gallery!`, 'great_combo');
      loadData();
    } catch (err: any) {
      showToast('Failed to create gallery collectible', 'see_gobe');
    }
  };

  const handleEdit = (item: LuminaGalleryItem) => {
    setActiveItem(item);
    setFormCode(item.code);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormFloorPrice(item.floor_price_fic);
    setFormRoyaltyPct(item.royalty_pct);
    setFormTotalMinted(item.total_minted);
    setFormDescription(item.description || '');
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      const payload: Partial<CreateLuminaGalleryPayload> = {
        name: formName,
        category: formCategory,
        floor_price_fic: Number(formFloorPrice),
        royalty_pct: Number(formRoyaltyPct),
        total_minted: Number(formTotalMinted),
        description: formDescription
      };

      const updated = await luminaGalleryConsoleService.updateItem(activeItem.id, payload);
      setItems(prev => prev.map(i => (i.id === activeItem.id ? updated : i)));
      setIsEditModalOpen(false);
      setActiveItem(null);
      resetForm();
      showToast(`Collectible "${updated.name}" updated in database!`, 'blessings');
      loadData();
    } catch (err: any) {
      showToast('Failed to update collectible item', 'wahala');
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForUpload || !uploadFile) {
      showToast('Please select a file to upload', 'wahala');
      return;
    }

    try {
      setUploading(true);
      const res = await luminaGalleryConsoleService.uploadAsset(selectedItemForUpload.id, uploadFile);
      setItems(prev => prev.map(i => (i.id === selectedItemForUpload.id ? { ...i, asset_url: res.asset_url } : i)));
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setSelectedItemForUpload(null);
      showToast('Collectible asset uploaded direct to Express backend!', 'sweet');
      loadData();
    } catch {
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
      const newSpawn = await luminaGalleryConsoleService.spawnSubConsole({
        sub_console_name: spawnName,
        slug: spawnSlug,
        endpoint: spawnEndpoint,
        category: spawnCategory
      });
      setSpawns(prev => [...prev, newSpawn]);
      setIsSpawnModalOpen(false);
      setSpawnName('');
      setSpawnSlug('');
      showToast(`Autonomous Sub-Console "${newSpawn.sub_console_name}" spawned!`, 'colossal_combo');
      loadData();
    } catch (err: any) {
      showToast('Failed to spawn sub-console', 'wahala');
    }
  };

  const resetForm = () => {
    setFormCode('');
    setFormName('');
    setFormCategory('Ancestral Artifacts');
    setFormFloorPrice(250);
    setFormRoyaltyPct(10);
    setFormTotalMinted(100);
    setFormDescription('');
  };

  const categories = overview?.categories || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/50 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 transition-all">
          <SparklesIcon className="w-5 h-5 text-amber-400 animate-spin" />
          <span className="text-sm font-semibold text-slate-100">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-100 border border-amber-300 rounded-xl">
              <PhotoIcon className="w-7 h-7 text-amber-800" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Lumina Digital Collectibles & Cultural Provenance Console
              </h1>
              <p className="text-sm font-medium text-slate-700 mt-0.5">
                Curate, mint, resequence, and manage sovereign cultural artifacts, 3D assets, and sovereign royalty vaults.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <button
            onClick={() => {
              showToast('Syncing Lumina Gallery records with PostgreSQL...', 'blessings');
              loadData();
            }}
            className="flex-1 md:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition"
          >
            <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Engine</span>
          </button>

          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-950 border border-purple-300 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 transition"
          >
            <SwatchIcon className="w-4 h-4 text-purple-800" />
            <span>Spawn Sub-Console</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex-1 md:flex-none px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-sm transition"
          >
            <PlusIcon className="w-4 h-4 text-white" />
            <span>Mint Collectible</span>
          </button>
        </div>
      </div>

      {/* Overview Analytics Bar */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Total Vault Items</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{overview.summary.total_items}</span>
            <span className="text-xs font-semibold text-emerald-800 mt-1 block">Active: {overview.summary.active_count}</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Total Minted</span>
            <span className="text-2xl font-black text-amber-900 mt-1 block">
              {Number(overview.summary.total_minted_items || 0).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Tokens Issued</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Avg Floor Price</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {Number(overview.summary.avg_floor_price_fic || 0).toFixed(0)} FIC
            </span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Sovereign FIC</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Avg Royalty Split</span>
            <span className="text-2xl font-black text-purple-900 mt-1 block">
              {Number(overview.summary.avg_royalty_pct || 0).toFixed(1)}%
            </span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Creator Provenance</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Categories</span>
            <span className="text-2xl font-black text-blue-900 mt-1 block">{overview.summary.total_categories}</span>
            <span className="text-xs font-semibold text-slate-700 mt-1 block">Active Disciplines</span>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Autonomous Spawns</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{spawns.length}</span>
            <span className="text-xs font-semibold text-emerald-800 mt-1 block">Active Sub-Vaults</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800 uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              aria-label="Filter Lumina Collectibles by Category"
              className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Categories ({items.length})</option>
              {categories.map(c => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.count})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800 uppercase">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              aria-label="Filter Lumina Collectibles by Status"
              className="text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Status</option>
              <option value="active">Active Only</option>
              <option value="frozen">Frozen / Vaulted</option>
            </select>
          </div>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search collectibles, code, category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">
            Sovereign Digital Collectibles Catalog ({items.length})
          </h2>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
            Real-Time Postgres Transactions
          </span>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center">
            <PhotoIcon className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No collectibles matching criteria</h3>
            <p className="text-xs text-slate-700 mt-1">Adjust filters or mint a new cultural collectible item.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-300 text-xs font-black text-slate-900 uppercase tracking-wider">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Asset / Code</th>
                  <th className="py-3 px-4">Collectible Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Floor Price</th>
                  <th className="py-3 px-4 text-right">Royalty</th>
                  <th className="py-3 px-4 text-right">Minted</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    {/* Resequencing Controls */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-extrabold text-slate-800 w-6 text-center">
                          #{item.display_order}
                        </span>
                        <div className="flex flex-col space-y-0.5">
                          <button
                            onClick={() => handleReorder(idx, 'UP')}
                            disabled={idx === 0}
                            title="Move Up"
                            aria-label={`Move ${item.name} Up`}
                            className={`p-1 rounded hover:bg-slate-200 text-slate-800 ${
                              idx === 0 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                          >
                            <ArrowUpIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleReorder(idx, 'DOWN')}
                            disabled={idx === items.length - 1}
                            title="Move Down"
                            aria-label={`Move ${item.name} Down`}
                            className={`p-1 rounded hover:bg-slate-200 text-slate-800 ${
                              idx === items.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                          >
                            <ArrowDownIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Asset & Code */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {item.asset_url ? (
                          <img
                            src={item.asset_url}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-300"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center">
                            <PhotoIcon className="w-5 h-5 text-slate-600" />
                          </div>
                        )}
                        <div>
                          <span className="text-xs font-mono font-bold text-slate-900 block">{item.code}</span>
                          <button
                            onClick={() => {
                              setSelectedItemForUpload(item);
                              setIsUploadModalOpen(true);
                            }}
                            className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline flex items-center space-x-1 mt-0.5"
                          >
                            <ArrowUpTrayIcon className="w-3 h-3" />
                            <span>Upload Media</span>
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Name & Description */}
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900 leading-snug">{item.name}</div>
                      <p className="text-xs font-medium text-slate-700 line-clamp-1 mt-0.5">
                        {item.description || 'Provenance certified on FingerMobile Protocol'}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-950 border border-blue-400">
                        {item.category}
                      </span>
                    </td>

                    {/* Floor Price */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <span className="font-mono font-black text-slate-900">
                        {Number(item.floor_price_fic || 0).toLocaleString()} FIC
                      </span>
                    </td>

                    {/* Royalty */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <span className="font-mono font-bold text-purple-900">
                        {Number(item.royalty_pct || 0).toFixed(1)}%
                      </span>
                    </td>

                    {/* Minted */}
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <span className="font-mono font-black text-amber-900">
                        {Number(item.total_minted || 0).toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                          item.status === 'active'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : 'bg-rose-100 text-rose-950 border border-rose-400'
                        }`}
                      >
                        {item.status === 'active' ? 'Active' : 'Frozen'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => handleToggleFreeze(item)}
                          title={item.status === 'active' ? 'Freeze / Quarantine' : 'Restore'}
                          aria-label={item.status === 'active' ? `Freeze ${item.name}` : `Unfreeze ${item.name}`}
                          className={`p-1.5 rounded-lg border transition ${
                            item.status === 'active'
                              ? 'border-amber-300 hover:bg-amber-100 text-amber-900'
                              : 'border-emerald-300 hover:bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          {item.status === 'active' ? (
                            <PauseIcon className="w-4 h-4" />
                          ) : (
                            <PlayIcon className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={() => handleEdit(item)}
                          title="Edit Collectible"
                          aria-label={`Edit ${item.name}`}
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-800 transition"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(item)}
                          title="Delete Collectible"
                          aria-label={`Delete ${item.name}`}
                          className="p-1.5 rounded-lg border border-rose-200 hover:bg-rose-100 text-rose-800 transition"
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
        )}
      </div>

      {/* Spawns Panel */}
      <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-amber-800" />
              <span>Autonomous Lumina Sub-Consoles & Provenance Vaults ({spawns.length})</span>
            </h3>
            <p className="text-xs font-medium text-slate-700 mt-0.5">
              Dedicated isolated sub-consoles for curating niche cultural exhibitions, private collections, and royal regalia.
            </p>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>New Sub-Console</span>
          </button>
        </div>

        {spawns.length === 0 ? (
          <p className="text-xs text-slate-600 italic">No sub-consoles spawned yet.</p>
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
                <div className="text-xs font-bold text-amber-900 mt-2">{sp.category}</div>
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
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Mint Sovereign Collectible Item</h3>
            <p className="text-xs font-medium text-slate-700 mb-4">
              Add a verified provenance artifact into Lumina Digital Collectibles catalog.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Unique Code *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value.toUpperCase())}
                    placeholder="LUMINA-ART-101"
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    placeholder="Ancestral Artifacts"
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Collectible Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Bronze Head of Ife (Sovereign Edition)"
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Floor Price (FIC)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formFloorPrice}
                    onChange={e => setFormFloorPrice(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Royalty %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={formRoyaltyPct}
                    onChange={e => setFormRoyaltyPct(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Total Minted</label>
                  <input
                    type="number"
                    min="1"
                    value={formTotalMinted}
                    onChange={e => setFormTotalMinted(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Description / Provenance History</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Authentic 3D scan and cryptographic verification token of historical royal artifacts..."
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow transition"
                >
                  Mint Collectible
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button type="button" aria-label="Close"
              onClick={() => {
                setIsEditModalOpen(false);
                setActiveItem(null);
              }}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-800"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Edit Collectible: {activeItem.code}</h3>
            <p className="text-xs font-medium text-slate-700 mb-4">
              Update pricing, royalty splits, and provenance metadata in PostgreSQL.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Unique Code (Locked)</label>
                  <input
                    type="text"
                    disabled
                    value={formCode}
                    className="w-full text-xs font-bold text-slate-600 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Collectible Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Floor Price (FIC)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formFloorPrice}
                    onChange={e => setFormFloorPrice(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Royalty %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={formRoyaltyPct}
                    onChange={e => setFormRoyaltyPct(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">Total Minted</label>
                  <input
                    type="number"
                    min="1"
                    value={formTotalMinted}
                    onChange={e => setFormTotalMinted(Number(e.target.value))}
                    className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Description / Provenance History</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setActiveItem(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow transition"
                >
                  Save Modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Direct Multipart Upload Modal */}
      {isUploadModalOpen && selectedItemForUpload && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button type="button" aria-label="Close"
              onClick={() => {
                setIsUploadModalOpen(false);
                setSelectedItemForUpload(null);
                setUploadFile(null);
              }}
              className="absolute top-5 right-5 text-slate-500 hover:text-slate-800"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Upload Provenance Media</h3>
            <p className="text-xs font-medium text-slate-700 mb-4">
              Sends multipart/form-data directly to Express backend for item: <br />
              <span className="font-mono font-bold text-slate-900">{selectedItemForUpload.name}</span>
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Select Media File</label>
                <input
                  type="file"
                  required
                  accept="image/*,video/*,model/gltf-binary"
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs font-bold text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-amber-100 file:text-amber-950 hover:file:bg-amber-200 border border-slate-300 rounded-xl p-2 bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsUploadModalOpen(false);
                    setSelectedItemForUpload(null);
                    setUploadFile(null);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow transition flex items-center space-x-2"
                >
                  {uploading && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                  <span>{uploading ? 'Uploading to Express...' : 'Upload Asset'}</span>
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
              <XMarkIcon className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-black text-slate-900 mb-1">Spawn Lumina Sub-Console</h3>
            <p className="text-xs font-medium text-slate-700 mb-4">
              Spawn an autonomous child console node with custom provenance scope.
            </p>

            <form onSubmit={handleSpawn} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Sub-Console Name *</label>
                <input
                  type="text"
                  required
                  value={spawnName}
                  onChange={e => setSpawnName(e.target.value)}
                  placeholder="Ife Royal Bronze Archival Node"
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Slug Identifier *</label>
                <input
                  type="text"
                  required
                  value={spawnSlug}
                  onChange={e => setSpawnSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="ife-royal-bronze-archive"
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Category / Domain</label>
                <input
                  type="text"
                  value={spawnCategory}
                  onChange={e => setSpawnCategory(e.target.value)}
                  placeholder="Provenance Vault"
                  className="w-full text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-900 block mb-1">Routing Endpoint</label>
                <input
                  type="text"
                  value={spawnEndpoint}
                  onChange={e => setSpawnEndpoint(e.target.value)}
                  className="w-full text-xs font-bold text-slate-600 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500"
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

export default MasterLuminaGalleryConsole;
