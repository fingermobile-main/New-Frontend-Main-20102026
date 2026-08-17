import React, {} from 'react';
import { 
  Grid, List, LayoutGrid, Heart, SortAsc, 
  Layers, Music, Video as VideoIcon 
} from 'lucide-react';

export type DisplayMode = 'grid' | 'list' | 'mosaic';
export type SortCriteria = 'name' | 'number' | 'size';

interface DisplaySettingsProps {
  currentMode: DisplayMode;
  onModeChange: (mode: DisplayMode) => void;
  showFavoritesOnly?: boolean;
  onToggleFavorites?: () => void;
  groupVideos?: boolean;
  onToggleGroupVideos?: () => void;
  groupAudio?: boolean;
  onToggleGroupAudio?: () => void;
  sortCriteria?: SortCriteria;
  onSortChange?: (criteria: SortCriteria) => void;
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
            onClick={() => onModeChange(mode.id as DisplayMode)}
            className={`p-2.5 rounded-lg transition-all ${currentMode === mode.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white'}`}
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
          onClick={onToggleFavorites}
          className={`p-2.5 rounded-xl transition-all ${showFavoritesOnly ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'text-gray-500 hover:text-white bg-white/5 border border-transparent'}`}
          title="Show Favorites Only"
        >
          <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
        </button>
        
        <button
          onClick={onToggleGroupVideos}
          className={`p-2.5 rounded-xl transition-all ${groupVideos ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-gray-500 hover:text-white bg-white/5 border border-transparent'}`}
          title="Group Videos"
        >
          <VideoIcon size={16} />
        </button>

        <button
          onClick={onToggleGroupAudio}
          className={`p-2.5 rounded-xl transition-all ${groupAudio ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'text-gray-500 hover:text-white bg-white/5 border border-transparent'}`}
          title="Group Audio Files"
        >
          <Music size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-white/10 hidden md:block" />

      {/* Sort Select */}
      <div className="flex items-center space-x-2 bg-white/5 px-3 py-1 rounded-xl group hover:bg-white/10 transition-all cursor-pointer">
        <SortAsc size={14} className="text-gray-500" />
        <select 
          value={sortCriteria}
          onChange={(e) => onSortChange?.(e.target.value as SortCriteria)}
          className="bg-transparent border-none text-[10px] font-black text-white focus:ring-0 uppercase tracking-widest cursor-pointer"
        >
          <option value="name">Name A-Z</option>
          <option value="number">Track No.</option>
          <option value="size">File Size</option>
        </select>
      </div>
    </div>
  );
};

export default DisplaySettings;
