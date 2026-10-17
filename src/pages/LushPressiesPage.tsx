import React, { useState, useEffect } from 'react';
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
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LushChatPanel } from '../components/LushChatPanel';
import voiceLineServiceInstance from '../services/VoiceLineService';
import LushEditProfileModal from '../components/lush/LushEditProfileModal';
import LushMemberProfileModal from '../components/lush/LushMemberProfileModal';
import LushPinPackagesModal, {
  PinQuotaInfo,
} from '../components/lush/LushPinPackagesModal';

const DEFAULT_PROFILE: LushUserProfile = {
  id: 'usr_lush_001',
  name: 'Alexandria Chen',
  username: 'alex_lush',
  headline: 'Curator & Creative Director | Seeking Empathetic Connection',
  location: 'Lagos, Nigeria & Virtual Spaces',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  coverImage:
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200',
  verificationLevel: 5,
  lushCoins: 2850,
  streakDays: 9,
  level: 4,
  xpCurrent: 640,
  xpMax: 1000,
  matchingIntent: 'Serious Relationship',
  isIncognito: false,
  pinNumber: '749102',
  isRadiating: true,
};

const INITIAL_POSTS: LushPostItem[] = [
  {
    id: 'post_01',
    author: {
      id: 'usr_02',
      name: 'Nia Adebayo',
      username: 'nia_music',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
      verificationLevel: 4,
      intentTag: 'Thoughtful Interactions',
    },
    content:
      'Nothing beats listening to neo-soul while designing brand identities on a quiet Sunday morning. What\'s one song that instantly transports you to your happiest memory?',
    timestamp: '25m ago',
    likesCount: 38,
    commentsCount: 6,
    giftsCount: 2,
    isLiked: false,
    isBookmarked: false,
    lapidaireQuestion:
      'What type of music do you like, and what\'s the last concert you went to?',
    lapidaireCategory: 'Music & Memories',
    comments: [
      {
        id: 'c_01',
        authorName: 'David Kalu',
        authorAvatar:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        text: 'Definitely Sade - Cherish the Day. Immediate calm and good vibes!',
        timestamp: '18m ago',
      },
    ],
  },
  {
    id: 'post_02',
    author: {
      id: 'usr_03',
      name: 'Tariq Al-Mansoor',
      username: 'tariq_lux',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      verificationLevel: 5,
      intentTag: 'Long-term Partnership',
    },
    content:
      'Surprise gift exchange unlocked! Just sent over the Chinchilla Weighted Luxury Throw from the Lush Plushies store to my match in celebration of our 2-week communication milestone.',
    timestamp: '1h ago',
    likesCount: 84,
    commentsCount: 14,
    giftsCount: 7,
    isLiked: true,
    isBookmarked: true,
    giftAttachment: {
      name: 'Chinchilla-Style Weighted Luxury Throw',
      imageUrl:
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300',
      price: 240,
    },
  },
  {
    id: 'post_03',
    author: {
      id: 'usr_04',
      name: 'Zainab Bello',
      username: 'zainab_art',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      verificationLevel: 5,
      intentTag: 'Unique Social Experience',
    },
    content:
      'Answering today\'s deep values prompt from the 30 Lush Questions: Success isn\'t about status symbols, it\'s about emotional peace and building a life you don\'t need a vacation from.',
    timestamp: '3h ago',
    likesCount: 112,
    commentsCount: 22,
    giftsCount: 4,
    isLiked: false,
    isBookmarked: false,
    lapidaireQuestion: 'How do you define success in life?',
    lapidaireCategory: 'Deep Values & Life Goals',
  },
];

