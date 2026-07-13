import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import { logError } from '../utils/errorLogger';
import apiService from '../services/apiService';
import { useFingerWars } from '../hooks/useFingerWars';
import type { FingerWarChallenge, SuggestedMember, VoiceLine } from '../types';
import AnimatedAvatar from '../components/AnimatedAvatar';
import { GameIcon } from '../icons';
import EnhancedFilterBar from '../components/shared/EnhancedFilterBar';
import FixedAdBanner from '../components/FixedAdBanner';
import VoiceLineService from '../services/VoiceLineService';

// Temporarily commented out to fix compilation - FINGERWARS_LEADERBOARD placeholder added to constants
// import { FINGERWARS_LEADERBOARD } from '../constants';
interface MockLeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  wins: number;
}

const FINGERWARS_LEADERBOARD: MockLeaderboardEntry[] = [
  { rank: 1, username: 'Player1', score: 1000, wins: 50 },
  { rank: 2, username: 'Player2', score: 950, wins: 45 },
  { rank: 3, username: 'Player3', score: 900, wins: 40 }
];

// --- Domain Interface Extension Schema ---
interface ChallengeData extends FingerWarChallenge {
  category: string;
  progress: number;
  reward: number;
}

interface LeaderboardEntry {
  score: number;
  member: SuggestedMember & {
    avatarUrl?: string;
    animatedAvatarUrl?: string;
    handle?: string;
  };
}

