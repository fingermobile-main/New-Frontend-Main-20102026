/**
 * Sovereign Shared Interest Discovery & Lapidaire Engine Types
 * Powering P2P member matching across BeatwaveNG and Dancia-4Tv
 */

export type DiscoveryDomain = 'beatwaveng' | 'dancia4tv';

export type SwipeDirection = 'like' | 'pass' | 'super_like';

export type SharedInterestCategory =
  // BeatwaveNG audio categories
  | 'same_album'
  | 'same_ai_playlist'
  | 'same_song'
  | 'same_artist'
  | 'same_album_cover'
  | 'same_ai_music'
  | 'same_event'
  | 'same_concert'
  | 'same_recommendation'
  | 'same_playlist'
  // Dancia-4Tv video categories
  | 'same_movie'
  | 'same_director'
  | 'same_genre'
  | 'same_live_stream'
  | 'same_premiere'
  | 'same_watchlist'
  | 'same_video_stem';

export interface SharedInterestTag {
  id: string;
  category: SharedInterestCategory;
  label: string; // e.g. "Same Album", "Same Artist", "Same Concert", "Same Movie"
  value: string; // e.g. "Timeless", "Asake", "Felabration 2026", "Kunle Afolayan"
  icon?: string;
  relevanceScore?: number; // 0 - 100
}

export interface LapidaireQA {
  questionId: number;
  category: string;
  question: string;
  answer: string;
  answeredAt?: string;
}

export interface SharedInterestMember {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  ninVerified: boolean;
  location: string;
  bio: string;
  compatibilityScore: number; // e.g. 98%
  sharedInterests: SharedInterestTag[];
  lapidaireAnswers: LapidaireQA[];
  favoriteMedia?: {
    title: string;
    subtitle: string;
    type: 'audio' | 'video' | 'playlist' | 'event';
    imageUrl: string;
    extraBadge?: string;
  };
  colaboPinExchanged?: boolean;
  isOnline?: boolean;
  memberTier?: 'Sovereign' | 'Pro Creator' | 'Founding Pioneer';
}

export interface LapidaireQuestionItem {
  id: number;
  domain: DiscoveryDomain;
  category: string;
  question: string;
  options: string[];
  resonanceImpact: string;
}

export interface MatchCelebrationData {
  member: SharedInterestMember;
  matchType: 'mutual_like' | 'super_like_colabo';
  matchedAt: string;
  sharedHighlights: string[];
}
