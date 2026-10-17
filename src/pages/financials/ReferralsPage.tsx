import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { Users, Gift, Share2, Copy, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

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
    referralLink: 'https://fingermobileprotocol.com/join?ref=FINGER-REF4',
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
          referralLink: res.data.referralLink || `https://fingermobileprotocol.com/join?ref=${res.data.referralCode || 'FINGER-REF4'}`,
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
    <div className="space-y-8 text-slate-900">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-400/40 text-blue-700 flex-shrink-0">
            <Share2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Referrals & Sovereign Affiliate Network
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-400">
                50 FIC Bounty Active
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed max-w-3xl">
              Invite friends, creators, and merchants to FingerMobile and earn 50 FIC per active referral plus 5% lifetime platform fees on their storefront transactions.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Referrals</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-3xl font-mono font-black text-slate-900 mt-2">{stats.totalReferrals}</p>
          <p className="text-xs text-emerald-800 font-bold mt-1">+{stats.activeReferrals} Active Members</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total FIC Earned</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-mono font-black text-blue-700 mt-2">
            {stats.totalEarnedFIC.toLocaleString()} <span className="text-base font-bold text-slate-700">FIC</span>
          </p>
          <p className="text-xs text-slate-700 font-medium mt-1">Settled directly to wallet</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
          <div className="flex items-center justify-between text-slate-700 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Rewards</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-mono font-black text-amber-700 mt-2">
            {stats.pendingEarningsFIC.toLocaleString()} <span className="text-base font-bold text-slate-700">FIC</span>
          </p>
          <p className="text-xs text-slate-700 font-medium mt-1">Unlocks upon KYC verification</p>
        </div>

        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-6 rounded-2xl text-white shadow-sm border border-blue-800">
          <div className="flex items-center justify-between text-blue-200 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Reward Per Referral</span>
            <Gift className="w-4 h-4 text-blue-200" />
          </div>
          <p className="text-3xl font-mono font-black text-white mt-2">50 FIC</p>
          <p className="text-xs text-blue-100 font-semibold mt-1">+ 5% lifetime platform volume bonus</p>
        </div>
      </div>

      {/* Referral Link & Code Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-300 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-900">Your Unique Invitation Credentials</h2>
          <p className="text-xs text-slate-700 font-medium">Distribute your personal referral link across social media or direct messaging</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="md:col-span-2 space-y-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Referral Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={stats.referralLink}
                className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-mono font-bold select-all focus:outline-none focus:border-blue-500 border focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(stats.referralLink, 'Referral link')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl whitespace-nowrap shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Referral Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={stats.referralCode}
                className="w-full bg-white border-2 border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 font-mono font-black tracking-wider select-all focus:outline-none focus:border-blue-500 font-bold border focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(stats.referralCode, 'Referral code')}
                className="px-4 py-2.5 border-2 border-slate-300 text-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-black rounded-xl whitespace-nowrap transition-all"
              >
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-white rounded-3xl border border-slate-300 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-black text-slate-900">Referred Members Directory</h2>
            <p className="text-xs text-slate-700 font-medium">Real-time telemetry of users onboarded with your sovereign invite code</p>
          </div>
          <span className="text-xs font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
            {stats.referrals.length} Total Users
          </span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-700 font-bold">Loading referral network...</div>
        ) : stats.referrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Member</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Reward</th>
                  <th className="px-6 py-3.5">Payout Status</th>
                  <th className="px-6 py-3.5">Registration Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200 text-sm">
                {stats.referrals.map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-black flex items-center justify-center text-xs text-blue-950 border-blue-400">
                          {(r.referredDisplayName || r.referredUsername || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{r.referredDisplayName || r.referredUsername}</p>
                          <p className="text-xs text-slate-700 font-medium">@{r.referredUsername}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                        r.status === 'active'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                          : 'bg-amber-100 text-amber-950 border-amber-400'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-black text-slate-900">
                      +{r.rewardAmount} FIC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider border ${
                        r.rewardStatus === 'paid'
                          ? 'bg-blue-100 text-blue-950 border-blue-400'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}>
                        {r.rewardStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700 font-medium text-xs">
                      {r.date ? new Date(r.date).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">No members referred yet</p>
            <p className="text-xs text-slate-700 font-medium">Share your invite link above to start earning 50 FIC per activation!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralsPage;
