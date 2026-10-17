import React, { useState, useCallback } from 'react';
import { useCreatorInfluenceSubscription } from '../../hooks/useCreatorInfluenceSubscription';
import { useAuth } from '../../contexts/AuthContext';

interface RecommendationData {
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
  current_subscription: {
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
  } | null;
}

interface SubscriptionRecommendationFormProps {
  onRecommendationReceived: (recommendation: RecommendationData) => void;
}

const SubscriptionRecommendationForm: React.FC<SubscriptionRecommendationFormProps> = React.memo(({
  onRecommendationReceived
}) => {
  const { member } = useAuth();

  // Ensure memberId is properly typed as string
  const memberIdString = member?.id?.toString() || '';

  // Destructure only the properties that exist in the hook return type
  const {
    loading,
    error,
    getRecommendations // Get the function separately
  } = useCreatorInfluenceSubscription({ memberId: memberIdString });

  const [followers, setFollowers] = useState<number>(0);
  const [engagementRate, setEngagementRate] = useState<number>(0);
  const [bandwidthUsage, setBandwidthUsage] = useState<number>(0);
  const [monetizationEarnings, setMonetizationEarnings] = useState<number>(0);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const recommendation = await getRecommendations(
        followers,
        engagementRate,
        bandwidthUsage,
        monetizationEarnings
      );

      if (recommendation) {
        onRecommendationReceived(recommendation);
      }
    } catch (err) {
      // Silently handle error or use error state
    }
  }, [
    followers,
    engagementRate,
    bandwidthUsage,
    monetizationEarnings,
    getRecommendations,
    onRecommendationReceived
  ]);

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg max-w-3xl mx-auto">
      <div className="px-4 py-5 sm:px-6 border-b border-slate-300">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Get Your Personalized Plan Recommendation
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Enter your metrics to receive a tailored subscription plan suggestion
        </p>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="followers" className="block text-sm font-medium text-gray-700">
                Number of Followers
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="followers"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400 font-mono"
                  placeholder="Enter follower count"
                  value={followers || ''}
                  onChange={(e) => setFollowers(Number(e.target.value))}
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm" id="followers-unit">
                    followers
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="engagementRate" className="block text-sm font-medium text-gray-700">
                Engagement Rate (%)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.01"
                  id="engagementRate"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400 font-mono"
                  placeholder="Enter engagement rate"
                  value={engagementRate || ''}
                  onChange={(e) => setEngagementRate(Number(e.target.value))}
                  min="0"
                  max="100"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm" id="engagement-unit">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="bandwidthUsage" className="block text-sm font-medium text-gray-700">
                Bandwidth Usage (GB/month)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.1"
                  id="bandwidthUsage"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400 font-mono"
                  placeholder="Enter bandwidth usage"
                  value={bandwidthUsage || ''}
                  onChange={(e) => setBandwidthUsage(Number(e.target.value))}
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm" id="bandwidth-unit">
                    GB
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="monetizationEarnings" className="block text-sm font-medium text-gray-700">
                Monthly Earnings (₦)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="monetizationEarnings"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 pl-4 sm:text-sm border-gray-300 rounded-md text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400 font-mono"
                  placeholder="Enter monthly earnings"
                  value={monetizationEarnings || ''}
                  onChange={(e) => setMonetizationEarnings(Number(e.target.value))}
                  min="0"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm" id="earnings-unit">
                    ₦
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculating...
                </>
              ) : 'Get Recommendation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

// Adding display name for the memoized component
SubscriptionRecommendationForm.displayName = 'SubscriptionRecommendationForm';

export default SubscriptionRecommendationForm;
