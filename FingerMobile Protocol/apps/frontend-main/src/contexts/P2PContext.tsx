import React, { useState, useEffect } from 'react';
import { useAppContext } from './AppContext';
import { useOnboarding } from './OnboardingContext';

interface P2PContextType {
  connectedPeers: number;
  speedMultiplier: number;
  activeTransfers: number;
  cesScore: number;
  accountType: 'personal' | 'creator' | 'business' | null;
  interests: string[];
  demographics: any;
}

const P2PContext = React.createContext<P2PContextType | undefined>(undefined);

export const P2PProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { showToast } = useAppContext();
  const { state: onboardingState } = useOnboarding();
  const [connectedPeers, setConnectedPeers] = React.useState(0);
  const [speedMultiplier, setSpeedMultiplier] = React.useState(1);
  const [activeTransfers, setActiveTransfers] = React.useState(0);
  const [cesScore, setCesScore] = React.useState(0);

  const accountType = onboardingState.progress?.accountType || null;
  const interests = onboardingState.progress?.interests || [];
  const demographics = onboardingState.progress?.demographicInfo || null;

  // Initialize base CES score based on verification / accountType
  useEffect(() => {
    if (accountType === 'business') {
      setCesScore(50); // Base boost for verified business
    } else if (accountType === 'creator') {
      setCesScore(20);
    } else {
      setCesScore(0);
    }
  }, [accountType]);

  // Sync bridging data with backend
  useEffect(() => {
    if (interests.length > 0 || demographics) {
      fetch('/api/p2p-matching/member-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interests, demographics, accountType })
      }).catch(err => console.error('Error syncing P2P preferences:', err));
    }
  }, [interests, demographics, accountType]);

  // Implement P2P logic here, e.g., WebRTC connections, data transfer, etc.

  const contextValue: P2PContextType = {
    connectedPeers,
    speedMultiplier,
    activeTransfers,
    cesScore,
    accountType,
    interests,
    demographics
  };

  return (
    <P2PContext.Provider value={contextValue}>{children}</P2PContext.Provider>
  );
};

export const useP2PContext = () => {
  const context = React.useContext(P2PContext);
  if (context === undefined) {
    throw new Error('useP2PContext must be used within a P2PProvider');
  }
  return context;
};

export default P2PProvider;
