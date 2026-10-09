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
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
  CheckCircleIcon as CheckCircleSolidIcon,
  StarIcon as StarSolidIcon,
} from '@heroicons/react/24/solid';
import ForumService from '../services/forumService';
import { ForumCategory, ForumThread } from '../types/forum';

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
  { id: 'lushpressies', name: 'Lush Pressies', path: '/lushpressies', badge: 'Escrow', badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  { id: 'dancia4tv', name: 'Dancia-4tv', path: '/dancia4tv', badge: 'Live', badgeColor: 'bg-purple-50 text-purple-600 border-purple-200' },
  { id: 'marketplace', name: 'Marketplace', path: '/marketplace', badge: 'Shop', badgeColor: 'bg-blue-50 text-blue-600 border-blue-200' },
  { id: 'photocredits', name: 'PhotoCredits', path: '/luminagallery', badge: 'Art', badgeColor: 'bg-amber-50 text-amber-600 border-amber-200' },
  { id: 'beatwaveng', name: 'BeatwaveNG', path: '/beatwaveng', badge: 'Lossless', badgeColor: 'bg-orange-50 text-orange-600 border-orange-200' },
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
  isVerified?: boolean;
  taggedProduct?: {
    platform: string;
    name: string;
    price: string;
  };
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
    commentsCount: 38,
    sharesCount: 19,
    isLiked: false,
    isBookmarked: false,
    tags: ['BeatwaveNG', 'Amapiano', 'SpatialAudio', 'Licensing'],
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000',
    isVerified: true,
    taggedProduct: { platform: 'Storefront', name: 'Lossless Master Stem Pack (BeatwaveNG)', price: '50 FIC' },
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
    commentsCount: 22,
    sharesCount: 14,
    isLiked: true,
    isBookmarked: true,
    tags: ['KeycardV3', 'Security', 'Hardware', 'BioFace'],
    isVerified: true,
    taggedProduct: { platform: 'Marketplace', name: 'Sovereign Hardware Keycard V3', price: '250 FIC' },
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

  // Handle Post Creation with Mandated Category Selection
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
      authorName: 'Mock User',
      authorHandle: '@mockuser',
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
      taggedProduct: matchedProd
        ? { platform: matchedProd.platform, name: matchedProd.name, price: matchedProd.price }
        : undefined,
    };

    setPosts([newPost, ...posts]);
    setComposerTitle('');
    setComposerContent('');
    setComposerCategory('');
    setComposerTags('');
    setTaggedProduct('');
    setShowAdvancedTools(false);
    setShowSettingsAccordion(false);
    setComposerError(null);
  };

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );
  };

  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
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
            {/* 1. Member Identity Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="h-16 bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-900 relative" />

              <div className="px-4 pb-4 relative">
                <div className="relative -mt-8 mb-2 inline-block">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
                    alt="Mock User"
                    className="w-14 h-14 rounded-2xl border-2 border-white shadow-md object-cover"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-1">
                      Mock User
                      <CheckCircleSolidIcon className="w-3.5 h-3.5 text-blue-500" />
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">@mockuser</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md border border-orange-100">
                    Protocol Architect
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                    Sovereign Creator
                  </span>
                </div>

                {/* Member Statistics Grid */}
                <div className="grid grid-cols-4 gap-1 text-center mt-3 pt-3 border-t border-slate-100">
                  <div>
                    <div className="text-xs font-black text-slate-900">204</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Followers</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">182</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Following</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">87</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Posts</div>
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">12</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Groups</div>
                  </div>
                </div>

                {/* #Livestream Link Visible Under Profile Cards (As Requested) */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate('/live-streaming')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500/10 to-orange-500/10 hover:from-rose-500/20 hover:to-orange-500/20 border border-rose-200/50 transition group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                      <span className="text-xs font-black text-rose-600 group-hover:text-rose-700">
                        #Livestream UGC Studio
                      </span>
                    </div>
                    <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                      GO LIVE
                    </span>
                  </button>
                </div>
              </div>
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
                  <span className="text-[10px] text-slate-400 font-semibold">Rich Text Editor & Visual Styler</span>
                </div>

                {/* Validation Error Banner */}
                {composerError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                    <ExclamationCircleIcon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                    <span>{composerError}</span>
                  </div>
                )}

                {/* Main Content Area */}
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
                      rows={showAdvancedTools ? 4 : 2}
                      placeholder="Join Us, Share Your Moments..."
                      value={composerContent}
                      onChange={(e) => {
                        setComposerContent(e.target.value);
                        if (composerError) setComposerError(null);
                      }}
                      className={`w-full px-3 py-2 text-xs text-slate-800 bg-slate-50 rounded-xl border focus:outline-none resize-none transition ${
                        visualGlow ? 'ring-2 ring-orange-400 border-orange-400' : 'border-slate-200 focus:border-orange-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Tagged Product Pill (if selected) */}
                {taggedProduct && (
                  <div className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded-xl text-xs">
                    <span className="font-bold text-orange-800 flex items-center gap-1.5">
                      <ShoppingBagIcon className="w-4 h-4 text-orange-600" />
                      Tagged: {PRODUCT_CATALOG_OPTIONS.find((p) => p.id === taggedProduct)?.name} (
                      {PRODUCT_CATALOG_OPTIONS.find((p) => p.id === taggedProduct)?.price})
                    </span>
                    <button
                      type="button"
                      onClick={() => setTaggedProduct('')}
                      className="text-orange-600 hover:text-orange-800 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Advanced Tool Row 1: Action Icons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1 text-slate-500">
                    {/* Camera Icon for Photo / Video */}
                    <button
                      type="button"
                      onClick={() => alert('Media Studio: Photo & Video selector launched.')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-orange-500 transition"
                      title="Camera (Photo/Video)"
                    >
                      <CameraIcon className="w-4 h-4" />
                    </button>

                    {/* Poll */}
                    <button
                      type="button"
                      onClick={() => alert('Poll Creator: Add options & voting duration.')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-orange-500 transition"
                      title="Poll"
                    >
                      <ChartBarIcon className="w-4 h-4" />
                    </button>

                    {/* Event */}
                    <button
                      type="button"
                      onClick={() => alert('Event Scheduler: Set RSVP date and location.')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-orange-500 transition"
                      title="Event"
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </button>

                    {/* File */}
                    <button
                      type="button"
                      onClick={() => alert('File Attachment: Upload documents or whitepapers.')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-orange-500 transition"
                      title="File Attachment"
                    >
                      <PaperClipIcon className="w-4 h-4" />
                    </button>

                    {/* Links */}
                    <button
                      type="button"
                      onClick={() => alert('Link Inserter: Enter external URL with rich preview.')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-orange-500 transition"
                      title="Links"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>

                    {/* Location */}
                    <button
                      type="button"
                      onClick={() => alert('Location Tag: Pin geographic hub.')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-orange-500 transition"
                      title="Location"
                    >
                      <MapPinIcon className="w-4 h-4" />
                    </button>

                    {/* 5D Icons / Smileys / GIFs */}
                    <button
                      type="button"
                      onClick={() => alert('5D Smileys & GIFs: Open reactive animation drawer.')}
                      className="p-1.5 hover:bg-slate-100 rounded-lg hover:text-orange-500 transition"
                      title="5D Icons / Smileys / GIFs"
                    >
                      <FaceSmileIcon className="w-4 h-4" />
                    </button>

                    {/* BeatwaveNG Audio Embed */}
                    <button
                      type="button"
                      onClick={() => alert('BeatwaveNG: Audio stem and lossless stream tagged.')}
                      className="p-1.5 hover:bg-orange-50 rounded-lg text-orange-600 hover:text-orange-700 transition"
                      title="BeatwaveNG Track"
                    >
                      <MusicalNoteIcon className="w-4 h-4" />
                    </button>

                    {/* Dancia-4Tv Video Stream Embed */}
                    <button
                      type="button"
                      onClick={() => alert('Dancia-4Tv: Live dance performance tagged.')}
                      className="p-1.5 hover:bg-purple-50 rounded-lg text-purple-600 hover:text-purple-700 transition"
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

                    {/* Post Content */}
                    <div className="mt-3">
                      <h3 className="text-sm font-black text-slate-900 leading-snug">{post.title}</h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{post.content}</p>
                    </div>

                    {/* Media Image Embed (if present) */}
                    {post.mediaUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden max-h-72 border border-slate-100">
                        <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
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
                            onClick={() => navigate('/marketplace')}
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
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 transition font-semibold ${
                            post.isLiked ? 'text-rose-500' : 'hover:text-rose-500'
                          }`}
                        >
                          {post.isLiked ? <HeartSolidIcon className="w-4 h-4" /> : <HeartIcon className="w-4 h-4" />}
                          <span>{post.likesCount}</span>
                        </button>

                        <button className="flex items-center gap-1.5 hover:text-slate-800 transition font-semibold">
                          <ChatBubbleLeftRightIcon className="w-4 h-4" />
                          <span>{post.commentsCount}</span>
                        </button>

                        <button className="flex items-center gap-1.5 hover:text-slate-800 transition font-semibold">
                          <ShareIcon className="w-4 h-4" />
                          <span>{post.sharesCount}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleToggleBookmark(post.id)}
                        className={`transition ${post.isBookmarked ? 'text-orange-500' : 'hover:text-slate-800'}`}
                      >
                        {post.isBookmarked ? <BookmarkSolidIcon className="w-4 h-4" /> : <BookmarkIcon className="w-4 h-4" />}
                      </button>
                    </div>
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
    </div>
  );
};

export default ForumPageDraft;
