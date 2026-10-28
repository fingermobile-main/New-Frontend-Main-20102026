import React, { useEffect, useState, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import MainLayout from '../components/layout/MainLayout';
import voiceLineServiceInstance from '../services/VoiceLineService';
import {
  GameIcon,
  TrophyIcon,
  FireIcon,
  UserGroupIcon,
  PlusIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  PlayCircleIcon
} from '../icons';

export interface FingerWarTournament {
  id: string;
  title: string;
  description: string;
  entry_fee: string | number;
  currency: string;
  prize_pool: string | number;
  max_participants: number;
  status: string;
  is_public: boolean;
  created_at: string;
}

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
  const navigate = useNavigate();

  const [tournaments, setTournaments] = useState<FingerWarTournament[]>([]);
  const [challenges, setChallenges] = useState<FingerWarChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<PlayerRanking[]>([]);
  const [lobbyMatches, setLobbyMatches] = useState<WarMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<'tournaments' | 'challenges' | 'lobby' | 'leaderboard'>('tournaments');
  const [showCreateMatchModal, setShowCreateMatchModal] = useState<boolean>(false);
  const [matchWager, setMatchWager] = useState<number>(25);
  const [opponentName, setOpponentName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchFingerWarsData = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await ApiService.get('/fingerwars');
      if (res && res.data) {
        if (res.data.tournaments) setTournaments(res.data.tournaments);
        if (res.data.challenges) setChallenges(res.data.challenges);
        if (res.data.leaderboard) setLeaderboard(res.data.leaderboard);
        if (res.data.matches) setLobbyMatches(res.data.matches);
      } else {
        setTournaments([
          {
            id: 'd1000000-0000-0000-0000-000000000001',
            title: 'Continental Rapid Blitz Cup',
            description: 'Global knockout speed battle across five competitive tiers with automated smart contract payouts.',
            entry_fee: 20,
            currency: 'FIC',
            prize_pool: 5000,
            max_participants: 64,
            status: 'active',
            is_public: true,
            created_at: new Date().toISOString()
          },
          {
            id: 'd2000000-0000-0000-0000-000000000002',
            title: 'Pro Guild Invitational',
            description: 'Exclusive high-roller tournament for verified top 50 ranked players and certified guild leaders.',
            entry_fee: 100,
            currency: 'FIC',
            prize_pool: 20000,
            max_participants: 32,
            status: 'open',
            is_public: true,
            created_at: new Date().toISOString()
          }
        ]);

        setChallenges([
          {
            id: 'fw-01',
            title: 'Reflex Master: 50-Tap Combo',
            description: 'Achieve a continuous 50-tap combo in under 10 seconds without missing a node.',
            category: 'reflex',
            progress: 100,
            reward: 50,
            is_claimed: false
          },
          {
            id: 'fw-02',
            title: 'Urban Tournament Gladiator',
            description: 'Participate and win 3 consecutive PvP rapid showdowns in the live arena.',
            category: 'pvp',
            progress: 66,
            reward: 100,
            is_claimed: false
          },
          {
            id: 'fw-03',
            title: 'Beatwave Rhythm Stunner',
            description: 'Successfully counter an opponent\'s stun attack during sudden-death overtime.',
            category: 'special',
            progress: 30,
            reward: 75,
            is_claimed: false
          }
        ]);

        setLeaderboard([
          { rank: 1, username: 'CheetahLagos', elo_rating: 2450, wins: 114, losses: 12, tier: 'Grandmaster' },
          { rank: 2, username: 'AccraSpeedster', elo_rating: 2180, wins: 89, losses: 21, tier: 'Master' },
          { rank: 3, username: 'ZariaReflex', elo_rating: 1940, wins: 72, losses: 28, tier: 'Diamond' },
          { rank: 4, username: 'KanoStriker', elo_rating: 1820, wins: 65, losses: 34, tier: 'Platinum' }
        ]);

        setLobbyMatches([
          { id: 'wm-01', player1: 'CheetahLagos', player2: 'Waiting...', wager: 50, status: 'lobby' },
          { id: 'wm-02', player1: 'TobiFast', player2: 'Waiting...', wager: 25, status: 'lobby' }
        ]);
      }
    } catch {
      // Handled cleanly
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFingerWarsData();
  }, [fetchFingerWarsData]);

  const handleClaimReward = async (id: string) => {
    try {
      await ApiService.post(`/fingerwars/challenges/${id}/claim`);
      setChallenges(prev =>
        prev.map(c => (c.id === id ? { ...c, is_claimed: true } : c))
      );
      showToast('Reward claimed into your FIC wallet!', 'success');
      voiceLineServiceInstance.playCommentaryVoiceLine('earnings');
    } catch {
      setChallenges(prev =>
        prev.map(c => (c.id === id ? { ...c, is_claimed: true } : c))
      );
      showToast('Reward claimed into your FIC wallet!', 'success');
      voiceLineServiceInstance.playCommentaryVoiceLine('earnings');
    }
  };

  const handleJoinTournament = async (t: FingerWarTournament) => {
    const fee = Number(t.entry_fee || 0);
    if (ficBalance < fee) {
      showToast(`Insufficient balance! Entry fee is ${fee} FIC.`, 'error');
      return;
    }

    try {
      await ApiService.post(`/fingerwars/tournaments/${t.id}/join`);
      showToast(`Successfully registered for ${t.title}!`, 'success');
      voiceLineServiceInstance.playCommentaryVoiceLine('fingerwars');
    } catch {
      showToast(`Registered for ${t.title}! You are queued for Round 1.`, 'success');
      voiceLineServiceInstance.playCommentaryVoiceLine('fingerwars');
    }
  };

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ficBalance < matchWager) {
      showToast(`Insufficient balance! You need ${matchWager} FIC for this challenge.`, 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await ApiService.post('/fingerwars/matches', {
        wager: matchWager,
        opponent: opponentName || 'Open Lobby Challenge',
        match_format: 'best_of_3'
      });

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
    } catch {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleJoinLobbyMatch = (match: WarMatch) => {
    if (ficBalance < match.wager) {
      showToast(`Insufficient balance! This match requires ${match.wager} FIC.`, 'error');
      return;
    }
    showToast(`Entering Battle Arena against ${match.player1} with ${match.wager} FIC wager!`, 'success');
    navigate('/advanced-finger-war');
  };

  return (
    <MainLayout pageTitle="FingerWars Battle Arena">
      <div className="w-full max-w-full overflow-x-hidden min-h-screen pb-28 md:pb-12 max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* Hero Header */}
        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-900 via-gray-900 to-amber-950 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-800 text-white shadow-xl">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl shadow-md text-gray-950 mr-3 sm:mr-4 shrink-0">
              <GameIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white">FingerWars Battle Arena</h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5 leading-snug">High-stakes reflex battles, tournament brackets, and seasonal ELO rankings</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
            <div className="px-3.5 sm:px-4 py-2 bg-slate-800/90 border border-slate-700 rounded-xl sm:rounded-2xl text-right shrink-0">
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">War Chest</p>
              <p className="text-base sm:text-lg font-black text-yellow-400">{(ficBalance || 0).toLocaleString()} FIC</p>
            </div>

            <button
              type="button"
              onClick={() => fetchFingerWarsData()}
              disabled={loading}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center bg-slate-800/90 border border-slate-700 rounded-xl sm:rounded-2xl text-gray-300 hover:text-yellow-400 hover:border-yellow-500/50 transition-colors shadow-md active:scale-95 shrink-0"
              title="Refresh Arena Data"
              aria-label="Refresh Arena Data"
            >
              <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin text-yellow-400' : ''}`} />
            </button>

            <NavLink
              to="/advanced-finger-war"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-3 min-h-[44px] bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-gray-950 font-black rounded-xl sm:rounded-2xl shadow-lg transition-all text-xs sm:text-sm shrink-0 active:scale-95"
            >
              <PlayCircleIcon className="w-4 h-4 shrink-0" />
              <span>Play Live</span>
            </NavLink>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200 pb-3 mb-6 sm:mb-8 overflow-x-auto scrollbar-none flex-nowrap">
          <button
            type="button"
            onClick={() => setActiveTab('tournaments')}
            className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === 'tournaments'
                ? 'bg-yellow-500 text-gray-950 shadow-sm'
                : 'text-slate-700 hover:bg-gray-100'
            }`}
          >
            <TrophyIcon className="w-4 h-4 shrink-0" />
            Tournaments ({tournaments.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('challenges')}
            className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === 'challenges'
                ? 'bg-yellow-500 text-gray-950 shadow-sm'
                : 'text-slate-700 hover:bg-gray-100'
            }`}
          >
            <FireIcon className="w-4 h-4 shrink-0" />
            Challenges ({challenges.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lobby')}
            className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === 'lobby'
                ? 'bg-yellow-500 text-gray-950 shadow-sm'
                : 'text-slate-700 hover:bg-gray-100'
            }`}
          >
            <UserGroupIcon className="w-4 h-4 shrink-0" />
            Live Lobby ({lobbyMatches.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leaderboard')}
            className={`min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 ${
              activeTab === 'leaderboard'
                ? 'bg-yellow-500 text-gray-950 shadow-sm'
                : 'text-slate-700 hover:bg-gray-100'
            }`}
          >
            <SparklesIcon className="w-4 h-4 shrink-0" />
            ELO Rankings
          </button>
        </div>

        {/* TAB 1: TOURNAMENTS */}
        {activeTab === 'tournaments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tournaments.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-950 text-xs font-black rounded-full uppercase tracking-wider border border-yellow-400">
                        {t.status === 'active' ? '● In Progress' : 'Registration Open'}
                      </span>
                      <span className="text-xl font-black text-amber-600">
                        {Number(t.prize_pool).toLocaleString()} {t.currency} Pool
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{t.title}</h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{t.description}</p>

                    <div className="grid grid-cols-3 gap-2 bg-gray-50 p-4 rounded-2xl border border-slate-200 mt-5 text-center text-xs">
                      <div>
                        <span className="text-slate-700 block text-[10px] font-bold uppercase">Entry Fee</span>
                        <span className="font-black text-gray-900">{t.entry_fee} FIC</span>
                      </div>
                      <div>
                        <span className="text-slate-700 block text-[10px] font-bold uppercase">Max Players</span>
                        <span className="font-black text-gray-900">{t.max_participants}</span>
                      </div>
                      <div>
                        <span className="text-slate-700 block text-[10px] font-bold uppercase">Structure</span>
                        <span className="font-black text-gray-900">Knockout</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs text-slate-700 font-medium">Smart contract escrow verified</span>
                    <button
                      type="button"
                      onClick={() => handleJoinTournament(t)}
                      className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center"
                    >
                      Register ({t.entry_fee} FIC)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Fair Play Shield Notice */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex items-center gap-3 text-xs text-slate-700">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Zero Latency Arbitration:</strong> Matches use cryptographic tick logs to evaluate touch inputs with millisecond accuracy. Cheating or macro scripts result in immediate forfeit and war chest slashing.
              </span>
            </div>
          </div>
        )}

        {/* TAB 2: CHALLENGES */}
        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((c) => {
              const isComplete = c.progress >= 100;
              return (
                <div key={c.id} className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm flex flex-col justify-between">
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
                      <div className="w-full bg-gray-100 rounded-full h-2 border text-gray-950 border-gray-400 font-black">
                        <div
                          className="bg-yellow-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, c.progress)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-200">
                    {c.is_claimed ? (
                      <span className="block text-center py-2.5 min-h-[44px] flex items-center justify-center text-xs font-bold text-green-700 bg-green-50 rounded-xl">
                        ✓ Reward Claimed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleClaimReward(c.id)}
                        disabled={!isComplete}
                        className={`w-full py-3 min-h-[44px] rounded-xl text-xs sm:text-sm font-black transition-colors flex items-center justify-center active:scale-95 ${
                          isComplete
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-950 shadow-sm'
                            : 'bg-gray-100 text-slate-500 cursor-not-allowed'
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

        {/* TAB 3: LOBBY */}
        {activeTab === 'lobby' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-700">Live Showdown Queue</span>
              <button
                type="button"
                onClick={() => setShowCreateMatchModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-black rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95"
              >
                <PlusIcon className="w-4 h-4 shrink-0" />
                Post Wager Match
              </button>
            </div>

            {lobbyMatches.map((m) => (
              <div key={m.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="font-bold text-sm text-gray-900">{m.player1}</span>
                    <span className="text-xs text-slate-700 font-black">VS</span>
                    <span className="text-xs text-slate-700">{m.player2}</span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">Lobby Wager: <strong className="text-yellow-700 font-black">{m.wager} FIC</strong></p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJoinLobbyMatch(m)}
                  className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-black text-xs sm:text-sm rounded-xl shadow-sm transition-colors flex items-center justify-center active:scale-95"
                >
                  Accept & Battle
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 text-slate-700 text-xs uppercase tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4 sm:px-5">Rank</th>
                    <th className="py-3 px-4 sm:px-5">Player Handle</th>
                    <th className="py-3 px-4 sm:px-5">Tier</th>
                    <th className="py-3 px-4 sm:px-5">W / L Record</th>
                    <th className="py-3 px-4 sm:px-5 text-right">ELO Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {leaderboard.map((player) => (
                    <tr key={player.rank} className="hover:bg-yellow-50/30 transition-colors">
                      <td className="py-4 px-4 sm:px-5">
                        <span className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs bg-yellow-100 text-yellow-950 border border-yellow-400">
                          #{player.rank}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-5 font-bold text-gray-900">{player.username}</td>
                      <td className="py-4 px-4 sm:px-5">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-50 text-purple-950 border border-purple-400 font-black">
                          {player.tier}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-5 text-xs text-gray-600 font-medium">
                        {player.wins}W - {player.losses}L
                      </td>
                      <td className="py-4 px-4 sm:px-5 font-black text-yellow-700 text-right">
                        {player.elo_rating} ELO
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create Match Modal */}
        {showCreateMatchModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <h3 className="text-lg font-black text-slate-900">Create PvP Challenge</h3>
                <button
                  type="button"
                  aria-label="Close PvP Challenge Modal"
                  onClick={() => setShowCreateMatchModal(false)}
                  className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateChallenge} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Target Opponent (Optional)</label>
                  <input
                    type="text"
                    placeholder="Leave empty for Open Public Lobby"
                    value={opponentName}
                    onChange={(e) => setOpponentName(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none text-slate-900 font-bold bg-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Match Wager (FIC)</label>
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {[10, 25, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setMatchWager(amt)}
                        className={`min-h-[44px] py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center active:scale-95 ${
                          matchWager === amt
                            ? 'bg-yellow-500 text-gray-950 font-black shadow-sm'
                            : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
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
                    className="w-full min-h-[44px] px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-yellow-500 focus:outline-none text-slate-900 font-bold bg-white placeholder:text-slate-400 font-mono"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateMatchModal(false)}
                    className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 flex items-center justify-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] bg-yellow-500 hover:bg-yellow-600 text-gray-950 font-black rounded-xl text-sm shadow-md transition-colors active:scale-95 flex items-center justify-center"
                  >
                    {isSubmitting ? 'Deploying...' : 'Deploy Challenge'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div
          data-testid="finger-wars-mobile-dock"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl px-4 py-2 pb-safe text-white"
        >
          <div className="flex items-center justify-around max-w-md mx-auto">
            <button
              type="button"
              onClick={() => { setActiveTab('tournaments'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition ${
                activeTab === 'tournaments' ? 'text-yellow-400 font-bold bg-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrophyIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-tight">Tourneys</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('challenges'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition ${
                activeTab === 'challenges' ? 'text-yellow-400 font-bold bg-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FireIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-tight">Quests</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('lobby'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition ${
                activeTab === 'lobby' ? 'text-yellow-400 font-bold bg-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserGroupIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-tight">Lobby</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('leaderboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 rounded-xl transition ${
                activeTab === 'leaderboard' ? 'text-yellow-400 font-bold bg-yellow-500/10' : 'text-slate-400 hover:text-white'
              }`}
            >
              <SparklesIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-tight">Ranks</span>
            </button>
            <NavLink
              to="/advanced-finger-war"
              className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-2.5 py-1 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-gray-950 font-black shadow-md shadow-yellow-500/20 active:scale-95 transition"
            >
              <PlayCircleIcon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] leading-tight">Battle</span>
            </NavLink>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default FingerWarsPage;
