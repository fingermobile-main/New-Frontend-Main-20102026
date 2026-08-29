import React, { useEffect } from 'react';
import { useBusinessSuite } from './src/hooks/useBusinessSuite';
import AppShell from './src/layouts/AppShell';
import SectionCard from './src/components/SectionCard';
import MetricCard from './src/components/MetricCard';
import DataTable from './src/components/DataTable';
import { DollarSign, TrendingUp, Calendar, PieChart } from 'lucide-react';

const RevenuePage = () => {
  const { data: store, loading, error, fetchOverview } = useBusinessSuite();
  
  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);
  
  const revenue = store?.revenue || {};

  return (
    <AppShell activeKey="revenue">
      <div className="space-y-6">
        <SectionCard title="Revenue Overview" subtitle="Performance metrics and insights for your monetization efforts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              title="Today's Earnings" 
              value={`$${revenue.todayEarnings?.toFixed(2) || '0.00'}`} 
              change="+5.2%" 
              label="Daily Revenue"
              helper="Revenue earned today"
              icon={<DollarSign className="text-green-500" />}
            />
            <MetricCard 
              title="This Week" 
              value={`$${revenue.thisWeekEarnings?.toFixed(2) || '0.00'}`} 
              change="+8.7%" 
              label="Weekly Revenue"
              helper="Revenue earned this week"
              icon={<TrendingUp className="text-blue-500" />}
            />
            <MetricCard 
              title="This Month" 
              value={`$${revenue.thisMonthEarnings?.toFixed(2) || '0.00'}`} 
              change="+12.5%" 
              label="Monthly Revenue"
              helper="Revenue earned this month"
              icon={<Calendar className="text-purple-500" />}
            />
            <MetricCard 
              title="All Time" 
              value={`$${revenue.allTimeEarnings?.toFixed(2) || '0.00'}`} 
              change="+25.3%" 
              label="Total Revenue"
              helper="Total revenue earned"
              icon={<PieChart className="text-orange-500" />}
            />
          </div>
        </SectionCard>

        <SectionCard title="Revenue Breakdown" subtitle="Detailed breakdown of your earnings by source">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard 
              title="Ads Revenue" 
              value={`$${revenue.adsRevenue?.toFixed(2) || '0.00'}`} 
              change="+7.2%" 
              label="From Advertisements"
              helper="Revenue from in-stream ads"
              icon={<DollarSign className="text-green-500" />}
            />
            <MetricCard 
              title="Gifts Revenue" 
              value={`$${revenue.giftsRevenue?.toFixed(2) || '0.00'}`} 
              change="+15.4%" 
              label="From Virtual Gifts"
              helper="Revenue from virtual gifts"
              icon={<DollarSign className="text-blue-500" />}
            />
            <MetricCard 
              title="Subscription Revenue" 
              value={`$${revenue.subscriptionRevenue?.toFixed(2) || '0.00'}`} 
              change="+11.8%" 
              label="From Subscriptions"
              helper="Revenue from subscriptions"
              icon={<DollarSign className="text-purple-500" />}
            />
          </div>
        </SectionCard>

        <SectionCard title="Payment History" subtitle="Record of your payments and withdrawals">
          <DataTable 
            columns={[
              { key: 'date', header: 'Date' },
              { key: 'amount', header: 'Amount' },
              { key: 'method', header: 'Method' },
              { key: 'status', header: 'Status' }
            ]} 
            rows={revenue.paymentHistory || []} 
          />
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default RevenuePage;