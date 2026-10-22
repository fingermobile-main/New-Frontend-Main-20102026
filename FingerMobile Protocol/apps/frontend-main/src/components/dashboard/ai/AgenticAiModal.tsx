import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface AgenticAiModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AgenticAiModal: React.FC<AgenticAiModalProps> = ({ isOpen = false, onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setMessages((prev) => [...prev, inputVal.trim()]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">AI Assistant</h2>
          </div>
          <button type="button" onClick={onClose} className="text-slate-700 hover:text-gray-600" aria-label="Close AI Assistant modal"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          </button>
        </div>
        <form onSubmit={handleSend} className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-900">How can I help you today?</p>
            {messages.map((m, i) => (
              <p key={i} className="text-sm font-semibold text-purple-800 mt-2 bg-white/60 p-2 rounded">
                You: {m}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900 font-bold bg-white placeholder:text-slate-500" />
          <button
            type="submit"
            aria-label="Send message to AI assistant"
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgenticAiModal;
