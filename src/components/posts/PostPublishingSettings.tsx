import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';  // Fixed import path
import { usePostPublishing } from '../../hooks/usePostPublishing';

export interface PublishingSettings {
  privacy: 'publicGroup' | 'privateGroup' | 'followers' | 'everyone';
  audience: {
    gender: 'everyone' | 'male' | 'female' | 'non-binary';
    ageBracket: 'everyone' | '13-17' | '18-24' | '25-34' | '35-44' | '45+';
  };
  comments: 'everyone' | 'followers' | 'none';
  schedule: {
    time: string;
    day: string;
    month: string;
  };
  shareToMi: boolean;
  monetization: {
    enabled: boolean;
    model: 'subscription' | 'oneTime' | 'payPerView';
  };
  broadcast: {
    enabled: boolean;
    audience: 'everyone' | 'subscribers' | 'followers';
    gender: string;
    ageBracket: string;
  };
  collaboration: {
    enabled: boolean;
    collaborators: string[];
    duration: {
      days: number;
      months: number;
    };
  };
  boosting: {
    enabled: boolean;
    type: 'daily' | 'oneTime';
    amount: number;
    region: string;
    continent: string;
  };
}


// TODO: Wrap this component with ErrorBoundary for production
// Example: <ErrorBoundary fallback={<div>Error occurred</div>}>{/* component */}</ErrorBoundary>

const PostPublishingSettings = () => {
  const { settings, updateSettings, saveSettings, resetSettings, isDirty } = usePostPublishing();
  const { showToast } = useAppContext(); // Fixed hook name
  const [activeTab, setActiveTab] = React.useState<'basic' | 'monetization' | 'advanced'>('basic');

  const handleToggleMonetization = () => {
    updateSettings({
      monetization: {
        ...settings.monetization,
        enabled: !settings.monetization.enabled
      }
    });
  };

  const handleSave = async () => {
    const success = await saveSettings('demo-post-id');
    if (success) {
      showToast('Settings saved successfully', 'success');
    } else {
      showToast('Failed to save settings', 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('basic')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setActiveTab('monetization')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'monetization'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Monetization
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'advanced'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Advanced
          </button>
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Privacy & Audience</label>
              <div className="grid grid-cols-2 gap-3">
                {['publicGroup', 'privateGroup', 'followers', 'everyone'].map((option) => (
                  <button
                    key={option}
                    onClick={() => updateSettings({ privacy: option as any })}
                    className={`px-3 py-2 text-xs font-medium rounded-md border ${
                      settings.privacy === option
                        ? 'bg-blue-50 border-brand-blue text-brand-blue'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1).replace(/([A-Z])/g, ' $1')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Who Can Comment</label>
              <select
                value={settings.comments}
                onChange={(e) => updateSettings({ comments: e.target.value as any })}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
              >
                <option value="everyone">Everyone</option>
                <option value="followers">Followers Only</option>
                <option value="none">Disabled</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">Share to Mii©®™</span>
                <span className="text-sm text-gray-500">Automatically cross-post to Mii platform</span>
              </span>
              <button
                onClick={() => updateSettings({ shareToMi: !settings.shareToMi })}
                className={`${
                  settings.shareToMi ? 'bg-brand-blue' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.shareToMi ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'monetization' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">Enable Monetization</span>
                <span className="text-sm text-gray-500">Earn from your content through subscriptions or tips</span>
              </span>
              <button
                onClick={handleToggleMonetization}
                className={`${
                  settings.monetization.enabled ? 'bg-brand-blue' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.monetization.enabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            {settings.monetization.enabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monetization Model</label>
                <select
                  value={settings.monetization.model}
                  onChange={(e) => updateSettings({ 
                    monetization: { ...settings.monetization, model: e.target.value as any } 
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md"
                >
                  <option value="subscription">Subscription Required</option>
                  <option value="oneTime">One-time Purchase</option>
                  <option value="payPerView">Pay-per-view</option>
                </select>
              </div>
            )}
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">Broadcast Mode</span>
                <span className="text-sm text-gray-500">Push notification to all eligible members</span>
              </span>
              <button
                onClick={() => updateSettings({ 
                  broadcast: { ...settings.broadcast, enabled: !settings.broadcast.enabled } 
                })}
                className={`${
                  settings.broadcast.enabled ? 'bg-brand-blue' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.broadcast.enabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">Invite Collaborators</span>
                <span className="text-sm text-gray-500">Tag other creators for co-authored posts</span>
              </span>
              <button
                onClick={() => updateSettings({ 
                  collaboration: { ...settings.collaboration, enabled: !settings.collaboration.enabled } 
                })}
                className={`${
                  settings.collaboration.enabled ? 'bg-brand-blue' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2`}
              >
                <span
                  className={`${
                    settings.collaboration.enabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={resetSettings}
            disabled={!isDirty}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-blue border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPublishingSettings;
