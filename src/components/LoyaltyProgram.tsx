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
    <Card>
      <CardHeader>
        <CardTitle>{programName}</CardTitle>
        <div className="mt-2">
          <div className="flex justify-between text-sm">
            <span>Your Tier: <Badge variant="secondary">{tier}</Badge></span>
            <span>Current Points: <Badge variant="outline">{currentPoints}</Badge></span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5 border text-gray-950 border-gray-400 font-black">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${tierProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Progress: {tierProgress}%</span>
              <span>Total Earned: {totalEarnedPoints} pts</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-3">Available Rewards</h3>
        <div className="space-y-3">
          {rewards.map(reward => (
            <div
              key={reward.id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <h4 className="font-medium">{reward.name}</h4>
                <p className="text-sm text-muted-foreground">{reward.description}</p>
                <p className="text-xs text-muted-foreground">
                  Cost: <span className="font-semibold">{reward.pointsCost} pts</span>
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
