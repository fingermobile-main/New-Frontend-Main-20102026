import { useState, useEffect } from 'react';

interface Trend {
  id: string;
  tag: string;
  topic?: string;
  posts: string;
  change: string;
  engagement?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  avatar?: string;
  user?: string;
  username?: string;
  time?: string;
  content?: string;
}

interface UseTrendsReturn {
  trends: Trend[];
  loading: boolean;
}

export const useTrends = (type: string): UseTrendsReturn => {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockTrends: Trend[] = [
        // Add mock data based on type if needed
      ];
      setTrends(mockTrends);
      setLoading(false);
    }, 500);
  }, [type]);

  return { trends, loading };
};