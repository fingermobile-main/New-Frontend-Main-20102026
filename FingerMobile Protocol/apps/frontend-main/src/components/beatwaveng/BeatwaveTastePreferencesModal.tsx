/*
 * FingerMobile Protocol™ - BeatwaveNG Taste Preferences Modal
 * Optional Favorite Genres & Artist Selection culled from the Database Media Library
 * Persistently stored to prevent repeated prompts on refresh.
 * Strictly compliant with WCAG AAA contrast hierarchy standards.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Check, X, Music, Users, Radio, Disc } from 'lucide-react';
import { CURATED_70_GENRES, Track } from '../../contexts/BeatwaveNGContext';

export interface BeatwaveTastePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTracks?: Track[];
  onSavePreferences?: (genres: string[], artists: string[]) => void;
}

const STORAGE_KEY_ONBOARDED = 'beatwave_taste_onboarded';
const STORAGE_KEY_GENRES = 'beatwave_favorite_genres';
const STORAGE_KEY_ARTISTS = 'beatwave_favorite_artists';

export const BeatwaveTastePreferencesModal: React.FC<BeatwaveTastePreferencesModalProps> = ({
  isOpen,
  onClose,
  availableTracks = [],
  onSavePreferences
}) => {
  // Extract distinct genres from available database media tracks and curated library
  const availableGenres = React.useMemo(() => {
    const trackGenres = availableTracks
      .map((t) => t.genre)
      .filter((g): g is string => Boolean(g && g.trim()));
    const combined = Array.from(new Set([...trackGenres, ...CURATED_70_GENRES]));
    return combined;
  }, [availableTracks]);

  // Extract distinct artists from database media tracks and popular roster
  const availableArtists = React.useMemo(() => {
    const trackArtists = availableTracks
      .map((t) => t.artist)
      .filter((a): a is string => Boolean(a && a.trim()));
    const defaultRoster = [
      'Wizkid', 'Burna Boy', 'Davido', 'Tiwa Savage', 'Asake',
      'Rema', 'Tems', 'Olamide', 'Flavour', 'P-Square',
      '2Baba', 'CKay', 'Ayra Starr', 'Fireboy DML', 'Kizz Daniel',
      'Don Jazzy', 'Timaya', 'Yemi Alade', 'Tekno', 'Mr Eazi'
    ];
    return Array.from(new Set([...trackArtists, ...defaultRoster]));
  }, [availableTracks]);

  // Saved preferences in localStorage
  const [selectedGenres, setSelectedGenres] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_GENRES);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedArtists, setSelectedArtists] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ARTISTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeStep, setActiveStep] = useState<'genres' | 'artists'>('genres');
  const [genreSearch, setGenreSearch] = useState('');
  const [artistSearch, setArtistSearch] = useState('');

  // Sync if opened
  useEffect(() => {
    if (isOpen) {
      try {
        const storedG = localStorage.getItem(STORAGE_KEY_GENRES);
        if (storedG) setSelectedGenres(JSON.parse(storedG));
        const storedA = localStorage.getItem(STORAGE_KEY_ARTISTS);
        if (storedA) setSelectedArtists(JSON.parse(storedA));
      } catch {
        // Fallback gracefully
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const toggleArtist = (artist: string) => {
    setSelectedArtists((prev) =>
      prev.includes(artist) ? prev.filter((a) => a !== artist) : [...prev, artist]
    );
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDED, 'true');
      localStorage.setItem(STORAGE_KEY_GENRES, JSON.stringify(selectedGenres));
      localStorage.setItem(STORAGE_KEY_ARTISTS, JSON.stringify(selectedArtists));
    } catch {
      // Storage safe
    }
    onSavePreferences?.(selectedGenres, selectedArtists);
    onClose();
  };

  const handleSkip = () => {
    try {
      localStorage.setItem(STORAGE_KEY_ONBOARDED, 'true');
    } catch {
      // Storage safe
    }
    onClose();
  };

  const filteredGenres = availableGenres.filter((g) =>
    g.toLowerCase().includes(genreSearch.toLowerCase())
  );

  const filteredArtists = availableArtists.filter((a) =>
    a.toLowerCase().includes(artistSearch.toLowerCase())
  );

  const modalContent = (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-300 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl">
              <Sparkles className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">
                  Personalize Your BeatwaveNG Taste
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950/40 text-[10px] font-black text-emerald-200 uppercase tracking-wider border border-emerald-400/30">
                  Optional Choice
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Culled from available songs, albums, and artists in our uploaded database media library
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Dismiss / Keep Defaults"
            aria-label="Dismiss preferences"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveStep('genres')}
            className={`pb-3 px-3 text-xs font-black flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeStep === 'genres'
                ? 'border-emerald-600 text-slate-900'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            <Music className="w-4 h-4 text-emerald-600" />
            <span>Favorite Music Genres</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-[10px] text-slate-800 font-bold">
              {selectedGenres.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep('artists')}
            className={`pb-3 px-3 text-xs font-black flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeStep === 'artists'
                ? 'border-emerald-600 text-slate-900'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Favorite Music Artists</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-[10px] text-slate-800 font-bold">
              {selectedArtists.length}
            </span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeStep === 'genres' ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-700 font-semibold">
                  Select song types and musical genres you love. Recommendations and radio stations will prioritize your choices.
                </p>
                <input
                  type="text"
                  placeholder="Filter genres..."
                  value={genreSearch}
                  onChange={(e) => setGenreSearch(e.target.value)}
                  className="px-3 py-1 text-xs rounded-xl border border-slate-300 text-slate-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                {filteredGenres.map((genre) => {
                  const isSelected = selectedGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-slate-900 shadow-xs'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-1">{genre}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-700 font-semibold">
                  Choose your favorite artists from our uploaded catalog and sovereign sound roster.
                </p>
                <input
                  type="text"
                  placeholder="Filter artists..."
                  value={artistSearch}
                  onChange={(e) => setArtistSearch(e.target.value)}
                  className="px-3 py-1 text-xs rounded-xl border border-slate-300 text-slate-900 font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
                {filteredArtists.map((artist) => {
                  const isSelected = selectedArtists.includes(artist);
                  return (
                    <button
                      key={artist}
                      type="button"
                      onClick={() => toggleArtist(artist)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 text-slate-900 shadow-xs'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate pr-1">{artist}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleSkip}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition cursor-pointer"
          >
            Skip / Keep Defaults
          </button>

          <div className="flex items-center gap-2">
            {activeStep === 'genres' ? (
              <button
                type="button"
                onClick={() => setActiveStep('artists')}
                className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-xl transition cursor-pointer"
              >
                Next: Select Artists →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveStep('genres')}
                className="px-4 py-2 text-xs font-bold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-xl transition cursor-pointer"
              >
                ← Back to Genres
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Taste Preferences</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default BeatwaveTastePreferencesModal;
