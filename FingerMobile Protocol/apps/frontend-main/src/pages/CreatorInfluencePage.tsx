import React, { useState } from 'react';
import TierDisplayComponent from '../components/CreatorInfluence/TierDisplayComponent';
import SubscriptionDashboard from '../components/CreatorInfluence/SubscriptionDashboard';
import SubscriptionRecommendationForm from '../components/CreatorInfluence/SubscriptionRecommendationForm';
import PerksAndRosterComponent from '../components/CreatorInfluence/PerksAndRosterComponent';
import apiService from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';

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

const CreatorInfluencePage: React.FC = () => {
  const { member: user, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'plans' | 'recommend' | 'perks_roster'>('dashboard');
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);

  // User metrics
  const followers = 15000;
  const engagementRate = 3.2;

  const handleSubscribe = async (level: string) => {
    try {
      const memberId = user?.id || '4';
      await apiService.post('/creator-influence', {
        member_id: memberId,
        subscription_level: level,
        subscription_type: 'monthly',
        auto_renew: true
      });
      showToast(`Successfully enrolled in ${level} plan!`, 'success');
      setActiveTab('dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.details || err?.message || 'Failed to enroll in subscription';
      showToast(msg, 'error');
    }
  };

  const handleUpgrade = async (level: string) => {
    try {
      const memberId = user?.id || '4';
      await apiService.patch(`/creator-influence/upgrade/${memberId}`, {
        new_level: level
      });
      showToast(`Successfully upgraded subscription to ${level}!`, 'success');
      setActiveTab('dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.details || err?.message || 'Failed to upgrade plan';
      showToast(msg, 'error');
    }
  };

  const handleRecommendationReceived = (rec: RecommendationData) => {
    setRecommendation(rec);
    setActiveTab('plans');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Creator &amp; Influence Infrastructure Program
            </h1>
            <div className="flex space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-950 border border-blue-400 font-bold font-black">
                Followers: {followers.toLocaleString()}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-950 border border-green-400 font-bold font-black">
                Engagement: {engagementRate}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-300">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Subscription
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`${
                activeTab === 'plans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Plans &amp; Pricing
            </button>

            <button
              onClick={() => setActiveTab('recommend')}
              className={`${
                activeTab === 'recommend'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Get Recommendation
            </button>

            <button
              onClick={() => setActiveTab('perks_roster')}
              className={`${
                activeTab === 'perks_roster'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-700 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Perks &amp; Subscriber Roster
            </button>
          </nav>
        </div>
      </div>

      <main className="py-6">
        {activeTab === 'dashboard' && (
          <SubscriptionDashboard
            _followers={followers}
            _engagementRate={engagementRate}
          />
        )}

        {activeTab === 'plans' && (
          <div>
            <TierDisplayComponent
              onSubscribe={handleSubscribe}
              onUpgrade={handleUpgrade}
              showRecommendations={!!recommendation}
              followers={followers}
              engagementRate={engagementRate}
            />
          </div>
        )}

        {activeTab === 'recommend' && (
          <div className="py-6">
            <SubscriptionRecommendationForm
              onRecommendationReceived={handleRecommendationReceived}
            />

            {recommendation && (
              <div className="mt-8 bg-blue-50 rounded-lg p-6 max-w-3xl mx-auto">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Your Recent Recommendation</h3>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {recommendation.tier_name} Plan
                  </h4>
                  <p className="text-gray-600 mt-2">
                    {recommendation.justification.recommended_reason}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Followers</p>
                      <p className="font-medium">{recommendation.justification.followers_count.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                      <p className="font-medium">{recommendation.justification.engagement_rate}%</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-gray-600">Monthly Cost</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₦{recommendation.monthly_price_naira.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'perks_roster' && (
          <div className="py-6">
            <PerksAndRosterComponent />
          </div>
        )}
      </main>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'dashboard' ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-600'
          }`}
        >
          <span className="text-base mb-0.5">📊</span>
          <span>Status</span>
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'plans' ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-600'
          }`}
        >
          <span className="text-base mb-0.5">🏷️</span>
          <span>Plans</span>
        </button>
        <button
          onClick={() => setActiveTab('recommend')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'recommend' ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-600'
          }`}
        >
          <span className="text-base mb-0.5">✨</span>
          <span>Recommend</span>
        </button>
        <button
          onClick={() => setActiveTab('perks_roster')}
          className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'perks_roster' ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:text-blue-600'
          }`}
        >
          <span className="text-base mb-0.5">🎁</span>
          <span>Perks</span>
        </button>
      </div>
    </div>
  );
};

export default CreatorInfluencePage;
