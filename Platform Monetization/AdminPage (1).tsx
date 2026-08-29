import React, { useState, useEffect } from 'react';
import AppShell from './src/layouts/AppShell';
import SectionCard from './src/components/SectionCard';
import DataTable from './src/components/DataTable';
import { Button, TextInput, NumberInput, Switch, Select, Grid, Card, Text } from '@mantine/core';
import { useBusinessSuite } from './src/hooks/useBusinessSuite';

const AdminPage = () => {
  const { data: store, loading, error, fetchOverview, updateConfig } = useBusinessSuite();
  const [form, setForm] = useState({
    minimumAge: store?.config?.minimumAge ?? 18,
    minimumPayoutThreshold: store?.config?.minimumPayoutThreshold ?? 10.00,
    hallmarkMonthlyFee: store?.config?.hallmarkMonthlyFee ?? 5.00,
    hallmarkYearlyFee: store?.config?.hallmarkYearlyFee ?? 50.00,
    revenueSharePercentage: store?.config?.revenueSharePercentage ?? 50.00,
    giftsCashValue: store?.config?.giftsCashValue ?? 0.05,
    affiliateBonusPercentage: store?.config?.affiliateBonusPercentage ?? 5.00,
    supportedCountries: store?.config?.supportedCountries ?? [],
    policyVersion: store?.config?.policyVersion ?? '1.0'
  });

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleSave = async () => {
    try {
      await updateConfig(form);
      alert('Configuration updated successfully!');
    } catch (err) {
      console.error('Error updating config:', err);
      alert('Failed to update configuration');
    }
  };

  const config = store?.admin?.config;

  return (
    <AppShell activeKey="admin">
      <Grid grow>
        <Grid.Col span={12}>
          <SectionCard title="Platform Config" subtitle="These values drive global monetization behavior across the suite.">
            <Grid grow>
              <Grid.Col span={6}>
                <TextInput
                  label="Minimum Age Requirement"
                  value={form.minimumAge.toString()}
                  onChange={(e) => setForm({...form, minimumAge: parseInt(e.currentTarget.value) || 0})}
                  placeholder="18"
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Minimum Payout Threshold ($)"
                  value={form.minimumPayoutThreshold}
                  onChange={(val) => setForm({...form, minimumPayoutThreshold: val || 0})}
                  placeholder="10.00"
                  decimalScale={2}
                  min={0}
                />
              </Grid.Col>
              
              <Grid.Col span={6}>
                <NumberInput
                  label="Hallmark Monthly Fee ($)"
                  value={form.hallmarkMonthlyFee}
                  onChange={(val) => setForm({...form, hallmarkMonthlyFee: val || 0})}
                  placeholder="5.00"
                  decimalScale={2}
                  min={0}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Hallmark Yearly Fee ($)"
                  value={form.hallmarkYearlyFee}
                  onChange={(val) => setForm({...form, hallmarkYearlyFee: val || 0})}
                  placeholder="50.00"
                  decimalScale={2}
                  min={0}
                />
              </Grid.Col>
              
              <Grid.Col span={6}>
                <NumberInput
                  label="Revenue Share Percentage (%)"
                  value={form.revenueSharePercentage}
                  onChange={(val) => setForm({...form, revenueSharePercentage: val || 0})}
                  placeholder="50.00"
                  decimalScale={2}
                  min={0}
                  max={100}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput
                  label="Gifts Cash Value ($)"
                  value={form.giftsCashValue}
                  onChange={(val) => setForm({...form, giftsCashValue: val || 0})}
                  placeholder="0.05"
                  decimalScale={2}
                  min={0}
                />
              </Grid.Col>
              
              <Grid.Col span={6}>
                <NumberInput
                  label="Affiliate Bonus Percentage (%)"
                  value={form.affiliateBonusPercentage}
                  onChange={(val) => setForm({...form, affiliateBonusPercentage: val || 0})}
                  placeholder="5.00"
                  decimalScale={2}
                  min={0}
                  max={100}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Supported Countries (comma-separated)"
                  value={form.supportedCountries.join(', ')}
                  onChange={(e) => setForm({
                    ...form, 
                    supportedCountries: e.currentTarget.value.split(',').map(s => s.trim())
                  })}
                  placeholder="US, CA, GB, AU"
                />
              </Grid.Col>
              
              <Grid.Col span={6}>
                <TextInput
                  label="Policy Version"
                  value={form.policyVersion}
                  onChange={(e) => setForm({...form, policyVersion: e.currentTarget.value})}
                  placeholder="1.0"
                />
              </Grid.Col>
            </Grid>
            
            <Button onClick={handleSave} mt="md">Save Configuration</Button>
          </SectionCard>
        </Grid.Col>
        
        <Grid.Col span={12}>
          <SectionCard title="Webhook Monitoring" subtitle="Maintenance and monitoring views for internal event delivery health.">
            <DataTable 
              columns={[
                { key: 'type', header: 'Type' },
                { key: 'status', header: 'Status' },
                { key: 'received', header: 'Received' }
              ]} 
              rows={(store?.admin?.webhooks ?? []).map((entry: Record<string, unknown>) => ({
                type: entry.type || '',
                status: entry.status || '',
                received: entry.received || ''
              }))} 
            />
          </SectionCard>
        </Grid.Col>
        
        <Grid.Col span={12}>
          <SectionCard title="Event Log" subtitle="Internal system events for audit and debugging.">
            <DataTable 
              columns={[
                { key: 'action', header: 'Action' },
                { key: 'target', header: 'Target' },
                { key: 'actor', header: 'Actor' },
                { key: 'created', header: 'Created' }
              ]} 
              rows={(store?.admin?.events ?? []).map((entry: Record<string, unknown>) => ({
                action: entry.action || '',
                target: entry.target || '',
                actor: entry.actor || '',
                created: entry.created || ''
              }))} 
            />
          </SectionCard>
        </Grid.Col>
      </Grid>
    </AppShell>
  );
};

export default AdminPage;