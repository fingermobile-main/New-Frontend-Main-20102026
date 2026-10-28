import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
/*
 * FingerMobile Protocol™ - Hallmark Achievements Page Component
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */


import { useAppContext } from '../contexts/AppContext';
import AdBanner from '../components/AdBanner';
import FixedAdBanner from '../components/FixedAdBanner';
import BurgerMenu from '../components/BurgerMenu';
import {
  AwardIcon,
  SearchIcon,
  MicrophoneIcon,
  TvIcon,
  MusicNoteIcon,
  ShoppingBagIcon
} from '../icons';
import { hallmarksService } from '../services/HallmarksService';

const HallmarkPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { ficBalance } = useAppContext();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Hallmark achievements data with live service sync
  const [achievements, setAchievements] = useState<any[]>([
    {
      id: 1,
      title: 'Community Builder',
      description: 'Created 50+ community posts that received over 1000 likes',
      level: 'Gold',
      earnedDate: '2031-06-15',
      image: 'https://placehold.co/100x100/f59e0b/white?text=🏅',
      progress: 100,
      criteria: 'Create 50 community posts with 1000+ likes'
    },
    {
      id: 2,
      title: 'Knowledge Sharer',
      description: 'Published 20+ educational articles or tutorials',
      level: 'Silver',
      earnedDate: '2031-05-22',
      image: 'https://placehold.co/100x100/c0c0c0/white?text=📚',
      progress: 100,
      criteria: 'Publish 20 educational articles or tutorials'
    },
    {
      id: 3,
      title: 'Top Contributor',
      description: 'Consistently contributed high-quality content for 3 months',
      level: 'Gold',
      earnedDate: '2031-04-10',
      image: 'https://placehold.co/100x100/f59e0b/white?text=🏆',
      progress: 100,
      criteria: 'Contribute high-quality content for 3 months'
    },
    {
      id: 4,
      title: 'Early Adopter',
      description: 'Joined the platform during the beta phase',
      level: 'Platinum',
      earnedDate: '2030-12-01',
      image: 'https://placehold.co/100x100/e5e7eb/white?text=🚀',
      progress: 100,
      criteria: 'Joined during beta phase'
    },
    {
      id: 5,
      title: 'Engagement Master',
      description: 'Received 500+ comments on your posts',
      level: 'Gold',
      earnedDate: '2031-03-18',
      image: 'https://placehold.co/100x100/f59e0b/white?text=💬',
      progress: 100,
      criteria: 'Receive 500+ comments on your posts'
    }
  ]);

  useEffect(() => {
    let mounted = true;
    hallmarksService.getAllHallmarks().then((res: any) => {
      if (mounted && res.data && res.data.length > 0) {
        const mapped = res.data.map((h: any) => ({
          id: h.id,
          title: h.name,
          description: h.description,
          level: h.rarity ? h.rarity.charAt(0).toUpperCase() + h.rarity.slice(1) : 'Gold',
          earnedDate: h.createdAt ? new Date(h.createdAt).toLocaleDateString() : 'Active',
          image: h.icon || 'https://placehold.co/100x100/f59e0b/white?text=🏅',
          progress: 100,
          criteria: h.description || 'Awarded on FingerMobile'
        }));
        setAchievements(mapped);
      }
    // eslint-disable-next-line no-console
    }).catch((err: any) => console.warn('Failed to load live hallmarks in HallmarkPage:', err));
    return () => { mounted = false; };
  }, []);


  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'My Achievements', path: '/my-achievements' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Challenges', path: '/challenges' },
    { name: 'Rewards Shop', path: '/rewards' }
  ];

  // H1 menu items
  const h1MenuItems = [
    { name: 'Dancia-4Tv', path: '/dancia-4tv', icon: <TvIcon className="w-4 h-4" /> },
    { name: 'BeatwaveNG', path: '/beatwave', icon: <MusicNoteIcon className="w-4 h-4" /> },
    { name: 'Marketplace', path: '/marketplace', icon: <ShoppingBagIcon className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      {/* Mobile Menu */}
      <BurgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {/* Ad Banner */}
      <AdBanner adSlot="hallmark-top" />

      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-64 bg-white border-r px-4 py-6 flex flex-col justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold mb-6 text-blue-600">🌀 FingerMobile Protocol</h1>
          <nav className="flex flex-col gap-3 text-sm">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="hover:text-blue-500 py-1"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-scroll">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-700" />
            </div>
            <input
              type="text"
              placeholder="Search achievements..."
              className="block w-full min-h-[44px] pl-10 pr-10 py-2 border border-slate-300 rounded-xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold bg-white placeholder:text-slate-400 text-sm"
            />
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <MicrophoneIcon className="h-5 w-5 text-slate-700" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="min-h-[44px] flex items-center text-sm font-bold bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-xs">
              💰 ${ficBalance}
            </span>
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>

        {/* H1 Menu (Dancia-4Tv, BeatwaveNG, Marketplace) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {h1MenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="min-h-[44px] px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:opacity-90 transition-all flex items-center shadow-xs"
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900 flex items-center">
            <AwardIcon className="w-8 h-8 text-amber-500 mr-2 shrink-0" />
            <span>Hallmark Achievements</span>
          </h1>
          <p className="text-slate-700 text-sm mt-1">Recognizing your contributions and milestones in the community</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-xs border border-slate-300 p-4 sm:p-5">
            <div className="text-2xl font-black text-amber-500">8</div>
            <div className="text-xs sm:text-sm text-slate-700 font-bold mt-1">Achievements Earned</div>
          </div>
          <div className="bg-white rounded-xl shadow-xs border border-slate-300 p-4 sm:p-5">
            <div className="text-2xl font-black text-blue-600">3</div>
            <div className="text-xs sm:text-sm text-slate-700 font-bold mt-1">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow-xs border border-slate-300 p-4 sm:p-5">
            <div className="text-2xl font-black text-emerald-600">4</div>
            <div className="text-xs sm:text-sm text-slate-700 font-bold mt-1">Gold Level</div>
          </div>
          <div className="bg-white rounded-xl shadow-xs border border-slate-300 p-4 sm:p-5">
            <div className="text-2xl font-black text-purple-600">24</div>
            <div className="text-xs sm:text-sm text-slate-700 font-bold mt-1">Total Points</div>
          </div>
        </div>

        {/* Earned Achievements */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-slate-900 mb-4">Earned Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-xl shadow-xs border border-slate-300 overflow-hidden hover:shadow-md transition">
                <div className="p-4 sm:p-5">
                  <div className="flex items-start">
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                      <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">{achievement.title}</h3>
                      <div className="flex flex-wrap items-center mt-1 gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                          achievement.level === 'Gold' ? 'bg-amber-100 text-amber-950 border border-amber-400 font-black' :
                            achievement.level === 'Silver' ? 'bg-slate-100 text-slate-950 border border-slate-400 font-bold' :
                              achievement.level === 'Platinum' ? 'bg-purple-100 text-purple-950 border border-purple-400 font-black' :
                                'bg-blue-100 text-blue-950 border border-blue-400 font-black'
                        }`}>
                          {achievement.level}
                        </span>
                        <span className="text-xs text-slate-700">Earned {achievement.earnedDate}</span>
                      </div>
                      <p className="text-slate-700 text-xs sm:text-sm mt-2">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs font-bold text-slate-700 mb-1">Progress</div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 border border-slate-300 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2.5 rounded-full transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-slate-700">
                    <strong className="text-slate-900">Criteria:</strong> {achievement.criteria}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Levels */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-slate-900 mb-4">Achievement Levels</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex items-center p-3.5 bg-purple-50 border border-purple-200 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
                👑
              </div>
              <div className="ml-3">
                <div className="font-bold text-slate-900 text-sm">Gold</div>
                <div className="text-xs text-slate-700 font-medium">Top tier achievements</div>
              </div>
            </div>
            <div className="flex items-center p-3.5 bg-slate-100 border border-slate-300 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-slate-500 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
                🏆
              </div>
              <div className="ml-3">
                <div className="font-bold text-slate-900 text-sm">Silver</div>
                <div className="text-xs text-slate-700 font-medium">Mid tier achievements</div>
              </div>
            </div>
            <div className="flex items-center p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
                🏐
              </div>
              <div className="ml-3">
                <div className="font-bold text-slate-900 text-sm">Bronze</div>
                <div className="text-xs text-slate-700 font-medium">Entry level achievements</div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Earn More */}
        <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-xs">
          <h3 className="font-black text-lg text-slate-900 mb-3">How to Earn More</h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-2">✓</span>
              <span>Post regularly in the community forum</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-2">✓</span>
              <span>Share educational content and tutorials</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-2">✓</span>
              <span>Engage with other community members</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-2">✓</span>
              <span>Complete courses on CAMUS LMS</span>
            </li>
            <li className="flex items-start">
              <span className="text-emerald-600 font-bold mr-2">✓</span>
              <span>Purchase premium gems to support creators</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Fixed Ad Banner */}
      <FixedAdBanner adSlot="hallmark-bottom-right" />

      {/* Sovereign Mobile Navigation Quick Dock */}
      <nav
        aria-label="Hallmarks Mobile Navigation"
        className="md:hidden fixed bottom-4 inset-x-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-2 z-40 shadow-2xl flex items-center justify-around gap-1"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <AwardIcon className="w-5 h-5 mb-0.5" />
          <span>Hallmarks</span>
        </button>
        <button
          type="button"
          onClick={() => {
            const input = document.querySelector('input[placeholder*="Search achievements"]');
            if (input) (input as HTMLElement).focus();
          }}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <SearchIcon className="w-5 h-5 mb-0.5" />
          <span>Search</span>
        </button>
        <Link
          to="/leaderboard"
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <AwardIcon className="w-5 h-5 mb-0.5 text-emerald-400" />
          <span>Leaders</span>
        </Link>
        <Link
          to="/marketplace"
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] py-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors"
        >
          <ShoppingBagIcon className="w-5 h-5 mb-0.5" />
          <span>Market</span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="hidden md:block text-center py-4 text-xs text-slate-700 border-t bg-white">
        <p>©2031 FingerMobile Protocol. All rights reserved.</p>
        <nav className="space-x-2 mt-1">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/termsofservice" className="hover:underline">Terms</Link>
          <Link to="/privacypolicy" className="hover:underline">Privacy</Link>
        </nav>
      </footer>
    </div>
  );
};

export default HallmarkPage;
