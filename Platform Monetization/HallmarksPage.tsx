import React, { useEffect } from 'react';
import { useBusinessSuite } from './src/hooks/useBusinessSuite';
import AppShell from './src/layouts/AppShell';
import SectionCard from './src/components/SectionCard';
import MetricCard from './src/components/MetricCard';
import { Card, Text, Grid, Button } from '@mantine/core';

const HallmarksPage = () => {
  const { data: store, loading, error, fetchOverview } = useBusinessSuite();
  
  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);
  
  const hallmarks = store?.hallmarks || {};
  
  return (
    <AppShell activeKey="hallmarks">
      <Grid>
        <Grid.Col span={12}>
          <SectionCard title="Hallmarks Program Overview" subtitle="Performance metrics and insights for the Hallmarks subscription program">
            <Grid>
              <Grid.Col span={3}>
                <MetricCard 
                  title="Active Subscribers" 
                  value={hallmarks.activeSubscribers || 0} 
                  change="+12%" 
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <MetricCard 
                  title="Monthly Revenue" 
                  value={`$${hallmarks.monthlyRevenue || 0}`} 
                  change="+8%" 
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <MetricCard 
                  title="Conversion Rate" 
                  value={`${hallmarks.conversionRate || 0}%`} 
                  change="+2%" 
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <MetricCard 
                  title="Avg. Retention" 
                  value={`${hallmarks.avgRetention || 0} days`} 
                  change="+5%" 
                />
              </Grid.Col>
            </Grid>
          </SectionCard>
        </Grid.Col>
        
        <Grid.Col span={12}>
          <SectionCard title="Subscription Tiers" subtitle="Different tiers offered in the Hallmarks program">
            <Grid>
              <Grid.Col span={4}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text fz="lg" fw={500}>Basic Tier</Text>
                  <Text fz="xl" fw={700} mt="md">${hallmarks.basicTierPrice || 0}/month</Text>
                  <Text fz="sm" c="dimmed" mt="sm">Access to basic features</Text>
                  <Button variant="light" color="blue" fullWidth mt="md">
                    Manage
                  </Button>
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text fz="lg" fw={500}>Premium Tier</Text>
                  <Text fz="xl" fw={700} mt="md">${hallmarks.premiumTierPrice || 0}/month</Text>
                  <Text fz="sm" c="dimmed" mt="sm">Access to premium features</Text>
                  <Button variant="light" color="blue" fullWidth mt="md">
                    Manage
                  </Button>
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Text fz="lg" fw={500}>Enterprise Tier</Text>
                  <Text fz="xl" fw={700} mt="md">${hallmarks.enterpriseTierPrice || 0}/month</Text>
                  <Text fz="sm" c="dimmed" mt="sm">Full platform access</Text>
                  <Button variant="light" color="blue" fullWidth mt="md">
                    Manage
                  </Button>
                </Card>
              </Grid.Col>
            </Grid>
          </SectionCard>
        </Grid.Col>
      </Grid>
    </AppShell>
  );
};

export default HallmarksPage;