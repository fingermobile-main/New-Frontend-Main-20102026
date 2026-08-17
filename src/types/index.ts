export interface SubProfile {
  id: string; 
  memberId: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  type?: string;
  createdAt: string; 
  isDefault: boolean;
  blockedContentIds: string[];
  permissions?: string[];
  isKid?: boolean;
}

export interface User {
  id: string; 
  email: string;
  username: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  role?: string;
  isActive?: boolean;
  isSubscribed?: boolean;
  currentPlan?: string;
  isVerified?: boolean;
  verificationTier?: string;
  loyaltyTier?: string;
  loyaltyPoints?: number;
  following?: number | string[];
  followingIds?: string[];
  followers?: number;
  createdAt?: string;
  updatedAt?: string;
  subscriptionExpiryDate?: string | Date;
  permissions?: string[];
  subProfiles?: SubProfile[];
}

export interface SimpleAuthor {
  id: string;
  name?: string;
  username?: string;
  avatar?: string;
}

export interface Member {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  loyaltyTier: string;
  name?: string;
  membername?: string;
  handle?: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  isVerified?: boolean;
  followerCount?: number;
  isSubscribed?: boolean;
  bio?: string;
  location?: {
    country: string;
    region: string;
    city?: string;
  };
  preferences?: {
    interests?: string[];
    genres?: string[];
    values?: string[];
    notifications?: boolean;
    privacy?: 'public' | 'private';
  };
  lastActive?: string;
  engagementRate?: number;
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  profileViews?: number;
  postsCount?: number;
  bookmarks?: string[];
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

export interface SuggestedMember {
  id: string;
  memberId: string;
  member: Member;
  reason: string;
  score: number;
  lastInteractionDate?: string;
  relationshipType: string;
  isFollowing: boolean;
  mutualConnections: number;
  commonInterests: string[];
}

export interface DanciaMember {
  id: number; 
  email: string;
  name: string; 
  username: string;
  handle: string; 
  role: string;
  phoneVerified: boolean; 
  twoFactorEnabled: boolean;
  multiFactorEnabled: boolean;
  subscriptionPlanID?: string;
  avatar?: string;
}