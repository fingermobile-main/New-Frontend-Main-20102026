import React, {} from 'react';
import { FolderIcon } from '@heroicons/react/24/outline';

const StercsMediaLibrary: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FolderIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Media Library</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-3xl">🖼️</span>
        </div>
        <div className="aspect-square bg-gradient-to-br from-green-100 to-cyan-100 rounded-lg flex items-center justify-center">
          <span className="text-3xl">🎥</span>
        </div>
        <div className="aspect-square bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
          <span className="text-3xl">🎵</span>
        </div>
      </div>
    </div>
  );
};

export default StercsMediaLibrary;
