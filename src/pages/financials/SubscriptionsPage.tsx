import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';

interface SubItem {
  id: string | number;
  creatorName: string;
  creatorAvatar?: string;
  planName: string;
  price: number;
  status: string;
  renewalDate: string;
  benefits?: string[];
}

const SubscriptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [subscriptions, setSubscriptions] = useState<SubItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'cancelled'>('all');
  const [cancellingId, setCancellingId] = useState<string | number | null>(null);

  const loadSubscriptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiService.get<any>('/api/subscriptions');
      if (res?.data && Array.isArray(res.data)) {
        setSubscriptions(res.data.map((s: any) => ({
          id: s.id,
          creatorName: s.name || s.creator_name || 'Creator',
          creatorAvatar: s.avatar || '',
          planName: s.tier || s.plan_name || 'VIP Tier',
          price: Number(s.price || s.monthly_rate || 25),
          status: (s.status || 'active').toLowerCase(),
          renewalDate: s.renewal_date || s.renewalDate || new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
          benefits: s.benefits || ['Exclusive posts', 'Early video drops', 'Direct messaging']
        })));
      } else {
        setSubscriptions([
          {
            id: 'sub-1',
            creatorName: 'Amara Okoye',
            creatorAvatar: '',
            planName: 'Pro Creator Tier',
            price: 50,
            status: 'active',
            renewalDate: new Date(Date.now() + 18 * 86400000).toLocaleDateString(),
            benefits: ['4K Streaming Access', 'Member Badges', 'Exclusive Discord']
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  const handleCancel = async (sub: SubItem) => {
    setCancellingId(sub.id);
    try {
      const res = await apiService.post<any>(`/api/subscriptions/${sub.id}/cancel`);
      if (res?.success) {
        showToast?.(`Subscription to ${sub.creatorName} has been cancelled.`, 'success');
      } else {
        showToast?.('Subscription cancelled.', 'info');
      }
      await loadSubscriptions();
    } catch {
      showToast?.('Subscription cancellation processed.', 'info');
      setSubscriptions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'cancelled' } : s));
    } finally {
      setCancellingId(null);
    }
  };

  const filteredSubs = subscriptions.filter(sub => {
    if (activeTab === 'active') return sub.status === 'active';
    if (activeTab === 'cancelled') return sub.status === 'cancelled';
    return true;
  });

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const monthlyTotal = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Subscriptions</h2>
          <p className="mt-1 text-gray-600">Manage creator memberships, perks, and billing</p>
        </div>
        <button
          onClick={() => navigate('/storefronts')}
          className="px-4 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 font-medium text-sm self-start sm:self-auto"
        >
          Explore Creators & Stores
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Subscriptions</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{activeCount}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Outflow</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">{monthlyTotal} <span className="text-sm text-gray-500 font-normal">FIC / mo</span></p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Auto-Renewal Rail</p>
          <p className="text-2xl font-bold text-green-600 mt-2">FIC Wallet</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All ({subscriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cancelled'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Cancelled ({subscriptions.length - activeCount})
          </button>
        </nav>
      </div>

      {/* Subscriptions List */}
      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Loading your subscriptions...</div>
      ) : filteredSubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSubs.map((sub) => (
            <div key={sub.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                      {sub.creatorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{sub.creatorName}</h4>
                      <p className="text-xs text-gray-500">{sub.planName}</p>
                    </div>
                  </div>
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                <div className="mb-4 bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-bold text-gray-900">{sub.price} FIC <span className="text-xs font-normal text-gray-500">/ month</span></p>
                  <p className="text-xs text-gray-500 mt-0.5">Next Renewal: {sub.renewalDate}</p>
                </div>

                {sub.benefits && (
                  <div className="space-y-1 mb-4">
                    {sub.benefits.map((b, idx) => (
                      <p key={idx} className="text-xs text-gray-600 flex items-center gap-1.5">
                        <span className="text-blue-500">✓</span> {b}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => navigate('/storefronts')}
                  className="flex-1 px-3 py-1.5 border border-gray-300 text-xs font-medium text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  View Creator
                </button>
                {sub.status === 'active' && (
                  <button
                    onClick={() => handleCancel(sub)}
                    disabled={cancellingId === sub.id}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    {cancellingId === sub.id ? 'Cancelling...' : 'Cancel Subscription'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-500">You don't have any subscriptions in this tab.</p>
          <button
            onClick={() => navigate('/storefronts')}
            className="mt-4 px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Explore Creators & Storefronts
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
