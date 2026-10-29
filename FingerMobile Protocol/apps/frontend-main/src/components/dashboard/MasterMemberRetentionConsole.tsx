import React, { useState, useEffect, useCallback } from 'react';
import {
  UserGroupIcon,
  PlayIcon,
  PauseIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ArrowPathIcon,
  TrashIcon,
  PencilSquareIcon,
  SparklesIcon,
  SpeakerWaveIcon,
  ArrowUpTrayIcon,
  XMarkIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import {
  MemberRetentionConsoleItem,
  MemberRetentionConsoleOverview,
  MemberRetentionConsoleSpawn
} from '../../types/memberRetentionConsole';
import { memberRetentionConsoleService } from '../../services/memberRetentionConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterMemberRetentionConsole: React.FC = () => {
  const [items, setItems] = useState<MemberRetentionConsoleItem[]>([]);
  const [overview, setOverview] = useState<MemberRetentionConsoleOverview | null>(null);
  const [spawns, setSpawns] = useState<MemberRetentionConsoleSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<MemberRetentionConsoleItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Onboarding Cohorts');
  const [formTarget, setFormTarget] = useState<string>('General Members');
  const [formChurnRisk, setFormChurnRisk] = useState<number>(12.5);
  const [formRetentionRate, setFormRetentionRate] = useState<number>(88.4);
  const [formCohortSize, setFormCohortSize] = useState<number>(50000);
  const [formRewardFic, setFormRewardFic] = useState<number>(100.0);
  const [formVoiceTag, setFormVoiceTag] = useState<AfricanVoiceLine>('blessings');
  const [formNotes, setFormNotes] = useState<string>('');

  // Spawn Form State
  const [spawnTitle, setSpawnTitle] = useState<string>('');
  const [spawnDomain, setSpawnDomain] = useState<string>('member_retention');
  const [spawnBadge, setSpawnBadge] = useState<string>('RETENTION');

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) audioEngine.playVoiceLine(voice);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, itms, sps] = await Promise.all([
        memberRetentionConsoleService.getOverview(),
        memberRetentionConsoleService.getItems(selectedCategory, selectedStatus, searchQuery),
        memberRetentionConsoleService.getSpawns()
      ]);
      setOverview(ov);
      setItems(itms);
      setSpawns(sps);
    } catch (err: any) {
      showToast(err.message || 'Error fetching retention data', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (id: string) => {
    try {
      const updated = await memberRetentionConsoleService.toggleFreeze(id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      showToast(`Cohort #${id} is now ${updated.status.toUpperCase()}`, 'wahala');
      loadData();
    } catch (_err) {
      showToast('Error toggling cohort state', 'wahala');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    try {
      const updatedItems = await memberRetentionConsoleService.reorderItems(items[index].id, items[targetIndex].id);
      setItems(updatedItems);
      showToast('Cohorts reordered successfully', 'gbaski');
    } catch (_err) {
      showToast('Error reordering cohorts', 'wahala');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete ${id}?`)) return;
    try {
      await memberRetentionConsoleService.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      showToast(`Deleted ${id}`, 'madt_o');
      loadData();
    } catch (_err) {
      showToast('Error deleting cohort', 'wahala');
    }
  };

  const handleUploadAsset = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Uploading campaign asset directly to Express backend...', 'blessings');
      const res = await memberRetentionConsoleService.uploadAsset(id, file);
      setItems(prev => prev.map(item => item.id === id ? res.item : item));
      showToast('Asset uploaded successfully!', 'colossal_combo');
    } catch (_err) {
      showToast('Failed to upload asset', 'wahala');
    }
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await memberRetentionConsoleService.createItem({
        name: formName,
        code: formCode,
        category: formCategory,
        cohort_target: formTarget,
        churn_risk_score: Number(formChurnRisk),
        retention_rate_pct: Number(formRetentionRate),
        active_cohort_size: Number(formCohortSize),
        reward_bonus_fic: Number(formRewardFic),
        voice_tag: formVoiceTag,
        notes: formNotes
      });
      setIsAddModalOpen(false);
      showToast('New retention loop provisioned live in database', 'great_combo');
      loadData();
    } catch (_err) {
      showToast('Failed to create retention loop', 'wahala');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    try {
      await memberRetentionConsoleService.updateItem(activeItem.id, {
        name: formName,
        code: formCode,
        category: formCategory,
        cohort_target: formTarget,
        churn_risk_score: Number(formChurnRisk),
        retention_rate_pct: Number(formRetentionRate),
        active_cohort_size: Number(formCohortSize),
        reward_bonus_fic: Number(formRewardFic),
        voice_tag: formVoiceTag,
        notes: formNotes
      });
      setIsEditModalOpen(false);
      showToast(`Cohort ${activeItem.id} updated live`, 'owo_ni_koko');
      loadData();
    } catch (_err) {
      showToast('Failed to update cohort', 'wahala');
    }
  };

  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await memberRetentionConsoleService.spawnConsole({
        console_title: spawnTitle,
        target_domain: spawnDomain,
        route: `/admin/retention-${spawnTitle.toLowerCase().replace(/\s+/g, '-')}`,
        badge_text: spawnBadge
      });
      setIsSpawnModalOpen(false);
      showToast(`Spawned sovereign retention console: ${spawnTitle}`, 'stunning');
      loadData();
    } catch (_err) {
      showToast('Failed to spawn console', 'wahala');
    }
  };

  const openEditModal = (item: MemberRetentionConsoleItem) => {
    setActiveItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormTarget(item.cohort_target || 'General Members');
    setFormChurnRisk(item.churn_risk_score || 12.5);
    setFormRetentionRate(item.retention_rate_pct || 88.4);
    setFormCohortSize(item.active_cohort_size || 50000);
    setFormRewardFic(item.reward_bonus_fic || 100.0);
    setFormVoiceTag(item.voice_tag || 'blessings');
    setFormNotes(item.notes || '');
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3">
          <SparklesIcon className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-300 p-6 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 border border-blue-300 rounded-lg text-blue-950">
              <UserGroupIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Member Retention & Activity Operations Console</h1>
              <p className="text-sm font-medium text-slate-700">Cohort Lifecycle Loops, Churn Predictive Radar, Reactivation Engines & Streak Rewards</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFormName('');
              setFormCode(`COHORT_${Date.now().toString(36).toUpperCase()}`);
              setFormCategory('Onboarding Cohorts');
              setFormTarget('General Members');
              setFormChurnRisk(12.5);
              setFormRetentionRate(88.4);
              setFormCohortSize(50000);
              setFormRewardFic(100.0);
              setFormVoiceTag('blessings');
              setFormNotes('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold text-sm shadow-sm transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Cohort Loop</span>
          </button>

          <button
            onClick={() => {
              setSpawnTitle('');
              setSpawnDomain('member_retention');
              setSpawnBadge('RETENTION');
              setIsSpawnModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-bold text-sm shadow-sm transition"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Spawn Sub-Console</span>
          </button>

          <button
            onClick={() => loadData()}
            className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            title="Refresh"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Retention Loops</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{overview.summary.total_items}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Active Loops</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{overview.summary.active_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Frozen Loops</span>
            <div className="text-2xl font-black text-rose-950 mt-1">{overview.summary.frozen_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Cohort Reach</span>
            <div className="text-2xl font-black text-blue-950 mt-1">{Math.round(Number(overview.summary.total_active_cohorts)).toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Avg Retention Rate</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{Number(overview.summary.avg_retention_rate).toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Reward Pool</span>
            <div className="text-2xl font-black text-purple-950 mt-1">{Math.round(Number(overview.summary.total_reward_pool_fic)).toLocaleString()} FIC</div>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search cohort loops, targets, codes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 w-72"
          />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Categories</option>
            <option value="Onboarding Cohorts">Onboarding Cohorts</option>
            <option value="Engagement Loops">Engagement Loops</option>
            <option value="Loyalty Milestones">Loyalty Milestones</option>
            <option value="Reactivation Engines">Reactivation Engines</option>
            <option value="VIP Concierge">VIP Concierge</option>
            <option value="Gamification Streaks">Gamification Streaks</option>
            <option value="Community Champions">Community Champions</option>
            <option value="Predictive AI">Predictive AI</option>
            <option value="Commerce Retention">Commerce Retention</option>
            <option value="Viral Growth">Viral Growth</option>
          </select>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="frozen">Frozen Only</option>
          </select>
        </div>

        <div className="text-sm font-semibold text-slate-700">
          Showing {items.length} Cohort Loops
        </div>
      </div>

      {/* Cohorts Table */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 font-bold">Loading retention cohorts from database...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-700 font-bold">No cohort loops found matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Loop Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Target Audience / Reach</th>
                  <th className="py-3.5 px-4">Retention / Churn Risk</th>
                  <th className="py-3.5 px-4">Bonus Reward</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    {/* Order & Reordering */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-sm font-bold text-slate-900 w-6">#{item.display_order}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMove(index, 'up')}
                            disabled={index === 0}
                            className={`p-1 rounded hover:bg-slate-200 ${index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700'}`}
                            title="Move Up"
                          >
                            <ArrowUpIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(index, 'down')}
                            disabled={index === items.length - 1}
                            className={`p-1 rounded hover:bg-slate-200 ${index === items.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700'}`}
                            title="Move Down"
                          >
                            <ArrowDownIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-sm text-slate-900">{item.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-800">{item.code}</span>
                        {item.voice_tag && (
                          <button
                            onClick={() => audioEngine.playVoiceLine(item.voice_tag as AfricanVoiceLine)}
                            className="flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950 transition"
                            title="Play Voice Line"
                          >
                            <SpeakerWaveIcon className="w-3.5 h-3.5" />
                            <span>{item.voice_tag}</span>
                          </button>
                        )}
                      </div>
                      {item.notes && <p className="text-xs text-slate-700 mt-1 max-w-xs">{item.notes}</p>}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-200 text-slate-900 border border-slate-300">
                        {item.category}
                      </span>
                    </td>

                    {/* Target / Cohort Reach */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{item.cohort_target || 'General Members'}</div>
                      <div className="text-xs text-slate-700">{Math.round(Number(item.active_cohort_size || 0)).toLocaleString()} Members</div>
                    </td>

                    {/* Retention / Churn Risk */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-emerald-950">{item.retention_rate_pct ?? 88}% Retention</div>
                      <div className="text-xs text-slate-700">{item.churn_risk_score ?? 15}% Churn Risk</div>
                    </td>

                    {/* Reward */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-950 border border-purple-400">
                        <TrophyIcon className="w-3.5 h-3.5 text-purple-800" />
                        <span>{item.reward_bonus_fic ?? 100} FIC</span>
                      </div>
                    </td>

                    {/* Status & Freeze Killswitch */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFreeze(item.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border transition ${
                          item.status === 'active'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                        }`}
                        title="Toggle Freeze Killswitch"
                      >
                        {item.status === 'active' ? (
                          <>
                            <PlayIcon className="w-3.5 h-3.5 text-emerald-800" />
                            <span>ACTIVE</span>
                          </>
                        ) : (
                          <>
                            <PauseIcon className="w-3.5 h-3.5 text-rose-800" />
                            <span>FROZEN</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Direct File Upload */}
                        <label className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer transition" title="Upload Campaign Creative directly to Express backend">
                          <ArrowUpTrayIcon className="w-4 h-4" />
                          <input
                            type="file"
                            className="hidden"
                            onChange={e => handleUploadAsset(item.id, e)}
                          />
                        </label>

                        {/* Edit */}
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                          title="Edit Loop"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg border border-slate-300 text-rose-700 hover:bg-rose-50 transition"
                          title="Delete Loop"
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

      {/* Spawned Consoles Registry */}
      {spawns.length > 0 && (
        <div className="mt-8 bg-white rounded-xl border border-slate-300 p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-blue-500" />
            <span>Spawned Sovereign Sub-Consoles ({spawns.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spawns.map(spawn => (
              <div key={spawn.id} className="p-4 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">{spawn.console_title}</div>
                  <div className="font-mono text-xs text-slate-700">{spawn.route}</div>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-950 border border-blue-300">
                  {spawn.badge_text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Provision Member Retention Loop</h2>
              <button type="button" aria-label="Close" onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Loop Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Loop Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="Onboarding Cohorts">Onboarding Cohorts</option>
                    <option value="Engagement Loops">Engagement Loops</option>
                    <option value="Loyalty Milestones">Loyalty Milestones</option>
                    <option value="Reactivation Engines">Reactivation Engines</option>
                    <option value="VIP Concierge">VIP Concierge</option>
                    <option value="Gamification Streaks">Gamification Streaks</option>
                    <option value="Community Champions">Community Champions</option>
                    <option value="Predictive AI">Predictive AI</option>
                    <option value="Commerce Retention">Commerce Retention</option>
                    <option value="Viral Growth">Viral Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">African Voice Stem</label>
                  <select
                    value={formVoiceTag}
                    onChange={e => setFormVoiceTag(e.target.value as AfricanVoiceLine)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="blessings">blessings</option>
                    <option value="owo_ni_koko">owo_ni_koko</option>
                    <option value="gbaski">gbaski</option>
                    <option value="madt_o">madt_o</option>
                    <option value="sweet">sweet</option>
                    <option value="boom">boom</option>
                    <option value="stunning">stunning</option>
                    <option value="colossal_combo">colossal_combo</option>
                    <option value="great_combo">great_combo</option>
                    <option value="wahala">wahala</option>
                    <option value="see_gobe">see_gobe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={formTarget}
                    onChange={e => setFormTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Target Cohort Size</label>
                  <input
                    type="number"
                    value={formCohortSize}
                    onChange={e => setFormCohortSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Retention Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formRetentionRate}
                    onChange={e => setFormRetentionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Churn Risk (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formChurnRisk}
                    onChange={e => setFormChurnRisk(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Reward (FIC)</label>
                  <input
                    type="number"
                    value={formRewardFic}
                    onChange={e => setFormRewardFic(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Notes / Campaign Strategy</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow"
                >
                  Create Retention Loop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Edit Cohort Loop #{activeItem.id}</h2>
              <button type="button" aria-label="Close" onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Loop Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Loop Code</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="Onboarding Cohorts">Onboarding Cohorts</option>
                    <option value="Engagement Loops">Engagement Loops</option>
                    <option value="Loyalty Milestones">Loyalty Milestones</option>
                    <option value="Reactivation Engines">Reactivation Engines</option>
                    <option value="VIP Concierge">VIP Concierge</option>
                    <option value="Gamification Streaks">Gamification Streaks</option>
                    <option value="Community Champions">Community Champions</option>
                    <option value="Predictive AI">Predictive AI</option>
                    <option value="Commerce Retention">Commerce Retention</option>
                    <option value="Viral Growth">Viral Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">African Voice Stem</label>
                  <select
                    value={formVoiceTag}
                    onChange={e => setFormVoiceTag(e.target.value as AfricanVoiceLine)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="blessings">blessings</option>
                    <option value="owo_ni_koko">owo_ni_koko</option>
                    <option value="gbaski">gbaski</option>
                    <option value="madt_o">madt_o</option>
                    <option value="sweet">sweet</option>
                    <option value="boom">boom</option>
                    <option value="stunning">stunning</option>
                    <option value="colossal_combo">colossal_combo</option>
                    <option value="great_combo">great_combo</option>
                    <option value="wahala">wahala</option>
                    <option value="see_gobe">see_gobe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={formTarget}
                    onChange={e => setFormTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Target Cohort Size</label>
                  <input
                    type="number"
                    value={formCohortSize}
                    onChange={e => setFormCohortSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Retention Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formRetentionRate}
                    onChange={e => setFormRetentionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Churn Risk (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formChurnRisk}
                    onChange={e => setFormChurnRisk(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Reward (FIC)</label>
                  <input
                    type="number"
                    value={formRewardFic}
                    onChange={e => setFormRewardFic(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Notes / Campaign Strategy</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 shadow"
                >
                  Save Changes Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spawn Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900">Spawn Sovereign Retention Console</h2>
              <button type="button" aria-label="Close" onClick={() => setIsSpawnModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSpawnConsole} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Console Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP High-Roller Retention Chamber"
                  value={spawnTitle}
                  onChange={e => setSpawnTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Target Domain</label>
                <input
                  type="text"
                  required
                  value={spawnDomain}
                  onChange={e => setSpawnDomain(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Badge Text</label>
                <input
                  type="text"
                  required
                  value={spawnBadge}
                  onChange={e => setSpawnBadge(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 shadow"
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
