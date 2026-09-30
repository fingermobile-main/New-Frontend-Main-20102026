import React, { useState, createContext, useContext, ReactNode } from 'react';
interface AppContextType {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  language: string;
  sidebarCollapsed: boolean;
  toggleTheme: () => void;
  toggleNotifications: () => void;
  changeLanguage: (lang: string) => void;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface BaseAppProviderProps {
  children: ReactNode;
}

const BaseAppProvider: React.FC<BaseAppProviderProps> = ({ children }) => {
  const [state, setState] = React.useState<AppContextType>({
    theme: 'light',
    notificationsEnabled: true,
    language: 'en',
    sidebarCollapsed: false,
    toggleTheme: () => {},
    toggleNotifications: () => {},
    changeLanguage: () => {},
    toggleSidebar: () => {}
  });

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const toggleNotifications = () => {
    setState(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
  };

  const changeLanguage = (lang: string) => {
    setState(prev => ({ ...prev, language: lang }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  };

  const value: AppContextType = {
    theme: state.theme,
    notificationsEnabled: state.notificationsEnabled,
    language: state.language,
    sidebarCollapsed: state.sidebarCollapsed,
    toggleTheme,
    toggleNotifications,
    changeLanguage,
    toggleSidebar
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export { BaseAppProvider as AppProvider };

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
