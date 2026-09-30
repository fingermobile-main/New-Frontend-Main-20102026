import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import AdvancedFingerWar from '../components/gaming/AdvancedFingerWar';
import { useAdvancedFingerWar } from '../hooks/useAdvancedFingerWar';
import { useAuth } from '../contexts/AuthContext';
import { GamepadIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';

const AdvancedFingerWarPage: React.FC = () => {
  const { member } = useAuth();
  const memberIdString = member?.id ? (typeof member.id === 'string' ? member.id : String(member.id)) : undefined;

  const { data, loading, error, refreshData } = useAdvancedFingerWar(
    memberIdString,
  );
  const { ficBalance } = useAppContext();

  if (loading) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-6 lg:p-8 h-full text-center text-gray-500">
          Loading Advanced FingerWar data...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="p-4 sm:p-6 lg:p-8 h-full text-center text-red-500">
          Error: {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout pageTitle="Advanced FingerWar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
              <GamepadIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Advanced FingerWar
              </h1>
              <p className="text-gray-600 mt-1">
                Compete in battles, tournaments, and climb the global leaderboard
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-6 bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-700">Your FIC Balance: {data?.ficBalance}</p>
                </div>
                <button
                  onClick={refreshData}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Refresh Data
                </button>
              </div>
            </div>

            <AdvancedFingerWar />

            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Leaderboard
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                {data?.leaderboard.length === 0 && (
                  <p className="text-gray-500">No leaderboard data available.</p>
                )}
                {data?.leaderboard.map((entry: any) => (
                  <div
                    key={entry.id}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <span className="text-gray-700">
                      {entry.rank}. {entry.membername}
                    </span>
                    <span className="text-gray-900 font-semibold">{entry.score}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Stats
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <p>Battles Played: {data?.memberStats.battlesPlayed}</p>
                  <p>Wins: {data?.memberStats.wins}</p>
                  <p>Losses: {data?.memberStats.losses}</p>
                  <p>Win Rate: {(data?.memberStats.winRate || 0).toFixed(2)}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <GamepadIcon className="h-5 w-5 text-purple-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-blue-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Gaming Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-blue-50 transition-colors flex items-center">
                  <GamepadIcon className="h-5 w-5 text-purple-600 mr-3" />
                  Join Tournament
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-blue-50 transition-colors flex items-center">
                  Challenge Player
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-blue-50 transition-colors flex items-center">
                  View Achievements
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Gaming Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Practice regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Study opponent strategies</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Participate in tournaments</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdvancedFingerWarPage;
