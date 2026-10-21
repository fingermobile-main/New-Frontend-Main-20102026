import React, {} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge'; // Assuming we have a Badge component

interface LoyaltyReward {
  id: string;
  name: string;
  description?: string;
  pointsCost: number;
  redemptionCount: number;
}

interface LoyaltyProgramProps {
  programName: string;
  currentPoints: number;
  tier: string;
  tierProgress: number;
  totalEarnedPoints: number;
  rewards: LoyaltyReward[];
  onRedeem: (rewardId: string) => void;
}

const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({
  programName,
  currentPoints,
  tier,
  tierProgress,
  totalEarnedPoints,
  rewards,
  onRedeem
}) => {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900 font-bold">{programName}</CardTitle>
        <div className="mt-2">
          <div className="flex justify-between text-sm text-slate-800 font-medium">
            <span>Your Tier: <Badge variant="secondary" className="bg-slate-100 text-slate-800 border border-slate-300 font-semibold">{tier}</Badge></span>
            <span>Current Points: <Badge variant="outline" className="border-slate-300 text-slate-800 font-bold">{currentPoints}</Badge></span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-slate-200 rounded-full h-2.5 border text-slate-950 border-slate-400 font-black">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${tierProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-700 font-semibold mt-1">
              <span>Progress: {tierProgress}%</span>
              <span>Total Earned: {totalEarnedPoints} pts</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold text-slate-900 mb-3">Available Rewards</h3>
        <div className="space-y-3">
          {rewards.map(reward => (
            <div
              key={reward.id}
              className="flex justify-between items-center p-3 border border-slate-200 rounded-lg"
            >
              <div>
                <h4 className="font-semibold text-slate-900">{reward.name}</h4>
                <p className="text-sm text-slate-700 font-medium">{reward.description}</p>
                <p className="text-xs text-slate-700 mt-0.5">
                  Cost: <span className="font-bold text-slate-900">{reward.pointsCost} pts</span>
                </p>
              </div>
              <Button
                size="sm"
                disabled={currentPoints < reward.pointsCost}
                onClick={() => onRedeem(reward.id)}
              >
                {currentPoints >= reward.pointsCost ? 'Redeem' : 'Insufficient'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { LoyaltyProgram };
