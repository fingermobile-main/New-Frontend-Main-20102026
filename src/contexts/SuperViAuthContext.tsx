import React, { useState, useEffect } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (token: string, user: unknown) => void;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

const SuperViAuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const SuperViAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = React.useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  React.useEffect(() => {
    // Check for stored auth state on initial load
    const storedAuth = localStorage.getItem('supervi-auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setAuthState(parsedAuth);
      } catch (error) {
        console.error('Error parsing stored auth state:', error);
      }
    }
  }, []);

  const login = (token: string, user: unknown) => {
    const newState = {
      isAuthenticated: true,
      user,
      token
    };
    setAuthState(newState);
    localStorage.setItem('supervi-auth', JSON.stringify(newState));
  };

  const logout = () => {
    const newState = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    setAuthState(newState);
    localStorage.removeItem('supervi-auth');
  };

  const register = async (userData: any) => {
    // Simulate registration process
    console.info('Registering user:', userData);
  };

  return (
    <SuperViAuthContext.Provider value={{ authState, login, logout, register }}>
      {children}
    </SuperViAuthContext.Provider>
  );
};

export const useSuperViAuth = () => {
  const context = React.useContext(SuperViAuthContext);
  if (context === undefined) {
    throw new Error('useSuperViAuth must be used within a SuperViAuthProvider');
  }
  return context;
};

// Export an empty object to satisfy the module requirement
export {};
