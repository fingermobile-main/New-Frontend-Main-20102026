import React, { useState } from 'react';
import { useBusinessSuite } from './useBusinessSuite';
import type { ProgramDefinition } from '@shared/types';
import AppShell from './src/layouts/AppShell';
import SectionCard from './src/components/SectionCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/Card';
import { Input } from './components/Input';
import { Label } from './components/Label';
import { Button } from './components/Button';


const MonetizationPage = () => {
  const { data, estimate, estimateRevenue } = useBusinessSuite();
  const [formData, setFormData] = useState({
    dailyViews: 10000,
    rpm: 2.5,
    cpm: 2.5,
    engagementRate: 3.5,
    subscriberCount: 10000,
    contentPerWeek: 3
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Map formData to EstimateRequest type
    const estimateRequest = {
      dailyViews: formData.dailyViews,
      rpm: formData.rpm,
      cpm: formData.cpm,
      engagementRate: formData.engagementRate,
      subscriberCount: formData.subscriberCount,
      contentPerWeek: formData.contentPerWeek,
      qualifyingViews: formData.dailyViews * 30,
      impressions: formData.dailyViews * 30,
      grossAdRevenue: formData.dailyViews * formData.rpm / 1000 * 30,
      revenueSharePercentage: 50,
      followerQualityScore: 0.75,
      contentEngagementRate: formData.engagementRate / 100,
      avgWatchTime: 120,
      videoUploadFrequency: formData.contentPerWeek,
      subscriberGrowthRate: 0.05,
      monetizationPlatformUsage: 0.6,
      contentOriginalityScore: 0.8,
      audienceDemographicMatch: 0.7,
      brandSafetyCompliance: 0.95,
      adLoadTime: 3.5,
    };
    
    try {
      await estimateRevenue(estimateRequest);
    } catch (error) {
      console.error("Error calculating estimate:", error);
    }
  };

  return (
    <AppShell activeKey="monetization">
      <div className="space-y-6">
        <SectionCard title="Revenue Estimator" subtitle="Project your potential earnings with our advanced calculator.">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Estimate</CardTitle>
              <CardDescription>Enter your metrics to calculate potential earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="daily-views">Daily Views</Label>
                    <Input
                      id="daily-views"
                      type="number"
                      value={formData.dailyViews}
                      onChange={(e) => setFormData({...formData, dailyViews: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rpm">RPM (Revenue per 1000 views)</Label>
                    <Input
                      id="rpm"
                      type="number"
                      step="0.01"
                      value={formData.rpm}
                      onChange={(e) => setFormData({...formData, rpm: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cpm">CPM (Cost per 1000 impressions)</Label>
                    <Input
                      id="cpm"
                      type="number"
                      step="0.01"
                      value={formData.cpm}
                      onChange={(e) => setFormData({...formData, cpm: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="engagement">Engagement Rate (%)</Label>
                    <Input
                      id="engagement"
                      type="number"
                      step="0.01"
                      value={formData.engagementRate}
                      onChange={(e) => setFormData({...formData, engagementRate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subscribers">Subscriber Count</Label>
                    <Input
                      id="subscribers"
                      type="number"
                      value={formData.subscriberCount}
                      onChange={(e) => setFormData({...formData, subscriberCount: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content-per-week">Content Pieces Per Week</Label>
                    <Input
                      id="content-per-week"
                      type="number"
                      value={formData.contentPerWeek}
                      onChange={(e) => setFormData({...formData, contentPerWeek: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                
                <Button type="submit">Calculate Estimate</Button>
              </form>
              
              {estimate && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <h4 className="font-medium mb-2">Estimated Results:</h4>
                  <ul className="space-y-1">
                    <li>Monthly Revenue: ${estimate.monthlyRevenue?.toFixed(2)}</li>
                    <li>Annual Revenue: ${estimate.annualRevenue?.toFixed(2)}</li>
                    <li>Estimated CPM: ${estimate.estimatedCpm?.toFixed(2)}</li>
                    <li>Revenue Share: {estimate.revenueSharePercentage}%</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </SectionCard>

        <SectionCard title="Available Programs" subtitle="Explore monetization opportunities tailored to your audience and content.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.programs?.map((program: ProgramDefinition, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold">{program.title || 'Program Title'}</h3>
                <p className="text-sm text-gray-600">{program.summary || program.description || 'Program Description'}</p>
                {program.requirements && program.requirements.length > 0 && (
                  <ul className="mt-2 text-xs">
                    {program.requirements.slice(0, 3).map((req, i) => (
                      <li key={i}>• {req}</li>
                    ))}
                  </ul>
                )}
              </div>
            )) || (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No programs available at this time.
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default MonetizationPage;