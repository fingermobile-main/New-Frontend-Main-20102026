import React, {} from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';

interface MonacoEditorDemoProps {}

const MonacoEditorDemo: React.FC<MonacoEditorDemoProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CodeBracketIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Monaco Editor Demo</h3>
      </div>
      <div className="bg-gray-900 rounded-lg p-4 min-h-[200px]">
        <pre className="text-green-400 font-mono text-sm">
          {'// Monaco Editor Demo\nfunction hello() {\n  console.info("Hello, World!");\n}'}
        </pre>
      </div>
    </div>
  );
};

export default MonacoEditorDemo;
