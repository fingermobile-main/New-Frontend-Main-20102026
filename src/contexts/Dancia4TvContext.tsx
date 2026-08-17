import React, { useState, useEffect, useRef, createContext, useContext, ReactNode } from 'react';
import type { DanciaMember, DanciaVideo, DanciaMemberEngagementFeedback, DanciaPlaylist, DanciaSubscriptionPlan } from '../types/dancia4tv';

// Local VideoPlayerState definition to avoid module resolution issues
export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  isBuffering: boolean;
}

interface Dancia4TvContextType {
  currentMember: DanciaMember | null;
  currentVideo: DanciaVideo | null;
  subscriptionPlans: DanciaSubscriptionPlan[];
  playlists: DanciaPlaylist[];
  playerState: VideoPlayerState;
  watchHistory: string[];
  searchHistory: string[];
  recommendations: DanciaVideo[];
  loading: boolean;
  error: string | null;

  // Actions
  setCurrentMember: (member: DanciaMember | null) => void;
  setCurrentVideo: (video: DanciaVideo | null) => void;
  updatePlayerState: (state: Partial<VideoPlayerState>) => void;
  addToWatchHistory: (videoID: string) => void;
  addToSearchHistory: (query: string) => void;
  addPlaylist: (playlist: DanciaPlaylist) => void;
  updatePlaylist: (playlistID: string, playlist: Partial<DanciaPlaylist>) => void;
  removePlaylist: (playlistID: string) => void;
  recordEngagement: (feedback: DanciaMemberEngagementFeedback) => void;
  loadRecommendations: (memberId: string) => void;
  subscribeToPlan: (planID: string) => void;
  unsubscribeFromPlan: (planID: string) => void;
  getMemberSubscriptionStatus: (planType: DanciaSubscriptionPlan["type"]) => boolean;
}

const Dancia4TvContext = createContext<Dancia4TvContextType | undefined>(
  undefined,
);

export const useDancia4Tv = () => {
  const context = React.useContext(Dancia4TvContext);
  if (context === undefined) {
    throw new Error("useDancia4Tv must be used within a Dancia4TvProvider");
  }
  return context;
};

interface Dancia4TvProviderProps {
  children: ReactNode;
}

