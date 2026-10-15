import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { LOYALTY_TIERS } from '../../constants';
import MainLayout from '../../components/layout/MainLayout';
import { GiftIcon, SparklesIcon, CheckCircleIcon } from '../../icons';
import { apiService } from '../../services/apiService';

export interface LocalLoyaltyReward {
  id: string;
  tierId: string;
  name: string;
  description?: string;
  redemptionCost: number;
}

interface TierType {
  name: string;
  threshold: number;
  pointsRequired?: number;
  icon?: string;
  benefits?: string[];
}

interface HistoryReward {
  id: string;
  description?: string;
  date: string;
  amount: number;
}

const LoyaltyPage: React.FC = () => {
  const { member } = useAuth();
  const { showToast } = useAppContext();
  const [userPoints, setUserPoints] = useState(0);
  const [tierName, setTierName] = useState('Bronze');
  const [availableRewards, setAvailableRewards] = useState<LocalLoyaltyReward[]>([
    {
      id: '1',
      tierId: 'bronze',
      name: '10% Discount',
      description: 'Get 10% off your next purchase in the storefront.',
      redemptionCost: 100
    },
    {
      id: '2',
      tierId: 'silver',
      name: 'Free Express Shipping',
      description: 'Enjoy free express shipping on your next order.',
      redemptionCost: 200
    },
    {
      id: '3',
      tierId: 'gold',
      name: '$10 Store Voucher',
      description: 'Redeem $10 credit towards any orders over $50.',
      redemptionCost: 300
    }
  ]);
  const [historyList, setHistoryList] = useState<HistoryReward[]>([]);

  const loadLoyaltyData = useCallback(async () => {
    try {
      const res = await apiService.get<any>('/api/loyalty');
      if (res?.data) {
        setUserPoints(Number(res.data.points || 0));
        if (res.data.tier) setTierName(res.data.tier);
        if (res.data.rewards && Array.isArray(res.data.rewards) && res.data.rewards.length > 0) {
          setAvailableRewards(res.data.rewards.map((r: any) => ({
            id: String(r.id),
            tierId: (r.tier_required || 'bronze').toLowerCase(),
            name: r.title || r.name,
            description: r.description,
            redemptionCost: Number(r.points_cost || r.redemptionCost || 100)
          })));
        }
        if (res.data.history && Array.isArray(res.data.history)) {
          setHistoryList(res.data.history.map((h: any) => ({
            id: String(h.id),
            description: h.reward_title ? `Redeemed ${h.reward_title}` : (h.description || 'Loyalty activity'),
            date: h.redeemed_at ? new Date(h.redeemed_at).toLocaleDateString() : 'Recent',
            amount: Number(h.points_spent || h.amount || 0)
          })));
        }
      }
    } catch (err) {
      console.error('Failed to load loyalty data:', err);
      // @ts-expect-error fallback
      if (member?.loyaltyPoints) setUserPoints(member.loyaltyPoints);
    }
  }, [member]);

  useEffect(() => {
    loadLoyaltyData();
  }, [loadLoyaltyData]);

  // Tier calculations with safety fallbacks
  const currentTier: TierType =
    (LOYALTY_TIERS as TierType[]).find((t) => t.name.toLowerCase() === tierName.toLowerCase()) ||
    (LOYALTY_TIERS[0] as TierType);

  const nextTier: TierType | undefined = (LOYALTY_TIERS as TierType[]).find(
    (t) => (t.pointsRequired || t.threshold) > (currentTier.pointsRequired || currentTier.threshold)
  );

  const currentThreshold = currentTier.pointsRequired || currentTier.threshold;
  const nextThreshold = nextTier ? (nextTier.pointsRequired || nextTier.threshold) : currentThreshold;

  const progressPercentage = nextTier
    ? Math.min(Math.max(((userPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100, 0), 100)
    : 100;

  const handleRedeemReward = async (reward: LocalLoyaltyReward) => {
    if (userPoints < reward.redemptionCost) {
      showToast?.(`You need ${reward.redemptionCost - userPoints} more points to redeem this reward.`, 'warning');
      return;
    }
    try {
      const res = await apiService.post<any>('/api/loyalty/redeem', { rewardId: reward.id });
      if (res?.success) {
        showToast?.(`Successfully redeemed ${reward.name}!`, 'success');
        await loadLoyaltyData();
      } else {
        showToast?.(res?.message || 'Failed to redeem reward', 'error');
      }
    } catch (err: any) {
      showToast?.(err?.response?.data?.message || err?.message || 'Redemption failed', 'error');
    }
  };

  const RewardRow: React.FC<{ reward: HistoryReward }> = ({ reward }) => (
    <div className="flex justify-between items-center py-3.5 border-b border-slate-200 last:border-b-0">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-100 p-2 rounded-full text-emerald-900 border border-emerald-300">
          <SparklesIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-slate-900 text-sm">{reward.description}</p>
          <p className="text-xs text-slate-700 font-medium">{reward.date}</p>
        </div>
      </div>
      <p className="font-mono font-black text-emerald-800 text-sm">
        +{reward.amount.toLocaleString()} Pts
      </p>
    </div>
  );

  const TierBenefitItem: React.FC<{ tier: TierType }> = ({ tier }) => {
    const isCurrent = tier.name === currentTier.name;
    return (
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isCurrent
            ? 'border-2 border-blue-500 bg-blue-50/70 shadow-sm ring-1 ring-blue-500/20'
            : 'bg-white border-slate-300 hover:border-slate-400 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{tier.icon || '🏅'}</span>
            <h4 className="font-black text-slate-900 text-base">{tier.name}</h4>
          </div>
          {isCurrent && (
            <span className="text-xs bg-blue-600 text-white font-black px-2.5 py-0.5 rounded-full shadow-sm">
              Current
            </span>
          )}
        </div>
        <p className="text-xs font-bold text-slate-700 mb-3">
          Requires {(tier.pointsRequired || tier.threshold).toLocaleString()} points
        </p>
        <ul className="space-y-2 text-xs text-slate-800 font-medium">
          {(tier.benefits || ['Exclusive tier perks', 'Standard earning rate']).map((benefit: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircleIcon className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8 bg-[#F5F9F6] min-h-screen text-slate-900">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Main Tier Overview Banner */}
          <div className="bg-white p-8 rounded-3xl border border-slate-300 shadow-sm text-center relative overflow-hidden">
            <div className="text-6xl mb-3">{currentTier.icon || '🥉'}</div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              You are a {currentTier.name} Member!
            </h2>
            <p className="text-slate-700 text-sm mt-1 max-w-md mx-auto mb-6 font-medium">
              You currently have <span className="font-black text-blue-700">{userPoints.toLocaleString()}</span> loyalty points available.
            </p>

            {/* Progress Bar */}
            <div className="max-w-xl mx-auto px-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                <span>{currentTier.name} ({currentThreshold.toLocaleString()} pts)</span>
                {nextTier && (
                  <span>{nextTier.name} ({nextThreshold.toLocaleString()} pts)</span>
                )}
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden p-0.5 border border-slate-300">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-700 font-bold mt-2.5">
                {nextTier
                  ? `${(nextThreshold - userPoints).toLocaleString()} points needed to unlock ${nextTier.name}!`
                  : 'You have reached the highest tier tier!'}
              </p>
            </div>
          </div>

          {/* Available Rewards Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-900">Redeem Rewards</h3>
              <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-300 shadow-sm">
                Balance: {userPoints.toLocaleString()} Pts
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableRewards.map((reward) => (
                <div key={reward.id} className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm flex flex-col justify-between hover:border-slate-400 transition-all">
                  <div>
                    <div className="bg-blue-50 border border-blue-200 w-10 h-10 rounded-xl flex items-center justify-center text-blue-700 mb-3">
                      <GiftIcon className="w-5 h-5" />
                    </div>
                    <h4 className="font-black text-slate-900 text-sm">{reward.name}</h4>
                    <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">{reward.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-slate-900">{reward.redemptionCost} Pts</span>
                    <button
                      type="button"
                      onClick={() => handleRedeemReward(reward)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                        userPoints >= reward.redemptionCost
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                          : 'bg-slate-100 text-slate-500 border border-slate-300 cursor-not-allowed'
                      }`}
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tier Benefits Overview */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-4">Membership Tiers</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(LOYALTY_TIERS as TierType[]).map((tier) => (
                <TierBenefitItem key={tier.name} tier={tier} />
              ))}
            </div>
          </div>

          {/* Rewards History */}
          <div className="bg-white p-6 rounded-3xl border border-slate-300 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-4">Points History</h3>
            <div>
              {historyList.length > 0 ? (
                historyList.map((reward) => (
                  <RewardRow key={reward.id} reward={reward} />
                ))
              ) : (
                <div className="text-center py-8">
                  <SparklesIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-700 font-medium">
                    You haven&apos;t earned any loyalty reward points yet.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default LoyaltyPage;
