import React, {} from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

interface FingerMobileMonacoEditorProps {}

const FingerMobileMonacoEditor: React.FC<FingerMobileMonacoEditorProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CodeBracketIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Monaco Editor</h3>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 min-h-[200px]">
        <textarea
          className="w-full h-full bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none"
          placeholder="// Write your code here..."
          rows={10}
        />
      </div>
    </div>
  );
};

export default FingerMobileMonacoEditor;
