import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/Card';
import { useBusinessSuiteStore } from './src/stores/business-suite-store';

export default function OverviewPage() {
  const { overview: data, loading, error, fetchOverview } = useBusinessSuiteStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Business Suite Overview</h3>
        <p className="text-sm text-muted-foreground">
          Your monetization platform dashboard
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Your monthly earnings</CardDescription>
          </CardHeader>
          <CardContent>
            {/* mock data path might be slightly different based on the store's BusinessSuiteOverview type */}
            <div className="text-2xl font-bold">${0.00}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
            <CardDescription>Your follower count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.eligibility?.metrics?.followers || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
            <CardDescription>Post engagement average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.eligibility?.metrics?.postEngagement30d || 0}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Watch Time</CardTitle>
            <CardDescription>Monthly watch minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.eligibility?.metrics?.watchMinutes30d ? (data.eligibility.metrics.watchMinutes30d / 1000).toFixed(1) : '0.0'}K</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}