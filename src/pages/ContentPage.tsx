import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Content Management</h1>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              <Plus className="h-4 w-4 inline mr-1" />
              Add Content
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Content Items</h2>
            <div className="flex space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500 border border-gray-300 rounded-lg">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">Loading content...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.type} • {new Date(item.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center text-sm text-gray-500">
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
                  <div className="mt-4 flex justify-between">
                    <button className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                    <button className="text-gray-600 hover:text-gray-900">
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
    </div>
  );
};

export default ContentPage;
