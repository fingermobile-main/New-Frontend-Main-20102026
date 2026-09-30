import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Hallmark, HallmarkApplication } from '../types'; // Import both types
import { hallmarksService } from '../services/HallmarksService';

export interface HallmarkContextType {
  hallmarks: Hallmark[];
  hallmarkApplications: HallmarkApplication[];
  handleCreateHallmarkApplication: (application: Omit<HallmarkApplication, 'id' | 'applicant' | 'status' | 'timestamp'>) => Promise<void>;
  handleApproveHallmarkApplication: (applicationId: string) => void;
  handleRejectHallmarkApplication: (applicationId: string) => void;
  handleJoinHallmark: (hallmarkId: string) => void;
  handleUpdateHallmarkSettings: (hallmarkId: string, settings: Partial<Hallmark>) => Promise<void>;
  handleUpdateHallmark?: (hallmarkId: string, data: Partial<Hallmark>) => Promise<void>;
  handleDeleteHallmark?: (hallmarkId: string) => Promise<void>;
}

export const HallmarkContext = createContext<HallmarkContextType | undefined>(
  undefined,
);

interface HallmarkProviderProps {
  children: ReactNode;
}

export const HallmarkProvider: React.FC<HallmarkProviderProps> = ({
  children
}) => {
  const [hallmarks, setHallmarks] = React.useState<Hallmark[]>([]);
  const [hallmarkApplications, setHallmarkApplications] = React.useState<
    HallmarkApplication[]
  >([]);

  useEffect(() => {
    let mounted = true;
    hallmarksService.getAllHallmarks().then((res) => {
      if (mounted && res.data && Array.isArray(res.data)) {
        const mapped = res.data.map((h: any) => ({
          id: String(h.id),
          name: h.name,
          slug: h.name ? h.name.toLowerCase().replace(/\s+/g, '-') : `hallmark-${h.id}`,
          description: h.description,
          logoUrl: h.icon || '',
          rules: h.description || '',
          category: h.category || 'community',
          rarity: h.rarity || 'common',
          owner: { id: '1', name: 'System', membername: 'system' } as any,
          members: [],
          posts: [],
          settings: {
            memberLimit: 1000,
            permissions: { canPost: true, canInvite: true },
            durationMonths: 12,
            joinFee: 0
          }
        }));
        setHallmarks(mapped);
      }
    }).catch(err => {
      console.warn('Failed to load hallmarks from API:', err);
    });
    return () => { mounted = false; };
  }, []);

  const handleCreateHallmarkApplication = async (applicationData: Omit<HallmarkApplication, 'id' | 'applicant' | 'status' | 'timestamp'>) => {
    console.info('Creating hallmark application:', applicationData);
    try {
      const res = await hallmarksService.createHallmark({
        name: applicationData.requestedHallmark.name,
        description: applicationData.requestedHallmark.rules || 'Hallmark community badge',
        category: 'community',
        rarity: 'rare',
        icon: applicationData.requestedHallmark.logoUrl
      });

      const newId = res.hallmark?.id ? String(res.hallmark.id) : Math.random().toString(36).substr(2, 9);
      const newApplication: HallmarkApplication = {
        ...applicationData,
        id: newId,
        applicant: { id: 'current-user', name: 'Current User', membername: 'currentuser', avatarUrl: '', isSubscribed: true, isVerified: true } as any,
        status: 'pending',
        timestamp: new Date().toISOString(),
        requestedHallmark: applicationData.requestedHallmark || {
          name: 'Default Hallmark',
          slug: 'default-hallmark',
          logoUrl: '',
          rules: 'Default rules',
          settings: {
            memberLimit: 100,
            permissions: {
              canPost: true,
              canInvite: true
            },
            durationMonths: 12,
            joinFee: 0
          }
        }
      };
      setHallmarkApplications(prev => [...prev, newApplication]);
    } catch (err) {
      console.error('Failed to create hallmark application:', err);
      throw err;
    }
  };

  const handleJoinHallmark = async (hallmarkId: string) => {
    console.info(`Joining hallmark: ${hallmarkId}`);
    try {
      const numericId = parseInt(hallmarkId, 10);
      if (!isNaN(numericId)) {
        await hallmarksService.awardHallmark({
          userId: '4', // current active test user / fallback
          hallmarkId: numericId,
          reason: 'User joined hallmark'
        });
      }
    } catch (err) {
      console.warn('Failed to persist user hallmark join to database:', err);
    }

    setHallmarks(prev => prev.map(h =>
      h.id === hallmarkId ? { ...h, members: [...(h.members || []), 'current-user'] } : h
    ));
  };

  const handleUpdateHallmarkSettings = async (hallmarkId: string, settings: Partial<Hallmark>) => {
    console.info(`Updating hallmark ${hallmarkId} with:`, settings);
    setHallmarks(prev => prev.map(h =>
      h.id === hallmarkId ? { ...h, ...settings } : h
    ));
  };

  const handleApproveHallmarkApplication = async (applicationId: string) => {
    console.info(`Approving application: ${applicationId}`);
    const app = hallmarkApplications.find(a => a.id === applicationId);
    if (app) {
      const numericId = parseInt(applicationId, 10);
      if (!isNaN(numericId)) {
        try {
          await hallmarksService.awardHallmark({
            userId: String(app.applicantId || app.applicant?.id || '4'),
            hallmarkId: numericId,
            reason: 'Hallmark application approved'
          });
        } catch (err) {
          console.warn('Failed to persist hallmark award:', err);
        }
      }

      setHallmarkApplications(prev => prev.map(a =>
        a.id === applicationId ? { ...a, status: 'approved' } : a
      ));

      const newHallmark: Hallmark = {
        id: applicationId,
        ...app.requestedHallmark,
        owner: app.applicant,
        members: [app.applicant.id],
        posts: []
      };
      setHallmarks(prev => [...prev, newHallmark]);
    }
  };

  const handleRejectHallmarkApplication = (applicationId: string) => {
    console.info(`Rejecting application: ${applicationId}`);
    setHallmarkApplications(prev => prev.map(app =>
      app.id === applicationId ? { ...app, status: 'rejected' } : app
    ));
  };

  return (
    <HallmarkContext.Provider
      value={{
        hallmarks,
        hallmarkApplications,
        handleCreateHallmarkApplication,
        handleApproveHallmarkApplication,
        handleRejectHallmarkApplication,
        handleJoinHallmark,
        handleUpdateHallmarkSettings
      }}
    >
      {children}
    </HallmarkContext.Provider>
  );
};

export const useHallmark = () => {
  const context = React.useContext(HallmarkContext);
  if (!context) {
    throw new Error('useHallmark must be used within a HallmarkProvider');
  }
  return context;
};
