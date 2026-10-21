import React, { useState } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface LeaderboardProps {}

const Leaderboard: React.FC<LeaderboardProps> = () => {
  const [leaders] = React.useState([
    { rank: 1, name: 'Alice', score: 9850 },
    { rank: 2, name: 'Bob', score: 8720 },
    { rank: 3, name: 'Charlie', score: 7650 }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrophyIcon className="w-6 h-6 text-yellow-600" />
        <h3 className="text-lg font-bold text-gray-900">Leaderboard</h3>
      </div>
      <div className="space-y-2">
        {leaders.map((leader) => (
          <div key={leader.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${
                leader.rank === 1 ? 'bg-yellow-500 text-white' :
                  leader.rank === 2 ? 'bg-gray-400 text-white' :
                    'bg-orange-500 text-white'
              }`}>
                {leader.rank}
              </span>
              <span className="font-medium text-gray-900">{leader.name}</span>
            </div>
            <span className="font-bold text-blue-600">{leader.score.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
