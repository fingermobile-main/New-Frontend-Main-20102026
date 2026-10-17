import React, {} from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';

interface DashboardSidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab = 'overview', onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'content', label: 'Content', icon: '📝' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'earnings', label: 'Earnings', icon: '💰' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-300 h-full p-4">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-300">
        <HomeIcon className="w-6 h-6 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>
      </div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange?.(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
