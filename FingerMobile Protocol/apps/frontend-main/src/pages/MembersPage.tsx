import React, { useState } from 'react';
import { Users, Search, Filter, Plus, MoreHorizontal } from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  initials: string;
  initialsBg: string;
  initialsText: string;
  role: string;
  status: 'Active' | 'Pending' | 'Inactive';
  joinDate: string;
}

const INITIAL_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    initials: 'AJ',
    initialsBg: 'bg-blue-100 border border-blue-400',
    initialsText: 'text-blue-900',
    role: 'Admin',
    status: 'Active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria@example.com',
    initials: 'MG',
    initialsBg: 'bg-emerald-100 border border-emerald-400',
    initialsText: 'text-emerald-900',
    role: 'Moderator',
    status: 'Active',
    joinDate: '2024-02-20',
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david@example.com',
    initials: 'DC',
    initialsBg: 'bg-purple-100 border border-purple-400',
    initialsText: 'text-purple-900',
    role: 'Member',
    status: 'Pending',
    joinDate: '2024-03-10',
  },
  {
    id: '4',
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    initials: 'SC',
    initialsBg: 'bg-indigo-100 border border-indigo-400',
    initialsText: 'text-indigo-900',
    role: 'Member',
    status: 'Active',
    joinDate: '2024-03-12',
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james@example.com',
    initials: 'JW',
    initialsBg: 'bg-amber-100 border border-amber-400',
    initialsText: 'text-amber-900',
    role: 'Member',
    status: 'Inactive',
    joinDate: '2024-03-15',
  },
];

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Member');

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    const initials = newMemberName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newMember: Member = {
      id: String(Date.now()),
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      initials: initials || 'NM',
      initialsBg: 'bg-blue-100 border border-blue-400',
      initialsText: 'text-blue-900',
      role: newMemberRole,
      status: 'Active',
      joinDate: new Date().toISOString().slice(0, 10),
    };

    setMembers([newMember, ...members]);
    setNewMemberName('');
    setNewMemberEmail('');
    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: m.status === 'Active' ? 'Inactive' : 'Active',
            }
          : m
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-slate-900 ml-3">Member Management</h1>
            </div>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4 inline mr-1" />
              Add Member
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-6 border border-slate-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Members ({filteredMembers.length})</h2>
            <div className="flex space-x-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-700" />
              </div>
              <div className="relative">
                <button
                  type="button"
                  aria-label="Filter members by role"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="p-2 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Filter className="h-4 w-4" />
                </button>
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-300 rounded-lg shadow-lg z-10 py-1">
                    {['All', 'Admin', 'Moderator', 'Member'].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setRoleFilter(role);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          roleFilter === role
                            ? 'bg-blue-50 text-blue-900 font-bold'
                            : 'text-slate-800 hover:bg-slate-100 font-medium'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Member</th>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 bg-slate-50 text-left text-xs font-bold text-slate-800 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${member.initialsBg} ${member.initialsText}`}>
                          {member.initials}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">{member.name}</div>
                          <div className="text-sm text-slate-700 font-medium">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{member.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(member.id)}
                        title="Click to toggle status"
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full border transition-colors ${
                          member.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                            : member.status === 'Pending'
                            ? 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                            : 'bg-slate-100 text-slate-800 border-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {member.status}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{member.joinDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => setSelectedMember(member)}
                        className="text-blue-600 hover:text-blue-800 font-bold mr-3"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        aria-label={`More options for ${member.name}`}
                        onClick={() => setSelectedMember(member)}
                        className="text-slate-600 hover:text-slate-900 inline-flex items-center p-1 rounded hover:bg-slate-100"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-700 font-medium">
              Showing <span className="font-bold text-slate-900">1</span> to{' '}
              <span className="font-bold text-slate-900">{filteredMembers.length}</span> of{' '}
              <span className="font-bold text-slate-900">{filteredMembers.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 rounded-md border text-sm font-bold transition-colors ${
                  currentPage === 1
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setCurrentPage(2)}
                className={`px-3 py-1 rounded-md border text-sm font-bold transition-colors ${
                  currentPage === 2
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                2
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-300">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Member</h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label htmlFor="member-name" className="block text-xs font-bold text-slate-800 mb-1">
                  Full Name
                </label>
                <input
                  id="member-name"
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="member-email" className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address
                </label>
                <input
                  id="member-email"
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="e.g. jane@example.com"
                  className="w-full px-3 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="member-role" className="block text-xs font-bold text-slate-800 mb-1">
                  Role
                </label>
                <select
                  id="member-role"
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Member">Member</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-800 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-300">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Edit Member: {selectedMember.name}</h3>
            <p className="text-xs text-slate-700 font-medium mb-4">{selectedMember.email}</p>
            <div className="space-y-3">
              <div>
                <label htmlFor="edit-role" className="block text-xs font-bold text-slate-800 mb-1">Role</label>
                <select
                  id="edit-role"
                  value={selectedMember.role}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, role: newRole } : m));
                    setSelectedMember(prev => prev ? { ...prev, role: newRole } : null);
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white"
                >
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Member">Member</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-xs font-bold text-slate-800 mb-1">Status</label>
                <select
                  id="edit-status"
                  value={selectedMember.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as Member['status'];
                    setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, status: newStatus } : m));
                    setSelectedMember(prev => prev ? { ...prev, status: newStatus } : null);
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-4 mt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setSelectedMember(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
