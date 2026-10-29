import React, { useState, useEffect, useCallback } from 'react';
import {
  TrophyIcon,
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
  GiftIcon
} from '@heroicons/react/24/outline';
import {
  GamificationRewardsItem,
  GamificationRewardsOverview,
  GamificationRewardsSpawn,
  CreateGamificationRewardsPayload
} from '../../types/gamificationRewardsConsole';
import { gamificationRewardsConsoleService } from '../../services/gamificationRewardsConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterGamificationRewardsConsole: React.FC = () => {
  const [items, setItems] = useState<GamificationRewardsItem[]>([]);
  const [overview, setOverview] = useState<GamificationRewardsOverview | null>(null);
  const [spawns, setSpawns] = useState<GamificationRewardsSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedItemForUpload, setSelectedItemForUpload] = useState<GamificationRewardsItem | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<GamificationRewardsItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Daily Streaks & Quests');
  const [formMultiplierCap, setFormMultiplierCap] = useState<number>(3.5);
  const [formParticipants, setFormParticipants] = useState<number>(1000);
  const [formBudgetFic, setFormBudgetFic] = useState<number>(50000);
  const [formDescription, setFormDescription] = useState<string>('');

  // Spawn Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnSlug, setSpawnSlug] = useState<string>('');
  const [spawnEndpoint, setSpawnEndpoint] = useState<string>('/api/gamification-rewards-console/spawns');
  const [spawnCategory, setSpawnCategory] = useState<string>('Daily Streaks & Quests');

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
        gamificationRewardsConsoleService.getOverview(),
        gamificationRewardsConsoleService.getItems({
          category: selectedCategory === 'ALL' ? undefined : selectedCategory,
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
          search: searchQuery.trim() || undefined
        }),
        gamificationRewardsConsoleService.getSpawns()
      ]);
      setOverview(overviewData);
      setItems(itemsData);
      setSpawns(spawnsData);
    } catch (_err: any) {
      showToast('Error syncing with Rewards Citadel plane', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (item: GamificationRewardsItem) => {
    try {
      const updated = await gamificationRewardsConsoleService.toggleFreeze(item.id);
      setItems(prev => prev.map(i => (i.id === item.id ? updated : i)));
      if (updated.status === 'frozen') {
        showToast(`Quest module "${updated.name}" frozen immediately!`, 'wahala');
      } else {
        showToast(`Quest module "${updated.name}" reactivated for community rewards!`, 'owo_ni_koko');
      }
      loadData();
    } catch (err: any) {
      showToast('Failed to toggle quest freeze status', 'see_gobe');
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const sourceItem = items[currentIndex];
    const targetItem = items[targetIndex];

    try {
      const reordered = await gamificationRewardsConsoleService.reorderItems(sourceItem.id, targetItem.id);
      setItems(reordered);
      showToast('Quest priority resequenced in PostgreSQL!', 'gbaski');
    } catch (err: any) {
      showToast('Failed to reorder quest module in database', 'wahala');
    }
  };

  const handleDelete = async (item: GamificationRewardsItem) => {
    if (!window.confirm(`Are you sure you want to terminate quest module "${item.name}"?`)) return;

    try {
      await gamificationRewardsConsoleService.deleteItem(item.id);
      setItems(prev => prev.filter(i => i.id !== item.id));
      showToast(`Quest module ${item.name} removed successfully`, 'owo_ni_koko');
      loadData();
    } catch (err: any) {
      showToast('Failed to terminate quest module', 'see_gobe');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode) {
      showToast('Module Code and Name are mandatory', 'wahala');
      return;
    }

    try {
      const payload: CreateGamificationRewardsPayload = {
        name: formName,
        code: formCode,
        category: formCategory,
        multiplier_cap: Number(formMultiplierCap),
        total_participants: Number(formParticipants),
        reward_budget_fic: Number(formBudgetFic),
        description: formDescription
      };
      const created = await gamificationRewardsConsoleService.createItem(payload);
      setItems(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
      showToast(`Quest module "${created.name}" launched!`, 'blessings');
      loadData();
    } catch (err: any) {
      showToast('Error deploying quest module', 'see_gobe');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;

    try {
      const payload: Partial<CreateGamificationRewardsPayload> = {
        name: formName,
        code: formCode,
        category: formCategory,
        multiplier_cap: Number(formMultiplierCap),
        total_participants: Number(formParticipants),
        reward_budget_fic: Number(formBudgetFic),
        description: formDescription
      };
      const updated = await gamificationRewardsConsoleService.updateItem(activeItem.id, payload);
      setItems(prev => prev.map(i => (i.id === activeItem.id ? updated : i)));
      setIsEditModalOpen(false);
      setActiveItem(null);
      resetForm();
      showToast(`Quest module "${updated.name}" updated!`, 'madt_o');
      loadData();
    } catch (err: any) {
      showToast('Failed to update quest module', 'wahala');
    }
  };

  const handleSpawn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnName || !spawnSlug) {
      showToast('Sub-Console Name and Slug are required', 'wahala');
      return;
    }

    try {
      const spawned = await gamificationRewardsConsoleService.spawnSubConsole({
        sub_console_name: spawnName,
        slug: spawnSlug,
        endpoint: spawnEndpoint,
        category: spawnCategory
      });
      setSpawns(prev => [spawned, ...prev]);
      setIsSpawnModalOpen(false);
      setSpawnName('');
      setSpawnSlug('');
      showToast(`Rewards Sub-Console "${spawned.sub_console_name}" spawned live!`, 'colossal_combo');
      loadData();
    } catch (err: any) {
      showToast('Failed to spawn rewards sub-console', 'see_gobe');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      showToast('Please select a reward badge or spec asset', 'wahala');
      return;
    }

    try {
      setUploading(true);
      const res = await gamificationRewardsConsoleService.uploadAsset(
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

  const openEditModal = (item: GamificationRewardsItem) => {
    setActiveItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormMultiplierCap(item.multiplier_cap);
    setFormParticipants(item.total_participants);
    setFormBudgetFic(item.reward_budget_fic);
    setFormDescription(item.description || '');
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormCode('');
    setFormCategory('Daily Streaks & Quests');
    setFormMultiplierCap(3.5);
    setFormParticipants(1000);
    setFormBudgetFic(50000);
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
            <div className="p-3 bg-amber-100 rounded-xl border border-amber-400">
              <TrophyIcon className="w-8 h-8 text-amber-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Gamification, Quests & Rewards Citadel Console
              </h1>
              <p className="text-sm text-slate-700">
                Sovereign Quest Mechanics, Daily Streaks, Multiplier Caps, FIC Airdrop Pools & Community Achievements
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
            className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Launch Quest</span>
          </button>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <GiftIcon className="w-5 h-5" />
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
            <span>Upload Badge/Media</span>
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
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Quest Tracks</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{overview.summary.total_items}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Campaigns</span>
            <p className="text-2xl font-black text-emerald-800 mt-1">{overview.summary.active_count}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Frozen Modules</span>
            <p className="text-2xl font-black text-rose-800 mt-1">{overview.summary.frozen_count}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Participants</span>
            <p className="text-2xl font-black text-blue-900 mt-1">{Number(overview.summary.total_participants).toLocaleString()}</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total FIC Budget</span>
            <p className="text-2xl font-black text-amber-900 mt-1">{Number(overview.summary.total_reward_budget_fic).toLocaleString()} FIC</p>
          </div>
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Peak Multiplier Cap</span>
            <p className="text-2xl font-black text-purple-900 mt-1">{overview.summary.peak_multiplier_cap}x</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Gamification Tracks</option>
            <option value="Daily Streaks & Quests">Daily Streaks & Quests</option>
            <option value="Leaderboard Milestones">Leaderboard Milestones</option>
            <option value="Staking Multiplier Boosters">Staking Multiplier Boosters</option>
            <option value="Referral & Virality Loops">Referral & Virality Loops</option>
            <option value="Seasonal Epics & Raids">Seasonal Epics & Raids</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Operational Statuses</option>
            <option value="active">Active Quests Only</option>
            <option value="frozen">Frozen Quests Only</option>
          </select>
        </div>

        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="Search quest tracks, codes, badges..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
          </input>
        </div>
      </div>

      {/* Main Microservices Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-extrabold text-slate-900 text-lg">
            Operational Microservices & Quest Programs ({items.length})
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
                <th className="py-3.5 px-4">Quest / Program Details</th>
                <th className="py-3.5 px-4">Track / Category</th>
                <th className="py-3.5 px-4">Multiplier Cap</th>
                <th className="py-3.5 px-4">Participants</th>
                <th className="py-3.5 px-4">FIC Budget</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-700 font-bold">
                    No gamification tracks matching filters.
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
                            Badge Attached
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

                    {/* Multiplier Cap */}
                    <td className="py-3 px-4">
                      <span className="text-xs font-black text-amber-950 bg-amber-100 border border-amber-400 px-2 py-0.5 rounded">
                        {item.multiplier_cap}x
                      </span>
                    </td>

                    {/* Participants */}
                    <td className="py-3 px-4 text-slate-800 font-semibold">
                      {item.total_participants.toLocaleString()}
                    </td>

                    {/* FIC Budget */}
                    <td className="py-3 px-4 text-slate-800 font-semibold font-mono">
                      {item.reward_budget_fic.toLocaleString()} FIC
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
                          title={item.status === 'active' ? 'Freeze Quest' : 'Unfreeze Quest'}
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
                          title="Upload Quest Badge"
                        >
                          <ArrowUpTrayIcon className="w-4 h-4" />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition"
                          title="Edit Quest"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg border border-rose-300 bg-rose-50 text-rose-800 hover:bg-rose-100 transition"
                          title="Terminate Quest"
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
            <GiftIcon className="w-6 h-6 text-amber-900" />
            <h3 className="text-lg font-black text-slate-900">
              Active Rewards Sub-Consoles ({spawns.length})
            </h3>
          </div>
          <button
            onClick={() => setIsSpawnModalOpen(true)}
            className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg transition"
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
                className="border border-slate-300 rounded-xl p-4 bg-slate-50 hover:bg-white hover:border-amber-400 transition shadow-sm"
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

      {/* MODAL: Launch Quest */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Launch Gamification Quest</h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Quest Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. QUEST-ALPHA-01"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Quest Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 30-Day Sovereign Streak"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Quest Category / Track</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Daily Streaks & Quests">Daily Streaks & Quests</option>
                  <option value="Leaderboard Milestones">Leaderboard Milestones</option>
                  <option value="Staking Multiplier Boosters">Staking Multiplier Boosters</option>
                  <option value="Referral & Virality Loops">Referral & Virality Loops</option>
                  <option value="Seasonal Epics & Raids">Seasonal Epics & Raids</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Multiplier Cap</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formMultiplierCap}
                    onChange={e => setFormMultiplierCap(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Participants</label>
                  <input
                    type="number"
                    value={formParticipants}
                    onChange={e => setFormParticipants(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">FIC Budget</label>
                  <input
                    type="number"
                    value={formBudgetFic}
                    onChange={e => setFormBudgetFic(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Quest requirements, verification conditions, airdrop disbursement specs..."
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition"
                >
                  Launch Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Quest */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
            <div className="px-6 py-4 bg-slate-100 border-b border-slate-300 flex justify-between items-center">
              <h3 className="font-black text-slate-900 text-lg">Modify Quest: {activeItem?.name}</h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Quest Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Quest Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Quest Category / Track</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Daily Streaks & Quests">Daily Streaks & Quests</option>
                  <option value="Leaderboard Milestones">Leaderboard Milestones</option>
                  <option value="Staking Multiplier Boosters">Staking Multiplier Boosters</option>
                  <option value="Referral & Virality Loops">Referral & Virality Loops</option>
                  <option value="Seasonal Epics & Raids">Seasonal Epics & Raids</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Multiplier Cap</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formMultiplierCap}
                    onChange={e => setFormMultiplierCap(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Participants</label>
                  <input
                    type="number"
                    value={formParticipants}
                    onChange={e => setFormParticipants(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">FIC Budget</label>
                  <input
                    type="number"
                    value={formBudgetFic}
                    onChange={e => setFormBudgetFic(Number(e.target.value))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition"
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
              <h3 className="font-black text-slate-900 text-lg">Spawn Gamification Sub-Console</h3>
              <button type="button" aria-label="Close"
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
                  placeholder="e.g. Lagos City Quest Hub"
                  value={spawnName}
                  onChange={e => setSpawnName(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Console URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. lagos-quest-hub"
                  value={spawnSlug}
                  onChange={e => setSpawnSlug(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">API Endpoint</label>
                <input
                  type="text"
                  required
                  value={spawnEndpoint}
                  onChange={e => setSpawnEndpoint(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Quest Category / Track</label>
                <select
                  value={spawnCategory}
                  onChange={e => setSpawnCategory(e.target.value)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Daily Streaks & Quests">Daily Streaks & Quests</option>
                  <option value="Leaderboard Milestones">Leaderboard Milestones</option>
                  <option value="Staking Multiplier Boosters">Staking Multiplier Boosters</option>
                  <option value="Referral & Virality Loops">Referral & Virality Loops</option>
                  <option value="Seasonal Epics & Raids">Seasonal Epics & Raids</option>
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
                {selectedItemForUpload ? `Upload Badge for ${selectedItemForUpload.name}` : 'Upload Rewards Badge / Spec'}
              </h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-2">
                  Select Badge / Asset (Direct Multipart/Form-Data to Express)
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
