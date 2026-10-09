import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { SearchIcon, MessageIcon, CameraIcon, HeartIcon, PlayIcon } from '../components/icons';
import ForumService from '../services/forumService';
import { ForumPost, ForumCategory, ForumThread } from '../types/forum';
import CensorshipSelector, { CensorshipOptions } from '../components/CensorshipSelector';

import { CreateMiiStatusModal } from '../components/CreateMiiStatusModal';
import { MiiStoriesBar } from '../components/MiiStoriesBar';
import { MiiPinExchangeModal, MiiFingerOrbitModal, MiiMiniStoreModal } from '../components/MiiModals';
import { ForumRightSidebar } from '../components/ForumRightSidebar';
import { ReplyModal, ReportModal, EditPostModal } from '../components/ForumActionModals';
import { LuminaAIModal, FeelingActivityModal, CreateRoomModal } from '../components/ForumFeatureModals';
import { FingerShortsSection } from '../components/FingerShortsSection';
import { PubliciteeSection } from '../components/PubliciteeSection';
import { CreatePubliciteeShortsModal } from '../components/CreatePubliciteeShortsModal';

import UniversalHeader from '../components/layout/UniversalHeader';
import H2AdBucket from '../components/layout/H2AdBucket';
import CanaryAdPlacementWidget from '../components/canary/CanaryAdPlacementWidget';
import P2PStatusIndicator from '../components/P2PStatusIndicator';
import { Gift } from 'lucide-react';

// --- TYPES ---
export type ForumPostExtended = Omit<ForumPost, 'author'> & {
  title: string;
  author: string;
  category: string;
  categoryId?: string;
  date: string;
  likes: number;
  comments: number;
  views: number;
  isPinned?: boolean;
  tags?: string[];
  threadId: string;
  thread: ForumThread;
  replies: ForumPost[];
  censorship?: CensorshipOptions;
};

interface MainNavProps {
  unreadCount?: number;
  notifications?: Array<{ id: string | number; message: string; is_read?: boolean }>;
  onNotificationClick?: (n: any) => void;
}

