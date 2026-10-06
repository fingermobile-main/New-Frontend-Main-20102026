import { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
  dateCompleted?: string;
}

interface UserLevel {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
}

interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

interface GamificationData {
  userLevel: UserLevel;
  achievements: Achievement[];
  streakInfo: StreakInfo;
  badges: string[];
  leaderboardPosition: number;
}

export function useLushGamification(userId: string) {
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load gamification data
  const loadGamificationData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/gamification/${userId}`);
      // const data = await response.json();

      // Mock data for demonstration
      const mockData: GamificationData = {
        userLevel: {
          level: 8,
          currentXP: 2450,
          xpToNextLevel: 3000,
          totalXP: 2450
        },
        achievements: [
          {
            id: '1',
            title: 'First Match',
            description: 'Get your first match on Lush Pressies',
            points: 100,
            icon: '❤️',
            completed: true,
            dateCompleted: '2026-09-28'
          },
          {
            id: '2',
            title: 'Gift Giver',
            description: 'Send your first virtual gift',
            points: 150,
            icon: '🎁',
            completed: true,
            dateCompleted: '2026-09-29'
          },
          {
            id: '3',
            title: 'Conversation Starter',
            description: 'Send your first message to a match',
            points: 200,
            icon: '💬',
            completed: true,
            dateCompleted: '2026-09-30'
          },
          {
            id: '4',
            title: 'Profile Completer',
            description: 'Complete your profile to 100%',
            points: 300,
            icon: '✅',
            completed: true,
            dateCompleted: '2026-10-01'
          },
          {
            id: '5',
            title: 'Weekly Streak',
            description: 'Be active for 7 consecutive days',
            points: 500,
            icon: '🔥',
            completed: true,
            dateCompleted: '2026-10-03'
          },
          {
            id: '6',
            title: 'Super Connector',
            description: 'Get 10 matches in a month',
            points: 400,
            icon: '🌟',
            completed: false
          },
          {
            id: '7',
            title: 'Gift Collector',
            description: 'Receive 5 gifts from matches',
            points: 350,
            icon: '💝',
            completed: false
          }
        ],
        streakInfo: {
          currentStreak: 7,
          longestStreak: 12,
          lastActiveDate: '2026-10-04'
        },
        badges: ['Early Bird', 'Night Owl', 'Social Butterfly'],
        leaderboardPosition: 24
      };

      setGamificationData(mockData);
    } catch (err) {
      setError('Failed to load gamification data');
      console.error('Error loading gamification data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Award achievement
  const awardAchievement = async (achievementId: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/gamification/award`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, achievementId })
      // });

      // Update local state
      if (gamificationData) {
        const updatedAchievements = gamificationData.achievements.map(ach =>
          ach.id === achievementId ? { ...ach, completed: true, dateCompleted: new Date().toISOString() } : ach
        );

        setGamificationData({
          ...gamificationData,
          achievements: updatedAchievements
        });
      }
    } catch (err) {
      console.error('Error awarding achievement:', err);
    }
  };

  // Grant XP
  const grantXP = async (amount: number, reason: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/gamification/xp`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId, amount, reason })
      // });

      // Update local state
      if (gamificationData) {
        const newTotalXP = gamificationData.userLevel.totalXP + amount;
        const newXpToNextLevel = gamificationData.userLevel.xpToNextLevel;
        let newLevel = gamificationData.userLevel.level;
        let newCurrentXP = gamificationData.userLevel.currentXP + amount;

        // Check if leveled up
        if (newCurrentXP >= newXpToNextLevel) {
          newLevel += 1;
          newCurrentXP = newCurrentXP - newXpToNextLevel; // Remaining XP after leveling up
        }

        setGamificationData({
          ...gamificationData,
          userLevel: {
            ...gamificationData.userLevel,
            level: newLevel,
            currentXP: newCurrentXP,
            totalXP: newTotalXP
          }
        });
      }
    } catch (err) {
      console.error('Error granting XP:', err);
    }
  };

  // Update streak
  const updateStreak = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/lushpressies/gamification/streak`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId })
      // });

      // Update local state
      if (gamificationData) {
        const today = new Date().toISOString().split('T')[0];
        const lastActive = gamificationData.streakInfo.lastActiveDate;
        const lastActiveDate = new Date(lastActive);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate.getTime() - lastActiveDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = gamificationData.streakInfo.currentStreak;
        if (diffDays === 1) {
          // Consecutive day
          newStreak += 1;
        } else if (diffDays > 1) {
          // Broke streak, reset to 1
          newStreak = 1;
        }

        const newLongestStreak = Math.max(newStreak, gamificationData.streakInfo.longestStreak);

        setGamificationData({
          ...gamificationData,
          streakInfo: {
            currentStreak: newStreak,
            longestStreak: newLongestStreak,
            lastActiveDate: today
          }
        });
      }
    } catch (err) {
      console.error('Error updating streak:', err);
    }
  };

  // Get completed achievements
  const getCompletedAchievements = () => {
    if (!gamificationData) return [];
    return gamificationData.achievements.filter(ach => ach.completed);
  };

  // Get in-progress achievements
  const getInProgressAchievements = () => {
    if (!gamificationData) return [];
    return gamificationData.achievements.filter(ach => !ach.completed);
  };

  // Initialize gamification data
  useEffect(() => {
    if (userId) {
      loadGamificationData();
    }
  }, [userId]);

  return {
    gamificationData,
    isLoading,
    error,
    loadGamificationData,
    awardAchievement,
    grantXP,
    updateStreak,
    getCompletedAchievements,
    getInProgressAchievements
  };
}
