import React, { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface AmeboHistoryProps {
  userId?: string;
  limit?: number;
}

const AmeboHistory: React.FC<AmeboHistoryProps> = ({ userId, limit = 10 }) => {
  const [history, setHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Mock history data
    setHistory([
      { id: '1', action: 'Posted update', timestamp: '2024-03-15T14:30:00Z', status: 'completed' },
      { id: '2', action: 'Shared article', timestamp: '2024-03-15T13:15:00Z', status: 'completed' },
      { id: '3', action: 'Commented on post', timestamp: '2024-03-15T12:00:00Z', status: 'completed' },
      { id: '4', action: 'Liked content', timestamp: '2024-03-15T11:30:00Z', status: 'completed' },
      { id: '5', action: 'Followed member', timestamp: '2024-03-15T10:45:00Z', status: 'completed' }
    ]);
  }, [userId]);

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Activity History</h3>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {history.slice(0, limit).map((item) => (
          <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {item.status === 'completed' ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <ClockIcon className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(item.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {history.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <ClockIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No activity yet</p>
        </div>
      )}
    </div>
  );
};

export default AmeboHistory;
