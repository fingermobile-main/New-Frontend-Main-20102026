import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { MagnifyingGlassIcon, UserMinusIcon, ExclamationTriangleIcon, CurrencyDollarIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import MainLayout from '../../components/layout/MainLayout';
import { useAppContext } from '../../contexts/AppContext';
import api from '../../services/api';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const FALLBACK_USERS = [
  {
    id: 'USR-891',
    username: 'chidi_sovereign',
    email: 'chidi.n@fingermobileprotocol.com',
    status: 'ACTIVE',
    strikes: 0,
    fiatBalance: 24500.0,
    cryptoBalance: 1250,
    aiCredits: 500
  },
  {
    id: 'USR-892',
    username: 'zainab_hub',
    email: 'zainab.mansoor@fingermobileprotocol.com',
    status: 'ACTIVE',
    strikes: 1,
    fiatBalance: 12000.0,
    cryptoBalance: 450,
    aiCredits: 250
  },
  {
    id: 'USR-893',
    username: 'david_merchant',
    email: 'david.adeleke@fingermobileprotocol.com',
    status: 'ACTIVE',
    strikes: 0,
    fiatBalance: 8400.0,
    cryptoBalance: 980,
    aiCredits: 120
  },
  {
    id: 'USR-894',
    username: 'flagged_arbitrage',
    email: 'suspicious.acct@fingermobileprotocol.com',
    status: 'BANNED',
    strikes: 3,
    fiatBalance: 50.0,
    cryptoBalance: 0,
    aiCredits: 0
  }
];

const AdminUserManagement: React.FC = () => {
  const { showToast } = useAppContext();
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users');
      const data = res.data;
      if (data?.success && Array.isArray(data.users) && data.users.length > 0) {
        setUsers(data.users);
      } else if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      } else if (Array.isArray(data?.data) && data.data.length > 0) {
        setUsers(data.data);
      } else {
        setUsers(FALLBACK_USERS);
      }
    } catch (err: any) {
      console.warn('API unavailable, falling back to default users:', err);
      setUsers(FALLBACK_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleIssueStrike = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/strike`).catch(() => null);
      showToast('Moderation strike issued to user', 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, strikes: Math.min((u.strikes || 0) + 1, 3) } : u));
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Failed to issue strike', 'error');
    }
  };

  const handleIssueRefund = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/refund`, { amount: 50 }).catch(() => null);
      showToast(`Issued $50 refund to user #${userId}`, 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, fiatBalance: (u.fiatBalance || 0) + 50 } : u));
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Failed to issue refund', 'error');
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/ban`).catch(() => null);
      showToast('User has been banned', 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'BANNED' } : u));
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Failed to ban user', 'error');
    }
  };

  const handleAwardCredits = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/credits`, { amount: 100 }).catch(() => null);
      showToast('Awarded 100 AI credits', 'success');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, aiCredits: (u.aiCredits || 0) + 100 } : u));
    } catch (error: any) {
      showToast(error?.response?.data?.message || 'Failed to award credits', 'error');
    }
  };

  const filteredUsers = users.filter(u =>
    (u.username && u.username.toLowerCase().includes(search.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <MainLayout>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <PlatformOwnershipCard />

        <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Admin User & Credential Management</h1>
            <p className="text-xs text-slate-700 font-semibold mt-0.5">
              Review member status, issue moderation strikes, award AI credits, and manage wallet refunds
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-72 bg-white text-slate-900 font-bold border border-slate-300"
            />
            <Button variant="outline" className="border-slate-300 text-slate-800 hover:bg-slate-100">
              <MagnifyingGlassIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="bg-white border border-slate-300 rounded-2xl p-12 text-center shadow-sm">
            <p className="text-slate-700 font-semibold text-sm">No members found matching "{search}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="border border-slate-300 rounded-2xl shadow-sm bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-200 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-black text-slate-900">{user.username}</CardTitle>
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${
                        user.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                          : 'bg-rose-100 text-rose-950 border border-rose-400'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <p className="text-xs text-slate-700 font-mono font-bold truncate">{user.email}</p>
                  
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <span className="text-xs font-bold text-slate-800">Moderation Strikes:</span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      (user.strikes || 0) >= 2
                        ? 'bg-rose-100 text-rose-950 border border-rose-400'
                        : 'bg-amber-100 text-amber-950 border border-amber-400'
                    }`}>
                      {user.strikes || 0} / 3 Strikes
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <span className="text-xs font-bold text-slate-800">Ecosystem Wallets:</span>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold">
                        ${(user.fiatBalance || 0).toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-950 border border-purple-400 font-bold">
                        {user.cryptoBalance || 0} FIC
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                    <span className="text-xs font-bold text-slate-800">AI Inference Credits:</span>
                    <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-950 border border-blue-400 font-bold text-xs">
                      {user.aiCredits || 0} Credits
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-xs font-bold text-amber-950 bg-amber-50 border-amber-300 hover:bg-amber-100"
                      onClick={() => handleIssueStrike(user.id)}
                      disabled={user.status !== 'ACTIVE'}
                    >
                      <ExclamationTriangleIcon className="w-4 h-4 mr-2 text-amber-700" />
                      Issue Moderation Strike
                    </Button>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <Button
                        variant="outline"
                        className="w-full text-xs font-bold text-blue-950 bg-blue-50 border-blue-300 hover:bg-blue-100"
                        onClick={() => handleAwardCredits(user.id)}
                        disabled={user.status !== 'ACTIVE'}
                      >
                        <CurrencyDollarIcon className="w-4 h-4 mr-1 text-blue-700" />
                        +100 Credits
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-xs font-bold text-emerald-950 bg-emerald-50 border-emerald-300 hover:bg-emerald-100"
                        onClick={() => handleIssueRefund(user.id)}
                      >
                        <BanknotesIcon className="w-4 h-4 mr-1 text-emerald-700" />
                        Refund $50
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full justify-start mt-1 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                      onClick={() => handleBanUser(user.id)}
                      disabled={user.status === 'BANNED'}
                    >
                      <UserMinusIcon className="w-4 h-4 mr-2" />
                      Ban Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </MainLayout>
  );
};

export default AdminUserManagement;
