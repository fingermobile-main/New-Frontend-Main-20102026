import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down';
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend, 
  description 
}) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon || (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            )}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-700 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {change && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend === 'up' ? '↑' : '↓'} {change}
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {description && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm text-gray-700">{description}</div>
        </div>
      )}
    </div>
  );
};

export default MetricCard;