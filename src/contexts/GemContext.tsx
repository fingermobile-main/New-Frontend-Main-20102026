import React, { useState } from 'react';
import { Gem } from '../types';

// Define the context type
export interface GemContextType {
  gems: Gem[];
  selectedGem: Gem | null;
  loading: boolean;
  error: string | null;

  // Methods
  fetchGems: () => Promise<void>;
  selectGem: (gem: Gem) => void;
  createGem: (gemData: Partial<Gem>) => Promise<void>;
  updateGem: (id: string, gemData: Partial<Gem>) => Promise<void>;
  deleteGem: (id: string) => Promise<void>;
  handleJoinGem?: (gemId: string) => Promise<void>;
}

export const GemContext = React.createContext<GemContextType | undefined>(undefined);

// Provider component
interface GemProviderProps {
  children: React.ReactNode;
}

export const GemProvider: React.FC<GemProviderProps> = ({
  children
}) => {
  const [gems, setGems] = React.useState<Gem[]>([
    {
      id: "gem1",
      title: "First Gem",
      description: "This is the first gem",
      owner: {
        id: "member1",
        name: "Member One"
      },
      category: "achievement",
      tags: [],
      createdAt: new Date(),
      isPublic: true,
      likes: 0,
      views: 0,
      posts: [],
      members: []
    }
  ]);
  const [selectedGem, setSelectedGem] = React.useState<Gem | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Implementations of methods
  const fetchGems = async () => {
    // Implementation
  };

  const selectGem = (gem: Gem) => {
    setSelectedGem(gem);
  };

  const createGem = async (gemData: Partial<Gem>) => {
    // Implementation
  };

  const updateGem = async (id: string, gemData: Partial<Gem>) => {
    // Implementation
  };

  const deleteGem = async (id: string) => {
    // Implementation
  };

  const value = {
    gems,
    selectedGem,
    loading,
    error,
    fetchGems,
    selectGem,
    createGem,
    updateGem,
    deleteGem
  };

  return (
    <GemContext.Provider value={value}>
      {children}
    </GemContext.Provider>
  );
};

// Custom hook to use the context
export const useGem = () => {
  const context = React.useContext(GemContext);
  if (!context) {
    throw new Error("useGem must be used within a GemProvider");
  }
  return context;
};
