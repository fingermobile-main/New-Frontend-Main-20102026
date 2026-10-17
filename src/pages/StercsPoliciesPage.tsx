import React from 'react';
import { Scale, FileSignature, ScrollText, FileLock, FileWarning, FileClock, Settings, MoreHorizontal, User, Shield, Lock, Eye } from 'lucide-react';

const StercsPoliciesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">STERCS Policies</h1>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Create Policy
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Governance Policies</h2>
            <div className="flex space-x-3">
              <button className="p-2 text-slate-700 hover:text-gray-500 border border-gray-300 rounded-lg">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance Level</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <FileSignature className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Content Moderation Policy</div>
                        <div className="text-sm text-gray-500">Guidelines for moderating user-generated content</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Content</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-950 border border-green-400 font-bold">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-500">Strict</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-10-08</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-green-100">
                        <Shield className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">AI Decision Transparency</div>
                        <div className="text-sm text-gray-500">Requirements for transparency in AI-driven decisions</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">AI Ethics</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-950 border border-green-400 font-bold">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-yellow-500">Moderate</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-10-05</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-yellow-100">
                        <Lock className="h-4 w-4 text-yellow-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Data Privacy Protection</div>
                        <div className="text-sm text-gray-500">Standards for protecting user data and privacy</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Privacy</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-950 border border-amber-400 font-bold font-black">
                      Review
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-500">Strict</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-09-28</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <User className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Community Guidelines</div>
                        <div className="text-sm text-gray-500">Rules and expectations for community behavior</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Community</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-950 border border-green-400 font-bold">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-yellow-500">Moderate</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-09-20</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-pink-100">
                        <Eye className="h-4 w-4 text-pink-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">Accessibility Standards</div>
                        <div className="text-sm text-gray-500">Requirements for platform accessibility</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Compliance</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-950 border border-blue-400 font-bold font-black">
                      Draft
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="text-red-500">Strict</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-10-01</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">12</span> results
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

export default StercsPoliciesPage;