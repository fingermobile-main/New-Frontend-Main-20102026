import React, {} from 'react';

interface DatabaseIntegrationReportCardProps {
  componentName?: string;
  status?: string;
  endpoints?: number;
  lastSync?: string;
}

const DatabaseIntegrationReportCard: React.FC<DatabaseIntegrationReportCardProps> = ({ 
  componentName, 
  status, 
  endpoints, 
  lastSync 
}) => {
  return (
    <div>
      <h2>{componentName || 'DatabaseIntegrationReportCard'}</h2>
      <p>Status: {status}</p>
      <p>Endpoints: {endpoints}</p>
      <p>Last Sync: {lastSync}</p>
    </div>
  );
};

export default DatabaseIntegrationReportCard;
