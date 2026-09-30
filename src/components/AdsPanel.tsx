import React, {} from 'react';
import { Megaphone, DollarSign, Eye, MousePointer } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface AdCampaign {
  id: string;
  title: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  status: 'active' | 'paused' | 'completed';
}

interface AdsPanelProps {
  campaigns?: AdCampaign[];
  onCreateCampaign?: () => void;
  onViewDetails?: (campaignId: string) => void;
}

const AdsPanel: React.FC<AdsPanelProps> = ({
  campaigns: propCampaigns,
  onCreateCampaign,
  onViewDetails
}) => {
  const defaultCampaigns: AdCampaign[] = [
    {
      id: '1',
      title: 'Summer Sale Campaign',
      budget: 1000,
      spent: 650,
      impressions: 45000,
      clicks: 1200,
      status: 'active'
    },
    {
      id: '2',
      title: 'Product Launch - Q3',
      budget: 2500,
      spent: 1800,
      impressions: 78000,
      clicks: 2400,
      status: 'active'
    },
    {
      id: '3',
      title: 'Brand Awareness',
      budget: 500,
      spent: 500,
      impressions: 25000,
      clicks: 800,
      status: 'completed'
    }
  ];

  const campaigns = propCampaigns || defaultCampaigns;

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0';

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6" />
            Advertising Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your ad campaigns
          </p>
        </div>
        <Button onClick={onCreateCampaign}>
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              ${totalBudget.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              ${totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {((totalSpent / totalBudget) * 100).toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              {(totalImpressions / 1000).toFixed(1)}K
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              CTR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-orange-500" />
              {ctr}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  <CardDescription>
                    ${campaign.spent.toLocaleString()} of ${campaign.budget.toLocaleString()} spent
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    campaign.status === 'active'
                      ? 'default'
                      : campaign.status === 'paused'
                        ? 'secondary'
                        : 'outline'
                  }
                >
                  {campaign.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Impressions</p>
                  <p className="font-semibold">{(campaign.impressions / 1000).toFixed(1)}K</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clicks</p>
                  <p className="font-semibold">{campaign.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CTR</p>
                  <p className="font-semibold">
                    {((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (campaign.spent / campaign.budget) * 100)}%`
                  }}
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails?.(campaign.id)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdsPanel;
