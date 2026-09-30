import React, {} from 'react';
import { BarChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CampaignMetric {
  name: string;
  value: string | number;
  change: number;
  period: string;
}

interface CampaignAnalyticsProps {
  metrics?: CampaignMetric[];
  onMetricClick?: (metricName: string) => void;
}

// Moved outside the component to prevent re-creation on every render
const DEFAULT_METRICS: CampaignMetric[] = [
  { name: 'Total Impressions', value: '2.4M', change: 12.5, period: 'vs last month' },
  { name: 'Click-Through Rate', value: '3.8%', change: -2.1, period: 'vs last month' },
  { name: 'Conversions', value: '1,234', change: 8.3, period: 'vs last month' },
  { name: 'Revenue', value: '$45,678', change: 15.7, period: 'vs last month' }
];

const PERFORMANCE_DATA = [
  { channel: 'Social Media', impressions: '1.2M', ctr: '4.2%', revenue: '$23,456' },
  { channel: 'Email Marketing', impressions: '800K', ctr: '5.1%', revenue: '$15,234' },
  { channel: 'Search Ads', impressions: '400K', ctr: '2.8%', revenue: '$6,988' }
];

const CampaignAnalytics: React.FC<CampaignAnalyticsProps> = ({
  metrics = DEFAULT_METRICS, // Used ES6 default parameters instead of manual assignment
  onMetricClick
}) => {

  // Handle keyboard interaction for accessible cards
  const handleKeyDown = (e: React.KeyboardEvent, metricName: string) => {
    if ((e.key === 'Enter' || e.key === ' ') && onMetricClick) {
      e.preventDefault();
      onMetricClick(metricName);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart className="h-6 w-6" aria-hidden="true" />
          Campaign Analytics
        </h2>
        <p className="text-muted-foreground mt-1">
          Performance metrics and insights
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const isPositive = metric.change >= 0;
          const isClickable = !!onMetricClick;

          return (
            <Card
              key={metric.name} // Using a unique string property instead of array index
              className={`${isClickable ? 'hover:shadow-md transition-shadow cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' : ''}`}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onClick={() => onMetricClick?.(metric.name)}
              onKeyDown={(e) => handleKeyDown(e, metric.name)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{metric.value}</div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={`${
                      isPositive
                        ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                        : 'bg-destructive/10 text-destructive'
                    } hover:bg-transparent`}
                  >
                    <TrendingUp className={`h-3 w-3 mr-1 transition-transform ${!isPositive ? 'rotate-180' : ''}`} />
                    {Math.abs(metric.change)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">{metric.period}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance Breakdown</CardTitle>
          <CardDescription>Campaign performance by channel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {PERFORMANCE_DATA.map((item) => (
              <div key={item.channel} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg gap-3">
                <div className="font-medium">{item.channel}</div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Impressions</p>
                    <p className="font-semibold">{item.impressions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">CTR</p>
                    <p className="font-semibold">{item.ctr}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-semibold text-green-600 dark:text-green-400">{item.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignAnalytics;
