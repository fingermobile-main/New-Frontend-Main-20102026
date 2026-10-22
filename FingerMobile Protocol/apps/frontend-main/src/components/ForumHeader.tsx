import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from './icons';

interface ForumHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ForumHeader: React.FC<ForumHeaderProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <header className="bg-indigo-700 text-white shadow-lg fixed top-0 left-0 right-0 h-16 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/forum" className="text-xl font-bold text-white hover:text-indigo-100 transition-colors">
              FingerMobile Forum
            </Link>
          </div>
          <div className="flex-1 mx-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-600" />
              </div>
              <input
                type="text"
                placeholder="Search discussions..."
                className="block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900 font-bold border-slate-300 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/notifications"
              aria-label="View notifications"
              className="p-1 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-white inline-flex items-center justify-center text-white"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </Link>
            <div className="ml-3">
              <Link
                to="/profile"
                aria-label="View user profile"
                className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-white"
              >
                <img className="h-9 w-9 rounded-full object-cover" src="https://randomuser.me/api/portraits/men/1.jpg" alt="User avatar" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ForumHeader;
