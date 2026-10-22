import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';

import {
  HomeIcon,
  UsersIcon,
  WalletIcon,
  ShoppingBagIcon,
  SparklesIcon,
  VideoCameraIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XIcon
} from '../icons';

interface NavItem {
  icon: any;
  label: string;
  path: string;
  badge?: string;
  hasDropdown?: boolean;
  dropdownOpen?: boolean;
  toggleDropdown?: () => void;
  dropdownItems?: { label: string; path: string }[];
}

interface ForumLeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForumLeftSidebar: React.FC<ForumLeftSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [showCommunities, setShowCommunities] = useState(false);

  const [showAIStudio, setShowAIStudio] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(true);

  const isActive = (path: string) => location.pathname === path;

  const mainNavItems: NavItem[] = [
    { icon: HomeIcon, label: 'Dashboard', path: '/dashboard' },
    {
      icon: UsersIcon,
      label: 'Communities',
      path: '/communities',
      hasDropdown: true,
      dropdownOpen: showCommunities,
      toggleDropdown: () => setShowCommunities(!showCommunities),
      dropdownItems: [
        { label: 'Forum', path: '/forum' },
        { label: 'Groups', path: '/groups' },
        { label: 'Mii', path: '/mii' },
        { label: 'Trends', path: '/trends' }
      ]
    },
    { icon: WalletIcon, label: 'Wallet', path: '/wallet', badge: 'Live' },
    { icon: ShoppingBagIcon, label: 'Marketplace', path: '/marketplace' },
    {
      icon: SparklesIcon,
      label: 'AI Studio',
      path: '/ai-studio',
      hasDropdown: true,
      dropdownOpen: showAIStudio,
      toggleDropdown: () => setShowAIStudio(!showAIStudio),
      dropdownItems: [
        { label: 'AI Assistant', path: '/ai-assistant' },
        { label: 'Content Generator', path: '/ai-content' },
        { label: 'Image Creator', path: '/ai-images' }
      ]
    },
    { icon: VideoCameraIcon, label: 'Reels', path: '/reels' },
    { icon: BookmarkIcon, label: 'Saved', path: '/saved' }
  ];

  const shortcuts = [
    { label: 'Mii', path: '/mii' },
    { label: 'Discover', path: '/discover' },
    { label: 'Fingershort', path: '/fingershort' },
    { label: 'Trends', path: '/trends' },
    { label: 'FingerMobile Protocol', path: '/protocol' }
  ];

  return (
    <div className="h-full flex flex-col bg-[#242526]">

      {/* Mobile Close Button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-lg font-semibold text-white">Navigation</span>
        <button
          type="button"
          aria-label="Close navigation drawer"
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg"
        >
          <XIcon className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <div key={item.path}>
              {item.hasDropdown ? (
                <button
                  type="button"
                  onClick={() => item.toggleDropdown?.()}
                  aria-expanded={item.dropdownOpen}
                  aria-label={`Toggle ${item.label} menu`}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group text-left ${
                    isActive(item.path)
                      ? 'bg-orange-500/20 text-orange-500'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <span className="flex-1 text-sm font-medium">{item.label}</span>

                  {/* Badge */}
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}

                  {/* Dropdown Arrow */}
                  <ChevronDownIcon
                    className={`w-4 h-4 transition-transform ${
                      item.dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                <Link
                  to={item.path}
                  aria-label={item.label}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    isActive(item.path)
                      ? 'bg-orange-500/20 text-orange-500'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-6 h-6 flex-shrink-0" />
                  <span className="flex-1 text-sm font-medium">{item.label}</span>

                  {/* Badge */}
                  {item.badge && (
                    <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}

              {/* Dropdown Menu */}
              {item.hasDropdown && item.dropdownOpen && (
                <div className="ml-9 mt-1 space-y-1">
                  {item.dropdownItems?.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive(subItem.path)
                          ? 'text-orange-500 bg-orange-500/10'
                          : 'text-gray-300 font-medium hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-700"></div>

        {/* Shortcuts Section */}
        <div className="px-3">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="flex items-center justify-between w-full mb-3 text-xs font-bold text-gray-300 uppercase tracking-wider hover:text-white transition-colors"
          >
            <span>Your Shortcuts</span>
            {showShortcuts ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronRightIcon className="w-4 h-4" />
            )}
          </button>

          {showShortcuts && (
            <div className="space-y-1">
              {shortcuts.map((shortcut) => (
                <Link
                  key={shortcut.path}
                  to={shortcut.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(shortcut.path)
                      ? 'text-orange-500 bg-orange-500/10'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-semibold">
                    {shortcut.label.charAt(0)}
                  </div>
                  <span className="flex-1 truncate">{shortcut.label}</span>
                </Link>
              ))}

              <Link
                to="/communities"
                className="block w-full px-3 py-2 text-sm text-gray-300 font-medium hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-left"
              >
                See more
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Footer Links */}
      <div className="px-3 py-4 border-t border-gray-700">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-700 font-medium">
          <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
          <Link to="/user-policy" className="hover:text-gray-300 transition-colors">User Policy</Link>
          <Link to="/ai-policy" className="hover:text-gray-300 transition-colors">AI Policy</Link>
          <Link to="/disclaimer" className="hover:text-gray-300 transition-colors">Disclaimer</Link>
          <a href="/advertising" className="hover:text-gray-300 transition-colors">Advertising</a>
          <a href="/canary" className="hover:text-gray-300 transition-colors">Canary</a>
          <a href="/cookies" className="hover:text-gray-300 transition-colors">Cookies</a>
        </div>
      </div>

    </div>
  );
};

export default ForumLeftSidebar;
