import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/Card';
import { useBusinessSuite } from './useBusinessSuite'; // Changed from useBusinessSuiteStore to useBusinessSuite

export default function OverviewPage() {
  const { data, loading, error } = useBusinessSuite(); // Changed from store to data

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
            <div className="text-2xl font-bold">${data?.revenue?.monthRevenue?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
            <CardDescription>Your follower count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.metrics?.followers || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Engagement Rate</CardTitle>
            <CardDescription>Post engagement average</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.metrics?.postEngagement30d || 0}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Watch Time</CardTitle>
            <CardDescription>Monthly watch minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.metrics?.watchMinutes30d ? (data.metrics.watchMinutes30d / 1000).toFixed(1) : '0.0'}K</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Status</CardTitle>
            <CardDescription>Check your program eligibility</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.eligibility?.products?.map((product: { product: string; status: string; passedRules?: string[]; failedRules?: string[] }, index: number) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="font-medium">{product.product}</h4>
                <p className="text-sm text-muted-foreground">Status: {product.status}</p>
                <div className="mt-2 space-y-1">
                  {product.passedRules?.slice(0, 3).map((rule: string, idx: number) => (
                    <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                      ✓ {rule}
                    </span>
                  ))}
                  {product.failedRules?.slice(0, 3).map((rule: string, idx: number) => (
                    <span key={idx} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded mr-2">
                      ✗ {rule}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Available Programs</CardTitle>
            <CardDescription>Monetization opportunities</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.programs?.map((program: { name: string; description?: string; requirements?: string[] }, index: number) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="font-medium">{program.name}</h4>
                <p className="text-sm text-muted-foreground">{program.description}</p>
                <div className="mt-2">
                  <h5 className="text-xs font-medium">Requirements:</h5>
                  <ul className="text-xs mt-1 space-y-1">
                    {program.requirements?.map((req: string, idx: number) => (
                      <li key={idx}>• {req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}