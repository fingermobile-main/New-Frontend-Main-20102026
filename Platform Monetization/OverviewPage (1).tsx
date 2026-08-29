import React, { useEffect } from 'react';
import { useBusinessSuite } from './src/hooks/useBusinessSuite';
import AppShell from './src/layouts/AppShell';
import MetricCard from './src/components/MetricCard';
import SectionCard from './src/components/SectionCard';
import { DollarSign, Eye, Users, TrendingUp } from 'lucide-react';

const OverviewPage = () => {
  const { data: store, loading, error, fetchOverview } = useBusinessSuite();
  
  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);
  
  const overview = store?.overview || {};
  
  return (
    <AppShell activeKey="overview">
      <div className="space-y-6">
        <SectionCard title="Monetization Overview" subtitle="Key metrics and performance indicators for your monetization efforts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              title="Total Revenue" 
              value={`$${overview.totalRevenue?.toFixed(2) || '0.00'}`} 
              change="+12.5%" 
              label="Total Revenue"
              helper="Total revenue generated"
              icon={<DollarSign className="text-green-500" />}
            />
            <MetricCard 
              title="Active Products" 
              value={overview.activeProducts || 0} 
              change="+2.1%" 
              label="Active Products"
              helper="Number of active monetization products"
              icon={<Eye className="text-blue-500" />}
            />
            <MetricCard 
              title="Eligible Audience" 
              value={overview.eligibleAudience?.toLocaleString() || 0} 
              change="+5.3%" 
              label="Eligible Audience"
              helper="Audience eligible for monetization"
              icon={<Users className="text-purple-500" />}
            />
            <MetricCard 
              title="Daily Views" 
              value={overview.dailyViews?.toLocaleString() || 0} 
              change="+8.7%" 
              label="Daily Views"
              helper="Average daily views"
              icon={<TrendingUp className="text-orange-500" />}
            />
          </div>
        </SectionCard>

        <SectionCard title="Product Performance" subtitle="Performance breakdown by monetization product">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg">In-Stream Ads</h3>
              <p className="text-gray-600 text-sm mt-1">Performance metrics for in-stream advertisements</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue</span>
                  <span className="text-sm font-medium">${(overview.totalRevenue * 0.4)?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Fill Rate</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">RPM</span>
                  <span className="text-sm font-medium">$2.50</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg">Gifts</h3>
              <p className="text-gray-600 text-sm mt-1">Performance metrics for virtual gifts</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue</span>
                  <span className="text-sm font-medium">${(overview.totalRevenue * 0.35)?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Conversion</span>
                  <span className="text-sm font-medium">2.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avg. Gift Value</span>
                  <span className="text-sm font-medium">$0.99</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-lg">Subscriptions</h3>
              <p className="text-gray-600 text-sm mt-1">Performance metrics for subscription services</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Revenue</span>
                  <span className="text-sm font-medium">${(overview.totalRevenue * 0.25)?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Subscribers</span>
                  <span className="text-sm font-medium">1,250</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Churn Rate</span>
                  <span className="text-sm font-medium">3.2%</span>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default OverviewPage;