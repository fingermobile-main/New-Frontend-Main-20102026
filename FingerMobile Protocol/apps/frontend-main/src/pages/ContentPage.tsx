import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter, Plus, MoreHorizontal, Eye, ThumbsUp, MessageCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: string;
  createdAt: string;
  views: number;
  likes: number;
  commentsCount: number;
}

const ContentPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.get('/posts');
        if (Array.isArray(data)) {
          setContentItems(data.map((item: any) => ({
            id: item.id,
            title: item.title || 'Untitled',
            type: item.type || 'Post',
            status: item.status || 'Pending',
            createdAt: item.createdAt,
            views: item.views || 0,
            likes: item.likes || 0,
            commentsCount: item.commentsCount || 0
          })));
        }
      } catch (err) {
        showToast?.('Failed to fetch content items', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [showToast]);

  const filteredItems = contentItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-300 shadow-xs">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-black text-slate-900 ml-3">Content Management</h1>
            </div>
            <Link
              to="/createpost"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Content
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Content Items</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-700" />
              </div>
              <button
                type="button"
                aria-label="Filter content items"
                onClick={() => showToast('Content filter options active', 'info')}
                className="p-2 text-slate-700 hover:text-slate-900 border border-gray-300 rounded-lg hover:bg-slate-100 transition"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading content...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="border border-slate-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-slate-700 mt-1">{item.type} • {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Approved' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' :
                        item.status === 'Pending' ? 'bg-amber-100 text-green-950 border border-green-400 font-bold' :
                          'bg-red-100 text-green-950 border border-green-400 font-bold'
                    }font-black`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-slate-700">
                    <div className="flex items-center mr-4">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{(item.views / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex items-center mr-4">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{(item.likes / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{item.commentsCount}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link to="/forum" className="text-blue-600 hover:text-blue-900 text-sm font-semibold">
                      View
                    </Link>
                    <button
                      type="button"
                      aria-label={`More options for ${item.title}`}
                      onClick={() => showToast(`Actions for "${item.title}"`, 'info')}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredItems.length}</span> of{' '}
              <span className="font-medium">{contentItems.length}</span> results
            </div>
            {/* Pagination ... */}
          </div>
        </div>
      </main>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
        <Link
          to="/content"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg transition-colors"
        >
          <FileText className="w-5 h-5 mb-0.5 text-blue-600" />
          <span>Items</span>
        </Link>
        <button
          onClick={() => {
            const el = document.querySelector('input[type="text"]') as HTMLInputElement;
            el?.focus();
          }}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-blue-600 rounded-lg transition-colors"
        >
          <Search className="w-5 h-5 mb-0.5 text-slate-600" />
          <span>Search</span>
        </button>
        <Link
          to="/createpost"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-blue-600 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mb-0.5 text-blue-600" />
          <span>Create</span>
        </Link>
      </div>
    </div>
  );
};

export default ContentPage;
