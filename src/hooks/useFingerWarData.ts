import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';

interface FingerWarTournament {id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  entryFee: number;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  status: "upcoming" | "active" | "completed";
}

interface FingerWarAchievement {id: string;
  name: string;
  description?: string;
  icon: React.ReactNode; // This will be handled in the component, not directly from API
  unlocked: boolean;
  unlockDate?: Date;
}

interface FingerWarLeaderboardEntry {rank: number;
  memberId: string;
  membername: string;
  avatarUrl: string;
  score: number;
  change: number;
}

interface FingerWarBattle {id: string;
  opponent: {id: string;
  name: string;
  avatarUrl: string;
  score: number;
  };
status: "pending" | "accepted" | "completed";
  yourScore?: number;
  opponentScore?: number;
date: Date;
}

interface FingerWarChallenge {id: string;
  title: string;
  description?: string;
  type: string;
  target: number;
  progress: number;
  reward: number;
  isClaimed: boolean;
}

interface FingerWarData {tournaments: FingerWarTournament[];
  achievements: FingerWarAchievement[];
  leaderboard: FingerWarLeaderboardEntry[];
  battles: FingerWarBattle[];
  challenges: FingerWarChallenge[];
  loading: boolean;
  error: string | null;
}

const useFingerWarData = (): FingerWarData => {
  const [tournaments, setTournaments] = React.useState<FingerWarTournament[]>([]);
  const [achievements, setAchievements] = React.useState<FingerWarAchievement[]>([]);
  const [leaderboard, setLeaderboard] = React.useState<FingerWarLeaderboardEntry[]>(
    [],
  );
  const [battles, setBattles] = React.useState<FingerWarBattle[]>([]);
  const [challenges, setChallenges] = React.useState<FingerWarChallenge[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchFingerWarData = async () => {
      try {
        setLoading(true);
        // Using axios API - response has .data property
        const [
          tournamentsRes,
          achievementsRes,
          leaderboardRes,
          battlesRes,
          challengesRes
        ] = await Promise.all([
          ApiService.request<FingerWarTournament[]>(
            "/api/fingerwar/tournaments",
            {method: "GET" },
          ),
          ApiService.request<FingerWarAchievement[]>(
            "/api/fingerwar/achievements",
            {method: "GET" },
          ),
          ApiService.request<FingerWarLeaderboardEntry[]>(
            "/api/fingerwar/leaderboard",
            {method: "GET" },
          ),
          ApiService.request<FingerWarBattle[]>("/api/fingerwar/battles", {method: "GET"
          }),
          ApiService.request<FingerWarChallenge[]>(
            "/api/fingerwar/challenges",
            {method: "GET" },
          )
        ]);

        if (tournamentsRes) {
          setTournaments(tournamentsRes as any);
        } else {
          setError("Failed to fetch tournaments.");
        }

        if (achievementsRes) {
          setAchievements(achievementsRes as any);
        } else {
          setError("Failed to fetch achievements.");
        }

        if (leaderboardRes) {
          setLeaderboard(leaderboardRes as any);
        } else {
          setError("Failed to fetch leaderboard.");
        }

        if (battlesRes) {
          setBattles(battlesRes as any);
        } else {
          setError("Failed to fetch battles.");
        }

        if (challengesRes) {
          setChallenges(challengesRes as any);
        } else {
          setError("Failed to fetch challenges.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch FingerWar data");
      } finally {
        setLoading(false);
      }
    };

    fetchFingerWarData();
  }, []);

  return {
    tournaments,
    achievements,
    leaderboard,
    battles,
    challenges,
    loading,
    error
  };
};

export default useFingerWarData;