import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

const FranchiseManagementDashboard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Franchise Management</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-800">Active Franchises</p>
          <p className="text-2xl font-bold text-green-900 mt-1">12</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">Total Revenue</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">245K FIC</p>
        </div>
      </div>
    </div>
  );
};

export default FranchiseManagementDashboard;
