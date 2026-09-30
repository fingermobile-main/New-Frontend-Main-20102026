import React, {} from 'react';

interface AreaChartProps {
  data?: number[];
  title?: string;
  color?: string;
}

const AreaChart: React.FC<AreaChartProps> = ({
  data = [10, 25, 40, 35, 50, 65, 80],
  title = 'Chart',
  color = 'blue'
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">{title}</h4>
      <div className="relative h-32">
        <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : '#8B5CF6'} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : '#8B5CF6'} stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon
            points={`0,50 ${data.map((val, i) => `${(i / (data.length - 1)) * 100},${50 - ((val - min) / range) * 40}`).join(' ')} 100,50`}
            fill={`url(#gradient-${color})`}
          />
          <polyline
            points={data.map((val, i) => `${(i / (data.length - 1)) * 100},${50 - ((val - min) / range) * 40}`).join(' ')}
            fill="none"
            stroke={color === 'blue' ? '#3B82F6' : color === 'green' ? '#10B981' : '#8B5CF6'}
            strokeWidth="0.5"
          />
        </svg>
      </div>
    </div>
  );
};

export default AreaChart;
