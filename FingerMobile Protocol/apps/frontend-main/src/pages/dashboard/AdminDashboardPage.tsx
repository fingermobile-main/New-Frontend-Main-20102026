import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { adminOperationsService } from '../../services/adminOperationsService';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import { UserPlus, Plus, X, Shield, CheckCircle2, AlertCircle, Trash2, Edit2, ShieldAlert } from 'lucide-react';

interface MemberItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Pending';
  lastActive: string;
  avatar: string;
}

interface RoleItem {
  id: number;
  name: string;
  permissions: number;
  members: number;
  description: string;
}

const AdminDashboardPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'roles' | 'activity'>('overview');

  const [stats, setStats] = useState([
    {
      title: 'Total Members',
      value: '12,482',
      change: '+12.5%',
      color: 'blue'
    },
    {
      title: 'Protocol Treasury (FIC)',
      value: '1,240,500',
      change: '+8.3%',
      color: 'green'
    },
    {
      title: 'Content Posts',
      value: '42,680',
      change: '+5.7%',
      color: 'purple'
    },
    {
      title: 'Active Node Sessions',
      value: '3,240',
      change: '+3.2%',
      color: 'yellow'
    }
  ]);

  const [members, setMembers] = useState<MemberItem[]>([
    {
      id: 'm-1',
      name: 'Alex Johnson',
      email: 'alex@fingermobile.org',
      role: 'Admin',
      status: 'Active',
      lastActive: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'm-2',
      name: 'Ngozi Eze',
      email: 'ngozi@fingermobile.org',
      role: 'Finance',
      status: 'Active',
      lastActive: '45 mins ago',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'm-3',
      name: 'Tunde Bakare',
      email: 'tunde@fingermobile.org',
      role: 'Moderator',
      status: 'Active',
      lastActive: '10 mins ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
    },
    {
      id: 'm-4',
      name: 'Chinwe Okoro',
      email: 'chinwe@fingermobile.org',
      role: 'Support',
      status: 'Suspended',
      lastActive: '3 days ago',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces'
    }
  ]);

  const [memberSearch, setMemberSearch] = useState('');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Moderator',
    status: 'Active' as 'Active' | 'Suspended' | 'Pending'
  });

  const [roles, setRoles] = useState<RoleItem[]>([
    { id: 1, name: 'Super Admin', permissions: 33, members: 1, description: 'Unrestricted master access to all platform parameters & contracts' },
    { id: 2, name: 'Admin', permissions: 28, members: 5, description: 'Operational oversight across nodes, members, and dispute escalations' },
    { id: 3, name: 'Finance Controller', permissions: 12, members: 3, description: 'Payout disbursement, treasury reconciliation, and fee configuration' },
    { id: 4, name: 'Moderator Arbiter', permissions: 15, members: 12, description: 'Content moderation, UGC approval, and strike adjudication' },
    { id: 5, name: 'Support Agent', permissions: 8, members: 8, description: 'Ticket handling, member verification, and account onboarding assistance' }
  ]);

  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [newRole, setNewRole] = useState({
    name: '',
    permissions: 10,
    description: ''
  });

  const [selectedRoleDetail, setSelectedRoleDetail] = useState<RoleItem | null>(null);

  React.useEffect(() => {
    adminOperationsService.getDashboardStats().then(data => {
      if (data) {
        setStats([
          {
            title: 'Total Members',
            value: data.totalUsers.toLocaleString(),
            change: '+12.5%',
            color: 'blue'
          },
          {
            title: 'Transactions Recorded',
            value: data.totalTransactions.toLocaleString(),
            change: '+8.3%',
            color: 'green'
          },
          {
            title: 'Moderation Items',
            value: `${data.pendingModeration} Pending`,
            change: `${data.totalModeration} total`,
            color: 'purple'
          },
          {
            title: 'Active Sessions',
            value: data.activeSessions.toLocaleString(),
            change: `${data.systemUptime}% uptime`,
            color: 'yellow'
          }
        ]);
      }
    }).catch(() => {});
  }, []);

  const recentActivity = [
    {
      id: 1,
      member: 'Alex Johnson',
      action: 'Authorized settlement batch #PY-8092',
      time: '2 min ago'
    },
    {
      id: 2,
      member: 'Ngozi Eze',
      action: 'Reconciled Interswitch liquidity pool (+₦14.2M)',
      time: '15 min ago'
    },
    {
      id: 3,
      member: 'Tunde Bakare',
      action: 'Adjudicated dispute claim #DP-9912',
      time: '1 hour ago'
    },
    {
      id: 4,
      member: 'Chinwe Okoro',
      action: 'Flagged suspicious KYC submission from IP 102.89.4.12',
      time: '2 hours ago'
    }
  ];

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) {
      showToast?.('Please fill out all member fields', 'error');
      return;
    }
    const item: MemberItem = {
      id: `m-${Date.now()}`,
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      status: newMember.status,
      lastActive: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
    };
    setMembers(prev => [item, ...prev]);
    showToast?.(`New member ${newMember.name} added successfully`, 'success');
    setIsAddMemberOpen(false);
    setNewMember({ name: '', email: '', role: 'Moderator', status: 'Active' });
  };

  const toggleSuspendMember = (id: string) => {
    setMembers(prev =>
      prev.map(m => {
        if (m.id === id) {
          const nextStatus = m.status === 'Active' ? 'Suspended' : 'Active';
          showToast?.(`Member ${m.name} is now ${nextStatus}`, 'info');
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const handleDeleteMember = (id: string, name: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    showToast?.(`Member ${name} removed from platform`, 'info');
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.name) {
      showToast?.('Role name is required', 'error');
      return;
    }
    const role: RoleItem = {
      id: Date.now(),
      name: newRole.name,
      permissions: Number(newRole.permissions) || 5,
      members: 0,
      description: newRole.description || 'Custom administrative governance role'
    };
    setRoles(prev => [...prev, role]);
    showToast?.(`Role ${role.name} created`, 'success');
    setIsAddRoleOpen(false);
    setNewRole({ name: '', permissions: 10, description: '' });
  };

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
        <PlatformOwnershipCard />

        <div className="border-b border-slate-300 pb-5">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin & Governance Console</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">
            Master platform management, role-based access control, and telemetry oversight
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-300 p-6"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">{stat.title}</p>
              <div className="mt-2 flex items-baseline">
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="ml-2 text-xs font-bold text-emerald-800">
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-300 overflow-hidden">
          <div className="border-b border-slate-300 bg-slate-50/50">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'members', label: 'Member Management' },
                { id: 'roles', label: 'Roles & Permissions' },
                { id: 'activity', label: 'Activity Log' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-bold text-sm transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-700'
                      : 'border-transparent text-slate-700 hover:text-slate-900 hover:border-slate-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-black text-slate-900 mb-4">
                      Recent Administrative Stream
                    </h3>
                    <div className="space-y-3">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between py-3.5 px-4 border border-slate-300 rounded-xl bg-slate-50/50 hover:bg-slate-100 transition-colors"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {activity.member}
                            </p>
                            <p className="text-xs font-semibold text-slate-700 mt-0.5">
                              {activity.action}
                            </p>
                          </div>
                          <p className="text-xs font-bold text-slate-600 whitespace-nowrap ml-4">
                            {activity.time}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-4">
                      Protocol Engine Health
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <span className="text-sm font-bold text-slate-900">
                          API Gateway Cluster
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <span className="text-sm font-bold text-slate-900">
                          PostgreSQL & Ledgers
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <span className="text-sm font-bold text-slate-900">
                          Interswitch Settlement Rail
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          Operational
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl">
                        <span className="text-sm font-bold text-slate-900">
                          Biometric Vault Storage
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          Operational
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Member Management Tab */}
            {activeTab === 'members' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="relative w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Search members by name, email, role..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                  <button
                    onClick={() => setIsAddMemberOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add New Member
                  </button>
                </div>

                <div className="overflow-x-auto border border-slate-300 rounded-xl shadow-sm">
                  <table className="min-w-full divide-y divide-slate-300">
                    <thead className="bg-slate-50 border-b border-slate-300">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Member
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Role
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Last Active
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3.5 text-right text-xs font-bold text-slate-800 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredMembers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-slate-700">
                            <p className="font-bold text-slate-900 text-base">No members found</p>
                            <p className="text-sm font-semibold text-slate-700 mt-1">Try adjusting your search criteria</p>
                          </td>
                        </tr>
                      ) : (
                        filteredMembers.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img
                                  className="h-11 w-11 rounded-full border border-slate-300 object-cover flex-shrink-0"
                                  src={m.avatar}
                                  alt={m.name}
                                />
                                <div className="ml-4">
                                  <div className="text-sm font-bold text-slate-900">
                                    {m.name}
                                  </div>
                                  <div className="text-xs font-semibold text-slate-700">
                                    {m.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-950 border border-blue-400">
                                {m.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full ${
                                  m.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                                    : 'bg-rose-100 text-rose-950 border border-rose-400'
                                }`}
                              >
                                {m.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                              {m.lastActive}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold space-x-2">
                              <button
                                type="button"
                                onClick={() => toggleSuspendMember(m.id)}
                                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                  m.status === 'Active'
                                    ? 'border-amber-300 text-amber-900 hover:bg-amber-50'
                                    : 'border-emerald-300 text-emerald-900 hover:bg-emerald-50'
                                }`}
                              >
                                {m.status === 'Active' ? 'Suspend' : 'Unsuspend'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMember(m.id, m.name)}
                                className="px-2.5 py-1 rounded-lg text-xs font-bold border border-rose-300 text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Roles & Permissions Tab */}
            {activeTab === 'roles' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      Configured Administrative Roles
                    </h3>
                    <p className="text-xs font-semibold text-slate-700 mt-0.5">Granular capability matrix for platform operations</p>
                  </div>
                  <button
                    onClick={() => setIsAddRoleOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Role
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="bg-white border border-slate-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-slate-900 text-base">
                            {role.name}
                          </h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-950 border border-blue-400">
                            {role.permissions} permissions
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 mt-2">
                          {role.description}
                        </p>
                        <p className="text-xs font-bold text-slate-900 mt-3">
                          {role.members} assigned members
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <button
                          onClick={() => setSelectedRoleDetail(role)}
                          className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                        >
                          View Details & Permissions →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity Log Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-4">
                  Full Administrative Audit Trail
                </h3>
                <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-sm">
                  <ul className="divide-y divide-slate-200">
                    {recentActivity.map((act) => (
                      <li key={act.id} className="py-3.5 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3.5">
                            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-bold flex items-center justify-center text-xs shrink-0">
                              {act.member.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {act.member}
                              </p>
                              <p className="text-xs font-semibold text-slate-700 mt-0.5">
                                {act.action}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-slate-600 whitespace-nowrap ml-4">
                            {act.time}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE NAVIGATION QUICK DOCK */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5" />
            <span>Overview</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('members')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'members' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-5 h-5 mb-0.5" />
            <span>Members</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddMemberOpen(true)}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <Plus className="w-5 h-5 mb-0.5 text-blue-600" />
            <span>Add</span>
          </button>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span className="text-base font-black leading-none mb-0.5">↑</span>
            <span>Top</span>
          </button>
        </div>
      </div>

      {/* Modal: Add Member */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-300 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-black text-slate-900">Add New Member</h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsAddMemberOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Obioma Adeleke"
                  value={newMember.name}
                  onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. obioma@fingermobile.org"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Finance">Finance</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={newMember.status}
                    onChange={(e) => setNewMember(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddMemberOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
                >
                  Provision Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Role */}
      {isAddRoleOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-300 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-black text-slate-900">Define New Role</h3>
              <button type="button" aria-label="Close"
                onClick={() => setIsAddRoleOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddRole} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Role Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compliance Auditor"
                  value={newRole.name}
                  onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Permissions Count
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={newRole.permissions}
                  onChange={(e) => setNewRole(prev => ({ ...prev, permissions: parseInt(e.target.value) || 1 }))}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Role Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe scope of authority..."
                  value={newRole.description}
                  onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddRoleOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Role Details */}
      {selectedRoleDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-300 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-black text-slate-900">{selectedRoleDetail.name} Details</h3>
              <button type="button" aria-label="Close"
                onClick={() => setSelectedRoleDetail(null)}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">Scope Description</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{selectedRoleDetail.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700">Granted Permissions</p>
                  <p className="text-xl font-black text-slate-900 mt-1">{selectedRoleDetail.permissions}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700">Active Assignees</p>
                  <p className="text-xl font-black text-slate-900 mt-1">{selectedRoleDetail.members}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setSelectedRoleDetail(null)}
                  className="px-5 py-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
