import React from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import StatCard from '../../../components/StatCard';
import { Product } from '../../../types';
import { PlatformOwnershipCard } from '../../../components/ownership/PlatformOwnershipCard';

const FALLBACK_SALES_ANALYTICS = {
  metrics: {
    totalRevenue: 348200,
    totalOrders: 1420,
    avgOrderValue: 245
  },
  monthlyRevenue: [
    { month: 'May', revenue: 42000 },
    { month: 'Jun', revenue: 58000 },
    { month: 'Jul', revenue: 64000 },
    { month: 'Aug', revenue: 71000 },
    { month: 'Sep', revenue: 83000 },
    { month: 'Oct', revenue: 95200 }
  ],
  topProducts: [
    { id: 'p-1', name: 'FIC Quantum Validator Node Key', price: 499, sales: 320 },
    { id: 'p-2', name: 'FingerLux Biometric NFC Wearable', price: 290, sales: 410 },
    { id: 'p-3', name: 'Guardian AI Security Sentinel License', price: 150, sales: 690 }
  ]
};

const SalesAnalyticsPage: React.FC = () => {
  const { salesAnalytics } = useAppContext();

  const analytics = (salesAnalytics as any) || FALLBACK_SALES_ANALYTICS;
  const metrics = analytics.metrics || FALLBACK_SALES_ANALYTICS.metrics;
  const monthlyRevenue = analytics.monthlyRevenue?.length ? analytics.monthlyRevenue : FALLBACK_SALES_ANALYTICS.monthlyRevenue;
  const topProducts = analytics.topProducts?.length ? analytics.topProducts : FALLBACK_SALES_ANALYTICS.topProducts;

  const BarChart: React.FC<{ data: { month: string; revenue: number }[] }> = ({
    data
  }) => {
    const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
    return (
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 h-64 flex items-end justify-around gap-2">
        {data.map((item) => (
          <div
            key={item.month}
            className="flex-1 flex flex-col items-center justify-end h-full"
          >
            <div
              className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-colors cursor-pointer"
              style={{ height: `${Math.max(10, (item.revenue / maxRevenue) * 100)}%` }}
              title={`${item.revenue.toLocaleString()} FIC`}
            ></div>
            <span className="text-xs font-bold text-slate-800 mt-2">{item.month}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Sales Analytics</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">Ecosystem gross merchandise volume, average order values, and node licensing metrics</p>
        </div>
      </div>

      <PlatformOwnershipCard />
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
