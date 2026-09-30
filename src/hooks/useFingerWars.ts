import React, { useState, useEffect } from 'react';
// useFingerWars.ts
// Optimized state manager orchestrating synchronous gamification updates, leaderboard analytics, and network auditing logging systems.
import { api } from '../services/api';
import integrationLogger from '../utils/integrationLogger';
import type { SuggestedMember } from '../types';

// --- Domain Typing Definitions ---

export type GamewarsChallenge = {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed' | 'pending' | 'claimed';
  createdAt: Date;
  updatedAt: Date;
  participants: string[];
  winner?: string;
  rewardValue?: number;
};

export type FingerWarChallenge = GamewarsChallenge;

export interface LeaderboardEntry {
  member: SuggestedMember;
  score: number;
  rank?: number;
}

export interface UseFingerWarsResult {
  challenges: FingerWarChallenge[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
  claimReward: (challengeId: string) => Promise<boolean>;
}

// --- Hook Implementation ---

export const useFingerWars = (): UseFingerWarsResult => {
  const [challenges, setChallenges] = React.useState<FingerWarChallenge[]>([]);
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  /**
   * Concurrency-Optimized Aggregation Strategy
   * Displaces sequential waterfalls with simultaneous execution loops
   */
  const fetchFingerWarsData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    integrationLogger.log('FingerWars', 'fetch_data_start', 'pending');

    try {
      const endpoints = [
        api.get<FingerWarChallenge[]>('/fingerwars/challenges'),
        api.get<LeaderboardEntry[]>('/fingerwars/leaderboard')
      ];

      const [challengesRes, leaderboardRes] = await Promise.allSettled(endpoints);

      // 1. Process Challenges Target Array
      if (challengesRes.status === 'fulfilled' && challengesRes.value.data) {
        setChallenges(challengesRes.value.data as FingerWarChallenge[]);
        integrationLogger.log('FingerWars', 'fetch_challenges', 'success', {
          count: challengesRes.value.data.length
        });
      } else {
        integrationLogger.log('FingerWars', 'fetch_challenges', 'error', null, 'Failed data parsing loop');
      }

      // 2. Process Competitive Leaderboard Array
      if (leaderboardRes.status === 'fulfilled' && leaderboardRes.value.data) {
        // Algorithmic optimization: Sort descending based on absolute score profile values
        const orderedLeaderboard = [...leaderboardRes.value.data as LeaderboardEntry[]]
          .sort((a, b) => b.score - a.score)
          .map((entry, idx) => ({ ...entry, rank: idx + 1 }));

        setLeaderboard(orderedLeaderboard as LeaderboardEntry[]);
        integrationLogger.log('FingerWars', 'fetch_leaderboard', 'success', {
          count: orderedLeaderboard.length
        });
      }

      integrationLogger.log('FingerWars', 'fetch_data_complete', 'success');
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Ecosystem processing exception context';
      setError('Failed to synchronize competitive match statistics.');
      integrationLogger.log('FingerWars', 'fetch_data_error', 'error', null, errorMessage);
      console.error('Global hook pipeline aggregation error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Optimistic interaction handler processing real-time claim executions
   */
  const claimReward = React.useCallback(async (challengeId: string): Promise<boolean> => {
    integrationLogger.log('FingerWars', 'claim_reward', 'pending', { challengeId });

    // Cache current layout context snapshot for data fallback recovery loops
    let previousStateSnapshot: FingerWarChallenge[] = [];

    setChallenges((prev) => {
      previousStateSnapshot = [...prev];
      return prev.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, status: 'claimed' as const }
          : challenge
      );
    });

    try {
      const claimResponse = await api.post(`/fingerwars/challenges/${challengeId}/claim`);
      if (claimResponse.data) {
        integrationLogger.log('FingerWars', 'claim_reward', 'success', { challengeId });
        return true;
      }
      throw new Error('Invalid remote assertion payload validation schema.');
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Claim execution exception processing sequence.';
      console.error('Error executing transaction claim validation paths:', err);

      // Fallback rollback orchestration
      setChallenges(previousStateSnapshot);
      setError('Failed to finalize reward allocation verification vectors.');
      integrationLogger.log('FingerWars', 'claim_reward', 'error', { challengeId }, errorMessage);
      return false;
    }
  }, []);

  // System Hook Ingress Sync Hydration Cycle
  React.useEffect(() => {
    fetchFingerWarsData();
  }, [fetchFingerWarsData]);

  // Integrated Database Health Check Auditing Processors
  const verifyDatabaseIntegration = React.useCallback(async () => {
    try {
      await integrationLogger.verifyDatabaseIntegration('FingerWars', {
        challengesCount: challenges.length,
        leaderboardCount: leaderboard.length
      });
    } catch (e) {
      console.warn('Telemetry diagnostics reporting connection failure safely ignored:', e);
    }
  }, [challenges.length, leaderboard.length]);

  React.useEffect(() => {
    if (!loading) {
      verifyDatabaseIntegration();
    }
  }, [verifyDatabaseIntegration, loading]);

  return {
    challenges,
    leaderboard,
    loading,
    error,
    refreshData: fetchFingerWarsData,
    claimReward
  };
};
