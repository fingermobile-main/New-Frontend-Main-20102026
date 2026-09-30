import React, { useState, useEffect } from 'react';
import { FiGrid, FiList, FiBell, FiSettings, FiFilter, FiX, FiCheck, FiStar, FiHeart, FiShare2, FiSend } from 'react-icons/fi';
import { useAppContext } from '../../contexts/AppContext';

const FeedManagement: React.FC = () => {
  const { member } = useAppContext();
  const [activeTab, setActiveTab] = useState<'personal' | 'platform' | 'content'>('personal');
  const [preferences, setPreferences] = useState<any>({
    personal: {
      feedTypes: {
        posts: true,
        videos: true,
        images: true,
        articles: true,
        events: false,
        promotions: false
      },
      contentFrequency: 'moderate',
      notificationPreferences: {
        like: true,
        comment: true,
        share: true,
        follow: false
      }
    },
    platform: {
      allowedContent: {
        ads: true,
        sponsored: false,
        promoted: false
      },
      contentFilters: {
        explicit: true,
        political: false,
        commercial: true
      },
      frequency: 'normal'
    },
    content: {
      blockedKeywords: ['spam', 'scam'],
      favoriteTopics: ['technology', 'music'],
      mutedAccounts: []
    }
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [newTopic, setNewTopic] = useState('');

  const handlePreferenceChange = (section: string, key: string, value: any) => {
    setPreferences({
      ...preferences,
      [section]: {
        ...preferences[section],
        [key]: value
      }
    });
  };

  const handleFeedTypeChange = (type: string, checked: boolean) => {
    setPreferences({
      ...preferences,
      personal: {
        ...preferences.personal,
        feedTypes: {
          ...preferences.personal.feedTypes,
          [type]: checked
        }
      }
    });
  };

  const handleContentFilterChange = (filter: string, checked: boolean) => {
    setPreferences({
      ...preferences,
      platform: {
        ...preferences.platform,
        contentFilters: {
          ...preferences.platform.contentFilters,
          [filter]: checked
        }
      }
    });
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !preferences.content.blockedKeywords.includes(newKeyword.trim())) {
      setPreferences({
        ...preferences,
        content: {
          ...preferences.content,
          blockedKeywords: [...preferences.content.blockedKeywords, newKeyword.trim()]
        }
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setPreferences({
      ...preferences,
      content: {
        ...preferences.content,
        blockedKeywords: preferences.content.blockedKeywords.filter((k: string) => k !== keyword)
      }
    });
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && !preferences.content.favoriteTopics.includes(newTopic.trim())) {
      setPreferences({
        ...preferences,
        content: {
          ...preferences.content,
          favoriteTopics: [...preferences.content.favoriteTopics, newTopic.trim()]
        }
      });
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setPreferences({
      ...preferences,
      content: {
        ...preferences.content,
        favoriteTopics: preferences.content.favoriteTopics.filter((t: string) => t !== topic)
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Feed Management</h1>
        <p className="text-gray-600">Customize what appears in your feed and manage content preferences</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === 'personal'
              ? 'bg-blue-500 text-white border-b-2 border-blue-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Personal Feed
        </button>
        <button
          onClick={() => setActiveTab('platform')}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === 'platform'
              ? 'bg-blue-500 text-white border-b-2 border-blue-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Platform Content
        </button>
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-t-lg font-medium ${
            activeTab === 'content'
              ? 'bg-blue-500 text-white border-b-2 border-blue-500'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Content Filters
        </button>
      </div>

      {/* Personal Feed Tab */}
      {activeTab === 'personal' && (
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiGrid className="mr-2" />
              Feed Type Preferences
            </h2>
            <p className="text-gray-600 mb-6">Select which types of content you'd like to see in your feed</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(preferences.personal.feedTypes).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <span className="capitalize text-gray-700">{type}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled as boolean}
                      onChange={(e) => handleFeedTypeChange(type, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiBell className="mr-2" />
              Notification Preferences
            </h2>
            <p className="text-gray-600 mb-6">Choose which activities trigger notifications for you</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(preferences.personal.notificationPreferences).map(([activity, enabled]) => (
                <div key={activity} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <span className="capitalize text-gray-700">{activity} notifications</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled as boolean}
                      onChange={(e) => handlePreferenceChange('personal', 'notificationPreferences', {
                        ...preferences.personal.notificationPreferences,
                        [activity]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiSettings className="mr-2" />
              Content Frequency
            </h2>
            <p className="text-gray-600 mb-6">How often you'd like to see content from this feed type</p>

            <div className="flex flex-wrap gap-4">
              {['low', 'moderate', 'high'].map((level) => (
                <button
                  key={level}
                  onClick={() => handlePreferenceChange('personal', 'contentFrequency', level)}
                  className={`px-6 py-3 rounded-lg border ${
                    preferences.personal.contentFrequency === level
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platform Content Tab */}
      {activeTab === 'platform' && (
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiGrid className="mr-2" />
              Allowed Content Types
            </h2>
            <p className="text-gray-600 mb-6">Select which types of platform content you'd like to see</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(preferences.platform.allowedContent).map(([type, enabled]) => (
                <div key={type} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <span className="capitalize text-gray-700">
                    {type === 'sponsored' ? 'Sponsored Content' :
                      type === 'promoted' ? 'Promoted Content' :
                        type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled as boolean}
                      onChange={(e) => handlePreferenceChange('platform', 'allowedContent', {
                        ...preferences.platform.allowedContent,
                        [type]: e.target.checked
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiFilter className="mr-2" />
              Content Filters
            </h2>
            <p className="text-gray-600 mb-6">Enable filters to control what content appears in your feed</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(preferences.platform.contentFilters).map(([filter, enabled]) => (
                <div key={filter} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <span className="capitalize text-gray-700">
                    {filter === 'explicit' ? 'Explicit Content Filter' :
                      filter === 'political' ? 'Political Content Filter' :
                        filter.charAt(0).toUpperCase() + filter.slice(1) + ' Filter'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled as boolean}
                      onChange={(e) => handleContentFilterChange(filter, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiSettings className="mr-2" />
              Content Frequency
            </h2>
            <p className="text-gray-600 mb-6">How often you'd like to see platform content mixed into your feed</p>

            <div className="flex flex-wrap gap-4">
              {['low', 'normal', 'high'].map((level) => (
                <button
                  key={level}
                  onClick={() => handlePreferenceChange('platform', 'frequency', level)}
                  className={`px-6 py-3 rounded-lg border ${
                    preferences.platform.frequency === level
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Filters Tab */}
      {activeTab === 'content' && (
        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiX className="mr-2" />
              Blocked Keywords
            </h2>
            <p className="text-gray-600 mb-6">Add keywords to hide content containing them</p>

            <div className="flex mb-4">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Enter keyword to block..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddKeyword}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {preferences.content.blockedKeywords.map((keyword: string) => (
                <div key={keyword} className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
                  <span className="mr-2">{keyword}</span>
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiStar className="mr-2" />
              Favorite Topics
            </h2>
            <p className="text-gray-600 mb-6">Add topics you're interested in to see more related content</p>

            <div className="flex mb-4">
              <input
                type="text"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Enter topic to follow..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTopic}
                className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {preferences.content.favoriteTopics.map((topic: string) => (
                <div key={topic} className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  <span className="mr-2">{topic}</span>
                  <button
                    onClick={() => handleRemoveTopic(topic)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiHeart className="mr-2" />
              Muted Accounts
            </h2>
            <p className="text-gray-600 mb-6">Accounts whose content will be hidden from your feed</p>

            <div className="space-y-3">
              {preferences.content.mutedAccounts.length > 0 ? (
                preferences.content.mutedAccounts.map((account: any) => (
                  <div key={account.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 mr-3" />
                      <span>{account.name}</span>
                    </div>
                    <button className="text-red-500 hover:text-red-700">
                      <FiX />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No muted accounts yet</p>
                  <p className="text-sm mt-2">Accounts you mute will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
        <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg mr-4 hover:bg-gray-300">
          Cancel
        </button>
        <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center">
          <FiSend className="mr-2" />
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default FeedManagement;
