import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Hallmark, HallmarkApplication } from '../types'; // Import both types

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

  const handleCreateHallmarkApplication = async (applicationData: Omit<HallmarkApplication, 'id' | 'applicant' | 'status' | 'timestamp'>) => {
    console.info("Creating hallmark application:", applicationData);
    // Mocking API call and state update
    const newApplication: HallmarkApplication = {
      ...applicationData,
      id: Math.random().toString(36).substr(2, 9),
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
  };

  const handleJoinHallmark = (hallmarkId: string) => {
    console.info(`Joining hallmark: ${hallmarkId}`);
    // Mocking state update
    setHallmarks(prev => prev.map(h => 
      h.id === hallmarkId ? { ...h, members: [...(h.members || []), 'current-user'] } : h
    ));
  };

  const handleUpdateHallmarkSettings = async (hallmarkId: string, settings: Partial<Hallmark>) => {
    console.info(`Updating hallmark ${hallmarkId} with:`, settings);
    // Mocking state update
    setHallmarks(prev => prev.map(h => 
      h.id === hallmarkId ? { ...h, ...settings } : h
    ));
  };

  const handleApproveHallmarkApplication = (applicationId: string) => {
    console.info(`Approving application: ${applicationId}`);
    setHallmarkApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: 'approved' } : app
    ));
    
    // Add to hallmarks if approved
    const app = hallmarkApplications.find(a => a.id === applicationId);
    if (app) {
      const newHallmark: Hallmark = {
        id: Math.random().toString(36).substr(2, 9),
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
    throw new Error("useHallmark must be used within a HallmarkProvider");
  }
  return context;
};
