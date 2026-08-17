import React, { useState } from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

interface ContentStudioLinkProps {
  userId?: string;
}

const ContentStudioLink: React.FC<ContentStudioLinkProps> = ({ userId }) => {
  const [stats, setStats] = React.useState({
    drafts: 5,
    published: 23,
    scheduled: 3
  });

  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <PencilSquareIcon className="w-8 h-8" />
        <div>
          <h3 className="text-lg font-bold">Content Studio</h3>
          <p className="text-sm opacity-90">Create & manage your content</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.drafts}</p>
          <p className="text-xs opacity-90">Drafts</p>
        </div>
        <div className="bg-white/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.published}</p>
          <p className="text-xs opacity-90">Published</p>
        </div>
        <div className="bg-white/20 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{stats.scheduled}</p>
          <p className="text-xs opacity-90">Scheduled</p>
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
        Open Studio
      </button>
    </div>
  );
};

export default ContentStudioLink;
