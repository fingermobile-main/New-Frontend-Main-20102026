import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type {
  CommunityPage,
  CommunityPost,
  CommunityMember
} from '../types/communityPage';

// --- Extended & Enhanced Domain Typing Interfaces ---

export interface CommunityPageTierLogistics {
  isPremiumGated: boolean;
  subscriptionPrice?: number;
  currency?: string;
  creatorEarningsSplit?: number; // Ratio e.g., 85 for 85%
}

export interface SecurityAccessMetadata {
  userRole: "owner" | "moderator" | "premium_member" | "free_member" | "guest";
  canPost: boolean;
  canModerate: boolean;
  isBanGated: boolean;
}

export interface UseCommunityPageDataResult {
  pageData: CommunityPage & { monetization?: CommunityPageTierLogistics } | null;
  posts: CommunityPost[];
  members: CommunityMember[];
  accessControl: SecurityAccessMetadata;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  interactWithPost: (postId: string, action: "like" | "share") => Promise<boolean>;
  processMemberTierUpsell: (targetTierId: string) => Promise<{ success: boolean; gatewayUrl?: string }>;
}

// --- Hook Implementation ---

export const useCommunityPageData = (
  pageType: string,
  pageId: string
): UseCommunityPageDataResult => {
  const [pageData, setPageData] = React.useState<(CommunityPage & { monetization?: CommunityPageTierLogistics }) | null>(null);
  const [posts, setPosts] = React.useState<CommunityPost[]>([]);
  const [members, setMembers] = React.useState<CommunityMember[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Dynamic Access Boundary Matrix Initialization
  const [accessControl, setAccessControl] = React.useState<SecurityAccessMetadata>({
    userRole: "guest",
    canPost: false,
    canModerate: false,
    isBanGated: false
  });

  /**
   * Concurrency-Optimized Aggregation Strategy
   * Displaces sequential waterfall requests with simultaneous execution via Promise.allSettled
   */
  const fetchCommunityPageData = React.useCallback(async () => {
    if (!pageId || !pageType) return;
    
    setLoading(true);
    setError(null);

    try {
      const endpoints = [
        ApiService.request<CommunityPage>(`/community/${pageType}/${pageId}`, { method: "GET" }),
        ApiService.request<CommunityPost[]>(`/community/${pageType}/${pageId}/posts`, { method: "GET" }),
        ApiService.request<CommunityMember[]>(`/community/${pageType}/${pageId}/members`, { method: "GET" })
      ];

      const [pageResult, postsResult, membersResult] = await Promise.allSettled(endpoints);

      // 1. Process Core Page Aggregations
      if (pageResult.status === 'fulfilled' && pageResult.value) {
        setPageData(pageResult.value as CommunityPage & { monetization?: CommunityPageTierLogistics });
        
        // Dynamically compute access matrix control layout flags safely from network session details
        const meta = (pageResult.value as any).viewerMeta || {};
        setAccessControl({
          userRole: meta.role || "guest",
          canPost: meta.canPost || false,
          canModerate: meta.canModerate || false,
          isBanGated: meta.isBanned || false
        });
      } else {
        console.error("Critical: Page layout extraction failure.", pageResult.status === 'rejected' ? pageResult.reason : 'Empty result');
        setError("Failed to extract structural community page layout context.");
      }

      // 2. Process Post Context Hydration
      if (postsResult.status === 'fulfilled' && postsResult.value) {
        // Algorithmic Filter: Order pinned posts first, then sort chronologically
        const structuredPosts = [...(postsResult.value as CommunityPost[])].sort((a: any, b: any) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        setPosts(structuredPosts);
      }

      // 3. Process Live Membership Directories
      if (membersResult.status === 'fulfilled' && membersResult.value) {
        setMembers(membersResult.value as CommunityMember[]);
      }

    } catch (globalErr) {
      setError("An unexpected ecosystem pipeline failure occurred.");
      console.error("Synchronized network lifecycle error:", globalErr);
    } finally {
      setLoading(false);
    }
  }, [pageType, pageId]);

  // Hook Initialization & Lifecycle Bindings
  React.useEffect(() => {
    fetchCommunityPageData();
  }, [fetchCommunityPageData]);

  const refreshData = React.useCallback(() => {
    fetchCommunityPageData();
  }, [fetchCommunityPageData]);

  /**
   * Optimistic interaction handler for updating dynamic engagement analytics metrics
   */
  const interactWithPost = React.useCallback(async (postId: string, action: "like" | "share"): Promise<boolean> => {
    // Basic structural authorization guard pattern
    if (accessControl.isBanGated) return false;

    // Local state adjustment simulation for instant UI feedback
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        const adjustment = action === "like" ? 1 : 0; // Increment dynamically
        return {
          ...post,
          likes: (post as any).likes + adjustment
        };
      })
    );

    try {
      await ApiService.request(`/community/posts/${postId}/${action}`, { method: "POST" });
      return true;
    } catch (err) {
      console.error(`Failed to register action: ${action} for object id context ${postId}:`, err);
      return false; // Soft failure handling configuration
    }
  }, [accessControl]);

  /**
   * Premium Financial Monetization Node: Processes secure monetization upsells for gated communities
   */
  const processMemberTierUpsell = React.useCallback(async (targetTierId: string): Promise<{ success: boolean; gatewayUrl?: string }> => {
    try {
      const response = await ApiService.request<{ success: boolean; gatewayUrl?: string }>(
        `/community/${pageId}/subscribe`,
        {
          method: "POST",
          body: JSON.stringify({ tierId: targetTierId })
        }
      );
      if (response?.success && response.gatewayUrl) {
        return { success: true, gatewayUrl: response.gatewayUrl };
      }
      return { success: false };
    } catch (err) {
      console.error("Financial tier billing gateway setup error:", err);
      return { success: false };
    }
  }, [pageId]);

  return {
    pageData,
    posts,
    members,
    accessControl,
    loading,
    error,
    refreshData,
    interactWithPost,
    processMemberTierUpsell
  };
};