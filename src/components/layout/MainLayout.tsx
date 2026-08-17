import { useNavigate, useLocation } from 'react-router-dom';
import React, {} from 'react';

import TopHeaderNavigation from '../TopHeaderNavigation';
import { useAppContext } from "contexts/AppContext";  // Using absolute path from src
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import CookieConsentBanner from '../CookieConsentBanner';

interface MainLayoutProps {
  children?: React.ReactNode;
  pageTitle?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, pageTitle }) => {
  const { isLoading, member, activeSubProfile } = useAppContext();
  const { loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen" style={{ backgroundColor: '#F8FFFD' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FFFD' }}>
      <TopHeaderNavigation />
      <main className="flex-grow">
        {children}
      </main>
      <CookieConsentBanner />
    </div>
  );
};

export default MainLayout;