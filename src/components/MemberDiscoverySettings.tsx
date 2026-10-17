import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface MemberDiscoverySettingsProps {
  userId?: string;
  currentSettings?: any;
  onUpdate?: (settings: any) => void;
}

const MemberDiscoverySettings: React.FC<MemberDiscoverySettingsProps> = ({
  userId,
  currentSettings,
  onUpdate
}) => {
  const [settings, setSettings] = React.useState({
    profileVisible: true,
    showInSearch: true,
    allowDirectMessages: true,
    showActivityStatus: false,
    ...currentSettings
  });

  const handleToggle = (key: string) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    onUpdate?.(newSettings);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Discovery Settings</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              settings.profileVisible ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              {settings.profileVisible ? (
                <EyeIcon className="w-5 h-5 text-green-600" />
              ) : (
                <EyeSlashIcon className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">Profile Visibility</p>
              <p className="text-sm text-slate-700">Allow others to view your profile</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.profileVisible}
              onChange={() => handleToggle('profileVisible')}
              className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              settings.showInSearch ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <svg className={`w-5 h-5 ${settings.showInSearch ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Show in Search</p>
              <p className="text-sm text-slate-700">Appear in member search results</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showInSearch}
              onChange={() => handleToggle('showInSearch')}
              className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              settings.allowDirectMessages ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <svg className={`w-5 h-5 ${settings.allowDirectMessages ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Direct Messages</p>
              <p className="text-sm text-slate-700">Allow members to message you</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowDirectMessages}
              onChange={() => handleToggle('allowDirectMessages')}
              className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              settings.showActivityStatus ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <svg className={`w-5 h-5 ${settings.showActivityStatus ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900">Activity Status</p>
              <p className="text-sm text-slate-700">Show when you're online</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.showActivityStatus}
              onChange={() => handleToggle('showActivityStatus')}
              className="sr-only peer text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <button
        onClick={() => onUpdate?.(settings)}
        className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Save Settings
      </button>
    </div>
  );
};

export default MemberDiscoverySettings;
