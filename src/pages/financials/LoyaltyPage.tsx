import React from 'react';
import { useAppContext } from "contexts/AppContext";  // Using absolute path from src
import { useAuth } from '../../contexts/AuthContext';
import { LOYALTY_TIERS } from '../../constants';
import type { LoyaltyReward, LoyaltyTier } from '../../types';
import MainLayout from '../../components/layout/MainLayout';

// Define LoyaltyTier and LoyaltyReward interfaces if not available in models
export interface LocalLoyaltyTier {
  id: string;
  name: string;
  threshold: number;
}

export interface LocalLoyaltyReward {
  id: string;
  tierId: string;
  name: string;
  description: string;
  redemptionCost: number;
}

const LoyaltyPage = () => {
  const { member } = useAuth();
  const { loyaltyRewards } = useAppContext();

  const currentTier =
    LOYALTY_TIERS.find((t) => t.name === (member?.loyaltyTier || "Bronze")) ||
    LOYALTY_TIERS[0];
  const nextTier = LOYALTY_TIERS.find(
    (t) => t.threshold > currentTier.threshold,
  );

  const progressPercentage = nextTier
    ? Math.min(
        ((member?.loyaltyPoints || 0) / nextTier.threshold) * 100,
        100,
      )
    : 100;

  const [rewards, setRewards] = React.useState<LocalLoyaltyReward[]>([
    { 
      id: 'r1', 
      tierId: 'bronze', 
      name: '10% Discount', 
      description: 'Get 10% off your next purchase', 
      redemptionCost: 100 
    },
    { 
      id: 'r2', 
      tierId: 'silver', 
      name: 'Free Shipping', 
      description: 'Free shipping on your next order', 
      redemptionCost: 200 
    },
    { 
      id: 'r3', 
      tierId: 'gold', 
      name: '$10 Voucher', 
      description: 'Redeem for $10 off purchases over $50', 
      redemptionCost: 300 
    }
  ]);

  const RewardRow: React.FC<{ reward: any }> = ({ reward }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
      <div>
        <p className="font-semibold">{reward.description}</p>
        <p className="text-sm text-gray-500">{reward.date}</p>
      </div>
      <p className="font-bold text-green-500">
        +{reward.amount.toLocaleString()} FIC
      </p>
    </div>
  );

  const TierBenefitItem: React.FC<{ tier: any }> = ({ tier }) => (
    <div
      className={`p-4 rounded-lg border-2 ${tier.name === currentTier.name ? "border-brand-blue bg-blue-50" : "bg-gray-100 border-transparent"}`}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{tier.icon}</span>
        <h4 className="font-bold text-lg">{tier.name}</h4>
      </div>
      <ul className="space-y-1 text-sm text-gray-600 list-disc list-inside">
        {tier.benefits.map((benefit: string, i: number) => (
          <li key={i}>{benefit}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-md text-center mb-8">
          <div className="text-5xl mb-2">{(currentTier as any).icon || '🥉'}</div>
          <h2 className="text-2xl font-bold text-gray-800">
            You are a {currentTier.name} Member!
          </h2>
          <p className="text-gray-600 mt-2 mb-6">
            Thank you for being a valued member of our community. Keep engaging
            to unlock more rewards.
          </p>

          <div className="px-4">
            <div className="flex justify-between text-sm font-semibold mb-1">
              <span>
                {currentTier.name} (
                {(currentTier as any).pointsRequired || currentTier.threshold} pts)
              </span>
              {nextTier && (
                <span>
                  {nextTier.name} ({(nextTier as any).pointsRequired || nextTier.threshold}{" "}
                  pts)
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-brand-blue h-4 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {nextTier
                ? `${((nextTier as any).pointsRequired || nextTier.threshold) - (member?.loyaltyPoints || 0)} points until ${nextTier.name}!`
                : "You&apos;ve reached the highest tier!"}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Tier Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LOYALTY_TIERS.map((tier) => (
              <TierBenefitItem key={tier.name} tier={tier} />
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Rewards History</h2>
          <div className="space-y-2">
            {(loyaltyRewards || []).length > 0 ? (
              (loyaltyRewards || []).map((reward) => (
                <RewardRow key={reward.id} reward={reward} />
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                You haven&apos;t received any loyalty rewards yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
