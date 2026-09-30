import React, { useCallback } from 'react';

import { useAppContext } from '../contexts/AppContext';
import { useMonetization } from '../contexts/MonetizationContext';
import MonetizationDashboard from '../components/dashboard/MonetizationDashboard';
import GemTransactions from '../components/dashboard/GemTransactions';
import EarningsAnalytics from '../components/dashboard/EarningsAnalytics';

// --- Static Matrix Configuration Datastructure ---
interface ResourceLink {
  id: string;
  href: string;
  title: string;
  description?: string;
  bgClass: string;
  iconPath: string;
}

const MONETIZATION_RESOURCES: ResourceLink[] = [
  {
    id: 'creator-academy',
    href: '#',
    title: 'Creator Academy',
    description: 'Learn how to grow your audience and maximize earnings',
    bgClass: 'bg-blue-100 text-blue-600',
    iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
  },
  {
    id: 'community-guidelines',
    href: '#',
    title: 'Community Guidelines',
    description: 'Understand policies to keep your account in good standing',
    bgClass: 'bg-green-100 text-green-600',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    id: 'payment-settings',
    href: '#',
    title: 'Payment Settings',
    description: 'Manage your payment information and withdrawal settings',
    bgClass: 'bg-purple-100 text-purple-600',
    iconPath: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
  }
];

// --- Subcomponent: Unauthenticated Gateway Screen ---
const UnauthenticatedGate: React.FC = React.memo(() => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-xl mx-auto border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Monetization Dashboard</h1>
      <p className="text-gray-600 mb-6">You need to be logged in to view monetization information.</p>
      <a
        href="/login"
        className="inline-block bg-brand-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-150 shadow-sm"
      >
        Sign In
      </a>
    </div>
  </div>
));

UnauthenticatedGate.displayName = 'UnauthenticatedGate';

// --- Main Container Page Component ---
const MonetizationDashboardPage: React.FC = () => {
  const { member } = useAppContext();
  const monetization = useMonetization();

  // Extract variables safely with concrete hook structural definitions
  const error = monetization?.error ?? null;
  const loading = monetization?.loading ?? false;
  const refreshEligibility = monetization?.refreshEligibility;

  const handleRefresh = useCallback(() => {
    if (refreshEligibility) {
      refreshEligibility();
    }
  }, [refreshEligibility]);

  if (!member) {
    return <UnauthenticatedGate />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Monetization Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Track your earnings, check eligibility, and manage monetization features
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:opacity-50 shadow-sm transition duration-150 shrink-0"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="-ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold">Error loading monetization telemetry</h3>
              <div className="mt-1 text-sm opacity-90">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <MonetizationDashboard />
          <EarningsAnalytics />
        </div>

        <div className="space-y-8">
          <GemTransactions />

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monetization Resources</h2>
            <div className="space-y-4">
              {MONETIZATION_RESOURCES.map((resource) => (
                <a
                  key={resource.id}
                  href={resource.href}
                  className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition duration-150"
                >
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 rounded-lg p-2 ${resource.bgClass}`}>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={resource.iconPath} />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">{resource.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonetizationDashboardPage;
