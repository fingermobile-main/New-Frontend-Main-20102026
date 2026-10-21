import React, {} from 'react';
import { BarChart2, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CRMWidgetProps {
  title: string;
  value: string | number;
  change?: number;
  period?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
}

const CRMWidget: React.FC<CRMWidgetProps> = ({
  title,
  value,
  change,
  period = 'vs last month',
  icon,
  trend
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-700 dark:text-emerald-400 font-bold';
    if (trend === 'down') return 'text-rose-700 dark:text-rose-400 font-bold';
    return 'text-slate-700 dark:text-slate-300 font-bold';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <Card className="border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {title}
          </CardTitle>
          {icon && <div className="text-slate-500 dark:text-slate-300">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            <span>{Math.abs(change)}%</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{period}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CRMWidget;
