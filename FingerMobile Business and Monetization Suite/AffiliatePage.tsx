import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/Card';
import { DataTable } from './src/components/DataTable';
import { useBusinessSuiteStore } from './business-suite-store';

export default function AffiliatePage() {
  const { data: store } = useBusinessSuiteStore();

  const columns = [
    { header: 'Metric', accessor: 'metric' },
    { header: 'Value', accessor: 'value' },
  ];

  const data = [
    { metric: 'Total Earnings', value: `$${store?.affiliate?.totalEarnings?.toFixed(2) || '0.00'}` },
    { metric: 'Active Referrals', value: store?.affiliate?.activeReferrals || 0 },
    { metric: 'Conversion Rate', value: `${store?.affiliate?.conversionRate || 0}%` },
    { metric: 'Commission Rate', value: `${store?.affiliate?.commissionRate || 0}%` },
    { metric: 'Referral Code', value: store?.affiliate?.referralCode || 'N/A' },
  ];

  const activityColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Action', accessor: 'action' },
    { header: 'Details', accessor: 'details' },
  ];

  const activityData = store?.affiliate?.activity || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Affiliate Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Track your affiliate earnings and referrals
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
            <CardDescription>Your cumulative earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${store?.affiliate?.totalEarnings?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Referrals</CardTitle>
            <CardDescription>Current active referrals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store?.affiliate?.activeReferrals || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Overall conversion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store?.affiliate?.conversionRate || 0}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Commission Rate</CardTitle>
            <CardDescription>Current commission percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store?.affiliate?.commissionRate || 0}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Data</CardTitle>
          <CardDescription>Detailed affiliate metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Activity</CardTitle>
          <CardDescription>Recent affiliate activities</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={activityColumns} data={activityData} />
        </CardContent>
      </Card>
    </div>
  );
}