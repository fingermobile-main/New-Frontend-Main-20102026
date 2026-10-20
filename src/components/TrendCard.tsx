import React, {} from 'react';
import { TrendingUp, Flame, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface TrendData {
  id: string;
  title: string;
  category: string;
 热度: number;
  views: number;
}

interface TrendCardProps {
  trend: TrendData;
  rank: number;
  onClick?: (trendId: string) => void;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend, rank, onClick }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer border border-slate-300 bg-white"
      onClick={() => onClick?.(trend.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black text-slate-700 min-w-[40px]">
            #{rank}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 truncate">{trend.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-700 font-medium">
              <Badge variant="outline" className="text-xs font-bold border-slate-300 text-slate-800 bg-slate-50">
                {trend.category}
              </Badge>
              <div className="flex items-center gap-1 text-slate-700">
                <Eye className="h-3.5 w-3.5 text-slate-600" />
                <span>{formatNumber(trend.views)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-amber-600 font-bold">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-black">{trend.热度}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendCard;
