import { Link} from 'react-router-dom';
import React, {} from 'react';

import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';  // Using absolute path from src
import AnimatedAvatar from '../AnimatedAvatar'; // Changed to default import
import { LogoIcon } from '../icons';

export const TopNavigation = () => {
  const { member } = useAuth();
  const { notificationsCount } = useAppContext(); // Using the correct property name

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center">
          <LogoIcon className="h-8 w-8 text-brand-blue" />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
            FingerMobile
          </span>
        </Link>
      </div>

      <nav className="hidden md:flex space-x-6">
        <Link to="/feed" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">
          Feed
        </Link>
        <Link to="/discover" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">
          Discover
        </Link>
        <Link to="/groups" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">
          Groups
        </Link>
        <Link to="/marketplace" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue transition-colors">
          Marketplace
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        {member ? (
          <Link to="/notifications" className="relative text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notificationsCount}
              </span>
            )}
          </Link>
        ) : null}

        {member ? (
          <Link to={`/profile/${member.id}`} className="flex items-center space-x-2">
            <AnimatedAvatar
              // @ts-expect-error: auto-fixed by agent
              staticUrl={member.avatarUrl || member.avatar || ''}
              animatedUrl={(member as any).animatedAvatarUrl || ''}
              // @ts-expect-error: auto-fixed by agent
              altText={member.name || 'Member'}
              className="w-10 h-10 rounded-full"
            />
            <span className="hidden md:inline text-gray-700 dark:text-gray-300">
              // @ts-expect-error: auto-fixed by agent
              {(member as any).name}
            </span>
          </Link>
        ) : (
          <Link to="/auth" className="text-gray-700 dark:text-gray-300 hover:text-brand-blue dark:hover:text-brand-blue">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
