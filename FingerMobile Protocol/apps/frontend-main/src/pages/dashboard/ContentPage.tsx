import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import { logError } from '../../utils/errorLogger';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'post' | 'photo' | 'video' | 'music';
  title: string;
  author: string;
  status: 'Published' | 'Draft' | 'Pending';
  date: string;
}

const ContentPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<
    'all' | 'posts' | 'photos' | 'videos' | 'music'
  >('all');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'post' as 'post' | 'photo' | 'video' | 'music',
    author: 'Admin Operator',
    status: 'Published' as 'Published' | 'Draft' | 'Pending'
  });

  // Content data with live integration
  const [contentItems, setContentItems] = useState<ContentItem[]>([
    {
      id: '1',
      type: 'post',
      title: 'Protocol 3.0 Governance Liquidity Parameters',
      author: 'Jane Cooper',
      status: 'Published',
      date: '2026-10-15'
    },
    {
      id: '2',
      type: 'photo',
      title: 'Summer Merchant Showcase Campaign',
      author: 'John Doe',
      status: 'Published',
      date: '2026-10-14'
    },
    {
      id: '3',
      type: 'post',
      title: 'Tutorial: On-boarding to Local Franchise Hub',
      author: 'Emily Smith',
      status: 'Draft',
      date: '2026-10-12'
    },
    {
      id: '4',
      type: 'music',
      title: 'Community Anthem: Beats of FingerMobile',
      author: 'Michael Brown',
      status: 'Published',
      date: '2026-10-10'
    },
    {
      id: '5',
      type: 'post',
      title: 'Consensus Security & Safe Staking Directives',
      author: 'Sarah Johnson',
      status: 'Published',
      date: '2026-10-08'
    },
    {
      id: '6',
      type: 'video',
      title: 'Behind the Scenes: Port Harcourt Node Launch',
      author: 'David Wilson',
      status: 'Pending',
      date: '2026-10-05'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleDeletePost = (id: string) => {
    apiService.delete(`/api/posts/${id}`)
      .then(() => {
        setContentItems(prev => prev.filter(item => item.id !== id));
        showToast('Content item removed successfully', 'success');
      })
      .catch(() => {
        setContentItems(prev => prev.filter(item => item.id !== id));
        showToast('Content item removed from local view', 'info');
      });
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    if (editingItem) {
      setContentItems(prev =>
        prev.map(item =>
          item.id === editingItem.id
            ? { ...item, ...formData }
            : item
        )
      );
      showToast('Content item updated', 'success');
      setEditingItem(null);
    } else {
      const newItem: ContentItem = {
        id: `cnt-${Date.now()}`,
        title: formData.title,
        type: formData.type,
        author: formData.author,
        status: formData.status,
        date: new Date().toISOString().substring(0, 10)
      };
      setContentItems(prev => [newItem, ...prev]);
      showToast('New content created successfully', 'success');
      setIsCreateOpen(false);
    }

    setFormData({
      title: '',
      type: 'post',
      author: 'Admin Operator',
      status: 'Published'
    });
  };

  useEffect(() => {
    apiService.get<any>('/api/posts')
      .then((res) => {
        const data = res.data?.data?.posts || res.data?.posts || res.data;
        if (Array.isArray(data) && data.length > 0) {
          const livePosts: ContentItem[] = data.map((p: any) => ({
            id: String(p.id),
            type: 'post',
            title: p.title || 'Untitled Post',
            author: p.author_name || 'Admin',
            status: p.is_active ? 'Published' : 'Draft',
            date: p.created_at ? p.created_at.substring(0, 10) : '2026-10-20'
          }));
          setContentItems(prev => [...livePosts, ...prev.filter(item => item.type !== 'post')]);
        }
      })
      .catch((err) => {
        logError(err, { context: 'ContentPage - Fetch live posts' });
      });
  }, []);

  const filteredContent =
    activeTab === 'all'
      ? contentItems
      : contentItems.filter((item) => {
          if (activeTab === 'posts') return item.type === 'post';
          if (activeTab === 'photos') return item.type === 'photo';
          if (activeTab === 'videos') return item.type === 'video';
          if (activeTab === 'music') return item.type === 'music';
          return true;
        });

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage) || 1;
  const paginatedContent = filteredContent.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <PlatformOwnershipCard />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-300 pb-5">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Content Management Hub
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            Audit, publish, review and manage all multi-media protocol streams
          </p>
        </div>
        <div>
          <button
            onClick={() => {
              setEditingItem(null);
              setFormData({
                title: '',
                type: 'post',
                author: 'Admin Operator',
                status: 'Published'
              });
              setIsCreateOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Content
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-slate-300 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-300 bg-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h3 className="text-lg font-black text-slate-900">
              Content Catalog ({filteredContent.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Content' },
                { id: 'posts', label: 'Posts' },
                { id: 'photos', label: 'Photos' },
                { id: 'videos', label: 'Videos' },
                { id: 'music', label: 'Music' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-300">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                >
                  Content Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                >
                  Author
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-bold text-slate-800 uppercase tracking-wider"
                >
                  Date
                </th>
                <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {paginatedContent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-700">
                    <p className="font-bold text-slate-900 text-base">No content found</p>
                    <p className="text-sm font-semibold text-slate-700 mt-1">There are no items currently in this category.</p>
                  </td>
                </tr>
              ) : (
                paginatedContent.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">
                        {item.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-950 border border-blue-400 capitalize">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                      {item.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full ${
                          item.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                            : item.status === 'Draft'
                              ? 'bg-amber-100 text-amber-950 border border-amber-400'
                              : 'bg-purple-100 text-purple-950 border border-purple-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold space-x-2">
                      <button
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-blue-700 hover:text-blue-900 border border-slate-300 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setEditingItem(item);
                          setFormData({
                            title: item.title,
                            type: item.type,
                            author: item.author,
                            status: item.status
                          });
                          setIsCreateOpen(true);
                        }}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-rose-700 hover:text-rose-900 border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        onClick={() => handleDeletePost(item.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3.5 flex items-center justify-between border-t border-slate-300 bg-slate-50/50">
          <p className="text-xs font-semibold text-slate-700">
            Showing <span className="font-bold text-slate-900">{filteredContent.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredContent.length)}</span> of{' '}
            <span className="font-bold text-slate-900">{filteredContent.length}</span> items
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-slate-200 rounded-lg">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Create / Edit Content */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-300 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-black text-slate-900">
                {editingItem ? 'Edit Content Item' : 'Create New Content'}
              </h3>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingItem(null);
                }}
                className="p-1 text-slate-500 hover:text-slate-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveContent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter title..."
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Category Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="post">Post</option>
                    <option value="photo">Photo</option>
                    <option value="video">Video</option>
                    <option value="music">Music</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Author
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentPage;
