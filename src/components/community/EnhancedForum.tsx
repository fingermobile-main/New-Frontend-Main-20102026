import React, { useState, useEffect } from 'react';
import { ChatBubbleLeftIcon, HeartIcon } from '@heroicons/react/24/outline';

interface EnhancedForumProps {
  categoryId?: string;
}

const EnhancedForum: React.FC<EnhancedForumProps> = ({ categoryId }) => {
  const [threads, setThreads] = React.useState<any[]>([]);

  React.useEffect(() => {
    setThreads([
      { id: '1', title: 'Best practices for React performance?', author: 'DevMaster', replies: 23, likes: 45, created: '2 days ago' },
      { id: '2', title: 'How to handle authentication in Next.js?', author: 'WebDev101', replies: 18, likes: 32, created: '3 days ago' },
      { id: '3', title: 'TypeScript vs JavaScript in 2026', author: 'CodeGuru', replies: 56, likes: 89, created: '5 days ago' },
      { id: '4', title: 'Database optimization tips', author: 'DBExpert', replies: 12, likes: 28, created: '1 week ago' }
    ]);
  }, [categoryId]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300">
      <div className="p-6 border-b border-slate-300 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Community Forum</h3>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          New Thread
        </button>
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {threads.map((thread) => (
          <div key={thread.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <h4 className="font-medium text-gray-900 mb-2 hover:text-blue-600 transition-colors">{thread.title}</h4>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">{thread.author}</span>
                <span>{thread.created}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  {thread.replies}
                </span>
                <span className="flex items-center gap-1">
                  <HeartIcon className="w-4 h-4" />
                  {thread.likes}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnhancedForum;
