import React, {} from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface FingerMobileEditorStudioProps {}

const FingerMobileEditorStudio: React.FC<FingerMobileEditorStudioProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <PencilSquareIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">FingerMobile Editor Studio</h3>
      </div>
      <div className="space-y-3">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create New Page
        </button>
        <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Manage Templates
        </button>
      </div>
    </div>
  );
};

export default FingerMobileEditorStudio;
