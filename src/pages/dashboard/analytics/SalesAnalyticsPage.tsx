import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';

import StatCard from '../../../components/StatCard';
import { Product } from '../../../types';

const SalesAnalyticsPage: React.FC = () => {
  const { salesAnalytics } = useAppContext();

  if (!salesAnalytics) {
    return <div>Loading analytics data...</div>;
  }

  const { metrics, monthlyRevenue, topProducts } = salesAnalytics;

  const BarChart: React.FC<{ data: { month: string; revenue: number }[] }> = ({
    data
  }) => {
    const maxRevenue = Math.max(...data.map((d) => d.revenue));
    return (
      <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-end justify-around gap-2">
        {data.map((item) => (
          <div
            key={item.month}
            className="flex-1 flex flex-col items-center justify-end h-full"
          >
            <div
              className="w-full bg-brand-blue rounded-t-md hover:bg-blue-700 transition-colors"
              style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
              title={`${item.revenue.toLocaleString()} FIC`}
            ></div>
            <span className="text-xs font-semibold mt-2">{item.month}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Sales Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`${metrics.totalRevenue.toLocaleString()} FIC`}
        />
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders.toLocaleString()}
        />
        <StatCard
          title="Avg. Order Value"
          value={`${metrics.avgOrderValue.toLocaleString()} FIC`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>
          <BarChart data={monthlyRevenue} />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.map((product: Product) => (
              <div
                key={product.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
              >
                <span className="font-semibold">{product.name}</span>
                <span className="font-bold text-green-600">
                  {product.sales.toLocaleString()} sales
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsPage;
