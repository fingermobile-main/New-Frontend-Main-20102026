import React, {} from 'react';
import { Info, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface HighwayItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface InfoHighwayProps {
  items?: HighwayItem[];
  onItemClick?: (itemId: string) => void;
}

const InfoHighway: React.FC<InfoHighwayProps> = ({
  items: propItems,
  onItemClick
}) => {
  const defaultItems: HighwayItem[] = [
    {
      id: '1',
      title: 'Platform Update: New Features Released',
      description: 'We\'ve added exciting new features including enhanced video editing and improved collaboration tools.',
      category: 'Updates',
      priority: 'high',
      timestamp: '1 hour ago'
    },
    {
      id: '2',
      title: 'Community Guidelines Updated',
      description: 'Please review our updated community guidelines to ensure a safe and welcoming environment.',
      category: 'Policy',
      priority: 'medium',
      timestamp: '3 hours ago'
    },
    {
      id: '3',
      title: 'Maintenance Scheduled',
      description: 'Scheduled maintenance will occur tonight from 2-4 AM EST. Services may be temporarily unavailable.',
      category: 'Maintenance',
      priority: 'high',
      timestamp: '5 hours ago'
    }
  ];

  const items = propItems || defaultItems;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
          <Info className="h-5 w-5 text-slate-700" />
          Information Highway
        </h2>
        <Button variant="ghost" size="sm" asChild className="text-slate-700 font-semibold hover:text-slate-900">
          <a href="/info">View All</a>
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <Card
            key={item.id}
            className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onItemClick?.(item.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${getPriorityColor(item.priority)} text-white font-bold`}>
                      {item.priority}
                    </Badge>
                    <Badge variant="outline" className="border-slate-300 text-slate-800 font-semibold">{item.category}</Badge>
                  </div>
                  <CardTitle className="text-base text-slate-900 font-bold">{item.title}</CardTitle>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-500 flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2 mb-2 text-slate-700 font-medium">
                {item.description}
              </CardDescription>
              <p className="text-xs text-slate-600 font-medium">{item.timestamp}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InfoHighway;
