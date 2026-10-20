import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { RefreshCw, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

interface TransactionItem {
  id: string | number;
  type: string;
  transaction_type?: string;
  description?: string;
  amount: number;
  date?: string;
  createdAt?: string;
  status?: string;
}

const GemTransactions: React.FC = () => {
  const { showToast } = useAppContext();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/wallet/transactions');
      if (res.data?.data && Array.isArray(res.data.data)) {
        setTransactions(res.data.data);
      }
    } catch {
      showToast('Error syncing wallet ledger transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CurrencyDollarIcon className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">Wallet & Gem Activity</h3>
        </div>
        <button
          onClick={loadTransactions}
          disabled={loading}
          className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-300 transition"
          title="Refresh Ledger Transactions"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2.5">
        {transactions.map((tx) => {
          const isDeposit = tx.type === 'received' || tx.transaction_type === 'deposit' || tx.type === 'Reward';
          return (
            <div 
              key={tx.id} 
              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-full ${
                  isDeposit ? 'bg-emerald-100 text-emerald-950' : 'bg-rose-100 text-rose-950'
                }`}>
                  {isDeposit ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {tx.description || (isDeposit ? 'Credit Inflow / Deposit' : 'Payout Transfer')}
                  </p>
                  <p className="text-xs text-slate-700 font-semibold">
                    {tx.date || (tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Reconciled')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-extrabold text-sm ${isDeposit ? 'text-emerald-900' : 'text-slate-900'}`}>
                  {isDeposit ? '+' : '-'}{Number(tx.amount).toLocaleString()} FIC
                </span>
                <span className="block text-[10px] font-bold text-slate-600 uppercase">
                  {tx.status || 'Settled'}
                </span>
              </div>
            </div>
          );
        })}

        {transactions.length === 0 && !loading && (
          <div className="py-6 text-center text-slate-700 font-semibold text-sm">
            No wallet ledger transactions recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default GemTransactions;
