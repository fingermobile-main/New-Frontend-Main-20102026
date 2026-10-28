import React, { useState, useEffect, useMemo } from 'react';
import { 
  Scale, 
  FileSignature, 
  Shield, 
  Lock, 
  Eye, 
  Settings, 
  MoreHorizontal, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Search, 
  AlertTriangle,
  Sliders,
  X
} from 'lucide-react';
import { api } from '../services/api';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

export interface StercsPolicy {
  id: string;
  policy_code: string;
  name: string;
  category: string;
  rules?: any;
  is_active: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  description?: string;
  compliance_level: string;
  created_at: string;
  updated_at: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Content: <FileSignature className="h-4 w-4 text-blue-500" />,
  'AI Ethics': <Shield className="h-4 w-4 text-green-500" />,
  'Data Privacy': <Lock className="h-4 w-4 text-yellow-500" />,
  Finance: <Scale className="h-4 w-4 text-purple-500" />,
  Compliance: <Eye className="h-4 w-4 text-pink-500" />,
};

const StercsPoliciesPage: React.FC = () => {
  const [policies, setPolicies] = useState<StercsPolicy[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<StercsPolicy | null>(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Content');
  const [formSeverity, setFormSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [formAction, setFormAction] = useState('warn');
  const [formDescription, setFormDescription] = useState('');
  const [formComplianceLevel, setFormComplianceLevel] = useState('Moderate');
  const [formIsActive, setFormIsActive] = useState(true);

  // Active Dropdown Menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  const fetchPolicies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/master-dashboard/policies');
      if (res.data?.success && Array.isArray(res.data.policies || res.data.data)) {
        setPolicies(res.data.policies || res.data.data);
      } else {
        setPolicies([]);
      }
    } catch (err: any) {
      console.error('Failed to load policies:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to retrieve governance policies from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const openCreateModal = () => {
    setEditingPolicy(null);
    setFormCode(`POL_${Date.now().toString().slice(-6)}`);
    setFormName('');
    setFormCategory('Content');
    setFormSeverity('medium');
    setFormAction('warn');
    setFormDescription('');
    setFormComplianceLevel('Moderate');
    setFormIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (policy: StercsPolicy) => {
    setEditingPolicy(policy);
    setFormCode(policy.policy_code);
    setFormName(policy.name);
    setFormCategory(policy.category || 'Content');
    setFormSeverity(policy.severity || 'medium');
    setFormAction(policy.action || 'warn');
    setFormDescription(policy.description || '');
    setFormComplianceLevel(policy.compliance_level || 'Moderate');
    setFormIsActive(policy.is_active);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleSavePolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim() || !formName.trim()) {
      showToast('Policy Code and Name are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        code: formCode.trim(),
        name: formName.trim(),
        category: formCategory,
        severity: formSeverity,
        action: formAction,
        description: formDescription,
        compliance_level: formComplianceLevel,
        is_active: formIsActive,
        rules: editingPolicy?.rules || {}
      };

      const res = await api.put(`/master-dashboard/policies/${encodeURIComponent(formCode.trim())}`, payload);
      if (res.data?.success) {
        showToast(editingPolicy ? 'Policy updated successfully!' : 'New policy persisted to PostgreSQL database!', 'success');
        setIsModalOpen(false);
        await fetchPolicies();
      } else {
        showToast(res.data?.message || 'Failed to persist policy', 'error');
      }
    } catch (err: any) {
      console.error('Save policy error:', err);
      showToast(err?.response?.data?.message || err.message || 'Failed to save policy to database', 'error');
    } finally {
      setSaving(false);
    }
  };

  const togglePolicyStatus = async (policy: StercsPolicy) => {
    try {
      const updatedStatus = !policy.is_active;
      const res = await api.put(`/master-dashboard/policies/${encodeURIComponent(policy.policy_code)}`, {
        ...policy,
        is_active: updatedStatus
      });
      if (res.data?.success) {
        showToast(`Policy "${policy.name}" is now ${updatedStatus ? 'Active' : 'Disabled'}.`, 'success');
        setPolicies(prev => prev.map(p => p.id === policy.id ? { ...p, is_active: updatedStatus } : p));
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || err.message || 'Failed to update policy status', 'error');
    } finally {
      setActiveMenuId(null);
    }
  };

  const filteredPolicies = useMemo(() => {
    return policies.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.policy_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [policies, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredPolicies.length / pageSize));
  const paginatedPolicies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPolicies.slice(start, start + pageSize);
  }, [filteredPolicies, currentPage, pageSize]);

  return (
    <div className="min-h-screen bg-slate-50 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold transition-all ${
            toastMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300' 
              : 'bg-red-50 text-red-950 border-red-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-slate-900">STERCS Policies</h1>
                <p className="text-xs text-slate-700 font-medium">Real-time PostgreSQL Governance Engine & Containment Directives</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchPolicies}
                disabled={loading}
                aria-label="Refresh policies"
                title="Refresh Policies"
                className="min-h-[44px] min-w-[44px] p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-blue-500 flex items-center justify-center cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
              <button
                type="button"
                onClick={openCreateModal}
                className="min-h-[44px] flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Create Policy</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-xs p-4 border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              placeholder="Search by code, title, or keywords..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Category:</span>
            {['All', 'Content', 'AI Ethics', 'Data Privacy', 'Finance', 'Compliance'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              aria-label="Open governance engine settings"
              title="Open Governance Engine Settings"
              className="p-2 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-100"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Governance Settings Drawer */}
        {showConfigDrawer && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 transition-all">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Governance Engine Parameters</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowConfigDrawer(false)}
                aria-label="Close configuration drawer"
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-700 mb-4">
              STERCS policy engine evaluates automated rules on every user submission, AI transcode, and monetary movement.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-800">
              <div className="p-3 bg-white rounded-lg border border-blue-100">
                <span className="text-slate-500 block text-[11px]">Database Synchronization</span>
                <span className="text-emerald-700 font-bold">PostgreSQL Real-time CDC Active</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-100">
                <span className="text-slate-500 block text-[11px]">Containment Mode</span>
                <span className="text-blue-700 font-bold">Standard Defcon Tier 5</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-blue-100">
                <span className="text-slate-500 block text-[11px]">Audit Mechanism</span>
                <span className="text-purple-700 font-bold">WORM Immutable Audit Chain</span>
              </div>
            </div>
          </div>
        )}

        {/* Policies Table Card */}
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Governance Policies</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {filteredPolicies.length} total active directives managed in database
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 mb-4 flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={fetchPolicies}
                className="underline font-bold text-xs hover:text-red-950 ml-4"
              >
                Retry
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Policy</th>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Severity</th>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Compliance</th>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-sm font-semibold text-slate-600">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                        <span>Loading STERCS policies from database...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedPolicies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-sm font-semibold text-slate-600">
                      No policies found matching your search.
                    </td>
                  </tr>
                ) : (
                  paginatedPolicies.map((policy) => (
                    <tr key={policy.id || policy.policy_code} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                            {CATEGORY_ICONS[policy.category] || <Scale className="h-4 w-4 text-blue-500" />}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-900">{policy.name}</div>
                            <div className="text-xs text-slate-600 font-mono">{policy.policy_code}</div>
                            {policy.description && (
                              <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{policy.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                        {policy.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => togglePolicyStatus(policy)}
                          title={`Click to ${policy.is_active ? 'deactivate' : 'activate'}`}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-transform hover:scale-105 ${
                            policy.is_active
                              ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                              : 'bg-slate-200 text-slate-800 border border-slate-400'
                          }`}
                        >
                          {policy.is_active ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                        <span className={
                          policy.severity === 'critical' ? 'text-red-700' :
                          policy.severity === 'high' ? 'text-amber-700' :
                          policy.severity === 'medium' ? 'text-blue-700' : 'text-slate-700'
                        }>
                          {policy.severity ? policy.severity.toUpperCase() : 'MEDIUM'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                        {policy.compliance_level || 'Moderate'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(policy)}
                            className="text-blue-600 hover:text-blue-900 font-bold hover:underline"
                          >
                            Edit
                          </button>
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(activeMenuId === policy.id ? null : policy.id)}
                              aria-label={`Options for policy ${policy.name}`}
                              title={`Options for policy ${policy.name}`}
                              className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {activeMenuId === policy.id && (
                              <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-30">
                                <button
                                  type="button"
                                  onClick={() => togglePolicyStatus(policy)}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                  {policy.is_active ? 'Disable Policy' : 'Activate Policy'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditModal(policy)}
                                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                  Edit Configuration
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="text-sm font-medium text-slate-700">
              Showing <span className="font-bold text-slate-900">{filteredPolicies.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-bold text-slate-900">{Math.min(currentPage * pageSize, filteredPolicies.length)}</span> of{' '}
              <span className="font-bold text-slate-900">{filteredPolicies.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`px-3 py-1 rounded-md border text-sm font-bold ${
                    currentPage === pageNumber
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-slate-300 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Sovereign Platform Ownership Directive */}
        <div className="mt-8">
          <PlatformOwnershipCard />
        </div>
      </main>

      {/* Create / Edit Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">
                {editingPolicy ? 'Edit STERCS Policy' : 'Create New STERCS Policy'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
                className="text-slate-500 hover:text-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Policy Code
                </label>
                <input
                  type="text"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  disabled={!!editingPolicy}
                  required
                  placeholder="POL_EXAMPLE_CODE"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Policy Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  placeholder="e.g. Content Moderation Policy"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                  >
                    <option value="Content">Content</option>
                    <option value="AI Ethics">AI Ethics</option>
                    <option value="Data Privacy">Data Privacy</option>
                    <option value="Finance">Finance</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Severity
                  </label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Action
                  </label>
                  <select
                    value={formAction}
                    onChange={(e) => setFormAction(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                  >
                    <option value="warn">Warn User</option>
                    <option value="quarantine">Quarantine Content</option>
                    <option value="freeze_account">Freeze Account</option>
                    <option value="enforce_purge">Enforce Purge</option>
                    <option value="log_audit">Log Cryptographic Audit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Compliance Level
                  </label>
                  <select
                    value={formComplianceLevel}
                    onChange={(e) => setFormComplianceLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                  >
                    <option value="Strict">Strict</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Advisory">Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  placeholder="Guidelines and trigger rationale..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="formIsActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-slate-300"
                />
                <label htmlFor="formIsActive" className="text-sm font-semibold text-slate-800">
                  Enable policy immediately upon persistence
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <RefreshCw className="h-4 w-4 animate-spin" />}
                  <span>{editingPolicy ? 'Update Policy' : 'Save to Database'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Stercs Policies Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold transition-colors cursor-pointer ${
            selectedCategory === 'All' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-5 h-5 mb-0.5" />
          <span>Policies</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const searchInput = document.querySelector('input[placeholder*="Search policies"]') as HTMLInputElement | null;
            if (searchInput) searchInput.focus();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Search</span>
        </button>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5 mb-0.5" />
          <span>Create</span>
        </button>
        <button
          type="button"
          onClick={fetchPolicies}
          disabled={loading}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
        >
          <RefreshCw className={`w-5 h-5 mb-0.5 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          <span>Sync</span>
        </button>
      </nav>
    </div>
  );
};

export default StercsPoliciesPage;
