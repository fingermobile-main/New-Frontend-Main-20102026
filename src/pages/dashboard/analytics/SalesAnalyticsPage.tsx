import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';

import StatCard from '../../../components/StatCard';
import { Product } from '../../../types';

const SalesAnalyticsPage: React.FC = () => {
  const { salesAnalytics } = useAppContext();

  if (!salesAnalytics) {
    return <div>Loading analytics data...</div>;
  }

  const analytics = salesAnalytics as any;
  const metrics = analytics.metrics || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };
  const monthlyRevenue = analytics.monthlyRevenue || [];
  const topProducts = analytics.topProducts || [];

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
    <div className="space-y-6">
      <h1 className="text-3xl font-black mb-6 text-slate-900">Sales Analytics</h1>
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
        <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <h2 className="text-xl font-black mb-4 text-slate-900">Monthly Revenue</h2>
          <BarChart data={monthlyRevenue} />
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xs border border-slate-300">
          <h2 className="text-xl font-black mb-4 text-slate-900">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.map((product: any) => (
              <div key={product.id} className="bg-white p-4 rounded-xl border border-slate-300 shadow-xs">
                <h3 className="font-bold text-slate-900">{product.name}</h3>
                {/* Remove sales and unitsSold if they don't exist on Product type */}
                <p className="text-sm font-semibold text-slate-700 mt-1">Price: ${product.price?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalyticsPage;
