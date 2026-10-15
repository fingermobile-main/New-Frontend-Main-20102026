import React, { useState } from 'react';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface EnhancedRbacDashboardProps {}

const EnhancedRbacDashboard: React.FC<EnhancedRbacDashboardProps> = () => {
  const [roles] = React.useState([
    { name: 'Admin', members: 5, permissions: 'Full Access' },
    { name: 'Moderator', members: 12, permissions: 'Content Management' },
    { name: 'Member', members: 1247, permissions: 'Basic Access' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Role Management</h3>
      </div>
      <div className="space-y-3">
        {roles.map((role) => (
          <div key={role.name} className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{role.name}</p>
                <p className="text-sm text-gray-500">{role.permissions}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-950 border border-blue-400 font-bold rounded-full text-sm font-medium">{role.members} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedRbacDashboard;
