import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/Card';
import { Input } from './components/Input';
import { Label } from './components/Label';
import { Button } from './components/Button';
import { useBusinessSuiteStore } from './business-suite-store';

export default function VerificationPage() {
  const { data: store, updateBusinessVerification, updatePayoutAccount } = useBusinessSuiteStore();
  
  // Initialize state with data from store or defaults
  const [businessForm, setBusinessForm] = useState({
    legalName: store?.verification?.legalName || '',
    registrationNumber: store?.verification?.registrationNumber || '',
    countryCode: store?.verification?.countryCode || 'US',
  });
  
  const [payoutForm, setPayoutForm] = useState({
    bankName: store?.revenue?.payoutAccount?.bankName || '',
    accountLast4: store?.revenue?.payoutAccount?.accountLast4 || '',
    currency: store?.revenue?.payoutAccount?.currency || 'USD',
  });

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateBusinessVerification(businessForm);
  };

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePayoutAccount(payoutForm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Verification & Payout Setup</h3>
        <p className="text-sm text-muted-foreground">
          Verify your business details and set up payout information
        </p>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Business Verification</CardTitle>
            <CardDescription>Provide your business details for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleBusinessSubmit} className="space-y-4">
              <div>
                <Label htmlFor="legal-name">Legal Business Name</Label>
                <Input
                  id="legal-name"
                  value={businessForm.legalName}
                  onChange={(e) => setBusinessForm({...businessForm, legalName: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="registration-number">Registration Number</Label>
                <Input
                  id="registration-number"
                  value={businessForm.registrationNumber}
                  onChange={(e) => setBusinessForm({...businessForm, registrationNumber: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={businessForm.countryCode}
                  onChange={(e) => setBusinessForm({...businessForm, countryCode: e.target.value})}
                />
              </div>
              
              <Button type="submit">Update Business Info</Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Payout Account</CardTitle>
            <CardDescription>Set up your payment information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              <div>
                <Label htmlFor="bank-name">Bank Name</Label>
                <Input
                  id="bank-name"
                  value={payoutForm.bankName}
                  onChange={(e) => setPayoutForm({...payoutForm, bankName: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="account-last4">Account Last 4 Digits</Label>
                <Input
                  id="account-last4"
                  value={payoutForm.accountLast4}
                  onChange={(e) => setPayoutForm({...payoutForm, accountLast4: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={payoutForm.currency}
                  onChange={(e) => setPayoutForm({...payoutForm, currency: e.target.value})}
                />
              </div>
              
              <Button type="submit">Update Payout Info</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}