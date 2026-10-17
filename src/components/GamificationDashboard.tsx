import React, { useState, useEffect } from 'react';
import { TrophyIcon, FireIcon, GiftIcon, HeartIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  completed: boolean;
  dateCompleted?: string;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  score: number;
  level: number;
}

interface GamificationStats {
  totalPoints: number;
  currentLevel: number;
  nextLevelProgress: number;
  badgesEarned: number;
  streakDays: number;
}

const GamificationDashboard: React.FC = () => {
  const [stats, setStats] = useState<GamificationStats>({
    totalPoints: 2450,
    currentLevel: 8,
    nextLevelProgress: 65,
    badgesEarned: 12,
    streakDays: 7
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
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
    },
    {
      id: '8',
      title: 'Lapidaire Pro',
      description: 'Answer 20lapidaire questions',
      points: 250,
      icon: '❓',
      completed: false
    }
  ]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, userId: '1', username: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', score: 3200, level: 12 },
    { rank: 2, userId: '2', username: 'Sarah Williams', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', score: 2950, level: 11 },
    { rank: 3, userId: '3', username: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', score: 2750, level: 10 },
    { rank: 4, userId: '4', username: 'Emma Rodriguez', avatar: 'https://randomuser.me/api/portraits/women/68.jpg', score: 2600, level: 9 },
    { rank: 5, userId: '5', username: 'David Kim', avatar: 'https://randomuser.me/api/portraits/men/41.jpg', score: 2450, level: 8 },
    { rank: 6, userId: '6', username: 'Olivia Smith', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', score: 2300, level: 7 },
    { rank: 7, userId: '7', username: 'James Wilson', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', score: 2100, level: 6 },
    { rank: 8, userId: '8', username: 'Sophia Davis', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', score: 1950, level: 5 }
  ]);

  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'leaderboard'>('stats');

  const completedAchievements = achievements.filter(a => a.completed);
  const progressPercentage = (completedAchievements.length / achievements.length) * 100;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-slate-300">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ChartBarIcon className="h-5 w-5 inline mr-2" />
            Stats
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'achievements'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <TrophyIcon className="h-5 w-5 inline mr-2" />
            Achievements ({completedAchievements.length}/{achievements.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'leaderboard'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FireIcon className="h-5 w-5 inline mr-2" />
            Leaderboard
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full border text-blue-950 border-blue-400 font-black">
                    <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-5 border border-amber-100">
                <div className="flex items-center">
                  <div className="p-3 bg-amber-100 rounded-full border text-amber-950 border-amber-400 font-black">
                    <TrophyIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Level</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.currentLevel}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-5 border border-rose-100">
                <div className="flex items-center">
                  <div className="p-3 bg-rose-100 rounded-full">
                    <FireIcon className="h-6 w-6 text-rose-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Streak</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.streakDays} days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">Level Progress</h3>
                <span className="text-sm font-medium text-gray-700">Level {stats.currentLevel + 1}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full"
                  style={{ width: `${stats.nextLevelProgress}%` }}
                ></div>
              </div>
              <div className="mt-2 text-right text-sm text-gray-600">
                {Math.round(stats.nextLevelProgress)}% to next level
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full border text-purple-950 border-purple-400 font-black">
                  <GiftIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Badges Earned</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.badgesEarned}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Achievement Progress</h3>
                <span className="text-sm font-medium text-gray-700">
                  {completedAchievements.length}/{achievements.length} completed
                </span>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2.5 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`border rounded-lg p-4 ${
                    achievement.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-950 border border-blue-400 font-bold font-black">
                          {achievement.points} pts
                        </span>
                        {achievement.completed ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-950 border border-green-400 font-bold">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-950 border border-amber-400 font-bold font-black">
                            In Progress
                          </span>
                        )}
                      </div>
                      {achievement.dateCompleted && (
                        <p className="text-xs text-gray-500 mt-2">
                          Completed: {achievement.dateCompleted}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Rank
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      User
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Level
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {leaderboard.map((entry) => (
                    <tr key={entry.userId}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <div className="flex items-center">
                          {entry.rank <= 3 ? (
                            <span className="mr-2">
                              {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                            </span>
                          ) : null}
                          {entry.rank}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <img
                            className="h-8 w-8 rounded-full"
                            src={entry.avatar}
                            alt={entry.username}
                          />
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{entry.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-950 border border-purple-400 font-bold font-black">
                          {entry.level}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {entry.score.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationDashboard;
