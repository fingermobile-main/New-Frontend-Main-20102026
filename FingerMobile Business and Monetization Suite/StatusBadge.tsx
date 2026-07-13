import React from 'react';

interface StatusBadgeProps {
  status?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusColors = {
    eligible: 'bg-green-100 text-green-800',
    ineligible: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    review: 'bg-blue-100 text-blue-800',
  };

  // Ensure status is a string before processing
  const statusString = String(status || 'pending');
  const normalizedStatus = statusString.toLowerCase();
  const colorClass = (statusColors as Record<string, string>)[normalizedStatus] || statusColors.pending;

  // Capitalize the status for display
  const displayStatus = statusString.charAt(0).toUpperCase() + statusString.slice(1);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {displayStatus}
    </span>
  );
};