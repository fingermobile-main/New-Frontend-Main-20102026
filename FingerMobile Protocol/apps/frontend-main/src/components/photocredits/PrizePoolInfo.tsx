import React, {} from 'react';
import { GiftIcon } from '@heroicons/react/24/outline';

interface PrizePoolInfoProps {}

const PrizePoolInfo: React.FC<PrizePoolInfoProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <GiftIcon className="w-6 h-6 text-yellow-600" />
        <h3 className="text-lg font-bold text-gray-900">Prize Pool</h3>
      </div>
      <div className="space-y-3">
        <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg text-white text-center">
          <p className="text-sm opacity-90">Total Prize Pool</p>
          <p className="text-3xl font-bold mt-1">50,000 FIC</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-yellow-50 rounded-lg text-center">
            <p className="text-xs text-yellow-800">1st Place</p>
            <p className="text-lg font-bold text-yellow-900 mt-1">25,000</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <p className="text-xs text-gray-800">2nd Place</p>
            <p className="text-lg font-bold text-gray-900 mt-1">15,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizePoolInfo;
