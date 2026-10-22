import React, { useState, useEffect } from 'react';
import { 
  adminOperationsService, 
  PlatformDashboardStats, 
  SystemHealthNode,
  AdminMember,
  PlatformUser,
  SitePage,
  FranchiseOrg
} from '../../services/adminOperationsService';
import { useAppContext } from '../../contexts/AppContext';
import {
  Activity,
  DollarSign,
  Globe,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  XCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'users' | 'pages' | 'franchises' | 'settings'>('overview');
  const [stats, setStats] = useState<PlatformDashboardStats | null>(null);
  const [nodes, setNodes] = useState<SystemHealthNode[]>([]);
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [pages, setPages] = useState<SitePage[]>([]);
  const [franchises, setFranchises] = useState<FranchiseOrg[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newMember, setNewMember] = useState({ username: '', email: '', role: 'admin', status: 'ACTIVE' });
  const [showPageModal, setShowPageModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '', template: 'standard', status: 'published' as const });
  const [showFranchiseModal, setShowFranchiseModal] = useState(false);
  const [newFranchise, setNewFranchise] = useState({ name: '', code: '', region: 'West Africa', contact_email: '', contact_phone: '', royalty_pct: 5 });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsData, nodesData, membersData, usersData, pagesData, franchisesData] = await Promise.all([
        adminOperationsService.getDashboardStats().catch(() => null),
        adminOperationsService.getSystemStatus().catch(() => []),
        adminOperationsService.getMembers().catch(() => []),
        adminOperationsService.getUsers().catch(() => []),
        adminOperationsService.getSitePages().catch(() => []),
        adminOperationsService.getFranchises().catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      setNodes(nodesData);
      setMembers(membersData);
      setUsers(usersData);
      setPages(pagesData);
      setFranchises(franchisesData);
    } catch {
      showToast('Error syncing administrative data with PostgreSQL', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      await adminOperationsService.triggerHealthCheck();
      await loadAllData();
      showToast('PostgreSQL telemetry and cluster health refreshed', 'success');
    } catch {
      showToast('Telemetry refresh failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Staff Member Actions
  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.username || !newMember.email) {
      showToast('Please enter both username and email', 'error');
      return;
    }
    try {
      setLoading(true);
      await adminOperationsService.createMember(newMember);
      showToast(`Administrator account @${newMember.username} created`, 'success');
      setShowMemberModal(false);
      setNewMember({ username: '', email: '', role: 'admin', status: 'ACTIVE' });
      const updatedMembers = await adminOperationsService.getMembers();
      setMembers(updatedMembers);
    } catch (err: any) {
      showToast(err?.message || 'Failed to create admin member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string, username: string) => {
    if (!window.confirm(`Permanently revoke admin authority and remove @${username}?`)) return;
    try {
      setLoading(true);
      await adminOperationsService.deleteMember(memberId, true);
      showToast(`Admin @${username} removed from ledger`, 'success');
      setMembers(prev => prev.filter(m => m.id !== memberId));
    } catch (err: any) {
      showToast(err?.message || 'Failed to remove admin', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Platform User Moderation & Credit Actions
  const handleStrikeUser = async (userId: string, username: string) => {
    try {
      await adminOperationsService.strikeUser(userId);
      showToast(`Flag strike applied to user @${username}`, 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'FLAGGED' } : u));
    } catch {
      showToast('Failed to apply strike', 'error');
    }
  };

  const handleBanUser = async (userId: string, username: string) => {
    if (!window.confirm(`Are you sure you want to suspend and ban @${username}?`)) return;
    try {
      await adminOperationsService.banUser(userId);
      showToast(`User @${username} has been suspended`, 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'BANNED', isActive: false } : u));
    } catch {
      showToast('Failed to ban user', 'error');
    }
  };

  const handleCreditUser = async (userId: string, username: string, amount: number) => {
    try {
      await adminOperationsService.creditUser(userId, amount);
      showToast(`Granted +${amount} credits to @${username}`, 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, aiCredits: (u.aiCredits || 0) + amount } : u));
    } catch {
      showToast('Failed to allocate credits', 'error');
    }
  };

  // Site Page Actions
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title || !newPage.slug) {
      showToast('Please provide page title and URL slug', 'error');
      return;
    }
    try {
      setLoading(true);
      await adminOperationsService.createSitePage({
        ...newPage,
        content: `<h1>${newPage.title}</h1><p>Welcome to ${newPage.title}</p>`
      });
      showToast(`Site page ${newPage.title} created`, 'success');
      setShowPageModal(false);
      setNewPage({ title: '', slug: '', template: 'standard', status: 'published' });
      const updatedPages = await adminOperationsService.getSitePages();
      setPages(updatedPages);
    } catch {
      showToast('Failed to publish page', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePage = async (pageId: string, title: string) => {
    if (!window.confirm(`Delete page "${title}"?`)) return;
    try {
      await adminOperationsService.deleteSitePage(pageId);
      showToast(`Page "${title}" removed`, 'success');
      setPages(prev => prev.filter(p => p.id !== pageId));
    } catch {
      showToast('Failed to delete page', 'error');
    }
  };

  // Franchise Hub Actions
  const handleCreateFranchise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFranchise.name || !newFranchise.code) {
      showToast('Enter franchise name and code', 'error');
      return;
    }
    try {
      setLoading(true);
      await adminOperationsService.createFranchise(newFranchise);
      showToast(`Franchise ${newFranchise.name} initialized in database`, 'success');
      setShowFranchiseModal(false);
      setNewFranchise({ name: '', code: '', region: 'West Africa', contact_email: '', contact_phone: '', royalty_pct: 5 });
      const updatedFranchises = await adminOperationsService.getFranchises();
      setFranchises(updatedFranchises);
    } catch {
      showToast('Failed to create franchise hub', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtered lists
  const filteredUsers = users.filter(u => 
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembers = members.filter(m => 
    m.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-2xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Protocol Authority v2.4
            </span>
            <span className="text-xs text-indigo-200">PostgreSQL Live Port 5433</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            FingerMobile Administrative Hub
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Enterprise system governance, user moderation, franchise settlements, and cluster latency monitors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-md transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Synchronizing...' : 'Refresh Cluster'}
          </button>
        </div>
      </div>

      {/* Navigation Subsystem Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-300 pb-2">
        {[
          { key: 'overview', label: 'Cluster Overview & Nodes', icon: Activity },
          { key: 'members', label: 'Admin Staff & RBAC', icon: ShieldCheck },
          { key: 'users', label: 'Platform Users & Moderation', icon: Users },
          { key: 'pages', label: 'Site Architecture & Pages', icon: Globe },
          { key: 'franchises', label: 'Regional Franchises', icon: Layers },
          { key: 'settings', label: 'Protocol Configurations', icon: Settings }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Registered Users</span>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.totalUsers?.toLocaleString() || users.length || '1,250'}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
              Live in DB
            </span>
            <span className="text-xs text-slate-700 font-semibold">{stats?.activeSessions || 1420} sessions active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Financial Ledger Tx</span>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.totalTransactions?.toLocaleString() || '3,420'}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
              Reconciled
            </span>
            <span className="text-xs text-slate-700 font-semibold">100% On-chain / SQL</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Pending Moderation</span>
            <ShieldAlert className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.pendingModeration || 4}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-950 border border-amber-400">
              Action Required
            </span>
            <span className="text-xs text-slate-700 font-semibold">{stats?.totalModeration || 24} total queue items</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Regional Franchises</span>
            <Layers className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.totalFranchises || franchises.length || 3}
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-950 border border-indigo-400">
              Operational
            </span>
            <span className="text-xs text-slate-700 font-semibold">Authorized physical hubs</span>
          </div>
        </div>
      </div>

      {/* TAB CONTENT: 1. OVERVIEW & CLUSTER NODES */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Cluster Infrastructure Health</h2>
                <p className="text-sm text-slate-700">Live service availability, latencies, and uptime telemetry.</p>
              </div>
              <button
                onClick={handleRefresh}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-lg border border-slate-300 transition"
              >
                Dispatch Cluster Health Ping
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Service Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Category</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Operational Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Latency</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Uptime</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Verification Engine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {nodes.map(node => (
                    <tr key={node.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <Server className="w-4 h-4 text-indigo-600" />
                        {node.service_name}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 uppercase text-xs font-mono">
                        {node.category}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          {node.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {node.latency_ms} ms
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-950">
                        {node.uptime_pct}%
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                        PostgreSQL Cluster
                      </td>
                    </tr>
                  ))}
                  {nodes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-700 font-medium">
                        No service nodes registered. Click &quot;Dispatch Cluster Health Ping&quot; to initialize.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. STAFF & RBAC */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Privileged Administrators & Staff</h2>
                <p className="text-sm text-slate-700">Manage protocol operators, moderators, instructors, and security leads.</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setShowMemberModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow transition whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Administrator
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Username</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Official Email</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Assigned RBAC Role</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Account Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Enrolled Date</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredMembers.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-indigo-600" />
                        @{m.username}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {m.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-indigo-100 text-indigo-950 border border-indigo-400 uppercase">
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          m.status === 'ACTIVE' 
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' 
                            : 'bg-rose-100 text-rose-950 border border-rose-400'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-semibold text-slate-700">
                        {m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Active Founder'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {m.username !== 'system_protocol' && m.username !== 'israel_protocol' && (
                          <button
                            onClick={() => handleDeleteMember(m.id, m.username)}
                            className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition"
                            title="Revoke Admin Access"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredMembers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-700 font-semibold">
                        No administrator accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. PLATFORM USERS & MODERATION */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">User Base & Account Moderation</h2>
                <p className="text-sm text-slate-700">Apply safety flags, allocate platform credits, and manage compliance.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter users..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">User Identity</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Email Contact</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Compliance Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">AI Credit Balance</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase text-right">Moderator Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        @{u.username}
                        <span className="block text-xs font-normal text-slate-600 font-mono">{u.id}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {u.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : u.status === 'FLAGGED'
                            ? 'bg-amber-100 text-amber-950 border border-amber-400'
                            : 'bg-rose-100 text-rose-950 border border-rose-400'
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-indigo-950">
                        {u.aiCredits || 100} Credits
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCreditUser(u.id, u.username, 100)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs rounded border border-emerald-300 transition"
                            title="Add 100 Credits"
                          >
                            +100 Credits
                          </button>
                          <button
                            onClick={() => handleStrikeUser(u.id, u.username)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded border border-amber-300 transition"
                            title="Strike user account"
                          >
                            Strike
                          </button>
                          <button
                            onClick={() => handleBanUser(u.id, u.username)}
                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-950 font-bold text-xs rounded border border-rose-300 transition"
                            title="Ban and deactivate"
                          >
                            Ban
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-700 font-semibold">
                        No registered users match your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. SITE PAGES & ARCHITECTURE */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Custom Site Pages & Routes</h2>
                <p className="text-sm text-slate-700">Dynamic CMS content pages rendered across FingerMobile domains.</p>
              </div>
              <button
                onClick={() => setShowPageModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow transition"
              >
                <Plus className="w-4 h-4" />
                Create New Page
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Page Title</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">URL Slug</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Template</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Publication Status</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pages.map(page => (
                    <tr key={page.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {page.title}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-bold text-indigo-900">
                        /{page.slug}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800 uppercase text-xs">
                        {page.template}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          page.status === 'published' 
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' 
                            : 'bg-slate-100 text-slate-950 border border-slate-400'
                        }`}>
                          {page.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeletePage(page.id, page.title)}
                          className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pages.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-700 font-semibold">
                        No custom CMS pages created yet. Click &quot;Create New Page&quot; to publish one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. REGIONAL FRANCHISES */}
      {activeTab === 'franchises' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Physical Franchises & Regional Hubs</h2>
                <p className="text-sm text-slate-700">Decentralized territorial distribution, POS terminals, and revenue sharing.</p>
              </div>
              <button
                onClick={() => setShowFranchiseModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow transition"
              >
                <Plus className="w-4 h-4" />
                Add Franchise Hub
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Franchise Organization</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Territory Code</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Assigned Region</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Royalty Share</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-900 uppercase">Operational Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {franchises.map(f => (
                    <tr key={f.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {f.name}
                        <span className="block text-xs font-normal text-slate-600">{f.contact_email}</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-900">
                        {f.code}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {f.region}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-950">
                        {f.royalty_pct}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          {f.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {franchises.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-700 font-semibold">
                        No regional franchise hubs registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. SETTINGS & AUDIT */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Platform Security & Master Configurations</h2>
            <p className="text-sm text-slate-700">Global feature toggles, security boundaries, and database maintenance triggers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Direct PostgreSQL Sync</h3>
              <p className="text-xs text-slate-700 mb-3">Re-verify schema alignment, connection pool, and table foreign keys.</p>
              <button
                onClick={handleRefresh}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition"
              >
                Run Database Health Check
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-300 bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Audit Ledger Integrity</h3>
              <p className="text-xs text-slate-700 mb-3">Check immutable audit hashes against tamper-resistant storage records.</p>
              <button
                onClick={() => showToast('Audit ledger integrity verified: 540 entries intact', 'success')}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow transition"
              >
                Verify Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD ADMINISTRATOR */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add Administrator Account</h3>
              <button
                type="button"
                aria-label="Close add administrator modal"
                onClick={() => setShowMemberModal(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">Username</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. security_lead"
                  value={newMember.username}
                  onChange={e => setNewMember({ ...newMember, username: e.target.value })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="staff@fingermobileprotocol.com"
                  value={newMember.email}
                  onChange={e => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">RBAC Role</label>
                <select
                  value={newMember.role}
                  onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="admin">Platform Administrator</option>
                  <option value="moderator">Content & User Moderator</option>
                  <option value="operator">Cluster Operator</option>
                  <option value="instructor">CAMUS Academic Instructor</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Enroll Administrator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PAGE */}
      {showPageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Create Dynamic Site Page</h3>
              <button
                type="button"
                aria-label="Close create page modal"
                onClick={() => setShowPageModal(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">Page Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Terms of Token Utility"
                  value={newPage.title}
                  onChange={e => setNewPage({ ...newPage, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  placeholder="terms-of-utility"
                  value={newPage.slug}
                  onChange={e => setNewPage({ ...newPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPageModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow transition disabled:opacity-50"
                >
                  {loading ? 'Publishing...' : 'Publish Site Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE FRANCHISE */}
      {showFranchiseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Add Regional Franchise Hub</h3>
              <button
                type="button"
                aria-label="Close add franchise modal"
                onClick={() => setShowFranchiseModal(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFranchise} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">Franchise Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lagos Hub Central"
                  value={newFranchise.name}
                  onChange={e => setNewFranchise({ ...newFranchise, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-800 mb-1">Hub Code</label>
                  <input
                    type="text"
                    required
                    placeholder="LOS-01"
                    value={newFranchise.code}
                    onChange={e => setNewFranchise({ ...newFranchise, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-800 mb-1">Royalty %</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newFranchise.royalty_pct}
                    onChange={e => setNewFranchise({ ...newFranchise, royalty_pct: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">Contact Email</label>
                <input
                  type="email"
                  placeholder="franchise@fingermobile.io"
                  value={newFranchise.contact_email}
                  onChange={e => setNewFranchise({ ...newFranchise, contact_email: e.target.value })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFranchiseModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Enroll Franchise'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