export const Dancia4TvProvider: React.FC<Dancia4TvProviderProps> = ({
  children
}) => {
  const [currentMember, setCurrentMember] = React.useState<DanciaMember | null>(null);
  const [currentVideo, setCurrentVideo] = React.useState<DanciaVideo | null>(null);
  const [subscriptionPlans] = React.useState<DanciaSubscriptionPlan[]>([
    {
      planID: "1",
      name: "Pay-Tv & Live Broadcast",
      type: "Pay-Tv",
      features: [
        "Live TV channels",
        "Sports events",
        "News broadcasts",
        "Real-time content",
        "Multiple device streaming",
        "DVR functionality"
      ],
      pricing: { monthly: 29.99, yearly: 299.99, currency: "USD" },
      coverageRegions: [
        "USA",
        "Europe",
        "Australia",
        "Africa",
        "Asia",
        "Middle East"
      ]
    },
    {
      planID: "2",
      name: "SVOD",
      type: "SVOD",
      features: [
        "Ad-free streaming",
        "Unlimited access to library",
        "Multiple devices",
        "Offline downloads",
        "4K content",
        "Exclusive originals"
      ],
      pricing: { monthly: 12.99, yearly: 119.99, currency: "USD" },
      coverageRegions: [
        "USA",
        "Europe",
        "Australia",
        "Africa",
        "Asia",
        "Middle East"
      ]
    },
    {
      planID: "3",
      name: "TVOD",
      type: "TVOD",
      features: [
        "Rent individual content",
        "Keep content for 48 hours",
        "HD/4K quality",
        "New releases",
        "Classic films",
        "Premium content"
      ],
      pricing: { perItem: 4.99, currency: "USD" },
      coverageRegions: [
        "USA",
        "Europe",
        "Australia",
        "Africa",
        "Asia",
        "Middle East"
      ]
    },
    {
      planID: "4",
      name: "AVOD",
      type: "AVOD",
      features: [
        "Free content with ads",
        "Basic streaming quality",
        "Limited selection",
        "Mobile access",
        "Tablet access",
        "Smart TV access"
      ],
      pricing: { monthly: 0, yearly: 0, currency: "USD" },
      coverageRegions: [
        "USA",
        "Europe",
        "Australia",
        "Africa",
        "Asia",
        "Middle East"
      ]
    },
    {
      planID: "5",
      name: "HVOD",
      type: "HVOD",
      features: [
        "Combination of all models",
        "Flexible pricing",
        "Premium features",
        "Ad-free options",
        "Live and on-demand content",
        "Personalized recommendations"
      ],
      pricing: { monthly: 19.99, yearly: 179.99, currency: "USD" },
      coverageRegions: [
        "USA",
        "Europe",
        "Australia",
        "Africa",
        "Asia",
        "Middle East"
      ]
    }
  ]);
  const [playlists, setPlaylists] = React.useState<DanciaPlaylist[]>([]);
  const [playerState, setPlayerState] = React.useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    playbackRate: 1,
    isFullscreen: false,
    isBuffering: false
  });
  const [watchHistory, setWatchHistory] = React.useState<string[]>([]);
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);
  const [recommendations, setRecommendations] = React.useState<DanciaVideo[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize member data from localStorage if available
  React.useEffect(() => {
    const savedMember = localStorage.getItem("dancia4tv_member");
    if (savedMember) {
      try {
        setCurrentMember(JSON.parse(savedMember));
      } catch (e) {
        console.error("Failed to parse member data", e);
      }
    }
  
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Save member data to localStorage when it changes
  React.useEffect(() => {
    if (currentMember) {
      localStorage.setItem("dancia4tv_member", JSON.stringify(currentMember));
    } else {
      localStorage.removeItem("dancia4tv_member");
    }
  
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentMember]);

  const updatePlayerState = (state: Partial<VideoPlayerState>) => {
    setPlayerState((prev) => ({ ...prev, ...state }));
  };

  const addToWatchHistory = (videoID: string) => {
    setWatchHistory((prev) => Array.from(new Set([videoID, ...prev])));
    // Note: watchHistory is managed separately, not on DanciaMember
  };

  const addToSearchHistory = (query: string) => {
    setSearchHistory((prev) => Array.from(new Set([query, ...prev])));
  };

  const addPlaylist = (playlist: DanciaPlaylist) => {
    setPlaylists((prev) => [...prev, playlist]);
  };

  const updatePlaylist = (playlistID: string, playlist: Partial<DanciaPlaylist>) => {
    setPlaylists((prev) =>
      prev.map((p) =>
        p.playlistID === playlistID ? { ...p, ...playlist } : p,
      ),
    );
  };

  const removePlaylist = (playlistID: string) => {
    setPlaylists((prev) => prev.filter((p) => p.playlistID !== playlistID));
  };

  const recordEngagement = (feedback: DanciaMemberEngagementFeedback) => {
    // In a real app, this would send feedback to the server
    console.info("Recording engagement feedback:", feedback);
    
    // Calculate engagement score based on feedback
    const newScore = calculateEngagementScore(feedback);
    
    // Update local state or send to API
    setRecommendations(prev => {
      // Update recommendation scores based on feedback
      return prev.map(video => {
        if (video.videoID === feedback.videoID) {
          return { ...video, engagementScore: newScore };
        }
        return video;
      });
    });
  };

  const calculateEngagementScore = (feedback: DanciaMemberEngagementFeedback): number => {
    let score = 0.5; // Base score
    
    if (feedback.liked) score += 0.2;
    if (!feedback.skipped && feedback.listenedPast30Sec) score += 0.15;
    if (feedback.saved) score += 0.1;
    if (feedback.repeated) score += 0.3;
    if (feedback.playlistAdded) score += 0.25;
    
    // Ensure score stays within 0-1 range
    return Math.min(1, Math.max(0, score));
  };

  const loadRecommendations = (memberId: string) => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const mockRecommendations: DanciaVideo[] = [
        {
          videoID: "1",
          title: "Action Movie 1",
          description: "An exciting action movie",
          genre: "Action",
          IARCClassification: {
            classificationID: "1",
            rating: "18+",
            description: "Contains explicit content"
          },
          monetizationModel: {
            modelID: "1",
            name: "Starter Pack",
            description: "Starter monetization tier",
            revenueShare: 50,
            currency: "USD",
            thresholds: {
              likes: 1000000,
              shares: 100000,
              comments: 200000,
              watchTimeSeconds: 10000
            }
          },
          uploadFee: 0,
          length: 7200,
          resolution: "4K",
          contentTags: ["action", "adventure"],
          uploadDate: new Date(),
          uploaderID: "member1",
          engagementScore: 0.8,
          downloadCount: 1500000,
          shareCount: 250000,
          saveCount: 300000,
          likeCount: 2000000,
          mashupCount: 50000
        },
        {
          videoID: "2",
          title: "Drama Series 1",
          description: "A compelling drama series",
          genre: "Drama",
          IARCClassification: {
            classificationID: "2",
            rating: "18+",
            description: "Contains mature themes"
          },
          monetizationModel: {
            modelID: "2",
            name: "Gem Pack",
            description: "Intermediate monetization tier",
            revenueShare: 60,
            currency: "USD",
            thresholds: {
              likes: 2000000,
              shares: 300000,
              comments: 500000,
              watchTimeSeconds: 20000
            }
          },
          uploadFee: 0,
          length: 3600,
          resolution: "1080p",
          contentTags: ["drama", "family"],
          uploadDate: new Date(),
          uploaderID: "member2",
          engagementScore: 0.7,
          downloadCount: 900000,
          shareCount: 150000,
          saveCount: 200000,
          likeCount: 1800000,
          mashupCount: 30000
        }
      ];

      setRecommendations(mockRecommendations);
      setLoading(false);
    }, 500);
  };

  const subscribeToPlan = (planID: string) => {
    if (!currentMember) {
      setError("You must be logged in to subscribe");
      return;
    }

    const plan = subscriptionPlans.find((p) => p.planID === planID);
    if (!plan) {
      setError("Plan not found");
      return;
    }

    setCurrentMember({
      ...currentMember,
      subscriptionPlanID: planID
    });

    console.info(`Successfully subscribed to ${plan.name}`);
  };

  const unsubscribeFromPlan = (planID: string) => {
    if (!currentMember) {
      setError("You must be logged in to unsubscribe");
      return;
    }

    if (currentMember.subscriptionPlanID === planID) {
      setCurrentMember({
        ...currentMember,
        subscriptionPlanID: ""
      });

      console.info("Successfully unsubscribed");
    }
  };

  const getMemberSubscriptionStatus = (planType: DanciaSubscriptionPlan["type"]) => {
    if (!currentMember) return false;

    const memberPlan = subscriptionPlans.find(
      (plan) => plan.planID === currentMember.subscriptionPlanID,
    );

    return memberPlan?.type === planType;
  };

  const contextValue: Dancia4TvContextType = {
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
  };

  return (
    <Dancia4TvContext.Provider value={contextValue}>
      {children}
    </Dancia4TvContext.Provider>
  );
};

export default Dancia4TvProvider;
