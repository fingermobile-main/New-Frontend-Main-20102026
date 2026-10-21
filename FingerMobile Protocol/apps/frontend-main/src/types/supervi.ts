// ============================================================================
// SuperVi Type Definitions: Orbs of Glory - Rise of the Six
// ============================================================================

export type CharacterId =
  | 'zara_zephyr'
  | 'tenko_gen'
  | 'king_guardian'
  | 'phantom_shadow'
  | 'bola_brave'
  | 'neoma_healer';

export type CharacterClass =
  | 'Guardian of Heritage'
  | 'Bridge Builder'
  | 'Wisdom Keeper'
  | 'Innovation Pioneer'
  | 'Unity Champion'
  | 'Future Visionary';

export interface SuperViCharacter {
  id: CharacterId | string;
  name: string;
  identity_label?: string;
  description: string;
  character_class: CharacterClass;
  origin_city: string;
  suit_style?: string;
  orb_color: string;
  orb_symbols?: string;
  avatar_url?: string;
  abilities: {
    passive: string[];
    active: string[];
    orb_ability: {
      name: string;
      description: string;
    };
  };
  unlock_method?: string;
  is_unlocked: boolean;
}

export type LaneIndex = 0 | 1 | 2; // 0: Left (-3), 1: Middle (0), 2: Right (+3)

export type ControlAction =
  | 'SWIPE_LEFT'
  | 'SWIPE_RIGHT'
  | 'SWIPE_UP'
  | 'SWIPE_DOWN'
  | 'DOUBLE_SWIPE_UP'
  | 'DOUBLE_SWIPE_DOWN'
  | 'SINGLE_TAP_DOWN'
  | 'DOUBLE_TAP_DOWN'
  | 'DOUBLE_TAP_UP';

export type ObstacleType =
  | 'WILD_ANIMAL'
  | 'FALLING_TREE'
  | 'TREE_STUMP'
  | 'QUICKSAND'
  | 'TRAIN'
  | 'URBAN_BARRIER'
  | 'TUNNEL';

export interface GameObstacle {
  id: string;
  lane: LaneIndex;
  type: ObstacleType;
  name: string;
  z: number;
  width: number;
  height: number;
  isPassed: boolean;
  cleared: boolean;
}

export interface CollectibleItem {
  id: string;
  lane: LaneIndex;
  type: 'FRUIT' | 'COIN' | 'POWERUP' | 'LETTER';
  letter?: string;
  powerupType?: 'jetpack' | 'magnet' | 'multiplier' | 'shield' | 'freeze';
  z: number;
  collected: boolean;
}

export type ComboTier = 'NONE' | 'SMALL' | 'GREAT' | 'COLOSSAL';

export interface SuperViGameState {
  score: number;
  distanceMeters: number;
  level: number;
  lives: number;
  maxLives: number;
  currentLane: LaneIndex;
  speed: number;
  baseSpeed: number;
  multiplier: number;
  comboCount: number;
  comboTier: ComboTier;
  isJumping: boolean;
  isHighJumping: boolean;
  isSliding: boolean;
  isExtendedSliding: boolean;
  isStunned: boolean;
  isInvulnerable: boolean;
  activePowerup: string | null;
  powerupTimeRemaining: number;
  gameOver: boolean;
  spelledWord: string;
  targetWord: string;
}

export interface SuperViPlayer {
  id: string;
  username: string;
  avatarUrl?: string;
  characterId: string;
  score: number;
  level: number;
  lane: LaneIndex;
  distanceMeters: number;
  isCurrentPlayer: boolean;
  isConnected: boolean;
}

export interface SuperViAchievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  badge_icon?: string;
  category?: 'combo_small' | 'combo_large' | 'combo_colossal' | 'stun' | 'distance' | 'general' | string;
  points?: number;
  reward_coins?: number;
  unlocked?: boolean;
  unlockDate?: Date;
}

export interface SuperViLeaderboardRecord {
  id: string;
  leaderboard_id: string;
  user_id: string;
  username: string;
  avatar_url?: string;
  score: number;
  level: number;
  rank: number;
  character_id?: string;
  created_at: string;
}

export interface SuperViLeaderboardEntry {
  rank: number;
  player_name: string;
  avatar_url?: string;
  score: number;
  level?: number;
  distance?: number;
  highest_combo?: number;
  character_name?: string;
  character_id?: string;
}

export interface SuperViPowerup {
  id: string;
  name: string;
  description: string;
  type: 'jetpack' | 'magnet' | 'multiplier' | 'shield' | 'time_freeze';
  effect_duration: number;
  cost: number;
}

export interface SuperViDailyChallenge {
  id: string;
  title: string;
  description: string;
  animal_target?: string;
  challenge_type?: string;
  target_value: number;
  current_progress?: number;
  reward_fic?: number;
  reward_currency?: number;
  reward_xp?: number;
  is_completed?: boolean;
}

