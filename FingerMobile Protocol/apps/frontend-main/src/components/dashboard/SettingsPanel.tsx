import React from 'react';
import { Link } from 'react-router-dom';
import { CogIcon } from '@heroicons/react/24/outline';

interface SettingsPanelProps {}

const SettingsPanel: React.FC<SettingsPanelProps> = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <CogIcon className="w-6 h-6 text-gray-600" />
        <h3 className="text-lg font-bold text-gray-900">Settings</h3>
      </div>
      <div className="space-y-3">
        <Link
          to="/settings"
          className="block p-3 border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <p className="font-medium text-gray-900">Profile Settings</p>
          <p className="text-sm text-slate-700 mt-1">Manage your account information</p>
        </Link>
        <Link
          to="/security"
          className="block p-3 border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <p className="font-medium text-gray-900">Privacy & Security</p>
          <p className="text-sm text-slate-700 mt-1">Control your privacy preferences</p>
        </Link>
        <Link
          to="/notifications"
          className="block p-3 border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <p className="font-medium text-gray-900">Notifications</p>
          <p className="text-sm text-slate-700 mt-1">Configure notification settings</p>
        </Link>
      </div>
    </div>
  );
};

export default SettingsPanel;
