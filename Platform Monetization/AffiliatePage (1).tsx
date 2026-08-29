import React from 'react';
import { useBusinessSuite } from './src/hooks/useBusinessSuite';
import AppShell from './src/layouts/AppShell';
import MetricCard from './src/components/MetricCard';
import SectionCard from './src/components/SectionCard';
import DataTable from './src/components/DataTable';
import { DollarSign, TrendingUp, Users, Share2 } from 'lucide-react';

const AffiliatePage = () => {
  const { data: store, loading, error } = useBusinessSuite();
  
  const affiliateData = store?.affiliate || {};
  
  return (
    <AppShell activeKey="affiliate">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard 
          title="Total Earnings"
          value={`$${affiliateData.totalEarnings?.toFixed(2) || '0.00'}`}
          change="+12.5% from last month"
          label="Total Earnings"
          helper="Lifetime earnings from affiliate commissions"
          icon={<DollarSign className="text-green-500" />}
        />
        <MetricCard 
          title="Active Referrals"
          value={affiliateData.activeReferrals || 0}
          change="+8 from last week"
          label="Active Referrals"
          helper="Currently active referred users"
          icon={<Users className="text-blue-500" />}
        />
        <MetricCard 
          title="Conversion Rate"
          value={`${affiliateData.conversionRate?.toFixed(2) || '0.00'}%`}
          change="+2.1% from last month"
          label="Conversion Rate"
          helper="Percentage of referrals that convert"
          icon={<TrendingUp className="text-purple-500" />}
        />
        <MetricCard 
          title="Commission Rate"
          value={`${affiliateData.commissionRate?.toFixed(2) || '0.00'}%`}
          change="Stable"
          label="Commission Rate"
          helper="Current commission percentage"
          icon={<Share2 className="text-orange-500" />}
        />
      </div>

      <SectionCard title="Affiliate Program Details" subtitle="Your personalized affiliate program information and tools.">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Program Overview</h3>
          <p className="text-gray-600 mb-4">
            Your affiliate link: <code className="bg-gray-100 p-1 rounded">https://finger-mobile.com/refer/{affiliateData.referralCode || 'your-code'}</code>
          </p>
          <p className="text-gray-600">
            Share this link with others to earn commissions when they sign up and engage with our platform.
            You'll earn {affiliateData.commissionRate?.toFixed(2) || '5.00'}% on all eligible transactions
            made by users who sign up through your referral link.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Referral Activity" subtitle="Recent activity from your referred users.">
        <DataTable
          columns={[
            { key: 'date', header: 'Date' },
            { key: 'referral', header: 'Referral' },
            { key: 'action', header: 'Action' },
            { key: 'commission', header: 'Commission' },
            { key: 'status', header: 'Status' }
          ]}
          rows={affiliateData.activity || []}
        />
      </SectionCard>
    </AppShell>
  );
};

export default AffiliatePage;