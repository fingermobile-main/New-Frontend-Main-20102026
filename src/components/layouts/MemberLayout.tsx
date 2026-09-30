import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  UserCircleIcon,
  WalletIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon
} from '../../icons';

interface MemberLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  pageTitle?: string;
}

const MemberLayout: React.FC<MemberLayoutProps> = ({ children, title, subtitle, pageTitle }) => {
  const displayTitle = title || pageTitle || 'Dashboard';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Profile', path: '/profile', icon: <UserCircleIcon className="w-6 h-6" /> },
    { name: 'Wallet', path: '/wallet', icon: <WalletIcon className="w-6 h-6" /> },
    { name: 'Messages', path: '/messages', icon: <ChatBubbleLeftRightIcon className="w-6 h-6" /> },
    { name: 'Settings', path: '/settings', icon: <Cog6ToothIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 bg-white/70 backdrop-blur-xl border-r border-slate-200/50 shadow-sm z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            F
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
            FingerMobile
          </span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500/10 to-teal-400/10 text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100/80 hover:text-slate-800 hover:scale-[1.02]'
                }`}
              >
                <div className={`${isActive ? 'text-indigo-600' : ''}`}>{item.icon}</div>
                <span className="font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-200/50">
          <Link to="/logout" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300">
            <span className="font-semibold">Log out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-4 bg-slate-50/80 backdrop-blur-xl border-b border-slate-200/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{displayTitle}</h1>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all duration-300">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-slate-50 rounded-full"></span>
            </button>
            <Link to="/profile" className="w-10 h-10 rounded-full ring-2 ring-indigo-100 hover:ring-indigo-300 transition-all duration-300 overflow-hidden shadow-sm">
              <img src="/placeholder-avatar.jpg" alt="Avatar" className="w-full h-full object-cover" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Slide-out Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white/90 backdrop-blur-xl shadow-2xl transition-transform">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center text-white font-bold">
                  F
                </div>
                <span className="text-lg font-bold text-slate-800">Menu</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${
                    location.pathname.startsWith(item.path)
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${
                  isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className={`${isActive ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MemberLayout;
