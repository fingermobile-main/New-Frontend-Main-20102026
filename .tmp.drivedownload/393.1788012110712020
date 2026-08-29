import React, { useState } from 'react';
import { useBusinessSuite } from './src/hooks/useBusinessSuite';
import AppShell from './src/layouts/AppShell';
import MetricCard from './src/components/MetricCard';
import SectionCard from './src/components/SectionCard';
import DataTable from './src/components/DataTable';
import { DollarSign, Users, TrendingUp, Share2 } from 'lucide-react';

const AffiliatePage = () => {
  const { data: store, loading, error, calculateEstimate } = useBusinessSuite();
  const [referralCode, setReferralCode] = useState(store?.affiliate?.referralCode || 'ABC123');

  const affiliate = store?.affiliate || {};

  return (
    <AppShell activeKey="affiliate">
      <div className="space-y-6">
        <SectionCard title="Affiliate Dashboard" subtitle="Track your referral performance and earnings">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard 
              title="Total Earnings" 
              value={`$${affiliate.totalEarnings?.toFixed(2) || '0.00'}`} 
              change="+12.5%" 
              label="Lifetime Earnings"
              helper="Total earned from referrals"
              icon={<DollarSign className="text-green-500" />}
            />
            <MetricCard 
              title="Active Referrals" 
              value={affiliate.activeReferrals || 0} 
              change="+8.2%" 
              label="Active Referrals"
              helper="Currently active referrals"
              icon={<Users className="text-blue-500" />}
            />
            <MetricCard 
              title="Conversion Rate" 
              value={`${affiliate.conversionRate || 0}%`} 
              change="+3.1%" 
              label="Conversion Rate"
              helper="Referral conversion rate"
              icon={<TrendingUp className="text-purple-500" />}
            />
            <MetricCard 
              title="Commission Rate" 
              value={`${affiliate.commissionRate || 0}%`} 
              change="Steady" 
              label="Commission Rate"
              helper="Current commission percentage"
              icon={<Share2 className="text-orange-500" />}
            />
          </div>
        </SectionCard>

        <SectionCard title="Referral Link" subtitle="Share your unique referral link to earn commissions">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={`https://example.com/signup?ref=${referralCode}`}
              readOnly
              className="flex-grow p-3 border rounded-lg bg-gray-50"
            />
            <button
              onClick={() => navigator.clipboard.writeText(`https://example.com/signup?ref=${referralCode}`)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Copy Link
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Referral Activity" subtitle="Recent activity from your referrals">
          <DataTable 
            columns={[
              { key: 'date', header: 'Date' },
              { key: 'referral', header: 'Referral' },
              { key: 'action', header: 'Action' },
              { key: 'commission', header: 'Commission' },
              { key: 'status', header: 'Status' }
            ]} 
            rows={affiliate.activity || []} 
          />
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default AffiliatePage;