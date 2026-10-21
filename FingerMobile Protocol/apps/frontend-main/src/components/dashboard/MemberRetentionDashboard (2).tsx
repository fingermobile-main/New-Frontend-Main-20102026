import React, {} from 'react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface MemberRetentionDashboardProps {
  userId?: string;
}

const MemberRetentionDashboard: React.FC<MemberRetentionDashboardProps> = ({ userId }) => {
  return (
    <div className="p-6">
      <ArrowTrendingUpIcon className="w-6 h-6 text-green-600" />
      <h3 className="text-lg font-bold text-gray-900">Member Retention</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">Retention Rate</p>
          <p className="text-2xl font-bold text-green-900 mt-1">87%</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Churn Rate</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">3.2%</p>
        </div>
      </div>
    </div>
  );
};

export default MemberRetentionDashboard;
