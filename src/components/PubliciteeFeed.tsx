import React, {} from 'react';
import { TrendingUp, Flame, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface TrendItem {
  id: string;
  title: string;
  category: string;
  engagement: number;
  growth: number;
  image?: string;
}

interface PubliciteeFeedProps {
  trends?: TrendItem[];
  onTrendClick?: (trendId: string) => void;
  onRefresh?: () => void;
}

const PubliciteeFeed: React.FC<PubliciteeFeedProps> = ({
  trends: propTrends,
  onTrendClick,
  onRefresh
}) => {
  const defaultTrends: TrendItem[] = [
    {
      id: '1',
      title: '#TechInnovation2026',
      category: 'Technology',
      engagement: 45230,
      growth: 23.5
    },
    {
      id: '2',
      title: 'AI Revolution',
      category: 'Business',
      engagement: 38920,
      growth: 18.2
    },
    {
      id: '3',
      title: 'Sustainable Living',
      category: 'Lifestyle',
      engagement: 29450,
      growth: 15.7
    }
  ];

  const trends = propTrends || defaultTrends;

  const formatEngagement = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Now
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trends.map((trend, index) => (
            <div
              key={trend.id}
              className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onTrendClick?.(trend.id)} role="button" tabIndex={0}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <Badge
                  variant={index === 0 ? 'default' : 'secondary'}
                  className={`w-8 h-8 flex items-center justify-center ${
                    index === 0 ? 'bg-red-500' : ''
                  }`}
                >
                  {index + 1}
                </Badge>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold truncate">{trend.title}</h4>
                  {index === 0 && <Flame className="h-4 w-4 text-orange-500" />}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {trend.category}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    {formatEngagement(trend.engagement)}
                  </span>
                </div>
                <div className="mt-1 text-xs text-green-600 font-medium">
                  ↑ {trend.growth}% growth
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PubliciteeFeed;
