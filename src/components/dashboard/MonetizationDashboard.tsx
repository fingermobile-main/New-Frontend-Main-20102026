import React, {} from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const MonetizationDashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold text-gray-900">Monetization</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg text-white">
          <p className="text-sm opacity-90">Revenue</p>
          <p className="text-2xl font-bold mt-1">38.5K FIC</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg text-white">
          <p className="text-sm opacity-90">Payouts</p>
          <p className="text-2xl font-bold mt-1">22.1K FIC</p>
        </div>
      </div>
    </div>
  );
};

export default MonetizationDashboard;
