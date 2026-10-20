import React, {} from 'react';
import { Play, Clock, MoreVertical, Heart, Plus } from 'lucide-react';

interface PlaylistVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  views: string;
}

const Dancia4TvPlaylist: React.FC = () => {
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
          <h3 className="text-lg font-bold text-slate-900">Your Playlist</h3>
          <p className="text-xs text-slate-700 font-medium uppercase tracking-tighter mt-0.5">5 Videos • 52 Minutes Total</p>
        </div>
        <button className="p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40">
          <Plus size={20} />
        </button>
      </div>

      <div className="p-2">
        {mockPlaylist.map((video, index) => (
          <div
            key={video.id}
            className="group flex items-center p-3 rounded-2xl hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
          >
            <div className="text-xs font-bold text-gray-600 w-6 group-hover:text-blue-500 transition-colors">
              {String(index + 1).padStart(2, '0')}
            </div>

            <div className="w-16 h-10 bg-gray-800 rounded-lg mx-3 relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <Play size={14} fill="white" className="text-white" />
              </div>
            </div>

            <div className="flex-grow min-w-0 pr-4">
              <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">{video.title}</h4>
              <div className="flex items-center space-x-3 mt-1">
                <span className="text-[10px] font-bold text-gray-500 flex items-center uppercase tracking-tighter">
                  <Clock size={10} className="mr-1" /> {video.duration}
                </span>
                <span className="text-[10px] font-bold text-slate-700 font-bold uppercase tracking-tighter">
                  {video.views} views
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                <Heart size={16} />
              </button>
              <button className="p-1.5 text-gray-500 hover:text-white transition-colors">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-600/5 mt-2">
        <button className="w-full py-3 text-xs font-black text-blue-500 uppercase tracking-[0.2em] hover:text-blue-400 transition-colors">
          View All Library
        </button>
      </div>
    </div>
  );
};

export default Dancia4TvPlaylist;
