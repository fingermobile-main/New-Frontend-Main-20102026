import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Files, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Tag,
  BookOpen,
  Archive,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';

interface ContentItem {
  id: number;
  title: string;
  description: string;
  authorId: number;
  authorName: string;
  status: string;
  category: string;
  tags: string[];
  content: string;
  createdAt: string;
  updatedAt: string;
}

const ContentManagementPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [contentPerPage] = useState(10);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    content: '',
    authorId: 1,
    status: 'draft',
    category: 'general',
    tags: ''
  });

  const navigate = useNavigate();

  // Fetch content from API
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/content');
        if (response && Array.isArray(response.data)) {
          setContentItems(response.data);
          setFilteredContent(response.data);
        }
      } catch (error) {
        showToast?.('Error fetching content items', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [showToast]);

  // Filter content based on search term and filters
  useEffect(() => {
    let result = contentItems;

    if (searchTerm) {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(item => item.status === filterStatus);
    }

    if (filterCategory !== 'all') {
      result = result.filter(item => item.category === filterCategory);
    }

    setFilteredContent(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, filterStatus, filterCategory, contentItems]);

  // Pagination
  const indexOfLastContent = currentPage * contentPerPage;
  const indexOfFirstContent = indexOfLastContent - contentPerPage;
  const currentContent = filteredContent.slice(indexOfFirstContent, indexOfLastContent);
  const totalPages = Math.ceil(filteredContent.length / contentPerPage);

  const handleCreateContent = async () => {
    try {
      const response = await apiService.post('/content', newContent);
      if (response && response.success) {
        showToast?.('Content created successfully!', 'success');
        setContentItems([response.data, ...contentItems]);
        setShowCreateModal(false);
        // Reset form
        setNewContent({
          title: '',
          description: '',
          content: '',
          authorId: 1,
          status: 'draft',
          category: 'general',
          tags: ''
        });
      }
    } catch (error) {
      showToast?.('Error creating content', 'error');
    }
  };

  const handleDeleteContent = async (contentId: number) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      await apiService.delete(`/content/${contentId}`);
      showToast?.('Content deleted successfully', 'success');
      setContentItems(contentItems.filter(content => content.id !== contentId));
    } catch (error) {
      showToast?.('Error deleting content', 'error');
    }
  };

  const handleApproveContent = async (contentId: number) => {
    try {
      await apiService.post(`/content/${contentId}/approve`);
      showToast?.('Content approved!', 'success');
      setContentItems(contentItems.map(content => 
        content.id === contentId ? {...content, status: 'published'} : content
      ));
    } catch (error) {
      showToast?.('Error approving content', 'error');
    }
  };

  const handleRejectContent = async (contentId: number) => {
    try {
      await apiService.post(`/content/${contentId}/reject`);
      showToast?.('Content rejected', 'success');
      setContentItems(contentItems.map(content => 
        content.id === contentId ? {...content, status: 'rejected'} : content
      ));
    } catch (error) {
      showToast?.('Error rejecting content', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
      case 'rejected': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tutorial': return 'bg-blue-100 text-blue-950 border border-blue-400 font-bold';
      case 'guide': return 'bg-purple-100 text-purple-950 border border-purple-400 font-bold';
      case 'best-practices': return 'bg-indigo-100 text-indigo-800';
      case 'security': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Files className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Content Management</h1>
            </div>
            <button 
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Content
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-700" />
              </div>
              <input
                type="text"
                placeholder="Search content..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder:text-slate-400 focus:outline-none focus:placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="tutorial">Tutorial</option>
              <option value="guide">Guide</option>
              <option value="best-practices">Best Practices</option>
              <option value="security">Security</option>
              <option value="news">News</option>
              <option value="blog">Blog</option>
            </select>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">{filteredContent.length} items</span>
            </div>
          </div>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentContent.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No content found
                    </td>
                  </tr>
                ) : (
                  currentContent.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center border text-blue-950 border-blue-400 font-black">
                              <User className="h-4 w-4 text-blue-500" />
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">{item.authorName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{item.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900"
                            onClick={() => navigate(`/dashboard/content/${item.id}/view`)}
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-green-600 hover:text-green-900"
                            onClick={() => navigate(`/dashboard/content/${item.id}/edit`)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          {item.status === 'pending' && (
                            <>
                              <button 
                                className="text-green-600 hover:text-green-900"
                                onClick={() => handleApproveContent(item.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleRejectContent(item.id)}
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteContent(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="relative group/actions">
                            <button className="text-gray-600 hover:text-gray-900">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover/actions:block">
                              <button 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => navigate(`/dashboard/content/${item.id}/edit`)}
                              >
                                Edit Content
                              </button>
                              <button 
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                onClick={() => navigate(`/dashboard/content/${item.id}/analytics`)}
                              >
                                View Analytics
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-300 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstContent + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastContent, filteredContent.length)}</span> of{' '}
                    <span className="font-medium">{filteredContent.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === i + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Create Content Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Content</h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => { e.preventDefault(); handleCreateContent(); }}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newContent.description}
                    onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                    Content
                  </label>
                  <textarea
                    id="content"
                    rows={4}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newContent.content}
                    onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newContent.status}
                      onChange={(e) => setNewContent({...newContent, status: e.target.value})}
                    >
                      <option value="draft">Draft</option>
                      <option value="pending">Pending Review</option>
                      <option value="published">Published</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                      Category
                    </label>
                    <select
                      id="category"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                      value={newContent.category}
                      onChange={(e) => setNewContent({...newContent, category: e.target.value})}
                    >
                      <option value="general">General</option>
                      <option value="tutorial">Tutorial</option>
                      <option value="guide">Guide</option>
                      <option value="best-practices">Best Practices</option>
                      <option value="security">Security</option>
                      <option value="news">News</option>
                      <option value="blog">Blog</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tags">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-slate-900 leading-tight focus:outline-none focus:shadow-outline font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    value={newContent.tags}
                    onChange={(e) => setNewContent({...newContent, tags: e.target.value})}
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Create Content
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagementPage;