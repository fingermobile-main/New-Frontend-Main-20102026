import React, {} from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';

interface TimeSeriesChartProps {
  data?: Array<{ time: string; value: number }>;
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data = [
    { time: '00:00', value: 10 },
    { time: '04:00', value: 25 },
    { time: '08:00', value: 40 },
    { time: '12:00', value: 35 },
    { time: '16:00', value: 50 },
    { time: '20:00', value: 65 }
  ]
}) => {
  const max = Math.max(...data.map(d => d.value));
  const min = Math.min(...data.map(d => d.value));
  const range = max - min || 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <ChartBarIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Time Series</h3>
      </div>
      <div className="relative h-48">
        <svg viewBox="0 0 100 50" className="w-full h-full" preserveAspectRatio="none">
          <polyline
            points={data.map((d, i) => `${(i / (data.length - 1)) * 100},${50 - ((d.value - min) / range) * 40}`).join(' ')}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1"
          />
        </svg>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {data.map((d, i) => (
          <span key={i}>{d.time}</span>
        ))}
      </div>
    </div>
  );
};

export default TimeSeriesChart;
