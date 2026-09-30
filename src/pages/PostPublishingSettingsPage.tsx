import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { usePostPublishing } from '../contexts/PostPublishingContext';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';


// TODO: Wrap this component with ErrorBoundary for production
// Example: <ErrorBoundary fallback={<div>Error occurred</div>}>{/* component */}</ErrorBoundary>

const PostPublishingSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings, applyAIRecommendations, saveSettings } = usePostPublishing();
  const { showToast } = useAppContext();
  const { member } = useAuth();
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);

  const handleApplyAiSuggestions = async () => {
    setIsApplyingSuggestions(true);
    await applyAIRecommendations('', member?.id || 'demo-member');
    setIsApplyingSuggestions(false);
    showToast('AI recommendations applied!', 'success');
  };

  const handleSaveDefault = async () => {
    const success = await saveSettings('default');
    if (success) {
      showToast('Default settings saved!', 'success');
    } else {
      showToast('Failed to save default settings', 'error');
    }
  };

  const continents = [
    'USSR', 'Europe', 'USA', 'North America', 'South America', 'United Kingdom',
    'Africa', 'West Africa', 'East Africa', 'South Africa', 'North Africa',
    'Middle East', 'Asia', 'Australia', 'America'
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Intelligent Post Publishing Settings</h1>
          <div className="flex space-x-4">
            <button
              onClick={handleSaveDefault}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Save as Default
            </button>
            <button
              onClick={resetSettings}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Privacy & Audience */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Privacy & Audience</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Post Category</h3>
                <div className="space-y-2">
                  {[
                    { id: 'privateGroup', label: 'Private Group only' },
                    { id: 'publicGroup', label: 'Public Group only' },
                    { id: 'followers', label: 'Followers only' },
                    { id: 'everyone', label: 'Everyone' }
                  ].map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`privacy-${option.id}`}
                        name="privacy"
                        type="radio"
                        checked={settings.privacy === option.id}
                        onChange={() => updateSettings({ privacy: option.id as any })}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`privacy-${option.id}`} className="ml-3 block text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Post Audience Selection</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={settings.audience.gender}
                    onChange={(e) => updateSettings({
                      audience: { ...settings.audience, gender: e.target.value as any }
                    })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="everyone">Everyone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age Bracket</label>
                  <select
                    value={settings.audience.ageBracket}
                    onChange={(e) => updateSettings({
                      audience: { ...settings.audience, ageBracket: e.target.value as any }
                    })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="24-34">24-34 years</option>
                    <option value="34-45">34-45 years</option>
                    <option value="45+">45 years+</option>
                    <option value="everyone">Everyone</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Who Can Comment</h3>
                <div className="space-y-2">
                  {[
                    { id: 'everyone', label: 'Everyone' },
                    { id: 'followers', label: 'Followers' },
                    { id: 'none', label: 'None' }
                  ].map(option => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`comment-${option.id}`}
                        name="commentPermissions"
                        type="radio"
                        checked={settings.comments === option.id}
                        onChange={() => updateSettings({ comments: option.id as any })}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`comment-${option.id}`} className="ml-3 block text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Scheduling & Distribution</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center">
                    <input
                      id="schedule-enabled"
                      name="scheduleEnabled"
                      type="checkbox"
                      checked={!!settings.schedule.time}
                      onChange={(e) => updateSettings({
                        schedule: { ...settings.schedule, time: e.target.checked ? '12:00' : '' }
                      })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="schedule-enabled" className="ml-3 block text-sm font-medium text-gray-700">
                      Schedule Post
                    </label>
                  </div>

                  {!!settings.schedule.time && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Time</label>
                        <input
                          type="time"
                          value={settings.schedule.time}
                          onChange={(e) => updateSettings({
                            schedule: { ...settings.schedule, time: e.target.value }
                          })}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Day</label>
                        <input
                          type="text"
                          value={settings.schedule.day}
                          onChange={(e) => updateSettings({
                            schedule: { ...settings.schedule, day: e.target.value }
                          })}
                          placeholder="e.g. Monday"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="share-to-mi"
                        name="shareToMi"
                        type="checkbox"
                        checked={settings.shareToMi}
                        onChange={(e) => updateSettings({ shareToMi: e.target.checked })}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="share-to-mi" className="ml-3 block text-sm font-medium text-gray-700">
                        Share to Mii©®™
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Monetization</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="monetization-enabled"
                    name="monetizationEnabled"
                    type="checkbox"
                    checked={settings.monetization.enabled}
                    onChange={(e) => updateSettings({
                      monetization: { ...settings.monetization, enabled: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="monetization-enabled" className="ml-3 block text-sm font-medium text-gray-700">
                    Earn From this UGC
                  </label>
                </div>

                {settings.monetization.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Monetization Type</label>
                      <select
                        value={settings.monetization.model}
                        onChange={(e) => updateSettings({
                          monetization: { ...settings.monetization, model: e.target.value as any }
                        })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="subscription">Subscription-based access</option>
                        <option value="payPerView">Pay-per-view/unlock</option>
                        <option value="oneTime">One-time purchase</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Collaboration</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="collaboration-enabled"
                    name="collaborationEnabled"
                    type="checkbox"
                    checked={settings.collaboration.enabled}
                    onChange={(e) => updateSettings({
                      collaboration: { ...settings.collaboration, enabled: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="collaboration-enabled" className="ml-3 block text-sm font-medium text-gray-700">
                    Invite Collaborator
                  </label>
                </div>

                {settings.collaboration.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Add Collaborator</label>
                      <div className="mt-1 flex">
                        <input
                          type="text"
                          className="block w-full border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="@Name for Pin Share" />
                        <button className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          Ping
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Broadcast</h2>

              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    id="broadcast-enabled"
                    name="broadcastEnabled"
                    type="checkbox"
                    checked={settings.broadcast.enabled}
                    onChange={(e) => updateSettings({
                      broadcast: { ...settings.broadcast, enabled: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="broadcast-enabled" className="ml-3 block text-sm font-medium text-gray-700">
                    Enable Broadcast
                  </label>
                </div>

                {settings.broadcast.enabled && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Broadcast Audience</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'everyone', label: 'Everyone' },
                          { id: 'followers', label: 'Followers' },
                          { id: 'subscribers', label: 'Subscribers' }
                        ].map(option => (
                          <div key={option.id} className="flex items-center">
                            <input
                              id={`broadcast-${option.id}`}
                              name="broadcastAudience"
                              type="radio"
                              checked={settings.broadcast.audience === option.id}
                              onChange={() => updateSettings({
                                broadcast: { ...settings.broadcast, audience: option.id as any }
                              })}
                              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor={`broadcast-${option.id}`} className="ml-3 block text-sm text-gray-700">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Boosting & Advertising</h2>

              <div className="space-y-6">
                <div className="flex items-center">
                  <input
                    id="boost-enabled"
                    name="boostEnabled"
                    type="checkbox"
                    checked={settings.boosting.enabled}
                    onChange={(e) => updateSettings({
                      boosting: { ...settings.boosting, enabled: e.target.checked }
                    })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="boost-enabled" className="ml-3 block text-sm font-medium text-gray-700">
                    Boost to Advertise
                  </label>
                </div>

                {settings.boosting.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Boost Type</label>
                      <select
                        value={settings.boosting.type}
                        onChange={(e) => updateSettings({
                          boosting: { ...settings.boosting, type: e.target.value as any }
                        })}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="daily">Daily Boost</option>
                        <option value="oneTime">One-time Boost</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Boost Amount</label>
                      <input
                        type="number"
                        value={settings.boosting.amount}
                        onChange={(e) => updateSettings({
                          boosting: { ...settings.boosting, amount: Number(e.target.value) }
                        })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">AI Assistance</h2>

              <div className="space-y-4">
                <button
                  onClick={handleApplyAiSuggestions}
                  disabled={isApplyingSuggestions}
                  className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isApplyingSuggestions
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                  }`}
                >
                  {isApplyingSuggestions ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Applying AI Suggestions...
                    </>
                  ) : (
                    'Apply AI Suggestions'
                  )}
                </button>

                <p className="text-sm text-gray-500">
                  Our AI will analyze your content and suggest optimal publishing settings for maximum reach and engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
export default PostPublishingSettingsPage;
