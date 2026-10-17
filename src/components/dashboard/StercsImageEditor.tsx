import React, {} from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface StercsImageEditorProps {}

const StercsImageEditor: React.FC<StercsImageEditorProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <PhotoIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Image Editor</h3>
      </div>
      <div className="space-y-3">
        <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Upload Image
        </button>
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-slate-700">Image preview area</p>
        </div>
      </div>
    </div>
  );
};

export default StercsImageEditor;
