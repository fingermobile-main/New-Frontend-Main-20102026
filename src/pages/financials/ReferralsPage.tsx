import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';

interface ReferralItem {
  id: string | number;
  referredUsername: string;
  referredDisplayName?: string;
  status: string;
  rewardAmount: number;
  rewardStatus: string;
  date: string;
}

const ReferralsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    referralCode: 'FINGER-REF4',
    referralLink: 'https://fingermobile.com/join?ref=FINGER-REF4',
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnedFIC: 0,
    pendingEarningsFIC: 0,
    referrals: [] as ReferralItem[]
  });

  const loadReferralData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiService.get<any>('/api/referrals');
      if (res?.data) {
        setStats({
          referralCode: res.data.referralCode || 'FINGER-REF4',
          referralLink: res.data.referralLink || `https://fingermobile.com/join?ref=${res.data.referralCode || 'FINGER-REF4'}`,
          totalReferrals: Number(res.data.totalReferrals || 0),
          activeReferrals: Number(res.data.activeReferrals || 0),
          totalEarnedFIC: Number(res.data.totalEarnedFIC || 0),
          pendingEarningsFIC: Number(res.data.pendingEarningsFIC || 0),
          referrals: Array.isArray(res.data.referrals) ? res.data.referrals : []
        });
      }
    } catch (err) {
      console.error('Failed to load referral data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReferralData();
  }, [loadReferralData]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast?.(`${label} copied to clipboard!`, 'success');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referrals & Affiliates</h1>
        <p className="mt-1 text-gray-600">
          Invite friends, creators, and merchants to FingerMobile and earn 50 FIC per active referral plus platform commission bonuses!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Referrals</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalReferrals}</p>
          <p className="text-xs text-green-600 font-semibold mt-1">+{stats.activeReferrals} Active</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total FIC Earned</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalEarnedFIC.toLocaleString()} <span className="text-base text-gray-500">FIC</span></p>
          <p className="text-xs text-gray-500 mt-1">Paid directly to wallet</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Pending Earnings</p>
          <p className="text-3xl font-bold text-amber-500 mt-2">{stats.pendingEarningsFIC.toLocaleString()} <span className="text-base text-gray-500">FIC</span></p>
          <p className="text-xs text-gray-500 mt-1">Releases on verification</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-xl text-white shadow-sm">
          <p className="text-sm font-medium text-blue-100">Reward Per Referral</p>
          <p className="text-3xl font-bold mt-2">50 FIC</p>
          <p className="text-xs text-blue-200 mt-1">+ 5% lifetime platform fees</p>
        </div>
      </div>

      {/* Referral Link & Code Box */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Unique Invitation Link</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Referral Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={stats.referralLink}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 font-mono select-all focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(stats.referralLink, 'Referral link')}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 whitespace-nowrap"
              >
                Copy Link
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Referral Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={stats.referralCode}
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 font-mono font-bold tracking-wider select-all focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(stats.referralCode, 'Referral code')}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 whitespace-nowrap"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Referred Members</h2>
          <span className="text-xs font-semibold text-gray-500">
            {stats.referrals.length} Total Users
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading referral history...</div>
        ) : stats.referrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Reward</th>
                  <th className="px-6 py-3">Payout</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {stats.referrals.map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                          {(r.referredDisplayName || r.referredUsername || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{r.referredDisplayName || r.referredUsername}</p>
                          <p className="text-xs text-gray-500">@{r.referredUsername}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        r.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                      +{r.rewardAmount} FIC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        r.rewardStatus === 'paid' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {r.rewardStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {r.date ? new Date(r.date).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <p className="text-gray-500">No members referred yet. Share your code to start earning!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralsPage;
