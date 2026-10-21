import React from 'react';
import { useAppContext } from '../contexts/AppContext';

export default function ForumCategories() {
  const context = useAppContext();
  const categoriesContext = context.forumCategories || [];

  // Mock data to replicate HTML structure
  const categories = [
    { name: 'All Categories', count: 142, active: true },
    { name: 'Announcements', count: 24, active: false },
    { name: 'General Discussion', count: 58, active: false },
    { name: 'Technical Support', count: 32, active: false },
    { name: 'Feedback & Suggestions', count: 18, active: false },
    { name: 'Off Topic', count: 10, active: false },
  ];

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.03)] mb-6 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-gray-50/50 to-white/50">
        <h2 className="text-sm font-bold text-gray-900 tracking-wide uppercase">Categories</h2>
      </div>
      <div className="p-3">
        <nav>
          <ul className="space-y-1.5">
            {categories.map((category) => (
              <li key={category.name}>
                <a
                  href="#"
                  className={`group flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    category.active
                      ? 'bg-gradient-to-r from-brand-blue/10 to-blue-50/50 text-brand-blue shadow-sm border border-brand-blue/10'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100'
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <span
                    className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
                      category.active
                        ? 'bg-brand-blue text-white shadow-sm'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                    }`}
                  >
                    {category.count}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
