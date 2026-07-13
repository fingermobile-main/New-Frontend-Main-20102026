import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/Card';

interface SeshatData {
  activeSubscribers?: number;
  monthlyRevenue?: number;
  conversionRate?: number;
  avgRetention?: number;
  basicTierPrice?: number;
  premiumTierPrice?: number;
  enterpriseTierPrice?: number;
}

interface SeshatPageProps {
  data?: {
    seshat?: SeshatData;
  };
}

const SeshatPage: React.FC<SeshatPageProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Seshat Page</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Active Subscribers</CardTitle>
            <CardDescription>Current Seshat subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.seshat?.activeSubscribers || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue from Seshat subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data?.seshat?.monthlyRevenue || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
            <CardDescription>Percentage of users who subscribe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.seshat?.conversionRate || 0}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Avg Retention</CardTitle>
            <CardDescription>Average subscription duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.seshat?.avgRetention || 0} days</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Basic Tier</CardTitle>
            <CardDescription>$5/month plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mt-3">${data?.seshat?.basicTierPrice || 0}/month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Premium Tier</CardTitle>
            <CardDescription>$15/month plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mt-3">${data?.seshat?.premiumTierPrice || 0}/month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Tier</CardTitle>
            <CardDescription>$50/month plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mt-3">${data?.seshat?.enterpriseTierPrice || 0}/month</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SeshatPage;