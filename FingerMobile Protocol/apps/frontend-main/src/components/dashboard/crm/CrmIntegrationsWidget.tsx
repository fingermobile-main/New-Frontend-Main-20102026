import React, {} from 'react';

interface CrmIntegrationsWidgetProps {
  integrations?: { name: string; connected: boolean }[];
}

const CrmIntegrationsWidget: React.FC<CrmIntegrationsWidgetProps> = ({
  integrations = [
    { name: 'Salesforce', connected: true },
    { name: 'HubSpot', connected: false },
    { name: 'Zoho', connected: true }
  ]
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">CRM Integrations</h3>
      <div className="space-y-2">
        {integrations.map((integration, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{integration.name}</span>
            <span className={`px-2 py-1 rounded text-xs ${
              integration.connected
                ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                : 'bg-red-100 text-red-950 border border-red-400 font-bold'
            }`}>
              {integration.connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrmIntegrationsWidget;
