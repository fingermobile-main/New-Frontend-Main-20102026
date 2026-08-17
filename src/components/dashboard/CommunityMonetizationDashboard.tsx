import React, {} from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface CommunityMonetizationDashboardProps {
  userId?: string;
}

const CommunityMonetizationDashboard: React.FC<CommunityMonetizationDashboardProps> = ({ userId }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-6 text-white">
          <CurrencyDollarIcon className="w-8 h-8 mb-3" />
          <p className="text-sm opacity-90">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">52.8K FIC</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">Active Members</p>
          <p className="text-3xl font-bold mt-1">1,247</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white">
          <p className="text-sm opacity-90">Conversion Rate</p>
          <p className="text-3xl font-bold mt-1">12.5%</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Streams</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-900">Subscriptions</span>
            <span className="text-lg font-bold text-gray-900">28.5K FIC</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-900">Tips & Donations</span>
            <span className="text-lg font-bold text-gray-900">15.2K FIC</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium text-gray-900">Premium Content</span>
            <span className="text-lg font-bold text-gray-900">9.1K FIC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityMonetizationDashboard;
