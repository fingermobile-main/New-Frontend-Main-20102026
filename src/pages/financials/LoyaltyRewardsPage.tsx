import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';

const LoyaltyRewardsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [points, setPoints] = useState(0);
  const [currentTierName, setCurrentTierName] = useState('Bronze');
  const [isLoading, setIsLoading] = useState(false);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);

  const [availableRewards, setAvailableRewards] = useState<Array<{
    id: string;
    name: string;
    points: number;
    type: string;
  }>>([
    { id: '1', name: '100 FIC Bonus', points: 500, type: 'fic' },
    { id: '2', name: 'Exclusive Badge', points: 250, type: 'badge' },
    { id: '3', name: 'Premium Feature Access', points: 1000, type: 'feature' },
    { id: '4', name: '250 FIC Bonus', points: 1250, type: 'fic' },
    { id: '5', name: 'Limited Edition NFT', points: 2000, type: 'nft' },
    { id: '6', name: 'One-on-One Consultation', points: 3000, type: 'service' }
  ]);

  const [claimableRewards, setClaimableRewards] = useState<Array<{
    id: string;
    description: string;
    points: number;
    claimed: boolean;
  }>>([]);

  const loadLoyalty = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiService.get<any>('/api/loyalty');
      if (res?.data) {
        const pts = Number(res.data.points || 0);
        setPoints(pts);
        if (res.data.tier) setCurrentTierName(res.data.tier);

        if (res.data.rewards && Array.isArray(res.data.rewards) && res.data.rewards.length > 0) {
          const mapped = res.data.rewards.map((r: any) => ({
            id: String(r.id),
            name: r.title || r.name,
            points: Number(r.points_cost || 100),
            type: r.type || 'fic'
          }));
          setAvailableRewards(mapped);
          setClaimableRewards(mapped.filter((m: any) => pts >= m.points).map((m: any) => ({
            id: m.id,
            description: m.name,
            points: m.points,
            claimed: false
          })));
        }
      }
    } catch (err) {
      console.error('Failed to load loyalty:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLoyalty();
  }, [loadLoyalty]);

  const handleRedeem = async (rewardId: string, cost: number, name: string) => {
    if (points < cost) {
      showToast?.(`You need ${cost - points} more points to redeem ${name}`, 'warning');
      return;
    }

    setRedeemingId(rewardId);
    try {
      const res = await apiService.post<any>('/api/loyalty/redeem', { rewardId });
      if (res?.success) {
        showToast?.(`Successfully redeemed ${name}!`, 'success');
        await loadLoyalty();
      } else {
        showToast?.(res?.message || 'Failed to redeem reward', 'error');
      }
    } catch (err: any) {
      showToast?.(err?.response?.data?.message || err?.message || 'Failed to redeem reward', 'error');
    } finally {
      setRedeemingId(null);
    }
  };

  const loyaltyTiers = [
    {
      name: 'Bronze',
      pointsRequired: 0,
      benefits: [
        'Basic community access',
        'Standard content features',
        'Monthly giveaways entry'
      ],
      current: currentTierName.toLowerCase() === 'bronze'
    },
    {
      name: 'Silver',
      pointsRequired: 1000,
      benefits: [
        'Everything in Bronze',
        'Early content access',
        'Priority customer support',
        'Exclusive events access',
        'Ad-free experience'
      ],
      current: currentTierName.toLowerCase() === 'silver'
    },
    {
      name: 'Gold',
      pointsRequired: 5000,
      benefits: [
        'Everything in Silver',
        'Premium content access',
        'Personalized recommendations',
        'VIP event invitations',
        'Dedicated account manager',
        'Advanced analytics'
      ],
      current: currentTierName.toLowerCase() === 'gold'
    },
    {
      name: 'Platinum',
      pointsRequired: 10000,
      benefits: [
        'Everything in Gold',
        'Exclusive creator tools',
        'Co-creation opportunities',
        'One-on-one consultations',
        'Custom feature requests',
        'Revenue sharing program'
      ],
      current: currentTierName.toLowerCase() === 'platinum'
    }
  ];

  const currentTierObj = loyaltyTiers.find(t => t.current) || loyaltyTiers[0];
  const nextTierObj = loyaltyTiers.find(t => t.pointsRequired > currentTierObj.pointsRequired);
  const nextTarget = nextTierObj ? nextTierObj.pointsRequired : 10000;
  const progressPct = nextTierObj
    ? Math.min(100, Math.max(0, Math.round(((points - currentTierObj.pointsRequired) / (nextTierObj.pointsRequired - currentTierObj.pointsRequired)) * 100)))
    : 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Loyalty Rewards</h2>
        <p className="mt-1 text-sm font-medium text-slate-700">Earn points and unlock exclusive platform benefits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-300 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900">Your Loyalty Status</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-black text-slate-900">{currentTierObj.name} Tier</h4>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    {nextTierObj ? `${points.toLocaleString()}/${nextTarget.toLocaleString()} points to ${nextTierObj.name}` : 'Top Tier Achieved'}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Progress to {nextTierObj ? nextTierObj.name : 'Max'}</span>
                  <span className="text-sm font-black text-slate-900">{progressPct}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 border border-slate-300 overflow-hidden">
                  <div className="bg-brand-blue h-3 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="border border-slate-300 bg-slate-50/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Points Balance</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{points.toLocaleString()}</p>
                </div>
                <div className="border border-slate-300 bg-slate-50/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Points to Next Tier</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {nextTierObj ? Math.max(0, nextTarget - points).toLocaleString() : '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-black text-slate-900 mb-4">Claimable Rewards</h3>
            <div className="space-y-3">
              {claimableRewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3.5 border border-slate-300 bg-slate-50/50 rounded-xl">
                  <div>
                    <p className="font-bold text-slate-900">{reward.description}</p>
                    <p className="text-xs font-semibold text-slate-700">{reward.points.toLocaleString()} points</p>
                  </div>
                  <button
                    onClick={() => handleRedeem(reward.id, reward.points, reward.description)}
                    disabled={redeemingId === reward.id}
                    className="px-3.5 py-1.5 bg-brand-blue text-white font-bold text-xs rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {redeemingId === reward.id ? 'Claiming...' : 'Claim'}
                  </button>
                </div>
              ))}
              {claimableRewards.length === 0 && (
                <p className="text-sm font-medium text-slate-600 text-center py-6">No rewards available to claim with current points balance</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-300 bg-slate-50/50">
          <h3 className="text-lg font-black text-slate-900">Loyalty Tiers</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-300">
          {loyaltyTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`p-6 ${
                tier.current ? 'bg-blue-50/70 border-2 border-brand-blue rounded-lg' : ''
              }`}
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center border ${
                  index === 0 ? 'bg-amber-100 border-amber-300' :
                    index === 1 ? 'bg-slate-200 border-slate-400' :
                      index === 2 ? 'bg-amber-400 border-amber-500' : 'bg-slate-900 border-slate-950'
                }`}>
                  <span className={`font-black text-lg ${
                    index === 0 ? 'text-amber-900' :
                      index === 1 ? 'text-slate-800' :
                        index === 2 ? 'text-amber-950' : 'text-white'
                  }`}>
                    {tier.name.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <h4 className="font-black text-slate-900">{tier.name}</h4>
                  <p className="text-xs font-semibold text-slate-700">{tier.pointsRequired.toLocaleString()}+ points</p>
                </div>
                {tier.current && (
                  <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-brand-blue text-white shadow-sm">
                    Current
                  </span>
                )}
              </div>

              <ul className="mt-5 space-y-2.5">
                {tier.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2 text-xs font-medium text-slate-800">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-300 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-300 bg-slate-50/50">
          <h3 className="text-lg font-black text-slate-900">Available Rewards</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-300">
          {availableRewards.map((reward) => (
            <div key={reward.id} className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="font-bold text-slate-900">{reward.name}</h4>
                  <p className="text-xs font-semibold text-slate-700">{reward.points.toLocaleString()} points</p>
                </div>
              </div>
              <button
                onClick={() => handleRedeem(reward.id, reward.points, reward.name)}
                disabled={redeemingId === reward.id || points < reward.points}
                className={`mt-5 w-full px-4 py-2 font-bold text-sm rounded-lg transition-colors ${
                  points >= reward.points
                    ? 'bg-brand-blue text-white hover:bg-blue-700 shadow-sm'
                    : 'border border-slate-300 text-slate-500 bg-slate-100 cursor-not-allowed'
                }`}
              >
                {redeemingId === reward.id ? 'Redeeming...' : points >= reward.points ? 'Redeem Reward' : 'Insufficient Points'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyRewardsPage;
