/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  ListMusic,
  Plus,
  Sparkles,
  Play,
  Share2,
  Users,
  Lock,
  Globe,
  Clock,
  Disc,
  X,
  ChevronRight
} from 'lucide-react';
import { useBeatwaveNG, Playlist, Track } from '../../contexts/BeatwaveNGContext';
import { formatTime } from '../../utils/timeUtils';

export interface EcosystemPlaylist {
  id: string;
  title: string;
  curator: string;
  description: string;
  coverArt: string;
  trackCount: number;
  totalDuration: number;
  isAiCurated: boolean;
  isColabo: boolean;
  category: 'Editorial' | 'Colabo+' | 'Community' | 'Genre Canon';
  tracks: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    url: string;
  }[];
}

const SEED_ALL_PLAYLISTS: EcosystemPlaylist[] = [
  {
    id: 'epl-1',
    title: 'Sovereign Top 50 Nigeria & Diaspora',
    curator: 'BeatwaveNG Editorial Board',
    description: 'The definitive daily sovereign chart tracking streamed lossless plays across Lagos, London, Accra, and Atlanta.',
    coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600',
    trackCount: 50,
    totalDuration: 9400,
    isAiCurated: false,
    isColabo: false,
    category: 'Editorial',
    tracks: [
      { id: 'et-1', title: 'City Boys', artist: 'Burna Boy', duration: 153, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 'et-2', title: 'Lonely At The Top', artist: 'Asake', duration: 157, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { id: 'et-3', title: 'Essence', artist: 'Wizkid feat. Tems', duration: 248, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
      { id: 'et-4', title: 'Unavailable', artist: 'Davido', duration: 170, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
    ]
  },
  {
    id: 'epl-2',
    title: 'Midnight Lagos Afro-Futurism',
    curator: 'Guardian AI Griot Engine',
    description: 'Synthetic brass, deep ambient analog pads, and lo-fi percussion tailored for late night creative flows.',
    coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600',
    trackCount: 24,
    totalDuration: 4900,
    isAiCurated: true,
    isColabo: false,
    category: 'Editorial',
    tracks: [
      { id: 'et-5', title: 'Marina Wharf Drone', artist: 'Lagos Synthesizer Guild', duration: 215, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { id: 'et-6', title: 'Third Mainland Rain', artist: 'Cyber-Griot Echoes', duration: 198, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' }
    ]
  },
  {
    id: 'epl-3',
    title: 'Highlife & Palmwine Roots Canon',
    curator: 'National Acoustic Preservation Vault',
    description: 'Historical archive of Eastern highlife, vintage acoustic guitars, and rhythmic Igbo horn sections.',
    coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600',
    trackCount: 32,
    totalDuration: 7200,
    isAiCurated: false,
    isColabo: false,
    category: 'Genre Canon',
    tracks: [
      { id: 'et-7', title: 'Highlife Palmwine Heritage', artist: 'Chief Osita & Heritage Band', duration: 198, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
      { id: 'et-8', title: 'Water No Get Enemy', artist: 'Fela Kuti', duration: 650, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
    ]
  },
  {
    id: 'epl-4',
    title: 'Colabo+ Sovereign Circle Vol. 4',
    curator: 'Verified Community Crew (PIN #8942)',
    description: 'Collaborative group playlist curated by 8 verified sovereign members with daily track additions and peer voting.',
    coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
    trackCount: 18,
    totalDuration: 3600,
    isAiCurated: false,
    isColabo: true,
    category: 'Colabo+',
    tracks: [
      { id: 'et-9', title: 'Lungu Boy Anthem', artist: 'Asake', duration: 172, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
      { id: 'et-10', title: 'Free Mind', artist: 'Tems', duration: 247, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' }
    ]
  },
  {
    id: 'epl-5',
    title: 'SoundOcean Studio Master Lossless',
    curator: 'Audiophile Guild',
    description: 'Uncompressed 24-bit/192kHz lossless recordings mastered exclusively for high-end DACs and planar monitors.',
    coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600',
    trackCount: 22,
    totalDuration: 4400,
    isAiCurated: false,
    isColabo: false,
    category: 'Editorial',
    tracks: [
      { id: 'et-11', title: 'SoundOcean Sovereign Pulse', artist: 'Lagos Sound Lab', duration: 214, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { id: 'et-12', title: 'Amapiano Log Drum Meditation', artist: 'Pretoria Soul Collective', duration: 245, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }
    ]
  }
];

interface PlaylistsTabProps {
  initialSubTab?: 'my-playlists' | 'all-playlists';
}

export const PlaylistsTab: React.FC<PlaylistsTabProps> = ({
  initialSubTab = 'my-playlists'
}) => {
  const { playlists, createPlaylist, playTrack } = useBeatwaveNG();
  const [subTab, setSubTab] = useState<'my-playlists' | 'all-playlists'>(initialSubTab);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [aiPrompt, setAiPrompt] = useState('High-energy Lagos rooftop party with heavy Amapiano log drums');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedPlaylistModal, setSelectedPlaylistModal] = useState<any | null>(null);

  const [myPlaylistsState, setMyPlaylistsState] = useState<any[]>(() => {
    return [
      {
        id: 'mpl-1',
        title: 'Lagos Midnight Cruising Anthems',
        description: 'Selected heavy bass Afrobeats and Amapiano log drums.',
        trackCount: 14,
        coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500',
        isAiCurated: false,
        tracks: [
          { id: 'mt-1', title: 'Last Last', artist: 'Burna Boy', duration: 172, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
          { id: 'mt-2', title: 'Lonely At The Top', artist: 'Asake', duration: 157, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' }
        ]
      },
      {
        id: 'mpl-2',
        title: 'Deep Acoustic Palmwine Heritage',
        description: 'Vintage highlife, talking drums, and sweet acoustic brass.',
        trackCount: 9,
        coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500',
        isAiCurated: true,
        tracks: [
          { id: 'mt-3', title: 'Highlife Palmwine Heritage', artist: 'Chief Osita', duration: 198, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
        ]
      }
    ];
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createPlaylist(newTitle.trim(), newDesc.trim());
    setMyPlaylistsState((prev) => [
      {
        id: `mpl-${Date.now()}`,
        title: newTitle.trim(),
        description: newDesc.trim() || 'Custom user sovereign playlist.',
        trackCount: 0,
        coverArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500',
        isAiCurated: false,
        tracks: []
      },
      ...prev
    ]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleAiCurateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setTimeout(() => {
      setMyPlaylistsState((prev) => [
        {
          id: `mpl-ai-${Date.now()}`,
          title: `AI Mix: ${aiPrompt.slice(0, 26)}...`,
          description: `AI-synthesized from prompt: "${aiPrompt}"`,
          trackCount: 12,
          coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500',
          isAiCurated: true,
          tracks: [
            { id: 'ai-t1', title: 'Prompt Ingest Harmony', artist: 'AI Griot Engine', duration: 204, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
          ]
        },
        ...prev
      ]);
      setIsAiLoading(false);
      setShowAiModal(false);
    }, 800);
  };

  const handlePlayPlaylist = (playlist: any) => {
    if (playlist.tracks && playlist.tracks.length > 0) {
      const first = playlist.tracks[0];
      playTrack({
        id: first.id,
        title: first.title,
        artist: first.artist || 'Curated Artist',
        album: playlist.title,
        duration: first.duration,
        genre: 'Afrobeats',
        year: 2026,
        trackNumber: 1,
        coverArt: playlist.coverArt,
        url: first.url,
        plays: 40000,
        likes: 1200,
        tier: 'SoundOcean',
        audioQuality: 'Lossless',
        bitrate: '1411 kbps FLAC'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ListMusic className="w-6 h-6 text-emerald-400" />
            <span>{subTab === 'my-playlists' ? 'My Playlists' : 'All Ecosystem Playlists'}</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {subTab === 'my-playlists'
              ? 'Manage personal sovereign playlists, AI-prompted mixes, and private vaults.'
              : 'Browse public editorial charts, Colabo+ shared playlists, and sovereign canons.'}
          </p>
        </div>

        {/* Switcher & Create CTA */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Sub-Tab Toggle */}
          <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex items-center shrink-0">
            <button
              onClick={() => setSubTab('my-playlists')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                subTab === 'my-playlists'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              My Playlists
            </button>
            <button
              onClick={() => setSubTab('all-playlists')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                subTab === 'all-playlists'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Playlists ({SEED_ALL_PLAYLISTS.length})
            </button>
          </div>

          {subTab === 'my-playlists' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
              <button
                onClick={() => setShowAiModal(true)}
                className="py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 shadow-md flex items-center gap-1.5 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Curate</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid View */}
      {subTab === 'my-playlists' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {myPlaylistsState.map((pl) => (
            <div
              key={pl.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-3.5 group">
                  <img
                    src={pl.coverArt}
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={() => handlePlayPlaylist(pl)}
                      className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl transition transform hover:scale-110 active:scale-95"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                  {pl.isAiCurated && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-amber-500/90 text-slate-950 text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Mix
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white truncate">{pl.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {pl.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                <span>{pl.trackCount} Tracks</span>
                <button
                  onClick={() => setSelectedPlaylistModal(pl)}
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>View Tracklist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* All Ecosystem Playlists Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SEED_ALL_PLAYLISTS.map((pl) => (
            <div
              key={pl.id}
              className="rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-950 mb-3.5 group">
                  <img
                    src={pl.coverArt}
                    alt={pl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <button
                      onClick={() => handlePlayPlaylist(pl)}
                      className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl transition transform hover:scale-110 active:scale-95"
                    >
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </button>
                  </div>
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-xs text-amber-400 border border-slate-700 text-[10px] font-mono font-bold">
                    {pl.category}
                  </span>
                  {pl.isColabo && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-600 text-[10px] font-bold flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      PIN Exchange
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white truncate">{pl.title}</h3>
                <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  By {pl.curator}
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                  {pl.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                <span>{pl.trackCount} Tracks</span>
                <button
                  onClick={() => setSelectedPlaylistModal(pl)}
                  className="text-emerald-400 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>Explore</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Playlist Tracklist Detail Modal */}
      {selectedPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto text-left"
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setSelectedPlaylistModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <img
                src={selectedPlaylistModal.coverArt}
                alt={selectedPlaylistModal.title}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-white truncate">{selectedPlaylistModal.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">{selectedPlaylistModal.description}</p>
              </div>
            </div>

            <div className="mb-4">
              <button
                onClick={() => handlePlayPlaylist(selectedPlaylistModal)}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Entire Playlist</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                Playlist Tracks ({selectedPlaylistModal.tracks?.length || 0})
              </h4>
              {selectedPlaylistModal.tracks && selectedPlaylistModal.tracks.length > 0 ? (
                selectedPlaylistModal.tracks.map((t: any, idx: number) => (
                  <div
                    key={t.id || idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{t.title}</div>
                      <div className="text-[10px] text-slate-300">{t.artist || 'Curated'}</div>
                    </div>
                    <span className="font-mono text-xs text-slate-300">
                      {formatTime(t.duration)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-xl bg-slate-950 text-center text-xs text-slate-500">
                  No tracks added to this playlist yet. Browse songs or AI curate!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-left">
            <h3 className="text-base font-bold text-white mb-2">Create Sovereign Playlist</h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lagos Sunset Vibes"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  placeholder="Short description of this playlist vibe..."
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Curate Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-left">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Sovereign Playlist Curate</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Describe the atmosphere, tempo, acoustic instruments, or cultural festival.
            </p>
            <form onSubmit={handleAiCurateSubmit} className="space-y-4">
              <div>
                <textarea
                  required
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAiLoading}
                  className="py-2 px-5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 shadow-md flex items-center gap-2"
                >
                  {isAiLoading && <Sparkles className="w-4 h-4 animate-spin" />}
                  <span>{isAiLoading ? 'Synthesizing Mix...' : 'Generate AI Playlist'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
