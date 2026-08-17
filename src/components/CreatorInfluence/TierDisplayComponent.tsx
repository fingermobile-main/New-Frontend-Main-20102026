import React, { useEffect } from 'react';
import { useCreatorInfluenceSubscription } from '../../hooks/useCreatorInfluenceSubscription';
import { useAuth } from '../../contexts/AuthContext';

interface TierDisplayComponentProps {
  onSubscribe?: (level: string) => void;
  onUpgrade?: (level: string) => void;
  showRecommendations?: boolean;
  followers?: number;
  engagementRate?: number;
}

const TierDisplayComponent: React.FC<TierDisplayComponentProps> = ({
  onSubscribe,
  onUpgrade,
  showRecommendations: _showRecommendations = false,
  followers: _followers = 0,
  engagementRate: _engagementRate = 0
}) => {
  const { member } = useAuth();

  // Ensure memberId is properly typed as string
  const memberIdString = member?.id?.toString() || '';

  // Destructure only the properties that exist in the hook return type
  const {
    subscription,
    loading,
    error,
    tiers, // Include tiers in destructuring
    createSubscription // Include createSubscription function
  } = useCreatorInfluenceSubscription({ memberId: memberIdString });

  // Define handleSubscribe function only once
  const handleSubscribe = async (level: string) => {
    if (createSubscription) {
      try {
        await createSubscription(level);
        if (onSubscribe) {
          onSubscribe(level);
        }
      } catch (_err) {
        // Handle error silently or pass to parent
      }
    }
  };

  useEffect(() => {
    // Effect logic if needed
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  const handleUpgradeAction = (level: string) => {
    if (onUpgrade) {
      onUpgrade(level);
    }
  };

  // Format currency in Nigerian Naira
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Creator &amp; Influence Infrastructure Program
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Choose the perfect plan for your creator journey
        </p>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 gap-8 sm:gap-12 lg:grid-cols-3">
        {Object.entries(tiers || {}).map(([_key, tier]) => {
          // Type guard for tier
          if (!tier || typeof tier !== 'object') return null;
          
          const typedTier = tier as {
            name: string;
            level: string;
            minFollowers: number;
            maxFollowers: number;
            monthlyPriceNaira: number;
            durationMonths: number | null;
            features: string[];
          };
          
          const isCurrentPlan = subscription && subscription.subscription_level === typedTier.level;
          const isDisabled = isCurrentPlan === null ? false : Boolean(isCurrentPlan);
          
          return (
            <div 
              key={typedTier.level} 
              className="border rounded-2xl shadow-sm overflow-hidden border-gray-200"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{typedTier.name}</h3>
                
                <div className="mt-4">
                  <p className="text-4xl font-extrabold text-gray-900">
                    {formatCurrency(typedTier.monthlyPriceNaira)}
                    <span className="text-base font-medium text-gray-500">/mo</span>
                  </p>
                  
                  <p className="mt-1 text-gray-500">
                    {typedTier.minFollowers.toLocaleString()} - {typedTier.maxFollowers.toLocaleString()} followers
                  </p>
                </div>
                
                <ul className="mt-6 space-y-4">
                  {typedTier.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start">
                      <svg className="h-6 w-6 flex-shrink-0 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="ml-3 text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  type="button"
                  className={`mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    isCurrentPlan 
                      ? 'bg-gray-600 cursor-default' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={isDisabled}
                  onClick={() => {
                    handleSubscribe(typedTier.level);
                    handleUpgradeAction(typedTier.level);
                  }}
                >
                  {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TierDisplayComponent;