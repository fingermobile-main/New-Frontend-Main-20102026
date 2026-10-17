// Type definitions for SuperVi game entities

import { UUID } from "crypto";

// Basic Member interface (referenced by SuperVi tables)
export interface Member {
  id: UUID;
  membername: string;
  email: string;
  // Add other relevant member fields as needed
}

export interface SuperViGameSession {
  id: UUID;
  member_id: UUID;
  session_start: Date;
  session_end?: Date;
  duration?: number; // in seconds
  final_score: number;
  level_reached: number;
  lives_remaining: number;
  multiplier: number;
  combo_count: number;
  achievements_unlocked?: string[]; // array of achievement IDs unlocked in this session
  powerups_used?: string[]; // array of power-up types used
  game_mode: "classic" | "time_attack" | "survival" | "multiplayer";
  game_state?: object; // JSONB type
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SuperViCharacter {
  id: UUID;
  name: string;
  description?: string;
  character_class?:
    | "Guardian of Heritage"
    | "Bridge Builder"
    | "Wisdom Keeper"
    | "Innovation Pioneer"
    | "Unity Champion"
    | "Future Visionary";
  origin_city?: string;
  abilities?: object; // JSONB type
  avatar_url?: string;
  unlock_level: number;
  is_unlocked: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SuperViMemberCharacter {
  id: UUID;
  member_id: UUID;
  character_id: UUID;
  level: number;
  experience_points: number;
  equipped: boolean;
  acquired_at: Date;
  updated_at: Date;
}

export interface SuperViAchievement {
  id: UUID;
  name: string;
  description?: string;
  icon_url?: string;
  category?: string; // combo_small, combo_large, combo_colossal, stun, general, etc.
  points: number;
  threshold?: number; // score, level, or other requirement to unlock
  requirement_type?: string; // score_threshold, level_reached, combo_achieved, etc.
  is_hidden: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SuperViMemberAchievement {
  id: UUID;
  member_id: UUID;
  achievement_id: UUID;
  unlocked_at?: Date;
  progress: number; // for achievements that have progress
  is_unlocked: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SuperViLeaderboard {
  id: UUID;
  game_mode: "classic" | "time_attack" | "survival" | "multiplayer";
  season_id?: string;
  region?: string; // global, regional leaderboards
  created_at: Date;
  updated_at: Date;
}

export interface SuperViLeaderboardEntry {
  id: UUID;
  leaderboard_id: UUID;
  member_id: UUID;
  score: number;
  level_reached: number;
  duration?: number; // time taken to achieve the score
  character_used?: UUID;
  date_achieved: Date;
  rank?: number; // computed rank in the leaderboard
}

export interface SuperViPowerup {
  id: UUID;
  name: string;
  description?: string;
  type:
    | "speed"
    | "strength"
    | "water"
    | "food"
    | "elixir"
    | "timeFreeze"
    | "doublePoints"
    | "extraLife"
    | "shield";
  effect_duration?: number; // in seconds, NULL for instant effects
  cooldown_period: number; // in seconds
  cost: number; // in-game currency cost
  icon_url?: string;
  is_consumable: boolean;
  available_from_level: number;
  created_at: Date;
  updated_at: Date;
}

export interface SuperViMemberInventory {
  id: UUID;
  member_id: UUID;
  item_id: UUID;
  item_type: string; // powerup, currency, cosmetic, etc.
  quantity: number;
  acquired_at: Date;
  expires_at?: Date; // for time-limited items
}

export interface SuperViDailyChallenge {
  id: UUID;
  title: string;
  description?: string;
  challenge_type?: string; // complete_n_combos, reach_x_score, play_y_minutes, etc.
  target_value: number;
  reward_currency: number;
  reward_xp: number;
  reward_powerups?: object; // JSONB type {powerup_id: quantity}
  start_date: Date;
  end_date: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SuperViMemberChallengeProgress {
  id: UUID;
  member_id: UUID;
  challenge_id: UUID;
  current_progress: number;
  is_completed: boolean;
  completed_at?: Date;
  claimed_reward: boolean;
  updated_at: Date;
}

export interface SuperViMultiplayerRoom {
  id: UUID;
  room_code: string;
  host_member_id: UUID;
  game_mode: "classic" | "time_attack" | "survival" | "multiplayer";
  max_players: number;
  current_players: number;
  status: "waiting" | "starting" | "in_progress" | "finished";
  created_at: Date;
  started_at?: Date;
  finished_at?: Date;
  updated_at: Date;
}

export interface SuperViMultiplayerParticipant {
  id: UUID;
  room_id: UUID;
  member_id: UUID;
  character_id?: UUID;
  score: number;
  level: number;
  final_position?: number; // final ranking in the game
  joined_at: Date;
  disconnected_at?: Date; // if player left early
  is_ready: boolean;
}

export interface SuperViVoiceLine {
  id: UUID;
  text_content: string;
  category: string; // supervi, combo_small, combo_large, combo_colossal, stun, general, etc.
  audio_url?: string;
  language: string; // language code
  accent: string; // african_igbo, african_yoruba, etc.
  keywords?: string[]; // searchable keywords
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SuperViGameAnalytic {
  id: UUID;
  member_id: UUID;
  session_id: UUID;
  game_mode?: string;
  score?: number;
  level_reached?: number;
  time_played?: number; // in seconds
  moves_made: number;
  combos_achieved?: object; // JSONB type {small: count, large: count, colossal: count}
  powerups_used?: object; // JSONB type {powerup_type: count}
  achievements_unlocked: number;
  avg_reaction_time?: number; // in milliseconds
  date_recorded: Date;
  updated_at: Date;
}
