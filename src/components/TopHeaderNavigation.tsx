import { Link, useLocation } from 'react-router-dom';
import React, { useState } from 'react';

import { useAppContext } from '../contexts/AppContext';  // Fixed import path
import { useAuth } from '../contexts/AuthContext';

const TopHeaderNavigation: React.FC = () => {
  const location = useLocation();
  const { notificationsCount } = useAppContext();
  const { member } = useAuth();

  // Updated navigation based on the design document
  const platformNav = [
    { label: '🏠 Home', path: '/' },
    { label: '🔥 Trends', path: '/trends' },
    { label: '👥 Communities', path: '/communities' },
    { label: '💼 Network', path: '/network' },
    { label: '💬 Messages', path: '/messages' },
    { label: '💎 Gems', path: '/gems' },
    { label: '📝 Blogs', path: '/blogs' },
    { label: '🛒 Marketplace', path: '/marketplace' },
    { label: '🎮 GameOn', path: '/gameon' },
    { label: '🎯 Jobs', path: '/jobs' }
  ];

  // Earnings submenu items
  const earningsSubmenu = [
    { label: 'Dashboard', path: '/earnings/dashboard' },
    { label: 'My Services', path: '/earnings/services' },
    { label: 'Analytics', path: '/earnings/analytics' },
    { label: 'Wallet', path: '/earnings/wallet' }
  ];

  // Network submenu items
  const networkSubmenu = [
    { label: 'Connections', path: '/network/connections' },
    { label: 'Invitations', path: '/network/invitations' },
    { label: 'People You May Know', path: '/network/suggestions' },
    { label: 'Followed', path: '/network/following' }
  ];

  // Communities submenu items
  const communitiesSubmenu = [
    { label: 'My Communities', path: '/communities/my' },
    { label: 'Discover', path: '/communities/discover' },
    { label: 'Create Community', path: '/communities/create' }
  ];

  // State for submenu visibility
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* H1 Header - 3 Column Layout */}
      <header className="text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #0021F3 0%, #764ba2 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 py-4 items-center">
            {/* Column 1 (Left) - Logo & Brand */}
            <div className="flex items-center justify-start space-x-3">
              <button
                className="md:hidden text-white focus:outline-none"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/assets/branding/fingermobile/FingerMobile orange logo.webp"
                  alt="FingerMobile"
                  className="h-9 w-auto object-contain drop-shadow"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/branding/fingermobile/logo.png';
                  }}
                />
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white hidden sm:inline">
                  FingerMobile<span className="text-orange-300"> Protocol</span>
                </span>
              </Link>
            </div>

            {/* Column 2 (Center) - Search */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-2xl bg-white bg-opacity-20 rounded-full px-4 py-2">
                <div className="flex items-center">
                  <span className="mr-2">🔍</span>
                  <input
                    type="text"
                    placeholder="Search for people, communities, jobs..."
                    className="bg-transparent border-none focus:outline-none placeholder-white placeholder-opacity-70 w-full text-sm text-slate-900 font-bold border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                </div>
              </div>
            </div>

            {/* Column 3 (Right) - User Actions */}
            <div className="flex items-center justify-end space-x-4">
              {/* Create Post Button */}
              <button className="bg-white text-gray-800 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors hidden md:block">
                📝 Post
              </button>

              {/* Earnings with submenu */}
              <div className="relative group">
                <button
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-sm flex items-center hover:opacity-90 transition-opacity"
                  onMouseEnter={() => setActiveSubmenu('earnings')}
                  onMouseLeave={() => setActiveSubmenu(null)}
                >
                  <span className="mr-1">💰</span> Earnings
                </button>

                {activeSubmenu === 'earnings' && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50"
                    onMouseEnter={() => setActiveSubmenu('earnings')}
                    onMouseLeave={() => setActiveSubmenu(null)}
                  >
                    {earningsSubmenu.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button className="relative p-1 text-white hover:text-gray-200" aria-label="Button"><svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 text-white text-xs rounded-full flex items-center justify-center" style={{ backgroundColor: '#FD5900' }}>
                  {notificationsCount}
                </span>
              )}
              </button>

              {/* Avatar */}
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center font-bold text-slate-700 cursor-pointer">
                  // @ts-expect-error: auto-fixed by agent
                  {(member as any)?.name?.charAt(0) || 'U'}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>

                {/* Profile submenu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                  <Link to="/help" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Help & Support</Link>
                  <Link to="/feedback" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Give Feedback</Link>
                  <hr className="my-2" />
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* H2 Navigation - Platform Pills */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center py-3">
            <div className="flex space-x-1 md:space-x-2 overflow-x-auto py-2 w-full md:w-auto">
              {platformNav.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                      isActive
                        ? 'text-gray-950'
                        : 'bg-gray-100 text-gray-950 hover:bg-gray-200'
                    }border border-gray-400 font-black`}
                    style={isActive ? { backgroundColor: '#FD5900' } : {}}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col z-50 overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-slate-200 bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <img
                  src="/assets/branding/fingermobile/FRONT copy.webp"
                  alt="FingerMobile"
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/branding/fingermobile/drawer-splash-logo.webp';
                  }}
                />
                <span className="font-bold text-gray-900 text-lg">FingerMobile</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-700 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col py-2">
              {platformNav.map((item) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-3 text-sm font-medium border-b border-gray-50 transition-colors ${
                      isActive
                        ? 'text-brand-blue bg-blue-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopHeaderNavigation;
