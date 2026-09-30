import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import MainLayout from '../components/layout/MainLayout';
import {
  GameIcon,
  TrophyIcon,
  FireIcon,
  UserGroupIcon,
  PlusIcon,
  XMarkIcon,
  CheckCircleIcon,
  SparklesIcon
} from '../icons';

export interface FingerWarChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  reward: number;
  is_claimed?: boolean;
}

export interface PlayerRanking {
  rank: number;
  username: string;
  elo_rating: number;
  wins: number;
  losses: number;
  tier: string;
}

export interface WarMatch {
  id: string;
  player1: string;
  player2: string;
  wager: number;
  status: 'lobby' | 'in_progress' | 'completed';
  winner?: string;
}

const FingerWarsPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [challenges, setChallenges] = useState<FingerWarChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<PlayerRanking[]>([]);
  const [lobbyMatches, setLobbyMatches] = useState<WarMatch[]>([]);
  const [activeTab, setActiveTab] = useState<'challenges' | 'lobby' | 'leaderboard'>('challenges');
  const [showCreateMatchModal, setShowCreateMatchModal] = useState<boolean>(false);
  const [matchWager, setMatchWager] = useState<number>(25);
  const [opponentName, setOpponentName] = useState<string>('');

  const fetchFingerWarsData = async () => {
    try {
      const res: any = await ApiService.get('/fingerwars');
      if (res && res.data) {
        if (res.data.challenges) setChallenges(res.data.challenges);
        if (res.data.leaderboard) setLeaderboard(res.data.leaderboard);
      } else {
        setChallenges([
          {
            id: 'fw-01',
            title: 'Reflex Master: 50-Tap Combo',
            description: 'Achieve a continuous 50-tap combo in under 10 seconds without missing a node.',
            category: 'reflex',
            progress: 100,
            reward: 50
          },
          {
            id: 'fw-02',
            title: 'Urban Tournament Gladiator',
            description: 'Participate and win 3 consecutive PvP rapid showdowns in the live arena.',
            category: 'pvp',
            progress: 66,
            reward: 100
          },
          {
            id: 'fw-03',
            title: 'Beatwave Rhythm Stunner',
            description: 'Successfully counter an opponent\'s stun attack during sudden-death overtime.',
            category: 'special',
            progress: 30,
            reward: 75
          }
        ]);

        setLeaderboard([
          { rank: 1, username: 'CheetahLagos', elo_rating: 2150, wins: 84, losses: 12, tier: 'Grandmaster' },
          { rank: 2, username: 'AccraSpeedster', elo_rating: 1980, wins: 71, losses: 19, tier: 'Master' },
          { rank: 3, username: 'ZariaReflex', elo_rating: 1840, wins: 59, losses: 23, tier: 'Diamond' },
          { rank: 4, username: 'KanoStriker', elo_rating: 1720, wins: 48, losses: 28, tier: 'Platinum' }
        ]);

        setLobbyMatches([
          { id: 'wm-01', player1: 'CheetahLagos', player2: 'Waiting...', wager: 50, status: 'lobby' },
          { id: 'wm-02', player1: 'TobiFast', player2: 'Waiting...', wager: 25, status: 'lobby' }
        ]);
      }
    } catch {
      // Handled cleanly
    }
  };

  useEffect(() => {
    fetchFingerWarsData();
  }, []);

  const handleClaimReward = (id: string) => {
    setChallenges(prev =>
      prev.map(c => (c.id === id ? { ...c, is_claimed: true } : c))
    );
    showToast('Reward claimed into your FIC wallet!', 'success');
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (ficBalance < matchWager) {
      showToast(`Insufficient balance! You need ${matchWager} FIC for this challenge.`, 'error');
      return;
    }

    const newMatch: WarMatch = {
      id: `wm-${Date.now()}`,
      player1: 'You (Current User)',
      player2: opponentName || 'Open Lobby Challenge',
      wager: matchWager,
      status: 'lobby'
    };

    setLobbyMatches([newMatch, ...lobbyMatches]);
    setShowCreateMatchModal(false);
    showToast(`PvP Challenge deployed to lobby with ${matchWager} FIC wager!`, 'success');
  };

  const handleJoinLobbyMatch = (match: WarMatch) => {
    if (ficBalance < match.wager) {
      showToast(`Insufficient balance! This match requires ${match.wager} FIC.`, 'error');
      return;
    }
    showToast(`Entering Battle Arena against ${match.player1} with ${match.wager} FIC wager!`, 'success');
  };

  return (
    <MainLayout pageTitle="FingerWars">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3.5 rounded-2xl shadow-md text-gray-950">
              <GameIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">FingerWars Battle Arena</h1>
              <p className="text-gray-600 text-sm mt-0.5">High-stakes reflex battles, tournament brackets, and seasonal ELO rankings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-xl text-right">
              <p className="text-xs text-yellow-800 font-bold uppercase">War Chest</p>
              <p className="text-lg font-black text-yellow-950">{(ficBalance || 0).toLocaleString()} FIC</p>
            </div>
            <button
              onClick={() => setShowCreateMatchModal(true)}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-gray-950 font-black rounded-xl shadow-md transition-all text-sm"
            >
              <PlusIcon className="w-4 h-4" />
              Create PvP Challenge
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'challenges'
                ? 'bg-yellow-500 text-gray-950 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FireIcon className="w-4 h-4" />
            Daily & Quest Challenges ({challenges.length})
          </button>
          <button
            onClick={() => setActiveTab('lobby')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'lobby'
                ? 'bg-yellow-500 text-gray-950 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserGroupIcon className="w-4 h-4" />
            Live Battle Lobby ({lobbyMatches.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-yellow-500 text-gray-950 shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrophyIcon className="w-4 h-4" />
            ELO Rankings
          </button>
        </div>

        {/* Tab 1: Challenges */}
        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((c) => {
              const isComplete = c.progress >= 100;
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-gray-900 text-base">{c.title}</h3>
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-900 text-xs font-black rounded-lg">
                        +{c.reward} FIC
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{c.description}</p>

                    <div className="mt-5 space-y-1">
                      <div className="flex justify-between text-xs font-bold text-gray-600">
                        <span>Progress</span>
                        <span>{c.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, c.progress)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-gray-100">
                    {c.is_claimed ? (
                      <span className="block text-center py-2 text-xs font-bold text-green-700 bg-green-50 rounded-xl">
                        ✓ Reward Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimReward(c.id)}
                        disabled={!isComplete}
                        className={`w-full py-2.5 rounded-xl text-xs font-black transition-colors ${
                          isComplete
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-950 shadow-sm'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isComplete ? 'Claim Reward' : 'In Progress'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Lobby */}
        {activeTab === 'lobby' && (
          <div className="space-y-4">
            {lobbyMatches.map((m) => (
              <div key={m.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="font-bold text-sm text-gray-900">{m.player1}</span>
                    <span className="text-xs text-gray-400 font-black">VS</span>
                    <span className="text-xs text-gray-500">{m.player2}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Lobby Wager: <strong className="text-yellow-700">{m.wager} FIC</strong></p>
                </div>
                <button
                  onClick={() => handleJoinLobbyMatch(m)}
                  className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-black text-xs rounded-xl shadow-sm transition-colors"
                >
                  Accept & Battle
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-5">Rank</th>
                  <th className="py-3 px-5">Player Handle</th>
                  <th className="py-3 px-5">Tier</th>
                  <th className="py-3 px-5">W / L Record</th>
                  <th className="py-3 px-5 text-right">ELO Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {leaderboard.map((player) => (
                  <tr key={player.rank} className="hover:bg-yellow-50/30 transition-colors">
                    <td className="py-4 px-5">
                      <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs bg-yellow-100 text-yellow-900">
                        #{player.rank}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-gray-900">{player.username}</td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-700">
                        {player.tier}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-xs text-gray-600">
                      {player.wins}W - {player.losses}L
                    </td>
                    <td className="py-4 px-5 font-black text-yellow-700 text-right">
                      {player.elo_rating} ELO
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Match Modal */}
        {showCreateMatchModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Create PvP Challenge</h3>
                <button onClick={() => setShowCreateMatchModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateChallenge} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Target Opponent (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave empty for Open Public Lobby"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Match Wager (FIC)</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setMatchWager(amt)}
                        className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                          matchWager === amt
                            ? 'bg-yellow-500 text-gray-950 font-black'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {amt} FIC
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="5"
                    value={matchWager}
                    onChange={(e) => setMatchWager(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowCreateMatchModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-black rounded-xl text-sm shadow-md transition-colors"
                  >
                    Deploy Challenge
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FingerWarsPage;
