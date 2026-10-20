import React, {} from 'react';
import EnhancedEditorStudio from '../../components/editor/EnhancedEditorStudio';

const EditorStudioPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            FingerMobile Protocol - Editor Studio
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Super Admin Dashboard</span>
            <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center">
              <span className="text-xs font-bold">SA</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-700 text-white px-4 py-2 text-sm flex items-center">
          <span>Editor Studio / Builder</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <EnhancedEditorStudio />
        </div>
      </div>

      <footer className="bg-gray-800 text-slate-300 font-medium text-xs p-2 text-center border-t border-gray-700">
        FingerMobile Protocol Editor Studio v1.0 | Guardian AI Assistant Enabled
      </footer>
    </div>
  );
};

export default EditorStudioPage;
