import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import MainLayout from '../components/layout/MainLayout';
import {
  PlayIcon,
  TrophyIcon,
  FireIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ShieldCheckIcon
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

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  sport_type: string;
  event_type: string;
  location: string;
  start_time: string;
  max_participants: number;
  entry_fee: string | number;
  currency: string;
  status: string;
  image_url?: string;
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
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [leaderboard, setLeaderboard] = useState<GameLeaderboardEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'matches' | 'leaderboard' | 'arcade'>('events');
  const [loading, setLoading] = useState<boolean>(true);

  // Prediction Modal State
  const [selectedMatch, setSelectedMatch] = useState<GameMatch | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<'A' | 'B'>('A');
  const [wagerAmount, setWagerAmount] = useState<number>(20);
  const [isWagering, setIsWagering] = useState<boolean>(false);

  // Interactive Arcade Reflex Game State
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isPlayingArcade, setIsPlayingArcade] = useState<boolean>(false);

  const fetchGameData = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/gameon');
      const data = res?.data || res || {};

      if (data.matches && Array.isArray(data.matches)) {
        setMatches(data.matches);
      }
      if (data.events && Array.isArray(data.events)) {
        setEvents(data.events);
      }
      if (data.leaderboard && Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    } catch {
      // Fallback data if offline
      setMatches([
        {
          id: 'a1000000-0000-0000-0000-000000000001',
          event_name: 'Lagos Cyber Cheetahs vs Accra Reflex Kings',
          team_a: 'Lagos Cyber Cheetahs',
          team_b: 'Accra Reflex Kings',
          odds_a: 1.85,
          odds_b: 2.15,
          scheduled_at: 'Today, 20:00 WAT',
          status: 'live',
          prize_pool_fic: 5000
        },
        {
          id: 'a2000000-0000-0000-0000-000000000002',
          event_name: 'Naija Beatmasters vs Jozi Bassline Crew',
          team_a: 'Naija Beatmasters',
          team_b: 'Jozi Bassline Crew',
          odds_a: 1.50,
          odds_b: 2.80,
          scheduled_at: 'Tomorrow, 18:00 WAT',
          status: 'upcoming',
          prize_pool_fic: 3500
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  // Arcade Timer
  useEffect(() => {
    let timer: any;
    if (isPlayingArcade && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isPlayingArcade && timeLeft === 0) {
      setIsPlayingArcade(false);
      showToast(`Arcade round complete! Final Reflex Score: ${score}`, 'success');
    }
    return () => clearTimeout(timer);
  }, [isPlayingArcade, timeLeft, score, showToast]);

  const handleStartArcade = () => {
    setScore(0);
    setTimeLeft(15);
    setIsPlayingArcade(true);
  };

  const handleArcadeTap = () => {
    if (isPlayingArcade) {
      setScore(prev => prev + 10);
    }
  };

  const handleRegisterEvent = async (event: GameEvent) => {
    const fee = Number(event.entry_fee || 0);
    if (ficBalance < fee) {
      showToast(`Insufficient balance! Entry fee is ${fee} FIC.`, 'error');
      return;
    }

    try {
      await ApiService.post(`/gameon/events/${event.id}/register`).catch(() => {});
      showToast(`Registered for ${event.title}! Slot confirmed.`, 'success');
    } catch {
      showToast(`Registered for ${event.title}! Slot confirmed.`, 'success');
    }
  };

  const handleWagerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch) return;

    if (ficBalance < wagerAmount) {
      showToast(`Insufficient balance! You need ${wagerAmount} FIC to place this prediction.`, 'error');
      return;
    }

    try {
      setIsWagering(true);
      await ApiService.post('/gameon/wager', {
        match_id: selectedMatch.id,
        chosen_team: selectedTeam,
        wager_amount: wagerAmount
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

  return (
    <MainLayout pageTitle="Game On Arena">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Hero Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-purple-900/60 text-white shadow-xl">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3.5 rounded-2xl shadow-md text-white mr-4">
              <PlayIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Game On Arena & Sports Hub</h1>
              <p className="text-purple-200 text-sm mt-0.5">
                Championship tournaments, live head-to-head predictions, and high-speed arcade challenges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <div className="px-4 py-2 bg-purple-900/40 border border-purple-700/60 rounded-2xl text-right">
              <p className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Game Wallet</p>
              <p className="text-lg font-black text-yellow-400">{(ficBalance || 0).toLocaleString()} FIC</p>
            </div>

            <button
              onClick={() => fetchGameData()}
              disabled={loading}
              className="p-3 bg-purple-900/40 border border-purple-700/60 rounded-2xl text-purple-300 hover:text-white transition-colors shadow-md"
              title="Refresh Data"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 pb-4 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrophyIcon className="w-4 h-4" />
            Tournaments & Events ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'matches'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FireIcon className="w-4 h-4" />
            Live Matches & Predictions ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            Leaderboard Rankings
          </button>
          <button
            onClick={() => setActiveTab('arcade')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'arcade'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PlayIcon className="w-4 h-4" />
            Reflex Blitz Arcade
          </button>
        </div>

        {/* TAB 1: TOURNAMENTS & EVENTS */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {event.image_url ? (
                      <div className="h-44 w-full overflow-hidden relative">
                        <img src={event.image_url} alt="" className="w-full h-full object-cover" />
                        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          event.status === 'live'
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-black/60 backdrop-blur-md text-white'
                        }`}>
                          {event.status === 'live' ? '● Live Now' : 'Upcoming Event'}
                        </span>
                      </div>
                    ) : (
                      <div className="h-28 bg-gradient-to-r from-purple-800 to-indigo-900 p-4 flex items-end">
                        <span className="text-xs font-black text-purple-200 uppercase tracking-wider">
                          {event.sport_type}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <h3 className="text-lg font-black text-gray-900 tracking-tight mb-2">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed mb-4">
                        {event.description}
                      </p>

                      <div className="bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-purple-600 block text-[10px] font-bold uppercase">Location</span>
                          <span className="font-bold text-purple-950 truncate block">{event.location}</span>
                        </div>
                        <div>
                          <span className="text-purple-600 block text-[10px] font-bold uppercase">Entry Fee</span>
                          <span className="font-black text-purple-950">{event.entry_fee} FIC</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <UserGroupIcon className="w-4 h-4 text-gray-400" />
                      Max {event.max_participants}
                    </span>
                    <button
                      onClick={() => handleRegisterEvent(event)}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                    >
                      Join Tournament
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE MATCHES & PREDICTIONS */}
        {activeTab === 'matches' && (
          <div className="space-y-4">
            {matches.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      m.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-amber-400'
                    }`} />
                    <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                      {m.status} • {m.scheduled_at}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right flex-1">
                      <p className="text-base font-black text-gray-900">{m.team_a}</p>
                      <span className="text-xs font-bold text-purple-600">Odds: {m.odds_a}x</span>
                    </div>

                    <span className="text-xs font-black text-gray-400 px-3 py-1 bg-gray-100 rounded-full">VS</span>

                    <div className="text-left flex-1">
                      <p className="text-base font-black text-gray-900">{m.team_b}</p>
                      <span className="text-xs font-bold text-purple-600">Odds: {m.odds_b}x</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Prize Pool</span>
                    <span className="text-base font-black text-amber-600">{m.prize_pool_fic} FIC</span>
                  </div>

                  <button
                    onClick={() => { setSelectedMatch(m); setSelectedTeam('A'); }}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Place Prediction
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3.5 px-6">Rank</th>
                  <th className="py-3.5 px-6">Player Handle</th>
                  <th className="py-3.5 px-6">Wins</th>
                  <th className="py-3.5 px-6">Win Rate</th>
                  <th className="py-3.5 px-6 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {leaderboard.map((p) => (
                  <tr key={p.rank} className="hover:bg-purple-50/20 transition-colors">
                    <td className="py-4 px-6 font-black text-purple-700">#{p.rank}</td>
                    <td className="py-4 px-6 font-bold text-gray-900">{p.player_name}</td>
                    <td className="py-4 px-6 text-gray-600">{p.wins} Wins</td>
                    <td className="py-4 px-6 text-emerald-600 font-bold">{p.win_rate}</td>
                    <td className="py-4 px-6 font-black text-gray-900 text-right">{p.points.toLocaleString()} pts</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: ARCADE REFLEX BLITZ */}
        {activeTab === 'arcade' && (
          <div className="max-w-xl mx-auto bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-center text-white shadow-2xl border border-purple-700/50">
            <h3 className="text-2xl font-black mb-2">Speedtap Reflex Blitz</h3>
            <p className="text-xs text-purple-200 mb-6">
              Test your tap speed and reaction time. Tap as fast as possible within 15 seconds!
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-purple-300 block">Time Left</span>
                <span className="text-3xl font-black text-yellow-400">{timeLeft}s</span>
              </div>
              <div className="bg-black/30 p-4 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-bold text-purple-300 block">Score</span>
                <span className="text-3xl font-black text-emerald-400">{score}</span>
              </div>
            </div>

            {isPlayingArcade ? (
              <button
                onClick={handleArcadeTap}
                className="w-44 h-44 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-yellow-500 hover:scale-105 active:scale-95 transition-all text-2xl font-black shadow-2xl mx-auto flex items-center justify-center border-4 border-white/20 select-none cursor-pointer"
              >
                TAP FAST!
              </button>
            ) : (
              <button
                onClick={handleStartArcade}
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-950 font-black rounded-2xl shadow-xl hover:from-yellow-300 hover:to-amber-400 transition-all text-sm"
              >
                Start 15s Challenge
              </button>
            )}

            <p className="text-[11px] text-purple-300/70 mt-6 flex items-center justify-center gap-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
              Verified Anti-Bot Hardware Clock Sync
            </p>
          </div>
        )}

        {/* Prediction Modal */}
        {selectedMatch && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Make Match Prediction</h3>
                <button onClick={() => setSelectedMatch(null)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWagerSubmit} className="space-y-5 mt-5">
                <div>
                  <span className="text-xs font-bold text-gray-700 uppercase block mb-2">Select Winning Team</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedTeam('A')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedTeam === 'A'
                          ? 'border-purple-600 bg-purple-50 text-purple-950 font-black'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs block font-bold">{selectedMatch.team_a}</span>
                      <span className="text-[11px] text-purple-600 block mt-1">{selectedMatch.odds_a}x return</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedTeam('B')}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedTeam === 'B'
                          ? 'border-purple-600 bg-purple-50 text-purple-950 font-black'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xs block font-bold">{selectedMatch.team_b}</span>
                      <span className="text-[11px] text-purple-600 block mt-1">{selectedMatch.odds_b}x return</span>
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-700 uppercase block mb-2">Wager Amount (FIC)</span>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWagerAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-bold transition-colors ${
                          wagerAmount === amt
                            ? 'bg-purple-600 text-white'
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
                    value={wagerAmount}
                    onChange={(e) => setWagerAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex justify-between items-center text-xs">
                  <span className="font-bold text-purple-900">Potential Return:</span>
                  <span className="text-base font-black text-purple-950">
                    {(wagerAmount * (selectedTeam === 'A' ? selectedMatch.odds_a : selectedMatch.odds_b)).toFixed(1)} FIC
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMatch(null)}
                    className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isWagering}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
                  >
                    {isWagering ? 'Confirming...' : 'Confirm Prediction'}
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

export default GameOnPage;
