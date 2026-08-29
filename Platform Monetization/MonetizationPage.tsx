import React, { useState } from 'react';
import { useBusinessSuite } from './src/hooks/useBusinessSuite';
import AppShell from './src/layouts/AppShell';
import SectionCard from './src/components/SectionCard';
import MetricCard from './src/components/MetricCard';
import ProgramCard from './src/components/ProgramCard';
import { DollarSign, BarChart3, TrendingUp, Users } from 'lucide-react';

const MonetizationPage = () => {
  const { data: store, loading, error, calculateEstimate } = useBusinessSuite();
  const [formData, setFormData] = useState({
    dailyViews: 10000,
    rpm: 2.5,
    cpm: 2.5,
    engagementRate: 3.5,
    subscriberCount: 10000,
    contentPerWeek: 3
  });
  
  const [estimate, setEstimate] = useState(store?.estimate || null);

  const handleCalculate = async () => {
    try {
      const result = await calculateEstimate(formData);
      setEstimate(result);
    } catch (err) {
      console.error('Calculation failed:', err);
    }
  };

  return (
    <AppShell activeKey="monetization">
      <div className="space-y-6">
        <SectionCard title="Revenue Estimator" subtitle="Project your potential earnings with our advanced calculator.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Daily Views</label>
                <input
                  type="number"
                  value={formData.dailyViews}
                  onChange={(e) => setFormData({...formData, dailyViews: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">RPM (Revenue Per 1000 views)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.rpm}
                  onChange={(e) => setFormData({...formData, rpm: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Engagement Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.engagementRate}
                  onChange={(e) => setFormData({...formData, engagementRate: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subscribers</label>
                <input
                  type="number"
                  value={formData.subscriberCount}
                  onChange={(e) => setFormData({...formData, subscriberCount: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CPM (Cost Per 1000 impressions)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.cpm}
                  onChange={(e) => setFormData({...formData, cpm: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content per Week</label>
                <input
                  type="number"
                  value={formData.contentPerWeek}
                  onChange={(e) => setFormData({...formData, contentPerWeek: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={handleCalculate}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? 'Calculating...' : 'Calculate Estimate'}
              </button>
            </div>
          </div>

          {estimate && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard 
                title="Monthly Revenue"
                value={`$${estimate.monthlyRevenue?.toFixed(2) || '0.00'}`}
                change={estimate.change || ''}
                label="Monthly Revenue"
                helper="Estimated monthly earnings"
                icon={<DollarSign className="text-green-500" />}
              />
              <MetricCard 
                title="Annual Projection"
                value={`$${estimate.annualProjection?.toFixed(2) || '0.00'}`}
                change={estimate.change || ''}
                label="Annual Projection"
                helper="Projected annual earnings"
                icon={<BarChart3 className="text-blue-500" />}
              />
              <MetricCard 
                title="Daily Average"
                value={`$${estimate.dailyAverage?.toFixed(2) || '0.00'}`}
                change={estimate.change || ''}
                label="Daily Average"
                helper="Average daily earnings"
                icon={<TrendingUp className="text-purple-500" />}
              />
              <MetricCard 
                title="Potential Growth"
                value={`${estimate.potentialGrowth?.toFixed(2) || '0.00'}%`}
                change={estimate.change || ''}
                label="Potential Growth"
                helper="Estimated growth rate"
                icon={<Users className="text-orange-500" />}
              />
            </div>
          )}
        </SectionCard>

        <SectionCard title="Available Programs" subtitle="Explore monetization opportunities tailored to your audience and content.">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {store?.programs?.map((program: any, index: number) => (
              <ProgramCard 
                key={index}
                title={program.title || 'Program Title'}
                description={program.description || 'Program Description'}
                benefits={program.benefits || []}
                requirements={program.requirements || []}
                status={program.status || 'available'}
              />
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