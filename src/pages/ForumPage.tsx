import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext'; // Added onboarding context
import LoadingSpinner from '../components/LoadingSpinner';
import { SearchIcon, MessageIcon, CameraIcon, HeartIcon, PlayIcon, ChevronDownIcon, XIcon } from '../components/icons';
import ForumService from '../services/forumService';
import { ForumPost, ForumCategory, ForumThread } from '../types/forum';
import CensorshipSelector, { CensorshipOptions } from '../components/CensorshipSelector';
import CensoredPostWrapper from '../components/CensoredPostWrapper';

// Import Publicitee, FingerShorts, and Mii Components
import { PubliciteeSection } from '../components/PubliciteeSection';
import { FingerShortsSection } from '../components/FingerShortsSection';
import { CreatePubliciteeShortsModal } from '../components/CreatePubliciteeShortsModal';
import { MiiStoriesBar } from '../components/MiiStoriesBar';
import { MiiPinExchangeModal, MiiFingerOrbitModal, MiiMiniStoreModal } from '../components/MiiModals';

// Import Universal Page Layout & Canary Ad Components
import UniversalHeader from '../components/layout/UniversalHeader';
import H2AdBucket from '../components/layout/H2AdBucket';
import CanaryAdPlacementWidget from '../components/canary/CanaryAdPlacementWidget';
import UniversalProfileCard from '../components/common/UniversalProfileCard';

import P2PStatusIndicator from '../components/P2PStatusIndicator';
import voiceLineServiceInstance from '../services/VoiceLineService';
import RichTextEditor, { sanitizeHtmlContent } from '../components/editor/RichTextEditor';
import MediaUploadAndEditorModal from '../components/editor/MediaUploadAndEditorModal';
import type { ProcessedMedia } from '../components/editor/MediaUploadAndEditorModal';
import PostSettingsPanel, { DEFAULT_POST_SETTINGS } from '../components/editor/PostSettingsPanel';
import type { PostSettings } from '../components/editor/PostSettingsPanel';

