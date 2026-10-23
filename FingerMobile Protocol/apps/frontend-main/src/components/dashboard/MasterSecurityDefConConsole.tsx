import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Server,
  Zap,
  Activity,
  AlertTriangle,
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
  FileText,
  Sliders,
  Radio,
  Eye,
  Database
} from 'lucide-react';
import {
  SecurityDefConDomain,
  SecurityDefConItem,
  SecurityDefConOverview,
  SecurityDefConSpawnedConsole,
  CreateSecurityDefConItemPayload
} from '../../types/securityDefConConsole';
import { securityDefConConsoleService } from '../../services/securityDefConConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterSecurityDefConConsole: React.FC = () => {
  // State
  const [activeDomain, setActiveDomain] = useState<SecurityDefConDomain | 'all'>('all');
  const [items, setItems] = useState<SecurityDefConItem[]>([]);
  const [overview, setOverview] = useState<SecurityDefConOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<SecurityDefConSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SecurityDefConItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateSecurityDefConItemPayload>({
    domain: 'camus_hardware_enclave',
    name: '',
    code: '',
    category: 'Hardware Enclave Node',
    enclave_zone: 'Zone-Alpha (Secure Enclave)',
    threat_severity: 'LOW',
    packets_per_sec: 125000,
    blocked_events: 0,
    security_rating: 100.0,
    enclave_cert_url: '',
    voice_tag: 'gbaski',
    notes: ''
  });

  // Spawn Modal Form State
  const [spawnTitle, setSpawnTitle] = useState('');
  const [spawnDomain, setSpawnDomain] = useState<SecurityDefConDomain>('camus_hardware_enclave');
  const [spawnBadge, setSpawnBadge] = useState('DEFCON-SHIELD');
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

  // Fetch all initial telemetry
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ovData, itemsData, spawnsData] = await Promise.all([
        securityDefConConsoleService.getOverview(),
        securityDefConConsoleService.getItems(activeDomain),
        securityDefConConsoleService.getSpawnedConsoles()
      ]);
      setOverview(ovData);
      setItems(itemsData);
      setSpawnedConsoles(spawnsData);
    } catch (err: any) {
      notify(err.message || 'Failed to load Security & DefCon telemetry', 'error', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeDomain]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Domain Change
  const handleDomainFilter = (domain: SecurityDefConDomain | 'all') => {
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
      await securityDefConConsoleService.reorderItems(orders);
      notify(`Re-sequenced defense node "${temp.name}" priority upwards`, 'success', 'gbaski');
    } catch (err: any) {
      notify('Failed to reorder security defense nodes in PostgreSQL', 'error', 'wahala');
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
      await securityDefConConsoleService.reorderItems(orders);
      notify(`Re-sequenced defense node "${temp.name}" priority downwards`, 'success', 'blessings');
    } catch (err: any) {
      notify('Failed to reorder security defense nodes in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Toggle Freeze / Unfreeze
  const handleToggleFreeze = async (item: SecurityDefConItem) => {
    try {
      const updated = await securityDefConConsoleService.toggleFreeze(item.id);
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
      if (updated.status === 'frozen') {
        notify(`ISOLATED defense node: ${item.name} is now FROZEN in DefCon lockdown`, 'error', 'see_gobe');
      } else {
        notify(`RESTORING defense node: ${item.name} is now ACTIVE in mesh telemetry`, 'success', 'madt_o');
      }
      loadData();
    } catch (err: any) {
      notify('Failed to toggle node freeze status', 'error', 'wahala');
    }
  };

  // Delete Item
  const handleDeleteItem = async (item: SecurityDefConItem) => {
    if (!window.confirm(`Are you sure you want to permanently decommission defense node: "${item.name}"?`)) return;
    try {
      await securityDefConConsoleService.deleteItem(item.id);
      notify(`Decommissioned defense node "${item.name}" successfully`, 'success', 'boom');
      loadData();
    } catch (err: any) {
      notify('Failed to delete security item', 'error', 'wahala');
    }
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await securityDefConConsoleService.createItem(formData);
      notify(`Commissioned security node "${formData.name}" to live DefCon mesh`, 'success', 'colossal_combo');
      setIsAddModalOpen(false);
      setFormData({
        domain: 'camus_hardware_enclave',
        name: '',
        code: '',
        category: 'Hardware Enclave Node',
        enclave_zone: 'Zone-Alpha (Secure Enclave)',
        threat_severity: 'LOW',
        packets_per_sec: 125000,
        blocked_events: 0,
        security_rating: 100.0,
        enclave_cert_url: '',
        voice_tag: 'gbaski',
        notes: ''
      });
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to create security item', 'error', 'wahala');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await securityDefConConsoleService.updateItem(selectedItem.id, selectedItem);
      notify(`Updated security node "${selectedItem.name}" telemetry`, 'success', 'awesome');
      setIsEditModalOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to update security item', 'error', 'wahala');
    }
  };

  // Handle File Upload (Real multipart upload directly to Express backend)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      notify('Transmitting cryptographic certificate/manifest to Express API...', 'success', 'sweet');
      const res = await securityDefConConsoleService.uploadMedia(file, itemId);
      notify(`Uploaded cert: ${res.filename} attached to node!`, 'success', 'thumbs_up');
      if (!itemId) {
        setFormData((prev) => ({ ...prev, enclave_cert_url: res.fileUrl }));
      } else if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem((prev) => (prev ? { ...prev, enclave_cert_url: res.fileUrl } : null));
      }
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to upload certificate', 'error', 'wahala');
    }
  };

  // Handle Spawn Console
  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await securityDefConConsoleService.spawnConsole({
        console_title: spawnTitle,
        target_domain: spawnDomain,
        icon_name: spawnIcon,
        badge_text: spawnBadge
      });
      notify(`Spawned new sovereign Security Console "${spawnTitle}"!`, 'success', 'colossal_combo');
      setIsSpawnModalOpen(false);
      setSpawnTitle('');
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to spawn security console', 'error', 'wahala');
    }
  };

  // Summary Metrics Memo
  const summary = useMemo(() => {
    return overview?.summary || {
      total_items: items.length,
      active_count: items.filter((i) => i.status === 'active').length,
      frozen_count: items.filter((i) => i.status === 'frozen').length,
      total_blocked_events: items.reduce((acc, i) => acc + (Number(i.blocked_events) || 0), 0),
      total_packets_per_sec: items.reduce((acc, i) => acc + (Number(i.packets_per_sec) || 0), 0),
      average_security_rating: 99.99,
      total_enclaves: items.filter((i) => i.domain === 'camus_hardware_enclave').length,
      total_vaults: items.filter((i) => i.domain === 'cryptographic_key_vaults').length,
      total_zk_provers: items.filter((i) => i.domain === 'zk_privacy_audits').length,
      total_ddos_shields: items.filter((i) => i.domain === 'threat_heuristics_ddos').length,
      critical_threat_nodes: items.filter((i) => i.threat_severity === 'CRITICAL' || i.threat_severity === 'DEFCON-1').length
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
                Phase 5 Sovereign Control
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                DefCon-1 Mesh Active
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-rose-600" />
              Security, DefCon Threats & Hardware Enclaves Console
            </h1>
            <p className="text-slate-700 text-sm mt-1 max-w-3xl font-medium leading-relaxed">
              Autonomous oversight of Camus Hardware Enclaves, real-time Threat Heuristics, DDoS Mitigation, Cryptographic Key Vaults, ZK Privacy Provers, and DefCon-1 Containment isolation protocols.
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
              Telemetry Sync
            </button>

            <button
              onClick={() => {
                audioEngine.playVoiceLine('blessings');
                setIsSpawnModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-black text-sm transition-all shadow-md"
            >
              <Sliders className="w-4 h-4" />
              Spawn Security Console
            </button>

            <button
              onClick={() => {
                audioEngine.playVoiceLine('owo_ni_koko');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-black text-sm transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Commission Security Node
            </button>
          </div>
        </div>
      </div>

      {/* Overarching Telemetry Cards */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Total Nodes</span>
              <Shield className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{summary.total_items}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Active: {summary.active_count} | Frozen: {summary.frozen_count}</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Blocked Attacks</span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-black text-rose-700 mt-2">
              {Number(summary.total_blocked_events).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Heuristics filtered</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>DDoS Scrub Rate</span>
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {(Number(summary.total_packets_per_sec) / 1000).toFixed(0)}k pps
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Throughput capacity</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Security Rating</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              {Number(summary.average_security_rating).toFixed(2)}%
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Zero Trust Score</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Camus Enclaves</span>
              <Lock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{summary.total_enclaves}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Hardware isolated</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Key Vaults & ZK</span>
              <Key className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">
              {Number(summary.total_vaults) + Number(summary.total_zk_provers)}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">HSM + SNARK nodes</div>
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
            All Defense Nodes ({items.length})
          </button>
          <button
            onClick={() => handleDomainFilter('camus_hardware_enclave')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'camus_hardware_enclave'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Camus Enclaves
          </button>
          <button
            onClick={() => handleDomainFilter('threat_heuristics_ddos')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'threat_heuristics_ddos'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Threats & DDoS
          </button>
          <button
            onClick={() => handleDomainFilter('cryptographic_key_vaults')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'cryptographic_key_vaults'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Key Vaults & HSM
          </button>
          <button
            onClick={() => handleDomainFilter('zk_privacy_audits')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'zk_privacy_audits'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            ZK Provers & Audits
          </button>
          <button
            onClick={() => handleDomainFilter('zero_trust_access')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'zero_trust_access'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero Trust Access
          </button>
          <button
            onClick={() => handleDomainFilter('incident_containment')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'incident_containment'
                ? 'bg-rose-700 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            DefCon Containment
          </button>
        </div>
      </div>

      {/* Main Table: Security DefCon Nodes with Up/Down Reorder, Freeze & Edit */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-300 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-700" />
                Live Defense Nodes & Hardware Enclaves (PostgreSQL Persisted)
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Transactional display ordering with atomic Up / Down shifts, real-time freeze lockdown killswitch, and direct certificate upload.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-white border border-slate-300 px-3 py-1 rounded-full">
              Showing {items.length} nodes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100/60 text-slate-700 text-xs font-black uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Node / Service Name</th>
                  <th className="py-3 px-4">Domain / Category</th>
                  <th className="py-3 px-4">Zone / Severity</th>
                  <th className="py-3 px-4">Throughput / Blocked</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-600 font-bold">
                      No security defense nodes found in this domain. Commission one above!
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
                          {item.enclave_cert_url && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
                              CERT VERIFIED
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

                      {/* Zone / Threat Severity */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-800">
                          {item.enclave_zone || 'Global Edge'}
                        </div>
                        <span
                          className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase border ${
                            item.threat_severity === 'DEFCON-1' || item.threat_severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-950 border-rose-400'
                              : item.threat_severity === 'HIGH'
                              ? 'bg-amber-100 text-amber-950 border-amber-400'
                              : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                          }`}
                        >
                          {item.threat_severity}
                        </span>
                      </td>

                      {/* Throughput / Blocked */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-black text-slate-900">
                          {Number(item.packets_per_sec).toLocaleString()} pps
                        </div>
                        <div className="text-xs text-rose-700 font-semibold mt-0.5">
                          {Number(item.blocked_events).toLocaleString()} attacks blocked
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-3.5 px-4 font-black text-xs text-emerald-800">
                        {Number(item.security_rating).toFixed(2)}%
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
                          {/* Certificate File Upload Button */}
                          <label
                            title="Upload Enclave Certificate/Manifest"
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
                              const vt = (item.voice_tag as AfricanVoiceLine) || 'gbaski';
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
                            title="Edit Node Parameters"
                            className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDeleteItem(item)}
                            title="Decommission Node"
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
              Dynamic Spawned Security Consoles ({spawnedConsoles.length})
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
                  <ShieldCheck className="w-6 h-6 text-indigo-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Commission Security Node */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-700" />
                Commission New Security / DefCon Node
              </h3>
              <button
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
                    Domain Architecture
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value as SecurityDefConDomain })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="camus_hardware_enclave">Camus Hardware Enclave</option>
                    <option value="threat_heuristics_ddos">Threat Heuristics & DDoS Throttles</option>
                    <option value="cryptographic_key_vaults">Cryptographic Key Vaults & HSM</option>
                    <option value="zk_privacy_audits">ZK Privacy Provers & Audits</option>
                    <option value="zero_trust_access">Zero Trust Access & Citadel</option>
                    <option value="incident_containment">Incident Containment & DefCon Isolation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Node / Module Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Camus Enclave HSM Omega-01"
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
                    placeholder="e.g. CAMUS-HSM-OMEGA-01"
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
                    placeholder="e.g. Hardware Security Module"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Hardware Enclave Zone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Zone-Alpha (Enclave Core)"
                    value={formData.enclave_zone || ''}
                    onChange={(e) => setFormData({ ...formData, enclave_zone: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Threat Severity Threshold
                  </label>
                  <select
                    value={formData.threat_severity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        threat_severity: e.target.value as any
                      })
                    }
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="LOW">LOW (Nominal)</option>
                    <option value="MEDIUM">MEDIUM (Caution)</option>
                    <option value="HIGH">HIGH (Elevated)</option>
                    <option value="CRITICAL">CRITICAL (Active Breach)</option>
                    <option value="DEFCON-1">DEFCON-1 (Total Lockdown)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Packets / Sec Scrutiny Limit
                  </label>
                  <input
                    type="number"
                    value={formData.packets_per_sec}
                    onChange={(e) => setFormData({ ...formData, packets_per_sec: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
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
                    <option value="gbaski">gbaski (Sovereign confirmation)</option>
                    <option value="blessings">blessings (Protection confirmed)</option>
                    <option value="see_gobe">see_gobe (Threat intercepted)</option>
                    <option value="wahala">wahala (Breach alarm)</option>
                    <option value="owo_ni_koko">owo_ni_koko (Vault security)</option>
                    <option value="madt_o">madt_o (Superlative power)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Enclave Manifest / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Security audit notes, cryptographic proof parameters, HSM details..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Upload Hardware Enclave Certificate / Manifest (Direct Express Upload)
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
                  Commission Defense Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Security Node */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-indigo-700" />
                Modify Defense Node: {selectedItem.name}
              </h3>
              <button
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
                    Node Name
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
                    Hardware Enclave Zone
                  </label>
                  <input
                    type="text"
                    value={selectedItem.enclave_zone || ''}
                    onChange={(e) => setSelectedItem({ ...selectedItem, enclave_zone: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Threat Severity
                  </label>
                  <select
                    value={selectedItem.threat_severity}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        threat_severity: e.target.value as any
                      })
                    }
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="LOW">LOW (Nominal)</option>
                    <option value="MEDIUM">MEDIUM (Caution)</option>
                    <option value="HIGH">HIGH (Elevated)</option>
                    <option value="CRITICAL">CRITICAL (Active Breach)</option>
                    <option value="DEFCON-1">DEFCON-1 (Total Lockdown)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Packets / Sec Scrutiny
                  </label>
                  <input
                    type="number"
                    value={selectedItem.packets_per_sec}
                    onChange={(e) => setSelectedItem({ ...selectedItem, packets_per_sec: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Blocked Events Count
                  </label>
                  <input
                    type="number"
                    value={selectedItem.blocked_events}
                    onChange={(e) => setSelectedItem({ ...selectedItem, blocked_events: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Enclave Notes / Specs
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
                  Save Telemetry Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Spawn Security Console */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-700" />
                Spawn Sovereign Security Sub-Console
              </h3>
              <button
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
                  placeholder="e.g. ZK-Snark Audit Sentinel Console"
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
                  onChange={(e) => setSpawnDomain(e.target.value as SecurityDefConDomain)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                >
                  <option value="camus_hardware_enclave">Camus Hardware Enclave</option>
                  <option value="threat_heuristics_ddos">Threat Heuristics & DDoS Throttles</option>
                  <option value="cryptographic_key_vaults">Cryptographic Key Vaults & HSM</option>
                  <option value="zk_privacy_audits">ZK Privacy Provers & Audits</option>
                  <option value="zero_trust_access">Zero Trust Access & Citadel</option>
                  <option value="incident_containment">Incident Containment & DefCon Isolation</option>
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
                  className="px-5 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-black text-sm shadow-md"
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

export default MasterSecurityDefConConsole;
