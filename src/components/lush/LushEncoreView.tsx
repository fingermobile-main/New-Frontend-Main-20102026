import React, { useState, useEffect, useMemo } from 'react';
import {
  SparklesIcon,
  StarIcon,
  MapPinIcon,
  GiftIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import apiService from '../../services/apiService';
import LushProposeMeetModal, { EncoreMember } from './LushProposeMeetModal';
import LushLuxuryGiftingModal from './LushLuxuryGiftingModal';
import { VerificationBadge } from '../verification/VerificationBadge';

const FALLBACK_ENCORE_MEMBERS: EncoreMember[] = [
  {
    id: 'enc_01',
    name: 'Seraphina De Winter',
    username: 'seraphina_arts',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
    rating: 5.0,
    reviewsCount: 38,
    isAvailable: true,
    characteristics: ['Sovereign Patron', 'Curator of Biennials', 'Bilingual French/English', 'Haute Gastronomy'],
    highscores: {
      affinity: 98,
      trust: 990,
      charm: 97,
      etiquette: 100,
    },
    headline: 'Chief Curator & Art Historian | Seeking Empathetic Sovereign Bond',
    location: 'Paris & Lagos',
    loveLanguage: 'Quality Time & Shared Expeditions',
    matchingIntent: 'Long-Term Sovereign Marriage',
    bio: 'Guiding private collections across Venice, Paris, and Lagos. I value depth of soul, intellectual debate over midnight Pinot Noir, and partners who move with understated poise.',
    verificationLevel: 5,
    preferredVenues: ['Musée d\'Orsay', 'Alara Lagos', 'Centre Pompidou'],
    pastExpeditions: ['Kyoto Temple Arts', 'Venice Biennale Vernissage'],
  },
  {
    id: 'enc_02',
    name: 'David O. Al-Hakim',
    username: 'david_invest',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    rating: 4.9,
    reviewsCount: 29,
    isAvailable: false,
    currentStatusNote: 'Currently on a 10-day private FingerLux sailing expedition in the Aegean Sea. Open to advance dinner & gallery reservations.',
    characteristics: ['Impact Investor', 'Classical Cellist', 'Polo Champion', 'Philanthropist'],
    highscores: {
      affinity: 96,
      trust: 985,
      charm: 94,
      etiquette: 98,
    },
    headline: 'Sovereign Wealth Architect & Classical Cello Enthusiast',
    location: 'Dubai, London & Abuja',
    loveLanguage: 'Acts of Service & Bespoke Gifting',
    matchingIntent: 'Deep Intellectual & Romantic Partnership',
    bio: 'Directing clean-energy funds and playing Bach suites at sunrise. Seeking a thoughtful, authentic mind to share private island conversations and world exploration.',
    verificationLevel: 5,
    preferredVenues: ['Royal Opera House London', 'Burj Al Arab Private Lounge', 'Transcorp Hilton'],
    pastExpeditions: ['Swiss Alpine Heli-Skiing', 'Aegean Sea Regatta'],
  },
  {
    id: 'enc_03',
    name: 'Aurelia Thorne',
    username: 'aurelia_lux',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
    rating: 4.8,
    reviewsCount: 42,
    isAvailable: true,
    characteristics: ['Bio-Tech Pioneer', 'Equestrian Dressage', 'Polymath', 'Wine Connoisseur'],
    highscores: {
      affinity: 95,
      trust: 970,
      charm: 96,
      etiquette: 97,
    },
    headline: 'Genomic Researcher & Competitive Equestrian | Life as an Art Form',
    location: 'Geneva & Cape Town',
    loveLanguage: 'Physical Touch & Words of Affirmation',
    matchingIntent: 'Exclusive Dating with Sovereign Vision',
    bio: 'Fascinated by longevity genetics and horse jumping. Nothing rivals an unhurried champagne brunch following a brisk morning ride through vineyard mist.',
    verificationLevel: 5,
    preferredVenues: ['Lake Geneva Private Dock', 'Delaire Graff Estate'],
    pastExpeditions: ['Serengeti Conservation Lodge', 'St. Moritz Snow Polo'],
  },
  {
    id: 'enc_04',
    name: 'Kenzo Takahashi',
    username: 'kenzo_zen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600',
    rating: 4.7,
    reviewsCount: 24,
    isAvailable: false,
    currentStatusNote: 'Leading an architectural design salon in Kyoto through Friday. Delighted to accept OwnIt/Flamingo gifts and schedule Tokyo/Paris meets.',
    characteristics: ['Master Architect', 'Matcha Sommelier', 'Meditative Mindset', 'Horology Collector'],
    highscores: {
      affinity: 93,
      trust: 960,
      charm: 92,
      etiquette: 99,
    },
    headline: 'Award-Winning Architect & Contemporary Ceramicist',
    location: 'Kyoto & New York',
    loveLanguage: 'Words of Affirmation & Shared Silence',
    matchingIntent: 'Meaningful Life Journey & Collaboration',
    bio: 'Designing minimalist residences grounded in natural materials. I seek an empathetic companion who finds joy in quiet gallery strolls, tea ceremonies, and jazz records.',
    verificationLevel: 4,
    preferredVenues: ['Katsura Imperial Villa', 'MoMA New York', 'Nezu Museum'],
    pastExpeditions: ['Nordic Architecture Pilgrimage', 'Sahara Stargazing Retreat'],
  },
  {
    id: 'enc_05',
    name: 'Zainab Amina Bello',
    username: 'zainab_couture',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600',
    rating: 4.9,
    reviewsCount: 51,
    isAvailable: true,
    characteristics: ['Haute Couture Patron', 'Contemporary African Art', 'Ballet Connoisseur', 'Global Philanthropist'],
    highscores: {
      affinity: 97,
      trust: 995,
      charm: 98,
      etiquette: 99,
    },
    headline: 'Creative Director & African Fine Art Trustee',
    location: 'Abuja, Milan & London',
    loveLanguage: 'Receiving Gifts & Romantic Diners',
    matchingIntent: 'Sovereign Lifelong Bond',
    bio: 'Championing African contemporary masters at Venice and Frieze. Drawn to magnanimous souls, genuine loyalty, candlelit rooftop dinners, and spontaneous trips to Lake Como.',
    verificationLevel: 5,
    preferredVenues: ['Teatro alla Scala', 'Nike Art Gallery', 'Claridge’s London'],
    pastExpeditions: ['Lake Como Villa Retreat', 'Milan Fashion Week Front Row'],
  },
  {
    id: 'enc_06',
    name: 'Maximilian Vance',
    username: 'max_vance',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600',
    rating: 4.6,
    reviewsCount: 33,
    isAvailable: true,
    characteristics: ['Michelin Restaurateur', 'Sommelier Grand Cru', 'Alpine Explorer', 'Jazz Pianist'],
    highscores: {
      affinity: 92,
      trust: 940,
      charm: 95,
      etiquette: 96,
    },
    headline: 'Culinary Visionary & Grand Cru Cellar Director',
    location: 'Vienna & Lagos',
    loveLanguage: 'Quality Time & Food as Love',
    matchingIntent: 'Soulful Dating & Shared Table Experiences',
    bio: 'Culinary storytelling is my heartbeat. I love gathering kindred spirits around a bespoke chef’s table, exploring vintage Burgundies, and composing piano melodies after midnight.',
    verificationLevel: 4,
    preferredVenues: ['Steirereck Vienna', 'Terra Kulture Restaurant', 'Le Gabriel Paris'],
    pastExpeditions: ['Burgundy Harvest Tour', 'Dolomites Alpine Trek'],
  },
  {
    id: 'enc_07',
    name: 'Nia Ifeoma Adebayo',
    username: 'nia_music',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
    rating: 4.8,
    reviewsCount: 47,
    isAvailable: false,
    currentStatusNote: 'Recording an acoustic symphony residency at Abbey Road Studios. Open to advance lunch & gallery dates for late October.',
    characteristics: ['Concert Violinist', 'Neo-Soul Composer', 'Empathetic Listener', 'Organic Living'],
    highscores: {
      affinity: 96,
      trust: 975,
      charm: 95,
      etiquette: 98,
    },
    headline: 'Symphonic Neo-Soul Artist & Cultural Archivist',
    location: 'Lagos & London',
    loveLanguage: 'Quality Time & Thoughtful Affirmations',
    matchingIntent: 'Long-Term Sovereign Bond',
    bio: 'Weaving Yoruba folk melodies with classical orchestral strings. In search of an emotionally grounded partner who appreciates genuine vulnerability and sunlit picnics.',
    verificationLevel: 5,
    preferredVenues: ['Barbican Centre', 'Freedom Park Lagos', 'Royal Albert Hall'],
    pastExpeditions: ['Montreux Jazz Residency', 'Zanzibar Cultural Sanctuary'],
  },
  {
    id: 'enc_08',
    name: 'Julian Montgomery',
    username: 'julian_aerospace',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600',
    rating: 4.5,
    reviewsCount: 19,
    isAvailable: true,
    characteristics: ['Aerospace Founder', 'Private Pilot', 'Antiquarian Books', 'Stargazer'],
    highscores: {
      affinity: 91,
      trust: 935,
      charm: 91,
      etiquette: 95,
    },
    headline: 'Deep-Tech & Avionics Entrepreneur | Stargazing & Literature',
    location: 'Oxford & Nairobi',
    loveLanguage: 'Acts of Service & Intellectual Dialogue',
    matchingIntent: 'Deep Intellectual & Romantic Partnership',
    bio: 'Building satellite propulsion by day and collecting 19th-century first editions by night. I value high ethics, intellectual wit, and evening flights over scenic coastlines.',
    verificationLevel: 4,
    preferredVenues: ['Bodleian Library Salon', 'Giraffe Manor Nairobi'],
    pastExpeditions: ['Atacama Desert Observatory', 'Kenya Aviation Safari'],
  },
];

interface LushEncoreViewProps {
  onOpenChat?: (memberId: string) => void;
  onNotificationAlert?: (msg: string) => void;
}

export const LushEncoreView: React.FC<LushEncoreViewProps> = ({
  onOpenChat,
  onNotificationAlert,
}) => {
  const [members, setMembers] = useState<EncoreMember[]>(FALLBACK_ENCORE_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'unavailable'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(3.0); // 3.0 to 5.0
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [likedMembers, setLikedMembers] = useState<Record<string, boolean>>({});

  // Modals state
  const [meetModalMember, setMeetModalMember] = useState<EncoreMember | null>(null);
  const [giftModalMember, setGiftModalMember] = useState<EncoreMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch backend Encore members if available
  useEffect(() => {
    let isMounted = true;
    const fetchEncore = async () => {
      try {
        const res = await apiService.get('/lushpressies/encore');
        if (isMounted && res?.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setMembers(res.data.data);
        }
      } catch {
        // Fallback already pre-seeded
      }
    };
    fetchEncore();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    if (onNotificationAlert) onNotificationAlert(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleLike = (memberId: string, memberName: string) => {
    setLikedMembers((prev) => {
      const next = !prev[memberId];
      if (next) {
        showToast(`💖 Bond sparked with ${memberName}! Compatibility scored & queued.`);
      }
      return { ...prev, [memberId]: next };
    });
  };

  // Distinct characteristic tags across members
  const allCharacteristics = useMemo(() => {
    const set = new Set<string>();
    members.forEach((m) => m.characteristics.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [members]);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Must satisfy rating >= 3.0 (Encore requirement)
      if (m.rating < ratingFilter) return false;

      // Availability filter
      if (availabilityFilter === 'available' && !m.isAvailable) return false;
      if (availabilityFilter === 'unavailable' && m.isAvailable) return false;

      // Tag filter
      if (selectedTag !== 'all' && !m.characteristics.includes(selectedTag)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q) || m.username.toLowerCase().includes(q);
        const matchesLoc = m.location.toLowerCase().includes(q);
        const matchesBio = m.bio.toLowerCase().includes(q) || m.headline.toLowerCase().includes(q);
        const matchesTag = m.characteristics.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesLoc && !matchesBio && !matchesTag) return false;
      }

      return true;
    });
  }, [members, ratingFilter, availabilityFilter, selectedTag, searchQuery]);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900/95 text-white border border-emerald-400 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-slideDown">
          <SparklesIcon className="w-5 h-5 text-emerald-400 animate-spin" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Encore Grand Banner & Subscription Privilege Badge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-[#1e1b2e] p-5 sm:p-7 text-white shadow-xl border border-emerald-500/30">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-52 h-52 bg-gradient-to-br from-amber-500/20 to-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold tracking-wide backdrop-blur-xs">
              <SparklesIcon className="w-4 h-4 text-amber-300" />
              <span>Lush Encore™ · High-Rating & Sovereign Bonds</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Exclusive 3–5 Star Members & FingerLux Expeditions
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Curated for members who demonstrated exceptional special characteristics and earned top ratings. Scroll available and unavailable likeminds, propose bespoke meets or excursions through FingerLux, and send ultra-luxury gifts through OwnIt™ and Flamingo™ stores.
            </p>
          </div>

          {/* Access Granted Badge */}
          <div className="bg-white/10 border border-emerald-300/30 rounded-2xl p-4 backdrop-blur-md flex-shrink-0 text-center sm:text-left space-y-1 md:max-w-xs">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <ShieldCheckIcon className="w-5 h-5 text-emerald-300" />
              <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                Access Granted
              </span>
            </div>
            <p className="text-[11px] text-gray-200 leading-snug">
              Included with your Lush Pressies subscription: Cross-store escrow gifting in OwnIt™ & Flamingo™ without secondary fees!
            </p>
          </div>
        </div>
      </div>

      {/* 2. Interactive Filter Bar */}
      <div className="bg-white rounded-2xl border border-emerald-100/80 shadow-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, characteristics, location or intent..."
              className="w-full bg-[#F5F9F6] text-gray-900 placeholder:text-slate-500 border border-emerald-100 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-600 outline-hidden transition"
            />
          </div>

          {/* Availability Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                availabilityFilter === 'all'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({members.length})
            </button>
            <button
              onClick={() => setAvailabilityFilter('available')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                availabilityFilter === 'available'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available Now</span>
            </button>
            <button
              onClick={() => setAvailabilityFilter('unavailable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${
                availabilityFilter === 'unavailable'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>On Expedition / Away</span>
            </button>
          </div>
        </div>

        {/* Rating & Tag Sub-Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
          {/* Star Threshold Selector */}
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <FunnelIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-gray-700">Rating Tier:</span>
            <div className="flex items-center gap-1">
              {[3.0, 4.0, 4.5, 4.8].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingFilter(star)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
                    ratingFilter === star
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ⭐ {star}+
                </button>
              ))}
            </div>
          </div>

          {/* Affinity Characteristic Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                selectedTag === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              All Likeminds
            </button>
            {allCharacteristics.slice(0, 5).map((char) => (
              <button
                key={char}
                onClick={() => setSelectedTag(char)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition ${
                  selectedTag === char
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Members Grid / Cards */}
      {filteredMembers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-emerald-100 p-12 text-center space-y-3">
          <div className="text-5xl">👑</div>
          <h3 className="text-lg font-bold text-gray-900">No Encore Members matched this filter</h3>
          <p className="text-xs text-slate-700 max-w-md mx-auto">
            Try adjusting your rating threshold or availability filter to discover more verified 3–5 star members.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setAvailabilityFilter('all');
              setRatingFilter(3.0);
              setSelectedTag('all');
            }}
            className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map((member) => {
            const isLiked = likedMembers[member.id];
            return (
              <div
                key={member.id}
                className="bg-white rounded-3xl border border-emerald-100/90 shadow-xs hover:shadow-md transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden group hover:border-emerald-300"
              >
                {/* Top Ambient Highlight */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-400 to-emerald-500 opacity-80" />

                <div>
                  {/* Header: Avatar, Rating & Status Pill */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-100 shadow-sm"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          member.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        title={member.isAvailable ? 'Available Now' : 'On Expedition'}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <h3 className="text-sm font-extrabold text-gray-900 truncate">
                            {member.name}
                          </h3>
                          <VerificationBadge level={member.verificationLevel} size="small" />
                        </div>

                        {/* Rating Display */}
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-400 flex-shrink-0 text-amber-950 border-amber-400 font-black">
                          <StarIconSolid className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-black text-amber-900">
                            {member.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-700 font-mono">@{member.username}</p>
                      <p className="text-[11px] text-emerald-800 font-semibold line-clamp-1 mt-0.5">
                        {member.headline}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-slate-700 mt-0.5">
                        <MapPinIcon className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{member.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability Advisory Tag */}
                  <div className="mb-3">
                    {member.isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        Available for Bonds, Meets & Diners
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                        <span>⏳</span>
                        <span>On Expedition · Advance Proposals & Luxury Gifts Welcome</span>
                      </span>
                    )}
                  </div>

                  {/* Highscore & Compatibility Meters */}
                  <div className="grid grid-cols-3 gap-2 p-2 bg-[#F5F9F6] border border-emerald-100 rounded-xl mb-3 text-center">
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Affinity</span>
                      <p className="text-xs font-extrabold text-emerald-700">
                        {member.highscores.affinity}% Match
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Trust Score</span>
                      <p className="text-xs font-extrabold text-teal-700">
                        {member.highscores.trust} / 1000
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">Etiquette</span>
                      <p className="text-xs font-extrabold text-[#DC582A]">
                        {member.highscores.etiquette}% Pure
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {member.bio}
                  </p>

                  {/* Exceptional Characteristics Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {member.characteristics.map((char) => (
                      <span
                        key={char}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200/70 text-emerald-900 text-[10px] font-bold"
                      >
                        ✦ {char}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* 1. Propose Date / Meet */}
                    <button
                      onClick={() => setMeetModalMember(member)}
                      className="w-full py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                      title="Propose Diners, Lunch, Coffee, Art Gallery or FingerLux Expedition"
                    >
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>Propose Meet</span>
                    </button>

                    {/* 2. Send Luxury Gift (OwnIt / Flamingo) */}
                    <button
                      onClick={() => setGiftModalMember(member)}
                      className="w-full py-2 px-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                      title="Send Luxury Gifts from OwnIt or Flamingo Store via Subscription"
                    >
                      <GiftIcon className="w-4 h-4" />
                      <span>Luxury Gift</span>
                    </button>
                  </div>

                  {/* Secondary Fast Actions: Direct Message & Spark Bond */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      onClick={() => onOpenChat && onOpenChat(member.id)}
                      className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 transition"
                    >
                      <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Encrypted Chat</span>
                    </button>

                    <button
                      onClick={() => handleToggleLike(member.id, member.name)}
                      className={`flex items-center gap-1 font-bold transition px-2.5 py-1 rounded-lg ${
                        isLiked
                          ? 'text-rose-600 bg-rose-50'
                          : 'text-gray-500 hover:text-rose-600 hover:bg-gray-50'
                      }`}
                    >
                      <HeartIcon className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{isLiked ? 'Bond Queued' : 'Spark Bond'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Propose Meet & FingerLux Expedition Modal */}
      <LushProposeMeetModal
        isOpen={Boolean(meetModalMember)}
        member={meetModalMember}
        onClose={() => setMeetModalMember(null)}
        onSuccess={(details) => {
          showToast(`✨ Invitation for ${details.title} dispatched to ${details.memberName}!`);
        }}
      />

      {/* OwnIt & Flamingo Luxury Gifting Modal */}
      <LushLuxuryGiftingModal
        isOpen={Boolean(giftModalMember)}
        member={giftModalMember}
        onClose={() => setGiftModalMember(null)}
        onGiftSent={(details) => {
          showToast(`💎 ${details.gift.title} dispatched to ${details.memberName} via ${details.storeType === 'ownit' ? 'OwnIt™ Vault' : 'Flamingo™ Store'}!`);
        }}
      />
    </div>
  );
};

export default LushEncoreView;
