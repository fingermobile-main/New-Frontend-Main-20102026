import React, {} from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface StatCardProps {
  title?: string;
  value?: string | number;
  icon?: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title = 'Stat',
  value = '0',
  icon = '📊',
  change
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {change && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

export default StatCard;