// --- SUB-COMPONENTS ---
const MainNavigationTabBar: React.FC<MainNavProps> = ({
  unreadCount = 0,
  notifications = [],
  onNotificationClick = () => {}
}) => {
  const [activeTab, setActiveTab] = useState('trends');
  const [showChannels, setShowChannels] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  return (
    <nav
      className="w-full bg-crystalline-white-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm relative z-20"
      aria-label="Forum Channels & Navigation"
    >
      <div className="w-full max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-700/60 text-xs sm:text-sm">
        <div className="flex items-center space-x-2 relative">
          <button
            type="button"
            onClick={() => {
              setShowChannels((prev) => !prev);
              setShowSettings(false);
              setShowNotifications(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/70 hover:bg-orange-500 hover:text-white transition font-bold flex items-center gap-1.5 text-gray-700 dark:text-gray-200"
            aria-label="Toggle Navigation Channels"
          >
            <span>≡</span>
            <span className="font-semibold text-xs">Channels</span>
          </button>
          {showChannels && (
            <div className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700">
              {[
                { label: '🎁 Lush Pressies', path: '/lushpressies' },
                { label: '📺 Dancia-4tv', path: '/dancia4tv' },
                { label: '🛍️ MarketPlace', path: '/marketplace' },
                { label: '🎵 BeatwaveNg', path: '/beatwaveng' },
                { label: '🔥 Trends', path: '/trends' },
                { label: '⚡ Camus', path: '/camus' },
                { label: '⚔️ FingerWars', path: '/fingerwars' },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => {
                    setShowChannels(false);
                    navigate(path);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <span className="text-gray-600 dark:text-gray-400 font-semibold text-xs sm:text-sm">
            Followers: <strong className="text-gray-900 dark:text-white font-extrabold">204</strong>
          </span>
          <div className="flex space-x-1" title="5 Star Community Rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={`rating-star-${star}`} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications((prev) => !prev);
                setShowChannels(false);
                setShowSettings(false);
              }}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 transition focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-2 text-xs text-gray-500">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => {
                        setShowNotifications(false);
                        onNotificationClick(n);
                      }}
                      className={`block w-full text-left px-4 py-2 text-xs transition ${
                        n.is_read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white font-semibold bg-orange-50/50 dark:bg-gray-700/50'
                      } hover:bg-orange-50 dark:hover:bg-gray-700`}
                    >
                      {n.message}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Settings Tab */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowSettings((prev) => !prev);
                setShowChannels(false);
                setShowNotifications(false);
              }}
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-orange-500 transition focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" />
              </svg>
            </button>
            {showSettings && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowSettings(false);
                    navigate('/settings');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 transition"
                >
                  Settings
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSettings(false);
                    navigate('/logout');
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Primary Forum Channels */}
      <div className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="sr-only">Primary Forum Channels</h2>
        <div className="w-full grid grid-cols-3 divide-x divide-gray-200 dark:divide-gray-700 text-center">
          {[
            { label: 'Lush Pressies', icon: '🎁', path: '/lushpressies' },
            { label: 'Dancia-4tv', icon: '📺', path: '/dancia4tv' },
            { label: 'MarketPlace', icon: '🛍️', path: '/marketplace' }
          ].map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className="w-full py-3.5 px-3 text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white hover:text-orange-500 hover:bg-orange-50/60 dark:hover:bg-gray-700/60 transition-colors flex items-center justify-center gap-2 focus:outline-none"
            >
              <span>{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Forum Feeds */}
      <div className="w-full bg-slate-50/80 dark:bg-gray-900/60">
        <h3 className="sr-only">Secondary Forum Feeds</h3>
        <div className="w-full grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700 text-center text-xs sm:text-sm font-semibold">
          {[
            { id: 'beatwaveng', label: 'BeatwaveNg', icon: '🎵', path: '/beatwaveng' },
            { id: 'trends', label: 'Trends', icon: '🔥', path: '/trends' },
            { id: 'camus', label: 'Camus', icon: '⚡', path: '/camus' },
            { id: 'fingerwars', label: 'FingerWars', icon: '⚔️', path: '/fingerwars' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                navigate(tab.path);
              }}
              className={`w-full py-2.5 px-2 transition-all flex items-center justify-center gap-1.5 focus:outline-none ${
                activeTab === tab.id
                  ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-b-2 border-orange-500 font-bold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-xs sm:text-sm">{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const CanaryAdsWidget = () => (
  <div className="bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-gray-700 dark:to-gray-800 rounded-lg p-6 mb-6">
    <div className="text-center">
      <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">Canary Ads</div>
      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">Special Offers & Promotions</div>
      <div className="mt-4 flex justify-center">
        <div className="w-20 h-20 bg-white/30 dark:bg-gray-600/30 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 011.414 0zM1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  </div>
);

const ProfileCompletionCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold text-base text-gray-900 dark:text-white">Complete your Profile</h3>
      <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded">82%</span>
    </div>
    <div className="space-y-3">
      {['Upload Profile Picture', 'University?'].map((task) => (
        <div key={task} className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm text-gray-800 dark:text-gray-200">{task}</span>
        </div>
      ))}
      <div className="flex items-center">
        <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center mr-3">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="text-sm text-gray-800 dark:text-gray-200">Add Payment Method</span>
      </div>
    </div>
  </div>
);

const AdvertisementCard = () => (
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

// --- MAIN FORUM COMPONENT ---
const ForumPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { state: authState } = useAuth();
  const { state: onboardingState } = useOnboarding();
  const navigate = useNavigate();

  // State: Data & Feeds
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'discussed' | 'trending'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'saved'>('all');
  const [feedTab, setFeedTab] = useState<'feed' | 'publicitee'>('feed');
  const [forumPosts, setForumPosts] = useState<ForumPostExtended[]>([]);
  const [forumCategories, setForumCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // State: Notifications
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // State: Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMiiModal, setShowMiiModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showOrbitModal, setShowOrbitModal] = useState(false);
  const [showMiniStoreModal, setShowMiniStoreModal] = useState(false);
  const [showLuminaModal, setShowLuminaModal] = useState(false);
  const [showFeelingModal, setShowFeelingModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

  // Action Modals State
  const [replyPostId, setReplyPostId] = useState<string | null>(null);
  const [reportPostId, setReportPostId] = useState<string | null>(null);
  const [editPostId, setEditPostId] = useState<string | null>(null);
  const [editPostContent, setEditPostContent] = useState('');

  // Per-post dropdowns & interactions
  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);
  const [hiddenPostIds, setHiddenPostIds] = useState<Set<string>>(new Set());
  const [savedPostIds, setSavedPostIds] = useState<Set<string>>(new Set());

  // Post creation form state
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [postFeelingTag, setPostFeelingTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [censorshipOptions, setCensorshipOptions] = useState<CensorshipOptions>({
    tags: [],
    visualEffect: 'NONE',
    interactionRule: 'NONE'
  });

  // Guard: Redirect incomplete onboarding
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      if (!onboardingState.progress || (onboardingState.progress.completedSteps?.length || 0) < 5) {
        navigate('/onboarding');
      }
    }
  }, [authState, onboardingState, navigate]);

  // Clean up object URLs on component unmount
  useEffect(() => {
    return () => {
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    };
  }, [mediaPreviewUrl]);

  // Notifications polling
  useEffect(() => {
    if (!authState.isAuthenticated) return;
    let isMounted = true;

    const fetchNotifs = async () => {
      try {
        const [notifsRes, unreadRes] = await Promise.all([
          ForumService.getNotifications(),
          ForumService.getUnreadCount()
        ]);
        if (isMounted) {
          if (notifsRes.success && notifsRes.data?.data) {
            setNotifications(notifsRes.data.data);
          }
          if (unreadRes.success && unreadRes.data?.count !== undefined) {
            setUnreadCount(unreadRes.data.count);
          }
        }
      } catch (e) {
        console.error('Error fetching forum notifications', e);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [authState.isAuthenticated]);

  // Fetch Categories & Initial Feeds
  useEffect(() => {
    let isMounted = true;

    const fetchForumData = async () => {
      setLoading(true);
      try {
        const categoriesResult = await ForumService.getCategories();
        let cats: ForumCategory[] = [];
        if (categoriesResult.success) {
          cats = categoriesResult.data?.categories || [];
          if (isMounted) {
            setForumCategories(cats);
            if (cats.length > 0) {
              setSelectedCategoryId(cats[0].id);
            }
          }
        }

        const defaultCategoryId = cats[0]?.id;
        if (defaultCategoryId) {
          const threadsResult = await ForumService.getThreadsByCategory(defaultCategoryId, 20, 0, 'latest');
          if (threadsResult.success && threadsResult.data?.threads && isMounted) {
            const converted: ForumPostExtended[] = threadsResult.data.threads.map((thread: any) => ({
              id: thread.id,
              title: thread.title,
              content: thread.content,
              author: typeof thread.author === 'string' ? thread.author : thread.author?.username || 'Anonymous',
              category: thread.category?.name || 'General',
              categoryId: thread.categoryId || defaultCategoryId,
              date: thread.createdAt,
              likes: thread.posts?.reduce((sum: number, post: any) => sum + (post.likesCount || 0), 0) || 0,
              comments: thread.repliesCount || 0,
              views: thread.viewsCount || 0,
              isPinned: thread.isPinned || false,
              tags: thread.tags,
              threadId: thread.id,
              thread,
              authorId: thread.authorId,
              likesCount: thread.posts?.reduce((sum: number, post: any) => sum + (post.likesCount || 0), 0) || 0,
              dislikesCount: 0,
              isLiked: false,
              isDisliked: false,
              isBookmarked: false,
              isReported: false,
              isDeleted: false,
              isEdited: false,
              replies: [],
              replyCount: thread.repliesCount || 0,
              attachments: thread.attachments || [],
              createdAt: thread.createdAt,
              updatedAt: thread.updatedAt,
              isApproved: true,
              spamScore: 0,
              moderationStatus: 'approved'
            }));
            setForumPosts(converted);
          }
        }
      } catch (err) {
        console.error('Error fetching forum data:', err);
        showToast('Failed to load forum feed.', 'error');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchForumData();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  // Handlers
  const handleNotificationClick = async (notif: any) => {
    if (!notif.is_read) {
      try {
        await ForumService.markNotificationRead(notif.id);
        setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        showToast('File size must be under 20MB', 'error');
        return;
      }
      if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
      setMediaFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearMedia = () => {
    if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setMediaFile(null);
    setMediaPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        setCensorshipOptions((prev) => ({
          ...prev,
          visualEffect: prev.visualEffect === 'NONE' ? 'CENSOR_BAR' : prev.visualEffect,
          tags: Array.from(new Set([...(prev.tags || []), 'Censored']))
        }));
        showToast('Censorship rules applied!', 'info');
      }
    } catch {
      showToast('Failed to contact censor service', 'error');
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !mediaFile) {
      showToast('Please enter content or attach media.', 'error');
      return;
    }

    const targetCategoryId = selectedCategoryId || (forumCategories[0]?.id ?? '');
    if (!targetCategoryId) {
      showToast('No forum categories available to post in.', 'error');
      return;
    }

    setIsCreatingPost(true);
    try {
      let mediaUrls: string[] = [];
      if (mediaFile && mediaPreviewUrl) {
        mediaUrls = [mediaPreviewUrl];
      }

      const appliedTags = [...(censorshipOptions.tags || [])];
      if (censorshipOptions.visualEffect !== 'NONE') {
        appliedTags.push(`censor:${censorshipOptions.visualEffect}`);
      }

      const result = await ForumService.createThread({
        title: newPostContent.substring(0, 50) + (newPostContent.length > 50 ? '...' : ''),
        content: newPostContent,
        categoryId: targetCategoryId,
        tags: appliedTags,
        mediaUrls
      });

      if (result.success && result.data) {
        showToast('Post created successfully!', 'success');
        const thread = result.data;
        const currentCategory = forumCategories.find((c) => c.id === targetCategoryId);

        const newPost: ForumPostExtended = {
          id: thread.id,
          title: thread.title,
          content: thread.content,
          author: authState.user?.username || 'You',
          category: currentCategory?.name || 'General',
          categoryId: targetCategoryId,
          date: thread.createdAt || new Date().toISOString(),
          likes: 0,
          comments: 0,
          views: 0,
          isPinned: false,
          tags: thread.tags,
          threadId: thread.id,
          thread,
          authorId: thread.authorId || authState.user?.id || '',
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
          attachments: thread.attachments || mediaUrls,
          createdAt: thread.createdAt || new Date().toISOString(),
          updatedAt: thread.updatedAt || new Date().toISOString(),
          isApproved: true,
          spamScore: 0,
          moderationStatus: 'approved',
          censorship: censorshipOptions
        };

        setForumPosts((prev) => [newPost, ...prev]);
        setNewPostContent('');
        clearMedia();
        setCensorshipOptions({ tags: [], visualEffect: 'NONE', interactionRule: 'NONE' });
      } else {
        showToast(result.error || 'Failed to create post', 'error');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleLike = async (postId: string) => {
    const post = forumPosts.find((p) => p.id === postId);
    if (!post) return;
    const isCurrentlyLiked = post.isLiked;

    setForumPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likes: isCurrentlyLiked ? p.likes - 1 : p.likes + 1, isLiked: !isCurrentlyLiked }
          : p
      )
    );

    try {
      if (isCurrentlyLiked) {
        await ForumService.unlikePost(postId);
      } else {
        await ForumService.likePost(postId);
      }
    } catch {
      // Revert optimistic update
      setForumPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, likes: isCurrentlyLiked ? p.likes + 1 : p.likes - 1, isLiked: isCurrentlyLiked }
            : p
        )
      );
      showToast('Failed to update like status', 'error');
    }
  };

  const handleSavePost = async (postId: string) => {
    setOpenPostMenuId(null);
    const isSaved = savedPostIds.has(postId);
    try {
      if (isSaved) {
        await ForumService.unsavePost(postId);
        setSavedPostIds((prev) => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
        showToast('Post removed from saved.', 'info');
      } else {
        await ForumService.savePost(postId);
        setSavedPostIds((prev) => new Set([...prev, postId]));
        showToast('Post saved to bookmarks!', 'success');
      }
    } catch {
      showToast('Save/unsave action failed.', 'error');
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement> | React.FormEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const result = await ForumService.searchPosts(searchTerm);
      if (result.success && result.data?.posts) {
        const convertedSearchPosts: ForumPostExtended[] = result.data.posts.map((post: any) => ({
          ...post,
          title: post.thread?.title || 'Forum Post',
          author: typeof post.author === 'string' ? post.author : post.author?.username || 'Anonymous',
          category: 'General',
          date: post.createdAt,
          likes: 0,
          comments: 0,
          views: 0,
          thread: post.thread,
          replies: []
        }));
        setForumPosts(convertedSearchPosts);
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

  const submitReply = async (content: string) => {
    if (!replyPostId) return;
    try {
      const result = await ForumService.createPost({ content, threadId: replyPostId });
      if (result.success) {
        showToast('Reply added!', 'success');
        setForumPosts((prev) =>
          prev.map((post) => (post.id === replyPostId ? { ...post, comments: post.comments + 1 } : post))
        );
        setReplyPostId(null);
      } else {
        showToast(result.error || 'Failed to reply', 'error');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    }
  };

  const submitReport = async (reason: string) => {
    if (!reportPostId) return;
    try {
      const result = await ForumService.reportPost(reportPostId, reason);
      if (result.success) {
        showToast('Post reported', 'success');
        setReportPostId(null);
      } else {
        showToast(result.error || 'Failed to report', 'error');
      }
    } catch {
      showToast('An unexpected error occurred', 'error');
    }
  };

  const submitEditPost = async (newContent: string) => {
    if (!editPostId) return;
    try {
      const result = await ForumService.updatePost(editPostId, { content: newContent });
      if (result.success) {
        showToast('Post updated successfully!', 'success');
        setForumPosts((prev) =>
          prev.map((p) => (p.id === editPostId ? { ...p, content: newContent } : p))
        );
        setEditPostId(null);
      } else {
        showToast(result.message || 'Failed to update post.', 'error');
      }
    } catch {
      showToast('Failed to update post.', 'error');
    }
  };

  // Memoized post list filtering & sorting (immutable)
  const filteredAndSortedPosts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const filtered = forumPosts
      .filter((post) => {
        if (filterBy === 'saved') return savedPostIds.has(post.id);
        return !hiddenPostIds.has(post.id);
      })
      .filter((post) => {
        const matchesSearch =
          !term ||
          post.title?.toLowerCase().includes(term) ||
          post.content?.toLowerCase().includes(term) ||
          post.author?.toLowerCase().includes(term);

        const matchesCat =
          selectedCategory === 'all' ||
          post.categoryId === selectedCategory ||
          post.category === selectedCategory;

        return matchesSearch && matchesCat;
      });

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'discussed':
          return b.comments - a.comments;
        case 'trending':
          return b.likes * 2 + b.comments + b.views - (a.likes * 2 + a.comments + a.views);
        case 'recent':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [forumPosts, searchTerm, sortBy, selectedCategory, filterBy, savedPostIds, hiddenPostIds]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-crystalline-white-100 dark:bg-gray-900 pb-16">
      <UniversalHeader pageTitle="Forum & Social Feeds" />
      <H2AdBucket />
      <MainNavigationTabBar
        unreadCount={unreadCount}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
      />

      {/* 3-Column Responsive Grid Layout */}
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[20%_58%_22%] gap-6 px-4 mt-6">
        
        {/* Left Column: Sidebar & Navigation */}
        <aside className="hidden lg:block space-y-4">
          <div className="sticky top-20 space-y-4">
            <CanaryAdsWidget />
            <ProfileCompletionCard />
            <AdvertisementCard />

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2">P2P Connection</h3>
              <P2PStatusIndicator status="connected" connectionCount={12} speed={1.5} />
              <p className="text-xs text-gray-500 mt-2">P2P protocol optimized for low-latency streaming</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-3">Members Area</h3>
              <ul className="space-y-1 text-sm font-medium">
                {['mii', 'groups', 'blogs', 'hallmarks', 'permanence', 'gameon', 'photocredits', 'Loansqr'].map((path) => (
                  <li
                    key={path}
                    onClick={() => navigate(`/${path}`)}
                    className="capitalize text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {path}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Center Column: Feed & Interactive Creator */}
        <main className="space-y-4 min-w-0">
          <MiiStoriesBar
            onOpenCreate={() => setShowMiiModal(true)}
            onOpenPinExchange={() => setShowPinModal(true)}
            onOpenOrbit={() => setShowOrbitModal(true)}
            onOpenMiniStore={() => setShowMiniStoreModal(true)}
          />

          {/* Filtering, Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
            <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'Home', sort: 'popular' as const, tabType: 'feed' as const },
                { id: 'publicitee', label: '🎬 Publicitee', sort: 'recent' as const, tabType: 'publicitee' as const },
                { id: 'recent', label: 'Recent', sort: 'recent' as const, tabType: 'feed' as const },
                { id: 'discussed', label: 'Discussed', sort: 'discussed' as const, tabType: 'feed' as const },
                { id: 'trending', label: 'Trending', sort: 'trending' as const, tabType: 'feed' as const },
                { id: 'saved', label: 'Saved ♥', sort: 'recent' as const, tabType: 'feed' as const }
              ].map((tab) => {
                const isActive =
                  tab.id === 'publicitee'
                    ? feedTab === 'publicitee'
                    : feedTab === 'feed' && (tab.id === 'saved' ? filterBy === 'saved' : filterBy !== 'saved' && sortBy === tab.sort);

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setFeedTab(tab.tabType);
                      if (tab.id === 'saved') {
                        setFilterBy('saved');
                      } else {
                        setFilterBy('all');
                        setSortBy(tab.sort);
                      }
                    }}
                    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-sm font-semibold transition ${
                      isActive
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex space-x-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {forumCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <div className="relative w-full sm:w-48">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearch}
                  placeholder="Search forum..."
                  className="w-full pl-3 pr-8 py-1.5 text-xs sm:text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
                />
                <SearchIcon className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Create Post Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Post In:</span>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500"
                >
                  {forumCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <CensorshipSelector options={censorshipOptions} onChange={setCensorshipOptions} />
                <button
                  type="button"
                  onClick={handleCensorCurrentText}
                  disabled={!newPostContent.trim()}
                  className="text-xs font-medium bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md px-2 py-1 transition flex items-center space-x-1 disabled:opacity-50"
                >
                  <span>🛡️</span>
                  <span>Censor Post</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <img
                src={authState.user?.avatar || 'https://via.placeholder.com/40x40'}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 flex gap-2">
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
                  placeholder="Share your thoughts or start a discussion..."
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white text-sm"
                />
                <button
                  onClick={handleCreatePost}
                  disabled={isCreatingPost || (!newPostContent.trim() && !mediaFile)}
                  className="px-5 py-2 rounded-full font-medium text-white text-sm transition bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed"
                >
                  {isCreatingPost ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>

            {mediaPreviewUrl && (
              <div className="mt-4 relative inline-block">
                <img
                  src={mediaPreviewUrl}
                  alt="Attachment Preview"
                  className="max-h-56 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                />
                <button
                  onClick={clearMedia}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex justify-between flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs sm:text-sm">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center text-orange-600 hover:text-orange-700 font-semibold"
              >
                <div className="p-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 mr-2">
                  <PlayIcon className="h-4 w-4 text-orange-600" />
                </div>
                Reels & Shorts
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleMediaSelect}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500"
              >
                <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 mr-2">
                  <CameraIcon className="h-4 w-4" />
                </div>
                Photo/Video
              </button>

              <button
                onClick={() => setShowFeelingModal(true)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500"
              >
                <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 mr-2">
                  <HeartIcon className="h-4 w-4" />
                </div>
                {postFeelingTag || 'Feeling/Activity'}
              </button>

              <button
                onClick={() => setShowCreateRoomModal(true)}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500"
              >
                <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 mr-2">
                  <PlayIcon className="h-4 w-4" />
                </div>
                Live Stream
              </button>
            </div>
          </div>

          <FingerShortsSection />

          {/* Feeds Render */}
          {feedTab === 'publicitee' ? (
            <PubliciteeSection placement="newsfeed_tab" />
          ) : (
            <div className="space-y-4">
              {filteredAndSortedPosts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center text-gray-500">
                  No posts found matching the criteria.
                </div>
              ) : (
                filteredAndSortedPosts.map((post, idx) => (
                  <React.Fragment key={post.id}>
                    {idx === 2 && <PubliciteeSection placement="newsfeed_section" className="my-4" />}
                    {idx === 5 && <CanaryAdPlacementWidget placement="feed_video" className="my-4" />}

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                      <div className="flex items-start">
                        <img
                          src="https://via.placeholder.com/40x40"
                          alt={post.author}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">{post.author}</h4>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(post.date).toLocaleString()}
                              </span>
                            </div>

                            {/* 3-Dots Menu */}
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setOpenPostMenuId(openPostMenuId === post.id ? null : post.id)}
                                className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </button>
                              {openPostMenuId === post.id && (
                                <div className="absolute right-0 top-7 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-30 text-xs">
                                  <button
                                    type="button"
                                    onClick={() => handleSavePost(post.id)}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
                                  >
                                    <span>{savedPostIds.has(post.id) ? '💛' : '🔖'}</span>
                                    {savedPostIds.has(post.id) ? 'Unsave Post' : 'Save Post'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setHiddenPostIds((prev) => new Set([...prev, post.id]));
                                      setOpenPostMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2"
                                  >
                                    <span>👁️‍🗨️</span> Hide Post
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReportPostId(post.id);
                                      setOpenPostMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 flex items-center gap-2"
                                  >
                                    <span>🚩</span> Report Post
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            <p className="whitespace-pre-line">{post.content}</p>
                          </div>

                          {post.attachments && post.attachments.length > 0 && (
                            <div className="mt-3">
                              <img
                                src={post.attachments[0]}
                                alt="Post attachment"
                                className="w-full max-h-80 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                              />
                            </div>
                          )}

                          <div className="flex items-center mt-3 space-x-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                            <button
                              onClick={() => handleLike(post.id)}
                              className={`flex items-center space-x-1 hover:text-orange-500 transition ${
                                post.isLiked ? 'text-orange-500 font-bold' : ''
                              }`}
                            >
                              <HeartIcon className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </button>
                            <button
                              onClick={() => setReplyPostId(post.id)}
                              className="flex items-center space-x-1 hover:text-orange-500 transition"
                            >
                              <MessageIcon className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/forum/post/${post.id}`);
                                showToast('Link copied to clipboard!', 'success');
                              }}
                              className="flex items-center space-x-1 hover:text-orange-500 transition"
                            >
                              <span>Share</span>
                            </button>
                            <button
                              onClick={() => showToast('Gift features coming soon!', 'info')}
                              className="flex items-center space-x-1 hover:text-indigo-500 transition"
                            >
                              <Gift className="h-4 w-4" />
                              <span>Gift</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))
              )}
            </div>
          )}
        </main>

        {/* Right Column: Discover & Sidebar Widgets */}
        <aside className="hidden lg:block space-y-4">
          <ForumRightSidebar />
        </aside>
      </div>

      {/* Floating Messenger Action Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => navigate('/messages')}
          title="Open Direct Messages"
          className="bg-orange-500 text-white rounded-full p-3.5 shadow-xl hover:bg-orange-600 transition relative"
        >
          <MessageIcon className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white dark:border-gray-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Interactive Modals */}
      <CreatePubliciteeShortsModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => showToast('Content published successfully!', 'success')}
      />
      <CreateMiiStatusModal
        isOpen={showMiiModal}
        onClose={() => setShowMiiModal(false)}
        onSuccess={() => showToast('Mii Status published!', 'success')}
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
      <ReplyModal
        isOpen={!!replyPostId}
        onClose={() => setReplyPostId(null)}
        onSubmit={submitReply}
      />
      <ReportModal
        isOpen={!!reportPostId}
        onClose={() => setReportPostId(null)}
        onSubmit={submitReport}
      />
      <EditPostModal
        isOpen={!!editPostId}
        onClose={() => setEditPostId(null)}
        onSubmit={submitEditPost}
        initialContent={editPostContent}
      />
      <LuminaAIModal
        isOpen={showLuminaModal}
        onClose={() => setShowLuminaModal(false)}
      />
      <FeelingActivityModal
        isOpen={showFeelingModal}
        onClose={() => setShowFeelingModal(false)}
        onSelect={(tag) => {
          setPostFeelingTag(tag);
          setShowFeelingModal(false);
          showToast(`Feeling set: ${tag}`, 'success');
        }}
      />
      <CreateRoomModal
        isOpen={showCreateRoomModal}
        onClose={() => setShowCreateRoomModal(false)}
        showToast={showToast}
      />
    </div>
  );
};

export default ForumPage;
