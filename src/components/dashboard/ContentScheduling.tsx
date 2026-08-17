import React, { useState } from 'react';
import { CalendarIcon } from '@heroicons/react/24/outline';

interface ContentSchedulingProps {
  userId?: string;
}

const ContentScheduling: React.FC<ContentSchedulingProps> = ({ userId }) => {
  const [scheduled, setScheduled] = React.useState([
    { id: '1', title: 'Morning Post', date: '2026-06-17 09:00', platform: 'Twitter' },
    { id: '2', title: 'Afternoon Update', date: '2026-06-17 14:00', platform: 'LinkedIn' },
    { id: '3', title: 'Evening Story', date: '2026-06-17 18:00', platform: 'Instagram' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Content Scheduler</h3>
      </div>
      <div className="space-y-3">
        {scheduled.map((item) => (
          <div key={item.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date(item.date).toLocaleString()}</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">{item.platform}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentScheduling;
