import React, {} from 'react';
import { MegaphoneIcon } from '@heroicons/react/24/outline';

const MarketingDashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MegaphoneIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Marketing Dashboard</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <p className="text-sm text-purple-800">Campaigns</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">15</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-800">Reach</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">45K</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-center">
          <p className="text-sm text-green-800">Conversions</p>
          <p className="text-2xl font-bold text-green-900 mt-1">12%</p>
        </div>
      </div>
    </div>
  );
};

export default MarketingDashboard;
