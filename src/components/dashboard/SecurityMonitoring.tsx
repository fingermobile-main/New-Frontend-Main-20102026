import React, {} from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';

interface SecurityMonitoringProps {}

const SecurityMonitoring: React.FC<SecurityMonitoringProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <EyeIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Security Monitoring</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">Active Sessions</p>
          <p className="text-2xl font-bold text-green-900 mt-1">234</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-800">Threats Detected</p>
          <p className="text-2xl font-bold text-red-900 mt-1">3</p>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoring;
