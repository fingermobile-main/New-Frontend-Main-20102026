import React, { useState } from 'react';
import { SparklesIcon } from '@heroicons/react/24/outline';

interface AIPlaylistGeneratorProps {
  onGenerate?: (playlistData: any) => void;
}

const AIPlaylistGenerator: React.FC<AIPlaylistGeneratorProps> = ({ onGenerate }) => {
  const [mood, setMood] = React.useState('energetic');
  const [genre, setGenre] = React.useState('pop');
  const [duration, setDuration] = React.useState('30');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onGenerate?.({ mood, genre, duration });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-6">
        <SparklesIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900">AI Playlist Generator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900 font-bold border-slate-300 bg-white"
          >
            <option value="energetic">Energetic</option>
            <option value="relaxed">Relaxed</option>
            <option value="focused">Focused</option>
            <option value="romantic">Romantic</option>
            <option value="melancholic">Melancholic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900 font-bold border-slate-300 bg-white"
          >
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="hip-hop">Hip Hop</option>
            <option value="electronic">Electronic</option>
            <option value="jazz">Jazz</option>
            <option value="classical">Classical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900 font-bold border-slate-300 bg-white"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generate Playlist
            </>
          )}
        </button>

        <p className="text-xs text-slate-700 text-center">
          AI will curate the perfect playlist based on your preferences
        </p>
      </div>
    </div>
  );
};

export default AIPlaylistGenerator;
