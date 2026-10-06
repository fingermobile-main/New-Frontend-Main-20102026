import React, {} from 'react';
import DatabaseIntegrationReport from '../components/DatabaseIntegrationReport';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { ServerIcon, DatabaseIcon, UserCircleIcon, ChartBarIcon, CheckCircleIcon, ClockIcon } from '../icons';

const DatabaseIntegrationDashboard: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const { ficBalance, showToast } = useAppContext();

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <ServerIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Database Integration Dashboard</h1>
              <p className="text-gray-600">Monitor and verify the integration status of all API endpoints with the database</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <DatabaseIntegrationReport />

            <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Integration Status Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900">Member Management</h3>
                  <p className="text-sm text-gray-600">Authentication and member data</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900">Content Management</h3>
                  <p className="text-sm text-gray-600">Posts, forums, and media</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900">Marketplace</h3>
                  <p className="text-sm text-gray-600">Products and transactions</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900">Community Features</h3>
                  <p className="text-sm text-gray-600">Groups, memberships, and interactions</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Component Integration Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">BeatwaveNG</h3>
                    <p className="text-sm text-gray-600">Music streaming platform</p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Integrated
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">Dancia-4Tv</h3>
                    <p className="text-sm text-gray-600">Video streaming service</p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Integrated
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">FingerWars</h3>
                    <p className="text-sm text-gray-600">Gaming challenges platform</p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Integrated
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">FingerLux</h3>
                    <p className="text-sm text-gray-600">Luxury booking service</p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Integrated
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">Community Pages</h3>
                    <p className="text-sm text-gray-600">Forums, blogs, groups, etc.</p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Integrated
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <div>
                    <h3 className="font-medium text-gray-900">Marketplace Components</h3>
                    <p className="text-sm text-gray-600">Storefront, OwnIt, Flamingo, etc.</p>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium flex items-center">
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Integrated
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Admin FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Database Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <DatabaseIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Run Diagnostics
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-600 mr-3" />
                  View Metrics
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
                  View Logs
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">System Health</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>All endpoints connected</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Database responsive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>No critical errors</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DatabaseIntegrationDashboard;
