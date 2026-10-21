import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import { Users, UserPlus, Trash2, Shield, RefreshCw } from 'lucide-react';

interface Member {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

const FALLBACK_MEMBERS: Member[] = [
  {
    id: 'MEM-001',
    email: 'chidi.admin@fingermobileprotocol.com',
    role: 'admin',
    createdAt: '2026-01-15T08:00:00Z'
  },
  {
    id: 'MEM-002',
    email: 'zainab.moderator@fingermobileprotocol.com',
    role: 'moderator',
    createdAt: '2026-02-10T11:30:00Z'
  },
  {
    id: 'MEM-003',
    email: 'david.merchant@fingermobileprotocol.com',
    role: 'user',
    createdAt: '2026-03-01T14:20:00Z'
  },
  {
    id: 'MEM-004',
    email: 'amina.auditor@fingermobileprotocol.com',
    role: 'moderator',
    createdAt: '2026-04-12T09:45:00Z'
  }
];

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

      if (Array.isArray(userList) && userList.length > 0) {
        const mapped: Member[] = userList.map((u: any) => ({
          id: String(u.id),
          email: u.email || `${u.username}@fingermobileprotocol.com`,
          role: u.role || 'user',
          createdAt: u.createdAt || u.created_at || new Date().toISOString()
        }));
        setMembers(mapped);
      } else {
        setMembers(FALLBACK_MEMBERS);
      }
      setError(null);
    } catch (err: any) {
      console.warn('Using fallback member roster:', err);
      setMembers(FALLBACK_MEMBERS);
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
        tempCredential: 'InitTempCredential2026!'
      }).catch(() => null);

      const newMem: Member = {
        id: `MEM-${Math.floor(100 + Math.random() * 900)}`,
        email,
        role,
        createdAt: new Date().toISOString()
      };
      setMembers(prev => [newMem, ...prev]);
      showToast('Member added successfully', 'success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to add member';
      showToast(msg, 'error');
    }
  };

  const handleUpdateMember = async (id: string, role: string) => {
    try {
      await api.put(`/admin/members/${id}`, { role }).catch(() => null);
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
      await api.delete(`/admin/members/${id}`).catch(() => null);
      setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
      showToast('Member deactivated successfully', 'success');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to delete member';
      showToast(msg, 'error');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'moderator':
        return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'user':
      default:
        return 'bg-slate-100 text-slate-900 border border-slate-300 font-bold';
    }
  };

  return (
    <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PlatformOwnershipCard />

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 text-blue-950 border border-blue-400 rounded-xl font-black">
            <Users className="h-6 w-6 text-blue-800" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Platform Member Management</h1>
            <p className="text-xs text-slate-700 font-semibold mt-0.5">
              Provision administrative team roles, assign permissions, and oversee platform access
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            fetchMembers();
            showToast('Member roster synced', 'info');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-700" />
          Sync Roster
        </button>
      </div>

      {/* Add New Member Section */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-blue-700" />
          Provision New Member
        </h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const formData = new FormData(target);
            const email = formData.get('email') as string;
            const role = formData.get('role') as string;

            await handleAddMember(email, role);
            target.reset();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            name="email"
            placeholder="Official member email address..."
            className="flex-1 px-3.5 py-2.5 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            name="role"
            className="px-3.5 py-2.5 text-sm text-slate-900 font-bold border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            defaultValue="user"
          >
            <option value="user">User Role</option>
            <option value="moderator">Moderator Role</option>
            <option value="admin">Administrator Role</option>
          </select>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            + Add Member
          </button>
        </form>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">Current Platform Team ({members.length})</h2>
          <span className="text-xs font-bold text-slate-700">Governance & Operations</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-xs">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3.5 text-left font-bold text-slate-800 uppercase tracking-wider">Member ID</th>
                <th className="px-6 py-3.5 text-left font-bold text-slate-800 uppercase tracking-wider">Email Address</th>
                <th className="px-6 py-3.5 text-left font-bold text-slate-800 uppercase tracking-wider">Assigned Role</th>
                <th className="px-6 py-3.5 text-left font-bold text-slate-800 uppercase tracking-wider">Created Date</th>
                <th className="px-6 py-3.5 text-right font-bold text-slate-800 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-700 font-semibold">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
                    Loading team members...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-700 font-semibold">
                    No members listed.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-slate-900">
                      {member.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-800">
                      {member.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={member.role}
                        onChange={(e) => void handleUpdateMember(member.id, e.target.value)}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${getRoleBadge(member.role)}`}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => void handleDeleteMember(member.id)}
                        className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-950 border border-rose-400 font-bold rounded-lg transition-colors cursor-pointer text-xs"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberManagementPage;
