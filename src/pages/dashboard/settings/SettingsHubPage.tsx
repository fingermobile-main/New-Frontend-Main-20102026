import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import {
  Search,
  Users,
  Building2,
  HardDrive,
  ChevronRight,
  Shield,
  Lock,
  Save,
  Key,
  Sliders,
  DollarSign,
  Webhook,
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { useAppContext } from '../../../contexts/AppContext';

interface CollaboratorSeat {
  id: string;
  name: string;
  email: string;
  role: 'Sovereign Admin' | 'Store Manager' | 'Compliance Officer' | 'Content Moderator' | 'Read Only';
  status: 'Active' | 'Invited' | 'Suspended';
  assignedDate: string;
}

interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: 'Active' | 'Failing' | 'Disabled';
  secretMasked: string;
}

export const SettingsHubPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'hub' | 'general' | 'roles' | 'security' | 'communications' | 'storage' | 'commerce'>('hub');
  const [isSaving, setIsSaving] = useState(false);

  // General Settings State
  const [generalConfig, setGeneralConfig] = useState({
    businessName: 'FingerMobile Protocol Communications Ltd',
    brandTagline: 'Sovereign Decentralized Media, Enterprise Commerce & Financial Infrastructure',
    contactEmail: 'security@fingermobileprotocol.com',
    supportPhone: '+234 1 800 346 4376',
    defaultCurrency: 'NGN',
    platformTimezone: 'Africa/Lagos (GMT+1)',
    primaryLanguage: 'English (UK)',
    sovereignNodeDomain: 'https://core.node.fingermobile.protocol'
  });

  // Roles & Collaborator Seats State
  const [collaborators, setCollaborators] = useState<CollaboratorSeat[]>([
    {
      id: 'COL-001',
      name: 'Adekunle Sovereign',
      email: 'adekunle@fingermobileprotocol.com',
      role: 'Sovereign Admin',
      status: 'Active',
      assignedDate: '2026-01-10'
    },
    {
      id: 'COL-002',
      name: 'Ngozi Chukwu',
      email: 'ngozi.c@storefronts.fingermobileprotocol.com',
      role: 'Store Manager',
      status: 'Active',
      assignedDate: '2026-02-14'
    },
    {
      id: 'COL-003',
      name: 'Tariq Al-Mansoor',
      email: 'tariq.audit@protocol.org',
      role: 'Compliance Officer',
      status: 'Active',
      assignedDate: '2026-03-01'
    },
    {
      id: 'COL-004',
      name: 'Zainab Bello',
      email: 'zainab.moderation@fingermobileprotocol.com',
      role: 'Content Moderator',
      status: 'Active',
      assignedDate: '2026-04-12'
    }
  ]);
  const [newCollabName, setNewCollabName] = useState('');
  const [newCollabEmail, setNewCollabEmail] = useState('');
  const [newCollabRole, setNewCollabRole] = useState<CollaboratorSeat['role']>('Store Manager');

  // Security & Enclave State
  const [securityConfig, setSecurityConfig] = useState({
    enforceMfaAllAdmins: true,
    sessionTimeoutMinutes: 30,
    hardwareKeyRequired: false,
    camusEnclaveSigning: true,
    ipRestrictedConsole: true,
    allowedIpSubnet: '102.89.0.0/16, 197.210.0.0/16',
    enclaveKeyFingerprint: 'SHA256:7f08c36b81d743a608892d9f4851eb32c4e'
  });

  // Communications & Notifications State
  const [commConfig, setCommConfig] = useState({
    emailAlertsDispatched: true,
    smsAlertsCritical: true,
    inAppPopups: true,
    dailyDigestSummary: false,
    disputeEscalationWebhook: 'https://ops.fingermobileprotocol.com/webhooks/disputes'
  });

  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: 'WH-8801',
      url: 'https://api.merchant-settle.fingermobileprotocol.com/v1/events',
      events: ['escrow.released', 'payment.settled', 'store.flagged'],
      status: 'Active',
      secretMasked: 'whsec_••••••••4f92'
    },
    {
      id: 'WH-8802',
      url: 'https://logistics-telemetry.fingermobileprotocol.com/dispatch',
      events: ['shipment.dispatched', 'shipment.delivered', 'customs.cleared'],
      status: 'Active',
      secretMasked: 'whsec_••••••••91c3'
    }
  ]);

  // Storage & IPFS Pinning State
  const [storageConfig, setStorageConfig] = useState({
    ipfsPinningService: 'Pinata High-Speed Dedicated Gateway',
    maxAssetUploadMb: 250,
    retentionDays: 365,
    encryptionAtRest: true,
    localCacheQuotaGb: 50,
    autoPurgeStaleTemp: true
  });

  // Commerce & Settlement State
  const [commerceConfig, setCommerceConfig] = useState({
    defaultPlatformFeePercent: 1.5,
    escrowHoldingPeriodHours: 48,
    autoDisputeResolutionDays: 7,
    instantSettlementAllowed: true,
    multiCurrencyAutoConversion: true,
    sovereignTreasuryVault: '0x71C...8932 (Camus Multisig Protocol Vault)'
  });

  const handleSave = (sectionName: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast(`${sectionName} successfully updated and propagated across sovereign cluster.`, 'success');
    }, 450);
  };

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollabName.trim() || !newCollabEmail.trim()) {
      showToast('Please provide both collaborator name and corporate email.', 'error');
      return;
    }
    const newCollab: CollaboratorSeat = {
      id: `COL-${Math.floor(100 + Math.random() * 900)}`,
      name: newCollabName.trim(),
      email: newCollabEmail.trim(),
      role: newCollabRole,
      status: 'Active',
      assignedDate: new Date().toISOString().split('T')[0]
    };
    setCollaborators(prev => [...prev, newCollab]);
    setNewCollabName('');
    setNewCollabEmail('');
    showToast(`Invited ${newCollab.name} as ${newCollab.role}.`, 'success');
  };

  const handleRemoveCollaborator = (id: string, name: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== id));
    showToast(`Removed seat access for ${name}.`, 'info');
  };

  const hubCatalog = [
    {
      id: 'general',
      title: 'Business & Node Identity',
      category: 'Foundation',
      description: 'Configure corporate name, branding, default platform currency, timezones, and sovereign node URLs.',
      icon: Building2,
      badge: 'Core',
      badgeColor: 'bg-blue-100 text-blue-950 border-blue-300'
    },
    {
      id: 'roles',
      title: 'Roles & Collaborator Seats',
      category: 'Governance',
      description: 'Invite team members, assign sovereign permissions (Admin, Moderator, Store Manager), and manage access tiers.',
      icon: Users,
      badge: `${collaborators.length} Seats Active`,
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300'
    },
    {
      id: 'security',
      title: 'Security & Camus Cryptographic Enclave',
      category: 'Protection',
      description: 'Enforce MFA, IP address subnet restrictions, Camus enclave key rotation, and session timeout thresholds.',
      icon: Lock,
      badge: 'Hardware HSM',
      badgeColor: 'bg-amber-100 text-amber-950 border-amber-300'
    },
    {
      id: 'communications',
      title: 'Communications & Webhooks API',
      category: 'Interconnect',
      description: 'Configure platform dispatch events, dispute escalation endpoints, merchant webhook secrets, and notifications.',
      icon: Webhook,
      badge: `${webhooks.length} Endpoints Live`,
      badgeColor: 'bg-purple-100 text-purple-950 border-purple-300'
    },
    {
      id: 'storage',
      title: 'Storage, IPFS & Media Pinning',
      category: 'Infrastructure',
      description: 'Configure decentralized storage clusters, IPFS pinning gateways, media upload limits, and caching policies.',
      icon: HardDrive,
      badge: 'Decentralized',
      badgeColor: 'bg-cyan-100 text-cyan-950 border-cyan-300'
    },
    {
      id: 'commerce',
      title: 'Commerce & Settlement Protocols',
      category: 'Financials',
      description: 'Manage platform take rates, escrow lock duration, dispute time-limits, and sovereign multisig vault destination.',
      icon: DollarSign,
      badge: `${commerceConfig.defaultPlatformFeePercent}% Fee`,
      badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300'
    }
  ];

  const filteredCatalog = hubCatalog.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        {/* Header Banner */}
        <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-mono font-bold text-slate-900 uppercase tracking-wider mb-3">
              <Shield className="w-4 h-4 text-blue-700" />
              <span>Sovereign Protocol Management System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Enterprise Settings Hub
            </h1>
            <p className="text-sm font-medium text-slate-700 mt-2 max-w-2xl leading-relaxed">
              Consolidated command center for sovereign identity, role-based access control, cryptographic enclave protection, real-time webhooks, IPFS pinning nodes, and multi-currency commerce rules.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {activeTab !== 'hub' && (
              <button
                onClick={() => setActiveTab('hub')}
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Sliders className="w-4 h-4 text-slate-700" />
                <span>Return to Hub Grid</span>
              </button>
            )}
            <button
              onClick={() => handleSave(activeTab === 'hub' ? 'System Settings' : activeTab.toUpperCase())}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Save className="w-4 h-4 text-white" />
              )}
              <span>{isSaving ? 'Propagating...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-300">
          <button
            onClick={() => setActiveTab('hub')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'hub'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Settings Directory</span>
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'general'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>General & Identity</span>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Roles & Collaborators</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Enclave</span>
          </button>
          <button
            onClick={() => setActiveTab('communications')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'communications'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Webhook className="w-4 h-4" />
            <span>Communications & Webhooks</span>
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'storage'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Storage & IPFS</span>
          </button>
          <button
            onClick={() => setActiveTab('commerce')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'commerce'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Commerce & Settlement</span>
          </button>
        </div>

        {/* TAB 1: HUB DIRECTORY TILES */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            {/* Search Input */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Filter settings modules (e.g., enclave, collaborator, ipfs)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-900 font-bold"
                />
              </div>
              <div className="text-xs font-bold text-slate-700">
                Displaying {filteredCatalog.length} configurable enterprise subsystems
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className="bg-white border border-slate-300 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-blue-600 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {item.category}
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-700 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-5 mt-5 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 group-hover:underline">
                        Open Subsystem Console
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: GENERAL & IDENTITY */}
        {activeTab === 'general' && (
          <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-700" />
                <span>General Business & Node Identity</span>
              </h2>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Configure primary metadata broadcast across the FingerMobile decentralized network.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Business Entity / Legal Organization
                </label>
                <input
                  type="text"
                  value={generalConfig.businessName}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, businessName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Corporate Tagline / Ecosystem Purpose
                </label>
                <input
                  type="text"
                  value={generalConfig.brandTagline}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, brandTagline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Corporate Security / Dispatch Email
                </label>
                <input
                  type="email"
                  value={generalConfig.contactEmail}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Executive Support Hotline
                </label>
                <input
                  type="text"
                  value={generalConfig.supportPhone}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, supportPhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Default Platform Currency
                </label>
                <select
                  value={generalConfig.defaultCurrency}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, defaultCurrency: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NGN">NGN - Nigerian Naira (Default Domestic)</option>
                  <option value="USD">USD - United States Dollar (Global Escrow)</option>
                  <option value="EUR">EUR - Euro (EU Continental Node)</option>
                  <option value="STERC">STERC - Sovereign Token Ecosystem Reserve Coin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Regional Timezone Standard
                </label>
                <select
                  value={generalConfig.platformTimezone}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, platformTimezone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Africa/Lagos (GMT+1)">Africa/Lagos (GMT+1)</option>
                  <option value="Europe/London (GMT+0)">Europe/London (GMT+0)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="UTC (Coordinated Universal Time)">UTC (Coordinated Universal Time)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Sovereign Enclave Node RPC Domain
                </label>
                <input
                  type="text"
                  value={generalConfig.sovereignNodeDomain}
                  onChange={(e) => setGeneralConfig({ ...generalConfig, sovereignNodeDomain: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => handleSave('General Identity Settings')}
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Update General Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ROLES & COLLABORATORS */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-700" />
                  <span>Assign Collaborator Seats & Permissions</span>
                </h2>
                <p className="text-xs font-medium text-slate-700 mt-1">
                  Manage privileged personnel authorized to moderate content, configure stores, or manage finances.
                </p>
              </div>

              {/* Add form */}
              <form onSubmit={handleAddCollaborator} className="bg-slate-50 border border-slate-300 rounded-2xl p-4 sm:p-5 mb-6">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>Provision New Collaborator Seat</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Collaborator Full Name"
                      value={newCollabName}
                      onChange={(e) => setNewCollabName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Corporate Email Address"
                      value={newCollabEmail}
                      onChange={(e) => setNewCollabEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={newCollabRole}
                      onChange={(e) => setNewCollabRole(e.target.value as any)}
                      className="flex-1 px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Sovereign Admin">Sovereign Admin</option>
                      <option value="Store Manager">Store Manager</option>
                      <option value="Compliance Officer">Compliance Officer</option>
                      <option value="Content Moderator">Content Moderator</option>
                      <option value="Read Only">Read Only</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Provision</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-300 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300">
                      <th className="py-3 px-4 font-bold text-slate-900">Personnel / ID</th>
                      <th className="py-3 px-4 font-bold text-slate-900">Corporate Email</th>
                      <th className="py-3 px-4 font-bold text-slate-900">Assigned Privilege</th>
                      <th className="py-3 px-4 font-bold text-slate-900">Status</th>
                      <th className="py-3 px-4 font-bold text-slate-900">Provisioned</th>
                      <th className="py-3 px-4 font-bold text-slate-900 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {collaborators.map((seat) => (
                      <tr key={seat.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-900">{seat.name}</div>
                          <div className="font-mono text-[11px] text-slate-600">{seat.id}</div>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{seat.email}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border border-blue-300">
                            {seat.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                            {seat.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-700">{seat.assignedDate}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleRemoveCollaborator(seat.id, seat.name)}
                            className="p-1.5 rounded-lg border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            title="Revoke Seat Access"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & CAMUS ENCLAVE */}
        {activeTab === 'security' && (
          <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-700" />
                <span>Security Governance & Camus Cryptographic Enclave</span>
              </h2>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Zero-trust hardware isolation, session authorization, and administrative authentication parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Enforce Multi-Factor Authentication</div>
                  <div className="text-xs font-medium text-slate-700 mt-1">
                    Require TOTP/WebAuthn hardware authenticator for all administrator-tier sessions.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.enforceMfaAllAdmins}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, enforceMfaAllAdmins: e.target.checked })}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">Camus Enclave Cryptographic Signing</div>
                  <div className="text-xs font-medium text-slate-700 mt-1">
                    Enforce hardware enclave signature validation on all database writes and payouts.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={securityConfig.camusEnclaveSigning}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, camusEnclaveSigning: e.target.checked })}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 mt-0.5"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Administrative Inactivity Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  value={securityConfig.sessionTimeoutMinutes}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, sessionTimeoutMinutes: parseInt(e.target.value) || 30 })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Authorized Subnet IP Whitelist
                </label>
                <input
                  type="text"
                  value={securityConfig.allowedIpSubnet}
                  onChange={(e) => setSecurityConfig({ ...securityConfig, allowedIpSubnet: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="md:col-span-2 p-4 rounded-2xl bg-amber-50 border border-amber-300">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950 uppercase tracking-wider mb-1">
                  <Key className="w-4 h-4 text-amber-800" />
                  <span>Active Camus Enclave HSM Root Key Fingerprint</span>
                </div>
                <div className="font-mono text-xs font-bold text-slate-900 break-all">
                  {securityConfig.enclaveKeyFingerprint}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => handleSave('Security & Cryptographic Parameters')}
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Security Policies</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: COMMUNICATIONS & WEBHOOKS */}
        {activeTab === 'communications' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Webhook className="w-5 h-5 text-purple-700" />
                  <span>Real-Time Webhook Subscriptions & Notifications</span>
                </h2>
                <p className="text-xs font-medium text-slate-700 mt-1">
                  Deliver sovereign platform events directly to your backend microservices and dispatch partners.
                </p>
              </div>

              {/* Notification Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Email Alerts</div>
                    <div className="text-[11px] font-medium text-slate-700">Financial payouts & audits</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={commConfig.emailAlertsDispatched}
                    onChange={(e) => setCommConfig({ ...commConfig, emailAlertsDispatched: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Critical SMS Dispatch</div>
                    <div className="text-[11px] font-medium text-slate-700">Dispute escalation & lock</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={commConfig.smsAlertsCritical}
                    onChange={(e) => setCommConfig({ ...commConfig, smsAlertsCritical: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">In-App Banner Toasts</div>
                    <div className="text-[11px] font-medium text-slate-700">Real-time system events</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={commConfig.inAppPopups}
                    onChange={(e) => setCommConfig({ ...commConfig, inAppPopups: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
              </div>

              {/* Webhook Endpoints List */}
              <div>
                <div className="text-sm font-extrabold text-slate-900 mb-3">Active Webhook Integrations</div>
                <div className="space-y-3">
                  {webhooks.map((wh) => (
                    <div key={wh.id} className="p-4 rounded-2xl border border-slate-300 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-slate-900">{wh.id}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300">
                            {wh.status}
                          </span>
                        </div>
                        <div className="font-mono text-xs font-bold text-blue-700 mt-1">{wh.url}</div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {wh.events.map((ev) => (
                            <span key={ev} className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-200 text-slate-800">
                              {ev}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right flex flex-col sm:items-end justify-between">
                        <div>
                          <div className="text-[11px] font-mono text-slate-600">Signing Secret</div>
                          <div className="font-mono text-xs font-bold text-slate-900">{wh.secretMasked}</div>
                        </div>
                        <button
                          onClick={() => {
                            setWebhooks(prev => prev.filter(w => w.id !== wh.id));
                            showToast(`Webhook endpoint ${wh.id} deleted.`, 'info');
                          }}
                          className="mt-2 text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={() => handleSave('Communications & Webhook Configurations')}
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4 text-white" />
                  <span>Update Webhook Rules</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: STORAGE & IPFS */}
        {activeTab === 'storage' && (
          <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-cyan-700" />
                <span>Decentralized Storage, IPFS & Media Pinning</span>
              </h2>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Configure content-addressed storage nodes for media playback, encrypted attachments, and commerce catalog assets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  IPFS Dedicated Pinning Gateway Provider
                </label>
                <input
                  type="text"
                  value={storageConfig.ipfsPinningService}
                  onChange={(e) => setStorageConfig({ ...storageConfig, ipfsPinningService: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Maximum Single Asset Upload Size (MB)
                </label>
                <input
                  type="number"
                  value={storageConfig.maxAssetUploadMb}
                  onChange={(e) => setStorageConfig({ ...storageConfig, maxAssetUploadMb: parseInt(e.target.value) || 250 })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Temporary Local Cache Quota (GB)
                </label>
                <input
                  type="number"
                  value={storageConfig.localCacheQuotaGb}
                  onChange={(e) => setStorageConfig({ ...storageConfig, localCacheQuotaGb: parseInt(e.target.value) || 50 })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Archival Audit Retention Period (Days)
                </label>
                <input
                  type="number"
                  value={storageConfig.retentionDays}
                  onChange={(e) => setStorageConfig({ ...storageConfig, retentionDays: parseInt(e.target.value) || 365 })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">End-to-End Encryption at Rest</div>
                  <div className="text-[11px] font-medium text-slate-700">AES-256 GCM chunk encryption before IPFS broadcast</div>
                </div>
                <input
                  type="checkbox"
                  checked={storageConfig.encryptionAtRest}
                  onChange={(e) => setStorageConfig({ ...storageConfig, encryptionAtRest: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Auto-Purge Stale Cache</div>
                  <div className="text-[11px] font-medium text-slate-700">Automatically clean unpinned chunks after 7 days</div>
                </div>
                <input
                  type="checkbox"
                  checked={storageConfig.autoPurgeStaleTemp}
                  onChange={(e) => setStorageConfig({ ...storageConfig, autoPurgeStaleTemp: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => handleSave('Storage & Pinning Configurations')}
                className="px-5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Storage Policies</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 7: COMMERCE & SETTLEMENT */}
        {activeTab === 'commerce' && (
          <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-700" />
                <span>Commerce Escrow & Settlement Governance</span>
              </h2>
              <p className="text-xs font-medium text-slate-700 mt-1">
                Configure sovereign fees across Storefront, Marketplace, OwnIt, and Flamingo transactions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Default Platform Commission / Take Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={commerceConfig.defaultPlatformFeePercent}
                  onChange={(e) => setCommerceConfig({ ...commerceConfig, defaultPlatformFeePercent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Escrow Vault Holding Period (Hours)
                </label>
                <input
                  type="number"
                  value={commerceConfig.escrowHoldingPeriodHours}
                  onChange={(e) => setCommerceConfig({ ...commerceConfig, escrowHoldingPeriodHours: parseInt(e.target.value) || 48 })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Auto Dispute Resolution Window (Days)
                </label>
                <input
                  type="number"
                  value={commerceConfig.autoDisputeResolutionDays}
                  onChange={(e) => setCommerceConfig({ ...commerceConfig, autoDisputeResolutionDays: parseInt(e.target.value) || 7 })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">Instant Settlement for Verified Merchants</div>
                  <div className="text-[11px] font-medium text-slate-700">Allow trusted tier-3 stores to bypass 48-hr hold</div>
                </div>
                <input
                  type="checkbox"
                  checked={commerceConfig.instantSettlementAllowed}
                  onChange={(e) => setCommerceConfig({ ...commerceConfig, instantSettlementAllowed: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Sovereign Treasury Vault Destination (On-Chain Multisig)
                </label>
                <input
                  type="text"
                  value={commerceConfig.sovereignTreasuryVault}
                  onChange={(e) => setCommerceConfig({ ...commerceConfig, sovereignTreasuryVault: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 font-bold focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-200">
              <button
                onClick={() => handleSave('Commerce Settlement Parameters')}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Save Commerce Policies</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SettingsHubPage;
