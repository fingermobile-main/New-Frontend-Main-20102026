import { useNavigate, Navigate } from 'react-router-dom';
import React from 'react';

import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import {
  Bars3Icon
} from '../icons';
import DashboardNavigation from '../components/dashboard/DashboardNavigation';
import { useAppContext } from '../contexts';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const { darkMode, toggleTheme } = useTheme();
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Rest of the component implementation...
  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-[#ff6b00] bg-white dark:bg-gray-800 shadow-lg hover:bg-orange-50 dark:hover:bg-gray-700"
        >
          <Bars3Icon className="h-6 w-6 text-[#ff6b00]" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static`}
      >
        <div className="pt-20 md:pt-4 h-full flex flex-col">
          <nav className="flex-1 px-2 space-y-1 overflow-y-auto max-h-full">
            <DashboardNavigation sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          </nav>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 mb-2"
            >
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:pl-64 pt-20 md:pt-4 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
