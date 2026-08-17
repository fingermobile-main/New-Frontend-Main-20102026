import React, {} from 'react';
import {
  CommunityPage,
  CommunityPageType,
  CommunityMember,
  CommunityPost,
  CommunityMembership,
  CommunityInvitation
} from '../types/communityPage';

// Mock data for demonstration
const mockCommunityPages: CommunityPage[] = [
  {id: "1",
  name: "Tech Enthusiasts Hallmarks",
  description:
      "A community for technology enthusiasts to share innovations and discuss trends",
  type: "hallmarks",
  ownerId: "member1",
  isPublic: true,
  rules: [
      "Be respectful to all members",
  "No spam or self-promotion",
  "Stay on topic",
  "No hate speech or harassment",
  "Follow community guidelines"
    ],
  memberCount: 1500000,
  maxMembers: 2500000,
  createdAt: new Date("2023-01-15"),
  updatedAt: new Date("2023-12-01"),
  imageUrl: "https://example.com/tech-hallmarks.jpg",
  subscriptionFee: {
  amount: 9.99,
  currency: "USD",
  interval: "monthly"
    },
monetization: {platformShare: 30,
  creatorShare: 50,
  marketplaceShare: 20
    },
statistics: {postsCount: 45000,
  likesCount: 1200000,
  commentsCount: 340000,
  sharesCount: 89000
    }
  },
  {id: "2",
  name: "Artists Gems",
  description:
      "A premium space for artists to showcase their work and connect",
  type: "gems",
  ownerId: "member2",
  isPublic: false,
  rules: [
      "Share only original artwork",
  "Provide constructive feedback",
  "Respect intellectual property",
  "No commercial promotions",
  "Maintain professional conduct"
    ],
  memberCount: 120000,
  maxMembers: 250000,
  createdAt: new Date("2023-03-22"),
  updatedAt: new Date("2023-11-30"),
  imageUrl: "https://example.com/artists-gems.jpg",
  subscriptionFee: {
  amount: 14.99,
  currency: "USD",
  interval: "monthly"
    },
monetization: {platformShare: 20,
  creatorShare: 70,
  marketplaceShare: 10
    },
statistics: {postsCount: 8900,
  likesCount: 340000,
  commentsCount: 78000,
  sharesCount: 24000
    }
  }
];

const mockCommunityMembers: CommunityMember[] = [
  {id: "1",
  memberId: "member1",
  pageId: "1",
  role: "admin",
  joinedAt: new Date("2023-01-15"),
  isActive: true
  },
  {id: "2",
  memberId: "member3",
  pageId: "1",
  role: "member",
  joinedAt: new Date("2023-02-20"),
  isActive: true
  }
];

const mockCommunityPosts: CommunityPost[] = [
  {id: "1",
  pageId: "1",
  authorId: "member1",
  content: "Check out this new technology trend!",
  createdAt: new Date("2023-12-01"),
  updatedAt: new Date("2023-12-01"),
  aspectRatio: "square",
  statistics: {
  likesCount: 24500,
  commentsCount: 1200,
  sharesCount: 3400
    }
  }
];

const mockCommunityMemberships: CommunityMembership[] = [
  {id: "1",
  memberId: "member3",
  pageId: "1",
  status: "active",
  joinedAt: new Date("2023-02-20")
  }
];

const mockCommunityInvitations: CommunityInvitation[] = [
  {id: "1",
  pageId: "2",
  invitedBy: "member2",
  maxUses: 50,
  usedCount: 24,
  createdAt: new Date("2023-11-01"),
  expiresAt: new Date("2023-12-31"),
  inviteLink: "https://fingermobile.com/invite/gems-xyz123"
  }
];

/**
 * Get all community pages with optional filtering by type
 */
export const getCommunityPages = async (
  type?: CommunityPageType,
): Promise<CommunityPage[]> => {
  if (type) {
    return mockCommunityPages.filter((page) => page.type === type);
  }
  return mockCommunityPages;
};

/**
 * Get a specific community page by ID
 */
export const getCommunityPageById = async (
  id: string,
): Promise<CommunityPage | undefined> => {
  return mockCommunityPages.find((page) => page.id === id);
};

/**
 * Create a new community page
 */
export const createCommunityPage = async (
  pageData: Omit<
    CommunityPage,
    "id" | "createdAt" | "updatedAt" | "memberCount" | "statistics"
  >,
): Promise<CommunityPage> => {
  const newPage: CommunityPage = {id: `page-${Date.now()}`,
    ...pageData,
memberCount: 1,
createdAt: new Date(),
updatedAt: new Date(),
statistics: {postsCount: 0,
  likesCount: 0,
  commentsCount: 0,
  sharesCount: 0
    }
  };
  mockCommunityPages.push(newPage);
  return newPage;
};

/**
 * Update a community page
 */
export const updateCommunityPage = async (
  id: string,
updates: Partial<CommunityPage>,
): Promise<CommunityPage | null> => {
  const pageIndex = mockCommunityPages.findIndex((page) => page.id === id);
  if (pageIndex === -1) return null;

  mockCommunityPages[pageIndex] = {
    ...mockCommunityPages[pageIndex],
    ...updates,
updatedAt: new Date()
  };
  return mockCommunityPages[pageIndex];
};

