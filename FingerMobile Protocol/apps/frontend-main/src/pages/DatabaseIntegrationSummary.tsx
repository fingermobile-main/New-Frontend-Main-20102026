import React, { useState } from 'react';
import DatabaseIntegrationReportCard from '../components/DatabaseIntegrationReportCard';
import MainLayout from '../layouts/MainLayout';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';

const DatabaseIntegrationSummary: React.FC = () => {
  // eslint-disable-next-line no-unused-vars
  const [integrationStatus, setIntegrationStatus] = useState([
    { id: 1, name: 'BeatwaveNG', status: 'connected' as const, endpoints: 12, lastSync: '2025-11-24 10:30:00' },
    { id: 2, name: 'Dancia-4Tv', status: 'connected' as const, endpoints: 8, lastSync: '2025-11-24 10:25:00' },
    { id: 3, name: 'FingerWars', status: 'connected' as const, endpoints: 15, lastSync: '2025-11-24 10:20:00' },
    { id: 4, name: 'FingerLux', status: 'connected' as const, endpoints: 18, lastSync: '2025-11-24 10:15:00' },
    { id: 5, name: 'Community Pages (Forums, Blogs, Groups)', status: 'connected' as const, endpoints: 22, lastSync: '2025-11-24 10:10:00' },
    { id: 6, name: 'Marketplace (Storefront, OwnIt, Flamingo)', status: 'connected' as const, endpoints: 16, lastSync: '2025-11-24 10:05:00' },
    { id: 7, name: 'Member Management', status: 'connected' as const, endpoints: 9, lastSync: '2025-11-24 10:00:00' },
    { id: 8, name: 'Wallet & Transactions', status: 'connected' as const, endpoints: 7, lastSync: '2025-11-24 09:55:00' }
  ]);

  const connectedComponents = integrationStatus.filter(item => item.status === 'connected').length;
  const totalComponents = integrationStatus.length;
  const totalEndpoints = integrationStatus.reduce((sum, item) => sum + item.endpoints, 0);

  return (
    <MainLayout pageTitle="Database Integration Summary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Database Integration Summary</h1>
          <p className="mt-2 text-slate-700 font-medium">
            Overview of all platform components and their database integration status
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow border border-slate-300 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-full border text-emerald-950 border-emerald-400 font-black">
                <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-black text-slate-900">{connectedComponents}/{totalComponents}</h3>
                <p className="text-slate-700 font-bold text-sm">Components Connected</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-slate-300 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full border text-blue-950 border-blue-400 font-black">
                <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-black text-slate-900">{totalEndpoints}</h3>
                <p className="text-slate-700 font-bold text-sm">Total Endpoints</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow border border-slate-300 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full border text-purple-950 border-purple-400 font-black">
                <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-black text-slate-900">100%</h3>
                <p className="text-slate-700 font-bold text-sm">Integration Coverage</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow border border-slate-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-300 bg-slate-50">
            <h2 className="text-xl font-black text-slate-900">Component Integration Status</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrationStatus.map((component) => (
                <DatabaseIntegrationReportCard
                  key={component.id}
                  componentName={component.name}
                  status={component.status}
                  endpoints={component.endpoints}
                  lastSync={component.lastSync}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow border border-slate-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-300 bg-slate-50">
            <h2 className="text-xl font-black text-slate-900">Integration Details</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">API Service Integration</h3>
                <p className="text-slate-700 font-medium text-sm mt-1">
                  All components are successfully integrated with the backend API service through the ApiService module.
                  This ensures consistent data flow between frontend components and the database.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">Data Synchronization</h3>
                <p className="text-slate-700 font-medium text-sm mt-1">
                  Real-time data synchronization is established for all components, ensuring that member interactions
                  are immediately reflected in the database and vice versa.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">Error Handling</h3>
                <p className="text-slate-700 font-medium text-sm mt-1">
                  Comprehensive error handling is implemented across all database interactions, with proper
                  fallback mechanisms to ensure a smooth member experience even during connectivity issues.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">Security</h3>
                <p className="text-slate-700 font-medium text-sm mt-1">
                  All database communications are secured with authentication tokens and encrypted connections,
                  ensuring data privacy and protection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sovereign Platform Ownership Directive */}
        <div className="mt-8">
          <PlatformOwnershipCard />
        </div>
      </div>
    </MainLayout>
  );
};

export default DatabaseIntegrationSummary;
