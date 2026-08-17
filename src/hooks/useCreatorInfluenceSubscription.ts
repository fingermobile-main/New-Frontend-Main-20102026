import React, { useState, useEffect, useCallback } from 'react';
import CreatorInfluenceSubscriptionService from '../services/creatorInfluenceSubscriptionService';

interface UseCreatorInfluenceSubscriptionProps {
  memberId: string;
}

// Define types for subscription and related data
interface Subscription {
  id: string;
  member_id: string;
  subscription_type: string;
  subscription_level: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  features_access: string[];
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

interface SubscriptionUsage {
  subscription_level: string;
  features_used: number;
  features_available: number;
  usage_percentage: number;
  days_remaining: number | null;
}

interface BillingHistoryItem {
  id: string;
  date: string;
  description?: string;
  level?: string;
  features?: string[];
  period?: {
  start: string;
  end: string;
  };
}

interface SubscriptionBenefits {
  level: string;
  name: string;
  monthlyPriceNaira: number;
  duration: string;
  features: string[];
  minFollowers: number;
  maxFollowers: number;
  feature_permissions: string[];
}

interface Recommendation {
  recommended_tier: string;
  tier_name: string;
  monthly_price_naira: number;
  features: string[];
  justification: {
  followers_count: number;
  engagement_rate: number;
  engagement_score: number;
  bandwidth_usage: number;
  monetization_earnings: number;
  recommended_reason: string;
  };
is_upgrade: boolean;
current_subscription: Subscription | null;
}

export const useCreatorInfluenceSubscription = ({ memberId }: UseCreatorInfluenceSubscriptionProps) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tiers, setTiers] = useState<Record<string, unknown>>({}); // Changed from 'any' to 'unknown' to satisfy ESLint
  const [recommendations, setRecommendations] = useState<Recommendation | null>(null);

  // Fetch current subscription
  const fetchCurrentSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const currentSub = await CreatorInfluenceSubscriptionService.getCurrentSubscription(memberId);
      setSubscription(currentSub);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription');
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  // Fetch all available tiers
  const fetchAllTiers = useCallback(async () => {
    try {
      const allTiers = await CreatorInfluenceSubscriptionService.getAllTiers();
      setTiers(allTiers);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscription tiers');
    }
  }, []);

  // Get recommendations based on user metrics
  const getRecommendations = useCallback(async (
  followers: number,
engagementRate: number,
    bandwidthUsage?: number,
    monetizationEarnings?: number
  ) => {
    try {
      setLoading(true);
      const recs: Recommendation = await CreatorInfluenceSubscriptionService.getRecommendations(
        memberId,
        followers,
        engagementRate,
        bandwidthUsage,
        monetizationEarnings
      );
      setRecommendations(recs);
      return recs;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations');
      return null;
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  // Create a new subscription
  const createSubscription = async (
  level: string, autoRenew = true) => {
    try {
      setLoading(true);
      const newSubscription = await CreatorInfluenceSubscriptionService.createSubscription({member_id: memberId,
  subscription_level: level,
  auto_renew: autoRenew
      });
      setSubscription(newSubscription);
      return newSubscription;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to create subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upgrade subscription
  const upgradeSubscription = async (
  newLevel: string) => {
    try {
      setLoading(true);
      const upgradedSubscription = await CreatorInfluenceSubscriptionService.upgradeSubscription(
        memberId,
        newLevel
      );
      setSubscription(upgradedSubscription);
      return upgradedSubscription;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to upgrade subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Downgrade subscription
  const downgradeSubscription = async (
  newLevel: string) => {
    try {
      setLoading(true);
      const downgradedSubscription = await CreatorInfluenceSubscriptionService.downgradeSubscription(
        memberId,
        newLevel
      );
      setSubscription(downgradedSubscription);
      return downgradedSubscription;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to downgrade subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancel subscription
  const cancelSubscription = async (reason?: string) => {
    if (!subscription?.id) {
      throw new Error('No active subscription to cancel');
    }
    
    try {
      setLoading(true);
      await CreatorInfluenceSubscriptionService.cancelSubscription(subscription.id, reason);
      setSubscription(null);
      return {success: true };
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Process payment
  const processPayment = async (
  data: {subscription_level: string;
  amount: number;
  payment_method: string;
    currency?: string;
    billing_details?: Record<string,
  unknown>;
  }) => {
    try {
      setLoading(true);
      const paymentResult = await CreatorInfluenceSubscriptionService.processPayment({
        ...data,
member_id: memberId
      });
      return paymentResult;
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get subscription benefits
  const getSubscriptionBenefits = async (
  level: string): Promise<SubscriptionBenefits> => {
    try {
      return await CreatorInfluenceSubscriptionService.getSubscriptionBenefits(level);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to get subscription benefits');
      throw err;
    }
  };

  // Get subscription usage
  const getSubscriptionUsage = async (): Promise<SubscriptionUsage> => {
    try {
      return await CreatorInfluenceSubscriptionService.getSubscriptionUsage(memberId);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to get subscription usage');
      throw err;
    }
  };

  // Get billing history
  const getBillingHistory = async (): Promise<BillingHistoryItem[]> => {
    try {
      const response: Record<string, unknown>[] = await CreatorInfluenceSubscriptionService.getBillingHistory(memberId);
      // Since the API returns Record<string, unknown>[], we need to properly handle the conversion
      // We'll cast to unknown first, then to BillingHistoryItem[]
      return response as unknown as BillingHistoryItem[];
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Failed to get billing history');
      throw err;
    }
  };

  useEffect(() => {
    if (memberId) {
      fetchCurrentSubscription();
      fetchAllTiers();
    }
  }, [memberId, fetchCurrentSubscription, fetchAllTiers]);

  return {
    subscription,
    loading,
    error,
    tiers,
    recommendations,
    fetchCurrentSubscription,
    getRecommendations,
    createSubscription,
    upgradeSubscription,
    downgradeSubscription,
    cancelSubscription,
    processPayment,
    getSubscriptionBenefits,
    getSubscriptionUsage,
    getBillingHistory
  };
};