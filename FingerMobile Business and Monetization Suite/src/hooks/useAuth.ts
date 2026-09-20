import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

// Mock authentication service
const authService = {
  login: async (_email: string, _password: string): Promise<User> => { // Marking parameters as unused with underscore
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          email: _email,
          role: 'user',
          name: 'Demo User'
        });
      }, 500);
    });
  },
  
  register: async (_email: string, _password: string): Promise<User> => { // Marking parameters as unused with underscore
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '2',
          email: _email,
          role: 'user',
          name: 'New User'
        });
      }, 500);
    });
  },
  
  logout: (): void => {
    // Clear any stored auth data
    localStorage.removeItem('authToken');
  },
  
  getCurrentUser: (): User | null => {
    // In a real app, this would decode the token to get user info
    const token = localStorage.getItem('authToken');
    if (token) {
      return {
        id: '1',
        email: 'demo@example.com',
        role: 'user',
        name: 'Demo User'
      };
    }
    return null;
  }
};

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', 'mock-token'); // In a real app, store the actual token
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.register(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', 'mock-token'); // In a real app, store the actual token
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    authService.logout();
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    register
  };
};