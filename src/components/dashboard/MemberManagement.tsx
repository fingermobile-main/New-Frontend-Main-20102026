import React, { useState } from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';

interface MemberManagementProps {}

const MemberManagement: React.FC<MemberManagementProps> = () => {
  const [members] = React.useState([
    { id: '1', name: 'John Doe', status: 'active', joined: '2026-01-15' },
    { id: '2', name: 'Jane Smith', status: 'active', joined: '2026-02-20' },
    { id: '3', name: 'Bob Johnson', status: 'inactive', joined: '2025-12-10' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <UsersIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Member Management</h3>
      </div>
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">Joined {new Date(member.joined).toLocaleDateString()}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberManagement;
