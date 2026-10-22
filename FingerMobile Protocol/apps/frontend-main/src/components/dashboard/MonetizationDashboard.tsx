import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAppContext } from '../../contexts/AppContext';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  XCircle,
  ArrowUpRight
} from 'lucide-react';

interface PayoutRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  bankName: string;
  accountNumber: string;
  reference: string;
  date: string;
  createdAt: string;
}

const MonetizationDashboard: React.FC = () => {
  const { showToast } = useAppContext();
  const [balance, setBalance] = useState<number>(45250);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: '',
    bankName: 'Zenith Bank',
    accountNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/payouts');
      if (res.data?.data) {
        setPayouts(res.data.data);
      }
    } catch {
      showToast('Error syncing payouts from ledger', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(payoutForm.amount);
    if (!amountNum || amountNum <= 0) {
      showToast('Please enter a valid payout amount', 'error');
      return;
    }
    if (!payoutForm.accountNumber || payoutForm.accountNumber.length < 10) {
      showToast('Please enter a valid 10-digit account number', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/payouts', {
        amount: amountNum,
        bankName: payoutForm.bankName,
        accountNumber: payoutForm.accountNumber
      });

      if (res.data?.success) {
        showToast(`Payout request for ₦${amountNum.toLocaleString()} submitted`, 'success');
        setShowWithdrawModal(false);
        setPayoutForm({ amount: '', bankName: 'Zenith Bank', accountNumber: '' });
        fetchPayouts();
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to submit payout request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalPaidOut = payouts
    .filter(p => p.status === 'approved' || p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayouts = payouts
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 space-y-6">
      {/* Header and Quick Withdraw CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold text-slate-900">Creator Monetization & Settlement</h2>
          </div>
          <p className="text-xs text-slate-700 mt-0.5">Automated creator royalties, ad revenue shares, and direct bank settlement.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPayouts}
            disabled={loading}
            className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 transition"
            title="Refresh Settlements"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow transition"
          >
            <ArrowUpRight className="w-4 h-4" />
            Request Bank Payout
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Available Balance</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ₦{balance.toLocaleString()}
          </p>
          <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1 mt-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Settled in PostgreSQL
          </span>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Total Paid Out</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ₦{totalPaidOut.toLocaleString()}
          </p>
          <span className="text-xs font-semibold text-indigo-900 mt-1 block">
            {payouts.filter(p => p.status === 'approved').length} completed transfers
          </span>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">In Clearing / Pending</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            ₦{pendingPayouts.toLocaleString()}
          </p>
          <span className="text-xs font-semibold text-amber-900 flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Next clearing window: 24h
          </span>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Recent Payout Settlements</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300">
                <th className="py-2.5 px-3 text-xs font-bold text-slate-900 uppercase">Reference</th>
                <th className="py-2.5 px-3 text-xs font-bold text-slate-900 uppercase">Recipient Bank</th>
                <th className="py-2.5 px-3 text-xs font-bold text-slate-900 uppercase">Amount</th>
                <th className="py-2.5 px-3 text-xs font-bold text-slate-900 uppercase">Settlement Status</th>
                <th className="py-2.5 px-3 text-xs font-bold text-slate-900 uppercase">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {payouts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono text-xs font-bold text-indigo-950">
                    {p.reference}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {p.bankName} - {p.accountNumber}
                  </td>
                  <td className="py-3 px-3 font-extrabold text-slate-900">
                    ₦{p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                      p.status === 'approved' || p.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                        : 'bg-amber-100 text-amber-950 border border-amber-400'
                    }`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-slate-700">
                    {p.date || new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {payouts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-700 font-semibold">
                    No bank payout settlements recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WITHDRAWAL MODAL */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900">Request Creator Bank Payout</h3>
              <button type="button" onClick={() => setShowWithdrawModal(false)} className="text-slate-500 hover:text-slate-900">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                  Payout Amount (₦)
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  placeholder="e.g. 25000"
                  value={payoutForm.amount}
                  onChange={e => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                  Destination Commercial Bank
                </label>
                <select
                  value={payoutForm.bankName}
                  onChange={e => setPayoutForm({ ...payoutForm, bankName: e.target.value })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Zenith Bank">Zenith Bank Plc</option>
                  <option value="Access Bank">Access Bank Plc</option>
                  <option value="Guaranty Trust Bank">Guaranty Trust Bank (GTBank)</option>
                  <option value="First Bank of Nigeria">First Bank of Nigeria</option>
                  <option value="United Bank for Africa">United Bank for Africa (UBA)</option>
                  <option value="Stanbic IBTC">Stanbic IBTC Bank</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-800 mb-1">
                  10-Digit NUBAN Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  required
                  placeholder="0123456789"
                  value={payoutForm.accountNumber}
                  onChange={e => setPayoutForm({ ...payoutForm, accountNumber: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg shadow transition disabled:opacity-50"
                >
                  {submitting ? 'Transmitting to Bank...' : 'Authorize Settlement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonetizationDashboard;
