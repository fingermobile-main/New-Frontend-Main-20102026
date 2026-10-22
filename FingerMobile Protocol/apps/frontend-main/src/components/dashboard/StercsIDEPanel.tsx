import React, { useState } from 'react';
import { CommandLineIcon, FolderIcon, CodeBracketIcon } from '../../icons';

const StercsIDEPanel = () => {
  const [activeTab, setActiveTab] = useState('terminal');
  const [selectedFile, setSelectedFile] = useState<string>('src/App.tsx');
  const [commitStatus, setCommitStatus] = useState<string | null>(null);

  const handleCommit = () => {
    setCommitStatus('Working tree clean. Nothing to commit.');
    setTimeout(() => setCommitStatus(null), 3000);
  };

  return (
    <div className="h-64 border-t border-gray-800 bg-gray-900 text-gray-100 flex flex-col font-sans">
      <div className="flex bg-gray-800 border-b border-gray-700 px-2" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'terminal'}
          onClick={() => setActiveTab('terminal')}
          className={`px-4 py-2 flex items-center gap-2 text-sm ${activeTab === 'terminal' ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-700/50 font-bold' : 'text-gray-300 font-medium hover:text-white hover:bg-gray-700/30'}`}
        >
          <CommandLineIcon className="w-4 h-4" /> Terminal
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'files'}
          onClick={() => setActiveTab('files')}
          className={`px-4 py-2 flex items-center gap-2 text-sm ${activeTab === 'files' ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-700/50 font-bold' : 'text-gray-300 font-medium hover:text-white hover:bg-gray-700/30'}`}
        >
          <FolderIcon className="w-4 h-4" /> Explorer
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'source-control'}
          onClick={() => setActiveTab('source-control')}
          className={`px-4 py-2 flex items-center gap-2 text-sm ${activeTab === 'source-control' ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-700/50 font-bold' : 'text-gray-300 font-medium hover:text-white hover:bg-gray-700/30'}`}
        >
          <CodeBracketIcon className="w-4 h-4" /> Version Control
        </button>
      </div>
      <div className="flex-1 p-4 font-mono text-sm overflow-y-auto">
        {activeTab === 'terminal' && (
          <div>
            <div className="text-green-400 mb-1">stercs@fingermobile:~/project$ <span className="animate-pulse">_</span></div>
            <div className="mt-2 text-gray-300 font-medium">Lingma AI Terminal integration standing by...</div>
            <div className="text-gray-300 font-medium text-xs mt-4">Run commands to build, deploy, or generate components using AI.</div>
          </div>
        )}
        {activeTab === 'files' && (
          <div className="text-gray-200">
            <button
              type="button"
              onClick={() => setSelectedFile('src')}
              className={`w-full text-left flex items-center gap-2 p-1 rounded hover:bg-gray-800 ${selectedFile === 'src' ? 'bg-gray-800 text-blue-400 font-semibold' : ''}`}
            >
              <FolderIcon className="w-4 h-4 text-blue-400"/> src/
            </button>
            <button
              type="button"
              onClick={() => setSelectedFile('src/index.tsx')}
              className={`w-full text-left ml-4 flex items-center gap-2 p-1 rounded hover:bg-gray-800 ${selectedFile === 'src/index.tsx' ? 'bg-gray-800 text-yellow-300 font-semibold' : ''}`}
            >
              <CodeBracketIcon className="w-4 h-4 text-yellow-400"/> index.tsx
            </button>
            <button
              type="button"
              onClick={() => setSelectedFile('src/App.tsx')}
              className={`w-full text-left ml-4 flex items-center gap-2 p-1 rounded hover:bg-gray-800 ${selectedFile === 'src/App.tsx' ? 'bg-gray-800 text-blue-300 font-semibold' : ''}`}
            >
              <CodeBracketIcon className="w-4 h-4 text-blue-400"/> App.tsx
            </button>
            <div className="mt-4 text-xs text-gray-300 font-medium">Workspace connected: <span className="text-blue-400 font-bold">{selectedFile}</span>. Drag and drop to upload assets.</div>
          </div>
        )}
        {activeTab === 'source-control' && (
          <div className="text-gray-200">
            <div className="font-sans font-medium mb-2">Source Control</div>
            <div className="flex items-center gap-2 mb-4 text-xs">Branch: <span className="bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded font-bold">main</span></div>
            <div className="mt-2 text-gray-300 font-medium text-xs flex flex-col gap-2">
              <span>0 changed files</span>
              <button
                type="button"
                onClick={handleCommit}
                className="bg-blue-600 hover:bg-blue-500 text-white font-sans rounded px-3 py-1 self-start font-bold transition-colors"
              >
                Commit & Push
              </button>
              {commitStatus && (
                <span className="text-emerald-400 text-xs mt-1">{commitStatus}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StercsIDEPanel;
