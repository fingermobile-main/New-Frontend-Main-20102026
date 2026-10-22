import React, {} from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface EditorStudioProps {}

const EditorStudio: React.FC<EditorStudioProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <PencilSquareIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Editor Studio</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          aria-label="Open Text Editor"
          onClick={() => window.location.assign('/stercs?mode=text')}
          className="p-4 border border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
        >
          <div className="text-3xl mb-2">📝</div>
          <p className="font-medium text-gray-900">Text Editor</p>
        </button>
        <button
          type="button"
          aria-label="Open Visual Editor"
          onClick={() => window.location.assign('/stercs?mode=visual')}
          className="p-4 border border-slate-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-center"
        >
          <div className="text-3xl mb-2">🎨</div>
          <p className="font-medium text-gray-900">Visual Editor</p>
        </button>
      </div>
    </div>
  );
};

export default EditorStudio;
