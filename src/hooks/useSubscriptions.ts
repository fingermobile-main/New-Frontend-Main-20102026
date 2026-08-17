import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface Subscription {id: number;
  name: string;
  creator: string;
  price: number;
  currency: string;
  renewalDate: string;
  status: string;
  features: string[];
  image: string;
}

interface UseSubscriptionsResult {subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

export const useSubscriptions = (): UseSubscriptionsResult => {
  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSubscriptions = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.get("/subscriptions"); // Adjust endpoint as needed
      if (response && typeof response.data !== 'undefined') {
        setSubscriptions(response.data as Subscription[]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch subscriptions.");
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const refreshData = () => {
    fetchSubscriptions();
  };

  return { subscriptions, loading, error, refreshData };
};