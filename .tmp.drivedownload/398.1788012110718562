import React, { useState, useEffect } from 'react';
import { useBusinessSuite } from './src/hooks/useBusinessSuite';
import AppShell from './src/layouts/AppShell';
import SectionCard from './src/components/SectionCard';
import { Button, TextInput, NumberInput, Select, Grid, Card, Text, Alert } from '@mantine/core';

const VerificationPage = () => {
  const { data, loading, error, fetchOverview } = useBusinessSuite();
  const [businessForm, setBusinessForm] = useState({});
  const [payoutForm, setPayoutForm] = useState({});

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle business verification submission
    console.log('Business form submitted:', businessForm);
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle payout verification submission
    console.log('Payout form submitted:', payoutForm);
  };

  return (
    <AppShell activeKey="verification">
      <div className="space-y-6">
        <Alert title="Verification Status" color="blue" mb="lg">
          {data?.verification?.status || 'Not yet verified'} - {data?.verification?.message || 'Complete the forms below to get verified'}
        </Alert>
        
        <Grid>
          <Grid.Col span={6}>
            <SectionCard title="Business Verification" subtitle="Provide business information for monetization eligibility">
              <Card shadow="sm" padding="lg" withBorder>
                <form onSubmit={handleBusinessSubmit}>
                  <TextInput
                    label="Business Name"
                    placeholder="Enter business name"
                    mb="md"
                    onChange={(e) => setBusinessForm({...businessForm, businessName: e.currentTarget.value})}
                  />
                  
                  <TextInput
                    label="Business Registration Number"
                    placeholder="Enter registration number"
                    mb="md"
                    onChange={(e) => setBusinessForm({...businessForm, registrationNumber: e.currentTarget.value})}
                  />
                  
                  <TextInput
                    label="Tax ID / VAT Number"
                    placeholder="Enter tax identification number"
                    mb="md"
                    onChange={(e) => setBusinessForm({...businessForm, taxId: e.currentTarget.value})}
                  />
                  
                  <Select
                    label="Country"
                    placeholder="Select your country"
                    data={[
                      { value: 'us', label: 'United States' },
                      { value: 'ca', label: 'Canada' },
                      { value: 'gb', label: 'United Kingdom' },
                      { value: 'au', label: 'Australia' },
                    ]}
                    mb="md"
                    onChange={(value: string | null) => setBusinessForm({...businessForm, country: value || ''})}
                  />
                  
                  <Button type="submit" fullWidth mt="md">
                    Submit Business Info
                  </Button>
                </form>
              </Card>
            </SectionCard>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <SectionCard title="Payout Information" subtitle="Provide payout details for receiving earnings">
              <Card shadow="sm" padding="lg" withBorder>
                <form onSubmit={handlePayoutSubmit}>
                  <TextInput
                    label="Bank Account Holder Name"
                    placeholder="Enter account holder name"
                    mb="md"
                    onChange={(e) => setPayoutForm({...payoutForm, accountHolder: e.currentTarget.value})}
                  />
                  
                  <TextInput
                    label="Bank Name"
                    placeholder="Enter bank name"
                    mb="md"
                    onChange={(e) => setPayoutForm({...payoutForm, bankName: e.currentTarget.value})}
                  />
                  
                  <TextInput
                    label="Account Number"
                    placeholder="Enter account number"
                    mb="md"
                    onChange={(e) => setPayoutForm({...payoutForm, accountNumber: e.currentTarget.value})}
                  />
                  
                  <TextInput
                    label="Routing Number"
                    placeholder="Enter routing number"
                    mb="md"
                    onChange={(e) => setPayoutForm({...payoutForm, routingNumber: e.currentTarget.value})}
                  />
                  
                  <TextInput
                    label="IBAN (if international)"
                    placeholder="Enter IBAN if applicable"
                    mb="md"
                    onChange={(e) => setPayoutForm({...payoutForm, iban: e.currentTarget.value})}
                  />
                  
                  <Button type="submit" fullWidth mt="md">
                    Save Payout Info
                  </Button>
                </form>
              </Card>
            </SectionCard>
          </Grid.Col>
        </Grid>
      </div>
    </AppShell>
  );
};

export default VerificationPage;