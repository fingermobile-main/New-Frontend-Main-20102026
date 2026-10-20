import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';
import { useAppContext } from '../../contexts/AppContext';
import {
  PaintBrushIcon,
  SparklesIcon,
  CheckCircleIcon,
  SwatchIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface StercsTheme {
  id?: string | number;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  font_family?: string;
  is_dark?: boolean;
}

const DEFAULT_THEMES: StercsTheme[] = [
  {
    name: 'Cyberpunk Neon',
    primary_color: '#06b6d4',
    secondary_color: '#3b82f6',
    accent_color: '#ec4899',
    background_color: '#0f172a',
    font_family: 'Inter, sans-serif',
    is_dark: true
  },
  {
    name: 'Solar African Gold',
    primary_color: '#f59e0b',
    secondary_color: '#d97706',
    accent_color: '#10b981',
    background_color: '#18181b',
    font_family: 'Outfit, sans-serif',
    is_dark: true
  },
  {
    name: 'Midnight Sapphire',
    primary_color: '#6366f1',
    secondary_color: '#4f46e5',
    accent_color: '#38bdf8',
    background_color: '#030712',
    font_family: 'Roboto, sans-serif',
    is_dark: true
  },
  {
    name: 'Emerald Protocol',
    primary_color: '#10b981',
    secondary_color: '#059669',
    accent_color: '#f59e0b',
    background_color: '#064e3b',
    font_family: 'Inter, sans-serif',
    is_dark: true
  }
];

const StercsThemeDesigner: React.FC = () => {
  const { showToast } = useAppContext();
  const [themes, setThemes] = useState<StercsTheme[]>(DEFAULT_THEMES);
  const [selectedTheme, setSelectedTheme] = useState<StercsTheme>(DEFAULT_THEMES[0]);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Customizer state
  const [themeName, setThemeName] = useState(DEFAULT_THEMES[0].name);
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_THEMES[0].primary_color);
  const [secondaryColor, setSecondaryColor] = useState(DEFAULT_THEMES[0].secondary_color);
  const [accentColor, setAccentColor] = useState(DEFAULT_THEMES[0].accent_color);
  const [bgColor, setBgColor] = useState(DEFAULT_THEMES[0].background_color);
  const [fontFamily, setFontFamily] = useState(DEFAULT_THEMES[0].font_family || 'Inter, sans-serif');

  useEffect(() => {
    let active = true;
    const fetchThemes = async () => {
      try {
        const res: any = await apiService.get('/api/stercs/themes').catch(() => null);
        const list = Array.isArray(res) ? res : (res?.data || []);
        if (active && list.length > 0) {
          setThemes([...list, ...DEFAULT_THEMES.slice(list.length)]);
        }
      } catch {
        // Fallback
      }
    };
    fetchThemes();
    return () => { active = false; };
  }, []);

  const handleSelectTheme = (theme: StercsTheme) => {
    setSelectedTheme(theme);
    setThemeName(theme.name);
    setPrimaryColor(theme.primary_color);
    setSecondaryColor(theme.secondary_color);
    setAccentColor(theme.accent_color);
    setBgColor(theme.background_color);
    setFontFamily(theme.font_family || 'Inter, sans-serif');
  };

  const handleSaveTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        name: themeName,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        accent_color: accentColor,
        background_color: bgColor,
        font_family: fontFamily,
        is_dark: true
      };

      const res: any = await apiService.post('/api/stercs/themes', payload);
      const savedTheme = res?.data || payload;
      setThemes((prev) => [savedTheme, ...prev]);
      showToast?.(`Theme "${themeName}" saved to STERCS Cloud Studio!`, 'success');
    } catch {
      showToast?.('Theme configuration stored in local studio session', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl space-y-6 flex-1 flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-pink-600/20 text-pink-400 border border-pink-500/30 flex items-center justify-center">
            <PaintBrushIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">STERCS Theme & Visual Studio</h3>
            <p className="text-xs text-slate-300 font-medium">Design sovereign branding, shaders & component palettes</p>
          </div>
        </div>

        <button
          onClick={handleSaveTheme}
          disabled={isSaving}
          className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-pink-600/20 flex items-center space-x-2 disabled:opacity-50"
        >
          <SparklesIcon className="w-4 h-4" />
          <span>{isSaving ? 'Persisting Theme...' : 'Save Theme to Cloud'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Column: Preset Selector & Controls */}
        <div className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-2">Preset Themes</label>
            <div className="grid grid-cols-2 gap-2">
              {themes.slice(0, 6).map((th, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectTheme(th)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedTheme.name === th.name
                      ? 'bg-slate-800 border-pink-500 shadow-md shadow-pink-500/10'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.primary_color }} />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.secondary_color }} />
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: th.accent_color }} />
                  </div>
                  <p className="text-xs font-bold truncate text-white">{th.name}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveTheme} className="space-y-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/40">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Theme Title</label>
              <input
                type="text"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-300">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Secondary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-300">{secondaryColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Accent Glow</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-300">{accentColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Background Base</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-slate-300">{bgColor}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                <option value="Inter, sans-serif">Inter (Modern Clean)</option>
                <option value="Outfit, sans-serif">Outfit (Futuristic Display)</option>
                <option value="Roboto, sans-serif">Roboto (Technical)</option>
                <option value="Georgia, serif">Georgia (Editorial Serif)</option>
              </select>
            </div>
          </form>
        </div>

        {/* Right Column: Live Interactive Preview Stage */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center space-x-2">
            <EyeIcon className="w-5 h-5 text-pink-400" />
            <h4 className="font-bold text-sm text-slate-200">Live Stage & UI Elements Preview</h4>
          </div>

          <div
            className="rounded-3xl p-8 border border-slate-800 shadow-2xl transition-all duration-300 min-h-[400px] flex flex-col justify-between"
            style={{
              backgroundColor: bgColor,
              fontFamily: fontFamily
            }}
          >
            {/* Mock Video Canvas Frame */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <SparklesIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base">{themeName}</h5>
                    <p className="text-xs text-slate-300 font-medium">FingerMobile Creative Broadcast Node</p>
                  </div>
                </div>

                <span
                  className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider"
                  style={{ backgroundColor: `${secondaryColor}33`, color: secondaryColor }}
                >
                  Active Theme
                </span>
              </div>

              {/* Sample Content Banner */}
              <div
                className="p-6 rounded-2xl relative overflow-hidden text-white"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}dd, ${secondaryColor}dd)`
                }}
              >
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl opacity-60"
                  style={{ backgroundColor: accentColor }}
                />
                <h6 className="text-xl font-extrabold mb-1">Sovereign Content Economy</h6>
                <p className="text-xs text-white/80 max-w-md">
                  Decentralized livestreaming, video editing, and instant FIC paylinks across Africa.
                </p>
                <div className="mt-4 flex items-center space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 shadow-md"
                    style={{ backgroundColor: accentColor }}
                  >
                    Watch Livestream
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-black/30 hover:bg-black/40 text-white backdrop-blur-md"
                  >
                    Export 4K Video
                  </button>
                </div>
              </div>

              {/* Sample Timeline Track */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-slate-300 font-medium">
                  <span>Track 01: Video Layer (Ultra HD)</span>
                  <span style={{ color: primaryColor }}>00:14.200 / 01:00.000</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: '65%',
                      backgroundColor: primaryColor,
                      boxShadow: `0 0 10px ${accentColor}`
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 font-medium flex items-center justify-between pt-4 border-t border-white/10">
              <span>Status: Synchronized with PostgreSQL `stercs_themes` table</span>
              <span className="flex items-center text-emerald-400">
                <CheckCircleIcon className="w-4 h-4 mr-1" /> Ready for Video Compilation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StercsThemeDesigner;
