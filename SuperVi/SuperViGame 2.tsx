import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';

interface SuperViGameProps {}

const SuperViGame: React.FC<SuperViGameProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrophyIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">SuperVi Game</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg text-center">
          <p className="text-sm text-purple-800">Score</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">1,250</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-sm text-blue-800">Level</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">5</p>
        </div>
      </div>
    </div>
  );
};

export default SuperViGame;
