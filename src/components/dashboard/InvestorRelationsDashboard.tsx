import React, {} from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const InvestorRelationsDashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Investor Relations</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg text-white">
          <p className="text-sm opacity-90">Total Investment</p>
          <p className="text-2xl font-bold mt-1">1.2M FIC</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg text-white">
          <p className="text-sm opacity-90">ROI</p>
          <p className="text-2xl font-bold mt-1">+28%</p>
        </div>
      </div>
    </div>
  );
};

export default InvestorRelationsDashboard;
