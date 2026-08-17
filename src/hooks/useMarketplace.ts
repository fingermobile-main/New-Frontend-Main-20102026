import React, {} from 'react';
import {
  MarketplaceContext,
  // Don't import MarketplaceContextType directly from the file
} from '../contexts/MarketplaceContext';

// Get the type from the context itself
type MarketplaceContextType = React.ContextType<typeof MarketplaceContext>;

export const useMarketplace = (): MarketplaceContextType => {
  const ctx = React.useContext(MarketplaceContext);
  if (!ctx) {
    throw new Error("useMarketplace must be used within MarketplaceProvider");
  }
  
  return ctx;
};