import React, { useState, useEffect } from 'react';
import {
  Users,
  User as UserIcon,
  Mail,
  Phone,
  Edit3,
  Trash2,
  Search,
  MoreHorizontal,
  Activity,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  X,
  Shield,
  ShieldCheck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

interface PlatformUser {
  id: number;
  uuid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  role: string;
  status: string;
  lastLoginAt?: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  fiatBalance?: number;
  cryptoBalance?: number;
  aiCredits?: number;
  cesScore?: number;
  strikes?: number;
}

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUserForActivity, setSelectedUserForActivity] = useState<PlatformUser | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    role: 'user',
    status: 'active'
  });

  const navigate = useNavigate();

  // Fetch users from API with fallback
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/users');
        const raw = res?.data?.users || res?.data?.data || res?.data;
        if (Array.isArray(raw) && raw.length > 0) {
          const mapped: PlatformUser[] = raw.map((u: any, idx: number) => ({
            id: u.id || idx + 1,
            uuid: u.uuid || `uuid-${idx + 1}`,
            email: u.email || 'user@example.com',
            firstName: u.firstName || u.first_name || u.name?.split(' ')[0] || 'User',
            lastName: u.lastName || u.last_name || u.name?.split(' ')[1] || '',
            username: u.username || `user${u.id || idx + 1}`,
            phone: u.phone || '+234800000000',
            role: u.role || 'user',
            status: u.status || 'active',
            lastLoginAt: u.lastLoginAt || u.last_login_at || new Date().toISOString(),
            emailVerified: Boolean(u.emailVerified || u.email_verified),
            createdAt: u.createdAt || u.created_at || new Date().toISOString(),
            updatedAt: u.updatedAt || u.updated_at || new Date().toISOString(),
            fiatBalance: parseFloat(u.fiatBalance || u.fiat_balance || 0),
            cryptoBalance: parseFloat(u.cryptoBalance || u.crypto_balance || 0),
            aiCredits: parseInt(u.aiCredits || u.ai_credits || 0, 10),
            cesScore: parseInt(u.cesScore || u.ces_score || 80, 10),
            strikes: parseInt(u.strikes || 0, 10)
          }));
          setUsers(mapped);
          setFilteredUsers(mapped);
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local default users
      }

      const mockUsers: PlatformUser[] = [
        {
          id: 1,
          uuid: 'uuid-1',
          email: 'admin@fingermobileprotocol.com',
          firstName: 'Chidi',
          lastName: 'Nnamdi',
          username: 'chidi_admin',
          phone: '+2348012345678',
          role: 'admin',
          status: 'active',
          lastLoginAt: '2026-10-14T10:30:00Z',
          emailVerified: true,
          createdAt: '2026-01-01T00:00:00Z',
          updatedAt: '2026-10-14T10:30:00Z',
          fiatBalance: 24500,
          cryptoBalance: 1250,
          aiCredits: 500,
          cesScore: 98,
          strikes: 0
        },
        {
          id: 2,
          uuid: 'uuid-2',
          email: 'moderator@fingermobileprotocol.com',
          firstName: 'Zainab',
          lastName: 'Al-Mansoor',
          username: 'zainab_mod',
          phone: '+2348098765432',
          role: 'moderator',
          status: 'active',
          lastLoginAt: '2026-10-14T09:15:00Z',
          emailVerified: true,
          createdAt: '2026-02-01T00:00:00Z',
          updatedAt: '2026-10-14T09:15:00Z',
          fiatBalance: 12000,
          cryptoBalance: 450,
          aiCredits: 250,
          cesScore: 92,
          strikes: 0
        },
        {
          id: 3,
          uuid: 'uuid-3',
          email: 'merchant.hub@fingermobileprotocol.com',
          firstName: 'David',
          lastName: 'Adeleke',
          username: 'david_merchant',
          phone: '+2348112233445',
          role: 'user',
          status: 'active',
          lastLoginAt: '2026-10-13T15:30:00Z',
          emailVerified: true,
          createdAt: '2026-03-01T00:00:00Z',
          updatedAt: '2026-10-13T15:30:00Z',
          fiatBalance: 8400,
          cryptoBalance: 980,
          aiCredits: 120,
          cesScore: 84,
          strikes: 0
        },
        {
          id: 4,
          uuid: 'uuid-4',
          email: 'flagged.user@fingermobileprotocol.com',
          firstName: 'Amina',
          lastName: 'Yusuf',
          username: 'amina_y',
          phone: '+2348055667788',
          role: 'user',
          status: 'suspended',
          lastLoginAt: '2026-10-10T08:00:00Z',
          emailVerified: false,
          createdAt: '2026-04-09T08:00:00Z',
          updatedAt: '2026-10-10T08:00:00Z',
          fiatBalance: 50,
          cryptoBalance: 0,
          aiCredits: 10,
          cesScore: 35,
          strikes: 2
        }
      ];

      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  // Filter users based on search term and filters
  useEffect(() => {
    let result = users;

    if (searchTerm) {
      result = result.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== 'all') {
      result = result.filter(user => user.role === filterRole);
    }

    if (filterStatus !== 'all') {
      result = result.filter(user => user.status === filterStatus);
    }

    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus, users]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleCreateUser = () => {
    const created: PlatformUser = {
      id: Date.now(),
      uuid: `uuid-${Date.now()}`,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      username: newUser.username || newUser.email.split('@')[0],
      phone: newUser.phone,
      role: newUser.role,
      status: newUser.status,
      lastLoginAt: null,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fiatBalance: 0,
      cryptoBalance: 0,
      aiCredits: 50,
      cesScore: 100,
      strikes: 0
    };

    setUsers(prev => [created, ...prev]);
    setShowCreateModal(false);
    setNewUser({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      username: '',
      phone: '',
      role: 'user',
      status: 'active'
    });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusChange = (userId: number, newStatus: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'active':
      return 'bg-emerald-100 text-emerald-950 border border-emerald-400';
    case 'inactive':
      return 'bg-slate-100 text-slate-800 border border-slate-300';
    case 'suspended':
      return 'bg-amber-100 text-amber-950 border border-amber-400';
    case 'deleted':
      return 'bg-rose-100 text-rose-950 border border-rose-400';
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-300';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-950 border border-purple-400';
    case 'moderator':
      return 'bg-blue-100 text-blue-950 border border-blue-400';
    case 'user':
      return 'bg-slate-100 text-slate-800 border border-slate-300';
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">User Management Console</h1>
              <p className="text-xs text-slate-700 mt-0.5">Manage identity accounts, permissions, balances, and governance access</p>
            </div>
          </div>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center shadow-sm transition-colors"
            onClick={() => setShowCreateModal(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        <PlatformOwnershipCard />

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-600" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                className="block w-full pl-9 pr-3 py-2 text-slate-900 font-medium placeholder:text-slate-400 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="block w-full px-3 py-2 text-slate-900 font-medium border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>

            <select
              className="block w-full px-3 py-2 text-slate-900 font-medium border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="deleted">Deleted</option>
            </select>

            <div className="flex items-center justify-end">
              <span className="text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-950 rounded-full border border-slate-400 font-black">
                {filteredUsers.length} Users Listed
              </span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 border-b border-slate-300">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Member Identity
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Contact Channels
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Ecosystem Assets
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Administrative Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-700 font-medium">
                      No members found matching filter criteria.
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-bold flex items-center justify-center  text-sm   font-black">
                            <UserIcon className="h-5 w-5" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-bold text-slate-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-xs text-slate-700 font-medium">
                              @{user.username || 'unassigned'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900 font-medium flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-600" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-xs text-slate-700 flex items-center gap-1.5 mt-1">
                            <Phone className="h-3.5 w-3.5 text-slate-600" />
                            {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-800 font-medium">
                        <div>FIC / Fiat: <span className="font-bold text-slate-900">{user.fiatBalance || 0}</span></div>
                        <div>Crypto: <span className="font-bold text-slate-900">{user.cryptoBalance || 0}</span></div>
                        <div>Credits: <span className="font-bold text-slate-900">{user.aiCredits || 0}</span></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700 font-medium">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            title="Inspect Member Activity & Enclave Credentials"
                            className="p-1.5 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded"
                            onClick={() => setSelectedUserForActivity(user)}
                          >
                            <Activity className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Edit Role / Status"
                            className="p-1.5 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded"
                            onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title="Remove Account"
                            className="p-1.5 text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                            className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded"
                            onClick={() => handleStatusChange(user.id, user.status === 'active' ? 'suspended' : 'active')}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-slate-50 px-4 py-3 flex items-center justify-between border-t border-slate-300 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 text-sm font-semibold rounded-md bg-white text-slate-800 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 px-4 py-2 border border-slate-300 text-sm font-semibold rounded-md bg-white text-slate-800 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-slate-700 font-medium">
                    Showing <span className="font-bold text-slate-900">{indexOfFirstUser + 1}</span> to{' '}
                    <span className="font-bold text-slate-900">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of{' '}
                    <span className="font-bold text-slate-900">{filteredUsers.length}</span> members
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded text-xs font-bold border ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Member Activity & Enclave Credentials Modal */}
      {selectedUserForActivity && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto p-6 border border-slate-300 w-full max-w-2xl shadow-2xl rounded-2xl bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-950 border border-blue-400 rounded-xl font-black">
                  <UserIcon className="h-6 w-6 text-blue-800" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">
                      {selectedUserForActivity.firstName} {selectedUserForActivity.lastName}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getRoleColor(selectedUserForActivity.role)}`}>
                      {selectedUserForActivity.role.toUpperCase()}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(selectedUserForActivity.status)}`}>
                      {selectedUserForActivity.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-semibold mt-0.5">
                    @{selectedUserForActivity.username} • {selectedUserForActivity.email} • ID: #{selectedUserForActivity.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setSelectedUserForActivity(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-5">
              {/* Balances & Assets KPI Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Fiat Balance</span>
                  <span className="text-lg font-black text-slate-900">${(selectedUserForActivity.fiatBalance || 0).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Crypto FIC</span>
                  <span className="text-lg font-black text-slate-900">{(selectedUserForActivity.cryptoBalance || 0).toLocaleString()} FIC</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">AI Inference Credits</span>
                  <span className="text-lg font-black text-slate-900">{selectedUserForActivity.aiCredits || 0} Credits</span>
                </div>
              </div>

              {/* CES Trust Score & Strikes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-300 rounded-xl bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">CES Sovereign Trust Rating</span>
                    <span className="text-xs font-black text-emerald-950 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded">
                      {selectedUserForActivity.cesScore || 90}/100
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-300">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${selectedUserForActivity.cesScore || 90}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium">Attested through decentralized biometric enclave validator</p>
                </div>

                <div className="p-4 border border-slate-300 rounded-xl bg-white space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">Moderation Strikes</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      (selectedUserForActivity.strikes || 0) >= 2
                        ? 'bg-rose-100 text-rose-950 border-rose-400 font-bold'
                        : 'bg-slate-100 text-slate-900 border-slate-300 font-bold'
                    }`}>
                      {selectedUserForActivity.strikes || 0} of 3 Strikes
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...selectedUserForActivity, strikes: 0 };
                        setSelectedUserForActivity(updated);
                        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded border border-slate-300 transition-colors"
                    >
                      Clear Strikes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...selectedUserForActivity, strikes: Math.min((selectedUserForActivity.strikes || 0) + 1, 3) };
                        setSelectedUserForActivity(updated);
                        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
                      }}
                      className="px-2.5 py-1 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-950 rounded border border-amber-400 transition-colors"
                    >
                      Issue Warning Strike
                    </button>
                  </div>
                </div>
              </div>

              {/* Protocol Telemetry Stream */}
              <div className="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-2.5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Member Audit Telemetry</h4>
                <div className="space-y-2 text-xs text-slate-800">
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                    <span className="font-semibold text-slate-900">Enclave Biometric Verification</span>
                    <span className="text-emerald-800 font-bold">Hardware Attested</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                    <span className="font-semibold text-slate-900">Last Session Origin</span>
                    <span className="text-slate-700 font-mono font-medium">{selectedUserForActivity.lastLoginAt ? new Date(selectedUserForActivity.lastLoginAt).toLocaleString() : 'Active session'}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-white border border-slate-200">
                    <span className="font-semibold text-slate-900">Account Age / Provisioned</span>
                    <span className="text-slate-700 font-mono font-medium">{new Date(selectedUserForActivity.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleRoleChange(selectedUserForActivity.id, selectedUserForActivity.role === 'admin' ? 'user' : 'admin');
                    setSelectedUserForActivity(prev => prev ? { ...prev, role: prev.role === 'admin' ? 'user' : 'admin' } : null);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-purple-100 text-purple-950 border border-purple-400 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  Toggle Admin Role
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newSt = selectedUserForActivity.status === 'active' ? 'suspended' : 'active';
                    handleStatusChange(selectedUserForActivity.id, newSt);
                    setSelectedUserForActivity(prev => prev ? { ...prev, status: newSt } : null);
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-amber-100 text-amber-950 border border-amber-400 rounded-lg hover:bg-amber-200 transition-colors"
                >
                  {selectedUserForActivity.status === 'active' ? 'Suspend Account' : 'Reactivate Account'}
                </button>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
                onClick={() => setSelectedUserForActivity(null)}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative mx-auto p-6 border border-slate-300 w-full max-w-md shadow-2xl rounded-xl bg-white">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">Provision Member Account</h3>
              <button
                type="button"
                className="text-slate-600 hover:text-slate-900 p-1 rounded"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }} className="mt-4 space-y-4">
              <div>
                <label className="block text-slate-800 text-xs font-bold mb-1" htmlFor="email">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full py-2 px-3 text-slate-900 font-bold border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-slate-800 text-xs font-bold mb-1" htmlFor="password">
                  Initial Temporary Password *
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full py-2 px-3 text-slate-900 font-bold border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 text-xs font-bold mb-1" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full py-2 px-3 text-slate-900 font-bold border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-800 text-xs font-bold mb-1" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full py-2 px-3 text-slate-900 font-bold border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-800 text-xs font-bold mb-1" htmlFor="role">
                    Platform Role
                  </label>
                  <select
                    id="role"
                    className="w-full py-2 px-3 text-slate-900 font-bold border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-800 text-xs font-bold mb-1" htmlFor="status">
                    Initial Status
                  </label>
                  <select
                    id="status"
                    className="w-full py-2 px-3 text-slate-900 font-bold border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
                >
                  Create Member Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
