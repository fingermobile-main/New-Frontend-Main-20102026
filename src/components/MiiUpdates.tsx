import React, { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

interface MiiUpdatesProps {
  userId?: string;
  limit?: number;
}

const MiiUpdates: React.FC<MiiUpdatesProps> = ({ userId, limit = 5 }) => {
  const [updates, setUpdates] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Mock updates data
    setUpdates([
      { id: '1', type: 'milestone', message: 'Reached 100 followers!', timestamp: '2 hours ago' },
      { id: '2', type: 'achievement', message: 'Completed Web Development course', timestamp: '5 hours ago' },
      { id: '3', type: 'reward', message: 'Earned 500 FIC from content creation', timestamp: '1 day ago' },
      { id: '4', type: 'badge', message: 'Unlocked "Early Adopter" badge', timestamp: '2 days ago' },
      { id: '5', type: 'update', message: 'Profile verification completed', timestamp: '3 days ago' }
    ]);
  }, [userId]);

  const getIcon = (type: string) => {
    switch (type) {
    case 'milestone': return '🎯';
    case 'achievement': return '🏆';
    case 'reward': return '💰';
    case 'badge': return '🎖️';
    case 'update': return '✓';
    default: return '📢';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300">
      <div className="p-6 border-b border-slate-300 flex items-center gap-2">
        <BellIcon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Your Updates</h3>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {updates.slice(0, limit).map((update) => (
          <div key={update.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center text-lg">
                {getIcon(update.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{update.message}</p>
                <p className="text-xs text-gray-500 mt-1">{update.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {updates.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <BellIcon className="w-12 h-12 mx-auto mb-3 text-slate-700" />
          <p>No updates yet</p>
        </div>
      )}
    </div>
  );
};

export default MiiUpdates;
