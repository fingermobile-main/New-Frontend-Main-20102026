import React, { useState } from 'react';
import { useBusinessSuite } from './src/hooks/useBusinessSuite';
import AppShell from './src/layouts/AppShell';
import SectionCard from './src/components/SectionCard';
import { Button, TextInput, Textarea, Group, Paper, Title, Divider } from '@mantine/core';
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react';

const VerificationPage = () => {
  const { data: store, loading, error, fetchOverview } = useBusinessSuite();
  const [businessForm, setBusinessForm] = useState({});
  const [payoutForm, setPayoutForm] = useState({});

  const verification = store?.verification || {};

  return (
    <AppShell activeKey="verification">
      <div className="container mx-auto p-4 space-y-6">
        <SectionCard title="Verification Dashboard" subtitle="Manage your verification status and requirements">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Paper shadow="sm" p="md" withBorder>
              <Title order={4} className="flex items-center">
                {verification.businessVerified ? 
                  <IconCheck color="green" className="mr-2" /> : 
                  <IconX color="red" className="mr-2" />
                }
                Business Verification
              </Title>
              <p className="text-sm mt-1">
                {verification.businessVerified ? 'Completed' : 'Pending'}
              </p>
            </Paper>
            
            <Paper shadow="sm" p="md" withBorder>
              <Title order={4} className="flex items-center">
                {verification.payoutVerified ? 
                  <IconCheck color="green" className="mr-2" /> : 
                  <IconX color="red" className="mr-2" />
                }
                Payout Verification
              </Title>
              <p className="text-sm mt-1">
                {verification.payoutVerified ? 'Completed' : 'Pending'}
              </p>
            </Paper>
            
            <Paper shadow="sm" p="md" withBorder>
              <Title order={4} className="flex items-center">
                {verification.identityVerified ? 
                  <IconCheck color="green" className="mr-2" /> : 
                  <IconX color="red" className="mr-2" />
                }
                Identity Verification
              </Title>
              <p className="text-sm mt-1">
                {verification.identityVerified ? 'Completed' : 'Pending'}
              </p>
            </Paper>
          </div>
        </SectionCard>

        <SectionCard title="Business Information" subtitle="Provide business details for verification">
          <div className="space-y-4">
            <TextInput label="Business Name" placeholder="Enter business name" />
            <TextInput label="Registration Number" placeholder="Enter registration number" />
            <Textarea label="Business Address" placeholder="Enter full business address" />
            <TextInput label="Tax ID" placeholder="Enter business tax identification number" />
            <Button variant="filled" color="blue">
              Submit Business Information
            </Button>
          </div>
        </SectionCard>

        <SectionCard title="Payout Method" subtitle="Configure how you receive your earnings">
          <div className="space-y-4">
            <TextInput label="Account Holder Name" placeholder="Enter account holder name" />
            <Group grow>
              <TextInput label="Account Number" placeholder="Enter account number" />
              <TextInput label="Routing Number" placeholder="Enter routing number" />
            </Group>
            <Button variant="filled" color="blue">
              Save Payout Information
            </Button>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default VerificationPage;