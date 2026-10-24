import React, { useState, useEffect, useCallback } from 'react';
import {
  MegaphoneIcon,
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
  CurrencyDollarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import {
  MarketingCampaignConsoleItem,
  MarketingCampaignConsoleOverview,
  MarketingCampaignConsoleSpawn
} from '../../types/marketingCampaignConsole';
import { marketingCampaignConsoleService } from '../../services/marketingCampaignConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterMarketingCampaignConsole: React.FC = () => {
  const [items, setItems] = useState<MarketingCampaignConsoleItem[]>([]);
  const [overview, setOverview] = useState<MarketingCampaignConsoleOverview | null>(null);
  const [spawns, setSpawns] = useState<MarketingCampaignConsoleSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<MarketingCampaignConsoleItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('In-Feed Native Ads');
  const [formChannel, setFormChannel] = useState<string>('AfriAds In-Feed Native');
  const [formBudgetAllocated, setFormBudgetAllocated] = useState<number>(50000.0);
  const [formBudgetSpent, setFormBudgetSpent] = useState<number>(0.0);
  const [formImpressions, setFormImpressions] = useState<number>(0);
  const [formCpcBid, setFormCpcBid] = useState<number>(0.045);
  const [formRoiMultiple, setFormRoiMultiple] = useState<number>(4.8);
  const [formVoiceTag, setFormVoiceTag] = useState<AfricanVoiceLine>('owo_ni_koko');
  const [formNotes, setFormNotes] = useState<string>('');

  // Spawn Form State
  const [spawnTitle, setSpawnTitle] = useState<string>('');
  const [spawnDomain, setSpawnDomain] = useState<string>('marketing_campaign');
  const [spawnBadge, setSpawnBadge] = useState<string>('MARKETING');

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) audioEngine.playVoiceLine(voice);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, itms, sps] = await Promise.all([
        marketingCampaignConsoleService.getOverview(),
        marketingCampaignConsoleService.getItems(selectedCategory, selectedStatus, searchQuery),
        marketingCampaignConsoleService.getSpawns()
      ]);
      setOverview(ov);
      setItems(itms);
      setSpawns(sps);
    } catch (err: any) {
      showToast(err.message || 'Error fetching marketing data', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (id: string) => {
    try {
      const updated = await marketingCampaignConsoleService.toggleFreeze(id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      showToast(`Campaign #${id} is now ${updated.status.toUpperCase()}`, 'wahala');
      loadData();
    } catch (_err) {
      showToast('Error toggling campaign state', 'wahala');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    try {
      const updatedItems = await marketingCampaignConsoleService.reorderItems(items[index].id, items[targetIndex].id);
      setItems(updatedItems);
      showToast('Campaigns reordered successfully', 'gbaski');
    } catch (_err) {
      showToast('Error reordering campaigns', 'wahala');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to delete ${id}?`)) return;
    try {
      await marketingCampaignConsoleService.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      showToast(`Deleted ${id}`, 'madt_o');
      loadData();
    } catch (_err) {
      showToast('Error deleting campaign', 'wahala');
    }
  };

  const handleUploadAsset = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Uploading banner creative directly to Express backend...', 'blessings');
      const res = await marketingCampaignConsoleService.uploadAsset(id, file);
      setItems(prev => prev.map(item => item.id === id ? res.item : item));
      showToast('Creative uploaded successfully!', 'colossal_combo');
    } catch (_err) {
      showToast('Failed to upload creative', 'wahala');
    }
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await marketingCampaignConsoleService.createItem({
        name: formName,
        code: formCode,
        category: formCategory,
        campaign_channel: formChannel,
        budget_allocated_fic: Number(formBudgetAllocated),
        budget_spent_fic: Number(formBudgetSpent),
        impressions_delivered: Number(formImpressions),
        cpc_bid_fic: Number(formCpcBid),
        roi_multiple: Number(formRoiMultiple),
        voice_tag: formVoiceTag,
        notes: formNotes
      });
      setIsAddModalOpen(false);
      showToast('New marketing campaign deployed live', 'great_combo');
      loadData();
    } catch (_err) {
      showToast('Failed to create campaign', 'wahala');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    try {
      await marketingCampaignConsoleService.updateItem(activeItem.id, {
        name: formName,
        code: formCode,
        category: formCategory,
        campaign_channel: formChannel,
        budget_allocated_fic: Number(formBudgetAllocated),
        budget_spent_fic: Number(formBudgetSpent),
        impressions_delivered: Number(formImpressions),
        cpc_bid_fic: Number(formCpcBid),
        roi_multiple: Number(formRoiMultiple),
        voice_tag: formVoiceTag,
        notes: formNotes
      });
      setIsEditModalOpen(false);
      showToast(`Campaign ${activeItem.id} updated live`, 'owo_ni_koko');
      loadData();
    } catch (_err) {
      showToast('Failed to update campaign', 'wahala');
    }
  };

  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await marketingCampaignConsoleService.spawnConsole({
        console_title: spawnTitle,
        target_domain: spawnDomain,
        route: `/admin/marketing-${spawnTitle.toLowerCase().replace(/\s+/g, '-')}`,
        badge_text: spawnBadge
      });
      setIsSpawnModalOpen(false);
      showToast(`Spawned sovereign marketing console: ${spawnTitle}`, 'stunning');
      loadData();
    } catch (_err) {
      showToast('Failed to spawn console', 'wahala');
    }
  };

  const openEditModal = (item: MarketingCampaignConsoleItem) => {
    setActiveItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormChannel(item.campaign_channel || 'AfriAds In-Feed Native');
    setFormBudgetAllocated(item.budget_allocated_fic || 50000.0);
    setFormBudgetSpent(item.budget_spent_fic || 0.0);
    setFormImpressions(item.impressions_delivered || 0);
    setFormCpcBid(item.cpc_bid_fic || 0.045);
    setFormRoiMultiple(item.roi_multiple || 4.8);
    setFormVoiceTag(item.voice_tag || 'owo_ni_koko');
    setFormNotes(item.notes || '');
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3">
          <SparklesIcon className="w-5 h-5 text-rose-400" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-300 p-6 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-lg text-rose-950">
              <MegaphoneIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Marketing, Ads & Campaign Engine Console</h1>
              <p className="text-sm font-medium text-slate-700">AfriAds Multi-Channel DSP, Real-Time Bid Ceilings, Promo Rails & Sponsored Placements</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFormName('');
              setFormCode(`ADS_${Date.now().toString(36).toUpperCase()}`);
              setFormCategory('In-Feed Native Ads');
              setFormChannel('AfriAds In-Feed Native');
              setFormBudgetAllocated(50000.0);
              setFormBudgetSpent(0.0);
              setFormImpressions(0);
              setFormCpcBid(0.045);
              setFormRoiMultiple(4.8);
              setFormVoiceTag('owo_ni_koko');
              setFormNotes('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold text-sm shadow-sm transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Deploy Campaign</span>
          </button>

          <button
            onClick={() => {
              setSpawnTitle('');
              setSpawnDomain('marketing_campaign');
              setSpawnBadge('MARKETING');
              setIsSpawnModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-500 font-bold text-sm shadow-sm transition"
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
            <span className="text-xs font-bold text-slate-700 uppercase">Total Campaigns</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{overview.summary.total_items}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Active Campaigns</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{overview.summary.active_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Frozen Campaigns</span>
            <div className="text-2xl font-black text-rose-950 mt-1">{overview.summary.frozen_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Allocated Budget</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{Math.round(Number(overview.summary.total_budget_allocated)).toLocaleString()} FIC</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Total Impressions</span>
            <div className="text-2xl font-black text-indigo-950 mt-1">{Math.round(Number(overview.summary.total_impressions)).toLocaleString()}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Avg ROI Multiple</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{Number(overview.summary.avg_roi_multiple).toFixed(1)}x</div>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search campaigns, channels, codes..."
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
            <option value="In-Feed Native Ads">In-Feed Native Ads</option>
            <option value="Audio Ad Network">Audio Ad Network</option>
            <option value="Video Ad Network">Video Ad Network</option>
            <option value="Discount & Promo Codes">Discount & Promo Codes</option>
            <option value="Sponsored Placements">Sponsored Placements</option>
            <option value="Gaming Sponsorships">Gaming Sponsorships</option>
            <option value="Geo-Targeted Campaigns">Geo-Targeted Campaigns</option>
            <option value="Affiliate Networks">Affiliate Networks</option>
            <option value="Retargeting Engines">Retargeting Engines</option>
            <option value="Ad Auction Systems">Ad Auction Systems</option>
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
          Showing {items.length} Campaigns
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 font-bold">Loading marketing campaigns from database...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-700 font-bold">No campaigns found matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Campaign Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Channel / Impressions</th>
                  <th className="py-3.5 px-4">Budget / Spent</th>
                  <th className="py-3.5 px-4">CPC / ROI</th>
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
                            className="flex items-center gap-1 text-xs font-bold text-rose-800 hover:text-rose-950 transition"
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

                    {/* Channel / Impressions */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{item.campaign_channel || 'AfriAds In-Feed Native'}</div>
                      <div className="text-xs text-slate-700">{Math.round(Number(item.impressions_delivered || 0)).toLocaleString()} Impressions</div>
                    </td>

                    {/* Budget / Spent */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{Math.round(Number(item.budget_allocated_fic || 0)).toLocaleString()} FIC Alloc</div>
                      <div className="text-xs text-slate-700">{Math.round(Number(item.budget_spent_fic || 0)).toLocaleString()} FIC Spent</div>
                    </td>

                    {/* CPC / ROI */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-emerald-950">{item.roi_multiple ?? 4.8}x ROI</div>
                      <div className="text-xs text-slate-700">{item.cpc_bid_fic ?? 0.045} FIC / Click</div>
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
                            <span>LIVE</span>
                          </>
                        ) : (
                          <>
                            <PauseIcon className="w-3.5 h-3.5 text-rose-800" />
                            <span>PAUSED</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Direct File Upload */}
                        <label className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer transition" title="Upload Creative Banner directly to Express backend">
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
                          title="Edit Campaign"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg border border-slate-300 text-rose-700 hover:bg-rose-50 transition"
                          title="Delete Campaign"
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
            <SparklesIcon className="w-5 h-5 text-rose-500" />
            <span>Spawned Sovereign Sub-Consoles ({spawns.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spawns.map(spawn => (
              <div key={spawn.id} className="p-4 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">{spawn.console_title}</div>
                  <div className="font-mono text-xs text-slate-700">{spawn.route}</div>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-rose-100 text-rose-950 border border-rose-300">
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
              <h2 className="text-lg font-black text-slate-900">Deploy Marketing Campaign</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Campaign Code</label>
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
                    <option value="In-Feed Native Ads">In-Feed Native Ads</option>
                    <option value="Audio Ad Network">Audio Ad Network</option>
                    <option value="Video Ad Network">Video Ad Network</option>
                    <option value="Discount & Promo Codes">Discount & Promo Codes</option>
                    <option value="Sponsored Placements">Sponsored Placements</option>
                    <option value="Gaming Sponsorships">Gaming Sponsorships</option>
                    <option value="Geo-Targeted Campaigns">Geo-Targeted Campaigns</option>
                    <option value="Affiliate Networks">Affiliate Networks</option>
                    <option value="Retargeting Engines">Retargeting Engines</option>
                    <option value="Ad Auction Systems">Ad Auction Systems</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">African Voice Stem</label>
                  <select
                    value={formVoiceTag}
                    onChange={e => setFormVoiceTag(e.target.value as AfricanVoiceLine)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="owo_ni_koko">owo_ni_koko</option>
                    <option value="blessings">blessings</option>
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
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Channel</label>
                  <input
                    type="text"
                    value={formChannel}
                    onChange={e => setFormChannel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Allocated Budget (FIC)</label>
                  <input
                    type="number"
                    value={formBudgetAllocated}
                    onChange={e => setFormBudgetAllocated(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Max CPC Bid (FIC)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formCpcBid}
                    onChange={e => setFormCpcBid(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Projected ROI Multiple</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formRoiMultiple}
                    onChange={e => setFormRoiMultiple(Number(e.target.value))}
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
                  Deploy Campaign Live
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
              <h2 className="text-lg font-black text-slate-900">Edit Campaign #{activeItem.id}</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Campaign Code</label>
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
                    <option value="In-Feed Native Ads">In-Feed Native Ads</option>
                    <option value="Audio Ad Network">Audio Ad Network</option>
                    <option value="Video Ad Network">Video Ad Network</option>
                    <option value="Discount & Promo Codes">Discount & Promo Codes</option>
                    <option value="Sponsored Placements">Sponsored Placements</option>
                    <option value="Gaming Sponsorships">Gaming Sponsorships</option>
                    <option value="Geo-Targeted Campaigns">Geo-Targeted Campaigns</option>
                    <option value="Affiliate Networks">Affiliate Networks</option>
                    <option value="Retargeting Engines">Retargeting Engines</option>
                    <option value="Ad Auction Systems">Ad Auction Systems</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">African Voice Stem</label>
                  <select
                    value={formVoiceTag}
                    onChange={e => setFormVoiceTag(e.target.value as AfricanVoiceLine)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="owo_ni_koko">owo_ni_koko</option>
                    <option value="blessings">blessings</option>
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
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Channel</label>
                  <input
                    type="text"
                    value={formChannel}
                    onChange={e => setFormChannel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Allocated Budget (FIC)</label>
                  <input
                    type="number"
                    value={formBudgetAllocated}
                    onChange={e => setFormBudgetAllocated(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Max CPC Bid (FIC)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={formCpcBid}
                    onChange={e => setFormCpcBid(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Projected ROI Multiple</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formRoiMultiple}
                    onChange={e => setFormRoiMultiple(Number(e.target.value))}
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
              <h2 className="text-lg font-black text-slate-900">Spawn Sovereign Marketing Console</h2>
              <button onClick={() => setIsSpawnModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSpawnConsole} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Console Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Programmatic Audio DSP Console"
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
                  className="px-5 py-2 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-500 shadow"
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
