import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Flame, Activity, Film, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { API_BASE_URL } from '../services/api';

export interface TrendItem {
  id: string;
  title: string;
  category: string;
  engagement: number;
  growth: number;
  image?: string;
  hours_remaining?: number;
}

interface PubliciteeFeedProps {
  trends?: TrendItem[];
  onTrendClick?: (trendId: string) => void;
  onRefresh?: () => void;
  className?: string;
}

export const PubliciteeFeed: React.FC<PubliciteeFeedProps> = ({
  trends: propTrends,
  onTrendClick,
  onRefresh,
  className = ''
}) => {
  const navigate = useNavigate();
  const [trends, setTrends] = useState<TrendItem[]>(propTrends || []);
  const [loading, setLoading] = useState<boolean>(!propTrends || propTrends.length === 0);

  useEffect(() => {
    if (propTrends && propTrends.length > 0) {
      setTrends(propTrends);
      setLoading(false);
      return;
    }

    const fetchTrendingReels = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/publicitee/feed?limit=4`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: TrendItem[] = json.data.map((item: any, idx: number) => ({
            id: item.id,
            title: item.title,
            category: item.category === 'short_film' ? 'Short Film' : item.category === 'vlog' ? 'Vlog' : 'Skit',
            engagement: Number(item.view_count) || 1200 + idx * 450,
            growth: 14.5 + idx * 3.2,
            image: item.thumbnail_url,
            hours_remaining: Math.round(Number(item.hours_remaining) || 168)
          }));
          setTrends(mapped);
        } else {
          setTrends(defaultTrends);
        }
      } catch {
        setTrends(defaultTrends);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingReels();
  }, [propTrends]);

  const defaultTrends: TrendItem[] = [
    {
      id: '1',
      title: 'Afro-Cinematic Short: The Sovereign Beat',
      category: 'Short Film',
      engagement: 45230,
      growth: 23.5,
      hours_remaining: 160
    },
    {
      id: '2',
      title: 'Lagos Street Food & Tech Vlog',
      category: 'Vlog',
      engagement: 38920,
      growth: 18.2,
      hours_remaining: 152
    },
    {
      id: '3',
      title: 'African Mom vs Report Card Skit',
      category: 'Skit',
      engagement: 29450,
      growth: 15.7,
      hours_remaining: 148
    }
  ];

  const formatEngagement = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleItemClick = (trendId: string) => {
    if (onTrendClick) {
      onTrendClick(trendId);
    } else {
      navigate('/publicitee');
    }
  };

  return (
    <Card className={`border-slate-300 bg-white shadow-xs rounded-2xl ${className}`}>
      <CardHeader className="pb-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-slate-900 font-bold">
            <TrendingUp className="h-5 w-5 text-rose-600" />
            <span>Publicitee™ Trending Radar</span>
            <span className="text-[10px] font-black uppercase bg-orange-100 text-orange-950 px-2 py-0.5 rounded-full border border-orange-400">
              168h TTL
            </span>
          </CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                className="text-slate-700 font-semibold hover:text-slate-900 text-xs"
              >
                Refresh
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/publicitee')}
              className="text-rose-700 border-rose-300 hover:bg-rose-50 text-xs font-bold flex items-center gap-1"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trends.map((trend, index) => (
              <div
                key={trend.id}
                className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => handleItemClick(trend.id)}
                role="button"
                tabIndex={0}
              >
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <Badge
                    variant={index === 0 ? 'default' : 'secondary'}
                    className={`w-8 h-8 flex items-center justify-center font-bold rounded-lg ${
                      index === 0
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {index + 1}
                  </Badge>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-rose-600 transition-colors">
                      {trend.title}
                    </h4>
                    {index === 0 && <Flame className="h-4 w-4 text-orange-500 flex-shrink-0" />}
                  </div>

                  <div className="flex items-center gap-2.5 mt-1 text-xs text-slate-700 font-medium">
                    <Badge variant="outline" className="text-[10px] border-slate-300 text-slate-800 font-semibold px-2 py-0.2">
                      {trend.category}
                    </Badge>
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Activity className="h-3 w-3 text-slate-500" />
                      {formatEngagement(trend.engagement)} views
                    </span>
                    {trend.hours_remaining && (
                      <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-orange-700">
                        <Clock className="w-3 h-3 text-orange-500" />
                        {trend.hours_remaining}h left
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-xs text-emerald-700 font-bold flex items-center gap-1">
                    <span>↑ {trend.growth}% cultural velocity</span>
                  </div>
                </div>

                <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                    <Film className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PubliciteeFeed;