const INITIAL_MATCHES: ActiveMatchItem[] = [
  {
    id: 'm_01',
    name: 'Nia Adebayo',
    avatar:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    compatibilityScore: 94,
    lastMessage: 'Would love to explore that gallery with you!',
    isOnline: true,
    hasUnread: true,
    pinExchanged: true,
  },
  {
    id: 'm_02',
    name: 'Elena Rostova',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300',
    compatibilityScore: 89,
    lastMessage: 'Sent a virtual plushie rose 🌹',
    isOnline: false,
    hasUnread: false,
    pinExchanged: false,
  },
];

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
  const [userProfile, setUserProfile] = useState<LushUserProfile>(() => {
    try {
      const saved = localStorage.getItem('lush_user_profile');
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // fallback to default
    }
    return DEFAULT_PROFILE;
  });
  const [feedPosts, setFeedPosts] = useState<LushPostItem[]>(INITIAL_POSTS);
  const [activeFeedTab, setActiveFeedTab] = useState<string>('feed');
  const [matches, setMatches] = useState<ActiveMatchItem[]>(INITIAL_MATCHES);

  // 6-Digit PIN Quota state (allocated 50 generations upon signup)
  const [pinQuota, setPinQuota] = useState<PinQuotaInfo>({
    totalAllocated: 50,
    generationsUsed: 2,
    generationsRemaining: 48,
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

  // Load backend profile, posts & PIN quota if available
  useEffect(() => {
    let isMounted = true;
    const loadLushData = async () => {
      try {
        const [postsRes, profileRes, quotaRes] = await Promise.allSettled([
          apiService.get('/lushpressies/posts'),
          apiService.get('/lushpressies/profile'),
          apiService.get('/lushpressies/pins/quota'),
        ]);

        if (!isMounted) return;

        if (
          postsRes.status === 'fulfilled' &&
          Array.isArray(postsRes.value?.data)
        ) {
          if (postsRes.value.data.length > 0) {
            setFeedPosts(postsRes.value.data);
          }
        }

        if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
          setUserProfile((prev) => {
            const merged = { ...prev, ...profileRes.value.data };
            try {
              localStorage.setItem('lush_user_profile', JSON.stringify(merged));
            } catch (err) {
              // Local storage unavailable
            }
            return merged;
          });
        }

        if (quotaRes.status === 'fulfilled' && quotaRes.value?.data) {
          const q = quotaRes.value.data;
          setPinQuota({
            totalAllocated: q.total_allocated ?? 50,
            generationsUsed: q.generations_used ?? 0,
            generationsRemaining: q.generations_remaining ?? 50,
            isUnlimited: Boolean(q.is_unlimited),
          });
        }
      } catch {
        // Fallback to mock dataset on API error
      }
    };

    loadLushData();
    return () => {
      isMounted = false;
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
    setUserProfile((prev) => {
      const merged = { ...prev, ...updated };
      try {
        localStorage.setItem('lush_user_profile', JSON.stringify(merged));
      } catch (err) {
        // Local storage fallback
      }
      return merged;
    });

    try {
      await apiService.put('/lushpressies/profile', updated);
    } catch {
      // Local state already updated
    }
  };

  const handleToggleIncognito = () => {
    setUserProfile((prev) => ({ ...prev, isIncognito: !prev.isIncognito }));
  };

  const handleToggleRadiate = () => {
    setUserProfile((prev) => ({ ...prev, isRadiating: !prev.isRadiating }));
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

  const handleCreatePost = (
    content: string,
    lapidaire?: string,
    mediaUrl?: string
  ) => {
    const newPost: LushPostItem = {
      id: `post_${Date.now()}`,
      author: {
        id: userProfile.id,
        name: userProfile.name,
        username: userProfile.username,
        avatar: userProfile.avatar,
        verificationLevel: userProfile.verificationLevel,
        intentTag: userProfile.matchingIntent,
      },
      content,
      timestamp: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      giftsCount: 0,
      isLiked: false,
      isBookmarked: false,
      lapidaireQuestion: lapidaire,
      lapidaireCategory: lapidaire ? '30 Dating Questions' : undefined,
      mediaUrl,
      comments: [],
    };

    voiceLineServiceInstance.playCommentaryVoiceLine('lushpressies');
    setFeedPosts((prev) => [newPost, ...prev]);
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

  return (
    <div className="min-h-screen bg-[#F5F9F6] text-gray-900 transition-colors">
      {/* Top Ambient Glow Banner */}
      <div className="h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-[#DC582A]" />

      {/* Main 3-Column LinkedIn-Style Layout Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column (3 cols): User Profile, Gamification, Fast Navigation */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
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
          </div>

          {/* Center Column (6 cols): Forum Post Card Feed on #F5F9F6 */}
          <div className="lg:col-span-6 space-y-4">
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
          </div>

          {/* Right Column (3 cols): Swipe Deck, Daily Question, Plushies Shop, Matches */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
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
          onSave={(profile) => {
            if (profile?.matching_intents?.[0]) {
              setUserProfile((prev) => ({
                ...prev,
                matchingIntent: profile.matching_intents[0],
              }));
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
              <button
                onClick={() => setShowCatalogModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition"
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
              <button
                onClick={() => setShowGamificationModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition"
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
              <button
                onClick={() => setShowHeatmapModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition"
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
              <button
                onClick={() => setShowCommitModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition"
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
    </div>
  );
};

export default LushPressiesPage;
