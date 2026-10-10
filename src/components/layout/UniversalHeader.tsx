import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { SearchIcon, XIcon, MenuIcon } from '../icons';

interface UniversalHeaderProps {
  pageTitle?: string;
  activeTab?: string;
}

export const UniversalHeader: React.FC<UniversalHeaderProps> = ({ pageTitle }) => {
  const { member } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* STATIC H1: Slim Three (3) Column Bar */}
      <header className="relative w-full bg-slate-900 border-b border-slate-800 text-white shadow-lg backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* COLUMN 1: Clean H1 Title (Unwanted links removed as requested) */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <h1 className="text-sm md:text-base font-extrabold tracking-wide text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              {pageTitle || 'Community Feed & Forum'}
            </h1>
          </div>

          {/* COLUMN 2: Search bar, FIC, Live Wallet Balance, Profile image with dropdown */}
          <div className="flex-1 flex items-center justify-center max-w-xl mx-2 gap-3">
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={() => window.dispatchEvent(new CustomEvent('open-universal-search'))}
                placeholder="Search Canary, audio, tags..."
                className="w-full pl-9 pr-14 py-1.5 text-xs bg-slate-800/80 border border-slate-700 rounded-full text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all cursor-pointer"
              />
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-universal-search'))}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 hover:text-white bg-slate-700/60 rounded border border-slate-600/60 transition"
                title="Universal AI Search (Cmd+K)"
              >
                ⌘K
              </button>
            </div>



            {/* Profile Avatar & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-1 p-0.5 rounded-full border border-slate-700 hover:border-amber-500 transition-colors focus:outline-none"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white overflow-hidden shadow">
                  {(member as any)?.avatar ? (
                    <img src={(member as any).avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{((member as any)?.name || (member as any)?.username || 'M').charAt(0)}</span>
                  )}
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 text-xs text-slate-300">
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-bold text-white truncate">{(member as any)?.name || (member as any)?.username || 'Valued Member'}</p>
                    <p className="text-slate-400 text-[10px] truncate">{member?.email || 'member@fingermobile.com'}</p>
                  </div>
                  <Link
                    to="/member/landing"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-800 hover:text-amber-400 transition-colors"
                  >
                    👤 Member Landing Page
                  </Link>
                  <Link
                    to="/member/subscriptions"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-800 hover:text-amber-400 transition-colors"
                  >
                    ⭐ Subscriptions & Passes
                  </Link>
                  <Link
                    to="/creator"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-800 hover:text-amber-400 transition-colors"
                  >
                    🎨 Creator & UGC Studio
                  </Link>
                  <Link
                    to="/canary/ad-maker"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-800 hover:text-amber-400 font-bold text-amber-500 transition-colors"
                  >
                    📢 Canary™ Ad Creator
                  </Link>
                  <Link
                    to="/admin/canary"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-800 hover:text-rose-400 text-rose-500 font-bold transition-colors"
                  >
                    🛡️ Canary SuperAdmin RBC
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: Permanent Burger Menu at far right */}
          <div className="flex items-center space-x-2 flex-shrink-0">

            {/* Permanent Burger Menu at far right of H1 */}
            <button
              type="button"
              onClick={() => setIsBurgerOpen(!isBurgerOpen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-orange-500/20 text-[#ff6b00] border border-orange-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="Toggle Canary Global Drawer"
            >
              {isBurgerOpen ? <XIcon className="w-5 h-5 text-[#ff6b00]" /> : <MenuIcon className="w-5 h-5 text-[#ff6b00]" />}
            </button>
          </div>
        </div>
      </header>

      {/* Global Slide-out Drawer from Permanent Burger Menu */}
      {isBurgerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-80 h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xs">
                    FM
                  </span>
                  <span className="font-extrabold text-sm text-white">Canary™ Navigation</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBurgerOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">Ad Network & Monetization</p>
                <Link
                  to="/canary/ad-maker"
                  onClick={() => setIsBurgerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold hover:bg-amber-500 hover:text-slate-950 transition-colors"
                >
                  <span>📢</span>
                  <span>Canary™ Ad Maker Studio</span>
                </Link>
                <Link
                  to="/admin/canary"
                  onClick={() => setIsBurgerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <span>🛡️</span>
                  <span>SuperAdmin RBC Ads Queue</span>
                </Link>
              </div>

              <div className="mt-6 space-y-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">Microservices & Channels</p>
                <Link
                  to="/publicitee"
                  onClick={() => setIsBurgerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <span>🎬</span>
                  <span>Publicitee (Reels 168h)</span>
                </Link>
                <Link
                  to="/fingershorts"
                  onClick={() => setIsBurgerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <span>⚡</span>
                  <span>FingerShorts (Stories 48h)</span>
                </Link>
                <Link
                  to="/mii"
                  onClick={() => setIsBurgerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <span>💫</span>
                  <span>Mii™ Protocol & Orbit</span>
                </Link>
                <Link
                  to="/lushpressies"
                  onClick={() => setIsBurgerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <span>🎁</span>
                  <span>Lush-Pressies AI Dating</span>
                </Link>
                <Link
                  to="/beatwaveng"
                  onClick={() => setIsBurgerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <span>🎵</span>
                  <span>BeatwaveNG Audio</span>
                </Link>
                <Link
                  to="/dancia4tv"
                  onClick={() => setIsBurgerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <span>📺</span>
                  <span>Dancia-4Tv Streams</span>
                </Link>
                <Link
                  to="/forum"
                  onClick={() => setIsBurgerOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  <span>💬</span>
                  <span>Community Forum</span>
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
              FingerMobile Protocol™ © 2026<br />All Rights Reserved.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UniversalHeader;
