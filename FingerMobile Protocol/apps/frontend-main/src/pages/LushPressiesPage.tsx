import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import LushPinGateModal from '../components/verification/LushPinGateModal';
import LushProfileSidebar, {
  LushUserProfile,
} from '../components/lush/LushProfileSidebar';
import LushForumFeed, { LushPostItem } from '../components/lush/LushForumFeed';
import LushDiscoverySidebar, {
  ActiveMatchItem,
} from '../components/lush/LushDiscoverySidebar';
import LapidaireQuestionModal from '../components/LapidaireQuestionModal';
import MatchingPreferencesForm from '../components/MatchingPreferencesForm';
import LushPlushiesCatalog, {
  LushGiftProduct,
} from '../components/LushPlushiesCatalog';
import LushPlushiesGiftCheckoutModal from '../components/lush/LushPlushiesGiftCheckoutModal';
import GamificationDashboard from '../components/GamificationDashboard';
import HeatmapView from '../components/HeatmapView';
import { CommitProgressTracker } from '../components/CommitProgressTracker';
import { LushCallModal } from '../components/LushCallModal';
import { LushMatch } from '../hooks/useLushMatching';
import { CallSession } from '../hooks/useLushCall';
import {
  SparklesIcon,
  XMarkIcon,
  GiftIcon,
  UserIcon,
  KeyIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { LushChatPanel } from '../components/LushChatPanel';
import voiceLineServiceInstance from '../services/VoiceLineService';
import LushEditProfileModal from '../components/lush/LushEditProfileModal';
import LushMemberProfileModal from '../components/lush/LushMemberProfileModal';
import LushPinPackagesModal, {
  PinQuotaInfo,
} from '../components/lush/LushPinPackagesModal';
import userProfileSyncService from '../services/UserProfileSyncService';
import ConnectWidget from '../components/widgets/ConnectWidget';
import DiscoverWidget from '../components/widgets/DiscoverWidget';
import PlatformWidgetsAndAdsRail from '../components/widgets/PlatformWidgetsAndAdsRail';

const getInitialLushProfile = (): LushUserProfile => {
  const synced = userProfileSyncService.getProfile();
  return {
    id: synced.id || '00000000-0000-0000-0000-000000000001',
    name: synced.name || 'Obinna Mbah (Founder & SuperAdmin)',
    username: synced.username || 'israelobinna',
    headline: synced.headline || 'Founder & Lead Sovereign Architect',
    bio: synced.bio || 'Curating luxury African contemporary art & exploring meaningful connections.',
    location: synced.location || 'Lagos, Nigeria',
    avatar: synced.avatar || '/assets/branding/mbah_israel_obinna.jpeg',
    coverImage: synced.coverImage || '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
    verificationLevel: 3,
    lushCoins: synced.ficBalance || 1250,
    streakDays: 42,
    level: 5,
    xpCurrent: 2450,
    xpMax: 3000,
    matchingIntent: 'Unique Social Experience',
    isIncognito: false,
    pinNumber: synced.pinNumber || '749822',
    isRadiating: true,
  };
};

const DEFAULT_PROFILE: LushUserProfile = getInitialLushProfile();

const INITIAL_POSTS: LushPostItem[] = [
  {
    id: 'lush-post-1',
    author: {
      id: 'usr-chidinma',
      name: 'Chidinma Okafor',
      username: 'chidinma_curates',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      verificationLevel: 3,
      intentTag: 'Meaningful Romance',
    },
    content: 'Art isn’t meant to be consumed in haste—it demands reverence. Enjoying the serene breeze at Victoria Island while drafting my latest gallery review.',
    timestamp: '20 minutes ago',
    likesCount: 142,
    commentsCount: 19,
    giftsCount: 8,
    isLiked: false,
    isBookmarked: false,
    lapidaireQuestion: 'What is your idea of a truly transcendent evening?',
    lapidaireCategory: 'Lifestyle & Romance',
    mediaUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800',
    mediaType: 'image',
    giftAttachment: {
      name: 'Handcrafted Obsidian Rose',
      imageUrl: '/assets/branding/gem_stone_icon.png',
      price: 50,
    },
  },
  {
    id: 'lush-post-2',
    author: {
      id: 'usr-kofi',
      name: 'Kofi Mensah',
      username: 'kofi_lux',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      verificationLevel: 2,
      intentTag: 'Exclusive Intellectual Dialogue',
    },
    content: 'True luxury is peace of mind and sovereign digital ownership. A heartfelt thank you to everyone who sent Lush plushies this week!',
    timestamp: '1 hour ago',
    likesCount: 89,
    commentsCount: 12,
    giftsCount: 5,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: 'lush-post-3',
    author: {
      id: 'usr-amina',
      name: 'Amina Bello',
      username: 'amina_bello',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      verificationLevel: 3,
      intentTag: 'Fine Dining & Cultural Travel',
    },
    content: 'Planning an architectural walk through old Lagos Island this Saturday. Seeking companions with an eye for mid-century colonial and post-independence facades.',
    timestamp: '3 hours ago',
    likesCount: 215,
    commentsCount: 34,
    giftsCount: 14,
    isLiked: true,
    isBookmarked: false,
    lapidaireQuestion: 'What historic period most captivates your imagination?',
    lapidaireCategory: 'Culture & Heritage',
  },
];

interface LushApiPost {
  id?: string | number;
  author_id?: string | number;
  author_username?: string;
  author_name?: string;
  author_avatar?: string;
  content?: string;
  created_at?: string;
  timestamp?: string;
  likesCount?: number;
  likes_count?: number;
  commentsCount?: number;
  comments_count?: number;
  giftsCount?: number;
  gifts_count?: number;
  isLiked?: boolean;
  is_liked?: boolean;
  isBookmarked?: boolean;
  is_bookmarked?: boolean;
  lapidaireQuestion?: string;
  lapidaire_question?: string;
  lapidaireCategory?: string;
  lapidaire_category?: string;
  mediaUrl?: string;
  media_url?: string;
  mediaType?: 'image' | 'video';
  media_type?: 'image' | 'video';
  comments?: LushPostItem['comments'];
}

const mapLushPost = (
  post: LushApiPost,
  fallbackAuthor?: LushPostItem['author']
): LushPostItem | null => {
  if (post.id == null) return null;
  const username = post.author_username || fallbackAuthor?.username || 'member';
  return {
    id: String(post.id),
    author: {
      id: String(post.author_id ?? fallbackAuthor?.id ?? ''),
      name: post.author_name || fallbackAuthor?.name || username,
      username,
      avatar: post.author_avatar || fallbackAuthor?.avatar || '',
      verificationLevel: fallbackAuthor?.verificationLevel || 0,
      intentTag: fallbackAuthor?.intentTag || '',
    },
    content: post.content || '',
    timestamp: post.created_at || post.timestamp || '',
    likesCount: Number(post.likesCount ?? post.likes_count ?? 0),
    commentsCount: Number(post.commentsCount ?? post.comments_count ?? 0),
    giftsCount: Number(post.giftsCount ?? post.gifts_count ?? 0),
    isLiked: Boolean(post.isLiked ?? post.is_liked),
    isBookmarked: Boolean(post.isBookmarked ?? post.is_bookmarked),
    lapidaireQuestion: post.lapidaireQuestion || post.lapidaire_question,
    lapidaireCategory: post.lapidaireCategory || post.lapidaire_category,
    mediaUrl: post.mediaUrl || post.media_url,
    mediaType: post.mediaType || post.media_type,
    comments: post.comments || [],
  };
};

export const LushPressiesPage: React.FC = () => {
  const navigate = useNavigate();

  // 1. PIN & Consent State
  const [hasConsent, setHasConsent] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lush_pressies_consent') === 'true';
    } catch {
      return false;
    }
  });
  const [showPinModal, setShowPinModal] = useState<boolean>(!hasConsent);

  // 2. User & Feed State
  const [userProfile, setUserProfile] =
    useState<LushUserProfile>(DEFAULT_PROFILE);
  const [feedPosts, setFeedPosts] = useState<LushPostItem[]>(INITIAL_POSTS);
  const [activeFeedTab, setActiveFeedTab] = useState<string>('feed');
  const [matches, setMatches] = useState<ActiveMatchItem[]>([]);

  // 6-Digit PIN Quota state (allocated 50 generations upon signup)
  const [pinQuota, setPinQuota] = useState<PinQuotaInfo>({
    totalAllocated: 0,
    generationsUsed: 0,
    generationsRemaining: 0,
    isUnlimited: false,
  });

  // 3. Modals State
  const [showEditProfileModal, setShowEditProfileModal] =
    useState<boolean>(false);
  const [showPreferencesModal, setShowPreferencesModal] =
    useState<boolean>(false);
  const [showLapidaireModal, setShowLapidaireModal] =
    useState<boolean>(false);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [selectedGiftProduct, setSelectedGiftProduct] =
    useState<LushGiftProduct | null>(null);
  const [targetGiftRecipient, setTargetGiftRecipient] = useState<{
    id: string | number;
    name: string;
    username?: string;
    avatar?: string;
    postId?: string;
  } | null>(null);
  const [showGiftCheckoutModal, setShowGiftCheckoutModal] =
    useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };
  const [showGamificationModal, setShowGamificationModal] =
    useState<boolean>(false);
  const [showHeatmapModal, setShowHeatmapModal] = useState<boolean>(false);
  const [showCommitModal, setShowCommitModal] = useState<boolean>(false);
  const [selectedCommitMatch, setSelectedCommitMatch] =
    useState<LushMatch | null>(null);
  const [activeCallSession, setActiveCallSession] =
    useState<CallSession | null>(null);
  const [activeChatMember, setActiveChatMember] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [selectedMemberProfile, setSelectedMemberProfile] =
    useState<ActiveMatchItem | null>(null);
  const [showMemberProfileModal, setShowMemberProfileModal] =
    useState<boolean>(false);
  const [showPinPackagesModal, setShowPinPackagesModal] =
    useState<boolean>(false);

  // Mobile layout tab switcher state ('feed' | 'discover' | 'profile')
  const [mobileTab, setMobileTab] = useState<'feed' | 'discover' | 'profile'>('feed');
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    try {
      return Boolean(
        localStorage.getItem('onboardingComplete') === 'true' ||
        localStorage.getItem('hasCompletedOnboarding') === 'true'
      );
    } catch {
      return false;
    }
  });

  // Load backend profile, posts & PIN quota if available
  useEffect(() => {
    let isMounted = true;
    const loadLushData = async () => {
      const [postsRes, profileRes, quotaRes, matchesRes] = await Promise.allSettled([
        apiService.get('/lushpressies/posts'),
        apiService.get('/lushpressies/profile'),
        apiService.get('/lushpressies/pins/quota'),
        apiService.get('/lushpressies/matches'),
      ]);

      if (!isMounted) return;
      const failures: string[] = [];
      if (postsRes.status === 'fulfilled') {
        const response = postsRes.value;
        const rows = response?.data?.data ?? response?.data ?? response;
        if (Array.isArray(rows) && rows.length > 0) {
          const posts = rows.map((post: LushApiPost) => mapLushPost(post));
          const validPosts = posts.filter((post): post is LushPostItem => post !== null);
          if (validPosts.length > 0) {
            setFeedPosts(validPosts);
          }
        }
      }

      if (profileRes.status === 'fulfilled') {
        const response = profileRes.value;
        const profile = response?.data?.data ?? response?.data;
        if (profile && typeof profile === 'object') {
          setUserProfile((prev) => ({ ...prev, ...profile }));
        } else {
          failures.push('profile returned an invalid response');
        }
      } else if (profileRes.status === 'rejected') {
        failures.push('profile could not be loaded');
      }

      if (quotaRes.status === 'fulfilled') {
        const response = quotaRes.value;
        const quota = response?.data?.data ?? response?.data;
        if (quota && typeof quota === 'object') {
          setPinQuota({
            totalAllocated: quota.total_allocated ?? quota.totalAllocated ?? 0,
            generationsUsed: quota.generations_used ?? quota.generationsUsed ?? 0,
            generationsRemaining: quota.generations_remaining ?? quota.generationsRemaining ?? 0,
            isUnlimited: Boolean(quota.is_unlimited ?? quota.isUnlimited),
          });
        } else {
          failures.push('PIN quota returned an invalid response');
        }
      } else if (quotaRes.status === 'rejected') {
        failures.push('PIN quota could not be loaded');
      }

      if (matchesRes.status === 'fulfilled') {
        const response = matchesRes.value;
        const rows = response?.data?.matches ?? response?.matches;
        if (Array.isArray(rows)) {
          setMatches(rows.map((match) => ({
            id: String(match.target_user_id),
            name: match.name || '',
            avatar: match.avatar || '',
            compatibilityScore: Number(match.compatibility_score ?? 0),
            lastMessage: match.last_message || '',
            isOnline: false,
            hasUnread: false,
            pinExchanged: Boolean(match.pin_exchanged),
            bio: match.bio || '',
            headline: match.headline || '',
            location: match.location || '',
          })));
        } else {
          setMatches([]);
          failures.push('matches returned an invalid list');
        }
      } else {
        setMatches([]);
        failures.push('matches could not be loaded');
      }

      if (failures.length) showToast(`LushPressies: ${failures.join('; ')}.`);
    };

    void loadLushData().catch((error: unknown) => {
      if (!isMounted) return;
      setFeedPosts([]);
      showToast(error instanceof Error ? error.message : 'Unable to load LushPressies data.');
    });
    // Synchronize live with UserProfileSyncService
    const unsubscribe = userProfileSyncService.subscribe((synced) => {
      if (!isMounted) return;
      setUserProfile((prev) => ({
        ...prev,
        id: synced.id || prev.id,
        name: synced.name || prev.name,
        username: synced.username || prev.username,
        headline: synced.headline || prev.headline,
        location: synced.location || prev.location,
        avatar: synced.avatar || prev.avatar,
        coverImage: synced.coverImage || prev.coverImage,
        bio: synced.bio || prev.bio,
        lushCoins: synced.ficBalance || prev.lushCoins,
        pinNumber: synced.pinNumber || prev.pinNumber,
      }));
      setIsOnboarded(Boolean(
        localStorage.getItem('onboardingComplete') === 'true' ||
        localStorage.getItem('hasCompletedOnboarding') === 'true'
      ));
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Handlers
  const handleOpenMemberProfile = (match: ActiveMatchItem) => {
    setSelectedMemberProfile(match);
    setShowMemberProfileModal(true);
  };

  const handleRevokePin = async (memberId: string) => {
    // 1. Immediately update local state to locked
    setMatches((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, pinExchanged: false } : m))
    );

    // 2. Lock current opened modal if inspecting this member
    if (selectedMemberProfile?.id === memberId) {
      setSelectedMemberProfile((prev) =>
        prev ? { ...prev, pinExchanged: false } : null
      );
    }

    try {
      await apiService.post('/lushpressies/pins/revoke', {
        targetUserId: memberId,
        reason: 'Connection closed by mutual choice',
      });
    } catch {
      // Local state already updated
    }
  };

  const handleExchangePin = async (memberId: string) => {
    const targetMatch = matches.find((m) => m.id === memberId);
    if (!targetMatch) return;

    // Check quota
    if (!pinQuota.isUnlimited && pinQuota.generationsRemaining <= 0) {
      setShowPinPackagesModal(true);
      return;
    }

    // Decrement quota and unlock
    setPinQuota((prev) => ({
      ...prev,
      generationsRemaining: prev.isUnlimited
        ? prev.generationsRemaining
        : Math.max(0, prev.generationsRemaining - 1),
      generationsUsed: prev.generationsUsed + 1,
    }));

    setMatches((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, pinExchanged: true } : m))
    );

    const updatedMatch = { ...targetMatch, pinExchanged: true };
    setSelectedMemberProfile(updatedMatch);
    setShowMemberProfileModal(true);

    try {
      await apiService.post('/lushpressies/pins/exchange', {
        targetUserId: memberId,
        pin: '839201',
      });
    } catch {
      // Local state already updated
    }
  };

  const handlePackagePurchased = (newQuota: PinQuotaInfo) => {
    setPinQuota(newQuota);
  };

  const handleConsentSuccess = (pin: string) => {
    try {
      localStorage.setItem('lush_pressies_consent', 'true');
      localStorage.setItem('lush_pressies_user_pin', pin);
    } catch {
      // Local storage fallback
    }
    setHasConsent(true);
    setShowPinModal(false);
  };

  const handleSaveProfile = async (updated: Partial<LushUserProfile>) => {
    // 1. Optimistically update local profile card immediately
    setUserProfile((prev) => ({ ...prev, ...updated }));

    // 2. Broadcast to unified UserProfileSyncService so all cards & drawers sync
    userProfileSyncService.updateProfile({
      name: updated.name,
      avatar: updated.avatar,
      headline: updated.headline,
      bio: updated.bio,
      location: updated.location,
      coverImage: updated.coverImage,
    });

    try {
      const payload = {
        ...updated,
        userId: userProfile.id || '00000000-0000-0000-0000-000000000001',
      };
      const response = await apiService.put('/lushpressies/profile', payload);
      const profile = response?.data?.data ?? response?.data;
      if (profile && typeof profile === 'object' && profile.id) {
        setUserProfile((prev) => ({ ...prev, ...profile }));
      }
      showToast('Profile changes saved & published live.');
    } catch (error) {
      // Local state and UserProfileSyncService are preserved
      showToast(error instanceof Error ? error.message : 'Profile changes updated locally.');
    }
  };

  const handleToggleIncognito = () => {
    void handleSaveProfile({ isIncognito: !userProfile.isIncognito });
  };

  const handleToggleRadiate = () => {
    void handleSaveProfile({ isRadiating: !userProfile.isRadiating });
  };

  const handleLikePost = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    voiceLineServiceInstance.playCommentaryVoiceLine('lushpressies');
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            authorName: userProfile.name,
            authorAvatar: userProfile.avatar,
            text,
            timestamp: 'Just now',
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = async (
    content: string,
    lapidaire?: string,
    mediaUrl?: string
  ): Promise<void> => {
    const response = await apiService.post('/lushpressies/posts', {
      content,
      category: lapidaire ? 'lapidaire' : 'general',
      mediaUrl,
      tags: [],
    });
    const createdPost = response?.data?.data ?? response?.data ?? response;
    const post = mapLushPost(createdPost, {
      id: String(createdPost?.author_id ?? ''),
      name: 'LushPressies Member',
      username: 'member',
      avatar: '',
      verificationLevel: 0,
      intentTag: '',
    });
    if (!post) throw new Error('The LushPressies API did not return the created post.');
    post.lapidaireQuestion = lapidaire;
    post.lapidaireCategory = lapidaire ? '30 Dating Questions' : undefined;
    setFeedPosts((prev) => [post, ...prev]);
    voiceLineServiceInstance.playCommentaryVoiceLine('lushpressies');
  };

  const handleBookmarkPost = (postId: string) => {
    setFeedPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            isBookmarked: !p.isBookmarked,
          };
        }
        return p;
      })
    );
  };

  const handleSendGiftClick = (postId: string) => {
    const post = feedPosts.find((p: LushPostItem) => p.id === postId);
    if (post) {
      setTargetGiftRecipient({
        id: post.author?.id || '2',
        name: post.author?.name || 'Lush Member',
        username: post.author?.username,
        avatar: post.author?.avatar,
        postId: post.id,
      });
    } else {
      setTargetGiftRecipient({
        id: '2',
        name: 'Zainab Al-Mansoor',
        username: 'zainab_luxury',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        postId,
      });
    }
    setShowCatalogModal(true);
  };

  const handleOpenChat = (memberId: string, memberName?: string) => {
    if (memberId) {
      setActiveChatMember({ id: memberId, name: memberName || 'Lush Member' });
      setShowChatModal(true);
    }
  };

  const handleStartVideoCall = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    setActiveCallSession({
      id: `call_${Date.now()}`,
      callerId: 1,
      calleeId: match ? 2 : 3,
      callerName: userProfile.name,
      calleeName: match?.name || 'Taylor Swift',
      status: 'active',
      startTime: new Date().toISOString(),
    });
  };

  const handleOpenCommitTracker = (matchId?: string) => {
    const targetMatch = matches.find((m) => m.id === matchId) || matches[0];
    const lushMatch: LushMatch = {
      id: targetMatch?.id || 'm_01',
      userId: 'usr_lush_001',
      matchedWithId: targetMatch?.name || 'Taylor Swift',
      matchedAt: '2026-09-20',
      status: 'active',
      pin_exchanged: targetMatch?.pinExchanged ?? true,
      pin_exchange_date: '2026-09-21',
      commit_progress_days: 42,
      commit_status: 'active',
    };
    setSelectedCommitMatch(lushMatch);
    setShowCommitModal(true);
  };

  // Filter posts by channel tab
  const filteredPosts = feedPosts.filter((p) => {
    if (activeFeedTab === 'lapidaires' || activeFeedTab === 'lapidaires') {
      return Boolean(p.lapidaireQuestion);
    }
    if (activeFeedTab === 'gifts') {
      return Boolean(p.giftAttachment || p.giftsCount > 0);
    }
    if (activeFeedTab === 'trending') {
      return p.likesCount >= 50;
    }
    return true; // Default 'feed' shows all Lush-Pressies posts
  });

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastLushPostRef = useCallback(
    (node: Element | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && feedPosts.length > 0) {
          setFeedPosts((current) => {
            const nextIteration = Math.floor(current.length / 3) + 1;
            const newBatch: LushPostItem[] = current.slice(0, 3).map((p, idx) => ({
              ...p,
              id: `gen-lush-${nextIteration}-${idx}-${Date.now()}`,
              content: `${p.content} (Wave #${nextIteration} · Sovereign Gifting & Appreciation)`,
              likesCount: p.likesCount + Math.floor(Math.random() * 25) + 5,
              commentsCount: p.commentsCount + Math.floor(Math.random() * 8) + 1,
              giftsCount: p.giftsCount + Math.floor(Math.random() * 3),
            }));
            return [...current, ...newBatch];
          });
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [feedPosts.length]
  );

  return (
    <div className="min-h-screen bg-[#F5F9F6] text-gray-900 transition-colors w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      {/* Top Ambient Glow Banner */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-[#DC582A]" />

      {/* Brand Hero Header */}
      <div className={`max-w-[1536px] 2xl:max-w-[1680px] mx-auto pt-4 sm:pt-6 transition-all duration-300 ${
        isOnboarded ? 'pl-14 pr-3 sm:px-6 lg:px-8' : 'px-3 sm:px-6 lg:px-8'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-900 border border-emerald-400/30 p-1 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              <img src="/assets/logos/lushpressies_logo.png" alt="Lush Pressies" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Lush Pressies</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                  Gifting & Appreciation
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium line-clamp-1 sm:line-clamp-none">
                Sovereign luxury gifting, Lapidaire social exchange & authentic tokenized connections.
              </p>
            </div>
          </div>

          {/* Quick Header Actions for Mobile & Desktop */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => setShowCatalogModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-[#DC582A] text-xs font-bold border border-orange-200 transition shrink-0 min-h-[38px]"
              title="Open Plushies Gift Shop"
            >
              <GiftIcon className="w-4 h-4 text-[#DC582A]" />
              <span>Gift Shop</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPinPackagesModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 text-xs font-bold border border-emerald-300 transition shrink-0 min-h-[38px]"
              title="Manage 6-Digit Consent PIN Quota"
            >
              <KeyIcon className="w-4 h-4 text-emerald-600" />
              <span>PIN: {pinQuota.isUnlimited ? '∞' : `${pinQuota.generationsRemaining} Left`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column LinkedIn-Style Layout Container */}
      <main className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-8">
        {/* Mobile View Switcher Tabs (3-way segment: Feed, Discover, Profile) */}
        <div className="lg:hidden flex items-center p-1 bg-white border border-slate-200 rounded-2xl shadow-xs mb-4 gap-1">
          <button
            type="button"
            onClick={() => setMobileTab('feed')}
            className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'feed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <GiftIcon className="w-4 h-4" />
            <span>Feed & Gifts</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('discover')}
            className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'discover'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Discover ({matches.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('profile')}
            className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile & Perks</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (3 cols): User Profile, Gamification, Fast Navigation */}
          <div className={`lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pr-1 ${
            mobileTab === 'profile' ? 'block' : 'hidden lg:block'
          }`}>
            <LushProfileSidebar
              user={userProfile}
              activeFeedTab={activeFeedTab}
              pinQuota={pinQuota}
              onSelectFeedTab={setActiveFeedTab}
              onToggleIncognito={handleToggleIncognito}
              onToggleRadiate={handleToggleRadiate}
              onOpenPreferences={() => setShowPreferencesModal(true)}
              onOpenPinModal={() => setShowPinModal(true)}
              onOpenGamification={() => setShowGamificationModal(true)}
              onOpenHeatmap={() => setShowHeatmapModal(true)}
              onOpenCommitTracker={() => handleOpenCommitTracker()}
              onOpenEditProfile={() => setShowEditProfileModal(true)}
              onOpenPinPackages={() => setShowPinPackagesModal(true)}
            />

            {/* Left Column Last 2 Widgets: Connect & Discover (MANDATORY - NEVER ON RIGHT) */}
            <ConnectWidget pageContext="lushpressies" />
            <DiscoverWidget pageContext="lushpressies" />
          </div>

          {/* Center Column (6 cols): Forum Post Card Feed on #F5F9F6 */}
          <div className={`lg:col-span-6 space-y-4 ${
            mobileTab === 'feed' ? 'block' : 'hidden lg:block'
          }`}>
            <LushForumFeed
              posts={filteredPosts}
              activeTab={activeFeedTab}
              onTabChange={setActiveFeedTab}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onSendGiftClick={handleSendGiftClick}
              onOpenLapidaireModal={() => setShowLapidaireModal(true)}
              onCreatePost={handleCreatePost}
              onOpenChat={handleOpenChat}
              onBookmarkPost={handleBookmarkPost}
            />

            {/* Continuous Stream Sentinel (No End, Keeps Loading More UGC/Gifts) */}
            {feedPosts.length > 0 && (
              <div ref={lastLushPostRef} className="py-4 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-950 text-xs font-bold border border-emerald-400 shadow-xs">
                  <SparklesIcon className="w-4 h-4 text-emerald-600 animate-spin" />
                  Streaming authentic sovereign gifting &amp; connections...
                </div>
              </div>
            )}
          </div>

          {/* Right Column (3 cols): Swipe Deck, Daily Question, Plushies Shop, Matches */}
          <div className={`lg:col-span-3 lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto space-y-4 scrollbar-none pl-1 ${
            mobileTab === 'discover' ? 'block' : 'hidden lg:block'
          }`}>
            <LushDiscoverySidebar
              userId={1}
              matches={matches}
              pinQuota={pinQuota}
              onOpenCatalog={() => setShowCatalogModal(true)}
              onOpenLapidaireModal={() => setShowLapidaireModal(true)}
              onOpenChat={handleOpenChat}
              onStartVideoCall={handleStartVideoCall}
              onOpenCommitTracker={(matchId) =>
                handleOpenCommitTracker(matchId)
              }
              onOpenPinPackages={() => setShowPinPackagesModal(true)}
              onOpenMemberProfile={handleOpenMemberProfile}
              onRevokePin={handleRevokePin}
              onExchangePin={handleExchangePin}
              onReverseSwipe={() => {
                alert('Rewind used! Last profile returned to deck.');
              }}
            />

            {/* Platform Streaming Widgets and Canary Ads */}
            <PlatformWidgetsAndAdsRail pageContext="lushpressies" />
          </div>
        </div>
      </main>

      {/* 4. PIN & Sovereign Consent Gate Modal */}
      <LushPinGateModal
        isOpen={showPinModal}
        onConsentSuccess={handleConsentSuccess}
        onClose={hasConsent ? () => setShowPinModal(false) : undefined}
      />

      {/* 5. Matching Preferences Modal */}
      {showPreferencesModal && (
        <MatchingPreferencesForm
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          onSave={async (profile) => {
            if (profile?.matching_intents?.[0]) {
              await handleSaveProfile({ matchingIntent: profile.matching_intents[0] });
            }
            setShowPreferencesModal(false);
          }}
        />
      )}

      {/* 5.5. Edit VIP Profile Modal */}
      <LushEditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        user={userProfile}
        onSave={handleSaveProfile}
      />

      {/* 5.6. Unlocked Member Profile Modal */}
      <LushMemberProfileModal
        isOpen={showMemberProfileModal}
        onClose={() => setShowMemberProfileModal(false)}
        member={selectedMemberProfile}
        onRevokePin={handleRevokePin}
        onOpenChat={(memberId, memberName) =>
          handleOpenChat(memberId, memberName)
        }
        onStartVideoCall={handleStartVideoCall}
        onSendGift={() => setShowCatalogModal(true)}
      />

      {/* 5.7. 6-Digit PIN Packages & Quota Dashboard Modal */}
      <LushPinPackagesModal
        isOpen={showPinPackagesModal}
        onClose={() => setShowPinPackagesModal(false)}
        quota={pinQuota}
        userFicBalance={userProfile.lushCoins}
        onPackagePurchased={handlePackagePurchased}
      />

      {/* 6. 30 Comprehensive Lapidaire Questions Modal */}
      <LapidaireQuestionModal
        isOpen={showLapidaireModal}
        onClose={() => setShowLapidaireModal(false)}
        onComplete={() => setShowLapidaireModal(false)}
      />

      {/* 7. Lush Plushies Luxury Gift Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-[#DC582A]" />
                <h2 className="text-xl font-bold text-gray-900">
                  Lush Plushies Luxury Gift Catalog
                </h2>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setShowCatalogModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-slate-700 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <LushPlushiesCatalog
              userId={userProfile.id}
              onGiftSelect={(product) => {
                setSelectedGiftProduct(product);
                setShowCatalogModal(false);
                setShowGiftCheckoutModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 7b. Lush Escrow Gift Checkout Modal */}
      <LushPlushiesGiftCheckoutModal
        isOpen={showGiftCheckoutModal}
        product={selectedGiftProduct}
        recipient={targetGiftRecipient}
        availableRecipients={[
          {
            id: '2',
            name: 'Zainab Al-Mansoor',
            username: 'zainab_luxury',
            avatar:
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          },
          {
            id: 'usr_02',
            name: 'Nia Adebayo',
            username: 'nia_music',
            avatar:
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
          },
          {
            id: 'usr_03',
            name: 'Kofi Mensah',
            username: 'kofi_art',
            avatar:
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
          },
        ]}
        userFicBalance={userProfile.lushCoins || 1000}
        onClose={() => {
          setShowGiftCheckoutModal(false);
          setSelectedGiftProduct(null);
        }}
        onGiftSent={(giftData) => {
          setShowGiftCheckoutModal(false);
          setSelectedGiftProduct(null);
          // Deduct coins locally
          setUserProfile((prev) => ({
            ...prev,
            lushCoins: Math.max(0, (prev.lushCoins || 1000) - giftData.cost),
          }));
          // If associated with a post, attach gift banner to the post
          if (targetGiftRecipient?.postId) {
            setFeedPosts((prevPosts: LushPostItem[]) =>
              prevPosts.map((p: LushPostItem) => {
                if (p.id === targetGiftRecipient.postId) {
                  return {
                    ...p,
                    giftsCount: (p.giftsCount || 0) + 1,
                    comments: [
                      ...(p.comments || []),
                      {
                        id: `c_${Date.now()}`,
                        authorName: userProfile.name,
                        authorAvatar: userProfile.avatar,
                        text: `🎁 Sent ${giftData.product.product_name} (${giftData.cost} FIC) via Escrow! ${
                          giftData.cardMessage ? `"${giftData.cardMessage}"` : ''
                        }`,
                        timestamp: 'Just now',
                      },
                    ],
                  };
                }
                return p;
              })
            );
          }
          showToast(
            `🎁 Gift Dispatched! ${giftData.product.product_name} (${giftData.cost} FIC) successfully sent to ${giftData.recipientName} via secure FIC Escrow!`
          );
        }}
      />

      {/* 8. Gamification Dashboard Modal */}
      {showGamificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-[#DC582A]" />
                <h2 className="text-xl font-bold text-gray-900">
                  Lush Gamification, Streaks & Leaderboard
                </h2>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setShowGamificationModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-slate-700 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <GamificationDashboard />
          </div>
        </div>
      )}

      {/* 9. Activity Heatmap Modal */}
      {showHeatmapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-6 h-6 text-emerald-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Member Activity Heatmap & Peak Hours
                </h2>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setShowHeatmapModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-slate-700 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <HeatmapView />
          </div>
        </div>
      )}

      {/* 10. 5-Month Commitment Milestone Modal */}
      {showCommitModal && selectedCommitMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💍</span>
                <h2 className="text-xl font-bold text-gray-900">
                  5-Month Commitment Milestone
                </h2>
              </div>
              <button type="button" aria-label="Close"
                onClick={() => setShowCommitModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-slate-700 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <CommitProgressTracker
              match={selectedCommitMatch}
              onRequestCommit={(matchId) => {
                alert(
                  `Commitment requested for match ${matchId}! Status set to pending.`
                );
                setSelectedCommitMatch((prev) =>
                  prev ? { ...prev, commit_status: 'pending' } : null
                );
              }}
              onBreakCommit={(commitId) => {
                if (
                  window.confirm(
                    'Are you sure you want to dissolve this commitment milestone?'
                  )
                ) {
                  alert(`Commitment ${commitId} has been dissolved.`);
                  setSelectedCommitMatch((prev) =>
                    prev ? { ...prev, commit_status: 'none' } : null
                  );
                }
              }}
            />
          </div>
        </div>
      )}

      {/* 11. WebRTC Audio/Video Call Modal */}
      {activeCallSession && (
        <LushCallModal
          activeCall={activeCallSession}
          onAnswer={() => {
            setActiveCallSession((prev) =>
              prev ? { ...prev, status: 'active' } : null
            );
          }}
          onEnd={() => {
            setActiveCallSession(null);
          }}
          currentUserId={1}
        />
      )}

      {/* 12. Sovereign In-App Encrypted Chat Modal */}
      {showChatModal && activeChatMember && (
        <div
          onClick={() => setShowChatModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-2xl w-full h-[650px] max-h-[90vh] overflow-hidden flex flex-col relative"
          >
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-700/60 flex items-center justify-center font-bold text-base border border-emerald-400">
                  {activeChatMember.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold">
                      {activeChatMember.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                      Sovereign E2EE
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200">
                    Encrypted Direct Line · Mutual PIN Protected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/messages')}
                  className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                  title="Expand to Full Messages Page"
                >
                  Full Screen
                </button>
                <button
                  type="button"
                  onClick={() => setShowChatModal(false)}
                  aria-label="Close Chat Modal"
                  className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <LushChatPanel
                initialConversationId={activeChatMember.id}
                onClose={() => setShowChatModal(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Escrow Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-slideDown max-w-md">
          <span className="text-xl">🎁</span>
          <p className="text-xs font-semibold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* Sovereign Floating Mobile Quick Dock (Mobile only, with iOS safe-area support) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 pt-2 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)] shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-around">
          <button
            type="button"
            onClick={() => {
              setMobileTab('feed');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 min-h-[44px] min-w-[44px] justify-center text-[10px] font-bold transition ${
              mobileTab === 'feed' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GiftIcon className="w-5 h-5" />
            <span>Feed</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileTab('discover');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 min-h-[44px] min-w-[44px] justify-center text-[10px] font-bold transition relative ${
              mobileTab === 'discover' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SparklesIcon className="w-5 h-5" />
            <span>Discover</span>
            {matches.length > 0 && (
              <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowCatalogModal(true)}
            className="flex flex-col items-center gap-1 min-h-[44px] min-w-[44px] justify-center text-[10px] font-bold text-[#DC582A] hover:text-orange-700 transition"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            <span>Gifts</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPinPackagesModal(true)}
            className="flex flex-col items-center gap-1 min-h-[44px] min-w-[44px] justify-center text-[10px] font-bold text-emerald-800 hover:text-emerald-950 transition"
          >
            <KeyIcon className="w-5 h-5" />
            <span>PINs</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileTab('profile');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1 min-h-[44px] min-w-[44px] justify-center text-[10px] font-bold transition ${
              mobileTab === 'profile' ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserIcon className="w-5 h-5" />
            <span>Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LushPressiesPage;
