import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface UpdateItem {id: string; type: "feature" | "trending" | "notification";
  message: string; timestamp: string;
}

interface UseDancie4TvUpdatesHook {
  updates: UpdateItem[]; loading: boolean; error: string | null; refreshUpdates: () => void;
}

export const useDancie4TvUpdates = (): UseDancie4TvUpdatesHook => {
  const [updates, setUpdates] = React.useState<UpdateItem[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUpdates = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call to fetch updates
      const response = await ApiService.get<UpdateItem[]>("/dancie4tv/updates");
      setUpdates(response.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch updates.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUpdates();
  }, []);

  const refreshUpdates = () => {
    fetchUpdates();
  };

  return { updates, loading, error, refreshUpdates };
};
