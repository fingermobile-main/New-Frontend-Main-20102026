import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Member {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

const MemberManagementPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { state } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      const userList = Array.isArray(res.data)
        ? res.data
        : (res.data?.users || res.data?.data || []);

      const mapped: Member[] = userList.map((u: any) => ({
        id: String(u.id),
        email: u.email || `${u.username}@fingermobile.io`,
        role: u.role || 'user',
        createdAt: u.createdAt || u.created_at || new Date().toISOString()
      }));

      setMembers(mapped);
      setError(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to load members';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (email: string, role: string) => {
    try {
      const username = email.split('@')[0] || `user_${Date.now()}`;
      await api.post('/admin/members', {
        email,
        role,
        membername: username,
        password: 'DefaultTempPassword2026!'
      });

      showToast('Member added successfully', 'success');
      fetchMembers();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add member';
      showToast(msg, 'error');
    }
  };

  const handleUpdateMember = async (id: string, role: string) => {
    try {
      await api.put(`/admin/members/${id}`, { role });
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === id ? { ...member, role } : member
        )
      );
      showToast('Member role updated successfully', 'success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to update member';
      showToast(msg, 'error');
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await api.delete(`/admin/members/${id}`);
      setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
      showToast('Member deactivated successfully', 'success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to delete member';
      showToast(msg, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Member Management</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Member</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const formData = new FormData(target);
            const email = formData.get('email') as string;
            const role = formData.get('role') as string;

            await handleAddMember(email, role);
            target.reset(); // Safely clear form values after adding
          }}
          className="flex space-x-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="flex-1 p-2 border border-gray-300 rounded"
            required
          />
          <select
            name="role"
            className="p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Member
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Manage Members</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="w-full h-16 border-b border-gray-300 bg-gray-50 text-left">
                <th className="px-4 py-2 font-medium text-gray-600">ID</th>
                <th className="px-4 py-2 font-medium text-gray-600">Email</th>
                <th className="px-4 py-2 font-medium text-gray-600">Role</th>
                <th className="px-4 py-2 font-medium text-gray-600">Created At</th>
                <th className="px-4 py-2 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="h-12 border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-700">{member.id}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{member.email}</td>
                  <td className="px-4 py-2 text-sm">
                    <select
                      value={member.role}
                      onChange={(e) => void handleUpdateMember(member.id, e.target.value)}
                      className="p-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-sm">
                    <button
                      onClick={() => void handleDeleteMember(member.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberManagementPage;
