import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { ForumCategory } from '../../types';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import { Plus, Edit2, Trash2, X, MessageSquare } from 'lucide-react';

// Define a simple ID generator function
const generateUniqueId = (prefix = 'cat'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

const ForumManagementPage: React.FC = () => {
  const {
    forumCategories,
    handleUpsertForumCategory,
    handleDeleteForumCategory,
    showToast
  } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ForumCategory | null>(
    null,
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category: ForumCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const CategoryEditorModal: React.FC = () => {
    const [name, setName] = useState(editingCategory?.name || '');
    const [description, setDescription] = useState(
      editingCategory?.description || '',
    );
    const [slug, setSlug] = useState(editingCategory?.slug || '');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) {
        showToast?.('Category name is required', 'error');
        return;
      }
      const newCategory: ForumCategory = {
        id: editingCategory?.id || generateUniqueId('cat'),
        name,
        description,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        postCount: editingCategory?.postCount || 0,
        viewCount: editingCategory?.viewCount,
        headerImage:
          editingCategory?.headerImage ||
          `https://picsum.photos/seed/forum-${slug || 'default'}/1200/300`
      };

      handleUpsertForumCategory?.(newCategory);
      showToast?.(
        editingCategory ? 'Category updated successfully' : 'New category created successfully',
        'success'
      );
      setIsModalOpen(false);
    };

    return (
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4"
        onClick={() => setIsModalOpen(false)}
        role="button"
        tabIndex={0}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-6 w-full max-w-lg border border-slate-300 shadow-xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-black text-xl text-slate-900">
              {editingCategory ? 'Edit Forum Category' : 'Create New Category'}
            </h3>
            <button aria-label="Close"
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="p-1 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. Protocol Governance"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              placeholder="Brief description of the forum topic..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              URL Slug
            </label>
            <input
              type="text"
              placeholder="e.g. protocol-governance"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
            >
              {editingCategory ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const categories = forumCategories && forumCategories.length > 0 ? forumCategories : [
    {
      id: 'cat-1',
      name: 'General Discussion',
      description: 'Open discussion about FingerMobile platform, updates, and community news.',
      slug: 'general-discussion',
      postCount: 142
    },
    {
      id: 'cat-2',
      name: 'Node & Staking Operations',
      description: 'Technical guidance, validator node operations, and staking telemetry.',
      slug: 'node-staking',
      postCount: 89
    },
    {
      id: 'cat-3',
      name: 'Franchise Hubs & Commerce',
      description: 'Discussions for regional franchise operators and merchant liquidity providers.',
      slug: 'franchise-hubs',
      postCount: 64
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <PlatformOwnershipCard />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-300 pb-5">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Forum Categories Management</h1>
            <p className="text-sm font-semibold text-slate-700 mt-1">
              Organize, moderate, and structure community discussion boards and thread hierarchies
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            Create New Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category: ForumCategory) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-900 border border-blue-300">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">{category.name}</h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                    {category.postCount || 0} posts
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 mt-2">{category.description}</p>
                <div className="mt-3">
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    /{category.slug}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-200">
                <button
                  onClick={() => openEditModal(category)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 border border-slate-300 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDeleteForumCategory?.(category.id);
                    showToast?.(`Category ${category.name} deleted`, 'info');
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && <CategoryEditorModal />}
      </div>
    </div>
  );
};

export default ForumManagementPage;
