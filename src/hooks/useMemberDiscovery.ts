import React, { useState, useEffect, useRef } from 'react';
import {
  generateDiscoverySuggestions,
  rankDiscoveredMembers,
  applyPreferenceFiltering,
  applyProximityFiltering,
  adjustDiscoveryBasedOnFeedback,
  DiscoveryPreferences,
  DiscoveryResult
} from '../services/memberDiscoveryService';
import type { Member } from '../types';

interface UseMemberDiscoveryProps {
  memberId?: string;
  enabled?: boolean;
}

interface DiscoveryFeedback {
  targetMemberId: string; 
  action: "positive" | "negative";
}

export const useMemberDiscovery = ({
  memberId,
  enabled = true
}: UseMemberDiscoveryProps) => {
  const [preferences, setPreferences] = React.useState<DiscoveryPreferences>({
    primaryOption: "multiDiversity"});

  const [discoveredMembers, setDiscoveredMembers] = React.useState<Member[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [lastDiscovery, setLastDiscovery] = React.useState<DiscoveryResult | null>(null);
  const [network, setNetwork] = React.useState<Map<string, string[]>>(new Map());

  // Cache and Feedback persistence
  const discoveryCache = React.useRef<Map<string, Member[]>>(new Map());
  const feedbackQueue = React.useRef<DiscoveryFeedback[]>([]);

  /**
   * Primary discovery sequence execution handler
   */
  const discoverMembers = React.useCallback(
    async (prefs?: DiscoveryPreferences): Promise<DiscoveryResult | null> => {
      if (!memberId || !enabled) return null;

      const discoveryPrefs = prefs || preferences;
      setIsLoading(true);
      setError(null);

      try {
        const cacheKey = `${memberId}-${discoveryPrefs.primaryOption}-${discoveryPrefs.nationsLimit || 0}-${discoveryPrefs.membersCount || 0}`;
        const cachedResult = discoveryCache.current.get(cacheKey);

        if (cachedResult) {
          setDiscoveredMembers(cachedResult);
          return {
            members: cachedResult, 
            algorithm: discoveryPrefs.primaryOption,
            metadata: { 
              totalProcessed: cachedResult.length,
              countriesIncluded: 0, 
              timestamp: new Date()
            }
          };
        }

        const result = await generateDiscoverySuggestions(discoveryPrefs);

        discoveryCache.current.set(cacheKey, result.members);
        setDiscoveredMembers(result.members);
        setLastDiscovery(result);
        return result;
      } catch (err) {
        const platformError = err instanceof Error ? err : new Error("An unknown error occurred");
        setError(platformError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [memberId, enabled, preferences]
  );

  const updatePreferences = React.useCallback((newPreferences: DiscoveryPreferences) => {
    setPreferences(newPreferences);
  }, []);

  // --- TRANSFORMATION PIPELINES (Refactored to be pure and atomic) ---

  const filterByPreferences = React.useCallback(async (currentMember: Member, members: Member[]) => {
    try {
      const filtered = await applyPreferenceFiltering(currentMember, members);
      setDiscoveredMembers(filtered);
      return filtered;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to filter members by preferences"));
      return members;
    }
  }, []);

  const filterByProximity = React.useCallback(async (members: Member[]) => {
    if (!memberId) return members;
    try {
      const filtered = await applyProximityFiltering(memberId, members);
      setDiscoveredMembers(filtered);
      return filtered;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to filter members by proximity"));
      return members;
    }
  }, [memberId]);

  const rankMembers = React.useCallback(async (currentMember: Member, members: Member[]) => {
    try {
      const ranked = await rankDiscoveredMembers(currentMember, members, network);
      setDiscoveredMembers(ranked);
      return ranked;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to rank members"));
      return members;
    }
  }, [network]);

  /**
   * Runs sequentially filtered pipeline actions in a single atomic pass
   */
  const executeFullPipeline = React.useCallback(async (currentMember: Member, baseMembers: Member[]) => {
    setIsLoading(true);
    try {
      let pipelineResult = await applyPreferenceFiltering(currentMember, baseMembers);
      if (memberId) {
        pipelineResult = await applyProximityFiltering(memberId, pipelineResult);
      }
      pipelineResult = await rankDiscoveredMembers(currentMember, pipelineResult, network);
      
      setDiscoveredMembers(pipelineResult);
      return pipelineResult;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Discovery pipeline processing failure"));
      return baseMembers;
    } finally {
      setIsLoading(false);
    }
  }, [memberId, network]);

  const provideFeedback = React.useCallback((feedback: DiscoveryFeedback) => {
    if (!memberId) return;

    feedbackQueue.current.push(feedback);
    adjustDiscoveryBasedOnFeedback(memberId, feedback);
  }, [memberId]);

  const updateNetwork = React.useCallback((newNetwork: Map<string, string[]>) => {
    setNetwork(newNetwork);
  }, []);

  // Sync state loops cleanly when settings fluctuate
  React.useEffect(() => {
    if (enabled && memberId) {
      discoverMembers();
    }
  }, [preferences, enabled, memberId, discoverMembers]);

  // Robustly handle feedback syncing loops 
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (feedbackQueue.current.length > 0) {
        console.info(`Processing and flushing ${feedbackQueue.current.length} platform feedback interactions.`);
        // Sync with backend API here
        feedbackQueue.current = []; 
      }
    }, 30000); // Evaluates queue every 30 seconds continuously

    return () => clearInterval(interval);
  }, []);

  return {
    preferences,
    discoveredMembers,
    isLoading,
    error,
    lastDiscovery,
    updatePreferences,
    discoverMembers,
    filterByPreferences,
    filterByProximity,
    rankMembers,
    executeFullPipeline,
    provideFeedback,
    updateNetwork
  };
};

export default useMemberDiscovery;