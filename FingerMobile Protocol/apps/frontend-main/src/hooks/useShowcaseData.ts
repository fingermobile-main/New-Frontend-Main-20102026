import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface ShowcaseItem {title: string;
  imageUrl: string;
  description?: string;
  prompt: string;
}

interface UseShowcaseDataResult {showcaseItems: ShowcaseItem[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

const useShowcaseData = (): UseShowcaseDataResult => {
  const [showcaseItems, setShowcaseItems] = React.useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchShowcaseData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.get('/showcase'); // Assuming an endpoint for showcase items
      if (response && typeof response.data !== 'undefined') {
        setShowcaseItems(response.data as ShowcaseItem[]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch showcase items.');
      console.error('Error fetching showcase items:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchShowcaseData();
  }, [fetchShowcaseData]);

  const refreshData = React.useCallback(() => {
    fetchShowcaseData();
  }, [fetchShowcaseData]);

  return { showcaseItems, loading, error, refreshData };
};

export default useShowcaseData;
