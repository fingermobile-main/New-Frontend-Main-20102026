import React, {} from 'react';
import { StarIcon } from '@heroicons/react/24/outline';

interface SuperAdminDashboardProps {}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <StarIcon className="w-6 h-6 text-yellow-600" />
        <h3 className="text-lg font-bold text-gray-900">Super Admin Dashboard</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">Total Users</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">12,456</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">System Health</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">99.9%</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
