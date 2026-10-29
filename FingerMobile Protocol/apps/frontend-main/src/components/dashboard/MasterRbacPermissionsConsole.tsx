import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Users,
  Shield,
  Key,
  Building,
  Award,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Upload,
  Plus,
  RefreshCw,
  Volume2,
  Trash2,
  Edit,
  X,
  FileText,
  Sliders,
  Layers,
  Fingerprint
} from 'lucide-react';
import {
  RbacPermissionsDomain,
  RbacPermissionsItem,
  RbacPermissionsOverview,
  RbacPermissionsSpawnedConsole,
  CreateRbacPermissionsItemPayload
} from '../../types/rbacPermissionsConsole';
import { rbacPermissionsConsoleService } from '../../services/rbacPermissionsConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';

export const MasterRbacPermissionsConsole: React.FC = () => {
  // State
  const [activeDomain, setActiveDomain] = useState<RbacPermissionsDomain | 'all'>('all');
  const [items, setItems] = useState<RbacPermissionsItem[]>([]);
  const [overview, setOverview] = useState<RbacPermissionsOverview | null>(null);
  const [spawnedConsoles, setSpawnedConsoles] = useState<RbacPermissionsSpawnedConsole[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reordering, setReordering] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isSpawnModalOpen, setIsSpawnModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<RbacPermissionsItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateRbacPermissionsItemPayload>({
    domain: 'sovereign_rbac_matrix',
    name: '',
    code: '',
    category: 'System Roles',
    role_tier: 'Operations Lead',
    permission_level: 'READ_WRITE_DISBURSE',
    assigned_members_count: 1,
    route_scope: '/admin/*',
    credential_cert_url: '',
    voice_tag: 'gbaski',
    notes: ''
  });

  // Spawn Modal Form State
  const [spawnTitle, setSpawnTitle] = useState('');
  const [spawnDomain, setSpawnDomain] = useState<RbacPermissionsDomain>('sovereign_rbac_matrix');
  const [spawnBadge, setSpawnBadge] = useState('RBAC-CITADEL');
  const [spawnIcon, setSpawnIcon] = useState('Users');

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
        rbacPermissionsConsoleService.getOverview(),
        rbacPermissionsConsoleService.getItems(activeDomain),
        rbacPermissionsConsoleService.getSpawnedConsoles()
      ]);
      setOverview(ovData);
      setItems(itemsData);
      setSpawnedConsoles(spawnsData);
    } catch (err: any) {
      notify(err.message || 'Failed to load RBAC permissions telemetry', 'error', 'wahala');
    } finally {
      setLoading(false);
    }
  }, [activeDomain]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Domain Change
  const handleDomainFilter = (domain: RbacPermissionsDomain | 'all') => {
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
      await rbacPermissionsConsoleService.reorderItems(orders);
      notify(`Re-sequenced RBAC rule "${temp.name}" priority upwards`, 'success', 'gbaski');
    } catch (err: any) {
      notify('Failed to reorder RBAC permission items in PostgreSQL', 'error', 'wahala');
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
      await rbacPermissionsConsoleService.reorderItems(orders);
      notify(`Re-sequenced RBAC rule "${temp.name}" priority downwards`, 'success', 'blessings');
    } catch (err: any) {
      notify('Failed to reorder RBAC permission items in PostgreSQL', 'error', 'wahala');
      loadData();
    } finally {
      setReordering(false);
    }
  };

  // Toggle Freeze / Unfreeze
  const handleToggleFreeze = async (item: RbacPermissionsItem) => {
    try {
      const updated = await rbacPermissionsConsoleService.toggleFreeze(item.id);
      setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
      if (updated.status === 'frozen') {
        notify(`LOCKED DOWN permission rule: ${item.name} is now FROZEN (Access revoked)`, 'error', 'see_gobe');
      } else {
        notify(`AUTHORIZED permission rule: ${item.name} is now ACTIVE in citadel mesh`, 'success', 'madt_o');
      }
      loadData();
    } catch (err: any) {
      notify('Failed to toggle RBAC permission freeze status', 'error', 'wahala');
    }
  };

  // Delete Item
  const handleDeleteItem = async (item: RbacPermissionsItem) => {
    if (!window.confirm(`Are you sure you want to permanently decommission RBAC rule: "${item.name}"?`)) return;
    try {
      await rbacPermissionsConsoleService.deleteItem(item.id);
      notify(`Decommissioned RBAC rule "${item.name}" successfully`, 'success', 'boom');
      loadData();
    } catch (err: any) {
      notify('Failed to delete RBAC permission item', 'error', 'wahala');
    }
  };

  // Handle Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await rbacPermissionsConsoleService.createItem(formData);
      notify(`Commissioned RBAC permission rule "${formData.name}" to live citadel`, 'success', 'colossal_combo');
      setIsAddModalOpen(false);
      setFormData({
        domain: 'sovereign_rbac_matrix',
        name: '',
        code: '',
        category: 'System Roles',
        role_tier: 'Operations Lead',
        permission_level: 'READ_WRITE_DISBURSE',
        assigned_members_count: 1,
        route_scope: '/admin/*',
        credential_cert_url: '',
        voice_tag: 'gbaski',
        notes: ''
      });
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to create RBAC permission item', 'error', 'wahala');
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    try {
      await rbacPermissionsConsoleService.updateItem(selectedItem.id, selectedItem);
      notify(`Updated RBAC rule "${selectedItem.name}" parameters`, 'success', 'awesome');
      setIsEditModalOpen(false);
      setSelectedItem(null);
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to update RBAC permission item', 'error', 'wahala');
    }
  };

  // Handle File Upload (Real multipart upload directly to Express backend)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      notify('Transmitting credential cert / corporate manifest to Express API...', 'success', 'sweet');
      const res = await rbacPermissionsConsoleService.uploadMedia(file, itemId);
      notify(`Uploaded credential: ${res.filename} attached to rule!`, 'success', 'thumbs_up');
      if (!itemId) {
        setFormData((prev) => ({ ...prev, credential_cert_url: res.fileUrl }));
      } else if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem((prev) => (prev ? { ...prev, credential_cert_url: res.fileUrl } : null));
      }
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to upload credential document', 'error', 'wahala');
    }
  };

  // Handle Spawn Console
  const handleSpawnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await rbacPermissionsConsoleService.spawnConsole({
        console_title: spawnTitle,
        target_domain: spawnDomain,
        icon_name: spawnIcon,
        badge_text: spawnBadge
      });
      notify(`Spawned new sovereign RBAC Console "${spawnTitle}"!`, 'success', 'colossal_combo');
      setIsSpawnModalOpen(false);
      setSpawnTitle('');
      loadData();
    } catch (err: any) {
      notify(err.message || 'Failed to spawn RBAC console', 'error', 'wahala');
    }
  };

  // Summary Metrics Memo
  const summary = useMemo(() => {
    return overview?.summary || {
      total_items: items.length,
      active_count: items.filter((i) => i.status === 'active').length,
      frozen_count: items.filter((i) => i.status === 'frozen').length,
      total_assigned_members: items.reduce((acc, i) => acc + (Number(i.assigned_members_count) || 0), 0),
      total_roles: items.filter((i) => i.domain === 'sovereign_rbac_matrix').length,
      total_route_gates: items.filter((i) => i.domain === 'pages_permission_gates').length,
      total_merchant_citadels: items.filter((i) => i.domain === 'merchant_organization_kyc').length,
      total_dignitaries: items.filter((i) => i.domain === 'council_dignitaries_ledger').length,
      total_session_rules: items.filter((i) => i.domain === 'session_token_scopes').length,
      total_loyalty_tiers: items.filter((i) => i.domain === 'membership_loyalty_tiers').length
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
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-100 text-indigo-950 border border-indigo-400">
                Phase 8 Sovereign Citadel
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Zero-Trust RBAC Mesh Active
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              Members, RBAC Permissions & Organization Citadel Console
            </h1>
            <p className="text-slate-700 text-sm mt-1 max-w-3xl font-medium leading-relaxed">
              Autonomous oversight of the Sovereign RBAC Matrix, Pages Permission Route Gates, Merchant Organization KYC, High Council of Dignitaries, Hardware-Bound Session Scopes, and Citizenship Loyalty Tiers.
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
              Sync Permissions
            </button>

            <button
              onClick={() => {
                audioEngine.playVoiceLine('blessings');
                setIsSpawnModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-black text-sm transition-all shadow-md"
            >
              <Sliders className="w-4 h-4" />
              Spawn Citadel Console
            </button>

            <button
              onClick={() => {
                audioEngine.playVoiceLine('madt_o');
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white font-black text-sm transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              Commission RBAC Rule
            </button>
          </div>
        </div>
      </div>

      {/* Overarching Telemetry Cards */}
      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Total Rules</span>
              <Layers className="w-4 h-4 text-slate-700" />
            </div>
            <div className="text-2xl font-black text-slate-900 mt-2">{summary.total_items}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Active: {summary.active_count} | Frozen: {summary.frozen_count}</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Assigned Members</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-800 mt-2">
              {Number(summary.total_assigned_members).toLocaleString()}
            </div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Roles & Citadels</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Route Gates</span>
              <Lock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-amber-700 mt-2">{summary.total_route_gates}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Gated screen endpoints</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Merchant Citadels</span>
              <Building className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">{summary.total_merchant_citadels}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">CAC / KYC verified</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Dignitaries Council</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-purple-700 mt-2">{summary.total_dignitaries}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Honorary senate seats</div>
          </div>

          <div className="bg-white border border-slate-300 p-4 rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider">
              <span>Hardware Tokens</span>
              <Fingerprint className="w-4 h-4 text-cyan-600" />
            </div>
            <div className="text-2xl font-black text-cyan-700 mt-2">{summary.total_session_rules}</div>
            <div className="text-xs text-slate-600 mt-1 font-semibold">Biometric JWT scopes</div>
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
                ? 'bg-indigo-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            All RBAC Policies ({items.length})
          </button>
          <button
            onClick={() => handleDomainFilter('sovereign_rbac_matrix')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'sovereign_rbac_matrix'
                ? 'bg-indigo-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            RBAC Roles Matrix
          </button>
          <button
            onClick={() => handleDomainFilter('pages_permission_gates')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'pages_permission_gates'
                ? 'bg-indigo-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            Pages Route Gates
          </button>
          <button
            onClick={() => handleDomainFilter('merchant_organization_kyc')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'merchant_organization_kyc'
                ? 'bg-indigo-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Merchant Citadel KYC
          </button>
          <button
            onClick={() => handleDomainFilter('council_dignitaries_ledger')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'council_dignitaries_ledger'
                ? 'bg-indigo-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Dignitaries Council
          </button>
          <button
            onClick={() => handleDomainFilter('session_token_scopes')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'session_token_scopes'
                ? 'bg-indigo-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            Session Scopes & Enclaves
          </button>
          <button
            onClick={() => handleDomainFilter('membership_loyalty_tiers')}
            className={`px-4 py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              activeDomain === 'membership_loyalty_tiers'
                ? 'bg-indigo-800 text-white shadow'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Citizenship Loyalty
          </button>
        </div>
      </div>

      {/* Main Table: RBAC Items with Up/Down Reorder, Freeze & Edit */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-300 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-slate-700" />
                Live Sovereign Permissions & Organization Citadel (PostgreSQL Persisted)
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Transactional display ordering with atomic Up / Down shifts, instant permission freeze switch, and corporate credential upload.
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
                  <th className="py-3 px-4">Role / Policy Name</th>
                  <th className="py-3 px-4">Domain / Category</th>
                  <th className="py-3 px-4">Role Tier / Permission Level</th>
                  <th className="py-3 px-4">Route Scope</th>
                  <th className="py-3 px-4">Assigned Members</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Priority</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-600 font-bold">
                      No RBAC policies found in this domain. Commission one above!
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
                          {item.credential_cert_url && (
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

                      {/* Tier / Level */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-800">
                          {item.role_tier || 'General Tier'}
                        </div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-100 text-indigo-950 border border-indigo-400">
                          {item.permission_level}
                        </span>
                      </td>

                      {/* Route Scope */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-mono font-bold text-slate-800">
                          {item.route_scope}
                        </div>
                      </td>

                      {/* Assigned Members */}
                      <td className="py-3.5 px-4 font-black text-xs text-indigo-900">
                        {Number(item.assigned_members_count).toLocaleString()} members
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
                          {/* Credential Upload Button */}
                          <label
                            title="Upload Credential Certificate / CAC Document"
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
              Dynamic Spawned RBAC Consoles ({spawnedConsoles.length})
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
                  <Shield className="w-6 h-6 text-indigo-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Commission RBAC Policy */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-700" />
                Commission New RBAC / Organization Citadel Policy
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
                    Citadel Domain
                  </label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value as RbacPermissionsDomain })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  >
                    <option value="sovereign_rbac_matrix">Sovereign RBAC Matrix & Role Hierarchy</option>
                    <option value="pages_permission_gates">Pages & API Permission Route Gates</option>
                    <option value="merchant_organization_kyc">Merchant & Business Citadel KYC</option>
                    <option value="council_dignitaries_ledger">Council of Dignitaries & Senate</option>
                    <option value="session_token_scopes">Session Scopes & Hardware Enclave Binding</option>
                    <option value="membership_loyalty_tiers">Citizenship Loyalty Tiers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Role / Policy Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Risk Officer Executive Role"
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
                    placeholder="e.g. ROLE-CRO-EXECUTIVE"
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
                    placeholder="e.g. Executive Governance"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Role Tier
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Executive"
                    value={formData.role_tier || ''}
                    onChange={(e) => setFormData({ ...formData, role_tier: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Permission Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. FULL_AUDIT_FREEZE_DISBURSE"
                    value={formData.permission_level}
                    onChange={(e) => setFormData({ ...formData, permission_level: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Route Scope Path
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. /admin/risk/*"
                    value={formData.route_scope}
                    onChange={(e) => setFormData({ ...formData, route_scope: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5 font-mono"
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
                    <option value="blessings">blessings (Charter granted)</option>
                    <option value="owo_ni_koko">owo_ni_koko (Treasury privilege)</option>
                    <option value="madt_o">madt_o (Super power granted)</option>
                    <option value="see_gobe">see_gobe (Access breach warning)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Access Scopes & Authority Specifications
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail delegated authorities, CAC verification requirements, hardware key tokens..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Upload Credential Certificate / CAC Charter (Direct Express Upload)
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
                  className="px-5 py-2 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white font-black text-sm shadow-md"
                >
                  Commission RBAC Rule
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
                Modify RBAC Policy: {selectedItem.name}
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
                    Role Tier
                  </label>
                  <input
                    type="text"
                    value={selectedItem.role_tier || ''}
                    onChange={(e) => setSelectedItem({ ...selectedItem, role_tier: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Permission Level
                  </label>
                  <input
                    type="text"
                    value={selectedItem.permission_level}
                    onChange={(e) => setSelectedItem({ ...selectedItem, permission_level: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Route Scope Path
                  </label>
                  <input
                    type="text"
                    value={selectedItem.route_scope}
                    onChange={(e) => setSelectedItem({ ...selectedItem, route_scope: e.target.value })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                    Assigned Members Count
                  </label>
                  <input
                    type="number"
                    value={selectedItem.assigned_members_count}
                    onChange={(e) => setSelectedItem({ ...selectedItem, assigned_members_count: Number(e.target.value) })}
                    className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-800 mb-1">
                  Access Specs / Notes
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

      {/* Modal: Spawn RBAC Console */}
      {isSpawnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-300">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-700" />
                Spawn Sovereign Citadel Sub-Console
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
                  placeholder="e.g. Enterprise Merchant Citadel Console"
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
                  onChange={(e) => setSpawnDomain(e.target.value as RbacPermissionsDomain)}
                  className="w-full text-sm font-bold text-slate-900 border border-slate-300 bg-white rounded-lg p-2.5"
                >
                  <option value="sovereign_rbac_matrix">Sovereign RBAC Matrix & Role Hierarchy</option>
                  <option value="pages_permission_gates">Pages & API Permission Route Gates</option>
                  <option value="merchant_organization_kyc">Merchant & Business Citadel KYC</option>
                  <option value="council_dignitaries_ledger">Council of Dignitaries & Senate</option>
                  <option value="session_token_scopes">Session Scopes & Hardware Enclave Binding</option>
                  <option value="membership_loyalty_tiers">Citizenship Loyalty Tiers</option>
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
                  className="px-5 py-2 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white font-black text-sm shadow-md"
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

export default MasterRbacPermissionsConsole;
