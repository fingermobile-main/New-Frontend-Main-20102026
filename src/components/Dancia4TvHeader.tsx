import React, {} from 'react';
import { Search, Bell, User, Settings, Play, Shield } from 'lucide-react';

interface Dancia4TvHeaderProps {
  onOpenSettings?: () => void;
}

const Dancia4TvHeader: React.FC<Dancia4TvHeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="flex items-center justify-between py-6 mb-8 border-b border-white/5">
      <div className="flex items-center space-x-10">
        <div className="flex items-center space-x-2 group cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 group-hover:scale-110 transition-transform">
            <Play fill="white" size={20} className="text-white ml-1" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">DANCIA-4Tv</h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Premium Streaming</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <button className="text-sm font-bold text-white hover:text-blue-400 transition-colors uppercase tracking-widest">Movies</button>
          <button className="text-sm font-bold text-gray-500 hover:text-blue-400 transition-colors uppercase tracking-widest">TV Shows</button>
          <button className="text-sm font-bold text-gray-500 hover:text-blue-400 transition-colors uppercase tracking-widest">Live</button>
          <button className="text-sm font-bold text-gray-500 hover:text-blue-400 transition-colors uppercase tracking-widest">Sports</button>
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 w-64 focus-within:w-80 focus-within:border-blue-500/50 transition-all">
          <Search size={18} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search favorites..." 
            className="bg-transparent border-0 text-sm text-white focus:ring-0 w-full ml-3" />
        </div>

        <div className="flex items-center space-x-1">
          <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-gray-900"></span>
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <Settings size={20} />
          </button>
          <button className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
            <Shield size={20} />
          </button>
        </div>

        <div className="flex items-center space-x-3 pl-4 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white">Mbah Obinna</p>
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
