import React, { useState } from 'react';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface AIContentAssistantProps {
  isOpen?: boolean;
  onClose?: () => void;
  onGenerate?: (prompt: string, contentType: string) => void;
}

const AIContentAssistant: React.FC<AIContentAssistantProps> = ({
  isOpen = true,
  onClose,
  onGenerate
}) => {
  const [prompt, setPrompt] = React.useState('');
  const [contentType, setContentType] = React.useState('post');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      onGenerate?.(prompt, contentType);
      setPrompt('');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen && onClose) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">AI Content Assistant</h3>
        </div>
        {onClose && (
          <button onClick={onClose} aria-label="Close" className="text-slate-700 hover:text-gray-600">
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900 font-bold border-slate-300 bg-white"
          >
            <option value="post">Social Post</option>
            <option value="article">Article</option>
            <option value="caption">Image Caption</option>
            <option value="description">Product Description</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Describe what you want</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            placeholder="E.g., Write an engaging post about sustainable fashion trends..."
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate Content
            </>
          )}
        </button>

        <div className="text-xs text-slate-700 text-center">
          Powered by AI • Costs 10 FIC per generation
        </div>
      </div>
    </div>
  );
};

export default AIContentAssistant;
