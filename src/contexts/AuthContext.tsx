import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, SubProfile } from '../types';

// Define mockUser for demonstration purposes
const mockUser = {
  id: 'mock-user-id',
  email: 'mock@example.com',
  username: 'mockuser',
  name: 'Mock User',
  avatar: '/images/mock-avatar.png',
  role: 'user',
  permissions: ['read', 'write'],
  isVerified: false,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  subProfiles: [{
    id: 'mock-subprofile-id',
    name: 'Mock Profile',
    avatar: '/images/mock-profile.png',
    memberId: 'mock-user-id',
    createdAt: new Date().toISOString(),
    isDefault: true,
    blockedContentIds: [],
    permissions: ['read'],
    isKid: false
  }],
  isSubscribed: false,
  loyaltyTier: 'bronze'
};

interface AuthContextType {
  user: User | null;
  member: User | null; // Adding member property for backward compatibility
  activeSubProfile: SubProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: { email: string; password: string; name: string }) => Promise<void>;
  switchActiveSubProfile: (subProfile: SubProfile) => void;
  addSubProfile: (subProfileData: Partial<SubProfile>) => void;
  hasPermission: (permission: string) => boolean; // Adding hasPermission method
  getToken: () => string | null; // Adding getToken method
  loading: boolean;
  mustChangePassword?: boolean; // Added based on error log
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [activeSubProfile, setActiveSubProfile] = useState<SubProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null); // Adding underscore to unused variable

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you would verify the token with the backend
      // For now, we'll just assume the user data is stored locally
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a base user object with all required properties
      const userData: User = {
        id: 'demo-user',
        email,
        username: email.split('@')[0],
        name: email.split('@')[0],
        avatar: '/placeholder-avatar.jpg',
        role: 'user',
        permissions: ['read', 'write'],
        isVerified: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subProfiles: [],
        isSubscribed: false,
        loyaltyTier: 'bronze'
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        username: userData.username,
        avatar: userData.avatar || '',
        role: userData.role || 'user',
        isVerified: userData.isVerified || false,
        isActive: userData.isActive || true,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
        permissions: userData.permissions || [],
        subProfiles: userData.subProfiles || [],
        isSubscribed: userData.isSubscribed || false,
        loyaltyTier: userData.loyaltyTier || 'bronze'
      };
      
      setUser(newUser);
      if (mockUser.subProfiles && mockUser.subProfiles[0]) {
        setActiveSubProfile(mockUser.subProfiles[0]);
        localStorage.setItem('activeSubProfile', JSON.stringify(mockUser.subProfiles[0]));
      }
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (err) {
      setError('Login failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Define a proper type for registration data
  interface RegistrationData {
    email: string;
    password: string;
    name: string;
    username?: string;
    avatar?: string;
    role?: string;
    isVerified?: boolean;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    permissions?: string[];
    // Add other properties as needed
  }

  const register = async (userData: RegistrationData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email: userData.email,
        username: userData.username || `user_${Date.now()}`,
        name: userData.name,
        avatar: userData.avatar || '',
        role: userData.role || 'user',
        isVerified: userData.isVerified || false,
        isActive: userData.isActive || true,
        createdAt: userData.createdAt || new Date().toISOString(),
        updatedAt: userData.updatedAt || new Date().toISOString(),
        permissions: userData.permissions || [],
        // Add other required properties
      };
      
      setUser(newUser);
      if (newUser.subProfiles && newUser.subProfiles[0]) {
        setActiveSubProfile(newUser.subProfiles[0]);
        localStorage.setItem('activeSubProfile', JSON.stringify(newUser.subProfiles[0]));
      }
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err) {
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('activeSubProfile');
    setUser(null);
    setActiveSubProfile(null);
  };

  const switchActiveSubProfile = (subProfile: SubProfile) => {
    setActiveSubProfile(subProfile);
    // Save the active sub-profile to local storage
    localStorage.setItem('activeSubProfile', JSON.stringify(subProfile));
  };

  const addSubProfile = (_subProfileData: Partial<SubProfile>) => {
    if (!user) return;

    const newSubProfile: SubProfile = {
      id: `sub_${Date.now()}`,
      name: _subProfileData.name || 'New Profile',
      avatar: _subProfileData.avatar || '',
      memberId: user.id,
      createdAt: new Date().toISOString(),
      isDefault: false,
      blockedContentIds: [],
      permissions: _subProfileData.permissions || [],
      isKid: _subProfileData.isKid || false
    };

    const updatedUser = {
      ...user,
      subProfiles: [...(user.subProfiles || []), newSubProfile]
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    // Simple permission check - in a real app, this would be more complex
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Get authentication token
  const getToken = (): string | null => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    if (!loading && user) {
      const savedSubProfile = localStorage.getItem('activeSubProfile');
      if (savedSubProfile) {
        try {
          const parsedSubProfile = JSON.parse(savedSubProfile);
          setActiveSubProfile(parsedSubProfile);
        } catch {
          // Silently handle parse errors - sub-profile will remain null
        }
      }
    }
  }, [user, loading]);

  return (
    <AuthContext.Provider
      value={{
        user,
        member: user, // Providing member property for backward compatibility
        activeSubProfile,
        login,
        logout,
        register,
        switchActiveSubProfile,
        addSubProfile,
        hasPermission, // Adding hasPermission method
        getToken, // Adding getToken method
        loading
      }}
    >
      {children}
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

export default AuthContext;