import { Link, useLocation } from 'react-router-dom';
import React from 'react';

// Import only the exact icons used in this file
import {
  HomeIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  ComputerDesktopIcon,
  XMarkIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  BuildingOfficeIcon,
  LifebuoyIcon,
  CubeIcon,
  UserIcon
} from '../../components/icons';

interface DashboardNavigationProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

// Moved outside component to prevent memory re-allocation on every render loop
const NAV_ITEMS = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, badge: 0 },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon, badge: 0 },
  { name: 'Content', href: '/dashboard/content', icon: DocumentTextIcon, badge: 0 },
  { name: 'Users', href: '/dashboard/users', icon: UserGroupIcon, badge: 0 },
  { name: 'Finance', href: '/dashboard/finance', icon: CreditCardIcon, badge: 0 },
  { name: 'Shop', href: '/dashboard/shop', icon: ShoppingBagIcon, badge: 0 },
  { name: 'System', href: '/dashboard/system', icon: ComputerDesktopIcon, badge: 0 },
  { name: 'Support', href: '/dashboard/support', icon: LifebuoyIcon, badge: 0 },
  { name: 'Media', href: '/dashboard/media', icon: VideoCameraIcon, badge: 0 },
  { name: 'Audio', href: '/dashboard/audio', icon: MusicalNoteIcon, badge: 0 },
  { name: 'Business', href: '/dashboard/business', icon: BuildingOfficeIcon, badge: 0 },
  { name: 'Tools', href: '/dashboard/tools', icon: CubeIcon, badge: 0 },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon, badge: 0 }
];

const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  sidebarOpen,
  toggleSidebar
}) => {
  const location = useLocation();

  // Helper to close sidebar after clicking a navigation link on mobile layout
  const handleLinkClick = () => {
    if (sidebarOpen && window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ease-in-out transform flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}
    >
      {/* Header / Logo Section */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-md"></div>
          <span className="text-xl font-bold">FingerMobile</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="lg:hidden text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Scrollable Navigation Area */}
      <nav className="flex-1 mt-5 px-2 overflow-y-auto space-y-1 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          // Matches exact home link or starts with deeper sub-routes for others
          const isActive = item.href === '/dashboard'
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleLinkClick}
              aria-current={isActive ? 'page' : undefined}
              className={`${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="truncate">{item.name}</span>
              {item.badge > 0 && (
                <span className="ml-auto inline-flex bg-red-500 text-xs rounded-full h-5 w-5 items-center justify-center font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Section (Pinned safely to bottom without absolute overlaps) */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0 bg-gray-900">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
            </div>
          </div>
          <div className="ml-3 truncate">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs font-medium text-gray-400 truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardNavigation;
