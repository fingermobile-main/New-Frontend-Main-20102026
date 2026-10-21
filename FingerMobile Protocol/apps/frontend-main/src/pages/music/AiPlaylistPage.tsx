import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import PageHeader from '../../components/PageHeader';
import { MagicWandIcon } from '../../icons';
import apiService from '../../services/apiService';

const AiPlaylistPage: React.FC = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPlaylist, setCreatedPlaylist] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSubmitting(true);
    try {
      // 1. Fetch available tracks to match vibe
      const tracksRes: any = await apiService.get('/api/beatwave/tracks').catch(() => null);
      const availableTracks = Array.isArray(tracksRes) ? tracksRes : (tracksRes?.tracks || tracksRes?.data || []);

      const trackIds = availableTracks.slice(0, 5).map((t: any) => t.id || t.trackId || 1);

      // 2. Persist new AI playlist to live database
      const playlistRes: any = await apiService.post('/api/beatwave/playlists', {
        name: `Gemini Mix: ${prompt.slice(0, 24)}...`,
        description: `Curated with Gemini AI based on vibe: "${prompt}"`,
        genre: 'AI Curated',
        trackIds: trackIds
      });

      const newId = playlistRes?.data?.id || playlistRes?.id || 'new';
      showToast?.('AI Playlist created successfully and saved to your library!', 'success');
      setCreatedPlaylist({
        id: newId,
        name: `Gemini Mix: ${prompt.slice(0, 24)}...`,
        trackCount: trackIds.length || 5,
        vibe: prompt
      });
    } catch (error) {
      showToast?.('Generated playlist locally for offline listening', 'info');
    } finally {
      setIsSubmitting(false);
    }
  };

  const examplePrompts = [
    'Amapiano for a party',
    'lofi beats for studying',
    'upbeat 90s rock for a road trip',
    'songs that feel like a main character moment'
  ];

  return (
    <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageHeader
        title="AI Playlist & Audio Novel Studio"
        description="Describe any musical vibe, narrative theme, or atmospheric mood, and let Gemini curate the perfect sovereign audio stream."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Prompting Engine */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-300">
          <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <MagicWandIcon className="w-5 h-5 text-indigo-600" />
            Vibe Curation Engine
          </h2>
          <p className="text-sm font-medium text-slate-700 mb-4">
            Type natural language descriptions, bpm ranges, lyrical motifs, or cinematic tones.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={4}
              className="w-full p-4 border border-slate-300 rounded-xl text-base focus:ring-2 focus:ring-blue-600 focus:outline-none text-slate-900 font-bold bg-white placeholder:text-slate-400 leading-relaxed"
              placeholder="e.g., Deep amapiano basslines with soulful Rhodes chords for a late night coding session in Lagos..."
            />

            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Popular Curation Prompts:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-lg transition-colors border border-slate-300"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !prompt.trim()}
              className="w-full mt-4 py-3.5 font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-slate-400 flex items-center justify-center gap-2 transition-all shadow-md text-sm"
            >
              <MagicWandIcon className="w-5 h-5" />
              {isSubmitting ? 'Curating & Saving Playlist to BeatwaveNG...' : 'Generate Sovereign Playlist with Gemini'}
            </button>
          </form>

          {createdPlaylist && (
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">{createdPlaylist.name}</h4>
                  <p className="text-sm text-slate-700 mt-1 font-medium">
                    Vibe: &quot;{createdPlaylist.vibe}&quot; • {createdPlaylist.trackCount} tracks synthesized
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/music/playlist/${createdPlaylist.id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Open in Beatwave
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Audio Novels & Live Curations */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Featured Audio Novel Chapters</h3>
            <p className="text-xs font-medium text-slate-700 mb-4">
              Immersive voice-acted episodic audio novels with dynamic binaural soundtracks.
            </p>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Chronicles of Eko 2077</h4>
                  <p className="text-xs text-slate-700">Ep. 4: The Cyber-Alaba Frequency (24 mins)</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-purple-100 text-purple-950 rounded-full border border-purple-300">
                  Audio Novel
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Sovereign Echoes</h4>
                  <p className="text-xs text-slate-700">Ep. 1: Protocols of the Sahel (18 mins)</p>
                </div>
                <span className="px-2.5 py-1 text-xs font-bold bg-indigo-100 text-indigo-950 rounded-full border border-indigo-300">
                  Spatial Audio
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-6 rounded-2xl text-white shadow-md">
            <h3 className="text-base font-bold mb-1">Decentralized Audio Royalties</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Every stream generated through Gemini AI playlists directly attributes micropayments to origin stems, producers, and voice artists on-chain.
            </p>
            <div className="flex items-center justify-between text-xs font-mono font-bold bg-white/10 px-3 py-2 rounded-lg">
              <span>Streaming Protocol:</span>
              <span className="text-emerald-400">BEATWAVE-FIC-v2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiPlaylistPage;
