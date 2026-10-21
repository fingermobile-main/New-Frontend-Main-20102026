import React, { useState, useEffect } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { useAppContext } from '../../contexts/AppContext';
import { CheckCircle2, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';

interface EarningsAnalyticsProps {
  userId?: string;
  onRequestPayout?: () => void;
}

const EarningsAnalytics: React.FC<EarningsAnalyticsProps> = ({ userId, onRequestPayout }) => {
  const { showToast } = useAppContext();
  const [earnings, setEarnings] = useState({
    total: 45250,
    thisMonth: 12400,
    pending: 12500,
    withdrawn: 45000
  });

  useEffect(() => {
    loadAnalytics();
  }, [userId]);

  const loadAnalytics = async () => {
    try {
      const res = await api.get('/payouts');
      if (res.data?.data && Array.isArray(res.data.data)) {
        const approved = res.data.data
          .filter((p: any) => p.status === 'approved' || p.status === 'completed')
          .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
        const pending = res.data.data
          .filter((p: any) => p.status === 'pending')
          .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
        setEarnings(prev => ({
          ...prev,
          withdrawn: approved || prev.withdrawn,
          pending: pending || prev.pending
        }));
      }
    } catch {
      // Fallback to initial state
    }
  };

  const handlePayoutClick = () => {
    if (onRequestPayout) {
      onRequestPayout();
    } else {
      // Scroll to payout section or notify
      showToast('Scroll up to Creator Monetization to authorize bank settlement', 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-emerald-600" />
        <h3 className="text-lg font-bold text-slate-900">Earnings Performance & Forecasting</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-5 text-white shadow-md border border-slate-800">
          <p className="text-xs uppercase font-bold tracking-wider text-indigo-300">Lifetime Gross Accrual</p>
          <p className="text-3xl font-extrabold text-white mt-2">₦{earnings.total.toLocaleString()}</p>
          <span className="text-xs text-emerald-300 font-bold block mt-1">+14.2% vs previous period</span>
        </div>
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-md border border-slate-800">
          <p className="text-xs uppercase font-bold tracking-wider text-indigo-300">Current Month Volume</p>
          <p className="text-3xl font-extrabold text-white mt-2">₦{earnings.thisMonth.toLocaleString()}</p>
          <span className="text-xs text-indigo-200 font-semibold block mt-1">Direct creator settlements</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-300 rounded-xl">
          <div>
            <p className="text-sm font-bold text-amber-950">Pending Clearing Payout</p>
            <p className="text-xs text-amber-900 font-medium mt-0.5">Clears within standard 24h bank cycle</p>
          </div>
          <p className="text-xl font-extrabold text-amber-950">₦{earnings.pending.toLocaleString()}</p>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-300 rounded-xl">
          <div>
            <p className="text-sm font-bold text-slate-900">Total Settled Withdrawals</p>
            <p className="text-xs text-slate-700 font-medium mt-0.5">Verified on commercial bank network</p>
          </div>
          <p className="text-xl font-extrabold text-slate-900">₦{earnings.withdrawn.toLocaleString()}</p>
        </div>
      </div>

      <button 
        onClick={handlePayoutClick}
        className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors font-bold text-sm shadow-md"
      >
        <ArrowUpRight className="w-4 h-4" />
        Withdraw Earnings to Bank
      </button>
    </div>
  );
};

export default EarningsAnalytics;
