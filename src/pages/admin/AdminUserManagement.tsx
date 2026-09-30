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
      if (data?.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data?.data)) {
        setUsers(data.data);
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      showToast('Error loading users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleIssueStrike = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/strike`);
      showToast('Moderation strike issued', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      showToast(error?.response?.data?.message || 'Failed to issue strike', 'error');
    }
  };

  const handleIssueRefund = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/refund`, { amount: 50 });
      showToast(`Issued $50 refund to user #${userId}`, 'success');
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      showToast(error?.response?.data?.message || 'Failed to issue refund', 'error');
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/ban`);
      showToast('User has been banned', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      showToast(error?.response?.data?.message || 'Failed to ban user', 'error');
    }
  };

  const handleAwardCredits = async (userId: string) => {
    try {
      await api.post(`/admin/users/${userId}/credits`, { amount: 100 });
      showToast('Awarded 100 AI credits', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      showToast(error?.response?.data?.message || 'Failed to award credits', 'error');
    }
  };

  return (
    <MainLayout>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin: User Management</h1>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button variant="outline"><MagnifyingGlassIcon className="w-5 h-5" /></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.filter(u => u.username.includes(search) || u.email.includes(search)).map(user => (
            <Card key={user.id} className="border-gray-200">
              <CardHeader className="bg-gray-50 border-b pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{user.username}</CardTitle>
                    <Badge variant={user.status === 'ACTIVE' ? 'default' : 'destructive'} className="mt-1">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <p className="text-sm text-gray-600 font-mono">{user.email}</p>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm font-semibold">Moderation Strikes:</span>
                  <Badge variant={user.strikes >= 2 ? 'destructive' : 'secondary'} className="text-sm">
                    {user.strikes}/3
                  </Badge>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm font-semibold">Wallets:</span>
                  <div className="flex gap-2 text-sm">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">${user.fiatBalance.toFixed(2)}</Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{user.cryptoBalance} FIC</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                  <span className="text-sm font-semibold">AI Credits:</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{user.aiCredits}</Badge>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={() => handleIssueStrike(user.id)}
                    disabled={user.status !== 'ACTIVE'}
                  >
                    <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                    Issue Strike
                  </Button>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant="outline"
                      className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => handleAwardCredits(user.id)}
                      disabled={user.status !== 'ACTIVE'}
                    >
                      <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                      +100 AI
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleIssueRefund(user.id)}
                    >
                      <BanknotesIcon className="w-4 h-4 mr-2" />
                      Refund $50
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    className="w-full justify-start mt-2"
                    onClick={() => handleBanUser(user.id)}
                    disabled={user.status === 'BANNED'}
                  >
                    <UserMinusIcon className="w-4 h-4 mr-2" />
                    Ban User
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
};

export default AdminUserManagement;
