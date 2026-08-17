import React, {} from 'react';

interface OrganizationVisualizationProps {
  organizedData?: any;
  onReorganize?: () => void;
}

const OrganizationVisualization: React.FC<OrganizationVisualizationProps> = ({ organizedData, onReorganize }) => {
  return (
    <div>
      <h2>OrganizationVisualization</h2>
      <p>Data: {JSON.stringify(organizedData)}</p>
      {onReorganize && <button onClick={onReorganize}>Reorganize</button>}
    </div>
  );
};

export default OrganizationVisualization;
