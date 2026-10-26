import React, { useState } from 'react';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { checkIsOnboarded } from '../contexts/AuthContext';

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  user: any; // Replace with proper user type
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  sidebarOpen,
  onToggleSidebar,
  user
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isOnboarded = checkIsOnboarded(user);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white border-b border-slate-300 shadow-sm">
      {/* Left section */}
      <div className="flex items-center">
        {isOnboarded && (
          <button
            type="button"
            className="text-[#ff6b00] hover:text-[#e05e00] p-1.5 rounded-lg hover:bg-orange-50 transition mr-2"
            onClick={onToggleSidebar}
            aria-label="Open navigation menu"
          >
            <Bars3Icon className="w-6 h-6 text-[#ff6b00]" aria-hidden="true" />
          </button>
        )}
        <div className="flex items-center">
          <div className="relative flex items-center">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MagnifyingGlassIcon className="w-5 h-5 text-slate-600" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder:text-slate-400 focus:outline-none focus:placeholder:text-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900 font-bold border-slate-300 focus:ring-2"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center">
        <button
          type="button"
          aria-label="View notifications"
          onClick={() => window.location.assign('/notifications')}
          className="p-1 text-slate-700 rounded-full hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Header;
