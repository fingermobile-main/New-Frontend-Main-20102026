import React, {} from 'react';

interface SparklineChartProps {
  data?: number[];
  color?: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({
  data = [10, 25, 40, 35, 50, 65, 80],
  color = '#3B82F6'
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <svg viewBox="0 0 100 30" className="w-full h-8" preserveAspectRatio="none">
      <polyline
        points={data.map((val, i) => `${(i / (data.length - 1)) * 100},${30 - ((val - min) / range) * 25}`).join(' ')}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export default SparklineChart;
