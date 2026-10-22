import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, MoreVertical, Heart, Plus } from 'lucide-react';

interface PlaylistVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
}

const Dancia4TvPlaylist: React.FC = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string>('1');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const mockPlaylist: PlaylistVideo[] = [
    { id: '1', title: 'The Future of AI Protocol', duration: '12:45', thumbnail: '', views: '2.4M' },
    { id: '2', title: 'FingerMobile Ecosystem 2026', duration: '08:12', thumbnail: '', views: '1.2M' },
    { id: '3', title: 'Dancia-4Tv Premium Features', duration: '15:30', thumbnail: '', views: '850K' },
    { id: '4', title: 'BeatwaveNG Integration Guide', duration: '05:45', thumbnail: '', views: '420K' },
    { id: '5', title: 'Global Connectivity Report', duration: '10:20', thumbnail: '', views: '1.1M' }
  ];

  return (
    <div className="bg-gray-900/50 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-md">
      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
        <div>
          <h3 className="text-lg font-bold text-white">Your Playlist</h3>
          <p className="text-xs text-slate-300 font-medium uppercase tracking-tighter mt-0.5">5 Videos • 52 Minutes Total</p>
        </div>
        <button
          type="button"
          aria-label="Add video to playlist"
          onClick={() => setIsAdding(!isAdding)}
          className={`p-2 rounded-xl text-white transition-colors shadow-lg ${
            isAdding ? 'bg-blue-700 shadow-blue-900/60' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/40'
          }`}
        >
          <Plus size={20} className={isAdding ? 'rotate-45 transition-transform' : 'transition-transform'} />
        </button>
      </div>

      <div className="p-2 space-y-1">
        {mockPlaylist.map((video, index) => {
          const isSelected = selectedVideoId === video.id;
          const isFav = !!favorites[video.id];

          return (
            <div
              key={video.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedVideoId(video.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedVideoId(video.id);
                }
              }}
              aria-label={`Play ${video.title}`}
              className={`w-full text-left group flex items-center p-3 rounded-2xl transition-all border cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500/40 text-white'
                  : 'hover:bg-white/5 border-transparent hover:border-white/5 text-slate-200'
              }`}
            >
              <div className={`text-xs font-bold w-6 transition-colors ${isSelected ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'}`}>
                {String(index + 1).padStart(2, '0')}
              </div>

              <div className="w-16 h-10 bg-gray-800 rounded-lg mx-3 relative overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20"></div>
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity bg-black/40 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <Play size={14} fill="white" className="text-white" />
                </div>
              </div>

              <div className="flex-grow min-w-0 pr-4">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">{video.title}</h4>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center uppercase tracking-tighter">
                    <Clock size={10} className="mr-1" /> {video.duration}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    {video.views} views
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(video.id);
                  }}
                  className={`p-1.5 transition-colors ${isFav ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-red-400'}`}
                >
                  <Heart size={16} fill={isFav ? 'currentColor' : 'none'} />
                </button>
                <button
                  type="button"
                  aria-label="More video options"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-blue-600/5 mt-2">
        <Link
          to="/dancia4tv"
          className="block w-full text-center py-3 text-xs font-black text-blue-500 uppercase tracking-[0.2em] hover:text-blue-400 transition-colors"
        >
          View All Library
        </Link>
      </div>
    </div>
  );
};

export default Dancia4TvPlaylist;
