import React, {} from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface SecurityDashboardProps {}

const SecurityDashboard: React.FC<SecurityDashboardProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheckIcon className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold text-gray-900">Security Dashboard</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">Threats Blocked</p>
          <p className="text-2xl font-bold text-green-900 mt-1">1,247</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Security Score</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">95%</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;
