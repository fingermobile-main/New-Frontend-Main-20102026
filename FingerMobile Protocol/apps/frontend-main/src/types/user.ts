export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  role: string;
  isVerified: boolean;
  isOnline: boolean;
  onboardingComplete?: boolean;
  createdAt: string;
  updatedAt: string;
  twoFactorEnabled?: boolean;
  twoFactorMethod?: string;
  lastSeenAt?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  badges?: string[];
  location?: string;
  website?: string;
  birthDate?: string;
  privacySettings?: {
    profileVisibility: 'public' | 'friends' | 'private';
    messagePrivacy: 'everyone' | 'friends' | 'none';
    emailVisibility: 'public' | 'friends' | 'private';
  };
  notificationSettings?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
}
