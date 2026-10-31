import React, { useState, useEffect, useCallback } from 'react';
import { useOnboarding } from './OnboardingContext';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface P2PContextType {
  connectedPeers: number;
  speedMultiplier: number;
  activeTransfers: number;
  cesScore: number;
  accountType: 'personal' | 'creator' | 'business' | null;
  interests: string[];
  demographics: any;
  isCalibrated: boolean;
  meshStatus: 'connected' | 'calibrating' | 'offline';
  saveP2PProfile: (data: {
    interests?: string[];
    demographics?: any;
    accountType?: 'personal' | 'creator' | 'business';
    p2pAlgorithmData?: any;
  }) => Promise<void>;
  refreshP2PProfile: () => Promise<void>;
}

const P2PContext = React.createContext<P2PContextType | undefined>(undefined);

export const P2PProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { state: onboardingState } = useOnboarding();
  const { state: authState } = useAuth();

  const [connectedPeers, setConnectedPeers] = useState<number>(14);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(2.4);
  const [activeTransfers, setActiveTransfers] = useState<number>(3);
  const [cesScore, setCesScore] = useState<number>(50);
  const [accountType, setAccountType] = useState<'personal' | 'creator' | 'business' | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [demographics, setDemographics] = useState<any>(null);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);
  const [meshStatus, setMeshStatus] = useState<'connected' | 'calibrating' | 'offline'>('connected');

  // Compute active effective account type
  const resolveCurrentAccountType = useCallback((): 'personal' | 'creator' | 'business' => {
    if (onboardingState.progress?.accountType) {
      return onboardingState.progress.accountType;
    }
    if (authState.user?.role) {
      const roleLower = authState.user.role.toLowerCase();
      if (roleLower.includes('creator')) return 'creator';
      if (roleLower.includes('business')) return 'business';
    }
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const u = JSON.parse(stored);
        if (u.accountType) return u.accountType;
        if (u.role?.toLowerCase().includes('creator')) return 'creator';
        if (u.role?.toLowerCase().includes('business')) return 'business';
      }
    } catch {
      // Safe fallback
    }
    return 'personal';
  }, [onboardingState.progress?.accountType, authState.user?.role]);

  // Load and hydrate persistent P2P profile from backend / database
  const loadMemberP2PProfile = useCallback(async () => {
    const effectiveType = resolveCurrentAccountType();
    setAccountType(effectiveType);

    const userId = authState.user?.id || onboardingState.progress?.userId;
    if (!userId) {
      // Calculate baseline CES score
      const baseCes = effectiveType === 'business' ? 300 : effectiveType === 'creator' ? 150 : 50;
      setCesScore(baseCes);
      return;
    }

    try {
      setMeshStatus('calibrating');
      const res = await api.get(`/p2p-matching/member-profiles/${userId}`);
      if (res.data?.success && res.data.data) {
        const p = res.data.data;
        if (p.accountType) setAccountType(p.accountType);
        if (p.interests && Array.isArray(p.interests) && p.interests.length > 0) {
          setInterests(p.interests);
        } else if (onboardingState.progress?.interests) {
          setInterests(onboardingState.progress.interests);
        }
        if (p.demographics) setDemographics(p.demographics);

        const calculatedCes = p.cesScore || (p.accountType === 'business' ? 300 : p.accountType === 'creator' ? 150 : 50);
        setCesScore(calculatedCes);
        setIsCalibrated(true);

        // Calibrate active peer mesh values
        const interestCount = (p.interests?.length || 4);
        const peers = Math.min(32, Math.max(8, 12 + Math.floor(interestCount * 1.5)));
        setConnectedPeers(peers);
        setSpeedMultiplier(parseFloat((1.4 + (peers * 0.08)).toFixed(1)));
        setActiveTransfers(Math.floor(peers / 4));
        setMeshStatus('connected');
      }
    } catch (err) {
      // Offline fallback: calibrate using client state
      const baseCes = effectiveType === 'business' ? 300 : effectiveType === 'creator' ? 150 : 50;
      setCesScore(baseCes);
      setMeshStatus('connected');
    }
  }, [resolveCurrentAccountType, authState.user?.id, onboardingState.progress?.userId, onboardingState.progress?.interests]);

  // Sync with onboarding state changes
  useEffect(() => {
    if (onboardingState.progress?.accountType) {
      setAccountType(onboardingState.progress.accountType);
      const baseCes = onboardingState.progress.accountType === 'business' ? 300 : onboardingState.progress.accountType === 'creator' ? 150 : 50;
      setCesScore(baseCes + (onboardingState.progress.interests?.length || 0) * 5);
    }
    if (onboardingState.progress?.interests && onboardingState.progress.interests.length > 0) {
      setInterests(onboardingState.progress.interests);
    }
    if (onboardingState.progress?.demographicInfo) {
      setDemographics(onboardingState.progress.demographicInfo);
    }
  }, [
    onboardingState.progress?.accountType,
    onboardingState.progress?.interests,
    onboardingState.progress?.demographicInfo
  ]);

  // Initial load on mount or user switch
  useEffect(() => {
    loadMemberP2PProfile();
  }, [loadMemberP2PProfile]);

  // Save / Update Member P2P Profile
  const saveP2PProfile = async (data: {
    interests?: string[];
    demographics?: any;
    accountType?: 'personal' | 'creator' | 'business';
    p2pAlgorithmData?: any;
  }) => {
    const userId = authState.user?.id || onboardingState.progress?.userId || 'citizen_user';
    const finalAccountType = data.accountType || accountType || resolveCurrentAccountType();
    const finalInterests = data.interests || interests;
    const finalDemographics = data.demographics || demographics;

    try {
      const res = await api.post('/p2p-matching/member-profiles', {
        userId,
        accountType: finalAccountType,
        interests: finalInterests,
        demographics: finalDemographics,
        p2pAlgorithmData: data.p2pAlgorithmData || {
          locationBasedMatching: true,
          interestAlignment: true,
          behavioralScoring: true
        }
      });

      if (res.data?.success) {
        setAccountType(finalAccountType);
        setInterests(finalInterests);
        setDemographics(finalDemographics);
        setIsCalibrated(true);
        if (res.data.data?.cesScore) {
          setCesScore(res.data.data.cesScore);
        }
      }
    } catch (_err) {
      setAccountType(finalAccountType);
      setInterests(finalInterests);
      setDemographics(finalDemographics);
    }
  };

  const contextValue: P2PContextType = {
    connectedPeers,
    speedMultiplier,
    activeTransfers,
    cesScore,
    accountType,
    interests,
    demographics,
    isCalibrated,
    meshStatus,
    saveP2PProfile,
    refreshP2PProfile: loadMemberP2PProfile
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
