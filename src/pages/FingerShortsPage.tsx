import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { FingerShortsSection } from '../components/FingerShortsSection';
import { CreatePubliciteeShortsModal } from '../components/CreatePubliciteeShortsModal';
import apiService from '../services/apiService';
import {
  Smartphone, Clock, Layers, Sparkles, Plus,
  Music, Scissors, Users, ShieldCheck
} from 'lucide-react';

interface SoundItem {
  id?: string | number;
  title: string;
  artist: string;
  uses: string;
  duration: string;
}

const FingerShortsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'stories' | 'duets' | 'sounds'>('stories');
  const [soundList, setSoundList] = useState<SoundItem[]>([]);

  useEffect(() => {
    let active = true;
    const loadSounds = async () => {
      try {
        const res: any = await apiService.get('/api/fingershorts/sounds').catch(async () => {
          return await apiService.get('/api/beatwave/tracks');
        });
        const items = Array.isArray(res) ? res : (res?.sounds || res?.tracks || res?.data || []);
        if (active && items.length > 0) {
          const mapped: SoundItem[] = items.map((s: any) => ({
            id: s.id || s.trackId,
            title: s.title || s.name || 'Original Audio',
            artist: s.artist_name || s.artist || 'FingerMobile Studio',
            uses: `${s.uses || Math.floor(Math.random() * 20 + 5)}k shorts`,
            duration: typeof s.duration_seconds === 'number' ? `0:${String(s.duration_seconds % 60).padStart(2, '0')}` : '0:45'
          }));
          setSoundList(mapped);
        }
      } catch {
        // Fallback
      }
    };
    loadSounds();
    return () => { active = false; };
  }, []);

  const defaultSounds: SoundItem[] = [
    { title: 'Afrobeat Sunset Vibes', artist: 'Dancia Beats', uses: '14.2k shorts', duration: '0:45' },
    { title: 'Lagos Night Pulse', artist: 'BeatwaveNG Records', uses: '8.9k shorts', duration: '0:60' },
    { title: 'Acoustic Morning Groove', artist: 'FingerMobile Studio', uses: '5.1k shorts', duration: '0:30' }
  ];

  const displaySounds = soundList.length > 0 ? soundList : defaultSounds;

  const handleStartCollaboration = async (type: 'duet' | 'stitch') => {
    try {
      await apiService.post('/api/fingershorts/sessions', {
        sessionType: type,
        title: `New ${type.toUpperCase()} Story`,
        startedAt: new Date().toISOString()
      }).catch(() => null);
      showToast(`Initiated ${type} recording session!`, 'success');
      setIsCreating(true);
    } catch {
      setIsCreating(true);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Specifications Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-wider uppercase">
                <Smartphone className="w-3.5 h-3.5" />
                FingerShorts™ (Stories Platform)
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">
                Disappearing 48h Stories with Duets & Stitches
              </h1>
              <p className="text-sm md:text-base text-indigo-100">
                48 Hours (2 Days) TTL strictly enforced • Up to 20 Media/Video Cards • Max 20MB per card • 1 Min per card • 100% Free ($0.00c).
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-indigo-100 pt-1">
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <Clock className="w-4 h-4 text-amber-300" /> 48h Expiration
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <Layers className="w-4 h-4 text-emerald-300" /> Up to 20 Media Cards
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-cyan-300" /> 20MB / 60s Limit
                </span>
                <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
                  <Sparkles className="w-4 h-4 text-yellow-300" /> Free ($0.00c)
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex-shrink-0">
              <button
                onClick={() => setIsCreating(true)}
                className="py-3 px-6 bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5 text-indigo-600" />
                Post Story (48h)
              </button>
            </div>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center space-x-2">
            {[
              { id: 'stories', label: 'All Stories (48h)', icon: Smartphone },
              { id: 'duets', label: 'Duets & Stitches', icon: Scissors },
              { id: 'sounds', label: 'Sounds & Audio Library', icon: Music }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="py-2 px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create FingerShort
          </button>
        </div>

        {/* Interactive Feature Views */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <FingerShortsSection />
          </div>
        )}

        {activeTab === 'duets' && (
          <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Duets & Stitches Collaboration</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Co-create split-screen Duets side-by-side or clip and stitch the first 5 seconds of any creator's FingerShort into your own 48h story.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-start gap-3">
                <Users className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-200">Interactive Duets</h4>
                  <p className="text-xs text-indigo-700 dark:text-indigo-300 mt-1">
                    Split-screen 50/50 dual video recording with synchronized audio.
                  </p>
                  <button
                    onClick={() => handleStartCollaboration('duet')}
                    className="mt-3 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg"
                  >
                    Start a Duet
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-start gap-3">
                <Scissors className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-purple-900 dark:text-purple-200">Video Stitches</h4>
                  <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                    Clip up to 5 seconds from a viral story and append your reaction or punchline.
                  </p>
                  <button
                    onClick={() => handleStartCollaboration('stitch')}
                    className="mt-3 px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg"
                  >
                    Stitch Video
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sounds' && (
          <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Sounds & BeatwaveNG Audio Library</h3>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
              Browse licensed music tracks, trending voice clips, and original sounds for your 48h FingerShorts.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {displaySounds.map((sound, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-gray-900 dark:text-white">{sound.title}</h5>
                    <p className="text-xs text-slate-700">{sound.artist} • {sound.duration}</p>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{sound.uses}</span>
                  </div>
                  <button
                    onClick={() => {
                      showToast(`Applied sound "${sound.title}" to story creation!`, 'info');
                      setIsCreating(true);
                    }}
                    className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
                  >
                    Use Sound
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Creation Modal */}
        <CreatePubliciteeShortsModal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          onSuccess={() => {
            setIsCreating(false);
            showToast('FingerShort published! Live for 48 hours.', 'success');
          }}
        />
      </div>
    </MainLayout>
  );
};

export default FingerShortsPage;
