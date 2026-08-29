import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/Card';
import { Input } from './components/Input';
import { Label } from './components/Label';
import { Button } from './components/Button';
import { MultiSelect } from './components/MultiSelect';
import { useBusinessSuiteStore } from './business-suite-store';

export default function AdminPage() {
  type FormState = {
    minimumAge: number;
    minimumPayoutThreshold: number;
    seshatMonthlyFee: number;
    seshatYearlyFee: number;
    revenueSharePercentage: number;
    giftsCashValue: number;
    supportedCountries: string[];
    policyVersion: string;
    affiliateBonusPercentage: number;
  };

  const { data: store, updateConfig } = useBusinessSuiteStore();
  const [form, setForm] = useState<FormState>({
    minimumAge: store?.config?.minimumAge || 18,
    minimumPayoutThreshold: store?.config?.minimumPayoutThreshold || 100,
    seshatMonthlyFee: store?.config?.seshatMonthlyFee || 5,
    seshatYearlyFee: store?.config?.seshatYearlyFee || 50,
    revenueSharePercentage: store?.config?.revenueSharePercentage || 50,
    giftsCashValue: store?.config?.giftsCashValue || 0.05,
    supportedCountries: typeof store?.config?.supportedCountries === 'string' 
      ? JSON.parse(store.config.supportedCountries) 
      : store?.config?.supportedCountries || ['US', 'CA', 'GB', 'AU'],
    policyVersion: store?.config?.policyVersion || '1.0',
    affiliateBonusPercentage: store?.config?.affiliateBonusPercentage || 5,
  });

  const handleInputChange = (field: keyof typeof form, value: string | number | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert supportedCountries array back to string for API
    const configToUpdate = {
      ...form,
      supportedCountries: Array.isArray(form.supportedCountries) 
        ? JSON.stringify(form.supportedCountries)
        : form.supportedCountries
    };
    
    await updateConfig(configToUpdate);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Admin Dashboard</h3>
        <p className="text-sm text-muted-foreground">
          Manage platform configuration and view admin metrics
        </p>
      </div>
      
      {/* Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>Adjust platform-wide settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minimum-age">Minimum Age</Label>
                <Input
                  id="minimum-age"
                  type="number"
                  value={form.minimumAge}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('minimumAge', Number(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="payout-threshold">Minimum Payout Threshold ($)</Label>
                <Input
                  id="payout-threshold"
                  type="number"
                  step="0.01"
                  value={form.minimumPayoutThreshold}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('minimumPayoutThreshold', Number(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="seshat-monthly">Seshat Monthly Fee ($)</Label>
                <Input
                  id="seshat-monthly"
                  type="number"
                  step="0.01"
                  value={form.seshatMonthlyFee}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('seshatMonthlyFee', Number(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="seshat-yearly">Seshat Yearly Fee ($)</Label>
                <Input
                  id="seshat-yearly"
                  type="number"
                  step="0.01"
                  value={form.seshatYearlyFee}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('seshatYearlyFee', Number(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="revenue-share">Revenue Share Percentage (%)</Label>
                <Input
                  id="revenue-share"
                  type="number"
                  step="0.1"
                  value={form.revenueSharePercentage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('revenueSharePercentage', Number(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="gifts-value">Gifts Cash Value ($)</Label>
                <Input
                  id="gifts-value"
                  type="number"
                  step="0.01"
                  value={form.giftsCashValue}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('giftsCashValue', Number(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="affiliate-bonus">Affiliate Bonus Percentage (%)</Label>
                <Input
                  id="affiliate-bonus"
                  type="number"
                  step="0.1"
                  value={form.affiliateBonusPercentage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('affiliateBonusPercentage', Number(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="policy-version">Policy Version</Label>
                <Input
                  id="policy-version"
                  type="text"
                  value={form.policyVersion}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('policyVersion', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="supported-countries">Supported Countries</Label>
                <MultiSelect
                  id="supported-countries"
                  value={form.supportedCountries as string[]}
                  onChange={(value: string[]) => handleInputChange('supportedCountries', value)}
                  options={[
                    { label: 'United States', value: 'US' },
                    { label: 'Canada', value: 'CA' },
                    { label: 'United Kingdom', value: 'GB' },
                    { label: 'Australia', value: 'AU' },
                    { label: 'Germany', value: 'DE' },
                    { label: 'France', value: 'FR' },
                  ]}
                />
              </div>
            </div>
            
            <Button type="submit">Update Configuration</Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Admin Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>User Count</CardTitle>
            <CardDescription>Total registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store?.admin?.userCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Application Count</CardTitle>
            <CardDescription>Pending monetization applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store?.admin?.applicationCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
            <CardDescription>Overall platform revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${store?.admin?.revenueStats?.totalRevenue?.toFixed(2) || '0.00'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Webhook Status</CardTitle>
            <CardDescription>Latest webhook processing status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{store?.admin?.webhookStatus?.status || 'Unknown'}</div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}