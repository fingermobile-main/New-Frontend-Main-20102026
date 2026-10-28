import React, { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface BlogsManagementProps {
  userId?: string;
}

const BlogsManagement: React.FC<BlogsManagementProps> = ({ userId }) => {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [blogs, setBlogs] = useState([
    { id: '1', title: 'Getting Started with React', status: 'published', views: 1250, created: '2026-06-01' },
    { id: '2', title: 'Advanced TypeScript Tips', status: 'draft', views: 0, created: '2026-06-10' },
    { id: '3', title: 'Building Scalable APIs', status: 'published', views: 890, created: '2026-05-25' }
  ]);

  const filteredBlogs = blogs.filter((blog) => {
    if (filter === 'published') return blog.status === 'published';
    if (filter === 'draft') return blog.status === 'draft';
    return true;
  });

  return (
    <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12 bg-white rounded-xl shadow-sm border border-slate-300">
      <div className="p-6 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-bold text-gray-900">Blog Management</h3>
            <p className="text-xs text-slate-700 mt-0.5">Publish, edit, and curate platform stories</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Create a new blog post"
            onClick={() => window.location.assign('/blog/create')}
            className="min-h-[44px] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center"
          >
            New Post
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-gray-900">{blog.title}</h4>
                <p className="text-sm text-slate-700 mt-1">{blog.views} views • {new Date(blog.created).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                blog.status === 'published' ? 'bg-green-100 text-green-950 border border-green-400' : 'bg-amber-100 text-amber-950 border border-amber-400'
              }`}>
                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <button
          onClick={() => setFilter('all')}
          aria-label="Show All Posts"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            filter === 'all' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">📚</span>
          <span>All</span>
        </button>
        <button
          onClick={() => setFilter('published')}
          aria-label="Show Published"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            filter === 'published' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">✅</span>
          <span>Live</span>
        </button>
        <button
          onClick={() => setFilter('draft')}
          aria-label="Show Drafts"
          className={`min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold ${
            filter === 'draft' ? 'text-blue-600' : 'text-slate-800 hover:text-blue-600'
          }`}
        >
          <span className="text-base">📝</span>
          <span>Drafts</span>
        </button>
        <button
          onClick={() => window.location.assign('/blog/create')}
          aria-label="Quick New Post"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">➕</span>
          <span>Create</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default BlogsManagement;
