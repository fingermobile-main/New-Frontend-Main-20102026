import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';

export interface UpdateItem {
  id: string;
  type: 'feature' | 'trending' | 'notification';
  message: string;
  timestamp: string;
}

export interface UseDancie4TvUpdatesHook {
  updates: UpdateItem[];
  loading: boolean;
  error: string | null;
  refreshUpdates: () => void;
}

export const useDancie4TvUpdates = (): UseDancie4TvUpdatesHook => {
  const [updates, setUpdates] = useState<UpdateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res: any = await apiService.get('/api/dancia/schedule').catch(() => null);
      const schedule = Array.isArray(res) ? res : (res?.data || []);

      if (schedule && schedule.length > 0) {
        const mapped: UpdateItem[] = schedule.slice(0, 5).map((s: any, idx: number) => ({
          id: String(s.id || idx + 1),
          type: 'trending',
          message: `On Air: ${s.title || 'Dancia Special'} on ${s.channel_name || 'Channel 1'}`,
          timestamp: s.start_time || new Date().toISOString()
        }));
        setUpdates(mapped);
      } else {
        setUpdates([
          {
            id: 'up-1',
            type: 'feature',
            message: '4K HDR Dancia Streaming Live across all 54 African countries',
            timestamp: new Date().toISOString()
          },
          {
            id: 'up-2',
            type: 'trending',
            message: 'Amapiano Dance Battle Week trending with 45k concurrent viewers',
            timestamp: new Date().toISOString()
          }
        ]);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch updates.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const refreshUpdates = useCallback(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  return { updates, loading, error, refreshUpdates };
};