const MainNavigationTabBar = () => {
  const [activeTab, setActiveTab] = useState('trends');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[1280px] mx-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 my-4 py-2.5 px-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center space-x-2">
        <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-base text-gray-700 dark:text-gray-300">
          ≡
        </button>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="flex flex-col items-center w-full max-w-3xl">
          {/* H2 Header Row - 3 Column Menu */}
          <div className="w-full grid grid-cols-3 gap-2 text-sm md:text-base font-bold text-gray-900 dark:text-white mb-2 text-center">
            <button onClick={() => navigate('/lushpressies')} className="hover:text-orange-500 transition px-2 py-1">Lush Pressies</button>
            <button onClick={() => navigate('/dancia4tv')} className="hover:text-orange-500 transition px-2 py-1 border-l border-r border-gray-300 dark:border-gray-600">Dancia-4tv</button>
            <button className="hover:text-orange-500 transition px-2 py-1 flex flex-col md:flex-row justify-center items-center md:space-x-1">
              <span onClick={() => navigate('/marketplace')} className="hover:underline cursor-pointer">MarketPlace,</span>
              <span onClick={() => navigate('/beatwaveng')} className="hover:underline cursor-pointer">BeatwaveNg</span>
            </button>
          </div>

          {/* H3 Navigation Tabs Row - 3 Column Menu */}
          <div className="w-full grid grid-cols-3 gap-0 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'trends', label: 'Trends', path: '/trends' },
              { id: 'camus', label: 'Camus', path: '/camus' },
              { id: 'fingerwars', label: 'FingerWars', path: '/fingerwars' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  navigate(tab.path);
                }}
                className={`w-full py-2.5 text-xs font-medium text-center ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-base">
        <span className="text-gray-600 dark:text-gray-400">Followers: 204</span>
        <div className="flex space-x-1.5">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {/* Dropdown Settings Tab */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            Settings <ChevronDownIcon className="ml-1 h-4 w-4" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Activity & Flash Feed Tab
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Video & Media Tab
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Live Display / Screen Tab
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Stories & Reading Tab
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Groups & Forum Tab
              </button>
              <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Friends & Community Tab
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CanaryAdsWidget = () => {
  return (
    <div className="bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 mb-6">
      <div className="text-center">
        <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">Canary Ads</div>
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">Special Offers & Promotions</div>
        <div className="mt-4 flex justify-center">
          <div className="w-20 h-20 bg-white/30 dark:bg-gray-600/30 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCompletionCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base text-gray-900 dark:text-white">Complete your Profile</h3>
        <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded">82%</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="text-base">Upload Profile Picture</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="text-base">University?</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="text-base">Add Payment Method</span>
        </div>
      </div>
    </div>
  );
};

const AdvertisementCard = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4 text-white">
      <div className="flex items-center">
        <div className="bg-white/20 p-2 rounded-lg mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-sm">Special Offer!</h3>
          <p className="text-xs opacity-80">Limited time discount</p>
        </div>
      </div>
    </div>
  );
};

// Define the MediaAttachment interface
interface MediaAttachment {
  id: string;
  file?: File;
  preview: string;
  type: 'image' | 'video';
  name: string;
}

// Define the FeelingActivity interface
interface FeelingActivity {
  type: 'feeling' | 'activity';
  emoji: string;
  label: string;
}

// Define the ForumPostExtended type properly
type ForumPostExtended = Omit<ForumPost, 'author' | 'attachments'> & {
  title: string;
  author: string;
  category: string;
  date: string;
  likes: number;
  comments: number;
  views: number;
  isPinned?: boolean;
  tags: string[] | undefined;
  threadId: string;
  thread: ForumThread;
  replies: ForumPost[];
  censorship?: CensorshipOptions;
  attachments?: any[];
  feeling?: FeelingActivity;
  mediaUrls?: string[];
  hasPoll?: boolean;
  poll?: {
    question: string;
    options: any[];
    votes: Record<string, number>;
    userVotedIndex?: number | null;
    expiresAt?: string;
  };
  isBookmarked?: boolean;
  isReported?: boolean;
};

// Fallback categories list to guarantee categories never fail to load
const defaultCategories: ForumCategory[] = [
  { id: '1', name: 'General Discussion', description: 'Open talk, questions, and community interactions', icon: '💬', color: '#3B82F6', displayOrder: 1, isActive: true } as any,
  { id: '2', name: 'Entertainment & TV', description: 'BeatwaveNG, Dancia-4Tv, movies, and music', icon: '📺', color: '#8B5CF6', displayOrder: 2, isActive: true } as any,
  { id: '3', name: 'Marketplace & Deals', description: 'Buy, sell, digital products, and storefronts', icon: '🛍️', color: '#EC4899', displayOrder: 3, isActive: true } as any,
  { id: '4', name: 'Lush Pressies & Gifting', description: 'P2P gifting, interactions, and moments', icon: '🎁', color: '#10B981', displayOrder: 4, isActive: true } as any,
  { id: '5', name: 'Technology & AI', description: 'Protocols, apps, AI development, and innovation', icon: '⚡', color: '#F59E0B', displayOrder: 5, isActive: true } as any,
  { id: '6', name: 'Gaming & FingerWars', description: 'GameOn, FingerWars, tournaments, and rules', icon: '🎮', color: '#EF4444', displayOrder: 6, isActive: true } as any,
  { id: '7', name: 'Creative Studio & UGC', description: 'PhotoCredits, photography, audio creation, and art', icon: '🎨', color: '#06B6D4', displayOrder: 7, isActive: true } as any,
  { id: '8', name: 'Announcements', description: 'Official FingerMobile Protocol releases and notices', icon: '📢', color: '#F97316', displayOrder: 8, isActive: true } as any
];

const feelingsList: FeelingActivity[] = [
  { type: 'feeling', emoji: '😊', label: 'Happy' },
  { type: 'feeling', emoji: '🤩', label: 'Excited' },
  { type: 'feeling', emoji: '🔥', label: 'Motivated' },
  { type: 'feeling', emoji: '💡', label: 'Inspired' },
  { type: 'feeling', emoji: '😎', label: 'Cool' },
  { type: 'feeling', emoji: '🥳', label: 'Celebrating' },
  { type: 'feeling', emoji: '❤️', label: 'Loved' },
  { type: 'feeling', emoji: '🧘', label: 'Relaxed' },
  { type: 'feeling', emoji: '🎯', label: 'Focused' },
  { type: 'feeling', emoji: '😴', label: 'Tired' },
];

const activitiesList: FeelingActivity[] = [
  { type: 'activity', emoji: '🎧', label: 'Listening to BeatwaveNG' },
  { type: 'activity', emoji: '📺', label: 'Watching Dancia-4Tv' },
  { type: 'activity', emoji: '🛍️', label: 'Shopping on Marketplace' },
  { type: 'activity', emoji: '🎁', label: 'Gifting on Lush-Pressies' },
  { type: 'activity', emoji: '🎮', label: 'Playing FingerWars' },
  { type: 'activity', emoji: '🚀', label: 'Exploring Mii Orbit' },
  { type: 'activity', emoji: '💻', label: 'Building Protocol' },
  { type: 'activity', emoji: '📚', label: 'Reading Blogs' },
  { type: 'activity', emoji: '☕', label: 'Sipping Coffee' },
];

const ForumPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { state: authState } = useAuth();
  const { state: onboardingState } = useOnboarding();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'discussed'>('recent');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [forumPosts, setForumPosts] = useState<ForumPostExtended[]>([]);
  const [forumCategories, setForumCategories] = useState<ForumCategory[]>(defaultCategories);

  // Post creation state
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('1');
  const [censorshipOptions, setCensorshipOptions] = useState<CensorshipOptions>({
    tags: [],
    visualEffect: 'NONE',
    interactionRule: 'NONE'
  });
  const [isRichTextMode, setIsRichTextMode] = useState(false);
  const [isMediaStudioOpen, setIsMediaStudioOpen] = useState(false);
  const [postSettings, setPostSettings] = useState<PostSettings>(DEFAULT_POST_SETTINGS);
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  // Action handlers state: Photo/Video
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);

  // Poll creation & voting state
  const [isPollComposerOpen, setIsPollComposerOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptionInputs, setPollOptionInputs] = useState(['', '']);
  const [pollDurationDays, setPollDurationDays] = useState(7);
  const [userPollVotes, setUserPollVotes] = useState<Record<string, number>>({});

  // Action handlers state: Feeling/Activity
  const [isFeelingModalOpen, setIsFeelingModalOpen] = useState(false);
  const [feelingModalTab, setFeelingModalTab] = useState<'feelings' | 'activities'>('feelings');
  const [selectedFeeling, setSelectedFeeling] = useState<FeelingActivity | null>(null);

  // Action handlers state: Live Stream
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [liveStreamTitle, setLiveStreamTitle] = useState('');
  const [liveStreamCategory, setLiveStreamCategory] = useState('BeatwaveNG & Entertainment');
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const [activeRooms, setActiveRooms] = useState<Array<{ name: string; isLive?: boolean; streamer?: string }>>([
    { name: 'Sara\'s Room' },
    { name: 'jawad\'s Room' },
    { name: 'Jack\'s Room' },
    { name: 'jobidn\'s Room' }
  ]);

  // Infinite/Endless Scroll state
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Member Registration date for endless scroll boundary indicator
  const memberRegistrationDate = useMemo(() => {
    if (authState.user?.createdAt) {
      return new Date(authState.user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return 'September 2026';
  }, [authState.user]);

  // Publicitee, FingerShorts, and Mii Interactive Modal & Tab States
  const [feedTab, setFeedTab] = useState<'feed' | 'publicitee'>('feed');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showOrbitModal, setShowOrbitModal] = useState(false);
  const [showMiniStoreModal, setShowMiniStoreModal] = useState(false);

  // Check if user has completed onboarding and redirect if not
  useEffect(() => {
    const isGlobalComplete = localStorage.getItem('onboardingComplete') === 'true' || localStorage.getItem('hasCompletedOnboarding') === 'true';
    if (isGlobalComplete) {
      return;
    }

    if (authState.isAuthenticated && authState.user) {
      const isCompleteInStorage = localStorage.getItem(`onboardingComplete_${authState.user.id}`) === 'true';
      const isCompleteInUser = authState.user.onboardingComplete || (authState.user as any).onboarding_completed;

      if (isCompleteInStorage || isCompleteInUser) {
        return;
      }

      if (!onboardingState.progress || onboardingState.progress.completedSteps.length < 5) {
        navigate('/onboarding');
      }
    }
  }, [authState, onboardingState, navigate]);

  // Convert raw DB thread into ForumPostExtended
  const mapThreadToPost = useCallback((thread: any): ForumPostExtended => {
    const threadAuthor = typeof thread.author === 'string'
      ? thread.author
      : thread.author?.username || 'Member';

    return {
      id: thread.id,
      title: thread.title,
      content: thread.content,
      author: threadAuthor,
      category: thread.category?.name || 'General Discussion',
      date: new Date(thread.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      likes: thread.posts?.reduce((sum: number, post: any) => sum + (post.likesCount || 0), 0) || 0,
      comments: thread.replyCount || thread.repliesCount || 0,
      views: thread.viewCount || thread.viewsCount || 0,
      isPinned: thread.isPinned || thread.isSticky,
      tags: thread.tags || [],
      threadId: thread.id,
      thread: thread,
      authorId: thread.authorId,
      parentPostId: undefined,
      parentPost: undefined,
      likesCount: 0,
      dislikesCount: 0,
      isLiked: false,
      isDisliked: false,
      isBookmarked: false,
      isReported: false,
      isDeleted: false,
      isEdited: false,
      replies: [],
      replyCount: thread.replyCount || 0,
      attachments: thread.attachments || [],
      feeling: thread.activityType ? {
        type: 'activity',
        emoji: thread.activityType.split(' ')[0] || '✨',
        label: thread.activityType
      } : undefined,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
      isApproved: true,
      spamScore: 0,
      moderationStatus: 'approved',
      hasPoll: Boolean(thread.hasPoll || thread.poll),
      poll: thread.poll ? {
        question: thread.poll.question || thread.title,
        options: Array.isArray(thread.poll.options) ? thread.poll.options : ['Strongly Agree', 'Neutral', 'Disagree'],
        votes: thread.poll.votes || {}
      } : undefined
    };
  }, []);

  // Fetch forum categories & initial threads
  const fetchForumData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch categories with reliable fallback
      const categoriesResult = await ForumService.getCategories();
      let cats: ForumCategory[] = defaultCategories;

      if (categoriesResult.success && categoriesResult.data) {
        let rawCats: any[] = [];
        if (Array.isArray(categoriesResult.data)) {
          rawCats = categoriesResult.data;
        } else if (Array.isArray(categoriesResult.data.categories)) {
          rawCats = categoriesResult.data.categories;
        }
        if (rawCats && rawCats.length > 0) {
          cats = rawCats.map((c: any) => ({
            ...c,
            id: String(c.id)
          }));
        }
      }

      setForumCategories(cats);
      if (cats.length > 0) {
        setSelectedCategoryId(String(cats[0].id));
      }

      // 2. Fetch initial threads
      const targetCat = categoryFilter === 'all' ? 'all' : categoryFilter;
      const threadsResult = await ForumService.getThreadsByCategory(targetCat, 10, 0, 'latest');

      if (threadsResult.success && threadsResult.data?.threads) {
        const converted = threadsResult.data.threads.map(mapThreadToPost);
        setForumPosts(converted);
        setHasMore(threadsResult.data.threads.length >= 10);
      } else {
        setForumPosts([]);
        setHasMore(false);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching forum data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch forum data');
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, mapThreadToPost]);

  useEffect(() => {
    fetchForumData();
  }, [fetchForumData]);

  // Infinite / Endless Scroll Handler
  const loadMorePosts = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    try {
      const targetCat = categoryFilter === 'all' ? 'all' : categoryFilter;
      const offset = forumPosts.length;
      const threadsResult = await ForumService.getThreadsByCategory(targetCat, 10, offset, 'latest');

      if (threadsResult.success && threadsResult.data?.threads && threadsResult.data.threads.length > 0) {
        const newPosts = threadsResult.data.threads.map(mapThreadToPost);
        setForumPosts(prev => {
          const existingIds = new Set(prev.map(p => p.id));
          const uniqueNew = newPosts.filter(p => !existingIds.has(p.id));
          return [...prev, ...uniqueNew];
        });
        setHasMore(threadsResult.data.threads.length >= 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading more posts:', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, loading, categoryFilter, forumPosts.length, mapThreadToPost]);

  // Attach IntersectionObserver for Endless Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loading, loadMorePosts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    return forumPosts
      .filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
        }
        if (sortBy === 'popular') return b.likes - a.likes;
        if (sortBy === 'discussed') return b.comments - a.comments;
        return 0;
      });
  }, [forumPosts, searchTerm, sortBy]);

  // Handler: Media Studio & Upload
  const handlePhotoVideoClick = () => {
    setIsMediaStudioOpen(true);
  };

  const handleMediaStudioSave = (media: ProcessedMedia) => {
    const newAttachment: MediaAttachment = {
      id: media.id || Math.random().toString(36).substring(2, 9),
      file: new File([], media.name),
      preview: media.url,
      type: media.type === 'video' ? 'video' : 'image',
      name: media.name
    };
    setAttachments(prev => [...prev, newAttachment]);
    showToast(`Added ${media.name} to post media`, 'success');
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newAttachments: MediaAttachment[] = files.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
      name: file.name
    }));

    setAttachments(prev => [...prev, ...newAttachments]);
    showToast(`Attached ${files.length} media file(s)`, 'info');
    if (e.target) e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => {
      const target = prev.find(a => a.id === id);
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter(a => a.id !== id);
    });
  };

  // Handler: Feeling / Activity
  const handleFeelingSelect = (item: FeelingActivity) => {
    setSelectedFeeling(item);
    setIsFeelingModalOpen(false);
    showToast(`Feeling set: ${item.emoji} ${item.label}`, 'info');
  };

  // Handler: Live Stream
  const handleStartLiveStream = (e: React.FormEvent) => {
    e.preventDefault();
    const streamName = liveStreamTitle.trim() || `${authState.user?.username || 'Member'}'s Live Broadcast`;
    setIsLiveStreaming(true);
    setActiveRooms(prev => [
      { name: streamName, isLive: true, streamer: authState.user?.username || 'You' },
      ...prev
    ]);
    setIsLiveModalOpen(false);
    showToast('🔴 You are now LIVE! Broadcasting across FingerMobile P2P Protocol.', 'success');
  };

  const handleEndLiveStream = () => {
    setIsLiveStreaming(false);
    setActiveRooms(prev => prev.filter(r => r.streamer !== (authState.user?.username || 'You')));
    showToast('Live stream broadcasting ended.', 'info');
  };

  const handleCensorCurrentText = async () => {
    if (!newPostContent.trim()) {
      showToast('Please enter text to censor first.', 'info');
      return;
    }
    try {
      const res = await ForumService.censorText(newPostContent);
      if (res.success && res.data) {
        setNewPostContent(res.data.censored);
        setCensorshipOptions(prev => ({
          ...prev,
          visualEffect: prev.visualEffect === 'NONE' ? 'CENSOR_BAR' : prev.visualEffect,
          tags: Array.from(new Set([...prev.tags, 'Censored']))
        }));
        showToast(res.data.isCensored ? 'Content censored with filter masks!' : 'Censorship flags and bar applied!', 'info');
      }
    } catch {
      showToast('Failed to contact censor service', 'error');
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && attachments.length === 0) {
      showToast('Please enter some content or attach media for your post.', 'error');
      return;
    }

    setIsCreatingPost(true);
    try {
      const targetCategoryId = selectedCategoryId || (forumCategories.length > 0 ? forumCategories[0].id : '1');

      // Collect censorship tags
      const appliedTags = [...(censorshipOptions.tags || [])];
      if (censorshipOptions.visualEffect !== 'NONE') {
        appliedTags.push(`censor:${censorshipOptions.visualEffect}`);
      }
      if (selectedFeeling) {
        appliedTags.push(`activity:${selectedFeeling.emoji} ${selectedFeeling.label}`);
      }
      // Section 2 Post Distribution Tags
      if (postSettings.postCategory) {
        appliedTags.push(`category:${postSettings.postCategory}`);
      }
      if (postSettings.audienceGender !== 'everyone') {
        appliedTags.push(`audience:gender:${postSettings.audienceGender}`);
      }
      if (postSettings.audienceAgeBracket !== 'everyone') {
        appliedTags.push(`audience:age:${postSettings.audienceAgeBracket}`);
      }
      if (postSettings.whoCanComment !== 'everyone') {
        appliedTags.push(`comments:${postSettings.whoCanComment}`);
      }
      if (postSettings.isScheduled) {
        appliedTags.push(`scheduled:${postSettings.scheduleMonth}-${postSettings.scheduleDay}@${postSettings.scheduleTime}`);
      }

      const postTitle = newPostContent.trim()
        ? (newPostContent.substring(0, 50) + (newPostContent.length > 50 ? '...' : ''))
        : (attachments.length > 0 ? `Shared ${attachments.length} media file(s)` : 'New Post');

      const result = await ForumService.createThread({
        title: postTitle,
        content: newPostContent || ' ',
        categoryId: targetCategoryId,
        tags: appliedTags
      });

      if (result.success && result.data) {
        showToast('Post created successfully!', 'success');
        voiceLineServiceInstance.playCommentaryVoiceLine('forum');
        const currentCategory = forumCategories.find(c => String(c.id) === String(targetCategoryId));

        const newPost: ForumPostExtended = {
          id: result.data.id || Math.random().toString(36).substring(2, 9),
          title: postTitle,
          content: newPostContent,
          author: authState.user?.username || 'You',
          category: currentCategory?.name || 'General Discussion',
          date: 'Just now',
          likes: 0,
          comments: 0,
          views: 1,
          isPinned: false,
          tags: appliedTags,
          threadId: result.data.id,
          thread: result.data,
          authorId: String(authState.user?.id || '1'),
          parentPostId: undefined,
          parentPost: undefined,
          likesCount: 0,
          dislikesCount: 0,
          isLiked: false,
          isDisliked: false,
          isBookmarked: false,
          isReported: false,
          isDeleted: false,
          isEdited: false,
          replies: [],
          replyCount: 0,
          attachments: [...attachments],
          feeling: selectedFeeling || undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isApproved: true,
          spamScore: 0,
          moderationStatus: 'approved',
          censorship: censorshipOptions,
          hasPoll: isPollComposerOpen && pollQuestion.trim().length > 0,
          poll: isPollComposerOpen && pollQuestion.trim().length > 0 ? {
            question: pollQuestion.trim(),
            options: pollOptionInputs.map(o => o.trim()).filter(Boolean).length >= 2
              ? pollOptionInputs.map(o => o.trim()).filter(Boolean)
              : ['Agree', 'Disagree'],
            votes: {}
          } : undefined
        };

        setForumPosts(prev => [newPost, ...prev]);

        // Reset state
        setNewPostContent('');
        setAttachments([]);
        setSelectedFeeling(null);
        setCensorshipOptions({ tags: [], visualEffect: 'NONE', interactionRule: 'NONE' });
        setIsPollComposerOpen(false);
        setPollQuestion('');
        setPollOptionInputs(['', '']);
      } else {
        showToast(result.error || 'Failed to create post', 'error');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating post:', error);
      showToast('An unexpected error occurred while posting', 'error');
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleLike = async (postId: string) => {
    const postToLike = forumPosts.find(p => p.id === postId);
    if (!postToLike) return;
    const isCurrentlyLiked = postToLike.isLiked;

    setForumPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isCurrentlyLiked ? Math.max(0, post.likes - 1) : post.likes + 1,
            isLiked: !isCurrentlyLiked
          };
        }
        return post;
      })
    );

    try {
      if (isCurrentlyLiked) {
        await ForumService.unlikePost(postId);
      } else {
        await ForumService.likePost(postId);
      }
    } catch {
      // Revert on error
      setForumPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: isCurrentlyLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
              isLiked: isCurrentlyLiked
            };
          }
          return post;
        })
      );
      showToast('Failed to update like status', 'error');
    }
  };

  const handleReply = async (postId: string) => {
    const replyContent = window.prompt('Enter your reply:');
    if (replyContent && replyContent.trim()) {
      try {
        const result = await ForumService.createPost({
          content: replyContent,
          threadId: postId,
        });

        if (result.success) {
          showToast('Reply added!', 'success');
          voiceLineServiceInstance.playCommentaryVoiceLine('forum');
          setForumPosts(prevPosts =>
            prevPosts.map(post => {
              if (post.id === postId) {
                return {
                  ...post,
                  comments: post.comments + 1,
                };
              }
              return post;
            })
          );
        } else {
          showToast(result.error || 'Failed to reply', 'error');
        }
      } catch {
        showToast('An unexpected error occurred', 'error');
      }
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchForumData();
      return;
    }

    setLoading(true);
    try {
      const result = await ForumService.searchPosts(searchTerm);
      if (result.success && result.data?.posts) {
        const convertedSearchPosts: ForumPostExtended[] = result.data.posts.map((post: any) => ({
          ...post,
          title: post.thread?.title || 'Forum Post',
          author: typeof post.author === 'string' ? post.author : post.author?.username || 'Member',
          category: 'General Discussion',
          date: 'Search Result',
          likes: 0,
          comments: 0,
          views: 0,
          thread: post.thread,
          replies: []
        }));
        setForumPosts(convertedSearchPosts);
        setHasMore(false);
        showToast('Search completed', 'success');
      } else {
        showToast(result.error || 'Search failed', 'error');
      }
    } catch {
      showToast('Search error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const result = await ForumService.deleteThread(postId);
      if (result.success) {
        setForumPosts(prev => prev.filter(p => p.id !== postId));
        showToast('Post deleted', 'success');
      } else {
        showToast(result.error || 'Failed to delete', 'error');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    }
  };

  const handleReport = async (postId: string) => {
    const reason = window.prompt('Why are you reporting this post?');
    if (reason && reason.trim()) {
      try {
        const result = await ForumService.reportPost(postId, reason);
        if (result.success) {
          showToast('Post reported', 'success');
        } else {
          showToast(result.error || 'Failed to report', 'error');
        }
      } catch {
        showToast('An unexpected error occurred', 'error');
      }
    }
  };

  const handleVoteThreadPoll = (postId: string, optionIndex: number) => {
    if (userPollVotes[postId] !== undefined) {
      showToast('You have already voted on this poll.', 'info');
      return;
    }
    setUserPollVotes(prev => ({ ...prev, [postId]: optionIndex }));
    setForumPosts(prev =>
      prev.map(p => {
        if (p.id === postId && p.poll) {
          const rawOpts = p.poll.options;
          const optKey = typeof rawOpts[optionIndex] === 'string'
            ? rawOpts[optionIndex]
            : (rawOpts[optionIndex] as any)?.text || String(optionIndex);
          const currentVotes = p.poll.votes?.[optKey] || 0;
          return {
            ...p,
            poll: {
              ...p.poll,
              votes: {
                ...p.poll.votes,
                [optKey]: currentVotes + 1
              }
            }
          };
        }
        return p;
      })
    );
    showToast('Poll vote recorded on the sovereign ledger! ✓', 'success');
  };

  const handleBookmark = (postId: string) => {
    setForumPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const next = !p.isBookmarked;
          showToast(next ? 'Thread saved to bookmarks!' : 'Bookmark removed', 'info');
          return { ...p, isBookmarked: next };
        }
        return p;
      })
    );
  };

  const handleVoteThread = (postId: string, type: 'up' | 'down') => {
    setForumPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const delta = type === 'up' ? 1 : -1;
          showToast(`Vote ${type === 'up' ? '▲ Upvote' : '▼ Downvote'} recorded!`, 'success');
          return { ...p, likes: Math.max(0, p.likes + delta) };
        }
        return p;
      })
    );
  };

  const handleDislike = (postId: string) => {
    setForumPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          const isCurrentlyDisliked = post.isDisliked;
          return {
            ...post,
            dislikesCount: isCurrentlyDisliked ? Math.max(0, (post.dislikesCount || 0) - 1) : ((post.dislikesCount || 0) + 1),
            isDisliked: !isCurrentlyDisliked
          };
        }
        return post;
      })
    );
    showToast('Dislike recorded on the thread', 'info');
  };

  const handleMessageAuthor = (post: ForumPostExtended) => {
    const authorName = typeof post.author === 'string' ? post.author : (post.author as any)?.name || 'Member';
    showToast(`Opening secure sovereign chat with @${authorName}...`, 'info');
    navigate(`/chat?user=${encodeURIComponent(authorName)}`);
  };

  if (loading && forumPosts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pb-16">
      {/* STATIC H1: SLIM THREE-COLUMN BAR WITH CLEAN TITLE */}
      <UniversalHeader pageTitle="Forum & Social Feeds" />
      {/* STATIC H2: HIGH-IMPACT AD CONTAINER */}
      <H2AdBucket />
      <MainNavigationTabBar />

      {/* Hidden File Input for Photo/Video Picker */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*,video/*"
        multiple
        onChange={handleMediaSelect}
        className="hidden"
      />

      <div className="flex max-w-[1280px] mx-auto gap-8 px-4">
        {/* Left Column Navigation MENU (Members Area & Status - NO Load More Button) */}
        <div className="w-80 flex-shrink-0 hidden md:block pr-8">
          <div className="sticky top-24 space-y-4">
            {/* Sovereign Identity ProfileCard (Always on/by Top Left Corner) */}
            <UniversalProfileCard />
            <CanaryAdsWidget />
            <ProfileCompletionCard />
            <AdvertisementCard />

            {/* P2P Status Indicator */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">P2P Connection Status</h3>
              <P2PStatusIndicator status="connected" connectionCount={12} speed={1.5} />
              <p className="text-xs text-gray-500 mt-2">Your P2P algorithm is optimized for maximum engagement</p>
            </div>

            {/* Members Area Navigation Menu */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">Members Area</h3>
              <ul className="space-y-1.5">
                <li
                  onClick={() => navigate('/mii')}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition flex items-center justify-between"
                >
                  <span>Mii</span>
                  <span className="text-xs text-gray-400">✨</span>
                </li>
                <li
                  onClick={() => navigate('/groups')}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition flex items-center justify-between"
                >
                  <span>Groups</span>
                  <span className="text-xs text-gray-400">👥</span>
                </li>
                <li
                  onClick={() => navigate('/blogs')}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition flex items-center justify-between"
                >
                  <span>Blog</span>
                  <span className="text-xs text-gray-400">📝</span>
                </li>
                <li
                  onClick={() => navigate('/hallmarks')}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition flex items-center justify-between"
                >
                  <span>Hallmarks</span>
                  <span className="text-xs text-gray-400">🏅</span>
                </li>
                <li
                  onClick={() => navigate('/permanence')}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition flex items-center justify-between"
                >
                  <span>Permanence</span>
                  <span className="text-xs text-gray-400">🔒</span>
                </li>
                <li
                  onClick={() => navigate('/gameon')}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition flex items-center justify-between"
                >
                  <span>Gameon</span>
                  <span className="text-xs text-gray-400">🎮</span>
                </li>
                <li
                  onClick={() => navigate('/photocredits')}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition flex items-center justify-between"
                >
                  <span>PhotoCredits</span>
                  <span className="text-xs text-gray-400">📸</span>
                </li>
                <li
                  onClick={() => navigate('/loansqr')}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 transition flex items-center justify-between"
                >
                  <span>LoanSqr</span>
                  <span className="text-xs text-gray-400">💳</span>
                </li>
              </ul>
              {/* Load More button removed as requested */}
            </div>
          </div>
        </div>

        {/* Center Column (Main Content Feed & Interactions) */}
        <div className="flex-1 min-w-0 max-w-3xl mx-auto space-y-4">
          {/* Mii™ Disappearing Moments (48h) Stories Bar with Pin Exchange, Orbit, & MiniStore */}
          <MiiStoriesBar
            onOpenCreate={() => setShowCreateModal(true)}
            onOpenPinExchange={() => setShowPinModal(true)}
            onOpenOrbit={() => setShowOrbitModal(true)}
            onOpenMiniStore={() => setShowMiniStoreModal(true)}
          />

          {/* Feed Filter Tabs & In-Page Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
            <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'Home Feed', sort: 'popular' as const, tabType: 'feed' as const },
                { id: 'publicitee', label: '🎬 Publicitee (Reels)', sort: 'recent' as const, tabType: 'publicitee' as const },
                { id: 'recent', label: 'Recent', sort: 'recent' as const, tabType: 'feed' as const },
                { id: 'discussed', label: 'Discussed', sort: 'discussed' as const, tabType: 'feed' as const }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFeedTab(tab.tabType);
                    setSortBy(tab.sort);
                    if (tab.id === 'all') setCategoryFilter('all');
                  }}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition ${
                    (tab.id === 'publicitee' && feedTab === 'publicitee') ||
                    (tab.id !== 'publicitee' && feedTab === 'feed' && sortBy === tab.sort)
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search forum..."
                className="w-full px-3.5 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
              />
              <SearchIcon className="absolute right-3 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Interactive Category Filter Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
                categoryFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              🌐 All Categories
            </button>
            {forumCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(String(cat.id))}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  String(categoryFilter) === String(cat.id)
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span>{cat.icon || '💬'}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Create New Post Box */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            {/* Category and Censorship Toolbar */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category:</span>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                >
                  {forumCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <CensorshipSelector
                  options={censorshipOptions}
                  onChange={setCensorshipOptions}
                />
                <button
                  type="button"
                  onClick={handleCensorCurrentText}
                  disabled={!newPostContent.trim()}
                  className="text-xs font-medium bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md px-2.5 py-1.5 transition flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Censor words in text with masks and apply censor bar effect"
                >
                  <span>🛡️</span>
                  <span>Censor Post</span>
                </button>
              </div>
            </div>

            {/* Selected Feeling/Activity Badge Display */}
            {selectedFeeling && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs inline-flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 px-3 py-1 rounded-full font-medium">
                  <span>{selectedFeeling.type === 'feeling' ? 'Feeling:' : 'Activity:'}</span>
                  <span>{selectedFeeling.emoji}</span>
                  <span>{selectedFeeling.label}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFeeling(null)}
                    className="ml-1 text-orange-500 hover:text-orange-800 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              </div>
            )}

            {/* Rich Editor Mode Switcher & Settings */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700/60">
              <button
                type="button"
                onClick={() => setIsRichTextMode(!isRichTextMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                  isRichTextMode
                    ? 'bg-[#ff6b00] text-white shadow-sm'
                    : 'bg-orange-50 dark:bg-orange-950/40 text-[#ff6b00] border border-orange-200 dark:border-orange-800 hover:bg-orange-100'
                }`}
              >
                <span>✨</span>
                <span>{isRichTextMode ? 'Switch to Quick Single-Line' : 'Rich Text Editor (RTE) & Visual Styler'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMediaStudioOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-orange-50 hover:text-[#ff6b00] text-gray-700 dark:text-gray-300 transition"
                  title="Upload and edit photos, videos, and audio"
                >
                  <span>🎨</span>
                  <span>Media Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-300 transition"
                >
                  <span>⚙️ Post Settings</span>
                  <span className="text-[10px]">{showSettingsDrawer ? '▲' : '▼'}</span>
                </button>
              </div>
            </div>

            {/* Section 2 Post Settings Collapsible Drawer */}
            {showSettingsDrawer && (
              <div className="mb-4 animate-fade-in">
                <PostSettingsPanel
                  settings={postSettings}
                  onChange={setPostSettings}
                />
              </div>
            )}

            {isRichTextMode ? (
              <div className="space-y-3 mb-3 animate-fade-in">
                <RichTextEditor
                  value={newPostContent}
                  onChange={(out) => setNewPostContent(out.html || out.text)}
                  placeholder="Compose your structured discussion, format text visually with bold, italics, font colors, lists, tables, and media embeds..."
                  onOpenMediaModal={() => setIsMediaStudioOpen(true)}
                />
                <div className="flex items-center justify-between pt-1">
                  <div className="text-xs text-gray-500">
                    Structured Rich Postcard • Sanitized Markup Output
                  </div>
                  <button
                    onClick={handleCreatePost}
                    disabled={isCreatingPost || (!newPostContent.trim() && attachments.length === 0)}
                    className={`px-6 py-2 rounded-xl font-bold text-white text-xs transition shadow-sm ${
                      isCreatingPost || (!newPostContent.trim() && attachments.length === 0)
                        ? 'bg-orange-300 cursor-not-allowed'
                        : 'bg-[#ff6b00] hover:bg-[#e05e00]'
                    }`}
                  >
                    {isCreatingPost ? 'Publishing Post...' : 'Publish Formatted Post →'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <img
                  src={authState.user?.avatar || 'https://via.placeholder.com/48x48'}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full mr-4 object-cover border border-gray-200"
                />
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleCreatePost();
                      }
                    }}
                    disabled={isCreatingPost}
                    placeholder="Share Your Moments, Create a New Post (or toggle Rich Text Mode above)..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white text-sm"
                  />
                  <button
                    onClick={handleCreatePost}
                    disabled={isCreatingPost || (!newPostContent.trim() && attachments.length === 0)}
                    className={`px-5 py-2.5 rounded-full font-semibold text-white text-sm transition whitespace-nowrap shadow-sm ${
                      isCreatingPost || (!newPostContent.trim() && attachments.length === 0)
                        ? 'bg-orange-300 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {isCreatingPost ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            )}

            {/* Media Attachment Previews */}
            {attachments.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2">
                {attachments.map(att => (
                  <div key={att.id} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 w-24 h-24 bg-black">
                    {att.type === 'video' ? (
                      <video src={att.preview} className="w-full h-full object-cover" />
                    ) : (
                      <img src={att.preview} alt={att.name} className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition"
                      title="Remove media"
                    >
                      ×
                    </button>
                    {att.type === 'video' && (
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">
                        📹 Video
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Poll Composer Drawer */}
            {isPollComposerOpen && (
              <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50 dark:from-emerald-950/30 dark:to-gray-800 border border-emerald-300 dark:border-emerald-700 shadow-sm space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase">
                      📊 Poll Creator
                    </span>
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                      Conduct Community Consensus Poll
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPollComposerOpen(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Poll Question *
                  </label>
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="e.g. Which BeatwaveNG artist flow mix should headline Friday's stream?"
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-gray-700 border border-emerald-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300">
                    Poll Options (Min 2)
                  </label>
                  {pollOptionInputs.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 w-5">
                        {oIdx + 1}.
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPollOptionInputs(prev => prev.map((item, idx) => idx === oIdx ? val : item));
                        }}
                        placeholder={`Option ${oIdx + 1}`}
                        className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      {pollOptionInputs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setPollOptionInputs(prev => prev.filter((_, idx) => idx !== oIdx))}
                          className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  {pollOptionInputs.length < 6 && (
                    <button
                      type="button"
                      onClick={() => setPollOptionInputs(prev => [...prev, ''])}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 pt-1"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-emerald-200/60 dark:border-gray-700 text-xs">
                  <span className="text-gray-500 text-[11px]">Duration: 7 Days Sovereign Cycle</span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                    {pollOptionInputs.filter(o => o.trim()).length} options ready
                  </span>
                </div>
              </div>
            )}

            {/* Post Action Buttons with Live Working Handlers */}
            <div className="flex justify-between flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold group"
              >
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-950/60 group-hover:bg-orange-200 transition mr-2">
                  <PlayIcon className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">Reels & Shorts</span>
              </button>

              <button
                type="button"
                onClick={handlePhotoVideoClick}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 group"
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 dark:group-hover:bg-gray-600 transition mr-2">
                  <CameraIcon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Media</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFeelingModalOpen(true)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 group"
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 dark:group-hover:bg-gray-600 transition mr-2">
                  <HeartIcon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Feeling/Activity</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLiveModalOpen(true)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 group"
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 dark:group-hover:bg-gray-600 transition mr-2">
                  <PlayIcon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Live Stream</span>
              </button>

              {/* Conduct Poll Action Button */}
              <button
                type="button"
                onClick={() => setIsPollComposerOpen(!isPollComposerOpen)}
                className={`flex items-center font-semibold group transition ${
                  isPollComposerOpen
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-emerald-600'
                }`}
              >
                <div className={`p-2 rounded-full transition mr-2 ${
                  isPollComposerOpen
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                    : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-emerald-100'
                }`}>
                  <span className="text-sm">📊</span>
                </div>
                <span className="text-sm font-medium">Conduct Poll</span>
              </button>
            </div>
          </div>

          {/* FingerShorts™ (48h Stories) Section embedded in the body */}
          <FingerShortsSection />

          {/* Chat Rooms & Live Stream Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Livestream/Video chat with friends</h3>
                {isLiveStreaming && (
                  <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    Live Now
                  </span>
                )}
              </div>
              {isLiveStreaming ? (
                <button
                  onClick={handleEndLiveStream}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
                >
                  End Stream
                </button>
              ) : (
                <button
                  onClick={() => setIsLiveModalOpen(true)}
                  className="text-sm text-orange-500 hover:underline font-semibold"
                >
                  Create Room
                </button>
              )}
            </div>

            <div className="flex space-x-4 overflow-x-auto pb-2">
              {activeRooms.map((room, index) => (
                <div key={index} className="flex-shrink-0 w-48 bg-gray-50 dark:bg-gray-700/60 rounded-xl p-3 border border-gray-200 dark:border-gray-600">
                  <div className="relative bg-gray-300 dark:bg-gray-600 h-32 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    <PlayIcon className="h-10 w-10 text-gray-500" />
                    {room.isLive && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold truncate text-gray-900 dark:text-white max-w-[100px]">{room.name}</span>
                    <div className="flex space-x-1.5">
                      <button
                        onClick={() => showToast(`Connecting to ${room.name}...`, 'info')}
                        className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full p-1.5 shadow hover:from-orange-600 hover:to-amber-600 transition"
                        title="Join video stream"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => showToast(`Opening chat for ${room.name}...`, 'info')}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-1.5 shadow hover:from-blue-600 hover:to-indigo-600 transition"
                        title="Chat"
                      >
                        <MessageIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dedicated Publicitee Tab OR Forum Posts with Embedded Publicitee Section */}
          {feedTab === 'publicitee' ? (
            <PubliciteeSection placement="newsfeed_tab" />
          ) : (
            <div className="space-y-4">
              {filteredAndSortedPosts.map((post, idx) => (
                <React.Fragment key={post.id}>
                  {idx === 2 && (
                    <PubliciteeSection placement="newsfeed_section" className="my-4" />
                  )}
                  {idx === 4 && (
                    <CanaryAdPlacementWidget placement="feed_video" className="my-4" />
                  )}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 transition hover:border-gray-200">
                    <div className="flex items-start">
                      <img
                        src="https://via.placeholder.com/40x40"
                        alt={post.author}
                        className="w-10 h-10 rounded-full mr-3 border border-gray-200 dark:border-gray-700"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{post.author}</h4>
                              {post.feeling && (
                                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium flex items-center gap-1">
                                  <span>— {post.feeling.type === 'feeling' ? 'feeling' : 'is'}</span>
                                  <span>{post.feeling.emoji}</span>
                                  <span>{post.feeling.label}</span>
                                </span>
                              )}
                              <span className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-medium">
                                {post.category}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">{post.date}</span>
                          </div>
                          {post.isPinned && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 px-2 py-0.5 rounded font-bold">
                              PINNED
                            </span>
                          )}
                        </div>

                        {post.title && post.title !== 'Forum Post' && (
                          <h5 className="font-semibold text-base text-gray-900 dark:text-white mt-2">
                            {post.title}
                          </h5>
                        )}

                        <div className="mt-2">
                          <CensoredPostWrapper
                            options={
                              post.censorship || {
                                tags: post.tags || [],
                                visualEffect: (post.tags?.some(t => t.includes('censor:CENSOR_BAR')) ? 'CENSOR_BAR' : post.tags?.some(t => t.includes('censor:BLUR')) ? 'BLUR' : 'NONE'),
                                interactionRule: 'NONE'
                              }
                            }
                          >
                            {post.content && post.content.includes('<') && post.content.includes('>') ? (
                              <div
                                className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed rich-post-view [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_p]:mb-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:pl-3 [&_blockquote]:italic [&_table]:border-collapse [&_table]:w-full [&_td]:border [&_td]:p-1.5 [&_th]:border [&_th]:p-1.5 [&_a]:text-orange-600 [&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtmlContent(post.content) }}
                              />
                            ) : (
                              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                            )}
                          </CensoredPostWrapper>
                        </div>

                        {/* Interactive Poll Rendering (LushPressies Standard) */}
                        {post.poll && (
                          <div className="mt-3.5 p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-slate-50/60 dark:from-emerald-950/30 dark:via-gray-800/60 dark:to-gray-900 border border-emerald-200/90 dark:border-emerald-800/50 shadow-xs">
                            <div className="flex items-center justify-between mb-2.5">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase">
                                  Poll
                                </span>
                                <span className="font-bold text-xs text-gray-900 dark:text-white">
                                  {post.poll.question}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-bold bg-emerald-100/80 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                                {Object.values(post.poll.votes || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0)} votes
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {post.poll.options.map((opt: any, optIdx: number) => {
                                const optText = typeof opt === 'string' ? opt : opt?.text || String(opt);
                                const votesCount = post.poll?.votes?.[optText] || 0;
                                const totalVotes = Object.values(post.poll?.votes || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0);
                                const percent = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
                                const isSelected = userPollVotes[post.id] === optIdx;

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => handleVoteThreadPoll(post.id, optIdx)}
                                    className={`w-full text-left relative overflow-hidden rounded-lg border p-2 transition-all text-xs font-semibold ${
                                      isSelected
                                        ? 'border-emerald-500 bg-emerald-100/80 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-400/50'
                                        : 'border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/80 hover:border-emerald-300 text-gray-800 dark:text-gray-200'
                                    }`}
                                  >
                                    <div
                                      className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ${
                                        isSelected
                                          ? 'bg-emerald-400/30 dark:bg-emerald-500/40'
                                          : 'bg-emerald-200/40 dark:bg-emerald-900/30'
                                      }`}
                                      style={{ width: `${percent}%` }}
                                    />
                                    <div className="relative z-10 flex items-center justify-between">
                                      <span className="flex items-center gap-1.5">
                                        {isSelected ? (
                                          <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                                            ✓
                                          </span>
                                        ) : (
                                          <span className="w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-[9px] text-gray-400">
                                            {optIdx + 1}
                                          </span>
                                        )}
                                        <span>{optText}</span>
                                      </span>
                                      <span className="font-mono text-[10px] font-bold text-gray-700 dark:text-gray-300">
                                        {percent}% ({votesCount})
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Attached Media Rendering */}
                        {post.attachments && post.attachments.length > 0 && (
                          <div className={`mt-3 grid gap-2 ${post.attachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {post.attachments.map((att: any, aIdx: number) => {
                              const attPreview = typeof att === 'string' ? att : att?.preview || att?.url;
                              const isVideo = typeof att === 'string' ? (att.endsWith('.mp4') || att.endsWith('.webm')) : (att?.type === 'video');
                              const attName = typeof att === 'string' ? 'Attachment' : att?.name || 'Media';
                              return (
                                <div key={aIdx} className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 max-h-72 bg-black">
                                  {isVideo ? (
                                    <video src={attPreview} controls className="w-full h-full object-contain" />
                                  ) : (
                                    <img src={attPreview} alt={attName} className="w-full h-full object-cover" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Full Action Buttons Bar: Like, Dislike, Upvote, Downvote, Comment, Share, Bookmark/Save, Message, Report, Delete */}
                    <div className="flex flex-wrap items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
                      {/* Like */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center px-2.5 py-1 rounded-full font-medium transition ${
                          post.isLiked
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-gray-50 dark:bg-gray-700/60 hover:bg-red-50 hover:text-red-500'
                        }`}
                        title="Like this thread"
                      >
                        <HeartIcon className="h-3.5 w-3.5 mr-1" />
                        <span>{post.likes}</span>
                      </button>

                      {/* Dislike */}
                      <button
                        onClick={() => handleDislike(post.id)}
                        className={`flex items-center px-2.5 py-1 rounded-full font-medium transition ${
                          post.isDisliked
                            ? 'bg-gray-200 text-gray-800 border border-gray-300'
                            : 'bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 hover:text-gray-800'
                        }`}
                        title="Dislike this thread"
                      >
                        <span className="mr-1">👎</span>
                        <span>{post.dislikesCount || 0}</span>
                      </button>

                      {/* Upvote */}
                      <button
                        onClick={() => handleVoteThread(post.id, 'up')}
                        className="flex items-center px-2.5 py-1 rounded-full font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition text-[11px]"
                        title="Upvote on the sovereign protocol"
                      >
                        <span>▲ Upvote</span>
                      </button>

                      {/* Downvote */}
                      <button
                        onClick={() => handleVoteThread(post.id, 'down')}
                        className="flex items-center px-2.5 py-1 rounded-full font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition text-[11px]"
                        title="Downvote"
                      >
                        <span>▼ Downvote</span>
                      </button>

                      {/* Comment / Reply */}
                      <button
                        onClick={() => handleReply(post.id)}
                        className="flex items-center px-2.5 py-1 rounded-full font-medium bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 transition"
                      >
                        <MessageIcon className="h-3.5 w-3.5 mr-1" />
                        <span>{post.comments}</span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/forum/post/${post.id}`);
                          showToast('Link copied to clipboard! 📋', 'success');
                        }}
                        className="flex items-center px-2.5 py-1 rounded-full font-medium bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 transition"
                        title="Share thread link"
                      >
                        <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span>Share</span>
                      </button>

                      {/* Bookmark / Save */}
                      <button
                        onClick={() => handleBookmark(post.id)}
                        className={`flex items-center px-2.5 py-1 rounded-full font-medium transition ${
                          post.isBookmarked
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-gray-50 dark:bg-gray-700/60 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                        title="Bookmark & Save"
                      >
                        <span className="mr-1">🔖</span>
                        <span>{post.isBookmarked ? 'Saved' : 'Save'}</span>
                      </button>

                      {/* Message Author */}
                      <button
                        onClick={() => handleMessageAuthor(post)}
                        className="flex items-center px-2.5 py-1 rounded-full font-medium bg-gray-50 dark:bg-gray-700/60 hover:bg-emerald-50 hover:text-emerald-600 transition text-[11px]"
                        title="Message Creator directly"
                      >
                        <span className="mr-1">✉️</span>
                        <span>Message</span>
                      </button>

                      {/* Report */}
                      <button
                        onClick={() => handleReport(post.id)}
                        className="flex items-center px-2 py-1 rounded-full font-medium bg-gray-50 dark:bg-gray-700/60 hover:bg-yellow-50 hover:text-yellow-600 transition text-[11px] ml-auto"
                        title="Report inappropriate content"
                      >
                        <span className="mr-1">🚩</span>
                        <span>Report</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center px-2 py-1 rounded-full font-medium bg-gray-50 dark:bg-gray-700/60 hover:bg-red-50 hover:text-red-600 transition text-[11px]"
                        title="Delete post"
                      >
                        <span className="mr-1">🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Endless Scroll Observer Sentinel */}
              <div ref={observerTarget} className="py-4 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></span>
                    <span>Streaming more protocol threads...</span>
                  </div>
                )}
              </div>

              {/* End of Scroll Journey Marker (No Load More Button) */}
              {!hasMore && forumPosts.length > 0 && (
                <div className="py-8 px-4 text-center my-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-md">
                    ✨
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">You've reached the beginning of your journey</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Member registered: <span className="font-semibold text-orange-500">{memberRegistrationDate}</span> • Initial Sign-In Verified
                  </p>
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span>FingerMobile Protocol P2P Feed Synced</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column (Social Discovery & Widgets with Canary Ads Tab 2 and Google Adsense at Bottom) */}
        <div className="w-80 flex-shrink-0 hidden lg:block pl-8">
          <div className="sticky top-24 space-y-4">
            {/* Groups Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-base mb-3 text-gray-900 dark:text-white">Groups</h3>
              <div className="space-y-3">
                {[
                  { name: 'Good Group', unread: 3 },
                  { name: 'E-course Group', unread: 0 },
                  { name: 'Tech Enthusiasts', unread: 12 }
                ].map((group, index) => (
                  <div key={index} className="flex items-center justify-between py-1.5">
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white">{group.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">View feed</div>
                    </div>
                    {group.unread > 0 && (
                      <span className="bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {group.unread}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hallmarks Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-base mb-3 text-gray-900 dark:text-white">Hallmarks</h3>
              <div className="space-y-2.5">
                <div className="flex items-center py-1.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3 text-white text-xs">
                    ✓
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Verified Account</span>
                </div>
                <div className="flex items-center py-1.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-3 text-white text-xs">
                    ★
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community Leader</span>
                </div>
                <div className="flex items-center py-1.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-3 text-white text-xs">
                    💎
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Contributor</span>
                </div>
              </div>
            </div>

            {/* Storefront Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-base mb-3 text-gray-900 dark:text-white">Storefront</h3>
              <div className="bg-gray-50 dark:bg-gray-700/60 rounded-lg p-3">
                <div className="bg-gray-200 dark:bg-gray-600 h-16 rounded-md mb-2"></div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Digital Products</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">Latest items • 125 Sales</p>
              </div>
              <button
                onClick={() => navigate('/marketplace')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition mt-3 text-xs font-bold shadow-sm"
              >
                View Store
              </button>
            </div>

            {/* Suggested Photocredit Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-base mb-3 text-gray-900 dark:text-white">Suggested Photocredit</h3>
              <div className="bg-gray-50 dark:bg-gray-700/60 rounded-lg p-3 mb-3">
                <div className="bg-gray-200 dark:bg-gray-600 h-16 rounded-md mb-2"></div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Photo Credits</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">@photographer • Available: 50</p>
              </div>
              <button
                onClick={() => navigate('/photocredits')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 rounded-lg hover:from-orange-600 hover:to-amber-600 transition text-xs font-bold shadow-sm"
              >
                Buy Credits
              </button>
            </div>

            {/* Lumina Widget */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-sm">
              <h3 className="font-bold text-base mb-1">Lumina AI</h3>
              <p className="text-xs opacity-90 mb-3">Assistant for instant protocol answers</p>
              <button
                onClick={() => showToast('Opening Lumina AI assistant...', 'info')}
                className="w-full bg-white text-blue-600 py-2 rounded-lg font-bold text-xs hover:bg-gray-100 transition shadow"
              >
                Ask a question
              </button>
            </div>

            {/* BOTTOM / LAST WIDGET 1: Canary Ads Tab 2 Widget */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-sm p-4 border border-amber-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">Sponsored</span>
                <span className="text-[10px] bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">Canary Ads Tab 2</span>
              </div>
              <h4 className="font-bold text-sm text-gray-950 dark:text-white mb-1">Exclusive Protocol Rewards</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">Earn verified FIC tokens with Canary verified sponsor interactions.</p>
              <button
                onClick={() => navigate('/canary-ads')}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold py-2 rounded-lg transition shadow-sm"
              >
                Explore Canary Offers
              </button>
            </div>

            {/* BOTTOM / LAST WIDGET 2: Google Adsense Content Here Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-dashed border-gray-300 dark:border-gray-700 text-center">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Advertisement</div>
              <div className="bg-gray-50 dark:bg-gray-700/60 rounded-lg p-4 min-h-[140px] flex flex-col items-center justify-center border border-gray-100 dark:border-gray-600">
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-500 flex items-center justify-center font-bold text-xs mb-2">
                  Ad
                </div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Google Adsense Content Here
                </div>
                <div className="text-[10px] text-gray-400 mt-1">Responsive Banner • 300x250</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-orange-500 text-white rounded-full p-3.5 shadow-lg hover:bg-orange-600 transition relative group"
          title="Scroll to Top & Post"
        >
          <MessageIcon className="h-5 w-5" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold shadow group-hover:scale-110 transition-transform">07</span>
        </button>
      </div>

      {/* Interactive Feeling / Activity Modal */}
      {isFeelingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 dark:text-white">How are you feeling?</h3>
              <button
                onClick={() => setIsFeelingModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <button
                type="button"
                onClick={() => setFeelingModalTab('feelings')}
                className={`flex-1 py-3 text-xs font-bold transition text-center ${
                  feelingModalTab === 'feelings'
                    ? 'text-orange-600 border-b-2 border-orange-500 bg-white dark:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Feelings
              </button>
              <button
                type="button"
                onClick={() => setFeelingModalTab('activities')}
                className={`flex-1 py-3 text-xs font-bold transition text-center ${
                  feelingModalTab === 'activities'
                    ? 'text-orange-600 border-b-2 border-orange-500 bg-white dark:bg-gray-800'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Activities
              </button>
            </div>

            {/* Items Grid */}
            <div className="p-4 max-h-72 overflow-y-auto grid grid-cols-2 gap-2">
              {(feelingModalTab === 'feelings' ? feelingsList : activitiesList).map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleFeelingSelect(item)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-orange-300 hover:bg-orange-50/50 dark:hover:bg-gray-700 transition text-left"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                </button>
              ))}
            </div>

            {selectedFeeling && (
              <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <span className="text-xs text-gray-500">Currently: {selectedFeeling.emoji} {selectedFeeling.label}</span>
                <button
                  type="button"
                  onClick={() => setSelectedFeeling(null)}
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Live Stream Modal */}
      {isLiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <h3 className="font-bold text-base text-gray-900 dark:text-white">Go Live on Protocol</h3>
              </div>
              <button
                onClick={() => setIsLiveModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartLiveStream} className="p-5 space-y-4">
              {/* Simulated Camera Viewfinder */}
              <div className="relative rounded-xl overflow-hidden bg-slate-900 h-44 flex flex-col items-center justify-center text-white border border-slate-700">
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded text-[10px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>CAMERA PREVIEW</span>
                </div>
                <div className="absolute top-2 right-2 text-[10px] text-slate-400 bg-black/50 px-2 py-0.5 rounded">
                  HD 1080p • 60 FPS
                </div>
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-2">
                  <CameraIcon className="w-7 h-7 text-slate-400" />
                </div>
                <p className="text-xs text-slate-300 font-medium">Ready to broadcast to P2P relay nodes</p>

                {/* Simulated Audio Indicator */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 mr-1">MIC:</span>
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-sm ${i < 8 ? 'bg-emerald-500' : i < 10 ? 'bg-amber-500' : 'bg-red-500'}`}
                    ></div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider">
                  Stream Title
                </label>
                <input
                  type="text"
                  value={liveStreamTitle}
                  onChange={(e) => setLiveStreamTitle(e.target.value)}
                  placeholder={`${authState.user?.username || 'Member'}'s Protocol Live Session`}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1 uppercase tracking-wider">
                  Stream Channel / Category
                </label>
                <select
                  value={liveStreamCategory}
                  onChange={(e) => setLiveStreamCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="BeatwaveNG & Entertainment">🎵 BeatwaveNG & Entertainment</option>
                  <option value="Dancia-4Tv Live Showcase">📺 Dancia-4Tv Live Showcase</option>
                  <option value="FingerWars Gaming Tournament">🎮 FingerWars Gaming Tournament</option>
                  <option value="Lush Pressies Gifting Room">🎁 Lush Pressies Gifting Room</option>
                  <option value="Tech & AI Protocol Development">⚡ Tech & AI Protocol Development</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLiveModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg shadow-md transition flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  <span>Start Live Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Publicitee, FingerShorts, and Mii Modals */}
      <CreatePubliciteeShortsModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => showToast('Content published successfully!', 'success')}
      />
      <MiiPinExchangeModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        showToast={showToast}
      />
      <MiiFingerOrbitModal
        isOpen={showOrbitModal}
        onClose={() => setShowOrbitModal(false)}
        showToast={showToast}
      />
      <MiiMiniStoreModal
        isOpen={showMiniStoreModal}
        onClose={() => setShowMiniStoreModal(false)}
        showToast={showToast}
      />
      <MediaUploadAndEditorModal
        isOpen={isMediaStudioOpen}
        onClose={() => setIsMediaStudioOpen(false)}
        onSaveMedia={handleMediaStudioSave}
      />
    </div>
  );
};

export default ForumPage;





















