/*
 * FingerMobile Protocol™ - Enterprise Discover Page & Topics Engine
 * Integrated with P2P Swarm, Hashtag Engine, 30% Trends Syndication,
 * Seshat Sovereign Publishing, and Permanence Immutable Archive.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/apiService';
import ConnectWidget from '../components/widgets/ConnectWidget';
import DiscoverWidget from '../components/widgets/DiscoverWidget';
import {
  MagnifyingGlassIcon,
  FireIcon,
  GiftIcon,
  PaylinkIcon,
  ShareIcon,
  SparklesIcon,
  TrendingUpIcon,
  ShieldIcon,
  DatabaseIcon,
  WifiIcon,
  HashtagIcon,
  CheckCircleIcon,
  BookmarkIcon,
  ArrowRightIcon,
  CubeIcon,
  LockIcon,
  UserCircleIcon
} from '../icons';

// =========================================================================
// Types & Domain Entities
// =========================================================================

export interface TopicItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  postCount: number;
  resonanceScore: number;
  velocity: number;
  trendAffinityPct: number;
  p2pSwarmNodes: number;
  topTags: string[];
  featuredAuthor: string;
}

export interface HashtagItem {
  tag: string;
  postCount: number;
  volume24h: number;
  velocityPct: number;
  isTrendingCandidate: boolean;
  category: string;
  trendContributionPct: number;
}

export interface P2PSwarmTelemetry {
  activeNodes: number;
  connectedPeers: number;
  swarmMeshHealth: string;
  totalSeeders: number;
  totalLeechers: number;
  seedLeechRatio: string;
  distributedStorageVolumeGb: number;
  verifiedContentHashes: number;
  avgPropagationLatencyMs: number;
  activeSwarms: Array<{ id: string; peers: number; bandwidthMbps: number }>;
}

export interface DiscoverItem {
  id: string;
  author_id: string;
  author_name: string;
  author_handle: string;
  author_avatar: string;
  title: string;
  body: string;
  excerpt: string;
  content_type: string;
  media_urls: string[];
  tags: string[];
  category: string;
  topic_slug: string;
  status: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  upvotes: number;
  downvotes: number;
  views: number;
  velocityScore: number;
  is_featured: boolean;
  isTrendingCandidate: boolean;
  trendVelocityContribution: number;
  seshatPageId?: string;
  seshatPageName?: string;
  isSeshatVerified?: boolean;
  isPermanenceArchived?: boolean;
  permanenceBlock?: number | null;
  permanenceProof?: string | null;
  p2pSwarmId?: string;
  p2pSeeders?: number;
  p2pLeechers?: number;
  p2pContentHash?: string;
  created_at: string;
}

// Fallback seed data in case of network latency
const FALLBACK_TOPICS: TopicItem[] = [
  {
    id: 'topic-1',
    name: 'Sovereign Creator Economy',
    slug: 'sovereign-creator-economy',
    category: 'Seshat & Monetization',
    description: 'Autonomous publishing channels, direct reader patronage, and decentralized tokenized royalties.',
    postCount: 1420,
    resonanceScore: 98.4,
    velocity: 94.2,
    trendAffinityPct: 32.5,
    p2pSwarmNodes: 842,
    topTags: ['#SeshatMedia', '#CreatorEconomy', '#FICVault'],
    featuredAuthor: 'Dr. Amina Seshat'
  },
  {
    id: 'topic-2',
    name: 'Decentralized P2P Mesh & Swarms',
    slug: 'p2p-mesh-swarms',
    category: 'P2P Technology',
    description: 'Direct browser-to-browser media routing, distributed seeding swarms, and zero-intermediary content hashes.',
    postCount: 890,
    resonanceScore: 95.1,
    velocity: 91.8,
    trendAffinityPct: 31.0,
    p2pSwarmNodes: 1240,
    topTags: ['#P2PMesh', '#DistributedWeb', '#ZeroMiddlemen'],
    featuredAuthor: 'Kofi DevSwarm'
  },
  {
    id: 'topic-3',
    name: 'Permanence Immutable Archiving',
    slug: 'permanence-immutable-archiving',
    category: 'Permanence Protocol',
    description: 'Proof-of-persistence, cryptographic media staking, and immutable bottom-column visibility tokens.',
    postCount: 670,
    resonanceScore: 93.6,
    velocity: 88.5,
    trendAffinityPct: 30.2,
    p2pSwarmNodes: 730,
    topTags: ['#PermanenceArchive', '#ProofOfPersistence', '#ImmutableMedia'],
    featuredAuthor: 'Permanence Sentinel'
  },
  {
    id: 'topic-4',
    name: 'Red Carpet & Urban Glamour',
    slug: 'red-carpet-urban-glamour',
    category: 'Entertainment',
    description: 'High-fashion galas, Lagos & Paris runways, red-carpet photography, and haute couture curation.',
    postCount: 3150,
    resonanceScore: 97.8,
    velocity: 96.4,
    trendAffinityPct: 35.8,
    p2pSwarmNodes: 1560,
    topTags: ['#RedCarpet', '#UrbanStyle', '#HauteCouture'],
    featuredAuthor: 'Sonia Delacroix'
  },
  {
    id: 'topic-5',
    name: 'BeatwaveNG Sonic Horizons',
    slug: 'beatwaveng-sonic-horizons',
    category: 'Audio & Music',
    description: 'SoundRiver and SoundOcean high-fidelity audio streams, pan-African rhythms, and stem rights.',
    postCount: 2240,
    resonanceScore: 96.2,
    velocity: 92.6,
    trendAffinityPct: 33.4,
    p2pSwarmNodes: 1120,
    topTags: ['#BeatwaveNG', '#SoundRiver', '#AfroFusion'],
    featuredAuthor: 'DJ SoundOcean'
  },
  {
    id: 'topic-6',
    name: 'AI Assist & Generative Media',
    slug: 'ai-assist-generative-media',
    category: 'Artificial Intelligence',
    description: 'On-device neural curation, intelligent prompt engineering, and synthesized voice line broadcasts.',
    postCount: 1890,
    resonanceScore: 94.7,
    velocity: 89.9,
    trendAffinityPct: 29.8,
    p2pSwarmNodes: 910,
    topTags: ['#AI', '#NeuralCuration', '#SmartMedia'],
    featuredAuthor: 'Tariq Neural'
  }
];

const FALLBACK_HASHTAGS: HashtagItem[] = [
  { tag: '#SeshatMedia', postCount: 4320, volume24h: 890, velocityPct: 28.4, isTrendingCandidate: true, category: 'Seshat', trendContributionPct: 32 },
  { tag: '#PermanenceArchive', postCount: 2890, volume24h: 620, velocityPct: 24.1, isTrendingCandidate: true, category: 'Permanence', trendContributionPct: 30 },
  { tag: '#P2PMesh', postCount: 3410, volume24h: 740, velocityPct: 31.8, isTrendingCandidate: true, category: 'P2P', trendContributionPct: 34 },
  { tag: '#Web3', postCount: 8920, volume24h: 1540, velocityPct: 18.2, isTrendingCandidate: true, category: 'Tech', trendContributionPct: 29 },
  { tag: '#UrbanStyle', postCount: 6710, volume24h: 1280, velocityPct: 35.6, isTrendingCandidate: true, category: 'Fashion', trendContributionPct: 36 },
  { tag: '#BeatwaveNG', postCount: 5120, volume24h: 960, velocityPct: 27.9, isTrendingCandidate: true, category: 'Music', trendContributionPct: 31 },
  { tag: '#CreatorEconomy', postCount: 4780, volume24h: 810, velocityPct: 22.5, isTrendingCandidate: true, category: 'Business', trendContributionPct: 30 },
  { tag: '#FICVault', postCount: 3210, volume24h: 530, velocityPct: 19.4, isTrendingCandidate: false, category: 'Finance', trendContributionPct: 26 },
  { tag: '#AI', postCount: 9450, volume24h: 2100, velocityPct: 41.2, isTrendingCandidate: true, category: 'Tech', trendContributionPct: 38 },
  { tag: '#RedCarpetGala', postCount: 5630, volume24h: 1190, velocityPct: 33.7, isTrendingCandidate: true, category: 'Entertainment', trendContributionPct: 35 }
];

const FALLBACK_DISCOVERY_ITEMS: DiscoverItem[] = [
  {
    id: 'disc-1',
    author_id: 'usr-seshat-01',
    author_name: 'Dr. Amina Seshat',
    author_handle: '@amina_seshat',
    author_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'The Seshat Protocol: Sovereign Creator Vaults & High-Yield Micro-Patronage',
    body: 'How decentralized creator businesses escape algorithmic subjugation using Seshat Pages, on-chain royalty splits, and direct reader subscriber keys. Every piece of published work retains mathematical attribution and continuous micro-monetization across the FingerMobile network.',
    excerpt: 'How decentralized creator businesses escape algorithmic subjugation using Seshat Pages and on-chain royalty splits.',
    content_type: 'article',
    media_urls: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80'],
    tags: ['#SeshatMedia', '#CreatorEconomy', '#FICVault', '#Web3'],
    category: 'Seshat & Monetization',
    topic_slug: 'sovereign-creator-economy',
    status: 'published',
    likes_count: 1248,
    comments_count: 184,
    shares_count: 432,
    upvotes: 940,
    downvotes: 12,
    views: 18540,
    velocityScore: 96.8,
    is_featured: true,
    isTrendingCandidate: true,
    trendVelocityContribution: 34.2,
    seshatPageId: 'seshat-creator-vault-01',
    seshatPageName: 'Seshat Sovereign Editorial Desk',
    isSeshatVerified: true,
    isPermanenceArchived: true,
    permanenceBlock: 489210,
    permanenceProof: '0x8f3c7a92b4e81d092f6b3a2c5e7d1f8a4b6c9e0d',
    p2pSwarmId: 'swarm-seshat-core',
    p2pSeeders: 142,
    p2pLeechers: 28,
    p2pContentHash: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'disc-2',
    author_id: 'usr-p2p-02',
    author_name: 'Kofi DevSwarm',
    author_handle: '@kofi_mesh',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'P2P Swarm Propagation: Achieving Sub-Second Zero-Server Media Streaming',
    body: 'Testing direct WebRTC / Libp2p data channels for ultra-efficient video and audio dissemination. When users browse /discover, nearby nodes in Lagos, London, and New York collaboratively seed popular fragments without hitting central egress servers.',
    excerpt: 'Testing direct WebRTC and Libp2p channels for ultra-efficient peer media dissemination.',
    content_type: 'tech_dispatch',
    media_urls: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'],
    tags: ['#P2PMesh', '#DistributedWeb', '#ZeroMiddlemen', '#Tech'],
    category: 'P2P Technology',
    topic_slug: 'p2p-mesh-swarms',
    status: 'published',
    likes_count: 890,
    comments_count: 94,
    shares_count: 275,
    upvotes: 720,
    downvotes: 8,
    views: 12400,
    velocityScore: 92.4,
    is_featured: true,
    isTrendingCandidate: true,
    trendVelocityContribution: 31.5,
    seshatPageId: 'seshat-engineering-lab',
    seshatPageName: 'FingerMobile Distributed Lab',
    isSeshatVerified: true,
    isPermanenceArchived: true,
    permanenceBlock: 489180,
    permanenceProof: '0x4e2b8c91a0f3d7e5b2c8a1f4d9e0b7c3a5f8d2e1',
    p2pSwarmId: 'swarm-mesh-backbone',
    p2pSeeders: 215,
    p2pLeechers: 46,
    p2pContentHash: 'bafybeihdwdcefgh4dqkjv67uzcmw7ojee6xedfdietvfbc6eazymsqvi5q',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'disc-3',
    author_id: 'usr-perm-03',
    author_name: 'Permanence Sentinel',
    author_handle: '@permanence_core',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Permanence Staking & Bottom-Column Visibility: Cryptographic Proof of Preservation',
    body: 'The Permanence Protocol ensures that verified journalism, historical bulletins, and cultural masterworks can never be quietly wiped from cyberspace. Staking FIC tokens secures permanent indexing, high-contrast legibility, and distributed cold-storage redundancy.',
    excerpt: 'How cryptographic media staking guarantees permanent historical accessibility.',
    content_type: 'protocol_manifesto',
    media_urls: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80'],
    tags: ['#PermanenceArchive', '#ProofOfPersistence', '#ImmutableMedia', '#FintechSovereignty'],
    category: 'Permanence Protocol',
    topic_slug: 'permanence-immutable-archiving',
    status: 'published',
    likes_count: 1120,
    comments_count: 132,
    shares_count: 360,
    upvotes: 885,
    downvotes: 14,
    views: 15300,
    velocityScore: 94.1,
    is_featured: true,
    isTrendingCandidate: true,
    trendVelocityContribution: 30.8,
    seshatPageId: 'seshat-permanence-foundation',
    seshatPageName: 'Permanence Preservation Society',
    isSeshatVerified: true,
    isPermanenceArchived: true,
    permanenceBlock: 489240,
    permanenceProof: '0x7a1b3c5e8d9f0a2b4c6e8d0f2a4b6c8e0d2f4a6b',
    p2pSwarmId: 'swarm-permanence-vault',
    p2pSeeders: 184,
    p2pLeechers: 19,
    p2pContentHash: 'bafybeigvgzm3z5qv7j2uydw5f47x6hvh2h7cqq3qj7n5gsq4y5v7v2y2re',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 'disc-4',
    author_id: 'usr-style-04',
    author_name: 'Sonia Delacroix',
    author_handle: '@soniastyle',
    author_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'Lagos to Milan: Haute Couture Runway Dispatches & Urban Style Revolution',
    body: 'The 2026 African Luxury Fashion Showcase brought together daring sustainable silk silhouettes, handcrafted bronze jewelry, and futuristic avant-garde streetwear. Discover our high-resolution photo gallery licensed directly via PhotoCredits with instant creator attribution.',
    excerpt: 'Front row at the 2026 African Luxury Fashion Showcase: sustainable silk & avant-garde streetwear.',
    content_type: 'photo_editorial',
    media_urls: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80'],
    tags: ['#UrbanStyle', '#RedCarpet', '#HauteCouture', '#Design'],
    category: 'Entertainment',
    topic_slug: 'red-carpet-urban-glamour',
    status: 'published',
    likes_count: 2410,
    comments_count: 312,
    shares_count: 820,
    upvotes: 1980,
    downvotes: 22,
    views: 34100,
    velocityScore: 98.2,
    is_featured: true,
    isTrendingCandidate: true,
    trendVelocityContribution: 36.5,
    seshatPageId: 'seshat-lux-editorial',
    seshatPageName: 'FingerLux High Fashion Bureau',
    isSeshatVerified: true,
    isPermanenceArchived: true,
    permanenceBlock: 489205,
    permanenceProof: '0x3c5e7d1f8a4b6c9e0d2f4a6b8c0e2d4f6a8b0c2e',
    p2pSwarmId: 'swarm-fashion-gallery',
    p2pSeeders: 320,
    p2pLeechers: 64,
    p2pContentHash: 'bafybeihg4k5y3n7q5b7m2j6v4l8x9z0c1v3b5n7m9q1w3e5r7t9y1u3i5o',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'disc-5',
    author_id: 'usr-audio-05',
    author_name: 'DJ SoundOcean',
    author_handle: '@soundocean_live',
    author_avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    title: 'SoundRiver Master Session: 24-Bit Spatial Afrobeats & Live Ambient Harmonies',
    body: 'Tune in to our latest sovereign broadcast on BeatwaveNG. Utilizing loss-free streaming over decentralized P2P relays, listeners experience studio-master clarity without buffering or server dropouts. Listeners can tip via FIC or mint limited stem collectables.',
    excerpt: 'Lossless spatial Afrobeats and live ambient harmonies streaming over BeatwaveNG P2P relays.',
    content_type: 'audio_stream',
    media_urls: ['https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'],
    tags: ['#BeatwaveNG', '#SoundRiver', '#AfroFusion', '#Music'],
    category: 'Audio & Music',
    topic_slug: 'beatwaveng-sonic-horizons',
    status: 'published',
    likes_count: 1750,
    comments_count: 240,
    shares_count: 610,
    upvotes: 1420,
    downvotes: 15,
    views: 26800,
    velocityScore: 95.3,
    is_featured: true,
    isTrendingCandidate: true,
    trendVelocityContribution: 33.1,
    seshatPageId: 'seshat-beatwave-records',
    seshatPageName: 'Beatwave Sound Studios',
    isSeshatVerified: true,
    isPermanenceArchived: true,
    permanenceBlock: 489220,
    permanenceProof: '0x9d0f2a4b6c8e0d2f4a6b8c0e2d4f6a8b0c2e4f6a',
    p2pSwarmId: 'swarm-soundriver-hq',
    p2pSeeders: 245,
    p2pLeechers: 52,
    p2pContentHash: 'bafybeif4d8m2k6v9x3b7n1q5l0c4z8j2h6t9w1e3r5t7y9u1i3o5p7a9s',
    created_at: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'disc-6',
    author_id: 'usr-ai-06',
    author_name: 'Tariq Neural',
    author_handle: '@tariq_ai',
    author_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Real-Time Edge AI Curation: Replacing Black-Box Algorithmic Feeds with Member Choice',
    body: 'Why modern social media feeds feel hollow: opaque ad-maximizing recommendation algorithms. FingerMobile empowers users to inspect topic weights, adjust P2P swarm priorities, and toggle between pure UGC feeds and AI Curated Direct Editorial publishing.',
    excerpt: 'Replacing opaque advertising algorithms with inspectable, user-steered edge AI curation.',
    content_type: 'tech_dispatch',
    media_urls: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'],
    tags: ['#AI', '#NeuralCuration', '#SmartMedia', '#Startups'],
    category: 'Artificial Intelligence',
    topic_slug: 'ai-assist-generative-media',
    status: 'published',
    likes_count: 1530,
    comments_count: 178,
    shares_count: 480,
    upvotes: 1260,
    downvotes: 18,
    views: 21900,
    velocityScore: 93.7,
    is_featured: false,
    isTrendingCandidate: true,
    trendVelocityContribution: 30.1,
    seshatPageId: 'seshat-ai-collective',
    seshatPageName: 'Open Intelligence Alliance',
    isSeshatVerified: true,
    isPermanenceArchived: false,
    permanenceBlock: null,
    permanenceProof: null,
    p2pSwarmId: 'swarm-ai-research',
    p2pSeeders: 168,
    p2pLeechers: 31,
    p2pContentHash: 'bafybeid9k2v5m8b1x4n7q0l3c6z9j2h5t8w1e4r7t0y2u5i8o1p4a7s0d',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

type EngineViewMode = 'all' | 'topics' | 'p2p' | 'hashtags' | 'trends' | 'seshat' | 'permanence';

// =========================================================================
// Main Component: DiscoverPage
// =========================================================================

const DiscoverPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast, ficBalance } = useAppContext();
  const { state: authState } = useAuth();
  const currentUser = authState.user;

  // Navigation & Engine Filter State
  const [activeEngineMode, setActiveEngineMode] = useState<EngineViewMode>('all');
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string | null>(null);
  const [selectedHashtag, setSelectedHashtag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'velocity' | 'trending' | 'upvotes' | 'latest'>('velocity');
  const [p2pOnlyFilter, setP2pOnlyFilter] = useState<boolean>(false);

  // Data Stores
  const [contentItems, setContentItems] = useState<DiscoverItem[]>(FALLBACK_DISCOVERY_ITEMS);
  const [topics, setTopics] = useState<TopicItem[]>(FALLBACK_TOPICS);
  const [hashtags, setHashtags] = useState<HashtagItem[]>(FALLBACK_HASHTAGS);
  const [p2pTelemetry, setP2pTelemetry] = useState<P2PSwarmTelemetry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Interactive User States
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [userVotes, setUserVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [userBookmarks, setUserBookmarks] = useState<Record<string, boolean>>({});
  const [userSeeding, setUserSeeding] = useState<Record<string, boolean>>({});

  // Modals State
  const [activeGiftPost, setActiveGiftPost] = useState<DiscoverItem | null>(null);
  const [activePaylinkPost, setActivePaylinkPost] = useState<DiscoverItem | null>(null);
  const [inspectedProofItem, setInspectedProofItem] = useState<DiscoverItem | null>(null);
  const [inspectedSwarmItem, setInspectedSwarmItem] = useState<DiscoverItem | null>(null);

  // Modal Inputs
  const [giftAmount, setGiftAmount] = useState<number>(10);
  const [paylinkTitle, setPaylinkTitle] = useState<string>('');
  const [paylinkPrice, setPaylinkPrice] = useState<number>(25);

  // -----------------------------------------------------------------------
  // Data Fetching: Multi-Engine Aggregation
  // -----------------------------------------------------------------------

  const fetchDiscoveryData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Fetch Discover Content with query filters
      const contentRes: any = await ApiService.get('/discover/content', {
        params: {
          sort: sortBy,
          tag: selectedHashtag || undefined,
          topic: selectedTopicSlug || undefined,
          p2p_only: p2pOnlyFilter ? 'true' : undefined,
          search: searchQuery.trim() || undefined
        }
      });
      const rows = contentRes?.data?.data ?? contentRes?.data ?? contentRes;
      if (Array.isArray(rows) && rows.length > 0) {
        setContentItems(rows);
      }

      // 2. Fetch Topics Engine
      try {
        const topicsRes: any = await ApiService.get('/discover/topics');
        const topicRows = topicsRes?.data?.data ?? topicsRes?.data ?? topicsRes;
        if (Array.isArray(topicRows) && topicRows.length > 0) {
          setTopics(topicRows);
        }
      } catch (tErr) {
        // Fallback already pre-seeded
      }

      // 3. Fetch Hashtag Engine
      try {
        const hashRes: any = await ApiService.get('/discover/hashtags');
        const hashRows = hashRes?.data?.data ?? hashRes?.data ?? hashRes;
        if (Array.isArray(hashRows) && hashRows.length > 0) {
          setHashtags(hashRows);
        }
      } catch (hErr) {
        // Fallback already pre-seeded
      }

      // 4. Fetch P2P Swarm Telemetry
      try {
        const p2pRes: any = await ApiService.get('/discover/p2p-swarm');
        const p2pData = p2pRes?.data?.data ?? p2pRes?.data ?? p2pRes;
        if (p2pData && typeof p2pData === 'object' && p2pData.activeNodes) {
          setP2pTelemetry(p2pData);
        }
      } catch (pErr) {
        // Fallback Telemetry
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Notice: Using local resilient discovery store.';
      console.warn('[DiscoverPage] Live endpoint warning:', msg);
      // Retain fallback items seamlessly
    } finally {
      setLoading(false);
    }
  }, [selectedHashtag, selectedTopicSlug, p2pOnlyFilter, sortBy, searchQuery]);

  useEffect(() => {
    void fetchDiscoveryData();
  }, [fetchDiscoveryData]);

  // -----------------------------------------------------------------------
  // Filtering & Computed Subsets
  // -----------------------------------------------------------------------

  const filteredContent = useMemo(() => {
    let items = [...contentItems];

    if (activeEngineMode === 'topics' && selectedTopicSlug) {
      items = items.filter(i => i.topic_slug === selectedTopicSlug);
    } else if (activeEngineMode === 'p2p') {
      items = items.filter(i => !!i.p2pSwarmId);
    } else if (activeEngineMode === 'hashtags' && selectedHashtag) {
      const clean = selectedHashtag.toLowerCase();
      items = items.filter(i => (i.tags || []).some(t => t.toLowerCase() === clean));
    } else if (activeEngineMode === 'trends') {
      items = items.filter(i => i.isTrendingCandidate);
    } else if (activeEngineMode === 'seshat') {
      items = items.filter(i => !!i.seshatPageId);
    } else if (activeEngineMode === 'permanence') {
      items = items.filter(i => !!i.isPermanenceArchived);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.body.toLowerCase().includes(q) ||
        i.author_name.toLowerCase().includes(q) ||
        (i.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    return items;
  }, [contentItems, activeEngineMode, selectedTopicSlug, selectedHashtag, searchQuery]);

  // Qualifying Trends Items (demonstrating the 30% feed into TrendsPage.tsx)
  const trendsSyndicationCandidates = useMemo(() => {
    return contentItems.filter(c => c.isTrendingCandidate && c.velocityScore >= 90);
  }, [contentItems]);

  // -----------------------------------------------------------------------
  // Interactive Actions & State Mutations
  // -----------------------------------------------------------------------

  const handleVote = useCallback(async (item: DiscoverItem, type: 'up' | 'down') => {
    const currentVote = userVotes[item.id];
    const newVote = currentVote === type ? undefined : type;

    setUserVotes(prev => {
      const next = { ...prev };
      if (!newVote) delete next[item.id];
      else next[item.id] = newVote;
      return next;
    });

    setContentItems(prev => prev.map(p => {
      if (p.id !== item.id) return p;
      let upDelta = 0;
      let downDelta = 0;
      if (currentVote === 'up') upDelta -= 1;
      if (currentVote === 'down') downDelta -= 1;
      if (newVote === 'up') upDelta += 1;
      if (newVote === 'down') downDelta += 1;
      return {
        ...p,
        upvotes: Math.max(0, p.upvotes + upDelta),
        downvotes: Math.max(0, p.downvotes + downDelta)
      };
    }));

    try {
      await ApiService.post('/discover/track-interaction', {
        contentId: item.id,
        action: 'vote',
        voteType: type
      });
    } catch (_) {
      // Optimistic local state already updated
    }
    showToast(newVote ? `Cast ${type}vote on "${item.title.slice(0, 32)}..."` : 'Vote removed', 'info');
  }, [userVotes, showToast]);

  const handleLike = useCallback(async (item: DiscoverItem) => {
    const isLiked = !!userLikes[item.id];
    setUserLikes(prev => ({ ...prev, [item.id]: !isLiked }));
    setContentItems(prev => prev.map(p => {
      if (p.id !== item.id) return p;
      return { ...p, likes_count: p.likes_count + (isLiked ? -1 : 1) };
    }));

    try {
      await ApiService.post('/discover/track-interaction', {
        contentId: item.id,
        action: 'like'
      });
    } catch (_) {
      // Handled optimistically
    }
    showToast(isLiked ? 'Removed like' : 'Liked post!', 'success');
  }, [userLikes, showToast]);

  const handleToggleP2PSeed = useCallback(async (item: DiscoverItem) => {
    const isSeeding = !!userSeeding[item.id];
    setUserSeeding(prev => ({ ...prev, [item.id]: !isSeeding }));
    setContentItems(prev => prev.map(p => {
      if (p.id !== item.id) return p;
      return { ...p, p2pSeeders: (p.p2pSeeders || 0) + (isSeeding ? -1 : 1) };
    }));

    try {
      await ApiService.post('/discover/track-interaction', {
        contentId: item.id,
        action: 'p2p_seed'
      });
    } catch (_) {}

    showToast(
      isSeeding
        ? `Stopped browser seeding for hash ${item.p2pContentHash?.slice(0, 10)}...`
        : `Active P2P seeder registered on swarm ${item.p2pSwarmId}!`,
      'success'
    );
  }, [userSeeding, showToast]);

  const handleShare = useCallback((item: DiscoverItem) => {
    const url = `${window.location.origin}/discover?topic=${item.topic_slug}&id=${item.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Discovery link copied to clipboard!', 'success');
    } else {
      showToast(`Share URL: ${url}`, 'info');
    }
  }, [showToast]);

  const handleSendGiftSubmit = useCallback(() => {
    if (!activeGiftPost) return;
    if (giftAmount <= 0) {
      showToast('Please enter a valid gift amount in FIC', 'error');
      return;
    }
    if (ficBalance < giftAmount) {
      showToast(`Insufficient FIC balance (${ficBalance.toFixed(2)} FIC available)`, 'error');
      return;
    }
    showToast(`Successfully gifted ${giftAmount} FIC to ${activeGiftPost.author_name}!`, 'success');
    setActiveGiftPost(null);
  }, [activeGiftPost, giftAmount, ficBalance, showToast]);

  const handleCreatePaylinkSubmit = useCallback(() => {
    if (!activePaylinkPost) return;
    if (!paylinkTitle.trim()) {
      showToast('Please specify a description for the paylink', 'error');
      return;
    }
    showToast(`Paylink generated: ${paylinkPrice} FIC for "${paylinkTitle.trim()}"`, 'success');
    setActivePaylinkPost(null);
    setPaylinkTitle('');
  }, [activePaylinkPost, paylinkTitle, paylinkPrice, showToast]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <MainLayout pageTitle="Discover Nexus">
      <div className="max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">

        {/* ======================================================================= */}
        {/* HERO COMMAND CENTER: Topics Engine, P2P Swarm & 30% Trends Nexus */}
        {/* ======================================================================= */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-black tracking-wide uppercase">
                <SparklesIcon className="w-3.5 h-3.5 text-blue-400" />
                Discovery Engine &bull; Topics &bull; P2P Swarm &bull; Trends Feeder
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                FingerMobile Discovery Nexus
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Autonomous content discovery powered by the <strong className="text-white">Topics Engine</strong>, decentralized <strong className="text-white">P2P Swarm Meshes</strong>, and <strong className="text-white">Hashtag Resonance</strong>. Direct UGC and velocity dispatches here supply <strong className="text-amber-400 font-bold">~30% of platform Trends</strong>, verified through <strong className="text-emerald-400 font-bold">Seshat Sovereign Pages</strong> and <strong className="text-indigo-300 font-bold">Permanence Proofs</strong>.
              </p>
            </div>

            {/* Live Telemetry Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-3 border border-slate-700/80">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <DatabaseIcon className="w-3.5 h-3.5 text-blue-400" /> Topics Radar
                </div>
                <div className="text-lg font-black text-white mt-1">6 Active</div>
                <div className="text-[11px] text-blue-300 font-semibold">92.2 Avg Velocity</div>
              </div>

              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-3 border border-slate-700/80">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <WifiIcon className="w-3.5 h-3.5 text-emerald-400" /> P2P Mesh
                </div>
                <div className="text-lg font-black text-emerald-400 mt-1">1,482 Nodes</div>
                <div className="text-[11px] text-emerald-300 font-semibold">5.31x Seed Ratio</div>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-slate-800/80 backdrop-blur-md rounded-2xl p-3 border border-amber-500/30">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <TrendingUpIcon className="w-3.5 h-3.5 text-amber-400" /> Trends Feeder
                </div>
                <div className="text-lg font-black text-amber-400 mt-1">30% Share</div>
                <div className="text-[11px] text-amber-200 font-semibold">{trendsSyndicationCandidates.length} Dispatches Active</div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* ENGINE NAVIGATION & SEARCH BAR */}
        {/* ======================================================================= */}
        <section className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-300 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input with Clear Button */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, hashtags, creators, Seshat articles, or P2P hashes..."
                className="block w-full pl-11 pr-10 py-2.5 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Sort & P2P Swarm Toggle */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="py-2 px-3 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="velocity">Velocity Index (High to Low)</option>
                  <option value="trending">30% Trends Candidate</option>
                  <option value="upvotes">Highest Upvotes</option>
                  <option value="latest">Newest Dispatches</option>
                </select>
              </div>

              <button
                onClick={() => setP2pOnlyFilter(!p2pOnlyFilter)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                  p2pOnlyFilter
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
                title="Filter content with active decentralized P2P swarms"
              >
                <WifiIcon className="w-3.5 h-3.5" />
                <span>P2P Only</span>
              </button>
            </div>
          </div>

          {/* Engine Mode Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
            {[
              { id: 'all', label: 'All Discovery Stream', icon: SparklesIcon },
              { id: 'topics', label: 'Topics Radar Engine', icon: DatabaseIcon },
              { id: 'p2p', label: 'P2P Swarm Mesh', icon: WifiIcon },
              { id: 'hashtags', label: 'Hashtag Velocity', icon: HashtagIcon },
              { id: 'trends', label: '30% Trends Feeder', icon: TrendingUpIcon },
              { id: 'seshat', label: 'Seshat Sovereign Vault', icon: ShieldIcon },
              { id: 'permanence', label: 'Permanence Archive', icon: LockIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeEngineMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveEngineMode(tab.id as EngineViewMode);
                    if (tab.id === 'all') {
                      setSelectedTopicSlug(null);
                      setSelectedHashtag(null);
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* ACTIVE FILTERS CHIP BAR */}
        {/* ======================================================================= */}
        {(selectedTopicSlug || selectedHashtag || p2pOnlyFilter || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 px-2">
            <span className="text-xs font-bold text-slate-600">Active Discovery Filters:</span>

            {selectedTopicSlug && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-950 border border-blue-400 font-bold text-xs">
                Topic: {topics.find(t => t.slug === selectedTopicSlug)?.name || selectedTopicSlug}
                <button
                  onClick={() => setSelectedTopicSlug(null)}
                  className="hover:text-red-700 font-black ml-1"
                >
                  &times;
                </button>
              </span>
            )}

            {selectedHashtag && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-950 border border-purple-400 font-bold text-xs">
                Tag: {selectedHashtag}
                <button
                  onClick={() => setSelectedHashtag(null)}
                  className="hover:text-red-700 font-black ml-1"
                >
                  &times;
                </button>
              </span>
            )}

            {p2pOnlyFilter && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold text-xs">
                P2P Swarm Verified
                <button
                  onClick={() => setP2pOnlyFilter(false)}
                  className="hover:text-red-700 font-black ml-1"
                >
                  &times;
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-400 font-bold text-xs">
                Query: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery('')}
                  className="hover:text-red-700 font-black ml-1"
                >
                  &times;
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setSelectedTopicSlug(null);
                setSelectedHashtag(null);
                setP2pOnlyFilter(false);
                setSearchQuery('');
                setActiveEngineMode('all');
              }}
              className="text-xs font-bold text-red-600 hover:underline ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* ======================================================================= */}
        {/* MAIN 3-COLUMN DISCOVERY GRID */}
        {/* ======================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ------------------------------------------------------------------- */}
          {/* LEFT COLUMN: Topics Engine, Hashtag Engine & Widgets Rail */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-6">

            {/* TOPICS ENGINE CONSOLE */}
            <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <DatabaseIcon className="w-5 h-5 text-blue-600" />
                  Topics Engine
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-950 border border-blue-400 px-2 py-0.5 rounded-full">
                  Clusters
                </span>
              </div>

              <p className="text-xs font-medium text-slate-700">
                Dynamically weighted topics driving peer resonance and Trends syndication.
              </p>

              <div className="space-y-2">
                {topics.map((t) => {
                  const isSelected = selectedTopicSlug === t.slug;
                  return (
                    <div
                      key={t.id}
                      onClick={() => {
                        setSelectedTopicSlug(isSelected ? null : t.slug);
                        setActiveEngineMode('topics');
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 shadow-sm'
                          : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 line-clamp-1">{t.name}</span>
                        <span className="text-[11px] font-black text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded">
                          {t.resonanceScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[11px] text-slate-700 font-medium">
                        <span>{t.category}</span>
                        <span className="text-amber-800 font-bold">+{t.trendAffinityPct}% Trends</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HASHTAG ENGINE CONSOLE */}
            <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <HashtagIcon className="w-5 h-5 text-purple-600" />
                  Hashtag Engine
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-950 border border-purple-400 px-2 py-0.5 rounded-full">
                  Live Radar
                </span>
              </div>

              <p className="text-xs font-medium text-slate-700">
                Click any tag to filter the discovery stream and view peer volume.
              </p>

              <div className="flex flex-wrap gap-2">
                {hashtags.map((h) => {
                  const isSelected = selectedHashtag === h.tag;
                  return (
                    <button
                      key={h.tag}
                      onClick={() => {
                        setSelectedHashtag(isSelected ? null : h.tag);
                        setActiveEngineMode('hashtags');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-700 shadow-sm'
                          : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-purple-50 hover:border-purple-300'
                      }`}
                    >
                      <span>{h.tag}</span>
                      <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-purple-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        +{h.velocityPct}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ECOSYSTEM RAILS: Connect & Discover Widgets */}
            <DiscoverWidget pageContext="trends" />
            <ConnectWidget pageContext="trends" />
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* CENTER COLUMN: Interactive Discovery Stream Cards & Engine Views */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-6 space-y-6">

            {/* TOPICS RADAR DETAIL VIEW (when topics tab is active) */}
            {activeEngineMode === 'topics' && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <DatabaseIcon className="w-5 h-5 text-blue-600" /> Topics Engine Semantic Clusters
                    </h2>
                    <p className="text-xs font-medium text-slate-700 mt-1">
                      Topics automatically syndicate up to 30% of their verified engagement signals into the Trends Page.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {topics.map(topic => (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedTopicSlug(topic.slug)}
                      className={`p-4 rounded-xl bg-white border cursor-pointer transition-all ${
                        selectedTopicSlug === topic.slug
                          ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                          : 'border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900">{topic.name}</span>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          {topic.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mt-2 line-clamp-2">{topic.description}</p>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-slate-800 pt-2 border-t border-slate-100">
                        <span>{topic.postCount} Dispatches</span>
                        <span className="text-emerald-700 font-bold">{topic.p2pSwarmNodes} P2P Nodes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* P2P MESH DETAIL VIEW (when p2p tab is active) */}
            {activeEngineMode === 'p2p' && p2pTelemetry && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl p-6 border border-emerald-300 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <WifiIcon className="w-5 h-5 text-emerald-600" /> Decentralized P2P Mesh Telemetry
                  </h2>
                  <span className="text-xs font-bold text-emerald-950 bg-emerald-200 border border-emerald-400 px-2.5 py-0.5 rounded-full">
                    {p2pTelemetry.swarmMeshHealth}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-700">
                  Direct peer-to-peer media dissemination prevents central egress charges, accelerating high-fidelity video, photo galleries, and lossless Beatwave audio.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-xl border border-emerald-200">
                    <div className="text-[11px] font-bold text-slate-600">Active Nodes</div>
                    <div className="text-lg font-black text-slate-900 mt-0.5">{p2pTelemetry.activeNodes}</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200">
                    <div className="text-[11px] font-bold text-slate-600">Connected Peers</div>
                    <div className="text-lg font-black text-emerald-700 mt-0.5">{p2pTelemetry.connectedPeers}</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200">
                    <div className="text-[11px] font-bold text-slate-600">Seed Ratio</div>
                    <div className="text-lg font-black text-blue-700 mt-0.5">{p2pTelemetry.seedLeechRatio}x</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200">
                    <div className="text-[11px] font-bold text-slate-600">Mesh Latency</div>
                    <div className="text-lg font-black text-purple-700 mt-0.5">{p2pTelemetry.avgPropagationLatencyMs}ms</div>
                  </div>
                </div>
              </div>
            )}

            {/* 30% TRENDS PIPELINE CALLOUT (when trends tab is active) */}
            {activeEngineMode === 'trends' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl p-6 border border-amber-300 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <TrendingUpIcon className="w-5 h-5 text-amber-600" /> 30% Trends Syndication Pipeline
                  </h2>
                  <button
                    onClick={() => navigate('/trends')}
                    className="text-xs font-black text-amber-900 bg-amber-200 hover:bg-amber-300 border border-amber-400 px-3 py-1 rounded-lg flex items-center gap-1"
                  >
                    Open Trends Page <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-medium text-slate-700">
                  According to platform architecture, the Trends Engine draws 30% of its real-time trend signals directly from /discover engagement, velocity spikes, and community upvotes.
                </p>
              </div>
            )}

            {/* EMPTY STATE */}
            {!loading && filteredContent.length === 0 && (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-300 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No matching discovery dispatches found</h3>
                <p className="text-xs font-medium text-slate-700 max-w-sm mx-auto">
                  Try adjusting your search criteria, switching topics, or resetting your hashtag filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedTopicSlug(null);
                    setSelectedHashtag(null);
                    setP2pOnlyFilter(false);
                    setSearchQuery('');
                    setActiveEngineMode('all');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* CONTENT STREAM: Razor-Sharp Discovery Cards */}
            {filteredContent.map((item) => {
              const isLiked = !!userLikes[item.id];
              const userVote = userVotes[item.id];
              const isSeeding = !!userSeeding[item.id];
              const isBookmarked = !!userBookmarks[item.id];

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-300 shadow-sm hover:shadow-md transition-all overflow-hidden space-y-4 p-5 sm:p-6"
                >
                  {/* Top Header: Author + Seshat Sovereign Badge + Date */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.author_avatar}
                        alt={item.author_name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-300 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-slate-900 text-sm">{item.author_name}</h4>
                          {item.isSeshatVerified && (
                            <span
                              onClick={() => setInspectedProofItem(item)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-950 border border-blue-400 cursor-pointer"
                              title="Verified Sovereign Publisher on Seshat"
                            >
                              <ShieldIcon className="w-3 h-3 text-blue-700" /> Seshat Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <span>{item.author_handle}</span>
                          <span>&bull;</span>
                          <span>{new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Velocity Badge */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-400 text-xs font-black">
                        <FireIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>{item.velocityScore} Velocity</span>
                      </div>
                      {item.isTrendingCandidate && (
                        <span className="text-[10px] font-bold text-emerald-800 mt-1">
                          Feeds 30% Trends
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Permanence Protocol Proof Ribbon */}
                  {item.isPermanenceArchived && (
                    <div className="flex items-center justify-between text-xs bg-indigo-50/70 border border-indigo-200 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2 text-indigo-950 font-bold">
                        <LockIcon className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Permanence Protocol: Block #{item.permanenceBlock}</span>
                      </div>
                      <button
                        onClick={() => setInspectedProofItem(item)}
                        className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline"
                      >
                        Verify Proof
                      </button>
                    </div>
                  )}

                  {/* Content Title & Body */}
                  <div className="space-y-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">
                      {item.body}
                    </p>
                  </div>

                  {/* High Resolution Media Preview */}
                  {item.media_urls && item.media_urls.length > 0 && (
                    <div className="rounded-xl overflow-hidden border border-slate-200 relative group">
                      <img
                        src={item.media_urls[0]}
                        alt={item.title}
                        className="w-full max-h-96 object-cover object-center group-hover:scale-[1.01] transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                        {item.category}
                      </div>
                    </div>
                  )}

                  {/* Hashtags Engine Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {item.tags.map(t => (
                      <span
                        key={t}
                        onClick={() => {
                          setSelectedHashtag(t);
                          setActiveEngineMode('hashtags');
                        }}
                        className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-blue-100 text-slate-900 hover:text-blue-900 border border-slate-300 font-bold text-xs cursor-pointer transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* P2P Swarm Relay & Seeder Status Strip */}
                  {item.p2pSwarmId && (
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 border border-slate-200 rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 font-bold text-slate-800">
                          <WifiIcon className="w-3.5 h-3.5 text-emerald-600" />
                          <span>P2P Swarm: {item.p2pSeeders || 0} Seeders &bull; {item.p2pLeechers || 0} Leechers</span>
                        </span>
                        <span
                          onClick={() => setInspectedSwarmItem(item)}
                          className="font-mono text-[11px] text-slate-600 hover:text-slate-900 cursor-pointer underline hidden sm:inline"
                          title="Click to inspect content hash"
                        >
                          {item.p2pContentHash?.slice(0, 16)}...
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleP2PSeed(item)}
                        className={`px-3 py-1 rounded-lg font-black text-xs transition-colors flex items-center gap-1.5 ${
                          isSeeding
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white text-slate-800 border border-slate-300 hover:bg-emerald-50'
                        }`}
                      >
                        <CheckCircleIcon className={`w-3.5 h-3.5 ${isSeeding ? 'text-white' : 'text-slate-500'}`} />
                        <span>{isSeeding ? 'Seeding Swarm' : 'Seed on P2P'}</span>
                      </button>
                    </div>
                  )}

                  {/* Interaction Control Bar: Upvotes, Comments, Gifts, Paylinks, Share */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                    {/* Voting Pill */}
                    <div className="flex items-center bg-slate-100 rounded-xl border border-slate-300 p-0.5">
                      <button
                        onClick={() => handleVote(item, 'up')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${
                          userVote === 'up'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                        title="Upvote dispatch"
                      >
                        <span>&uarr;</span>
                        <span>{item.upvotes}</span>
                      </button>
                      <span className="text-slate-300 px-1">|</span>
                      <button
                        onClick={() => handleVote(item, 'down')}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black transition-colors ${
                          userVote === 'down'
                            ? 'bg-red-600 text-white'
                            : 'text-slate-700 hover:text-slate-900'
                        }`}
                        title="Downvote dispatch"
                      >
                        <span>&darr;</span>
                        <span>{item.downvotes}</span>
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Send Gift Button */}
                      <button
                        onClick={() => setActiveGiftPost(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors"
                        title="Send creator a FIC gift"
                      >
                        <GiftIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Gift FIC</span>
                      </button>

                      {/* Paylink Creator */}
                      <button
                        onClick={() => setActivePaylinkPost(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100 transition-colors"
                        title="Create sovereign paylink"
                      >
                        <PaylinkIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span>Paylink</span>
                      </button>

                      {/* Share Button */}
                      <button
                        onClick={() => handleShare(item)}
                        className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors"
                        title="Share discovery dispatch"
                      >
                        <ShareIcon className="w-4 h-4" />
                      </button>

                      {/* Bookmark Button */}
                      <button
                        onClick={() => {
                          const next = !isBookmarked;
                          setUserBookmarks(prev => ({ ...prev, [item.id]: next }));
                          showToast(next ? 'Saved to Sovereign Bookmarks!' : 'Removed from bookmarks', 'info');
                        }}
                        className={`p-2 rounded-xl border transition-colors ${
                          isBookmarked
                            ? 'bg-purple-100 text-purple-900 border-purple-400'
                            : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-300'
                        }`}
                        title="Save to bookmarks"
                      >
                        <BookmarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: Trends 30% Pipeline Radar, Seshat Vault & Balance */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-3 space-y-6">

            {/* 30% TRENDS PIPELINE TELEMETRY */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-5 border border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-amber-950 text-base flex items-center gap-2">
                  <TrendingUpIcon className="w-5 h-5 text-amber-600" />
                  Trends 30% Pipeline
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-950 border border-amber-400 px-2 py-0.5 rounded-full">
                  Live Feeder
                </span>
              </div>

              <p className="text-xs font-medium text-amber-900 leading-relaxed">
                Platform Trends synthesizes <strong className="text-slate-900 font-black">30% of its data</strong> directly from this Discover engine. When high-velocity UGC exceeds the threshold, it is automatically syndicated.
              </p>

              <div className="space-y-2 pt-1">
                {trendsSyndicationCandidates.slice(0, 3).map((trendItem) => (
                  <div
                    key={trendItem.id}
                    onClick={() => navigate('/trends')}
                    className="p-3 bg-white rounded-xl border border-amber-200 cursor-pointer hover:border-amber-400 transition-colors shadow-xs"
                  >
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{trendItem.title}</div>
                    <div className="flex items-center justify-between mt-1 text-[11px] text-amber-900 font-bold">
                      <span>{trendItem.category}</span>
                      <span className="text-emerald-800">+{trendItem.trendVelocityContribution}% Trend Share</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/trends')}
                className="w-full mt-2 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Explore Full Trends Hub</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* SESHAT SOVEREIGN VAULT & MONETIZATION */}
            <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldIcon className="w-5 h-5 text-blue-600" />
                  Seshat Sovereign Vault
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-950 border border-blue-400 px-2 py-0.5 rounded-full">
                  Patronage
                </span>
              </div>

              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                Autonomous publishing channels with cryptographic access keys, royalty distributions, and digital rights tracking.
              </p>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Verified Seshat Pages</span>
                  <span className="text-blue-700 font-black">4 Registered</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>Subscriber Royalties</span>
                  <span className="text-emerald-700 font-black">100% Direct</span>
                </div>
              </div>
            </div>

            {/* PERMANENCE IMMUTABLE ARCHIVE GUARANTEE */}
            <div className="bg-white rounded-2xl p-5 border border-slate-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <LockIcon className="w-5 h-5 text-indigo-600" />
                  Permanence Protocol
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-950 border border-indigo-400 px-2 py-0.5 rounded-full">
                  Proof-of-Store
                </span>
              </div>

              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                Staked FIC guarantees bottom-column permanence and uncensorable historical archival on the FingerMobile decentralized ledger.
              </p>

              <button
                onClick={() => navigate('/permanence')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>View Permanence Ledger</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* USER FIC BALANCE & PATRONAGE PANEL */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl p-5 text-white border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-sm text-slate-200">Your FIC Treasury</span>
                </div>
                <span className="text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div>
                <div className="text-2xl font-black text-white">{ficBalance.toFixed(2)} FIC</div>
                <div className="text-xs text-slate-300 mt-0.5 font-medium">Ready for creator gifting & permanence staking</div>
              </div>

              <button
                onClick={() => navigate('/wallet')}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Manage Treasury Wallet
              </button>
            </div>

          </div>
        </div>

        {/* ======================================================================= */}
        {/* INTERACTIVE MODALS: Gift, Paylink, Proof Inspector */}
        {/* ======================================================================= */}

        {/* GIFT MODAL */}
        {activeGiftPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-300 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <GiftIcon className="w-5 h-5 text-amber-600" /> Send FIC Creator Gift
                </h3>
                <button
                  onClick={() => setActiveGiftPost(null)}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              <p className="text-xs font-medium text-slate-700">
                Direct patron contribution to <strong className="text-slate-900 font-bold">{activeGiftPost.author_name}</strong> for: "{activeGiftPost.title}".
              </p>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">Gift Amount (FIC)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 25, 50].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setGiftAmount(amt)}
                      className={`py-2 text-xs font-black rounded-xl border transition-colors ${
                        giftAmount === amt
                          ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                          : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {amt} FIC
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-600 font-medium">
                  Current Wallet Balance: <strong className="text-slate-900">{ficBalance.toFixed(2)} FIC</strong>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActiveGiftPost(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendGiftSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm"
                >
                  Confirm & Send Gift
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAYLINK MODAL */}
        {activePaylinkPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-300 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <PaylinkIcon className="w-5 h-5 text-blue-600" /> Generate Sovereign Paylink
                </h3>
                <button
                  onClick={() => setActivePaylinkPost(null)}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Paylink Description</label>
                  <input
                    type="text"
                    value={paylinkTitle}
                    onChange={(e) => setPaylinkTitle(e.target.value)}
                    placeholder={`License or unlock: "${activePaylinkPost.title.slice(0, 30)}..."`}
                    className="w-full px-3 py-2 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Unlock Price (FIC)</label>
                  <input
                    type="number"
                    value={paylinkPrice}
                    onChange={(e) => setPaylinkPrice(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 rounded-xl text-slate-900 font-bold border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActivePaylinkPost(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePaylinkSubmit}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                >
                  Issue Paylink
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CRYPTOGRAPHIC PROOF INSPECTOR MODAL */}
        {inspectedProofItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-slate-300 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <ShieldIcon className="w-5 h-5 text-indigo-600" /> Cryptographic Integrity Proof
                </h3>
                <button
                  onClick={() => setInspectedProofItem(null)}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-600 block">Dispatch Title:</span>
                  <span className="font-bold text-slate-900">{inspectedProofItem.title}</span>
                </div>

                <div>
                  <span className="font-bold text-slate-600 block">Permanence Block Height:</span>
                  <span className="font-mono text-indigo-800 font-bold">
                    {inspectedProofItem.permanenceBlock ? `#${inspectedProofItem.permanenceBlock}` : 'Pending consensus confirmation'}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-slate-600 block">Cryptographic Merkle Proof:</span>
                  <span className="font-mono text-slate-900 break-all bg-slate-100 p-2 rounded-lg block font-semibold">
                    {inspectedProofItem.permanenceProof || '0x0000000000000000000000000000000000000000'}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-slate-600 block">P2P IPFS Content Hash:</span>
                  <span className="font-mono text-emerald-800 break-all bg-emerald-50 p-2 rounded-lg block font-semibold">
                    {inspectedProofItem.p2pContentHash || 'bafybeig...'}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-slate-600 block">Seshat Sovereign Page Attribution:</span>
                  <span className="font-bold text-blue-900">
                    {inspectedProofItem.seshatPageName || 'Sovereign Contributor ID'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setInspectedProofItem(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        )}

        {/* P2P SWARM INSPECTOR MODAL */}
        {inspectedSwarmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-300 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <WifiIcon className="w-5 h-5 text-emerald-600" /> P2P Swarm Topology
                </h3>
                <button
                  onClick={() => setInspectedSwarmItem(null)}
                  className="text-slate-400 hover:text-slate-700 text-xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="font-bold text-emerald-950">Active Swarm ID: {inspectedSwarmItem.p2pSwarmId}</div>
                  <div className="text-slate-700 mt-1">
                    Seeders: <strong className="text-slate-900">{inspectedSwarmItem.p2pSeeders || 0}</strong> &bull; Leechers: <strong className="text-slate-900">{inspectedSwarmItem.p2pLeechers || 0}</strong>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-600 block">Peer Content Hash:</span>
                  <span className="font-mono text-slate-900 break-all bg-slate-100 p-2 rounded-lg block font-semibold">
                    {inspectedSwarmItem.p2pContentHash}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setInspectedSwarmItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    handleToggleP2PSeed(inspectedSwarmItem);
                    setInspectedSwarmItem(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                >
                  {userSeeding[inspectedSwarmItem.id] ? 'Stop Seeding' : 'Start Browser Seeding'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SOVEREIGN MOBILE NAVIGATION QUICK DOCK */}
        <nav
          aria-label="Discover Quick Navigation"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-3 py-2 sm:hidden flex items-center justify-around shadow-lg"
        >
          <button
            type="button"
            onClick={() => {
              setActiveEngineMode('topics');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
              activeEngineMode === 'topics' ? 'text-indigo-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <SparklesIcon className="w-5 h-5 mb-0.5" />
            <span>Topics</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveEngineMode('trends');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
              activeEngineMode === 'trends' ? 'text-indigo-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <FireIcon className="w-5 h-5 mb-0.5" />
            <span>Trends</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveEngineMode('p2p');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
              activeEngineMode === 'p2p' ? 'text-indigo-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <WifiIcon className="w-5 h-5 mb-0.5" />
            <span>P2P Swarm</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveEngineMode('hashtags');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`min-w-[44px] min-h-[44px] flex flex-col items-center justify-center text-xs font-bold transition-colors ${
              activeEngineMode === 'hashtags' ? 'text-indigo-600' : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <HashtagIcon className="w-5 h-5 mb-0.5" />
            <span>Tags</span>
          </button>
        </nav>

      </div>
    </MainLayout>
  );
};

export default DiscoverPage;
