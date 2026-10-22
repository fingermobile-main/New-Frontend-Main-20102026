/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Mic2,
  Search,
  CheckCircle2,
  ShieldCheck,
  Play,
  Heart,
  Users,
  Radio,
  Disc,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { useBeatwaveNG } from '../../contexts/BeatwaveNGContext';
import { formatTime } from '../../utils/timeUtils';

export interface ArtistProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner: string;
  genre: string;
  bio: string;
  monthlyListeners: number;
  followers: number;
  verified: boolean;
  ninVerified: boolean;
  isFollowing?: boolean;
  topTracks: {
    id: string;
    title: string;
    album: string;
    duration: number;
    plays: number;
    coverArt: string;
    url: string;
  }[];
  albums: {
    id: string;
    title: string;
    year: number;
    coverArt: string;
    trackCount: number;
    quality: string;
  }[];
}

const SEED_ARTISTS: ArtistProfile[] = [
  {
    id: 'art-1',
    name: 'Burna Boy',
    handle: '@burnaboy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
    genre: 'Afro-Fusion / Afrobeats',
    bio: 'Grammy-award winning African Giant pioneering Afro-fusion rhythms, soulful brass arrangements, and sovereign stadium anthems.',
    monthlyListeners: 18450000,
    followers: 9240000,
    verified: true,
    ninVerified: true,
    topTracks: [
      {
        id: 'bb-1',
        title: 'Last Last',
        album: 'Love, Damini',
        duration: 172,
        plays: 489000000,
        coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      },
      {
        id: 'bb-2',
        title: 'Ye',
        album: 'Outside',
        duration: 231,
        plays: 342000000,
        coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      },
      {
        id: 'bb-3',
        title: 'City Boys',
        album: 'I Told Them...',
        duration: 153,
        plays: 215000000,
        coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      }
    ],
    albums: [
      { id: 'bba-1', title: 'I Told Them...', year: 2023, coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', trackCount: 15, quality: 'Lossless 24-bit' },
      { id: 'bba-2', title: 'Love, Damini', year: 2022, coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', trackCount: 19, quality: 'Spatial Audio' },
      { id: 'bba-3', title: 'Twice as Tall', year: 2020, coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400', trackCount: 15, quality: 'Lossless FLAC' },
      { id: 'bba-4', title: 'African Giant', year: 2019, coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400', trackCount: 19, quality: 'Master SoundOcean' }
    ]
  },
  {
    id: 'art-2',
    name: 'Asake',
    handle: '@asakemusic',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200',
    genre: 'Fuji-Amapiano / Street-Pop',
    bio: 'Mr. Money with the Vibe blending sacred Fuji vocal choruses with driving South African log drums and violin symphonies.',
    monthlyListeners: 12890000,
    followers: 6120000,
    verified: true,
    ninVerified: true,
    topTracks: [
      {
        id: 'as-1',
        title: 'Lonely At The Top',
        album: 'Work of Art',
        duration: 157,
        plays: 380000000,
        coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      },
      {
        id: 'as-2',
        title: 'MMS (feat. Wizkid)',
        album: 'Lungu Boy',
        duration: 218,
        plays: 145000000,
        coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
      },
      {
        id: 'as-3',
        title: 'Amapiano (feat. Olamide)',
        album: 'Work of Art',
        duration: 165,
        plays: 198000000,
        coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
      }
    ],
    albums: [
      { id: 'asa-1', title: 'Lungu Boy', year: 2024, coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400', trackCount: 15, quality: 'Lossless 24-bit' },
      { id: 'asa-2', title: 'Work of Art', year: 2023, coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', trackCount: 14, quality: 'Master SoundOcean' },
      { id: 'asa-3', title: 'Mr. Money With The Vibe', year: 2022, coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400', trackCount: 12, quality: 'Lossless FLAC' }
    ]
  },
  {
    id: 'art-3',
    name: 'Wizkid',
    handle: '@wizkidayo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200',
    genre: 'Afrobeats / Global Pop',
    bio: 'Big Wiz carrying the quintessential smooth Lagos vibration to every continent. Architectural minimalism in sound.',
    monthlyListeners: 19100000,
    followers: 14500000,
    verified: true,
    ninVerified: true,
    topTracks: [
      {
        id: 'wz-1',
        title: 'Essence (feat. Tems)',
        album: 'Made In Lagos',
        duration: 248,
        plays: 540000000,
        coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
      },
      {
        id: 'wz-2',
        title: 'Ojuelegba',
        album: 'Ayo',
        duration: 216,
        plays: 280000000,
        coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
      }
    ],
    albums: [
      { id: 'wza-1', title: 'Morayo', year: 2024, coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', trackCount: 16, quality: 'Lossless 24-bit 192kHz' },
      { id: 'wza-2', title: 'Made In Lagos (Deluxe)', year: 2021, coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', trackCount: 18, quality: 'Spatial Audio' }
    ]
  },
  {
    id: 'art-4',
    name: 'Tems',
    handle: '@temsbaby',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    banner: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=1200',
    genre: 'Afro-Soul / Alté / R&B',
    bio: 'Soulful siren and producer whose vocal resonance redefines modern vocal depth. Oscar-nominated and Grammy-winning icon.',
    monthlyListeners: 15400000,
    followers: 5800000,
    verified: true,
    ninVerified: true,
    topTracks: [
      {
        id: 'tm-1',
        title: 'Free Mind',
        album: 'For Broken Ears',
        duration: 247,
        plays: 410000000,
        coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
      },
      {
        id: 'tm-2',
        title: 'Me & U',
        album: 'Born in the Wild',
        duration: 192,
        plays: 165000000,
        coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
      }
    ],
    albums: [
      { id: 'tma-1', title: 'Born in the Wild', year: 2024, coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400', trackCount: 18, quality: 'Lossless FLAC' },
      { id: 'tma-2', title: 'For Broken Ears', year: 2020, coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400', trackCount: 7, quality: 'Hi-Res 320kbps' }
    ]
  },
  {
    id: 'art-5',
    name: 'Davido',
    handle: '@davido',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    banner: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200',
    genre: 'Afrobeats / Highlife Fusion',
    bio: 'O.B.O. bringing relentless energy and peerless party anthems. Founder of DMW and champion of African creative excellence.',
    monthlyListeners: 14700000,
    followers: 12100000,
    verified: true,
    ninVerified: true,
    topTracks: [
      {
        id: 'dv-1',
        title: 'Unavailable (feat. Musa Keys)',
        album: 'Timeless',
        duration: 170,
        plays: 310000000,
        coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      },
      {
        id: 'dv-2',
        title: 'FEEL',
        album: 'Timeless',
        duration: 155,
        plays: 240000000,
        coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      }
    ],
    albums: [
      { id: 'dva-1', title: 'Timeless', year: 2023, coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400', trackCount: 17, quality: 'Lossless 24-bit 192kHz' },
      { id: 'dva-2', title: 'A Good Time', year: 2019, coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', trackCount: 17, quality: 'Lossless FLAC' }
    ]
  },
  {
    id: 'art-6',
    name: 'Fela Kuti & Egypt 80',
    handle: '@felakuti_estate',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200',
    genre: 'Afrobeat Pioneer / Political Jazz',
    bio: 'The immortal Black President, multi-instrumentalist, and pioneer of Afrobeat. Sacred Kalakuta Republic recordings restored in 24-bit master tape.',
    monthlyListeners: 4200000,
    followers: 5100000,
    verified: true,
    ninVerified: true,
    topTracks: [
      {
        id: 'fk-1',
        title: 'Water No Get Enemy',
        album: 'Expensive Shit',
        duration: 650,
        plays: 120000000,
        coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      },
      {
        id: 'fk-2',
        title: 'Zombie',
        album: 'Zombie',
        duration: 745,
        plays: 95000000,
        coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
      }
    ],
    albums: [
      { id: 'fka-1', title: 'Zombie (Master Edition)', year: 1977, coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', trackCount: 2, quality: 'Master Tape 24-bit' },
      { id: 'fka-2', title: 'Expensive Shit', year: 1975, coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', trackCount: 2, quality: 'Lossless FLAC' }
    ]
  }
];

export const ArtistsTab: React.FC = () => {
  const { playTrack, currentTrack, isPlaying } = useBeatwaveNG();
  const [artists, setArtists] = useState<ArtistProfile[]>(SEED_ARTISTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedArtistModal, setSelectedArtistModal] = useState<ArtistProfile | null>(null);

  const genres = ['All', 'Afrobeats', 'Amapiano', 'Afro-Soul', 'Fuji', 'Highlife'];

  const filteredArtists = artists.filter((a) => {
    const matchesSearch =
      !searchTerm ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.genre.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGenre =
      selectedGenre === 'All' || a.genre.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  const toggleFollow = (artistId: string) => {
    setArtists((prev) =>
      prev.map((a) => {
        if (a.id === artistId) {
          const isFollowing = !a.isFollowing;
          return {
            ...a,
            isFollowing,
            followers: isFollowing ? a.followers + 1 : a.followers - 1
          };
        }
        return a;
      })
    );
  };

  const handlePlayArtistTrack = (track: any, artist: ArtistProfile) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: artist.name,
      album: track.album,
      duration: track.duration,
      genre: artist.genre,
      year: 2026,
      trackNumber: 1,
      coverArt: track.coverArt,
      url: track.url,
      plays: track.plays,
      likes: 1000,
      tier: 'SoundOcean',
      audioQuality: 'Lossless',
      bitrate: '1411 kbps FLAC'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Mic2 className="w-6 h-6 text-emerald-400" />
            <span>Artists Catalog</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              {artists.length} Sovereign Artists
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Explore verified sovereign African recording artists, live discographies, and lossless master recordings.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            placeholder="Search artists by name or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>
      </div>

      {/* Genre Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedGenre === g
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArtists.map((artist) => (
          <div
            key={artist.id}
            className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            {/* Banner & Avatar Stage */}
            <div className="relative h-32 w-full overflow-hidden bg-slate-950">
              <img
                src={artist.banner}
                alt={artist.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

              <div className="absolute -bottom-5 left-5 flex items-end gap-3">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-800 shadow-xl">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-xs text-amber-400 border border-slate-700">
                  {artist.genre.split('/')[0]}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-5 pt-8 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-white">{artist.name}</h3>
                    {artist.verified && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                    {artist.ninVerified && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-300 font-mono">
                    {artist.handle}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                  {artist.bio}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 mb-4 text-center">
                  <div>
                    <span className="text-[10px] text-slate-300 font-semibold block">Monthly Listeners</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      {(artist.monthlyListeners / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-300 font-semibold block">Followers</span>
                    <span className="text-xs font-bold text-white font-mono">
                      {(artist.followers / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>

                {/* Top Track Teaser */}
                {artist.topTracks.length > 0 && (
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={artist.topTracks[0].coverArt}
                        alt={artist.topTracks[0].title}
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {artist.topTracks[0].title}
                        </div>
                        <div className="text-[10px] text-slate-300 truncate">
                          {artist.topTracks[0].album}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlayArtistTrack(artist.topTracks[0], artist)}
                      className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition shrink-0"
                      title="Play Track"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => toggleFollow(artist.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    artist.isFollowing
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{artist.isFollowing ? 'Following' : 'Follow Artist'}</span>
                </button>
                <button
                  onClick={() => setSelectedArtistModal(artist)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1"
                >
                  <span>Discography</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Artist Full Discography Modal */}
      {selectedArtistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <button type="button" aria-label="Close"
              onClick={() => setSelectedArtistModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedArtistModal.avatar}
                alt={selectedArtistModal.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">{selectedArtistModal.name}</h3>
                  <CheckCircle2 className="w-5 h-5 text-sky-400" />
                </div>
                <div className="text-xs text-slate-300 font-medium">{selectedArtistModal.genre}</div>
              </div>
            </div>

            {/* Top Popular Tracks */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
                <Disc className="w-4 h-4 text-emerald-400" />
                <span>Top Popular Tracks</span>
              </h4>
              <div className="space-y-2">
                {selectedArtistModal.topTracks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img src={t.coverArt} alt={t.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="text-xs font-bold text-white">{t.title}</div>
                        <div className="text-[10px] text-slate-300">{t.album}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-300">{formatTime(t.duration)}</span>
                      <button type="button" aria-label="Play"
                        onClick={() => handlePlayArtistTrack(t, selectedArtistModal)}
                        className="p-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Albums Catalog */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-2">
                <Disc className="w-4 h-4 text-amber-400" />
                <span>Albums &amp; Master Discography</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedArtistModal.albums.map((alb) => (
                  <div key={alb.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-left">
                    <img src={alb.coverArt} alt={alb.title} className="w-full aspect-square rounded-lg object-cover mb-2" />
                    <div className="text-xs font-bold text-white truncate">{alb.title}</div>
                    <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1">
                      <span>{alb.year}</span>
                      <span className="text-amber-400 font-mono">{alb.quality}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
