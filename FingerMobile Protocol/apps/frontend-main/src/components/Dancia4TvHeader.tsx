import React from 'react';
import { Search, Bell, User, Settings, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Dancia4TvHeaderProps {
  activeNavTab?: string;
  // eslint-disable-next-line no-unused-vars
  onSelectNavTab?: (tab: string) => void;
  onOpenSettings?: () => void;
  onOpenUpload?: () => void;
  onOpenGenres?: () => void;
  searchQuery?: string;
  // eslint-disable-next-line no-unused-vars
  onSearchChange?: (q: string) => void;
}

const Dancia4TvHeader: React.FC<Dancia4TvHeaderProps> = ({
  activeNavTab = 'movies',
  onSelectNavTab,
  onOpenSettings,
  onOpenUpload,
  onOpenGenres,
  searchQuery = '',
  onSearchChange
}) => {
  const navigate = useNavigate();

  const handleNavClick = (tab: string) => {
    if (onSelectNavTab) {
      onSelectNavTab(tab);
    }
  };

  return (
    <header className="flex items-center justify-between py-6 mb-8 border-b border-white/5">
      <div className="flex items-center space-x-10">
        <div
          onClick={() => handleNavClick('movies')}
          className="flex items-center space-x-2 group cursor-pointer"
        >
          <div className="w-10 h-10 bg-slate-900 border border-blue-500/40 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-110 transition-transform overflow-hidden p-1 shrink-0">
            <img src="/assets/logos/dancia4tv_logo.png" alt="Dancia-4Tv" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">DANCIA-4Tv{'\u00AE\u2122\u00A9'}</h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Live & OTT 4K Stream</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => handleNavClick('movies')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors py-1 border-b-2 ${
              activeNavTab === 'movies' ? 'text-blue-400 border-blue-500' : 'text-slate-200 border-transparent hover:text-white'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => handleNavClick('tv-shows')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors py-1 border-b-2 ${
              activeNavTab === 'tv-shows' ? 'text-blue-400 border-blue-500' : 'text-slate-200 border-transparent hover:text-white'
            }`}
          >
            TV Shows
          </button>
          <button
            onClick={() => handleNavClick('live')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors py-1 border-b-2 ${
              activeNavTab === 'live' ? 'text-blue-400 border-blue-500' : 'text-slate-200 border-transparent hover:text-white'
            }`}
          >
            Live TV
          </button>
          <button
            onClick={() => handleNavClick('sports')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors py-1 border-b-2 ${
              activeNavTab === 'sports' ? 'text-blue-400 border-blue-500' : 'text-slate-200 border-transparent hover:text-white'
            }`}
          >
            Sports
          </button>
          <button
            onClick={() => handleNavClick('vod-models')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors py-1 border-b-2 ${
              activeNavTab === 'vod-models' ? 'text-amber-400 border-amber-500' : 'text-slate-200 border-transparent hover:text-amber-300'
            }`}
          >
            Video on Demand (VoD)
          </button>
          <button
            onClick={() => handleNavClick('ai-movies')}
            className={`text-xs font-bold uppercase tracking-widest transition-colors py-1 border-b-2 ${
              activeNavTab === 'ai-movies' ? 'text-purple-400 border-purple-500' : 'text-slate-200 border-transparent hover:text-purple-300'
            }`}
          >
            AI Movies Studios (19 Channels)
          </button>
          {onOpenGenres && (
            <button
              onClick={onOpenGenres}
              className="text-xs font-bold px-2.5 py-1 rounded bg-white/10 border border-white/20 text-slate-100 hover:text-slate-700 hover:bg-white/20 transition-colors uppercase tracking-wider"
            >
              Genres
            </button>
          )}
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-900/30 transition-all hover:scale-105"
          >
            <span>+</span>
            <span>Upload Movie / Video</span>
          </button>
        )}

        <div className="hidden lg:flex items-center bg-white/10 border border-white/20 rounded-full px-4 py-2 w-64 focus-within:w-80 focus-within:border-blue-500/50 transition-all">
          <Search size={18} className="text-slate-700" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search films, VoD, AI channels..."
            className="bg-transparent border text-sm text-slate-900 focus:ring-0 w-full ml-3 outline-none placeholder:text-slate-400 font-bold border-slate-300 rounded"
          />
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => navigate('/notifications')}
            className="p-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all relative"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-gray-900"></span>
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            title="Dancia App Settings"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => navigate('/security-setup')}
            className="p-2.5 text-slate-200 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            title="Security Center"
          >
            <Shield size={20} />
          </button>
        </div>

        <div
          onClick={() => navigate('/profile')}
          className="flex items-center space-x-3 pl-4 border-l border-white/10 cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">Mbah Obinna</p>
            <p className="text-[10px] text-blue-500 font-bold uppercase">Pro Member</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg">
            <div className="w-full h-full bg-gray-900 rounded-[10px] flex items-center justify-center overflow-hidden">
              <User size={20} className="text-blue-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Dancia4TvHeader;
