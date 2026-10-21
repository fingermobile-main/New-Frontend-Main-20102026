import { Link} from 'react-router-dom';
import React, {} from 'react';
import { ShareIcon } from '@heroicons/react/24/outline';

interface ShareDashboardProps {}

const ShareDashboard: React.FC<ShareDashboardProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShareIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Share Dashboard</h3>
      </div>
      <div className="space-y-3">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Generate Share Link
        </button>
        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Invite Collaborators
        </button>
      </div>
    </div>
  );
};

export default ShareDashboard;
