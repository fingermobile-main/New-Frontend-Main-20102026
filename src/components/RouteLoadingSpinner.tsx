import React from 'react';
import { SplashScreen } from './SplashScreen';

export const RouteLoadingSpinner: React.FC = () => {
  return <SplashScreen isLoading={true} message="Loading platform stage..." />;
};
