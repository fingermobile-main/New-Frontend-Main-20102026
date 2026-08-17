import React, {} from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface EditorStudioIntegrationProps {
  projectId?: string;
}

const EditorStudioIntegration: React.FC<EditorStudioIntegrationProps> = ({ projectId }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <PencilSquareIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">Editor Studio</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-center">
          <div className="text-3xl mb-2">🎨</div>
          <p className="font-medium text-gray-900">Page Editor</p>
        </button>
        <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-center">
          <div className="text-3xl mb-2">📄</div>
          <p className="font-medium text-gray-900">Templates</p>
        </button>
      </div>
    </div>
  );
};

export default EditorStudioIntegration;
