import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import NotificationsPanel from '../NotificationsPanel';
import { ProtocolLushDrawer } from './ProtocolLushDrawer';

interface MainLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
}

export default function MainLayout({ children, pageTitle }: MainLayoutProps) {
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F9F6] flex flex-col">
      {/* Top Ambient Glow Banner (Consistent with Lushpressies) */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-[#DC582A] w-full sticky top-0 z-50" />

      {/* Notification Panel */}
      <NotificationsPanel
        isOpen={Boolean(notificationsOpen)}
        onClose={() => toggleNotifications?.()}
      />

      {/* Mobile Drawer (Lushpressies consistent drawer) */}
      <div className={`fixed inset-0 z-50 flex ${mobileMenuOpen ? '' : 'hidden'}`}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="relative flex flex-col w-80 max-w-[85vw] bg-[#F5F9F6] border-r border-emerald-100/80 z-50 p-3 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-emerald-100">
            <Link
              to="/"
              className="flex items-center gap-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <img
                src="/assets/logos/fingermobile_logo.webp"
                alt="FingerMobile"
                className="h-7 w-auto object-contain"
              />
              <span className="text-base font-bold text-gray-900 tracking-tight">
                FingerMobile
              </span>
            </Link>
            <button
              type="button"
              className="p-1.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-emerald-50 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <ProtocolLushDrawer
            member={member}
            ficBalance={ficBalance}
            onLogout={handleLogout}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </div>
      </div>

      {/* Desktop Sidebar (Lushpressies consistent drawer) */}
      <div className="hidden lg:fixed lg:top-1 lg:bottom-0 lg:left-0 lg:flex lg:w-80 lg:flex-col z-30">
        <div className="flex flex-col flex-grow bg-[#F5F9F6] border-r border-emerald-100/80 p-3 overflow-y-auto">
          <div className="flex items-center gap-2 px-2 pb-3 mb-1 border-b border-emerald-100/70">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/assets/logos/fingermobile_logo.webp"
                alt="FingerMobile"
                className="h-7 w-auto object-contain"
              />
              <span className="text-base font-extrabold text-gray-900 tracking-tight">
                FingerMobile Protocol
              </span>
            </Link>
          </div>

          <ProtocolLushDrawer
            member={member}
            ficBalance={ficBalance}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lg:pl-80 flex flex-col flex-1 min-w-0">
        {/* Top Navigation Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-emerald-100/70 shadow-2xs z-20 sticky top-1">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-xl p-2 text-[#ff6b00] hover:text-[#e05e00] hover:bg-orange-50 focus:outline-none border border-orange-200/80 transition cursor-pointer"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open Platform Navigation Menu"
                  title="Platform Navigation"
                >
                  <Bars3Icon className="h-6 w-6 text-[#ff6b00]" />
                </button>

                <div className="truncate">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    {pageTitle || 'FingerMobile Protocol'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  {!showSearch ? (
                    <button
                      onClick={() => setShowSearch?.(true)}
                      className="text-gray-500 hover:text-emerald-800 p-2 rounded-xl hover:bg-emerald-50 transition"
                      title="Search"
                    >
                      <MagnifyingGlassIcon className="h-5 w-5" />
                    </button>
                  ) : (
                    <div className="relative w-48 sm:w-64">
                      <input
                        type="text"
                        placeholder="Search protocol..."
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        onBlur={() => setShowSearch?.(false)}
                        autoFocus
                      />
                      <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Notifications */}
                <button
                  type="button"
                  className="p-2 text-gray-500 hover:text-emerald-800 rounded-xl hover:bg-emerald-50 relative transition"
                  onClick={toggleNotifications}
                  title="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute 1 top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* FIC Balance Quick Pill */}
                <Link
                  to="/wallet"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-mono font-bold text-amber-900 hover:bg-amber-100 transition shadow-2xs"
                  title="View Live FIC Vault"
                >
                  <span>🪙</span>
                  <span>{ficBalance.toLocaleString()} FIC</span>
                </Link>

                {/* User Profile / Auth */}
                <div className="flex items-center">
                  {member ? (
                    <Link
                      to={`/profile/${member.id}`}
                      className="flex items-center gap-2 p-1 rounded-xl hover:bg-emerald-50 transition"
                    >
                      <img
                        src={(member as any).avatar || (member as any).photoURL || '/assets/branding/mbah_israel_obinna.jpeg'}
                        alt={member.username || 'User'}
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/30"
                      />
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}

export { MainLayout };
