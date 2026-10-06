import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  WalletIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  NewspaperIcon,
  ShoppingBagIcon,
  SparklesIcon,
  GlobeAltIcon,
  HeartIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  GiftIcon as GiftIconSolid,
  WalletIcon as WalletIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  SparklesIcon as SparklesIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  HeartIcon as HeartIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid
} from '@heroicons/react/24/solid';
import NotificationsPanel from '../NotificationsPanel';

const Logo: React.FC<{ className?: string }> = ({ className = 'h-8 w-8 text-blue-600' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
  </svg>
);

interface MainLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, pageTitle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { member, logout } = useAuth();
  const {
    unreadNotifications,
    toggleNotifications,
    notificationsOpen,
    ficBalance,
    showSearch,
    setShowSearch
  } = useAppContext();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon, iconSelected: HomeIconSolid },
    { name: 'Feed', href: '/feed', icon: NewspaperIcon, iconSelected: NewspaperIconSolid },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon, iconSelected: ChatBubbleLeftRightIconSolid },
    { name: 'Groups', href: '/groups', icon: UserGroupIcon, iconSelected: UserGroupIconSolid },
    { name: 'Blogs', href: '/blogs', icon: DocumentTextIcon, iconSelected: DocumentTextIconSolid },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBagIcon, iconSelected: ShoppingBagIconSolid },
    { name: 'Gems', href: '/gems', icon: SparklesIcon, iconSelected: SparklesIconSolid },
    { name: 'Hallmarks', href: '/hallmarks', icon: HeartIcon, iconSelected: HeartIconSolid },
    { name: 'Canary', href: '/canary', icon: GlobeAltIcon, iconSelected: GlobeAltIconSolid },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon, iconSelected: WalletIconSolid },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, iconSelected: Cog6ToothIconSolid },
    { name: 'Business', href: '/business', icon: BuildingOfficeIcon, iconSelected: BuildingOfficeIconSolid },
    { name: 'DPO', href: '/dpo', icon: ShieldCheckIcon, iconSelected: ShieldCheckIconSolid },
    { name: 'Gifts', href: '/gifts', icon: GiftIcon, iconSelected: GiftIconSolid },
    { name: 'Guardian', href: '/guardian-protection', icon: ShieldCheckIcon, iconSelected: ShieldCheckIconSolid } // Guardian Protection
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    if (location.pathname.startsWith('/profile')) {
      setMobileMenuOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Panel */}
      <NotificationsPanel
        isOpen={Boolean(notificationsOpen)}
        onClose={() => toggleNotifications?.()}
      />

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex ${mobileMenuOpen ? '' : 'hidden'}`}>
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="relative flex flex-col w-64 bg-white border-r border-gray-200 z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/" className="flex items-center">
              <Logo className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FingerMobile</span>
            </Link>
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`${
                      isActive(item.href) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 h-6 w-6 flex-shrink-0`}
                  />
                  {item.name}
                </Link>
              ))}

              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account
                </div>

                {member ? (
                  <>
                    <Link
                      to={`/profile/${member.id}`}
                      className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      <UserCircleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                      View Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      <svg className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      <svg className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                    >
                      <svg className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                      Register
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <Link to="/" className="flex items-center">
              <Logo className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">FingerMobile</span>
            </Link>
          </div>

          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = isActive(item.href) ? item.iconSelected : item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                  >
                    <Icon
                      className={`${
                        isActive(item.href) ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-3 h-6 w-6 flex-shrink-0`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto p-4 border-t border-gray-200">
              {member ? (
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 mb-2">Account</div>
                  <div className="text-sm font-medium text-gray-700 truncate">{(member as any).name || (member as any).displayName || member.username}</div>
                  <div className="text-xs text-gray-500 truncate">{member.email}</div>
                  <div className="text-xs text-gray-500">FIC: {ficBalance.toFixed(2)}</div>
                  <div className="flex space-x-2 mt-2">
                    <Link
                      to={`/profile/${member.id}`}
                      className="flex-1 text-center px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex-1 text-center px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    className="block w-full text-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full text-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-7xl lg:px-8">
            <div className="relative flex justify-between lg:gap-8 xl:grid xl:grid-cols-12">
              <div className="flex md:min-w-0 md:flex-1 lg:col-span-6">
                <button
                  type="button"
                  className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>

                <div className="hidden lg:flex lg:items-center">
                  <h1 className="text-xl font-semibold text-gray-900 truncate">
                    {pageTitle || 'Dashboard'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 lg:col-span-6">
                {/* Search Bar */}
                <div className="flex-1 flex items-center justify-center min-w-0">
                  {!showSearch ? (
                    <button
                      onClick={() => setShowSearch?.(true)}
                      className="text-gray-400 hover:text-gray-500 p-1"
                    >
                      <MagnifyingGlassIcon className="h-6 w-6" />
                    </button>
                  ) : (
                    <div className="relative w-full max-w-xs">
                      <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-8 pr-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onBlur={() => setShowSearch?.(false)}
                        autoFocus
                      />
                      <MagnifyingGlassIcon className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <button
                  type="button"
                  className="p-1 text-gray-400 hover:text-gray-500 relative"
                  onClick={toggleNotifications}
                >
                  <BellIcon className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* User dropdown */}
                <div className="ml-4 flex items-center md:ml-6">
                  {member ? (
                    <div className="hidden md:flex items-center">
                      <div className="mr-4 text-right hidden lg:block">
                        <div className="text-sm font-medium text-gray-900">{(member as any).name || (member as any).displayName || member.username}</div>
                        <div className="text-xs text-gray-500">FIC: {ficBalance.toFixed(2)}</div>
                      </div>
                      <Link to={`/profile/${member.id}`} className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page heading */}
              <h1 className="hidden lg:block text-2xl font-semibold text-gray-900 mb-6">
                {pageTitle || 'Dashboard'}
              </h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              {children}
              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
