import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface Ad {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  targetUrl: string;
  placement: string;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  cost: number;
}

interface UseAdsResult {
  ads: Ad[];
  loading: boolean;
  error: string | null;
  refreshAds: () => void;
}

export const useAds = (): UseAdsResult => {
  const [ads, setAds] = React.useState<Ad[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAds = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.get<Ad[]>("/ads");
      if (response && response.data) {
        setAds(response.data);
      } else {
        setError("Failed to fetch ads.");
      }
    } catch (err) {
      setError("Failed to fetch ads.");
      console.error("Error fetching ads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  return {
    ads,
    loading,
    error,
    refreshAds: fetchAds
  };
};