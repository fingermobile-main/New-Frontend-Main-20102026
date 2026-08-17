import React, {} from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface RoleBasedDashboardProps {
  userId?: string;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ userId }) => {
  return (
    <div className="p-6">
      <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />

      <div className="flex items-center gap-2 mb-4">
        <ArrowTrendingUpIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Role-Based Access</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Admin Roles</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">5</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">User Roles</p>
          <p className="text-2xl font-bold text-green-900 mt-1">12</p>
        </div>
      </div>
    </div>
  );
};

export default RoleBasedDashboard;
