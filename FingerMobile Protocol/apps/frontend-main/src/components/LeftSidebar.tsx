import { Link, useLocation } from 'react-router-dom';
import React, {} from 'react';


const LeftSidebar: React.FC = () => {
  const location = useLocation();

  // Updated navigation items based on design document
  const navItems = [
    { icon: '🏠', label: 'Home', path: '/' },
    { icon: '🔥', label: 'Trends', path: '/trends' },
    { icon: '👥', label: 'My Network', path: '/network' },
    { icon: '🏛️', label: 'Communities', path: '/communities' },
    { icon: '🏅', label: 'Hallmarks', path: '/hallmarks' },
    { icon: '💎', label: 'Gems', path: '/gems' },
    { icon: '📝', label: 'Blogs', path: '/blogs' },
    { icon: '💼', label: 'Jobs', path: '/jobs' },
    { icon: '🛒', label: 'Marketplace', path: '/marketplace' },
    { icon: '📷', label: 'PhotoCredits', path: '/photocredits' },
    { icon: '🎵', label: 'BeatwaveNG', path: '/beatwaveng' },
    { icon: '📺', label: 'Dancia4Tv', path: '/dancia4tv' },
    { icon: '🎮', label: 'GameOn', path: '/gameon' },
    { icon: '💰', label: 'My Earnings', path: '/earnings' },
    { icon: '⚙️', label: 'Settings', path: '/settings' }
  ];

  // My Shortcuts section from design document
  const shortcutItems = [
    { icon: '👤', label: 'My Profile', path: '/profile' },
    { icon: '🏛️', label: 'My Communities', path: '/communities/my' },
    { icon: '💾', label: 'Saved Items', path: '/saved' },
    { icon: '📅', label: 'Events', path: '/events' }
  ];

  return (
    <nav className="sticky top-20">
      <ul className="space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-fm-orange/10 text-fm-orange'
                    : 'text-fm-gray-700 hover:bg-fm-gray-100 hover:text-fm-orange'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* My Shortcuts section from design document */}
      <div className="mt-6 pt-6 border-t border-fm-gray-200">
        <h3 className="font-bold text-fm-gray-700 mb-3 px-3">My Shortcuts</h3>
        <ul className="space-y-1">
          {shortcutItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-fm-orange/10 text-fm-orange'
                      : 'text-fm-gray-700 hover:bg-fm-gray-100 hover:text-fm-orange'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Quick Actions from design document */}
      <div className="mt-6 pt-6 border-t border-fm-gray-200">
        <Link
          to="/createpost"
          className="w-full bg-fm-orange text-white py-2.5 rounded-full text-sm font-medium hover:bg-fm-orange-hover transition-colors mb-2 block text-center"
        >
          ✏️ Create Post
        </Link>
        <Link
          to="/golive"
          className="w-full bg-fm-blue text-white py-2.5 rounded-full text-sm font-medium hover:bg-fm-blue-hover transition-colors block text-center"
        >
          📹 Go Live
        </Link>
      </div>

      {/* Discover section from design document */}
      <div className="mt-6 pt-6 border-t border-fm-gray-200">
        <h3 className="font-bold text-fm-gray-700 mb-3 px-3">Discover</h3>
        <ul className="space-y-1">
          <li>
            <Link
              to="/communities/discover"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-fm-gray-700 hover:bg-fm-gray-100 hover:text-fm-orange transition-colors"
            >
              <span className="text-lg">🏛️</span>
              <span>Suggested Communities</span>
            </Link>
          </li>
          <li>
            <Link
              to="/network/suggestions"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-fm-gray-700 hover:bg-fm-gray-100 hover:text-fm-orange transition-colors"
            >
              <span className="text-lg">👥</span>
              <span>People You May Know</span>
            </Link>
          </li>
          <li>
            <Link
              to="/trends"
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium text-fm-gray-700 hover:bg-fm-gray-100 hover:text-fm-orange transition-colors"
            >
              <span className="text-lg">🔥</span>
              <span>Trending Topics</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default LeftSidebar;
