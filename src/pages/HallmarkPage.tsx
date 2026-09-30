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
    hallmarksService.getAllHallmarks().then((res) => {
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
    }).catch(err => console.warn('Failed to load live hallmarks in HallmarkPage:', err));
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu */}
      <BurgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />

      {/* Ad Banner */}
      <AdBanner adSlot="hallmark-top" />

      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-64 bg-white border-r px-4 py-6 flex flex-col justify-between">
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search achievements..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <MicrophoneIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full">
              💰 ${ficBalance}
            </span>
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                U
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
        </div>

        {/* H1 Menu (Dancia-4Tv, BeatwaveNG, Marketplace) */}
        <div className="flex flex-wrap gap-2 mb-6">
          {h1MenuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-sm hover:opacity-90 transition flex items-center"
            >
              {item.icon}
              <span className="ml-2">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <AwardIcon className="w-8 h-8 text-yellow-500 mr-2" />
            Hallmark Achievements
          </h1>
          <p className="text-gray-600 mt-1">Recognizing your contributions and milestones in the community</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <div className="text-2xl font-bold text-yellow-500">8</div>
            <div className="text-gray-600">Achievements Earned</div>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <div className="text-2xl font-bold text-blue-500">3</div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <div className="text-2xl font-bold text-green-500">4</div>
            <div className="text-gray-600">Gold Level</div>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <div className="text-2xl font-bold text-purple-500">24</div>
            <div className="text-gray-600">Total Points</div>
          </div>
        </div>

        {/* Earned Achievements */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Earned Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-5">
                  <div className="flex items-start">
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-16 h-16 rounded-lg"
                    />
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-gray-900">{achievement.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                          achievement.level === 'Gold' ? 'bg-yellow-100 text-yellow-800' :
                            achievement.level === 'Silver' ? 'bg-gray-100 text-gray-800' :
                              achievement.level === 'Platinum' ? 'bg-purple-100 text-purple-800' :
                                'bg-blue-100 text-blue-800'
                        }`}>
                          {achievement.level}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">Earned {achievement.earnedDate}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{achievement.description}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-1">Progress</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    <strong>Criteria:</strong> {achievement.criteria}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Levels */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Achievement Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                👑
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">Gold</div>
                <div className="text-xs text-gray-600">Top tier achievements</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                🏆
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">Silver</div>
                <div className="text-xs text-gray-600">Mid tier achievements</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-amber-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold">
                🏐
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-900">Bronze</div>
                <div className="text-xs text-gray-600">Entry level achievements</div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Earn More */}
        <div>
          <h3 className="font-semibold text-lg mb-3">How to Earn More</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Post regularly in the community forum</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Share educational content and tutorials</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Engage with other community members</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Complete courses on CAMUS LMS</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Purchase premium gems to support creators</span>
            </li>
          </ul>
        </div>
      </main>

      {/* Fixed Ad Banner */}
      <FixedAdBanner adSlot="hallmark-bottom-right" />

      {/* Footer */}
      <footer className="hidden md:block text-center py-4 text-xs text-gray-500 border-t bg-white">
        <p>©2031 FingerMobile Protocol. All rights reserved.</p>
        <nav className="space-x-2 mt-1">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
        </nav>
      </footer>
    </div>
  );
};

export default HallmarkPage;
