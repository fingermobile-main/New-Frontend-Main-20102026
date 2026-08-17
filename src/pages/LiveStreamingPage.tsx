import React, { useCallback, useMemo } from 'react';


import { LIVE_STREAMS } from '../constants/dashboardConstants';
import type { LiveStream } from '../types';
import { 
  CalendarIcon, 
  HeartIcon, 
  UserGroupIcon,
  ClockIcon,
  GlobeAltIcon,
  LockClosedIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  ShareIcon,
  GiftIcon,
  CurrencyDollarIcon
} from '../icons';
import { useAppContext } from "../contexts/AppContext";
import AnimatedAvatar from '../components/AnimatedAvatar';
import PageHeader from '../components/PageHeader';
import MainLayout from '../components/layout/MainLayout';

// --- Subcomponent: Streamer Dashboard ---
interface StreamerDashboardProps {
  isLive: boolean;
  ficBalance: number;
  scheduledEvents?: any[];
  handleGoLive?: () => void;
  handleStopLive?: () => void;
  handleStartConference?: () => void;
}

const StreamerDashboard: React.FC<StreamerDashboardProps> = React.memo(({
  isLive,
  ficBalance,
  scheduledEvents,
  handleGoLive,
  handleStopLive,
  handleStartConference
}) => {
  const handleOpenScheduleModal = useCallback(() => {
    document.getElementById("schedule-modal")?.classList.remove("hidden");
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 mb-8 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Become a Streamer</h2>
          <p className="mt-1 opacity-90">Start your live stream and engage with your audience</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGoLive}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <VideoCameraIcon className="w-5 h-5" />
            Go Live
          </button>
          <button
            onClick={handleOpenScheduleModal}
            className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg transition"
          >
            <CalendarIcon className="w-5 h-5" />
            Schedule Event
          </button>
          <button
            onClick={handleStartConference}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            <MicrophoneIcon className="w-5 h-5" />
            Start Conference
          </button>
        </div>
      </div>

      {isLive && (
        <div className="mt-6 p-4 bg-red-500 bg-opacity-20 border border-red-400 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span className="font-medium">You are currently live</span>
            </div>
            <button
              onClick={handleStopLive}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              End Stream
            </button>
          </div>
          <div className="mt-2 text-sm opacity-90">
            Your stream is visible to everyone. Click "End Stream" when you're finished.
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white bg-opacity-20 p-4 rounded-lg">
          <div className="text-2xl font-bold">{ficBalance.toFixed(2)} FIC</div>
          <div className="text-sm opacity-90">FIC Balance</div>
        </div>
        <div className="bg-white bg-opacity-20 p-4 rounded-lg">
          <div className="text-2xl font-bold">{(scheduledEvents || []).length}</div>
          <div className="text-sm opacity-90">Scheduled Events</div>
        </div>
        <div className="bg-white bg-opacity-20 p-4 rounded-lg">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm opacity-90">Current Viewers</div>
        </div>
      </div>
    </div>
  );
});

StreamerDashboard.displayName = 'StreamerDashboard';

// --- Subcomponent: Individual Stream Card ---
interface StreamCardProps {
  stream: LiveStream;
  paidStreamIds?: string[];
  onLike: (id: string) => void;
  onOpenGiftModal: (id: string) => void;
  onOpenPaylinkModal: (id: string) => void;
  onVote: (id: string, dir: 'up' | 'down') => void;
  onTokenize: (id: string) => void;
  onAiAssist: (id: string) => void;
}

const StreamCard: React.FC<StreamCardProps> = React.memo(({
  stream,
  paidStreamIds,
  onLike,
  onOpenGiftModal,
  onOpenPaylinkModal,
  onVote,
  onTokenize,
  onAiAssist
}) => {
  const handleLike = useCallback(() => onLike(stream.id), [stream.id, onLike]);
  const handleVoteUp = useCallback(() => onVote(stream.id, 'up'), [stream.id, onVote]);
  const handleVoteDown = useCallback(() => onVote(stream.id, 'down'), [stream.id, onVote]);
  const handleTokenize = useCallback(() => onTokenize(stream.id), [stream.id, onTokenize]);
  const handleAiAssist = useCallback(() => onAiAssist(stream.id), [stream.id, onAiAssist]);

  const handleGiftOrPaylink = useCallback(() => {
    if ((paidStreamIds || []).includes(stream.id)) {
      onOpenGiftModal(stream.id);
    } else {
      onOpenPaylinkModal(stream.id);
    }
  }, [stream.id, paidStreamIds, onOpenGiftModal, onOpenPaylinkModal]);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative">
        <img src={stream.thumbnail} alt={stream.title} className="w-full h-48 object-cover" />
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          LIVE
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-sm">
          {stream.viewers} viewers
        </div>
        {stream.isFeatured && (
          <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
            Featured
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <AnimatedAvatar
            staticUrl={stream.creator?.avatarUrl}
            animatedUrl={stream.creator?.animatedAvatarUrl}
            altText={stream.creator?.name || 'Unknown'}
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 line-clamp-1">{stream.title}</h3>
            <p className="text-gray-600 text-sm">{stream.creator?.name || 'Unknown Creator'}</p>
            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{stream.description}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={handleLike} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <HeartIcon className="w-4 h-4" />
            </button>
            <button onClick={handleGiftOrPaylink} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <GiftIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-1">
            <button onClick={handleVoteUp} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">👍</button>
            <button onClick={handleVoteDown} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">👎</button>
            <button onClick={handleTokenize} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">🪙</button>
            <button onClick={handleAiAssist} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">🤖</button>
          </div>
        </div>
      </div>
    </div>
  );
});

StreamCard.displayName = 'StreamCard';

// --- Main Container Page ---
const LiveStreamingPage: React.FC = () => {
  const {
    isLive,
    handleGoLive,
    handleStopLive,
    ficBalance,
    handleStartConference,
    paidStreamIds,
    scheduledEvents,
    showToast
  } = useAppContext();

  const featuredStreamData = useMemo(() => 
    LIVE_STREAMS.find((s: LiveStream) => s.isFeatured) || null
  , []);

  const otherStreams = useMemo(() => 
    LIVE_STREAMS.filter((s: LiveStream) => !s.isFeatured)
  , []);

  const onLike = useCallback(async (streamId: string) => {
    try {
      showToast("Stream liked successfully");
    } catch {
      showToast("Failed to like stream", "error");
    }
  }, [showToast]);

  const onOpenGiftModal = useCallback((streamId: string) => {
    // Implement gift modal logic here
  }, []);

  const onOpenPaylinkModal = useCallback((streamId: string) => {
    // Implement paylink modal logic here
  }, []);

  const onVote = useCallback(async (streamId: string, voteType: "up" | "down") => {
    try {
      showToast("Vote recorded successfully");
    } catch {
      showToast("Failed to record vote", "error");
    }
  }, [showToast]);

  const handleTokenizeStream = useCallback(async (streamId: string) => {
    try {
      showToast("Stream tokenized successfully");
    } catch {
      showToast("Failed to tokenize stream", "error");
    }
  }, [showToast]);

  const handleAiAssist = useCallback(async (streamId: string) => {
    try {
      showToast("AI assistance applied successfully");
    } catch {
      showToast("Failed to apply AI assistance", "error");
    }
  }, [showToast]);

  return (
    <MainLayout pageTitle="Live Streaming">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
              <VideoCameraIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">Live Streaming</h1>
              <p className="text-gray-600">Watch live streams from creators or start your own.</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <StreamerDashboard 
            isLive={isLive || false}
            ficBalance={ficBalance}
            scheduledEvents={scheduledEvents || []}
            handleGoLive={handleGoLive}
            handleStopLive={handleStopLive}
            handleStartConference={handleStartConference}
          />
        </div>

        {featuredStreamData && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Featured Stream</h2>
            <StreamCard 
              stream={featuredStreamData} 
              paidStreamIds={paidStreamIds as string[] || []}
              onLike={onLike}
              onOpenGiftModal={onOpenGiftModal}
              onOpenPaylinkModal={onOpenPaylinkModal}
              onVote={onVote}
              onTokenize={handleTokenizeStream}
              onAiAssist={handleAiAssist}
            />
          </div>
        )}

        {otherStreams.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Other Live Streams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {otherStreams.map((stream) => (
                <StreamCard 
                  key={stream.id} 
                  stream={stream} 
                  paidStreamIds={paidStreamIds as string[] || []}
                  onLike={onLike}
                  onOpenGiftModal={onOpenGiftModal}
                  onOpenPaylinkModal={onOpenPaylinkModal}
                  onVote={onVote}
                  onTokenize={handleTokenizeStream}
                  onAiAssist={handleAiAssist}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LiveStreamingPage;