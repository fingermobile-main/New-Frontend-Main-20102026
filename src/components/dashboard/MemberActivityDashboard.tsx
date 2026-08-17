import React, {} from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';

interface MemberActivityDashboardProps {}

const MemberActivityDashboard: React.FC<MemberActivityDashboardProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <UsersIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Member Activity</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <span className="font-medium text-gray-900">Active Today</span>
          <span className="text-xl font-bold text-green-600">847</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="font-medium text-gray-900">New This Week</span>
          <span className="text-xl font-bold text-blue-600">124</span>
        </div>
      </div>
    </div>
  );
};

export default MemberActivityDashboard;
