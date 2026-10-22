import React, {} from 'react';
import { TrendingUp, Flame, Eye, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface Trend {
  id: string;
  title: string;
  category: string;
  views: number;
  shares: number;
 热度: number;
  image?: string;
}

interface TrendsSlideProps {
  trends?: Trend[];
  onTrendClick?: (trendId: string) => void;
}

const TrendsSlide: React.FC<TrendsSlideProps> = ({
  trends: propTrends,
  onTrendClick
}) => {
  const defaultTrends: Trend[] = [
    {
      id: '1',
      title: 'AI Revolution in Content Creation',
      category: 'Technology',
      views: 125000,
      shares: 3400,
      热度: 98
    },
    {
      id: '2',
      title: 'Sustainable Fashion Trends 2026',
      category: 'Fashion',
      views: 98000,
      shares: 2800,
      热度: 95
    },
    {
      id: '3',
      title: 'Crypto Market Analysis',
      category: 'Finance',
      views: 87000,
      shares: 2100,
      热度: 92
    },
    {
      id: '4',
      title: 'Healthy Meal Prep Ideas',
      category: 'Health',
      views: 76000,
      shares: 1900,
      热度: 89
    },
    {
      id: '5',
      title: 'Travel Destinations for Summer',
      category: 'Travel',
      views: 65000,
      shares: 1600,
      热度: 86
    }
  ];

  const trends = propTrends || defaultTrends;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          Trending Now
        </h2>
        <Badge variant="secondary" className="border-slate-300 text-slate-800">Top 5</Badge>
      </div>

      <div className="space-y-3">
        {trends.map((trend, index) => (
          <Card
            key={trend.id}
            className="hover:shadow-md transition-shadow cursor-pointer border-slate-200"
            onClick={() => onTrendClick?.(trend.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl font-extrabold text-slate-500 min-w-[40px]">
                  #{index + 1}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg line-clamp-2 text-slate-900">
                      {trend.title}
                    </h3>
                    <Badge variant="outline" className="border-slate-300 text-slate-700 font-medium">{trend.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-700 font-medium">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-slate-600" />
                      {formatNumber(trend.views)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4 text-slate-500" />
                      {formatNumber(trend.shares)}
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      {trend.热度}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <a
        href="/trends"
        aria-label="View all trends"
        className="block text-center w-full mt-4 py-2 px-4 rounded-md border border-slate-300 text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
      >
        View All Trends
      </a>
    </div>
  );
};

export default TrendsSlide;