// --- Subcomponent: Decoupled Challenge Card Item ---
interface ChallengeCardProps {
  challenge: ChallengeData;
  onClaim: (id: string | number) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = React.memo(({ challenge, onClaim }) => {
  const handleClaimReward = React.useCallback(() => {
    onClaim(challenge.id);
  }, [challenge.id, onClaim]);

  const isComplete = challenge.progress >= 100;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 border border-gray-700/30 transition duration-150">
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-bold text-base sm:text-lg text-white tracking-tight">{challenge.title}</h3>
          <span className="px-2.5 py-1 bg-yellow-500 text-gray-950 text-xs font-black rounded-md shrink-0 shadow-sm">
            {challenge.reward} FIC
          </span>
        </div>
        <p className="text-gray-400 text-xs sm:text-sm mt-2 line-clamp-2">{challenge.description}</p>
        
        <div className="mt-5">
          <div className="flex justify-between text-xs font-semibold mb-1 text-gray-300">
            <span>Progress Matrix</span>
            <span>{challenge.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(challenge.progress, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-5 flex justify-between items-center gap-2">
          <div className="flex items-center text-gray-400 text-xs font-medium">
            <GameIcon className="w-4 h-4 mr-1.5 shrink-0" />
            <span className="capitalize">{challenge.category}</span>
          </div>
          <button 
            onClick={handleClaimReward}
            disabled={!isComplete}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-150 shadow-sm ${
              !isComplete 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-yellow-500 text-gray-950 hover:bg-yellow-600'
            }`}
          >
            {isComplete ? 'Claim Reward' : 'In Progress'}
          </button>
        </div>
      </div>
    </div>
  );
});

ChallengeCard.displayName = 'ChallengeCard';

// --- Subcomponent: Decoupled Leaderboard Item Node ---
interface LeaderboardItemProps {
  name: string;
  username: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  score: number;
  rank: number;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = React.memo(({ name, username, avatarUrl, animatedAvatarUrl, score, rank }) => (
  <div className="p-4 flex items-center justify-between hover:bg-gray-750/30 transition duration-100">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-6 text-center font-black text-sm text-yellow-500/90">#{rank}</div>
      <div className="shrink-0">
        <AnimatedAvatar 
          staticUrl={avatarUrl || ''} 
          animatedUrl={animatedAvatarUrl} 
          altText={name} 
          className="w-9 h-9 rounded-full border border-gray-700 shadow-inner" 
        />
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm text-white truncate">{name}</div>
        <div className="text-xs text-gray-400 truncate">{username}</div>
      </div>
    </div>
    <div className="font-black text-sm sm:text-base text-gray-100 pl-2 shrink-0">{score.toLocaleString()}</div>
  </div>
));

LeaderboardItem.displayName = 'LeaderboardItem';

// --- Main Container Page Component ---
const FingerWarsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { challenges, loading, error, refreshData, claimReward } = useFingerWars();
  
  const [isVoiceServiceInitialized, setIsVoiceServiceInitialized] = React.useState<boolean>(false);
  
  const [filters, setFilters] = React.useState({
    query: '',
    category: 'all',
    sortBy: 'newest'
  });

  // Initialize unified voice services
  React.useEffect(() => {
    let activeScope = true;
    const initializeVoiceService = async () => {
      try {
        await VoiceLineService.initialize();
        if (!activeScope) return;
        setIsVoiceServiceInitialized(true);
        showToast('FingerWars voice line service initialized successfully!', 'success');
      } catch (err) {
        if (!activeScope) return;
        logError('Failed to initialize FingerWars voice line service:', { context: 'FingerWarsPage - initialization', error: err });
        showToast('Failed to initialize FingerWars voice line service', 'error');
      }
    };

    initializeVoiceService();
    return () => { activeScope = false; };
  }, [showToast]);

  const playVoiceLine = React.useCallback(async (voiceLine: VoiceLine | null) => {
    if (!voiceLine) {
      showToast('No voice line available to play', 'error');
      return;
    }
    try {
      await VoiceLineService.playVoiceLine(voiceLine.text);
      showToast(`Playing: "${voiceLine.text}"`, 'success');
    } catch (err) {
      logError('Failed to play voice line context:', { context: 'FingerWarsPage - playVoiceLine', error: err });
      showToast('Failed to execute audio streaming pipeline', 'error');
    }
  }, [showToast]);

  const getRandomVoiceLineByCategory = React.useCallback((category: 'fingerwars' | 'combo' | 'stun' | 'general') => {
    const voiceLine = VoiceLineService.getRandomVoiceLineByCategory(category);
    if (voiceLine) {
      playVoiceLine(voiceLine);
    } else {
      showToast(`No voice lines available for category: ${category}`, 'error');
    }
  }, [playVoiceLine, showToast]);

  // Social Action Intermediary Pipeline Blocks
  const _onLike = async (postId: string) => {
    try {
      await apiService.request(`/fingerwars/posts/${postId}/like`, { method: 'POST' });
      showToast('Post liked successfully!', 'success');
    } catch (err) {
      logError('Error liking post:', { context: 'FingerWarsPage - onLike', error: err });
      showToast('Failed to like post', 'error');
    }
  };

  const _onAddComment = async (postId: string, comment: string) => {
    try {
      await apiService.request(`/fingerwars/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ comment })
      });
      showToast('Comment added successfully!', 'success');
    } catch (err) {
      logError('Error adding comment:', { context: 'FingerWarsPage - onAddComment', error: err });
      showToast('Failed to add comment', 'error');
    }
  };

  const _onVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      await apiService.request(`/fingerwars/posts/${postId}/vote`, {
        method: 'POST',
        body: JSON.stringify({ voteType })
      });
      showToast(`Vote ${voteType} registered successfully!`, 'success');
    } catch (err) {
      logError('Error voting:', { context: 'FingerWarsPage - onVote', error: err });
      showToast('Failed to register vote', 'error');
    }
  };

  const handleFiltersChange = React.useCallback((newFilters: { query?: string; category?: string; sortBy?: string; }) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleClaimReward = React.useCallback((id: string | number) => {
    if (claimReward) claimReward(String(id));
  }, [claimReward]);

  // Telemetry filtering and lookup calculations optimized via useMemo
  const filteredChallenges = React.useMemo(() => {
    let result = [...((challenges || []) as unknown as ChallengeData[])];

    if (filters.query) {
      const searchNormalized = filters.query.toLowerCase();
      result = result.filter(challenge =>
        challenge.title?.toLowerCase().includes(searchNormalized) ||
        challenge.description?.toLowerCase().includes(searchNormalized)
      );
    }

    if (filters.category !== 'all') {
      result = result.filter(challenge => challenge.category === filters.category);
    }

    switch (filters.sortBy) {
      case 'progress':
        result.sort((a, b) => (a.progress || 0) - (b.progress || 0));
        break;
      case 'reward':
        result.sort((a, b) => (b.reward || 0) - (a.reward || 0));
        break;
      default:
        break;
    }

    return result;
  }, [filters, challenges]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-yellow-500 font-semibold tracking-wide text-sm animate-pulse">Loading Arena Challenges...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 p-4">
        <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl shadow-xl max-w-sm w-full text-center" role="alert">
          <strong className="block font-black text-red-500 text-lg mb-1">Pipeline Error</strong>
          <span className="block text-sm text-gray-400 mb-4">{error}</span>
          <button
            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-gray-950 text-sm font-bold rounded-xl transition duration-150"
            onClick={refreshData}
          >
            Retry Arena Handshake
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-900 min-h-screen text-white font-sans max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-yellow-500 rounded-xl shadow-md shrink-0">
            <GameIcon className="w-8 h-8 text-gray-950" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">FingerWars</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Compete in high-stakes structural challenges and earn rewards</p>
          </div>
        </div>
        <button
          onClick={() => {
            getRandomVoiceLineByCategory('fingerwars');
          }}
          className="sm:self-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition duration-150 shrink-0 text-center"
        >
          Play Random Voice Line
        </button>
      </div>

      <EnhancedFilterBar 
        filterOptions={{
          categories: [
            { value: 'all', label: 'All Categories' },
            { value: 'music', label: 'Music' },
            { value: 'art', label: 'Art' },
            { value: 'gaming', label: 'Gaming' },
            { value: 'photography', label: 'Photography' }
          ],
          sortByOptions: [
            { value: 'newest', label: 'Newest' },
            { value: 'progress', label: 'Progress' },
            { value: 'reward', label: 'Reward' }
          ],
          searchPlaceholder: "Search arena matches..."
        }}
        onFiltersChange={handleFiltersChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-100 mb-4 tracking-wide">Active Challenges</h2>

          {filteredChallenges.length === 0 ? (
            <div className="bg-gray-800 rounded-2xl p-8 text-center border border-gray-700/30">
              <p className="text-gray-400 text-sm">No challenges match your lookup filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChallenges.map(challenge => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onClaim={handleClaimReward} 
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-100 mb-4 tracking-wide">Global Standings</h2>
          <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700/30 shadow-md">
            <div className="p-4 bg-gray-850 border-b border-gray-700 flex justify-between items-center gap-4">
              <h3 className="font-bold text-sm tracking-wider text-gray-300 uppercase">Top Contenders</h3>
              <button
                onClick={() => getRandomVoiceLineByCategory('fingerwars')}
                disabled={!isVoiceServiceInitialized}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-semibold rounded-lg text-xs transition duration-150"
              >
                Play Entry Vox
              </button>
            </div>
            <div className="divide-y divide-gray-700/60 bg-gray-800/50">
              {FINGERWARS_LEADERBOARD.map((entry, index) => (
                <LeaderboardItem
                  key={entry.username || index}
                  name={entry.username}
                  username={`@${entry.username.toLowerCase()}`}
                  score={entry.score}
                  rank={entry.rank}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <FixedAdBanner 
        adSlot="fingerwars-ad-1"
        className="max-w-xs mt-8 mx-auto"
      />
    </div>
  );
};

export default FingerWarsPage;