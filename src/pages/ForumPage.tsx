import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useOnboarding } from '../contexts/OnboardingContext'; // Added onboarding context
import LoadingSpinner from '../components/LoadingSpinner';
import { SearchIcon, MessageIcon, CameraIcon, HeartIcon, PlayIcon, ChevronDownIcon } from '../components/icons';
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

// Import the P2P indicator component
import P2PStatusIndicator from '../components/P2PStatusIndicator';

const MainNavigationTabBar = () => {
  const [activeTab, setActiveTab] = useState('trends');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed top-18 left-0 right-0 h-20 bg-crystalline-white-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 flex items-center px-4">
      <div className="flex items-center space-x-2">
        <button className="p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-lg">
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

// Define the ForumPostExtended type properly
type ForumPostExtended = Omit<ForumPost, 'author'> & {
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
};

const ForumPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { state: authState } = useAuth();
  const { state: onboardingState } = useOnboarding(); // Added onboarding state
  const navigate = useNavigate(); // Added navigation hook

  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'discussed'>('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [forumPosts, setForumPosts] = useState<ForumPostExtended[]>([]);
  const [forumCategories, setForumCategories] = useState<ForumCategory[]>([]);
  const [, setForumThreads] = useState<ForumThread[]>([]);

  // Post creation state
  const [newPostContent, setNewPostContent] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [censorshipOptions, setCensorshipOptions] = useState<CensorshipOptions>({
    tags: [],
    visualEffect: 'NONE',
    interactionRule: 'NONE'
  });

  // Publicitee, FingerShorts, and Mii Interactive Modal & Tab States
  const [feedTab, setFeedTab] = useState<'feed' | 'publicitee'>('feed');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showOrbitModal, setShowOrbitModal] = useState(false);
  const [showMiniStoreModal, setShowMiniStoreModal] = useState(false);

  // Check if user has completed onboarding and redirect if not
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      // If user hasn't completed onboarding, redirect to onboarding page
      if (!onboardingState.progress || onboardingState.progress.completedSteps.length < 5) { // Requiring more steps to be completed
        navigate('/onboarding');
      }
    }
  }, [authState, onboardingState, navigate]);

  // Fetch forum data
  useEffect(() => {
    const fetchForumData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch categories
        const categoriesResult = await ForumService.getCategories();
        if (categoriesResult.success) {
          const cats = categoriesResult.data?.categories || [];
          setForumCategories(cats);
          if (cats.length > 0) {
            setSelectedCategoryId(prev => prev || cats[0].id);
          }
        } else {
          // eslint-disable-next-line no-console
          console.error('Failed to fetch categories:', categoriesResult.error);
        }

        // Fetch threads for the first category if available
        let defaultCategoryId = null;
        if (categoriesResult.success && categoriesResult.data?.categories && categoriesResult.data.categories.length > 0) {
          defaultCategoryId = categoriesResult.data.categories[0].id;
        }

        // Only fetch threads if we have a valid category ID
        let threadsResult: any = { success: false, data: null };
        if (defaultCategoryId) {
          threadsResult = await ForumService.getThreadsByCategory(defaultCategoryId, 20, 0, 'latest');
          if (threadsResult.success) {
            setForumThreads(threadsResult.data?.threads || []);
          } else {
            // eslint-disable-next-line no-console
            console.error('Failed to fetch threads:', threadsResult.error);
          }
        }

        // Convert threads to posts format for display
        const convertedPosts: ForumPostExtended[] = threadsResult.success && threadsResult.data?.threads
          ? threadsResult.data.threads.map((thread: any) => ({
            id: thread.id,
            title: thread.title,
            content: thread.content,
            author: typeof thread.author === 'string' ? thread.author : thread.author?.username || 'Anonymous',
            category: thread.category?.name || 'General',
            date: thread.createdAt,
            likes: thread.posts?.reduce((sum: number, post: any) => sum + post.likesCount, 0) || 0,
            comments: thread.repliesCount,
            views: thread.viewsCount,
            isPinned: thread.isPinned,
            tags: thread.tags,
            threadId: thread.id,
            thread: thread,
            authorId: thread.authorId,
            parentPostId: undefined,
            parentPost: undefined,
            likesCount: thread.posts?.reduce((sum: number, post: any) => sum + post.likesCount, 0) || 0,
            dislikesCount: thread.posts?.reduce((sum: number, post: any) => sum + post.dislikesCount, 0) || 0,
            isLiked: false,
            isDisliked: false,
            isBookmarked: false,
            isReported: false,
            isDeleted: false,
            isEdited: false,
            editReason: undefined,
            replies: [],  // Initialize with empty replies array
            replyCount: 0,
            attachments: [],
            location: undefined,
            ipHash: undefined,
            userAgent: undefined,
            createdAt: thread.createdAt,
            updatedAt: thread.updatedAt,
            editedAt: undefined,
            deletedAt: undefined,
            reportedAt: undefined,
            reportedReason: undefined,
            reportedById: undefined,
            isApproved: true,
            approvedById: undefined,
            approvedAt: undefined,
            spamScore: 0,
            moderationStatus: 'approved'
          }))
          : [];

        // Remove mock data and only use actual DB data
        setForumPosts(convertedPosts);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error fetching forum data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch forum data');
      } finally {
        setLoading(false);
      }
    };

    fetchForumData();
  }, [showToast]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    return forumPosts
      .filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(post => filterBy === 'all' || post.category === filterBy)
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'popular') return b.likes - a.likes;
        if (sortBy === 'discussed') return b.comments - a.comments;
        return 0;
      });
  }, [forumPosts, searchTerm, sortBy, filterBy]);

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
    if (!newPostContent.trim()) {
      showToast('Please enter some content for your post.', 'error');
      return;
    }

    setIsCreatingPost(true);
    try {
      // Use selected category or fallback to first available category
      let targetCategoryId = selectedCategoryId || (forumCategories.length > 0 ? forumCategories[0].id : null);

      if (!targetCategoryId) {
        showToast('No forum categories available to post in.', 'error');
        setIsCreatingPost(false);
        return;
      }

      // Collect censorship tags
      const appliedTags = [...(censorshipOptions.tags || [])];
      if (censorshipOptions.visualEffect !== 'NONE') {
        appliedTags.push(`censor:${censorshipOptions.visualEffect}`);
      }

      const result = await ForumService.createThread({
        title: newPostContent.substring(0, 50) + (newPostContent.length > 50 ? '...' : ''),
        content: newPostContent,
        categoryId: targetCategoryId,
        tags: appliedTags
      });

      if (result.success && result.data) {
        showToast('Post created successfully!', 'success');
        setNewPostContent('');

        // Format thread as ForumPostExtended to add to the feed
        const thread = result.data;
        const currentCategory = forumCategories.find(c => c.id === targetCategoryId);
        const newPost: ForumPostExtended = {
          id: thread.id,
          title: thread.title,
          content: thread.content,
          author: typeof thread.author === 'string' ? thread.author : thread.author?.username || authState.user?.username || 'Anonymous',
          category: typeof thread.category === 'string' ? thread.category : thread.category?.name || currentCategory?.name || 'General',
          date: thread.createdAt,
          likes: 0,
          comments: 0,
          views: 0,
          isPinned: thread.isPinned || false,
          tags: thread.tags,
          threadId: thread.id,
          thread: thread,
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
          attachments: [],
          createdAt: thread.createdAt,
          updatedAt: thread.updatedAt,
          isApproved: true,
          spamScore: 0,
          moderationStatus: 'approved',
          censorship: censorshipOptions
        };

        setForumPosts(prev => [newPost, ...prev]);
        // Reset censorship options
        setCensorshipOptions({ tags: [], visualEffect: 'NONE', interactionRule: 'NONE' });
      } else {
        showToast(result.error || 'Failed to create post', 'error');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating post:', error);
      showToast('An unexpected error occurred', 'error');
    } finally {
      setIsCreatingPost(false);
    }
  };


  const handleLike = async (postId: string) => {
    const postToLike = forumPosts.find(p => p.id === postId);
    if (!postToLike) return;
    const isCurrentlyLiked = postToLike.isLiked;

    // Optimistic UI update
    setForumPosts(prevPosts =>
      prevPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likes: isCurrentlyLiked ? post.likes - 1 : post.likes + 1,
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
    } catch (err) {
      // Revert on error
      setForumPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likes: isCurrentlyLiked ? post.likes + 1 : post.likes - 1,
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
      } catch (err) {
        showToast('An unexpected error occurred', 'error');
      }
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
        // Map search results back to extended format
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
    } catch (err) {
      showToast('Search error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      // In this frontend structure, posts are actually threads in the root feed
      const result = await ForumService.deleteThread(postId);
      if (result.success) {
        setForumPosts(prev => prev.filter(p => p.id !== postId));
        showToast('Post deleted', 'success');
      } else {
        showToast(result.error || 'Failed to delete', 'error');
      }
    } catch (err) {
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
      } catch (err) {
        showToast('An unexpected error occurred', 'error');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-crystalline-white-100 dark:bg-gray-900 pb-16">
      {/* STATIC H1: SLIM THREE-COLUMN BAR WITH PERMANENT BURGER MENU */}
      <UniversalHeader pageTitle="Forum & Social Feeds" />
      {/* STATIC H2: HIGH-IMPACT AD CONTAINER (3X LARGER THAN H1) */}
      <H2AdBucket />
      <MainNavigationTabBar />

      <div className="flex max-w-[1280px] mx-auto gap-8 px-4">
        {/* Left Column Navigation MENU (This is the Members Area, Utilities & Status), Mii, Groups, Blog, Hallmarks, Permanence, Gameon, PhotoCredits, Lendsqr (Load More Button) */}
        <div className="w-80 flex-shrink-0 hidden md:block pr-8">
          <div className="sticky top-32 space-y-4">
            <CanaryAdsWidget />
            <ProfileCompletionCard />
            <AdvertisementCard />

            {/* P2P Status Indicator - showing the P2P matching status */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">P2P Connection Status</h3>
              <P2PStatusIndicator status="connected" connectionCount={12} speed={1.5} />
              <p className="text-xs text-gray-500 mt-2">Your P2P algorithm is optimized for maximum engagement</p>
            </div>

            {/* Additional left column sections */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Members Area</h3>
              <ul className="space-y-4">
                <li onClick={() => navigate('/mii')} className="text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Mii</li>
                <li onClick={() => navigate('/groups')} className="text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Groups</li>
                <li onClick={() => navigate('/blogs')} className="text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Blog</li>
                <li onClick={() => navigate('/hallmarks')} className="text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Hallmarks</li>
                <li onClick={() => navigate('/permanence')} className="text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Permanence</li>
                <li onClick={() => navigate('/gameon')} className="text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Gameon</li>
                <li onClick={() => navigate('/photocredits')} className="text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">PhotoCredits</li>
                <li onClick={() => navigate('/lendsqr')} className="text-base text-gray-600 dark:text-gray-300 hover:text-orange-500 cursor-pointer py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">Lendsqr</li>
              </ul>

              <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition text-base font-medium shadow">
                Load More
              </button>
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4">
            <div className="flex space-x-2 overflow-x-auto w-full sm:w-auto">
              {[
                { id: 'all', label: 'Home', sort: 'popular' as const, tabType: 'feed' as const },
                { id: 'publicitee', label: '🎬 Publicitee (Reels)', sort: 'recent' as const, tabType: 'publicitee' as const },
                { id: 'recent', label: 'Recent', sort: 'recent' as const, tabType: 'feed' as const },
                { id: 'discussed', label: 'Discussed', sort: 'discussed' as const, tabType: 'feed' as const }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFeedTab(tab.tabType);
                    setSortBy(tab.sort);
                    if (tab.id === 'all') setFilterBy('all');
                  }}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-base font-semibold transition ${
                    (tab.id === 'publicitee' && feedTab === 'publicitee') ||
                    (tab.id !== 'publicitee' && feedTab === 'feed' && sortBy === tab.sort)
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
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
                className="w-full px-3.5 py-1.5 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
              />
              <SearchIcon className="absolute right-3 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Create New Post Box */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
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
                      {cat.name}
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

            <div className="flex items-center">
              <img
                src={authState.user?.avatar || 'https://via.placeholder.com/48x48'}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-4"
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
                  placeholder="Share Your Moments, Create a New Post..."
                  className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white text-base"
                />
                <button
                  onClick={handleCreatePost}
                  disabled={isCreatingPost || !newPostContent.trim()}
                  className={`px-4 py-2 rounded-full font-medium text-white transition whitespace-nowrap ${
                    isCreatingPost || !newPostContent.trim()
                      ? 'bg-orange-300 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {isCreatingPost ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
            <div className="flex justify-between flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold group"
              >
                <div className="p-2 rounded-full bg-orange-100 dark:bg-orange-950/60 group-hover:bg-orange-200 transition mr-3">
                  <PlayIcon className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-base font-medium">Create Reels & Shorts</span>
              </button>
              <button
                onClick={() => showToast('Photo/Video upload coming soon!', 'info')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 group"
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 transition mr-3">
                  <CameraIcon className="h-5 w-5" />
                </div>
                <span className="text-base font-medium">Photo/Video</span>
              </button>
              <button
                onClick={() => showToast('Feeling/Activity selector coming soon!', 'info')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 group"
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 transition mr-3">
                  <HeartIcon className="h-5 w-5" />
                </div>
                <span className="text-base font-medium">Feeling/Activity</span>
              </button>
              <button
                onClick={() => showToast('Live Stream feature coming soon!', 'info')}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 group"
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 transition mr-3">
                  <PlayIcon className="h-5 w-5" />
                </div>
                <span className="text-base font-medium">Live Stream</span>
              </button>
            </div>
          </div>

          {/* FingerShorts™ (48h Stories) Section embedded in the body */}
          <FingerShortsSection />

          {/* Chat Rooms Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Livestream/Video chat with friends</h3>
              <button
                onClick={() => showToast('Room creation coming soon!', 'info')}
                className="text-base text-orange-500 hover:underline font-medium"
              >
                Create Room
              </button>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {['Sara\'s Room', 'jawad\'s Room', 'Jack\'s Room', 'jobidn\'s Room'].map((room, index) => (
                <div key={index} className="flex-shrink-0 w-48 bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                  <div className="bg-gray-300 dark:bg-gray-600 h-40 rounded-lg mb-4 flex items-center justify-center">
                    <PlayIcon className="h-12 w-12 text-gray-500" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold truncate text-gray-900 dark:text-white">{room}</span>
                    <div className="flex space-x-3">
                      <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full p-2 shadow hover:from-orange-600 hover:to-amber-600 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full p-2 shadow hover:from-blue-600 hover:to-indigo-600 transition">
                        <MessageIcon className="w-4 h-4" />
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
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                    <div className="flex items-start">
                      <img
                        src="https://via.placeholder.com/40x40"
                        alt={post.author}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">{post.author}</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                        </div>
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
                            <p className="text-sm text-gray-700 dark:text-gray-300">{post.content}</p>
                          </CensoredPostWrapper>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center mt-4 space-x-4 text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center text-base font-medium group transition ${post.isLiked ? 'text-orange-500' : 'hover:text-orange-500'}`}
                      >
                        <div className={`p-2 rounded-full transition mr-2 ${post.isLiked ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100'}`}>
                          <HeartIcon className="h-4 w-4" />
                        </div>
                        <span>{post.likes}</span>
                      </button>
                      <button
                        onClick={() => handleReply(post.id)}
                        className="flex items-center text-base font-medium hover:text-orange-500 group"
                      >
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 transition mr-2">
                          <MessageIcon className="h-4 w-4" />
                        </div>
                        <span>{post.comments}</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/forum/post/${post.id}`);
                          showToast('Link copied to clipboard!', 'success');
                        }}
                        className="flex items-center text-base font-medium hover:text-orange-500 group"
                      >
                        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 transition mr-2">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </div>
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="flex items-center text-base font-medium hover:text-red-500 group ml-auto"
                      >
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={() => handleReport(post.id)}
                        className="flex items-center text-base font-medium hover:text-yellow-500 group ml-4"
                      >
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              ))}

              {/* Removed the Load More button as requested - Forum page is now an infinite scroll */}
            </div>
          )}
        </div>

        {/* Right Column (Social Discovery & Sidebar Widgets) */}
        <div className="w-80 flex-shrink-0 hidden lg:block pl-8">
          <div className="sticky top-32 space-y-4">
            {/* Groups Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Groups</h3>
              <div className="space-y-4">
                {[
                  { name: 'Good Group', unread: 3 },
                  { name: 'E-course Group', unread: 0 },
                  { name: 'Tech Enthusiasts', unread: 12 }
                ].map((group, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-bold text-base text-gray-900 dark:text-white">{group.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">View feed</div>
                    </div>
                    {group.unread > 0 && (
                      <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow">
                        {group.unread}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hallmarks Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Hallmarks</h3>
              <div className="space-y-4">
                <div className="flex items-center py-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">Verified Account</span>
                </div>
                <div className="flex items-center py-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">Community Leader</span>
                </div>
                <div className="flex items-center py-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300">Top Contributor</span>
                </div>
              </div>
            </div>

            {/* Storefront Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Storefront</h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
                <div className="bg-gray-300 dark:bg-gray-600 h-20 rounded-lg mb-4"></div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">Digital Products</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Latest items</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Sales: 125</p>
              </div>
              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition mt-4 text-base font-medium shadow">
                View Store
              </button>
            </div>

            {/* Suggested Photocredit Widget */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Suggested Photocredit</h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <div className="bg-gray-300 dark:bg-gray-600 h-20 rounded-lg mb-4"></div>
                <h4 className="font-bold text-base text-gray-900 dark:text-white">Photo Credits</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">@photographer</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Available: 50</p>
              </div>
              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-lg hover:from-orange-600 hover:to-amber-600 transition text-base font-medium shadow">
                Buy Credits
              </button>
              <div className="flex justify-center mt-4 space-x-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-2 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Lumina Widget */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
              <h3 className="font-bold text-lg mb-4">Lumina?</h3>
              <p className="text-sm opacity-90 mb-4">AI Assistant for instant answers</p>
              <button className="w-full bg-white text-blue-600 py-4 rounded-lg font-bold text-base hover:bg-gray-100 transition shadow">
                Ask a question
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button className="bg-orange-500 text-white rounded-full p-4 shadow-lg hover:from-orange-600 hover:to-amber-600 transition relative group">
          <MessageIcon className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow group-hover:scale-110 transition-transform">07</span>
        </button>
      </div>

      {/* Bottom Right Canary Ads Tab 1 */}
      <div className="fixed bottom-16 right-0 h-16 w-80 bg-crystalline-white-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center z-40">
        <div className="text-center text-base font-medium text-gray-600 dark:text-gray-400">
          Canary Ads Tab 1
        </div>
      </div>

      {/* Bottom Right Canary Ads Tab 2 */}
      <div className="fixed bottom-16 right-80 h-16 w-80 bg-crystalline-white-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center z-40">
        <div className="text-center text-base font-medium text-gray-600 dark:text-gray-400">
          Canary Ads Tab 2
        </div>
      </div>

      {/* Bottom Google Adsense Ads Tab */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-crystalline-white-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center z-40">
        <div className="text-center text-base font-medium text-gray-600 dark:text-gray-400">
          Google Adsense Content Here
        </div>
      </div>

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
    </div>
  );
};

export default ForumPage;





















