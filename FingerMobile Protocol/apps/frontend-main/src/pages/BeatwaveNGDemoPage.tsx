import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import {
  // eslint-disable-next-line no-unused-vars
  Activity, Radio, Volume2, Play, Pause, Disc,
  // eslint-disable-next-line no-unused-vars
  Sliders, Waves, Sparkles, ArrowLeft, RefreshCw
} from 'lucide-react';

interface BeatwaveTrack {
  id: number | string;
  title: string;
  artist_name?: string;
  artist?: string;
  genre: string;
  duration_seconds?: number;
  duration?: number | string;
  cover_url?: string;
}

const BeatwaveNGDemoPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const [tracks, setTracks] = useState<BeatwaveTrack[]>([]);
  // eslint-disable-next-line no-unused-vars
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<BeatwaveTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [bpm, setBpm] = useState<number>(128);
  const [bassGain, setBassGain] = useState<number>(4);
  const [midGain, setMidGain] = useState<number>(0);
  const [trebleGain, setTrebleGain] = useState<number>(2);
  const [spatialAudio, setSpatialAudio] = useState<boolean>(true);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const fetchStudioData = async () => {
      try {
        setLoading(true);
        const [trRes, gnRes] = await Promise.all([
          apiService.get('/api/beatwave/tracks').catch(() => null),
          apiService.get('/api/beatwave/genres').catch(() => null)
        ]);

        if (active) {
          const rawTracks = Array.isArray(trRes) ? trRes : (trRes?.tracks || trRes?.data || []);
          const rawGenres = Array.isArray(gnRes) ? gnRes : (gnRes?.genres || gnRes?.data || ['Afrobeats', 'Amapiano', 'Highlife']);

          if (rawTracks.length > 0) {
            setTracks(rawTracks);
            setSelectedTrack(rawTracks[0]);
          } else {
            const fallback: BeatwaveTrack[] = [
              { id: 1, title: 'Lagos Night Pulse', artist_name: 'Dancia Beats', genre: 'Afrobeats', duration_seconds: 215 },
              { id: 2, title: 'Amapiano Sunrise Grooves', artist_name: 'DJ Maphorisa Club', genre: 'Amapiano', duration_seconds: 240 }
            ];
            setTracks(fallback);
            setSelectedTrack(fallback[0]);
          }
          setGenres(rawGenres);
        }
      } catch (err) {
        // Fallback applied
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchStudioData();
    return () => { active = false; };
  }, []);

  const handleApplyAcousticPreset = (preset: 'Club' | 'Vocal' | 'Bass' | 'Studio Flat') => {
    switch (preset) {
    case 'Club':
      setBassGain(8);
      setMidGain(-2);
      setTrebleGain(4);
      break;
    case 'Vocal':
      setBassGain(-1);
      setMidGain(5);
      setTrebleGain(3);
      break;
    case 'Bass':
      setBassGain(12);
      setMidGain(1);
      setTrebleGain(-1);
      break;
    case 'Studio Flat':
      setBassGain(0);
      setMidGain(0);
      setTrebleGain(0);
      break;
    }
    showToast?.(`Applied ${preset} acoustic profile!`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between sticky top-0 z-30 gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="min-h-[44px] min-w-[44px] p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-slate-300 flex items-center justify-center cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Waves className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight">BeatwaveNG High-Fidelity Studio</h1>
              <p className="text-xs text-slate-300 font-medium">DSP Audio Pipeline • 32-bit Float Waveform Processing</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button
            onClick={() => navigate('/beatwave-ng')}
            className="min-h-[44px] w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-xs font-bold transition-all shadow cursor-pointer flex items-center justify-center"
          >
            Launch BeatwaveNG Console
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Waveform Display */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <h2 className="font-bold text-base">Real-time Spectrum & Waveform Analyzer</h2>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                Live 96kHz / 24-bit Stream
              </span>
            </div>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="h-32 bg-slate-950 rounded-2xl p-4 flex items-end justify-between gap-1 border border-slate-800/80">
            {Array.from({ length: 48 }).map((_, idx) => {
              const baseHeight = 15 + Math.sin(idx * 0.4) * 30 + (idx % 3) * 15;
              const dynamicHeight = isPlaying ? Math.min(100, Math.max(10, baseHeight + (idx % 5) * 8)) : 10;
              return (
                <div
                  key={idx}
                  className={`w-full rounded-t-sm transition-all duration-150 ${
                    idx % 4 === 0
                      ? 'bg-purple-500'
                      : idx % 2 === 0
                        ? 'bg-indigo-500'
                        : 'bg-cyan-500'
                  }`}
                  style={{
                    height: `${dynamicHeight}%`,
                    opacity: isPlaying ? 0.9 : 0.2
                  }}
                />
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-white">{selectedTrack?.title || 'Master Audio Channel'}</p>
              <p className="text-xs text-slate-300 font-medium">{selectedTrack?.artist_name || selectedTrack?.artist || 'Beatwave Artist'}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/20 flex items-center space-x-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Audio Deck' : 'Play Audio Deck'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Studio Rack: Equalizer, Presets, and Track Picker */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DSP 3-Band Equalizer Rack */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-base">DSP 3-Band Parametric EQ</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Bass (100Hz)</span>
                  <span className="text-cyan-400 font-mono">{bassGain > 0 ? `+${bassGain}` : bassGain} dB</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={bassGain}
                  onChange={(e) => setBassGain(Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Mid (1.2kHz)</span>
                  <span className="text-indigo-400 font-mono">{midGain > 0 ? `+${midGain}` : midGain} dB</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={midGain}
                  onChange={(e) => setMidGain(Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Treble (8kHz)</span>
                  <span className="text-purple-400 font-mono">{trebleGain > 0 ? `+${trebleGain}` : trebleGain} dB</span>
                </div>
                <input
                  type="range"
                  min="-12"
                  max="12"
                  value={trebleGain}
                  onChange={(e) => setTrebleGain(Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Acoustic Profiles */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-300 block mb-2 font-semibold">Acoustic Presets</span>
              <div className="grid grid-cols-2 gap-2">
                {(['Club', 'Vocal', 'Bass', 'Studio Flat'] as const).map((pr) => (
                  <button
                    key={pr}
                    onClick={() => handleApplyAcousticPreset(pr)}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rhythm & Master Tempo Rack */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center space-x-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-base">Tempo & Spatial Engine</h3>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-300">Master BPM</span>
                <span className="text-cyan-400 font-mono">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min="70"
                max="180"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-300 font-medium mt-1">
                <span>70 (Slow Chill)</span>
                <span>128 (Afro/House)</span>
                <span>180 (Drum & Bass)</span>
              </div>
            </div>

            {/* Spatial Audio Toggle */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">3D Spatial Head-Tracking</p>
                <p className="text-[11px] text-slate-300 font-medium">Binaural 360-degree soundstage emulation</p>
              </div>
              <button type="button" aria-label="Action"
                onClick={() => {
                  setSpatialAudio((prev) => !prev);
                  showToast?.(`Spatial audio ${!spatialAudio ? 'enabled' : 'disabled'}`, 'info');
                }}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  spatialAudio ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${
                    spatialAudio ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/60">
              <p className="text-xs font-bold text-indigo-300 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-400" />
                Decentralized Sync Engine
              </p>
              <p className="text-[11px] text-indigo-200/70 mt-1">
                Audio timeline synced with FingerMobile live broadcast nodes for zero-latency streaming.
              </p>
            </div>
          </div>

          {/* Master Track Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Disc className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-base">Select Track Deck</h3>
              </div>
              <span className="text-xs text-slate-300 font-medium">{tracks.length} loaded</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => {
                    setSelectedTrack(track);
                    setIsPlaying(true);
                    showToast?.(`Loaded ${track.title} into Studio Deck`, 'info');
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedTrack?.id === track.id
                      ? 'bg-purple-950/40 border-purple-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-700/40 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-xs truncate">{track.title}</p>
                    <p className="text-[11px] text-slate-300 font-medium truncate">{track.artist_name || track.artist || 'Beatwave Artist'}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium border border-slate-700 whitespace-nowrap">
                    {track.genre}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2 px-4 md:hidden shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              showToast?.(isPlaying ? 'Playback paused' : 'Playback started', 'info');
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-purple-400 font-bold"
            aria-label={isPlaying ? "Pause Track" : "Play Track"}
          >
            {isPlaying ? <Pause className="w-5 h-5 mb-1" /> : <Play className="w-5 h-5 mb-1" />}
            <span className="text-[10px]">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={() => handleApplyAcousticPreset('Club')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 font-medium"
            aria-label="Club Preset"
          >
            <Sliders className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Club EQ</span>
          </button>
          <button
            onClick={() => {
              setSpatialAudio(!spatialAudio);
              showToast?.(`Spatial audio ${!spatialAudio ? 'enabled' : 'disabled'}`, 'info');
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 font-medium"
            aria-label="Toggle Spatial"
          >
            <Radio className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Spatial</span>
          </button>
          <button
            onClick={() => navigate('/beatwave-ng')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 font-medium"
            aria-label="Console Hub"
          >
            <Sparkles className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Console</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeatwaveNGDemoPage;
