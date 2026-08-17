import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface LeaderboardEntry {
  id: string;
  membername: string;
  score: number;
  rank: number;
}

interface MemberStats {
  battlesPlayed: number;
  wins: number;
  losses: number;
  winRate: number;
}

interface AdvancedFingerWarData {
  ficBalance: number;
  leaderboard: LeaderboardEntry[];
  memberStats: MemberStats;
}

interface UseAdvancedFingerWarResult {
  data: AdvancedFingerWarData | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

export const useAdvancedFingerWar = (
  memberId: string | undefined,
): UseAdvancedFingerWarResult => {
  const [data, setData] = React.useState<AdvancedFingerWarData | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    if (!memberId) {
      setError("Member ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.get<AdvancedFingerWarData>(`/games/advanced-finger-war/${memberId}`);
      if (response && response.data) {
        setData(response.data);
      } else {
        setError("Failed to fetch advanced finger war data.");
      }
    } catch (err) {
      setError("Failed to fetch advanced finger war data.");
      console.error("Error fetching advanced finger war data:", err);
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refreshData: fetchData
  };
};