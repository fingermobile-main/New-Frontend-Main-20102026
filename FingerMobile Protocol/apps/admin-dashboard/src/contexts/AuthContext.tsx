/* oxlint-disable react/only-export-components */
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import type { User, LoginCredentials } from '../services/authService';
import AuthService from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    AuthService.initializeFromStorage();
    return AuthService.getCurrentUser() || null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(credentials);
      setUser(response.user);
      AuthService.setToken(response.token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token: AuthService.getToken(),
    isAuthenticated: AuthService.isAuthenticated(),
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};