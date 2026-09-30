export enum UserRole {
  GUEST = 'GUEST',
  VERIFIED_USER = 'VERIFIED_USER',
  CREATOR = 'CREATOR',
  MERCHANT = 'MERCHANT',
  MODERATOR = 'MODERATOR',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  SYSTEM_ENGINEER = 'SYSTEM_ENGINEER',
}

export interface SessionUser {
  id: string;
  username: string;
  roles: UserRole[];
  mfaEnrolled: boolean;
  email?: string;
  name?: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  subProfiles?: unknown[];
  isSubscribed?: boolean;
  loyaltyTier?: string;
}

export interface SessionContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: SessionUser | null;
}
