import React, {} from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface UGCDashboardProps {}

const UGCDashboard: React.FC<UGCDashboardProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserGroupIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">UGC Dashboard</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">User Posts</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">3,456</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Engagement</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">89%</p>
        </div>
      </div>
    </div>
  );
};

export default UGCDashboard;
