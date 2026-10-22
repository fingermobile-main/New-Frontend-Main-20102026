import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import {
  HomeIcon,
  VideoCameraIcon,
  ShoppingBagIcon,
  UsersIcon,
  StarIcon,
  GemIcon,
  MusicNoteIcon,
  TvIcon,
  MenuIcon,
  ChatBubbleIcon,
  BellIcon,
  ChevronDownIcon,
  SearchIcon,
  WalletIcon,
  EyeIcon,
  EyeSlashIcon
} from '../icons';

interface ForumHeaderProps {
  pageTitle?: string;
  onLeftMenuToggle?: () => void;
  onRightMenuToggle?: () => void;
}

const ForumHeader: React.FC<ForumHeaderProps> = ({
  pageTitle,
  onLeftMenuToggle,
  onRightMenuToggle
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showEarnings, setShowEarnings] = useState(true);
  const [showMoreNav, setShowMoreNav] = useState(false);

  // Mock earnings data - replace with actual API call
  const earnings = {
    fic: 1250.75,
    localCurrency: '₦485,291.50',
    usd: '$1,250.75'
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#242526] border-b border-gray-700 h-16">
      <div className="h-full px-4 flex items-center justify-between">

        {/* COLUMN A: Left Section: 1. Logo, 2. FingerMobile, 3. Burger Menu (Justified & Well-Spaced) */}
        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
          {/* 1. Logo */}
          <Link to="/" className="flex items-center shrink-0 hover:scale-105 transition-transform" aria-label="FingerMobile Home">
            <div className="relative w-10 h-10 rounded-2xl bg-white p-1 border border-slate-300 shadow-xs flex items-center justify-center">
              <img
                src="/assets/branding/fingermobile/FingerMobile orange logo.webp"
                alt="FingerMobile Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* 2. FingerMobile Brand Text */}
          <Link to="/" className="flex flex-col group focus:outline-none text-left">
            <span className="text-lg font-black tracking-tight text-white flex items-center group-hover:text-orange-400 transition-colors">
              FingerMobile<span className="text-[#ff6b00] ml-0.5">™</span>
            </span>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-300 -mt-1">
              Protocol
            </span>
          </Link>

          {pageTitle && (
            <span className="hidden xl:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-200 border border-slate-700">
              {pageTitle}
            </span>
          )}

          {/* 3. Burger Menu */}
          <button
            type="button"
            onClick={onLeftMenuToggle}
            className="p-2 sm:p-2.5 rounded-2xl border border-orange-200 dark:border-orange-500/30 bg-orange-50/80 hover:bg-orange-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#ff6b00] hover:text-[#e05e00] transition-all shadow-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer ml-1"
            aria-label="Open Navigation Drawer"
          >
            <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6b00]" />
          </button>
        </div>

        {/* COLUMN B: Middle Section - Search & Navigation Icons */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:flex flex-col gap-2">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-600" />
            <input
              type="text"
              placeholder="Search FingerMobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#3a3b3c] text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
          </form>

          {/* Core Navigation Icons */}
          <nav className="flex items-center justify-center gap-1">
            {[
              { icon: HomeIcon, label: 'Home', path: '/', active: true },
              { icon: VideoCameraIcon, label: 'Reels', path: '/reels' },
              { icon: ShoppingBagIcon, label: 'Marketplace', path: '/marketplace' },
              { icon: UsersIcon, label: 'Groups', path: '/groups' },
              { icon: StarIcon, label: 'Hallmarks', path: '/hallmarks' },
              { icon: GemIcon, label: 'Gems', path: '/gems' },
              { icon: MusicNoteIcon, label: 'BeatwaveNg', path: '/beatwaveng' },
              { icon: TvIcon, label: 'Dancia-4Tv', path: '/dancia4tv' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative p-2 rounded-lg transition-colors group ${
                  item.active
                    ? 'text-orange-500'
                    : 'text-gray-300 font-medium hover:text-white hover:bg-gray-700'
                }`}
                title={item.label}
              >
                <item.icon className="w-6 h-6" />
                {item.active && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </Link>
            ))}

            {/* See More Trigger */}
            <button
              onClick={() => setShowMoreNav(!showMoreNav)}
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronDownIcon className="w-5 h-5" />
            </button>
          </nav>
        </div>

        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 hover:bg-gray-700 rounded-lg">
          <SearchIcon className="w-6 h-6 text-white" />
        </button>

        {/* COLUMN C: Right Section - HD Media, Earnings & Utilities */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {/* HD Media Ad Space (30 seconds) */}
          <Link
            to="/canaryads"
            className="hidden lg:block w-32 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            aria-label="Visit Canary Ads"
          >
            <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-white">
              AD SPACE
            </div>
          </Link>

          {/* Earnings Display */}
          <div className="hidden md:flex items-center gap-2 bg-[#3a3b3c] px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={() => setShowEarnings(!showEarnings)} role="button" tabIndex={0}>
            <WalletIcon className="w-5 h-5 text-green-500" />
            <div className="text-xs">
              {showEarnings ? (
                <div className="flex flex-col">
                  <span className="text-green-400 font-semibold">{earnings.fic} FIC</span>
                  <span className="text-gray-300 font-medium">{earnings.usd}</span>
                </div>
              ) : (
                <span className="text-gray-300 font-medium">••••••</span>
              )}
            </div>
            {showEarnings ? (
              <EyeSlashIcon className="w-4 h-4 text-slate-600" />
            ) : (
              <EyeIcon className="w-4 h-4 text-slate-600" />
            )}
          </div>

          {/* Utility Icons */}
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative">
              <ChatBubbleIcon className="w-6 h-6 text-slate-600 hover:text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button
              onClick={onRightMenuToggle}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative"
            >
              <BellIcon className="w-6 h-6 text-slate-600 hover:text-white" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                20+
              </span>
            </button>

            {/* Profile Dropdown */}
            <button className="ml-2 w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold hover:opacity-90 transition-opacity">
              U
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Navigation Drawer (See More) */}
      {showMoreNav && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-[#242526] border-b border-gray-700 p-4 shadow-lg">
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: HomeIcon, label: 'Home', path: '/' },
              { icon: VideoCameraIcon, label: 'Reels', path: '/reels' },
              { icon: ShoppingBagIcon, label: 'Marketplace', path: '/marketplace' },
              { icon: UsersIcon, label: 'Groups', path: '/groups' },
              { icon: StarIcon, label: 'Hallmarks', path: '/hallmarks' },
              { icon: GemIcon, label: 'Gems', path: '/gems' },
              { icon: MusicNoteIcon, label: 'BeatwaveNg', path: '/beatwaveng' },
              { icon: TvIcon, label: 'Dancia-4Tv', path: '/dancia4tv' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setShowMoreNav(false)}
                className="flex flex-col items-center gap-1 p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <item.icon className="w-6 h-6 text-slate-600" />
                <span className="text-xs text-gray-300">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default ForumHeader;
