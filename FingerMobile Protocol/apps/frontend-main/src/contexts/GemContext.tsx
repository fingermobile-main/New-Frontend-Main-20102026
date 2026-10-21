import React, { useState, useEffect } from 'react';
import { Gem } from '../types';
import gemsService from '../services/gemsService';

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
  handleJoinGem: (gemId: string) => Promise<void>;
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
      id: 'gem1',
      title: 'Diamond Tier Gem',
      name: 'Diamond Tier Gem',
      slug: 'diamond-tier-gem',
      description: 'Exclusive tier community for top creators and collectors',
      owner: {
        id: 'member1',
        name: 'Member One'
      },
      category: 'achievement',
      tags: ['vip', 'creator'],
      createdAt: new Date(),
      isPublic: true,
      likes: 12,
      views: 140,
      posts: [],
      members: ['member1'],
      settings: {
        memberLimit: 500,
        permissions: { canPost: true, canInvite: true },
        durationMonths: 12,
        joinFee: 50
      }
    }
  ]);
  const [selectedGem, setSelectedGem] = React.useState<Gem | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchGems = async () => {
    try {
      setLoading(true);
      const res = await gemsService.getGems();
      if (res && res.data && res.data.length > 0) {
        const mappedGems: Gem[] = res.data.map(item => ({
          id: item.id,
          name: item.title,
          title: item.title,
          slug: item.title ? item.title.toLowerCase().replace(/\s+/g, '-') : `gem-${item.id}`,
          description: item.description,
          owner: {
            id: '1',
            name: item.creator || 'FingerMobile Protocol',
            membername: 'fingermobile'
          } as any,
          category: item.category || 'collectibles',
          tags: [item.category || 'general'],
          createdAt: new Date(),
          isPublic: true,
          likes: item.likes || 0,
          views: 100,
          posts: [],
          members: [],
          settings: {
            memberLimit: 1000,
            permissions: { canPost: true, canInvite: true },
            durationMonths: 12,
            joinFee: item.price || 0
          }
        }));
        setGems(mappedGems);
      }
    } catch (err) {
      console.warn('Failed to fetch gems from API:', err);
      setError('Failed to fetch gems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGems();
  }, []);

  const selectGem = (gem: Gem) => {
    setSelectedGem(gem);
  };

  const createGem = async (gemData: Partial<Gem>) => {
    const title = gemData.title || gemData.name || 'New Gem';
    const newGem: Gem = {
      id: `gem-${Date.now()}`,
      title,
      name: title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      description: gemData.description || '',
      owner: { id: 'current-user', name: 'Current User' } as any,
      category: gemData.category || 'collectibles',
      tags: gemData.tags || [],
      createdAt: new Date(),
      isPublic: gemData.isPublic ?? true,
      likes: 0,
      views: 0,
      posts: [],
      members: ['current-user'],
      settings: {
        memberLimit: 1000,
        permissions: { canPost: true, canInvite: true },
        durationMonths: 12,
        joinFee: 0
      },
      ...gemData
    };
    setGems(prev => [...prev, newGem]);
  };

  const updateGem = async (id: string, gemData: Partial<Gem>) => {
    setGems(prev => prev.map(g => g.id === id ? { ...g, ...gemData } : g));
  };

  const deleteGem = async (id: string) => {
    setGems(prev => prev.filter(g => g.id !== id));
  };

  const handleJoinGem = async (gemId: string) => {
    setGems(prev => prev.map(g => g.id === gemId ? { ...g, members: [...(g.members || []), 'current-user'] } : g));
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
    deleteGem,
    handleJoinGem
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
    throw new Error('useGem must be used within a GemProvider');
  }
  return context;
};
