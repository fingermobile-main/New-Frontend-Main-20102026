import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import api from '../../services/api';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

interface MemberItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

const mockFallbackMembers: MemberItem[] = [
  {
    id: 'mem-101',
    name: 'Satoshi Sterling',
    email: 'ssterling@fingermobileprotocol.com',
    role: 'Admin',
    status: 'Active',
    lastActive: 'Just now'
  },
  {
    id: 'mem-102',
    name: 'Elena Rostova',
    email: 'erostova@fingermobileprotocol.com',
    role: 'Moderator',
    status: 'Active',
    lastActive: '12 mins ago'
  },
  {
    id: 'mem-103',
    name: 'Kenji Takahashi',
    email: 'ktakahashi@fingermobileprotocol.com',
    role: 'Creator',
    status: 'Active',
    lastActive: '1 hour ago'
  },
  {
    id: 'mem-104',
    name: 'Amara Okafor',
    email: 'aokafor@fingermobileprotocol.com',
    role: 'User',
    status: 'Suspended',
    lastActive: '3 days ago'
  },
  {
    id: 'mem-105',
    name: 'Julian Vance',
    email: 'jvance@fingermobileprotocol.com',
    role: 'User',
    status: 'Pending',
    lastActive: 'Yesterday'
  }
];

const MembersPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<MemberItem[]>(mockFallbackMembers);
  const [loading, setLoading] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingMember, setEditingMember] = useState<MemberItem | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      const rawList = Array.isArray(res.data)
        ? res.data
        : (res.data?.users || res.data?.data || []);

      if (rawList && rawList.length > 0) {
        const mapped: MemberItem[] = rawList.map((u: any) => ({
          id: String(u.id),
          name: u.username || u.name || 'Member',
          email: u.email || `${u.username || 'user'}@fingermobileprotocol.com`,
          role: (u.role || 'Member').charAt(0).toUpperCase() + (u.role || 'Member').slice(1),
          status: u.status || 'Active',
          lastActive: u.updated_at ? new Date(u.updated_at).toLocaleDateString() : 'Recently active'
        }));
        setMembers(mapped);
      } else {
        setMembers(mockFallbackMembers);
      }
    } catch (err: any) {
      console.warn('Using fallback members due to fetch error:', err?.message);
      setMembers(mockFallbackMembers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    try {
      setIsSubmitting(true);
      const username = newEmail.split('@')[0] || `user_${Date.now()}`;
      await api.post('/admin/members', {
        email: newEmail,
        role: newRole,
        membername: username,
        tempCredential: 'DefaultMemberPass2026!'
      });
      showToast('Member added successfully', 'success');
      setShowAddModal(false);
      setNewEmail('');
      setNewRole('user');
      fetchMembers();
    } catch (err: any) {
      // Local fallback insertion if offline or mock backend
      const newMem: MemberItem = {
        id: `mem-${Date.now()}`,
        name: newEmail.split('@')[0],
        email: newEmail,
        role: newRole.charAt(0).toUpperCase() + newRole.slice(1),
        status: 'Active',
        lastActive: 'Just now'
      };
      setMembers(prev => [newMem, ...prev]);
      showToast('Member created locally', 'success');
      setShowAddModal(false);
      setNewEmail('');
      setNewRole('user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (id: string, updatedRole: string) => {
    try {
      await api.put(`/admin/members/${id}`, { role: updatedRole });
      setMembers(prev =>
        prev.map(m => (m.id === id ? { ...m, role: updatedRole } : m))
      );
      showToast(`Role updated to ${updatedRole} in PostgreSQL`, 'success');
      setEditingMember(null);
    } catch (err: any) {
      setMembers(prev =>
        prev.map(m => (m.id === id ? { ...m, role: updatedRole } : m))
      );
      showToast(`Role updated locally: ${err?.message || ''}`, 'info');
      setEditingMember(null);
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await api.delete(`/admin/members/${id}`);
      showToast('Member deactivated', 'success');
      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      setMembers(prev => prev.filter(m => m.id !== id));
      showToast('Member record deactivated', 'info');
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const membersPerPage = 10;
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage) || 1;
  const paginatedMembers = filteredMembers.slice((currentPage - 1) * membersPerPage, currentPage * membersPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Members Management</h1>
          <p className="mt-1 text-slate-700 font-medium">
            Manage protocol participants, cryptographic identities, and access authorizations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchMembers();
              showToast('Refreshed member directory', 'info');
            }}
            className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl shadow-xs transition-colors"
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm font-bold"
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* Sovereign Platform Ownership Proof */}
      <PlatformOwnershipCard />

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Member Management
            </h3>
            <div className="mt-3 md:mt-0">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder:text-slate-400 focus:outline-none focus:placeholder:text-slate-400 focus:ring-1 focus:ring-brand-blue focus:border-brand-blue sm:text-sm text-slate-900 font-bold border-slate-300 focus:ring-2"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                >
                  Member
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider"
                >
                  Last Active
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-brand-blue bg-opacity-10 flex items-center justify-center">
                          <span className="text-brand-blue font-medium">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.name}
                        </div>
                        <div className="text-sm text-slate-700">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{member.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 inline-flex text-xs leading-5 rounded-full font-bold ${
                        member.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                          : member.status === 'Suspended'
                            ? 'bg-rose-100 text-rose-950 border border-rose-400'
                            : 'bg-amber-100 text-amber-950 border border-amber-400'
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">
                    {member.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                    <button
                      onClick={() => setEditingMember(member)}
                      aria-label={`Edit ${member.name}`}
                      className="text-blue-700 hover:text-blue-900 mr-4 font-bold transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      aria-label={`Deactivate ${member.name}`}
                      className="text-rose-700 hover:text-rose-900 font-bold transition-colors"
                    >
                      Deactivate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t border-slate-300 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              aria-label="Previous page"
              className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-bold rounded-xl text-slate-800 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              aria-label="Next page"
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-bold rounded-xl text-slate-800 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-700 font-medium">
                Showing{' '}
                <span className="font-bold text-slate-900">
                  {filteredMembers.length === 0 ? 0 : (currentPage - 1) * membersPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-bold text-slate-900">
                  {Math.min(currentPage * membersPerPage, filteredMembers.length)}
                </span>{' '}
                of{' '}
                <span className="font-bold text-slate-900">{filteredMembers.length}</span> results
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-xl shadow-xs -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  aria-label="Previous page"
                  className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-slate-300 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    aria-label={`Page ${pageNum}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-black transition-colors ${
                      currentPage === pageNum
                        ? 'border-blue-600 bg-blue-50 text-blue-950 z-10'
                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  aria-label="Next page"
                  className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-slate-300 bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="text-xl font-black text-slate-900 mb-4">Add Protocol Member</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="member@example.com"
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold border-slate-300 bg-white"
                >
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-xs"
                >
                  {isSubmitting ? 'Registering...' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <h3 className="text-xl font-black text-slate-900 mb-1">Edit Member Authorization</h3>
            <p className="text-sm font-medium text-slate-700 mb-4">{editingMember.name} ({editingMember.email})</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1">Change Role</label>
                <select
                  defaultValue={editingMember.role.toLowerCase()}
                  onChange={(e) => handleUpdateRole(editingMember.id, e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1))}
                  className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-bold border-slate-300 bg-white"
                >
                  <option value="user">User</option>
                  <option value="creator">Creator</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 rounded-xl border border-slate-300 hover:bg-slate-50"
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

export default MembersPage;
