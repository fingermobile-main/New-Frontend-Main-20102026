import React from 'react';
/*
 * FingerMobile Protocol™ - Dancia4Tv Streaming Platform Page
 * Copyright © 2025 Mbah Israel Obinna. All rights reserved.
 * This file is part of the FingerMobile™ and FingerMobile Protocol™ platforms,
 * which are the sole and exclusive intellectual property of Mbah Israel Obinna.
 *
 * Unauthorized copying, distribution, or modification of this code is strictly prohibited. All laws do and will apply.
 */

import { useAppContext } from "../contexts/AppContext";
import { useDancia4TvData } from '../hooks/useDancia4Tv';
import { DanciaVideo as Video, DanciaSubscriptionPlan as SubscriptionPlan, DanciaMember as Member } from '../types/dancia4tv';
import "../styles/Dancia4TvPage.css";
import Dancia4TvHeader from '../components/Dancia4TvHeader';
import Dancia4TvFooter from '../components/Dancia4TvFooter';
import Dancia4TvControls from '../components/Dancia4TvControls';
import Dancia4TvPlaylist from '../components/Dancia4TvPlaylist';
import DanciaAppSettings from '../components/DanciaAppSettings';
import DisplaySettings, { DisplayMode, SortCriteria } from '../components/DisplaySettings';
import { SortAsc } from "lucide-react";
import apiService, { ApiService } from '../services/apiService';


