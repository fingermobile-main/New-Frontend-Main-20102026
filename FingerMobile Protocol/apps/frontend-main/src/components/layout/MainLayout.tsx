import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import {
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import NotificationsPanel from '../NotificationsPanel';

interface MainLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
}

export default function MainLayout({ children, pageTitle }: MainLayoutProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const {
    unreadNotifications,
    toggleNotifications,
    notificationsOpen,
    showSearch,
    setShowSearch
  } = useAppContext();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch?.(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9F6] flex flex-col">
      {/* Top Ambient Glow Banner (Consistent with Lushpressies) */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-[#DC582A] w-full sticky top-0 z-50" />

      {/* Notification Panel */}
      <NotificationsPanel
        isOpen={Boolean(notificationsOpen)}
        onClose={() => toggleNotifications?.()}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Navigation Header - Left clearance pl-14 sm:pl-32 for Sovereign Burger Trigger */}
        <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs z-20 sticky top-1">
          <div className="pl-14 sm:pl-32 pr-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="truncate">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                    {pageTitle || 'FingerMobile Protocol'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  {!showSearch ? (
                    <button
                      onClick={() => setShowSearch?.(true)}
                      className="text-slate-700 hover:text-emerald-800 p-2 rounded-xl hover:bg-emerald-50 transition"
                      title="Search"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <form onSubmit={handleSearchSubmit} className="relative w-48 sm:w-64">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search protocol..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
                        autoFocus
                      />
                      <button type="submit" className="absolute left-2.5 top-2 text-slate-600 hover:text-emerald-700" title="Execute Search">
                        <MagnifyingGlassIcon className="h-4 w-4" />
                      </button>
                    </form>
                  )}
                </div>

                {/* Notifications */}
                <button
                  type="button"
                  className="p-2 text-slate-700 hover:text-emerald-800 rounded-xl hover:bg-emerald-50 relative transition"
                  onClick={toggleNotifications}
                  title="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export { MainLayout };
