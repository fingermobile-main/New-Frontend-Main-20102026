import React, {} from 'react';
import { Flame, TrendingUp, Eye, MessageCircle, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface TrendItem {
  id: string;
  title: string;
  category: string;
  views: number;
  comments: number;
  shares: number;
 热度: number;
  timestamp: string;
}

interface TrendsFeedProps {
  trends?: TrendItem[];
  onTrendClick?: (trendId: string) => void;
  limit?: number;
}

const TrendsFeed: React.FC<TrendsFeedProps> = ({
  trends: propTrends,
  onTrendClick,
  limit = 10
}) => {
  const defaultTrends: TrendItem[] = [
    {
      id: '1',
      title: 'AI-Powered Content Creation Tools Revolutionize Digital Marketing',
      category: 'Technology',
      views: 125000,
      comments: 342,
      shares: 1200,
      热度: 98,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      title: 'Sustainable Fashion: Top Eco-Friendly Brands of 2026',
      category: 'Fashion',
      views: 98000,
      comments: 256,
      shares: 890,
      热度: 95,
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      title: 'Cryptocurrency Market Shows Strong Recovery Signs',
      category: 'Finance',
      views: 87000,
      comments: 198,
      shares: 670,
      热度: 92,
      timestamp: '6 hours ago'
    },
    {
      id: '4',
      title: 'Healthy Meal Prep Ideas for Busy Professionals',
      category: 'Health',
      views: 76000,
      comments: 145,
      shares: 520,
      热度: 89,
      timestamp: '8 hours ago'
    },
    {
      id: '5',
      title: 'Top 10 Travel Destinations for Summer 2026',
      category: 'Travel',
      views: 65000,
      comments: 123,
      shares: 450,
      热度: 86,
      timestamp: '10 hours ago'
    }
  ];

  const [visibleLimit, setVisibleLimit] = React.useState(limit);
  const trends = (propTrends || defaultTrends).slice(0, visibleLimit);
  const handleLoadMore = () => setVisibleLimit((prev) => prev + 5);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900">
          <Flame className="h-6 w-6 text-orange-500" />
          Trending Topics
        </h2>
        <Badge variant="secondary" className="bg-slate-100 text-slate-800 border border-slate-300 font-semibold">Live Updates</Badge>
      </div>

      <div className="space-y-3">
        {trends.map((trend, index) => (
          <Card
            key={trend.id}
            className="border-slate-200 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => onTrendClick?.(trend.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-black text-slate-300 min-w-[50px] text-center">
                  #{index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                      {trend.title}
                    </h3>
                    <Badge variant="outline" className="flex-shrink-0 border-slate-300 text-slate-800 font-semibold">
                      {trend.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-700 font-medium">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-slate-600" />
                      {formatNumber(trend.views)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-4 w-4 text-slate-500" />
                      {formatNumber(trend.comments)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4 text-slate-500" />
                      {formatNumber(trend.shares)}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-slate-500" />
                      {trend.热度}%
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{trend.timestamp}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={handleLoadMore} aria-label="Load more trending topics" className="w-full mt-4 border-slate-300 text-slate-800 font-semibold">
        Load More Trends
      </Button>
    </div>
  );
};

export default TrendsFeed;
