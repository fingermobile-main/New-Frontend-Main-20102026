import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';  // Fixed import path
import { usePostPublishing, PublishingSettings } from '../../hooks/usePostPublishing';
import ErrorBoundary from '../ErrorBoundary';

export type { PublishingSettings };

const COMMON_COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Kenya',
  'South Africa',
  'United Kingdom',
  'United States',
  'Canada',
  'Germany'
];

const PostPublishingSettings = () => {
  const { settings, updateSettings, saveSettings, resetSettings, isDirty } = usePostPublishing();
  const { showToast } = useAppContext(); // Fixed hook name
  const [activeTab, setActiveTab] = useState<'basic' | 'monetization' | 'advanced' | 'demographics'>('basic');

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

  const currentDemographics = settings.demographics || {
    allowedLocations: [],
    excludedLocations: [],
    genderTarget: 'all',
    allowedGenders: ['all'],
    ageRangeMin: 22,
    ageRangeMax: 60,
    geofencePolygon: []
  };

  const toggleAllowedCountry = (country: string) => {
    const current = currentDemographics.allowedLocations || [];
    const updated = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    updateSettings({
      demographics: {
        ...currentDemographics,
        allowedLocations: updated
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-slate-300">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('basic')}
            className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'basic'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setActiveTab('monetization')}
            className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'monetization'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Monetization
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'advanced'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Advanced
          </button>
          <button
            onClick={() => setActiveTab('demographics')}
            className={`w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm ${
              activeTab === 'demographics'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Demographics &amp; Geofence
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
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2"
              >
                <option value="everyone">Everyone</option>
                <option value="followers">Followers Only</option>
                <option value="none">Disabled</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex-grow flex flex-col">
                <span className="text-sm font-medium text-gray-900">Share to Mii©®™</span>
                <span className="text-sm text-slate-700">Automatically cross-post to Mii platform</span>
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
                <span className="text-sm text-slate-700">Earn from your content through subscriptions or tips</span>
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
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2"
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
                <span className="text-sm text-slate-700">Push notification to all eligible members</span>
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
                <span className="text-sm text-slate-700">Tag other creators for co-authored posts</span>
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

        {activeTab === 'demographics' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Geographic Locations
              </label>
              <p className="text-xs text-slate-700 mb-3">
                Include only members located in selected nations or regions.
              </p>
              <div className="flex flex-wrap gap-2">
                {COMMON_COUNTRIES.map((country) => {
                  const isSelected = (currentDemographics.allowedLocations || []).includes(country);
                  return (
                    <button
                      key={country}
                      type="button"
                      onClick={() => toggleAllowedCountry(country)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected
                          ? 'bg-brand-blue text-white border-brand-blue'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {country} {isSelected ? '✓' : '+'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Gender
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'all', label: 'All Genders' },
                  { id: 'male', label: 'Male' },
                  { id: 'female', label: 'Female' }
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() =>
                      updateSettings({
                        demographics: {
                          ...currentDemographics,
                          genderTarget: g.id as 'all' | 'male' | 'female'
                        }
                      })
                    }
                    className={`px-3 py-2 text-xs font-medium rounded-md border text-center ${
                      currentDemographics.genderTarget === g.id
                        ? 'bg-blue-50 border-brand-blue text-brand-blue'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range Minimum (22–60+)
                </label>
                <input
                  type="number"
                  min="22"
                  max="100"
                  value={currentDemographics.ageRangeMin ?? 22}
                  onChange={(e) =>
                    updateSettings({
                      demographics: {
                        ...currentDemographics,
                        ageRangeMin: parseInt(e.target.value, 10) || 22
                      }
                    })
                  }
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Range Maximum
                </label>
                <input
                  type="number"
                  min="22"
                  max="120"
                  value={currentDemographics.ageRangeMax ?? 60}
                  onChange={(e) =>
                    updateSettings({
                      demographics: {
                        ...currentDemographics,
                        ageRangeMax: parseInt(e.target.value, 10) || 60
                      }
                    })
                  }
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400 font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-slate-300">
              <span className="text-sm font-medium text-gray-900 block mb-1">
                Custom Geofence Heatmap Perimeter
              </span>
              <p className="text-xs text-slate-700 mb-2">
                Restricts viewability strictly to members inside your active GPS polygon or regional cluster.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-gray-600 bg-white px-3 py-1.5 rounded border border-slate-300">
                  Polygon Boundary: {(currentDemographics.geofencePolygon || []).length} vertices
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateSettings({
                      demographics: {
                        ...currentDemographics,
                        geofencePolygon: [
                          { lat: 6.5244, lng: 3.3792 },
                          { lat: 9.0765, lng: 7.3986 }
                        ]
                      }
                    })
                  }
                  className="px-3 py-1.5 bg-brand-blue text-white rounded text-xs font-medium hover:bg-blue-700"
                >
                  Set Lagos-Abuja Corridor Geofence
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-300 flex justify-end space-x-3">
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

const SafePostPublishingSettings: React.FC = () => (
  <ErrorBoundary fallback={<div className="p-4 bg-white rounded-lg shadow text-slate-500">Post publishing settings temporarily unavailable</div>}>
    <PostPublishingSettings />
  </ErrorBoundary>
);

export default SafePostPublishingSettings;
