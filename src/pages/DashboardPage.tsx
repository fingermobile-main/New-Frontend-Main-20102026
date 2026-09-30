import { Link } from 'react-router-dom';
import React, {} from 'react';
import MainLayout from '../components/layout/MainLayout';
import { logError } from '../utils/errorLogger';

import { useHaptic } from '../hooks/useHaptic';
import { useToast } from '../components/Toast';
import useDashboardData from '../hooks/useDashboardData';

const DashboardPage: React.FC = () => {
  const { triggerHaptic } = useHaptic();
  const { addToast } = useToast();
  const { data, loading, error, refreshData } = useDashboardData();

  if (loading) {
    return <div className="text-center py-8">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error} <button onClick={refreshData} className="ml-2 px-3 py-1 bg-red-500 text-white rounded">Retry</button></div>;
  }

  if (!data) {
    return <div className="text-center py-8">No dashboard data available.</div>;
  }

  const { communitySections, featuredSections, quickActions, ficBalance } = data;

  // Removed unused interaction placeholders

  return (
    <MainLayout pageTitle="Dashboard">
      <div className="min-h-screen bg-white">
        <div className="max-w-[1920px] mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="sticky top-20 space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Navigation</h3>
                  <ul className="space-y-3">
                    <li><Link to="/profile-enhancement" className="block text-gray-600 hover:text-blue-600">Profile Management</Link></li>
                    <li><Link to="/business-page" className="block text-gray-600 hover:text-blue-600">Business Pages</Link></li>
                    <li><Link to="/community-group" className="block text-gray-600 hover:text-blue-600">Community Groups</Link></li>
                    <li><Link to="/emojis" className="block text-gray-600 hover:text-blue-600">Emojis</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Management</h3>
                    <p className="text-sm text-gray-500 mb-4">
              Customize your profile with advanced features and settings.
                    </p>
                    <Link
                      to="/profile-enhancement"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
              Enhance Profile
                    </Link>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Business Pages</h3>
                    <p className="text-sm text-gray-500 mb-4">
              Create and manage your business pages with interactive features.
                    </p>
                    <Link
                      to="/business-page"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
              Manage Business Page
                    </Link>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Community Groups</h3>
                    <p className="text-sm text-gray-500 mb-4">
              Organize and manage community groups with advanced features.
                    </p>
                    <Link
                      to="/community-group"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
              Manage Groups
                    </Link>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Emoji Collection</h3>
                    <p className="text-sm text-gray-500 mb-4">
              Browse and use our extensive collection of emojis and emoticons.
                    </p>
                    <Link
                      to="/emojis"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
              View Emojis
                    </Link>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Messaging</h3>
                    <p className="text-sm text-gray-500 mb-4">
              Send and receive messages with support for rich media.
                    </p>
                    <button
                      disabled
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
                    >
              Coming Soon
                    </button>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Settings</h3>
                    <p className="text-sm text-gray-500 mb-4">
              Configure your account preferences and privacy settings.
                    </p>
                    <button
                      disabled
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-400 cursor-not-allowed"
                    >
              Coming Soon
                    </button>
                  </div>
                </div>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Featured</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(featuredSections || []).map((section: any, index: number) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{section.title}</h3>
                        <p className="text-gray-600 text-sm">{section.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Community</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(communitySections || []).map((section: any, index: number) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="p-4">
                        <h3 className="font-bold mb-2">{section.name}</h3>
                        <p className="text-gray-600 text-sm">{section.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="hidden lg:block lg:col-span-3 space-y-6">
              <div className="sticky top-20 space-y-6">
                <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 text-center">
                  <h3 className="font-bold text-blue-900 mb-2">FIC Balance</h3>
                  <p className="text-3xl font-extrabold text-blue-600">{ficBalance}</p>
                  <button className="mt-4 w-full bg-blue-600 text-white rounded-md py-2 text-sm font-medium hover:bg-blue-700">
                  Manage Wallet
                  </button>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <p className="text-sm text-gray-500">No recent activity to display.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </MainLayout>
  );
};

export default DashboardPage;
