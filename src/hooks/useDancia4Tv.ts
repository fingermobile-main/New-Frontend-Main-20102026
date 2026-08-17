import React, { useState, useEffect } from 'react';
import { useDancia4Tv } from '../contexts/Dancia4TvContext';
import type { VideoPlayerState } from '../contexts/Dancia4TvContext';
import {
  mockVideos,
  mockPlaylists,
  videoGenres,
  movieTypeChoices
} from '../data/dancia4tv';
import type { DanciaVideo, DanciaSubscriptionPlan, DanciaPlaylist, DanciaMember } from '../types/dancia4tv';

export const useDancia4TvData = () => {
  const {
    currentMember,
    currentVideo,
    subscriptionPlans,
    playlists,
    playerState,
    watchHistory,
    searchHistory,
    recommendations,
    loading,
    error,
    setCurrentMember,
    setCurrentVideo,
    updatePlayerState,
    addToWatchHistory,
    addToSearchHistory,
    addPlaylist,
    updatePlaylist,
    removePlaylist,
    recordEngagement,
    loadRecommendations,
    subscribeToPlan,
    unsubscribeFromPlan,
    getMemberSubscriptionStatus
  } = useDancia4Tv();

  const [videos, setVideos] = React.useState<DanciaVideo[]>(mockVideos as any);
  const [genres] = React.useState<string[]>(videoGenres);
  const [movieTypes] = React.useState<string[]>(movieTypeChoices);
  const [filteredVideos, setFilteredVideos] = React.useState<DanciaVideo[]>(mockVideos as any);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Filter videos based on search query
  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVideos(videos);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = videos.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.genre.toLowerCase().includes(query) ||
          video.contentTags.some((tag) => tag.toLowerCase().includes(query)),
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery, videos]);

  // Load recommendations when member changes
  React.useEffect(() => {
    if (currentMember) {
      loadRecommendations(String(currentMember.id));
    }
  }, [currentMember, loadRecommendations]);

  // Initialize with mock playlists
  React.useEffect(() => {
    if (playlists.length === 0) {
      mockPlaylists.forEach((playlist) => addPlaylist(playlist as any));
    }
  }, [playlists.length, addPlaylist]);

  const playVideo = React.useCallback(
    (
  video: DanciaVideo) => {
      setCurrentVideo(video);
      addToWatchHistory(video.videoID);
      updatePlayerState({
  isPlaying: true });
    },
    [setCurrentVideo, addToWatchHistory, updatePlayerState],
  );

  const pauseVideo = React.useCallback(() => {
    updatePlayerState({
  isPlaying: false });
  }, [updatePlayerState]);

  const resumeVideo = React.useCallback(() => {
    updatePlayerState({
  isPlaying: true });
  }, [updatePlayerState]);

  const stopVideo = React.useCallback(() => {
    updatePlayerState({
  isPlaying: false, currentTime: 0 });
  }, [updatePlayerState]);

  const seekVideo = React.useCallback(
    (
  time: number) => {
      updatePlayerState({
  currentTime: time });
    },
    [updatePlayerState],
  );

  const setVolume = React.useCallback(
    (
  volume: number) => {
      updatePlayerState({ volume,
isMuted: volume === 0 });
    },
    [updatePlayerState],
  );

  const toggleMute = React.useCallback(() => {
    updatePlayerState({
  isMuted: !playerState.isMuted });
  }, [playerState.isMuted, updatePlayerState]);

  const setPlaybackRate = React.useCallback(
    (
  rate: number) => {
      updatePlayerState({
  playbackRate: rate });
    },
    [updatePlayerState],
  );

  const toggleFullscreen = React.useCallback(() => {
    updatePlayerState({
  isFullscreen: !playerState.isFullscreen });
  }, [playerState.isFullscreen, updatePlayerState]);

  const searchVideos = React.useCallback(
    (
  query: string) => {
      setSearchQuery(query);
      addToSearchHistory(query);
    },
    [addToSearchHistory],
  );

  const filterByGenre = React.useCallback(
    (
  genre: string) => {
      if (genre === "All") {
        setFilteredVideos(videos);
      } else {
        const filtered = videos.filter((video) => video.genre === genre);
        setFilteredVideos(filtered);
      }
    },
    [videos],
  );

  const filterByMovieType = React.useCallback((
  type: string) => {
    // In a real app, this would filter videos by movie type
    console.info(`Filtering by movie,
type: ${type}`);
  }, []);

  const createPlaylist = React.useCallback(
    (
  name: string, videoIDs: string[] = []) => {
      if (!currentMember) return;

      const newPlaylist: DanciaPlaylist = {playlistID: `playlist_${Date.now()}`,
        name,
ownerID: String(currentMember.id),
videos: videoIDs, isPublic: false,
createdAt: new Date(),
updatedAt: new Date(),
metadata: {artist: "Various", album: name, tracks: [],
  genres: [],
  length: 0, fileSize: 0
        }
      };

      addPlaylist(newPlaylist);
      return newPlaylist;
    },
    [currentMember, addPlaylist],
  );

  const addToPlaylist = React.useCallback(
    (
  playlistID: string, videoID: string) => {
      const playlist = playlists.find((p) => p.playlistID === playlistID);
      if (playlist && !playlist.videos.includes(videoID)) {
        updatePlaylist(playlistID, {videos: [...playlist.videos,
  videoID],
  updatedAt: new Date()
        });
      }
    },
    [playlists, updatePlaylist],
  );

  const removeFromPlaylist = React.useCallback(
    (
  playlistID: string, videoID: string) => {
      const playlist = playlists.find((p) => p.playlistID === playlistID);
      if (playlist && playlist.videos.includes(videoID)) {
        updatePlaylist(playlistID, {videos: playlist.videos.filter((id) => id !== videoID),
  updatedAt: new Date()
        });
      }
    },
    [playlists, updatePlaylist],
  );

  const getAvailablePlans = React.useCallback((): DanciaSubscriptionPlan[] => {
    return subscriptionPlans;
  }, [subscriptionPlans]);

  const getMemberPlan = React.useCallback((): DanciaSubscriptionPlan | undefined => {
    if (!currentMember) return undefined;

    return subscriptionPlans.find(
      (plan) => plan.planID === currentMember.subscriptionPlanID,
    );
  }, [currentMember, subscriptionPlans]);

  const isMemberSubscribedTo = React.useCallback(
    (
  planType: DanciaSubscriptionPlan["type"]): boolean => {
      return getMemberSubscriptionStatus(planType);
    },
    [getMemberSubscriptionStatus],
  );

  return {
    // State
    currentMember,
    currentVideo,
    subscriptionPlans,
    playlists,
    playerState,
    watchHistory,
    searchHistory,
    recommendations,
    loading,
    error,
videos: filteredVideos,
    genres,
    movieTypes,
    searchQuery,

    // Actions
    setCurrentMember,
    playVideo,
    pauseVideo,
    resumeVideo,
    stopVideo,
    seekVideo,
    setVolume,
    toggleMute,
    setPlaybackRate,
    toggleFullscreen,
    searchVideos,
    filterByGenre,
    filterByMovieType,
    createPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    recordEngagement,
    subscribeToPlan,
    unsubscribeFromPlan,
    getAvailablePlans,
    getMemberPlan,
    isMemberSubscribedTo
  };
};
