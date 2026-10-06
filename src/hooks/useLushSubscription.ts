import { useState, useEffect } from 'react';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // monthly price in cents
  features: string[];
  billingCycle: 'monthly' | 'yearly';
  discountPercentage?: number; // for yearly plans
}

interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  autoRenew: boolean;
  paymentMethod: string;
  nextBillingDate?: string;
}

interface SubscriptionTier {
  id: string;
  name: string;
  level: number; // 1 = basic, 2 = premium, 3 = elite, etc.
  benefits: string[];
}

export function useLushSubscription(userId: string) {
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [availableTiers, setAvailableTiers] = useState<SubscriptionTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load subscription plans
  const loadSubscriptionPlans = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/lushpressies/subscriptions/plans');
      // const data = await response.json();

      // Mock data for demonstration
      const mockPlans: SubscriptionPlan[] = [
        {
          id: 'basic',
          name: 'Radiate Basic',
          description: 'Essential features for connecting',
          price: 0, // Free tier
          features: [
            'Basic profile',
            'Limited swipes (10/day)',
            'Standard matching algorithm',
            'Basic customer support'
          ],
          billingCycle: 'monthly'
        },
        {
          id: 'premium',
          name: 'Radiate Premium',
          description: 'Enhanced experience with more features',
          price: 999, // $9.99/month
          features: [
            'Advanced profile',
            'Unlimited swipes',
            'Priority matching algorithm',
            'Enhanced privacy controls',
            'Ad-free experience',
            'Priority customer support'
          ],
          billingCycle: 'monthly'
        },
        {
          id: 'elite',
          name: 'Radiate Elite',
          description: 'Premium features with exclusive benefits',
          price: 2499, // $24.99/month
          features: [
            'VIP profile badge',
            'Unlimited swipes',
            'Smart matching algorithm',
            'Enhanced privacy controls',
            'Ad-free experience',
            'Exclusive events access',
            '24/7 VIP customer support',
            'Incognito mode',
            'Priority placement in queues'
          ],
          billingCycle: 'monthly'
        },
        {
          id: 'premium_yearly',
          name: 'Radiate Premium Annual',
          description: 'Save money with annual billing',
          price: 9990, // $99.90/year ($8.33/month)
          features: [
            'Advanced profile',
            'Unlimited swipes',
            'Priority matching algorithm',
            'Enhanced privacy controls',
            'Ad-free experience',
            'Priority customer support'
          ],
          billingCycle: 'yearly',
          discountPercentage: 17 // Save 17% vs monthly
        }
      ];

      setSubscriptionPlans(mockPlans);
    } catch (err) {
      setError('Failed to load subscription plans');
      console.error('Error loading subscription plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user subscription
  const loadUserSubscription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/subscriptions/user/${userId}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockUserSubscription: UserSubscription = {
        id: `sub_${Date.now()}`,
        userId,
        planId: 'premium',
        startDate: '2026-09-01',
        endDate: '2026-10-01',
        status: 'active',
        autoRenew: true,
        paymentMethod: 'card_ending_in_1234',
        nextBillingDate: '2026-10-01'
      };

      setUserSubscription(mockUserSubscription);
    } catch (err) {
      // User might not have a subscription
      setUserSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Load subscription tiers
  const loadSubscriptionTiers = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/lushpressies/subscriptions/tiers');
      // const data = await response.json();

      // Mock data for demonstration
      const mockTiers: SubscriptionTier[] = [
        {
          id: 'tier_basic',
          name: 'Basic',
          level: 1,
          benefits: [
            'Standard profile visibility',
            'Basic matching',
            'Limited privacy controls'
          ]
        },
        {
          id: 'tier_premium',
          name: 'Premium',
          level: 2,
          benefits: [
            'Enhanced profile visibility',
            'Priority matching',
            'Advanced privacy controls',
            'Ad-free experience'
          ]
        },
        {
          id: 'tier_elite',
          name: 'Elite',
          level: 3,
          benefits: [
            'VIP profile visibility',
            'Smart matching',
            'Maximum privacy controls',
            'Ad-free experience',
            'Exclusive features',
            'Priority support'
          ]
        },
        {
          id: 'tier_radiate_plus',
          name: 'Radiate++',
          level: 4,
          benefits: [
            'Top placement in queues',
            'Exclusive matching algorithm',
            'Ultimate privacy controls',
            'Ad-free experience',
            'Exclusive events',
            '24/7 VIP support',
            'Special badges and features'
          ]
        }
      ];

      setAvailableTiers(mockTiers);
    } catch (err) {
      setError('Failed to load subscription tiers');
      console.error('Error loading subscription tiers:', err);
    }
  };

  // Subscribe to a plan
  const subscribeToPlan = async (planId: string, paymentMethodId: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/lushpressies/subscriptions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, planId, paymentMethodId })
      // });
      // const data = await response.json();

      // Mock successful subscription
      const newSubscription: UserSubscription = {
        id: `sub_${Date.now()}`,
        userId,
        planId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        status: 'active',
        autoRenew: true,
        paymentMethod: paymentMethodId
      };

      setUserSubscription(newSubscription);
      return { success: true, subscription: newSubscription };
    } catch (err: any) {
      setError('Failed to subscribe to plan');
      console.error('Error subscribing to plan:', err);
      return { success: false, error: err?.message || 'Error subscribing' };
    }
  };

  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      if (userSubscription) {
        const cancelledSubscription = {
          ...userSubscription,
          status: 'cancelled' as const
        };

        setUserSubscription(cancelledSubscription);
        return { success: true, subscription: cancelledSubscription };
      }
    } catch (err: any) {
      setError('Failed to cancel subscription');
      console.error('Error cancelling subscription:', err);
      return { success: false, error: err?.message || 'Error cancelling' };
    }
  };

  // Renew subscription
  const renewSubscription = async () => {
    try {
      if (userSubscription) {
        const renewedSubscription = {
          ...userSubscription,
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active' as const
        };

        setUserSubscription(renewedSubscription);
        return { success: true, subscription: renewedSubscription };
      }
    } catch (err: any) {
      setError('Failed to renew subscription');
      console.error('Error renewing subscription:', err);
      return { success: false, error: err?.message || 'Error renewing' };
    }
  };

  // Upgrade subscription
  const upgradeSubscription = async (newPlanId: string) => {
    try {
      if (userSubscription) {
        const upgradedSubscription = {
          ...userSubscription,
          planId: newPlanId
        };

        setUserSubscription(upgradedSubscription);
        return { success: true, subscription: upgradedSubscription };
      }
    } catch (err: any) {
      setError('Failed to upgrade subscription');
      console.error('Error upgrading subscription:', err);
      return { success: false, error: err?.message || 'Error upgrading' };
    }
  };

  // Check if user has a specific subscription level
  const hasSubscriptionLevel = (level: number) => {
    if (!userSubscription || !availableTiers) return false;

    const userTier = availableTiers.find(tier => tier.id === userSubscription.planId);
    return userTier ? userTier.level >= level : false;
  };

  // Check if user has premium features
  const hasPremiumFeatures = () => {
    return hasSubscriptionLevel(2);
  };

  // Check if user has elite features
  const hasEliteFeatures = () => {
    return hasSubscriptionLevel(3);
  };

  // Check if user has Radiate++ features
  const hasRadiatePlusPlusFeatures = () => {
    return hasSubscriptionLevel(4);
  };

  // Initialize data
  useEffect(() => {
    if (userId) {
      loadSubscriptionPlans();
      loadUserSubscription();
      loadSubscriptionTiers();
    }
  }, [userId]);

  return {
    subscriptionPlans,
    userSubscription,
    availableTiers,
    isLoading,
    error,
    loadSubscriptionPlans,
    loadUserSubscription,
    loadSubscriptionTiers,
    subscribeToPlan,
    cancelSubscription,
    renewSubscription,
    upgradeSubscription,
    hasSubscriptionLevel,
    hasPremiumFeatures,
    hasEliteFeatures,
    hasRadiatePlusPlusFeatures
  };
}
