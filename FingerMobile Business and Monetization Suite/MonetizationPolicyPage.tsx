import React from 'react';
import AppShell from './src/layouts/AppShell';
import SectionCard from './src/components/SectionCard';
import { Button, Checkbox /*, Text, useBusinessSuite */ } from '@mantine/core';  // Removed unused useBusinessSuite import

const MonetizationPolicyPage = () => {
  // Removed hook usage since it's not needed

  return (
    <AppShell activeKey="monetization">
      <div className="space-y-6">
        <SectionCard title="Monetization Policies" subtitle="Review and manage your monetization policies">
          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold">Community Guidelines</h3>
            <p className="text-gray-600 mb-4">
              Our community guidelines outline the standards for content and behavior on our platform. 
              These guidelines help create a positive experience for everyone.
            </p>
            
            <h3 className="text-lg font-semibold mt-6">Copyright Policy</h3>
            <p className="text-gray-600 mb-4">
              We respect intellectual property rights and expect the same from our users. 
              Our copyright policy outlines how we handle copyright infringement claims.
            </p>
            
            <h3 className="text-lg font-semibold mt-6">Revenue Sharing Terms</h3>
            <p className="text-gray-600 mb-4">
              Our revenue sharing terms detail how earnings are calculated, distributed, 
              and reported to creators participating in our monetization programs.
            </p>
            
            <h3 className="text-lg font-semibold mt-6">Ad Policy</h3>
            <p className="text-gray-600 mb-4">
              Our ad policy governs how advertisements are displayed, targeted, and measured 
              on our platform to ensure a quality experience for users and advertisers alike.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="Policy Acknowledgment" subtitle="Acknowledge receipt of updated policies">
          <div className="space-y-4">
            <Checkbox
              label="I have read and agree to the updated monetization policies"
              description="This includes all terms related to revenue sharing, content guidelines, and advertiser policies"
            />
            <Button variant="filled" color="blue">
              Acknowledge & Continue
            </Button>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
};

export default MonetizationPolicyPage;