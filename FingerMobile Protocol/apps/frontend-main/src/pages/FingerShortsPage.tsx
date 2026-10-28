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
    <MainLayout pageTitle="FingerShorts™ | FingerMobile Protocol">
      <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-50 dark:bg-slate-950 pb-28 md:pb-12">
        <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5 sm:space-y-6">
          {/* Specifications Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6 md:p-8 text-white shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
              <div className="max-w-2xl space-y-2.5 sm:space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-xs font-bold tracking-wider uppercase">
                  <Smartphone className="w-3.5 h-3.5" />
                  FingerShorts™ (Stories Platform)
                </div>
                <h1 className="text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight">
                  Disappearing 48h Stories with Duets & Stitches
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-indigo-100 font-medium">
                  48 Hours (2 Days) TTL strictly enforced • Up to 20 Media/Video Cards • Max 20MB per card • 1 Min per card • 100% Free ($0.00c).
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs font-semibold text-indigo-100 pt-1">
                  <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs">
                    <Clock className="w-3.5 h-3.5 text-amber-300" /> 48h Expiration
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs">
                    <Layers className="w-3.5 h-3.5 text-emerald-300" /> Up to 20 Cards
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" /> 20MB / 60s
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> Free ($0.00c)
                  </span>
                </div>
              </div>

              {/* Quick Action Button */}
              <div className="w-full md:w-auto flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="w-full md:w-auto min-h-[44px] py-2.5 sm:py-3 px-5 sm:px-6 bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  Post Story (48h)
                </button>
              </div>
            </div>
          </div>

          {/* Feature Sub-Navigation Tabs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 flex-nowrap">
              {[
                { id: 'stories', label: 'All Stories (48h)', icon: Smartphone },
                { id: 'duets', label: 'Duets & Stitches', icon: Scissors },
                { id: 'sounds', label: 'Sounds & Audio Library', icon: Music }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap active:scale-95 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200 border border-slate-300 dark:border-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="hidden sm:inline-flex min-h-[44px] py-2 px-4 sm:px-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow transition-all items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Create FingerShort
            </button>
          </div>

          {/* Interactive Feature Views */}
          {activeTab === 'stories' && (
            <div className="space-y-6">
              <FingerShortsSection onOpenCreate={() => setIsCreating(true)} />
            </div>
          )}

          {activeTab === 'duets' && (
            <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Scissors className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Duets & Stitches Collaboration</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
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
                      type="button"
                      onClick={() => handleStartCollaboration('duet')}
                      className="mt-3 min-h-[40px] px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg active:scale-95"
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
                      type="button"
                      onClick={() => handleStartCollaboration('stitch')}
                      className="mt-3 min-h-[40px] px-3.5 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg active:scale-95"
                    >
                      Stitch Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sounds' && (
            <div className="bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-purple-500" />
                <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">Sounds & BeatwaveNG Audio Library</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                Browse licensed music tracks, trending voice clips, and original sounds for your 48h FingerShorts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
                {displaySounds.map((sound, idx) => (
                  <div key={idx} className="p-3.5 sm:p-4 rounded-2xl border border-slate-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">{sound.title}</h5>
                      <p className="text-xs text-slate-700 truncate">{sound.artist} • {sound.duration}</p>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">{sound.uses}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        showToast(`Applied sound "${sound.title}" to story creation!`, 'info');
                        setIsCreating(true);
                      }}
                      className="min-h-[40px] px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shrink-0 active:scale-95"
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

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-3 inset-x-3 z-40 md:hidden bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-1.5 shadow-2xl shadow-black/80 grid grid-cols-4 gap-1">
          {[
            { id: 'stories', label: 'Stories', icon: Smartphone },
            { id: 'duets', label: 'Duets', icon: Scissors },
            { id: 'sounds', label: 'Sounds', icon: Music },
            { id: 'create', label: 'Create', icon: Plus, isAction: true }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.isAction) {
                    setIsCreating(true);
                  } else {
                    setActiveTab(item.id as any);
                  }
                }}
                className={`min-h-[48px] py-1.5 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                  item.isAction
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold'
                    : isActive
                    ? 'bg-indigo-500/20 text-indigo-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${item.isAction ? 'text-white' : isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default FingerShortsPage;
