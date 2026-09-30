import React, {} from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface MetricCardProps {
  title?: string;
  value?: string | number;
  icon?: string;
  trend?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title = 'Metric',
  value = '0',
  icon = '📊',
  trend
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export default MetricCard;
