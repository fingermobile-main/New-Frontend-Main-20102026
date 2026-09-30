import React, {} from 'react';

import { useAppContext } from '../contexts/AppContext';
// Deleted:
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useCommunity } from '../../src/hooks/useCommunity';

interface Post {
  id: string;
  title?: string;
  timestamp: string;
}

const PublishingToolsPage: React.FC = () => {
  useAuth(); // Removed unused 'member' variable
  const { posts } = useCommunity();

  const tools = [
    {
      id: 1,
      title: 'Content Scheduler',
      description: 'Schedule your posts for optimal engagement',
      icon: '📅'
    },
    {
      id: 2,
      title: 'Analytics Dashboard',
      description: 'Track performance of your content',
      icon: '📊'
    },
    {
      id: 3,
      title: 'Content Editor',
      description: 'Create and edit rich media posts',
      icon: '✏️'
    },
    {
      id: 4,
      title: 'Hashtag Generator',
      description: 'Find the best hashtags for your content',
      icon: '#️⃣'
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Publishing Tools</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tools.map((tool) => (
            <div key={tool.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="text-3xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
              <p className="text-gray-600 mb-4">{tool.description}</p>
              <button className="text-blue-500 font-medium hover:text-blue-700">
                Open Tool
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold">{post.title || 'Untitled Post'}</h3>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-500 text-sm">
                      {new Date(post.timestamp || Date.now()).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-3">
                      <button className="text-blue-500 hover:text-blue-700 text-sm">
                        Edit
                      </button>
                      <button className="text-red-500 hover:text-red-700 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts yet. Create your first post to get started!</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PublishingToolsPage;
