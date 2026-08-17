import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAppContext } from "../contexts/AppContext";

interface FingerShort {
  id: string; type: "image" | "video" | "text"; content: string;
  duration?: string;
  views: number; timestamp: string; isPrivate: boolean; isSpoiler: boolean; author: {
  name: string; avatar: string; isVerified: boolean;
  };
}

interface FingerShortsData {
  forYou: FingerShort[]; following: FingerShort[]; trending: FingerShort[];
}

export const useFingerShorts = () => {
  const { showToast } = useAppContext();
  const [data, setData] = React.useState<FingerShortsData>({forYou: [], following: [], trending: []
  });
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchFingerShorts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const forYouResponse = await api.get<FingerShort[]>("/fingershorts/for-you");
      const followingResponse = await api.get<FingerShort[]>("/fingershorts/following");
      const trendingResponse = await api.get<FingerShort[]>("/fingershorts/trending");

      setData({forYou: forYouResponse.data || [], following: followingResponse.data || [], trending: trendingResponse.data || []
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch FingerShorts data";
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  React.useEffect(() => {
    fetchFingerShorts();
  }, [fetchFingerShorts]);

  const refreshData = React.useCallback(() => {
    fetchFingerShorts();
  }, [fetchFingerShorts]);

  return {
    data,
    loading,
    error,
    refreshData
  };
};
