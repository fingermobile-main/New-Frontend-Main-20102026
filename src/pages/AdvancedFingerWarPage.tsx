import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Trophy,
  Flame,
  Swords,
  Zap,
  Shield,
  Medal,
  Users,
  Target,
  Sparkles,
  RefreshCw,
  Gift,
  Coins,
  ChevronRight,
  Play
} from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  guild: string;
  score: number;
  wins: number;
  tier: 'Grandmaster' | 'Diamond' | 'Gold' | 'Silver';
  rewardFIC: number;
}

interface TournamentRecord {
  id: string;
  title: string;
  prizePool: string;
  entryFee: string;
  startsIn: string;
  participants: number;
  maxParticipants: number;
  status: 'Registration Open' | 'Live Combat' | 'Completed';
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Mbah Israel Obinna',
    avatar: '/assets/branding/mbah_israel_obinna.jpeg',
    guild: 'Protocol Sovereign Core',
    score: 98450,
    wins: 482,
    tier: 'Grandmaster',
    rewardFIC: 5000
  },
  {
    rank: 2,
    name: 'Chidi Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    guild: 'Sahara Dune Warriors',
    score: 87120,
    wins: 412,
    tier: 'Grandmaster',
    rewardFIC: 3000
  },
  {
    rank: 3,
    name: 'Fatima Al-Hassan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200',
    guild: 'Kano Durbar Knights',
    score: 79300,
    wins: 380,
    tier: 'Diamond',
    rewardFIC: 1500
  },
  {
    rank: 4,
    name: 'Tobi Bakare',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    guild: 'Lagos Night Stalkers',
    score: 64200,
    wins: 295,
    tier: 'Diamond',
    rewardFIC: 800
  },
  {
    rank: 5,
    name: 'Amina Bello',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    guild: 'Serengeti Pride',
    score: 52100,
    wins: 240,
    tier: 'Gold',
    rewardFIC: 500
  }
];

const TOURNAMENTS: TournamentRecord[] = [
  {
    id: 'tourn-01',
    title: 'Sovereign All-Africa Grand Championship 2026',
    prizePool: '25,000 FIC (~₦2.5M)',
    entryFee: '50 FIC',
    startsIn: '2h 15m',
    participants: 124,
    maxParticipants: 128,
    status: 'Registration Open'
  },
  {
    id: 'tourn-02',
    title: 'Night Speed-Tap Blitz (120 FPS Arena)',
    prizePool: '5,000 FIC',
    entryFee: '10 FIC',
    startsIn: 'Live Now',
    participants: 64,
    maxParticipants: 64,
    status: 'Live Combat'
  },
  {
    id: 'tourn-03',
    title: 'Guild Dominance Weekend War',
    prizePool: '50,000 FIC',
    entryFee: 'Free (Guild Rep >= 4)',
    startsIn: 'Saturday 18:00 WAT',
    participants: 48,
    maxParticipants: 64,
    status: 'Registration Open'
  }
];

const AdvancedFingerWarPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { member } = useAuth();
  const { ficBalance, showToast } = useAppContext();

  // Active Combat State (Interactive Simulator)
  const [inBattle, setInBattle] = useState<boolean>(false);
  const [battleScore, setBattleScore] = useState<number>(0);
  const [comboMultiplier, setComboMultiplier] = useState<number>(1);
  const [battleTimer, setBattleTimer] = useState<number>(15);
  const [highestCombo, setHighestCombo] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'arena' | 'tournaments' | 'leaderboard' | 'quests'>('arena');

  // Daily Quests
  const [quests, setQuests] = useState([
    { id: 'q-1', title: 'Achieve 300+ Battle Score in Tap Arena', reward: 25, progress: 0, target: 300, claimed: false },
    { id: 'q-2', title: 'Trigger a 5x Combo Multiplier Streak', reward: 50, progress: 0, target: 5, claimed: false },
    { id: 'q-3', title: 'Register in any Sovereign Tournament', reward: 100, progress: 0, target: 1, claimed: false }
  ]);

  // Battle loop timer
  useEffect(() => {
    let interval: any = null;
    if (inBattle && battleTimer > 0) {
      interval = setInterval(() => {
        setBattleTimer((prev) => prev - 1);
      }, 1000);
    } else if (inBattle && battleTimer === 0) {
      setInBattle(false);
      const earnedFIC = Math.floor(battleScore / 100);
      showToast?.(`Battle concluded! Final Score: ${battleScore} (Earned ${earnedFIC} FIC Bonus)`, 'success');
      // Update quest 1
      setQuests((prev) =>
        prev.map((q) => (q.id === 'q-1' ? { ...q, progress: Math.max(q.progress, battleScore) } : q))
      );
    }
    return () => clearInterval(interval);
  }, [inBattle, battleTimer, battleScore, showToast]);

  const handleStartBattle = () => {
    setBattleScore(0);
    setComboMultiplier(1);
    setHighestCombo(1);
    setBattleTimer(15);
    setInBattle(true);
    showToast?.('Arena Combat Commenced! Tap the Strike Pad rapidly!', 'info');
  };

  const handleStrike = () => {
    if (!inBattle) return;

    setComboMultiplier((prev) => {
      const nextCombo = Math.min(prev + 0.2, 8.0);
      setHighestCombo((h) => Math.max(h, Math.floor(nextCombo)));
      // Update quest 2
      setQuests((qList) =>
        qList.map((q) => (q.id === 'q-2' ? { ...q, progress: Math.max(q.progress, Math.floor(nextCombo)) } : q))
      );
      return nextCombo;
    });

    const pointsEarned = Math.round(10 * comboMultiplier);
    setBattleScore((prev) => prev + pointsEarned);
  };

  const handleClaimQuest = (id: string, reward: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, claimed: true } : q))
    );
    showToast?.(`Claimed ${reward} FIC Quest Bonus into wallet!`, 'success');
  };

  return (
    <MainLayout pageTitle="Advanced FingerWar Arena">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. HERO BANNER: Strict Contrast Hierarchy */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-400 text-orange-950 text-xs font-black uppercase tracking-wider">
                <Swords className="w-3.5 h-3.5 text-orange-600" />
                <span>Real-Time Sovereign Gamification Arena</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Advanced FingerWar™ Championship
              </h1>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                Compete in real-time tactile battles, join regional battalion tournaments, and climb the sovereign leaderboards for thousands of Infinite Coins (FIC) in automated smart escrow prizes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-300 text-center">
                <span className="block text-[11px] font-bold text-orange-950 uppercase">Your Balance</span>
                <span className="text-2xl font-black text-slate-900">{ficBalance.toFixed(0)} FIC</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-slate-300 pb-2 overflow-x-auto">
          {[
            { id: 'arena', label: 'Tactile Combat Arena', icon: Swords },
            { id: 'tournaments', label: 'Championship Tournaments', icon: Trophy },
            { id: 'leaderboard', label: 'Global Ranking Ladder', icon: Medal },
            { id: 'quests', label: 'Daily Sovereign Quests', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-800 hover:text-slate-900 border-slate-300 hover:border-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 3. TAB 1: TACTILE COMBAT SIMULATOR ARENA */}
        {activeTab === 'arena' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Live Combat Pad */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-sm flex flex-col justify-between space-y-6 text-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-400 text-slate-950 text-xs font-black uppercase mb-3">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>120 FPS High-Frequency Tap Engine</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Tactile Finger Strike Pad
                </h2>
                <p className="text-xs text-slate-700 font-medium max-w-md mx-auto mt-1">
                  Tap or click the strike pad as fast as possible to build your combo multiplier and stack tournament score points.
                </p>
              </div>

              {/* Combat Telemetry HUD */}
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto w-full">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-300">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Arena Score</span>
                  <span className="text-2xl font-black text-slate-900">{battleScore}</span>
                </div>
                <div className="p-3 rounded-2xl bg-orange-50 border border-orange-300">
                  <span className="block text-[10px] font-bold text-orange-950 uppercase">Combo Multiplier</span>
                  <span className="text-2xl font-black text-orange-600">{comboMultiplier.toFixed(1)}x</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-300">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase">Time Remaining</span>
                  <span className={`text-2xl font-black ${battleTimer <= 5 && inBattle ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
                    {battleTimer}s
                  </span>
                </div>
              </div>

              {/* Strike Button Circle */}
              <div className="py-6 flex justify-center">
                {inBattle ? (
                  <button
                    type="button"
                    onClick={handleStrike}
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-orange-500 via-rose-600 to-indigo-700 text-white font-black text-2xl uppercase tracking-wider shadow-2xl active:scale-95 transition-transform flex flex-col items-center justify-center border-4 border-white ring-4 ring-orange-500/50 cursor-pointer select-none"
                  >
                    <Flame className="w-12 h-12 mb-1 animate-bounce" />
                    <span>STRIKE!</span>
                    <span className="text-xs font-bold opacity-80 mt-1">+{Math.round(10 * comboMultiplier)} Pts</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartBattle}
                    className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-lg uppercase tracking-wider shadow-xl hover:scale-105 transition-all flex flex-col items-center justify-center border-4 border-slate-300 cursor-pointer"
                  >
                    <Play className="w-12 h-12 mb-2 text-orange-500" />
                    <span>Enter Combat</span>
                    <span className="text-xs text-slate-400 font-bold mt-1">15s Blitz Round</span>
                  </button>
                )}
              </div>

              <div className="text-xs text-slate-700 font-bold">
                Highest Combo Achieved: <span className="text-slate-900 font-black">{highestCombo}x</span> • Zero Latency WebSocket Engine Active
              </div>
            </div>

            {/* Side Arena Panels */}
            <div className="space-y-6">
              
              {/* Active Perks */}
              <div className="bg-white rounded-3xl p-6 border border-slate-300 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <span>Sovereign Warrior Perks</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-300 flex items-center justify-between">
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">FingerLux 2x Momentum</strong>
                      <span className="block text-[11px] text-slate-700">Passive +15% combo retention</span>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded-md">
                      ACTIVE
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-300 flex items-center justify-between">
                    <div>
                      <strong className="block text-xs font-bold text-slate-900">STERCS™ Anti-Bot Shield</strong>
                      <span className="block text-[11px] text-slate-700">Cryptographic hardware tap proof</span>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-400 px-2 py-0.5 rounded-md">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant Tournament Teaser */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-6 border border-orange-300 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-950 bg-orange-200 px-2 py-0.5 rounded border border-orange-400">
                  Featured Match
                </span>
                <h3 className="text-base font-black text-slate-900">
                  Night Speed-Tap Blitz (64 Slots)
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  Entry: 10 FIC • Grand Prize: 5,000 FIC to Top 3.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('tournaments');
                    showToast?.('Switched to Tournament Registry', 'info');
                  }}
                  className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase"
                >
                  View Tournament Roster
                </button>
              </div>

            </div>
          </div>
        )}

        {/* 4. TAB 2: TOURNAMENTS */}
        {activeTab === 'tournaments' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TOURNAMENTS.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-3xl p-6 border border-slate-300 hover:border-slate-400 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                      t.status === 'Live Combat'
                        ? 'bg-rose-100 text-rose-950 border-rose-400'
                        : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                    }`}>
                      {t.status}
                    </span>
                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {t.title}
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-300 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-500">Prize Pool:</span>
                      <strong className="text-slate-900">{t.prizePool}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-500">Entry Fee:</span>
                      <strong className="text-slate-900">{t.entryFee}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-500">Starts:</span>
                      <strong className="text-orange-600">{t.startsIn}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-500">Bracket:</span>
                      <strong className="text-slate-900">{t.participants} / {t.maxParticipants}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast?.(`Registered for ${t.title}!`, 'success')}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase transition-colors"
                  >
                    Register Bracket
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TAB 3: GLOBAL LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-3xl border border-slate-300 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Sovereign Grandmaster Ladder</h3>
                <p className="text-xs text-slate-700 font-medium">Rankings refresh every 2 hours with automated smart contract payouts</p>
              </div>
              <button
                type="button"
                onClick={() => showToast?.('Refreshed live combat ratings', 'info')}
                className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-300 text-slate-800 font-black uppercase text-[11px]">
                  <tr>
                    <th className="px-6 py-3.5">Rank</th>
                    <th className="px-6 py-3.5">Warrior</th>
                    <th className="px-6 py-3.5">Guild Battalion</th>
                    <th className="px-6 py-3.5">Rating Score</th>
                    <th className="px-6 py-3.5">Total Wins</th>
                    <th className="px-6 py-3.5">Tier</th>
                    <th className="px-6 py-3.5 text-right">Prize Allocation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  {LEADERBOARD_DATA.map((player) => (
                    <tr key={player.rank} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-900">
                        {player.rank === 1 ? '🥇 #1' : player.rank === 2 ? '🥈 #2' : player.rank === 3 ? '🥉 #3' : `#${player.rank}`}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={player.avatar}
                            alt={player.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-300"
                          />
                          <strong className="text-slate-900">{player.name}</strong>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{player.guild}</td>
                      <td className="px-6 py-4 font-black text-slate-900">{player.score.toLocaleString()}</td>
                      <td className="px-6 py-4 text-slate-800 font-bold">{player.wins} W</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded bg-orange-100 border border-orange-400 text-orange-950 font-black text-[10px] uppercase">
                          {player.tier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-800">
                        +{player.rewardFIC} FIC
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. TAB 4: DAILY QUESTS */}
        {activeTab === 'quests' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quests.map((q) => {
              const isComplete = q.progress >= q.target;

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl p-6 border border-slate-300 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-orange-100 border border-orange-400 text-orange-950 text-[10px] font-black uppercase">
                      Daily Objective
                    </span>
                    <h3 className="text-sm font-black text-slate-900">
                      {q.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>Progress</span>
                      <span>{q.progress} / {q.target}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden border border-slate-400 text-slate-950 font-black">
                      <div
                        className="h-full bg-orange-600 transition-all duration-500"
                        style={{ width: `${Math.min(100, (q.progress / q.target) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">
                      Reward: +{q.reward} FIC
                    </span>

                    {q.claimed ? (
                      <span className="text-xs font-bold text-slate-500">Claimed ✓</span>
                    ) : (
                      <button
                        type="button"
                        disabled={!isComplete}
                        onClick={() => handleClaimQuest(q.id, q.reward)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase ${
                          isComplete
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        Claim FIC
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default AdvancedFingerWarPage;
