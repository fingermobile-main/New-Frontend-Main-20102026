import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface FeedVideo {id: string;
  title: string;
  thumbnailUrl: string;
  creatorName: string;
  creatorAvatarUrl: string;
  uploadDate: string;
}

interface UseDancie4TvFeedHook {feedVideos: FeedVideo[];
  loading: boolean;
  error: string | null;
  refreshFeed: () => void;
}

export const useDancie4TvFeed = (memberId: string | undefined,
): UseDancie4TvFeedHook => {
  const [feedVideos, setFeedVideos] = React.useState<FeedVideo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchFeedVideos = React.useCallback(async () => {
    if (!memberId) {
      setLoading(false);
      setFeedVideos([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Simulate API call to fetch feed videos for the member
      const response = await ApiService.request<FeedVideo[]>(
        `/dancie4tv/feed?memberId=${memberId}`,
        {method: "GET"
        },
      );
      if (response && response.length > 0) {
        setFeedVideos(response);
      } else {
        setError("Failed to fetch feed videos.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch feed videos.");
    } finally {
      setLoading(false);
    }
  }, [memberId, setLoading, setFeedVideos, setError]);

  React.useEffect(() => {
    fetchFeedVideos();
  }, [fetchFeedVideos]);

  const refreshFeed = React.useCallback(() => {
    fetchFeedVideos();
  }, [fetchFeedVideos]);

  return { feedVideos, loading, error, refreshFeed };
};
