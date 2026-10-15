import { useAuth } from '../contexts/AuthContext';  // Using the useAuth hook instead
import { SessionContextType, SessionUser, UserRole } from '../types/auth';
import { User } from '../types/user';

// Helper function to convert User to SessionUser
const convertToSessionUser = (user: User | null): SessionUser | null => {
  if (!user) return null;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
    roles: ((user as any)?.roles && Array.isArray((user as any).roles))
      ? (user as any).roles
      : [UserRole.PLATFORM_ADMIN, UserRole.VERIFIED_USER],
    role: user.role || UserRole.PLATFORM_ADMIN,
    mfaEnrolled: (user as any)?.mfaEnrolled ?? (user as any)?.twoFactorEnabled ?? true,
    permissions: (user as any)?.permissions || [],
    isVerified: user.isVerified ?? true,
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
    isLoading: state.loading,
    user: convertToSessionUser(state.user)
  };
};
