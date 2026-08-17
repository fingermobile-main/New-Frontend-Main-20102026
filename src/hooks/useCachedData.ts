import React, { useState, useEffect } from 'react';
import dataCache from '../utils/dataCache';

interface UseCachedDataOptions {
  ttl?: number;
  skip?: boolean;
  initialData?: any;
}

interface UseCachedDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: (forceRefresh?: boolean) => Promise<T | null | undefined>;
  clearCache: () => void;
}

/**
 * Custom hook for fetching and caching data
 * @param {string} key - Unique key for the cache entry
 * @param {Function} fetchDataFn - Async function to fetch data
 * @param {Array} deps - Dependencies that should trigger a refetch
 * @param {Object} options - Configuration options
 * @returns {Object} Object containing data, loading state, error, and refetch function
 */
export const useCachedData = <T>(key: string,
  fetchDataFn: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseCachedDataOptions = {}
): UseCachedDataResult<T> => {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes default TTL
    skip = false,
    initialData = null
  } = options;

  const [data, setData] = React.useState<T | null>(initialData);
  const [loading, setLoading] = React.useState<boolean>(!skip && !dataCache.has(key));
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(
    async (forceRefresh = false) => {
      if (skip) return;

      try {
        setLoading(true);
        setError(null);

        // Check cache first unless force refresh
        if (!forceRefresh) {
          const cachedData = dataCache.get<T>(key);
          if (cachedData) {
            setData(cachedData);
            setLoading(false);
            return cachedData;
          }
        }

        // Fetch fresh data
        const result = await fetchDataFn();

        // Cache the result
        dataCache.set(key, result, ttl);

        setData(result);
        return result;
      } catch (err: any) {
        setError(err);
        console.error(`Error fetching data for key "${key}":`, err);
      } finally {
        setLoading(false);
      }
    },
    [key, ttl, skip, fetchDataFn],
  );

  // Initial fetch and fetch when deps change
  React.useEffect(() => {
    if (!skip) {
      fetchData();
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  // Function to manually refetch data
  const refetch = React.useCallback(
    (forceRefresh = true) => {
      return fetchData(forceRefresh);
    },
    [fetchData],
  );

  // Function to clear cache for this key
  const clearCache = React.useCallback(() => {
    dataCache.delete(key);
  }, [key]);

  return {
    data,
    loading,
    error,
    refetch,
    clearCache
  };
};

interface UsePaginatedCachedDataOptions extends UseCachedDataOptions {
  initialLimit?: number;
  initialOffset?: number;
}

interface UsePaginatedCachedDataResult<T> extends UseCachedDataResult<T[]> {
  loadMore: () => void;
  resetPagination: () => void;
  hasMore: boolean; limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  offset: number; setOffset: React.Dispatch<React.SetStateAction<number>>;
}

/**
 * Hook for paginated cached data
 * @param {string} baseKey - Base key for the cache entries
 * @param {Function} fetchDataFn - Async function to fetch data (should accept limit and offset)
 * @param {Object} options - Configuration options
 * @returns {Object} Object containing data, loading state, error, pagination functions
 */
export const usePaginatedCachedData = <T>(baseKey: string,
  fetchDataFn: (limit: number,
    offset: number
  ) => Promise<T[]>,
options: UsePaginatedCachedDataOptions = {},
): UsePaginatedCachedDataResult<T> => {
  const { ttl = 5 * 60 * 1000, initialLimit = 20, initialOffset = 0 } = options;

  const [limit, setLimit] = React.useState<number>(initialLimit);
  const [offset, setOffset] = React.useState<number>(initialOffset);
  const [hasMore, setHasMore] = React.useState<boolean>(true);

  const key = `${baseKey}_${limit}_${offset}`;

  const { data, loading, error, refetch, clearCache } = useCachedData<T[]>(
    key,
    () => fetchDataFn(limit, offset),
    [limit, offset],
    { ttl },
  );

  // Load more data
  const loadMore = React.useCallback(() => {
    if (hasMore && !loading) {
      setOffset((prev) => prev + limit);
    }
  }, [hasMore, loading, limit]);

  // Reset pagination
  const resetPagination = React.useCallback(() => {
    setOffset(initialOffset);
    setLimit(initialLimit);
    setHasMore(true);
    clearCache();
  }, [initialOffset, initialLimit, clearCache]);

  // Update hasMore based on returned data
  React.useEffect(() => {
    if (data && Array.isArray(data)) {
      setHasMore(data.length === limit);
    }
  }, [data, limit]);

  return {
    data,
    loading,
    error,
    refetch,
    loadMore,
    resetPagination,
    hasMore,
    limit,
    setLimit,
    offset,
    setOffset,
    clearCache
  };
};

export default useCachedData;