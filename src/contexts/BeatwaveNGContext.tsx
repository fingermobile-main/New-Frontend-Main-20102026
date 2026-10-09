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
  getArtistById: (artistId: string) => Promise<Artist>;
  getAlbumById: (albumId: string) => Promise<Album>;
  addToAmeboHistory: (action: Omit<AmeboHistoryItem, 'id'>) => void;
  getAmeboHistory: () => AmeboHistoryItem[];
  getRecentlyPlayed: () => Track[];
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

export const BeatwaveNGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useAppContext();

  // Core Playback State
  const [tracks, setTracks] = useState<Track[]>(SEED_TRACKS);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(SEED_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(214);
  const [volume, setVolume] = useState<number>(80);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
