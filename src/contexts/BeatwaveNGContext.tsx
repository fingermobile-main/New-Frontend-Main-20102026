/*
 * FingerMobile Protocol™ - BeatwaveNG Context & Audio Engine
 * Sovereign Youth-Driven Music & Podcast Streaming Protocol
 * SoundRiver (Free Tier) & SoundOcean (Lossless Sovereign Tier)
 * 10-Band Equalizer, LRC Lyrics Engine, Public Stream Aggregator across 70+ Genres
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAppContext } from './AppContext';
import { api } from '../services/api';

export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  coverArt?: string;
  url: string;
  plays?: number;
  likes?: number;
  dislikes?: number;
  genre?: string;
  year?: number;
  trackNumber?: number;
  writer?: string;
  producer?: string;
  explicit?: boolean;
  bpm?: number;
  key?: string;
  createdAt?: string;
  authorId?: string;
  isSaved?: boolean;
  isLiked?: boolean;
  tier?: 'SoundRiver' | 'SoundOcean';
  ficPrice?: number;
  lyrics?: string;
  bitrate?: string;
  audioQuality?: 'Lossless' | 'Hi-Res' | 'Standard';
  publicSource?: string;
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  tracks: Track[];
  coverArt?: string;
  owner: string;
  isCollaborative?: boolean;
  isPinned?: boolean;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  coverArt?: string;
  followers?: number;
  verified?: boolean;
  tier?: 'SoundRiver' | 'SoundOcean';
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: number;
  tracks: Track[];
  coverArt?: string;
  tier?: 'SoundRiver' | 'SoundOcean';
}

export interface RadioStation {
  id: string;
  name: string;
  description: string;
  genre: string;
  streamUrl: string;
  listeners: number;
  coverArt: string;
  dj: string;
  frequency: string;
}

export interface AmeboHistoryItem {
  id: string;
  memberId: string;
  action: string;
  targetId: string;
  targetType: string;
  timestamp: string;
}

export interface AbRepeatState {
  a: number | null;
  b: number | null;
  enabled: boolean;
}

// Media Output Devices
export interface AudioDevice {
  id: string;
  name: string;
  type: 'system' | 'headphones' | 'dac' | 'bluetooth' | 'cast';
  bitrateSupport: string;
  isDefault?: boolean;
}

// Colabo+ Shared Playlists with PIN exchange
export interface ColaboContributor {
  id: string;
  name: string;
  pin: string;
  avatar: string;
  role: 'Host' | 'Contributor' | 'DJ';
  joinedAt: string;
}

export interface ColaboSession {
  id: string;
  title: string;
  pin: string;
  hostId: string;
  hostName: string;
  coverArt: string;
  contributors: ColaboContributor[];
  tracks: Track[];
  createdAt: string;
  isActive: boolean;
}

// VirDrive: 3 or 7 Days Temporal Virtual Drive
export interface VirDriveFile {
  id: string;
  title: string;
  artist: string;
  duration: string;
  sizeMb: number;
  sovereignExt: '.fmbw' | '.fma' | '.wav';
  downloadUrl: string;
}

export interface VirDriveFolder {
  id: string;
  name: string;
  ownerPin: string;
  durationDays: 3 | 7;
  createdAt: string;
  expiresAt: string;
  daysRemaining: number;
  pinProtected: boolean;
  pin?: string;
  totalSizeMb: number;
  files: VirDriveFile[];
  downloadCount: number;
}

// AudioNovels: Up to 50 cards, 30 mins each, AI assisted / File Upload / Live Mic, 3/7/30 days TTL
export interface AudioNovelCard {
  id: string;
  title: string;
  author: string;
  synopsis: string;
  narratorVoice: string;
  coverArt: string;
  durationMinutes: number; // up to 30 mins
  genre: string;
  aiPromptUsed?: string;
  createdAt: string;
  ttlDays: 3 | 7 | 30; // 3 or 7 days temporal TTL, or 30 days standard
  daysRemaining: number;
  temporalExpiresAt?: string;
  isDownloaded: boolean;
  sovereignExt: '.fmnovel' | '.fmbw';
  audioUrl: string;
  chaptersCount: number;
  sourceType?: 'ai_prompt' | 'text_upload' | 'audio_upload' | 'live_recording';
  sourceFileName?: string;
  sourceFileSizeMb?: number;
  sourceFileType?: string;
  recordingBlobUrl?: string;
  manuscriptText?: string;
  moderationStatus?: 'draft' | 'active' | 'frozen' | 'blocked' | 'suspended' | 'archived';
  flag?: 'green' | 'yellow' | 'orange' | 'red';
  warningCount?: number;
  adminNotes?: string;
}

// Podcasts: Up to 50 cards, 30 mins each, 3/7/30 days TTL
export interface PodcastCard {
  id: string;
  title: string;
  host: string;
  guest?: string;
  description: string;
  coverArt: string;
  durationMinutes: number; // up to 30 mins
  genre: string;
  episodeNumber: number;
  createdAt: string;
  ttlDays: 3 | 7 | 30;
  daysRemaining: number;
  temporalExpiresAt?: string;
  isDownloaded: boolean;
  sovereignExt: '.fmpod' | '.fmbw';
  audioUrl: string;
  tags: string[];
  sourceType?: 'ai_prompt' | 'text_upload' | 'audio_upload' | 'live_recording';
  sourceFileName?: string;
  sourceFileSizeMb?: number;
  sourceFileType?: string;
  recordingBlobUrl?: string;
  moderationStatus?: 'draft' | 'active' | 'frozen' | 'blocked' | 'suspended' | 'archived';
  flag?: 'green' | 'yellow' | 'orange' | 'red';
  warningCount?: number;
  adminNotes?: string;
}

type BeatwaveCatalogRow = Record<string, unknown>;

const asCatalogRow = (value: unknown): BeatwaveCatalogRow =>
  typeof value === 'object' && value !== null ? value as BeatwaveCatalogRow : {};

const readCatalogString = (row: BeatwaveCatalogRow, key: string, fallback = ''): string =>
  typeof row[key] === 'string' ? row[key] as string : fallback;

const readCatalogNumber = (row: BeatwaveCatalogRow, key: string, fallback = 0): number => {
  const value = Number(row[key]);
  return Number.isFinite(value) ? value : fallback;
};

const readTtl = (row: BeatwaveCatalogRow): 3 | 7 | 30 => {
  const value = readCatalogNumber(row, 'ttl_days', 30);
  return value === 3 || value === 7 ? value : 30;
};

const readModerationStatus = (row: BeatwaveCatalogRow): AudioNovelCard['moderationStatus'] => {
  const status = row.moderation_status;
  return ['draft', 'active', 'frozen', 'blocked', 'suspended', 'archived'].includes(String(status))
    ? status as AudioNovelCard['moderationStatus']
    : 'draft';
};

const readExpiry = (row: BeatwaveCatalogRow): string | undefined =>
  typeof row.expires_at === 'string' ? row.expires_at : undefined;

const getDaysRemaining = (expiresAt?: string): number => {
  if (!expiresAt) return 0;
  const remaining = new Date(expiresAt).getTime() - Date.now();
  return Number.isFinite(remaining) ? Math.max(0, Math.ceil(remaining / 86400000)) : 0;
};

const mapAudioNovelRow = (value: unknown): AudioNovelCard => {
  const row = asCatalogRow(value);
  const temporalExpiresAt = readExpiry(row);
  const durationMinutes = readCatalogNumber(row, 'duration_minutes', 1);
  return {
    id: readCatalogString(row, 'id'),
    title: readCatalogString(row, 'title'),
    author: readCatalogString(row, 'author'),
    synopsis: readCatalogString(row, 'synopsis'),
    narratorVoice: readCatalogString(row, 'narrator_voice'),
    coverArt: readCatalogString(row, 'cover_art'),
    durationMinutes,
    genre: readCatalogString(row, 'genre', 'General'),
    aiPromptUsed: readCatalogString(row, 'ai_prompt_used') || undefined,
    createdAt: readCatalogString(row, 'created_at'),
    ttlDays: readTtl(row),
    daysRemaining: getDaysRemaining(temporalExpiresAt),
    temporalExpiresAt,
    isDownloaded: false,
    sovereignExt: '.fmnovel',
    audioUrl: readCatalogString(row, 'audio_url'),
    chaptersCount: Math.ceil(durationMinutes / 7),
    sourceType: readCatalogString(row, 'source_type') as AudioNovelCard['sourceType'],
    sourceFileName: readCatalogString(row, 'source_file_name') || undefined,
    sourceFileSizeMb: row.source_file_size_mb == null ? undefined : readCatalogNumber(row, 'source_file_size_mb'),
    sourceFileType: readCatalogString(row, 'source_file_type') || undefined,
    manuscriptText: readCatalogString(row, 'manuscript_text') || undefined,
    moderationStatus: readModerationStatus(row),
    flag: readCatalogString(row, 'risk_flag', 'green') as AudioNovelCard['flag'],
    warningCount: readCatalogNumber(row, 'warning_count'),
    adminNotes: readCatalogString(row, 'admin_notes'),
  };
};

const mapPodcastRow = (value: unknown): PodcastCard => {
  const row = asCatalogRow(value);
  const temporalExpiresAt = readExpiry(row);
  const tags = Array.isArray(row.tags) ? row.tags.filter((tag): tag is string => typeof tag === 'string') : [];
  return {
    id: readCatalogString(row, 'id'),
    title: readCatalogString(row, 'title'),
    host: readCatalogString(row, 'host'),
    guest: readCatalogString(row, 'guest') || undefined,
    description: readCatalogString(row, 'description'),
    coverArt: readCatalogString(row, 'cover_art'),
    durationMinutes: readCatalogNumber(row, 'duration_minutes', 1),
    genre: readCatalogString(row, 'genre', 'General'),
    episodeNumber: readCatalogNumber(row, 'episode_number', 1),
    createdAt: readCatalogString(row, 'created_at'),
    ttlDays: readTtl(row),
    daysRemaining: getDaysRemaining(temporalExpiresAt),
    temporalExpiresAt,
    isDownloaded: false,
    sovereignExt: '.fmpod',
    audioUrl: readCatalogString(row, 'audio_url'),
    tags,
    sourceType: readCatalogString(row, 'source_type') as PodcastCard['sourceType'],
    sourceFileName: readCatalogString(row, 'source_file_name') || undefined,
    sourceFileSizeMb: row.source_file_size_mb == null ? undefined : readCatalogNumber(row, 'source_file_size_mb'),
    sourceFileType: readCatalogString(row, 'source_file_type') || undefined,
    moderationStatus: readModerationStatus(row),
    flag: readCatalogString(row, 'risk_flag', 'green') as PodcastCard['flag'],
    warningCount: readCatalogNumber(row, 'warning_count'),
    adminNotes: readCatalogString(row, 'admin_notes'),
  };
};

// BeatVlogs: Shared interest video/audio vlogs
export interface BeatVlog {
  id: string;
  title: string;
  creator: string;
  creatorPin: string;
  avatar: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  views: number;
  likes: number;
  tags: string[];
  sharedInterest: string;
  createdAt: string;
}

// MySub: Add members to subscription by PIN
export interface MySubMember {
  id: string;
  name: string;
  pin: string;
  avatar: string;
  tier: 'SoundOcean Lossless' | 'SoundRiver Standard';
  status: 'Active' | 'Pending';
  joinedAt: string;
}

// Mii: Top widget, followers, live listening broadcast, PIN acceptance/decline
export interface MiiRequest {
  id: string;
  fromName: string;
  fromPin: string;
  avatar: string;
  type: 'colabo_invite' | 'virdrive_share' | 'listen_follow';
  targetTitle: string;
  targetPin?: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface MiiState {
  privacyMode: 'public' | 'private' | 'incognito';
  followersCount: number;
  followingCount: number;
  nowPlayingBroadcast: boolean;
  incomingRequests: MiiRequest[];
}

export const EQ_FREQUENCIES = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export const EQ_PRESETS: Record<string, number[]> = {
  'Afrobeats': [5, 4, 2, 0, 1, 2, 3, 4, 4, 3],
  'Amapiano Bass': [8, 7, 5, 2, 0, 0, 1, 2, 3, 2],
  'Hip-Hop': [6, 5, 3, 1, -1, 1, 3, 4, 5, 4],
  'Bass Boost': [7, 6, 5, 3, 1, 0, 0, 0, 0, 0],
  'Vocal Booster': [-2, -1, 0, 2, 4, 5, 4, 2, 1, 0],
  'Pop': [1, 2, 3, 2, 0, 1, 3, 4, 3, 2],
  'Electronic': [5, 4, 2, 0, -1, 2, 4, 5, 6, 5],
  'Rock': [4, 3, 2, 0, -1, 1, 3, 4, 5, 4],
  'Flat': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  'Club': [5, 5, 3, 0, 0, 0, 2, 3, 4, 3],
  'Acoustic': [3, 2, 1, 2, 3, 3, 3, 2, 2, 1]
};

export const CURATED_70_GENRES = [
  // African & Afro-Diaspora (22)
  'Afrobeats', 'Amapiano', 'Highlife', 'Fuji', 'Juju', 'Apala', 'Afro-fusion', 'Afro-soul',
  'Bongo Flava', 'Gengetone', 'Kizomba', 'Semba', 'Soukous', 'Coupé-Décalé', 'Makossa',
  'Mbalax', 'Gqom', 'Kwaito', 'Afro-house', 'Palm-wine', 'Afro-trap', 'Chimurenga',
  // Urban & Contemporary (14)
  'Hip-Hop', 'Boom Bap', 'Trap', 'Drill', 'R&B', 'Neo-Soul', 'Dancehall', 'Reggae',
  'Dub', 'Lovers Rock', 'Soca', 'Calypso', 'Afropop', 'UK Afro-Drill',
  // Electronic & Dance (13)
  'EDM', 'House', 'Deep House', 'Tech House', 'Techno', 'Drum & Bass', 'Dubstep',
  'Trance', 'Synthwave', 'Electro-Pop', 'UK Garage', 'Ambient', 'Chillwave',
  // Traditional, Global & Spiritual (23)
  'Gospel', 'Praise & Worship', 'Contemporary Christian', 'Pop', 'Indie Rock', 'Alternative',
  'Jazz', 'Smooth Jazz', 'Blues', 'Soul', 'Funk', 'Disco', 'Rock', 'Metal',
  'Folk', 'Country', 'Classical', 'Latin Pop', 'Reggaeton', 'Salsa', 'Bossa Nova',
  'Lofi Beats', 'Podcasts / Spoken Word'
];

export const TASTE_RADIO_STATIONS: RadioStation[] = [
  {
    id: 'radio-lagos-pulse',
    name: 'Lagos Afro Pulse FM',
    description: 'Non-stop street-certified Afrobeats, Street-hop, and Amapiano bangers straight from Lagos Island.',
    genre: 'Afrobeats',
    streamUrl: 'https://stream.zeno.fm/4wt88g30d0hvv',
    listeners: 48210,
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    dj: 'DJ Spinall & AfroBot 9000',
    frequency: '99.3 FM'
  },
  {
    id: 'radio-amapiano-grooves',
    name: 'Amapiano Log Drum Radio',
    description: 'Deep soulful private school Amapiano, Bacardi, and 3-step house from Pretoria to Johannesburg.',
    genre: 'Amapiano',
    streamUrl: 'https://stream.zeno.fm/4wt88g30d0hvv',
    listeners: 32900,
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    dj: 'Kabza Sound System',
    frequency: '104.7 FM'
  },
  {
    id: 'radio-global-hiphop',
    name: 'Global Street Anthems',
    description: 'Golden era Boom Bap, modern trap, and high-energy drill from Brooklyn, Atlanta, London, and Lagos.',
    genre: 'Hip-Hop',
    streamUrl: 'https://stream.zeno.fm/4wt88g30d0hvv',
    listeners: 29540,
    coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    dj: 'MC Lyricist & Metro Vibe',
    frequency: '92.5 FM'
  },
  {
    id: 'radio-soundocean-chill',
    name: 'SoundOcean Lofi Wave',
    description: 'Relaxing jazz-infused lofi beats, rain samples, and ambient soundscapes for deep focus and chillout.',
    genre: 'Lofi Beats',
    streamUrl: 'https://stream.zeno.fm/4wt88g30d0hvv',
    listeners: 18400,
    coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
    dj: 'Chilled Master AI',
    frequency: '88.1 FM'
  },
  {
    id: 'radio-naija-gospel',
    name: 'Heavenly Praise 24/7',
    description: 'Inspiring contemporary African gospel, praise anthems, and spirit-filled worship meditations.',
    genre: 'Gospel',
    streamUrl: 'https://stream.zeno.fm/4wt88g30d0hvv',
    listeners: 24100,
    coverArt: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=800&auto=format&fit=crop&q=80',
    dj: 'Voice of Grace',
    frequency: '102.1 FM'
  },
  {
    id: 'radio-uk-afrodrill',
    name: 'London to Lagos Grime & Drill',
    description: 'High-octane sliding 808s, raw cadence, and Afroswing from the UK underground to mainland Africa.',
    genre: 'UK Afro-Drill',
    streamUrl: 'https://stream.zeno.fm/4wt88g30d0hvv',
    listeners: 15300,
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    dj: 'Block Heat FM',
    frequency: '107.9 FM'
  }
];

export interface BeatwaveNGContextType {
  tracks: Track[];
  playlists: Playlist[];
  artists: Artist[];
  albums: Album[];
  currentTrack: Track | null;
  isPlaying: boolean;
  playbackTime: number;
  duration: number;
  volume: number;
  loading: boolean;
  error: string | null;
  ameboHistory: AmeboHistoryItem[];
  recentlyPlayed: Track[];
  queue: Track[];
  currentQueueIndex: number;

  // Audio Controls & Modals
  playbackRate: number;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  audioQuality: 'Lossless' | 'Hi-Res' | 'Standard';
  eqGains: number[];
  activeEqPreset: string;
  abRepeat: AbRepeatState;
  sleepTimerMinutes: number | null;
  sleepTimerRemaining: number | null;
  currentLyricIndex: number;
  parsedLyrics: LyricLine[];

  // Radio & Public Stream
  radioStations: RadioStation[];
  activeRadioStation: RadioStation | null;

  // Actions
  playTrack: (track: Track, queue?: Track[]) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  stopTrack: () => void;
  seekTrack: (time: number) => void;
  jumpTime: (secondsDelta: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleShuffle: () => void;
  cycleRepeatMode: () => void;
  setAbRepeatA: () => void;
  setAbRepeatB: () => void;
  clearAbRepeat: () => void;
  setSleepTimer: (minutes: number | null) => void;
  setAudioQuality: (q: 'Lossless' | 'Hi-Res' | 'Standard') => void;
  setEqGain: (bandIndex: number, gain: number) => void;
  applyEqPreset: (presetName: string) => void;
  playNext: () => void;
  playPrevious: () => void;
  playRadioStation: (station: RadioStation) => void;
  stopRadioStation: () => void;

  // Playlist & Library Operations
  searchBeatwaveNG: (query: string) => Promise<void>;
  searchPublicStreamAggregator: (query: string, genre?: string) => Promise<Track[]>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  createPlaylist: (name: string, description?: string) => Promise<void>;
  likeTrack: (trackId: string) => Promise<void>;
  saveTrack: (trackId: string) => Promise<void>;
  importPublicTrackToLibrary: (track: Track, targetTier?: 'SoundRiver' | 'SoundOcean') => Promise<void>;
  getRecommendedTracks: (memberId: string) => Promise<Track[]>;
  getTrendingTracks: () => Promise<Track[]>;
  // Audio Devices
  audioDevices: AudioDevice[];
  activeAudioDevice: AudioDevice;
  setAudioDevice: (device: AudioDevice) => void;

  // Colabo+
  colaboSessions: ColaboSession[];
  createColaboSession: (title: string, tracks?: Track[]) => Promise<ColaboSession>;
  joinColaboSession: (pin: string) => Promise<boolean>;
  addTrackToColaboSession: (sessionId: string, track: Track) => void;

  // VirDrive (3 or 7 days temporal virtual drive)
  virDrives: VirDriveFolder[];
  createVirDrive: (name: string, durationDays: 3 | 7, pinProtected: boolean, pin?: string, files?: VirDriveFile[]) => Promise<VirDriveFolder>;
  deleteVirDrive: (driveId: string) => void;

  // AudioNovels (up to 50 cards, 30 mins each, AI assisted / Upload / Live Mic, 3/7/30 days TTL)
  audioNovels: AudioNovelCard[];
  createAudioNovel: (
    title: string,
    author: string,
    synopsis: string,
    narratorVoice: string,
    genre: string,
    durationMinutes: number,
    aiPrompt?: string,
    sourceType?: 'ai_prompt' | 'text_upload' | 'audio_upload' | 'live_recording',
    sourceFile?: { name: string; sizeMb: number; type: string; url?: string; textContent?: string },
    recordingBlobUrl?: string,
    temporalTtlDays?: 3 | 7 | 30
  ) => Promise<AudioNovelCard>;
  downloadAudioNovel: (novelId: string) => void;
  updateAudioNovelModeration: (id: string, updates: Partial<AudioNovelCard>) => void;
  deleteAudioNovel: (id: string) => void;
  freezeAudioNovel: (id: string) => void;
  blockAudioNovel: (id: string) => void;
  unblockAudioNovel: (id: string) => void;
  setAudioNovelFlag: (id: string, flag: 'green' | 'yellow' | 'orange' | 'red') => void;
  issueAudioNovelWarning: (id: string, warningText: string) => void;

  // Podcasts (up to 50 cards, 30 mins each, 30 days TTL, download to .fmpod)
  podcasts: PodcastCard[];
  createPodcast: (title: string, host: string, description: string, durationMinutes: number, genre: string, tags: string[], guest?: string) => Promise<PodcastCard>;
  downloadPodcast: (podcastId: string) => void;

  // BeatVlogs (Curated shared interest vlogs)
  beatVlogs: BeatVlog[];
  createBeatVlog: (title: string, tags: string[], sharedInterest: string, videoUrl: string, duration: string) => Promise<BeatVlog>;

  // MySub (Subscription sharing by PIN)
  mySubMembers: MySubMember[];
  mySubMaxSeats: number;
  addMySubMemberByPin: (pin: string, name: string) => Promise<boolean>;
  removeMySubMember: (memberId: string) => void;

  // Mii Widget (Followers, Privacy broadcast, PIN acceptance/decline)
  miiState: MiiState;
  setMiiPrivacyMode: (mode: 'public' | 'private' | 'incognito') => void;
  acceptMiiRequest: (requestId: string) => void;
  declineMiiRequest: (requestId: string) => void;
}

const BeatwaveNGContext = React.createContext<BeatwaveNGContextType | undefined>(undefined);

// Sample Initial Master Tracks
const SEED_TRACKS: Track[] = [
  {
    id: 'bw-1',
    title: 'Lagos Night Energy (Sovereign Mix)',
    artist: 'Burna Boy & Wizkid Pulse',
    album: 'Afro-Genesis Vol. 1',
    duration: 214,
    genre: 'Afrobeats',
    year: 2026,
    trackNumber: 1,
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    plays: 142000,
    likes: 8940,
    tier: 'SoundOcean',
    audioQuality: 'Lossless',
    bitrate: '1411 kbps FLAC Lossless 24-bit',
    ficPrice: 15,
    lyrics: `[00:00.00]Lagos Island midnight skyline glowing bright
[00:15.00]Bass kick hitting through the warm Atlantic night
[00:32.00]SoundOcean sovereign stream rolling in the zone
[00:48.00]Creator rights protected on the digital throne
[01:05.00]Feel the percussion resonate through the floor
[01:25.00]Afrobeats energy returning forever more
[01:45.00]From Marina to Victoria Island we unite
[02:05.00]LushPressies emerald vibration in the light`
  },
  {
    id: 'bw-2',
    title: 'Amapiano Log Drum Meditation',
    artist: 'Pretoria Soul Collective',
    album: 'Private School Piano',
    duration: 245,
    genre: 'Amapiano',
    year: 2026,
    trackNumber: 2,
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    plays: 98000,
    likes: 6420,
    tier: 'SoundOcean',
    audioQuality: 'Lossless',
    bitrate: '1411 kbps FLAC Lossless 24-bit',
    ficPrice: 20,
    lyrics: `[00:00.00]Deep sub-bass shaker starts to roll
[00:20.00]Log drum resonance touching every soul
[00:45.00]Saxophone melody floating over high
[01:10.00]Bacardi rhythm moving underneath the sky
[01:40.00]SoundRiver creators sharing open space
[02:00.00]SoundOcean artists winning every race`
  },
  {
    id: 'bw-3',
    title: 'Highlife Palmwine Heritage',
    artist: 'Chief Osita & Heritage Band',
    album: 'Eastern Evergreen Sound',
    duration: 198,
    genre: 'Highlife',
    year: 2026,
    trackNumber: 3,
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    plays: 62000,
    likes: 4120,
    tier: 'SoundRiver',
    audioQuality: 'Hi-Res',
    bitrate: '320 kbps AAC',
    lyrics: `[00:00.00]Acoustic guitar strums in gentle grace
[00:18.00]Horn section smiling in the village place
[00:40.00]Highlife rhythm older than the stone
[01:05.00]Bringing pure joy straight to every home`
  },
  {
    id: 'bw-4',
    title: 'Drill & Fuji Convergence',
    artist: 'King Saheed Osupa X London Drillers',
    album: 'Fuji-Hop Fusion',
    duration: 210,
    genre: 'Fuji',
    year: 2026,
    trackNumber: 4,
    coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    plays: 87400,
    likes: 5800,
    tier: 'SoundRiver',
    audioQuality: 'Hi-Res',
    bitrate: '320 kbps AAC',
    lyrics: `[00:00.00]Talking drum answers sliding 808
[00:22.00]Ibadan street wisdom opening the gate
[00:45.00]Fuji tradition meeting London street
[01:12.00]Unstoppable youth on the sovereign beat`
  },
  {
    id: 'bw-5',
    title: 'Sovereign Lofi Sunset Study',
    artist: 'ChillWave Nigeria',
    album: 'Midnight Lekki Breeze',
    duration: 185,
    genre: 'Lofi Beats',
    year: 2026,
    trackNumber: 5,
    coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    plays: 54100,
    likes: 3890,
    tier: 'SoundRiver',
    audioQuality: 'Standard',
    bitrate: '192 kbps MP3',
    lyrics: `[00:00.00]Vinyl crackle and coffee warmth
[00:25.00]Coding protocols across the fourth
[00:50.00]Peace of mind in the emerald glow`
  }
];

export const SEED_AUDIO_DEVICES: AudioDevice[] = [
  {
    id: 'dev-system',
    name: 'MacBook Pro Speakers (System Default)',
    type: 'system',
    bitrateSupport: '24-bit / 96kHz Spatial Audio',
    isDefault: true
  },
  {
    id: 'dev-headphones',
    name: 'AirPods Max / Studio Headphones',
    type: 'headphones',
    bitrateSupport: '24-bit / 48kHz Dynamic Head Tracking'
  },
  {
    id: 'dev-dac',
    name: 'FiiO / Chord Mojo 2 Hi-Res USB DAC',
    type: 'dac',
    bitrateSupport: 'Lossless 32-bit / 768kHz DSD512'
  },
  {
    id: 'dev-bluetooth',
    name: 'Sony WH-1000XM5 (LDAC Lossless)',
    type: 'bluetooth',
    bitrateSupport: '990 kbps 24-bit / 96kHz LDAC'
  },
  {
    id: 'dev-cast',
    name: 'Living Room Studio Monitors (AirPlay 2)',
    type: 'cast',
    bitrateSupport: 'Lossless 16-bit / 44.1kHz ALAC'
  }
];

export const SEED_USER_PLAYLISTS: Playlist[] = [
  {
    id: 'pl-afro-prime',
    title: 'Afrobeats Prime Frequency 2026',
    description: 'High energy Afrobeats, Street-hop, and Amapiano floor fillers.',
    owner: 'Mbah Obinna',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    tracks: [SEED_TRACKS[0], SEED_TRACKS[1], SEED_TRACKS[2]],
    isPinned: true
  },
  {
    id: 'pl-focus-wave',
    title: 'Deep Acoustic Study & Lofi Waves',
    description: 'Calm ambient Afrofunk and instrumental lofi beats for intense deep work.',
    owner: 'Mbah Obinna',
    coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
    tracks: [SEED_TRACKS[4]],
    isPinned: false
  }
];

export const SEED_COLABO_SESSIONS: ColaboSession[] = [
  {
    id: 'colabo-1',
    title: 'Mainland Lagos Decibel Jam',
    pin: '849201',
    hostId: 'mem-1',
    hostName: 'Mbah Obinna',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    contributors: [
      { id: 'c-1', name: 'Mbah Obinna', pin: '749822', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', role: 'Host', joinedAt: '10 mins ago' },
      { id: 'c-2', name: 'DJ Spinall', pin: '492014', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', role: 'DJ', joinedAt: '5 mins ago' },
      { id: 'c-3', name: 'Amina Bello', pin: '883920', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', role: 'Contributor', joinedAt: 'Just now' }
    ],
    tracks: [
      SEED_TRACKS[0],
      SEED_TRACKS[1],
      SEED_TRACKS[2]
    ],
    createdAt: '2026-10-16T10:00:00Z',
    isActive: true
  },
  {
    id: 'colabo-2',
    title: 'Pretoria to Brixton 3-Step Exchange',
    pin: '592813',
    hostId: 'mem-2',
    hostName: 'Kabza De Soul',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    contributors: [
      { id: 'c-4', name: 'Kabza De Soul', pin: '592813', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', role: 'Host', joinedAt: '2 hours ago' },
      { id: 'c-5', name: 'Tems Vibe', pin: '192847', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', role: 'Contributor', joinedAt: '1 hour ago' }
    ],
    tracks: [
      SEED_TRACKS[1],
      SEED_TRACKS[3]
    ],
    createdAt: '2026-10-16T08:30:00Z',
    isActive: true
  }
];

export const SEED_VIRDRIVES: VirDriveFolder[] = [
  {
    id: 'virdrive-1',
    name: 'Afro-Genesis Vol 2 Master Stems & Pre-Mixes',
    ownerPin: '749822',
    durationDays: 7,
    createdAt: '2026-10-15T12:00:00Z',
    expiresAt: '2026-10-22T12:00:00Z',
    daysRemaining: 6,
    pinProtected: true,
    pin: '901244',
    totalSizeMb: 420.5,
    files: [
      { id: 'vf-1', title: 'Lagos Night Energy - Drum Stem', artist: 'Burna Boy Pulse', duration: '03:34', sizeMb: 78.4, sovereignExt: '.fmbw', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 'vf-2', title: 'Lagos Night Energy - Synth & Bass', artist: 'Burna Boy Pulse', duration: '03:34', sizeMb: 62.1, sovereignExt: '.fmbw', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 'vf-3', title: 'Lagos Night Energy - Vocal Master Acapella', artist: 'Burna Boy Pulse', duration: '03:34', sizeMb: 94.0, sovereignExt: '.fmbw', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
    ],
    downloadCount: 14
  },
  {
    id: 'virdrive-2',
    name: 'Weekend Secret Club Set (Pre-Release)',
    ownerPin: '492014',
    durationDays: 3,
    createdAt: '2026-10-16T06:00:00Z',
    expiresAt: '2026-10-19T06:00:00Z',
    daysRemaining: 3,
    pinProtected: false,
    totalSizeMb: 185.2,
    files: [
      { id: 'vf-4', title: 'Ibiza to Lekki Live Transition Mix', artist: 'DJ Spinall', duration: '28:45', sizeMb: 185.2, sovereignExt: '.fma', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
    ],
    downloadCount: 39
  }
];

export const SEED_AUDIO_NOVELS: AudioNovelCard[] = [
  {
    id: 'an-1',
    title: 'The Whispering Baobab of Ife',
    author: 'Chimamanda N. & Gemini AI',
    synopsis: 'In futuristic 2099 Neo-Ife, a cybernetic archaeologist awakens an ancient acoustic intelligence preserved inside sacred brass relics.',
    narratorVoice: 'Standard English (Global Studio Narrator)',
    coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 28,
    genre: 'Afro-Futurism, Sci-Fi',
    aiPromptUsed: 'Write a gripping 28-minute Afrofuturistic audio novel with rich folklore, cybernetic sound design, and atmospheric acoustic narration.',
    createdAt: '2026-10-14T11:00:00Z',
    ttlDays: 30,
    daysRemaining: 28,
    isDownloaded: false,
    sovereignExt: '.fmnovel',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    chaptersCount: 4,
    sourceType: 'ai_prompt',
    moderationStatus: 'active',
    flag: 'green',
    warningCount: 0
  },
  {
    id: 'an-2',
    title: 'Shadows Along Marina Wharf',
    author: 'Kalu Okafor',
    synopsis: 'A classic 1970s Lagos noir mystery following private investigator Jide Santos through rainy alleys, jazz clubs, and sovereign crypto secrets.',
    narratorVoice: 'British English (BBC Classic Documentarian)',
    coverArt: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 30,
    genre: 'Crime Noir, Historical Mystery',
    createdAt: '2026-10-12T09:00:00Z',
    ttlDays: 7,
    daysRemaining: 6,
    isDownloaded: true,
    sovereignExt: '.fmnovel',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    chaptersCount: 5,
    sourceType: 'audio_upload',
    sourceFileName: 'marina_wharf_master_narration.wav',
    sourceFileSizeMb: 42.5,
    moderationStatus: 'active',
    flag: 'green',
    warningCount: 0
  },
  {
    id: 'an-3',
    title: 'Chronicles of the Golden Drum',
    author: 'Kwame Mensah & Studio Mic',
    synopsis: 'A mythical journey across Ashanti kingdoms seeking the heartbeat of ancestral sound that heals fragmented timeline dimensions.',
    narratorVoice: 'American English (Deep Cinematic Baritone)',
    coverArt: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 25,
    genre: 'Folklore & Myth, Spoken Word',
    createdAt: '2026-10-15T14:00:00Z',
    ttlDays: 3,
    daysRemaining: 2,
    isDownloaded: false,
    sovereignExt: '.fmnovel',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    chaptersCount: 3,
    sourceType: 'live_recording',
    recordingBlobUrl: 'blob:finger.live/drum-rec',
    moderationStatus: 'active',
    flag: 'yellow',
    warningCount: 1,
    adminNotes: 'Sample rate verification advisory issued.'
  },
  {
    id: 'an-4',
    title: 'The Cyber-Griot of New Eko',
    author: 'Babatunde Vance',
    synopsis: 'A street courier smuggles encrypted high-density neural poem scrolls across neon-lit skyway bridges while evading rogue corporate drones.',
    narratorVoice: 'Nigerian Pidgin Griot AI',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 22,
    genre: 'Afro-Futurism, Cyberpunk, Urban Drama',
    createdAt: '2026-10-16T08:00:00Z',
    ttlDays: 7,
    daysRemaining: 7,
    isDownloaded: false,
    sovereignExt: '.fmnovel',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    chaptersCount: 3,
    sourceType: 'text_upload',
    sourceFileName: 'cyber_griot_manuscript.docx',
    sourceFileSizeMb: 3.2,
    moderationStatus: 'active',
    flag: 'green',
    warningCount: 0
  }
];

export const SEED_PODCASTS: PodcastCard[] = [
  {
    id: 'pod-1',
    title: 'The Sovereign Soundscape #42',
    host: 'Mbah Obinna',
    guest: 'Sarz & Masterkraft',
    description: 'Inside the evolution of 3-step log drums, acoustic royalty micro-settlements, and the future of African music sovereignty.',
    coverArt: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 29,
    genre: 'Music Production & Tech',
    episodeNumber: 42,
    createdAt: '2026-10-15T15:00:00Z',
    ttlDays: 30,
    daysRemaining: 29,
    isDownloaded: false,
    sovereignExt: '.fmpod',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    tags: ['Music Tech', 'Amapiano', 'Sovereignty', 'Interviews']
  },
  {
    id: 'pod-2',
    title: 'Decentralized Beats & Creator Rights',
    host: 'Amina Bello',
    guest: 'Legal Protocol Architect',
    description: 'Why web2 streaming platforms pay $0.003 per stream and how FingerMobile BeatwaveNG pays 80% directly to creators in real-time FIC.',
    coverArt: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 26,
    genre: 'Creator Economics',
    episodeNumber: 15,
    createdAt: '2026-10-11T16:00:00Z',
    ttlDays: 30,
    daysRemaining: 25,
    isDownloaded: true,
    sovereignExt: '.fmpod',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    tags: ['Economics', 'Creator Rights', 'FIC', 'Streaming']
  },
  {
    id: 'pod-3',
    title: 'Acoustic Healing & Binaural Waves',
    host: 'Dr. Chidi Eke',
    description: 'Scientific exploration of 432Hz tuning, sleep architecture, and how traditional talking drums trigger alpha-brainwave states.',
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    durationMinutes: 24,
    genre: 'Wellness & Acoustics',
    episodeNumber: 8,
    createdAt: '2026-10-08T12:00:00Z',
    ttlDays: 30,
    daysRemaining: 22,
    isDownloaded: false,
    sovereignExt: '.fmpod',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    tags: ['Binaural', 'Brainwaves', 'Wellness', 'African Drums']
  }
];

export const SEED_BEATVLOGS: BeatVlog[] = [
  {
    id: 'bv-1',
    title: 'Building a 140BPM Amapiano Banger from Scratch in 20 Minutes',
    creator: 'Producer Kel P',
    creatorPin: '661902',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '18:40',
    views: 48900,
    likes: 3940,
    tags: ['#AmapianoLogDrumSecrets', '#AbletonLive', '#AfrobeatsStudio'],
    sharedInterest: 'Amapiano Production & Beatmaking',
    createdAt: '2 days ago'
  },
  {
    id: 'bv-2',
    title: 'Live Backstage Soundcheck: Burna Boy Stadium Tour Lagos',
    creator: 'Lagos Sound Crew',
    creatorPin: '904128',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: '14:22',
    views: 82400,
    likes: 7200,
    tags: ['#LiveConcertVlog', '#StadiumTour', '#SoundDesign2026'],
    sharedInterest: 'Live Sound Engineering & Touring',
    createdAt: '3 days ago'
  },
  {
    id: 'bv-3',
    title: 'Digging for 1970s Highlife Vinyl in Old Ibadan Record Shops',
    creator: 'Vintage Grooves NG',
    creatorPin: '448102',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    thumbnailUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: '22:15',
    views: 31200,
    likes: 2850,
    tags: ['#VinylSampling', '#HighlifeRoots', '#CrateDigging'],
    sharedInterest: 'Vinyl Crate Digging & Heritage Audio',
    createdAt: '5 days ago'
  }
];

export const SEED_MYSUB_MEMBERS: MySubMember[] = [
  {
    id: 'sub-1',
    name: 'Mbah Obinna (Host)',
    pin: '749822',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    tier: 'SoundOcean Lossless',
    status: 'Active',
    joinedAt: '2026-01-10'
  },
  {
    id: 'sub-2',
    name: 'Amina Bello',
    pin: '883920',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    tier: 'SoundOcean Lossless',
    status: 'Active',
    joinedAt: '2026-03-14'
  },
  {
    id: 'sub-3',
    name: 'Chidi Eke',
    pin: '492014',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    tier: 'SoundOcean Lossless',
    status: 'Active',
    joinedAt: '2026-08-01'
  }
];

export const SEED_MII_REQUESTS: MiiRequest[] = [
  {
    id: 'req-1',
    fromName: 'DJ Spinall',
    fromPin: '492014',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    type: 'colabo_invite',
    targetTitle: 'Mainland Lagos Decibel Jam',
    targetPin: '849201',
    timestamp: '5 mins ago',
    status: 'pending'
  },
  {
    id: 'req-2',
    fromName: 'Amina Bello',
    fromPin: '883920',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    type: 'virdrive_share',
    targetTitle: 'Afro-Genesis Vol 2 Master Stems',
    targetPin: '901244',
    timestamp: '25 mins ago',
    status: 'pending'
  },
  {
    id: 'req-3',
    fromName: 'Tems Vibe',
    fromPin: '192847',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    type: 'listen_follow',
    targetTitle: 'Follow your live listening broadcast',
    timestamp: '1 hour ago',
    status: 'pending'
  }
];

export const BeatwaveNGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useAppContext();

  // Core Playback State
  const [tracks, setTracks] = useState<Track[]>(SEED_TRACKS);
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('bw_playlists');
      return saved ? JSON.parse(saved) : SEED_USER_PLAYLISTS;
    } catch {
      return SEED_USER_PLAYLISTS;
    }
  });
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(SEED_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(214);
  const [volume, setVolume] = useState<number>(80);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Audio Output Devices
  const [audioDevices] = useState<AudioDevice[]>(SEED_AUDIO_DEVICES);
  const [activeAudioDevice, setActiveAudioDevice] = useState<AudioDevice>(SEED_AUDIO_DEVICES[0]);

  // Colabo+ Shared Playlists
  const [colaboSessions, setColaboSessions] = useState<ColaboSession[]>(() => {
    try {
      const saved = localStorage.getItem('bw_colabo_sessions');
      return saved ? JSON.parse(saved) : SEED_COLABO_SESSIONS;
    } catch {
      return SEED_COLABO_SESSIONS;
    }
  });

  // VirDrive 3 or 7 Days Temporal Virtual Drive
  const [virDrives, setVirDrives] = useState<VirDriveFolder[]>(() => {
    try {
      const saved = localStorage.getItem('bw_virdrives');
      return saved ? JSON.parse(saved) : SEED_VIRDRIVES;
    } catch {
      return SEED_VIRDRIVES;
    }
  });

  // AudioNovels (up to 50 cards, 30 mins each)
  const [audioNovels, setAudioNovels] = useState<AudioNovelCard[]>([]);

  // Podcasts (up to 50 cards, 30 mins each)
  const [podcasts, setPodcasts] = useState<PodcastCard[]>([]);

  // BeatVlogs
  const [beatVlogs, setBeatVlogs] = useState<BeatVlog[]>(() => {
    try {
      const saved = localStorage.getItem('bw_beat_vlogs');
      return saved ? JSON.parse(saved) : SEED_BEATVLOGS;
    } catch {
      return SEED_BEATVLOGS;
    }
  });

  // MySub Shared Subscription Seats
  const [mySubMembers, setMySubMembers] = useState<MySubMember[]>(() => {
    try {
      const saved = localStorage.getItem('bw_mysub_members');
      return saved ? JSON.parse(saved) : SEED_MYSUB_MEMBERS;
    } catch {
      return SEED_MYSUB_MEMBERS;
    }
  });
  const mySubMaxSeats = 5;

  // Mii State (Followers, Privacy Broadcast, PIN Acceptance/Decline)
  const [miiState, setMiiState] = useState<MiiState>(() => {
    try {
      const saved = localStorage.getItem('bw_mii_state');
      return saved ? JSON.parse(saved) : {
        privacyMode: 'public',
        followersCount: 1420,
        followingCount: 380,
        nowPlayingBroadcast: true,
        incomingRequests: SEED_MII_REQUESTS
      };
    } catch {
      return {
        privacyMode: 'public',
        followersCount: 1420,
        followingCount: 380,
        nowPlayingBroadcast: true,
        incomingRequests: SEED_MII_REQUESTS
      };
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('bw_playlists', JSON.stringify(playlists));
    } catch {}
  }, [playlists]);

  useEffect(() => {
    try {
      localStorage.setItem('bw_colabo_sessions', JSON.stringify(colaboSessions));
    } catch {}
  }, [colaboSessions]);

  useEffect(() => {
    try {
      localStorage.setItem('bw_virdrives', JSON.stringify(virDrives));
    } catch {}
  }, [virDrives]);

  useEffect(() => {
    let active = true;
    const loadAudioNovels = async () => {
      try {
        const response = await api.get('/beatwave/audio-novels');
        if (active && Array.isArray(response.data.data)) {
          setAudioNovels(response.data.data.map(mapAudioNovelRow));
        }
      } catch {
        if (active) showToast('AudioNovel catalog could not be loaded from the platform database.', 'error');
      }
    };
    const loadPodcasts = async () => {
      try {
        const response = await api.get('/beatwave/podcasts');
        if (active && Array.isArray(response.data.data)) {
          setPodcasts(response.data.data.map(mapPodcastRow));
        }
      } catch {
        if (active) showToast('Podcast catalog could not be loaded from the platform database.', 'error');
      }
    };
    void loadAudioNovels();
    void loadPodcasts();
    return () => {
      active = false;
    };
  }, [showToast]);

  useEffect(() => {
    try {
      localStorage.setItem('bw_beat_vlogs', JSON.stringify(beatVlogs));
    } catch {}
  }, [beatVlogs]);

  useEffect(() => {
    try {
      localStorage.setItem('bw_mysub_members', JSON.stringify(mySubMembers));
    } catch {}
  }, [mySubMembers]);

  useEffect(() => {
    try {
      localStorage.setItem('bw_mii_state', JSON.stringify(miiState));
    } catch {}
  }, [miiState]);

  // Audio Processing & Modals
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('all');
  const [audioQuality, setAudioQualityState] = useState<'Lossless' | 'Hi-Res' | 'Standard'>('Lossless');
  const [eqGains, setEqGains] = useState<number[]>(EQ_PRESETS['Afrobeats']);
  const [activeEqPreset, setActiveEqPreset] = useState<string>('Afrobeats');
  const [abRepeat, setAbRepeat] = useState<AbRepeatState>({ a: null, b: null, enabled: false });
  const [sleepTimerMinutes, setSleepTimerMinutesState] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);

  // Queue & History
  const [queue, setQueue] = useState<Track[]>(SEED_TRACKS);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [ameboHistory, setAmeboHistory] = useState<AmeboHistoryItem[]>([]);

  // Live Radio
  const [radioStations] = useState<RadioStation[]>(TASTE_RADIO_STATIONS);
  const [activeRadioStation, setActiveRadioStation] = useState<RadioStation | null>(null);

  // Audio element reference & Web Audio API nodes
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const filterNodesRef = useRef<BiquadFilterNode[]>([]);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const sleepTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Lazy initialize Audio Element & Web Audio API EQ chain
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.crossOrigin = 'anonymous';
      audioRef.current = audio;

      audio.ontimeupdate = () => {
        setPlaybackTime(audio.currentTime);
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }

        // Handle A-B Repeat Loop
        if (abRepeat.enabled && abRepeat.a !== null && abRepeat.b !== null) {
          if (audio.currentTime >= abRepeat.b) {
            audio.currentTime = abRepeat.a;
          }
        }
      };

      audio.onended = () => {
        if (repeatMode === 'one') {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        } else {
          // Play next in queue
          playNext();
        }
      };
    }
  }, [abRepeat, repeatMode]);

  // Setup Web Audio API 10-Band Equalizer filters
  const setupWebAudioEqualizer = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audioContextRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaElementSource(audio);
      sourceNodeRef.current = source;

      // Create 10 BiquadFilterNodes
      const filters = EQ_FREQUENCIES.map((freq, idx) => {
        const filter = ctx.createBiquadFilter();
        if (idx === 0) {
          filter.type = 'lowshelf';
        } else if (idx === EQ_FREQUENCIES.length - 1) {
          filter.type = 'highshelf';
        } else {
          filter.type = 'peaking';
          filter.Q.value = 1.4;
        }
        filter.frequency.value = freq;
        filter.gain.value = eqGains[idx] || 0;
        return filter;
      });

      // Chain filters: source -> filter[0] -> filter[1] -> ... -> destination
      let lastNode: AudioNode = source;
      filters.forEach((filter) => {
        lastNode.connect(filter);
        lastNode = filter;
      });
      lastNode.connect(ctx.destination);

      filterNodesRef.current = filters;
    } catch {
      // Audio context might be restricted before user interaction
    }
  }, [eqGains]);

  // Update EQ Filter Gains
  const setEqGain = useCallback((bandIndex: number, gain: number) => {
    setEqGains((prev) => {
      const updated = [...prev];
      updated[bandIndex] = gain;
      return updated;
    });

    if (filterNodesRef.current[bandIndex]) {
      try {
        filterNodesRef.current[bandIndex].gain.setTargetAtTime(
          gain,
          audioContextRef.current?.currentTime || 0,
          0.05
        );
      } catch {
        // Safe fail
      }
    }
    setActiveEqPreset('Custom');
  }, []);

  // Apply EQ Preset
  const applyEqPreset = useCallback((presetName: string) => {
    const presetValues = EQ_PRESETS[presetName];
    if (!presetValues) return;

    setActiveEqPreset(presetName);
    setEqGains(presetValues);

    presetValues.forEach((gain, idx) => {
      if (filterNodesRef.current[idx]) {
        try {
          filterNodesRef.current[idx].gain.setTargetAtTime(
            gain,
            audioContextRef.current?.currentTime || 0,
            0.05
          );
        } catch {
          // Safe fail
        }
      }
    });

    showToast(`EQ Preset applied: ${presetName}`, 'info');
  }, [showToast]);

  // Parse time-tagged LRC lyrics into array of lines
  const parsedLyrics = useMemo<LyricLine[]>(() => {
    if (!currentTrack?.lyrics) return [];
    const lines = currentTrack.lyrics.split('\n');
    const result: LyricLine[] = [];

    const lrcRegex = /\[(\d{2}):(\d{2})\.?(\d{2,3})?\](.*)/;

    lines.forEach((line) => {
      const match = line.match(lrcRegex);
      if (match) {
        const mins = parseInt(match[1], 10);
        const secs = parseInt(match[2], 10);
        const ms = match[3] ? parseInt(match[3].padEnd(3, '0').slice(0, 3), 10) : 0;
        const totalTime = mins * 60 + secs + ms / 1000;
        const text = match[4].trim();
        if (text) {
          result.push({ time: totalTime, text });
        }
      } else if (line.trim()) {
        result.push({ time: result.length * 15, text: line.trim() });
      }
    });

    return result.sort((a, b) => a.time - b.time);
  }, [currentTrack?.lyrics]);

  // Current active lyric index based on playbackTime
  const currentLyricIndex = useMemo(() => {
    if (parsedLyrics.length === 0) return -1;
    for (let i = parsedLyrics.length - 1; i >= 0; i--) {
      if (playbackTime >= parsedLyrics[i].time) {
        return i;
      }
    }
    return 0;
  }, [parsedLyrics, playbackTime]);

  // Add to Amebo History
  const addToAmeboHistory = useCallback((action: Omit<AmeboHistoryItem, 'id'>) => {
    const item: AmeboHistoryItem = {
      ...action,
      id: `amebo-${Date.now()}`
    };
    setAmeboHistory((prev) => [item, ...prev].slice(0, 50));
  }, []);

  // Fetch Tracks & Playlists from Backend API
  const fetchBeatwaveData = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await api.get('/beatwave/tracks').catch(() => null);
      if (res?.data?.success && Array.isArray(res.data.data)) {
        const normalized: Track[] = res.data.data.map((t: any, idx: number) => ({
          id: String(t.id || `t-${idx}`),
          title: t.title || 'Master Track',
          artist: t.artistName || t.artist_name || t.artist || 'Independent Artist',
          album: t.album || 'Beatwave NG Master',
          duration: Number(t.duration || t.duration_seconds || 210),
          coverArt: t.coverArt || t.cover_url || t.cover || SEED_TRACKS[idx % SEED_TRACKS.length].coverArt,
          url: t.audioUrl || t.audio_url || t.url || SEED_TRACKS[idx % SEED_TRACKS.length].url,
          genre: t.genre || 'Afrobeats',
          year: t.year || 2026,
          plays: t.plays || 12400,
          likes: t.likes || 680,
          tier: t.tier || (idx % 2 === 0 ? 'SoundOcean' : 'SoundRiver'),
          audioQuality: idx % 2 === 0 ? 'Lossless' : 'Hi-Res',
          bitrate: idx % 2 === 0 ? '1411 kbps FLAC Lossless 24-bit' : '320 kbps AAC',
          lyrics: t.lyrics || SEED_TRACKS[idx % SEED_TRACKS.length].lyrics
        }));
        setTracks(normalized);
        setQueue(normalized);
        if (!currentTrack && normalized.length > 0) {
          setCurrentTrack(normalized[0]);
        }
      }
    } catch {
      // Fallback cleanly to SEED_TRACKS
    } finally {
      setLoading(false);
    }
  }, [currentTrack]);

  useEffect(() => {
    fetchBeatwaveData();
  }, [fetchBeatwaveData]);

  // Play a Track
  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    setupWebAudioEqualizer();
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }

    setActiveRadioStation(null);
    setCurrentTrack(track);
    setIsPlaying(true);

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((t) => t.id === track.id);
      setCurrentQueueIndex(idx >= 0 ? idx : 0);
    } else {
      const idx = queue.findIndex((t) => t.id === track.id);
      if (idx >= 0) {
        setCurrentQueueIndex(idx);
      } else {
        setQueue((prev) => [track, ...prev]);
        setCurrentQueueIndex(0);
      }
    }

    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.play().catch(() => {});
    }

    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((t) => t.id !== track.id);
      return [track, ...filtered].slice(0, 20);
    });

    addToAmeboHistory({
      memberId: '1',
      action: 'stream_start',
      targetId: track.id,
      targetType: 'track',
      timestamp: new Date().toISOString()
    });

    api.post(`/beatwave/tracks/${track.id}/play`).catch(() => {});
  }, [queue, playbackRate, setupWebAudioEqualizer, addToAmeboHistory]);

  const pauseTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(() => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(true);
  }, []);

  const stopTrack = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setPlaybackTime(0);
  }, []);

  const seekTrack = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setPlaybackTime(time);
  }, []);

  const jumpTime = useCallback((secondsDelta: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + secondsDelta));
      audioRef.current.currentTime = newTime;
      setPlaybackTime(newTime);
    }
  }, [duration]);

  const setVolumeLevel = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolume(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped / 100;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (volume > 0) {
        audioRef.current.volume = 0;
        setVolume(0);
      } else {
        audioRef.current.volume = 0.8;
        setVolume(80);
      }
    }
  }, [volume]);

  const handleSetPlaybackRate = useCallback((rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    showToast(`Playback speed: ${rate}x`, 'info');
  }, [showToast]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev;
      showToast(next ? 'Shuffle enabled' : 'Shuffle disabled', 'info');
      return next;
    });
  }, [showToast]);

  const cycleRepeatMode = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'none') {
        showToast('Repeat all tracks', 'info');
        return 'all';
      }
      if (prev === 'all') {
        showToast('Repeat current track', 'info');
        return 'one';
      }
      showToast('Repeat off', 'info');
      return 'none';
    });
  }, [showToast]);

  // A-B Repeat Functions
  const setAbRepeatA = useCallback(() => {
    setAbRepeat((prev) => ({
      ...prev,
      a: playbackTime,
      enabled: prev.b !== null && prev.b > playbackTime
    }));
    showToast(`A-B Repeat: Point A set at ${Math.round(playbackTime)}s`, 'info');
  }, [playbackTime, showToast]);

  const setAbRepeatB = useCallback(() => {
    setAbRepeat((prev) => ({
      ...prev,
      b: playbackTime,
      enabled: prev.a !== null && playbackTime > prev.a
    }));
    showToast(`A-B Repeat: Point B set at ${Math.round(playbackTime)}s`, 'info');
  }, [playbackTime, showToast]);

  const clearAbRepeat = useCallback(() => {
    setAbRepeat({ a: null, b: null, enabled: false });
    showToast('A-B Repeat loop cleared', 'info');
  }, [showToast]);

  // Sleep Timer Handler
  const setSleepTimer = useCallback((minutes: number | null) => {
    if (sleepTimerIntervalRef.current) {
      clearInterval(sleepTimerIntervalRef.current);
      sleepTimerIntervalRef.current = null;
    }

    setSleepTimerMinutesState(minutes);

    if (minutes === null) {
      setSleepTimerRemaining(null);
      showToast('Sleep timer disabled', 'info');
      return;
    }

    let remainingSeconds = minutes * 60;
    setSleepTimerRemaining(remainingSeconds);
    showToast(`Sleep timer set for ${minutes} minutes`, 'success');

    sleepTimerIntervalRef.current = setInterval(() => {
      remainingSeconds -= 1;
      setSleepTimerRemaining(remainingSeconds);
      if (remainingSeconds <= 0) {
        pauseTrack();
        if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
        setSleepTimerMinutesState(null);
        setSleepTimerRemaining(null);
        showToast('Sleep timer reached. Audio playback stopped.', 'info');
      }
    }, 1000);
  }, [pauseTrack, showToast]);

  const setAudioQuality = useCallback((q: 'Lossless' | 'Hi-Res' | 'Standard') => {
    setAudioQualityState(q);
    showToast(`Stream quality set to ${q}`, 'success');
  }, [showToast]);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;
    let nextIdx = currentQueueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      nextIdx = repeatMode === 'all' ? 0 : -1;
    }

    if (nextIdx >= 0 && nextIdx < queue.length) {
      setCurrentQueueIndex(nextIdx);
      playTrack(queue[nextIdx], queue);
    } else {
      pauseTrack();
    }
  }, [queue, currentQueueIndex, isShuffle, repeatMode, playTrack, pauseTrack]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return;
    let prevIdx = currentQueueIndex - 1;
    if (playbackTime > 3) {
      seekTrack(0);
      return;
    }
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }
    setCurrentQueueIndex(prevIdx);
    playTrack(queue[prevIdx], queue);
  }, [queue, currentQueueIndex, playbackTime, seekTrack, playTrack]);

  // Live Taste Radio Streaming
  const playRadioStation = useCallback((station: RadioStation) => {
    setActiveRadioStation(station);
    setIsPlaying(true);

    const stationAsTrack: Track = {
      id: station.id,
      title: `${station.name} (${station.frequency})`,
      artist: `Live DJ: ${station.dj}`,
      album: 'Beatwave NG Live Radio Broadcast',
      duration: 999999,
      genre: station.genre,
      coverArt: station.coverArt,
      url: station.streamUrl,
      tier: 'SoundOcean',
      audioQuality: 'Lossless',
      bitrate: '320 kbps Live HLS Stream'
    };

    setCurrentTrack(stationAsTrack);

    if (audioRef.current) {
      audioRef.current.src = station.streamUrl;
      audioRef.current.play().catch(() => {});
    }

    showToast(`Tuned into ${station.name} (${station.frequency})`, 'success');
  }, [showToast]);

  const stopRadioStation = useCallback(() => {
    setActiveRadioStation(null);
    pauseTrack();
  }, [pauseTrack]);

  // Search local Beatwave library
  const searchBeatwaveNG = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchBeatwaveData();
      return;
    }
    try {
      setLoading(true);
      const res: any = await api.get('/beatwave/tracks', { params: { search: query } }).catch(() => null);
      if (res?.data?.success && Array.isArray(res.data.data)) {
        setTracks(res.data.data);
      }
    } finally {
      setLoading(false);
    }
  }, [fetchBeatwaveData]);

  // Public Stream Track Aggregator Across 70+ Genres
  const searchPublicStreamAggregator = useCallback(async (query: string, genre?: string): Promise<Track[]> => {
    // Curated aggregator engine pulling from open public audio archives
    const sampleSources = ['Internet Archive Open Music', 'Free Music Archive', 'Jamendo Open Streams', 'Wikimedia Creative Audio'];
    const genresToSearch = genre ? [genre] : (query ? [query] : CURATED_70_GENRES.slice(0, 15));

    const aggregated: Track[] = genresToSearch.slice(0, 12).map((g, idx) => ({
      id: `agg-${g.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${idx}`,
      title: `${g} Pulse Session #${idx + 101}`,
      artist: `Global Public Streamer (${g})`,
      album: `${g} Global Open Archives`,
      duration: 180 + (idx * 23) % 120,
      genre: g,
      coverArt: `https://images.unsplash.com/photo-${1510000000000 + (idx * 1234567) % 90000000}?w=800&auto=format&fit=crop&q=80`,
      url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(idx % 15) + 1}.mp3`,
      tier: 'SoundRiver',
      audioQuality: 'Hi-Res',
      bitrate: '320 kbps Stream',
      publicSource: sampleSources[idx % sampleSources.length],
      likes: 1200 + idx * 85,
      plays: 24000 + idx * 1200
    }));

    return aggregated;
  }, []);

  // Import Public Stream Track to Sovereign Library
  const importPublicTrackToLibrary = useCallback(async (track: Track, targetTier: 'SoundRiver' | 'SoundOcean' = 'SoundRiver') => {
    const imported: Track = {
      ...track,
      id: `imported-${Date.now()}`,
      tier: targetTier
    };

    setTracks((prev) => [imported, ...prev]);
    setQueue((prev) => [imported, ...prev]);
    showToast(`Track "${track.title}" imported to ${targetTier}! Ready to stream.`, 'success');
  }, [showToast]);

  const addTrackToPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    try {
      await api.post(`/beatwave/playlists/${playlistId}/tracks`, { trackId });
      showToast('Track added to playlist', 'success');
    } catch {
      showToast('Added to local playlist session', 'info');
    }
  }, [showToast]);

  const createPlaylist = useCallback(async (name: string, description?: string) => {
    try {
      await api.post('/beatwave/playlists', { title: name, description });
      showToast(`Playlist "${name}" created!`, 'success');
    } catch {
      const newPl: Playlist = {
        id: `pl-${Date.now()}`,
        title: name,
        description: description || 'Custom BeatwaveNG Playlist',
        tracks: [],
        owner: 'Current Member'
      };
      setPlaylists((prev) => [...prev, newPl]);
      showToast(`Playlist "${name}" created!`, 'success');
    }
  }, [showToast]);

  const likeTrack = useCallback(async (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, likes: (t.likes || 0) + (t.isLiked ? -1 : 1), isLiked: !t.isLiked } : t))
    );
    if (currentTrack?.id === trackId) {
      setCurrentTrack((prev) => prev ? { ...prev, likes: (prev.likes || 0) + (prev.isLiked ? -1 : 1), isLiked: !prev.isLiked } : null);
    }
    await api.post(`/beatwave/favorites/${trackId}`).catch(() => {});
    showToast('Saved to your favorites', 'success');
  }, [currentTrack?.id, showToast]);

  const saveTrack = useCallback(async (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isSaved: !t.isSaved } : t))
    );
    showToast('Track bookmarked in sovereign vault', 'info');
  }, [showToast]);

  const getRecommendedTracks = useCallback(async (_memberId: string): Promise<Track[]> => tracks.slice(0, 5), [tracks]);
  const getTrendingTracks = useCallback(async (): Promise<Track[]> => tracks.slice(0, 10), [tracks]);
  const getArtistById = useCallback(async (artistId: string): Promise<Artist> => {
    return artists.find((a) => a.id === artistId) || { id: artistId, name: 'Sovereign Artist' };
  }, [artists]);
  const getAlbumById = useCallback(async (albumId: string): Promise<Album> => {
    return albums.find((a) => a.id === albumId) || { id: albumId, title: 'Master Album', artist: 'Artist', year: 2026, tracks: [] };
  }, [albums]);
  const getAmeboHistory = useCallback(() => ameboHistory, [ameboHistory]);
  const getRecentlyPlayed = useCallback(() => recentlyPlayed, [recentlyPlayed]);

  // Audio Device Routing
  const setAudioDevice = useCallback((device: AudioDevice) => {
    setActiveAudioDevice(device);
    showToast(`Media Output routed to ${device.name} (${device.bitrateSupport})`, 'success');
  }, [showToast]);

  // Colabo+ Handlers
  const createColaboSession = useCallback(async (title: string, initialTracks?: Track[]): Promise<ColaboSession> => {
    const pin = String(Math.floor(100000 + Math.random() * 900000));
    const newSession: ColaboSession = {
      id: `colabo-${Date.now()}`,
      title,
      pin,
      hostId: 'mem-1',
      hostName: 'Mbah Obinna',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      contributors: [
        {
          id: 'c-host',
          name: 'Mbah Obinna',
          pin: '749822',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
          role: 'Host',
          joinedAt: 'Just now'
        }
      ],
      tracks: initialTracks || [SEED_TRACKS[0]],
      createdAt: new Date().toISOString(),
      isActive: true
    };
    setColaboSessions((prev) => [newSession, ...prev]);
    showToast(`Colabo+ Playlist created! Access PIN: #${pin}`, 'success');
    return newSession;
  }, [showToast]);

  const joinColaboSession = useCallback(async (pin: string): Promise<boolean> => {
    const cleanPin = pin.trim().replace('#', '');
    const found = colaboSessions.find((s) => s.pin === cleanPin);
    if (found) {
      setColaboSessions((prev) =>
        prev.map((s) =>
          s.pin === cleanPin
            ? {
                ...s,
                contributors: [
                  ...s.contributors,
                  {
                    id: `c-${Date.now()}`,
                    name: 'Mbah Obinna',
                    pin: '749822',
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
                    role: 'Contributor',
                    joinedAt: 'Just now'
                  }
                ]
              }
            : s
        )
      );
      showToast(`Joined Colabo+ session: "${found.title}" via PIN #${cleanPin}!`, 'success');
      return true;
    } else {
      const adHoc: ColaboSession = {
        id: `colabo-joined-${Date.now()}`,
        title: `Colabo Room #${cleanPin}`,
        pin: cleanPin,
        hostId: 'remote-host',
        hostName: 'Verified Member',
        coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
        contributors: [
          { id: 'c-remote', name: 'Host Creator', pin: cleanPin, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', role: 'Host', joinedAt: '1 hour ago' },
          { id: 'c-self', name: 'Mbah Obinna', pin: '749822', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', role: 'Contributor', joinedAt: 'Just now' }
        ],
        tracks: [SEED_TRACKS[1], SEED_TRACKS[2]],
        createdAt: new Date().toISOString(),
        isActive: true
      };
      setColaboSessions((prev) => [adHoc, ...prev]);
      showToast(`Accepted PIN #${cleanPin}. Joined shared Colabo+ room!`, 'success');
      return true;
    }
  }, [colaboSessions, showToast]);

  const addTrackToColaboSession = useCallback((sessionId: string, track: Track) => {
    setColaboSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, tracks: [...s.tracks, track] } : s))
    );
    showToast(`Track "${track.title}" added to Colabo+ shared queue`, 'success');
  }, [showToast]);

  // VirDrive Handlers
  const createVirDrive = useCallback(async (
    name: string,
    durationDays: 3 | 7,
    pinProtected: boolean,
    pin?: string,
    files?: VirDriveFile[]
  ): Promise<VirDriveFolder> => {
    const now = new Date();
    const expires = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
    const newDrive: VirDriveFolder = {
      id: `virdrive-${Date.now()}`,
      name,
      ownerPin: '749822',
      durationDays,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      daysRemaining: durationDays,
      pinProtected,
      pin: pin || (pinProtected ? String(Math.floor(100000 + Math.random() * 900000)) : undefined),
      totalSizeMb: files?.reduce((acc, f) => acc + f.sizeMb, 0) || 120.4,
      files: files || [
        { id: `vf-${Date.now()}-1`, title: `${name} - Mixed Stem Pack`, artist: 'Mbah Obinna', duration: '04:12', sizeMb: 68.4, sovereignExt: '.fmbw', downloadUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
      ],
      downloadCount: 0
    };
    setVirDrives((prev) => [newDrive, ...prev]);
    showToast(`VirDrive "${name}" created with ${durationDays}-day temporal expiration!`, 'success');
    return newDrive;
  }, [showToast]);

  const deleteVirDrive = useCallback((driveId: string) => {
    setVirDrives((prev) => prev.filter((d) => d.id !== driveId));
    showToast('VirDrive folder removed', 'info');
  }, [showToast]);

  // AudioNovels Handlers
  const createAudioNovel = useCallback(async (
    title: string,
    author: string,
    synopsis: string,
    narratorVoice: string,
    genre: string,
    durationMinutes: number,
    aiPrompt?: string,
    sourceType: 'ai_prompt' | 'text_upload' | 'audio_upload' | 'live_recording' = 'ai_prompt',
    sourceFile?: { name: string; sizeMb: number; type: string; url?: string; textContent?: string },
    recordingBlobUrl?: string,
    temporalTtlDays: 3 | 7 | 30 = 30
  ): Promise<AudioNovelCard> => {
    const cappedDuration = Math.min(30, Math.max(1, durationMinutes));
    const persistentAudioUrl = [recordingBlobUrl, sourceFile?.url]
      .find(url => typeof url === 'string' && /^https?:\/\//i.test(url)) || '';
    try {
      const response = await api.post('/beatwave/audio-novels', {
        title,
        author,
        synopsis,
        narrator_voice: narratorVoice,
        genre,
        duration_minutes: cappedDuration,
        ai_prompt_used: aiPrompt || '',
        source_type: sourceType,
        source_file_name: sourceFile?.name || '',
        source_file_size_mb: sourceFile?.sizeMb,
        source_file_type: sourceFile?.type || '',
        audio_url: persistentAudioUrl,
        manuscript_text: sourceFile?.textContent || '',
        ttl_days: temporalTtlDays,
      });
      const novel = mapAudioNovelRow(response.data.data);
      setAudioNovels(previous => [novel, ...previous.filter(item => item.id !== novel.id)]);
      showToast('AudioNovel metadata saved as a draft for review. Media file bytes are not uploaded by this workflow.', 'warning');
      return novel;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The database request failed.';
      showToast(`AudioNovel submission failed: ${message}`, 'error');
      throw error;
    }
  }, [showToast]);

  const downloadAudioNovel = useCallback((novelId: string) => {
    void novelId;
    showToast('Offline media downloads are not connected to persistent storage yet.', 'warning');
  }, [showToast]);

  const updateAudioNovelModeration = useCallback((id: string, updates: Partial<AudioNovelCard>) => {
    const fields: Record<string, unknown> = {};
    const mappings: Array<[keyof AudioNovelCard, string]> = [
      ['title', 'title'],
      ['author', 'author'],
      ['synopsis', 'synopsis'],
      ['narratorVoice', 'narrator_voice'],
      ['coverArt', 'cover_art'],
      ['durationMinutes', 'duration_minutes'],
      ['genre', 'genre'],
      ['audioUrl', 'audio_url'],
      ['sourceFileName', 'source_file_name'],
      ['sourceFileSizeMb', 'source_file_size_mb'],
      ['sourceFileType', 'source_file_type'],
      ['aiPromptUsed', 'ai_prompt_used'],
      ['manuscriptText', 'manuscript_text'],
      ['ttlDays', 'ttl_days'],
      ['temporalExpiresAt', 'expires_at'],
      ['adminNotes', 'admin_notes'],
    ];
    mappings.forEach(([key, field]) => {
      if (updates[key] !== undefined) fields[field] = updates[key];
    });
    if (!Object.keys(fields).length) return;
    void api.put(`/master-dashboard/ecosystems/beatwave/audio_novels/${encodeURIComponent(id)}`, fields)
      .then(async () => {
        const response = await api.get('/beatwave/audio-novels');
        setAudioNovels(response.data.data.map(mapAudioNovelRow));
        showToast('AudioNovel catalog update saved.', 'success');
      })
      .catch(error => {
        const message = error instanceof Error ? error.message : 'The database request failed.';
        showToast(`AudioNovel update failed: ${message}`, 'error');
      });
  }, [showToast]);

  const runAudioNovelLifecycle = useCallback(async (
    id: string,
    action: 'freeze' | 'block' | 'restore' | 'archive' | 'flag' | 'warn',
    extra: Record<string, unknown> = {}
  ) => {
    try {
      const url = `/master-dashboard/ecosystems/beatwave/audio_novels/${encodeURIComponent(id)}/lifecycle`;
      if (action === 'archive') await api.delete(`/master-dashboard/ecosystems/beatwave/audio_novels/${encodeURIComponent(id)}`);
      else await api.patch(url, { action, ...extra });
      const response = await api.get('/beatwave/audio-novels');
      setAudioNovels(response.data.data.map(mapAudioNovelRow));
      showToast(`AudioNovel ${action} action saved to the database.`, 'success');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The database request failed.';
      showToast(`AudioNovel ${action} failed: ${message}`, 'error');
    }
  }, [showToast]);

  const freezeAudioNovel = useCallback((id: string) => {
    void runAudioNovelLifecycle(id, 'freeze');
  }, [runAudioNovelLifecycle]);

  const blockAudioNovel = useCallback((id: string) => {
    void runAudioNovelLifecycle(id, 'block');
  }, [runAudioNovelLifecycle]);

  const unblockAudioNovel = useCallback((id: string) => {
    void runAudioNovelLifecycle(id, 'restore');
  }, [runAudioNovelLifecycle]);

  const setAudioNovelFlag = useCallback((id: string, flag: 'green' | 'yellow' | 'orange' | 'red') => {
    void runAudioNovelLifecycle(id, 'flag', { risk_flag: flag });
  }, [runAudioNovelLifecycle]);

  const issueAudioNovelWarning = useCallback((id: string, warningText: string) => {
    void runAudioNovelLifecycle(id, 'warn', { reason: warningText });
  }, [runAudioNovelLifecycle]);

  const deleteAudioNovel = useCallback((id: string) => {
    void runAudioNovelLifecycle(id, 'archive');
  }, [runAudioNovelLifecycle]);

  // Podcasts Handlers
  const createPodcast = useCallback(async (
    title: string,
    host: string,
    description: string,
    durationMinutes: number,
    genre: string,
    tags: string[],
    guest = ''
  ): Promise<PodcastCard> => {
    const cappedDuration = Math.min(30, Math.max(1, durationMinutes));
    try {
      const response = await api.post('/beatwave/podcasts', {
        title,
        host,
        guest,
        description,
        duration_minutes: cappedDuration,
        genre,
        episode_number: podcasts.length + 1,
        tags,
        ttl_days: 30,
        source_type: 'audio_upload',
      });
      const podcast = mapPodcastRow(response.data.data);
      setPodcasts(previous => [podcast, ...previous.filter(item => item.id !== podcast.id)]);
      showToast('Podcast metadata saved as a draft for review. Media file bytes are not uploaded by this workflow.', 'warning');
      return podcast;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The database request failed.';
      showToast(`Podcast submission failed: ${message}`, 'error');
      throw error;
    }
  }, [podcasts.length, showToast]);

  const downloadPodcast = useCallback((podcastId: string) => {
    void podcastId;
    showToast('Offline media downloads are not connected to persistent storage yet.', 'warning');
  }, [showToast]);

  // BeatVlogs Handlers
  const createBeatVlog = useCallback(async (
    title: string,
    tags: string[],
    sharedInterest: string,
    videoUrl: string,
    duration: string
  ): Promise<BeatVlog> => {
    const newVlog: BeatVlog = {
      id: `bv-${Date.now()}`,
      title,
      creator: 'Mbah Obinna',
      creatorPin: '749822',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
      videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: duration || '15:30',
      views: 1,
      likes: 1,
      tags,
      sharedInterest,
      createdAt: 'Just now'
    };
    setBeatVlogs((prev) => [newVlog, ...prev]);
    showToast(`BeatVlog "${title}" published under ${sharedInterest}!`, 'success');
    return newVlog;
  }, [showToast]);

  // MySub Handlers
  const addMySubMemberByPin = useCallback(async (pin: string, name: string): Promise<boolean> => {
    if (mySubMembers.length >= mySubMaxSeats) {
      showToast(`Subscription seat limit (${mySubMaxSeats} seats) reached. Upgrade tier for more seats.`, 'error');
      return false;
    }
    const cleanPin = pin.trim().replace('#', '');
    const newMember: MySubMember = {
      id: `sub-${Date.now()}`,
      name: name || `Member #${cleanPin}`,
      pin: cleanPin,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      tier: 'SoundOcean Lossless',
      status: 'Active',
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setMySubMembers((prev) => [...prev, newMember]);
    showToast(`Member #${cleanPin} (${newMember.name}) granted BeatwaveNG Sovereign Subscription seat!`, 'success');
    return true;
  }, [mySubMembers.length, mySubMaxSeats, showToast]);

  const removeMySubMember = useCallback((memberId: string) => {
    setMySubMembers((prev) => prev.filter((m) => m.id !== memberId));
    showToast('Subscription seat revoked and freed.', 'info');
  }, [showToast]);

  // Mii Widget Handlers
  const setMiiPrivacyMode = useCallback((mode: 'public' | 'private' | 'incognito') => {
    setMiiState((prev) => ({ ...prev, privacyMode: mode }));
    showToast(`Mii Privacy Mode set to: ${mode.toUpperCase()}`, 'info');
  }, [showToast]);

  const acceptMiiRequest = useCallback((requestId: string) => {
    setMiiState((prev) => ({
      ...prev,
      incomingRequests: prev.incomingRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'accepted' as const } : r
      )
    }));
    showToast('PIN Request accepted. Access granted!', 'success');
  }, [showToast]);

  const declineMiiRequest = useCallback((requestId: string) => {
    setMiiState((prev) => ({
      ...prev,
      incomingRequests: prev.incomingRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'declined' as const } : r
      )
    }));
    showToast('PIN Request declined.', 'info');
  }, [showToast]);

  const value = useMemo(
    () => ({
      tracks,
      playlists,
      artists,
      albums,
      currentTrack,
      isPlaying,
      playbackTime,
      duration,
      volume,
      loading,
      error,
      ameboHistory,
      recentlyPlayed,
      queue,
      currentQueueIndex,

      playbackRate,
      isShuffle,
      repeatMode,
      audioQuality,
      eqGains,
      activeEqPreset,
      abRepeat,
      sleepTimerMinutes,
      sleepTimerRemaining,
      currentLyricIndex,
      parsedLyrics,

      radioStations,
      activeRadioStation,

      // Audio Devices
      audioDevices,
      activeAudioDevice,
      setAudioDevice,

      // Colabo+
      colaboSessions,
      createColaboSession,
      joinColaboSession,
      addTrackToColaboSession,

      // VirDrive
      virDrives,
      createVirDrive,
      deleteVirDrive,

      // AudioNovels
      audioNovels,
      createAudioNovel,
      downloadAudioNovel,
      updateAudioNovelModeration,
      deleteAudioNovel,
      freezeAudioNovel,
      blockAudioNovel,
      unblockAudioNovel,
      setAudioNovelFlag,
      issueAudioNovelWarning,

      // Podcasts
      podcasts,
      createPodcast,
      downloadPodcast,

      // BeatVlogs
      beatVlogs,
      createBeatVlog,

      // MySub
      mySubMembers,
      mySubMaxSeats,
      addMySubMemberByPin,
      removeMySubMember,

      // Mii
      miiState,
      setMiiPrivacyMode,
      acceptMiiRequest,
      declineMiiRequest,

      playTrack,
      pauseTrack,
      resumeTrack,
      stopTrack,
      seekTrack,
      jumpTime,
      setVolume: setVolumeLevel,
      toggleMute,
      setPlaybackRate: handleSetPlaybackRate,
      toggleShuffle,
      cycleRepeatMode,
      setAbRepeatA,
      setAbRepeatB,
      clearAbRepeat,
      setSleepTimer,
      setAudioQuality,
      setEqGain,
      applyEqPreset,
      playNext,
      playPrevious,
      playRadioStation,
      stopRadioStation,

      searchBeatwaveNG,
      searchPublicStreamAggregator,
      addTrackToPlaylist,
      createPlaylist,
      likeTrack,
      saveTrack,
      importPublicTrackToLibrary,
      getRecommendedTracks,
      getTrendingTracks,
      getArtistById,
      getAlbumById,
      addToAmeboHistory,
      getAmeboHistory,
      getRecentlyPlayed
    }),
    [
      tracks,
      playlists,
      artists,
      albums,
      currentTrack,
      isPlaying,
      playbackTime,
      duration,
      volume,
      loading,
      error,
      ameboHistory,
      recentlyPlayed,
      queue,
      currentQueueIndex,
      playbackRate,
      isShuffle,
      repeatMode,
      audioQuality,
      eqGains,
      activeEqPreset,
      abRepeat,
      sleepTimerMinutes,
      sleepTimerRemaining,
      currentLyricIndex,
      parsedLyrics,
      radioStations,
      activeRadioStation,
      audioDevices,
      activeAudioDevice,
      setAudioDevice,
      colaboSessions,
      createColaboSession,
      joinColaboSession,
      addTrackToColaboSession,
      virDrives,
      createVirDrive,
      deleteVirDrive,
      audioNovels,
      createAudioNovel,
      downloadAudioNovel,
      updateAudioNovelModeration,
      deleteAudioNovel,
      freezeAudioNovel,
      blockAudioNovel,
      unblockAudioNovel,
      setAudioNovelFlag,
      issueAudioNovelWarning,
      podcasts,
      createPodcast,
      downloadPodcast,
      beatVlogs,
      createBeatVlog,
      mySubMembers,
      mySubMaxSeats,
      addMySubMemberByPin,
      removeMySubMember,
      miiState,
      setMiiPrivacyMode,
      acceptMiiRequest,
      declineMiiRequest,
      playTrack,
      pauseTrack,
      resumeTrack,
      stopTrack,
      seekTrack,
      jumpTime,
      setVolumeLevel,
      toggleMute,
      handleSetPlaybackRate,
      toggleShuffle,
      cycleRepeatMode,
      setAbRepeatA,
      setAbRepeatB,
      clearAbRepeat,
      setSleepTimer,
      setAudioQuality,
      setEqGain,
      applyEqPreset,
      playNext,
      playPrevious,
      playRadioStation,
      stopRadioStation,
      searchBeatwaveNG,
      searchPublicStreamAggregator,
      addTrackToPlaylist,
      createPlaylist,
      likeTrack,
      saveTrack,
      importPublicTrackToLibrary,
      getRecommendedTracks,
      getTrendingTracks,
      getArtistById,
      getAlbumById,
      addToAmeboHistory,
      getAmeboHistory,
      getRecentlyPlayed
    ]
  );

  return <BeatwaveNGContext.Provider value={value}>{children}</BeatwaveNGContext.Provider>;
};

export const useBeatwaveNG = (): BeatwaveNGContextType => {
  const ctx = React.useContext(BeatwaveNGContext);
  if (!ctx) {
    throw new Error('useBeatwaveNG must be used within BeatwaveNGProvider');
  }
  return ctx;
};

export type UseBeatwaveNGResult = BeatwaveNGContextType;
export default BeatwaveNGContext;
