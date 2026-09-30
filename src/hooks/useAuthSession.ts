import { useContext } from 'react';
import { useAuth } from '../contexts/AuthContext';  // Using the useAuth hook instead
import { SessionContextType, SessionUser } from '../types/auth';
import { User } from '../types/user';

// Helper function to convert User to SessionUser
const convertToSessionUser = (user: User | null): SessionUser | null => {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
    avatar: user.avatar,
    role: user.role,
    roles: [user.role as any], // Assuming role maps to a UserRole enum value
    mfaEnrolled: false, // Default value, adjust as needed
    permissions: [], // Default value, adjust as needed
    isVerified: user.isVerified,
    isActive: true, // Default value, adjust as needed
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    subProfiles: [],
    isSubscribed: false, // Default value, adjust as needed
    loyaltyTier: 'basic', // Default value, adjust as needed
  };
};

export const useAuthSession = (): SessionContextType => {
  const context = useAuth();  // Using the hook instead of useContext
  if (!context) {
    throw new Error('useAuthSession must be used within an AuthProvider');
  }

  // Extract only the SessionContextType properties from the context and convert user type
  const { state } = context;
  return {
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    user: convertToSessionUser(state.user)
  };
};
