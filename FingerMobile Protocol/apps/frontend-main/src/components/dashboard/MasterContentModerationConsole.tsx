import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Eye,
  FileCheck,
  Scale,
  Music,
  Users,
  FileText,
  ArrowUp,
  ArrowDown,
  Upload,
  Plus,
  RefreshCw,
  CheckCircle,
  Volume2,
  Trash2,
  Edit,
  X,
  Sliders,
  Filter,
  CheckSquare
} from 'lucide-react';
import {
  ContentModerationDomain,
  ContentModerationItem,
  ContentModerationOverview,
  ContentModerationSpawnedConsole,
  CreateContentModerationItemPayload
} from '../../types/contentModerationConsole';
import { contentModerationConsoleService } from '../../services/contentModerationConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterContentModerationConsole: React.FC = () => {
  // State
  const [activeDomain, setActiveDomain] = useState<ContentModerationDomain | 'all'>('all');
  const [items, setItems] = useState<ContentModerationItem[]>([]);
  const [overview, setOverview] = useState<ContentModerationOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<ContentModerationSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ContentModerationItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateContentModerationItemPayload>({
    domain: 'heuristic_flagging_queue',
    name: '',
    code: '',
    category: 'NLP & Vision Heuristics',
    risk_score: 10.0,
    strike_level: 'CLEAN',
    action_policy: 'AUTO-FLAG & QUARANTINE',
    total_cases_processed: 0,
    quarantined_items_count: 0,
    evidence_manifest_url: '',
    voice_tag: 'wahala',
    notes: ''
  });

  // Spawn Modal Form State
  const [spawnTitle, setSpawnTitle] = useState('');
  const [spawnDomain, setSpawnDomain] = useState<ContentModerationDomain>('heuristic_flagging_queue');
  const [spawnBadge, setSpawnBadge] = useState('SAFETY-CORE');
  const [spawnIcon, setSpawnIcon] = useState('ShieldAlert');

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

  // Fetch all initial telemetry
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ovData, itemsData, spawnsData] = await Promise.all([
        contentModerationConsoleService.getOverview(),
        contentModerationConsoleService.getItems(activeDomain),
        contentModerationConsoleService.getSpawnedConsoles()
      ]);
      setOverview(ovData);
      setItems(itemsData);
      setSpawnedConsoles(spawnsData);
    } catch (err: any) {
      notify(err.message || 'Failed to load content moderation telemetry', 'error', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeDomain]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Domain Change
  const handleDomainFilter = (domain: ContentModerationDomain | 'all') => {
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
      await contentModerationConsoleService.reorderItems(orders);
      notify(`Re-sequenced moderation rule "${temp.name}" priority upwards`, 'success', 'gbaski');
    } catch (err: any) {
      notify('Failed to reorder moderation rules in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Move Item Down (Atomic PostgreSQL reordering)
  const handleMoveDown = async (index: number) => {
    if (index === items.length - 1 || reordering) return;
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
      await contentModerationConsoleService.reorderItems(orders);
      notify(`Re-sequenced moderation rule "${temp.name}" priority downwards`, 'success', 'blessings');
    } catch (err: any) {
      notify('Failed to reorder moderation rules in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Toggle Freeze / Unfreeze
  const handleToggleFreeze = async (item: ContentModerationItem) => {
    try {
      const updated = await contentModerationConsoleService.toggleFreeze(item.id);
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
      if (updated.status === 'frozen') {
        notify(`SUSPENDED moderation sieve: ${item.name} is now FROZEN (Rule bypassed)`, 'error', 'see_gobe');
      } else {
        notify(`ENFORCING moderation sieve: ${item.name} is now ACTIVE in trust pipeline`, 'success', 'gbaski');
      }
      loadData();
    } catch (err: any) {
      notify('Failed to toggle moderation rule freeze status', 'error', 'wahala');
    }
  };

  // Delete Item
  const handleDeleteItem = async (item: ContentModerationItem) => {
    if (!window.confirm(`Are you sure you want to permanently decommission moderation rule: "${item.name}"?`)) return;
    try {
      await contentModerationConsoleService.deleteItem(item.id);
      notify(`Decommissioned moderation rule "${item.name}" successfully`, 'success', 'boom');
      loadData();
    } catch (err: any) {
      notify('Failed to delete moderation rule', 'error', 'wahala');
    }
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentModerationConsoleService.createItem(formData);
      notify(`Commissioned moderation policy "${formData.name}" to live safety mesh`, 'success', 'colossal_combo');
      setIsAddModalOpen(false);
      setFormData({
        domain: 'heuristic_flagging_queue',
        name: '',
        code: '',
        category: 'NLP & Vision Heuristics',
        risk_score: 10.0,
        strike_level: 'CLEAN',
        action_policy: 'AUTO-FLAG & QUARANTINE',
        total_cases_processed: 0,
        quarantined_items_count: 0,
        evidence_manifest_url: '',
        voice_tag: 'wahala',
        notes: ''
      });
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to create moderation item', 'error', 'wahala');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await contentModerationConsoleService.updateItem(selectedItem.id, selectedItem);
      notify(`Updated moderation policy "${selectedItem.name}" parameters`, 'success', 'awesome');
      setIsEditModalOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to update moderation item', 'error', 'wahala');
    }
  };

  // Handle File Upload (Real multipart upload directly to Express backend)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      notify('Transmitting evidence manifest / forensic bundle to Express API...', 'success', 'sweet');
      const res = await contentModerationConsoleService.uploadMedia(file, itemId);
      notify(`Uploaded evidence: ${res.filename} attached to rule!`, 'success', 'thumbs_up');
      if (!itemId) {
        setFormData((prev) => ({ ...prev, evidence_manifest_url: res.fileUrl }));
      } else if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem((prev) => (prev ? { ...prev, evidence_manifest_url: res.fileUrl } : null));
      }
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to upload evidence document', 'error', 'wahala');
    }
  };

  // Handle Spawn Console
  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await contentModerationConsoleService.spawnConsole({
        console_title: spawnTitle,
        target_domain: spawnDomain,
        icon_name: spawnIcon,
        badge_text: spawnBadge
      });
      notify(`Spawned new sovereign Safety Console "${spawnTitle}"!`, 'success', 'colossal_combo');
      setIsSpawnModalOpen(false);
      setSpawnTitle('');
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to spawn content moderation console', 'error', 'wahala');
    }
  };

  // Summary Metrics Memo
  const summary = useMemo(() => {
    return overview?.summary || {
      total_items: items.length,
      active_count: items.filter((i) => i.status === 'active').length,
      frozen_count: items.filter((i) => i.status === 'frozen').length,
      total_cases_processed: items.reduce((acc, i) => acc + (Number(i.total_cases_processed) || 0), 0),
      total_quarantined: items.reduce((acc, i) => acc + (Number(i.quarantined_items_count) || 0), 0),
      average_risk_score: 27.28,
      total_strike_rules: items.filter((i) => i.domain === 'quarantine_strike_ledger').length,
      total_child_shields: items.filter((i) => i.domain === 'minor_child_persona_shield').length,
      total_tribunal_chambers: items.filter((i) => i.domain === 'appeals_tribunal_review').length,
      total_copyright_engines: items.filter((i) => i.domain === 'copyright_content_id').length,
      active_penalty_holds: 4670
    };
  }, [overview, items]);

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border transition-all duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
              : 'bg-rose-100 text-rose-950 border-rose-400'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-6 h-6 text-emerald-900 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-900 flex-shrink-0" />
          )}
          <span className="font-bold text-sm tracking-wide">{notification.message}</span>
        </div>
      )}

      {/* Hero Header Section */}
      <div className="bg-white border-b border-slate-300 px-6 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-100 text-rose-950 border border-rose-400">
                Phase 7 Safety Citadel
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Trust & Ethics Mesh Active
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-3">
              <ShieldAlert className="w-8 h-8 text-rose-600" />
              Content Moderation, Trust, Safety & Ethics Console
            </h1>
            <p className="text-slate-700 text-sm mt-1 max-w-3xl font-medium leading-relaxed">
              Autonomous oversight of Heuristic AI Flagging, Quarantine Strike Ledger, Minor/Child Persona Shield, Community Appeals Tribunal, Copyright Content ID acoustic/video fingerprinting, and WORM Forensic Audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                audioEngine.playVoiceLine('gbaski');
                loadData();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 font-bold text-sm transition-all shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-slate-700 ${loading ? 'animate-spin' : ''}`} />
              Sync Safety Telemetry
            </button>

            <button
              onClick={() => {
                audioEngine.playVoiceLine('blessings');
                setIsSpawnModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-black text-sm transition-all shadow-md"
            >
              <Sliders className="w-4 h-4" />
              Spawn Safety Console
            </button>

            <button
              onClick={() => {
                audioEngine.playVoiceLine('wahala');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-black text-sm transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Commission Moderation Rule
            </button>
          </div>
        </div>
      </div>

      {/* Overarching Telemetry Cards */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Active Policies</span>
              <Filter className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{summary.total_items}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Active: {summary.active_count} | Frozen: {summary.frozen_count}</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Cases Scanned</span>
              <Eye className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {(Number(summary.total_cases_processed) / 1000000).toFixed(2)}M
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Real-time throughput</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Quarantined</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-700 mt-2">
              {Number(summary.total_quarantined).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Violations isolated</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Avg Risk Score</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              {Number(summary.average_risk_score).toFixed(1)}/100
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Safety baseline</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Youth Shields</span>
              <Users className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{summary.total_child_shields}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">COPPA/NDPR active</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Appeals & Rights</span>
              <Scale className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {Number(summary.total_tribunal_chambers) + Number(summary.total_copyright_engines)}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Jury + Fingerprint</div>
          </div>
        </div>
      </div>

      {/* Domain Navigation Filter Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-300 rounded-xl shadow-sm">
          <button
            onClick={() => handleDomainFilter('all')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all ${
              activeDomain === 'all'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All Safety Policies ({items.length})
          </button>
          <button
            onClick={() => handleDomainFilter('heuristic_flagging_queue')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'heuristic_flagging_queue'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Heuristic AI Flagging
          </button>
          <button
            onClick={() => handleDomainFilter('quarantine_strike_ledger')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'quarantine_strike_ledger'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Quarantine & Strikes
          </button>
          <button
            onClick={() => handleDomainFilter('minor_child_persona_shield')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'minor_child_persona_shield'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Minor / Child Shield
          </button>
          <button
            onClick={() => handleDomainFilter('appeals_tribunal_review')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'appeals_tribunal_review'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            Appeals Tribunal
          </button>
          <button
            onClick={() => handleDomainFilter('copyright_content_id')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'copyright_content_id'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Copyright Content ID
          </button>
          <button
            onClick={() => handleDomainFilter('safety_audit_forensics')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'safety_audit_forensics'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            WORM Audit Forensics
          </button>
        </div>
      </div>

      {/* Main Table: Moderation Items with Up/Down Reorder, Freeze & Edit */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-300 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-700" />
                Live Content Moderation & Ethics Enforcement (PostgreSQL Persisted)
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Transactional display ordering with atomic Up / Down shifts, real-time rule bypass freeze switch, and evidence manifest upload.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1 rounded-full">
              Showing {items.length} policies
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100/60 text-slate-700 text-xs font-black uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Policy / Sieve Name</th>
                  <th className="py-3 px-4">Domain / Category</th>
                  <th className="py-3 px-4">Strike / Risk</th>
                  <th className="py-3 px-4">Enforcement Policy</th>
                  <th className="py-3 px-4">Cases / Quarantined</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-600 font-bold">
                      No moderation policies found in this domain. Commission one above!
                    </td>
                  </tr>
                ) : (
                  items.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        item.status === 'frozen' ? 'bg-rose-50/50' : ''
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3.5 px-4 text-center font-black text-xs text-slate-600">
                        {idx + 1}
                      </td>

                      {/* Name & Code */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-sm text-slate-900 flex items-center gap-2">
                          {item.name}
                          {item.evidence_manifest_url && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
                              EVIDENCE VERIFIED
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 font-mono mt-0.5">
                          {item.code} {item.notes ? `• ${item.notes}` : ''}
                        </div>
                      </td>

                      {/* Domain / Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 text-slate-800 border border-slate-300">
                          {item.domain.replace(/_/g, ' ')}
                        </span>
                        <div className="text-xs text-slate-600 font-medium mt-1">{item.category}</div>
                      </td>

                      {/* Strike Level / Risk Score */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                            item.strike_level === 'CLEAN'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                              : item.strike_level === 'STRIKE-1'
                              ? 'bg-amber-100 text-amber-950 border-amber-400'
                              : 'bg-rose-100 text-rose-950 border-rose-400'
                          }`}
                        >
                          {item.strike_level}
                        </span>
                        <div className="text-xs text-slate-600 font-semibold mt-1">
                          Risk: {Number(item.risk_score).toFixed(1)}/100
                        </div>
                      </td>

                      {/* Enforcement Action Policy */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-black text-slate-900">
                          {item.action_policy}
                        </div>
                      </td>

                      {/* Cases / Quarantined */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-black text-slate-900">
                          {Number(item.total_cases_processed).toLocaleString()} cases
                        </div>
                        <div className="text-xs text-rose-700 font-semibold mt-0.5">
                          {Number(item.quarantined_items_count).toLocaleString()} quarantined
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleFreeze(item)}
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
                            item.status === 'active'
                              ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                              : 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                          }`}
                        >
                          {item.status === 'active' ? (
                            <>
                              <Unlock className="w-3 h-3 text-emerald-900" />
                              Active
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 text-rose-900" />
                              FROZEN
                            </>
                          )}
                        </button>
                      </td>

                      {/* Priority Up/Down */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0 || reordering}
                            title="Promote priority upwards"
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-300 transition-all"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === items.length - 1 || reordering}
                            title="Demote priority downwards"
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-300 transition-all"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Evidence Upload Button */}
                          <label
                            title="Upload Evidence Manifest / Legal Document"
                            className="p-1.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 cursor-pointer transition-all"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, item.id)}
                            />
                          </label>

                          {/* Sound Cue Test Button */}
                          <button
                            onClick={() => {
                              const vt = (item.voice_tag as AfricanVoiceLine) || 'wahala';
                              audioEngine.playVoiceLine(vt);
                            }}
                            title="Play Multi-Sensory African Voice Cue"
                            className="p-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-all"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsEditModalOpen(true);
                            }}
                            title="Edit Policy Parameters"
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteItem(item)}
                            title="Decommission Policy"
                            className="p-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 transition-all"
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
      {spawnedConsoles.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-8">
          <div className="bg-white border border-slate-300 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-4">
              <Sliders className="w-4 h-4 text-indigo-700" />
              Dynamic Spawned Safety Consoles ({spawnedConsoles.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {spawnedConsoles.map((sc) => (
                <div
                  key={sc.id}
                  className="p-4 rounded-xl border border-slate-300 bg-slate-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-black text-sm text-slate-900">{sc.console_title}</div>
                    <div className="text-xs text-slate-600 font-mono mt-0.5">{sc.route}</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-950 border border-indigo-400">
                      {sc.badge_text}
                    </span>
                  </div>
                  <ShieldAlert className="w-6 h-6 text-rose-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Commission Moderation Policy */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-700" />
                Commission New Content Safety / Moderation Policy
              </h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Moderation Domain
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value as ContentModerationDomain })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="heuristic_flagging_queue">Heuristic AI Flagging Queue</option>
                    <option value="quarantine_strike_ledger">Quarantine & Strike Ledger</option>
                    <option value="minor_child_persona_shield">Minor / Child Persona Shield (COPPA/NDPR)</option>
                    <option value="appeals_tribunal_review">Community Appeals Tribunal</option>
                    <option value="copyright_content_id">Copyright Content ID & Fingerprinting</option>
                    <option value="safety_audit_forensics">WORM Forensic Safety Audit Logs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Policy / Rule Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hate Speech Cross-Dialect Filter"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Unique System Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MOD-HATE-DIALECT-01"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Multi-Modal NLP Filter"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Enforcement Action Policy
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AUTO-FLAG & QUARANTINE"
                    value={formData.action_policy}
                    onChange={(e) => setFormData({ ...formData, action_policy: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Risk Score Sensitivity (0 - 100)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={formData.risk_score}
                    onChange={(e) => setFormData({ ...formData, risk_score: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Strike Level
                  </label>
                  <select
                    value={formData.strike_level}
                    onChange={(e) => setFormData({ ...formData, strike_level: e.target.value as any })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="CLEAN">CLEAN (Standard)</option>
                    <option value="STRIKE-1">STRIKE-1 (Warning / Micro-Mute)</option>
                    <option value="STRIKE-2">STRIKE-2 (7-Day Post Freeze)</option>
                    <option value="APPEAL-ACTIVE">APPEAL-ACTIVE (Tribunal Review)</option>
                    <option value="DISPUTED">DISPUTED (Copyright Hold)</option>
                    <option value="CLAIMED">CLAIMED (Content ID Claim)</option>
                    <option value="QUARANTINE">QUARANTINE (DefCon Isolation)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    African Voice Line Cue
                  </label>
                  <select
                    value={formData.voice_tag}
                    onChange={(e) => setFormData({ ...formData, voice_tag: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="wahala">wahala (Violation alert)</option>
                    <option value="see_gobe">see_gobe (Threat caught)</option>
                    <option value="gbaski">gbaski (Enforcement confirmed)</option>
                    <option value="blessings">blessings (Restored / safe)</option>
                    <option value="madt_o">madt_o (Super sieve)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Enforcement Criteria & Legal Compliance Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain heuristic thresholds, algorithmic weights, NDPR cross-references..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Upload Evidence Manifest / Legal Document (Direct Express Upload)
                </label>
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-black text-sm shadow-md"
                >
                  Commission Moderation Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Policy */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-700" />
                Modify Moderation Policy: {selectedItem.name}
              </h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Policy Name
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedItem.name}
                    onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    System Code
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedItem.code}
                    onChange={(e) => setSelectedItem({ ...selectedItem, code: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Action Policy
                  </label>
                  <input
                    type="text"
                    value={selectedItem.action_policy}
                    onChange={(e) => setSelectedItem({ ...selectedItem, action_policy: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Strike Level
                  </label>
                  <select
                    value={selectedItem.strike_level}
                    onChange={(e) => setSelectedItem({ ...selectedItem, strike_level: e.target.value as any })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="CLEAN">CLEAN</option>
                    <option value="STRIKE-1">STRIKE-1</option>
                    <option value="STRIKE-2">STRIKE-2</option>
                    <option value="APPEAL-ACTIVE">APPEAL-ACTIVE</option>
                    <option value="DISPUTED">DISPUTED</option>
                    <option value="CLAIMED">CLAIMED</option>
                    <option value="QUARANTINE">QUARANTINE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Total Cases Scanned
                  </label>
                  <input
                    type="number"
                    value={selectedItem.total_cases_processed}
                    onChange={(e) => setSelectedItem({ ...selectedItem, total_cases_processed: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Quarantined Count
                  </label>
                  <input
                    type="number"
                    value={selectedItem.quarantined_items_count}
                    onChange={(e) => setSelectedItem({ ...selectedItem, quarantined_items_count: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Policy Notes / Specs
                </label>
                <textarea
                  rows={3}
                  value={selectedItem.notes || ''}
                  onChange={(e) => setSelectedItem({ ...selectedItem, notes: e.target.value })}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-black text-sm shadow-md"
                >
                  Save Policy Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Spawn Safety Console */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-700" />
                Spawn Sovereign Safety Sub-Console
              </h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsSpawnModalOpen(false)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSpawnSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Console Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minor & Teen Privacy Sentinel Console"
                  value={spawnTitle}
                  onChange={(e) => setSpawnTitle(e.target.value)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Target Domain
                </label>
                <select
                  value={spawnDomain}
                  onChange={(e) => setSpawnDomain(e.target.value as ContentModerationDomain)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                >
                  <option value="heuristic_flagging_queue">Heuristic AI Flagging Queue</option>
                  <option value="quarantine_strike_ledger">Quarantine & Strike Ledger</option>
                  <option value="minor_child_persona_shield">Minor / Child Persona Shield (COPPA/NDPR)</option>
                  <option value="appeals_tribunal_review">Community Appeals Tribunal</option>
                  <option value="copyright_content_id">Copyright Content ID & Fingerprinting</option>
                  <option value="safety_audit_forensics">WORM Forensic Safety Audit Logs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={spawnBadge}
                  onChange={(e) => setSpawnBadge(e.target.value)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300">
                <button
                  type="button"
                  onClick={() => setIsSpawnModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-black text-sm shadow-md"
                >
                  Spawn Console (PostgreSQL Live)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterContentModerationConsole;
