import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface VideoRecommendation {id: string;
  title: string;
  thumbnailUrl: string;
  creatorName: string;
  views: number;
}

interface DiscoveryData {personalized: VideoRecommendation[];
  trending: VideoRecommendation[];
}

interface UseDancie4TvDiscoveryHook {discoveryData: DiscoveryData | undefined;
  loading: boolean;
  error: string | null;
  refreshDiscovery: () => void;
}

export const useDancie4TvDiscovery = (): UseDancie4TvDiscoveryHook => {
  const [discoveryData, setDiscoveryData] = React.useState<DiscoveryData | undefined>(
    undefined,
  );
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDiscoveryData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using axios API - response has .data property
      const response = await ApiService.get("/dancie4tv/discovery");
      if (response && typeof response.data !== 'undefined') {
        setDiscoveryData(response.data as DiscoveryData);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch discovery data.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchDiscoveryData();
  }, []);

  const refreshDiscovery = () => {
    fetchDiscoveryData();
  };

  return { discoveryData, loading, error, refreshDiscovery };
};