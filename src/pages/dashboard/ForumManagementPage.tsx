import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { ForumCategory } from '../../types';

// Define a simple ID generator function
const generateUniqueId = (prefix = "id"): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

const ForumManagementPage: React.FC = () => {
  const {
    forumCategories,
    handleUpsertForumCategory,
    handleDeleteForumCategory
  } = useAppContext();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<ForumCategory | null>(
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
    const [name, setName] = React.useState(editingCategory?.name || "");
    const [description, setDescription] = React.useState(
      editingCategory?.description || "",
    );
    const [slug, setSlug] = React.useState(editingCategory?.slug || "");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newCategory: ForumCategory = {
        id: editingCategory?.id || generateUniqueId("cat"),
        name,
        description,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        postCount: editingCategory?.postCount || 0,
        viewCount: editingCategory?.viewCount, // Allow undefined as per interface
        headerImage:
          editingCategory?.headerImage ||
          `https://picsum.photos/seed/forum-${slug}/1200/300`
      };

      handleUpsertForumCategory?.(newCategory);
      setIsModalOpen(false);
    };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={() => setIsModalOpen(false)}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg p-6 w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-bold text-lg mb-4">
            {editingCategory ? "Edit" : "Create"} Category
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
            <input
              type="text"
              placeholder="URL Slug (e.g., general-discussion)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-lg"
            >
              {editingCategory ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Forum Categories</h1>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg"
          >
            Create New Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(forumCategories || []).map((category: ForumCategory) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteForumCategory?.(category.id)}
                  className="text-red-500 hover:text-red-700"

                >
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