import React, {} from 'react';
import { VideoCameraIcon } from '@heroicons/react/24/outline';

const StercsVideoEditor: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <VideoCameraIcon className="w-6 h-6 text-red-600" />
        <h3 className="text-lg font-bold text-gray-900">Video Editor</h3>
      </div>
      <div className="space-y-3">
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <p className="text-gray-400">Video preview</p>
        </div>
        <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Start Editing
        </button>
      </div>
    </div>
  );
};

export default StercsVideoEditor;
