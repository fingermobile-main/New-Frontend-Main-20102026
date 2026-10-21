import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export interface VideoRecommendation {
  id: string;
  title: string;
  thumbnailUrl: string;
  creatorName: string;
  views: number;
}

export interface DiscoveryData {
  personalized: VideoRecommendation[];
  trending: VideoRecommendation[];
}

export interface UseDancie4TvDiscoveryHook {
  discoveryData: DiscoveryData | undefined;
  loading: boolean;
  error: string | null;
  refreshDiscovery: () => void;
}

export const useDancie4TvDiscovery = (): UseDancie4TvDiscoveryHook => {
  const [discoveryData, setDiscoveryData] = useState<DiscoveryData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiscoveryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [trendRes, vidRes] = await Promise.all([
        apiService.get('/api/dancia/trending').catch(() => null),
        apiService.get('/api/dancia/videos').catch(() => null)
      ]);

      const tList = Array.isArray(trendRes) ? trendRes : (trendRes?.videos || trendRes?.data || []);
      const vList = Array.isArray(vidRes) ? vidRes : (vidRes?.videos || vidRes?.data || []);

      const mapItems = (items: any[]): VideoRecommendation[] =>
        items.map((v: any, idx: number) => ({
          id: String(v.videoID || v.id || idx + 1),
          title: v.title || 'Discovery Video',
          thumbnailUrl: v.thumbnailURL || v.thumbnail_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
          creatorName: v.uploaderID || v.creatorName || 'Dancia Star',
          views: v.views || v.engagementScore || (idx + 1) * 1400
        }));

      const trending = mapItems(tList.length > 0 ? tList : vList);
      const personalized = mapItems(vList.length > 0 ? vList : tList);

      setDiscoveryData({
        personalized: personalized.length > 0 ? personalized : [
          {
            id: 'disc-1',
            title: 'Afrobeats Rising Creators 2026',
            thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
            creatorName: 'Amara Kalu',
            views: 4890
          }
        ],
        trending: trending.length > 0 ? trending : [
          {
            id: 'disc-2',
            title: 'Johannesburg Amapiano Sessions',
            thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600',
            creatorName: 'DJ Maphorisa Club',
            views: 12400
          }
        ]
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch discovery data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiscoveryData();
  }, [fetchDiscoveryData]);

  const refreshDiscovery = useCallback(() => {
    fetchDiscoveryData();
  }, [fetchDiscoveryData]);

  return { discoveryData, loading, error, refreshDiscovery };
};
