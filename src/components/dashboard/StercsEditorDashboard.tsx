import React, {} from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const StercsEditorDashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <PencilSquareIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">STERCS Editor</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
          <div className="text-3xl mb-2">📝</div>
          <p className="font-medium text-gray-900">Content Editor</p>
        </button>
        <button className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center">
          <div className="text-3xl mb-2">🎨</div>
          <p className="font-medium text-gray-900">Theme Editor</p>
        </button>
      </div>
    </div>
  );
};

export default StercsEditorDashboard;
