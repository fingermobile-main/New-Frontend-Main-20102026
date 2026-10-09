/*
 * FingerMobile Protocol™ - BeatwaveNG Sovereign Music & Audio Platform
 * Apple Music Desktop Interface Overhaul with LushPressies Emerald Theme (#10b981)
 * SoundRiver & SoundOcean Platform Tiers, 10-Band Equalizer, LRC Lyrics,
 * Live Taste Radio Stations, and Public Stream Track Aggregator across 70+ Genres
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Play, Pause, Search, Music, Disc, Radio,
  Sparkles, Clock, Plus, Globe,
  Headphones, Flame, Waves, Trophy,
  Compass, FolderHeart
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import {
  useBeatwaveNG,
  Track,
  CURATED_70_GENRES
} from '../contexts/BeatwaveNGContext';
import BeatwaveNGPlayer from '../components/BeatwaveNGPlayer';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatTime } from '../utils/timeUtils';

type NavigationTab =
  | 'listen-now'
  | 'browse'
  | 'radio'
  | 'soundriver'
  | 'soundocean'
  | 'aggregator'
  | 'library'
  | 'history';

const BeatwaveNGPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const {
    tracks,
    currentTrack,
    isPlaying,
    radioStations,
    activeRadioStation,
    audioQuality,
    playTrack,
    pauseTrack,
    resumeTrack,
    playRadioStation,
    stopRadioStation,
    searchPublicStreamAggregator,
    importPublicTrackToLibrary,
    createPlaylist,
    setAudioQuality
  } = useBeatwaveNG();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('listen-now');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAggregatorGenre, setSelectedAggregatorGenre] = useState<string>('Afrobeats');
  const [aggregatedTracks, setAggregatedTracks] = useState<Track[]>([]);
  const [isSearchingAggregator, setIsSearchingAggregator] = useState(false);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  // Upload Form State
  const [uploadTier, setUploadTier] = useState<'SoundRiver' | 'SoundOcean'>('SoundRiver');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadArtist, setUploadArtist] = useState('');
  const [uploadGenre, setUploadGenre] = useState('Afrobeats');
  const [uploadLyrics, setUploadLyrics] = useState('');
  const [isUploadingTrack, setIsUploadingTrack] = useState(false);

  // Initial Aggregator Fetch
  useEffect(() => {
    let isMounted = true;
    const loadAggregator = async () => {
      setIsSearchingAggregator(true);
      try {
        const results = await searchPublicStreamAggregator(searchQuery, selectedAggregatorGenre);
        if (isMounted) {
          setAggregatedTracks(results);
        }
      } finally {
        if (isMounted) {
          setIsSearchingAggregator(false);
        }
      }
    };
    loadAggregator();
    return () => { isMounted = false; };
  }, [selectedAggregatorGenre, searchQuery, searchPublicStreamAggregator]);

  // Featured Hero Carousel Tracks (Apple Music Style)
  const featuredHeroTracks = useMemo(() => {
    return tracks.slice(0, 3);
  }, [tracks]);

  // SoundRiver vs SoundOcean Tracks
  const soundRiverTracks = useMemo(() => {
    return tracks.filter((t) => t.tier === 'SoundRiver' || !t.tier);
  }, [tracks]);

  const soundOceanTracks = useMemo(() => {
    return tracks.filter((t) => t.tier === 'SoundOcean');
  }, [tracks]);

  // Filtered tracks for the search bar
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return tracks;
    const q = searchQuery.toLowerCase();
    return tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        (t.genre && t.genre.toLowerCase().includes(q))
    );
  }, [tracks, searchQuery]);

  // Handle Play Single Track
  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pauseTrack();
      } else {
        resumeTrack();
      }
      return;
    }
    playTrack(track, tracks);
  };

  // Handle Creator Upload Submit
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadArtist.trim()) {
      showToast('Please provide track title and artist name', 'error');
      return;
    }

    setIsUploadingTrack(true);
    try {
      const newTrack: Track = {
        id: `track-ugc-${Date.now()}`,
        title: uploadTitle.trim(),
        artist: uploadArtist.trim(),
        album: `${uploadArtist.trim()} Debut Session`,
        duration: 210,
        genre: uploadGenre,
        year: 2026,
        coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        tier: uploadTier,
        audioQuality: uploadTier === 'SoundOcean' ? 'Lossless' : 'Hi-Res',
        bitrate: uploadTier === 'SoundOcean' ? '1411 kbps FLAC Lossless 24-bit' : '320 kbps AAC',
        lyrics: uploadLyrics.trim() || undefined,
        plays: 1,
        likes: 0
      };

      await importPublicTrackToLibrary(newTrack, uploadTier);
      setShowUploadModal(false);
      setUploadTitle('');
      setUploadArtist('');
      setUploadLyrics('');
      showToast(`Track submitted to ${uploadTier}! Master audio registered with 80% creator rights.`, 'success');
    } finally {
      setIsUploadingTrack(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex pb-28">
      {/* ======================================================== */}
      {/* APPLE MUSIC DESKTOP SIDEBAR NAVIGATION */}
      {/* ======================================================== */}
      <aside
        aria-label="Sidebar Navigation"
        className="w-64 bg-slate-950/90 border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 hidden md:flex sticky top-0 h-screen select-none"
      >
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-black shadow-lg shadow-emerald-500/30">
              <Waves className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>Beatwave</span>
                <span className="text-emerald-400 font-bold">NG</span>
              </h1>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Apple Music • LushPressies
              </p>
            </div>
          </div>

          {/* Quick Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search library & 70+ genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Navigation Menu Groups */}
          <div className="space-y-5 text-xs font-semibold">
            {/* Section 1: Discover */}
            <div>
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block px-2 mb-2">
                Discover
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('listen-now')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'listen-now'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Compass className="w-4 h-4 text-emerald-400" />
                  Listen Now
                </button>

                <button
                  onClick={() => setActiveTab('browse')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'browse'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-400" />
                  Browse & Charts
                </button>

                <button
                  onClick={() => setActiveTab('radio')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'radio'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Radio className="w-4 h-4 text-emerald-400" />
                  Live Radio Stations
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </button>
              </nav>
            </div>

            {/* Section 2: Platform Tiers & Aggregator */}
            <div>
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block px-2 mb-2">
                Tiers & Aggregator
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('soundriver')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'soundriver'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Waves className="w-4 h-4 text-sky-400" />
                  🌊 SoundRiver (Free Tier)
                </button>

                <button
                  onClick={() => setActiveTab('soundocean')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'soundocean'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  💎 SoundOcean (Lossless)
                </button>

                <button
                  onClick={() => setActiveTab('aggregator')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'aggregator'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Disc className="w-4 h-4 text-amber-400" />
                  📡 70+ Genre Aggregator
                </button>
              </nav>
            </div>

            {/* Section 3: Library */}
            <div>
              <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider block px-2 mb-2">
                Library
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('library')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'library'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <FolderHeart className="w-4 h-4 text-pink-400" />
                  Favorites & Playlists
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    activeTab === 'history'
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  Recently Played
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Creator Upload CTA */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all transform hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            Upload Music / Podcast
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 space-y-8 overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Mobile Tab Selector */}
            <div className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as NavigationTab)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                <option value="listen-now">🎵 Listen Now</option>
                <option value="browse">🌐 Browse</option>
                <option value="radio">📻 Live Radio</option>
                <option value="soundriver">🌊 SoundRiver</option>
                <option value="soundocean">💎 SoundOcean</option>
                <option value="aggregator">📡 70+ Genre Aggregator</option>
                <option value="library">📁 Library</option>
              </select>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {activeTab === 'listen-now' && 'Listen Now'}
                {activeTab === 'browse' && 'Browse & Top Charts'}
                {activeTab === 'radio' && 'Live Radio Stations'}
                {activeTab === 'soundriver' && 'SoundRiver Creator Stream'}
                {activeTab === 'soundocean' && 'SoundOcean Lossless Masters'}
                {activeTab === 'aggregator' && 'Public Stream Aggregator (70+ Genres)'}
                {activeTab === 'library' && 'Your Sovereign Library'}
                {activeTab === 'history' && 'Listening History & Amebo'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Youth-driven, artist-first streaming protocol with lossless audio and creator sovereignty
              </p>
            </div>
          </div>

          {/* Right Badges & Quality Selector */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs font-mono">
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={audioQuality}
                onChange={(e) => setAudioQuality(e.target.value as any)}
                className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Lossless" className="bg-slate-900">Lossless 24-bit/192kHz</option>
                <option value="Hi-Res" className="bg-slate-900">Hi-Res 320kbps</option>
                <option value="Standard" className="bg-slate-900">Standard 128kbps</option>
              </select>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs font-mono font-bold text-amber-300">
              🪙 {(ficBalance ?? 0).toLocaleString()} FIC
            </div>
          </div>
        </header>

        {/* ======================================================== */}
        {/* VIEW 1: LISTEN NOW (APPLE MUSIC HERO CAROUSEL & FLOW MIXES) */}
        {/* ======================================================== */}
        {activeTab === 'listen-now' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Apple Music Oversized Hero Carousel */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-3">
                Featured Spotlights & Master Exclusives
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredHeroTracks.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handlePlay(item)}
                    className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-500 border border-slate-800 hover:border-emerald-500/60"
                  >
                    <img
                      src={item.coverArt}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-wider text-emerald-300 border border-emerald-500/40">
                        {item.tier === 'SoundOcean' ? '💎 SoundOcean Exclusive' : '🌊 SoundRiver Spotlight'}
                      </span>
                      <span className="text-xs text-white/80 font-mono font-semibold">
                        #{idx + 1} Trending
                      </span>
                    </div>

                    {/* Bottom Info & Play CTA */}
                    <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                      <div className="space-y-1 max-w-[70%]">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                          {item.genre}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white leading-tight line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-300 font-medium">{item.artist}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(item);
                        }}
                        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center shadow-xl shadow-emerald-500/50 transition-transform group-hover:scale-110 active:scale-95"
                      >
                        {currentTrack?.id === item.id && isPlaying ? (
                          <Pause size={24} fill="black" />
                        ) : (
                          <Play size={24} fill="black" className="ml-1" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Flow Mixes (Made For You) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">Daily Flow Mixes</h3>
                  <p className="text-xs text-slate-400">Personalized algorithmic playlists tailored to your current frequency</p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold cursor-pointer hover:underline">
                  See All Mixes
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { title: 'Afrobeats High Energy', desc: 'Lagos & Accra fire bangers', bg: 'from-emerald-900/60 to-slate-900', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500' },
                  { title: 'Amapiano Log Drum Pulse', desc: 'Pretoria heavy baselines', bg: 'from-amber-900/60 to-slate-900', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500' },
                  { title: 'Late Night Lagos Chill', desc: 'Smooth afro-fusion & neo-soul', bg: 'from-indigo-900/60 to-slate-900', img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500' },
                  { title: 'Global Street Drill', desc: 'Hard hitting cadence & 808s', bg: 'from-red-900/60 to-slate-900', img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500' }
                ].map((mix, idx) => (
                  <div
                    key={idx}
                    onClick={() => handlePlay(tracks[idx % tracks.length])}
                    className="group p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all shadow-lg"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 mb-3">
                      <img src={mix.img} alt={mix.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg">
                          <Play size={20} fill="black" className="ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-white truncate group-hover:text-emerald-300 transition-colors">
                      {mix.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{mix.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Apple Music Oversized Album & Track Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-white">Latest Master Catalog Recordings</h3>
                  <p className="text-xs text-slate-400">Stream in sovereign Lossless 24-bit audio</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                {(searchQuery.trim() ? searchResults : tracks).map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handlePlay(track)}
                    className="group flex flex-col p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all cursor-pointer shadow-md"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 mb-3">
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Tier Badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                          track.tier === 'SoundOcean'
                            ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
                            : 'bg-sky-950/90 text-sky-300 border border-sky-500/40'
                        }`}>
                          {track.tier === 'SoundOcean' ? '💎 Ocean' : '🌊 River'}
                        </span>
                      </div>

                      {/* Hover Play Button */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/40 transform group-hover:scale-110 transition-transform">
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause size={20} fill="black" />
                          ) : (
                            <Play size={20} fill="black" className="ml-0.5" />
                          )}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-emerald-300 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{track.artist}</p>

                    <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{track.genre}</span>
                      <span>{formatTime(track.duration)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: BROWSE & CHARTS */}
        {/* ======================================================== */}
        {activeTab === 'browse' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Top Charts Section */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2">
                    <Trophy className="w-3.5 h-3.5" />
                    Top 100 Sovereign Streaming Charts
                  </div>
                  <h3 className="text-2xl font-black text-white">BeatwaveNG Official Nigerian Top 100</h3>
                </div>
                <span className="text-xs text-slate-400">Updated Hourly</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tracks.map((track, idx) => (
                  <div
                    key={track.id}
                    onClick={() => handlePlay(track)}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer transition-all"
                  >
                    <span className="w-6 text-center font-black text-lg text-emerald-400">
                      {idx + 1}
                    </span>
                    <img
                      src={track.coverArt}
                      alt={track.title}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-white truncate">{track.title}</h4>
                      <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                    </div>
                    <div className="text-right font-mono text-xs text-slate-400">
                      <div>{(track.plays || 12000).toLocaleString()} streams</div>
                      <span className="text-[10px] text-emerald-400 font-bold">{track.genre}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: LIVE TASTE RADIO STATIONS */}
        {/* ======================================================== */}
        {activeTab === 'radio' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30">
              <h3 className="text-2xl font-black text-white flex items-center gap-2">
                <Radio className="w-6 h-6 text-emerald-400" />
                Taste-Based Live Radio Streaming Stations
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Tune into curated sovereign radio stations broadcasting continuous Afrobeats, Amapiano, Global Hip-Hop, and Lofi soundscapes 24/7 with zero algorithmic interruption.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {radioStations.map((st) => {
                const isActive = activeRadioStation?.id === st.id;

                return (
                  <div
                    key={st.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      isActive
                        ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500 shadow-2xl shadow-emerald-500/20'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-4">
                      <img src={st.coverArt} alt={st.name} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-black text-emerald-300 border border-emerald-500/40">
                        {st.frequency}
                      </div>

                      {isActive && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-black font-bold text-[10px]">
                          <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                          LIVE BROADCAST
                        </div>
                      )}
                    </div>

                    <h4 className="font-black text-lg text-white">{st.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                      {st.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] font-mono text-slate-400">
                        <span>Curated by: </span>
                        <strong className="text-white">{st.dj}</strong>
                      </div>

                      <button
                        onClick={() => {
                          if (isActive) {
                            stopRadioStation();
                          } else {
                            playRadioStation(st);
                          }
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md ${
                          isActive
                            ? 'bg-red-600 text-white hover:bg-red-500'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                        }`}
                      >
                        {isActive ? <Pause size={14} /> : <Play size={14} />}
                        {isActive ? 'Stop Broadcast' : 'Tune In Live'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 4: SOUNDRIVER & SOUNDOCEAN TIERS */}
        {/* ======================================================== */}
        {(activeTab === 'soundriver' || activeTab === 'soundocean') && (
          <div className="space-y-8 animate-fadeIn">
            {/* Tiers Comparison Hero */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SoundRiver Box */}
              <div className={`p-6 rounded-3xl border transition-all ${
                activeTab === 'soundriver'
                  ? 'bg-gradient-to-br from-sky-950/70 via-slate-900 to-slate-900 border-sky-500 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase mb-2">
                  <Waves size={16} />
                  SoundRiver Tier
                </div>
                <h3 className="text-2xl font-black text-white">Free Youth-Driven Creator Stream</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Open publishing portal for emergent indie artists, podcasters, sound designers, and youth creators. Upload unlimited music with zero barriers and reach millions globally.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2 py-1 rounded bg-slate-950 text-sky-300 border border-sky-500/30">Free Streaming</span>
                  <span className="px-2 py-1 rounded bg-slate-950 text-sky-300 border border-sky-500/30">Podcasts & Talk</span>
                  <span className="px-2 py-1 rounded bg-slate-950 text-sky-300 border border-sky-500/30">320kbps High Quality</span>
                </div>
              </div>

              {/* SoundOcean Box */}
              <div className={`p-6 rounded-3xl border transition-all ${
                activeTab === 'soundocean'
                  ? 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border-emerald-500 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800'
              }`}>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-2">
                  <Sparkles size={16} />
                  SoundOcean Sovereign Tier
                </div>
                <h3 className="text-2xl font-black text-white">Lossless Studio Masters & Web3 FIC</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Audiophile-grade 24-bit/192kHz FLAC master recordings. Sovereign Web3 smart contracts enforce direct fan micro-tipping, immutable creator royalties, and verified artist seals.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono">
                  <span className="px-2 py-1 rounded bg-slate-950 text-emerald-300 border border-emerald-500/30">24-bit/192kHz FLAC</span>
                  <span className="px-2 py-1 rounded bg-slate-950 text-emerald-300 border border-emerald-500/30">80% Direct Royalty</span>
                  <span className="px-2 py-1 rounded bg-slate-950 text-emerald-300 border border-emerald-500/30">Direct Fan Tipping</span>
                </div>
              </div>
            </div>

            {/* Tracks for Selected Tier */}
            <div className="space-y-4">
              <h4 className="font-bold text-lg text-white">
                {activeTab === 'soundriver' ? 'SoundRiver Open Catalog' : 'SoundOcean Studio Master Catalog'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(activeTab === 'soundriver' ? soundRiverTracks : soundOceanTracks).map((track) => (
                  <div
                    key={track.id}
                    onClick={() => handlePlay(track)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all"
                  >
                    <img src={track.coverArt} alt={track.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-sm text-white truncate">{track.title}</h5>
                      <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                      <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                        {track.bitrate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlay(track);
                        }}
                        className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        {currentTrack?.id === track.id && isPlaying ? <Pause size={16} /> : <Play size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 5: PUBLIC STREAM TRACK AGGREGATOR ACROSS 70+ GENRES */}
        {/* ======================================================== */}
        {activeTab === 'aggregator' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Aggregator Header */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-500/30 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                <Disc className="w-3.5 h-3.5" />
                Public Stream Track Aggregator Across 70+ Global & African Genres
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Free Legal Streaming Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                Search and stream from open music archives, Free Music Archive, Internet Archive, and open public creative commons streams directly within BeatwaveNG. Instantly import any public recording into your SoundRiver stream or sovereign library!
              </p>
            </div>

            {/* 70+ Genres Filter Cloud */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold uppercase tracking-wider text-emerald-400">Select From 70+ Genres:</span>
                <span>Active: <strong className="text-white">{selectedAggregatorGenre}</strong></span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-3 bg-slate-950/80 rounded-2xl border border-slate-800 scrollbar-thin">
                {CURATED_70_GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedAggregatorGenre(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedAggregatorGenre === g
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold shadow-md shadow-emerald-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Aggregated Results Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Public Stream Results for "{selectedAggregatorGenre}"
                </h4>
                <span className="text-xs text-slate-400">{aggregatedTracks.length} recordings pulled</span>
              </div>

              {isSearchingAggregator ? (
                <div className="py-16 text-center">
                  <LoadingSpinner />
                  <p className="text-xs text-slate-400 mt-2 font-mono">Aggregating public streams across open music nodes...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aggregatedTracks.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <img src={item.coverArt} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-sm text-white truncate">{item.title}</h5>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{item.artist}</p>
                          <span className="text-[10px] text-amber-400 font-mono block mt-1">
                            Source: {item.publicSource || 'Open Music Archive'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handlePlay(item)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Play size={14} />
                          Stream Now
                        </button>

                        <button
                          onClick={() => importPublicTrackToLibrary(item, 'SoundRiver')}
                          className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          title="Import into SoundRiver"
                        >
                          <Plus size={14} />
                          Import
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 6: SOVEREIGN LIBRARY & HISTORY */}
        {/* ======================================================== */}
        {(activeTab === 'library' || activeTab === 'history') && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Your Sovereign Audio Collection</h3>
              <button
                onClick={() => setShowCreatePlaylistModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                <Plus size={14} />
                Create Sovereign Playlist
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tracks.slice(0, 8).map((t) => (
                <div
                  key={t.id}
                  onClick={() => handlePlay(t)}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all"
                >
                  <img src={t.coverArt} alt={t.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs sm:text-sm text-white truncate">{t.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">{t.artist}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{formatTime(t.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* FLOATING APPLE MUSIC BOTTOM PLAYER */}
      {/* ======================================================== */}
      <BeatwaveNGPlayer />

      {/* ======================================================== */}
      {/* CREATOR MUSIC & PODCAST UPLOAD MODAL */}
      {/* ======================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Music size={18} />
                Upload Music or Podcast to BeatwaveNG
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3.5">
              {/* Tier Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Distribution Tier:</label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setUploadTier('SoundRiver')}
                    className={`cursor-pointer p-3 rounded-2xl border text-xs transition-all ${
                      uploadTier === 'SoundRiver'
                        ? 'bg-sky-950/60 border-sky-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-sky-400">🌊 SoundRiver</div>
                    <div className="text-[11px] text-slate-400 mt-1">Free open creator tier (unlimited music & podcasts)</div>
                  </div>

                  <div
                    onClick={() => setUploadTier('SoundOcean')}
                    className={`cursor-pointer p-3 rounded-2xl border text-xs transition-all ${
                      uploadTier === 'SoundOcean'
                        ? 'bg-emerald-950/60 border-emerald-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-emerald-400">💎 SoundOcean</div>
                    <div className="text-[11px] text-slate-400 mt-1">Lossless masters with 80% FIC direct creator royalties</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Track / Podcast Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lagos Skyline Vibez"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Artist / Creator Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DJ Pulse & The Afrobeats Band"
                  value={uploadArtist}
                  onChange={(e) => setUploadArtist(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Genre</label>
                <select
                  value={uploadGenre}
                  onChange={(e) => setUploadGenre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {CURATED_70_GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Synchronized Lyrics (LRC Format or Plain Text)
                </label>
                <textarea
                  rows={3}
                  placeholder="[00:15.00]First line of lyrics..."
                  value={uploadLyrics}
                  onChange={(e) => setUploadLyrics(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingTrack}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30"
                >
                  {isUploadingTrack ? <LoadingSpinner /> : 'Publish to BeatwaveNG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* CREATE PLAYLIST MODAL */}
      {/* ======================================================== */}
      {showCreatePlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Create New Sovereign Playlist</h3>
            <input
              type="text"
              placeholder="Playlist Name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <textarea
              rows={2}
              placeholder="Description (Optional)"
              value={newPlaylistDesc}
              onChange={(e) => setNewPlaylistDesc(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreatePlaylistModal(false)}
                className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newPlaylistName.trim()) {
                    createPlaylist(newPlaylistName.trim(), newPlaylistDesc.trim());
                    setShowCreatePlaylistModal(false);
                    setNewPlaylistName('');
                    setNewPlaylistDesc('');
                  }
                }}
                className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeatwaveNGPage;