const Dancia4TvPage: React.FC = () => {
  const {
    currentMember,
    currentVideo,
    subscriptionPlans,
    playerState,
    videos,
    genres,
    movieTypes,
    searchQuery,
    playVideo,
    pauseVideo,
    searchVideos,
    filterByGenre,
    filterByMovieType,
    subscribeToPlan,
    unsubscribeFromPlan,
    isMemberSubscribedTo
  } = useDancia4TvData();
  const { showToast } = useAppContext();

  const [showGenreSelection, setShowGenreSelection] = React.useState(true);
  const [showArtistSelection, setShowArtistSelection] = React.useState(false);
  const [showAgeVerification, setShowAgeVerification] = React.useState(false);
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [selectedArtists, setSelectedArtists] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<
    "home" | "browse" | "subscriptions" | "my-library"
  >("home");

  // State for database integration
  const [danciaVideos, setDanciaVideos] = React.useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = React.useState<boolean>(true);
  const [danciaSubscriptionPlans, setDanciaSubscriptionPlans] = React.useState<
    SubscriptionPlan[]
  >([]);
  const [loadingPlans, setLoadingPlans] = React.useState<boolean>(true);
  const [danciaGenres, setDanciaGenres] = React.useState<string[]>([]);
  const [loadingGenres, setLoadingGenres] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Enhanced state for member preferences and recommendations
  const [recommendedVideos, setRecommendedVideos] = React.useState<Video[]>([]);
  const [trendingVideos, setTrendingVideos] = React.useState<Video[]>([]);
  const [memberPlayHistory, setMemberPlayHistory] = React.useState<Video[]>([]);
  const [memberWatchlist, setMemberWatchlist] = React.useState<Video[]>([]);
  const [displayMode, setDisplayMode] = React.useState<DisplayMode>("grid");
  const [sortBy, setSortBy] = React.useState<SortCriteria>("name");
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState<boolean>(false);
  const [groupVideos, setGroupVideos] = React.useState<boolean>(false);
  const [groupAudio, setGroupAudio] = React.useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = React.useState<boolean>(false);

  // Load data from database on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch videos
        setLoadingVideos(true);
        const videosResponse = await apiService.request<Video[]>("/dancia4tv/videos");
        setDanciaVideos(videosResponse);

        // Fetch subscription plans
        setLoadingPlans(true);
        const plansResponse = await apiService.request<SubscriptionPlan[]>("/dancia4tv/plans");
        setDanciaSubscriptionPlans(plansResponse);

        // Fetch genres
        setLoadingGenres(true);
        const genresResponse = await apiService.request<string[]>("/dancia4tv/genres");
        setDanciaGenres(genresResponse);

        // Fetch member-specific data if logged in
        if (currentMember) {
          // Fetch member's recommended videos
          const recResponse = await apiService.request<Video[]>(
            "/dancia4tv/member/recommended",
          );
          setRecommendedVideos(recResponse);

          // Fetch trending videos
          const trendingResponse = await apiService.request<Video[]>(
            "/dancia4tv/trending",
          );
          setTrendingVideos(trendingResponse);

          // Fetch member's play history
          const historyResponse = await apiService.request<Video[]>(
            "/dancia4tv/member/history",
          );
          setMemberPlayHistory(historyResponse);

          // Fetch member's watchlist
          const watchlistResponse = await apiService.request<Video[]>(
            "/dancia4tv/member/watchlist",
          );
          setMemberWatchlist(watchlistResponse);
        }
      } catch (error) {
        console.error("Error fetching Dancia-4Tv data:", error);
        setError("Failed to load Dancia-4Tv content. Please try again later.");
      } finally {
        setLoadingVideos(false);
        setLoadingPlans(false);
        setLoadingGenres(false);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentMember]);

  // Check if member has completed onboarding
  React.useEffect(() => {
    if (currentMember) {
      // Check if member has completed onboarding (selected genres and artists)
      // This would typically come from member profile data
      if (selectedGenres.length >= 6 && selectedArtists.length >= 10) {
        setShowGenreSelection(false);
        setShowArtistSelection(false);
        setShowAgeVerification(false);
      } else {
        // Show onboarding if not completed
        const hasCompletedOnboarding = localStorage.getItem(
          "dancia4tv_onboarding_completed",
        );
        if (!hasCompletedOnboarding) {
          setShowAgeVerification(true);
        }
      }
    }
  }, [currentMember, selectedGenres.length, selectedArtists.length]);

  const handleGenreSelection = (genres: string[]) => {
    setSelectedGenres(genres);
    if (genres.length >= 6) {
      setShowGenreSelection(false);
      setShowArtistSelection(true);
    }
  };

  const handleArtistSelection = (artists: string[]) => {
    setSelectedArtists(artists);
    if (artists.length >= 10) {
      setShowArtistSelection(false);
      // Mark onboarding as completed
      localStorage.setItem("dancia4tv_onboarding_completed", "true");
    }
  };

  const handleAgeVerification = (year: number, month: number) => {
    const currentDate = new Date();
    const birthDate = new Date(year, month - 1);
    const ageInYears = currentDate.getFullYear() - birthDate.getFullYear();

    if (ageInYears >= 22) {
      setShowAgeVerification(false);
    } else {
      // Handle age restriction
      showToast(
        "Dancia-4Tv is only suitable for persons 22 years and above",
        "error",
      );
      // Redirect or show error page
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      search: { value: string };
    };

    try {
      const searchResponse = await apiService.request<Video[]>(
        `/dancia4tv/videos/search?q=${encodeURIComponent(target.search.value)}`,
      );
      // Update the search results
      searchVideos(target.search.value);
    } catch (error) {
      console.error("Error searching Dancia-4Tv videos:", error);
    }
  };

  const handleSubscribe = async (planID: string) => {
    if (currentMember) {
      try {
        await apiService.request(`/dancia4tv/plans/${planID}/subscribe`, {
          method: "POST"
        });
        subscribeToPlan(planID);
        // Update member data
        const updatedMember = {
          ...currentMember,
          subscriptionPlanID: planID
        } as Member;
        // In a real app, we'd update the context with the new member data
      } catch (error) {
        console.error("Error subscribing to plan:", error);
        showToast("Failed to subscribe to plan", "error");
      }
    } else {
      showToast("Please log in to subscribe to a plan", "info");
    }
  };

  const handleUnsubscribe = async (planID: string) => {
    if (currentMember) {
      try {
        await apiService.request(`/dancia4tv/plans/${planID}/unsubscribe`, {
          method: "POST"
        });
        unsubscribeFromPlan(planID);
        // Update member data
        const updatedMember = {
          ...currentMember,
          subscriptionPlanID: undefined
        } as Member;
        // In a real app, we'd update the context with the new member data
      } catch (error) {
        console.error("Error unsubscribing from plan:", error);
        showToast("Error unsubscribing from plan", "error");
      }
    } else {
      showToast("Please log in to manage your subscriptions", "info");
    }
  };

  const addToWatchlist = async (videoId: string) => {
    try {
      await apiService.request(`/dancia4tv/videos/${videoId}/watchlist`, {
        method: "POST"
      });
      // Update local state
      const video = danciaVideos.find((v) => v.videoID === videoId);
      if (video && !memberWatchlist.some((v) => v.videoID === videoId)) {
        setMemberWatchlist([...memberWatchlist, video]);
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  const removeFromWatchlist = async (videoId: string) => {
    try {
      await apiService.request(`/dancia4tv/videos/${videoId}/watchlist`, {
        method: "DELETE"
      });
      // Update local state
      setMemberWatchlist(memberWatchlist.filter((v) => v.videoID !== videoId));
    } catch (error) {
      console.error("Error removing from watchlist:", error);
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
    <div className="dancia4tv-page p-4 sm:p-6 lg:p-8 bg-gray-950 min-h-screen text-white">
      <Dancia4TvHeader onOpenSettings={() => setShowSettingsModal(true)} />
      
      {showSettingsModal && <DanciaAppSettings onClose={() => setShowSettingsModal(false)} />}

      <main className="dancia4tv-main">
        {/* Age Verification Modal */}
        {showAgeVerification && (
          <AgeVerificationModalLocal onVerify={handleAgeVerification} />
        )}

        {/* Genre Selection Modal */}
        {showGenreSelection && (
          <GenreSelectionModalLocal
            genres={danciaGenres.length > 0 ? danciaGenres : genres}
            onSelectGenres={handleGenreSelection}
            selectedGenres={selectedGenres}
          />
        )}

        {/* Artist Selection Modal */}
        {showArtistSelection && (
          <ArtistSelectionModalLocal
            onSelectArtists={handleArtistSelection}
            selectedArtists={selectedArtists}
          />
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "home" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-300"}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "browse" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-300"}`}
            onClick={() => setActiveTab("browse")}
          >
            Browse
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${activeTab === "subscriptions" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-300"}`}
            onClick={() => setActiveTab("subscriptions")}
          >
            Subscriptions
          </button>
          {currentMember && (
            <button
              className={`py-2 px-4 font-medium text-sm ${activeTab === "my-library" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500 hover:text-gray-300"}`}
              onClick={() => setActiveTab("my-library")}
            >
              My Library
            </button>
          )}
        </div>

        {/* Main Content - Three Column Layout */}
        {activeTab === "home" && (
          <div className="three-column-layout grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - DNA (curated discovery) */}
            <div className="column dna-column bg-gray-900 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">DNA</h2>
              <div className="content-scroll max-h-[calc(100vh-200px)] overflow-y-auto">
                <VideoRecommendations
                  title="Recommended For You"
                  type="recommendations"
                  videos={
                    recommendedVideos.length > 0
                      ? recommendedVideos
                      : danciaVideos.slice(0, 5)
                  }
                  onPlayVideo={playVideo}
                  onAddToWatchlist={addToWatchlist}
                />
                <VideoRecommendations
                  title="Continue Watching"
                  type="continue-watching"
                  videos={memberPlayHistory.slice(0, 3)}
                  onPlayVideo={playVideo}
                  onAddToWatchlist={addToWatchlist}
                />
              </div>
            </div>

            {/* Middle column - River Stream (video feed) */}
            <div className="column river-stream-column bg-gray-900 p-4 rounded-lg">
              <div className="flex flex-col space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white">River Stream</h2>
                  <div className="flex items-center space-x-3">
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
                    <div className="relative group">
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-white/10 appearance-none pr-8 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="newest">Newest First</option>
                        <option value="popular">Most Popular</option>
                        <option value="voted">Most Voted</option>
                        <option value="trending">Trending Now</option>
                      </select>
                      <SortAsc className="absolute right-2 top-2.5 text-gray-500 pointer-events-none" size={16} />
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search videos..."
                    className="flex-grow bg-gray-800 text-white px-3 py-2 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none border-y border-l border-white/10" />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg font-bold transition-colors"
                  >
                    Search
                  </button>
                </form>
              </div>
              <div className="content-scroll max-h-[calc(100vh-200px)] overflow-y-auto">
                <VideoFeed
                  videos={danciaVideos.length > 0 ? danciaVideos : videos}
                  onPlayVideo={playVideo}
                  onFilterByGenre={filterByGenre}
                  onAddToWatchlist={addToWatchlist}
                />
              </div>
            </div>

            {/* Right column - Canary (information highway) */}
            <div className="column canary-column bg-gray-900 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-white">Canary</h2>
              <div className="content-scroll max-h-[calc(100vh-200px)] overflow-y-auto">
                <TrendingVideosSection
                  videos={
                    trendingVideos.length > 0
                      ? trendingVideos
                      : danciaVideos.slice(0, 5)
                  }
                  onPlayVideo={playVideo}
                />
                <NotificationsPanel />
                <AdsPanel />
              </div>
            </div>
          </div>
        )}

        {activeTab === "browse" && (
          <div className="browse-content">
            <div className="movie-types mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Movie Types
              </h2>
              <div className="movie-types-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {movieTypes.map((type, index) => (
                  <div
                    key={index}
                    className="movie-type-card bg-gray-800 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => filterByMovieType(type)}
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
                ).map((plan) => (
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

        {activeTab === "subscriptions" && (
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
                    onClick={() => setActiveTab("browse")}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Explore Plans
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "my-library" && (
          <div className="my-library-content">
            <h2 className="text-2xl font-bold mb-4 text-white">My Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">
                  Watchlist
                </h3>
                <div className="space-y-3">
                  {memberWatchlist.map((video) => (
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
                        <p className="text-sm font-medium text-white truncate">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-400">{video.genre}</p>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(video.videoID)}
                        className="text-red-500 hover:text-red-700"
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
                  {memberPlayHistory.slice(0, 5).map((video) => (
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
                        <p className="text-sm font-medium text-white truncate">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-400">{video.genre}</p>
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
                  {memberPlayHistory.slice(0, 5).map((video) => (
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
                        <p className="text-sm font-medium text-white truncate">
                          {video.title}
                        </p>
                        <p className="text-xs text-gray-400">{video.genre}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
    </div>
  );
};

// Age Verification Modal Component
const AgeVerificationModalLocal: React.FC<{
  onVerify: (year: number, month: number) => void;
}> = ({ onVerify }) => {
  const { showToast } = useAppContext();
  const [birthYear, setBirthYear] = React.useState("");
  const [birthMonth, setBirthMonth] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);

    if (year && month && month >= 1 && month <= 12) {
      onVerify(year, month);
    } else {
      showToast("Please enter a valid birth year and month", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Age Verification</h3>
        <p className="text-gray-300 mb-4">
          Please verify you are over 18 years old to access this content.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() =>
              onVerify(new Date().getFullYear(), new Date().getMonth())
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

const GenreSelectionModalLocal: React.FC<{
  genres: string[];
  onSelectGenres: (genres: string[]) => void;
  selectedGenres: string[];
}> = ({ genres, onSelectGenres, selectedGenres }) => {
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      onSelectGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      if (selectedGenres.length < 12) {
        onSelectGenres([...selectedGenres, genre]);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">
          Select Your Favorite Genres
        </h3>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {genres.map((genre) => (
            <div key={genre} className="flex items-center">
              <input
                type="checkbox"
                id={genre}
                checked={selectedGenres.includes(genre)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onSelectGenres([...selectedGenres, genre]);
                  } else {
                    onSelectGenres(selectedGenres.filter((g) => g !== genre));
                  }
                }}
                className="mr-2"
              />
              <label htmlFor={genre} className="text-gray-300">
                {genre}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const ArtistSelectionModalLocal: React.FC<{
  onSelectArtists: (artists: string[]) => void;
  selectedArtists: string[];
}> = ({ onSelectArtists, selectedArtists }) => {
  // Mock artist data based on location proximity
  const artists = [
    "Wizkid",
    "Davido",
    "Burna Boy",
    "Tiwa Savage",
    "Tekno",
    "Mr Eazi",
    "Yemi Alade",
    "Flavour",
    "P-Square",
    "2Baba",
    "Olamide",
    "Wande Coal",
    "Dbanj",
    "Don Jazzy",
    "Timaya"
  ];

  const toggleArtist = (artist: string) => {
    if (selectedArtists.includes(artist)) {
      onSelectArtists(selectedArtists.filter((a) => a !== artist));
    } else {
      if (selectedArtists.length < 15) {
        onSelectArtists([...selectedArtists, artist]);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl font-bold text-white mb-4">Select Artists</h3>
        <p className="text-gray-300 mb-4">
          Choose your favorite artists to personalize recommendations.
        </p>
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Define placeholder components for missing ones
const VideoRecommendations: React.FC<{ videos: any[], title?: string, type?: string, onPlayVideo?: (video: any) => void, onAddToWatchlist?: (videoId: string) => Promise<void> }> = ({ videos }) => {
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

const VideoFeed: React.FC<{ 
  videos: any[], 
  onPlayVideo?: (video: any) => void,
  onFilterByGenre?: (genre: string) => void,
  onAddToWatchlist?: (video: any) => void
}> = ({ videos }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-2">Latest Videos</h3>
      <div className="space-y-4">
        {videos.slice(0, 4).map((video, idx) => (
          <div key={idx} className="p-3 bg-gray-700 rounded">
            <h4 className="text-white truncate">
              {video.title || `Video ${idx + 1}`}
            </h4>
            <p className="text-gray-400 text-sm">
              {video.description || "Description coming soon"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendingVideosSection: React.FC<{ 
  videos: any[],
  onPlayVideo?: (video: any) => void
}> = ({ videos }) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-2">Trending Now</h3>
      <div className="space-y-2">
        {videos.slice(0, 3).map((video, idx) => (
          <div key={idx} className="flex items-center p-2 bg-gray-700 rounded">
            <div className="w-16 h-10 bg-gray-600 rounded mr-2"></div>
            <div>
              <p className="text-white text-sm truncate">
                {video.title || `Trending ${idx + 1}`}
              </p>
              <p className="text-gray-400 text-xs">{video.views || 0} views</p>
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
      <p className="text-gray-400 text-sm">No new notifications</p>
    </div>
  );
};

const AdsPanel: React.FC = () => {
  return (
    <div className="p-3 bg-gray-700 rounded">
      <h3 className="text-lg font-bold text-white mb-2">Sponsored</h3>
      <p className="text-gray-400 text-sm">Advertisement content</p>
    </div>
  );
};

const SubscriptionPlanCard: React.FC<{ 
  plan: any,
  isSubscribed?: boolean,
  onSubscribe?: (planID: string) => Promise<void>,
  onUnsubscribe?: (planID: string) => Promise<void>
}> = ({ plan }) => {
  return (
    <div className="bg-gray-700 p-4 rounded-lg">
      <h4 className="text-white font-bold">{plan.name || "Plan Name"}</h4>
      <p className="text-gray-300 text-sm">
        {plan.description || "Plan details"}
      </p>
      <p className="text-white font-bold mt-2">{plan.price || "$0/month"}</p>
      <button className="mt-2 w-full py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
        Subscribe
      </button>
    </div>
  );
};

const VideoPlayer: React.FC<{ 
  video: any,
  playerState?: any,
  onPause?: () => void
}> = ({ video }) => {
  return (
    <div className="bg-black aspect-video rounded flex items-center justify-center">
      <div className="text-center">
        <div className="text-white text-xl mb-2">Video Player</div>
        <p className="text-gray-400">{video.title || "Loading..."}</p>
      </div>
    </div>
  );
};

// Export all helper components
export {
  AgeVerificationModalLocal,
  GenreSelectionModalLocal,
  ArtistSelectionModalLocal,
  VideoRecommendations,
  VideoFeed,
  TrendingVideosSection,
  NotificationsPanel,
  AdsPanel,
  SubscriptionPlanCard,
  VideoPlayer
};

export default Dancia4TvPage;
