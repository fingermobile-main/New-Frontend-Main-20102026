import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
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
  ShieldCheckIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  XMarkIcon,
  EllipsisHorizontalIcon,
  LockClosedIcon,
  CameraIcon,
  MapPinIcon,
  MusicalNoteIcon,
  TvIcon,
  SignalIcon,
  PlayIcon,
  ExclamationCircleIcon,
  ListBulletIcon,
  PaperAirplaneIcon,
  ArrowTopRightOnSquareIcon,
  ArrowPathIcon,
  CheckIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import {
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
  CheckCircleIcon as CheckCircleSolidIcon,
} from '@heroicons/react/24/solid';
import ForumService from '../services/forumService';
import ForumPostCard from '../components/forum/ForumPostCard';
import { ForumCategory } from '../types/forum';
import WebRtcStudioDrawer from '../components/streaming/WebRtcStudioDrawer';
import MediaEditorModal, { EditedMediaResult } from '../components/MediaEditorModal';
import UniversalProfileCard from '../components/common/UniversalProfileCard';
import userProfileSyncService from '../services/UserProfileSyncService';
import openGraphService, { OpenGraphMetadata } from '../services/OpenGraphService';
import locationService from '../services/LocationService';
import RotatingWidgetRail from '../components/widgets/RotatingWidgetRail';
import FingerMobileLogoViewerModal from '../components/modals/FingerMobileLogoViewerModal';
import voiceLineServiceInstance from '../services/VoiceLineService';

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
// =============================================================================
interface SubNavEntity {
  id: string;
  name: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

const SUB_NAV_ITEMS: SubNavEntity[] = [
  { id: 'home', name: 'Home Feeds', path: '/forum' },
  { id: 'lushpressies', name: 'Lush Pressies', path: '/lushpressies' },
  { id: 'dancia4tv', name: 'Dancia-4tv', path: '/dancia4tv' },
  { id: 'marketplace', name: 'Marketplace', path: '/marketplace' },
  { id: 'photocredits', name: 'PhotoCredits', path: '/photocredits' },
  { id: 'beatwaveng', name: 'BeatwaveNG', path: '/beatwaveng' },
];

// =============================================================================
// Mii™®©℠ DISAPPEARING STORIES (48H EXPIRATION)
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
    caption: 'Sending escrow gifts to community builders on Lush Pressies! ✨',
    isViewed: false,
    type: 'photo',
  },
  {
    id: 'mii-4',
    author: 'Chidi Okafor',
    handle: '@chidi_dancia',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    mediaUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800',
    expiresIn: '12h left',
    caption: '4K Multi-angle WebRTC stream live on Dancia-4Tv stage now! 🕺',
    isViewed: true,
    type: 'video',
  },
];

// =============================================================================
// CATEGORIES CATALOG (54 CATEGORIES - COMPLETE DATABASE SYNC)
// =============================================================================
const MASTER_CATEGORIES_CATALOG: { id: string; name: string; icon: string }[] = [
  { id: '1', name: 'General Discussions & Protocol Talk', icon: '🌐' },
  { id: '2', name: 'Cryptographic Security & EAL6+ Enclaves', icon: '🛡️' },
  { id: '3', name: 'Tactile Conductive Sensor Hardware', icon: '⚡' },
  { id: '4', name: 'Keycard NFC & Biometric Authentication', icon: '💳' },
  { id: '5', name: 'BeatwaveNG Lossless Audio & Stems', icon: '🎵' },
  { id: '6', name: 'Dancia-4Tv Live WebRTC Video Broadcasts', icon: '📺' },
  { id: '7', name: 'Marketplace Decentralized P2P Commerce', icon: '🛍️' },
  { id: '8', name: 'Lush Pressies Protocol Escrow Gifting', icon: '🎁' },
  { id: '9', name: 'PhotoCredits Sovereign Creator Royalties', icon: '📸' },
  { id: '10', name: 'LoanSqr Micro-Financing & Float Pool', icon: '🏦' },
  { id: '11', name: 'Camus Sovereign Programmatic Ads', icon: '📢' },
  { id: '12', name: 'Hallmarks Sovereign Mega-Communities', icon: '🏛️' },
  { id: '13', name: 'Mii™®©℠ 48H Disappearing Ephemeral Moments', icon: '⏳' },
  { id: '14', name: 'Developer Toolkits & WebRTC SDKs', icon: '💻' },
  { id: '15', name: 'African Creative Economy & Global Exports', icon: '🌍' },
  { id: '16', name: 'Canary Ads Governance & Review', icon: '🎯' },
  { id: '17', name: 'P2P Mesh Network Architecture & Relays', icon: '📡' },
  { id: '18', name: 'Sovereign Identity (DID) & Zero-Knowledge', icon: '🔐' },
  { id: '19', name: 'Smart Contract Audits & Bytecode Verifiers', icon: '📜' },
  { id: '20', name: 'Digital Rights & Watermark Steganography', icon: '💧' },
  { id: '21', name: 'Tokenomics, Staking & Yield Farming', icon: '🪙' },
  { id: '22', name: 'DAO Governance Proposals & Voting', icon: '🗳️' },
  { id: '23', name: 'Artificial Intelligence & Guardian Sentinel', icon: '🤖' },
  { id: '24', name: 'Metaverse & Virtual Concert Spaces', icon: '🕶️' },
  { id: '25', name: 'Mobile App Beta Testing & TestFlight', icon: '📱' },
  { id: '26', name: 'Hardware Wallets & Cold Storage', icon: '🧰' },
  { id: '27', name: 'Cross-Border Remittances & FX Swaps', icon: '💱' },
  { id: '28', name: 'Legal, Regulatory & Compliance Hub', icon: '⚖️' },
  { id: '29', name: 'Supply Chain Tracking & NFC Verifications', icon: '🚚' },
  { id: '30', name: 'Gaming, Esports & Conductive Tournaments', icon: '🎮' },
  { id: '31', name: 'Music Production Stems & Master Licensing', icon: '🎧' },
  { id: '32', name: 'Film, Animation & FingerShorts Directors', icon: '🎬' },
  { id: '33', name: 'Fashion Tech & Wearable Sensors', icon: '👗' },
  { id: '34', name: 'Real Estate Tokenization & Deeds', icon: '🏙️' },
  { id: '35', name: 'Agriculture & IoT Micro-Sensor Farms', icon: '🌱' },
  { id: '36', name: 'Healthcare Data Sovereignty & FHIR', icon: '🩺' },
  { id: '37', name: 'Clean Energy, Solar & Carbon Offsets', icon: '☀️' },
  { id: '38', name: 'Education, University Nodes & Research', icon: '🎓' },
  { id: '39', name: 'Freelancer Gig Bounties & Escrow Work', icon: '💼' },
  { id: '40', name: 'Charity, Crisis Relief & Direct Grants', icon: '🤝' },
  { id: '41', name: 'Podcasts, Audio Spaces & AMA Townhalls', icon: '🎙️' },
  { id: '42', name: 'Culinary, Food Delivery & Restaurant Escrow', icon: '🍲' },
  { id: '43', name: 'Automotive IoT & Vehicle Telemetry Nodes', icon: '🚗' },
  { id: '44', name: 'Sports, Fitness & Biometric Telemetry', icon: '⚽' },
  { id: '45', name: 'Travel, Hospitality & Sovereign Passports', icon: '✈️' },
  { id: '46', name: 'Science, Quantum Computing & Cryptography', icon: '🔬' },
  { id: '47', name: 'Philosophy, Sovereign Individual & Ethics', icon: '📖' },
  { id: '48', name: 'Memes, Satire & Viral Culture', icon: '🎭' },
  { id: '49', name: 'Bug Bounties, Vulnerabilities & Security', icon: '🐛' },
  { id: '50', name: 'Flamingo Curated Fashion & Fine Art', icon: '🦩' },
  { id: '51', name: 'Storefront Independent Merchant Hub', icon: '🏪' },
  { id: '52', name: 'OwnIt Zero-Cost Renting & Hardware Lease', icon: '📦' },
  { id: '53', name: 'FingerLux High Jewelry & Luxury Horology', icon: '⌚' },
  { id: '54', name: 'Sovereign Community Suggestions & Feedback', icon: '💡' },
];

// =============================================================================
// ATTACHED MEDIA & STORE CATALOG (MarketPlace, OwnIt, Flamingo, Storefront, FingerLux)
// =============================================================================
export interface AttachedMediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size?: string;
  filter?: string;
  crop?: string;
  rotation?: number;
  adjustedUrl?: string;
}

export interface StoreProductOption {
  id: string;
  platform: 'MarketPlace' | 'OwnIt' | 'Flamingo' | 'Storefront' | 'FingerLux';
  name: string;
  price: string;
  category: 'Goods' | 'Products' | 'Services' | 'Gift Cards' | 'FIC Tips' | 'Coupons';
  image: string;
  path: string;
  itemType: 'product' | 'gift_card' | 'tip' | 'coupon';
  description?: string;
}

