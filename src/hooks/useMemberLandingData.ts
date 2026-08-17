import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Post as PostType } from '../types';

interface MemberLandingData {walletBalance: number;
  notificationsCount: number;
  groupsCount: number;
  postsCount: number;
  forumCategories: any[];
}

interface UseMemberLandingDataResult {data: MemberLandingData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

export const useMemberLandingData = (memberId: string | undefined,
): UseMemberLandingDataResult => {
  const [data, setData] = React.useState<MemberLandingData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchMemberLandingData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        walletResponse,
        notificationsResponse,
        groupsResponse,
        postsResponse,
        forumCategoriesResponse
      ] = await Promise.all([
        api.get(`/members/${memberId}/wallet-balance`),
        api.get(`/members/${memberId}/notifications/count`),
        api.get(`/members/${memberId}/groups/count`),
        api.get(`/members/${memberId}/posts/count`),
        api.get("/forum/categories")
      ]);

      setData({walletBalance: walletResponse.data?.balance || 0,
  notificationsCount: notificationsResponse.data?.count || 0,
  groupsCount: groupsResponse.data?.count || 0,
  postsCount: postsResponse.data?.count || 0,
  forumCategories: forumCategoriesResponse.data || []
      });
    } catch (err) {
      setError("Failed to fetch member landing data.");
      console.error("Error fetching member landing data:", err);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  React.useEffect(() => {
    if (memberId) {
      fetchMemberLandingData();
    }
  }, [memberId, fetchMemberLandingData]);

  const refreshData = React.useCallback(() => {
    if (memberId) {
      fetchMemberLandingData();
    }
  }, [memberId, fetchMemberLandingData]);

  return { data, loading, error, refreshData };
};
