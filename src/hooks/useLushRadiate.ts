import { useState, useEffect } from 'react';

interface RadiateFeature {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  activationDate?: string;
  expirationDate?: string;
  cost: number; // in credits
}

interface RadiateCredit {
  id: string;
  amount: number;
  type: 'purchase' | 'reward' | 'gift' | 'refund';
  date: string;
  description: string;
}

interface RadiateStatus {
  credits: number;
  activeFeatures: RadiateFeature[];
  totalSpent: number;
  lastActive: string;
}

export function useLushRadiate(userId: string) {
  const [radiateStatus, setRadiateStatus] = useState<RadiateStatus | null>(null);
  const [availableFeatures, setAvailableFeatures] = useState<RadiateFeature[]>([]);
  const [creditHistory, setCreditHistory] = useState<RadiateCredit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load radiate status
  const loadRadiateStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/radiate/status/${userId}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockStatus: RadiateStatus = {
        credits: 1250,
        activeFeatures: [
          {
            id: 'feature_boost_1',
            name: 'Profile Boost',
            description: 'Increase visibility for 24 hours',
            isActive: true,
            activationDate: '2026-10-03T14:30:00Z',
            expirationDate: '2026-10-04T14:30:00Z',
            cost: 100
          },
          {
            id: 'feature_incognito_1',
            name: 'Incognito Mode',
            description: 'Browse without appearing in queues',
            isActive: true,
            activationDate: '2026-10-01T09:00:00Z',
            expirationDate: '2026-10-08T09:00:00Z',
            cost: 50
          }
        ],
        totalSpent: 850,
        lastActive: '2026-10-04T09:30:00Z'
      };

      setRadiateStatus(mockStatus);
    } catch (err) {
      setError('Failed to load Radiate status');
      console.error('Error loading Radiate status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load available features
  const loadAvailableFeatures = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/lushpressies/radiate/features');
      // const data = await response.json();

      // Mock data for demonstration
      const mockFeatures: RadiateFeature[] = [
        {
          id: 'boost',
          name: 'Profile Boost',
          description: 'Increase your visibility in discovery for 24 hours',
          isActive: false,
          cost: 100
        },
        {
          id: 'highlight',
          name: 'Profile Highlight',
          description: 'Highlight your profile at the top of discovery for 12 hours',
          isActive: false,
          cost: 200
        },
        {
          id: 'incognito',
          name: 'Incognito Mode',
          description: 'Browse without appearing in discovery queues',
          isActive: false,
          cost: 50
        },
        {
          id: 'super_like',
          name: 'Super Like',
          description: 'Stand out with a Super Like',
          isActive: false,
          cost: 25
        },
        {
          id: 'rewind',
          name: 'Rewind',
          description: 'Undo your last swipe',
          isActive: false,
          cost: 10
        },
        {
          id: 'extended_contacts',
          name: 'Extended Contacts',
          description: 'See who viewed your profile in the last 7 days',
          isActive: false,
          cost: 75
        },
        {
          id: 'priority_support',
          name: 'Priority Support',
          description: 'Get priority customer support',
          isActive: false,
          cost: 150
        }
      ];

      setAvailableFeatures(mockFeatures);
    } catch (err) {
      setError('Failed to load Radiate features');
      console.error('Error loading Radiate features:', err);
    }
  };

  // Load credit history
  const loadCreditHistory = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/radiate/history/${userId}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockHistory: RadiateCredit[] = [
        {
          id: 'credit_purchase_1',
          amount: 500,
          type: 'purchase',
          date: '2026-09-15T10:00:00Z',
          description: 'Purchase 500 credits'
        },
        {
          id: 'credit_reward_1',
          amount: 100,
          type: 'reward',
          date: '2026-09-20T14:30:00Z',
          description: 'Weekly activity bonus'
        },
        {
          id: 'credit_feature_1',
          amount: -100,
          type: 'purchase',
          date: '2026-09-25T09:15:00Z',
          description: 'Profile Boost feature'
        },
        {
          id: 'credit_gift_1',
          amount: 200,
          type: 'gift',
          date: '2026-09-28T16:45:00Z',
          description: 'Gift from friend'
        },
        {
          id: 'credit_feature_2',
          amount: -50,
          type: 'purchase',
          date: '2026-10-01T11:20:00Z',
          description: 'Incognito Mode feature'
        },
        {
          id: 'credit_reward_2',
          amount: 50,
          type: 'reward',
          date: '2026-10-03T13:10:00Z',
          description: 'Daily login bonus'
        }
      ];

      setCreditHistory(mockHistory);
    } catch (err) {
      setError('Failed to load credit history');
      console.error('Error loading credit history:', err);
    }
  };

  // Purchase credits
  const purchaseCredits = async (amount: number, paymentMethodId: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/lushpressies/radiate/purchase', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, amount, paymentMethodId })
      // });

      // Update local state
      if (radiateStatus) {
        const newCreditAmount = radiateStatus.credits + amount;
        const newTotalSpent = radiateStatus.totalSpent; // Total spent doesn't increase with purchases

        setRadiateStatus({
          ...radiateStatus,
          credits: newCreditAmount
        });

        // Add to credit history
        const newCredit: RadiateCredit = {
          id: `credit_purchase_${Date.now()}`,
          amount,
          type: 'purchase',
          date: new Date().toISOString(),
          description: `Purchase ${amount} credits`
        };

        setCreditHistory(prev => [newCredit, ...prev]);

        return { success: true, newBalance: newCreditAmount };
      }
    } catch (err: any) {
      setError('Failed to purchase credits');
      console.error('Error purchasing credits:', err);
      return { success: false, error: err.message };
    }
  };

  // Activate a feature
  const activateFeature = async (featureId: string) => {
    try {
      // Check if user has enough credits
      const targetCost = availableFeatures.find(f => f.id === featureId)?.cost ?? 0;
      if (!radiateStatus || radiateStatus.credits < targetCost) {
        return { success: false, error: 'Not enough credits' };
      }

      // In a real app, this would be an API call
      // const response = await fetch('/api/lushpressies/radiate/activate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, featureId })
      // });

      // Find the feature to activate
      const featureToActivate = availableFeatures.find(f => f.id === featureId);
      if (!featureToActivate) {
        return { success: false, error: 'Feature not found' };
      }

      // Update local state
      if (radiateStatus) {
        const newCredits = radiateStatus.credits - featureToActivate.cost;
        const activatedFeature: RadiateFeature = {
          ...featureToActivate,
          isActive: true,
          activationDate: new Date().toISOString(),
          expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        };

        setRadiateStatus({
          ...radiateStatus,
          credits: newCredits,
          activeFeatures: [...radiateStatus.activeFeatures, activatedFeature]
        });

        // Add to credit history
        const newCredit: RadiateCredit = {
          id: `credit_feature_${Date.now()}`,
          amount: -featureToActivate.cost,
          type: 'purchase',
          date: new Date().toISOString(),
          description: `${featureToActivate.name} feature`
        };

        setCreditHistory(prev => [newCredit, ...prev]);

        return { success: true, newBalance: newCredits, feature: activatedFeature };
      }
    } catch (err: any) {
      setError('Failed to activate feature');
      console.error('Error activating feature:', err);
      return { success: false, error: err.message };
    }
  };

  // Deactivate a feature
  const deactivateFeature = async (featureId: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/lushpressies/radiate/deactivate', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, featureId })
      // });

      // Update local state
      if (radiateStatus) {
        const updatedFeatures = radiateStatus.activeFeatures.filter(f => f.id !== featureId);

        setRadiateStatus({
          ...radiateStatus,
          activeFeatures: updatedFeatures
        });
      }
    } catch (err: any) {
      setError('Failed to deactivate feature');
      console.error('Error deactivating feature:', err);
      return { success: false, error: err.message };
    }
  };

  // Get feature by ID
  const getFeatureById = (featureId: string) => {
    return availableFeatures.find(feature => feature.id === featureId);
  };

  // Check if a feature is active
  const isFeatureActive = (featureId: string) => {
    return radiateStatus?.activeFeatures.some(f => f.id === featureId) || false;
  };

  // Calculate remaining time for active features
  const getRemainingTime = (feature: RadiateFeature) => {
    if (!feature.expirationDate) return null;

    const now = new Date().getTime();
    const exp = new Date(feature.expirationDate).getTime();
    const diff = exp - now;

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  // Initialize radiate functionality
  useEffect(() => {
    if (userId) {
      loadRadiateStatus();
      loadAvailableFeatures();
      loadCreditHistory();
    }
  }, [userId]);

  return {
    radiateStatus,
    availableFeatures,
    creditHistory,
    isLoading,
    error,
    loadRadiateStatus,
    loadAvailableFeatures,
    loadCreditHistory,
    purchaseCredits,
    activateFeature,
    deactivateFeature,
    getFeatureById,
    isFeatureActive,
    getRemainingTime
  };
}
