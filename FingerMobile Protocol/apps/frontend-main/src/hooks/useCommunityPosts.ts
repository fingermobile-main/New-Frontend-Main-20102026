import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Post } from '../types';

interface UseCommunityPostsResult {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refreshPosts: () => void;
}

export const useCommunityPosts = (): UseCommunityPostsResult => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchPosts = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Post[]>('/posts', {
        params: {
          category: 'trends'
        }
      });
      if (response.data) {
        setPosts(response.data);
      }
    } catch (err) {
      setError('Failed to fetch community posts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const refreshPosts = React.useCallback(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refreshPosts };
};
