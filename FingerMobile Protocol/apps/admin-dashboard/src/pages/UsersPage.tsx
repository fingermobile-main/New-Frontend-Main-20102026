import React, { useState, useEffect } from 'react';
import { mockApi, type User } from '../services/mockApi';
import DataTable from '../components/DataTable';
import Card from '../components/Card';
import { Button } from '../components/Button';

interface UserWithDetails extends User {
  registrationDate: string;
  lastActive: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
  storeCreditBalance?: number;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const totalPages = 10; // Mock total pages

  // Edit User Details State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserWithDetails | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'admin' | 'user' | 'moderator'>('user');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'pending'>('active');
  const [editStoreCredit, setEditStoreCredit] = useState<number>(0);

  // Delete User State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserWithDetails | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isPermanentDelete, setIsPermanentDelete] = useState(true);

  // Create User State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user' | 'moderator'>('user');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    try {
      setIsCreatingUser(true);
      const generatedUsername = newName.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: generatedUsername,
          email: newEmail.trim(),
          role: newRole,
          status: 'ACTIVE'
        })
      });
      const data = await res.json().catch(() => ({}));
      const createdId = data?.member?.id || data?.user?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-0000-0000-${Date.now().toString().padStart(12, '0')}`);

      const newUser: UserWithDetails = {
        id: String(createdId),
        name: newName.trim(),
        email: newEmail.trim(),
        role: newRole,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        registrationDate: new Date().toISOString().split('T')[0],
        lastActive: 'Just now',
        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        storeCreditBalance: 0
      };

      setUsers(prev => [newUser, ...prev]);
      setShowCreateModal(false);
      setNewName('');
      setNewEmail('');
      setNewRole('user');
    } catch (err: any) {
      setError(err?.message || 'Failed to create user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        let fetchedUsers: UserWithDetails[] = [];
        try {
          const res = await fetch('/api/admin/users');
          if (res && res.json) {
            const json = await res.json();
            if (json && json.success && Array.isArray(json.users)) {
              fetchedUsers = json.users.map((u: any) => ({
                id: String(u.id || u.uuid),
                name: u.username || u.name || 'Member',
                email: u.email || '',
                role: (u.role || 'user').toLowerCase(),
                status: (u.status || 'active').toLowerCase(),
                createdAt: (u.createdAt || u.created_at || new Date().toISOString()).split('T')[0],
                registrationDate: (u.createdAt || u.created_at || new Date().toISOString()).split('T')[0],
                lastActive: (u.updatedAt || u.updated_at || 'Recently').toString().split('T')[0],
                postCount: 0,
                followerCount: 0,
                followingCount: 0,
                storeCreditBalance: Number(u.storeCreditBalance || u.fiatBalance || 0)
              }));
            }
          }
        } catch {
          // Fallback to mockApi if fetch fails or is not mocked
        }

        if (fetchedUsers.length === 0) {
          const mockUsers = await mockApi.getUsers();
          if (Array.isArray(mockUsers)) {
            fetchedUsers = mockUsers.map((u: any) => ({
              id: String(u.id),
              name: u.name,
              email: u.email,
              role: u.role || 'user',
              status: u.status || 'active',
              createdAt: u.createdAt || new Date().toISOString().split('T')[0],
              registrationDate: u.createdAt || new Date().toISOString().split('T')[0],
              lastActive: 'Recently',
              postCount: 0,
              followerCount: 0,
              followingCount: 0,
              storeCreditBalance: 0
            }));
          }
        }

        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to fetch users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, searchTerm]);

  const handleViewUser = (user: UserWithDetails) => {
    setSelectedUser(user);
  };

  const handleEditUser = (user: UserWithDetails) => {
    setEditUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role as any);
    setEditStatus(user.status as any);
    setEditStoreCredit(user.storeCreditBalance || 0);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      await fetch(`/api/admin/users/${editUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
          status: editStatus,
          storeCreditBalance: editStoreCredit
        })
      });
      setUsers(prev => prev.map(u => u.id === editUser.id ? {
        ...u,
        name: editName,
        email: editEmail,
        role: editRole,
        status: editStatus,
        storeCreditBalance: editStoreCredit
      } : u));
      setIsEditModalOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = (user: UserWithDetails) => {
    if (user.id === '1' || user.id === '00000000-0000-0000-0000-000000000000' || user.role === 'admin' && (user.id === '1' || user.name.includes('protocol') || user.name.includes('israel'))) {
      alert('Root administrator founder account cannot be deleted.');
      return;
    }
    setUserToDelete(user);
    setDeleteConfirmText('');
    setIsPermanentDelete(true);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await fetch(`/api/admin/users/${userToDelete.id}?permanent=${isPermanentDelete}`, {
        method: 'DELETE'
      });
      if (isPermanentDelete) {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      } else {
        setUsers(prev => prev.map(u => u.id === userToDelete.id ? { ...u, status: 'inactive' } : u));
      }
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete user');
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SUSPENDED' })
      });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'inactive' } : u));
    } catch (err) {
      setError('Failed to suspend user');
      console.error(err);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACTIVE' })
      });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'active' } : u));
    } catch (err) {
      setError('Failed to activate user');
      console.error(err);
    }
  };

  const userColumns = [
    { key: 'name' as keyof UserWithDetails, label: 'Name' },
    { key: 'email' as keyof UserWithDetails, label: 'Email' },
    { key: 'role' as keyof UserWithDetails, label: 'Role' },
    {
      key: 'status' as keyof UserWithDetails,
      label: 'Status',
      render: (value: any) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          (typeof value === 'string' && value === 'active')
            ? 'bg-green-100 text-green-950'
            : (typeof value === 'string' && value === 'pending')
              ? 'bg-yellow-100 text-green-950'
              : 'bg-gray-100 text-green-950'
        }border border-green-400 font-black`}>
          {typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : String(value ?? '')}
        </span>
      )
    },
    {
      key: 'storeCreditBalance' as keyof UserWithDetails,
      label: 'Store Credit',
      render: (val: any) => (
        <span className="font-mono font-bold text-emerald-600">
          ${(Number(val) || 0).toFixed(2)}
        </span>
      )
    },
    { key: 'registrationDate' as keyof UserWithDetails, label: 'Registration Date' },
    { key: 'lastActive' as keyof UserWithDetails, label: 'Last Active' },
    { key: 'postCount' as keyof UserWithDetails, label: 'Posts' },
    {
      key: 'id' as keyof UserWithDetails,
      label: 'Actions',
      render: (_value: any, row: UserWithDetails) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewUser(row)}
            className="text-blue-600 hover:text-blue-900"
          >
            View
          </button>
          <button
            onClick={() => handleEditUser(row)}
            className="text-green-600 hover:text-green-900"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(row)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
          {row.status === 'active' ? (
            <button
              onClick={() => handleSuspendUser(row.id)}
              className="text-amber-600 hover:text-amber-900"
            >
              Suspend
            </button>
          ) : (
            <button
              onClick={() => handleActivateUser(row.id)}
              className="text-green-600 hover:text-green-900"
            >
              Activate
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user accounts and permissions
        </p>
      </div>

      <Card
        title="Users List"
        headerActions={
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <Button onClick={() => setShowCreateModal(true)}>
              Add New User
            </Button>
          </div>
        }
      >
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}
        <DataTable
          columns={userColumns}
          data={users}
          isLoading={loading}
          emptyMessage="No users found"
        />

        {/* Pagination controls */}
        <div className="flex items-center justify-between border-t border-slate-300 bg-white px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{' '}
                <span className="font-medium">{Math.min(currentPage * 10, users.length)}</span> of{' '}
                <span className="font-medium">{users.length}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>

                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, Math.min(currentPage - 2, totalPages - 4)) + i;
                  if (pageNum <= totalPages) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          currentPage === pageNum
                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </Card>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create New User</h3>
              <div className="mt-2 px-7 py-3">
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as any)}
                      className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 font-bold border-slate-300 focus:ring-2"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingUser}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isCreatingUser ? 'Creating...' : 'Create User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {selectedUser.name} Details
              </h3>
              <div className="mt-2 px-7 py-3 text-left">
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedUser.name}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Role:</strong> {selectedUser.role}</p>
                  <p><strong>Status:</strong> {selectedUser.status}</p>
                  <p><strong>Store Credit:</strong> ${(selectedUser.storeCreditBalance || 0).toFixed(2)}</p>
                  <p><strong>Created:</strong> {selectedUser.createdAt}</p>
                  <p><strong>Registration Date:</strong> {selectedUser.registrationDate}</p>
                  <p><strong>Last Active:</strong> {selectedUser.lastActive}</p>
                  <p><strong>Posts:</strong> {selectedUser.postCount}</p>
                  <p><strong>Followers:</strong> {selectedUser.followerCount}</p>
                  <p><strong>Following:</strong> {selectedUser.followingCount}</p>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={() => setSelectedUser(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Account Details Modal */}
      {isEditModalOpen && editUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                Edit User Account Details
              </h3>
              <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as any)}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-bold border-slate-300 focus:ring-2"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-bold border-slate-300 focus:ring-2"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Store Credit ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editStoreCredit}
                    onChange={e => setEditStoreCredit(parseFloat(e.target.value) || 0)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 sm:text-sm font-mono focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                  />
                  <p className="text-xs text-slate-700 mt-1">25% split from platform earnings algorithm</p>
                </div>
                <div className="flex justify-end space-x-3 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Account Modal */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg leading-6 font-medium text-red-600 text-center">
                Delete User Account
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <p>Are you sure you want to delete <strong>{userToDelete.name}</strong> ({userToDelete.email})?</p>
                <div className="mt-3 space-y-2">
                  <label className="flex items-center text-xs text-gray-700">
                    <input
                      type="radio"
                      name="deleteOpt"
                      checked={isPermanentDelete}
                      onChange={() => setIsPermanentDelete(true)}
                      className="mr-2 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                    Permanent Purge (Delete from Database & Store Credit records)
                  </label>
                  <label className="flex items-center text-xs text-gray-700">
                    <input
                      type="radio"
                      name="deleteOpt"
                      checked={!isPermanentDelete}
                      onChange={() => setIsPermanentDelete(false)}
                      className="mr-2 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                    Soft Deactivation (Suspend user account)
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700">
                    Type <strong>{userToDelete.name}</strong> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={e => setDeleteConfirmText(e.target.value)}
                    placeholder={userToDelete.name}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 text-sm focus:ring-red-500 focus:border-red-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== userToDelete.name}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
                >
                  {isPermanentDelete ? 'Permanently Delete' : 'Deactivate User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;