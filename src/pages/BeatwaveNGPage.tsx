import React from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Search, Heart, 
  MoreVertical, Music, Disc, Mic2, Radio, Plus, Share2, 
  Download, ListMusic, BrainCircuit, ShieldCheck, Settings, Activity
} from 'lucide-react';
import { useAppContext } from "../contexts/AppContext";
import DisplaySettings, { DisplayMode, SortCriteria } from '../components/DisplaySettings';
import DanciaAppSettings from '../components/DanciaAppSettings';
import Dancia4TvControls from '../components/Dancia4TvControls';
import MainLayout from '../components/layout/MainLayout';
import { MusicalNoteIcon } from '../icons';

const BeatwaveNGPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const [activeTab, setActiveTab] = React.useState('discover');
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>('grid');
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
  const [groupVideos, setGroupVideos] = React.useState(false);
  const [groupAudio, setGroupAudio] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<SortCriteria>('name');

  const mockTracks = [
    { id: 1, title: 'Summer Vibes', artist: 'DJ Pulse', duration: '3:45', plays: '1.2M', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=500&q=80' },
    { id: 2, title: 'Midnight Dreams', artist: 'Luna Eclipse', duration: '4:20', plays: '980K', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=500&q=80' },
    { id: 3, title: 'Electric Pulse', artist: 'Neon Waves', duration: '3:15', plays: '2.1M', cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=500&q=80' },
    { id: 4, title: 'City Lights', artist: 'Urban Beat', duration: '3:55', plays: '3.4M', cover: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=500&q=80' }
  ];

  return (
    <MainLayout pageTitle="Beatwave NG">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                BEATWAVE-NG
              </h1>
              <p className="text-gray-600 mt-1">
                Pure Auditory Excellence
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-900/40">
                    <Disc className="text-white animate-spin-slow" size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tighter text-gray-900">BEATWAVE-NG</h1>
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em]">Pure Auditory Excellence</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="flex-grow md:w-80 relative group">
                  <Search className="absolute left-4 top-3 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search artists, tracks..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none transition-all" />
                </div>
                <button 
                  onClick={() => setShowSettingsModal(true)}
                  className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <Settings size={20} className="text-gray-400" />
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar Navigation */}
              <aside className="lg:col-span-3 space-y-8">
                <nav className="space-y-2">
                  {[
                    { id: 'discover', label: 'Discover', icon: <Music size={18} /> },
                    { id: 'trending', label: 'Trending', icon: <Activity size={18} /> },
                    { id: 'library', label: 'My Library', icon: <ListMusic size={18} /> },
                    { id: 'live', label: 'Live Radio', icon: <Radio size={18} /> }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>

                <div className="p-6 bg-indigo-600/10 border border-indigo-500/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center space-x-3">
                    <BrainCircuit className="text-indigo-400" size={20} />
                    <h3 className="text-sm font-bold text-white uppercase tracking-tight">AI Curated</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Our Harmonizer AI is currently processing your musical preferences to create your unique "Echo Wave" playlist.
                  </p>
                  <button className="w-full py-3 bg-indigo-600 text-white text-[10px] font-black rounded-xl hover:bg-indigo-500 transition-colors uppercase tracking-[0.2em]">
                    Initialize Echo
                  </button>
                </div>
              </aside>

              {/* Main Feed */}
              <main className="lg:col-span-9 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <h2 className="text-xl font-black tracking-tight text-gray-900 capitalize">{activeTab}</h2>
                  <div className="flex flex-wrap items-center gap-4">
                    <Dancia4TvControls />
                    <DisplaySettings 
                      currentMode={displayMode} 
                      onModeChange={setDisplayMode}
                      showFavoritesOnly={showFavoritesOnly}
                      onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      groupVideos={groupVideos}
                      onToggleGroupVideos={() => setGroupVideos(!groupVideos)}
                      groupAudio={groupAudio}
                      onToggleGroupAudio={() => setGroupAudio(!groupAudio)}
                      sortCriteria={sortBy}
                      onSortChange={setSortBy}
                    />
                  </div>
                </div>

                <div className={`grid gap-6 ${displayMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : displayMode === 'mosaic' ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
                  {mockTracks.map((track) => (
                    <div 
                      key={track.id} 
                      className={`group relative bg-white/5 border border-white/5 rounded-[2rem] overflow-hidden hover:border-indigo-500/30 transition-all ${displayMode === 'list' ? 'flex items-center p-4' : 'p-2'}`}
                    >
                      <div className={`relative overflow-hidden rounded-[1.5rem] ${displayMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square mb-4'}`}>
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"  />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-black scale-75 group-hover:scale-100 transition-transform shadow-xl">
                            <Play fill="black" size={24} className="ml-1" />
                          </button>
                        </div>
                      </div>

                      <div className={`${displayMode === 'list' ? 'ml-6 flex-grow' : 'px-4 pb-4'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 truncate">{track.title}</h3>
                            <p className="text-xs text-gray-500 font-medium">{track.artist}</p>
                          </div>
                          <button className="text-gray-500 hover:text-red-500 transition-colors">
                            <Heart size={18} />
                          </button>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                          <span className="flex items-center"><Play size={10} className="mr-1" /> {track.plays}</span>
                          <span>{track.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MusicalNoteIcon className="h-5 w-5 text-purple-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-pink-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Music Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-pink-50 transition-colors flex items-center">
                  <MusicalNoteIcon className="h-5 w-5 text-purple-600 mr-3" />
                  Upload Track
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-pink-50 transition-colors flex items-center">
                  Create Playlist
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-pink-50 transition-colors flex items-center">
                  Buy Premium
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Music Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Discover new artists</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Create custom playlists</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Stream ad-free</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mini Player */}
        <div className="fixed bottom-8 left-8 right-8 bg-gray-900/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 flex items-center justify-between shadow-2xl z-40">
          <div className="flex items-center space-x-4 w-1/4">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl overflow-hidden shadow-lg">
              <img src={mockTracks[0].cover} alt="Track cover" className="w-full h-full object-cover"  />
            </div>
            <div className="hidden sm:block">
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">Summer Vibes</h4>
              <p className="text-[10px] text-gray-500 font-bold">DJ Pulse</p>
            </div>
          </div>

          <div className="flex flex-col items-center flex-grow max-w-xl">
            <div className="flex items-center space-x-8 mb-2">
              <button className="text-gray-500 hover:text-white transition-colors"><SkipBack size={20} /></button>
              <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                <Play fill="black" size={24} className="ml-1" />
              </button>
              <button className="text-gray-500 hover:text-white transition-colors"><SkipForward size={20} /></button>
            </div>
            <div className="w-full flex items-center space-x-3">
              <span className="text-[10px] font-mono text-gray-500">1:24</span>
              <div className="flex-grow h-1 bg-white/10 rounded-full relative">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-indigo-500 rounded-full"></div>
              </div>
              <span className="text-[10px] font-mono text-gray-500">3:45</span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-6 w-1/4">
            <div className="hidden md:flex items-center space-x-3">
              <Volume2 size={18} className="text-gray-500" />
              <div className="w-20 h-1 bg-white/10 rounded-full">
                <div className="h-full w-1/2 bg-indigo-500 rounded-full"></div>
              </div>
            </div>
            <button className="text-gray-500 hover:text-white"><ListMusic size={20} /></button>
            <button className="text-gray-500 hover:text-indigo-400"><ShieldCheck size={20} /></button>
          </div>
        </div>
        {showSettingsModal && <DanciaAppSettings onClose={() => setShowSettingsModal(false)} />}
      </div>
    </MainLayout>
  );
};

export default BeatwaveNGPage;