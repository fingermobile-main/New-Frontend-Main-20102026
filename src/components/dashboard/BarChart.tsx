import React, {} from 'react';

interface BarChartProps {
  data: { name: string; value: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Bar Chart</h3>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600">{item.name}</div>
            <div className="flex-1 ml-2">
              <div
                className="bg-blue-500 h-6 rounded"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm text-right">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
