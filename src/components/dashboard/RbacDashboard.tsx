import React, {} from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const RbacDashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">RBAC Dashboard</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Total Roles</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">8</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">Active Permissions</p>
          <p className="text-2xl font-bold text-green-900 mt-1">45</p>
        </div>
      </div>
    </div>
  );
};

export default RbacDashboard;
