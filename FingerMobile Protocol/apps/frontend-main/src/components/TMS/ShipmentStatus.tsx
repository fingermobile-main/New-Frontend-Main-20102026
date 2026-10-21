import React, {} from 'react';

interface ShipmentStatusProps {
  status?: string;
  progress?: number;
  estimatedArrival?: string;
  [key: string]: any;
}

const ShipmentStatus: React.FC<ShipmentStatusProps> = ({ status, progress, estimatedArrival }) => {
  return (
    <div>
      <h2>ShipmentStatus: {status || 'Unknown'}</h2>
      <p>Progress: {progress || 0}%</p>
      <p>Estimated Arrival: {estimatedArrival || 'N/A'}</p>
    </div>
  );
};

export default ShipmentStatus;
