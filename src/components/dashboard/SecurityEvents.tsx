import React, { useState } from 'react';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface SecurityEventsProps {}

const SecurityEvents: React.FC<SecurityEventsProps> = () => {
  const [events] = React.useState([
    { id: '1', type: 'Login Attempt', status: 'blocked', time: '5 min ago' },
    { id: '2', type: 'Password Change', status: 'success', time: '1 hour ago' },
    { id: '3', type: 'API Access', status: 'success', time: '2 hours ago' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShieldExclamationIcon className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-bold text-gray-900">Security Events</h3>
      </div>
      <div className="space-y-2">
        {events.map((event) => (
          <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{event.type}</p>
                <p className="text-xs text-gray-500 mt-1">{event.time}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded ${
                event.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {event.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecurityEvents;
