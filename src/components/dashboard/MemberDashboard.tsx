import React, {} from 'react';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface MemberDashboardProps {}

const MemberDashboard: React.FC<MemberDashboardProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <UserCircleIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Member Dashboard</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Profile Views</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">2.4K</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">Connections</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">456</p>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