const STORE_CATALOG_OPTIONS: StoreProductOption[] = [
  // ---------------- MARKETPLACE ----------------
  { id: 'mp-1', platform: 'MarketPlace', name: 'Sovereign Hardware Keycard V3 (NFC)', price: '250 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400', path: '/marketplace', itemType: 'product', description: 'NFC cryptographic access card for sovereign biometric login' },
  { id: 'mp-2', platform: 'MarketPlace', name: 'Conductive Tactile Sensor Development Kit', price: '420 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400', path: '/marketplace', itemType: 'product', description: 'Precision haptic sensor development kit with open SDK' },
  { id: 'mp-3', platform: 'MarketPlace', name: 'Decentralized Mesh Relay Node Router', price: '680 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400', path: '/marketplace', itemType: 'product', description: 'Dual-band LoRa mesh networking node for P2P off-grid comms' },
  { id: 'mp-4', platform: 'MarketPlace', name: 'Sovereign Biometric EAL6+ Enclave Unit', price: '890 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400', path: '/marketplace', itemType: 'product', description: 'Hardware security module with zero-knowledge enclave proof' },
  { id: 'mp-gc-1', platform: 'MarketPlace', name: '🎁 500 FIC Protocol Sovereign Gift Card', price: '500 FIC', category: 'Gift Cards', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400', path: '/marketplace', itemType: 'gift_card', description: 'Redeemable across all verified Marketplace decentralized vendors' },
  { id: 'mp-tip-1', platform: 'MarketPlace', name: '💸 100 FIC Instant Creator Tip Voucher', price: '100 FIC', category: 'FIC Tips', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400', path: '/marketplace', itemType: 'tip', description: 'Instant peer-to-peer tip voucher directly credited to creator account' },
  { id: 'mp-cp-1', platform: 'MarketPlace', name: '🏷️ 15% Off Mesh Relays Hardware Coupon', price: 'Claim Free', category: 'Coupons', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', path: '/marketplace', itemType: 'coupon', description: 'Applies at checkout for all hardware orders' },

  // ---------------- OWNIT (CURATED LUXURY - OWNIT_LUXURY_CURATION.md) ----------------
  { id: 'own-1', platform: 'OwnIt', name: 'Hermès Birkin Bag - Crocodile Togo', price: '$200,000+ (14,000 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', path: '/ownit', itemType: 'product', description: 'Rare crocodile leather with palladium hardware. Ultimate status symbol' },
  { id: 'own-2', platform: 'OwnIt', name: 'Rolex Daytona Cosmograph Platinum', price: '$150,000 (10,500 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', path: '/ownit', itemType: 'product', description: '18k white gold, platinum bezel, chronograph racing movement' },
  { id: 'own-3', platform: 'OwnIt', name: 'Tom Ford Cashmere Overcoat - Black Imperial', price: '$15,000 (1,050 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400', path: '/ownit', itemType: 'product', description: '100% Italian cashmere, silk lining, hand-stitched masculine perfection' },
  { id: 'own-4', platform: 'OwnIt', name: 'Christian Louboutin Men\'s Crystal Sneakers', price: '$5,000 (350 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400', path: '/ownit', itemType: 'product', description: 'Premium leather with Swarovski crystal accents, limited edition' },
  { id: 'own-5', platform: 'OwnIt', name: 'Brunello Cucinelli Cashmere Sweater - Midnight Navy', price: '$4,000 (280 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', path: '/ownit', itemType: 'product', description: '100% Mongolian cashmere with hand-finished Italian craftsmanship' },
  { id: 'own-6', platform: 'OwnIt', name: 'Montblanc 4810 Meisterstück Fountain Pen - Platinum', price: '$12,000 (840 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400', path: '/ownit', itemType: 'product', description: 'Platinum-coated resin, 18k handcrafted gold nib for collectors' },
  { id: 'own-7', platform: 'OwnIt', name: 'Berluti Venezia Leather Shoes - Bordeaux', price: '$8,000 (560 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400', path: '/ownit', itemType: 'product', description: 'Patinated calfskin leather, hand-welted Italian shoemaking heritage' },
  { id: 'own-8', platform: 'OwnIt', name: 'Panerai Luminor Marina - Ceramica 44mm', price: '$25,000 (1,750 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', path: '/ownit', itemType: 'product', description: 'High-tech ceramic case, alligator strap, automatic nautical chronometer' },
  { id: 'own-9', platform: 'OwnIt', name: 'Canali Purple Label Suit - Double-breasted', price: '$18,000 (1,260 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', path: '/ownit', itemType: 'product', description: '100% Italian wool, silk lining, bespoke tailored power dressing' },
  { id: 'own-10', platform: 'OwnIt', name: 'Louis Vuitton Keepall Bandoulière 45 Monogram', price: '$3,500 (245 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', path: '/ownit', itemType: 'product', description: 'Iconic coated canvas with natural cowhide leather trim for jetset travel' },
  { id: 'own-11', platform: 'OwnIt', name: 'Chanel 2.55 Reissue Quilted Leather Bag', price: '$25,000 (1,750 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', path: '/ownit', itemType: 'product', description: 'Lambskin leather with antiqued gold chain. Timeless Parisian elegance' },
  { id: 'own-12', platform: 'OwnIt', name: 'Cartier Love Bracelet 18k White Gold', price: '$45,000 (3,150 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1611591475152-478311a9036b?w=400', path: '/ownit', itemType: 'product', description: '18k white gold with pave diamonds and iconic screw motif' },
  { id: 'own-13', platform: 'OwnIt', name: 'Valentino Rockstud Studded Clutch - Rose Pink', price: '$2,500 (175 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400', path: '/ownit', itemType: 'product', description: 'Supple suede with signature metallic pyramid studs for evening gala' },
  { id: 'own-14', platform: 'OwnIt', name: 'Hermès Constance Bag - Grained Leather', price: '$30,000 (2,100 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400', path: '/ownit', itemType: 'product', description: 'Taurillon Clemence leather with iconic H-clasp closure' },
  { id: 'own-15', platform: 'OwnIt', name: 'Dior Lady Dior Bag - Cannage Quilting', price: '$8,000 (560 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', path: '/ownit', itemType: 'product', description: 'Grained calfskin leather with signature Dior charms and cannage pattern' },
  { id: 'own-16', platform: 'OwnIt', name: 'Van Cleef & Arpels Alhambra Bracelet', price: '$35,000 (2,450 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', path: '/ownit', itemType: 'product', description: '18k yellow gold with mother-of-pearl and pave diamonds' },
  { id: 'own-17', platform: 'OwnIt', name: 'Prada Galleria Leather Tote - Black', price: '$4,000 (280 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', path: '/ownit', itemType: 'product', description: 'Crosshatch Saffiano leather with dual handles and gold-plated hardware' },
  { id: 'own-18', platform: 'OwnIt', name: 'Bottega Veneta Intrecciato Leather Dress', price: '$12,000 (840 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', path: '/ownit', itemType: 'product', description: 'Sculptural masterpiece woven with signature Italian intrecciato leather' },
  { id: 'own-19', platform: 'OwnIt', name: 'Gucci Ace Embellished Sneakers - Crystal Detail', price: '$1,500 (105 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', path: '/ownit', itemType: 'product', description: 'Supple leather with crystal horsebit embellishments and signature web trim' },
  { id: 'own-20', platform: 'OwnIt', name: 'Saint Laurent Monogram Backpack', price: '$2,000 (140 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', path: '/ownit', itemType: 'product', description: 'Coated canvas with leather accents and YSL brushed metal hardware' },
  { id: 'own-21', platform: 'OwnIt', name: 'Baccarat Harcourt Crystal Chandelier', price: '$150,000 (10,500 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400', path: '/ownit', itemType: 'product', description: 'Hand-blown French lead crystal with 24k gold leaf accents, 48 lights' },
  { id: 'own-22', platform: 'OwnIt', name: 'Frette Presidential Hotel Collection Bedding', price: '$5,000 (350 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400', path: '/ownit', itemType: 'product', description: '100% Egyptian cotton sateen, 1000 thread count five-star luxury' },
  { id: 'own-23', platform: 'OwnIt', name: 'Christofle Gaia Silver Flatware Set', price: '$25,000 (1,750 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=400', path: '/ownit', itemType: 'product', description: '48-piece sterling silver flatware set with rose gold accents' },
  { id: 'own-24', platform: 'OwnIt', name: 'Dolce & Gabbana Casa Mediterranean Collection', price: '$8,000 (560 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400', path: '/ownit', itemType: 'product', description: 'Fine porcelain dinnerware with hand-painted Sicilian majolica motifs' },
  { id: 'own-25', platform: 'OwnIt', name: 'Poltrona Frau Archimede Armchair', price: '$20,000 (1,400 FIC)', category: 'Goods', image: 'https://images.unsplash.com/photo-1580481077195-c819c968cf4c?w=400', path: '/ownit', itemType: 'product', description: 'Pelle Frau full-grain leather on sculpted solid Italian walnut frame' },
  { id: 'own-26', platform: 'OwnIt', name: 'Patek Philippe Grand Complications World Timer', price: '$500,000 (35,000 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', path: '/ownit', itemType: 'product', description: '18k rose gold case with minute repeater and 24-time-zone world timer' },
  { id: 'own-27', platform: 'OwnIt', name: 'Tiffany & Co. Return to Tiffany Diamond Necklace', price: '$100,000 (7,000 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', path: '/ownit', itemType: 'product', description: 'Platinum collar with 10-carat flawless center diamond in invisible setting' },
  { id: 'own-28', platform: 'OwnIt', name: 'Piaget Polo S Watch - Rose Gold', price: '$40,000 (2,800 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', path: '/ownit', itemType: 'product', description: '18k rose gold cushion case with ultra-thin skeletonized manufacture caliber' },
  { id: 'own-29', platform: 'OwnIt', name: 'Harry Winston Cluster Ring - Floral Motif', price: '$300,000 (21,000 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400', path: '/ownit', itemType: 'product', description: 'Platinum setting featuring 20-carats of D-flawless colorless diamonds' },
  { id: 'own-30', platform: 'OwnIt', name: 'Chopard L.U.X. Flying Tourbillon', price: '$350,000 (24,500 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', path: '/ownit', itemType: 'product', description: '18k white gold case with Geneva Seal certified flying tourbillon' },
  { id: 'own-31', platform: 'OwnIt', name: 'Patek Philippe Grandmaster Chime 6300G', price: '$2,500,000 (175,000 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', path: '/ownit', itemType: 'product', description: 'Most complicated wristwatch with 20 complications and reversible case' },
  { id: 'own-32', platform: 'OwnIt', name: 'Richard Mille RM 56-02 Sapphire', price: '$2,000,000 (140,000 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', path: '/ownit', itemType: 'product', description: 'Solid sapphire crystal case with cable-suspended tourbillon movement' },
  { id: 'own-33', platform: 'OwnIt', name: 'Rolls-Royce Boat Tail Bespoke Coachbuild', price: '$28,000,000 (1,950,000 FIC)', category: 'Products', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400', path: '/ownit', itemType: 'product', description: 'Custom coachbuilt automotive masterpiece with nautical butterfly deck' },
  { id: 'own-gc-1', platform: 'OwnIt', name: '🎁 OwnIt Luxury VIP Concierge Gift Card', price: '700 FIC ($10,000)', category: 'Gift Cards', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400', path: '/ownit', itemType: 'gift_card', description: 'Access to private luxury leasing, bespoke curation, and global white-glove transport' },
  { id: 'own-tip-1', platform: 'OwnIt', name: '💸 500 FIC Luxury Creator Tip Token', price: '500 FIC', category: 'FIC Tips', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400', path: '/ownit', itemType: 'tip', description: 'High-value patron tipping token for premium sovereign creators' },
  { id: 'own-cp-1', platform: 'OwnIt', name: '🏷️ OwnIt 20% Off Haute Horlogerie Coupon', price: 'VIP Claim', category: 'Coupons', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', path: '/ownit', itemType: 'coupon', description: 'Exclusive 20% savings on luxury watch and jewelry leases' },

  // ---------------- FLAMINGO ----------------
  { id: 'flam-1', platform: 'Flamingo', name: 'Handwoven Aso-Oke Sovereign Royal Agbada', price: '340 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400', path: '/flamingo', itemType: 'product', description: 'Centuries-old Yoruba weaving tradition in royal maroon and gold silk thread' },
  { id: 'flam-2', platform: 'Flamingo', name: 'Artisanal Bronze Cast Ife Royal Pendant', price: '210 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', path: '/flamingo', itemType: 'product', description: 'Lost-wax cast bronze talisman commemorating classical Kingdom of Ife' },
  { id: 'flam-3', platform: 'Flamingo', name: 'Adire Indigo Hand-Dyed Sovereign Kimono', price: '160 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400', path: '/flamingo', itemType: 'product', description: 'Organic indigo resist-dyed cotton kimono from Abeokuta heritage guilds' },
  { id: 'flam-4', platform: 'Flamingo', name: 'Imperial Coral Beaded Edo Monarch Choker', price: '280 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400', path: '/flamingo', itemType: 'product', description: 'Authentic Mediterranean coral beads traditionally woven for royal chieftaincies' },
  { id: 'flam-5', platform: 'Flamingo', name: 'Royal Benin Ivory Replica Waist Mask', price: '450 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400', path: '/flamingo', itemType: 'product', description: 'Museum-grade hand-carved mahogany and bone commemorative Queen Idia sculpture' },
  { id: 'flam-6', platform: 'Flamingo', name: 'Zulu Beaded Monarch Ceremonial Cape', price: '190 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400', path: '/flamingo', itemType: 'product', description: 'Vibrant geometric glass beadwork celebrating pan-African heritage' },
  { id: 'flam-gc-1', platform: 'Flamingo', name: '🎁 Flamingo African Haute Couture Gift Card', price: '250 FIC', category: 'Gift Cards', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400', path: '/flamingo', itemType: 'gift_card', description: 'Honoring bespoke pan-African tailoring, hand-dyed silks, and regal bridal accessories' },
  { id: 'flam-tip-1', platform: 'Flamingo', name: '💸 75 FIC Master Artisan Tip Voucher', price: '75 FIC', category: 'FIC Tips', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400', path: '/flamingo', itemType: 'tip', description: 'Direct patron support for indigenous textile and bronze artisans' },
  { id: 'flam-cp-1', platform: 'Flamingo', name: '🏷️ Flamingo 10% Royal Agbada Coupon', price: 'Free Claim', category: 'Coupons', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400', path: '/flamingo', itemType: 'coupon', description: 'Valid across the entire bespoke Aso-Oke collection' },

  // ---------------- STOREFRONT ----------------
  { id: 'sf-1', platform: 'Storefront', name: 'BeatwaveNG Collector 180g Vinyl Double LP', price: '75 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400', path: '/storefront', itemType: 'product', description: 'Audiophile heavyweight vinyl with full-color gatefold art and stem download code' },
  { id: 'sf-2', platform: 'Storefront', name: 'FingerMobile Protocol Heavyweight Hoodie', price: '95 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400', path: '/storefront', itemType: 'product', description: '500 GSM organic French terry cotton with embroidered protocol cryptographic hallmark' },
  { id: 'sf-3', platform: 'Storefront', name: 'Amapiano Producer Master Stem Pack Vol. 4', price: '50 FIC', category: 'Services', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', path: '/storefront', itemType: 'product', description: '24-bit 96kHz lossless multi-track stems, log drums, MIDI chords, and one-shots' },
  { id: 'sf-4', platform: 'Storefront', name: 'Highlife Modernist Modular Synthesizer', price: '620 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400', path: '/storefront', itemType: 'product', description: 'Desktop polyphonic synthesizer calibrated for microtonal polyrhythms' },
  { id: 'sf-5', platform: 'Storefront', name: 'Sovereign Sound Studio Near-Field Monitors', price: '380 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400', path: '/storefront', itemType: 'product', description: 'Active bi-amplified studio monitors for lossless acoustic mastering' },
  { id: 'sf-gc-1', platform: 'Storefront', name: '🎁 Storefront 150 FIC Merch & Audio Gift Card', price: '150 FIC', category: 'Gift Cards', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400', path: '/storefront', itemType: 'gift_card', description: 'Universal pass for beat packs, streetwear, vinyl, and creator equipment' },
  { id: 'sf-tip-1', platform: 'Storefront', name: '💸 50 FIC Beatwave Artist Tip Voucher', price: '50 FIC', category: 'FIC Tips', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400', path: '/storefront', itemType: 'tip', description: 'Send instant encouragement and tip love to independent music producers' },
  { id: 'sf-cp-1', platform: 'Storefront', name: '🏷️ BeatwaveNG Festival VIP Access Coupon', price: 'Community Pass', category: 'Coupons', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', path: '/storefront', itemType: 'coupon', description: 'Unlocks VIP lounge privileges at sovereign concert festivals' },

  // ---------------- FINGERLUX ----------------
  { id: 'fl-1', platform: 'FingerLux', name: 'Grand Celestial Tourbillon Chronometer', price: '4,500 FIC', category: 'Goods', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', path: '/fingerlux', itemType: 'product', description: 'Hand-crafted Swiss horology featuring multi-axis tourbillon and aventurine star dial' },
  { id: 'fl-2', platform: 'FingerLux', name: 'Sovereign Vault Gold Bullion Certificate (100g)', price: '9,200 FIC', category: 'Products', image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400', path: '/fingerlux', itemType: 'product', description: '99.99% pure allocated Swiss gold bar held in secure insured Zurich vault' },
  { id: 'fl-3', platform: 'FingerLux', name: 'Lekki Oceanfront Penthouse Weekend Access', price: '2,800 FIC', category: 'Services', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', path: '/fingerlux', itemType: 'product', description: 'Exclusive three-night luxury penthouse with private helipad and infinity pool' },
  { id: 'fl-4', platform: 'FingerLux', name: 'Monaco Sovereign Superyacht 48h Charter', price: '18,000 FIC', category: 'Services', image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d17?w=400', path: '/fingerlux', itemType: 'product', description: '55-meter luxury motor yacht with 12-person crew, tenders, and private chef' },
  { id: 'fl-5', platform: 'FingerLux', name: 'Gulfstream G700 Private Aviation Charter Hour', price: '12,500 FIC', category: 'Services', image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=400', path: '/fingerlux', itemType: 'product', description: 'Ultra-long-range sovereign flight credit with bespoke in-flight catering' },
  { id: 'fl-gc-1', platform: 'FingerLux', name: '🎁 FingerLux Sovereign Vault Gift Pass', price: '3,000 FIC', category: 'Gift Cards', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400', path: '/fingerlux', itemType: 'gift_card', description: 'Redeemable for bullion holdings, luxury yacht charters, and private aviation' },
  { id: 'fl-tip-1', platform: 'FingerLux', name: '💸 250 FIC High-Roller Sovereign Tip', price: '250 FIC', category: 'FIC Tips', image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=400', path: '/fingerlux', itemType: 'tip', description: 'Prestigious elite tipping token for high-tier protocol contributions' },
  { id: 'fl-cp-1', platform: 'FingerLux', name: '🏷️ 25% Off FingerLux Penthouse Weekend Coupon', price: 'Diamond Club', category: 'Coupons', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400', path: '/fingerlux', itemType: 'coupon', description: 'Exclusive luxury weekend villa and penthouse discount' },
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
  url?: string;
}

export interface FeedLinkEmbed {
  url: string;
  title: string;
  description?: string;
  image?: string;
  domain: string;
  failureReason?: string;
}

export interface FeedTaggedProduct {
  platform: 'MarketPlace' | 'OwnIt' | 'Flamingo' | 'Storefront' | 'FingerLux';
  name: string;
  price: string;
  category?: string;
  image?: string;
  itemType?: 'product' | 'gift_card' | 'tip' | 'coupon';
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
  mediaUrls?: string[];
  audioPreview?: string;
  videoStreamUrl?: string;
  locationTag?: string;
  taggedProduct?: FeedTaggedProduct;
  poll?: FeedPoll;
  event?: FeedEvent;
  fileAttachment?: FeedFileAttachment;
  linkEmbed?: FeedLinkEmbed;
  isVerified?: boolean;
  commentsList?: FeedComment[];
}

// =============================================================================
// MULTI-MEDIA POST GALLERY COMPONENT (Supports Multiple Photos & Videos)
// =============================================================================
const MultiMediaGallery: React.FC<{
  urls: string[];
  title: string;
  author: string;
  // eslint-disable-next-line no-unused-vars
  onOpenLightbox: (item: { url: string; title: string; author: string }) => void;
}> = ({ urls, title, author, onOpenLightbox }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!urls || urls.length === 0) return null;

  if (urls.length === 1) {
    const url = urls[0];
    const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(url) || url.startsWith('data:video');
    return (
      <div
        onClick={() => !isVideo && onOpenLightbox({ url, title, author })}
        className="mt-3 rounded-2xl overflow-hidden max-h-80 border border-slate-200 dark:border-slate-800 cursor-pointer relative group bg-slate-900"
      >
        {isVideo ? (
          <video src={url} controls playsInline className="w-full max-h-80 object-contain bg-black" />
        ) : (
          <img src={url} alt={title} className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-300" />
        )}
        {!isVideo && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end justify-between p-3 text-white">
            <span className="text-xs font-bold flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-xl">
              <MagnifyingGlassIcon className="w-3.5 h-3.5 text-amber-300" />
              Expand UHD Media
            </span>
            <span className="text-[10px] font-mono text-slate-300">FingerMobile High-Fi</span>
          </div>
        )}
      </div>
    );
  }

  const currentUrl = urls[activeIndex];
  const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(currentUrl) || currentUrl.startsWith('data:video');

  return (
    <div className="mt-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 relative group">
      {/* Current Active Item Viewport */}
      <div
        className="relative max-h-80 aspect-video flex items-center justify-center cursor-pointer overflow-hidden bg-black"
        onClick={() => !isVideo && onOpenLightbox({ url: currentUrl, title, author })}
      >
        {isVideo ? (
          <video src={currentUrl} controls playsInline className="w-full h-full object-contain" />
        ) : (
          <img
            src={currentUrl}
            alt={`${title} (${activeIndex + 1})`}
            className="w-full h-full object-cover transition-all duration-200"
          />
        )}

        {/* Counter Badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-bold flex items-center gap-1 shadow-md">
          <span>{activeIndex + 1}</span>
          <span className="text-slate-400">/</span>
          <span>{urls.length}</span>
        </div>

        {/* Previous Button */}
        {activeIndex > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(activeIndex - 1);
            }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg text-lg font-bold"
            title="Previous media"
          >
            &#8249;
          </button>
        )}

        {/* Next Button */}
        {activeIndex < urls.length - 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(activeIndex + 1);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition shadow-lg text-lg font-bold"
            title="Next media"
          >
            &#8250;
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {urls.map((u, idx) => {
          const isItemVideo = /\.(mp4|webm|mov|m4v)$/i.test(u) || u.startsWith('data:video');
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition flex-shrink-0 relative ${
                activeIndex === idx
                  ? 'border-indigo-500 scale-105 shadow-md'
                  : 'border-slate-800 opacity-60 hover:opacity-100'
              }`}
            >
              {isItemVideo ? (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-indigo-400 text-[10px] font-bold">
                  VID
                </div>
              ) : (
                <img src={u} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DEFAULT_POSTS: FeedPost[] = [
  {
    id: 'post-101',
    title: 'Deploying EAL6+ Conductive Sensors on High-Bandwidth Mesh Relays',
    content: 'We have concluded Phase 3 tests on the biometric secure element. Every micro-transaction executed through the NFC keycard now signs in sub-50ms latency across decentralized nodes with zero third-party telemetry.',
    authorName: 'Israel Mbah',
    authorHandle: '@israel_protocol',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    authorRole: 'Protocol Architect',
    categoryName: '🛡️ Cryptographic Security & EAL6+ Enclaves',
    createdAt: '12m ago',
    likesCount: 142,
    commentsCount: 38,
    sharesCount: 19,
    isLiked: true,
    isBookmarked: false,
    tags: ['EAL6', 'Security', 'Conductive', 'Hardware'],
    isVerified: true,
    locationTag: 'Victoria Island Studio Hub, Lagos',
    mediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1000',
    poll: {
      question: 'Should we prioritize Hardware Keycard V3 shipment or WebRTC P2P Mesh first?',
      options: [
        { text: 'Hardware Keycard V3 (NFC)', votes: 89 },
        { text: 'WebRTC P2P Mesh Streaming', votes: 44 },
        { text: 'Both Simultaneously', votes: 61 },
      ],
      userVotedIndex: 0,
      totalVotes: 194,
      durationDays: 3,
    },
    commentsList: [
      {
        id: 'c-1',
        authorName: 'Amara Kalu',
        authorHandle: '@amara_beats',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        text: 'The EAL6+ benchmark numbers look solid! Testing the BeatwaveNG spatial stem pipeline with these keys right now.',
        createdAt: '5m ago',
      },
    ],
  },
  {
    id: 'post-102',
    title: 'BeatwaveNG 24-Bit Spatial Audio Stem Master Release: Amapiano Fusion',
    content: 'Just uploaded the full 8-track multitrack stems in lossless FLAC format. You can preview the log drum sub-bass frequency stems below, or import directly into your sovereign DAW.',
    authorName: 'Amara Kalu',
    authorHandle: '@amara_beats',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    authorRole: 'Audio Engineer',
    categoryName: '🎵 BeatwaveNG Lossless Audio & Stems',
    createdAt: '45m ago',
    likesCount: 284,
    commentsCount: 56,
    sharesCount: 41,
    isLiked: false,
    isBookmarked: true,
    tags: ['BeatwaveNG', 'SpatialAudio', 'Lossless', 'FLAC'],
    isVerified: true,
    audioPreview: 'Amapiano 118BPM Log Drum & Sub-Bass Master (24-Bit FLAC)',
    taggedProduct: {
      platform: 'Storefront',
      name: 'BeatwaveNG Collector 180g Vinyl Double LP',
      price: '75 FIC',
      category: 'Products',
      image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400',
    },
  },
  {
    id: 'post-103',
    title: 'Dancia-4Tv National Dance Championship Live Broadcast Feed (4K WebRTC)',
    content: 'Tune in to the live dance cypher streamed directly from Lagos Island. Multi-camera switching is powered by low-latency WebRTC nodes.',
    authorName: 'Chidi Okafor',
    authorHandle: '@chidi_dancia',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    authorRole: 'Broadcast Director',
    categoryName: '📺 Dancia-4Tv Live WebRTC Video Broadcasts',
    createdAt: '2h ago',
    likesCount: 512,
    commentsCount: 92,
    sharesCount: 88,
    isLiked: true,
    isBookmarked: false,
    tags: ['Dancia4Tv', 'LiveStream', 'WebRTC', 'Dance'],
    isVerified: true,
    videoStreamUrl: 'Dancia-4Tv Live Stage #1: Street Dance Championship',
    event: {
      title: 'Lagos Urban Dance Cypher Finals 2026',
      date: 'Oct 15, 2026',
      time: '18:00 WAT',
      location: 'Dancia-4Tv Stage #1 & WebRTC Node',
      rsvpCount: 348,
      isRsvpd: true,
    },
  },
  {
    id: 'post-104',
    title: 'FingerMobile Protocol Whitepaper v2.4 Architecture Review',
    content: 'Full formal verification specs for peer-to-peer tactile handshake protocols are published in the PDF below. Includes zero-knowledge proof diagrams for off-chain state commitments.',
    authorName: 'Tunde Adeleke',
    authorHandle: '@tunde_dev',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    authorRole: 'Core Cryptographer',
    categoryName: '📜 Smart Contract Audits & Bytecode Verifiers',
    createdAt: '4h ago',
    likesCount: 319,
    commentsCount: 64,
    sharesCount: 52,
    isLiked: false,
    isBookmarked: false,
    tags: ['Whitepaper', 'ZKP', 'OffChain', 'Protocol'],
    isVerified: true,
    fileAttachment: {
      name: 'FingerMobile_Protocol_Whitepaper_v2.4.pdf',
      size: '3.4 MB',
      type: 'PDF',
      url: 'https://fingermobile.io/docs/FingerMobile_Protocol_Whitepaper_v2.4.pdf',
    },
    linkEmbed: {
      url: 'https://fingermobile.io/docs/whitepaper',
      title: 'FingerMobile Protocol Specifications & Formal Verification',
      description: 'Official technical specification for sovereign tactile conductive hardware and peer-to-peer mesh cryptography.',
      domain: 'fingermobile.io',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600',
    },
  },
];

// =============================================================================
// MAIN COMPONENT: FingerMobile Forum
// =============================================================================
export const ForumPage: React.FC = () => {
  const navigate = useNavigate();

  // Navigation State
  const [activeSubNav, setActiveSubNav] = useState<string>('home');
  const [feedMode] = useState<'for_you' | 'following' | 'recent' | 'trending'>('for_you');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showMiniDrawer, setShowMiniDrawer] = useState<boolean>(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState<boolean>(false);
  const [isLogoViewerOpen, setIsLogoViewerOpen] = useState<boolean>(false);

  // Profile Data Synced Live from UserProfileSyncService
  const [syncedProfile, setSyncedProfile] = useState(() => userProfileSyncService.getProfile());

  useEffect(() => {
    const unsub = userProfileSyncService.subscribe((up) => {
      setSyncedProfile(up);
    });
    return unsub;
  }, []);

  // Mii™®©℠ State
  const [miiStories, setMiiStories] = useState<MiiItem[]>(() => {
    try {
      const saved = localStorage.getItem('fmp_mii_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MII_STORIES;
  });
  const [selectedMii, setSelectedMii] = useState<MiiItem | null>(null);
  const [isMiiCreatorOpen, setIsMiiCreatorOpen] = useState<boolean>(false);
  const [miiType, setMiiType] = useState<'photo' | 'audio' | 'video'>('photo');
  const [miiCaption, setMiiCaption] = useState<string>('');
  const [miiMediaUrl, setMiiMediaUrl] = useState<string>('');
  const [miiMediaFileName, setMiiMediaFileName] = useState<string>('');
  const [miiMediaFileSize, setMiiMediaFileSize] = useState<string>('');
  const [isMiiDragging, setIsMiiDragging] = useState<boolean>(false);

  const miiFileInputRef = useRef<HTMLInputElement>(null);

  // Post Card Lightbox & Interactive Media State
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<{ url: string; title: string; author: string } | null>(null);
  const [playingAudioPostId, setPlayingAudioPostId] = useState<string | null>(null);
  const [activePostOptionsId, setActivePostOptionsId] = useState<string | null>(null);

  // Composer Form State
  const [composerTitle, setComposerTitle] = useState<string>('');
  const [composerContent, setComposerContent] = useState<string>('');
  const [composerCategory, setComposerCategory] = useState<string>('');
  const [composerTags, setComposerTags] = useState<string>('');
  const [composerTab, setComposerTab] = useState<'write' | 'preview'>('write');
  const [composerError, setComposerError] = useState<string | null>(null);

  // Active Tool Sub-Panel State
  const [activeComposerTool, setActiveComposerTool] = useState<
    'media' | 'poll' | 'event' | 'file' | 'link' | 'location' | 'emoji' | 'beatwave' | 'dancia' | 'product' | null
  >(null);

  // Tool 1: Multi-Media State (Photo/Video, Multi-Select & Editor)
  const [attachedMediaList, setAttachedMediaList] = useState<AttachedMediaItem[]>([]);
  const [attachedMedia, setAttachedMedia] = useState<string | null>(null);
  const [mediaInputUrl, setMediaInputUrl] = useState<string>('');
  const [editingMediaItem, setEditingMediaItem] = useState<AttachedMediaItem | null>(null);
  const mediaFileInputRef = useRef<HTMLInputElement>(null);

  // Tool 2: Poll State
  const [attachedPoll, setAttachedPoll] = useState<FeedPoll | null>(null);
  const [pollDraftQuestion, setPollDraftQuestion] = useState<string>('');
  const [pollDraftOptions, setPollDraftOptions] = useState<string[]>(['', '']);
  const [pollDraftDays, setPollDraftDays] = useState<number>(3);

  // Tool 3: Event State
  const [attachedEvent, setAttachedEvent] = useState<FeedEvent | null>(null);
  const [eventDraftTitle, setEventDraftTitle] = useState<string>('');
  const [eventDraftDate, setEventDraftDate] = useState<string>('');
  const [eventDraftTime, setEventDraftTime] = useState<string>('');
  const [eventDraftLocation, setEventDraftLocation] = useState<string>('');

  // Tool 4: File Attachment State
  const [attachedFile, setAttachedFile] = useState<FeedFileAttachment | null>(null);
  const [fileDraftName, setFileDraftName] = useState<string>('');
  const docFileInputRef = useRef<HTMLInputElement>(null);

  // Tool 5: Link Inserter & Open Graph (OG) State
  const [attachedLink, setAttachedLink] = useState<FeedLinkEmbed | null>(null);
  const [linkInputUrl, setLinkInputUrl] = useState<string>('');
  const [linkOgData, setLinkOgData] = useState<OpenGraphMetadata | null>(null);
  const [isFetchingOg, setIsFetchingOg] = useState<boolean>(false);
  const [ogManualTitle, setOgManualTitle] = useState<string>('');
  const [ogManualDescription, setOgManualDescription] = useState<string>('');
  const [ogManualImage, setOgManualImage] = useState<string>('');

  // Tool 6: Location Tag State
  const [attachedLocation, setAttachedLocation] = useState<string | null>(null);
  const [locationInput, setLocationInput] = useState<string>('');
  const [isDetectingIp, setIsDetectingIp] = useState<boolean>(false);

  // Tool 7: BeatwaveNG State
  const [attachedStem, setAttachedStem] = useState<string | null>(null);
  const [customStemTitle, setCustomStemTitle] = useState<string>('');
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Tool 8: Dancia-4Tv State
  const [attachedStream, setAttachedStream] = useState<string | null>(null);
  const [customStreamTitle, setCustomStreamTitle] = useState<string>('');
  const videoFileInputRef = useRef<HTMLInputElement>(null);

  // Tool 9: Tag Product State (MarketPlace, OwnIt, Flamingo, Storefront, FingerLux + Gifts, Tips & Coupons)
  const [taggedProduct, setTaggedProduct] = useState<FeedTaggedProduct | null>(null);
  const [selectedStoreTab, setSelectedStoreTab] = useState<'All' | 'MarketPlace' | 'OwnIt' | 'Flamingo' | 'Storefront' | 'FingerLux'>('All');
  const [productSearchQuery, setProductSearchQuery] = useState<string>('');
  const [productMediumFilter, setProductMediumFilter] = useState<'all' | 'gift_cards' | 'tips' | 'coupons' | 'luxury'>('all');
  const [customProdName, setCustomProdName] = useState<string>('');
  const [customProdPrice, setCustomProdPrice] = useState<string>('');
  const customProdCategory: 'Goods' | 'Products' | 'Services' | 'Gift Cards' | 'FIC Tips' | 'Coupons' = 'Goods';
  const [customProdMedium, setCustomProdMedium] = useState<'product' | 'gift_card' | 'tip' | 'coupon'>('product');

  // Live Studio Drawer State
  const [isLiveStudioOpen, setIsLiveStudioOpen] = useState<boolean>(false);
  const [liveStudioInitialTab, setLiveStudioInitialTab] = useState<'broadcast' | 'schedule' | 'events'>('broadcast');
  const [liveStudioStreamId, setLiveStudioStreamId] = useState<string | undefined>(undefined);
  const [liveStudioGuestMode, setLiveStudioGuestMode] = useState<'OPEN_VIEWER' | 'INTERACTIVE_COHOST' | 'VIP_BACKSTAGE'>('INTERACTIVE_COHOST');

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

  // Expanded Comments State
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({ 'post-101': true });
  const [commentInputTexts, setCommentInputTexts] = useState<Record<string, string>>({});

  // Fetch Categories on Mount
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
          const existingNames = new Set(loaded.map((c) => c.name.toLowerCase()));
          const extra = MASTER_CATEGORIES_CATALOG.filter((c) => !existingNames.has(c.name.toLowerCase()));
          setApiCategories([...loaded, ...extra]);
        }
      } catch {
        // fallback to master catalog
      }
    };
    loadCategories();
  }, []);

  // WebRTC Live Broadcast: Detect 'joinLive' or 'scheduleLive' URL query parameter
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const joinLive = params.get('joinLive');
      const mode = params.get('mode') as 'OPEN_VIEWER' | 'INTERACTIVE_COHOST' | 'VIP_BACKSTAGE' | null;
      const scheduleLive = params.get('scheduleLive');

      if (joinLive) {
        setLiveStudioStreamId(joinLive);
        if (mode) setLiveStudioGuestMode(mode);
        setLiveStudioInitialTab('broadcast');
        setIsLiveStudioOpen(true);
        triggerToast(`Connecting to "Join Me Live" broadcast stage (${mode || 'INTERACTIVE_COHOST'})...`, 'info');
      } else if (scheduleLive === 'true') {
        setLiveStudioInitialTab('schedule');
        setIsLiveStudioOpen(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Fetch Posts from Persistent PostgreSQL on Mount & Filter changes
  useEffect(() => {
    let isMounted = true;
    const loadPosts = async () => {
      try {
        const res = await ForumService.getAllPosts({
          category: selectedCategoryId !== 'all' ? selectedCategoryId : undefined,
          feedMode,
          search: searchQuery || undefined,
        });
        if (isMounted && res.success && res.data?.posts && res.data.posts.length > 0) {
          setPosts(res.data.posts);
        }
      } catch {
        /* keep existing state on network or server error */
      }
    };
    loadPosts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategoryId, feedMode, searchQuery]);

  // Filter posts
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

  // Markdown Inserter
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

  // URL Auto-Detection on Paste into Composer Content
  const handleContentChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setComposerContent(val);

    // Detect URLs in text if no link is currently attached
    if (!attachedLink && !isFetchingOg) {
      const urls = openGraphService.detectUrls(val);
      if (urls.length > 0) {
        const detected = urls[0];
        try {
          setIsFetchingOg(true);
          const meta = await openGraphService.fetchMetadata(detected);
          setLinkOgData(meta);
          setOgManualTitle(meta.title);
          setOgManualDescription(meta.description);
          setOgManualImage(meta.image || '');
          // If high confidence preview, auto attach
          if (meta.title && meta.title !== 'External Webpage') {
            setAttachedLink({
              url: meta.url,
              title: meta.title,
              description: meta.description,
              image: meta.image,
              domain: meta.domain,
            });
            triggerToast(`Auto-generated Open Graph preview for ${meta.domain}`, 'info');
          }
        } catch {
          // ignore background scrape error
        } finally {
          setIsFetchingOg(false);
        }
      }
    }
  };

  // Handler for Tool 1: Multi-Media File Pick (Images & Videos)
  const handleMediaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: AttachedMediaItem[] = [];
    let count = 0;

    files.forEach((file) => {
      const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
      const sizeMb = (file.size / 1024 / 1024).toFixed(1);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        newItems.push({
          id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          url: result,
          type: isVideo ? 'video' : 'image',
          name: file.name,
          size: `${sizeMb} MB`,
        });
        count++;
        if (count === files.length) {
          setAttachedMediaList((prev) => [...prev, ...newItems]);
          setAttachedMedia((prev) => prev || newItems[0]?.url || null);
          setMediaInputUrl('');
          setActiveComposerTool(null);
          triggerToast(`Attached ${files.length} media file${files.length > 1 ? 's' : ''}!`, 'success');
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  // Handler for saving edits from MediaEditorModal (Crop, Filters, Adjustments)
  const handleSaveEditedMedia = (edited: EditedMediaResult) => {
    if (!editingMediaItem) return;
    setAttachedMediaList((prev) =>
      prev.map((item) => {
        if (item.id === editingMediaItem.id) {
          return {
            ...item,
            adjustedUrl: edited.url,
            filter: edited.filter,
            crop: edited.crop,
            rotation: edited.rotation,
          };
        }
        return item;
      })
    );
    if (attachedMedia === editingMediaItem.url || attachedMedia === editingMediaItem.adjustedUrl) {
      setAttachedMedia(edited.url);
    }
    setEditingMediaItem(null);
    triggerToast(`Applied filter & crop to ${editingMediaItem.name}!`, 'success');
  };

  // Handler for Tool 4: Document File Upload
  const handleDocFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeMb = (file.size / 1024 / 1024).toFixed(1);
    const ext = file.name.split('.').pop()?.toUpperCase() || 'DOC';
    setAttachedFile({
      name: file.name,
      size: `${sizeMb} MB`,
      type: ext,
      url: URL.createObjectURL(file),
    });
    setFileDraftName('');
    setActiveComposerTool(null);
    triggerToast(`Attached file: ${file.name}`, 'success');
    e.target.value = '';
  };

  // Handler for Mii 48H Stories File Processing (Photo, Audio, Video)
  const processMiiFile = (file: File) => {
    if (!file) return;

    const sizeMb = (file.size / 1024 / 1024).toFixed(2);
    setMiiMediaFileName(file.name);
    setMiiMediaFileSize(`${sizeMb} MB`);

    if (file.type.startsWith('image/')) {
      setMiiType('photo');
    } else if (file.type.startsWith('audio/')) {
      setMiiType('audio');
    } else if (file.type.startsWith('video/')) {
      setMiiType('video');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setMiiMediaUrl(dataUrl);
      triggerToast(`Attached ${file.name} (${sizeMb} MB) to Mii!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleMiiFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processMiiFile(file);
      e.target.value = '';
    }
  };

  const handleMiiFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMiiDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processMiiFile(file);
    }
  };

  // Handler for Tool 5: Fetch Open Graph for Manual URL Input
  const handleFetchOgUrl = async () => {
    if (!linkInputUrl.trim()) {
      triggerToast('Please enter a valid webpage URL', 'error');
      return;
    }
    setIsFetchingOg(true);
    try {
      const meta = await openGraphService.fetchMetadata(linkInputUrl.trim());
      setLinkOgData(meta);
      setOgManualTitle(meta.title);
      setOgManualDescription(meta.description);
      setOgManualImage(meta.image || '');
      triggerToast(`Scraped Open Graph data from ${meta.domain}`, 'info');
    } catch {
      triggerToast('Unable to reach destination URL', 'error');
    } finally {
      setIsFetchingOg(false);
    }
  };

  // Handler for Tool 6: IP Auto Fill
  const handleAutoFillIpLocation = async () => {
    setIsDetectingIp(true);
    try {
      const loc = await locationService.detectLocationFromIp();
      setLocationInput(loc.formattedAddress);
      locationService.saveUserLocation(loc);
      triggerToast(`Detected IP Mesh Hub: ${loc.formattedAddress}`, 'success');
    } catch {
      triggerToast('Failed to auto-detect IP node, using sovereign mesh default', 'error');
    } finally {
      setIsDetectingIp(false);
    }
  };

  // Handler for Tool 7: Audio File Upload
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const trackName = file.name.replace(/\.[^/.]+$/, '');
    setAttachedStem(`${trackName} (Lossless ${file.type.includes('flac') ? '24-Bit FLAC' : 'WAV'})`);
    setActiveComposerTool(null);
    triggerToast(`Attached audio stem: ${file.name}`, 'success');
    e.target.value = '';
  };

  // Handler for Tool 8: Video File Upload
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const clipName = file.name.replace(/\.[^/.]+$/, '');
    setAttachedStream(`${clipName} (Live WebRTC Broadcast)`);
    setActiveComposerTool(null);
    triggerToast(`Attached live video stream: ${file.name}`, 'success');
    e.target.value = '';
  };

  // Handle Post Creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setComposerError(null);

    if (!composerContent.trim()) {
      setComposerError('Please write your discussion content before posting.');
      return;
    }

    if (!composerCategory) {
      setComposerError('Mandatory: Please select a category from the dropdown to publish your post.');
      return;
    }

    const matchedCat = apiCategories.find((c) => c.id === composerCategory || c.name === composerCategory);
    const categoryLabel = matchedCat ? `${matchedCat.icon} ${matchedCat.name}` : composerCategory;

    // Dynamically retrieve author from UserProfileSyncService for 100% sync
    const currentMember = userProfileSyncService.getProfile();
    const tempPostId = `post-${Date.now()}`;

    const finalMediaUrls = attachedMediaList.map((m) => m.adjustedUrl || m.url);
    if (attachedMedia && !finalMediaUrls.includes(attachedMedia)) {
      finalMediaUrls.unshift(attachedMedia);
    }
    const finalPrimaryMedia = finalMediaUrls[0] || attachedMedia || undefined;

    const newPost: FeedPost = {
      id: tempPostId,
      title: composerTitle.trim() || `${currentMember.name} Protocol Broadcast`,
      content: composerContent.trim(),
      authorName: currentMember.name,
      authorHandle: `@${currentMember.username}`,
      authorAvatar: currentMember.avatar,
      authorRole: currentMember.headline || 'Protocol Member',
      categoryName: categoryLabel,
      createdAt: 'Just now',
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: true,
      isBookmarked: false,
      tags: composerTags
        ? composerTags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['Community', 'Sovereign'],
      isVerified: true,
      mediaUrl: finalPrimaryMedia,
      mediaUrls: finalMediaUrls.length > 0 ? finalMediaUrls : undefined,
      poll: attachedPoll || undefined,
      event: attachedEvent || undefined,
      fileAttachment: attachedFile || undefined,
      linkEmbed: attachedLink || undefined,
      locationTag: attachedLocation || undefined,
      audioPreview: attachedStem || undefined,
      videoStreamUrl: attachedStream || undefined,
      taggedProduct: taggedProduct || undefined,
      commentsList: [],
    };

    // Capture attachments before resetting state
    const mediaAttachment = finalPrimaryMedia;
    const mediaUrlsAttachment = finalMediaUrls;
    const pollAttachment = attachedPoll;
    const eventAttachment = attachedEvent;
    const fileAttachment = attachedFile;
    const linkAttachment = attachedLink;
    const locationAttachment = attachedLocation;
    const stemAttachment = attachedStem;
    const streamAttachment = attachedStream;
    const productAttachment = taggedProduct;

    // Optimistically update feed UI
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setComposerTitle('');
    setComposerContent('');
    setComposerCategory('');
    setComposerTags('');
    setTaggedProduct(null);
    setAttachedMedia(null);
    setAttachedMediaList([]);
    setAttachedPoll(null);
    setAttachedEvent(null);
    setAttachedFile(null);
    setAttachedLink(null);
    setAttachedLocation(null);
    setAttachedStem(null);
    setAttachedStream(null);
    setActiveComposerTool(null);

    triggerToast('Post published successfully to the sovereign feed!', 'success');
    voiceLineServiceInstance.playCommentaryVoiceLine('forum');

    // Persist to PostgreSQL via Backend API
    try {
      const payload = {
        title: newPost.title,
        content: newPost.content,
        category_name: categoryLabel,
        category_id: composerCategory,
        author_name: currentMember.name,
        author_handle: `@${currentMember.username}`,
        author_avatar: currentMember.avatar,
        author_role: currentMember.headline || 'Protocol Member',
        tags: newPost.tags,
        media_url: mediaAttachment || undefined,
        media_urls: mediaUrlsAttachment.length > 0 ? mediaUrlsAttachment : (mediaAttachment ? [mediaAttachment] : []),
        poll: pollAttachment || undefined,
        poll_data: pollAttachment || undefined,
        event: eventAttachment || undefined,
        event_data: eventAttachment || undefined,
        file_attachment: fileAttachment || undefined,
        link_preview: linkAttachment || undefined,
        location_data: locationAttachment || undefined,
        audio_stem: stemAttachment || undefined,
        video_stream_url: streamAttachment || undefined,
        tagged_product: productAttachment || undefined,
      };

      const res = await ForumService.createFeedPost(payload);
      if (res.success && res.data) {
        const persistedId = `post-${res.data.id || res.data.rawId || tempPostId}`;
        setPosts((prev) =>
          prev.map((p) =>
            p.id === tempPostId
              ? {
                ...p,
                id: persistedId,
                createdAt: res.data.createdAt || p.createdAt,
                poll: res.data.poll || p.poll,
                event: res.data.event || p.event,
              }
              : p
          )
        );
        triggerToast('Post persisted to PostgreSQL database!', 'success');
      }
    } catch {
      /* backend persistence error ignored */
    }
  };

  // In-Card Poll Voting Handler
  const handleVotePoll = async (postId: string, optionIndex: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId && p.poll && p.poll.userVotedIndex === undefined) {
          const updatedOptions = p.poll.options.map((opt, idx) =>
            idx === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...p,
            poll: {
              ...p.poll,
              options: updatedOptions,
              totalVotes: p.poll.totalVotes + 1,
              userVotedIndex: optionIndex,
            },
          };
        }
        return p;
      })
    );
    triggerToast('Vote recorded on sovereign mesh ledger!', 'success');

    try {
      const rawId = postId.replace(/^post-/, '');
      await ForumService.votePoll(rawId, optionIndex);
    } catch {
      /* vote sync handled */
    }
  };

  // In-Card RSVP Handler
  const handleRsvpEvent = async (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId && p.event) {
          const isCurrentlyRsvpd = !!p.event.isRsvpd;
          return {
            ...p,
            event: {
              ...p.event,
              isRsvpd: !isCurrentlyRsvpd,
              rsvpCount: isCurrentlyRsvpd ? Math.max(0, p.event.rsvpCount - 1) : p.event.rsvpCount + 1,
            },
          };
        }
        return p;
      })
    );
    triggerToast('RSVP attendance status updated!', 'info');

    try {
      const rawId = postId.replace(/^post-/, '');
      await ForumService.rsvpEvent(rawId);
    } catch {
      /* rsvp sync handled */
    }
  };

  // In-Card Likes Handler
  const handleToggleLike = async (postId: string) => {
    const targetPost = posts.find((p) => p.id === postId);
    const willBeLiked = targetPost ? !targetPost.isLiked : true;

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const liked = !p.isLiked;
          return {
            ...p,
            isLiked: liked,
            likesCount: liked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      })
    );

    try {
      const rawId = postId.replace(/^post-/, '');
      if (willBeLiked) {
        await ForumService.likePost(rawId);
      } else {
        await ForumService.unlikePost(rawId);
      }
    } catch {
      /* like sync handled */
    }
  };

  // In-Card Bookmark Handler
  const handleToggleBookmark = async (postId: string) => {
    const targetPost = posts.find((p) => p.id === postId);
    const willBeSaved = targetPost ? !targetPost.isBookmarked : true;

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const bookmarked = !p.isBookmarked;
          triggerToast(bookmarked ? 'Saved to sovereign bookmarks' : 'Removed from bookmarks', 'info');
          return {
            ...p,
            isBookmarked: bookmarked,
          };
        }
        return p;
      })
    );

    try {
      const rawId = postId.replace(/^post-/, '');
      if (willBeSaved) {
        await ForumService.savePost(rawId);
      } else {
        await ForumService.unsavePost(rawId);
      }
    } catch {
      /* bookmark sync handled */
    }
  };

  // In-Card Share Handler
  const handleSharePost = async (post: FeedPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.content,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${window.location.origin}/forum#${post.id}`);
      triggerToast('Post deep-link copied to clipboard!', 'success');
    }

    try {
      const rawId = post.id.replace(/^post-/, '');
      await ForumService.sharePost(rawId);
    } catch {
      /* share sync handled */
    }
  };

  // Add Comment Handler
  const handleAddComment = async (postId: string) => {
    const text = commentInputTexts[postId]?.trim();
    if (!text) return;

    const currentMember = userProfileSyncService.getProfile();
    const tempCommentId = `comm-${Date.now()}`;
    const newComment: FeedComment = {
      id: tempCommentId,
      authorName: currentMember.name,
      authorHandle: `@${currentMember.username}`,
      authorAvatar: currentMember.avatar,
      text,
      createdAt: 'Just now',
    };

    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            commentsList: [...(p.commentsList || []), newComment],
          };
        }
        return p;
      })
    );

    setCommentInputTexts((prev) => ({ ...prev, [postId]: '' }));
    triggerToast('Comment posted to discussion thread!', 'success');
    voiceLineServiceInstance.playCommentaryVoiceLine('forum');

    try {
      const rawId = postId.replace(/^post-/, '');
      const res = await ForumService.addComment(rawId, text);
      if (res.success && res.data) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === postId) {
              const updatedList = (p.commentsList || []).map((c) =>
                c.id === tempCommentId ? { ...c, id: `c-${res.data.id}` } : c
              );
              return { ...p, commentsList: updatedList };
            }
            return p;
          })
        );
      }
    } catch {
      /* comment sync handled */
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Hidden File Inputs for Direct Device Attachments */}
      <input
        ref={mediaFileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleMediaFileUpload}
      />
      <input
        ref={docFileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.zip,.flac,.mp3,.mp4,.sol,.json"
        className="hidden"
        onChange={handleDocFileUpload}
      />
      <input
        ref={audioFileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleAudioFileUpload}
      />
      <input
        ref={videoFileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoFileUpload}
      />

      {/* TOP NAVIGATION & LEVEL 2 NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: 1. Logo, 2. FingerMobile, 3. Burger Menu (Justified & Well-Spaced) */}
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              {/* 1. Logo (Click to View / Enlarge & Download in HD formats) */}
              <button
                type="button"
                onClick={() => setIsLogoViewerOpen(true)}
                className="group relative cursor-pointer focus:outline-none transition-transform hover:scale-105 shrink-0"
                aria-label="View and Download FingerMobile Logo in HD"
                title="Click to Enlarge & Download FingerMobile™ Logo in Ultra HD (4K / SVG / PNG)"
              >
                <div className="h-10 w-10 rounded-2xl overflow-hidden bg-white p-1 border border-slate-300 dark:border-slate-700 shadow-xs flex items-center justify-center group-hover:ring-2 group-hover:ring-orange-500/50 transition-all">
                  <img
                    src="/assets/branding/fingermobile/logo-white.webp"
                    alt="FingerMobile Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/branding/fingermobile/FingerMobile White Logo FRONT.webp';
                    }}
                  />
                </div>
                {/* HD indicator pill */}
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[8px] font-black rounded-md shadow-xs opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all tracking-wider">
                  HD
                </span>
              </button>

              {/* 2. FingerMobile Brand Name Typography */}
              <h1 className="flex items-center m-0 p-0">
                <button
                  type="button"
                  onClick={() => navigate('/forum')}
                  className="cursor-pointer flex flex-col focus:outline-none text-left group"
                  aria-label="FingerMobile Protocol"
                >
                  <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white flex items-center group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    FingerMobile<span className="text-[#ff6b00] ml-0.5">™</span>
                  </span>
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-600 dark:text-slate-400 -mt-1">
                    Protocol
                  </span>
                </button>
              </h1>

              {/* 3. Orange Burger Menu / Drawer Button (Justified & Spaced) */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-drawer-menu'))}
                className="p-2 sm:p-2.5 rounded-2xl border border-orange-200 dark:border-orange-500/30 bg-orange-50/80 hover:bg-orange-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#ff6b00] hover:text-[#e05e00] transition-all shadow-xs flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500/40 cursor-pointer ml-1 sm:ml-2"
                aria-label="Open Navigation Drawer"
                title="Platform Navigation (385 Pages / 230+ Screens)"
              >
                <Bars3Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff6b00]" />
              </button>
            </div>

            {/* Center: Search Bar (Spacious & Justified) */}
            <div className="hidden md:flex flex-1 max-w-lg mx-6">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search sovereign posts, stems, keycards, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-orange-500 focus:outline-none font-medium font-bold border-slate-300"
                />
              </div>
            </div>

            {/* Right: Quick Navigation Badges & Settings Link */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLiveStudioOpen(true)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <SignalIcon className="w-3.5 h-3.5 animate-pulse" />
                <span>Go Live</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/settings')}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                title="Sovereign Profile & Settings (Syncs with Master Dashboard)"
              >
                <LockClosedIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Level 2 Sub-Nav Row */}
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-none border-t border-slate-100 dark:border-slate-800 text-xs">
            {SUB_NAV_ITEMS.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  setActiveSubNav(sub.id);
                  navigate(sub.path);
                }}
                className={`px-3 py-1 rounded-lg font-bold whitespace-nowrap transition ${
                  activeSubNav === sub.id
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ======================================================================= */}
          {/* LEFT RAIL (3 cols): IDENTITY, UNIVERSAL PROFILE CARD, PRIVACY           */}
          {/* ======================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            {/* 1. Sovereign Universal ProfileCard (Subscribed to UserProfileSyncService) */}
            <UniversalProfileCard />

            {/* Quick Live Studio & "Join Me Live" Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-black text-slate-800 dark:text-white">
                    Live Broadcast Studio
                  </span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 px-2 py-0.5 rounded-full border border-rose-500/20">
                  WebRTC
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setLiveStudioInitialTab('broadcast');
                    setIsLiveStudioOpen(true);
                  }}
                  className="py-2 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <SignalIcon className="w-3.5 h-3.5" />
                  <span>Go Live</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLiveStudioInitialTab('schedule');
                    setIsLiveStudioOpen(true);
                  }}
                  className="py-2 px-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>📅 Schedule</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setLiveStudioInitialTab('events');
                  setIsLiveStudioOpen(true);
                }}
                className="w-full py-1.5 px-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-[10px] font-semibold text-slate-600 dark:text-slate-300 transition flex items-center justify-between"
              >
                <span>🗓️ Scheduled Broadcasts</span>
                <span className="text-orange-500 font-bold">Platform Events →</span>
              </button>
            </div>

            {/* Explore Multi-App Navigation Card (Relocated from Header) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-3.5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ListBulletIcon className="w-4 h-4 text-[#ff6b00]" />
                  Explore Channels
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-950 border border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-800">
                  Sovereign
                </span>
              </div>
              <div className="grid grid-cols-1 gap-1">
                {MINI_DRAWER_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.path)}
                    className="w-full text-left p-2 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 hover:border-orange-200 transition flex items-center justify-between group cursor-pointer bg-slate-50/50 dark:bg-slate-850"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-orange-600 flex items-center gap-1.5">
                        <span>{item.name}</span>
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400">({item.badge})</span>
                      </div>
                      <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium truncate mt-0.5">{item.description}</div>
                    </div>
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-slate-700 group-hover:text-orange-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Category Filter Selector (Drop Down and Select Option) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800 p-3.5 shadow-xs relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase text-slate-900 dark:text-white">Topic Categories</span>
                <span className="text-[10px] text-orange-950 dark:text-orange-300 font-bold bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded-full border border-orange-300 dark:border-orange-800">
                  {apiCategories.length} Topics
                </span>
              </div>

              {/* Drop down and select trigger button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                  className="w-full text-left px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-900 dark:text-white font-bold text-xs flex items-center justify-between shadow-2xs transition cursor-pointer"
                  aria-haspopup="listbox"
                  aria-expanded={isCategoryDropdownOpen}
                >
                  <span className="truncate flex items-center gap-2">
                    {selectedCategoryId === 'all' ? (
                      <>
                        <span className="text-base">🔥</span>
                        <span className="text-slate-900 dark:text-white font-bold">All Feeds & Topics</span>
                      </>
                    ) : (
                      <>
                        <span className="text-base">
                          {apiCategories.find((c) => c.name.toLowerCase() === selectedCategoryId.toLowerCase())?.icon || '📁'}
                        </span>
                        <span className="truncate text-slate-900 dark:text-white font-bold">{selectedCategoryId}</span>
                      </>
                    )}
                  </span>
                  <ChevronDownIcon className={`w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform duration-200 shrink-0 ml-2 ${isCategoryDropdownOpen ? 'rotate-180 text-orange-600' : ''}`} />
                </button>

                {/* Dropdown Menu Options */}
                {isCategoryDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 shadow-xl z-50 p-1.5 max-h-64 overflow-y-auto space-y-0.5 text-xs animate-in fade-in duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategoryId('all');
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg font-bold transition flex items-center justify-between cursor-pointer ${
                        selectedCategoryId === 'all'
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>🔥</span>
                        <span>All Feeds & Topics</span>
                      </span>
                      {selectedCategoryId === 'all' && <CheckIcon className="w-4 h-4 text-slate-700" />}
                    </button>

                    {apiCategories.map((cat) => {
                      const isSelected = selectedCategoryId.toLowerCase() === cat.name.toLowerCase();
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategoryId(cat.name);
                            setIsCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-orange-500 text-white font-bold shadow-xs'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold'
                          }`}
                        >
                          <span className="truncate flex items-center gap-2">
                            <span>{cat.icon}</span>
                            <span className="truncate">{cat.name}</span>
                          </span>
                          {isSelected && <CheckIcon className="w-4 h-4 text-slate-700 shrink-0 ml-1.5" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* CENTER RAIL (6 cols): STORIES, COMPOSER, RICH POST FEED                 */}
          {/* ======================================================================= */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Mii™®©℠ 48H Ephemeral Stories Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-xs">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
                  Mii™®©℠
                </span>
                <span className="text-[10px] text-slate-700 font-mono">48H Disappearing</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
                {/* Create Mii Button */}
                <button
                  type="button"
                  onClick={() => setIsMiiCreatorOpen(true)}
                  className="flex flex-col items-center gap-1 flex-shrink-0 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-orange-400 flex items-center justify-center bg-orange-50/50 group-hover:bg-orange-100 transition">
                    <PlusIcon className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Create Mii™®©℠</span>
                </button>

                {/* Story Avatars */}
                {miiStories.map((story) => (
                  <button
                    key={story.id}
                    type="button"
                    onClick={() => setSelectedMii(story)}
                    className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group"
                  >
                    <div className={`w-14 h-14 rounded-full p-0.5 border-2 ${story.isViewed ? 'border-slate-300' : 'border-gradient-to-tr border-orange-500 animate-pulse'}`}>
                      <img src={story.avatar} alt={story.author} className="w-full h-full rounded-full object-cover" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[60px]">{story.author.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. THE NEW HIGH-POWERED POST COMPOSER */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <img
                    src={syncedProfile.avatar}
                    alt={syncedProfile.name}
                    className="w-8 h-8 rounded-full object-cover border border-orange-200"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{syncedProfile.name}</span>
                    <span className="text-[10px] text-slate-700 block font-mono">@{syncedProfile.username}</span>
                  </div>
                </div>

                {/* Tab Switcher: Write vs Preview */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setComposerTab('write')}
                    className={`px-2.5 py-1 rounded-md transition ${composerTab === 'write' ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setComposerTab('preview')}
                    className={`px-2.5 py-1 rounded-md transition ${composerTab === 'preview' ? 'bg-white dark:bg-slate-700 text-orange-600 shadow-xs' : 'text-slate-500'}`}
                  >
                    Preview
                  </button>
                </div>
              </div>

              {composerError && (
                <div className="mt-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
                  <span>{composerError}</span>
                </div>
              )}

              {/* Composer Form */}
              <form onSubmit={handleCreatePost} className="mt-3 space-y-3">
                {/* Optional Title */}
                <input
                  type="text"
                  placeholder="Post title or headline (optional)..."
                  value={composerTitle}
                  onChange={(e) => setComposerTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:ring-1 focus:ring-orange-500 focus:outline-none text-slate-900 border-slate-300 placeholder:text-slate-400"
                />

                {/* Mandatory Category Dropdown */}
                <div className="relative">
                  <select
                    value={composerCategory}
                    onChange={(e) => setComposerCategory(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-200 focus:ring-1 focus:ring-orange-500 focus:outline-none border-slate-300"
                  >
                    <option value="">▼ Select Mandatory Category (54 Available Topics)...</option>
                    {apiCategories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.icon} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Write / Preview Text Area */}
                {composerTab === 'write' ? (
                  <div className="space-y-1">
                    <textarea
                      rows={3}
                      placeholder="Share discussions, paste https:// URLs for instant OG previews, or attach media/stems..."
                      value={composerContent}
                      onChange={handleContentChange}
                      className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none resize-none leading-relaxed text-slate-900 font-bold border-slate-300 placeholder:text-slate-400"
                    />

                    {/* Markdown Inserters */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-700">
                      <span>Format:</span>
                      <button type="button" onClick={() => insertMarkdownSyntax('bold')} className="hover:text-slate-700 font-bold px-1">B</button>
                      <button type="button" onClick={() => insertMarkdownSyntax('italic')} className="hover:text-slate-700 italic px-1">I</button>
                      <button type="button" onClick={() => insertMarkdownSyntax('heading')} className="hover:text-slate-700 px-1">H3</button>
                      <button type="button" onClick={() => insertMarkdownSyntax('bullet')} className="hover:text-slate-700 px-1">• List</button>
                      <button type="button" onClick={() => insertMarkdownSyntax('code')} className="hover:text-slate-700 font-mono px-1">&lt;/&gt;</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[80px] text-xs leading-relaxed">
                    {composerContent ? (
                      <div className="prose prose-xs dark:prose-invert">
                        <p className="whitespace-pre-wrap">{composerContent}</p>
                      </div>
                    ) : (
                      <span className="text-slate-700 italic">No content typed yet. Switch back to write.</span>
                    )}
                  </div>
                )}

                {/* ================================================================= */}
                {/* MULTI-MEDIA ATTACHMENT GALLERY STRIP (Edit, Crop & Filters)        */}
                {/* ================================================================= */}
                {attachedMediaList.length > 0 && (
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <CameraIcon className="w-4 h-4 text-sky-400" />
                          Attached Media ({attachedMediaList.length})
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800 text-[10px] font-mono font-semibold">
                          Multi-Select Active
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => mediaFileInputRef.current?.click()}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                          <span>Add More</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAttachedMediaList([]);
                            setAttachedMedia(null);
                          }}
                          className="text-slate-400 hover:text-rose-400 text-[11px] font-semibold transition cursor-pointer"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>

                    {/* Horizontal Scrolling Media Cards */}
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                      {attachedMediaList.map((item, idx) => (
                        <div
                          key={item.id}
                          className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex flex-col justify-between p-1.5 shadow-md group/card"
                        >
                          {item.type === 'video' ? (
                            <div className="absolute inset-0 bg-black flex items-center justify-center">
                              <video
                                src={item.adjustedUrl || item.url}
                                className="w-full h-full object-cover"
                                muted
                                playsInline
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <VideoCameraIcon className="w-6 h-6 text-white drop-shadow" />
                              </div>
                            </div>
                          ) : (
                            <img
                              src={item.adjustedUrl || item.url}
                              alt={item.name}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}

                          {/* Top Badges & Remove */}
                          <div className="relative z-10 flex items-center justify-between w-full">
                            <span className="px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono font-bold text-white backdrop-blur-xs">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const nextList = attachedMediaList.filter((m) => m.id !== item.id);
                                setAttachedMediaList(nextList);
                                setAttachedMedia(nextList.length > 0 ? nextList[0].adjustedUrl || nextList[0].url : null);
                              }}
                              className="w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center text-xs font-bold transition shadow cursor-pointer"
                              title="Remove item"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Filter / Crop status indicator */}
                          {(item.filter || item.crop) && (
                            <div className="relative z-10">
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-[9px] font-bold truncate block backdrop-blur-xs">
                                ✨ {item.filter || item.crop}
                              </span>
                            </div>
                          )}

                          {/* Bottom Edit Action */}
                          <div className="relative z-10 w-full">
                            <button
                              type="button"
                              onClick={() => setEditingMediaItem(item)}
                              className="w-full py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center gap-1 backdrop-blur-xs transition shadow-xs cursor-pointer"
                              title="Crop, filter, and adjust"
                            >
                              <SparklesIcon className="w-3 h-3 text-amber-300" />
                              <span>Filters & Crop</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Add more tile */}
                      <button
                        type="button"
                        onClick={() => mediaFileInputRef.current?.click()}
                        className="flex-shrink-0 w-28 h-28 rounded-xl border-2 border-dashed border-slate-700 hover:border-sky-500 bg-slate-900/40 hover:bg-slate-900 flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-sky-300 transition cursor-pointer"
                      >
                        <PlusIcon className="w-6 h-6" />
                        <span className="text-[10px] font-bold">Add Media</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* ACTIVE ATTACHMENT BADGES CONTAINER                                */}
                {/* ================================================================= */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(attachedMediaList.length > 0 || attachedMedia) && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg text-[11px] font-bold">
                      <CameraIcon className="w-3.5 h-3.5" />
                      <span>{attachedMediaList.length || 1} Media File{attachedMediaList.length > 1 ? 's' : ''} Attached</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAttachedMedia(null);
                          setAttachedMediaList([]);
                        }}
                        className="hover:text-sky-900 font-black ml-1"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {attachedPoll && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-[11px] font-bold">
                      <ChartBarIcon className="w-3.5 h-3.5" />
                      <span>Poll: {attachedPoll.question}</span>
                      <button type="button" onClick={() => setAttachedPoll(null)} className="hover:text-purple-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedEvent && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-[11px] font-bold">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Event: {attachedEvent.title}</span>
                      <button type="button" onClick={() => setAttachedEvent(null)} className="hover:text-emerald-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedFile && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-[11px] font-bold">
                      <PaperClipIcon className="w-3.5 h-3.5" />
                      <span>File: {attachedFile.name} ({attachedFile.size})</span>
                      <button type="button" onClick={() => setAttachedFile(null)} className="hover:text-indigo-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedLink && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[11px] font-bold">
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Link: {attachedLink.title || attachedLink.url}</span>
                      <button type="button" onClick={() => setAttachedLink(null)} className="hover:text-blue-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedLocation && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[11px] font-bold">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      <span>Location: {attachedLocation}</span>
                      <button type="button" onClick={() => setAttachedLocation(null)} className="hover:text-rose-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedStem && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-[11px] font-bold">
                      <MusicalNoteIcon className="w-3.5 h-3.5" />
                      <span>Stem: {attachedStem}</span>
                      <button type="button" onClick={() => setAttachedStem(null)} className="hover:text-orange-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {attachedStream && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 rounded-lg text-[11px] font-bold">
                      <TvIcon className="w-3.5 h-3.5" />
                      <span>Stream: {attachedStream}</span>
                      <button type="button" onClick={() => setAttachedStream(null)} className="hover:text-fuchsia-900 font-black ml-1">✕</button>
                    </div>
                  )}

                  {taggedProduct && (
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] font-bold">
                      <ShoppingBagIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>Tagged: {taggedProduct.name} ({taggedProduct.platform} • {taggedProduct.price})</span>
                      <button type="button" onClick={() => setTaggedProduct(null)} className="hover:text-amber-950 font-black ml-1">✕</button>
                    </div>
                  )}
                </div>

                {/* ================================================================= */}
                {/* COMPOSER TOOL BAR (All 9 Tools Interactive)                       */}
                {/* ================================================================= */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1">
                    {/* Tool 1: Camera */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'media' ? null : 'media')}
                      className={`p-2 rounded-xl transition ${activeComposerTool === 'media' ? 'bg-sky-500 text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                      title="Camera (Photo/Video & Presets)"
                    >
                      <CameraIcon className="w-4 h-4" />
                    </button>

                    {/* Tool 2: Poll */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'poll' ? null : 'poll')}
                      className={`p-2 rounded-xl transition ${activeComposerTool === 'poll' ? 'bg-purple-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                      title="Poll Creator"
                    >
                      <ChartBarIcon className="w-4 h-4" />
                    </button>

                    {/* Tool 3: Event */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'event' ? null : 'event')}
                      className={`p-2 rounded-xl transition ${activeComposerTool === 'event' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                      title="Event Scheduler & RSVP"
                    >
                      <CalendarIcon className="w-4 h-4" />
                    </button>

                    {/* Tool 4: File */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'file' ? null : 'file')}
                      className={`p-2 rounded-xl transition ${activeComposerTool === 'file' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                      title="File Attachment & Whitepapers"
                    >
                      <PaperClipIcon className="w-4 h-4" />
                    </button>

                    {/* Tool 5: Link */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'link' ? null : 'link')}
                      className={`p-2 rounded-xl transition ${activeComposerTool === 'link' ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                      title="Link Inserter & Open Graph (OG)"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>

                    {/* Tool 6: Location */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'location' ? null : 'location')}
                      className={`p-2 rounded-xl transition ${activeComposerTool === 'location' ? 'bg-rose-600 text-white' : 'hover:bg-slate-100 text-slate-500'}`}
                      title="Location Tag (Auto-Fill from IP)"
                    >
                      <MapPinIcon className="w-4 h-4" />
                    </button>

                    {/* Tool 7: BeatwaveNG */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'beatwave' ? null : 'beatwave')}
                      className={`p-2 rounded-xl transition ${activeComposerTool === 'beatwave' ? 'bg-orange-600 text-white' : 'hover:bg-orange-50 text-orange-600'}`}
                      title="BeatwaveNG Audio Stems"
                    >
                      <MusicalNoteIcon className="w-4 h-4" />
                    </button>

                    {/* Tool 8: Dancia-4Tv */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'dancia' ? null : 'dancia')}
                      className={`p-2 rounded-xl transition ${activeComposerTool === 'dancia' ? 'bg-purple-600 text-white' : 'hover:bg-purple-50 text-purple-600'}`}
                      title="Dancia-4Tv Live Broadcast"
                    >
                      <TvIcon className="w-4 h-4" />
                    </button>

                    {/* Tool 9: Tag Product */}
                    <button
                      type="button"
                      onClick={() => setActiveComposerTool(activeComposerTool === 'product' ? null : 'product')}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition ${
                        activeComposerTool === 'product' ? 'bg-amber-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                      title="Tag Product (MarketPlace, OwnIt, Flamingo, Storefront, FingerLux)"
                    >
                      <ShoppingBagIcon className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tag Product</span>
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PaperAirplaneIcon className="w-3.5 h-3.5" />
                    Publish Post
                  </button>
                </div>

                {/* ================================================================= */}
                {/* SUB-PANEL 1: CAMERA (PHOTO/VIDEO & PRESETS)                       */}
                {/* ================================================================= */}
                {activeComposerTool === 'media' && (
                  <div className="p-3.5 bg-sky-50/90 border border-sky-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sky-900 flex items-center gap-1.5">
                        <CameraIcon className="w-4 h-4 text-sky-600" />
                        Camera (Photo/Video Upload & Presets)
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-sky-600 font-bold">✕ Close</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => mediaFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <PhotoIcon className="w-3.5 h-3.5" />
                        <span>Choose Photo/Video from Device</span>
                      </button>

                      <div className="flex-1 flex gap-2 min-w-[220px]">
                        <input
                          type="url"
                          placeholder="Or paste media URL (https://...)"
                          value={mediaInputUrl}
                          onChange={(e) => setMediaInputUrl(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-sky-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (mediaInputUrl.trim()) {
                              setAttachedMedia(mediaInputUrl.trim());
                              setMediaInputUrl('');
                              setActiveComposerTool(null);
                              triggerToast('Media attached successfully!', 'success');
                            }
                          }}
                          className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl"
                        >
                          Attach
                        </button>
                      </div>
                    </div>

                    {/* Presets requested by user: Studio, Stems, Keycard NFC, Escrow Gift */}
                    <div className="pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700 mb-1">
                        One-Click Presets:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: 'Studio', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000' },
                          { label: 'Stems', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000' },
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
                            className="px-2.5 py-1 bg-white hover:bg-sky-100 border border-sky-200 rounded-lg text-sky-800 font-semibold text-[11px] transition shadow-2xs"
                          >
                            + {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* SUB-PANEL 2: POLL CREATOR                                         */}
                {/* ================================================================= */}
                {activeComposerTool === 'poll' && (
                  <div className="p-3.5 bg-purple-50/90 border border-purple-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
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
                      value={pollDraftQuestion}
                      onChange={(e) => setPollDraftQuestion(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-semibold text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />

                    <div className="space-y-1.5">
                      {pollDraftOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const updated = [...pollDraftOptions];
                              updated[idx] = e.target.value;
                              setPollDraftOptions(updated);
                            }}
                            className="flex-1 px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                          />
                          {pollDraftOptions.length > 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPollDraftOptions(pollDraftOptions.filter((_, i) => i !== idx));
                              }}
                              className="text-purple-500 hover:text-purple-800 font-black px-1.5"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}

                      {pollDraftOptions.length < 6 && (
                        <button
                          type="button"
                          onClick={() => setPollDraftOptions([...pollDraftOptions, ''])}
                          className="text-[11px] text-purple-700 hover:underline font-bold"
                        >
                          + Add Option (Max 6)
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-purple-700">
                        <span>Duration:</span>
                        <select
                          value={pollDraftDays}
                          onChange={(e) => setPollDraftDays(Number(e.target.value))}
                          className="bg-white border border-purple-200 rounded-lg px-2 py-0.5 text-xs font-semibold text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value={1}>24 Hours</option>
                          <option value={3}>3 Days</option>
                          <option value={7}>7 Days</option>
                          <option value={14}>14 Days</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const validOpts = pollDraftOptions.map((o) => o.trim()).filter(Boolean);
                          if (!pollDraftQuestion.trim()) {
                            triggerToast('Please provide a poll question.', 'error');
                            return;
                          }
                          if (validOpts.length < 2) {
                            triggerToast('Please provide at least 2 non-empty options.', 'error');
                            return;
                          }
                          setAttachedPoll({
                            question: pollDraftQuestion.trim(),
                            options: validOpts.map((t) => ({ text: t, votes: 0 })),
                            totalVotes: 0,
                            durationDays: pollDraftDays,
                          });
                          setActiveComposerTool(null);
                          triggerToast('Community poll attached!', 'success');
                        }}
                        className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                      >
                        Attach Poll
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* SUB-PANEL 3: EVENT SCHEDULER                                      */}
                {/* ================================================================= */}
                {activeComposerTool === 'event' && (
                  <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
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
                      value={eventDraftTitle}
                      onChange={(e) => setEventDraftTitle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-semibold text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="date"
                        value={eventDraftDate}
                        onChange={(e) => setEventDraftDate(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                      <input
                        type="time"
                        value={eventDraftTime}
                        onChange={(e) => setEventDraftTime(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                      <input
                        type="text"
                        placeholder="Location or Stream Link"
                        value={eventDraftLocation}
                        onChange={(e) => setEventDraftLocation(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const title = eventDraftTitle.trim() || 'Sovereign Community Event';
                          setAttachedEvent({
                            title,
                            date: eventDraftDate || 'Upcoming',
                            time: eventDraftTime || '18:00 WAT',
                            location: eventDraftLocation.trim() || 'Online WebRTC Stream',
                            rsvpCount: 1,
                            isRsvpd: true,
                          });
                          setActiveComposerTool(null);
                          triggerToast('Event scheduled and attached!', 'success');
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                      >
                        Attach Event
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* SUB-PANEL 4: FILE ATTACHMENT                                      */}
                {/* ================================================================= */}
                {activeComposerTool === 'file' && (
                  <div className="p-3.5 bg-indigo-50/90 border border-indigo-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <PaperClipIcon className="w-4 h-4 text-indigo-600" />
                        Attach Document or Sovereign Whitepaper
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-indigo-600 font-bold">✕ Close</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => docFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1"
                      >
                        <PaperClipIcon className="w-3.5 h-3.5" />
                        <span>Choose File from Device</span>
                      </button>

                      <div className="flex-1 flex gap-2 min-w-[200px]">
                        <input
                          type="text"
                          placeholder="Or type Document Name (e.g. Protocol_Specs.pdf)"
                          value={fileDraftName}
                          onChange={(e) => setFileDraftName(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-indigo-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (fileDraftName.trim()) {
                              setAttachedFile({
                                name: fileDraftName.trim(),
                                size: '2.5 MB',
                                type: fileDraftName.split('.').pop()?.toUpperCase() || 'PDF',
                              });
                              setFileDraftName('');
                              setActiveComposerTool(null);
                              triggerToast('Document attached!', 'success');
                            }
                          }}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl"
                        >
                          Attach File
                        </button>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 mb-1">
                        Sovereign Whitepaper Presets:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { name: 'FingerMobile_Protocol_Whitepaper_v2.4.pdf', size: '3.4 MB', type: 'PDF' },
                          { name: 'Sovereign_Keycard_NFC_Specs.pdf', size: '1.8 MB', type: 'PDF' },
                          { name: 'Conductive_Sensor_Firmware_v1.0.bin', size: '512 KB', type: 'BIN' },
                        ].map((fp) => (
                          <button
                            key={fp.name}
                            type="button"
                            onClick={() => {
                              setAttachedFile(fp);
                              setActiveComposerTool(null);
                              triggerToast(`Attached ${fp.name}`, 'success');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-lg text-indigo-800 font-semibold text-[11px]"
                          >
                            + {fp.name} ({fp.size})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* SUB-PANEL 5: LINK INSERTER & OPEN GRAPH (OG)                      */}
                {/* ================================================================= */}
                {activeComposerTool === 'link' && (
                  <div className="p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4 text-blue-600" />
                        Link Inserter & Open Graph (OG) Scraper
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-blue-600 font-bold">✕ Close</button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="Paste URL (https://facebook.com, https://fingermobile.io, ...)"
                        value={linkInputUrl}
                        onChange={(e) => setLinkInputUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-blue-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={handleFetchOgUrl}
                        disabled={isFetchingOg}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1"
                      >
                        {isFetchingOg ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : null}
                        <span>Fetch OG Preview</span>
                      </button>
                    </div>

                    {/* Open Graph Scraped Snippet Preview */}
                    {linkOgData && (
                      <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-2">
                        <div className="text-[10px] font-black uppercase text-blue-600 tracking-wider flex items-center justify-between">
                          <span>Live OG Preview Snippet</span>
                          <span className="font-mono text-slate-700">{linkOgData.domain}</span>
                        </div>

                        <div className="flex gap-3">
                          {linkOgData.image && (
                            <img
                              src={linkOgData.image}
                              alt={linkOgData.title}
                              className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-black text-slate-900 text-xs truncate">{linkOgData.title}</h4>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{linkOgData.description}</p>
                            <span className="text-[10px] font-mono text-blue-600 truncate block mt-1">{linkOgData.url}</span>
                          </div>
                        </div>

                        {/* Why Previews Sometimes Fail Diagnostic Box */}
                        {linkOgData.failureReason && (
                          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 space-y-1">
                            <div className="font-bold flex items-center gap-1">
                              <span>⚠️ Notice:</span>
                              {linkOgData.failureReason === 'PRIVACY_RESTRICTED' && 'Privacy Settings Restricted (Login Wall / Private Group)'}
                              {linkOgData.failureReason === 'POOR_CONNECTION' && 'Poor Connection / Timeout'}
                              {linkOgData.failureReason === 'MISSING_TAGS' && 'Missing Open Graph Tags on Target Page'}
                            </div>
                            <p className="text-[10px] text-amber-700">
                              You can manually fill in the headline, summary, and thumbnail image below.
                            </p>
                          </div>
                        )}

                        {/* Editable Manual Overrides */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                          <input
                            type="text"
                            placeholder="Override Title"
                            value={ogManualTitle}
                            onChange={(e) => setOgManualTitle(e.target.value)}
                            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                          />
                          <input
                            type="url"
                            placeholder="Override Image URL"
                            value={ogManualImage}
                            onChange={(e) => setOgManualImage(e.target.value)}
                            className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                          />
                        </div>

                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setAttachedLink({
                                url: linkOgData.url,
                                title: ogManualTitle || linkOgData.title || 'Web Resource',
                                description: ogManualDescription || linkOgData.description || '',
                                image: ogManualImage || linkOgData.image || '',
                                domain: linkOgData.domain,
                              });
                              setActiveComposerTool(null);
                              triggerToast('Open Graph preview snippet attached!', 'success');
                            }}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                          >
                            Attach Link Snippet
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ================================================================= */}
                {/* SUB-PANEL 6: LOCATION TAG (AUTO-FILL FROM IP)                     */}
                {/* ================================================================= */}
                {activeComposerTool === 'location' && (
                  <div className="p-3.5 bg-rose-50/90 border border-rose-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900 flex items-center gap-1.5">
                        <MapPinIcon className="w-4 h-4 text-rose-600" />
                        Location Tag & IP Sovereign Mesh Node
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-rose-600 font-bold">✕ Close</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleAutoFillIpLocation}
                        disabled={isDetectingIp}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
                      >
                        {isDetectingIp ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : <span>🌐</span>}
                        <span>Auto-Fill from Current IP</span>
                      </button>

                      <div className="flex-1 flex gap-2 min-w-[200px]">
                        <input
                          type="text"
                          placeholder="Or enter Map Address..."
                          value={locationInput}
                          onChange={(e) => setLocationInput(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-rose-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (locationInput.trim()) {
                              setAttachedLocation(locationInput.trim());
                              setActiveComposerTool(null);
                              triggerToast(`Location pinned: ${locationInput.trim()}`, 'success');
                            }
                          }}
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl"
                        >
                          Pin Location
                        </button>
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700 mb-1">
                        Sovereign Geographic Nodes:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          'Victoria Island Studio Hub, Lagos',
                          'Abuja Central Sovereign Node',
                          'Soho Creative Quarter, London',
                          'Brooklyn Tech Corridor, New York',
                          'Cyberjaya Digital Free Zone, Malaysia',
                        ].map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => {
                              setAttachedLocation(loc);
                              setActiveComposerTool(null);
                              triggerToast(`Location pinned: ${loc}`, 'success');
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-rose-100 border border-rose-200 rounded-lg text-rose-800 font-semibold text-[11px]"
                          >
                            📍 {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* SUB-PANEL 7: BEATWAVENG AUDIO STEMS                               */}
                {/* ================================================================= */}
                {activeComposerTool === 'beatwave' && (
                  <div className="p-3.5 bg-orange-50/90 border border-orange-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-orange-900 flex items-center gap-1.5">
                        <MusicalNoteIcon className="w-4 h-4 text-orange-600" />
                        BeatwaveNG Spatial Audio Stems Selector
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-orange-600 font-bold">✕ Close</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => audioFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl flex items-center gap-1"
                      >
                        <MusicalNoteIcon className="w-3.5 h-3.5" />
                        <span>Upload Audio / Stem File (.flac/.wav/.mp3)</span>
                      </button>

                      <div className="flex-1 flex gap-2 min-w-[200px]">
                        <input
                          type="text"
                          placeholder="Or type custom track name..."
                          value={customStemTitle}
                          onChange={(e) => setCustomStemTitle(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-orange-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customStemTitle.trim()) {
                              setAttachedStem(`${customStemTitle.trim()} (24-Bit Lossless)`);
                              setActiveComposerTool(null);
                              triggerToast(`Attached stem: ${customStemTitle.trim()}`, 'success');
                            }
                          }}
                          className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl"
                        >
                          Attach
                        </button>
                      </div>
                    </div>

                    {/* Pre-Loaded Stems from BeatwaveNG */}
                    <div className="space-y-1 pt-1">
                      {[
                        { title: 'Amapiano 118BPM Log Drum & Sub-Bass Master', format: '24-Bit FLAC' },
                        { title: 'BeatwaveNG Lossless 128BPM Spatial Stem Pack', format: 'Dolby Atmos WAV' },
                        { title: 'Highlife Fusion 120BPM Guitars & Horns Stem', format: '24-Bit Lossless' },
                      ].map((stem) => (
                        <button
                          key={stem.title}
                          type="button"
                          onClick={() => {
                            setAttachedStem(`${stem.title} (${stem.format})`);
                            setActiveComposerTool(null);
                            triggerToast(`Attached: ${stem.title}`, 'success');
                          }}
                          className="w-full text-left p-2 bg-white border border-orange-200 rounded-xl hover:bg-orange-100 font-semibold text-orange-950 flex justify-between items-center transition"
                        >
                          <span>🎵 {stem.title}</span>
                          <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{stem.format}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* SUB-PANEL 8: DANCIA-4TV LIVE BROADCAST                            */}
                {/* ================================================================= */}
                {activeComposerTool === 'dancia' && (
                  <div className="p-3.5 bg-purple-50/90 border border-purple-200 rounded-2xl space-y-2.5 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <TvIcon className="w-4 h-4 text-purple-600" />
                        Dancia-4Tv Live Broadcast Stream Embed
                      </span>
                      <button type="button" onClick={() => setActiveComposerTool(null)} className="text-purple-600 font-bold">✕ Close</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => videoFileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center gap-1"
                      >
                        <VideoCameraIcon className="w-3.5 h-3.5" />
                        <span>Select Video / Replay Stream</span>
                      </button>

                      <div className="flex-1 flex gap-2 min-w-[200px]">
                        <input
                          type="text"
                          placeholder="Or type live stream channel..."
                          value={customStreamTitle}
                          onChange={(e) => setCustomStreamTitle(e.target.value)}
                          className="flex-1 px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customStreamTitle.trim()) {
                              setAttachedStream(customStreamTitle.trim());
                              setActiveComposerTool(null);
                              triggerToast(`Attached stream: ${customStreamTitle.trim()}`, 'success');
                            }
                          }}
                          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl"
                        >
                          Attach
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      {[
                        { title: 'Dancia-4Tv Live Stage #1: Street Dance Championship', badge: '4K WebRTC Live' },
                        { title: 'Afrobeat Choreography Showcase (Live 360° VR Feed)', badge: 'VR Stream' },
                        { title: 'Lagos Urban Dance Cypher Live 360° Battle', badge: 'P2P Mesh' },
                      ].map((stream) => (
                        <button
                          key={stream.title}
                          type="button"
                          onClick={() => {
                            setAttachedStream(stream.title);
                            setActiveComposerTool(null);
                            triggerToast(`Attached stream: ${stream.title}`, 'success');
                          }}
                          className="w-full text-left p-2 bg-white border border-purple-200 rounded-xl hover:bg-purple-100 font-semibold text-purple-950 flex justify-between items-center transition"
                        >
                          <span>📺 {stream.title}</span>
                          <span className="text-[10px] font-mono font-bold text-purple-950 bg-purple-50 px-2 py-0.5 rounded-full border text-purple-950 border-purple-400 font-black">{stream.badge}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ================================================================= */}
                {/* SUB-PANEL 9: TAG PRODUCT (MarketPlace, OwnIt, Flamingo, Storefront, FingerLux) */}
                {/* ================================================================= */}
                {activeComposerTool === 'product' && (() => {
                  const query = productSearchQuery.toLowerCase().trim();

                  // Filter across all stores
                  const filteredCatalog = STORE_CATALOG_OPTIONS.filter((item) => {
                    const matchesQuery =
                      !query ||
                      item.name.toLowerCase().includes(query) ||
                      (item.description && item.description.toLowerCase().includes(query)) ||
                      item.platform.toLowerCase().includes(query) ||
                      item.category.toLowerCase().includes(query);

                    const matchesMedium =
                      productMediumFilter === 'all'
                        ? true
                        : productMediumFilter === 'gift_cards'
                          ? item.itemType === 'gift_card' || item.category === 'Gift Cards'
                          : productMediumFilter === 'tips'
                            ? item.itemType === 'tip' || item.category === 'FIC Tips'
                            : productMediumFilter === 'coupons'
                              ? item.itemType === 'coupon' || item.category === 'Coupons'
                              : productMediumFilter === 'luxury'
                                ? item.platform === 'OwnIt' || item.platform === 'FingerLux'
                                : true;

                    const matchesStore =
                      selectedStoreTab === 'All' ? true : item.platform === selectedStoreTab;

                    return matchesQuery && matchesMedium && matchesStore;
                  });

                  // Calculate live match counts per store for highlighting
                  const storeCounts: Record<string, number> = {
                    MarketPlace: 0,
                    OwnIt: 0,
                    Flamingo: 0,
                    Storefront: 0,
                    FingerLux: 0,
                  };

                  STORE_CATALOG_OPTIONS.forEach((item) => {
                    const matchesQuery =
                      !query ||
                      item.name.toLowerCase().includes(query) ||
                      (item.description && item.description.toLowerCase().includes(query)) ||
                      item.platform.toLowerCase().includes(query) ||
                      item.category.toLowerCase().includes(query);

                    const matchesMedium =
                      productMediumFilter === 'all'
                        ? true
                        : productMediumFilter === 'gift_cards'
                          ? item.itemType === 'gift_card' || item.category === 'Gift Cards'
                          : productMediumFilter === 'tips'
                            ? item.itemType === 'tip' || item.category === 'FIC Tips'
                            : productMediumFilter === 'coupons'
                              ? item.itemType === 'coupon' || item.category === 'Coupons'
                              : productMediumFilter === 'luxury'
                                ? item.platform === 'OwnIt' || item.platform === 'FingerLux'
                                : true;

                    if (matchesQuery && matchesMedium) {
                      storeCounts[item.platform] = (storeCounts[item.platform] || 0) + 1;
                    }
                  });

                  const totalMatches = Object.values(storeCounts).reduce((a, b) => a + b, 0);

                  return (
                    <div className="p-4 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-50/90 border border-amber-200 rounded-2xl space-y-3.5 text-xs animate-in fade-in duration-150 shadow-sm">
                      {/* Panel Header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-black text-amber-950 flex items-center gap-1.5 text-sm">
                            <ShoppingBagIcon className="w-4 h-4 text-amber-600" />
                            Tag Sovereign Store Product, Gift Card, Tip or Coupon
                          </span>
                          <p className="text-[11px] text-amber-800/80 mt-0.5">
                            Crawl across MarketPlace, OwnIt, Flamingo, Storefront, and FingerLux
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveComposerTool(null)}
                          className="text-amber-800 hover:text-amber-950 font-bold px-2 py-1 bg-amber-100 hover:bg-amber-200 rounded-lg transition cursor-pointer"
                        >
                          ✕ Close
                        </button>
                      </div>

                      {/* Mini Search Bar (Crawls All 5 Stores in Real-Time) */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-amber-600">
                          <MagnifyingGlassIcon className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="Mini Search: Crawl all stores (e.g. Birkin, Rolex, Gift Card, Tip, Coupon, Agbada, Stem, Penthouse)..."
                          value={productSearchQuery}
                          onChange={(e) => setProductSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-24 py-2 bg-white border-2 border-amber-300 focus:border-amber-500 rounded-xl text-xs font-medium placeholder-amber-700/50 text-slate-900 focus:outline-none shadow-xs font-bold border border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                        />
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                          {productSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setProductSearchQuery('')}
                              className="text-amber-600 hover:text-amber-900 font-bold p-1 text-xs"
                              title="Clear search"
                            >
                              ✕
                            </button>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                            {filteredCatalog.length} found
                          </span>
                        </div>
                      </div>

                      {/* Store Medium Filter Chips (Gift Cards, FIC Tips, Coupons, Luxury, All) */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mr-1">
                          Store Medium:
                        </span>
                        {[
                          { id: 'all', label: 'All Mediums', icon: '🛍️' },
                          { id: 'gift_cards', label: 'Gift Cards', icon: '🎁' },
                          { id: 'tips', label: 'FIC Tips', icon: '💸' },
                          { id: 'coupons', label: 'Coupons', icon: '🏷️' },
                          { id: 'luxury', label: 'OwnIt Luxury', icon: '💎' },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setProductMediumFilter(m.id as any)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                              productMediumFilter === m.id
                                ? 'bg-amber-800 text-white shadow-xs'
                                : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-200'
                            }`}
                          >
                            <span>{m.icon}</span>
                            <span>{m.label}</span>
                          </button>
                        ))}
                      </div>

                      {/* Stores Crawler Rail with LIVE HIGHLIGHTING */}
                      <div className="space-y-1 pt-1 border-t border-amber-200/80">
                        <div className="flex items-center justify-between text-[10px] font-bold text-amber-900 uppercase">
                          <span>Store Crawler Status:</span>
                          <span className="font-mono text-amber-800 font-normal">
                            {query ? 'Stores with matches highlighted below' : 'All stores active'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* All Stores Tab */}
                          <button
                            type="button"
                            onClick={() => setSelectedStoreTab('All')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                              selectedStoreTab === 'All'
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'bg-white hover:bg-amber-100 text-slate-800 border border-amber-200'
                            }`}
                          >
                            <span>🌐 All Stores</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-amber-300 font-mono">
                              {totalMatches}
                            </span>
                          </button>

                          {/* Individual Store Tabs with Highlighting */}
                          {(
                            [
                              { name: 'MarketPlace', color: 'blue', border: 'border-blue-500', glow: 'ring-2 ring-blue-500 bg-blue-600 text-white shadow-md' },
                              { name: 'OwnIt', color: 'emerald', border: 'border-emerald-500', glow: 'ring-2 ring-emerald-500 bg-emerald-700 text-white shadow-md' },
                              { name: 'Flamingo', color: 'pink', border: 'border-pink-500', glow: 'ring-2 ring-pink-500 bg-pink-600 text-white shadow-md' },
                              { name: 'Storefront', color: 'amber', border: 'border-amber-500', glow: 'ring-2 ring-amber-500 bg-amber-600 text-white shadow-md' },
                              { name: 'FingerLux', color: 'purple', border: 'border-purple-500', glow: 'ring-2 ring-purple-500 bg-purple-600 text-white shadow-md' },
                            ] as const
                          ).map((store) => {
                            const count = storeCounts[store.name] || 0;
                            const isHighlighted = query.length > 0 && count > 0;
                            const isSelected = selectedStoreTab === store.name;

                            return (
                              <button
                                key={store.name}
                                type="button"
                                onClick={() => setSelectedStoreTab(store.name)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-amber-700 text-white shadow-sm'
                                    : isHighlighted
                                      ? `${store.glow} animate-pulse`
                                      : count === 0 && query.length > 0
                                        ? 'bg-amber-50/40 text-amber-900/40 border border-dashed border-amber-200'
                                        : 'bg-white hover:bg-amber-100 text-amber-950 border border-amber-200'
                                }`}
                              >
                                {isHighlighted && <span className="text-xs">✨</span>}
                                <span>{store.name}</span>
                                <span
                                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                                    isSelected || isHighlighted
                                      ? 'bg-black/30 text-white'
                                      : 'bg-amber-100 text-amber-900'
                                  }`}
                                >
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Store Products & Media Results Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                        {filteredCatalog.length > 0 ? (
                          filteredCatalog.map((prod) => {
                            const storeBadgeColor =
                              prod.platform === 'MarketPlace'
                                ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold border-blue-200'
                                : prod.platform === 'OwnIt'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : prod.platform === 'Flamingo'
                                    ? 'bg-pink-100 text-pink-800 border-pink-200'
                                    : prod.platform === 'Storefront'
                                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                                      : 'bg-purple-100 text-purple-900 border-purple-300';

                            const itemTypeBadge =
                              prod.itemType === 'gift_card'
                                ? '🎁 Gift Card'
                                : prod.itemType === 'tip'
                                  ? '💸 FIC Tip'
                                  : prod.itemType === 'coupon'
                                    ? '🏷️ Coupon'
                                    : prod.platform === 'OwnIt' || prod.platform === 'FingerLux'
                                      ? '💎 Luxury'
                                      : prod.category;

                            return (
                              <div
                                key={prod.id}
                                className="bg-white border border-amber-200/90 rounded-2xl p-2.5 flex flex-col justify-between space-y-2 hover:border-amber-400 hover:shadow-md transition group"
                              >
                                <div className="space-y-1.5">
                                  {/* Store + Item Type Badges */}
                                  <div className="flex items-center justify-between gap-1">
                                    <span
                                      className={`px-2 py-0.5 rounded-md text-[9px] font-bold border ${storeBadgeColor}`}
                                    >
                                      {prod.platform}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9px] font-semibold truncate">
                                      {itemTypeBadge}
                                    </span>
                                  </div>

                                  {/* Thumbnail & Info */}
                                  <div className="flex items-start gap-2.5">
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-slate-200 group-hover:scale-105 transition"
                                    />
                                    <div className="min-w-0 flex-1">
                                      <h5 className="font-bold text-slate-900 text-xs leading-tight line-clamp-2">
                                        {prod.name}
                                      </h5>
                                      {prod.description && (
                                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                                          {prod.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Price & Attach Action */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                  <span className="font-mono font-bold text-amber-800 text-xs truncate max-w-[120px]">
                                    {prod.price}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTaggedProduct({
                                        platform: prod.platform,
                                        name: prod.name,
                                        price: prod.price,
                                        category: prod.category,
                                        image: prod.image,
                                        itemType: prod.itemType,
                                      });
                                      setActiveComposerTool(null);
                                      triggerToast(
                                        `Attached ${prod.name} from ${prod.platform} (${itemTypeBadge})!`,
                                        'success'
                                      );
                                    }}
                                    className="px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-[10px] font-bold rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
                                  >
                                    <CheckIcon className="w-3 h-3" />
                                    <span>Attach to Post</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-full py-8 text-center bg-white/70 rounded-2xl border border-dashed border-amber-200">
                            <ShoppingBagIcon className="w-8 h-8 text-amber-400 mx-auto mb-1.5" />
                            <p className="text-xs font-bold text-slate-700">No items found matching "{productSearchQuery}"</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Try searching for Birkin, Rolex, Gift Card, Tip, Coupon, or select "All Stores"</p>
                            <button
                              type="button"
                              onClick={() => {
                                setProductSearchQuery('');
                                setSelectedStoreTab('All');
                                setProductMediumFilter('all');
                              }}
                              className="mt-2 px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                            >
                              Reset Search
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Custom Item Entry Option (For any bespoke gift card, tip, or service) */}
                      <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-2">
                        <div className="text-[10px] font-black uppercase text-amber-800 flex items-center justify-between">
                          <span>Or Attach Bespoke Custom Store Item / Gift / Tip Voucher:</span>
                          <span className="text-[9px] font-normal text-slate-500">Manual entry</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="Item, Tip or Gift Title..."
                            value={customProdName}
                            onChange={(e) => setCustomProdName(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                          />
                          <input
                            type="text"
                            placeholder="Price / Amount (e.g. 250 FIC)..."
                            value={customProdPrice}
                            onChange={(e) => setCustomProdPrice(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                          />
                          <select
                            value={customProdMedium}
                            onChange={(e) => setCustomProdMedium(e.target.value as any)}
                            className="px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-semibold text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="product">Physical Product / Good</option>
                            <option value="gift_card">🎁 Sovereign Gift Card</option>
                            <option value="tip">💸 Instant FIC Tip Voucher</option>
                            <option value="coupon">🏷️ Storefront Coupon</option>
                          </select>
                        </div>
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (customProdName.trim()) {
                                setTaggedProduct({
                                  platform: selectedStoreTab === 'All' ? 'MarketPlace' : selectedStoreTab,
                                  name: customProdName.trim(),
                                  price: customProdPrice.trim() || 'Custom Quote',
                                  category: customProdCategory,
                                  itemType: customProdMedium,
                                });
                                setCustomProdName('');
                                setCustomProdPrice('');
                                setActiveComposerTool(null);
                                triggerToast(`Attached custom item: ${customProdName.trim()}!`, 'success');
                              }
                            }}
                            className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs"
                          >
                            Attach Custom Item
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </form>
            </div>

            {/* 3. FEED POST STREAM */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <ForumPostCard
                  key={post.id}
                  post={post}
                  onLike={handleToggleLike}
                  onToggleBookmark={handleToggleBookmark}
                  onShare={handleSharePost}
                  onVotePoll={handleVotePoll}
                  onRsvpEvent={handleRsvpEvent}
                  onAddComment={(postId, text) => {
                    setCommentInputTexts((prev) => ({ ...prev, [postId]: text }));
                    handleAddComment(postId);
                  }}
                  onOpenLightbox={setSelectedLightboxImage}
                  triggerToast={(msg, type) => triggerToast(msg, type === 'warning' ? 'info' : type)}
                />
              ))}
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT RAIL (3 cols): STATS, CANARY ADS, HALLMARKS, LEADERBOARD         */}
          {/* ======================================================================= */}
          <div className="lg:col-span-3 space-y-4">
            {/* Protocol Market Ticker & Live Stats */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase text-slate-700">Live Network</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-full border text-emerald-950 border-emerald-400 font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  P2P Online
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">FIC Token Price</span>
                  <span className="font-mono font-bold text-emerald-600">$1.84 (+4.2%)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">Active Relays</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">1,248 Nodes</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <span className="text-slate-500">PIN Crypto Quota</span>
                  <span className="font-mono font-bold text-orange-600">{syncedProfile.pinQuotaRemaining}/50 Op</span>
                </div>
              </div>
            </div>

            {/* Hallmarks Featured Community Card */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">Featured Hallmark</span>
                <span className="text-[10px] bg-purple-500/40 text-purple-200 px-2 py-0.5 rounded-full font-bold">250k Cap</span>
              </div>
              <div>
                <h4 className="text-sm font-black">Afrobeat Sovereign Creators</h4>
                <p className="text-[11px] text-purple-200 mt-1 line-clamp-2">
                  Mega-community of musicians, audio engineers, and producers sharing lossless BeatwaveNG stems and copyright splits.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/hallmarks')}
                className="w-full py-2 bg-white text-purple-900 hover:bg-purple-100 text-xs font-bold rounded-xl transition"
              >
                Join Hallmark (148k Members)
              </button>
            </div>

            {/* Dynamic 2-Hour Rotating Widgets + Permanent Canary Ads Bottom Rail */}
            <RotatingWidgetRail />

            {/* Quick Links Footer */}
            <div className="p-3 text-[11px] text-slate-400 space-y-2">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate('/settings')} className="hover:underline">Settings</button>
                <span>•</span>
                <button onClick={() => navigate('/master-dashboard')} className="hover:underline">Master Dashboard</button>
                <span>•</span>
                <button onClick={() => navigate('/stercs')} className="hover:underline">Stercs Core</button>
                <span>•</span>
                <button onClick={() => navigate('/legal')} className="hover:underline">Terms & Privacy</button>
              </div>
              <div>© 2026 FingerMobile Protocol. Sovereign and Decentralized.</div>
            </div>
          </div>
        </div>
      </main>

      {/* ======================================================================= */}
      {/* MODALS & OVERLAYS                                                       */}
      {/* ======================================================================= */}

      {/* 1. Mii Stories Creator Modal */}
      {isMiiCreatorOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">Create 48H Mii™®©℠</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold border border-orange-500/20">
                  48H EXPIRING
                </span>
              </div>
              <button
                onClick={() => {
                  setIsMiiCreatorOpen(false);
                  setMiiMediaUrl('');
                  setMiiMediaFileName('');
                  setMiiMediaFileSize('');
                  setMiiCaption('');
                }}
                className="text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-lg p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Media Type Tabs: Photo | Audio | Video */}
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMiiType('photo')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                  miiType === 'photo'
                    ? 'bg-orange-600 text-white shadow-orange-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <PhotoIcon className="w-4 h-4" />
                <span>Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setMiiType('audio')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                  miiType === 'audio'
                    ? 'bg-orange-600 text-white shadow-orange-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <MusicalNoteIcon className="w-4 h-4" />
                <span>Audio</span>
              </button>
              <button
                type="button"
                onClick={() => setMiiType('video')}
                className={`flex-1 py-2 px-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                  miiType === 'video'
                    ? 'bg-orange-600 text-white shadow-orange-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <VideoCameraIcon className="w-4 h-4" />
                <span>Video</span>
              </button>
            </div>

            {/* Hidden File Input for Attachment */}
            <input
              id="mii-story-file-picker"
              ref={miiFileInputRef}
              type="file"
              className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              accept={
                miiType === 'photo'
                  ? 'image/*'
                  : miiType === 'audio'
                    ? 'audio/*'
                    : 'video/*'
              }
              onChange={handleMiiFileUpload}
            />

            {/* File Upload Dropzone / Button Area */}
            {miiMediaUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 p-3 space-y-2">
                {/* Visual Preview based on type */}
                {miiType === 'photo' && (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={miiMediaUrl}
                      alt="Story Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {miiType === 'video' && (
                  <div className="relative w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
                    <video
                      controls
                      src={miiMediaUrl}
                      className="w-full max-h-48 rounded-xl object-contain"
                    />
                  </div>
                )}
                {miiType === 'audio' && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center gap-2 text-white">
                    <div className="flex items-center gap-2 text-amber-400">
                      <MusicalNoteIcon className="w-6 h-6 animate-bounce" />
                      <span className="font-bold text-xs">Audio Track Attached</span>
                    </div>
                    <audio controls src={miiMediaUrl} className="w-full mt-1" />
                  </div>
                )}

                {/* File Details & Action Controls */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5 truncate max-w-[220px]">
                    <CheckCircleSolidIcon className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="font-mono text-white truncate" title={miiMediaFileName || 'Attached media'}>
                      {miiMediaFileName || 'Media attached'}
                    </span>
                    {miiMediaFileSize && (
                      <span className="text-[10px] text-slate-400 shrink-0">({miiMediaFileSize})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label
                      htmlFor="mii-story-file-picker"
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold cursor-pointer transition"
                    >
                      Replace
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMiiMediaUrl('');
                        setMiiMediaFileName('');
                        setMiiMediaFileSize('');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-[10px] font-bold border border-red-800/40 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMiiDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMiiDragging(false);
                }}
                onDrop={handleMiiFileDrop}
                onClick={() => miiFileInputRef.current?.click()}
                className={`group relative rounded-2xl border-2 border-dashed p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xs ${
                  isMiiDragging
                    ? 'border-orange-500 bg-orange-100/70 dark:bg-orange-950/40 scale-[1.01]'
                    : 'border-orange-400/60 hover:border-orange-500 bg-orange-50/40 dark:bg-slate-800/50 hover:bg-orange-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform mb-2">
                  {miiType === 'photo' && <PhotoIcon className="w-6 h-6" />}
                  {miiType === 'audio' && <MusicalNoteIcon className="w-6 h-6" />}
                  {miiType === 'video' && <VideoCameraIcon className="w-6 h-6" />}
                </div>

                <div className="text-xs font-black text-slate-900 dark:text-white">
                  Click to Select & Attach {miiType === 'photo' ? 'Image/Photo' : miiType === 'audio' ? 'Audio File' : 'Video Clip'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Browse device files or drag & drop ({miiType === 'photo' ? 'JPG, PNG, GIF, WEBP' : miiType === 'audio' ? 'MP3, WAV, AAC, M4A' : 'MP4, WEBM, MOV'})
                </p>

                <label
                  htmlFor="mii-story-file-picker"
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-sm cursor-pointer transition hover:scale-105"
                >
                  <PaperClipIcon className="w-3.5 h-3.5" />
                  <span>Choose {miiType.toUpperCase()} File</span>
                </label>
              </div>
            )}

            {/* Alternative Direct Media URL input */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                <span>Or provide direct media URL</span>
                <span className="text-[10px] font-mono">HTTPS</span>
              </div>
              <input
                type="text"
                placeholder="Media URL (https://...)"
                value={miiMediaUrl.startsWith('data:') ? '' : miiMediaUrl}
                onChange={(e) => {
                  setMiiMediaUrl(e.target.value);
                  setMiiMediaFileName('');
                  setMiiMediaFileSize('');
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold border-slate-300 placeholder:text-slate-400"
              />
            </div>

            {/* Caption Input */}
            <div>
              <input
                type="text"
                placeholder="Caption (e.g. Backstage live session in Lagos!)..."
                value={miiCaption}
                onChange={(e) => setMiiCaption(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold border-slate-300 placeholder:text-slate-400"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-700 font-mono">
                Duration: 48 Hours
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMiiCreatorOpen(false);
                    setMiiMediaUrl('');
                    setMiiMediaFileName('');
                    setMiiMediaFileSize('');
                    setMiiCaption('');
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const media = miiMediaUrl.trim() || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800';
                    const currentMember = userProfileSyncService.getProfile();
                    const newMii: MiiItem = {
                      id: `mii-${Date.now()}`,
                      author: currentMember.name,
                      handle: `@${currentMember.username}`,
                      avatar: currentMember.avatar,
                      mediaUrl: media,
                      expiresIn: '48h left',
                      caption: miiCaption.trim() || 'Ephemeral sovereign moment ✨',
                      isViewed: false,
                      type: miiType,
                    };
                    const updated = [newMii, ...miiStories];
                    setMiiStories(updated);
                    try {
                      localStorage.setItem('fingermobile_mii_stories', JSON.stringify(updated));
                    } catch {
                      /* ignore */
                    }
                    setIsMiiCreatorOpen(false);
                    setMiiCaption('');
                    setMiiMediaUrl('');
                    setMiiMediaFileName('');
                    setMiiMediaFileSize('');
                    triggerToast('Mii published (expires in 48 hours)!', 'success');
                  }}
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                >
                  Publish Mii
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Mii Story Viewer Modal */}
      {selectedMii && (
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedMii(null)}
        >
          <div
            className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={selectedMii.avatar} alt={selectedMii.author} className="w-8 h-8 rounded-full object-cover border border-orange-500" />
                <div>
                  <span className="font-bold text-xs block">{selectedMii.author}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{selectedMii.expiresIn}</span>
                </div>
              </div>
              <button onClick={() => setSelectedMii(null)} className="p-1 rounded-full bg-white/10 hover:bg-white/20">✕</button>
            </div>
            <div className="p-2 flex items-center justify-center bg-black/60 max-h-[60vh] overflow-hidden">
              <img src={selectedMii.mediaUrl} alt={selectedMii.author} className="max-h-full max-w-full rounded-xl object-contain" />
            </div>
            <div className="p-3 bg-slate-950 border-t border-slate-800">
              <p className="text-xs text-slate-200">{selectedMii.caption}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. UHD Lightbox Modal */}
      {selectedLightboxImage && (
        <div
          className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div
            className="max-w-4xl max-h-[92vh] w-full bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold truncate max-w-md">{selectedLightboxImage.title}</span>
                <span className="text-[10px] text-slate-400 font-mono">by {selectedLightboxImage.author}</span>
              </div>
              <button
                onClick={() => setSelectedLightboxImage(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-700 transition cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center bg-black/60 p-2 overflow-hidden">
              <img
                src={selectedLightboxImage.url}
                alt={selectedLightboxImage.title}
                className="max-h-[75vh] max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-white text-xs">
              <span className="text-[11px] text-slate-400">FingerMobile UHD High-Fidelity Media View</span>
              <div className="flex items-center gap-2">
                <a
                  href={selectedLightboxImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                  Open Full Res
                </a>
                <button
                  onClick={() => setSelectedLightboxImage(null)}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3.5. Media Editor Modal (Crop, Presets, Visual Filters & AR Adjustments) */}
      {editingMediaItem && (
        <MediaEditorModal
          isOpen={!!editingMediaItem}
          onClose={() => setEditingMediaItem(null)}
          mediaUrl={editingMediaItem.adjustedUrl || editingMediaItem.url}
          mediaType={editingMediaItem.type}
          mediaName={editingMediaItem.name}
          onSave={handleSaveEditedMedia}
        />
      )}

      {/* 4. WebRTC Live Broadcast Studio Drawer */}
      <WebRtcStudioDrawer
        isOpen={isLiveStudioOpen}
        onClose={() => {
          setIsLiveStudioOpen(false);
          setLiveStudioStreamId(undefined);
        }}
        initialTab={liveStudioInitialTab}
        initialStreamId={liveStudioStreamId}
        initialGuestMode={liveStudioGuestMode}
      />

      {/* 5. Floating Toast Notification */}
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
      {/* 6. FingerMobile Ultra HD Logo Viewer & Exporter Modal */}
      <FingerMobileLogoViewerModal
        isOpen={isLogoViewerOpen}
        onClose={() => setIsLogoViewerOpen(false)}
      />
    </div>
  );
};

export default ForumPage;
