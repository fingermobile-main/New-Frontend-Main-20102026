import React, { useState } from 'react';
import { MagnifyingGlassIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

interface MusicSearchProps {
  onSearch?: (query: string) => void;
  onSelect?: (track: any) => void;
}

const MusicSearch: React.FC<MusicSearchProps> = ({ onSearch, onSelect }) => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<any[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      // Mock results
      setResults([
        { id: '1', title: 'Summer Vibes', artist: 'DJ Cool', duration: '3:45' },
        { id: '2', title: 'Night Drive', artist: 'Synthwave', duration: '4:20' },
        { id: '3', title: 'Acoustic Dreams', artist: 'Guitar Master', duration: '3:15' }
      ]);
      onSearch?.(query);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-300 p-6">
      <div className="flex items-center gap-2 mb-4">
        <MusicalNoteIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Music Search</h3>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            placeholder="Search for tracks, artists..."
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-slate-600" />
        </div>

        <button
          onClick={handleSearch}
          disabled={!query.trim() || isSearching}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>

        {results.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {results.map((track) => (
              <button
                key={track.id}
                onClick={() => onSelect?.(track)}
                className="w-full p-3 text-left border border-slate-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-gray-900">{track.title}</p>
                <p className="text-sm text-slate-700">{track.artist} • {track.duration}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicSearch;
