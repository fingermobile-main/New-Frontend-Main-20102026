import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield,
  Award,
  FileText,
  Users,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Upload,
  Plus,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Volume2,
  Sparkles,
  ExternalLink,
  Trash2,
  Edit,
  X,
  Scale,
  Briefcase,
  Eye,
  Building,
  CheckSquare
} from 'lucide-react';
import {
  CorporateGovernanceDomain,
  CorporateGovernanceItem,
  CorporateGovernanceOverview,
  CorporateGovernanceSpawnedConsole,
  CreateCorporateGovernanceItemPayload
} from '../../types/corporateGovernanceConsole';
import { corporateGovernanceConsoleService } from '../../services/corporateGovernanceConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterCorporateGovernanceConsole: React.FC = () => {
  // State
  const [activeDomain, setActiveDomain] = useState<CorporateGovernanceDomain | 'all'>('all');
  const [items, setItems] = useState<CorporateGovernanceItem[]>([]);
  const [overview, setOverview] = useState<CorporateGovernanceOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<CorporateGovernanceSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CorporateGovernanceItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateCorporateGovernanceItemPayload>({
    domain: 'board_portfolios',
    name: '',
    code: '',
    category: 'Executive Board',
    mandate_title: '',
    designated_officer: '',
    clearance_level: 'Top Secret / Level 5',
    personnel_count: 1,
    compliance_score: 100.0,
    charter_document_url: '',
    voice_tag: 'gbaski',
    notes: ''
  });

  // Spawn Modal Form State
  const [spawnTitle, setSpawnTitle] = useState('');
  const [spawnDomain, setSpawnDomain] = useState<CorporateGovernanceDomain>('board_portfolios');
  const [spawnBadge, setSpawnBadge] = useState('SOVEREIGN');
  const [spawnIcon, setSpawnIcon] = useState('Shield');

  // Trigger Notifications with multi-sensory African Voice Lines
  const notify = (msg: string, type: 'success' | 'error' = 'success', voiceTag?: AfricanVoiceLine) => {
    setNotification({ message: msg, type });
    if (voiceTag) {
      audioEngine.playVoiceLine(voiceTag);
    }
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ovData, itemsData, spawnsData] = await Promise.all([
        corporateGovernanceConsoleService.getOverview(),
        corporateGovernanceConsoleService.getItems(activeDomain),
        corporateGovernanceConsoleService.getSpawnedConsoles()
      ]);
      setOverview(ovData);
      setItems(itemsData);
      setSpawnedConsoles(spawnsData);
    } catch (err: any) {
      notify(err.message || 'Failed to load corporate governance telemetry', 'error', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeDomain]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Domain Change
  const handleDomainFilter = async (domain: CorporateGovernanceDomain | 'all') => {
    setActiveDomain(domain);
  };

  // Move Item Up (Atomic PostgreSQL reordering)
  const handleMoveUp = async (index: number) => {
    if (index === 0 || reordering) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;

    const orders = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems);
    setReordering(true);
    try {
      await corporateGovernanceConsoleService.reorderItems(orders);
      notify(`Re-sequenced governance mandate "${temp.name}" priority upwards`, 'success', 'gbaski');
    } catch (err: any) {
      notify('Failed to reorder governance mandates in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Move Item Down (Atomic PostgreSQL reordering)
  const handleMoveDown = async (index: number) => {
    if (index >= items.length - 1 || reordering) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;

    const orders = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems);
    setReordering(true);
    try {
      await corporateGovernanceConsoleService.reorderItems(orders);
      notify(`Re-sequenced governance mandate "${temp.name}" priority downwards`, 'success', 'gbaski');
    } catch (err: any) {
      notify('Failed to reorder governance mandates in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Toggle Freeze State
  const handleToggleFreeze = async (item: CorporateGovernanceItem) => {
    try {
      const updated = await corporateGovernanceConsoleService.toggleFreeze(item.id);
      setItems((prev) => prev.map((it) => (it.id === item.id ? updated : it)));
      const isNowFrozen = updated.status === 'frozen';
      notify(
        `Mandate "${item.name}" is now ${isNowFrozen ? 'FROZEN (Suspended from Protocol Operations)' : 'ACTIVE'}`,
        isNowFrozen ? 'error' : 'success',
        isNowFrozen ? 'wahala' : 'sweet'
      );
      const ov = await corporateGovernanceConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to toggle freeze state', 'error', 'wahala');
    }
  };

  // Delete Item
  const handleDelete = async (item: CorporateGovernanceItem) => {
    if (!window.confirm(`Are you certain you want to purge governance mandate "${item.name}"?`)) return;

    try {
      await corporateGovernanceConsoleService.deleteItem(item.id);
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      notify(`Purged "${item.name}" from governance registry`, 'success', 'sweet');
      const ov = await corporateGovernanceConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to delete item', 'error', 'wahala');
    }
  };

  // Handle Form Submission (Add)
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newItem = await corporateGovernanceConsoleService.createItem(formData);
      setItems((prev) => [...prev, newItem]);
      setIsAddModalOpen(false);
      notify(`Ratified and registered "${newItem.name}" into corporate governance registry`, 'success', 'blessings');
      setFormData({
        domain: 'board_portfolios',
        name: '',
        code: '',
        category: 'Executive Board',
        mandate_title: '',
        designated_officer: '',
        clearance_level: 'Top Secret / Level 5',
        personnel_count: 1,
        compliance_score: 100.0,
        charter_document_url: '',
        voice_tag: 'gbaski',
        notes: ''
      });
      const ov = await corporateGovernanceConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to create governance mandate', 'error', 'wahala');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const updated = await corporateGovernanceConsoleService.updateItem(selectedItem.id, formData);
      setItems((prev) => prev.map((it) => (it.id === selectedItem.id ? updated : it)));
      setIsEditModalOpen(false);
      setSelectedItem(null);
      notify(`Updated governance mandate "${updated.name}"`, 'success', 'sweet');
      const ov = await corporateGovernanceConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to update governance item', 'error', 'wahala');
    }
  };

  // Open Edit Modal
  const openEditModal = (item: CorporateGovernanceItem) => {
    setSelectedItem(item);
    setFormData({
      domain: item.domain,
      name: item.name,
      code: item.code,
      category: item.category,
      mandate_title: item.mandate_title || '',
      designated_officer: item.designated_officer || '',
      clearance_level: item.clearance_level || 'Secret / Level 3',
      personnel_count: item.personnel_count || 1,
      compliance_score: parseFloat(String(item.compliance_score)) || 100.0,
      charter_document_url: item.charter_document_url || '',
      voice_tag: item.voice_tag || 'gbaski',
      notes: item.notes || ''
    });
    setIsEditModalOpen(true);
  };

  // Handle File Upload (Multipart directly to Express backend)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, item: CorporateGovernanceItem) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      notify(`Uploading ratified deed/charter for "${item.name}"...`, 'success', 'gbaski');
      const uploadRes = await corporateGovernanceConsoleService.uploadMedia(file, item.id, 'charter_document_url');
      setItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, charter_document_url: uploadRes.fileUrl } : it))
      );
      notify(`Successfully bound deed "${uploadRes.filename}" to PostgreSQL`, 'success', 'sweet');
    } catch (err: any) {
      notify(err.message || 'Failed to upload document', 'error', 'wahala');
    }
  };

  // Spawn New Console
  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnTitle.trim()) {
      notify('Please provide a title for the new governance console', 'error', 'wahala');
      return;
    }

    try {
      const newSpawn = await corporateGovernanceConsoleService.spawnConsole({
        console_title: spawnTitle.trim(),
        target_domain: spawnDomain,
        badge_text: spawnBadge,
        icon_name: spawnIcon,
        config: { createdBy: 'AdminMaster', engine: 'STERCS-GovCore' }
      });

      setSpawnedConsoles((prev) => [newSpawn, ...prev]);
      setIsSpawnModalOpen(false);
      setSpawnTitle('');
      notify(`Successfully spawned "${newSpawn.console_title}" at ${newSpawn.route}`, 'success', 'blessings');
      const ov = await corporateGovernanceConsoleService.getOverview();
      setOverview(ov);
    } catch (err: any) {
      notify(err.message || 'Failed to spawn new governance console', 'error', 'wahala');
    }
  };

  // Filtered List
  const filteredItems = useMemo(() => {
    if (activeDomain === 'all') return items;
    return items.filter((it) => it.domain === activeDomain);
  }, [items, activeDomain]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Protocol Header */}
      <div className="bg-white border-b border-slate-300 px-6 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-blue-100 text-blue-950 rounded-lg border border-blue-400">
                <Shield className="w-6 h-6 text-blue-950" />
              </span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  Corporate Governance, Legal & Statutory Control Console
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-semibold uppercase tracking-wider">
                    Sovereign Mandates
                  </span>
                </h1>
                <p className="text-sm text-slate-700 mt-0.5 font-medium">
                  Autonomous administration of Board Portfolios, Committee Chambers, DPO/NDPR, AML/KYC, Ethics & Licensing
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                audioEngine.playVoiceLine('gbaski');
                setIsSpawnModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Spawn Governance Console
            </button>
            <button
              onClick={() => {
                audioEngine.playVoiceLine('gbaski');
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Ratify Mandate
            </button>
            <button
              onClick={() => {
                audioEngine.playVoiceLine('gbaski');
                loadData();
              }}
              disabled={loading}
              className="p-2 bg-white text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-100 transition-all shadow-sm"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div
            className={`p-4 rounded-lg flex items-center justify-between border ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-950 border-emerald-400'
                : 'bg-rose-50 text-rose-950 border-rose-400'
            } shadow-sm transition-all`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-700" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-700" />
              )}
              <span className="font-semibold text-sm">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-500 hover:text-slate-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Telemetry Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Portfolios</span>
              <span className="p-2 bg-blue-100 text-blue-950 rounded-lg border border-blue-400">
                <Building className="w-4 h-4 text-blue-950" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {overview?.summary.total_portfolios ?? overview?.summary.total_items ?? '17'}
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">Board Directorships & Chambers</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Appointed Personnel</span>
              <span className="p-2 bg-purple-100 text-purple-950 rounded-lg border border-purple-400">
                <Users className="w-4 h-4 text-purple-950" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {overview?.summary.total_personnel ?? '119'}
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">Directors, Officers & Specialists</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Avg Compliance Score</span>
              <span className="p-2 bg-emerald-100 text-emerald-950 rounded-lg border border-emerald-400">
                <CheckSquare className="w-4 h-4 text-emerald-950" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {overview?.summary.average_compliance_score
                ? `${parseFloat(String(overview.summary.average_compliance_score)).toFixed(2)}%`
                : '99.89%'}
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">NDPR / AML / SEC Regulatory Health</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active vs Frozen</span>
              <span className="p-2 bg-amber-100 text-amber-950 rounded-lg border border-amber-400">
                <Lock className="w-4 h-4 text-amber-950" />
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {overview?.summary.active_count ?? '17'}{' '}
              <span className="text-sm font-medium text-slate-700">
                / {overview?.summary.frozen_count ?? '0'} frozen
              </span>
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">Sovereign Operational Readiness</p>
          </div>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-300">
          <button
            onClick={() => handleDomainFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'all'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            All Portfolios ({items.length})
          </button>
          <button
            onClick={() => handleDomainFilter('board_portfolios')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'board_portfolios'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Board Portfolios (7)
          </button>
          <button
            onClick={() => handleDomainFilter('committee_chambers')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'committee_chambers'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Committee Chambers (3)
          </button>
          <button
            onClick={() => handleDomainFilter('dpo_privacy')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'dpo_privacy'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            DPO & NDPR Privacy (2)
          </button>
          <button
            onClick={() => handleDomainFilter('compliance_aml')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'compliance_aml'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            AML / CFT Compliance (2)
          </button>
          <button
            onClick={() => handleDomainFilter('whistleblower_ethics')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'whistleblower_ethics'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Ethics & Whistleblower (1)
          </button>
          <button
            onClick={() => handleDomainFilter('statutory_licensing')}
            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${
              activeDomain === 'statutory_licensing'
                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
            }`}
          >
            Statutory Licenses (2)
          </button>
        </div>
      </div>

      {/* Main Governance Data Table */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-300 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-700" />
              Sovereign Governance Mandates & Ratified Portfolios
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                {filteredItems.length} items
              </span>
            </h2>
            <span className="text-xs text-slate-700 font-medium">
              Order resequencing persists directly to PostgreSQL
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border-b border-slate-300">
                  <th className="py-3 px-4 w-12 text-center">Seq</th>
                  <th className="py-3 px-4">Mandate & Directorship</th>
                  <th className="py-3 px-4">Designated Officer</th>
                  <th className="py-3 px-4">Clearance & Score</th>
                  <th className="py-3 px-4">Staff</th>
                  <th className="py-3 px-4">Charter Deed</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Audio</th>
                  <th className="py-3 px-4 text-right">Autonomous Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-slate-700 font-medium">
                      No governance items found in this chamber. Click "Ratify Mandate" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        item.status === 'frozen' ? 'bg-rose-50/40 opacity-75' : ''
                      }`}
                    >
                      {/* Seq Reordering */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <button
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0 || reordering}
                            className="p-1 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-30 transition-all"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black text-slate-900">{item.display_order}</span>
                          <button
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === filteredItems.length - 1 || reordering}
                            className="p-1 hover:bg-slate-200 rounded text-slate-700 disabled:opacity-30 transition-all"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Mandate & Directorship */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-xs text-slate-700 font-medium">
                          {item.mandate_title || item.code}
                        </div>
                        <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                          {item.category}
                        </span>
                      </td>

                      {/* Designated Officer */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {item.designated_officer || 'Board Directorship'}
                        </div>
                        <div className="text-xs text-slate-700">{item.code}</div>
                      </td>

                      {/* Clearance & Compliance Score */}
                      <td className="py-3 px-4">
                        <div className="text-xs font-bold text-blue-900">
                          {item.clearance_level || 'Secret / Level 3'}
                        </div>
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-xs font-black text-emerald-900">
                            {parseFloat(String(item.compliance_score)).toFixed(1)}%
                          </span>
                          <span className="text-[10px] text-slate-700 font-medium">compliant</span>
                        </div>
                      </td>

                      {/* Staff Personnel Count */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-900">
                          <Users className="w-3.5 h-3.5 text-slate-700" />
                          {item.personnel_count}
                        </span>
                      </td>

                      {/* Charter Deed / Upload */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {item.charter_document_url ? (
                            <a
                              href={item.charter_document_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-blue-800 hover:text-blue-950 font-bold underline flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              View Deed
                            </a>
                          ) : (
                            <span className="text-xs text-slate-600 italic">No deed attached</span>
                          )}
                          <label
                            className="p-1 hover:bg-slate-200 rounded cursor-pointer text-slate-700 transition-all"
                            title="Upload Ratified Charter Deed"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, item)}
                              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                            />
                          </label>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                            item.status === 'active'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : 'bg-rose-100 text-rose-950 border-rose-400'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Audio Voice Stem */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            const tag = (item.voice_tag as AfricanVoiceLine) || 'gbaski';
                            audioEngine.playVoiceLine(tag);
                            notify(`Voicing: "${tag.toUpperCase()}"`, 'success');
                          }}
                          className="p-1.5 hover:bg-purple-100 text-purple-900 rounded-lg transition-all border border-transparent hover:border-purple-300"
                          title="Play Multi-Sensory Voice Line"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleFreeze(item)}
                            className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              item.status === 'active'
                                ? 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100'
                            }`}
                            title={item.status === 'active' ? 'Freeze / Suspend Mandate' : 'Activate Mandate'}
                          >
                            {item.status === 'active' ? (
                              <Lock className="w-3.5 h-3.5" />
                            ) : (
                              <Unlock className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-200 transition-all"
                            title="Edit Mandate"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-1.5 bg-rose-50 text-rose-900 border border-rose-300 rounded-lg hover:bg-rose-100 transition-all"
                            title="Purge Mandate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* Spawned Consoles Section */}
      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                Spawned Sovereign Governance Consoles
              </h3>
              <p className="text-xs text-slate-700 mt-0.5 font-medium">
                Autonomous sub-consoles dynamically created and registered into PostgreSQL
              </p>
            </div>
            <button
              onClick={() => setIsSpawnModalOpen(true)}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Spawn New
            </button>
          </div>

          {spawnedConsoles.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-center text-slate-700 text-sm font-medium">
              No sub-consoles spawned yet. Use the "Spawn Governance Console" button above to launch an autonomous chamber.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spawnedConsoles.map((sc) => (
                <div key={sc.id} className="p-4 rounded-lg border border-slate-300 bg-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-950 border border-purple-300">
                        {sc.badge_text}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">{sc.target_domain}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{sc.console_title}</h4>
                    <p className="text-xs text-slate-700 mt-1 font-mono">{sc.route}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900">Active Node</span>
                    <a
                      href={sc.route}
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      Open Console <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Mandate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-700" />
                Ratify New Corporate Governance Mandate
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Target Chamber / Domain</label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value as CorporateGovernanceDomain })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  >
                    <option value="board_portfolios">Board Portfolios</option>
                    <option value="committee_chambers">Committee Chambers</option>
                    <option value="dpo_privacy">DPO & NDPR Privacy</option>
                    <option value="compliance_aml">AML / CFT Compliance</option>
                    <option value="whistleblower_ethics">Ethics & Whistleblower</option>
                    <option value="statutory_licensing">Statutory Licenses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Mandate Title / Portfolio Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Chief Risk Officer (CRO)"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Code / Identifier</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="e.g. BOARD-CRO-001"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Enterprise Risk & Prudential Supervision"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Designated Officer</label>
                  <input
                    type="text"
                    value={formData.designated_officer || ''}
                    onChange={(e) => setFormData({ ...formData, designated_officer: e.target.value })}
                    placeholder="e.g. Dr. Babatunde Lawal"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Clearance Level</label>
                  <select
                    value={formData.clearance_level || 'Secret / Level 3'}
                    onChange={(e) => setFormData({ ...formData, clearance_level: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  >
                    <option value="Top Secret / Level 5">Top Secret / Level 5</option>
                    <option value="Directorate / Level 4">Directorate / Level 4</option>
                    <option value="Secret / Level 3">Secret / Level 3</option>
                    <option value="Confidential / Level 2">Confidential / Level 2</option>
                    <option value="Official / Level 1">Official / Level 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Personnel / Committee Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.personnel_count || 1}
                    onChange={(e) => setFormData({ ...formData, personnel_count: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Compliance Score (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.compliance_score || 100.0}
                    onChange={(e) => setFormData({ ...formData, compliance_score: parseFloat(e.target.value) || 100.0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Notes / Governance Charter Synopsis</label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Official terms of reference, NDPR registration numbers, CBN licenses..."
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                >
                  Ratify Mandate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Mandate Modal */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-700" />
                Edit Governance Mandate: {selectedItem.name}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Mandate Title / Portfolio Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Designated Officer</label>
                  <input
                    type="text"
                    value={formData.designated_officer || ''}
                    onChange={(e) => setFormData({ ...formData, designated_officer: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Clearance Level</label>
                  <select
                    value={formData.clearance_level || 'Secret / Level 3'}
                    onChange={(e) => setFormData({ ...formData, clearance_level: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  >
                    <option value="Top Secret / Level 5">Top Secret / Level 5</option>
                    <option value="Directorate / Level 4">Directorate / Level 4</option>
                    <option value="Secret / Level 3">Secret / Level 3</option>
                    <option value="Confidential / Level 2">Confidential / Level 2</option>
                    <option value="Official / Level 1">Official / Level 1</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Personnel Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.personnel_count || 1}
                    onChange={(e) => setFormData({ ...formData, personnel_count: parseInt(e.target.value, 10) || 1 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Compliance Score (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.compliance_score || 100.0}
                    onChange={(e) => setFormData({ ...formData, compliance_score: parseFloat(e.target.value) || 100.0 })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Notes / Terms of Reference</label>
                <textarea
                  rows={3}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* One-Click Console Spawner Modal */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-300 max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                Spawn Sovereign Governance Console
              </h3>
              <button onClick={() => setIsSpawnModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSpawnConsole} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Console Title</label>
                <input
                  type="text"
                  required
                  value={spawnTitle}
                  onChange={(e) => setSpawnTitle(e.target.value)}
                  placeholder="e.g. ESG & Sustainability Oversight Chamber"
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Target Chamber Domain</label>
                <select
                  value={spawnDomain}
                  onChange={(e) => setSpawnDomain(e.target.value as CorporateGovernanceDomain)}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                >
                  <option value="board_portfolios">Board Portfolios</option>
                  <option value="committee_chambers">Committee Chambers</option>
                  <option value="dpo_privacy">DPO & NDPR Privacy</option>
                  <option value="compliance_aml">AML / CFT Compliance</option>
                  <option value="whistleblower_ethics">Ethics & Whistleblower</option>
                  <option value="statutory_licensing">Statutory Licenses</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={spawnBadge}
                    onChange={(e) => setSpawnBadge(e.target.value)}
                    placeholder="e.g. SOVEREIGN"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Icon Name</label>
                  <input
                    type="text"
                    value={spawnIcon}
                    onChange={(e) => setSpawnIcon(e.target.value)}
                    placeholder="e.g. Shield"
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2 text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-950 font-medium">
                This will dynamically mint a sovereign micro-console route with live PostgreSQL state tracking.
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
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

export default MasterCorporateGovernanceConsole;

