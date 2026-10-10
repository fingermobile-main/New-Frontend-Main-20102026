import React from 'react';
import { Network, Zap, ShieldCheck, Sparkles, FileEdit, FileImage, Palette, Scissors, Mic, Globe, BarChart3, Lock, Settings, MoreHorizontal } from 'lucide-react';

const StercsModulesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Network className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">STERCS Modules</h1>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
              Add Module
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Module Management</h2>
            <div className="flex space-x-3">
              <button className="p-2 text-gray-400 hover:text-gray-500 border border-gray-300 rounded-lg">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Zap className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">STERCS Core</h4>
                  <p className="text-xs text-gray-500">Core governance and control framework</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
                <span className="text-xs text-gray-500">v1.5.7</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '95%' }}></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">95% health</div>
              </div>
              <div className="mt-3 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Configure</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100">
                  <ShieldCheck className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">Guardian AI</h4>
                  <p className="text-xs text-gray-500">AI protection and threat detection</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
                <span className="text-xs text-gray-500">v3.0.2</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '99%' }}></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">99% health</div>
              </div>
              <div className="mt-3 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Configure</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">STERCS Curation</h4>
                  <p className="text-xs text-gray-500">Content curation and quality assurance</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
                <span className="text-xs text-gray-500">v1.2.1</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">92% health</div>
              </div>
              <div className="mt-3 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Configure</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-yellow-100">
                  <FileEdit className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">STERCS Editor</h4>
                  <p className="text-xs text-gray-500">Content editing and publishing tools</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Maintenance
                </span>
                <span className="text-xs text-gray-500">v0.9.8</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">0% health</div>
              </div>
              <div className="mt-3 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">View Details</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-red-100">
                  <Scissors className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">STERCS Video Editor</h4>
                  <p className="text-xs text-gray-500">Advanced video editing capabilities</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
                <span className="text-xs text-gray-500">v1.3.2</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '89%' }}></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">89% health</div>
              </div>
              <div className="mt-3 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Configure</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-indigo-100">
                  <Globe className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="ml-3">
                  <h4 className="font-medium text-sm">STERCS Translation</h4>
                  <p className="text-xs text-gray-500">AI-powered content translation</p>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
                <span className="text-xs text-gray-500">v1.4.0</span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '91%' }}></div>
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">91% health</div>
              </div>
              <div className="mt-3 flex justify-between">
                <button className="text-blue-600 hover:text-blue-900 text-sm">Configure</button>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StercsModulesPage;