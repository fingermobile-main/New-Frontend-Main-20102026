import React, {} from 'react';
import { PaintBrushIcon } from '@heroicons/react/24/outline';

const StercsThemeDesigner: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <PaintBrushIcon className="w-6 h-6 text-pink-600" />
        <h3 className="text-lg font-bold text-gray-900">Theme Designer</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-center">
          <p className="font-medium">Preview Theme</p>
        </div>
        <button className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors">
          Save Theme
        </button>
      </div>
    </div>
  );
};

export default StercsThemeDesigner;
