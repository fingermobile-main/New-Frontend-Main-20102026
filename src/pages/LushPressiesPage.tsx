import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import LushPinGateModal from '../components/verification/LushPinGateModal';
import LushProfileSidebar, { LushUserProfile } from '../components/lush/LushProfileSidebar';
import LushForumFeed, { LushPostItem } from '../components/lush/LushForumFeed';
import LushDiscoverySidebar, { ActiveMatchItem } from '../components/lush/LushDiscoverySidebar';
import IcebreakerQuestionModal from '../components/IcebreakerQuestionModal';
import MatchingPreferencesForm from '../components/MatchingPreferencesForm';
import LushPlushiesCatalog from '../components/LushPlushiesCatalog';
import {
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import voiceLineServiceInstance from '../services/VoiceLineService';

const DEFAULT_PROFILE: LushUserProfile = {
  id: 'usr_lush_001',
  name: 'Alexandria Chen',
  username: 'alex_lush',
  headline: 'Curator & Creative Director | Seeking Empathetic Connection',
  location: 'Lagos, Nigeria & Virtual Spaces',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200',
  verificationLevel: 5,
  lushCoins: 2850,
  streakDays: 9,
  level: 4,
  xpCurrent: 640,
  xpMax: 1000,
  matchingIntent: 'Serious Relationship',
  isIncognito: false,
  pinNumber: '749102',
  isRadiating: true
};

const INITIAL_POSTS: LushPostItem[] = [
  {
    id: 'post_01',
    author: {
      id: 'usr_02',
      name: 'Nia Adebayo',
      username: 'nia_music',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
      verificationLevel: 4,
      intentTag: 'Thoughtful Interactions'
    },
    content: 'Nothing beats listening to neo-soul while designing brand identities on a quiet Sunday morning. What\'s one song that instantly transports you to your happiest memory?',
    timestamp: '25m ago',
    likesCount: 38,
    commentsCount: 6,
    giftsCount: 2,
    isLiked: false,
    isBookmarked: false,
    icebreakerQuestion: 'What type of music do you like, and what\'s the last concert you went to?',
    icebreakerCategory: 'Music & Memories',
    comments: [
      {
        id: 'c_01',
        authorName: 'David Kalu',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        text: 'Definitely Sade - Cherish the Day. Immediate calm and good vibes!',
        timestamp: '18m ago'
      }
    ]
  },
  {
    id: 'post_02',
    author: {
      id: 'usr_03',
      name: 'Tariq Al-Mansoor',
      username: 'tariq_lux',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      verificationLevel: 5,
      intentTag: 'Long-term Partnership'
    },
    content: 'Surprise gift exchange unlocked! Just sent over the Chinchilla Weighted Luxury Throw from the Lush Plushies store to my match in celebration of our 2-week communication milestone.',
    timestamp: '1h ago',
    likesCount: 84,
    commentsCount: 14,
    giftsCount: 7,
    isLiked: true,
    isBookmarked: true,
    giftAttachment: {
      name: 'Chinchilla-Style Weighted Luxury Throw',
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300',
      price: 240
    }
  },
  {
    id: 'post_03',
    author: {
      id: 'usr_04',
      name: 'Zainab Bello',
      username: 'zainab_art',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      verificationLevel: 5,
      intentTag: 'Unique Social Experience'
    },
    content: 'Answering today\'s deep values prompt from the 30 Lush Questions: Success isn\'t about status symbols, it\'s about emotional peace and building a life you don\'t need a vacation from.',
    timestamp: '3h ago',
    likesCount: 112,
    commentsCount: 22,
    giftsCount: 4,
    isLiked: false,
    isBookmarked: false,
    icebreakerQuestion: 'How do you define success in life?',
    icebreakerCategory: 'Deep Values & Life Goals'
  }
];

const INITIAL_MATCHES: ActiveMatchItem[] = [
  {
    id: 'm_01',
    name: 'Nia Adebayo',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    compatibilityScore: 94,
    lastMessage: 'Would love to explore that gallery with you!',
    isOnline: true,
    hasUnread: true,
    pinExchanged: true
  },
  {
    id: 'm_02',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300',
    compatibilityScore: 89,
    lastMessage: 'Sent a virtual plushie rose 🌹',
    isOnline: false,
    hasUnread: false,
    pinExchanged: false
  }
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
  const [userProfile, setUserProfile] = useState<LushUserProfile>(DEFAULT_PROFILE);
  const [feedPosts, setFeedPosts] = useState<LushPostItem[]>(INITIAL_POSTS);
  const [activeFeedTab, setActiveFeedTab] = useState<string>('feed');
  const [matches] = useState<ActiveMatchItem[]>(INITIAL_MATCHES);

  // 3. Modals State
  const [showPreferencesModal, setShowPreferencesModal] = useState<boolean>(false);
  const [showIcebreakerModal, setShowIcebreakerModal] = useState<boolean>(false);
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);

  // Load backend profile & posts if available
  useEffect(() => {
    let isMounted = true;
    const loadLushData = async () => {
      try {
        const [postsRes, profileRes] = await Promise.allSettled([
          apiService.get('/lushpressies/posts'),
          apiService.get('/lushpressies/profile')
        ]);

        if (!isMounted) return;

        if (postsRes.status === 'fulfilled' && Array.isArray(postsRes.value?.data)) {
          if (postsRes.value.data.length > 0) {
            setFeedPosts(postsRes.value.data);
          }
        }

        if (profileRes.status === 'fulfilled' && profileRes.value?.data) {
          setUserProfile(prev => ({ ...prev, ...profileRes.value.data }));
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

  const handleToggleIncognito = () => {
    setUserProfile(prev => ({ ...prev, isIncognito: !prev.isIncognito }));
  };

  const handleToggleRadiate = () => {
    setUserProfile(prev => ({ ...prev, isRadiating: !prev.isRadiating }));
  };

  const handleLikePost = (postId: string) => {
    setFeedPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    voiceLineServiceInstance.playCommentaryVoiceLine('lushpressies');
    setFeedPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            authorName: userProfile.name,
            authorAvatar: userProfile.avatar,
            text,
            timestamp: 'Just now'
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (content: string, icebreaker?: string) => {
    const newPost: LushPostItem = {
      id: `post_${Date.now()}`,
      author: {
        id: userProfile.id,
        name: userProfile.name,
        username: userProfile.username,
        avatar: userProfile.avatar,
        verificationLevel: userProfile.verificationLevel,
        intentTag: userProfile.matchingIntent
      },
      content,
      timestamp: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      giftsCount: 0,
      isLiked: false,
      isBookmarked: false,
      icebreakerQuestion: icebreaker,
      icebreakerCategory: icebreaker ? '30 Dating Questions' : undefined,
      comments: []
    };

    voiceLineServiceInstance.playCommentaryVoiceLine('lushpressies');
    setFeedPosts(prev => [newPost, ...prev]);
  };

  const handleSendGiftClick = (postId: string) => {
    if (postId) setShowCatalogModal(true);
  };

  const handleOpenChat = (matchId: string) => {
    if (matchId) navigate('/messages');
  };

  const handleStartVideoCall = (matchId: string) => {
    if (matchId) navigate('/messages');
  };

  // Filter posts by channel tab
  const filteredPosts = feedPosts.filter(p => {
    if (activeFeedTab === 'icebreakers') {
      return Boolean(p.icebreakerQuestion);
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
              onSelectFeedTab={setActiveFeedTab}
              onToggleIncognito={handleToggleIncognito}
              onToggleRadiate={handleToggleRadiate}
              onOpenPreferences={() => setShowPreferencesModal(true)}
              onOpenPinModal={() => setShowPinModal(true)}
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
              onOpenIcebreakerModal={() => setShowIcebreakerModal(true)}
              onCreatePost={handleCreatePost}
            />
          </div>

          {/* Right Column (3 cols): Swipe Deck, Daily Question, Plushies Shop, Matches */}
          <div className="lg:col-span-3 lg:sticky lg:top-20 space-y-4">
            <LushDiscoverySidebar
              userId={1}
              matches={matches}
              onOpenCatalog={() => setShowCatalogModal(true)}
              onOpenIcebreakerModal={() => setShowIcebreakerModal(true)}
              onOpenChat={handleOpenChat}
              onStartVideoCall={handleStartVideoCall}
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
              setUserProfile(prev => ({
                ...prev,
                matchingIntent: profile.matching_intents[0]
              }));
            }
            setShowPreferencesModal(false);
          }}
        />
      )}

      {/* 6. 30 Comprehensive Icebreaker Questions Modal */}
      <IcebreakerQuestionModal
        isOpen={showIcebreakerModal}
        onClose={() => setShowIcebreakerModal(false)}
        onComplete={() => setShowIcebreakerModal(false)}
      />

      {/* 7. Lush Plushies Luxury Gift Catalog Modal */}
      {showCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
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
                alert(`Selected ${product.product_name} (${product.product_price} FIC) to send as a Lush Gift!`);
                setShowCatalogModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LushPressiesPage;
