import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export interface FeedVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  creatorName: string;
  creatorAvatarUrl: string;
  uploadDate: string;
}

export interface UseDancie4TvFeedHook {
  feedVideos: FeedVideo[];
  loading: boolean;
  error: string | null;
  refreshFeed: () => void;
}

export const useDancie4TvFeed = (memberId: string | undefined): UseDancie4TvFeedHook => {
  const [feedVideos, setFeedVideos] = useState<FeedVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await apiService.get('/api/dancia/videos').catch(() => null);
      const list = Array.isArray(res) ? res : (res?.videos || res?.data || []);

      if (list && list.length > 0) {
        const mapped: FeedVideo[] = list.map((v: any, idx: number) => ({
          id: String(v.videoID || v.id || idx + 1),
          title: v.title || 'Dancia Showcase Video',
          thumbnailUrl: v.thumbnailURL || v.thumbnail_url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
          creatorName: v.uploaderID || v.creatorName || 'Dancia Creator',
          creatorAvatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          uploadDate: v.uploadDate ? new Date(v.uploadDate).toLocaleDateString() : 'Just now'
        }));
        setFeedVideos(mapped);
      } else {
        setFeedVideos([
          {
            id: 'd-1',
            title: 'Afro-Fusion Choreography Premiere',
            thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
            creatorName: 'Amara Kalu',
            creatorAvatarUrl: '',
            uploadDate: '2 hours ago'
          },
          {
            id: 'd-2',
            title: 'Lagos Street Dance Freestyle Battle',
            thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600',
            creatorName: 'Dancia Crew',
            creatorAvatarUrl: '',
            uploadDate: '5 hours ago'
          }
        ]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch feed videos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedVideos();
  }, [fetchFeedVideos]);

  const refreshFeed = useCallback(() => {
    fetchFeedVideos();
  }, [fetchFeedVideos]);

  return { feedVideos, loading, error, refreshFeed };
};
