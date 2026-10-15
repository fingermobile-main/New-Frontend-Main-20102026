import React, {} from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface GuardianProtocolDashboardProps {}

const GuardianProtocolDashboard: React.FC<GuardianProtocolDashboardProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheckIcon className="w-6 h-6 text-green-600" />
        <h3 className="text-lg font-bold text-gray-900">Guardian Protocol</h3>
      </div>
      <div className="space-y-3">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">Security Status</p>
          <p className="text-lg font-bold text-green-900 mt-1">✓ All Systems Secure</p>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Active Guardians</p>
          <p className="text-lg font-bold text-blue-900 mt-1">8 Online</p>
        </div>
      </div>
    </div>
  );
};

export default GuardianProtocolDashboard;
