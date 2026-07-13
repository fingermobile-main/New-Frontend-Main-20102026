import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/Card';
import { DataTable } from './src/components/DataTable';
import { useBusinessSuite } from './useBusinessSuite'; // Changed from useBusinessSuiteStore to useBusinessSuite

export default function RevenuePage() {
  const { data, loading, error } = useBusinessSuite(); // Changed from store to data

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Type', accessor: 'type' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Status', accessor: 'status' },
  ];

  const paymentHistory = data?.revenue?.paymentHistory || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Revenue Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Track your earnings and payment history
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Earnings</CardTitle>
            <CardDescription>Your earnings today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.revenue?.todayEarnings?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>Earnings this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.revenue?.thisWeekEarnings?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
            <CardDescription>Earnings this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.revenue?.thisMonthEarnings?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>All Time</CardTitle>
            <CardDescription>Total lifetime earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.revenue?.allTimeEarnings?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Ads Revenue</CardTitle>
            <CardDescription>Revenue from ads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.revenue?.adsRevenue?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Gifts Revenue</CardTitle>
            <CardDescription>Revenue from gifts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.revenue?.giftsRevenue?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Subscription Revenue</CardTitle>
            <CardDescription>Revenue from subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.revenue?.subscriptionRevenue?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={paymentHistory} />
        </CardContent>
      </Card>
    </div>
  );
}