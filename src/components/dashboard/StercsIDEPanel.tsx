import React, { useState } from 'react';
import { CommandLineIcon, FolderIcon, CodeBracketIcon } from '../../icons';

const StercsIDEPanel = () => {
  const [activeTab, setActiveTab] = useState('terminal');

  return (
    <div className="h-64 border-t border-gray-200 bg-gray-900 text-gray-100 flex flex-col font-sans">
      <div className="flex bg-gray-800 border-b border-gray-700 px-2">
        <button onClick={() => setActiveTab('terminal')} className={`px-4 py-2 flex items-center gap-2 text-sm ${activeTab === 'terminal' ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-700/50' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'}`}>
          <CommandLineIcon className="w-4 h-4" /> Terminal
        </button>
        <button onClick={() => setActiveTab('files')} className={`px-4 py-2 flex items-center gap-2 text-sm ${activeTab === 'files' ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-700/50' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'}`}>
          <FolderIcon className="w-4 h-4" /> Explorer
        </button>
        <button onClick={() => setActiveTab('source-control')} className={`px-4 py-2 flex items-center gap-2 text-sm ${activeTab === 'source-control' ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-700/50' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/30'}`}>
          <CodeBracketIcon className="w-4 h-4" /> Version Control
        </button>
      </div>
      <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
        {activeTab === 'terminal' && (
          <div>
            <div className="text-green-400 mb-1">stercs@fingermobile:~/project$ <span className="animate-pulse">_</span></div>
            <div className="mt-2 text-gray-400">Lingma AI Terminal integration standing by...</div>
            <div className="text-gray-500 text-xs mt-4">Run commands to build, deploy, or generate components using AI.</div>
          </div>
        )}
        {activeTab === 'files' && (
          <div className="text-gray-300">
            <div className="flex items-center gap-2 hover:bg-gray-800 p-1 rounded cursor-pointer"><FolderIcon className="w-4 h-4 text-blue-400"/> src/</div>
            <div className="ml-4 flex items-center gap-2 hover:bg-gray-800 p-1 rounded cursor-pointer"><CodeBracketIcon className="w-4 h-4 text-yellow-400"/> index.tsx</div>
            <div className="ml-4 flex items-center gap-2 hover:bg-gray-800 p-1 rounded cursor-pointer"><CodeBracketIcon className="w-4 h-4 text-blue-400"/> App.tsx</div>
            <div className="mt-4 text-xs text-gray-500">Workspace connected. Drag and drop to upload assets.</div>
          </div>
        )}
        {activeTab === 'source-control' && (
          <div className="text-gray-300">
            <div className="font-sans font-medium mb-2">Source Control</div>
            <div className="flex items-center gap-2 mb-4 text-xs">Branch: <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">main</span></div>
            <div className="mt-2 text-gray-400 text-xs flex flex-col gap-2">
              <span>0 changed files</span>
              <button className="bg-blue-600 hover:bg-blue-500 text-white font-sans rounded px-3 py-1 self-start">Commit & Push</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StercsIDEPanel;
