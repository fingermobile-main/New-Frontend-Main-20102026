import React, { useState } from 'react';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

interface BlogsManagementProps {
  userId?: string;
}

const BlogsManagement: React.FC<BlogsManagementProps> = ({ userId }) => {
  const [blogs, setBlogs] = React.useState([
    { id: '1', title: 'Getting Started with React', status: 'published', views: 1250, created: '2026-06-01' },
    { id: '2', title: 'Advanced TypeScript Tips', status: 'draft', views: 0, created: '2026-06-10' },
    { id: '3', title: 'Building Scalable APIs', status: 'published', views: 890, created: '2026-05-25' }
  ]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Blog Management</h3>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          New Post
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {blogs.map((blog) => (
          <div key={blog.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{blog.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{blog.views} views • {new Date(blog.created).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                blog.status === 'published' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
              }`}>
                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsManagement;
