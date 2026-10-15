import React, {} from 'react';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

interface CreatorToolsProps {
  userId?: string;
}

const CreatorTools: React.FC<CreatorToolsProps> = ({ userId }) => {
  const tools = [
    { id: 'analytics', name: 'Analytics', description: 'Track your performance', icon: '📊' },
    { id: 'scheduler', name: 'Content Scheduler', description: 'Plan your posts', icon: '📅' },
    { id: 'monetization', name: 'Monetization', description: 'Earn from content', icon: '💰' },
    { id: 'collaboration', name: 'Collaboration', description: 'Work with others', icon: '🤝' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-6">
        <WrenchScrewdriverIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Creator Tools</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
          >
            <div className="text-3xl mb-2">{tool.icon}</div>
            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{tool.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{tool.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreatorTools;
