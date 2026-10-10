import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  BellIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  PlusIcon,
  PhotoIcon,
  VideoCameraIcon,
  ChartBarIcon,
  CalendarIcon,
  PaperClipIcon,
  LinkIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  FireIcon,
  CheckBadgeIcon,
  StarIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  HashtagIcon,
  LockClosedIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CameraIcon,
  MapPinIcon,
  FaceSmileIcon,
  MusicalNoteIcon,
  TvIcon,
  TagIcon,
  SignalIcon,
  PlayIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationCircleIcon,
  CodeBracketIcon,
  ListBulletIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
  HandThumbUpIcon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
  CheckCircleIcon as CheckCircleSolidIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';
import ForumService from '../services/forumService';
import { ForumCategory, ForumThread } from '../types/forum';
import WebRtcStudioDrawer from '../components/streaming/WebRtcStudioDrawer';
import UniversalProfileCard from '../components/common/UniversalProfileCard';

// =============================================================================
// MINI DRAWER / DROPDOWN MENU ENTITIES
// Items: Blog | Gems | Hallmarks | Groups | LoanSqr | Camus
// =============================================================================
interface MiniDrawerItem {
  id: string;
  name: string;
  path: string;
  description: string;
  badge: string;
  iconColor: string;
}

const MINI_DRAWER_ITEMS: MiniDrawerItem[] = [
  { id: 'blog', name: 'Blog', path: '/blogs', description: 'Long-form sovereign publishing & articles', badge: 'Articles', iconColor: 'text-sky-500' },
  { id: 'gems', name: 'Gems', path: '/gems', description: 'Curated community highlights & top posts', badge: 'Curated', iconColor: 'text-amber-500' },
  { id: 'hallmarks', name: 'Hallmarks', path: '/hallmarks', description: 'Mega-communities hosting up to 250k members', badge: '250k Cap', iconColor: 'text-purple-500' },
  { id: 'groups', name: 'Groups', path: '/groups', description: 'Private and public member circle groups', badge: 'Social', iconColor: 'text-emerald-500' },
  { id: 'loansqr', name: 'LoanSqr', path: '/loansqr', description: 'Enterprise SME micro-financing & float engine', badge: 'Fintech', iconColor: 'text-indigo-500' },
  { id: 'camus', name: 'Camus', path: '/camus', description: 'Publisher & sovereign programmatic ad network', badge: 'Ad Studio', iconColor: 'text-rose-500' },
];

// =============================================================================
// LEVEL 2 NAVIGATION ENTITIES
// Replaces: Following -> Communities -> Discover -> Trending
// WITH: Lush Pressies -> Dancia-4tv -> Marketplace -> PhotoCredits -> BeatwaveNG
// =============================================================================
interface SubNavEntity {
  id: string;
  name: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

const SUB_NAV_ITEMS: SubNavEntity[] = [
  { id: 'home', name: 'Home Feeds', path: '/forum-draft' },
  { id: 'lushpressies', name: 'Lush Pressies', path: '/lushpressies' },
  { id: 'dancia4tv', name: 'Dancia-4tv', path: '/dancia4tv' },
  { id: 'marketplace', name: 'Marketplace', path: '/marketplace' },
  { id: 'photocredits', name: 'PhotoCredits', path: '/photocredits' },
  { id: 'beatwaveng', name: 'BeatwaveNG', path: '/beatwaveng' },
];

// =============================================================================
// Mii(™®©℠) DISAPPEARING STORIES (48H EXPIRATION)
// =============================================================================
interface MiiItem {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  mediaUrl: string;
  expiresIn: string;
  caption: string;
  isViewed: boolean;
  type: 'photo' | 'audio' | 'video';
}

const INITIAL_MII_STORIES: MiiItem[] = [
  {
    id: 'mii-1',
    author: 'Amara Kalu',
    handle: '@amara_beats',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    expiresIn: '18h left',
    caption: 'Backstage at BeatwaveNG live studio sessions in Victoria Island! 🎵',
    isViewed: false,
    type: 'audio',
  },
  {
    id: 'mii-2',
    author: 'Tunde Adeleke',
    handle: '@tunde_dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    expiresIn: '34h left',
    caption: 'Testing sovereign keycard NFC signatures live on testnet.',
    isViewed: false,
    type: 'video',
  },
  {
    id: 'mii-3',
    author: 'Zara Sterling',
    handle: '@zara_lush',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    expiresIn: '41h left',
    caption: 'Sunset celebration gifts dispatched via Lush Escrow! 🎁',
    isViewed: true,
    type: 'photo',
  },
  {
    id: 'mii-4',
    author: 'Sylvia Nyt',
    handle: '@chiomasylv',
    avatar: 'https://static.wixstatic.com/media/1bf8c6_b4a559f6fcbf42b4a0a0f0df24627910~mv2.jpg',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    expiresIn: '46h left',
    caption: 'Executive lounge networking session in Lekki Phase 1.',
    isViewed: false,
    type: 'photo',
  },
];

// =============================================================================
// FULL MASTER CATEGORIES LIST (53 CATEGORIES FROM DB & MASTER SPEC)
// Mandated selection for authors creating/publishing posts
// =============================================================================
const MASTER_CATEGORIES_CATALOG: { id: string; name: string; icon: string }[] = [
  { id: '1', name: 'General Discussion', icon: '💬' },
  { id: '2', name: 'Questions & Answers', icon: '❓' },
  { id: '3', name: 'Verified Members', icon: '🛡️' },
  { id: '4', name: 'Connect', icon: '🤝' },
  { id: '5', name: 'Dating', icon: '❤️' },
  { id: '6', name: "Sights N' Sounds", icon: '📷' },
  { id: '7', name: "Movies N' More", icon: '🎬' },
  { id: '8', name: 'MirellaFacet®™©', icon: '💎' },
  { id: '9', name: 'Ketogenic', icon: '🥗' },
  { id: '10', name: 'Nostalgic Arts', icon: '🎨' },
  { id: '11', name: "Music N' Concerts", icon: '🎸' },
  { id: '12', name: 'Fresh Out', icon: '🔥' },
  { id: '13', name: 'School Fees Grant', icon: '🎓' },
  { id: '14', name: 'My College and I', icon: '🏫' },
  { id: '15', name: 'Give-Away', icon: '🎁' },
  { id: '16', name: "'- The - Private Room", icon: '🔒' },
  { id: '17', name: "Velvets N' Suedes", icon: '✨' },
  { id: '18', name: 'Assured', icon: '✅' },
  { id: '19', name: 'Crypto & Web3', icon: '🪙' },
  { id: '20', name: 'Professional Classified Assets', icon: '💼' },
  { id: '21', name: 'Sell It - Buy it.', icon: '🏷️' },
  { id: '22', name: 'Kitchen Orders', icon: '🍳' },
  { id: '23', name: 'Tech and Gadgets', icon: '💻' },
  { id: '24', name: 'Lux & Private Estates', icon: '🏰' },
  { id: '25', name: 'Medical Health', icon: '🏥' },
  { id: '26', name: 'Telehealth MedCare Counselling', icon: '🩺' },
  { id: '27', name: 'News Updates', icon: '📰' },
  { id: '28', name: 'Laffs & Comedy', icon: '😄' },
  { id: '29', name: 'Cyber Security', icon: '🛡️' },
  { id: '30', name: 'ShopWithUsNaija', icon: '🛍️' },
  { id: '31', name: 'Chuta Relationship Advice', icon: '💔' },
  { id: '32', name: 'Pets and Us', icon: '🐾' },
  { id: '33', name: 'Skitz & Shorts', icon: '🎭' },
  { id: '34', name: 'Nanee Vlogs', icon: '📹' },
  { id: '35', name: 'Ayersha Specials', icon: '🌸' },
  { id: '36', name: 'Sportica Olympia', icon: '⚽' },
  { id: '37', name: 'Wild Nature & Wildlife', icon: '🌿' },
  { id: '38', name: 'WAENI Caregivers', icon: '🤲' },
  { id: '39', name: 'Law and Order', icon: '⚖️' },
  { id: '40', name: 'Entertainment & TV', icon: '📺' },
  { id: '41', name: 'Marketplace & Deals', icon: '🛒' },
  { id: '42', name: 'Lush Pressies & Gifting', icon: '🎀' },
  { id: '43', name: 'Technology & AI', icon: '⚡' },
  { id: '44', name: 'Gaming & FingerWars', icon: '🎮' },
  { id: '45', name: 'Creative Studio & UGC', icon: '🎙️' },
  { id: '46', name: 'Announcements & Updates', icon: '📢' },
  { id: '47', name: 'BeatwaveNG Stems & Licensing', icon: '🎧' },
  { id: '48', name: 'Dancia-4Tv Choreography', icon: '💃' },
  { id: '49', name: 'LoanSqr SME Credit Talk', icon: '💰' },
  { id: '50', name: 'Sovereign Hardware & NFC', icon: '💳' },
  { id: '51', name: 'Fashion & Flamingo Haute', icon: '👗' },
  { id: '52', name: 'OwnIt Zero-Cost Renting', icon: '📦' },
  { id: '53', name: 'FingerLux High Jewelry & Horology', icon: '⌚' },
];

// Product Tagger Options for Post Composer
const PRODUCT_CATALOG_OPTIONS = [
  { id: 'prod-fl-1', platform: 'FingerLux', name: 'Grand Celestial Tourbillon Watch', price: '4,500 FIC' },
  { id: 'prod-mp-1', platform: 'Marketplace', name: 'Sovereign Hardware Keycard V3', price: '250 FIC' },
  { id: 'prod-flam-1', platform: 'Flamingo', name: 'Artisanal Distressed Denim Jacket', price: '120 FIC' },
  { id: 'prod-own-1', platform: 'OwnIt', name: '4K Ultra-Wide Studio Reference Monitor', price: '85 FIC/mo' },
  { id: 'prod-sf-1', platform: 'Storefront', name: 'Lossless Master Stem Pack (BeatwaveNG)', price: '50 FIC' },
];

// Rich Feed Sub-Entities
export interface FeedComment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface FeedPoll {
  question: string;
  options: { text: string; votes: number }[];
  userVotedIndex?: number;
  totalVotes: number;
  durationDays: number;
}

export interface FeedEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  rsvpCount: number;
  isRsvpd?: boolean;
}

export interface FeedFileAttachment {
  name: string;
  size: string;
  type: string;
}

export interface FeedLinkEmbed {
  url: string;
  title: string;
  domain: string;
}

// Fallback Forum Posts
interface FeedPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorRole: string;
  categoryName: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  tags: string[];
  mediaUrl?: string;
  audioPreview?: string;
  videoStreamUrl?: string;
  isVerified?: boolean;
  poll?: FeedPoll;
  event?: FeedEvent;
  fileAttachment?: FeedFileAttachment;
  linkEmbed?: FeedLinkEmbed;
  locationTag?: string;
  taggedProduct?: {
    platform: string;
    name: string;
    price: string;
  };
  commentsList?: FeedComment[];
}

