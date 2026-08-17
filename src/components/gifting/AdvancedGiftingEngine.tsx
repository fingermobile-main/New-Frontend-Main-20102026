import React, {} from 'react';
import { GiftIcon } from '@heroicons/react/24/outline';

const AdvancedGiftingEngine: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <GiftIcon className="w-6 h-6 text-pink-600" />
        <h3 className="text-lg font-bold text-gray-900">Gifting Engine</h3>
      </div>
      <div className="space-y-3">
        <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
          Send Gift
        </button>
        <div className="p-3 bg-pink-50 rounded-lg">
          <p className="text-sm text-pink-800">Available Gifts</p>
          <p className="text-2xl font-bold text-pink-900 mt-1">24</p>
        </div>
      </div>
    </div>
  );
};

export default AdvancedGiftingEngine;
