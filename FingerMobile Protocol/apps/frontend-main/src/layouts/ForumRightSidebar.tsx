import { Link } from 'react-router-dom';
import React, { useState } from 'react';

import {
  SparklesIcon,
  BellIcon,
  TrendingUpIcon,
  CalendarIcon,
  MegaphoneIcon,
  UserGroupIcon,
  XIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '../icons';

interface ForumRightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForumRightSidebar: React.FC<ForumRightSidebarProps> = ({ isOpen, onClose }) => {
  const [showEarnings, setShowEarnings] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  // Mock data - replace with actual API calls
  const notifications = [
    { id: 1, text: 'John liked your post', time: '2m ago' },
    { id: 2, text: 'New comment on your thread', time: '15m ago' },
    { id: 3, text: 'You earned 50 FIC', time: '1h ago' }
  ];

  const earnings = {
    today: 125.50,
    thisWeek: 892.30,
    thisMonth: 3456.75,
    currency: 'FIC'
  };

  const events = [
    { id: 1, title: 'Community Meetup', date: 'Today, 6:00 PM', attendees: 45 },
    { id: 2, title: 'AI Workshop', date: 'Tomorrow, 2:00 PM', attendees: 128 },
    { id: 3, title: 'Creator Summit', date: 'Dec 20, 10:00 AM', attendees: 256 }
  ];

  const onlineFriends = [
    { id: 1, name: 'Alice Smith', avatar: 'AS', color: 'from-purple-500 to-pink-500' },
    { id: 2, name: 'Bob Johnson', avatar: 'BJ', color: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Carol White', avatar: 'CW', color: 'from-green-500 to-emerald-500' },
    { id: 4, name: 'David Brown', avatar: 'DB', color: 'from-orange-500 to-red-500' }
  ];

  const sponsoredAds = [
    {
      id: 1,
      image: 'https://via.placeholder.com/300x200',
      title: 'Premium Membership',
      description: 'Unlock exclusive features',
      url: '/premium'
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/300x200',
      title: 'AI Content Tools',
      description: 'Boost your creativity',
      url: '/ai-tools'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-[#242526]">

      {/* Mobile Close Button */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-700">
        <span className="text-lg font-semibold text-white">Sidebar</span>
        <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-lg">
          <XIcon className="w-6 h-6 text-slate-600" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-6">

        {/* AI Assistant Widget */}
        <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-xl p-4 border border-purple-700/50">
          <div className="flex items-center gap-2 mb-3">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
          </div>
          <p className="text-xs text-gray-300 mb-3">Need help? Ask me anything about FingerMobile.</p>
          <Link
            to="/ai-assistant"
            className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
          >
            Chat Now
          </Link>
        </div>

        {/* Notifications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-semibold text-gray-300">Notifications</h3>
            </div>
            <Link to="/notifications" className="text-xs text-orange-500 hover:text-orange-400">
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                <p className="text-sm text-gray-300">{notif.text}</p>
                <span className="text-xs text-slate-700 font-medium mt-1 block">{notif.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Dashboard */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="w-5 h-5 text-green-400" />
              <h3 className="text-sm font-semibold text-gray-300">Earnings</h3>
            </div>
            <button
              onClick={() => setShowEarnings(!showEarnings)}
              className="text-xs text-gray-300 font-medium hover:text-white"
            >
              {showEarnings ? 'Hide' : 'Show'}
            </button>
          </div>

          {showEarnings ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300 font-medium">Today</span>
                <span className="text-sm font-semibold text-green-400">{earnings.today} {earnings.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300 font-medium">This Week</span>
                <span className="text-sm font-semibold text-green-400">{earnings.thisWeek} {earnings.currency}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-300 font-medium">This Month</span>
                <span className="text-sm font-semibold text-green-400">{earnings.thisMonth} {earnings.currency}</span>
              </div>
              <Link
                to="/wallet"
                className="block w-full mt-3 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm font-medium rounded-lg transition-colors text-center border border-green-600/50"
              >
                View Wallet
              </Link>
            </div>
          ) : (
            <div className="text-center py-4 text-slate-700 font-medium text-sm">
              ••••••••
            </div>
          )}
        </div>

        {/* Events */}
        <div>
          <button
            onClick={() => setShowEvents(!showEvents)}
            className="flex items-center justify-between w-full mb-3"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-semibold text-gray-300">Events</h3>
            </div>
            {showEvents ? (
              <ChevronDownIcon className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {showEvents && (
            <div className="space-y-2">
              {events.map((event) => (
                <div key={event.id} className="p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <h4 className="text-sm font-medium text-white mb-1">{event.title}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-300 font-medium">
                    <span>{event.date}</span>
                    <span>{event.attendees} attending</span>
                  </div>
                </div>
              ))}
              <Link
                to="/events"
                className="block text-xs text-orange-500 hover:text-orange-400 mt-2"
              >
                See all events →
              </Link>
            </div>
          )}
        </div>

        {/* Ads Manager */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MegaphoneIcon className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-semibold text-gray-300">Ads Manager</h3>
          </div>
          <p className="text-xs text-gray-300 font-medium mb-3">Create and manage your ad campaigns</p>
          <Link
            to="/ads-manager"
            className="block w-full px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-sm font-medium rounded-lg transition-colors text-center border border-blue-600/50"
          >
            Manage Ads
          </Link>
        </div>

        {/* Sponsored Content */}
        <div>
          <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">Sponsored</h3>
          <div className="space-y-3">
            {sponsoredAds.map((ad) => (
              <Link
                key={ad.id}
                to={ad.url}
                className="block bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
              >
                <img src={ad.image} alt={ad.title} className="w-full h-32 object-cover"  />
                <div className="p-3">
                  <h4 className="text-sm font-semibold text-white mb-1">{ad.title}</h4>
                  <p className="text-xs text-gray-300 font-medium mb-2">{ad.description}</p>
                  <span className="text-[10px] text-slate-700 font-bold uppercase">Sponsored</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Online Friends */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-slate-600" />
              <h3 className="text-sm font-semibold text-gray-300">Online Friends</h3>
            </div>
            <span className="text-xs text-green-400">{onlineFriends.length} online</span>
          </div>
          <div className="space-y-2">
            {onlineFriends.map((friend) => (
              <div key={friend.id} className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${friend.color} flex items-center justify-center text-white text-xs font-semibold`}>
                  {friend.avatar}
                </div>
                <span className="text-sm text-gray-300">{friend.name}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-auto"></div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default ForumRightSidebar;
