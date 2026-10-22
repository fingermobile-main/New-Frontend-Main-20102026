/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  Disc,
  Search,
  Play,
  Clock,
  Sparkles,
  Download,
  Share2,
  X,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useBeatwaveNG, Track } from '../../contexts/BeatwaveNGContext';
import { formatTime } from '../../utils/timeUtils';

export interface AlbumItem {
  id: string;
  title: string;
  artist: string;
  year: number;
  coverArt: string;
  genre: string;
  quality: string;
  trackCount: number;
  totalDuration: number; // in seconds
  description: string;
  tracks: {
    id: string;
    number: number;
    title: string;
    duration: number;
    url: string;
  }[];
}

const SEED_ALBUMS: AlbumItem[] = [
  {
    id: 'alb-1',
    title: 'Timeless',
    artist: 'Davido',
    year: 2023,
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
    genre: 'Afrobeats / Highlife',
    quality: 'Lossless 24-bit 192kHz',
    trackCount: 17,
    totalDuration: 3120,
    description: 'Davido fourth studio album capturing global resilience, soulful horns, and peerless rhythmic arrangements.',
    tracks: [
      { id: 't-1', number: 1, title: 'Over Dem', duration: 198, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 't-2', number: 2, title: 'FEEL', duration: 155, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 't-3', number: 3, title: 'In The Garden (feat. Morravey)', duration: 165, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { id: 't-4', number: 4, title: 'Unavailable (feat. Musa Keys)', duration: 170, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
    ]
  },
  {
    id: 'alb-2',
    title: 'African Giant',
    artist: 'Burna Boy',
    year: 2019,
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
    genre: 'Afro-Fusion',
    quality: 'Master SoundOcean',
    trackCount: 19,
    totalDuration: 3480,
    description: 'The monumental Grammy-nominated album that cemented Burna Boy status as a worldwide musical sovereign.',
    tracks: [
      { id: 't-5', number: 1, title: 'African Giant', duration: 184, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { id: 't-6', number: 2, title: 'Anybody', duration: 188, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
      { id: 't-7', number: 3, title: 'Dangote', duration: 225, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { id: 't-8', number: 4, title: 'Killin Dem (feat. Zlatan)', duration: 221, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
    ]
  },
  {
    id: 'alb-3',
    title: 'Lungu Boy',
    artist: 'Asake',
    year: 2024,
    coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600',
    genre: 'Fuji-Amapiano',
    quality: 'Lossless 24-bit',
    trackCount: 15,
    totalDuration: 2840,
    description: 'Asake third full-length album expanding street anthems into international sonic collaborations.',
    tracks: [
      { id: 't-9', number: 1, title: 'Start', duration: 134, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
      { id: 't-10', number: 2, title: 'MMS (feat. Wizkid)', duration: 218, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
      { id: 't-11', number: 3, title: 'Mood', duration: 172, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 't-12', number: 4, title: 'Active (feat. Travis Scott)', duration: 171, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }
    ]
  },
  {
    id: 'alb-4',
    title: 'Made In Lagos (Deluxe)',
    artist: 'Wizkid',
    year: 2021,
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
    genre: 'Afrobeats / R&B',
    quality: 'Spatial Audio Master',
    trackCount: 18,
    totalDuration: 3720,
    description: 'A masterclass in restraint, sensual melodies, and lush horn sections. Features global anthem Essence.',
    tracks: [
      { id: 't-13', number: 1, title: 'Reckless', duration: 232, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { id: 't-14', number: 2, title: 'Ginger (feat. Burna Boy)', duration: 236, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { id: 't-15', number: 3, title: 'Essence (feat. Tems)', duration: 248, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' }
    ]
  },
  {
    id: 'alb-5',
    title: 'Born in the Wild',
    artist: 'Tems',
    year: 2024,
    coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600',
    genre: 'Afro-Soul',
    quality: 'Lossless FLAC',
    trackCount: 18,
    totalDuration: 3340,
    description: 'Debut studio album from Tems blending cinematic intros, raw vocal intimacy, and resonant West African percussion.',
    tracks: [
      { id: 't-16', number: 1, title: 'Born in the Wild', duration: 172, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
      { id: 't-17', number: 2, title: 'Love Me JeJe', duration: 178, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { id: 't-18', number: 3, title: 'Me & U', duration: 192, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
    ]
  },
  {
    id: 'alb-6',
    title: 'Zombie (Master Edition)',
    artist: 'Fela Kuti & Egypt 80',
    year: 1977,
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
    genre: 'Afrobeat Heritage',
    quality: 'Master Tape 24-bit',
    trackCount: 4,
    totalDuration: 2890,
    description: 'Historic Kalakuta recording preserved in original high-resolution analog tape transfer.',
    tracks: [
      { id: 't-19', number: 1, title: 'Zombie', duration: 745, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
      { id: 't-20', number: 2, title: 'Monkey Banana', duration: 700, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' }
    ]
  }
];

export const AlbumsTab: React.FC = () => {
  const { playTrack } = useBeatwaveNG();
  const [albums] = useState<AlbumItem[]>(SEED_ALBUMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumItem | null>(null);

  const filteredAlbums = albums.filter((alb) => {
    return (
      !searchTerm ||
      alb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alb.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alb.genre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handlePlayAlbum = (album: AlbumItem) => {
    if (album.tracks.length > 0) {
      const first = album.tracks[0];
      playTrack({
        id: first.id,
        title: first.title,
        artist: album.artist,
        album: album.title,
        duration: first.duration,
        genre: album.genre,
        year: album.year,
        trackNumber: first.number,
        coverArt: album.coverArt,
        url: first.url,
        plays: 50000,
        likes: 2400,
        tier: 'SoundOcean',
        audioQuality: 'Lossless',
        bitrate: '1411 kbps FLAC'
      });
    }
  };

  const handlePlayTrack = (track: any, album: AlbumItem) => {
    playTrack({
      id: track.id,
      title: track.title,
      artist: album.artist,
      album: album.title,
      duration: track.duration,
      genre: album.genre,
      year: album.year,
      trackNumber: track.number,
      coverArt: album.coverArt,
      url: track.url,
      plays: 35000,
      likes: 1800,
      tier: 'SoundOcean',
      audioQuality: 'Lossless',
      bitrate: '1411 kbps FLAC'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Disc className="w-6 h-6 text-emerald-400" />
            <span>Albums Catalog</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-semibold">
              {albums.length} Sovereign Albums
            </span>
          </h2>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Complete full-length LPs, deluxe recordings, and remastered studio master tapes.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
          <input
            type="text"
            placeholder="Search albums by title or artist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>
      </div>

      {/* Albums Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredAlbums.map((album) => (
          <div
            key={album.id}
            className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden p-3.5 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
          >
            <div>
              {/* Cover Art Frame */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-950 mb-3">
                <img
                  src={album.coverArt}
                  alt={album.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePlayAlbum(album)}
                    className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl transition transform hover:scale-110 active:scale-95"
                    title="Play Entire Album"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>

                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-[9px] font-mono font-bold text-amber-400 border border-slate-700">
                  {album.quality.split(' ')[0]}
                </div>
              </div>

              {/* Title & Artist */}
              <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition">
                {album.title}
              </h3>
              <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                {album.artist}
              </p>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300 font-medium">
              <span>{album.year} • {album.trackCount} Tracks</span>
              <button
                onClick={() => setSelectedAlbum(album)}
                className="text-emerald-400 font-bold hover:underline flex items-center gap-0.5"
              >
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Album Detail Tracklist Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden p-6 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            <button type="button" aria-label="Close"
              onClick={() => setSelectedAlbum(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Album Header */}
            <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start mb-6">
              <img
                src={selectedAlbum.coverArt}
                alt={selectedAlbum.title}
                className="w-36 h-36 rounded-2xl object-cover shadow-xl border-2 border-slate-700"
              />
              <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 text-[10px] font-mono font-bold">
                  {selectedAlbum.quality}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">{selectedAlbum.title}</h3>
                <p className="text-sm font-semibold text-emerald-400">{selectedAlbum.artist}</p>
                <div className="text-xs text-slate-300 font-medium flex items-center justify-center sm:justify-start gap-2">
                  <span>{selectedAlbum.year}</span>
                  <span>•</span>
                  <span>{selectedAlbum.genre}</span>
                  <span>•</span>
                  <span>{selectedAlbum.trackCount} Tracks</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => handlePlayAlbum(selectedAlbum)}
                    className="py-2 px-5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition flex items-center gap-2 mx-auto sm:mx-0"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Entire Album</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tracklist Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Album Tracklist
              </h4>
              <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
                {selectedAlbum.tracks.map((track) => (
                  <div
                    key={track.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-800/50 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-5 text-center font-mono text-xs text-slate-500 group-hover:hidden">
                        {track.number}
                      </span>
                      <button type="button" aria-label="Play"
                        onClick={() => handlePlayTrack(track, selectedAlbum)}
                        className="w-5 h-5 rounded-md bg-emerald-500 text-slate-950 hidden group-hover:flex items-center justify-center transition"
                      >
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      </button>
                      <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                        {track.title}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-slate-300 font-medium">
                      {formatTime(track.duration)}
                    </span>
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
