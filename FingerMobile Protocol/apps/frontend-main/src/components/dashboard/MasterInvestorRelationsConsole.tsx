import React, { useState, useEffect, useCallback } from 'react';
import {
  BanknotesIcon,
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
  DocumentTextIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import {
  InvestorRelationsConsoleItem,
  InvestorRelationsConsoleOverview,
  InvestorRelationsConsoleSpawn
} from '../../types/investorRelationsConsole';
import { investorRelationsConsoleService } from '../../services/investorRelationsConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterInvestorRelationsConsole: React.FC = () => {
  const [items, setItems] = useState<InvestorRelationsConsoleItem[]>([]);
  const [overview, setOverview] = useState<InvestorRelationsConsoleOverview | null>(null);
  const [spawns, setSpawns] = useState<InvestorRelationsConsoleSpawn[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<InvestorRelationsConsoleItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState<string>('');
  const [formCode, setFormCode] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Equity Cap Table');
  const [formClass, setFormClass] = useState<string>('Series A Sovereign');
  const [formValuation, setFormValuation] = useState<number>(120000000.0);
  const [formEquityPct, setFormEquityPct] = useState<number>(5.0);
  const [formVestingCliff, setFormVestingCliff] = useState<number>(12);
  const [formTokenGrant, setFormTokenGrant] = useState<number>(10000000.0);
  const [formDividendYield, setFormDividendYield] = useState<number>(14.5);
  const [formVoiceTag, setFormVoiceTag] = useState<AfricanVoiceLine>('colossal_combo');
  const [formNotes, setFormNotes] = useState<string>('');

  // Spawn Form State
  const [spawnTitle, setSpawnTitle] = useState<string>('');
  const [spawnDomain, setSpawnDomain] = useState<string>('investor_relations');
  const [spawnBadge, setSpawnBadge] = useState<string>('INVESTOR');

  const showToast = (msg: string, voice?: AfricanVoiceLine) => {
    setToastMessage(msg);
    if (voice) audioEngine.playVoiceLine(voice);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ov, itms, sps] = await Promise.all([
        investorRelationsConsoleService.getOverview(),
        investorRelationsConsoleService.getItems(selectedCategory, selectedStatus, searchQuery),
        investorRelationsConsoleService.getSpawns()
      ]);
      setOverview(ov);
      setItems(itms);
      setSpawns(sps);
    } catch (err: any) {
      showToast(err.message || 'Error fetching investor relations data', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleFreeze = async (id: string) => {
    try {
      const updated = await investorRelationsConsoleService.toggleFreeze(id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      showToast(`Asset #${id} status changed to ${updated.status.toUpperCase()}`, 'wahala');
      loadData();
    } catch (_err) {
      showToast('Error toggling asset freeze state', 'wahala');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    try {
      const updatedItems = await investorRelationsConsoleService.reorderItems(items[index].id, items[targetIndex].id);
      setItems(updatedItems);
      showToast('Tranches reordered successfully', 'gbaski');
    } catch (_err) {
      showToast('Error reordering tranches', 'wahala');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Are you sure you want to purge asset ${id}?`)) return;
    try {
      await investorRelationsConsoleService.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      showToast(`Purged ${id}`, 'madt_o');
      loadData();
    } catch (_err) {
      showToast('Error purging asset', 'wahala');
    }
  };

  const handleUploadAsset = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showToast('Uploading audited prospectus directly to Express backend...', 'blessings');
      const res = await investorRelationsConsoleService.uploadAsset(id, file);
      setItems(prev => prev.map(item => item.id === id ? res.item : item));
      showToast('Prospectus verified and published live!', 'colossal_combo');
    } catch (_err) {
      showToast('Failed to upload prospectus', 'wahala');
    }
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await investorRelationsConsoleService.createItem({
        name: formName,
        code: formCode,
        category: formCategory,
        investor_class: formClass,
        valuation_cap_usd: Number(formValuation),
        equity_allocated_pct: Number(formEquityPct),
        vesting_cliff_months: Number(formVestingCliff),
        total_token_grant_fic: Number(formTokenGrant),
        dividend_yield_annual: Number(formDividendYield),
        voice_tag: formVoiceTag,
        notes: formNotes
      });
      setIsAddModalOpen(false);
      showToast('New capital tranche registered live in database', 'great_combo');
      loadData();
    } catch (_err) {
      showToast('Failed to create capital tranche', 'wahala');
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItem) return;
    try {
      await investorRelationsConsoleService.updateItem(activeItem.id, {
        name: formName,
        code: formCode,
        category: formCategory,
        investor_class: formClass,
        valuation_cap_usd: Number(formValuation),
        equity_allocated_pct: Number(formEquityPct),
        vesting_cliff_months: Number(formVestingCliff),
        total_token_grant_fic: Number(formTokenGrant),
        dividend_yield_annual: Number(formDividendYield),
        voice_tag: formVoiceTag,
        notes: formNotes
      });
      setIsEditModalOpen(false);
      showToast(`Asset tranche ${activeItem.id} updated live`, 'owo_ni_koko');
      loadData();
    } catch (_err) {
      showToast('Failed to update tranche', 'wahala');
    }
  };

  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await investorRelationsConsoleService.spawnConsole({
        console_title: spawnTitle,
        target_domain: spawnDomain,
        route: `/admin/investor-${spawnTitle.toLowerCase().replace(/\s+/g, '-')}`,
        badge_text: spawnBadge
      });
      setIsSpawnModalOpen(false);
      showToast(`Spawned sovereign capital console: ${spawnTitle}`, 'stunning');
      loadData();
    } catch (_err) {
      showToast('Failed to spawn console', 'wahala');
    }
  };

  const openEditModal = (item: InvestorRelationsConsoleItem) => {
    setActiveItem(item);
    setFormName(item.name);
    setFormCode(item.code);
    setFormCategory(item.category);
    setFormClass(item.investor_class || 'Series A Sovereign');
    setFormValuation(item.valuation_cap_usd || 120000000.0);
    setFormEquityPct(item.equity_allocated_pct || 5.0);
    setFormVestingCliff(item.vesting_cliff_months || 12);
    setFormTokenGrant(item.total_token_grant_fic || 10000000.0);
    setFormDividendYield(item.dividend_yield_annual || 14.5);
    setFormVoiceTag(item.voice_tag || 'colossal_combo');
    setFormNotes(item.notes || '');
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3">
          <SparklesIcon className="w-5 h-5 text-emerald-400" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-300 p-6 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-lg text-emerald-950">
              <BanknotesIcon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Investor Relations & Capitalization Console</h1>
              <p className="text-sm font-medium text-slate-700">Cap Table Management, Series A Preferred Rounds, Sovereign Wealth Allotments & Dividends</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setFormName('');
              setFormCode(`TRANCHE_${Date.now().toString(36).toUpperCase()}`);
              setFormCategory('Equity Cap Table');
              setFormClass('Series A Sovereign');
              setFormValuation(120000000.0);
              setFormEquityPct(5.0);
              setFormVestingCliff(12);
              setFormTokenGrant(10000000.0);
              setFormDividendYield(14.5);
              setFormVoiceTag('colossal_combo');
              setFormNotes('');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-bold text-sm shadow-sm transition"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Capital Tranche</span>
          </button>

          <button
            onClick={() => {
              setSpawnTitle('');
              setSpawnDomain('investor_relations');
              setSpawnBadge('INVESTOR');
              setIsSpawnModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 font-bold text-sm shadow-sm transition"
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
            <span className="text-xs font-bold text-slate-700 uppercase">Capital Tranches</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{overview.summary.total_items}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Active Tranches</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">{overview.summary.active_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Frozen Reserve</span>
            <div className="text-2xl font-black text-rose-950 mt-1">{overview.summary.frozen_count}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Valuation Anchor</span>
            <div className="text-2xl font-black text-emerald-950 mt-1">${(Number(overview.summary.peak_valuation_usd) / 1000000).toFixed(0)}M USD</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Avg Dividend Yield</span>
            <div className="text-2xl font-black text-indigo-950 mt-1">{Number(overview.summary.avg_dividend_yield).toFixed(1)}%</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase">Sub-Consoles</span>
            <div className="text-2xl font-black text-purple-950 mt-1">{overview.totalSpawns}</div>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search capital tranches, investor classes, codes..."
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
            <option value="Equity Cap Table">Equity Cap Table</option>
            <option value="Venture Capital">Venture Capital</option>
            <option value="Sovereign Funds">Sovereign Funds</option>
            <option value="Employee Incentive">Employee Incentive</option>
            <option value="Token Treasury">Token Treasury</option>
            <option value="Dividend Distribution">Dividend Distribution</option>
            <option value="Secondary Trading">Secondary Trading</option>
            <option value="Audit & Compliance">Audit & Compliance</option>
            <option value="Regulatory Filings">Regulatory Filings</option>
            <option value="Capital Preservation">Capital Preservation</option>
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
          Showing {items.length} Capital Tranches
        </div>
      </div>

      {/* Tranches Table */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-700 font-bold">Loading capitalization matrix from database...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-slate-700 font-bold">No tranches found matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-xs font-bold text-slate-800 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Tranche Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Class / Valuation Cap</th>
                  <th className="py-3.5 px-4">Equity % / Cliff</th>
                  <th className="py-3.5 px-4">Tokens / Dividend</th>
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
                            className="flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition"
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

                    {/* Class / Valuation */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{item.investor_class || 'Series A'}</div>
                      <div className="text-xs text-slate-700">${Math.round(Number(item.valuation_cap_usd || 0)).toLocaleString()} USD</div>
                    </td>

                    {/* Equity % / Cliff */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{Number(item.equity_allocated_pct || 0).toFixed(2)}% Equity</div>
                      <div className="text-xs text-slate-700">{item.vesting_cliff_months || 12} mo. cliff</div>
                    </td>

                    {/* Tokens / Dividend */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{Math.round(Number(item.total_token_grant_fic || 0)).toLocaleString()} FIC</div>
                      <div className="text-xs text-emerald-950 font-semibold">{item.dividend_yield_annual ?? 14}% Div Yield</div>
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
                            <span>VESTED</span>
                          </>
                        ) : (
                          <>
                            <PauseIcon className="w-3.5 h-3.5 text-rose-800" />
                            <span>LOCKED</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Direct File Upload */}
                        <label className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer transition" title="Upload Audited Prospectus PDF directly to Express backend">
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
                          title="Edit Tranche"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg border border-slate-300 text-rose-700 hover:bg-rose-50 transition"
                          title="Purge Tranche"
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
            <SparklesIcon className="w-5 h-5 text-emerald-500" />
            <span>Spawned Sovereign Sub-Consoles ({spawns.length})</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {spawns.map(spawn => (
              <div key={spawn.id} className="p-4 rounded-lg border border-slate-300 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-sm text-slate-900">{spawn.console_title}</div>
                  <div className="font-mono text-xs text-slate-700">{spawn.route}</div>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-100 text-emerald-950 border border-emerald-300">
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
              <h2 className="text-lg font-black text-slate-900">Create Capital Tranche</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Tranche Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Tranche Code</label>
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
                    <option value="Equity Cap Table">Equity Cap Table</option>
                    <option value="Venture Capital">Venture Capital</option>
                    <option value="Sovereign Funds">Sovereign Funds</option>
                    <option value="Employee Incentive">Employee Incentive</option>
                    <option value="Token Treasury">Token Treasury</option>
                    <option value="Dividend Distribution">Dividend Distribution</option>
                    <option value="Secondary Trading">Secondary Trading</option>
                    <option value="Audit & Compliance">Audit & Compliance</option>
                    <option value="Regulatory Filings">Regulatory Filings</option>
                    <option value="Capital Preservation">Capital Preservation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">African Voice Stem</label>
                  <select
                    value={formVoiceTag}
                    onChange={e => setFormVoiceTag(e.target.value as AfricanVoiceLine)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="colossal_combo">colossal_combo</option>
                    <option value="owo_ni_koko">owo_ni_koko</option>
                    <option value="blessings">blessings</option>
                    <option value="gbaski">gbaski</option>
                    <option value="madt_o">madt_o</option>
                    <option value="sweet">sweet</option>
                    <option value="boom">boom</option>
                    <option value="stunning">stunning</option>
                    <option value="great_combo">great_combo</option>
                    <option value="wahala">wahala</option>
                    <option value="see_gobe">see_gobe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Investor Class</label>
                  <input
                    type="text"
                    value={formClass}
                    onChange={e => setFormClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Valuation Cap (USD)</label>
                  <input
                    type="number"
                    value={formValuation}
                    onChange={e => setFormValuation(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Equity (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formEquityPct}
                    onChange={e => setFormEquityPct(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Cliff (Months)</label>
                  <input
                    type="number"
                    value={formVestingCliff}
                    onChange={e => setFormVestingCliff(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Dividend Yield (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formDividendYield}
                    onChange={e => setFormDividendYield(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Token Allocation (FIC)</label>
                <input
                  type="number"
                  value={formTokenGrant}
                  onChange={e => setFormTokenGrant(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Notes / Prospectus Summary</label>
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
                  Deploy Tranche Live
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
              <h2 className="text-lg font-black text-slate-900">Edit Tranche #{activeItem.id}</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Tranche Name</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Tranche Code</label>
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
                    <option value="Equity Cap Table">Equity Cap Table</option>
                    <option value="Venture Capital">Venture Capital</option>
                    <option value="Sovereign Funds">Sovereign Funds</option>
                    <option value="Employee Incentive">Employee Incentive</option>
                    <option value="Token Treasury">Token Treasury</option>
                    <option value="Dividend Distribution">Dividend Distribution</option>
                    <option value="Secondary Trading">Secondary Trading</option>
                    <option value="Audit & Compliance">Audit & Compliance</option>
                    <option value="Regulatory Filings">Regulatory Filings</option>
                    <option value="Capital Preservation">Capital Preservation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">African Voice Stem</label>
                  <select
                    value={formVoiceTag}
                    onChange={e => setFormVoiceTag(e.target.value as AfricanVoiceLine)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  >
                    <option value="colossal_combo">colossal_combo</option>
                    <option value="owo_ni_koko">owo_ni_koko</option>
                    <option value="blessings">blessings</option>
                    <option value="gbaski">gbaski</option>
                    <option value="madt_o">madt_o</option>
                    <option value="sweet">sweet</option>
                    <option value="boom">boom</option>
                    <option value="stunning">stunning</option>
                    <option value="great_combo">great_combo</option>
                    <option value="wahala">wahala</option>
                    <option value="see_gobe">see_gobe</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Investor Class</label>
                  <input
                    type="text"
                    value={formClass}
                    onChange={e => setFormClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Valuation Cap (USD)</label>
                  <input
                    type="number"
                    value={formValuation}
                    onChange={e => setFormValuation(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Equity (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formEquityPct}
                    onChange={e => setFormEquityPct(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Cliff (Months)</label>
                  <input
                    type="number"
                    value={formVestingCliff}
                    onChange={e => setFormVestingCliff(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Dividend Yield (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formDividendYield}
                    onChange={e => setFormDividendYield(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Token Allocation (FIC)</label>
                <input
                  type="number"
                  value={formTokenGrant}
                  onChange={e => setFormTokenGrant(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Notes / Prospectus Summary</label>
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
              <h2 className="text-lg font-black text-slate-900">Spawn Sovereign Capital Console</h2>
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
                  placeholder="e.g. Series B Institutional Syndicate Enclave"
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
                  className="px-5 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 shadow"
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
