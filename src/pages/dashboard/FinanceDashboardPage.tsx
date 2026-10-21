import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

interface TransactionItem {
  id: string;
  date: string;
  member: string;
  description: string;
  amount: string;
  type: 'credit' | 'debit';
}

const FinanceDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30d');
  const [balance, setBalance] = useState(0);
  const [pendingPayoutsTotal, setPendingPayoutsTotal] = useState(0);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [balRes, txRes, payoutsRes] = await Promise.all([
        apiService.get<any>('/api/wallet/balance').catch(() => null),
        apiService.get<any>('/api/wallet/transactions').catch(() => null),
        apiService.get<any>('/api/payouts').catch(() => null)
      ]);

      if (balRes?.data?.balance !== undefined) {
        setBalance(Number(balRes.data.balance || 0));
      }

      if (payoutsRes?.data && Array.isArray(payoutsRes.data)) {
        const pending = payoutsRes.data
          .filter((p: any) => String(p.status).toLowerCase() === 'pending')
          .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
        setPendingPayoutsTotal(pending);
      }

      if (txRes?.data && Array.isArray(txRes.data)) {
        setTransactions(txRes.data.slice(0, 10).map((t: any) => {
          const isCredit = ['deposit', 'credit', 'interest', 'received', 'transfer_in'].includes(
            (t.type || t.transactionType || '').toLowerCase()
          );
          return {
            id: String(t.id),
            date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Recent',
            member: t.to_account ? `Account #${t.to_account}` : 'Platform Member',
            description: t.description || `${t.type || 'Transaction'}`,
            amount: `${isCredit ? '+' : '-'}${Number(t.amount || 0).toLocaleString()} FIC`,
            type: isCredit ? 'credit' : 'debit'
          };
        }));
      }
    } catch (_err) {
      // Graceful fallback for dashboard data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.]/g, '') || '0'), 0);

  const financialStats = [
    {
      title: 'Total Platform Balance',
      value: `${balance.toLocaleString()} FIC`,
      subtitle: `≈ $${(balance * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
      color: 'blue'
    },
    {
      title: 'Inflow (This Period)',
      value: `${totalCredits.toLocaleString()} FIC`,
      subtitle: `≈ $${(totalCredits * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`,
      color: 'green'
    },
    {
      title: 'Pending Payouts',
      value: `${pendingPayoutsTotal.toLocaleString()} FIC`,
      subtitle: 'Awaiting administrator approval',
      color: 'yellow'
    },
    {
      title: 'Ledger Records',
      value: String(transactions.length),
      subtitle: 'Synchronized with PostgreSQL',
      color: 'indigo'
    }
  ];

  const revenueSources = [
    { name: 'Content Monetization', value: 45, color: 'bg-blue-500' },
    { name: 'Subscriptions', value: 25, color: 'bg-green-500' },
    { name: 'Token Sales', value: 15, color: 'bg-purple-500' },
    { name: 'Gift Cards', value: 10, color: 'bg-yellow-500' },
    { name: 'Platform Commissions', value: 5, color: 'bg-red-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900">
            Finance & Treasury Dashboard
          </h1>
          <p className="text-slate-700 font-medium mt-1">
            Monitor platform liquidity, merchant payouts, subscriptions, and financial settlement
          </p>
        </div>

        <PlatformOwnershipCard />

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financialStats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-300 p-6"
            >
              <p className="text-sm font-bold text-slate-700">{stat.title}</p>
              <div className="mt-2">
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-700 font-medium mt-1">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Distribution Chart */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-300 p-6">
            <h3 className="text-lg font-black text-slate-900 mb-6">Revenue Sources</h3>
            <div className="space-y-4">
              {revenueSources.map((source, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-bold text-slate-800">
                      {source.name}
                    </span>
                    <span className="text-slate-800 font-bold">{source.value}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${source.color}`}
                      style={{ width: `${source.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-300 p-6">
            <h3 className="text-lg font-black text-slate-900 mb-6">Financial Operations</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/dashboard/payouts')}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-400 rounded-xl hover:bg-blue-50 transition-all text-center group bg-white cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-blue-400 text-blue-950 border-blue-400 font-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-slate-900">Process Withdrawals</span>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  Review and approve pending merchant payout requests
                </p>
              </button>

              <button
                onClick={() => navigate('/monetization/dashboard')}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-emerald-400 rounded-xl hover:bg-emerald-50 transition-all text-center group bg-white cursor-pointer"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-emerald-400 text-emerald-950 border-emerald-400 font-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-emerald-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-slate-900">Monetization Analytics</span>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  Review platform income reports and fee breakdowns
                </p>
              </button>

              <button
                onClick={() => navigate('/financials/subscriptions')}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-400 rounded-xl hover:bg-purple-50 transition-all text-center group bg-white cursor-pointer"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-purple-400 text-purple-950 border-purple-400 font-black">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-slate-900">Manage Subscriptions</span>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  View and manage creator plans & auto-renewals
                </p>
              </button>

              <button
                onClick={() => navigate('/billing')}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-indigo-400 rounded-xl hover:bg-indigo-50 transition-all text-center group bg-white cursor-pointer"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-indigo-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-indigo-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-slate-900">Billing & Gateways</span>
                <p className="text-xs text-slate-700 font-medium mt-1">
                  Configure payment cards and billing settlements
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-black text-slate-900">Transaction History</h2>
            <div className="flex gap-2">
              {['7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 text-sm rounded-full transition cursor-pointer ${
                    timeRange === range
                      ? 'bg-blue-100 text-blue-950 border border-blue-400 font-black'
                      : 'text-slate-800 bg-slate-100 border border-slate-300 hover:bg-slate-200 font-bold'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="py-8 text-center text-slate-700 font-semibold">Loading platform transactions...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Account
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Description
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Type
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                        {transaction.member}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                        {transaction.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={
                            transaction.type === 'credit'
                              ? 'text-emerald-700 font-bold'
                              : 'text-rose-700 font-bold'
                          }
                        >
                          {transaction.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2.5 py-0.5 inline-flex text-xs leading-5 rounded-full font-black ${
                            transaction.type === 'credit'
                              ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                              : 'bg-rose-100 text-rose-950 border border-rose-400'
                          }`}
                        >
                          {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-slate-700 font-semibold">
                        No transactions recorded on this account yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => navigate('/financials/wallet')}
              className="px-4 py-2 border border-slate-300 text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 text-sm font-bold transition cursor-pointer"
            >
              View Full Ledger in Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboardPage;
