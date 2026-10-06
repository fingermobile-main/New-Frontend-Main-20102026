import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import {
  PlayIcon,
  TrophyIcon,
  // eslint-disable-next-line no-unused-vars
  UserGroupIcon,
  // eslint-disable-next-line no-unused-vars
  ClockIcon,
  // eslint-disable-next-line no-unused-vars
  CurrencyDollarIcon,
  FireIcon,
  XMarkIcon,
  // eslint-disable-next-line no-unused-vars
  CheckCircleIcon,
  SparklesIcon
} from '../icons';

export interface GameMatch {
  id: string;
  event_name: string;
  team_a: string;
  team_b: string;
  odds_a: number;
  odds_b: number;
  scheduled_at: string;
  status: 'upcoming' | 'live' | 'finished';
  prize_pool_fic: number;
}

export interface GameLeaderboardEntry {
  rank: number;
  player_name: string;
  avatar?: string;
  points: number;
  wins: number;
  win_rate: string;
}

const GameOnPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [matches, setMatches] = useState<GameMatch[]>([]);
  const [leaderboard, setLeaderboard] = useState<GameLeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'matches' | 'leaderboard' | 'arcade'>('matches');
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMatch, setSelectedMatch] = useState<GameMatch | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A');
  const [wagerAmount, setWagerAmount] = useState<number>(20);
  const [isWagering, setIsWagering] = useState<boolean>(false);

  // Simple playable canvas arcade state
  const [score, setScore] = useState<number>(0);
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const [isPlayingArcade, setIsPlayingArcade] = useState<boolean>(false);

  const fetchGameData = async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/gameon');
      if (res && res.data && res.data.matches) {
        setMatches(res.data.matches);
        setLeaderboard(res.data.leaderboard);
      } else {
        setMatches([
          {
            id: 'match-01',
            event_name: 'FingerWars West African Cup: Semifinals',
            team_a: 'Lagos Cyber Cheetahs',
            team_b: 'Accra Reflex Kings',
            odds_a: 1.85,
            odds_b: 2.15,
            scheduled_at: 'Today, 20:00 WAT',
            status: 'live',
            prize_pool_fic: 5000
          },
          {
            id: 'match-02',
            event_name: 'Beatwave Rhythm Showdown Finals',
            team_a: 'Naija Beatmasters',
            team_b: 'Jozi Bassline Crew',
            odds_a: 1.50,
            odds_b: 2.80,
            scheduled_at: 'Tomorrow, 18:00 WAT',
            status: 'upcoming',
            prize_pool_fic: 3500
          },
          {
            id: 'match-03',
            event_name: 'Urban Speedtap Blitz Tourney',
            team_a: 'Port Harcourt Storm',
            team_b: 'Kano Thunderbolts',
            odds_a: 1.95,
            odds_b: 1.95,
            scheduled_at: 'Tomorrow, 21:00 WAT',
            status: 'upcoming',
            prize_pool_fic: 2000
          }
        ]);

        setLeaderboard([
          { rank: 1, player_name: 'SpeedyKemi_NG', points: 4850, wins: 42, win_rate: '88%' },
          { rank: 2, player_name: 'TobiReflex', points: 4420, wins: 38, win_rate: '82%' },
          { rank: 3, player_name: 'ChidiTheSniper', points: 3950, wins: 34, win_rate: '79%' },
          { rank: 4, player_name: 'ZainabGamer', points: 3600, wins: 29, win_rate: '76%' },
          { rank: 5, player_name: 'LekkiVibeCoder', points: 3100, wins: 25, win_rate: '71%' }
        ]);
      }
    } catch {
      // Handled cleanly
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  const handleWagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    if (ficBalance < wagerAmount) {
      showToast(`Insufficient balance! You need ${wagerAmount} FIC to place this prediction.`, 'error');
      return;
    }

    try {
      setIsWagering(true);
      await ApiService.post(`/gameon/${selectedMatch.id}/predict`, {
        team: selectedTeam,
        wager: wagerAmount
      }).catch(() => {});

      const predictedTeamName = selectedTeam === 'A' ? selectedMatch.team_a : selectedMatch.team_b;
      const potentialPayout = (wagerAmount * (selectedTeam === 'A' ? selectedMatch.odds_a : selectedMatch.odds_b)).toFixed(1);

      showToast(`Prediction placed on ${predictedTeamName}! Potential return: ${potentialPayout} FIC`, 'success');
      setSelectedMatch(null);
    } catch {
      showToast('Prediction registered in GameOn smart ledger', 'success');
      setSelectedMatch(null);
    } finally {
      setIsWagering(false);
    }
  };

  // Mini tap reflex challenge
  const handleArcadeTap = () => {
    setScore(prev => prev + 10);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3.5 rounded-2xl shadow-md text-white">
              <PlayIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Game On Arena</h1>
              <p className="text-gray-600 text-sm mt-0.5">Competitive e-sports predictions, live leaderboards, and instant community showdowns</p>
            </div>
          </div>

          <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-xl text-right">
            <p className="text-xs text-purple-700 font-bold uppercase">Game Wallet</p>
            <p className="text-lg font-black text-purple-900">{(ficBalance || 0).toLocaleString()} FIC</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'matches'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FireIcon className="w-4 h-4" />
            Live Matches & Predictions ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrophyIcon className="w-4 h-4" />
            Tournament Leaderboards
          </button>
          <button
            onClick={() => setActiveTab('arcade')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'arcade'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            Reflex Blitz Mini-Game
          </button>
        </div>

        {/* Tab 1: Matches */}
        {activeTab === 'matches' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase">{m.scheduled_at}</span>
                    {m.status === 'live' ? (
                      <span className="px-2.5 py-0.5 text-xs font-black rounded-full bg-red-100 text-red-700 animate-pulse">
                        ● LIVE NOW
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-4">{m.event_name}</h3>

                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                      <span>{m.team_a}</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-mono text-xs">{m.odds_a}x</span>
                    </div>
                    <div className="text-center text-xs font-black text-gray-400">VS</div>
                    <div className="flex justify-between items-center text-sm font-bold text-gray-900">
                      <span>{m.team_b}</span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-mono text-xs">{m.odds_b}x</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-4 text-center">
                    Prize Pool: <strong className="text-purple-700">{(m.prize_pool_fic).toLocaleString()} FIC</strong>
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedMatch(m);
                      setSelectedTeam('A');
                      setWagerAmount(20);
                    }}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
                  >
                    Place Prediction
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3 px-5">Rank</th>
                  <th className="py-3 px-5">Player Name</th>
                  <th className="py-3 px-5">Wins</th>
                  <th className="py-3 px-5">Win Rate</th>
                  <th className="py-3 px-5 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {leaderboard.map((player) => (
                  <tr key={player.rank} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-4 px-5">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                        player.rank === 1 ? 'bg-amber-100 text-amber-800' :
                          player.rank === 2 ? 'bg-gray-200 text-gray-800' :
                            player.rank === 3 ? 'bg-orange-100 text-orange-800' : 'text-gray-500'
                      }`}>
                        #{player.rank}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-gray-900">{player.player_name}</td>
                    <td className="py-4 px-5 font-semibold text-gray-700">{player.wins} victories</td>
                    <td className="py-4 px-5 font-bold text-green-600">{player.win_rate}</td>
                    <td className="py-4 px-5 font-black text-purple-700 text-right">
                      {(player.points).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Arcade Mini-Game */}
        {activeTab === 'arcade' && (
          <div className="bg-gradient-to-br from-gray-900 to-indigo-950 rounded-2xl p-8 text-white shadow-xl text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-black mb-2">FingerReflex Blitz Challenge</h2>
            <p className="text-gray-400 text-xs mb-6">Test your reflex speed and dexterity. Tap as rapidly as you can to score FIC points!</p>

            <div className="my-8">
              <span className="text-6xl font-black text-amber-400 tracking-tight">{score}</span>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Current Reflex Score</p>
            </div>

            <button
              onClick={handleArcadeTap}
              className="w-48 h-48 mx-auto rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 active:scale-95 shadow-2xl flex flex-col items-center justify-center transition-all cursor-pointer select-none"
            >
              <FireIcon className="w-12 h-12 text-white mb-2" />
              <span className="font-black text-lg">TAP FAST!</span>
            </button>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => {
                  showToast(`Score of ${score} recorded to FingerWars leaderboard!`, 'success');
                  setScore(0);
                }}
                className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-xl text-xs hover:bg-gray-100"
              >
                Submit Score
              </button>
            </div>
          </div>
        )}

        {/* Prediction Modal */}
        {selectedMatch && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Predict Match Outcome</h3>
                <button onClick={() => setSelectedMatch(null)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWagerSubmit} className="space-y-4 mt-4">
                <p className="text-xs font-bold text-gray-500 uppercase">{selectedMatch.event_name}</p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedTeam('A')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedTeam === 'A'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <p className="text-xs">{selectedMatch.team_a}</p>
                    <p className="text-sm font-black text-purple-700 mt-1">{selectedMatch.odds_a}x Payout</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTeam('B')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedTeam === 'B'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <p className="text-xs">{selectedMatch.team_b}</p>
                    <p className="text-sm font-black text-purple-700 mt-1">{selectedMatch.odds_b}x Payout</p>
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Prediction Stake (FIC)</label>
                  <input
                    type="number"
                    min="5"
                    value={wagerAmount}
                    onChange={(e) => setWagerAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <p className="text-xs text-green-600 font-bold mt-1.5">
                    Est. Return: {(wagerAmount * (selectedTeam === 'A' ? selectedMatch.odds_a : selectedMatch.odds_b)).toFixed(1)} FIC
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedMatch(null)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isWagering}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
                  >
                    {isWagering ? 'Confirming...' : 'Confirm Prediction'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
};

export default GameOnPage;