const DEFAULT_POSTS: FeedPost[] = [
  {
    id: 'post-101',
    title: 'BeatwaveNG Protocol 2.4 Master Release: Lossless Amapiano Spatial Audio',
    content: 'We are officially rolling out the 2.4 spatial waveform compression engine. Music producers can now mint direct licensing tokens and distribute stem stems directly through FingerMobile Protocol without intermediaries.',
    authorName: 'Israel Mbah',
    authorHandle: '@israel_protocol',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    authorRole: 'Protocol Architect',
    categoryName: 'BeatwaveNG Stems & Licensing',
    createdAt: '25m ago',
    likesCount: 142,
    commentsCount: 2,
    sharesCount: 19,
    isLiked: false,
    isBookmarked: false,
    tags: ['BeatwaveNG', 'Amapiano', 'SpatialAudio', 'Licensing'],
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000',
    audioPreview: 'BeatwaveNG Lossless 128BPM Spatial Stem Pack',
    isVerified: true,
    locationTag: 'Victoria Island Studio Hub, Lagos',
    taggedProduct: { platform: 'Storefront', name: 'Lossless Master Stem Pack (BeatwaveNG)', price: '50 FIC' },
    poll: {
      question: 'Have you verified your audio stem stems on testnet?',
      options: [
        { text: 'Yes, audio quality is pristine 🎵', votes: 84 },
        { text: 'Testing stem minting today ⚡', votes: 42 },
        { text: 'Need tutorial whitepaper 📄', votes: 16 }
      ],
      totalVotes: 142,
      durationDays: 3
    },
    commentsList: [
      {
        id: 'c-1',
        authorName: 'Amara Kalu',
        authorHandle: '@amara_beats',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        text: 'The sub-bass clarity on the 2.4 lossless stem is incredible! Already minting my EP licensing contracts.',
        createdAt: '12m ago'
      },
      {
        id: 'c-2',
        authorName: 'Tunde Adeleke',
        authorHandle: '@tunde_dev',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        text: 'Zero-latency sync with the NFC keycard works flawlessly on physical hardware.',
        createdAt: '5m ago'
      }
    ]
  },
  {
    id: 'post-102',
    title: 'Sovereign Hardware Keycard V3 Distribution Underway in Lagos & Abuja Hubs',
    content: 'All verified sovereign creators with >5,000 XP can now claim their NFC hardware encryption card at designated distribution centers. Ensure your Biometric BioFace credentials match your Protocol Sovereign PIN.',
    authorName: 'Eunice Emonena',
    authorHandle: '@eunice_ops',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    authorRole: 'Security Lead',
    categoryName: 'Sovereign Hardware & NFC',
    createdAt: '2h ago',
    likesCount: 89,
    commentsCount: 1,
    sharesCount: 14,
    isLiked: true,
    isBookmarked: true,
    tags: ['KeycardV3', 'Security', 'Hardware', 'BioFace'],
    isVerified: true,
    locationTag: 'Abuja Central Sovereign Hub',
    taggedProduct: { platform: 'Marketplace', name: 'Sovereign Hardware Keycard V3', price: '250 FIC' },
    event: {
      title: 'Physical Keycard V3 Sovereign Onboarding Workshop',
      date: 'Oct 15, 2026',
      time: '14:00 WAT',
      location: 'FingerMobile Innovation Hub, Victoria Island',
      rsvpCount: 68,
      isRsvpd: false
    },
    commentsList: [
      {
        id: 'c-3',
        authorName: 'David Obi',
        authorHandle: '@david_tech',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        text: 'Received mine this morning in Abuja. Hardware pairing was instant!',
        createdAt: '1h ago'
      }
    ]
  },
  {
    id: 'post-103',
    title: 'LushPressies Gifting Escrow Milestone: 100,000 Verified Moments Exchanged',
    content: 'The 3-column interactive dating & gifting platform has surpassed 100k verified transactions! The smart escrow lock prevents gift redemption until both mutual parties approve proof-of-connection.',
    authorName: 'Mercy Kulem',
    authorHandle: '@mercy_lush',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    authorRole: 'Community Lead',
    categoryName: 'Lush Pressies & Gifting',
    createdAt: '5h ago',
    likesCount: 210,
    commentsCount: 45,
    sharesCount: 32,
    isLiked: false,
    isBookmarked: false,
    tags: ['LushPressies', 'Escrow', 'Mii', 'Community'],
    mediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1000',
    isVerified: true,
  },
  {
    id: 'post-104',
    title: 'LoanSqr POS Float Same-Day Settlement: ₦84M Capital Deployed This Week',
    content: 'Merchant liquidity across our 10 digital micro-financing tiers is now processing under 90 seconds. All borrowers with clean cash-flow history qualify for zero-collateral inventory advance.',
    authorName: 'Mbah Israel Obinna',
    authorHandle: '@israel_founder',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    authorRole: 'IP Owner & Visionary',
    categoryName: 'LoanSqr SME Credit Talk',
    createdAt: '8h ago',
    likesCount: 312,
    commentsCount: 64,
    sharesCount: 51,
    isLiked: false,
    isBookmarked: false,
    tags: ['LoanSqr', 'SMEFinancing', 'CreditOracle'],
    isVerified: true,
  },
  {
    id: 'post-105',
    title: 'Dancia-4Tv National Street Dance Invitational: Live Streaming Stems Available',
    content: 'Broadcast engineers have unlocked multi-angle WebRTC camera feeds for the upcoming festival. Tune in to vote via live micro-tips and unlock commemorative NFT hallmarks.',
    authorName: 'Chidi Progressive',
    authorHandle: '@chidi_dance',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    authorRole: 'Choreography Director',
    categoryName: 'Dancia-4Tv Choreography',
    createdAt: '12h ago',
    likesCount: 178,
    commentsCount: 29,
    sharesCount: 22,
    isLiked: false,
    isBookmarked: false,
    tags: ['Dancia4tv', 'LiveStream', 'UGC'],
    mediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000',
    isVerified: true,
  },
  {
    id: 'post-106',
    title: 'OwnIt Zero-Cost Hardware Rental: High-End Cameras & Studio Lighting',
    content: 'Need pro RED cameras or cinema lenses for your next FingerShorts production? Access verified equipment rentals without hefty upfront security deposits.',
    authorName: 'Tariq Al-Mansoor',
    authorHandle: '@tariq_gear',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    authorRole: 'Rental Curator',
    categoryName: 'OwnIt Zero-Cost Renting',
    createdAt: '1d ago',
    likesCount: 95,
    commentsCount: 18,
    sharesCount: 11,
    isLiked: false,
    isBookmarked: false,
    tags: ['OwnIt', 'CreatorGear', 'Cinema'],
    isVerified: false,
    taggedProduct: { platform: 'OwnIt', name: '4K Ultra-Wide Studio Reference Monitor', price: '85 FIC/mo' },
  },
  {
    id: 'post-107',
    title: 'Flamingo Sovereign Fashion Drop: Hand-Woven Aso-Oke & Smart NFC Tags',
    content: 'Our newest sustainable luxury textiles now ship with sewn-in NFC chips linked to proof-of-authenticity certificates on the FingerMobile blockchain ledger.',
    authorName: 'Folake Adeleke',
    authorHandle: '@folake_couture',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    authorRole: 'Textile Artisan',
    categoryName: 'Flamingo Sovereign Market',
    createdAt: '1d ago',
    likesCount: 167,
    commentsCount: 34,
    sharesCount: 20,
    isLiked: false,
    isBookmarked: false,
    tags: ['Flamingo', 'SovereignFashion', 'NFCTagged'],
    mediaUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000',
    isVerified: true,
    taggedProduct: { platform: 'Flamingo', name: 'Hand-Woven Royal Aso-Oke Ensemble', price: '120 FIC' },
  },
  {
    id: 'post-108',
    title: 'Campus Hub Sovereign Micro-Crediting: Zero Interest Exam Prep Grants',
    content: 'University students across Lagos, UNN, and ABU can now apply for sovereign exam vouchers and data bundles with 0% interest and repayment deferred until post-graduation.',
    authorName: 'Dr. Kester Nwosu',
    authorHandle: '@dr_kester_edu',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorRole: 'Campus Dean',
    categoryName: 'Campus Hub & Education',
    createdAt: '1d ago',
    likesCount: 284,
    commentsCount: 52,
    sharesCount: 44,
    isLiked: false,
    isBookmarked: false,
    tags: ['CampusHub', 'Education', 'StudentGrants'],
    isVerified: true,
  },
  {
    id: 'post-109',
    title: 'FingerLux Grand Celestial Tourbillon: Engineering the Sovereign Escapement',
    content: 'Horology enthusiasts: we have published the complete CAD blueprint and titanium grade-5 metallurgy report for the Grand Celestial Tourbillon. 100% on-chain warranty.',
    authorName: 'Sovereign Watchmaker',
    authorHandle: '@fingerlux_master',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    authorRole: 'Master Horologist',
    categoryName: 'FingerLux Luxury & Watches',
    createdAt: '2d ago',
    likesCount: 320,
    commentsCount: 71,
    sharesCount: 65,
    isLiked: true,
    isBookmarked: false,
    tags: ['FingerLux', 'Horology', 'Tourbillon', 'Titanium'],
    mediaUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1000',
    isVerified: true,
    taggedProduct: { platform: 'FingerLux', name: 'Grand Celestial Tourbillon NFT Watch', price: '4,500 FIC' },
  },
  {
    id: 'post-110',
    title: 'Velvets N\' Suedes Secret Lounge: Exclusive Sovereign Member Night',
    content: 'Doors unlock this Saturday in Ikoyi for verified Tier 3 Sovereign badge holders. Live jazz, private wine auction, and unreleased BeatwaveNG spatial listening room.',
    authorName: 'Ngozi Okafor',
    authorHandle: '@ngozi_velvets',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    authorRole: 'Lounge Curator',
    categoryName: 'Velvets N\' Suedes Nightlife',
    createdAt: '2d ago',
    likesCount: 198,
    commentsCount: 41,
    sharesCount: 27,
    isLiked: false,
    isBookmarked: false,
    tags: ['VelvetsNSuedes', 'Ikoyi', 'Nightlife', 'Exclusive'],
    isVerified: true,
  },
  {
    id: 'post-111',
    title: 'BeatwaveNG High-Definition Vinyl Master Pressings Now Live',
    content: 'Analog warmth meets sovereign on-chain ownership. Every vinyl pressing includes a high-res DSD audio download code and royalty split smart contract.',
    authorName: 'Kofi Mensah',
    authorHandle: '@kofi_audio',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    authorRole: 'Audio Engineer',
    categoryName: 'BeatwaveNG Stems & Licensing',
    createdAt: '2d ago',
    likesCount: 145,
    commentsCount: 28,
    sharesCount: 16,
    isLiked: false,
    isBookmarked: false,
    tags: ['Vinyl', 'Lossless', 'AudioEngineering'],
    mediaUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1000',
    isVerified: true,
  },
  {
    id: 'post-112',
    title: 'Hallmarks Mega-Communities: Unlocking 250k Member Scale Without Congestion',
    content: 'Our distributed peer-to-peer relay clusters enable sub-millisecond group chat and live audio stages with up to a quarter of a million active participants simultaneously.',
    authorName: 'Amara Kalu',
    authorHandle: '@amara_beats',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    authorRole: 'Community Architect',
    categoryName: 'Hallmarks Mega-Communities',
    createdAt: '3d ago',
    likesCount: 412,
    commentsCount: 88,
    sharesCount: 63,
    isLiked: true,
    isBookmarked: true,
    tags: ['Hallmarks', '250kCap', 'MegaGroups', 'Scale'],
    isVerified: true,
  },
  {
    id: 'post-113',
    title: 'Sovereign BioFace & Zero-Knowledge Protocol Sovereign PIN Tutorial',
    content: 'How to protect your assets: never share your 4-digit PIN. Your facial biometric vector never leaves your hardware enclave—only the zero-knowledge mathematical proof is verified.',
    authorName: 'Dayo Bello',
    authorHandle: '@dayo_security',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorRole: 'Cryptographer',
    categoryName: 'Sovereign Hardware & NFC',
    createdAt: '3d ago',
    likesCount: 231,
    commentsCount: 39,
    sharesCount: 31,
    isLiked: false,
    isBookmarked: false,
    tags: ['BioFace', 'ZeroKnowledge', 'PIN', 'Privacy'],
    isVerified: true,
  },
  {
    id: 'post-114',
    title: 'Lush Gifting Smart Escrow: Disclosing Our Open-Source Verification Contracts',
    content: 'Transparency first: all escrow parameters, timing timeouts, and mutual unlock triggers for LushPressies gifts are publicly auditable. No centralized custodian holds your tokens.',
    authorName: 'Zainab Al-Hassan',
    authorHandle: '@zainab_code',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    authorRole: 'Smart Contract Auditor',
    categoryName: 'Lush Pressies & Gifting',
    createdAt: '4d ago',
    likesCount: 189,
    commentsCount: 35,
    sharesCount: 22,
    isLiked: false,
    isBookmarked: false,
    tags: ['SmartContracts', 'Audit', 'Escrow', 'LushPressies'],
    isVerified: true,
  },
  {
    id: 'post-115',
    title: 'Dancia-4Tv Multi-Angle WebRTC Camera Setup: Pro Broadcast Guide',
    content: 'Here is how creators can sync 4 mobile phone lenses into a unified 60FPS multiview stream for live dance competitions, street battles, and theatrical showcases.',
    authorName: 'Emeka Obi',
    authorHandle: '@emeka_broadcast',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    authorRole: 'Streaming Specialist',
    categoryName: 'Dancia-4Tv Choreography',
    createdAt: '4d ago',
    likesCount: 156,
    commentsCount: 24,
    sharesCount: 17,
    isLiked: false,
    isBookmarked: false,
    tags: ['WebRTC', 'Multiview', 'Dancia4tv', 'Broadcasting'],
    mediaUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1000',
    isVerified: true,
  },
  {
    id: 'post-116',
    title: 'LoanSqr Credit Oracle: Why Cash Flow Always Beats Traditional Paper Collateral',
    content: 'Our dynamic scoring algorithm analyzes 42 on-chain behavioral factors: settlement velocity, return rate, peer recommendations, and average daily float churn.',
    authorName: 'Babatunde Raji',
    authorHandle: '@babatunde_fintech',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    authorRole: 'Risk Officer',
    categoryName: 'LoanSqr SME Credit Talk',
    createdAt: '5d ago',
    likesCount: 275,
    commentsCount: 60,
    sharesCount: 48,
    isLiked: false,
    isBookmarked: false,
    tags: ['LoanSqr', 'CreditOracle', 'SME', 'Fintech'],
    isVerified: true,
  },
  {
    id: 'post-117',
    title: 'PhotoCredits & Lumina Gallery: HDR Art Curation Showcase',
    content: 'Photographers can now submit RAW 14-bit DNG files to the sovereign exhibition. Curated entries receive immediate micro-royalties on every gallery view.',
    authorName: 'Chioma Eze',
    authorHandle: '@chioma_visuals',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    authorRole: 'Lumina Curator',
    categoryName: 'General Discussion',
    createdAt: '5d ago',
    likesCount: 310,
    commentsCount: 47,
    sharesCount: 36,
    isLiked: true,
    isBookmarked: false,
    tags: ['PhotoCredits', 'LuminaGallery', 'HDR', 'Photography'],
    mediaUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1000',
    isVerified: true,
  },
  {
    id: 'post-118',
    title: 'FingerMobile Sovereign Architecture: EAL6+ Hardware Security Standards',
    content: 'A comprehensive technical overview of how FingerMobile integrates biometric authentication, off-chain state channels, and sovereign key storage into a unified mobile protocol.',
    authorName: 'Victor Vance',
    authorHandle: '@victor_systems',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    authorRole: 'Systems Architect',
    categoryName: 'General Discussion',
    createdAt: '6d ago',
    likesCount: 490,
    commentsCount: 104,
    sharesCount: 82,
    isLiked: false,
    isBookmarked: true,
    tags: ['Architecture', 'EAL6', 'Security', 'Whitepaper'],
    isVerified: true,
  },
];

