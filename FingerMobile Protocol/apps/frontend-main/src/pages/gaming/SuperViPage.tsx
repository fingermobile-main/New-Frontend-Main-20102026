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
  Volume2,
  ShoppingBag,
  BookOpen,
  Key,
  Zap,
  Shield,
  Flame,
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  Heart,
  Rocket,
  Compass,
  AlertTriangle,
  Gift,
  Layers,
  Activity,
  Feather
} from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import SuperViGame from '../../components/gaming/SuperViGame';
import SuperViAPI from '../../services/SuperViAPIService';
import audioEngine from '../../services/SuperViAudioEngine';
import {
  SuperViLeaderboardEntry,
  SuperViAchievement,
  SuperViDailyChallenge,
  PostcardAnalytics,
  EnergyLevel,
  KeyTier,
  PortalType
} from '../../types/supervi';
import { useAppContext } from '../../contexts/AppContext';

export const SuperViPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'arena' | 'store' | 'missions' | 'heroes' | 'cities' | 'leaderboard' | 'guide'>('arena');

  // Backend / Service Data
  const [leaderboard, setLeaderboard] = useState<SuperViLeaderboardEntry[]>([]);
  const [achievements, setAchievements] = useState<SuperViAchievement[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<SuperViDailyChallenge[]>([]);

  // Selected Active City & Hero (for dynamic postcards)
  const [activeCityIndex, setActiveCityIndex] = useState<number>(0);
  const [activeHeroIndex, setActiveHeroIndex] = useState<number>(0);

  // Live Postcard Analytics (emitted from 3D Arena or defaults)
  const [analytics, setAnalytics] = useState<PostcardAnalytics>({
    score: 18450,
    giftsAcquired: 342,
    ficEarned: 105,
    playDurationSeconds: 148,
    distanceCovered: 2450,
    distanceToGoal: 7550,
    timeLeftSeconds: 752,
    permanentBoosts: 2,
    scoreMultiplier: 1.5
  });

  // Store Inventory State
  const [inventory, setInventory] = useState<{
    boosters: Record<string, number>;
    coins: number;
    keys: Record<KeyTier, number>;
    energyTier: EnergyLevel;
    activePortal: PortalType | null;
  }>({
    boosters: { speed: 3, strength: 2, water: 5, food: 4, elixir: 1 },
    coins: 450,
    keys: { walk_way: 12, door_way: 5, pathway: 3, gateway: 1, lions_gate: 0 },
    energyTier: 'Emenike',
    activePortal: 'CERN'
  });

  // Mission Voting & Selection State
  const [votedProposedMission, setVotedProposedMission] = useState<boolean>(false);
  const [selectedCuratedMissionId, setSelectedCuratedMissionId] = useState<string>('curated-1');

  // Fetch Leaderboard, Achievements & Challenges
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
        // Fallback gracefully
      }
    };

    loadGameData();
    return () => {
      isMounted = false;
    };
  }, []);

  // 16 Global Afro-Futuristic Cities (World Tour)
  const CITIES = [
    { name: 'Lagos, Nigeria', region: 'West Africa', unlocked: true, bonus: '+10% Speed Multiplier', landmark: 'Lekki-Ikoyi Hologram Bridge', desc: 'Coastal neon metropolis with floating highway maglevs and rapid subway rails.' },
    { name: 'Abuja, Nigeria', region: 'Federal Capital', unlocked: true, bonus: '+15% Orb Charge Rate', landmark: 'Zuma Rock Cyber Spire', desc: 'Monolithic cyber citadel pulsing with ancient ancestral geoglyphs and solar relays.' },
    { name: 'Kano, Nigeria', region: 'Sahel Gateway', unlocked: true, bonus: '+20% Ground Coin Multiplier', landmark: 'Ancient Walls Energy Grid', desc: 'Historic clay fortress illuminated by quantum defense shields and desert winds.' },
    { name: 'Addis Ababa, Ethiopia', region: 'East Africa', unlocked: true, bonus: '+12% Jump Height', landmark: 'Lion of Judah Cyber Citadel', desc: 'High-altitude mountain hub crowned with brass obelisks and starlight shrines.' },
    { name: 'Madrid, Spain', region: 'Europe', unlocked: true, bonus: '+10% Slide Speed', landmark: 'Gran Via Holographic Avenue', desc: 'Luminescent neo-classical avenues converted into hyper-speed obstacle channels.' },
    { name: 'Paris, France', region: 'Europe', unlocked: true, bonus: '+15% Jetpack Fuel', landmark: 'Eiffel Quantum Pylon', desc: 'The iron spire refitted with atmospheric ion thrusters for orbital leaps.' },
    { name: 'Kingston, Jamaica', region: 'Caribbean Diaspora', unlocked: true, bonus: '+25% Water/Swamp Glide', landmark: 'Blue Mountain Solar Array', desc: 'Tropical hillside tracks surrounded by vibrant solar panels and bass frequencies.' },
    { name: 'Hawaii, USA', region: 'Pacific Diaspora', unlocked: true, bonus: '+20% Double Jump Height', landmark: 'Mauna Kea Starlight Observatory', desc: 'Volcanic ridges glowing with geothermal particle accelerators and ocean mist.' },
    { name: 'Washington, USA', region: 'North America', unlocked: false, bonus: 'Unlocks at Level 10', landmark: 'Potomac Maglev Skyway', desc: 'Sleek sky bridges weaving between cybernetic monuments and high-speed rails.' },
    { name: 'London, United Kingdom', region: 'Europe', unlocked: false, bonus: 'Unlocks at Level 15', landmark: 'Thames Quantum Skyway', desc: 'River bridges retrofitted with magnetic hovertracks and fog-piercing lasers.' },
    { name: 'Cape Town, South Africa', region: 'Southern Africa', unlocked: false, bonus: 'Unlocks at Level 18', landmark: 'Table Mountain Neon Summit', desc: 'Coastal plateau surrounded by vertical glowing pylons and brisk oceanic drafts.' },
    { name: 'Sydney, Australia', region: 'Oceania', unlocked: false, bonus: 'Unlocks at Level 20', landmark: 'Harbour Opera Hologrid', desc: 'Ceramic sail structures radiating laser interference waves across the harbor.' },
    { name: 'Stockholm, Sweden', region: 'Nordic', unlocked: false, bonus: 'Unlocks at Level 22', landmark: 'Aurora Borealis Solar Tunnel', desc: 'Subterranean transit rails bathed in artificial northern lights.' },
    { name: 'Seoul, South Korea', region: 'East Asia', unlocked: false, bonus: 'Unlocks at Level 25', landmark: 'Gangnam Hyper Neon Grid', desc: 'Multi-tiered skyscraper networks saturated in holographic advertisements.' },
    { name: 'Delhi, India', region: 'South Asia', unlocked: false, bonus: 'Unlocks at Level 28', landmark: 'Red Fort Cyber Nexus', desc: 'Ancient sandstone pavilions shielded by plasma barriers and fiber-optic trees.' },
    { name: 'Beijing, China', region: 'East Asia', unlocked: false, bonus: 'Unlocks at Level 30', landmark: 'Forbidden City Quantum Spire', desc: 'Imperial imperial courtyards crisscrossed by automated magnetic freight lines.' }
  ];

  // The 6 Canonical Heroes
  const HEROES = [
    {
      name: 'Zara the Zephyr',
      archetype: 'Red Lion Superhero',
      ethnicity: 'Black Hausa Female',
      class: 'Guardian of Heritage',
      color: '#ef4444',
      origin: 'Kano, Nigeria',
      suit: 'Red spandex with bright gold light trimmings, opals, knee-length flowing hijab, and glowing red beads.',
      orb: 'Fiery Red Orb with spinning Egyptian Ankh & Fire glyphs (𓊽 𓏤 𓋹).',
      power: 'Fire Dash: Levitates above obstacles and creates fiery streak destroying barriers.',
      voice: 'small_combo'
    },
    {
      name: 'Tenko-Gen',
      archetype: 'Blue Giraffe Superhero',
      ethnicity: 'Brown-skinned Fulani Female',
      class: 'Wisdom Keeper',
      color: '#3b82f6',
      origin: 'Abuja, Nigeria',
      suit: 'Blue spandex, sacred blue beads, long braided hair with protective veil, and opals.',
      orb: 'Blue Orb with Eye of Horus & Wisdom glyphs (𓂀 𓇳 𓎛).',
      power: 'Foresight & Extend: Reaches high platforms and predicts upcoming obstacle trajectories.',
      voice: 'great_combo'
    },
    {
      name: 'King the Guardian',
      archetype: 'Green Eagle Superhero',
      ethnicity: 'Black Yoruba Male',
      class: 'Unity Champion',
      color: '#10b981',
      origin: 'Lagos, Nigeria',
      suit: 'Green warrior spandex, ancestral dreadlocks, and green brass hand/leg beads.',
      orb: 'Green Orb with Was Scepter & Strength glyphs (𓊪 𓂝 𓅓).',
      power: 'Wall Break & Brute Force: Smashes concrete barricades, trains, and falling timber.',
      voice: 'colossal_combo'
    },
    {
      name: 'Phantom Shadow',
      archetype: 'Orange Deer Superhero',
      ethnicity: 'Ibo Female',
      class: 'Future Visionary',
      color: '#f97316',
      origin: 'Enugu, Nigeria',
      suit: 'Orange stealth suit, orange & green ceremonial beads on waist, wrists, and ankles.',
      orb: 'Orange Orb spinning with phase glyphs and spatial rings.',
      power: 'Phase Shift: Becomes intangible, passing safely through solid trains and fog.',
      voice: 'stunning'
    },
    {
      name: 'Bola the Brave',
      archetype: 'White Bear Superhero',
      ethnicity: 'Ibo Female',
      class: 'Bridge Builder',
      color: '#0284c7',
      origin: 'Onitsha, Nigeria',
      suit: 'White spandex suit, crimson beads on arms and feet, and gold reinforced trimmings.',
      orb: 'White Orb spinning violently with crackling electric hieroglyphs.',
      power: 'Lightning Dash: Ultra-fast sprint with protective lightning aura, shielding passengers.',
      voice: 'blessings'
    },
    {
      name: 'Neoma the Healer',
      archetype: 'Yellow Seal Hero',
      ethnicity: 'Light-Skin Ibo Female',
      class: 'Innovation Pioneer',
      color: '#a855f7',
      origin: 'Owerri, Nigeria',
      suit: 'Leafy green and fruity spandex, long flowing braids, and rotating multi-color beads.',
      orb: 'Multi-Color Pulsing Orb with healing Sa amulets and botanical glyphs.',
      power: 'Protective Bubbles: Spawns fruity shields around player to absorb fatal obstacle hits.',
      voice: 'stunning'
    }
  ];

  // In-Game Store Data
  const BOOSTERS = [
    { id: 'speed', name: 'Speed Booster', desc: '2x Speed for 3s or 5x Speed for 7s surge.', cost: 50, icon: Rocket, type: 'booster' },
    { id: 'strength', name: 'Strength Booster', desc: 'Ancestral Aegis - smash through obstacles and trains.', cost: 75, icon: Shield, type: 'booster' },
    { id: 'water', name: 'Pure Water Booster', desc: 'Hydration Glide - glide safely over water & quicksand.', cost: 40, icon: Zap, type: 'booster' },
    { id: 'food', name: 'Energy Food Booster', desc: 'Super Sustenance - restore 1 heart life and stamina.', cost: 60, icon: Heart, type: 'booster' },
    { id: 'elixir', name: 'Sacred Elixir Booster', desc: 'Elixir of Immortality - auto-resurrect on fatal crash.', cost: 150, icon: Sparkles, type: 'booster' }
  ];

  const COIN_PACKS = [
    { id: 'coins-10', count: 10, cost: 5, label: '10 Coins Bag', bonus: 'Starter Stash' },
    { id: 'coins-35', count: 35, cost: 15, label: '35 Coins Pouch', bonus: '+5 Bonus Coins' },
    { id: 'coins-100', count: 100, cost: 40, label: '100 Coins Chest', bonus: '+20 Bonus Coins' },
    { id: 'coins-600', count: 600, cost: 200, label: '600 Coins Treasury', bonus: '+150 Bonus Coins' }
  ];

  const KEY_TIERS: { tier: KeyTier; name: string; cost: number; desc: string; perk: string }[] = [
    { tier: 'walk_way', name: 'Walk Way Key', cost: 10, desc: 'Unlocks ground path shortcuts and pedestrian lanes.', perk: 'Access 1 Hidden Path' },
    { tier: 'door_way', name: 'Door Way Key', cost: 25, desc: 'Opens subway station security doors and escape exits.', perk: 'Bypass Train Tunnel' },
    { tier: 'pathway', name: 'Pathway Key', cost: 60, desc: 'Reveals celestial aerial ramps and bridge overpasses.', perk: 'Elevate to Upper Track' },
    { tier: 'gateway', name: 'Gateway Key', cost: 150, desc: 'Unlocks inter-city transit portals without level lock.', perk: 'Unlock Any Locked City' },
    { tier: 'lions_gate', name: 'Lion\'s Gate Key', cost: 400, desc: 'The ultimate royal key. Opens the Hall of Sovereignty vault.', perk: 'Permanent +0.5x Multiplier' }
  ];

  const ENERGY_LEVELS: { tier: EnergyLevel; level: number; name: string; perk: string; desc: string; cost: number }[] = [
    { tier: 'Emenike', level: 1, name: 'Emenike Tier', perk: '+5% Base Speed', desc: 'Primal vitality of the ancestors.', cost: 20 },
    { tier: 'Prime', level: 2, name: 'Prime Tier', perk: '+10% Shield Duration', desc: 'Hardened celestial energy mantle.', cost: 45 },
    { tier: 'Sungo', level: 3, name: 'Sungo Tier', perk: '+15% Fire Dash Duration', desc: 'Solar combustion aura from the northern sun.', cost: 80 },
    { tier: 'Igwe', level: 4, name: 'Igwe Tier', perk: '+20% Lightning Charge', desc: 'Sky lightning harnessed for instant burst.', cost: 120 },
    { tier: 'Snow', level: 5, name: 'Snow Tier', perk: '+25% Quicksand Freeze', desc: 'Harmattan frost crystalizing terrain.', cost: 175 },
    { tier: 'Iwangee', level: 6, name: 'Iwangee Tier', perk: '+30% Double Jump Height', desc: 'Ancestral spring coil defying gravity.', cost: 240 },
    { tier: 'Eke', level: 7, name: 'Eke Tier', perk: '+35% Coin Magnet Radius', desc: 'Cosmic gravitational alignment.', cost: 320 },
    { tier: 'Afo', level: 8, name: 'Afo Tier', perk: '+40% Fruit Multiplier', desc: 'Blessings of abundance on sacred effigies.', cost: 420 },
    { tier: 'Okorie', level: 9, name: 'Okorie Tier', perk: '+45% Phase Shift Time', desc: 'Dimensional ether phasing through solid trains.', cost: 550 },
    { tier: 'Nkwo', level: 10, name: 'Nkwo Tier', perk: '+50% Ancestral Omnipresence', desc: 'Transcendent supreme state of the Six.', cost: 750 }
  ];

  const TIME_EXTENSIONS = [
    { duration: '30 Mins', cost: 20, desc: 'Extend current run duration window by 30 minutes.' },
    { duration: '1 Hour', cost: 35, desc: 'Extend active mission timer and multiplier window by 1 hour.' },
    { duration: '6 Hours', cost: 100, desc: 'Maintain session leaderboard multiplier for 6 hours.' },
    { duration: '12 Hours', cost: 180, desc: 'Half-day protection shield and score boost retention.' },
    { duration: '48 Hours', cost: 500, desc: 'Full weekend tournament endurance boost across all cities.' }
  ];

  const PORTALS: { type: PortalType; name: string; elements: string; desc: string; cost: number }[] = [
    {
      type: 'CERN',
      name: 'CERN Quantum Accelerator Portal',
      elements: 'Carbon & Hydrogen Atoms',
      desc: 'Sub-atomic particle ring colliding atomic hydrogen to teleport runner across 1,000m instantly.',
      cost: 150
    },
    {
      type: 'ILUMINA',
      name: 'Ilumina Celestial Portal',
      elements: 'Cosmic Wind & Water',
      desc: 'Mystic portal generating hurricane winds and tidal currents that carry runner above all obstacles.',
      cost: 250
    },
    {
      type: 'ILUMINATA',
      name: 'Iluminata Primal Portal',
      elements: 'Rocks & Fire Particles',
      desc: 'Ancient rift erupting with volcanic magma and meteor shards that incinerate all obstacles ahead.',
      cost: 400
    }
  ];

  // Store Purchase Handler
  const handlePurchase = (itemTitle: string, costFic: number, category: string, keyName?: string) => {
    if (audioEngine) {
      audioEngine.playVoiceLine('owo_ni_koko');
    }
    if (category === 'booster') {
      setInventory(prev => ({
        ...prev,
        boosters: {
          ...prev.boosters,
          [keyName || 'speed']: (prev.boosters[keyName || 'speed'] || 0) + 1
        }
      }));
    } else if (category === 'coins') {
      setInventory(prev => ({
        ...prev,
        coins: prev.coins + (Number(keyName) || 10)
      }));
    } else if (category === 'key') {
      const k = keyName as KeyTier;
      setInventory(prev => ({
        ...prev,
        keys: {
          ...prev.keys,
          [k]: (prev.keys[k] || 0) + 1
        }
      }));
    } else if (category === 'energy') {
      setInventory(prev => ({
        ...prev,
        energyTier: keyName as EnergyLevel
      }));
    } else if (category === 'portal') {
      setInventory(prev => ({
        ...prev,
        activePortal: keyName as PortalType
      }));
    }

    if (showToast) {
      showToast(`Successfully purchased ${itemTitle} for ${costFic} FIC!`, 'success');
    }
  };

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <MainLayout>
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                ENERGY: {inventory.energyTier}
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
              Immerse yourself in the flagship high-speed runner & chaser arena. Master the six cultural guardians, unleash spinning Egyptian orbs, traverse CERN portals, and earn protocol FIC rewards.
            </p>
          </div>

          {/* FIC Wallet & Inventory Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 p-3 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-950 block uppercase tracking-wider">Run Coins</span>
                <span className="text-lg font-black text-amber-950">{inventory.coins.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-300 p-3 rounded-xl shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-emerald-950 block uppercase tracking-wider">Protocol Wallet</span>
                <span className="text-lg font-black text-emerald-950">{ficBalance || '1,250'} FIC</span>
              </div>
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
            <span>3D Runner & Chaser Arena</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'store'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>In-Game Bazaar (Store)</span>
          </button>

          <button
            onClick={() => setActiveTab('missions')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'missions'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Missions & Quests Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('heroes')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'heroes'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
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
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            <span>SuperVi Lore & Concept Guide</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: 3D RUNNER & CHASER ARENA (WITH 3-COLUMN POSTCARD LAYOUT BENEATH)   */}
        {/* ========================================================================= */}
        {activeTab === 'arena' && (
          <div className="space-y-6">
            {/* Top Column: Big 3D WebGL Canvas Arena */}
            <div className="rounded-2xl overflow-hidden border border-slate-300 shadow-md">
              <SuperViGame
                onExit={() => setActiveTab('leaderboard')}
                onAnalyticsUpdate={(data) => setAnalytics(data)}
              />
            </div>

            {/* 3-Column Postcard Layout Section */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    Postcard Telemetry & Real-Time Mission Analytics
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-300">
                  Active Mode: 3-Column Postcard Matrix
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Bottom-Left Column: 3 Postcard Cards (5 Cols on LG) */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sky-600" />
                    <span>Visual Postcards (3 Identity Cards)</span>
                  </h3>

                  {/* Postcard 1: Active City Landmark */}
                  <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -z-0 opacity-80" />
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-950 border border-sky-300 uppercase">
                            {CITIES[activeCityIndex].region}
                          </span>
                          <span className="text-[11px] font-black text-emerald-800">
                            {CITIES[activeCityIndex].bonus}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mt-1 truncate">
                          {CITIES[activeCityIndex].name}
                        </h4>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">
                          Landmark: {CITIES[activeCityIndex].landmark}
                        </p>
                        <p className="text-xs text-slate-700 mt-1 line-clamp-2">
                          {CITIES[activeCityIndex].desc}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Postcard 2: Active Hero Lore & Egyptian Orb */}
                  <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -z-0 opacity-80" />
                    <div className="relative z-10 flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-black text-white text-base"
                        style={{ backgroundColor: HEROES[activeHeroIndex].color }}
                      >
                        {HEROES[activeHeroIndex].name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 uppercase">
                            {HEROES[activeHeroIndex].class}
                          </span>
                          <button
                            onClick={() => audioEngine.playVoiceLine(HEROES[activeHeroIndex].voice as any)}
                            className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
                            title="Play Hero Voice Line"
                          >
                            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                          </button>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mt-1 truncate">
                          {HEROES[activeHeroIndex].name}
                        </h4>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">
                          {HEROES[activeHeroIndex].ethnicity} ({HEROES[activeHeroIndex].origin})
                        </p>
                        <p className="text-xs text-slate-700 mt-1 line-clamp-2">
                          {HEROES[activeHeroIndex].suit}
                        </p>
                        <div className="mt-2 text-xs font-bold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200">
                          Orb: {HEROES[activeHeroIndex].orb}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Postcard 3: Current Mission Trophy & Objective */}
                  <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-0 opacity-80" />
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-lg">
                        <Trophy className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300 uppercase">
                            Active Mission
                          </span>
                          <span className="text-[11px] font-black text-purple-950">
                            Reward: +350 FIC
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mt-1 truncate">
                          Lekki Expressway Breakthrough
                        </h4>
                        <p className="text-xs font-bold text-slate-800 mt-0.5">
                          Objective: Cover 10,000m & Collect 500 Coins
                        </p>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                          <div
                            className="bg-purple-600 h-full rounded-full transition-all"
                            style={{ width: `${Math.min(100, (analytics.distanceCovered / 10000) * 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-700 font-semibold mt-1">
                          <span>{analytics.distanceCovered.toLocaleString()}m / 10,000m</span>
                          <span>{Math.min(100, Math.floor((analytics.distanceCovered / 10000) * 100))}% Complete</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom-Right Column: Information, Data, Statistics & Analysis (7 Cols on LG) */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>Real-Time Statistics, Diagnostics & Economy Analysis</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Metric 1: Player Score */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Live Score</span>
                      <span className="text-xl font-black text-slate-900 mt-0.5 block">{analytics.score.toLocaleString()}</span>
                      <span className="text-[11px] font-bold text-emerald-800">Multiplier: {analytics.scoreMultiplier}x</span>
                    </div>

                    {/* Metric 2: Acquired Gifts */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Acquired Gifts</span>
                      <span className="text-xl font-black text-amber-900 mt-0.5 block">{analytics.giftsAcquired.toLocaleString()}</span>
                      <span className="text-[11px] font-bold text-slate-700">Coins & Feathers</span>
                    </div>

                    {/* Metric 3: Earned FIC */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Earned FIC</span>
                      <span className="text-xl font-black text-emerald-950 mt-0.5 block">+{analytics.ficEarned} FIC</span>
                      <span className="text-[11px] font-bold text-emerald-800">Protocol Vault</span>
                    </div>

                    {/* Metric 4: Duration of Play */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Duration of Play</span>
                      <span className="text-xl font-black text-slate-900 mt-0.5 block">{formatTime(analytics.playDurationSeconds)}</span>
                      <span className="text-[11px] font-bold text-slate-700">Active Session</span>
                    </div>

                    {/* Metric 5: Distance Covered */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Distance Covered</span>
                      <span className="text-xl font-black text-slate-900 mt-0.5 block">{analytics.distanceCovered.toLocaleString()}m</span>
                      <span className="text-[11px] font-bold text-sky-800">Ground & Rails</span>
                    </div>

                    {/* Metric 6: Distance to Goal */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Distance to Goal</span>
                      <span className="text-xl font-black text-slate-900 mt-0.5 block">{analytics.distanceToGoal.toLocaleString()}m</span>
                      <span className="text-[11px] font-bold text-purple-800">Next Portal Gate</span>
                    </div>

                    {/* Metric 7: Time Remaining */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Time Remaining</span>
                      <span className="text-xl font-black text-red-700 mt-0.5 block">{formatTime(analytics.timeLeftSeconds)}</span>
                      <span className="text-[11px] font-bold text-slate-700">Mission Window</span>
                    </div>

                    {/* Metric 8: Permanent Boosts */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-300 shadow-sm">
                      <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Permanent Boosts</span>
                      <span className="text-xl font-black text-slate-900 mt-0.5 block">{analytics.permanentBoosts} Active</span>
                      <span className="text-[11px] font-bold text-emerald-800">Egyptian Orb + Suit</span>
                    </div>
                  </div>

                  {/* Detailed Analysis & Chaser Radar Card */}
                  <div className="bg-white p-5 rounded-xl border border-slate-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>AI Totem Chaser Proximity Radar & 5D Spatial Analysis</span>
                      </h4>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                        Status: Safe Distance (14.2m)
                      </span>
                    </div>
                    <p className="text-xs text-slate-700">
                      The AI Totem Enforcer pursues runners when speed drops below threshold. Triggering obstacle breaks with King or Fire Dashes with Zara resets chaser proximity to maximum range (15m).
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-900 block">Active Portal Mode</span>
                        <span className="text-slate-700">{inventory.activePortal || 'CERN Quantum Accelerator'}</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-900 block">Spiritual Energy Level</span>
                        <span className="text-slate-700">{inventory.energyTier} (Tier {ENERGY_LEVELS.find(e => e.tier === inventory.energyTier)?.level || 1})</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-900 block">Keys in Inventory</span>
                        <span className="text-slate-700">{Object.values(inventory.keys).reduce((a, b) => a + b, 0)} Total Keys</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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

        {/* ========================================================================= */}
        {/* TAB 2: IN-GAME BAZAAR & STORE                                             */}
        {/* ========================================================================= */}
        {activeTab === 'store' && (
          <div className="space-y-6">
            {/* Store Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-300 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  SuperVi In-Game Bazaar
                </span>
                <h2 className="text-2xl font-black tracking-tight">The Grand Afro-Futuristic Emporium</h2>
                <p className="text-slate-300 text-xs max-w-xl">
                  Acquire power boosters, buy coins, unlock sacred key tiers, awaken African spiritual energy levels, and activate atomic CERN particle portals.
                </p>
              </div>
              <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <Zap className="w-6 h-6 text-emerald-400" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-semibold">Available Protocol Funds</span>
                  <span className="text-xl font-black text-emerald-400">{ficBalance || '1,250'} FIC</span>
                </div>
              </div>
            </div>

            {/* Section 1: 5 Gameplay Boosters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-purple-600" />
                  <span>1. Gameplay Boosters (5 Specialized Types)</span>
                </h3>
                <span className="text-xs text-slate-700 font-semibold">Instant In-Game Activation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {BOOSTERS.map((b) => {
                  const Icon = b.icon;
                  const count = inventory.boosters[b.id] || 0;
                  return (
                    <div key={b.id} className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900">
                            <Icon className="w-5 h-5 text-emerald-600" />
                          </div>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            Owned: {count}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{b.name}</h4>
                        <p className="text-xs text-slate-700 leading-snug">{b.desc}</p>
                      </div>
                      <button
                        onClick={() => handlePurchase(b.name, b.cost, 'booster', b.id)}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>Buy for {b.cost} FIC</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: 4 Coin Packages */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span>2. Coin Treasury Bundles (4 Coin Packages)</span>
                </h3>
                <span className="text-xs text-slate-700 font-semibold">Collected Coins: {inventory.coins.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COIN_PACKS.map((cp) => (
                  <div key={cp.id} className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">🪙</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-300">
                          {cp.bonus}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">{cp.label}</h4>
                      <p className="text-xs text-slate-700">Immediate credit of {cp.count} gold coins to your active game session.</p>
                    </div>
                    <button
                      onClick={() => handlePurchase(cp.label, cp.cost, 'coins', String(cp.count))}
                      className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Buy for {cp.cost} FIC</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: 5 Key Tiers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Key className="w-5 h-5 text-sky-600" />
                  <span>3. Sacred Key Tiers (5 Progression Keys)</span>
                </h3>
                <span className="text-xs text-slate-700 font-semibold">Bypass Tunnels & City Gates</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {KEY_TIERS.map((kt) => {
                  const owned = inventory.keys[kt.tier] || 0;
                  return (
                    <div key={kt.tier} className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xl">🗝️</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-950 border border-sky-300">
                            Owned: {owned}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{kt.name}</h4>
                        <p className="text-xs text-slate-700">{kt.desc}</p>
                        <div className="text-[11px] font-bold text-sky-900 bg-sky-50 p-1.5 rounded border border-sky-200">
                          {kt.perk}
                        </div>
                      </div>
                      <button
                        onClick={() => handlePurchase(kt.name, kt.cost, 'key', kt.tier)}
                        className="w-full py-2 px-3 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>Acquire for {kt.cost} FIC</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 4: 10 African Spiritual Energy Levels */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-600" />
                  <span>4. Ten African Spiritual Energy Levels (Ancestral Tiers)</span>
                </h3>
                <span className="text-xs text-slate-700 font-semibold">Active Tier: {inventory.energyTier}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {ENERGY_LEVELS.map((el) => {
                  const isCurrent = inventory.energyTier === el.tier;
                  return (
                    <div
                      key={el.tier}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-50/70 shadow-md ring-2 ring-amber-300'
                          : 'border-slate-300 bg-white shadow-sm'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                            Tier {el.level}
                          </span>
                          <span className="text-[11px] font-black text-amber-950">
                            {el.perk}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900">{el.name}</h4>
                        <p className="text-xs text-slate-700">{el.desc}</p>
                      </div>
                      {isCurrent ? (
                        <div className="w-full py-2 text-center text-xs font-bold text-amber-950 bg-amber-200/60 rounded-lg border border-amber-300">
                          Active Energy Tier ✅
                        </div>
                      ) : (
                        <button
                          onClick={() => handlePurchase(el.name, el.cost, 'energy', el.tier)}
                          className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <span>Awaken for {el.cost} FIC</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 5: CERN, Ilumina & Iluminata Portals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>5. Gateway Portals (CERN, Ilumina, Iluminata Particle Accelerators)</span>
                </h3>
                <span className="text-xs text-slate-700 font-semibold">Colliding Atomic Particles</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PORTALS.map((p) => {
                  const isActive = inventory.activePortal === p.type;
                  return (
                    <div
                      key={p.type}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                        isActive
                          ? 'border-purple-400 bg-purple-50/70 shadow-md ring-2 ring-purple-300'
                          : 'border-slate-300 bg-white shadow-sm'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300 uppercase">
                            {p.type} Gate
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            {p.cost} FIC
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-900">{p.name}</h4>
                        <div className="text-xs font-bold text-purple-950 bg-purple-100 p-2 rounded-lg border border-purple-200">
                          Colliding Effects: {p.elements}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{p.desc}</p>
                      </div>
                      <button
                        onClick={() => handlePurchase(p.name, p.cost, 'portal', p.type)}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          isActive
                            ? 'bg-purple-900 text-white shadow'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{isActive ? 'Portal Active & Online' : 'Ignite Portal Gateway'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 6: Time Extension Boosters */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <span>6. Time Extension Boosters (Session Windows)</span>
                </h3>
                <span className="text-xs text-slate-700 font-semibold">Extend Run Windows</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {TIME_EXTENSIONS.map((te, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Clock className="w-5 h-5 text-teal-600" />
                        <span className="text-xs font-black text-slate-900">{te.cost} FIC</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900">+{te.duration}</h4>
                      <p className="text-xs text-slate-700">{te.desc}</p>
                    </div>
                    <button
                      onClick={() => handlePurchase(`+${te.duration} Extension`, te.cost, 'time')}
                      className="w-full py-2 px-3 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span>Extend for {te.cost} FIC</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MISSIONS & QUESTS HUB (WITH 3-COLUMN POSTCARD LAYOUT)              */}
        {/* ========================================================================= */}
        {activeTab === 'missions' && (
          <div className="space-y-6">
            {/* Top Column: Big Cinematic Mission Preview Banner */}
            <div className="bg-slate-900 rounded-2xl border border-slate-300 text-white p-6 md:p-8 relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-transparent z-10" />
              <img
                src="/images/supervi-banner.png"
                alt="SuperVi Missions"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="relative z-20 max-w-2xl space-y-3">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-400 text-slate-950 uppercase tracking-wider">
                  Postcard Mission Architecture
                </span>
                <h2 className="text-3xl font-black tracking-tight">SuperVi Mission Control & Quests</h2>
                <p className="text-sm text-slate-200 leading-relaxed">
                  Engage in the high-stakes mission structure: Present Missions, New Unlocks, Community Proposed Missions, and Multi-Tier Feather & Coin Harvests.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-600 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Trophy className="w-4 h-4" /> 12 Active Missions
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-600 text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Coins className="w-4 h-4" /> Daily: Up to 105,000 Coins
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-slate-800/80 border border-slate-600 text-xs font-bold text-purple-400 flex items-center gap-1.5">
                    <Feather className="w-4 h-4" /> Feathers: Up to 15,000
                  </span>
                </div>
              </div>
            </div>

            {/* 3-Column Postcard Layout for Missions */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    Mission Postcards (Present, New & Proposed)
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-white px-3 py-1 rounded-full border border-slate-300">
                  Layout: 3 Postcards (Left) + Analytics (Right)
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Bottom-Left: 3 Postcards */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Postcard 1: Present Mission */}
                  <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 uppercase">
                        1. Present Mission
                      </span>
                      <span className="text-xs font-black text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        +250 FIC
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">The Lekki Expressway Sprint</h4>
                    <p className="text-xs text-slate-700 mt-1">Cover 5,000m in Lagos without tripping or slowing down below 1.2x speed.</p>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '65%' }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-700 font-semibold mt-1">
                      <span>Progress: 3,250m / 5,000m</span>
                      <span>65% Active</span>
                    </div>
                  </div>

                  {/* Postcard 2: New Mission */}
                  <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-950 border border-sky-300 uppercase">
                        2. New Mission (Unlocks Next)
                      </span>
                      <span className="text-xs font-black text-sky-950 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                        +500 FIC + Gateway Key
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">Zuma Rock Cyber Spire Siege</h4>
                    <p className="text-xs text-slate-700 mt-1">Shatter 20 rogue obstacles with King the Guardian’s Wall Break ability in Abuja.</p>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: '0%' }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-700 font-semibold mt-1">
                      <span>Requirement: Complete Present Mission</span>
                      <span>Locked 🔒</span>
                    </div>
                  </div>

                  {/* Postcard 3: Proposed Mission */}
                  <div className="bg-white rounded-xl border border-slate-300 p-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-950 border border-purple-300 uppercase">
                        3. Proposed Community Mission
                      </span>
                      <span className="text-xs font-black text-purple-950 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        +750 FIC + Ilumina Portal
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900">Ancient Kano Walls Night Patrol</h4>
                    <p className="text-xs text-slate-700 mt-1">Harvest 15 Watermelons and 2,000 Feathers during night cycle with Zara.</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-700 font-semibold">1,428 Members Voted</span>
                      <button
                        onClick={() => {
                          setVotedProposedMission(!votedProposedMission);
                          showToast(votedProposedMission ? 'Vote removed' : 'Voted for Ancient Kano Walls Mission!', 'success');
                        }}
                        className={`py-1.5 px-3 rounded-lg font-bold text-xs transition-colors ${
                          votedProposedMission
                            ? 'bg-purple-900 text-white'
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                      >
                        {votedProposedMission ? 'Voted ✅' : 'Vote to Launch'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom-Right: Statistics & Analysis */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm space-y-4">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Mission Progression & Protocol Quotas
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-700 block">Completed Quests</span>
                        <span className="text-lg font-black text-slate-900 mt-0.5 block">24 / 36</span>
                        <span className="text-[11px] font-bold text-emerald-800">66.7% Completion</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-700 block">Total FIC Bounty</span>
                        <span className="text-lg font-black text-emerald-950 mt-0.5 block">14,850 FIC</span>
                        <span className="text-[11px] font-bold text-slate-700">Cumulative Earned</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[11px] font-bold text-slate-700 block">Active Multiplier</span>
                        <span className="text-lg font-black text-purple-900 mt-0.5 block">1.8x</span>
                        <span className="text-[11px] font-bold text-purple-800">Mission Stacking</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      <h5 className="text-xs font-black text-slate-900 uppercase">System Curated Missions & Points</h5>
                      <div className="space-y-2 text-xs">
                        {[
                          { id: 'curated-1', title: 'Savannah Leopard Stunner', points: '12,500 Pts', fic: '300 FIC', goal: 'Stun 5 pursuing leopards in Nairobi' },
                          { id: 'curated-2', title: 'Quantum Tunnel Glider', points: '18,000 Pts', fic: '450 FIC', goal: 'Glide under 15 low bridges in Madrid' },
                          { id: 'curated-3', title: 'Sunken Citadel Discovery', points: '25,000 Pts', fic: '600 FIC', goal: 'Discover 3 hidden underwater CERN nodes' }
                        ].map((cm) => (
                          <div
                            key={cm.id}
                            onClick={() => setSelectedCuratedMissionId(cm.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                              selectedCuratedMissionId === cm.id
                                ? 'border-purple-400 bg-purple-50/70 font-semibold'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <span className="font-bold text-slate-900 block">{cm.title}</span>
                              <span className="text-slate-700">{cm.goal}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-black text-purple-950 block">{cm.points}</span>
                              <span className="text-emerald-800 font-bold">+{cm.fic}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3 space-y-2">
                      <h5 className="text-xs font-black text-slate-900 uppercase">Multiplayer Missions & Time Extensions</h5>
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block">4-Player Sovereign Relay (Lagos to Addis Ababa)</span>
                          <span className="text-slate-700">Team synchronizes orb abilities to reach 50,000m together.</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-amber-950 block">+1,200 FIC</span>
                          <span className="text-teal-900 font-bold">+1 Hour Extension</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily & Monthly Quest Matrices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Daily Quests: Coin Targets */}
              <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-amber-500" />
                    <span>Daily Quest: Coin Pickups (6 Tiers)</span>
                  </h3>
                  <span className="text-xs font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                    Resets Daily
                  </span>
                </div>
                <div className="space-y-2.5 text-xs">
                  {[
                    { target: '5,500 Coins', fic: '50 FIC', prog: '5,500 / 5,500', done: true },
                    { target: '15,000 Coins', fic: '120 FIC', prog: '12,400 / 15,000', done: false },
                    { target: '25,000 Coins', fic: '250 FIC', prog: '12,400 / 25,000', done: false },
                    { target: '50,000 Coins', fic: '500 FIC', prog: '12,400 / 50,000', done: false },
                    { target: '75,000 Coins', fic: '800 FIC', prog: '12,400 / 75,000', done: false },
                    { target: '105,000 Coins', fic: '1,200 FIC + Lion\'s Gate Key', prog: '12,400 / 105,000', done: false }
                  ].map((dq, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="font-black text-slate-900 block">Pick up {dq.target}</span>
                        <span className="text-slate-700 font-semibold">Progress: {dq.prog}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-950 block">+{dq.fic}</span>
                        <span className={`text-[11px] font-bold ${dq.done ? 'text-emerald-800' : 'text-slate-600'}`}>
                          {dq.done ? 'Claimed ✅' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Quests & Feathers Pickups */}
              <div className="space-y-6">
                {/* Monthly Quests */}
                <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-purple-600" />
                      <span>Monthly Quests: Weekly High Volume</span>
                    </h3>
                    <span className="text-xs font-bold text-purple-950 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                      Weekly Cycle
                    </span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {[
                      { target: '500,000 Coins in a week', reward: '2,500 FIC' },
                      { target: '700,000 Coins in a week', reward: '4,000 FIC' },
                      { target: '1,000,000 Coins in a week', reward: '7,500 FIC + Iluminata Portal Pass' }
                    ].map((mq, idx) => (
                      <div key={idx} className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 flex items-center justify-between">
                        <span className="font-black text-slate-900">{mq.target}</span>
                        <span className="font-black text-purple-950 bg-white px-2.5 py-1 rounded border border-purple-300">
                          {mq.reward}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feather Milestones */}
                <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Feather className="w-5 h-5 text-sky-600" />
                      <span>Feather Milestones Along the Way</span>
                    </h3>
                    <span className="text-xs font-bold text-sky-950 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                      Rare Collectibles
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { feathers: '2,000 Feathers', reward: '100 FIC' },
                      { feathers: '5,000 Feathers', reward: '300 FIC' },
                      { feathers: '7,000 Feathers', reward: '600 FIC' },
                      { feathers: '15,000 Feathers', reward: '1,500 FIC + Golden Jetpack' }
                    ].map((fm, idx) => (
                      <div key={idx} className="p-3 bg-sky-50/50 rounded-xl border border-sky-200">
                        <span className="font-black text-slate-900 block">{fm.feathers}</span>
                        <span className="text-sky-950 font-bold block mt-1">{fm.reward}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Along the Way Strength Effigies & Fruit Boosters Showcase */}
            <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm space-y-4">
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>Along the Way: Sacred Strength Effigies & Fruit Boosters</span>
              </h3>
              <p className="text-xs text-slate-700">
                Spawning dynamically during runs. Collecting effigies boosts hero resistance, while fruit boosters temporarily upgrade stamina and multiplier stats.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
                {[
                  { name: 'Kolanut', type: 'Effigy', perk: '+10% Focus', icon: '🌰' },
                  { name: 'Roast Chicken', type: 'Effigy', perk: '+1 Life Heart', icon: '🍗' },
                  { name: 'Sugar Cane', type: 'Effigy', perk: '+15s Stamina', icon: '🎋' },
                  { name: 'Agbalumo', type: 'Effigy', perk: '+2x Coin Magnet', icon: '🍊' },
                  { name: 'Guava', type: 'Effigy', perk: '+10% Speed', icon: '🍈' },
                  { name: 'Cashew', type: 'Effigy', perk: '+5% Shield', icon: '🥜' },
                  { name: 'Coconuts', type: 'Effigy', perk: '+20% Glide', icon: '🥥' },
                  { name: 'Chia Seeds', type: 'Effigy', perk: '+30% Jump', icon: '🌱' },
                  { name: 'Watermelon', type: 'Booster', perk: '+25s Refresh', icon: '🍉' },
                  { name: 'Apples', type: 'Booster', perk: '+15% Agility', icon: '🍎' },
                  { name: 'Bananas', type: 'Booster', perk: '+20% Pace', icon: '🍌' },
                  { name: 'Oranges', type: 'Booster', perk: '+10% Multiplier', icon: '🍊' },
                  { name: 'Pineapples', type: 'Booster', perk: '+35% Invincibility', icon: '🍍' },
                  { name: 'Feathers', type: 'Collectible', perk: 'Fly Multiplier', icon: '🪶' },
                  { name: '15 Paces', type: 'Speed Surge', perk: '+15m Leap', icon: '⚡' },
                  { name: '25 Paces', type: 'Speed Surge', perk: '+25m Leap', icon: '🚀' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-2xl block">{item.icon}</span>
                    <span className="font-black text-slate-900 text-xs block truncate">{item.name}</span>
                    <span className="text-[10px] font-bold text-slate-600 block uppercase">{item.type}</span>
                    <span className="text-[10px] font-black text-emerald-800 block">{item.perk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: THE SIX HEROES DOSSIER                                             */}
        {/* ========================================================================= */}
        {activeTab === 'heroes' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">The Six Chosen Guardians of Africa</h2>
                <p className="text-xs text-slate-700">
                  Each guardian wields an ancient glowing Egyptian orb and distinct tribal superhero abilities.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-950 rounded-full border border-emerald-400">
                All 6 Guardians Unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {HEROES.map((hero, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md text-base"
                        style={{ backgroundColor: hero.color }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-black text-slate-900">{hero.name}</h3>
                        <span className="text-xs font-semibold text-slate-700 block">
                          {hero.archetype} ({hero.ethnicity})
                        </span>
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
                      <span className="font-bold text-slate-900 block">Origin City:</span>
                      <span className="text-slate-700">{hero.origin}</span>
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

                  <button
                    onClick={() => {
                      setActiveHeroIndex(i);
                      setActiveTab('arena');
                      showToast(`Selected ${hero.name}! Ready to launch.`, 'success');
                    }}
                    className="w-full py-2 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                  >
                    Select {hero.name} for Run
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: WORLD TOUR CITIES (16 CITIES)                                      */}
        {/* ========================================================================= */}
        {activeTab === 'cities' && (
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">SuperVi 16-City Global World Tour</h2>
                <p className="text-xs text-slate-700">
                  Sprint across Afro-futuristic cyber tracks, each with localized obstacles, architectural landmarks, and scoring bonuses.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-300">
                16 Total Global Locations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CITIES.map((city, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (city.unlocked) {
                      setActiveCityIndex(idx);
                      showToast(`Selected ${city.name}!`, 'success');
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    activeCityIndex === idx
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-300 shadow-md'
                      : city.unlocked
                      ? 'border-slate-300 bg-white hover:border-slate-400 shadow-sm'
                      : 'border-slate-300 bg-slate-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-900">{city.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          city.unlocked ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {city.unlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 block">{city.landmark}</span>
                    <span className="text-[11px] text-slate-700 block mt-1">{city.desc}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-emerald-800 font-bold">{city.bonus}</span>
                    {activeCityIndex === idx && <span className="text-emerald-900 font-black">Active Track ✅</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: GLOBAL LEADERBOARD                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Hall of Sovereignty Leaderboard</h2>
                <p className="text-xs text-slate-700">Top-ranking SuperVi runners competing for monthly FIC prize pools.</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-950 rounded-full border border-amber-300">
                Monthly Prize Pool: 50,000 FIC
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Runner Name</th>
                    <th className="py-3 px-4">Hero Guardian</th>
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

        {/* ========================================================================= */}
        {/* TAB 7: MEMBER-FRIENDLY SUPERVI LORE & CONCEPT GUIDE (TASK 2)              */}
        {/* ========================================================================= */}
        {activeTab === 'guide' && (
          <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 md:p-8 space-y-8">
            <div className="border-b border-slate-200 pb-5 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-950 border border-teal-300 uppercase">
                Official SuperVi Platform Documentation
              </span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                SuperVi: Orbs of Glory – The Complete Member Concept Guide
              </h2>
              <p className="text-slate-700 text-sm max-w-3xl leading-relaxed">
                Welcome to the sovereign universe of SuperVi. This guide explains the entire game concept from inception to mastery, detailing its cultural origins, dual gameplay roles, multi-sensory 5D engine, and on-chain FIC rewards.
              </p>
            </div>

            {/* Chapter 1: Story & The Awakening */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Chapter 1: The Cosmic Genesis & Awakening of the Six</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Centuries ago, ancient Egyptian celestial orbs forged from concentrated starlight fell across the African continent. These orbs inscribed with sacred hieroglyphs (Ankh, Was Scepter, Eye of Horus) fused with deep ancestral earth energy. In the Afro-futuristic era, rapid urbanization and rogue cybernetic trains threatened community safety. The six orbs awakened six cultural guardians from Kano, Abuja, Lagos, Enugu, Onitsha, and Owerri.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-black text-slate-900 text-xs block">Zara & Tenko-Gen</span>
                  <span className="text-xs text-slate-700">The Hausa and Fulani guardians commanding fire levitation and foresight vision across the Sahel.</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-black text-slate-900 text-xs block">King the Guardian</span>
                  <span className="text-xs text-slate-700">The Yoruba champion of unity whose brute force smashes concrete barriers and rescues civilians.</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-black text-slate-900 text-xs block">Phantom, Bola & Neoma</span>
                  <span className="text-xs text-slate-700">The Ibo triumvirate wielding dimensional phase shifting, lightning speed, and healing botanical sanctuary bubbles.</span>
                </div>
              </div>
            </div>

            {/* Chapter 2: The Dual Role Choice */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-emerald-600" />
                <span>Chapter 2: Two Ways to Play – Escape Runner vs AI Totem Chaser</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                SuperVi breaks traditional runner tropes by allowing players to choose their role at the start of every session:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 space-y-1.5">
                  <span className="font-black text-emerald-950 text-sm block">1. The Escape Runner</span>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    Navigate high-speed multi-lane tracks, jump over fallen timber and quicksands, slide beneath trains, collect golden coins and feathers, and evade the pursuing Totem Enforcer.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-300 space-y-1.5">
                  <span className="font-black text-purple-950 text-sm block">2. The Hunter AI Totem Chaser</span>
                  <p className="text-xs text-slate-800 leading-relaxed">
                    Assume the mantle of the relentless Enforcer. Track runner movements, predict lane shifts, activate pursuit surges, and capture renegade runners to claim sovereign protocol bounties.
                  </p>
                </div>
              </div>
            </div>

            {/* Chapter 3: The 3D-5D Dimension Hierarchy */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-600" />
                <span>Chapter 3: The 3D–5D Multi-Sensory Dimension Hierarchy</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-900 block">3D (Spatial)</span>
                  <p className="text-slate-700">WebGL Three.js physics tracks (X in [-3, 0, 3]), procedural train models, highway overpasses, and particle ring portals.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-900 block">4D (Temporal)</span>
                  <p className="text-slate-700">Day/dusk/night lighting transitions, fluctuating spawn intervals (2–3s, 5–8s, 6–8s, 3–5s, 11–19s), and weather cycles.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-black text-slate-900 block">5D (Sensory & Cultural)</span>
                  <p className="text-slate-700">Dynamic native African voice commentary, Web Vibration API device haptics, and instant token payouts to your protocol FIC balance.</p>
                </div>
              </div>
            </div>

            {/* Chapter 4: Economy & CERN Portals */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span>Chapter 4: In-Game Economy, Keys, Energy Levels & Portals</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Success in SuperVi is rewarded with tangible protocol value. Coins collected during runs buy immediate upgrades in the Bazaar. Keys grant access to secret tracks. The 10 African Spiritual Energy Levels permanently heighten your reflex and score multipliers. When ready, step through the colliding particle rings of CERN, Ilumina, and Iluminata to traverse distant continents in the blink of an eye.
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SuperViPage;
