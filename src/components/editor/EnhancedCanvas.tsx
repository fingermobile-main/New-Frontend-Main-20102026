import React, {} from 'react';

interface EnhancedCanvasProps {
  projectId?: string;
  pageId?: string;
  onSave?: () => void;
  onPreview?: () => void;
}

const EnhancedCanvas: React.FC<EnhancedCanvasProps> = ({ 
  projectId,
  pageId,
  onSave,
  onPreview 
}) => {
  return (
    <div className="flex-1 bg-gray-50 overflow-auto">
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[800px] p-8">
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Enhanced Canvas</h2>
            <p className="text-sm text-gray-600 mt-1">
              {projectId ? `Project: ${projectId}` : 'No project selected'}
              {pageId && ` | Page: ${pageId}`}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
              <p className="text-gray-500 mb-2">Drop components here to build your page</p>
              <p className="text-sm text-gray-400">Support for drag-and-drop component placement</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onPreview}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Preview
            </button>
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCanvas;
