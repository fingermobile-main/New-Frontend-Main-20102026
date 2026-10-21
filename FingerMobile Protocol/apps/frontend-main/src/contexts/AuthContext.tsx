import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';
import UserService from '../services/UserService';
import userProfileSyncService from '../services/UserProfileSyncService';

interface AuthContextType {
  user: User | null;
  member: User | null;
  setUser: (_user: User | null) => void;
  loading: boolean;
  isLoading: boolean;
  error: string | null;
  isOnboarded: boolean;
  state: {
    user: User | null;
    isAuthenticated: boolean;
    isOnboarded: boolean;
    loading: boolean;
    error: string | null;
  };
  login: (_email: string, _password: string) => Promise<boolean>;
  logout: () => void;
  register: (_userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
  }) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  clearAuthData: () => void;
}

export const checkIsOnboarded = (user: User | null): boolean => {
  if (!user) return false;
  const isComplete = Boolean(user.onboardingComplete || (user as any).onboarding_completed);
  const hasLocalFlag = typeof window !== 'undefined' && 
    (localStorage.getItem('onboardingComplete') === 'true' || localStorage.getItem('hasCompletedOnboarding') === 'true');
  return isComplete && hasLocalFlag;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (_e) {
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // First check localStorage for tokens
        const accessToken = localStorage.getItem('accessToken') ||
                          localStorage.getItem('fingermobile_token') ||
                          localStorage.getItem('token');

        if (accessToken) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (_err) {
              setUser(null);
            }
          }
          // Verify token and get user info
          try {
            const result = await UserService.getCurrentUser();
            if (result && result.success && result.data) {
              setUser(result.data);
            }
          } catch (_e) {
            // Keep localStorage user in dev or offline
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error checking auth status:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const clearAuthData = () => {
    // Remove tokens and authentication keys from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('fingermobile_token');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingComplete');
    localStorage.removeItem('hasCompletedOnboarding');
    localStorage.removeItem('fmp_member_profile');
    localStorage.removeItem('fmp_comprehensive_profile');
    try {
      userProfileSyncService.clearProfile();
    } catch (_e) {
      // Ignore cleanup error
    }
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const result = await UserService.login({ email, password });

      if (result.success && result.data) {
        const { user, accessToken, refreshToken } = result.data;

        // Store tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        setUser(user);
        setError(null);
        return true;
      } else {
        setError(result.error || 'Login failed');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string
  }) => {
    try {
      setLoading(true);
      setError(null);

      const result = await UserService.register(userData);

      if (result.success && result.data) {
        // For registration, the API only returns the user object, not tokens
        // We'll need to login after registration to get tokens
        const loginResult = await UserService.login({
          username: userData.username,
          password: userData.password
        });

        if (loginResult.success && loginResult.data) {
          const { user, accessToken, refreshToken } = loginResult.data;

          // Store tokens in localStorage
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);

          setUser(user);
          setError(null);
          return true;
        } else {
          setError(loginResult.error || 'Login after registration failed');
          return false;
        }
      } else {
        setError(result.error || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const result = await UserService.refreshToken(refreshToken);

      if (result.success && result.data) {
        const { accessToken, refreshToken: newRefreshToken } = result.data;

        // Update tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update user data if available
        if (result.data.user) {
          setUser(result.data.user);
        }

        return true;
      } else {
        // If refresh fails, logout user
        logout();
        return false;
      }
    } catch (error) {
      // On error, logout user
      logout();
      return false;
    }
  };

  const isOnboarded = checkIsOnboarded(user);

  const value = {
    user,
    member: user,
    setUser,
    loading,
    isLoading: loading,
    error,
    isOnboarded,
    state: {
      user,
      isAuthenticated: !!user,
      isOnboarded,
      loading,
      error
    },
    login,
    logout,
    register,
    refreshToken,
    clearAuthData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export default for the provider component
export default AuthProvider;
