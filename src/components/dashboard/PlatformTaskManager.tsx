import React, { useState } from 'react';
import { ListBulletIcon } from '@heroicons/react/24/outline';

interface PlatformTaskManagerProps {}

const PlatformTaskManager: React.FC<PlatformTaskManagerProps> = () => {
  const [tasks] = React.useState([
    { id: '1', title: 'Database Backup', status: 'completed', priority: 'high' },
    { id: '2', title: 'Security Audit', status: 'in-progress', priority: 'critical' },
    { id: '3', title: 'Performance Optimization', status: 'pending', priority: 'medium' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ListBulletIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Task Manager</h3>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{task.title}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{task.status.replace('-', ' ')}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformTaskManager;
