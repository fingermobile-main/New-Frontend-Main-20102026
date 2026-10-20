import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Users,
  Gamepad2,
  ArrowLeft,
  Award,
  Globe,
  Coins,
  Volume2
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import SuperViGame from '../../components/gaming/SuperViGame';
import SuperViAPI from '../../services/SuperViAPIService';
import audioEngine from '../../services/SuperViAudioEngine';
import { SuperViLeaderboardEntry, SuperViAchievement, SuperViDailyChallenge } from '../../types/supervi';
import { useAppContext } from '../../contexts/AppContext';

export const SuperViPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance } = useAppContext();

  const [activeTab, setActiveTab] = useState<'arena' | 'leaderboard' | 'heroes' | 'challenges' | 'cities'>('arena');
  const [leaderboard, setLeaderboard] = useState<SuperViLeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<SuperViAchievement[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<SuperViDailyChallenge[]>([]);

  // Fetch Leaderboards, Achievements & Challenges
  useEffect(() => {
    let isMounted = true;
    const loadGameData = async () => {
      try {
        const [lbData, achData, chalData] = await Promise.allSettled([
          SuperViAPI.getLeaderboard('global', 10),
          SuperViAPI.getAchievements(),
          SuperViAPI.getDailyChallenges()
        ]);

        if (isMounted) {
          if (lbData.status === 'fulfilled') setLeaderboard(lbData.value);
          if (achData.status === 'fulfilled') setAchievements(achData.value);
          if (chalData.status === 'fulfilled') setDailyChallenges(chalData.value);
        }
      } catch (_err) {
        // Fallback gracefully to default state
      }
    };

    loadGameData();
    return () => {
      isMounted = false;
    };
  }, []);

  const CITIES = [
    { name: 'Lagos, Nigeria', region: 'West Africa', unlocked: true, bonus: '+10% Speed Multiplier', landmark: 'Lekki-Ikoyi Hologram Bridge' },
    { name: 'Abuja, Nigeria', region: 'Federal Capital', unlocked: true, bonus: '+15% Orb Charge Rate', landmark: 'Zuma Rock Cyber Spire' },
    { name: 'Kano, Nigeria', region: 'Sahel Gateway', unlocked: true, bonus: '+20% Ground Coin Multiplier', landmark: 'Ancient Walls Energy Grid' },
    { name: 'Addis Ababa, Ethiopia', region: 'East Africa', unlocked: true, bonus: '+12% Jump Height', landmark: 'Lion of Judah Cyber Citadel' },
    { name: 'Kingston, Jamaica', region: 'Caribbean Diaspora', unlocked: true, bonus: '+25% Water/Swamp Glide', landmark: 'Blue Mountain Solar Array' },
    { name: 'Cape Town, South Africa', region: 'Southern Africa', unlocked: true, bonus: '+10% Shield Duration', landmark: 'Table Mountain Neon Summit' },
    { name: 'Madrid, Spain', region: 'Europe', unlocked: false, bonus: 'Unlocks at Level 10', landmark: 'Gran Via Holographic Avenue' },
    { name: 'London, United Kingdom', region: 'Europe', unlocked: false, bonus: 'Unlocks at Level 15', landmark: 'Thames Quantum Skyway' },
    { name: 'Seoul, South Korea', region: 'Asia', unlocked: false, bonus: 'Unlocks at Level 20', landmark: 'Gangnam Hyper Neon Grid' }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-300 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/gameon')}
                className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Back to GameOn"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">
                AFRO-FUTURISTIC 3D–5D MULTIPLAYER
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-300 p-1 shrink-0 overflow-hidden shadow-sm">
                <img src="/assets/logos/supervi_logo.png" alt="SuperVi" className="w-full h-full object-contain" />
              </div>
              <span>SuperVi: Orbs of Glory</span>
              <span className="text-sm font-normal text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300">
                Rise of the Six
              </span>
            </h1>
            <p className="text-slate-700 text-sm max-w-2xl">
              Immerse yourself in the flagship high-speed runner. Master the six cultural guardians, unleash spinning Egyptian orbs, and earn protocol FIC rewards.
            </p>
          </div>

          {/* FIC Wallet Card */}
          <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-300 p-4 rounded-xl shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-950 block uppercase tracking-wider">Protocol Wallet</span>
              <span className="text-xl font-black text-emerald-950">{ficBalance || '1,250'} FIC</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-300 pb-2">
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'arena'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>3D Runner Arena</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Global Leaderboard</span>
          </button>

          <button
            onClick={() => setActiveTab('heroes')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'heroes'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>The Six Heroes Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab('cities')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'cities'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <span>World Tour Cities (16)</span>
          </button>

          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'challenges'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Award className="w-4 h-4 text-purple-400" />
            <span>Daily Challenges & Quests</span>
          </button>
        </div>

        {/* Tab 1: 3D RUNNER ARENA */}
        {activeTab === 'arena' && (
          <div className="space-y-4">
            <SuperViGame onExit={() => setActiveTab('leaderboard')} />

            {/* Quick Control Cheatsheet */}
            <div className="bg-white p-5 rounded-2xl border border-slate-300 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Keyboard & Touch Gesture Controls:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">← / → or Swipe Left/Right</span>
                  <span className="text-slate-700">Switch between 3 vertical lanes</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">↑ or Swipe Up</span>
                  <span className="text-slate-700">Jump over trees, quicksands & stumps</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">↓ or Swipe Down</span>
                  <span className="text-slate-700">Slide under barriers & low tunnels</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block">Spacebar or Tap Orb</span>
                  <span className="text-slate-700">Unleash Hero Egyptian Orb Power</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GLOBAL LEADERBOARD */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Hall of Sovereignty Leaderboard</h2>
                <p className="text-xs text-slate-700">Top-ranking SuperVi runners competing for monthly FIC prize pools.</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-950 rounded-full border border-amber-300">
                Prize Pool: 50,000 FIC
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Runner Name</th>
                    <th className="py-3 px-4">Hero</th>
                    <th className="py-3 px-4">High Score</th>
                    <th className="py-3 px-4">Max Distance</th>
                    <th className="py-3 px-4">Max Combo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {entry.rank === 1 && '🥇'}
                        {entry.rank === 2 && '🥈'}
                        {entry.rank === 3 && '🥉'}
                        {entry.rank > 3 && `#${entry.rank}`}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs">
                          {entry.avatar_url ? <img src={entry.avatar_url} alt="" className="rounded-full" /> : '👤'}
                        </span>
                        <span>{entry.player_name}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 capitalize">
                        {entry.character_name || entry.character_id}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {Number(entry.score).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {Number(entry.distance || 0).toLocaleString()}m
                      </td>
                      <td className="py-3.5 px-4 text-red-600 font-bold">
                        {entry.highest_combo || 12}x 🔥
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: THE SIX HEROES DOSSIER */}
        {activeTab === 'heroes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Zara the Zephyr',
                ethnicity: 'Hausa (Kano, Nigeria)',
                class: 'Guardian of Heritage',
                color: '#ef4444',
                suit: 'Red spandex, flowing knee-length hijab, white/gold trimmings, opals, red beads.',
                orb: 'Fiery Red Orb with spinning Egyptian hieroglyphs.',
                power: 'Fire Dash: Levitates above obstacles and creates fiery streak destroying barriers.',
                voice: 'small_combo'
              },
              {
                name: 'Tenko-Gen',
                ethnicity: 'Fulani (Abuja, Nigeria)',
                class: 'Wisdom Keeper',
                color: '#3b82f6',
                suit: 'Blue spandex, sacred blue beads, long braided hair with protective veil.',
                orb: 'Blue Orb with Eye of Horus glyphs.',
                power: 'Foresight & Extend: Reaches high platforms and predicts obstacle patterns.',
                voice: 'great_combo'
              },
              {
                name: 'King the Guardian',
                ethnicity: 'Yoruba (Lagos, Nigeria)',
                class: 'Unity Champion',
                color: '#10b981',
                suit: 'Emerald green spandex, warrior dreadlocks, green hand/leg beads.',
                orb: 'Green Orb with Was Scepter glyphs.',
                power: 'Wall Break & Brute Force: Smashes concrete barriers, trains, and falling trees.',
                voice: 'colossal_combo'
              },
              {
                name: 'Phantom Shadow',
                ethnicity: 'Ibo (Enugu, Nigeria)',
                class: 'Future Visionary',
                color: '#f97316',
                suit: 'Orange stealth suit, orange & green ceremonial beads on waist and arms.',
                orb: 'Orange Orb with phase glyphs.',
                power: 'Phase Shift: Becomes intangible, passing through trains and quicksands.',
                voice: 'stunning'
              },
              {
                name: 'Bola the Brave',
                ethnicity: 'Ibo (Onitsha, Nigeria)',
                class: 'Bridge Builder',
                color: '#f8fafc',
                suit: 'White spandex suit, white & red beads on arms/feet.',
                orb: 'White Orb spinning violently with electric glyphs.',
                power: 'Lightning Dash: Ultra-fast sprint with protective lightning aura.',
                voice: 'blessings'
              },
              {
                name: 'Neoma the Healer',
                ethnicity: 'Ibo (Owerri, Nigeria)',
                class: 'Innovation Pioneer',
                color: '#a855f7',
                suit: 'Leafy green and fruity spandex, long braids, rotating beads.',
                orb: 'Multi-Color Pulsing Orb with healing Sa amulets.',
                power: 'Protective Bubbles: Spawns fruity shields around player to absorb hits.',
                voice: 'stunning'
              }
            ].map((hero, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md"
                      style={{ backgroundColor: hero.color }}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-black text-slate-900">{hero.name}</h3>
                      <span className="text-xs font-semibold text-slate-700 block">{hero.ethnicity}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => audioEngine.playVoiceLine(hero.voice as any)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors"
                    title="Preview African Voice Line"
                  >
                    <Volume2 className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Class & Role:</span>
                    <span className="text-slate-700">{hero.class}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Suit & Appearance:</span>
                    <span className="text-slate-700">{hero.suit}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Egyptian Glowing Orb:</span>
                    <span className="text-slate-700">{hero.orb}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Special Gameplay Power:</span>
                    <span className="text-slate-800 font-semibold">{hero.power}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: WORLD TOUR CITIES (16) */}
        {activeTab === 'cities' && (
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">SuperVi 16-City World Tour</h2>
              <p className="text-xs text-slate-700">
                Travel across iconic Afro-futuristic cyber tracks, each with unique environmental hazards, visual aesthetics, and gameplay multipliers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CITIES.map((city, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all ${
                    city.unlocked
                      ? 'border-emerald-300 bg-emerald-50/40 shadow-sm'
                      : 'border-slate-300 bg-slate-50 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-900">{city.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        city.unlocked ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {city.unlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-700 block">{city.landmark}</span>
                  <span className="text-xs font-bold text-emerald-800 block mt-2">{city.bonus}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: DAILY CHALLENGES & QUESTS */}
        {activeTab === 'challenges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🌟 Active Daily Challenges</span>
              </h3>
              <div className="space-y-3">
                {dailyChallenges.map((ch) => (
                  <div key={ch.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{ch.title}</span>
                      <span className="text-xs font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        +{ch.reward_fic} FIC
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">{ch.description}</p>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, ((ch.current_progress ?? 0) / (ch.target_value || 1)) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-600 font-semibold">
                      <span>Progress: {ch.current_progress ?? 0} / {ch.target_value}</span>
                      <span>{ch.is_completed ? 'Completed ✅' : 'In Progress'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>🏆 Achievements & Milestones</span>
              </h3>
              <div className="space-y-3">
                {achievements.slice(0, 5).map((ach) => (
                  <div key={ach.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
                    <span className="text-2xl">{ach.badge_icon || '🏅'}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{ach.name}</span>
                        <span className="text-[11px] font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          +{ach.reward_coins} Coins
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SuperViPage;
