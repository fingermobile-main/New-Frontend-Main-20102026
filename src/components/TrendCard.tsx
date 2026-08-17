import React, {} from 'react';
import { TrendingUp, Flame, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(trend.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-muted-foreground/30 min-w-[40px]">
            #{rank}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{trend.title}</h3>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {trend.category}
              </Badge>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {formatNumber(trend.views)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-orange-500">
            <Flame className="h-4 w-4" />
            <span className="text-sm font-semibold">{trend.热度}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendCard;
