import React, { useState } from 'react';
import { useIdentityAuth } from '../contexts/IdentityAuthContext';
import { useMonetization } from '../contexts/MonetizationContext';

interface PremiumPageFeature {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  features: string[];
}

const PremiumPages: React.FC = () => {
  const identityAuth = useIdentityAuth();
  const monetization = useMonetization();
  const [selectedTier, setSelectedTier] = useState<string>('basic');
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const premiumTiers: PremiumPageFeature[] = [
    {
      id: 'basic',
      name: 'Starter Pack',
      description: 'Basic premium features to enhance your page',
      price: 10,
      currency: 'USD',
      features: [
        'Custom CTA Button',
        'Visitor List (see who visited)',
        'AI-powered writing assistance',
        'Auto-invites to followers'
      ]
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Advanced features for serious creators',
      price: 25,
      currency: 'USD',
      features: [
        'All Starter features',
        'Advanced Analytics',
        'Competitor Tracking',
        'Priority Support',
        'Custom Domain'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large businesses',
      price: 99,
      currency: 'USD',
      features: [
        'All Pro features',
        'Dedicated Account Manager',
        'Custom Integrations',
        'Advanced Security',
        'Unlimited Visitors'
      ]
    }
  ];

  const handleSubscribe = async () => {
    if (!identityAuth.currentUser) {
      setErrorMessage('Please log in to subscribe to premium pages');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await monetization.subscribeToTier(selectedTier, paymentMethod);
      setSuccessMessage(`Successfully subscribed to ${premiumTiers.find(t => t.id === selectedTier)?.name} tier!`);
    } catch (error) {
      setErrorMessage('Failed to process subscription. Please try again.');
      console.error('Subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedTierDetails = premiumTiers.find(tier => tier.id === selectedTier);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Premium Pages</h1>
      <p className="text-gray-600 mb-8">
        Upgrade your page to a premium experience with advanced features designed to boost your visibility and engagement.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {premiumTiers.map((tier) => (
          <div
            key={tier.id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedTier === tier.id
                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedTier(tier.id)} role="button" tabIndex={0}
          >
            <h3 className="text-xl font-semibold text-gray-800">{tier.name}</h3>
            <p className="text-gray-600 mt-2">{tier.description}</p>
            <div className="mt-4">
              <span className="text-2xl font-bold text-blue-600">${tier.price}</span>
              <span className="text-gray-500">/year</span>
            </div>
            <ul className="mt-4 space-y-2">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {selectedTierDetails && (
        <div className="bg-gray-50 p-6 rounded-lg border border-slate-300">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Subscribe to {selectedTierDetails.name}</h2>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div>
              <p className="text-lg font-medium text-gray-800">
                Total: <span className="font-bold text-blue-600">${selectedTierDetails.price}/{selectedTierDetails.currency}/year</span>
              </p>
            </div>

            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-md text-white font-medium ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isProcessing ? 'Processing...' : `Subscribe to ${selectedTierDetails.name}`}
            </button>
          </div>

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 text-green-950 border border-green-400 font-bold rounded-md">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-3 bg-red-100 text-red-950 border border-red-400 font-bold rounded-md">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Premium Pages Benefits</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Visitor Analytics</h3>
            <p className="text-gray-600">
              See who visited your page, including job titles and locations. Understand your audience better to tailor your content.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">AI Writing Assistance</h3>
            <p className="text-gray-600">
              Get AI-powered suggestions to improve your page content, headlines, and descriptions to match the algorithm.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Auto-Invites</h3>
            <p className="text-gray-600">
              Automatically invite highly engaged followers to visit your page based on their interactions with your content.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Competitor Tracking</h3>
            <p className="text-gray-600">
              Track competitor content and analyze trending posts to stay ahead in your niche.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPages;
