import React from 'react';
import { CommunityContext } from '../contexts/CommunityContext';

export const useCommunity = () => {
  const context = React.useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};
