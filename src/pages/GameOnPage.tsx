import React, { useEffect, useState, useMemo } from 'react';
import { useAppContext } from "../contexts/AppContext";
import { logError } from '../utils/errorLogger';
import MainLayout from '../components/layout/MainLayout';
import { ApiService } from '../services/apiService';
import { playAudio } from '../utils/audioPlayer';
import { VoiceLine } from '../types';
import type { Game } from '../types';
import { 
  PlayIcon,
  TrophyIcon, 
  UserGroupIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  FireIcon
} from '../icons';

const GameOnPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voiceLines, setVoiceLines] = useState<VoiceLine[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'new' | 'free'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchVoiceLines = async () => {
      try {
        // Mock voice lines fetch - ApiService.voices not implemented
        setVoiceLines([]);
      } catch (error) {
        logError("Failed to fetch voice lines:", { context: 'GameOnPage - fetchVoiceLines', error });
      }
    };

    fetchVoiceLines();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoadingGames(true);
        const data = await ApiService.getGames<Game[]>();
        setGames(data || []);
      } catch (err) {
        setError('Failed to fetch games.');
        logError('Failed to fetch games:', { context: 'GameOnPage - fetchGames', error: err });
      } finally {
        setLoadingGames(false);
      }
    };

    fetchGames();
  }, []);

  // Define extended game interface for optional properties
  interface ExtendedGame extends Game {
    isTrending?: boolean;
    isNew?: boolean;
    price?: number;
    players?: number;
    duration?: string;
  }

  // Filter games based on active tab and search term
  const filteredGames = useMemo(() => {
    let result = [...games] as ExtendedGame[];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(game => 
        (game.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter with proper typing
    if (activeTab === 'trending') {
      result = result.filter(game => game.isTrending);
    } else if (activeTab === 'new') {
      result = result.filter(game => game.isNew);
    } else if (activeTab === 'free') {
      result = result.filter(game => game.price === 0);
    }
    
    return result;
  }, [games, activeTab, searchTerm]);

  return (
    <MainLayout pageTitle="Game On">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
              <PlayIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">Game On</h1>
              <p className="text-gray-600">Play and share games with the community</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg 
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          
          <button
            onClick={() => {
              if (voiceLines.length > 0) {
                const randomIndex = Math.floor(Math.random() * voiceLines.length);
                playAudio(voiceLines[randomIndex].audioUrl);
              } else {
                showToast("No voice lines available.", "info");
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 flex items-center justify-center"
          >
            <FireIcon className="h-5 w-5 mr-2" />
            Play Voice
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: 'all', label: 'All Games', icon: PlayIcon },
              { id: 'trending', label: 'Trending', icon: FireIcon },
              { id: 'new', label: 'New Releases', icon: TrophyIcon },
              { id: 'free', label: 'Free to Play', icon: CurrencyDollarIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
        
        {loadingGames ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading games...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-red-500">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🎮</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Games Found</h2>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No games match your search for "${searchTerm}". Try a different query.`
                : `No ${activeTab} games available. Check back later for new releases!`}
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setActiveTab('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              View All Games
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Your FIC Balance</h2>
                  <p className="text-2xl font-bold mt-1">{ficBalance.toFixed(2)} FIC</p>
                </div>
                <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Deposit FIC
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGames.map(game => (
                <div key={String(game.id)} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"> {/* Ensure ID is string */}
                  <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {game.price === 0 ? 'FREE' : `$${game.price || 0}`}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-900">{game.title || 'Untitled Game'}</h3> {/* Handle potentially missing title */}
                      {game.isTrending && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FireIcon className="h-3 w-3 mr-1" />
                          Trending
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-gray-600 text-sm">{game.description || 'No description available'}</p> {/* Handle potentially missing description */}
                    
                    <div className="mt-4 flex items-center text-sm text-gray-500">
                      <div className="flex items-center mr-4">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        <span>{game.players || 0} players</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{game.duration || '?'} min</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Play Now
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" aria-label="Button"><svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default GameOnPage;