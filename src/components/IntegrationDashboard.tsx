import React, { useState } from 'react';
import { ChartBarIcon, ServerIcon as DatabaseIcon } from '@heroicons/react/24/outline';

interface IntegrationDashboardProps {
  integrations?: any[];
}

const IntegrationDashboard: React.FC<IntegrationDashboardProps> = ({ integrations }) => {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'connections' | 'logs'>('overview');

  const mockIntegrations = integrations || [
    { id: '1', name: 'Stripe', status: 'connected', lastSync: '2 hours ago' },
    { id: '2', name: 'SendGrid', status: 'connected', lastSync: '5 minutes ago' },
    { id: '3', name: 'AWS S3', status: 'error', lastSync: '1 day ago' },
    { id: '4', name: 'Google Analytics', status: 'pending', lastSync: 'Never' }
  ];

  const connectedCount = mockIntegrations.filter(i => i.status === 'connected').length;
  const errorCount = mockIntegrations.filter(i => i.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Integrations</p>
              <p className="text-3xl font-bold text-gray-900">{mockIntegrations.length}</p>
            </div>
            <DatabaseIcon className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connected</p>
              <p className="text-3xl font-bold text-green-600">{connectedCount}</p>
            </div>
            <ChartBarIcon className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-3xl font-bold text-red-600">{errorCount}</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center border text-red-950 border-red-400 font-black">
              <span className="text-red-600 font-bold">!</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-300">
        <div className="border-b border-slate-300">
          <nav className="flex space-x-8 px-6">
            {(['overview', 'connections', 'logs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {mockIntegrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-4 border border-slate-300 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-slate-700">Last sync: {integration.lastSync}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    integration.status === 'connected' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' :
                      integration.status === 'error' ? 'bg-red-100 text-red-950 border border-red-400 font-bold' :
                        'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                  }`}>
                    {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'connections' && (
            <div className="text-center py-12 text-slate-700">
              <DatabaseIcon className="w-16 h-16 mx-auto mb-4 text-slate-700" />
              <p>Connection management interface coming soon</p>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="text-center py-12 text-slate-700">
              <ChartBarIcon className="w-16 h-16 mx-auto mb-4 text-slate-700" />
              <p>Integration logs viewer coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntegrationDashboard;
