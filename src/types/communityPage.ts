export type CommunityPageType = 'hallmarks' | 'gems' | 'blogs' | 'groups';

export interface CommunityPage {id: string;
  name: string;
  description?: string;
  type: CommunityPageType;
  ownerId: string;
  isPublic: boolean;
  rules: string[]; // Array of 5 rules,
  memberCount: number;
  maxMembers: number;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  subscriptionFee?: {amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  };
  monetization: {platformShare: number; // Percentage,
  creatorShare: number; // Percentage,
  marketplaceShare: number; // Percentage
  };
  statistics: {postsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  };
}

export interface CommunityMember {id: string;
  memberId: string;
  pageId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  isActive: boolean;
}

export interface CommunityPost {id: string;
  pageId: string;
  authorId: string;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  statistics: { likesCount: number;
  commentsCount: number;
  sharesCount: number;
  };
  aspectRatio: 'square' | 'portrait';
}

export interface CommunityMembership {id: string;
  memberId: string;
  pageId: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  joinedAt?: Date;
  invitedAt?: Date;
  invitationId?: string;
}

export interface CommunityInvitation {id: string;
  pageId: string;
  invitedBy: string;
  maxUses: number;
  usedCount: number;
  createdAt: Date;
  expiresAt: Date;
  inviteLink: string;
}

export interface CommunityRule {id: string;
  pageId: string;
  ruleText: string;
  order: number;
}

export {};
