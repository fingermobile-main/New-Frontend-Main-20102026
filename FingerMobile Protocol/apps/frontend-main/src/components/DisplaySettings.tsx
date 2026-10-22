import React from 'react';
import {
  Grid, List, LayoutGrid, Heart, SortAsc,
  Music, Video as VideoIcon
} from 'lucide-react';

export type DisplayMode = 'grid' | 'list' | 'mosaic';
export type SortCriteria = 'name' | 'number' | 'size';

interface DisplaySettingsProps {
  currentMode: DisplayMode;
  onModeChange: (_mode: DisplayMode) => void;
  showFavoritesOnly?: boolean;
  onToggleFavorites?: () => void;
  groupVideos?: boolean;
  onToggleGroupVideos?: () => void;
  groupAudio?: boolean;
  onToggleGroupAudio?: () => void;
  sortCriteria?: SortCriteria;
  onSortChange?: (_criteria: SortCriteria) => void;
}

const DisplaySettings: React.FC<DisplaySettingsProps> = ({
  currentMode,
  onModeChange,
  showFavoritesOnly = false,
  onToggleFavorites,
  groupVideos = false,
  onToggleGroupVideos,
  groupAudio = false,
  onToggleGroupAudio,
  sortCriteria = 'name',
  onSortChange
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 bg-gray-950/80 p-2 rounded-[1.5rem] border border-white/5 backdrop-blur-md">
      {/* Mode Select */}
      <div className="flex bg-white/5 p-1 rounded-xl">
        {[
          { id: 'grid', icon: <Grid size={16} />, title: 'Grid' },
          { id: 'list', icon: <List size={16} />, title: 'List' },
          { id: 'mosaic', icon: <LayoutGrid size={16} />, title: 'Mosaic' }
        ].map(mode => (
          <button
            key={mode.id}
            type="button"
            aria-label={mode.title}
            onClick={() => onModeChange(mode.id as DisplayMode)}
            className={`p-2.5 rounded-lg transition-all ${currentMode === mode.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-300 font-medium hover:text-white'}`}
            title={mode.title}
          >
            {mode.icon}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-white/10 hidden sm:block" />

      {/* Filters & Grouping */}
      <div className="flex items-center space-x-1">
        <button
          type="button"
          aria-label="Show Favorites Only"
          onClick={onToggleFavorites}
          className={`p-2.5 rounded-xl transition-all ${showFavoritesOnly ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'text-slate-300 font-medium hover:text-white bg-white/5 border border-transparent'}`}
          title="Show Favorites Only"
        >
          <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
        </button>

        <button
          type="button"
          aria-label="Group Videos"
          onClick={onToggleGroupVideos}
          className={`p-2.5 rounded-xl transition-all ${groupVideos ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 font-medium hover:text-white bg-white/5 border border-transparent'}`}
          title="Group Videos"
        >
          <VideoIcon size={16} />
        </button>

        <button
          type="button"
          aria-label="Group Audio Files"
          onClick={onToggleGroupAudio}
          className={`p-2.5 rounded-xl transition-all ${groupAudio ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'text-slate-300 font-medium hover:text-white bg-white/5 border border-transparent'}`}
          title="Group Audio Files"
        >
          <Music size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-white/10 hidden md:block" />

      {/* Sort Select */}
      <label htmlFor="sort-criteria" className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-xl group hover:bg-white/10 transition-all cursor-pointer">
        <SortAsc size={14} className="text-slate-300 group-hover:text-white" />
        <select
          id="sort-criteria"
          aria-label="Sort criteria"
          value={sortCriteria}
          onChange={(e) => onSortChange?.(e.target.value as SortCriteria)}
          className="bg-transparent border-none text-[10px] font-black text-slate-100 focus:ring-0 uppercase tracking-widest cursor-pointer font-bold border border-slate-700 rounded"
        >
          <option value="name" className="bg-gray-900 text-white">Name A-Z</option>
          <option value="number" className="bg-gray-900 text-white">Track No.</option>
          <option value="size" className="bg-gray-900 text-white">File Size</option>
        </select>
      </label>
    </div>
  );
};

export default DisplaySettings;
