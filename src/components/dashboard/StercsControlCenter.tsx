import React, {} from 'react';
import { CogIcon } from '@heroicons/react/24/outline';

interface StercsControlCenterProps {}

const StercsControlCenter: React.FC<StercsControlCenterProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CogIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">STERCS Control Center</h3>
      </div>
      <div className="space-y-3">
        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          System Configuration
        </button>
        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Performance Metrics
        </button>
      </div>
    </div>
  );
};

export default StercsControlCenter;
