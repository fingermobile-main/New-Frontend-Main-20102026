import React, { useState } from 'react';
import { useAppContext } from './AppContext';

interface P2PContextType {
  connectedPeers: number;
  speedMultiplier: number;
  activeTransfers: number;
  // Add other P2P related state and functions here
}

const P2PContext = React.createContext<P2PContextType | undefined>(undefined);

export const P2PProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { showToast } = useAppContext();
  const [connectedPeers, setConnectedPeers] = React.useState(0);
  const [speedMultiplier, setSpeedMultiplier] = React.useState(1);
  const [activeTransfers, setActiveTransfers] = React.useState(0);

  // Implement P2P logic here, e.g., WebRTC connections, data transfer, etc.

  const contextValue: P2PContextType = {
    connectedPeers,
    speedMultiplier,
    activeTransfers
  };

  return (
    <P2PContext.Provider value={contextValue}>{children}</P2PContext.Provider>
  );
};

export const useP2PContext = () => {
  const context = React.useContext(P2PContext);
  if (context === undefined) {
    throw new Error("useP2PContext must be used within a P2PProvider");
  }
  return context;
};

export default P2PProvider;
