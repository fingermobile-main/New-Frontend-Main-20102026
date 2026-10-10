import React from 'react';
import { FileText, Search, Filter, Plus, MoreHorizontal, Eye, ThumbsUp, MessageCircle, Share } from 'lucide-react';

const ContentPage: React.FC = () => {
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-500 border border-gray-300 rounded-lg">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">Summer Adventure Photos</h3>
                  <p className="text-sm text-gray-500 mt-1">Post • 2 days ago</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Approved
                </span>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>12.4K</span>
                </div>
                <div className="flex items-center mr-4">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>12.4K</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>342</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">Cooking Tutorial: Pasta</h3>
                  <p className="text-sm text-gray-500 mt-1">Video • 3 days ago</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>125K</span>
                </div>
                <div className="flex items-center mr-4">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>8.9K</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>210</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Review</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">Tech Review: New Smartphone</h3>
                  <p className="text-sm text-gray-500 mt-1">Post • 1 week ago</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Rejected
                </span>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>28.7K</span>
                </div>
                <div className="flex items-center mr-4">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>5.6K</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>187</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Reconsider</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">Fitness Routine Demo</h3>
                  <p className="text-sm text-gray-500 mt-1">Video • 2 weeks ago</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Approved
                </span>
              </div>
              <div className="mt-3 flex items-center text-sm text-gray-500">
                <div className="flex items-center mr-4">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>210K</span>
                </div>
                <div className="flex items-center mr-4">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>15.6K</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>421</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">View</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
              <span className="font-medium">42</span> results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 rounded-md border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                1
              </button>
              <button className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentPage;