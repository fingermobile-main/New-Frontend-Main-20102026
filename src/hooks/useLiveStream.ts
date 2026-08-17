import React, { useState } from 'react';
import { liveStreamService, CreateLiveStreamData } from '../services/liveStreamService';

// Use CreateLiveStreamData from liveStreamService
interface LiveStreamHookState {
  activeStreams: ActiveStream[]; loading: boolean; error: string | null; canGoLive: boolean; followerCount: number; requiredFollowers: number;
}

interface ActiveStream {
  id: string; title: string;
  description?: string; host: {
  id: string; name: string; avatar: string;
  }; viewers: number; startTime: string; category: string;
  tags?: string[]; affiliatePartnerType: string;
}

const useLiveStream = () => {
  const [activeStreams, setActiveStreams] = React.useState<ActiveStream[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [canGoLive, setCanGoLive] = React.useState(false);
  const [followerCount, setFollowerCount] = React.useState(0);
  const [requiredFollowers, setRequiredFollowers] = React.useState(0);

  // Fetch active streams
  const fetchActiveStreams = async (
  filters: any = {}
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Updated to use the new API response format
      const response = await liveStreamService.getActiveStreams(filters);
      
      // Transform LiveStream[] to ActiveStream[] format
      const transformedStreams: ActiveStream[] = (response.streams || []).map(stream => ({id: stream.id,
  title: stream.title,
  host: {
  id: stream.streamerId,
  name: stream.streamerName,
  avatar: stream.thumbnail || ''
        },
viewers: stream.viewers,
startTime: stream.startedAt || new Date().toISOString(),
category: stream.category,
affiliatePartnerType: 'standard'
      }));
      
      setActiveStreams(transformedStreams);
    } catch (
  err: any) {
      setError("Failed to fetch active streams");
      console.error("Failed to fetch active streams");
    } finally {
      setLoading(false);
    }
  };

  // Create a new live stream
  const createLiveStream = async (
  streamData: CreateLiveStreamData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await liveStreamService.createStream(streamData);
      console.info("Live stream created successfully");
      return response;
    } catch (
  err: any) {
      setError(err.message || "Failed to create live stream.");
      console.error("Failed to create live stream.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle go live eligibility
  const toggleGoLiveEligibility = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await liveStreamService.canGoLive();
      setCanGoLive(response.canGoLive);
      console.info(response.message || "Go live eligibility updated");
      return response;
    } catch (
  err: any) {
      setError(err.message || "Failed to update go live eligibility.");
      console.error("Failed to update go live eligibility.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get go live eligibility status
  const fetchGoLiveEligibility = async () => {
    try {
      const response = await liveStreamService.canGoLive(); // Using the actual method from service
      setCanGoLive(response.canGoLive);
      // Set followerCount and requiredFollowers if available in response
      setFollowerCount(response.followerCount || 0);
      setRequiredFollowers(response.requiredFollowers || 0);
    } catch (
  err: any) {
      setError(err.message || "Failed to fetch go live eligibility");
    }
  };

  // End a live stream
  const endLiveStream = async (
  streamId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await liveStreamService.endStream(streamId);
      console.info("Live stream ended successfully");
      // Refresh active streams after ending one
      fetchActiveStreams();
      return response;
    } catch (
  err: any) {
      setError(err.message || "Failed to end live stream.");
      console.error("Failed to end live stream.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Start streaming to an affiliate partner
  const startAffiliateStreaming = async (
  title: string,
description?: string,
category: string,
tags: string[],
affiliatePartnerType: string,
maxDuration: number,
    scheduledStartTime?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const streamData = {
        title,
        description,
        category,
        tags,
        affiliatePartnerType,
        maxDuration,
        scheduledStartTime,
        privacy: 'public' as const,
        enableChat: true,
        enableRecording: false
      };

      const response = await liveStreamService.createStream(streamData);
      console.info("Started affiliate streaming successfully");
      return response;
    } catch (
  err: any) {
      setError(err.message || "Failed to start affiliate streaming.");
      console.error("Failed to start affiliate streaming.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Stop affiliate streaming
  const stopAffiliateStreaming = async (
  streamId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await liveStreamService.endStream(streamId);
      console.info("Stopped affiliate streaming successfully");
      return response;
    } catch (
  err: any) {
      setError(err.message || "Failed to stop affiliate streaming.");
      console.error("Failed to stop affiliate streaming.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    activeStreams,
    loading,
    error,
    canGoLive,
    followerCount,
    requiredFollowers,
    fetchActiveStreams,
    createLiveStream,
    toggleGoLiveEligibility,
    fetchGoLiveEligibility,
    endLiveStream,
    startAffiliateStreaming,
    stopAffiliateStreaming
  };
};

export default useLiveStream;