export const ForumPageDraft: React.FC = () => {
  const navigate = useNavigate();

  // Navigation State
  const [activeSubNav, setActiveSubNav] = useState<string>('home');
  const [feedMode, setFeedMode] = useState<'for_you' | 'following' | 'recent' | 'trending'>('for_you');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMiniDrawer, setShowMiniDrawer] = useState<boolean>(false);

  // Vault Visibility Toggle State (Not always visible!)
  const [isVaultVisible, setIsVaultVisible] = useState<boolean>(false);

  // Identity / Security State
  const [incognitoMode, setIncognitoMode] = useState<boolean>(false);

  // Mii(™®©℠) State
  const [miiStories, setMiiStories] = useState<MiiItem[]>(INITIAL_MII_STORIES);
  const [selectedMii, setSelectedMii] = useState<MiiItem | null>(null);

  // Composer State
  const [composerTitle, setComposerTitle] = useState<string>('');
  const [composerContent, setComposerContent] = useState<string>('');
  const [composerCategory, setComposerCategory] = useState<string>(''); // Mandatory category
  const [composerPrivacy, setComposerPrivacy] = useState<'public' | 'members' | 'sovereign' | 'incognito'>('public');
  const [composerTags, setComposerTags] = useState<string>('');
  const [taggedProduct, setTaggedProduct] = useState<string>('');
  const [showAdvancedTools, setShowAdvancedTools] = useState<boolean>(false);
  const [showProductDropdown, setShowProductDropdown] = useState<boolean>(false);
  const [showSettingsAccordion, setShowSettingsAccordion] = useState<boolean>(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'censor' | 'media' | 'styler'>('censor');
  const [sensitiveFlag, setSensitiveFlag] = useState<boolean>(false);
  const [ageRating, setAgeRating] = useState<string>('all-ages');
  const [mediaWatermark, setMediaWatermark] = useState<boolean>(true);
  const [visualGlow, setVisualGlow] = useState<boolean>(false);
  const [composerError, setComposerError] = useState<string | null>(null);

  // Rich Text Editor State: Write vs Preview
  const [composerTab, setComposerTab] = useState<'write' | 'preview'>('write');

  // Advanced Tools Interactive Panels State (Replacing Alert Duds)
  const [activeComposerTool, setActiveComposerTool] = useState<
    'media' | 'poll' | 'event' | 'file' | 'link' | 'location' | 'emoji' | 'beatwave' | 'dancia' | null
  >(null);

  // Active Tool Attachment Data
  const [attachedMedia, setAttachedMedia] = useState<string | null>(null);
  const [mediaInputUrl, setMediaInputUrl] = useState<string>('');
  const [attachedPoll, setAttachedPoll] = useState<FeedPoll | null>(null);
  const [pollDraft, setPollDraft] = useState<{
    question: string;
    opt1: string;
    opt2: string;
    opt3: string;
    opt4: string;
    days: number;
  }>({
    question: '',
    opt1: '',
    opt2: '',
    opt3: '',
    opt4: '',
    days: 3,
  });
  const [attachedEvent, setAttachedEvent] = useState<FeedEvent | null>(null);
  const [eventDraft, setEventDraft] = useState<{
    title: string;
    date: string;
    time: string;
    location: string;
  }>({
    title: '',
    date: '',
    time: '',
    location: '',
  });
  const [attachedFile, setAttachedFile] = useState<FeedFileAttachment | null>(null);
  const [fileDraftName, setFileDraftName] = useState<string>('');
  const [attachedLink, setAttachedLink] = useState<FeedLinkEmbed | null>(null);
  const [linkInputUrl, setLinkInputUrl] = useState<string>('');
  const [linkInputTitle, setLinkInputTitle] = useState<string>('');
  const [attachedLocation, setAttachedLocation] = useState<string | null>(null);
  const [attachedStem, setAttachedStem] = useState<string | null>(null);
  const [attachedStream, setAttachedStream] = useState<string | null>(null);

  // Live Streaming Studio Drawer State
  const [isLiveStudioOpen, setIsLiveStudioOpen] = useState<boolean>(false);

  // Expanded Post Comments & Inline Comment Reply State
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({ 'post-101': true });
  const [commentInputTexts, setCommentInputTexts] = useState<Record<string, string>>({});

  // Toast Feedback State
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
  } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 3500);
  };

  // Feed State
  const [posts, setPosts] = useState<FeedPost[]>(DEFAULT_POSTS);
  const [apiCategories, setApiCategories] = useState<{ id: string; name: string; icon: string }[]>(MASTER_CATEGORIES_CATALOG);
  const [isLoadingFeed, setIsLoadingFeed] = useState<boolean>(false);

  // Fetch dynamic categories from MasterDashboard/Database on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await ForumService.getCategories();
        if (res.success && res.data?.categories && res.data.categories.length > 0) {
          const loaded = res.data.categories.map((c: ForumCategory) => ({
            id: String(c.id),
            name: c.name,
            icon: c.icon || '💬',
          }));
          // Merge with master catalog to guarantee complete coverage
          const existingIds = new Set(loaded.map((c) => c.name.toLowerCase()));
          const extra = MASTER_CATEGORIES_CATALOG.filter((c) => !existingIds.has(c.name.toLowerCase()));
          setApiCategories([...loaded, ...extra]);
        }
      } catch (err) {
        console.warn('Loaded categories catalog from master repository:', err);
      }
    };
    loadCategories();
  }, []);

  // Filter posts by search query and category
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        searchQuery === '' ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategoryId === 'all' ||
        p.categoryName.toLowerCase().includes(selectedCategoryId.toLowerCase());

      return matchSearch && matchCategory;
    });
  }, [posts, searchQuery, selectedCategoryId]);

  // Markdown Toolbar Inserter
  const insertMarkdownSyntax = (syntax: 'bold' | 'italic' | 'heading' | 'quote' | 'bullet' | 'code' | 'link') => {
    switch (syntax) {
      case 'bold':
        setComposerContent((prev) => prev + ' **bold text** ');
        break;
      case 'italic':
        setComposerContent((prev) => prev + ' *italic text* ');
        break;
      case 'heading':
        setComposerContent((prev) => (prev ? prev + '\n\n### Heading Title\n' : '### Heading Title\n'));
        break;
      case 'quote':
        setComposerContent((prev) => (prev ? prev + '\n\n> Quoted statement\n' : '> Quoted statement\n'));
        break;
      case 'bullet':
        setComposerContent((prev) => (prev ? prev + '\n- Item one\n- Item two\n' : '- Item one\n- Item two\n'));
        break;
      case 'code':
        setComposerContent((prev) => prev + ' `inline_code()` ');
        break;
      case 'link':
        setComposerContent((prev) => prev + ' [Resource Link](https://fingermobile.io) ');
        break;
    }
    triggerToast(`Inserted markdown ${syntax}`, 'info');
  };

  // Handle Post Creation with Mandated Category Selection & Attachments
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setComposerError(null);

    if (!composerContent.trim()) {
      setComposerError('Please write your discussion content before posting.');
      return;
    }

    // MANDATORY CATEGORY SELECTION VALIDATION
    if (!composerCategory) {
      setComposerError('Mandatory: Please select a category from the dropdown to publish your post.');
      return;
    }

    const matchedCat = apiCategories.find((c) => c.id === composerCategory || c.name === composerCategory);
    const categoryLabel = matchedCat ? `${matchedCat.icon} ${matchedCat.name}` : composerCategory;

    const matchedProd = PRODUCT_CATALOG_OPTIONS.find((p) => p.id === taggedProduct);

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      title: composerTitle.trim() || 'Community Discussion',
      content: composerContent.trim(),
      authorName: 'Israel Mbah',
      authorHandle: '@israel_protocol',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      authorRole: 'Protocol Architect',
      categoryName: categoryLabel,
      createdAt: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isBookmarked: false,
      tags: composerTags
        ? composerTags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Community'],
      isVerified: true,
      mediaUrl: attachedMedia || undefined,
      poll: attachedPoll || undefined,
      event: attachedEvent || undefined,
      fileAttachment: attachedFile || undefined,
      linkEmbed: attachedLink || undefined,
      locationTag: attachedLocation || undefined,
      audioPreview: attachedStem || undefined,
      videoStreamUrl: attachedStream || undefined,
      taggedProduct: matchedProd
        ? { platform: matchedProd.platform, name: matchedProd.name, price: matchedProd.price }
        : undefined,
      commentsList: [],
    };

    setPosts([newPost, ...posts]);
    setComposerTitle('');
    setComposerContent('');
    setComposerCategory('');
    setComposerTags('');
    setTaggedProduct('');
    setAttachedMedia(null);
    setAttachedPoll(null);
    setAttachedEvent(null);
    setAttachedFile(null);
    setAttachedLink(null);
    setAttachedLocation(null);
    setAttachedStem(null);
    setAttachedStream(null);
    setActiveComposerTool(null);
    setShowAdvancedTools(false);
    setShowSettingsAccordion(false);
    setComposerError(null);
    triggerToast(`Post published to ${categoryLabel} successfully!`, 'success');

    // Asynchronous backend dispatch
    ForumService.createThread({
      title: newPost.title,
      content: newPost.content,
      categoryId: composerCategory,
      tags: newPost.tags,
      mediaUrls: attachedMedia ? [attachedMedia] : undefined,
    }).catch((err) => console.log('Async forum service dispatch:', err));
  };

  // Like Toggle with optimistic update + backend dispatch
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          const newLikes = isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1);
          if (isLiked) {
            ForumService.likePost(postId).catch(() => {});
            triggerToast('Added to liked posts', 'info');
          } else {
            ForumService.unlikePost(postId).catch(() => {});
            triggerToast('Removed from liked posts', 'info');
          }
          return {
            ...p,
            isLiked,
            likesCount: newLikes,
          };
        }
        return p;
      })
    );
  };

  // Bookmark Toggle with optimistic update + backend dispatch
  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isBookmarked = !p.isBookmarked;
          if (isBookmarked) {
            ForumService.savePost(postId).catch(() => {});
            triggerToast('Post bookmarked to library', 'success');
          } else {
            ForumService.unsavePost(postId).catch(() => {});
            triggerToast('Removed from bookmarks', 'info');
          }
          return { ...p, isBookmarked };
        }
        return p;
      })
    );
  };

  // Share Post handler
  const handleSharePost = (post: FeedPost) => {
    const url = `${window.location.origin}/forum-draft#${post.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        triggerToast('Thread link copied to clipboard!', 'success');
      });
    } else {
      triggerToast('Share URL: ' + url, 'info');
    }
  };

  // Toggle comments section
  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Add Comment Reply to a Feed Post
  const handlePostComment = (postId: string) => {
    const commentText = (commentInputTexts[postId] || '').trim();
    if (!commentText) return;

    const newComment: FeedComment = {
      id: `comment-${Date.now()}`,
      authorName: 'Israel Mbah',
      authorHandle: '@israel_protocol',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      text: commentText,
      createdAt: 'Just now',
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const currentComments = p.commentsList || [];
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            commentsList: [newComment, ...currentComments],
          };
        }
        return p;
      })
    );

    setCommentInputTexts((prev) => ({ ...prev, [postId]: '' }));
    triggerToast('Comment posted successfully!', 'success');

    // Async backend post dispatch
    ForumService.createPost({
      content: commentText,
      threadId: postId,
    }).catch(() => {});
  };

  // Vote on Poll in Feed Card
  const handleVotePoll = (postId: string, optionIdx: number) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.poll && p.poll.userVotedIndex === undefined) {
          const updatedOptions = p.poll.options.map((opt, idx) =>
            idx === optionIdx ? { ...opt, votes: opt.votes + 1 } : opt
          );
          triggerToast('Vote recorded on sovereign poll!', 'success');
          return {
            ...p,
            poll: {
              ...p.poll,
              options: updatedOptions,
              totalVotes: p.poll.totalVotes + 1,
              userVotedIndex: optionIdx,
            },
          };
        }
        return p;
      })
    );
  };

  // RSVP to Event in Feed Card
  const handleRsvpEvent = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && p.event) {
          const isRsvpd = !p.event.isRsvpd;
          triggerToast(isRsvpd ? 'RSVP Confirmed! Calendar invitation added.' : 'RSVP Cancelled', 'info');
          return {
            ...p,
            event: {
              ...p.event,
              isRsvpd,
              rsvpCount: isRsvpd ? p.event.rsvpCount + 1 : Math.max(0, p.event.rsvpCount - 1),
            },
          };
        }
        return p;
      })
    );
  };

  // Product Navigation Handler
  const handleProductNavigate = (platform: string) => {
    const plat = platform.toLowerCase();
    if (plat.includes('flamingo')) {
      navigate('/flamingo');
    } else if (plat.includes('ownit')) {
      navigate('/ownit');
    } else if (plat.includes('fingerlux')) {
      navigate('/fingerlux');
    } else if (plat.includes('storefront')) {
      navigate('/storefront');
    } else {
      navigate('/marketplace');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-20">
      {/* ========================================================================= */}
      {/* 1. LEVEL 2 CONTEXT BAR & SUB-NAVIGATION                                   */}
      {/* Features: Context Title, Mini Drawer Dropdown, New Navigation Items        */}
      {/* ========================================================================= */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Context Title & Mini Drawer */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/forum-draft')}>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-sm font-bold text-sm">
                  FM
                </div>
                <span className="text-base font-black tracking-tight text-slate-900 hidden sm:inline">
                  Forum & Community
                </span>
              </div>

              {/* Tiny Dropdown Menu / Mini Drawer: Blog | Gems | Hallmarks | Groups | LoanSqr | Camus */}
              <div className="relative">
                <button
                  onClick={() => setShowMiniDrawer(!showMiniDrawer)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition"
                  title="Explore Platform Spaces & Modules"
                >
                  <SparklesIcon className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-bold">Explore</span>
                  <ChevronDownIcon className="w-3 h-3 text-slate-400" />
                </button>

                {showMiniDrawer && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 py-1.5 flex items-center justify-between">
                      <span>Platform Modules</span>
                      <span className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">6 Items</span>
                    </div>
                    <div className="space-y-1">
                      {MINI_DRAWER_ITEMS.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setShowMiniDrawer(false);
                            navigate(item.path);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-slate-50 transition group"
                        >
                          <div>
                            <div className="text-xs font-bold text-slate-800 group-hover:text-orange-600 transition flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${item.iconColor.replace('text-', 'bg-')}`} />
                              {item.name}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{item.description}</div>
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {item.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Level 2 Sub-Navigation: Lush Pressies -> Dancia-4tv -> Marketplace -> PhotoCredits -> BeatwaveNG */}
            <nav className="hidden md:flex items-center space-x-1">
              {SUB_NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSubNav(item.id);
                    navigate(item.path);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeSubNav === item.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            {/* Forum Context Search */}
            <div className="relative w-44 sm:w-60">
              <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search forum & topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-150 focus:bg-white rounded-lg border border-transparent focus:border-orange-500 focus:outline-none transition"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5 space-y-6">
        {/* ========================================================================= */}
        {/* 2. H2-LARGE: 3 COLUMN / 3 CARD PROMOTION / MONETIZATION HERO               */}
        {/* Card 1: Sponsored content | Programmatic ad                               */}
        {/* Card 2: Canary Sponsor ("Summer Mega Sale - Up to 70% Off")                */}
        {/* Card 3: Live Vault (toggle visibility, not always visible!)               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Sponsored Content / HD Programmatic */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-4 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/10 text-indigo-200 px-2 py-0.5 rounded-full border border-white/10">
                  HD Programmatic
                </span>
                <span className="text-[10px] font-bold text-slate-400">Auto-Ad</span>
              </div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <SparklesIcon className="w-4 h-4 text-indigo-400" />
                AdSense / AdMob Verified
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Algorithmic placement tailored to member interests across the sovereign creator network.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Sovereign CPM</span>
              <button
                onClick={() => navigate('/camus')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
              >
                Place Your Ad Here →
              </button>
            </div>
          </div>

          {/* Card 2: Canary Sponsor */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/20">
                  Canary Sponsor
                </span>
                <span className="text-[10px] font-bold text-orange-100">FingerMobile Studio</span>
              </div>
              <h3 className="text-sm font-black text-white">
                Summer Mega Sale — Up to 70% Off
              </h3>
              <p className="text-xs text-orange-50 mt-1 leading-relaxed">
                Shop exclusive sovereign developer kits, hardware keycards, and creator drops with instant delivery.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-white/20 flex items-center gap-2">
              <button
                onClick={() => navigate('/marketplace')}
                className="px-3 py-1.5 text-xs font-bold bg-white text-orange-600 hover:bg-orange-50 rounded-lg shadow-sm transition"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate('/canary/ad-maker')}
                className="px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/10 rounded-lg transition"
              >
                Ad Specs & Pricing
              </button>
            </div>
          </div>

          {/* Card 3: Live Vault (Toggle Visibility - Not Always Visible!) */}
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-4 border border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    Live Vault
                  </span>
                </div>
                {/* Toggle Visibility Button */}
                <button
                  onClick={() => setIsVaultVisible(!isVaultVisible)}
                  className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-md transition"
                  title={isVaultVisible ? 'Hide Balances' : 'Show Balances'}
                >
                  {isVaultVisible ? (
                    <>
                      <EyeSlashIcon className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <EyeIcon className="w-3.5 h-3.5" />
                      <span>Reveal</span>
                    </>
                  )}
                </button>
              </div>

              {/* Financial Balances with Toggle Mask */}
              <div className="space-y-1.5 mt-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">FIC Tokens</span>
                  <span className="text-sm font-black text-amber-400 font-mono">
                    {isVaultVisible ? '1,450.5 FIC' : '•••••• FIC'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Live Wallet</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">
                    {isVaultVisible ? '$320.00 USD' : '•••••• USD'}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Pending Earn</span>
                  <span className="text-xs font-medium text-slate-400 font-mono">
                    {isVaultVisible ? '82.20 FIC' : '•••••• FIC'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-800/80">
              <button
                onClick={() => navigate('/financials')}
                className="w-full py-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition text-center"
              >
                Manage Wallet →
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PROPORTIONAL 3-COLUMN ARCHITECTURE                                      */}
        {/* Left (~260px): Identity, Privacy, Rewards, Livestream Link                */}
        {/* Center (~700px): Mii(™®©℠), Composer, Feed with In-Feed Injection Algo     */}
        {/* Right (~300px): Communities, Recognition, Storefront                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================================= */}
          {/* LEFT RAIL (3 cols): IDENTITY, PRIVACY, REWARDS & #LIVESTREAM            */}
          {/* ======================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            {/* 1. Sovereign Universal ProfileCard */}
            <UniversalProfileCard />

            {/* #Livestream Link Visible Under Profile Cards (As Requested) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3">
              <button
                onClick={() => setIsLiveStudioOpen(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 hover:from-rose-500/20 hover:to-orange-500/20 border border-rose-200/50 transition group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-black text-rose-600 group-hover:text-rose-700">
                    #Livestream UGC Studio
                  </span>
                </div>
                <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                  GO LIVE
                </span>
              </button>
              <button
                onClick={() => navigate('/live-streaming')}
                className="w-full mt-2 text-[10px] font-semibold text-slate-400 hover:text-slate-600 text-center transition"
              >
                Or open dedicated streaming hub →
              </button>
            </div>

            {/* 2. Privacy & Security Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                  Privacy Status
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Consent Verified
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <LockClosedIcon className="w-3.5 h-3.5 text-slate-400" /> PIN Protection
                  </span>
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">••22</span>
                </div>

                <div className="flex items-center justify-between text-slate-600 pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <EyeIcon className="w-3.5 h-3.5 text-slate-400" /> Incognito Mode
                  </span>
                  <button
                    onClick={() => setIncognitoMode(!incognitoMode)}
                    className={`text-[10px] font-black px-2 py-0.5 rounded transition ${
                      incognitoMode
                        ? 'bg-orange-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {incognitoMode ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Lush Rewards & Gamification Module */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <SparklesIcon className="w-4 h-4 text-amber-500" />
                  Lush Rewards
                </span>
                <span className="text-xs font-black text-amber-600">Level 7</span>
              </div>

              <div className="space-y-1 my-2">
                <div className="flex justify-between text-[11px] font-medium text-slate-500">
                  <span>4,200 XP</span>
                  <span>5,000 XP</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full w-[84%]" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2 text-xs">
                <span className="flex items-center gap-1 font-bold text-slate-800">
                  <FireIcon className="w-4 h-4 text-orange-500" /> 26 Day Streak
                </span>
                <button
                  onClick={() => navigate('/hallmarks')}
                  className="text-[11px] font-bold text-orange-600 hover:text-orange-700"
                >
                  View Badges
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* CENTER RAIL (6 cols): Mii(™®©℠), COMPOSER, CATEGORIES & IN-FEED ALGO     */}
          {/* ======================================================================= */}
          <div className="lg:col-span-6 space-y-4">
            {/* 1. Mii(™®©℠) Disappearing (48h) — (Reverted & Relabeled as Requested) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-orange-500" />
                  Mii(™®©℠) Disappearing (48h)
                </span>
                <span className="text-[10px] text-slate-400 font-medium">MiTM Sovereign</span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                {/* Create Mii Button */}
                <button
                  onClick={() => alert('Mii(™®©℠) Creator: Record an ephemeral 15-second audio, photo, or status snippet.')}
                  className="flex-shrink-0 flex flex-col items-center gap-1 group"
                >
                  <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-orange-400 bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-105 transition shadow-xs">
                    <PlusIcon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700">Your Mii</span>
                </button>

                {/* Member Mii Stories */}
                {miiStories.map((mii) => (
                  <button
                    key={mii.id}
                    onClick={() => setSelectedMii(mii)}
                    className="flex-shrink-0 flex flex-col items-center gap-1 group text-left"
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl p-0.5 transition group-hover:scale-105 shadow-xs ${
                        mii.isViewed
                          ? 'border border-slate-200 bg-slate-50'
                          : 'bg-gradient-to-tr from-orange-500 via-amber-400 to-rose-500'
                      }`}
                    >
                      <img
                        src={mii.avatar}
                        alt={mii.author}
                        className="w-full h-full rounded-[14px] object-cover border border-white"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-800 max-w-[60px] truncate text-center">
                      {mii.author.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mii Story Modal Preview */}
            {selectedMii && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-150">
                  <div className="relative h-80">
                    <img src={selectedMii.mediaUrl} alt={selectedMii.author} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                    <button
                      onClick={() => setSelectedMii(null)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <img src={selectedMii.avatar} alt={selectedMii.author} className="w-8 h-8 rounded-full border border-white" />
                      <div>
                        <div className="text-xs font-bold text-white">{selectedMii.author}</div>
                        <div className="text-[10px] text-orange-300">{selectedMii.expiresIn}</div>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-medium">
                      {selectedMii.caption}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900 text-white flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">Mii(™®©℠) Sovereign Ephemeral</span>
                    <button
                      onClick={() => setSelectedMii(null)}
                      className="px-3 py-1 bg-orange-500 rounded-lg font-bold hover:bg-orange-600"
                    >
                      Close Story
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Feed Navigation Modes */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[
                  { id: 'for_you', label: 'For You' },
                  { id: 'following', label: 'Following' },
                  { id: 'recent', label: 'Recent' },
                  { id: 'trending', label: 'Trending' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setFeedMode(mode.id as any)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                      feedMode === mode.id
                        ? 'bg-orange-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="text-[11px] text-slate-400 font-medium pr-2">
                {filteredPosts.length} Discussions
              </div>
            </div>

            {/* 3. Horizontal Scrollable Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  selectedCategoryId === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                🌐 All Categories ({apiCategories.length})
              </button>
              {apiCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.name)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1 ${
                    selectedCategoryId === cat.name
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>

            {/* 4. COMPREHENSIVE POST COMPOSER */}
            {/* Header: CREATE A POST. Prompt: [Join Us, Share Your Moments...] */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
              <form onSubmit={handleCreatePost} className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <SparklesIcon className="w-4 h-4 text-orange-500" />
                    CREATE A POST.
                  </h4>
                  {/* Write vs Preview Mode Toggle */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setComposerTab('write')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${
                        composerTab === 'write' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setComposerTab('preview')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition flex items-center gap-1 ${
                        composerTab === 'preview' ? 'bg-white text-orange-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <EyeIcon className="w-3 h-3" />
                      Preview
                    </button>
                  </div>
                </div>

                {/* Validation Error Banner */}
                {composerError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                    <ExclamationCircleIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{composerError}</span>
                  </div>
                )}

                {/* Markdown Formatting Quick Bar (Visible in Write Mode) */}
                {composerTab === 'write' && (
                  <div className="flex flex-wrap items-center gap-1 py-1 px-2 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600">
                    <span className="text-[10px] font-mono font-bold text-slate-400 mr-1 uppercase">Markdown:</span>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('bold')}
                      className="px-1.5 py-0.5 rounded text-xs font-bold hover:bg-slate-200 transition"
                      title="Bold (**text**)"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('italic')}
                      className="px-1.5 py-0.5 rounded text-xs italic font-serif hover:bg-slate-200 transition"
                      title="Italic (*text*)"
                    >
                      I
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('heading')}
                      className="px-1.5 py-0.5 rounded text-xs font-black hover:bg-slate-200 transition"
                      title="H3 Heading (### text)"
                    >
                      H
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('quote')}
                      className="px-1.5 py-0.5 rounded text-xs font-serif hover:bg-slate-200 transition"
                      title="Quote (> text)"
                    >
                      “ ”
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('bullet')}
                      className="px-1.5 py-0.5 rounded text-xs hover:bg-slate-200 transition"
                      title="Bullet list (- item)"
                    >
                      <ListBulletIcon className="w-3.5 h-3.5 inline" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('code')}
                      className="px-1.5 py-0.5 rounded text-xs font-mono hover:bg-slate-200 transition"
                      title="Inline Code (`code`)"
                    >
                      <CodeBracketIcon className="w-3.5 h-3.5 inline" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdownSyntax('link')}
                      className="px-1.5 py-0.5 rounded text-xs hover:bg-slate-200 transition"
                      title="Link ([title](url))"
                    >
                      <LinkIcon className="w-3 h-3 inline" />
                    </button>
                  </div>
                )}

                {/* Main Content Area: Write vs Preview */}
                {composerTab === 'write' ? (
                  <div className="flex items-start gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                      alt="Current Member"
                      className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="w-full space-y-2">
                      <input
                        type="text"
                        placeholder="Discussion Title..."
                        value={composerTitle}
                        onChange={(e) => setComposerTitle(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-bold bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500"
                      />

                      <textarea
                        rows={showAdvancedTools ? 4 : 3}
                        placeholder="Join Us, Share Your Moments..."
                        value={composerContent}
                        onChange={(e) => {
                          setComposerContent(e.target.value);
                          if (composerError) setComposerError(null);
                        }}
                        className={`w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 rounded-xl border focus:outline-none resize-none transition font-sans ${
                          visualGlow ? 'ring-2 ring-orange-400 border-orange-400' : 'border-slate-200 focus:border-orange-500'
                        }`}
                      />
                    </div>
                  </div>
                ) : (
                  /* LIVE MARKDOWN PREVIEW TAB */
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 min-h-[140px]">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Live Markdown Preview
                    </div>
                    {composerTitle && (
                      <h3 className="text-base font-black text-slate-900 border-b border-slate-200 pb-1">
                        {composerTitle}
                      </h3>
                    )}
                    {composerContent ? (
                      <div className="text-xs text-slate-700 space-y-2 whitespace-pre-wrap leading-relaxed">
                        {composerContent.split('\n\n').map((block, bIdx) => {
                          if (block.startsWith('### ')) {
                            return (
                              <h4 key={bIdx} className="text-sm font-black text-orange-600 mt-2">
                                {block.replace('### ', '')}
                              </h4>
                            );
                          }
                          if (block.startsWith('> ')) {
                            return (
                              <blockquote key={bIdx} className="border-l-4 border-orange-500 pl-3 italic text-slate-600 my-1">
                                {block.replace('> ', '')}
                              </blockquote>
                            );
                          }
                          if (block.startsWith('- ')) {
                            return (
                              <ul key={bIdx} className="list-disc list-inside space-y-0.5 text-slate-800">
                                {block.split('\n').map((line, lIdx) => (
                                  <li key={lIdx}>{line.replace(/^- /, '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          return <p key={bIdx}>{block}</p>;
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No content written yet. Switch to Write tab to compose.</p>
                    )}

                    {/* Preview of Attachments in Preview Mode */}
                    {attachedMedia && (
                      <div className="rounded-xl overflow-hidden max-h-48 border border-slate-200 mt-2">
                        <img src={attachedMedia} alt="Preview Attachment" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                )}

                {/* Active Attached Badges Container */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {attachedMedia && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg text-[11px] font-bold">
                      <CameraIcon className="w-3.5 h-3.5" />
                      <span>Photo/Video Attached</span>
                      <button type="button" onClick={() => setAttachedMedia(null)} className="hover:text-sky-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedPoll && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-[11px] font-bold">
                      <ChartBarIcon className="w-3.5 h-3.5" />
                      <span>Poll: {attachedPoll.question}</span>
                      <button type="button" onClick={() => setAttachedPoll(null)} className="hover:text-purple-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedEvent && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[11px] font-bold">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Event: {attachedEvent.title} ({attachedEvent.date})</span>
                      <button type="button" onClick={() => setAttachedEvent(null)} className="hover:text-emerald-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedFile && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-[11px] font-bold">
                      <PaperClipIcon className="w-3.5 h-3.5" />
                      <span>File: {attachedFile.name} ({attachedFile.size})</span>
                      <button type="button" onClick={() => setAttachedFile(null)} className="hover:text-indigo-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedLink && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[11px] font-bold">
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Link: {attachedLink.title || attachedLink.url}</span>
                      <button type="button" onClick={() => setAttachedLink(null)} className="hover:text-blue-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedLocation && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[11px] font-bold">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span>{attachedLocation}</span>
                      <button type="button" onClick={() => setAttachedLocation(null)} className="hover:text-rose-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedStem && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-[11px] font-bold">
                      <MusicalNoteIcon className="w-3.5 h-3.5" />
                      <span>Stem: {attachedStem}</span>
                      <button type="button" onClick={() => setAttachedStem(null)} className="hover:text-orange-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedStream && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 rounded-lg text-[11px] font-bold">
                      <TvIcon className="w-3.5 h-3.5" />
                      <span>Stream: {attachedStream}</span>
                      <button type="button" onClick={() => setAttachedStream(null)} className="hover:text-fuchsia-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {taggedProduct && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] font-bold">
                      <ShoppingBagIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>Tagged: {PRODUCT_CATALOG_OPTIONS.find((p) => p.id === taggedProduct)?.name}</span>
                      <button type="button" onClick={() => setTaggedProduct('')} className="hover:text-amber-950 font-black ml-1">✕</button>
                    </div>
                  )}
                </div>

                {/* Advanced Tool Row 1: Action Icons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1 text-slate-500">
                    {/* Camera Icon for Photo / Video */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'media' ? null : 'media')}
                      className={`p-1.5 rounded-lg transition ${
                        activeComposerTool === 'media' ? 'bg-orange-500 text-white' : 'hover:bg-slate-100 hover:text-orange-500'
                      }`}
                      title="Camera (Photo/Video)"
                    >
                      <CameraIcon className="w-4 h-4" />
                    </button>

                    {/* Poll */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'poll' ? null : 'poll')}
                      className={`p-1.5 rounded-lg transition ${
                        activeComposerTool === 'poll' ? 'bg-purple-600 text-white' : 'hover:bg-slate-100 hover:text-purple-600'
                      }`}
                      title="Poll Creator"
                    >
                      <ChartBarIcon className="w-4 h-4" />
                    </button>

                    {/* Event */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'event' ? null : 'event')}
                      className={`p-1.5 rounded-lg transition ${
                        activeComposerTool === 'event' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100 hover:text-emerald-600'
                      }`}
                      title="Event Scheduler"
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </button>

                    {/* File */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'file' ? null : 'file')}
                      className={`p-1.5 rounded-lg transition ${
                        activeComposerTool === 'file' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 hover:text-indigo-600'
                      }`}
                      title="File Attachment"
                    >
                      <PaperClipIcon className="w-4 h-4" />
                    </button>

                    {/* Links */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'link' ? null : 'link')}
                      className={`p-1.5 rounded-lg transition ${
                        activeComposerTool === 'link' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 hover:text-blue-600'
                      }`}
                      title="Link Inserter"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>

                    {/* Location */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'location' ? null : 'location')}
                      className={`p-1.5 rounded-lg transition ${
                        activeComposerTool === 'location' ? 'bg-rose-600 text-white' : 'hover:bg-slate-100 hover:text-rose-600'
                      }`}
                      title="Location Tag"
                    >
                      <MapPinIcon className="w-4 h-4" />
                    </button>

                    {/* 5D Icons / Smileys / GIFs */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'emoji' ? null : 'emoji')}
                      className={`p-1.5 rounded-lg transition ${
                        activeComposerTool === 'emoji' ? 'bg-amber-500 text-white' : 'hover:bg-slate-100 hover:text-amber-500'
                      }`}
                      title="5D Smileys & Reactions"
                    >
                      <FaceSmileIcon className="w-4 h-4" />
                    </button>

                    {/* BeatwaveNG Audio Embed */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'beatwave' ? null : 'beatwave')}
                      className={`p-1.5 rounded-lg transition ${
                        activeComposerTool === 'beatwave' ? 'bg-orange-600 text-white' : 'hover:bg-orange-50 text-orange-600'
                      }`}
                      title="BeatwaveNG Track"
                    >
                      <MusicalNoteIcon className="w-4 h-4" />
                    </button>

                    {/* Dancia-4Tv Video Stream Embed */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'dancia' ? null : 'dancia')}
                      className={`p-1.5 rounded-lg transition ${
                        activeComposerTool === 'dancia' ? 'bg-purple-600 text-white' : 'hover:bg-purple-50 text-purple-600'
                      }`}
                      title="Dancia-4Tv Stream"
                    >
                      <TvIcon className="w-4 h-4" />
                    </button>

                    {/* ▼ Product Tagger Dropdown: Marketplace/Flamingo/Ownit/Storefront/FingerLux Items/Products */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowProductDropdown(!showProductDropdown)}
                        className="px-2 py-1 text-[11px] font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition"
                      >
                        <ShoppingBagIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Tag Product ▼</span>
                      </button>

                      {showProductDropdown && (
                        <div className="absolute left-0 bottom-8 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in duration-100">
                          <div className="text-[10px] font-black uppercase text-slate-400 px-2 py-1">
                            Marketplace / Flamingo / OwnIt / Storefront / FingerLux
                          </div>
                          <div className="space-y-1">
                            {PRODUCT_CATALOG_OPTIONS.map((prod) => (
                              <button
                                key={prod.id}
                                type="button"
                                onClick={() => {
                                  setTaggedProduct(prod.id);
                                  setShowProductDropdown(false);
                                  triggerToast(`Tagged product: ${prod.name}`, 'info');
                                }}
                                className="w-full text-left p-1.5 rounded-lg hover:bg-orange-50 text-xs font-semibold text-slate-800 flex justify-between items-center"
                              >
                                <div>
                                  <div className="text-[11px] font-bold text-slate-900">{prod.name}</div>
                                  <div className="text-[9px] text-slate-400">{prod.platform}</div>
                                </div>
                                <span className="text-[10px] font-mono text-orange-600 font-bold">{prod.price}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                {/* ================================================================= */}
                {/* INTERACTIVE TOOL SUB-PANELS (Replacing Alert Duds)                */}
                {/* ================================================================= */}
                {activeComposerTool === 'media' && (
                  <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-900 flex items-center gap-1.5">
                        <CameraIcon className="w-4 h-4 text-sky-600" />
                        Attach Media Image or Video URL
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-sky-600 font-bold">✕ Close</button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Paste image/media URL (https://...)"
                        value={mediaInputUrl}
                        onChange={(e) => setMediaInputUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-sky-200 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (mediaInputUrl.trim()) {
                            setAttachedMedia(mediaInputUrl.trim());
                            setMediaInputUrl('');
                            setActiveComposerTool(null);
                            triggerToast('Media attached to post!', 'success');
                          }
                        }}
                        className="px-3 py-1.5 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-700"
                      >
                        Attach
                      </button>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <span className="text-[10px] text-sky-600 font-semibold">Presets:</span>
                      {[
                        { label: 'Studio Stems', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000' },
                        { label: 'Keycard NFC', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000' },
                        { label: 'Escrow Gift', url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=1000' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setAttachedMedia(preset.url);
                            setActiveComposerTool(null);
                            triggerToast(`Attached preset: ${preset.label}`, 'success');
                          }}
                          className="text-[10px] bg-white px-2 py-0.5 rounded border border-sky-200 text-sky-800 hover:bg-sky-100"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeComposerTool === 'poll' && (
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <ChartBarIcon className="w-4 h-4 text-purple-600" />
                        Create Sovereign Community Poll
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-purple-600 font-bold">✕ Close</button>
                    </div>
                    <input
                      type="text"
                      placeholder="Poll Question (e.g. Which feature should we prioritize next?)"
                      value={pollDraft.question}
                      onChange={(e) => setPollDraft({ ...pollDraft, question: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Option 1"
                        value={pollDraft.opt1}
                        onChange={(e) => setPollDraft({ ...pollDraft, opt1: e.target.value })}
                        className="px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Option 2"
                        value={pollDraft.opt2}
                        onChange={(e) => setPollDraft({ ...pollDraft, opt2: e.target.value })}
                        className="px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Option 3 (Optional)"
                        value={pollDraft.opt3}
                        onChange={(e) => setPollDraft({ ...pollDraft, opt3: e.target.value })}
                        className="px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Option 4 (Optional)"
                        value={pollDraft.opt4}
                        onChange={(e) => setPollDraft({ ...pollDraft, opt4: e.target.value })}
                        className="px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-[11px] text-purple-700">
                        <span>Duration:</span>
                        <select
                          value={pollDraft.days}
                          onChange={(e) => setPollDraft({ ...pollDraft, days: Number(e.target.value) })}
                          className="bg-white border border-purple-200 rounded px-1.5 py-0.5 text-xs font-semibold"
                        >
                          <option value={1}>24 Hours</option>
                          <option value={3}>3 Days</option>
                          <option value={7}>7 Days</option>
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (pollDraft.question.trim() && pollDraft.opt1.trim() && pollDraft.opt2.trim()) {
                            const optionsList = [pollDraft.opt1.trim(), pollDraft.opt2.trim()];
                            if (pollDraft.opt3.trim()) optionsList.push(pollDraft.opt3.trim());
                            if (pollDraft.opt4.trim()) optionsList.push(pollDraft.opt4.trim());
                            setAttachedPoll({
                              question: pollDraft.question.trim(),
                              options: optionsList.map((t) => ({ text: t, votes: 0 })),
                              totalVotes: 0,
                              durationDays: pollDraft.days,
                            });
                            setActiveComposerTool(null);
                            triggerToast('Community poll attached!', 'success');
                          } else {
                            triggerToast('Please provide a question and at least 2 options.', 'error');
                          }
                        }}
                        className="px-3 py-1.5 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700"
                      >
                        Attach Poll
                      </button>
                    </div>
                  </div>
                )}

                {activeComposerTool === 'event' && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-emerald-600" />
                        Schedule Community Event / RSVP
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-emerald-600 font-bold">✕ Close</button>
                    </div>
                    <input
                      type="text"
                      placeholder="Event Title (e.g. Sovereign Keycard Onboarding Workshop)"
                      value={eventDraft.title}
                      onChange={(e) => setEventDraft({ ...eventDraft, title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Date (e.g. Oct 15, 2026)"
                        value={eventDraft.date}
                        onChange={(e) => setEventDraft({ ...eventDraft, date: e.target.value })}
                        className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Time (e.g. 18:00 WAT)"
                        value={eventDraft.time}
                        onChange={(e) => setEventDraft({ ...eventDraft, time: e.target.value })}
                        className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Location / Link"
                        value={eventDraft.location}
                        onChange={(e) => setEventDraft({ ...eventDraft, location: e.target.value })}
                        className="px-3 py-1.5 bg-white border border-emerald-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (eventDraft.title.trim()) {
                            setAttachedEvent({
                              title: eventDraft.title.trim(),
                              date: eventDraft.date.trim() || 'Upcoming',
                              time: eventDraft.time.trim() || 'TBA',
                              location: eventDraft.location.trim() || 'Online Stream',
                              rsvpCount: 1,
                              isRsvpd: true,
                            });
                            setActiveComposerTool(null);
                            triggerToast('Event scheduled and attached!', 'success');
                          }
                        }}
                        className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
                      >
                        Attach Event
                      </button>
                    </div>
                  </div>
                )}

                {activeComposerTool === 'file' && (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <PaperClipIcon className="w-4 h-4 text-indigo-600" />
                        Attach Document or Sovereign Whitepaper
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-indigo-600 font-bold">✕ Close</button>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Document Name (e.g. FingerMobile_Protocol_Whitepaper_v2.4.pdf)"
                        value={fileDraftName}
                        onChange={(e) => setFileDraftName(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (fileDraftName.trim()) {
                            setAttachedFile({
                              name: fileDraftName.trim(),
                              size: '3.4 MB',
                              type: 'PDF',
                            });
                            setFileDraftName('');
                            setActiveComposerTool(null);
                            triggerToast('Document file attached!', 'success');
                          }
                        }}
                        className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700"
                      >
                        Attach File
                      </button>
                    </div>
                  </div>
                )}

                {activeComposerTool === 'link' && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4 text-blue-600" />
                        Embed External Resource Link
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-blue-600 font-bold">✕ Close</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="url"
                        placeholder="URL (https://fingermobile.io/...)"
                        value={linkInputUrl}
                        onChange={(e) => setLinkInputUrl(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Link Title (e.g. Sovereign Keycard Specs)"
                        value={linkInputTitle}
                        onChange={(e) => setLinkInputTitle(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (linkInputUrl.trim()) {
                            try {
                              const parsed = new URL(linkInputUrl.trim());
                              setAttachedLink({
                                url: linkInputUrl.trim(),
                                title: linkInputTitle.trim() || parsed.hostname,
                                domain: parsed.hostname,
                              });
                            } catch {
                              setAttachedLink({
                                url: linkInputUrl.trim(),
                                title: linkInputTitle.trim() || 'External Resource',
                                domain: 'external',
                              });
                            }
                            setLinkInputUrl('');
                            setLinkInputTitle('');
                            setActiveComposerTool(null);
                            triggerToast('Rich link preview attached!', 'success');
                          }
                        }}
                        className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                      >
                        Attach Link
                      </button>
                    </div>
                  </div>
                )}

                {activeComposerTool === 'location' && (
                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 flex items-center gap-1.5">
                        <MapPinIcon className="w-4 h-4 text-rose-600" />
                        Select Geographic Hub or Metaverse Node
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-rose-600 font-bold">✕ Close</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Victoria Island Studio Hub, Lagos',
                        'Abuja Central Sovereign Node',
                        'Soho Creative Quarter, London',
                        'Brooklyn Cyber Alley, New York',
                        'Sovereign Meshnet Global #1',
                      ].map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => {
                            setAttachedLocation(loc);
                            setActiveComposerTool(null);
                            triggerToast(`Location pinned: ${loc}`, 'success');
                          }}
                          className="px-2.5 py-1 bg-white border border-rose-200 rounded-lg text-rose-800 hover:bg-rose-100 font-semibold text-[11px]"
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeComposerTool === 'emoji' && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <FaceSmileIcon className="w-4 h-4 text-amber-600" />
                        5D Reactive Smileys & Protocol Reactions
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-amber-600 font-bold">✕ Close</button>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xl p-2 bg-white rounded-xl border border-amber-200">
                      {['🔥', '🚀', '💎', '🇳🇬', '🎵', '🕺', '👑', '✨', '⚡', '🛡️', '🌐', '💼', '🎧', '🌟', '🎙️', '💡'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => {
                            setComposerContent((prev) => prev + ` ${emoji} `);
                            triggerToast(`Added ${emoji}`, 'info');
                          }}
                          className="hover:scale-125 transition transform p-1"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeComposerTool === 'beatwave' && (
                  <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-900 flex items-center gap-1.5">
                        <MusicalNoteIcon className="w-4 h-4 text-orange-600" />
                        BeatwaveNG Audio Stem & Spatial Waveform Selector
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-orange-600 font-bold">✕ Close</button>
                    </div>
                    <div className="space-y-1">
                      {[
                        'BeatwaveNG Lossless 128BPM Spatial Stem Pack',
                        'Amapiano 118BPM Log Drum & Sub-Bass Master',
                        'Highlife Fusion 120BPM Guitars & Horns Stem',
                      ].map((stem) => (
                        <button
                          key={stem}
                          type="button"
                          onClick={() => {
                            setAttachedStem(stem);
                            setActiveComposerTool(null);
                            triggerToast(`Attached stem: ${stem}`, 'success');
                          }}
                          className="w-full text-left p-2 bg-white border border-orange-200 rounded-lg hover:bg-orange-100 font-semibold text-orange-900 text-xs flex justify-between"
                        >
                          <span>{stem}</span>
                          <span className="text-[10px] text-orange-600 font-bold uppercase">24-Bit FLAC</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeComposerTool === 'dancia' && (
                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <TvIcon className="w-4 h-4 text-purple-600" />
                        Dancia-4Tv Live Stage Broadcast Embed
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-purple-600 font-bold">✕ Close</button>
                    </div>
                    <div className="space-y-1">
                      {[
                        'Dancia-4Tv Live Stage #1: Street Dance Championship',
                        'Afrobeat Choreography Showcase (Live 4K WebRTC)',
                      ].map((stream) => (
                        <button
                          key={stream}
                          type="button"
                          onClick={() => {
                            setAttachedStream(stream);
                            setActiveComposerTool(null);
                            triggerToast(`Attached stream: ${stream}`, 'success');
                          }}
                          className="w-full text-left p-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-100 font-semibold text-purple-900 text-xs flex justify-between"
                        >
                          <span>{stream}</span>
                          <span className="text-[10px] text-purple-600 font-bold uppercase">LIVE FEED</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                  {/* Toggle Advanced Post Settings */}
                  <button
                    type="button"
                    onClick={() => setShowSettingsAccordion(!showSettingsAccordion)}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <span>Post Settings</span>
                    <ChevronDownIcon className={`w-3 h-3 transition-transform ${showSettingsAccordion ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Post Settings Accordion: Censor Post: Censorship & Tags | Media Studio | Visual Styler */}
                {showSettingsAccordion && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      <button
                        type="button"
                        onClick={() => setActiveSettingsTab('censor')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                          activeSettingsTab === 'censor' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                        }`}
                      >
                        Censor Post: Censorship & Tags
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSettingsTab('media')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                          activeSettingsTab === 'media' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                        }`}
                      >
                        Media Studio
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveSettingsTab('styler')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                          activeSettingsTab === 'styler' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/60'
                        }`}
                      >
                        Visual Styler
                      </button>
                    </div>

                    {activeSettingsTab === 'censor' && (
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Age Rating / Discretion
                          </label>
                          <select
                            value={ageRating}
                            onChange={(e) => setAgeRating(e.target.value)}
                            className="w-full py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-xs"
                          >
                            <option value="all-ages">All Ages (Safe)</option>
                            <option value="18+">18+ Mature Discretion</option>
                            <option value="24+">24+ Velvets N' Suedes Restricted</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                            Hashtags & Mentions
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Sovereign, Amapiano, Tech"
                            value={composerTags}
                            onChange={(e) => setComposerTags(e.target.value)}
                            className="w-full py-1.5 px-2 bg-white rounded-lg border border-slate-200 text-xs"
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            id="sensitiveCheck"
                            checked={sensitiveFlag}
                            onChange={(e) => setSensitiveFlag(e.target.checked)}
                            className="rounded text-orange-500"
                          />
                          <label htmlFor="sensitiveCheck" className="text-xs text-slate-700 font-medium">
                            Flag Sensitive Content / Trigger Warning
                          </label>
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === 'media' && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">Auto-Watermark Sovereign Cryptographic Hash</span>
                          <input
                            type="checkbox"
                            checked={mediaWatermark}
                            onChange={(e) => setMediaWatermark(e.target.checked)}
                            className="rounded text-orange-500"
                          />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Embeds SHA-256 provenance signature on all attached audio stems, video shorts, and high-res imagery.
                        </div>
                      </div>
                    )}

                    {activeSettingsTab === 'styler' && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-700 font-medium">Vibrant Golden Amber Card Glow</span>
                          <input
                            type="checkbox"
                            checked={visualGlow}
                            onChange={(e) => setVisualGlow(e.target.checked)}
                            className="rounded text-orange-500"
                          />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Elevates post prominence with subtle ambient lighting for master community announcements.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Mandated Category Dropdown + Set Privacy + Post Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* MANDATED CATEGORY DROPDOWN (53 Categories from DB & Catalog) */}
                    <div>
                      <select
                        value={composerCategory}
                        onChange={(e) => {
                          setComposerCategory(e.target.value);
                          if (composerError) setComposerError(null);
                        }}
                        className={`py-1.5 px-2.5 rounded-xl text-xs font-bold border transition ${
                          !composerCategory
                            ? 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-300'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                        required
                      >
                        <option value="">Category ▼ (Mandatory Selection)</option>
                        {apiCategories.map((cat) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.icon} {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* SET PRIVACY DROPDOWN */}
                    <div>
                      <select
                        value={composerPrivacy}
                        onChange={(e) => setComposerPrivacy(e.target.value as any)}
                        className="py-1.5 px-2.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold border border-slate-200"
                      >
                        <option value="public">🌐 Public (All)</option>
                        <option value="members">🔒 Verified Members</option>
                        <option value="sovereign">👑 Sovereign Only</option>
                        <option value="incognito">👁️ Incognito Mode</option>
                      </select>
                    </div>
                  </div>

                  {/* [Post] Action Button */}
                  <button
                    type="submit"
                    className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs transition hover:scale-105 active:scale-95"
                  >
                    Post Discussion
                  </button>
                </div>
              </form>
            </div>

            {/* ===================================================================== */}
            {/* 5. MAIN FEED WITH STRICT IN-FEED INJECTION ALGORITHM                   */}
            {/* Rule 1: FingerShorts Permanent after first 3 Post Cards (index 2)     */}
            {/* Rule 2: Publicitee Permanent after next 5 Post Cards (index 4)        */}
            {/* Rule 3: Discover Permanent after next 5 Post Cards (index 5)          */}
            {/* Rule 4: In-feed Ads (Canary or Google Ads)                             */}
            {/* Rule 5: Platform Agentic Media (Guardian/Sentinel) Hero Section       */}
            {/* ===================================================================== */}
            <div className="space-y-4">
              {filteredPosts.map((post, index) => (
                <React.Fragment key={post.id}>
                  {/* Post Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 hover:border-slate-300 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-900">{post.authorName}</span>
                            {post.isVerified && <CheckCircleSolidIcon className="w-3.5 h-3.5 text-blue-500" />}
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.2 rounded border border-orange-100">
                              {post.authorRole}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span>{post.authorHandle}</span>
                            <span>•</span>
                            <span>{post.createdAt}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-600">{post.categoryName}</span>
                          </div>
                        </div>
                      </div>

                      <button className="text-slate-400 hover:text-slate-600 p-1">
                        <EllipsisHorizontalIcon className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Location Pin Tag (if present) */}
                    {post.locationTag && (
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100 w-fit">
                        <MapPinIcon className="w-3.5 h-3.5" />
                        <span>{post.locationTag}</span>
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="mt-3">
                      <h3 className="text-sm font-black text-slate-900 leading-snug">{post.title}</h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>

                    {/* Media Image Embed (if present) */}
                    {post.mediaUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden max-h-72 border border-slate-100">
                        <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* INTERACTIVE POLL COMPONENT (if present) */}
                    {post.poll && (
                      <div className="mt-3 p-3.5 bg-gradient-to-br from-purple-50/60 to-slate-50 border border-purple-200/80 rounded-xl space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-purple-950 flex items-center gap-1.5">
                            <ChartBarIcon className="w-4 h-4 text-purple-600" />
                            {post.poll.question}
                          </span>
                          <span className="text-[10px] text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-full font-semibold">
                            {post.poll.totalVotes} votes • {post.poll.durationDays}d left
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {post.poll.options.map((opt, optIdx) => {
                            const isSelected = post.poll?.userVotedIndex === optIdx;
                            const percentage = post.poll && post.poll.totalVotes > 0
                              ? Math.round((opt.votes / post.poll.totalVotes) * 100)
                              : 0;

                            return (
                              <button
                                key={optIdx}
                                type="button"
                                disabled={post.poll?.userVotedIndex !== undefined}
                                onClick={() => handleVotePoll(post.id, optIdx)}
                                className={`w-full text-left p-2 rounded-xl text-xs font-semibold relative overflow-hidden transition border ${
                                  isSelected
                                    ? 'border-purple-500 bg-purple-100/80 text-purple-950 font-bold'
                                    : 'border-slate-200 bg-white hover:bg-purple-50/50 text-slate-800'
                                }`}
                              >
                                {post.poll?.userVotedIndex !== undefined && (
                                  <div
                                    className="absolute inset-y-0 left-0 bg-purple-200/50 transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  />
                                )}
                                <div className="relative flex items-center justify-between z-10">
                                  <span>{opt.text}</span>
                                  {post.poll?.userVotedIndex !== undefined && (
                                    <span className="font-mono text-[11px] font-bold text-purple-700">
                                      {percentage}% ({opt.votes})
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* INTERACTIVE EVENT COMPONENT (if present) */}
                    {post.event && (
                      <div className="mt-3 p-3.5 bg-gradient-to-r from-emerald-50/70 to-slate-50 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold flex flex-col items-center justify-center min-w-[50px]">
                            <CalendarIcon className="w-5 h-5 text-emerald-700 mb-0.5" />
                            <span className="text-[10px] uppercase tracking-wider">EVENT</span>
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{post.event.title}</h4>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                              <span>📅 {post.event.date} • {post.event.time}</span>
                              <span>📍 {post.event.location}</span>
                            </div>
                            <div className="text-[10px] font-semibold text-emerald-700 mt-1">
                              {post.event.rsvpCount} members attending
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRsvpEvent(post.id)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs flex-shrink-0 ${
                            post.event.isRsvpd
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {post.event.isRsvpd ? 'Attending ✓' : 'RSVP Now'}
                        </button>
                      </div>
                    )}

                    {/* DOCUMENT ATTACHMENT BADGE (if present) */}
                    {post.fileAttachment && (
                      <div className="mt-3 p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <PaperClipIcon className="w-4 h-4 text-indigo-600" />
                          <div>
                            <div className="font-bold text-slate-900">{post.fileAttachment.name}</div>
                            <div className="text-[10px] text-slate-500">{post.fileAttachment.size} • {post.fileAttachment.type}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerToast(`Downloading ${post.fileAttachment?.name}...`, 'info')}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition"
                        >
                          Download
                        </button>
                      </div>
                    )}

                    {/* RICH LINK EMBED CARD (if present) */}
                    {post.linkEmbed && (
                      <a
                        href={post.linkEmbed.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl flex items-center justify-between group transition block text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <LinkIcon className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-blue-700 transition">
                              {post.linkEmbed.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{post.linkEmbed.domain}</div>
                          </div>
                        </div>
                        <ArrowTopRightOnSquareIcon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                      </a>
                    )}

                    {/* BEATWAVENG AUDIO STEM EMBED (if present) */}
                    {post.audioPreview && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-orange-500 text-white rounded-lg shadow-xs">
                            <MusicalNoteIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-orange-950">{post.audioPreview}</div>
                            <div className="text-[10px] text-orange-700 font-semibold">BeatwaveNG 24-Bit Spatial Audio Stem</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => triggerToast(`Playing preview: ${post.audioPreview}`, 'info')}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1"
                        >
                          <PlayIcon className="w-3.5 h-3.5 inline" /> Play
                        </button>
                      </div>
                    )}

                    {/* DANCIA-4TV VIDEO STREAM EMBED (if present) */}
                    {post.videoStreamUrl && (
                      <div className="mt-3 p-3 bg-gradient-to-r from-purple-900 to-indigo-950 text-white rounded-xl flex items-center justify-between text-xs border border-purple-800">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-rose-500 rounded-lg text-white animate-pulse">
                            <TvIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-white">{post.videoStreamUrl}</div>
                            <div className="text-[10px] text-purple-200 flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              Live Broadcast Feed (Dancia-4Tv)
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate('/dancia4tv')}
                          className="px-3 py-1 bg-white text-purple-900 hover:bg-purple-100 text-[11px] font-bold rounded-lg transition"
                        >
                          Watch Live
                        </button>
                      </div>
                    )}

                    {/* Tagged Product Display */}
                    {post.taggedProduct && (
                      <div className="mt-3 p-2.5 bg-gradient-to-r from-slate-50 to-orange-50/40 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingBagIcon className="w-4 h-4 text-orange-500" />
                          <div>
                            <div className="text-xs font-bold text-slate-900">{post.taggedProduct.name}</div>
                            <div className="text-[10px] text-slate-400">{post.taggedProduct.platform}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-orange-600">
                            {post.taggedProduct.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleProductNavigate(post.taggedProduct?.platform || 'marketplace')}
                            className="px-2 py-1 text-[10px] font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                          >
                            View Product
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition font-semibold ${
                            post.isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                          }`}
                        >
                          {post.isLiked ? <HeartSolidIcon className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                          <span>{post.likesCount}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleComments(post.id)}
                          className={`flex items-center gap-1.5 transition font-semibold ${
                            expandedComments[post.id] ? 'text-orange-500 font-bold' : 'hover:text-slate-800'
                          }`}
                        >
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span>{post.commentsCount}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSharePost(post)}
                          className="flex items-center gap-1.5 hover:text-slate-800 transition font-semibold"
                        >
                          <ShareIcon className="w-4 h-4" />
                          <span>{post.sharesCount}</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`transition ${post.isBookmarked ? 'text-orange-500' : 'hover:text-slate-800'}`}
                      >
                        {post.isBookmarked ? <BookmarkSolidIcon className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* EXPANDABLE COMMENTS SECTION */}
                    {expandedComments[post.id] && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
                        {/* New Comment Input */}
                        <div className="flex items-start gap-2">
                          <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                            alt="Current Member"
                            className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              placeholder="Write a sovereign comment / reply..."
                              value={commentInputTexts[post.id] || ''}
                              onChange={(e) =>
                                setCommentInputTexts({
                                  ...commentInputTexts,
                                  [post.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handlePostComment(post.id);
                                }
                              }}
                              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-orange-500"
                            />
                            <button
                              type="button"
                              onClick={() => handlePostComment(post.id)}
                              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1 shadow-xs"
                            >
                              <PaperAirplaneIcon className="w-3.5 h-3.5" />
                              Reply
                            </button>
                          </div>
                        </div>

                        {/* List of Comments */}
                        <div className="space-y-2 pt-1">
                          {(post.commentsList && post.commentsList.length > 0) ? (
                            post.commentsList.map((comment) => (
                              <div
                                key={comment.id}
                                className="flex items-start gap-2 p-2.5 bg-slate-50/70 rounded-xl border border-slate-100 text-xs"
                              >
                                <img
                                  src={comment.authorAvatar}
                                  alt={comment.authorName}
                                  className="w-6 h-6 rounded-lg object-cover flex-shrink-0 mt-0.5"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900">{comment.authorName}</span>
                                    <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">{comment.authorHandle}</div>
                                  <p className="text-slate-700 mt-1 leading-relaxed">{comment.text}</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-400 italic text-center py-1">
                              No comments yet. Be the first to start the discussion!
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ================================================================= */}
                  {/* ALGORITHM INJECTION 1: FingerShorts Permanent after first 3 Post Cards (index 2) */}
                  {/* ================================================================= */}
                  {index === 2 && (
                    <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-white">
                            FingerShorts Reel Stream (Permanent)
                          </h4>
                        </div>
                        <button
                          onClick={() => navigate('/fingershorts')}
                          className="text-[11px] font-bold text-orange-400 hover:text-orange-300 transition"
                        >
                          View All Shorts →
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { title: 'Lagos Amapiano Wave', creator: '@amara', views: '45.2k', img: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400' },
                          { title: 'Sovereign NFC Keycard', creator: '@tunde', views: '28.1k', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400' },
                          { title: 'Escrow Gift Delivery', creator: '@zara', views: '61.8k', img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400' },
                        ].map((short, sIdx) => (
                          <div key={sIdx} className="relative rounded-xl overflow-hidden aspect-[9/14] group cursor-pointer">
                            <img src={short.img} alt={short.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                            <div className="absolute top-2 right-2 p-1 bg-black/40 rounded-full">
                              <PlayIcon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="absolute bottom-2 left-2 right-2">
                              <div className="text-[11px] font-bold text-white truncate">{short.title}</div>
                              <div className="text-[9px] text-slate-300 flex justify-between">
                                <span>{short.creator}</span>
                                <span>{short.views}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ================================================================= */}
                  {/* ALGORITHM INJECTION 2: Publicitee Permanent after next 5 Post Cards (index 7) */}
                  {/* ================================================================= */}
                  {index === 7 && (
                    <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-md flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
                          <SignalIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-white/30 px-2 py-0.5 rounded-full">
                            Publicitee Permanent
                          </span>
                          <h4 className="text-sm font-black text-white mt-1">
                            Creator Monetization & Sponsored Audio Spotlight
                          </h4>
                          <p className="text-xs text-orange-100 mt-0.5">
                            High-reach broadcasts across Dancia-4tv and BeatwaveNG stations.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/publicitee')}
                        className="px-3.5 py-2 text-xs font-bold bg-white text-orange-600 hover:bg-orange-50 rounded-xl shadow-xs transition"
                      >
                        Explore Publicitee
                      </button>
                    </div>
                  )}

                  {/* ================================================================= */}
                  {/* ALGORITHM INJECTION 3: Discover & In-Feed Ads after next 5 Post Cards (index 12) */}
                  {/* ================================================================= */}
                  {index === 12 && (
                    <>
                      {/* Discover Module */}
                      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <SparklesIcon className="w-4 h-4 text-purple-500" />
                            Discover Hub (Permanent)
                          </h4>
                          <span className="text-[10px] text-slate-400 font-semibold">Curated Topics</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {[
                            '#AmapianoStemMinting',
                            '#SovereignKeycards',
                            '#LushEscrowMilestone',
                            '#LoanSqrPOSFloat',
                            '#FingerLuxWatches',
                            '#DanciaStreetFinals',
                          ].map((topic) => (
                            <button
                              key={topic}
                              onClick={() => setSearchQuery(topic.replace('#', ''))}
                              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 transition"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* In-feed Ads (Canary / AdSense Verified) */}
                      <div className="p-3 bg-slate-100/80 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-300 text-slate-700 px-1.5 py-0.5 rounded">
                            Ad
                          </span>
                          <span className="text-xs font-bold text-slate-800">
                            FingerLux Sovereign Horology — Reserve Your Slot
                          </span>
                        </div>
                        <button
                          onClick={() => navigate('/fingerlux')}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700"
                        >
                          Learn More →
                        </button>
                      </div>
                    </>
                  )}

                  {/* ================================================================= */}
                  {/* ALGORITHM INJECTION 4: Hero Section for Platform Agentic Media after next 5 Post Cards (index 17) */}
                  {/* ================================================================= */}
                  {index === 17 && (
                    <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                          <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                            Platform Agentic Media • Guardian & Sentinel
                          </span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          EAL6+ Active
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-white">
                        Autonomous Trust Engine & Proof-of-Identity Oracle
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        All member moments, micro-financing contracts on LoanSqr, and gift escrows on LushPressies are continuously verified by autonomous background Sentinel agents.
                      </p>
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
                        <div>
                          <div className="text-xs font-black text-white">0 Flags</div>
                          <div className="text-[9px] text-slate-400">Security Threats</div>
                        </div>
                        <div>
                          <div className="text-xs font-black text-emerald-400">100%</div>
                          <div className="text-[9px] text-slate-400">Consent Verified</div>
                        </div>
                        <div>
                          <div className="text-xs font-black text-amber-400">3.5s Gate</div>
                          <div className="text-[9px] text-slate-400">Sentinel Delay</div>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}

              {/* Graceful Fallback if filtered feed has fewer posts than algorithmic milestones */}
              {filteredPosts.length < 3 && (
                <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">
                        FingerShorts Reel Stream (Permanent)
                      </h4>
                    </div>
                    <button onClick={() => navigate('/fingershorts')} className="text-[11px] font-bold text-orange-400">View All Shorts →</button>
                  </div>
                </div>
              )}

              {filteredPosts.length < 8 && (
                <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <SignalIcon className="w-6 h-6 text-white" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/30 px-2 py-0.5 rounded-full">Publicitee Permanent</span>
                      <h4 className="text-sm font-black text-white mt-1">Creator Monetization & Sponsored Audio Spotlight</h4>
                    </div>
                  </div>
                  <button onClick={() => navigate('/publicitee')} className="px-3.5 py-2 text-xs font-bold bg-white text-orange-600 rounded-xl">Explore Publicitee</button>
                </div>
              )}

              {filteredPosts.length < 13 && (
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <SparklesIcon className="w-4 h-4 text-purple-500" />
                      Discover Hub (Permanent)
                    </h4>
                    <span className="text-[10px] text-slate-400">Curated Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['#AmapianoStemMinting', '#SovereignKeycards', '#LushEscrowMilestone', '#LoanSqrPOSFloat'].map((t) => (
                      <span key={t} className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700">{t}</span>
                    ))}
                  </div>
                </div>
              )}

              {filteredPosts.length < 18 && (
                <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 text-white rounded-2xl border border-slate-800 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="w-5 h-5 text-emerald-400" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Platform Agentic Media • Guardian & Sentinel</span>
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">EAL6+ Active</span>
                  </div>
                  <h3 className="text-sm font-black text-white">Autonomous Trust Engine & Proof-of-Identity Oracle</h3>
                </div>
              )}
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT RAIL (3 cols): COMMUNITIES, RECOGNITION, STOREFRONT               */}
          {/* ======================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            {/* 1. My Communities Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <UserGroupIcon className="w-4 h-4 text-indigo-500" />
                  My Communities
                </span>
                <span className="text-[10px] font-bold text-slate-400">3 Joined</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { name: 'Good Group', members: '3 active members', initial: 'G', color: 'bg-indigo-50 text-indigo-600' },
                  { name: 'E-course Group', members: '5 active members', initial: 'E', color: 'bg-blue-50 text-blue-600' },
                  { name: 'Tech Enthusiasts', members: '12 active members', initial: 'T', color: 'bg-purple-50 text-purple-600' },
                ].map((comm) => (
                  <div key={comm.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${comm.color} flex items-center justify-center font-bold text-xs`}>
                        {comm.initial}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{comm.name}</div>
                        <div className="text-[10px] text-slate-400">{comm.members}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/groups')}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800"
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => navigate('/groups')}
                  className="py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition text-center"
                >
                  View All
                </button>
                <button
                  onClick={() => navigate('/community')}
                  className="py-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl transition text-center"
                >
                  Discover
                </button>
              </div>
            </div>

            {/* 2. Recognition / Hallmarks Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <StarIcon className="w-4 h-4 text-amber-500" />
                  Recognition
                </span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                  Tier 3
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <CheckCircleSolidIcon className="w-4 h-4 text-blue-500" />
                  <span>Verified Account</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <StarSolidIcon className="w-4 h-4 text-amber-500" />
                  <span>Community Leader</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <ArrowTrendingUpIcon className="w-4 h-4 text-emerald-500" />
                  <span>Top Contributor</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => navigate('/hallmarks')}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-between w-full"
                >
                  <span>View all achievements</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* 3. Storefront Showcase Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShoppingBagIcon className="w-4 h-4 text-rose-500" />
                  Storefront
                </span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Active
                </span>
              </div>

              <div className="p-3 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl my-2">
                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">
                  Featured Product
                </span>
                <h5 className="text-xs font-black text-white mt-0.5">Grand Celestial Tourbillon</h5>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  100% On-Chain physical luxury watch NFT keycard.
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                  <span className="text-xs font-bold text-amber-400 font-mono">4,500 FIC</span>
                  <button
                    onClick={() => navigate('/storefront')}
                    className="px-2 py-1 text-[10px] font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition"
                  >
                    View Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WebRTC Live Broadcast Studio Drawer */}
      <WebRtcStudioDrawer
        isOpen={isLiveStudioOpen}
        onClose={() => setIsLiveStudioOpen(false)}
      />

      {/* Floating Action Feedback Toast */}
      {toastNotification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200 ${
            toastNotification.type === 'error'
              ? 'bg-rose-900/95 text-white border-rose-700'
              : toastNotification.type === 'success'
              ? 'bg-slate-900/95 text-emerald-400 border-slate-700'
              : 'bg-slate-900/95 text-orange-400 border-slate-700'
          }`}
        >
          <span>{toastNotification.message}</span>
        </div>
      )}
    </div>
  );
};

export default ForumPageDraft;
