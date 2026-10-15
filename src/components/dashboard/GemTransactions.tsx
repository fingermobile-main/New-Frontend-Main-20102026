import React, { useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const GemTransactions: React.FC = () => {
  const [transactions] = React.useState([
    { id: '1', type: 'Purchase', amount: 500, date: '2026-06-15' },
    { id: '2', type: 'Reward', amount: 100, date: '2026-06-14' },
    { id: '3', type: 'Transfer', amount: 250, date: '2026-06-13' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Gem Transactions</h3>
      </div>
      <div className="space-y-2">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{tx.type}</p>
              <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
            </div>
            <span className={`font-bold ${tx.type === 'Purchase' ? 'text-red-600' : 'text-green-600'}`}>
              {tx.type === 'Purchase' ? '-' : '+'}{tx.amount} Gems
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GemTransactions;
