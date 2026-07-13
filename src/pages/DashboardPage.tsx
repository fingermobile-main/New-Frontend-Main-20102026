import React from 'react';
import { logError } from '../utils/errorLogger';
import { Link } from 'react-router-dom';
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

  // Required placeholder functions
  const onLike = () => {
    addToast('Like action triggered', 'info');
  };

  const onAddComment = () => {
    addToast('Add comment action triggered', 'info');
  };

  const onOpenGiftModal = () => {
    addToast('Gift modal opened', 'info');
  };

  const onOpenPaylinkModal = () => {
    addToast('Paylink modal opened', 'info');
  };

  const onVote = () => {
    addToast('Vote action triggered', 'info');
  };

  const handleDeletePost = () => {
    addToast('Delete post action triggered', 'info');
  };

  const handleTokenizePost = () => {
    addToast('Tokenize post action triggered', 'info');
  };

  const handleAiAssist = () => {
    addToast('AI assist action triggered', 'info');
    return Promise.resolve({ success: true });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
          FIC Balance: {ficBalance}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <h2 className="text-xl font-semibold mb-4">Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
};

export default DashboardPage;