/**
 * Delete a community page
 */
export const deleteCommunityPage = async (
  id: string): Promise<boolean> => {
  const initialLength = mockCommunityPages.length;
  const filteredPages = mockCommunityPages.filter((page) => page.id !== id);

  if (filteredPages.length === initialLength) return false;

  mockCommunityPages.length = 0;
  mockCommunityPages.push(...filteredPages);
  return true;
};

/**
 * Get members of a community page
 */
export const getCommunityMembers = async (
  pageId: string,
): Promise<CommunityMember[]> => {
  return mockCommunityMembers.filter((member) => member.pageId === pageId);
};

/**
 * Add a member to a community page
 */
export const addCommunityMember = async (
  memberData: Omit<CommunityMember, "id" | "joinedAt">,
): Promise<CommunityMember> => {
  const newMember: CommunityMember = {id: `member-${Date.now()}`,
    ...memberData,
joinedAt: new Date()
  };
  mockCommunityMembers.push(newMember);
  return newMember;
};

/**
 * Remove a member from a community page
 */
export const removeCommunityMember = async (
  id: string): Promise<boolean> => {
  const initialLength = mockCommunityMembers.length;
  const filteredMembers = mockCommunityMembers.filter(
    (member) => member.id !== id,
  );

  if (filteredMembers.length === initialLength) return false;

  mockCommunityMembers.length = 0;
  mockCommunityMembers.push(...filteredMembers);
  return true;
};

/**
 * Get posts for a community page
 */
export const getCommunityPosts = async (
  pageId: string,
): Promise<CommunityPost[]> => {
  return mockCommunityPosts.filter((post) => post.pageId === pageId);
};

/**
 * Create a new post in a community page
 */
export const createCommunityPost = async (
  postData: Omit<
    CommunityPost,
    "id" | "createdAt" | "updatedAt" | "statistics"
  >,
): Promise<CommunityPost> => {
  const newPost: CommunityPost = {id: `post-${Date.now()}`,
    ...postData,
createdAt: new Date(),
updatedAt: new Date(),
statistics: {likesCount: 0,
  commentsCount: 0,
  sharesCount: 0
    }
  };
  mockCommunityPosts.push(newPost);
  return newPost;
};

/**
 * Get membership status for a member in a community page
 */
export const getMembershipStatus = async (
  memberId: string,
pageId: string,
): Promise<CommunityMembership | undefined> => {
  return mockCommunityMemberships.find(
    (membership) =>
      membership.memberId === memberId && membership.pageId === pageId,
  );
};

/**
 * Join a community page (for public pages)
 */
export const joinCommunityPage = async (
  memberId: string,
pageId: string,
): Promise<CommunityMembership> => {
  const newMembership: CommunityMembership = {id: `membership-${Date.now()}`,
    memberId,
    pageId,
status: "active",
joinedAt: new Date()
  };
  mockCommunityMemberships.push(newMembership);
  return newMembership;
};

/**
 * Request to join a private community page
 */
export const requestToJoinCommunityPage = async (
  memberId: string,
pageId: string,
): Promise<CommunityMembership> => {
  const newMembership: CommunityMembership = {id: `membership-${Date.now()}`,
    memberId,
    pageId,
status: "pending"
  };
  mockCommunityMemberships.push(newMembership);
  return newMembership;
};

/**
 * Create an invitation for a private community page
 */
export const createCommunityInvitation = async (
  invitationData: Omit<
    CommunityInvitation,
    "id" | "createdAt" | "inviteLink" | "usedCount"
  >,
): Promise<CommunityInvitation> => {
  const newInvitation: CommunityInvitation = {id: `invite-${Date.now()}`,
    ...invitationData,
createdAt: new Date(),
usedCount: 0,
inviteLink: `https://fingermobile.com/invite/${invitationData.pageId}-${Math.random().toString(36).substring(2, 10)}`
  };
  mockCommunityInvitations.push(newInvitation);
  return newInvitation;
};

/**
 * Get invitations for a community page
 */
export const getCommunityInvitations = async (
  pageId: string,
): Promise<CommunityInvitation[]> => {
  return mockCommunityInvitations.filter((invite) => invite.pageId === pageId);
};

/**
 * Get community page rules
 */
export const getCommunityRules = async (
  pageId: string): Promise<string[]> => {
  const page = mockCommunityPages.find((p) => p.id === pageId);
  return page?.rules || [];
};

/**
 * Update community page rules
 */
export const updateCommunityRules = async (
  pageId: string,
rules: string[],
): Promise<boolean> => {
  const page = mockCommunityPages.find((p) => p.id === pageId);
  if (!page) return false;

  page.rules = rules;
  page.updatedAt = new Date();
  return true;
};

export default {
  getCommunityPages,
  getCommunityPageById,
  createCommunityPage,
  updateCommunityPage,
  deleteCommunityPage,
  getCommunityMembers,
  addCommunityMember,
  removeCommunityMember,
  getCommunityPosts,
  createCommunityPost,
  getMembershipStatus,
  joinCommunityPage,
  requestToJoinCommunityPage,
  createCommunityInvitation,
  getCommunityInvitations,
  getCommunityRules,
  updateCommunityRules
};
