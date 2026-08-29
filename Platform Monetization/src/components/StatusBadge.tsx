import React from 'react';
import { Badge } from '@mantine/core';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className 
}) => {
  const colorMap: Record<string, string> = {
    'eligible': 'green',
    'warning': 'yellow',
    'blocked': 'red',
    'pending': 'orange',
    'active': 'green',
    'inactive': 'gray',
    'verified': 'green',
    'unverified': 'red',
  };

  return (
    <Badge 
      color={colorMap[status.toLowerCase()] || 'gray'} 
      variant="light"
      className={className}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default StatusBadge;