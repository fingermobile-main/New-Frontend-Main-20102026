import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface PostType {id: string;
  [key: string]: any;
}

interface UseHallmarksResult {hallmarks: PostType[]; loading: boolean;
  error: string | null;
  refreshData: () => void;
}

export const useHallmarks = (): UseHallmarksResult => {
  const [hallmarks, setHallmarks] = React.useState<PostType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchHallmarks = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.request<PostType[]>("/posts", {method: "GET",
  // @ts-ignore - params might not be in ApiRequestOptions but ApiService seems to handle it via baseURL construction if passed correctly params: { category: "hallmarks" }
      });
      if (response) {
        setHallmarks(response);
      } else {
        setError("Failed to fetch hallmarks.");
      }
    } catch (err) {
      setError("Failed to fetch hallmarks.");
      console.error("Error fetching hallmarks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHallmarks();
  }, [fetchHallmarks]);

  const refreshData = React.useCallback(() => {
    fetchHallmarks();
  }, [fetchHallmarks]);

  return { hallmarks, loading, error, refreshData };
};
