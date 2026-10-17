/**
 * GameDashboard Component
 * Gaming statistics and achievements dashboard for GameOn
 */

import React, {} from 'react';

interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  totalPlayTime: number; // in minutes
  rank?: string;
  rankPoints: number;
}

interface Achievement {
  id: string;
  title: string;
  description?: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number; // percentage
  target?: number;
}

interface RecentGame {
  id: string;
  gameName: string;
  result: 'win' | 'loss' | 'draw';
  score: string;
  playedAt: string;
  duration: number; // in minutes
}

interface GameDashboardProps {
  playerStats: PlayerStats;
  achievements: Achievement[];
  recentGames: RecentGame[];
  className?: string;
}

const GameDashboard: React.FC<GameDashboardProps> = ({
  playerStats,
  achievements,
  recentGames,
  className = ''
}) => {
  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRankColor = (rank?: string) => {
    const colors: Record<string, string> = {
      'Bronze': 'from-orange-600 to-orange-800',
      'Silver': 'from-gray-400 to-gray-600',
      'Gold': 'from-yellow-400 to-yellow-600',
      'Platinum': 'from-cyan-400 to-cyan-600',
      'Diamond': 'from-blue-400 to-blue-600',
      'Master': 'from-purple-400 to-purple-600',
      'Grandmaster': 'from-red-500 to-red-700'
    };
    return colors[rank || 'Bronze'] || 'from-gray-500 to-gray-700';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Player Profile Card */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-xl shadow-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRankColor(playerStats.rank)} flex items-center justify-center text-2xl font-bold shadow-lg`}>
              {playerStats.level}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Level {playerStats.level}</h2>
              <p className="text-purple-200">{playerStats.rank || 'Unranked'} • {playerStats.rankPoints} RP</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-purple-200">XP Progress</p>
            <p className="text-lg font-semibold">{playerStats.xp} / {playerStats.xpToNextLevel}</p>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full bg-purple-800 rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(playerStats.xp / playerStats.xpToNextLevel) * 100}%` }}
          ></div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">{playerStats.totalGames}</p>
            <p className="text-sm text-purple-200">Total Games</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{playerStats.wins}</p>
            <p className="text-sm text-purple-200">Wins</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <p className="text-3xl font-bold">{playerStats.winRate.toFixed(1)}%</p>
            <p className="text-sm text-purple-200">Win Rate</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">🔥 {playerStats.currentStreak}</p>
            <p className="text-sm text-purple-200">Current Streak</p>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Achievements ({achievements.filter(a => a.unlocked).length}/{achievements.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.unlocked
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>

                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2 border text-gray-950 border-gray-400 font-black">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">
                        {achievement.progress}% complete
                      </p>
                    </div>
                  )}

                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Unlocked {formatDate(achievement.unlockedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Games */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Recent Games
        </h3>

        <div className="space-y-3">
          {recentGames.map(game => (
            <div
              key={game.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold ${
                  game.result === 'win' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' :
                    game.result === 'loss' ? 'bg-red-100 text-red-950 border border-red-400 font-bold' :
                      'bg-gray-200 text-gray-600'
                }`}>
                  {game.result === 'win' ? 'W' : game.result === 'loss' ? 'L' : 'D'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{game.gameName}</h4>
                  <p className="text-sm text-gray-600">{game.score} • {formatPlayTime(game.duration)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-700">{formatDate(game.playedAt)}</p>
              </div>
            </div>
          ))}
        </div>

        {recentGames.length === 0 && (
          <div className="text-center py-8 text-slate-700">
            <p>No recent games. Start playing to see your history!</p>
          </div>
        )}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Best Streak</span>
              <span className="font-semibold text-purple-600">🔥 {playerStats.bestStreak}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Play Time</span>
              <span className="font-semibold text-purple-600">⏱️ {formatPlayTime(playerStats.totalPlayTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Losses</span>
              <span className="font-semibold text-red-600">{playerStats.losses}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all font-semibold shadow-md">
              Find Match
            </button>
            <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold">
              View Leaderboard
            </button>
            <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;
