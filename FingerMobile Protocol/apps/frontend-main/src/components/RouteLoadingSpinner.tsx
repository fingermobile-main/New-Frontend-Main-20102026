import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export const RouteLoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <LoadingSpinner size="lg" color="primary" label="Loading..." />
    </div>
  );
};

