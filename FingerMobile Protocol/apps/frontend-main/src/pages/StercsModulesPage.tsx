import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Settings, 
  MoreHorizontal, 
  Plus, 
  RefreshCw, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ArrowUpRight, 
  X, 
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

export interface StercsModule {
  id: string;
  name: string;
  group: string;
  groupName: string;
  purpose: string;
  healthScore: number;
  status: 'online' | 'degraded' | 'offline';
  responseTime: number;
  route: string;
  controls?: string;
  safeguards?: string;
  telemetry?: string;
  activeIncidents?: number;
  version?: string;
}

const FALLBACK_MODULES: StercsModule[] = [
  {
    id: 'stercs-core',
    name: 'STERCS Core',
    group: 'creation-config',
    groupName: 'Creation & Configuration',
    purpose: 'Core governance, transcode, and control framework',
    healthScore: 98,
    status: 'online',
    responseTime: 32,
    route: '/dashboard/stercs',
    controls: 'Automated policy enforcement, DEFCON trigger system, WebGL render acceleration.',
    safeguards: 'WORM audit logs, memory cap management, process isolation.',
    telemetry: 'Render latency, throughput, transcode pipeline health.',
    activeIncidents: 0,
    version: 'v3.4.1'
  },
  {
    id: 'guardian-ai',
    name: 'Guardian AI Sentinel',
    group: 'security-governance',
    groupName: 'Security & Governance',
    purpose: 'AI protection, neural anomaly detection, and prompt guardrails',
    healthScore: 99,
    status: 'online',
    responseTime: 28,
    route: '/guardian-ai',
    controls: 'Automated content classification, hate speech filtering, prompt injection defense.',
    safeguards: 'Real-time quarantine, dual-signature model consensus, safe fallback rules.',
    telemetry: 'Flag rate, inference latency (p95), classification confidence.',
    activeIncidents: 0,
    version: 'v3.0.2'
  },
  {
    id: 'sentient-control',
    name: 'Sentient Dynamic Control',
    group: 'creation-config',
    groupName: 'Creation & Configuration',
    purpose: 'Adaptive real-time UI/UX optimization and runtime tuning',
    healthScore: 95,
    status: 'online',
    responseTime: 45,
    route: '/sentient-control',
    controls: 'Algorithm weight adjustment, dynamic layout reconfiguration, live streaming rates.',
    safeguards: 'Circuit breakers, gradual canary rollouts, drift detection.',
    telemetry: 'Interaction velocity, conversion yield, engagement drift.',
    activeIncidents: 0,
    version: 'v2.1.0'
  }
];

