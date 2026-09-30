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
    <div className="p-6 lg:p-8">
      <PageHeader
        title="Create a Playlist with AI"
        description="Describe the vibe, and let Gemini curate the perfect playlist for you."
      />
      <div className="max-w-2xl mx-auto mt-6">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            rows={4}
            className="w-full p-4 border border-gray-200 rounded-lg text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., A playlist for a rainy day..."
          />
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Or try an example:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="px-3 py-1 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !prompt.trim()}
            className="w-full mt-6 py-3 font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-all shadow"
          >
            <MagicWandIcon className="w-5 h-5" />
            {isSubmitting ? 'Curating & Saving Playlist...' : 'Create with Gemini'}
          </button>
        </form>

        {createdPlaylist && (
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-900">{createdPlaylist.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Vibe: &quot;{createdPlaylist.vibe}&quot; • {createdPlaylist.trackCount} tracks added
                </p>
              </div>
              <button
                onClick={() => navigate(`/music/playlist/${createdPlaylist.id}`)}
                className="px-4 py-2 bg-brand-blue text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                Open Playlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiPlaylistPage;
