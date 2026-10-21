// ============================================================================
// SuperVi API & 3D Visualization Service
// Connects frontend runner to backend APIs with reliable offline/fallback data
// ============================================================================

import axios from 'axios';
import * as THREE from 'three';
import { SuperViCharacter, SuperViAchievement, SuperViLeaderboardRecord, SuperViDailyChallenge } from '../types/supervi';

const API_BASE = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

// Fallback seed for The Six SuperVi Heroes
const SEED_CHARACTERS: SuperViCharacter[] = [
  {
    id: 'zara_zephyr',
    name: 'Zara the Zephyr',
    identity_label: 'Black Hausa Female Superhero',
    description: 'Protective, brave guardian spirit who levitates above flames and descends in a fiery streak.',
    character_class: 'Guardian of Heritage',
    origin_city: 'Abuja, Lagos, Kano (Nigeria)',
    suit_style: 'Skin-tight red spandex with gold light trimmings, opals, knee-length flowing hijab',
    orb_color: '#EF4444',
    orb_symbols: 'Fiery glowing red Orb with Egyptian hieroglyphs floating around it',
    avatar_url: '/images/characters/zara.png',
    abilities: {
      passive: ['Levitates above flames', 'Fiery streak'],
      active: ['Fire-based attack'],
      orb_ability: {
        name: 'Fire Dash',
        description: 'Creates a fiery path burning obstacles'
      }
    },
    unlock_method: 'Starting Character',
    is_unlocked: true
  },
  {
    id: 'tenko_gen',
    name: 'Tenko-Gen',
    identity_label: 'Brown-skinned Fulani Female Superhero',
    description: 'Strategic, observant scout and messenger who sees dangers from afar.',
    character_class: 'Wisdom Keeper',
    origin_city: 'Abuja, Lagos, Kano (Nigeria)',
    suit_style: 'Blue urban African spandex with gold trimmings, long braided hair with hijab',
    orb_color: '#3B82F6',
    orb_symbols: 'Blue glowing Orb with ancient Egyptian protective glyphs',
    avatar_url: '/images/characters/tenko.png',
    abilities: {
      passive: ['Enhanced vision for pathfinding', 'Navigates high hurdles'],
      active: ['Foresight trajectory'],
      orb_ability: {
        name: 'Neck Extension',
        description: 'Reaches high platforms and airborne bonus fruits'
      }
    },
    unlock_method: 'Complete story missions',
    is_unlocked: false
  },
  {
    id: 'king_guardian',
    name: 'King the Guardian',
    identity_label: 'Black Yoruba Male Superhero',
    description: 'Protector of the innocent. Smashes through obstacles with unmatched physical force.',
    character_class: 'Unity Champion',
    origin_city: 'Abuja, Lagos, Kano (Nigeria)',
    suit_style: 'Green urban African spandex with gold trimmings, long dreadlocks, green beads',
    orb_color: '#10B981',
    orb_symbols: 'Green glowing Orb with Egyptian warrior glyphs',
    avatar_url: '/images/characters/king.png',
    abilities: {
      passive: ['Smashes through walls and barriers', 'Extra durability'],
      active: ['Rescue trapped civilians'],
      orb_ability: {
        name: 'Wall Break',
        description: 'Destroys barriers and trains to create clear paths'
      }
    },
    unlock_method: 'Starting Character',
    is_unlocked: true
  },
  {
    id: 'phantom_shadow',
    name: 'Phantom Shadow',
    identity_label: 'Ibo Female Superhero',
    description: 'Mysterious spirit guide who moves between dimensions to protect the realm.',
    character_class: 'Future Visionary',
    origin_city: 'Abuja, Lagos, Kano (Nigeria)',
    suit_style: 'Orange urban African spandex, orange and green beads on waist and arms',
    orb_color: '#F97316',
    orb_symbols: 'Orange glowing Orb with spinning Egyptian phase glyphs',
    avatar_url: '/images/characters/phantom.png',
    abilities: {
      passive: ['Phases through solid obstacles', 'Invisibility burst'],
      active: ['Clears smoke and fog'],
      orb_ability: {
        name: 'Phase Shift',
        description: 'Passes harmlessly through oncoming trains and falling trees'
      }
    },
    unlock_method: 'Achieve 10,000+ score',
    is_unlocked: false
  },
  {
    id: 'bola_brave',
    name: 'Bola the Brave',
    identity_label: 'Ibo Female Superhero',
    description: 'Fearless, caring protector who carries the vulnerable with lightning speed.',
    character_class: 'Bridge Builder',
    origin_city: 'Abuja, Lagos, Kano (Nigeria)',
    suit_style: 'White urban African spandex with gold trimmings, white and red beads',
    orb_color: '#F8FAFC',
    orb_symbols: 'White glowing Orb with Egyptian symbols spinning violently',
    avatar_url: '/images/characters/bola.png',
    abilities: {
      passive: ['Lightning speed movement', 'Protective aura'],
      active: ['High-speed dash'],
      orb_ability: {
        name: 'Lightning Dash',
        description: 'Ultra-fast dash that auto-vacuums nearby fruits'
      }
    },
    unlock_method: 'Collect 5,000 FIC tokens',
    is_unlocked: false
  },
  {
    id: 'neoma_healer',
    name: 'Neoma the Healer',
    identity_label: 'Light-skin Ibo Female Superhero',
    description: 'Nurturing, wise healer with ancient herbal lore and protective barrier mastery.',
    character_class: 'Innovation Pioneer',
    origin_city: 'Abuja, Lagos, Kano (Nigeria)',
    suit_style: 'Leafy green fruity colored spandex, long braids, rotating leafy beads',
    orb_color: '#84CC16',
    orb_symbols: 'Multi-color glowing Orb with Egyptian symbols gently pulsing',
    avatar_url: '/images/characters/neoma.png',
    abilities: {
      passive: ['Regenerates extra lives', 'Absorbs stun effects'],
      active: ['Barrier creation'],
      orb_ability: {
        name: 'Protective Bubbles',
        description: 'Creates fruity shields absorbing fatal impacts'
      }
    },
    unlock_method: 'Complete 7 Daily Challenges',
    is_unlocked: false
  }
];