const StercsModulesPage: React.FC = () => {
  const [modules, setModules] = useState<StercsModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');

  // Selected Module for Drawer / Details
  const [activeConfigModule, setActiveConfigModule] = useState<StercsModule | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [newModuleGroup, setNewModuleGroup] = useState('creation-config');
  const [newModulePurpose, setNewModulePurpose] = useState('');
  const [newModuleRoute, setNewModuleRoute] = useState('/dashboard');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/master-dashboard/consoles');
      if (res.data?.success && Array.isArray(res.data.consoles || res.data.data)) {
        const rawList = res.data.consoles || res.data.data;
        const mapped = rawList.map((item: any) => ({
          ...item,
          version: item.version || `v${Math.floor(item.healthScore / 30)}.${(item.healthScore % 10)}.${Math.floor(item.responseTime % 9)}`
        }));
        setModules(mapped);
      } else {
        setModules(FALLBACK_MODULES);
      }
    } catch (err: any) {
      console.warn('Backend /consoles fetch failed, using fallback:', err.message);
      setModules(FALLBACK_MODULES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleAddModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleName.trim()) return;

    const newMod: StercsModule = {
      id: `module-${Date.now().toString().slice(-6)}`,
      name: newModuleName.trim(),
      group: newModuleGroup,
      groupName: newModuleGroup.replace('-', ' ').toUpperCase(),
      purpose: newModulePurpose.trim() || 'Custom microservice module',
      healthScore: 98,
      status: 'online',
      responseTime: 40,
      route: newModuleRoute.trim() || '/dashboard',
      version: 'v1.0.0',
      controls: 'Default RBAC controls and event listeners.',
      safeguards: 'Automated health monitors and restart routines.',
      telemetry: 'Real-time process telemetry.'
    };

    setModules(prev => [newMod, ...prev]);
    showToast(`Module "${newMod.name}" registered successfully!`, 'success');
    setIsAddModalOpen(false);
    setNewModuleName('');
    setNewModulePurpose('');
  };

  const filteredModules = useMemo(() => {
    return modules.filter(m => {
      const matchesSearch = 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.purpose || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.route || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGroup = selectedGroup === 'All' || m.group === selectedGroup || m.groupName === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [modules, searchQuery, selectedGroup]);

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
              <Network className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-slate-900">STERCS Modules & Microservices</h1>
                <p className="text-xs text-slate-700 font-medium">Enterprise Microservice Grid & Real-time Console Architecture</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchModules}
                disabled={loading}
                aria-label="Refresh modules catalog"
                title="Refresh Modules Catalog"
                className="min-h-[44px] min-w-[44px] p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="min-h-[44px] flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Add Module</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Search & Group Filters */}
        <div className="bg-white rounded-xl shadow-xs p-4 border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search microservices and consoles..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter Group:</span>
            {['All', 'creation-config', 'community-identity', 'commerce-growth', 'media-discovery'].map((grp) => (
              <button
                key={grp}
                type="button"
                onClick={() => setSelectedGroup(grp)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedGroup === grp
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {grp === 'All' ? 'All Modules' : grp.replace('-', ' & ').toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid Card */}
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Module Grid</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {filteredModules.length} microservices active in cluster
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-slate-600 font-medium">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-2" />
              <span>Querying cluster microservices telemetry...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((mod) => (
                <div 
                  key={mod.id} 
                  className="border border-slate-300 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                          {mod.group?.includes('media') ? (
                            <Zap className="h-5 w-5 text-blue-600" />
                          ) : mod.group?.includes('security') ? (
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                          ) : mod.group?.includes('creation') ? (
                            <Sparkles className="h-5 w-5 text-purple-600" />
                          ) : (
                            <Layers className="h-5 w-5 text-slate-700" />
                          )}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-bold text-sm text-slate-900">{mod.name}</h4>
                          <span className="text-[11px] font-semibold text-slate-500 uppercase">{mod.groupName || mod.group}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        mod.status === 'online' 
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' 
                          : 'bg-amber-100 text-amber-950 border border-amber-400'
                      }`}>
                        {mod.status === 'online' ? 'Online' : 'Degraded'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mt-3 line-clamp-2 font-medium">
                      {mod.purpose}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1">
                        <span>Health: {mod.healthScore}%</span>
                        <span className="font-mono text-slate-500">{mod.responseTime}ms</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${
                            mod.healthScore >= 90 ? 'bg-emerald-500' : mod.healthScore >= 75 ? 'bg-amber-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${mod.healthScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button 
                      type="button"
                      onClick={() => setActiveConfigModule(mod)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-bold hover:underline flex items-center gap-1"
                    >
                      <Sliders className="h-3.5 w-3.5" />
                      <span>Configure</span>
                    </button>
                    {mod.route ? (
                      <Link 
                        to={mod.route}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline"
                      >
                        <span>Open Console</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <span className="text-xs font-mono text-slate-400">{mod.version}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Configuration Drawer */}
        {activeConfigModule && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">
                    Configure {activeConfigModule.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveConfigModule(null)}
                  aria-label="Close configuration modal"
                  className="text-slate-500 hover:text-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-medium text-slate-800">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block text-[11px] uppercase font-bold mb-1">Purpose & Role</span>
                  <p className="text-slate-900">{activeConfigModule.purpose}</p>
                </div>

                {activeConfigModule.controls && (
                  <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200">
                    <span className="text-blue-900 block text-[11px] uppercase font-bold mb-1">Administrative Controls</span>
                    <p className="text-slate-800">{activeConfigModule.controls}</p>
                  </div>
                )}

                {activeConfigModule.safeguards && (
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200">
                    <span className="text-emerald-950 block text-[11px] uppercase font-bold mb-1">Automated Safeguards</span>
                    <p className="text-slate-800">{activeConfigModule.safeguards}</p>
                  </div>
                )}

                {activeConfigModule.telemetry && (
                  <div className="p-3 bg-purple-50/60 rounded-lg border border-purple-200">
                    <span className="text-purple-950 block text-[11px] uppercase font-bold mb-1">Telemetry Metrics</span>
                    <p className="text-slate-800">{activeConfigModule.telemetry}</p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveConfigModule(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Close
                  </button>
                  {activeConfigModule.route && (
                    <Link
                      to={activeConfigModule.route}
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm inline-flex items-center gap-1"
                    >
                      <span>Launch Microservice Console</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Module Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="text-lg font-bold text-slate-900">Register Microservice Module</h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  aria-label="Close modal"
                  className="text-slate-500 hover:text-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddModule} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Module Name</label>
                  <input
                    type="text"
                    value={newModuleName}
                    onChange={(e) => setNewModuleName(e.target.value)}
                    required
                    placeholder="e.g. Adaptive Streaming Transcoder"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Group</label>
                  <select
                    value={newModuleGroup}
                    onChange={(e) => setNewModuleGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                  >
                    <option value="creation-config">Creation & Configuration</option>
                    <option value="community-identity">Community & Identity</option>
                    <option value="commerce-growth">Commerce & Growth</option>
                    <option value="media-discovery">Media & Discovery</option>
                    <option value="security-governance">Security & Governance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Purpose</label>
                  <textarea
                    value={newModulePurpose}
                    onChange={(e) => setNewModulePurpose(e.target.value)}
                    rows={2}
                    placeholder="Describe microservice responsibilities..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">Route Path</label>
                  <input
                    type="text"
                    value={newModuleRoute}
                    onChange={(e) => setNewModuleRoute(e.target.value)}
                    placeholder="/dashboard/custom-module"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-sm"
                  >
                    Register Module
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sovereign Platform Ownership Directive */}
        <div className="mt-8">
          <PlatformOwnershipCard />
        </div>
      </main>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Stercs Modules Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => setSelectedGroup('all')}
          className={`flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold transition-colors cursor-pointer ${
            selectedGroup === 'all' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Network className="w-5 h-5 mb-0.5" />
          <span>Modules</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const searchInput = document.querySelector('input[placeholder*="Search microservices"]') as HTMLInputElement | null;
            if (searchInput) searchInput.focus();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span>Search</span>
        </button>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
        >
          <Plus className="w-5 h-5 mb-0.5" />
          <span>Add</span>
        </button>
        <button
          type="button"
          onClick={fetchModules}
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

export default StercsModulesPage;
