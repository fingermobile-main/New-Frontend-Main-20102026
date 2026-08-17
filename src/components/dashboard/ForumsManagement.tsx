import React, {} from 'react';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface ForumsManagementProps {}

const ForumsManagement: React.FC<ForumsManagementProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ChatBubbleLeftIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Forums Management</h3>
      </div>
      <div className="space-y-3">
        <div className="p-3 border border-gray-200 rounded-lg">
          <p className="font-medium text-gray-900">General Discussion</p>
          <p className="text-sm text-gray-500 mt-1">245 threads • 1.2K posts</p>
        </div>
        <div className="p-3 border border-gray-200 rounded-lg">
          <p className="font-medium text-gray-900">Technical Support</p>
          <p className="text-sm text-gray-500 mt-1">189 threads • 890 posts</p>
        </div>
      </div>
    </div>
  );
};

export default ForumsManagement;
