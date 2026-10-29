import React from 'react';
import { useEffect, useState } from 'react';
/*
 * FingerMobile Protocol™ - Dancia4Tv Streaming Platform Page
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { useAppContext } from '../contexts/AppContext';
import { Dancia4TvProvider } from '../contexts/Dancia4TvContext';
import { useDancia4TvData } from '../hooks/useDancia4Tv';
import { DanciaVideo as Video, DanciaSubscriptionPlan as SubscriptionPlan } from '../types/dancia4tv';
import '../styles/Dancia4TvPage.css';
import Dancia4TvHeader from '../components/Dancia4TvHeader';
import Dancia4TvFooter from '../components/Dancia4TvFooter';
import DanciaAppSettings from '../components/DanciaAppSettings';
import { Play, Plus, Info, Sparkles, Film, Star, Compass, Flame } from 'lucide-react';
import apiService from '../services/apiService';
import { CURATED_DANCIA_MOVIES, DANCIA_REGIONAL_CATEGORIES, DanciaMovie } from '../data/dancia4tvMovies';
import { UniversalDiscoveryHub } from '../components/common/discovery/UniversalDiscoveryHub';

// Define local types
interface GenreHierarchy {
  name: string;
  subGenres: string[];
}

interface VodCategorySample {
  modelType: 'SVoD' | 'TVoD' | 'AVoD' | 'HVoD' | 'YouTube Embed';
  title: string;
  description: string;
  priceTag: string;
  badgeColor: string;
  samples: any[];
}

interface AiStudioChannel {
  id: string;
  name: string;
  category: string;
  description: string;
  banner: string;
  isAgeRestricted?: boolean;
  movies: DanciaMovie[];
}

// Import data arrays from the data file
import { VOD_MODEL_SAMPLES, AI_MOVIE_STUDIO_CHANNELS } from '../data/dancia4tvMovies';

const DANCIA_GENRES_HIERARCHY: GenreHierarchy[] = [
  { name: 'Action', subGenres: ['Thriller', 'Martial Arts', 'War'] },
  { name: 'Drama', subGenres: ['Historical', 'Melodrama', 'Political'] },
  { name: 'Comedy', subGenres: ['Romantic Comedy', 'Satire', 'Slapstick'] },
  { name: 'Crime', subGenres: ['Heist', 'Detective', 'Gangster'] },
  { name: 'Animation', subGenres: ['CGI', 'Traditional', 'Stop Motion'] },
  { name: 'Documentary', subGenres: ['Biographical', 'Historical', 'Nature'] },
  { name: 'Horror', subGenres: ['Supernatural', 'Slasher', 'Psychological'] },
  { name: 'Science Fiction', subGenres: ['Space Opera', 'Cyberpunk', 'Time Travel'] },
  { name: 'Romance', subGenres: ['Romantic Comedy', 'Period Romance', 'Contemporary'] },
  { name: 'Adventure', subGenres: ['Swashbuckling', 'Survival', 'Journey'] },
  { name: 'Musical', subGenres: ['Broadway', 'Film Musical', 'Opera'] },
  { name: 'Thriller', subGenres: ['Spy', 'Mystery', 'Action Thriller'] }
];



const Dancia4TvPage: React.FC = () => {
  const {
    currentMember,
    currentVideo,
    subscriptionPlans,
    playerState,
    movieTypes,
    pauseVideo,
    filterByMovieType,
    subscribeToPlan,
    unsubscribeFromPlan,
    isMemberSubscribedTo
  } = useDancia4TvData();
  const { showToast } = useAppContext();

  const [showAgeVerification, setShowAgeVerification] = useState<boolean>(() => {
    return (
      localStorage.getItem('dancia4tv_age_verified') !== 'true' &&
      localStorage.getItem('dancia4tv_onboarding_completed') !== 'true'
    );
  });
  const [activeTab, setActiveTab] = useState<
    'home' | 'browse' | 'subscriptions' | 'my-library' | 'discover' | 'lapidaire'
  >('home');

  // State for database integration
  const [danciaVideos, setDanciaVideos] = useState<Video[]>([]);
  const [danciaSubscriptionPlans, setDanciaSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Enhanced state for member preferences and recommendations
  const [memberPlayHistory, setMemberPlayHistory] = useState<Video[]>([]);
  const [memberWatchlist, setMemberWatchlist] = useState<Video[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Prime Video Streaming Interface State
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('All Genres');
  const [activeHeroMovie, setActiveHeroMovie] = useState<DanciaMovie>(CURATED_DANCIA_MOVIES[0]);
  const [activePlayingMovie, setActivePlayingMovie] = useState<DanciaMovie | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<string>('movies');
  const [selectedVodModel, setSelectedVodModel] = useState<string>('All');
  const [selectedAiStudio, setSelectedAiStudio] = useState<string>('Tinto');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDetailMovie, setActiveDetailMovie] = useState<DanciaMovie | null>(null);

  // Load data from database on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch videos
        const videosResponse: any = await apiService.request<any>('/api/dancia/videos').catch(() => null);
        const vList = Array.isArray(videosResponse)
          ? videosResponse
          : (videosResponse?.videos || videosResponse?.data || []);
        if (vList.length > 0) {
          setDanciaVideos(vList);
        }

        // Fetch subscription plans
        const plansResponse: any = await apiService.request<any>('/api/dancia/plans').catch(() => null);
        const pList = Array.isArray(plansResponse)
          ? plansResponse
          : (plansResponse?.plans || plansResponse?.data || []);
        if (pList.length > 0) {
          setDanciaSubscriptionPlans(pList);
        }

        // Fetch member-specific data if logged in
        if (currentMember) {

          // Fetch member's play history
          const historyResponse: any = await apiService.request<any>(
            '/api/dancia/member/history',
          ).catch(() => null);
          const hList = Array.isArray(historyResponse)
            ? historyResponse
            : (historyResponse?.history || historyResponse?.data || []);
          if (hList.length > 0) {
            setMemberPlayHistory(hList);
          }

          // Fetch member's watchlist
          const watchlistResponse: any = await apiService.request<any>(
            '/api/dancia/member/watchlist',
          ).catch(() => null);
          const wList = Array.isArray(watchlistResponse)
            ? watchlistResponse
            : (watchlistResponse?.watchlist || watchlistResponse?.data || []);
          if (wList.length > 0) {
            setMemberWatchlist(wList);
          }
        }
      } catch {
        // Fallback to local state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMember]);

  const handleAgeVerification = (year: number, month: number) => {
    const currentDate = new Date();
    const birthDate = new Date(year, month - 1);
    const ageInYears = currentDate.getFullYear() - birthDate.getFullYear();

    if (ageInYears >= 22) {
      setShowAgeVerification(false);
      localStorage.setItem('dancia4tv_age_verified', 'true');
      localStorage.setItem('dancia4tv_onboarding_completed', 'true');
    } else {
      showToast(
        'Dancia-4Tv is only suitable for persons 22 years and above',
        'error',
      );
    }
  };

  const handleSubscribe = async (planID: string) => {
    if (currentMember) {
      try {
        await apiService.request(`/dancia4tv/plans/${planID}/subscribe`, {
          method: 'POST'
        });
        subscribeToPlan(planID);
        showToast('Successfully subscribed to plan', 'success');
      } catch {
        showToast('Failed to subscribe to plan', 'error');
      }
    } else {
      showToast('Please log in to subscribe to a plan', 'info');
    }
  };

  const handleUnsubscribe = async (planID: string) => {
    if (currentMember) {
      try {
        await apiService.request(`/dancia4tv/plans/${planID}/unsubscribe`, {
          method: 'POST'
        });
        unsubscribeFromPlan(planID);
        showToast('Successfully unsubscribed from plan', 'info');
      } catch {
        showToast('Error unsubscribing from plan', 'error');
      }
    } else {
      showToast('Please log in to manage your subscriptions', 'info');
    }
  };

  const addToWatchlist = async (videoId: string) => {
    try {
      await apiService.request(`/dancia4tv/videos/${videoId}/watchlist`, {
        method: 'POST'
      });
      // Update local state
      const video = danciaVideos.find((v) => v.videoID === videoId);
      if (video && !memberWatchlist.some((v) => v.videoID === videoId)) {
        setMemberWatchlist([...memberWatchlist, video]);
      }
    } catch {
      const video = danciaVideos.find((v) => v.videoID === videoId);
      if (video && !memberWatchlist.some((v) => v.videoID === videoId)) {
        setMemberWatchlist([...memberWatchlist, video]);
      }
    }
  };

  const removeFromWatchlist = async (videoId: string) => {
    try {
      await apiService.request(`/dancia4tv/videos/${videoId}/watchlist`, {
        method: 'DELETE'
      });
      // Update local state
      setMemberWatchlist(memberWatchlist.filter((v) => v.videoID !== videoId));
    } catch {
      setMemberWatchlist(memberWatchlist.filter((v) => v.videoID !== videoId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className="text-center p-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="dancia4tv-page w-full max-w-full overflow-x-hidden p-3 sm:p-6 lg:p-8 bg-gray-950 min-h-screen text-white pb-24 md:pb-8">
      <Dancia4TvHeader
        activeNavTab={activeNavTab}
        onSelectNavTab={(tab: string) => setActiveNavTab(tab)}
        onOpenSettings={() => setShowSettingsModal(true)}
        searchQuery={searchQuery}
        onSearchChange={(q: string) => setSearchQuery(q)}
      />

      {showSettingsModal && <DanciaAppSettings onClose={() => setShowSettingsModal(false)} />}

      <main className="dancia4tv-main max-w-[1536px] 2xl:max-w-[1680px] mx-auto w-full space-y-8">
        {/* Age Verification Modal */}
        {showAgeVerification && (
          <AgeVerificationModalLocal onVerify={handleAgeVerification} />
        )}

        {/* Top Secondary Tabs: Home / Browse / Subscriptions / My Library / Discover / Lapidaire */}
        <div className="flex border-b border-gray-800 pb-2 space-x-2 sm:space-x-3 overflow-x-auto scrollbar-none items-center py-1">
          <button
            className={`py-1.5 px-4 rounded-xl font-bold text-xs transition shrink-0 ${activeTab === 'home' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:text-white bg-slate-800/80 border border-slate-700/80'}`}
            onClick={() => setActiveTab('home')}
          >
            Stream Feed
          </button>
          <button
            className={`py-1.5 px-4 rounded-xl font-bold text-xs transition shrink-0 ${activeTab === 'browse' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:text-white bg-slate-800/80 border border-slate-700/80'}`}
            onClick={() => setActiveTab('browse')}
          >
            Catalog Browse
          </button>
          <button
            className={`py-1.5 px-4 rounded-xl font-bold text-xs transition shrink-0 ${activeTab === 'subscriptions' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:text-white bg-slate-800/80 border border-slate-700/80'}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            Subscriptions & Plans
          </button>
          {currentMember && (
            <button
              className={`py-1.5 px-4 rounded-xl font-bold text-xs transition shrink-0 ${activeTab === 'my-library' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:text-white bg-slate-800/80 border border-slate-700/80'}`}
              onClick={() => setActiveTab('my-library')}
            >
              My Library
            </button>
          )}
          <button
            className={`py-1.5 px-4 rounded-xl font-bold text-xs transition flex items-center space-x-1.5 shrink-0 ${activeTab === 'discover' ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-900/30 ring-1 ring-sky-400/50' : 'text-slate-200 hover:text-white bg-slate-800/80 border border-slate-700/80'}`}
            onClick={() => setActiveTab('discover')}
          >
            <Compass className="w-3.5 h-3.5 mr-1 text-sky-400" />
            <span>Discover Peers</span>
          </button>
          <button
            className={`py-1.5 px-4 rounded-xl font-bold text-xs transition flex items-center space-x-1.5 shrink-0 ${activeTab === 'lapidaire' ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-lg shadow-amber-900/30 ring-1 ring-amber-400/50' : 'text-slate-200 hover:text-white bg-slate-800/80 border border-slate-700/80'}`}
            onClick={() => setActiveTab('lapidaire')}
          >
            <Flame className="w-3.5 h-3.5 mr-1 text-amber-400" />
            <span>Lapidaire Deck</span>
          </button>
        </div>

        {/* MAIN MOVIES TAB (PRIME VIDEO STYLE) */}
        {activeTab === 'home' && activeNavTab === 'movies' && (
          <div className="space-y-8">
            {/* Prime Video Hero Player Banner */}
            <div className="relative w-full min-h-[480px] sm:h-[520px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
              <img
                src={activeHeroMovie.bannerImage}
                alt={activeHeroMovie.title}
                className="w-full h-full object-cover filter brightness-75 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

              <div className="absolute bottom-4 sm:bottom-10 left-3 sm:left-10 right-3 sm:right-10 max-w-2xl space-y-3 sm:space-y-4 z-10 text-white">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="bg-sky-500 text-slate-900 font-extrabold text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded tracking-wider uppercase">PRIME EXCLUSIVE</span>
                  <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded font-semibold">{activeHeroMovie.quality}</span>
                  <span className="text-slate-100 text-[10px] sm:text-xs font-bold">{activeHeroMovie.releaseYear} • {activeHeroMovie.durationMinutes} mins • {activeHeroMovie.rating}</span>
                  <span className="flex items-center text-amber-400 text-[10px] sm:text-xs font-bold">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 mr-1" /> {activeHeroMovie.imdbRating}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
                  {activeHeroMovie.title}
                </h1>

                <p className="text-slate-100 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 font-medium leading-relaxed">
                  {activeHeroMovie.synopsis}
                </p>

                {/* AI Curated Summary Box */}
                <div className="bg-slate-900/90 backdrop-blur-md border border-sky-500/40 p-2.5 sm:p-3.5 rounded-xl text-xs text-sky-100 flex items-start space-x-2.5 sm:space-x-3 shadow-lg">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] sm:text-xs leading-relaxed">
                    <strong className="text-sky-300 font-bold block mb-0.5">Dancia AI Curated Captions & Summary:</strong>
                    <span className="line-clamp-2">{activeHeroMovie.aiCuratedSummary}</span>
                    <div className="mt-1 text-sky-200/95 font-medium italic truncate">
                      Live Caption: "{activeHeroMovie.aiGeneratedCaptions.sampleCaption}"
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 pt-1 sm:pt-2">
                  <button
                    onClick={() => setActivePlayingMovie(activeHeroMovie)}
                    className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-sky-500 hover:bg-sky-400 text-slate-900 font-extrabold px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-sky-500/30 min-h-[44px]"
                  >
                    <Play className="w-5 h-5 fill-black" />
                    <span>Watch Now</span>
                  </button>
                  <button
                    onClick={() => addToWatchlist(activeHeroMovie.id)}
                    className="flex items-center justify-center space-x-1.5 bg-gray-800/80 hover:bg-gray-700 text-white font-semibold px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-white/10 transition min-h-[44px]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Watchlist</span>
                  </button>
                  <button
                    onClick={() => setActiveDetailMovie(activeHeroMovie)}
                    className="flex items-center justify-center space-x-1.5 bg-gray-800/80 hover:bg-gray-700 text-white font-semibold px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border border-white/10 transition min-h-[44px]"
                  >
                    <Info className="w-4 h-4" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Changeable Ad Banner */}
            <div className="bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-slate-900/40 border border-purple-500/30 rounded-2xl p-5 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-400/40">
                  <Film className="w-8 h-8 text-purple-300" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-purple-200">Dancia-4Tv{'\u00AE\u2122\u00A9'} Sponsored Entertainment</h4>
                  <p className="text-sm text-gray-300">
                    Stream Nollywood, Bollywood, Hollywood blockbusters & 19 AI Short Drama channels in 4K Cinema quality.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveNavTab('vod-models')}
                className="whitespace-nowrap bg-purple-500 hover:bg-purple-400 text-slate-900 font-bold text-xs px-5 py-2.5 rounded-lg transition shadow-md"
              >
                Stream Unlimited
              </button>
            </div>

            {/* 11 Global Regional Movie Categories Pills */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                <Film className="w-5 h-5 text-sky-400" />
                <span>Explore 11 Global Regional Cinema Hubs</span>
              </h3>
              <div className="flex overflow-x-auto pb-2 space-x-3 scrollbar-thin">
                <button
                  onClick={() => setSelectedRegion('All Regions')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    selectedRegion === 'All Regions'
                      ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  All Regions
                </button>
                {DANCIA_REGIONAL_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedRegion(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedRegion === cat
                        ? 'bg-sky-500 text-black shadow-lg shadow-sky-500/20'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Filter Tabs */}
            <div>
              <h3 className="text-lg font-bold text-white mb-3 flex items-center space-x-2">
                <Film className="w-5 h-5 text-amber-400" />
                <span>Filter By Curated Genres</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {DANCIA_GENRES_HIERARCHY.map((g: GenreHierarchy) => (
                  <button
                    key={g.name}
                    onClick={() => setSelectedGenreFilter(g.name)}
                    className={`p-3 rounded-xl border text-left transition ${
                      selectedGenreFilter === g.name
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-gray-900 border-white/10 text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{g.name}</div>
                    <div className="text-[10px] text-slate-300 line-clamp-1 mt-0.5 font-medium">{g.subGenres.slice(0, 2).join(', ')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Prime Video Rows: Curated Regional Blockbusters */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white tracking-tight border-l-4 border-sky-500 pl-3">
                {selectedRegion === 'All Regions' ? 'Newly Released Global Blockbusters (2025)' : `${selectedRegion} Cinema Hub`}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {CURATED_DANCIA_MOVIES.filter((m) => {
                  const matchRegion = selectedRegion === 'All Regions' || m.regionalCategory === selectedRegion;
                  const matchGenre = selectedGenreFilter === 'All Genres' || m.genre === selectedGenreFilter;
                  const matchSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchRegion && matchGenre && matchSearch;
                }).map((movie) => (
                  <div
                    key={movie.id}
                    onClick={() => setActiveHeroMovie(movie)}
                    className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-white/10 hover:border-sky-500/50 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-sky-500/10"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={movie.posterImage}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-sky-300 border border-sky-400/30">
                        {movie.regionalCategory}
                      </div>
                      <div className="absolute top-3 right-3 bg-amber-400 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
                        {movie.quality}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                        <span>{movie.genre} • {movie.subGenre}</span>
                        <span className="flex items-center text-amber-400 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 mr-1" /> {movie.imdbRating}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-base truncate group-hover:text-sky-400 transition">
                        {movie.title}
                      </h4>

                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium">
                        {movie.synopsis}
                      </p>

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActivePlayingMovie(movie);
                          }}
                          className="flex items-center space-x-1.5 bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-slate-900 font-bold text-xs px-3.5 py-1.5 rounded-lg border border-sky-500/40 transition"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Play</span>
                        </button>
                        <span className="text-[10px] text-slate-300 italic font-medium">{movie.durationMinutes} min</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TV SHOWS TAB */}
        {activeNavTab === 'tv-shows' && (
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h2 className="text-2xl font-bold text-white">Dancia-4Tv{'\u00AE'} Original TV Series & Episodic Dramas</h2>
              <p className="text-sm text-slate-200 font-medium">Binge season premieres in 4K Ultra HD with AI live captions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CURATED_DANCIA_MOVIES.slice(0, 6).map((show, idx) => (
                <div key={show.id} className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden p-4 space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <img src={show.bannerImage} alt={show.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                      Season 1 • Ep {idx + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-white">{show.title} (TV Series)</h3>
                  <p className="text-xs text-slate-200 line-clamp-2 font-medium">{show.synopsis}</p>
                  <button
                    onClick={() => setActivePlayingMovie(show)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Watch Next Episode</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LIVE TV TAB */}
        {activeNavTab === 'live' && (
          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-4 py-1 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                  Live Stream Broadcast Channels
                </h2>
                <p className="text-sm text-slate-200 font-medium">24/7 Live OTT digital broadcast over the internet.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/R6MlUcmOul8?autoplay=0"
                    title="Live Cinema Stream"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white">Dancia-4Tv Live Cinema 1</h4>
                  <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">24/7 LIVE</span>
                </div>
              </div>

              <div className="bg-gray-900 border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="aspect-video bg-black rounded-xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/eRsGyueVLvQ?autoplay=0"
                    title="Live Anime Stream"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white">Dancia-4Tv Live Animation 24/7</h4>
                  <span className="bg-red-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">24/7 LIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SPORTS TAB */}
        {activeNavTab === 'sports' && (
          <div className="space-y-6">
            <div className="border-l-4 border-emerald-500 pl-4 py-1">
              <h2 className="text-2xl font-bold text-white">Dancia-4Tv Sports Arena</h2>
              <p className="text-sm text-slate-200 font-medium">Live sports matches, football tournaments, martial arts and combat highlights.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Global Football Championship 2025', category: 'Soccer', image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=85' },
                { title: 'Muay Thai & Martial Arts Night', category: 'Combat Sports', image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=800&q=85' },
                { title: 'Extreme Motorsport Rally', category: 'Racing', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=85' }
              ].map((sport, i) => (
                <div key={i} className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden p-4 space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <img src={sport.image} alt={sport.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-emerald-500 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded">
                      {sport.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base">{sport.title}</h3>
                  <button
                    onClick={() => setActivePlayingMovie(CURATED_DANCIA_MOVIES[0])}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-extrabold text-xs py-2.5 rounded-lg transition"
                  >
                    Watch Live Match
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VOD MODELS TAB (SVoD, TVoD, AVoD, HVoD, YOUTUBE EMBEDS) */}
        {activeNavTab === 'vod-models' && (
          <div className="space-y-8">
            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <h2 className="text-2xl font-bold text-white">Video on Demand (VoD) Streaming Models</h2>
              <p className="text-sm text-slate-200 font-medium">Explore SVoD, TVoD, AVoD, HVoD and 12+ Embedded YouTube Short Films curated for Dancia-4Tv{'\u00AE\u2122\u00A9'}.</p>
            </div>

            {/* VoD Filter Selector */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {['All', 'SVoD', 'TVoD', 'AVoD', 'HVoD', 'YouTube Embed'].map((model) => (
                <button
                  key={model}
                  onClick={() => setSelectedVodModel(model)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition ${
                    selectedVodModel === model
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                      : 'bg-gray-900 border border-white/20 text-slate-100 hover:bg-gray-800 font-bold'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>

            {/* Render VoD Categories */}
            {VOD_MODEL_SAMPLES.filter((c: VodCategorySample) => selectedVodModel === 'All' || c.modelType === selectedVodModel).map((category: VodCategorySample) => (
              <div key={category.modelType} className="bg-gray-900/60 border border-white/10 rounded-3xl p-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-4 gap-2">
                  <div>
                    <h3 className="text-xl font-black text-white">{category.title}</h3>
                    <p className="text-xs text-slate-200 mt-1 font-medium">{category.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${category.badgeColor}`}>
                    {category.priceTag}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                  {category.samples.map((movie: DanciaMovie) => (
                    <div key={movie.id} className="bg-gray-950 rounded-2xl border border-white/10 overflow-hidden p-3 space-y-2 hover:border-amber-400/50 transition">
                      <div className="relative aspect-video rounded-xl overflow-hidden">
                        {movie.youtubeId ? (
                          <iframe
                            className="w-full h-full"
                            src={`https://www.youtube.com/embed/${movie.youtubeId}`}
                            title={movie.title}
                            allowFullScreen
                          />
                        ) : (
                          <img src={movie.posterImage} alt={movie.title} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute top-2 left-2 bg-black/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          {movie.vodPrice || movie.quality}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm truncate">{movie.title}</h4>
                      <p className="text-[11px] text-slate-200 line-clamp-2 font-medium">{movie.synopsis}</p>
                      <button
                        onClick={() => setActivePlayingMovie(movie)}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs py-2 rounded-lg transition"
                      >
                        Stream Now ({movie.vodModel})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI MOVIES & SHORT DRAMAS TAB (19 STUUDIO CHANNELS) */}
        {activeNavTab === 'ai-movies' && (
          <div className="space-y-8">
            <div className="border-l-4 border-purple-500 pl-4 py-1">
              <h2 className="text-2xl font-bold text-white">AI Movies Studio Channels (19 Curated Studios)</h2>
              <p className="text-sm text-slate-200 font-medium">Short AI Dramas, Afrobeats music videos, and cinematic micro-films powered by neural video synthesis.</p>
            </div>

            {/* 19 Channel Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-2">
              {AI_MOVIE_STUDIO_CHANNELS.map((ch: AiStudioChannel) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedAiStudio(ch.name)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    selectedAiStudio === ch.name
                      ? 'bg-purple-600 border-purple-400 text-white font-extrabold shadow-lg shadow-purple-500/30'
                      : 'bg-gray-900 border-white/10 text-slate-200 hover:bg-gray-800 font-bold'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{ch.name}</div>
                  <div className="text-[9px] opacity-75 truncate">{ch.category.split(' ')[0]}</div>
                </button>
              ))}
            </div>

            {/* Selected Studio Display */}
            {AI_MOVIE_STUDIO_CHANNELS.filter((st: AiStudioChannel) => st.name === selectedAiStudio).map((studio: AiStudioChannel) => (
              <div key={studio.id} className="bg-gradient-to-r from-purple-950/60 via-slate-950 to-gray-950 border border-purple-500/30 rounded-3xl p-6 space-y-6 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-purple-500/20 pb-4 gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="bg-purple-500 text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        {studio.category}
                      </span>
                      {studio.isAgeRestricted && (
                        <span className="bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full">
                          22+ AGE RESTRICTED
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl font-black text-white mt-2">{studio.name} AI Studio</h3>
                    <p className="text-sm text-slate-100 mt-1 max-w-3xl leading-relaxed font-medium">{studio.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {studio.movies.map((movie: DanciaMovie) => (
                    <div key={movie.id} className="bg-gray-900 rounded-2xl border border-white/10 overflow-hidden p-4 space-y-3 hover:border-purple-400/50 transition">
                      <div className="relative aspect-video rounded-xl overflow-hidden">
                        <img src={movie.bannerImage} alt={movie.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded">
                          {studio.name} Original
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-base">{movie.title}</h4>
                      <p className="text-xs text-slate-200 leading-relaxed line-clamp-2 font-medium">{movie.synopsis}</p>

                      <div className="bg-purple-950/50 border border-purple-500/20 p-2.5 rounded-lg text-[11px] text-purple-200">
                        <strong className="block text-purple-300 font-bold">Studio AI Caption:</strong>
                        "{movie.aiGeneratedCaptions.sampleCaption}"
                      </div>

                      <button
                        onClick={() => {
                          if (studio.isAgeRestricted) {
                            setShowAgeVerification(true);
                          }
                          setActivePlayingMovie(movie);
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs py-3 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch {studio.name} AI Short</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Player Modal */}
        {activePlayingMovie && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-10">
            <div className="relative w-full max-w-5xl bg-gray-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-gray-900">
                <div>
                  <h3 className="text-lg font-bold text-white">{activePlayingMovie.title}</h3>
                  <p className="text-xs text-sky-400">{activePlayingMovie.regionalCategory} • {activePlayingMovie.genre}</p>
                </div>
                <button
                  onClick={() => setActivePlayingMovie(null)}
                  className="p-2 text-slate-200 hover:text-white rounded-full bg-gray-800"
                >
                  ✕
                </button>
              </div>

              <div className="relative aspect-video bg-black">
                {activePlayingMovie.youtubeId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${activePlayingMovie.youtubeId}?autoplay=1`}
                    title={activePlayingMovie.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    key={activePlayingMovie.id}
                    src={activePlayingMovie.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const videoEl = e.currentTarget;
                      const fallback = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                      if (videoEl.src !== fallback) {
                        videoEl.src = fallback;
                        videoEl.play().catch(() => {});
                      }
                    }}
                  />
                )}
              </div>

              <div className="p-6 bg-gray-900 space-y-3">
                <div className="flex items-center space-x-2 text-xs text-sky-300">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-bold">AI Auto-Generated Caption Stream:</span>
                  <span>{activePlayingMovie.aiGeneratedCaptions?.sampleCaption}</span>
                </div>
                <p className="text-xs text-slate-100 leading-relaxed font-medium">{activePlayingMovie.synopsis}</p>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {activeDetailMovie && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-white/10 rounded-3xl p-6 max-w-lg w-full space-y-4 text-white">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-xl font-bold">{activeDetailMovie.title}</h3>
                <button type="button" onClick={() => setActiveDetailMovie(null)} className="text-slate-200 hover:text-white">✕</button>
              </div>
              <p className="text-xs text-slate-100 font-medium">{activeDetailMovie.synopsis}</p>
              <div className="text-xs space-y-1 text-slate-200 font-medium">
                <p><strong>Director:</strong> {activeDetailMovie.director}</p>
                <p><strong>Cast:</strong> {activeDetailMovie.cast.join(', ')}</p>
                <p><strong>Quality:</strong> {activeDetailMovie.quality}</p>
                <p><strong>Languages:</strong> {activeDetailMovie.audioLanguages.join(', ')}</p>
              </div>
              <button
                onClick={() => {
                  setActivePlayingMovie(activeDetailMovie);
                  setActiveDetailMovie(null);
                }}
                className="w-full bg-sky-500 text-slate-900 font-extrabold py-2.5 rounded-xl"
              >
                Play Now
              </button>
            </div>
          </div>
        )}

        {activeTab === 'browse' && (
          <div className="browse-content">
            <div className="movie-types mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Movie Types
              </h2>
              <div className="movie-types-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movieTypes.map((type: string, index: number) => (
                  <div
                    key={index}
                    className="movie-type-card bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => filterByMovieType(type)} role="button" tabIndex={0}
                  >
                    <h3 className="text-lg font-semibold text-white">{type}</h3>
                  </div>
                ))}
              </div>
            </div>

            <div className="subscription-plans">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Subscription Plans
              </h2>
              <div className="plans-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(danciaSubscriptionPlans.length > 0
                  ? danciaSubscriptionPlans
                  : subscriptionPlans
                ).map((plan: SubscriptionPlan) => (
                  <SubscriptionPlanCard
                    key={plan.planID}
                    plan={plan}
                    isSubscribed={
                      currentMember ? isMemberSubscribedTo(plan.type) : false
                    }
                    onSubscribe={handleSubscribe}
                    onUnsubscribe={handleUnsubscribe}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="subscriptions-content">
            <h2 className="text-2xl font-bold mb-4 text-white">
              My Subscriptions
            </h2>
            <div className="bg-gray-800 rounded-lg p-6">
              {currentMember && currentMember.subscriptionPlanID ? (
                <div className="current-subscription">
                  <p className="text-gray-300 mb-4">
                    You are currently subscribed to a plan.
                  </p>
                  <button
                    onClick={() =>
                      handleUnsubscribe(currentMember.subscriptionPlanID!)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <div className="no-subscription">
                  <p className="text-gray-300 mb-4">
                    You don't have an active subscription.
                  </p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Explore Plans
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'my-library' && (
          <div className="my-library-content">
            <h2 className="text-2xl font-bold mb-4 text-white">My Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Watchlist
                </h3>
                <div className="space-y-3">
                  {memberWatchlist.map((video: Video) => (
                    <div
                      key={video.videoID}
                      className="flex items-center space-x-3 bg-gray-700 p-2 rounded"
                    >
                      <img
                        src={video.thumbnailURL}
                        alt={video.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {video.title}
                        </p>
                        <p className="text-xs text-slate-300 font-medium">{video.genre}</p>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(video.videoID)}
                        className="text-red-400 hover:text-red-300 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Continue Watching
                </h3>
                <div className="space-y-3">
                  {memberPlayHistory.slice(0, 5).map((video: Video) => (
                    <div
                      key={video.videoID}
                      className="flex items-center space-x-3 bg-gray-700 p-2 rounded"
                    >
                      <img
                        src={video.thumbnailURL}
                        alt={video.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {video.title}
                        </p>
                        <p className="text-xs text-slate-300 font-medium">{video.genre}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Recently Watched
                </h3>
                <div className="space-y-3">
                  {memberPlayHistory.slice(0, 5).map((video: Video) => (
                    <div
                      key={video.videoID}
                      className="flex items-center space-x-3 bg-gray-700 p-2 rounded"
                    >
                      <img
                        src={video.thumbnailURL}
                        alt={video.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {video.title}
                        </p>
                        <p className="text-xs text-slate-300 font-medium">{video.genre}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'discover' && (
          <div className="py-2">
            <UniversalDiscoveryHub domain="dancia4tv" initialSubTab="discover" />
          </div>
        )}

        {activeTab === 'lapidaire' && (
          <div className="py-2">
            <UniversalDiscoveryHub domain="dancia4tv" initialSubTab="lapidaire" />
          </div>
        )}
      </main>

      <Dancia4TvFooter />

      {/* Video Player */}
      {currentVideo && (
        <VideoPlayer
          video={currentVideo}
          playerState={playerState}
          onPause={pauseVideo}
        />
      )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <aside
        aria-label="Dancia-4Tv Mobile Navigation Dock"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-950/95 backdrop-blur-xl border-t border-white/10 px-1 py-1.5 pb-[env(safe-area-inset-bottom,0px)] shadow-2xl"
        style={{ width: '100%', maxWidth: '100vw' }}
      >
        <div className="grid grid-cols-4 w-full h-13 items-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab('home');
              setActiveNavTab('movies');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 col-span-1 min-w-0 max-w-full transition cursor-pointer min-h-[44px] ${
              activeTab === 'home' ? 'text-sky-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Stream Feed"
          >
            <Play className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight truncate max-w-full">Stream</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('browse');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 col-span-1 min-w-0 max-w-full transition cursor-pointer min-h-[44px] ${
              activeTab === 'browse' ? 'text-sky-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Catalog Browse"
          >
            <Film className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight truncate max-w-full">Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('subscriptions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 col-span-1 min-w-0 max-w-full transition cursor-pointer min-h-[44px] ${
              activeTab === 'subscriptions' ? 'text-sky-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Subscription Plans"
          >
            <Star className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight truncate max-w-full">Plans</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab(currentMember ? 'my-library' : 'discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 col-span-1 min-w-0 max-w-full transition cursor-pointer min-h-[44px] ${
              activeTab === 'my-library' || activeTab === 'discover' ? 'text-sky-400 font-black' : 'text-slate-400 hover:text-white'
            }`}
            aria-label="Library & Discovery"
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight truncate max-w-full">Library</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

/* eslint-disable no-unused-vars */
// Age Verification Modal Component
const AgeVerificationModalLocal: React.FC<{
  onVerify: (_year: number, _month: number) => void;
}> = ({ onVerify }) => {
  const { showToast } = useAppContext();
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(birthYear, 10);
    const month = parseInt(birthMonth, 10);

    if (year && month && month >= 1 && month <= 12) {
      onVerify(year, month);
    } else {
      showToast('Please enter a valid birth year and month', 'error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-5 sm:p-6 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">Age Verification</h3>
        <p className="text-gray-300 text-xs sm:text-sm mb-4 leading-relaxed font-medium">
          Please verify you are over 18 years old to access this content.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Birth Year</label>
            <input
              type="number"
              placeholder="e.g. 1995"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 mb-1">Birth Month</label>
            <input
              type="number"
              placeholder="1 - 12"
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              min="1"
              max="12"
              className="w-full p-2.5 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm min-h-[44px]"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-bold transition min-h-[44px] cursor-pointer"
          >
            Verify & Enter
          </button>
        </div>
      </form>
    </div>
  );
};

// Define placeholder components for missing ones
interface VideoRecommendationsProps {
  videos: any[];
  title?: string;
  type?: string;
  onPlayVideo?: (_video: any) => void;
  onAddToWatchlist?: (_videoId: string) => Promise<void>;
}
const VideoRecommendations: React.FC<VideoRecommendationsProps> = ({ videos }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-2">Recommended For You</h3>
      <div className="space-y-2">
        {videos.slice(0, 3).map((video, idx) => (
          <div key={idx} className="flex items-center p-2 bg-gray-700 rounded">
            <div className="w-16 h-10 bg-gray-600 rounded mr-2"></div>
            <div>
              <p className="text-white text-sm truncate">
                {video.title || `Video ${idx + 1}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface VideoFeedProps {
  videos: any[];
  onPlayVideo?: (_video: any) => void;
  onFilterByGenre?: (_genre: string) => void;
  onAddToWatchlist?: (_video: any) => void;
}
const VideoFeed: React.FC<VideoFeedProps> = ({ videos }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-2">Latest Videos</h3>
      <div className="space-y-4">
        {videos.slice(0, 4).map((video, idx) => (
          <div key={idx} className="p-3 bg-gray-700 rounded">
            <h4 className="text-white truncate">
              {video.title || `Video ${idx + 1}`}
            </h4>
            <p className="text-slate-200 text-sm font-medium">
              {video.description || 'Description coming soon'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TrendingVideosSectionProps {
  videos: any[];
  onPlayVideo?: (_video: any) => void;
}
const TrendingVideosSection: React.FC<TrendingVideosSectionProps> = ({ videos }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-2">Trending Now</h3>
      <div className="space-y-2">
        {videos.slice(0, 3).map((video, idx) => (
          <div key={idx} className="flex items-center p-2 bg-gray-700 rounded">
            <div className="w-16 h-10 bg-gray-600 rounded mr-2"></div>
            <div>
              <p className="text-white text-sm font-semibold truncate">
                {video.title || `Trending ${idx + 1}`}
              </p>
              <p className="text-slate-300 text-xs font-medium">{video.views || 0} views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NotificationsPanel: React.FC = () => {
  return (
    <div className="p-3 bg-gray-700 rounded">
      <h3 className="text-lg font-bold text-white mb-2">Notifications</h3>
      <p className="text-slate-200 text-sm font-medium">No new notifications</p>
    </div>
  );
};

const AdsPanel: React.FC = () => {
  return (
    <div className="p-3 bg-gray-700 rounded">
      <h3 className="text-lg font-bold text-white mb-2">Sponsored</h3>
      <p className="text-slate-200 text-sm font-medium">Advertisement content</p>
    </div>
  );
};

interface SubscriptionPlanCardProps {
  plan: any;
  isSubscribed?: boolean;
  onSubscribe?: (_planID: string) => Promise<void>;
  onUnsubscribe?: (_planID: string) => Promise<void>;
}
const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({ plan }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h4 className="text-white font-bold">{plan.name || 'Plan Name'}</h4>
      <p className="text-slate-200 text-sm font-medium">
        {plan.description || 'Plan details'}
      </p>
      <p className="text-white font-bold mt-2">{plan.price || '$0/month'}</p>
      <button
        type="button"
        aria-label={`Subscribe to ${plan.name || 'plan'}`}
        onClick={() => window.location.assign(`/subscribe?plan=${encodeURIComponent(plan.id || plan.name || '')}`)}
        className="mt-2 w-full py-1 bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
      >
        Subscribe
      </button>
    </div>
  );
};

interface VideoPlayerProps {
  video: any;
  playerState?: any;
  onPause?: () => void;
}
const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, playerState, onPause }) => {
  return (
    <div className="bg-black aspect-video rounded flex items-center justify-center">
      <div className="text-center">
        <div className="text-white text-xl mb-2 font-bold">Video Player</div>
        <p className="text-slate-200 font-semibold">{video.title || 'Loading...'}</p>
        {onPause && (
          <button type="button" onClick={onPause} className="mt-2 text-red-400 font-bold hover:text-red-300">Pause</button>
        )}
      </div>
    </div>
  );
};

// Export all helper components
export {
  AgeVerificationModalLocal,
  VideoRecommendations,
  VideoFeed,
  TrendingVideosSection,
  NotificationsPanel,
  AdsPanel,
  SubscriptionPlanCard,
  VideoPlayer
};

const Dancia4TvPageWithProvider: React.FC = () => (
  <Dancia4TvProvider>
    <Dancia4TvPage />
  </Dancia4TvProvider>
);

export default Dancia4TvPageWithProvider;
