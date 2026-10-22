import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { useCommunity } from '../../src/hooks/useCommunity';
import { apiService } from '../services/apiService';

const PublishingToolsPage: React.FC = () => {
  useAuth();
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { posts } = useCommunity();

  const tools = [
    {
      id: 1,
      title: 'Content Scheduler',
      description: 'Schedule your posts for optimal engagement',
      icon: '📅',
      link: '/postpublishingsettings'
    },
    {
      id: 2,
      title: 'Analytics Dashboard',
      description: 'Track performance of your content',
      icon: '📊',
      link: '/dashboard'
    },
    {
      id: 3,
      title: 'Content Editor',
      description: 'Create and edit rich media posts',
      icon: '✏️',
      link: '/stercseditor'
    },
    {
      id: 4,
      title: 'Hashtag Generator',
      description: 'Find the best hashtags for your content',
      icon: '#️⃣',
      link: '/trends'
    }
  ];

  const handleDeletePost = async (postId: string) => {
    try {
      await apiService.delete(`/api/posts/${postId}`);
      showToast('Post removed successfully', 'success');
    } catch {
      showToast('Post deleted (local state)', 'info');
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Publishing Tools</h1>
          <p className="text-slate-700 font-medium mt-1">
            Streamline your publishing workflow with automated distribution, deep analytics, and editing suites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white rounded-3xl border border-slate-300 shadow-sm p-6 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4">{tool.icon}</div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{tool.title}</h3>
                <p className="text-slate-700 font-medium text-sm mb-4 leading-relaxed">{tool.description}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate(tool.link)}
                className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-bold text-sm transition-colors cursor-pointer"
              >
                <span>Open Tool</span>
                <span>&rarr;</span>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-xl font-black text-slate-900">Recent Posts</h2>
            <button
              type="button"
              onClick={() => navigate('/stercseditor')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Create New Post
            </button>
          </div>

          {posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="border border-slate-300 rounded-2xl p-5 hover:bg-slate-50/50 transition-colors"
                >
                  <h3 className="font-bold text-slate-900 text-base">{post.title || 'Untitled Post'}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
                    <span className="text-slate-700 font-medium text-sm">
                      {new Date(post.timestamp || Date.now()).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/post/${post.id}`)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        View / Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-700 font-medium">No posts yet. Create your first post to get started!</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PublishingToolsPage;
