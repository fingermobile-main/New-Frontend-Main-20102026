import React, { useState } from 'react';
import UGCContentStudio from '../components/ugc/UGCContentStudio';
import UGCPublishingTools from '../components/ugc/UGCPublishingTools';
import UGCAnalyticsDashboard from '../components/ugc/UGCAnalyticsDashboard';
import UGCMonetizationPanel from '../components/ugc/UGCMonetizationPanel';
import UGCScheduler from '../components/ugc/UGCScheduler';
import {
  PencilIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  SparklesIcon,
  PhotoIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  ArrowUpTrayIcon
} from '../icons';
import UGCPrivacyControlModal from '../components/privacy/UGCPrivacyControlModal';
import { Shield } from 'lucide-react';

const UGCDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'studio' | 'analytics' | 'monetization' | 'scheduler'
  >('studio');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center">
          <div className="bg-white/20 p-3 rounded-lg">
            <SparklesIcon className="h-8 w-8" />
          </div>
          <div className="ml-4">
            <h1 className="text-3xl font-bold">UGC Dashboard</h1>
            <p className="mt-1 text-blue-100">
              Create, manage, and track your member-generated content
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                activeTab === 'studio'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('studio')}
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Content Studio
            </button>
            <button
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('analytics')}
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Analytics
            </button>
            <button
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                activeTab === 'monetization'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('monetization')}
            >
              <CurrencyDollarIcon className="h-5 w-5 mr-2" />
              Monetization
            </button>
            <button
              className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center ${
                activeTab === 'scheduler'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('scheduler')}
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Scheduler
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'studio' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <PhotoIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Image Creation</h3>
                      <p className="text-sm text-gray-500">Design and edit images</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-100">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <VideoCameraIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Video Creation</h3>
                      <p className="text-sm text-gray-500">Create and edit videos</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <MicrophoneIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-900">Audio Creation</h3>
                      <p className="text-sm text-gray-500">Record and edit audio</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Content Studio</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsPrivacyModalOpen(true)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center text-sm font-medium transition-colors"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Member Privacy Controls
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center text-sm font-medium">
                      <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                      Upload Content
                    </button>
                  </div>
                </div>
                <UGCContentStudio />
              </div>

              <UGCPrivacyControlModal
                isOpen={isPrivacyModalOpen}
                onClose={() => setIsPrivacyModalOpen(false)}
                contentType="post"
                contentId="default_ugc_post"
              />

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Publishing Tools</h2>
                <UGCPublishingTools />
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
              <UGCAnalyticsDashboard />
            </div>
          )}

          {activeTab === 'monetization' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Monetization Panel</h2>
              <UGCMonetizationPanel />
            </div>
          )}

          {activeTab === 'scheduler' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Content Scheduler</h2>
              <UGCScheduler />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UGCDashboardPage;
