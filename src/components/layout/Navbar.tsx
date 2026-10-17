import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import ErrorBoundary from '../ErrorBoundary';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const [isProfileManagementOpen, setIsProfileManagementOpen] = useState(false);
  const [isLogoPulsing, setIsLogoPulsing] = useState(false);
  const logoPulseTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoHover = () => {
    if (!isLogoPulsing) {
      setIsLogoPulsing(true);
      if (logoPulseTimer.current) clearTimeout(logoPulseTimer.current);
      logoPulseTimer.current = setTimeout(() => {
        setIsLogoPulsing(false);
      }, 5000);
    }
  };

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsLogoMenuOpen(!isLogoMenuOpen)}
                onMouseEnter={handleLogoHover}
                className="flex-shrink-0 flex items-center focus:outline-none"
                aria-label="FingerMobile Home Menu"
              >
                <img
                  src="/assets/branding/fingermobile/FingerMobile orange logo.webp"
                  alt="FingerMobile"
                  className={`h-8 w-auto object-contain mr-2 ${isLogoPulsing ? 'scale-105' : ''} transition-transform`}
                  onError={(e) => {
                    e.currentTarget.src = '/assets/branding/fingermobile/logo.png';
                  }}
                />
                <span className={`text-xl font-black text-gray-900 ${isLogoPulsing ? 'animate-pulse' : ''}`}>
                  Finger<span className="text-orange-500">Mobile</span>
                </span>
              </button>

              {isLogoMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsLogoMenuOpen(false)}
                  >
                    HomePage
                  </Link>
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileManagementOpen(!isProfileManagementOpen)}
                      className="w-full text-left flex justify-between items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
                    >
                      Profile Management and Layout
                      <ChevronDownIcon className="h-4 w-4" />
                    </button>
                    {isProfileManagementOpen && (
                      <div className="bg-gray-50 pl-4 py-1">
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md"
                          onClick={() => {
                            setIsProfileManagementOpen(false);
                            setIsLogoMenuOpen(false);
                          }}
                        >
                          Settings
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className={`${isActive('/') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-slate-700 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              <Link
                to="/forum"
                className={`${isActive('/forum') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-slate-700 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Forum
              </Link>
              <Link
                to="/marketplace"
                className={`${isActive('/marketplace') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-slate-700 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Marketplace
              </Link>
              <Link
                to="/profile-enhancement"
                className={`${isActive('/profile-enhancement') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-slate-700 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Profile Enhancement
              </Link>
              <Link
                to="/business-page"
                className={`${isActive('/business-page') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-slate-700 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Business Page
              </Link>
              <Link
                to="/community-group"
                className={`${isActive('/community-group') ? 'border-indigo-500 text-gray-900' : 'border-transparent text-slate-700 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Community
              </Link>
            </div>
          </div>

          <div className="hidden md:ml-4 md:flex md:items-center">
            {user ? (
              // Logged in - Show Profile Dropdown
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://via.placeholder.com/32'}
                    alt={user.username || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                  <span>{user.username}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/wallet"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Wallet
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      to="/creators-center"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Creators Center & Services
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not logged in - Show Sign in link
              <div className="ml-3 relative">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-gray-700"
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#ff6b00] hover:text-[#e05e00] hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6 text-[#ff6b00]" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6 text-[#ff6b00]" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center space-x-2 bg-slate-50/80">
            <img
              src="/assets/branding/fingermobile/FRONT copy.webp"
              alt="FingerMobile Drawer"
              className="h-7 w-7 object-contain"
              onError={(e) => {
                e.currentTarget.src = '/assets/branding/fingermobile/drawer-splash-logo.webp';
              }}
            />
            <span className="font-bold text-gray-900 text-sm tracking-wide">FingerMobile Drawer</span>
          </div>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`${isActive('/') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-slate-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/forum"
              className={`${isActive('/forum') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-slate-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Forum
            </Link>
            <Link
              to="/marketplace"
              className={`${isActive('/marketplace') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-slate-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/profile"
              className={`${isActive('/profile') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-slate-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`${isActive('/dashboard') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-slate-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/wallet"
                  className={`${isActive('/wallet') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-slate-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wallet
                </Link>
                <Link
                  to="/creators-center"
                  className={`${isActive('/creators-center') ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-transparent text-slate-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Creators Center & Services
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-700 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </>
            )}
            {!user && (
              <Link
                to="/login"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-700 hover:text-gray-700 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const SafeNavbar: React.FC = () => (
  <ErrorBoundary fallback={<div className="bg-white p-4 shadow text-center text-sm text-slate-500">Navigation bar unavailable</div>}>
    <Navbar />
  </ErrorBoundary>
);

export default SafeNavbar;
