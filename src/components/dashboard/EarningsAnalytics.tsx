import React, { useState } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface EarningsAnalyticsProps {
  userId?: string;
}

const EarningsAnalytics: React.FC<EarningsAnalyticsProps> = ({ userId }) => {
  const [earnings, setEarnings] = React.useState({
    total: 15750,
    thisMonth: 3200,
    pending: 850,
    withdrawn: 11700
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-6">
        <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold text-gray-900">Earnings Analytics</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Total Earnings</p>
          <p className="text-3xl font-bold mt-1">{earnings.total.toLocaleString()} FIC</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">This Month</p>
          <p className="text-3xl font-bold mt-1">{earnings.thisMonth.toLocaleString()} FIC</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div>
            <p className="text-sm font-medium text-yellow-900">Pending Payout</p>
            <p className="text-xs text-yellow-700 mt-1">Available for withdrawal</p>
          </div>
          <p className="text-xl font-bold text-yellow-900">{earnings.pending.toLocaleString()} FIC</p>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 border border-slate-300 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-900">Withdrawn</p>
            <p className="text-xs text-gray-600 mt-1">Lifetime withdrawals</p>
          </div>
          <p className="text-xl font-bold text-gray-900">{earnings.withdrawn.toLocaleString()} FIC</p>
        </div>
      </div>

      <button className="w-full mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
        Request Payout
      </button>
    </div>
  );
};

export default EarningsAnalytics;