class SuperViApiService {
  private static instance: SuperViApiService;

  public static getInstance(): SuperViApiService {
    if (!SuperViApiService.instance) {
      SuperViApiService.instance = new SuperViApiService();
    }
    return SuperViApiService.instance;
  }

  /**
   * Fetch all 6 characters from backend or fallback to seeded data
   */
  async getCharacters(): Promise<SuperViCharacter[]> {
    try {
      const res = await axios.get(`${API_BASE}/supervi/characters`, { timeout: 3000 });
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (_) {
      // Graceful fallback to seeded characters
    }
    return SEED_CHARACTERS;
  }

  /**
   * Start a new game session on backend
   */
  async startSession(userId: string, gameMode = 'classic', characterId = 'zara_zephyr'): Promise<{ id: string }> {
    try {
      const res = await axios.post(`${API_BASE}/supervi/sessions/start`, {
        userId,
        gameMode,
        characterId
      }, { timeout: 3000 });
      if (res.data?.success && res.data.data?.id) {
        return { id: res.data.data.id };
      }
    } catch (_) {
      // Offline fallback session id
    }
    return { id: `local_session_${Date.now()}` };
  }

  /**
   * End session and get FIC tokens & stats
   */
  async endSession(
    sessionId: string,
    stats: {
      finalScore: number;
      levelReached: number;
      durationSeconds: number;
      comboCount: number;
      achievementsUnlocked?: string[];
      powerupsUsed?: string[];
    }
  ): Promise<{ ficTokensEarned: number }> {
    try {
      const res = await axios.post(`${API_BASE}/supervi/sessions/${sessionId}/end`, stats, { timeout: 3000 });
      if (res.data?.success && res.data.data?.rewards) {
        return { ficTokensEarned: res.data.data.rewards.ficTokensEarned };
      }
    } catch (_) {
      // Local fallback calculation
    }
    const earnedFic = Math.floor(stats.finalScore / 500) + (stats.comboCount * 2);
    return { ficTokensEarned: earnedFic };
  }

  /**
   * Submit high score to global leaderboard (supports object or positional arguments)
   */
  async submitScore(
    scoreOrData:
      | string
      | {
          score: number;
          distance?: number;
          coins_collected?: number;
          character_id?: string;
          highest_combo?: number;
          leaderboard_id?: string;
          username?: string;
          level?: number;
        },
    score?: number,
    level?: number,
    characterId?: string,
    username = 'Runner'
  ): Promise<boolean> {
    try {
      if (typeof scoreOrData === 'object' && scoreOrData !== null) {
        const payload = scoreOrData;
        const targetLeaderboard = payload.leaderboard_id || 'global_classic';
        const res = await axios.post(`${API_BASE}/supervi-leaderboards/${targetLeaderboard}/submit-score`, {
          score: payload.score,
          level: payload.level || 1,
          characterId: payload.character_id || 'zara_zephyr',
          username: payload.username || 'Runner',
          distance: payload.distance,
          coins_collected: payload.coins_collected,
          highest_combo: payload.highest_combo
        }, { timeout: 3000 });
        return !!res.data?.success;
      } else {
        const leaderboardId = scoreOrData;
        const res = await axios.post(`${API_BASE}/supervi-leaderboards/${leaderboardId}/submit-score`, {
          score,
          level,
          characterId,
          username
        }, { timeout: 3000 });
        return !!res.data?.success;
      }
    } catch (_) {
      return false;
    }
  }

  /**
   * Fetch leaderboard rankings with normalized SuperViLeaderboardEntry
   */
  async getLeaderboard(leaderboardId = 'global_classic', limit = 20): Promise<import('../types/supervi').SuperViLeaderboardEntry[]> {
    const records = await this.getRankings(leaderboardId, limit);
    return records.map((r) => ({
      rank: r.rank,
      player_name: r.username,
      avatar_url: r.avatar_url,
      score: r.score,
      level: r.level,
      distance: (r as any).distance || Math.floor(r.score * 0.8),
      highest_combo: (r as any).highest_combo || 14,
      character_name: r.character_id,
      character_id: r.character_id
    }));
  }

  /**
   * Synthesize Speech for voice lines with Web Speech API
   */
  async synthesizeSpeech(text: string, settings?: any): Promise<string> {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        if (settings?.pitch) utterance.pitch = settings.pitch;
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      } catch (_) {
        // Fallback
      }
    }
    return '';
  }

  /**
   * Fetch leaderboard rankings
   */
  async getRankings(leaderboardId = 'global_classic', limit = 20): Promise<SuperViLeaderboardRecord[]> {
    try {
      const res = await axios.get(`${API_BASE}/supervi-leaderboards/${leaderboardId}/rankings?limit=${limit}`, { timeout: 3000 });
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (_) {
      // Fallback sample rankings
    }
    return [
      { id: '1', leaderboard_id: leaderboardId, user_id: 'u1', username: 'KanoSpeedster', score: 28450, level: 8, rank: 1, character_id: 'zara_zephyr', created_at: new Date().toISOString() },
      { id: '2', leaderboard_id: leaderboardId, user_id: 'u2', username: 'LagosThunder', score: 21300, level: 6, rank: 2, character_id: 'king_guardian', created_at: new Date().toISOString() },
      { id: '3', leaderboard_id: leaderboardId, user_id: 'u3', username: 'AbujaGlider', score: 17820, level: 5, rank: 3, character_id: 'bola_brave', created_at: new Date().toISOString() },
      { id: '4', leaderboard_id: leaderboardId, user_id: 'u4', username: 'NileRunner', score: 14600, level: 4, rank: 4, character_id: 'tenko_gen', created_at: new Date().toISOString() },
      { id: '5', leaderboard_id: leaderboardId, user_id: 'u5', username: 'SavannahHero', score: 11950, level: 3, rank: 5, character_id: 'neoma_healer', created_at: new Date().toISOString() }
    ];
  }

  /**
   * Fetch achievements
   */
  async getAchievements(): Promise<SuperViAchievement[]> {
    try {
      const res = await axios.get(`${API_BASE}/supervi-achievements`, { timeout: 3000 });
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          icon: item.icon || '🏆',
          category: item.category || 'general',
          points: item.points || 10,
          unlocked: !!item.is_unlocked
        }));
      }
    } catch (_) {
      // Fallback
    }
    return [
      { id: 'ach_combo_small', name: 'Small Combo', description: 'Trigger your first 3x move chain combo', icon: '⚡', category: 'combo_small', points: 15, unlocked: true },
      { id: 'ach_combo_great', name: 'Great Combo Master', description: 'Achieve a 7x move chain without damage', icon: '🔥', category: 'combo_large', points: 50, unlocked: false },
      { id: 'ach_combo_colossal', name: 'Colossal Strike', description: 'Perform a legendary 15x colossal combo', icon: '💥', category: 'combo_colossal', points: 100, unlocked: false },
      { id: 'ach_stun_master', name: 'Stun Recovery', description: 'Successfully break free from 5 obstacle stuns', icon: '🛡️', category: 'stun', points: 40, unlocked: false }
    ];
  }

  /**
   * Fetch daily challenges
   */
  async getDailyChallenges(): Promise<SuperViDailyChallenge[]> {
    try {
      const res = await axios.get(`${API_BASE}/supervi/challenges/daily`, { timeout: 3000 });
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (_) {
      // Fallback
    }
    return [
      { id: 'daily_lion_spell', title: 'Spell the Beast: L-I-O-N', description: 'Collect pulsating letters L, I, O, N during runs', animal_target: 'LION', challenge_type: 'collect_letters', target_value: 4, reward_currency: 300, reward_xp: 500 },
      { id: 'daily_distance', title: 'Daily 3,000m Sprint', description: 'Accumulate 3,000 meters in any single day', animal_target: 'NONE', challenge_type: 'distance', target_value: 3000, reward_currency: 200, reward_xp: 400 }
    ];
  }
}

export default SuperViApiService.getInstance();
