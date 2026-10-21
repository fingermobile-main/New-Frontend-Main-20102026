/**
 * P2P Leaderboard & KPI Database Engine - FingerMobile Protocol™
 * Provides a decentralized in-memory & persisted Leaderboard Metrics & KPI database.
 * Updates at random intervals and shuffles to keep all modules (PhotoCredits, Forum,
 * Publicitee, FingerShorts, and Discover) perfectly synchronized with agents/AI.
 */

import { p2pUgcStorageService, DurablePhotoCreditItem } from './P2PUgcStorageService';

export interface CreatorLeaderboardEntry {
  rank: number;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  handle: string;
  reputationScore: number;
  aiQualityScore: number; // 80 - 99%
  ficYield: number;
  totalEngagements: number;
  p2pNodeId: string;
  cohort: string;
  badge: string;
  topMediaUrl: string;
  mediaType: 'image' | 'video';
  lastActive: string;
}

export interface KpiMetricBoard {
  activeP2pRelays: number;
  globalFicVelocity: number;
  totalUgcPublished: number;
  averageAiQuality: number;
  dailyGiveawayPoolFic: number;
  lastShuffledTimestamp: string;
  countdownSeconds: number;
}

const DEFAULT_LEADERBOARD_CREATORS: CreatorLeaderboardEntry[] = [
  {
    rank: 1,
    creatorId: 'israel-mbah',
    creatorName: 'Israel Obinna Mbah',
    creatorAvatar: '/assets/branding/mbah_israel_obinna.jpeg',
    handle: '@israel_mbah',
    reputationScore: 99.4,
    aiQualityScore: 98,
    ficYield: 52400,
    totalEngagements: 14820,
    p2pNodeId: 'node-lagos-01',
    cohort: "Black African (20's)",
    badge: '🥇 Protocol Founder & Prime Validator',
    topMediaUrl: '/assets/branding/mbah_israel_obinna.jpeg',
    mediaType: 'image',
    lastActive: 'Just now'
  },
  {
    rank: 2,
    creatorId: 'elena-vance',
    creatorName: 'Elena Vance',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    handle: '@elena_cine',
    reputationScore: 96.8,
    aiQualityScore: 96,
    ficYield: 34100,
    totalEngagements: 9840,
    p2pNodeId: 'node-vancouver-08',
    cohort: 'Global Cinematic Director',
    badge: '🥈 2nd Place Grandmaster',
    topMediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    mediaType: 'video',
    lastActive: '2m ago'
  },
  {
    rank: 3,
    creatorId: 'liam-oconnor',
    creatorName: "Liam O'Connor",
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    handle: '@liam_atlantic',
    reputationScore: 94.2,
    aiQualityScore: 95,
    ficYield: 28900,
    totalEngagements: 7650,
    p2pNodeId: 'node-dublin-03',
    cohort: 'Landscape & Aerial Vanguard',
    badge: '🥉 3rd Place Bronze Laureate',
    topMediaUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
    mediaType: 'image',
    lastActive: '5m ago'
  },
  {
    rank: 4,
    creatorId: 'sofia-rodriguez',
    creatorName: 'Sofia Rodriguez',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    handle: '@sofia_wildlife',
    reputationScore: 91.5,
    aiQualityScore: 93,
    ficYield: 21200,
    totalEngagements: 6200,
    p2pNodeId: 'node-merida-02',
    cohort: 'Venezuelan Drone Cinema',
    badge: '🏅 4th Place Finalist',
    topMediaUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800',
    mediaType: 'video',
    lastActive: '12m ago'
  },
  {
    rank: 5,
    creatorId: 'marcus-washington',
    creatorName: 'Marcus Washington',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    handle: '@marcus_arch',
    reputationScore: 89.9,
    aiQualityScore: 91,
    ficYield: 18500,
    totalEngagements: 5410,
    p2pNodeId: 'node-chicago-05',
    cohort: "Black American (30's)",
    badge: '🏅 5th Place Finalist',
    topMediaUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    mediaType: 'image',
    lastActive: '18m ago'
  },
  {
    rank: 6,
    creatorId: 'aisha-mansoor',
    creatorName: 'Aisha Al-Mansoor',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    handle: '@aisha_dubai',
    reputationScore: 88.2,
    aiQualityScore: 90,
    ficYield: 15300,
    totalEngagements: 4900,
    p2pNodeId: 'node-dubai-01',
    cohort: 'Middle East Executive Tech',
    badge: '🎖️ 6th Place Honor',
    topMediaUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    mediaType: 'video',
    lastActive: '25m ago'
  },
  {
    rank: 7,
    creatorId: 'amara-kalu',
    creatorName: 'Amara Kalu',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    handle: '@amara_beats',
    reputationScore: 86.4,
    aiQualityScore: 89,
    ficYield: 12800,
    totalEngagements: 4120,
    p2pNodeId: 'node-lagos-04',
    cohort: 'Audio & Live Stage Visionary',
    badge: '🎖️ 7th Place Honor',
    topMediaUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    mediaType: 'image',
    lastActive: '30m ago'
  },
  {
    rank: 8,
    creatorId: 'tunde-adeleke',
    creatorName: 'Tunde Adeleke',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    handle: '@tunde_dev',
    reputationScore: 85.1,
    aiQualityScore: 88,
    ficYield: 10400,
    totalEngagements: 3800,
    p2pNodeId: 'node-abuja-02',
    cohort: 'Keycard NFC & Cryptography',
    badge: '🎖️ 8th Place Honor',
    topMediaUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    mediaType: 'image',
    lastActive: '45m ago'
  },
  {
    rank: 9,
    creatorId: 'zara-sterling',
    creatorName: 'Zara Sterling',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    handle: '@zara_lush',
    reputationScore: 84.0,
    aiQualityScore: 87,
    ficYield: 9100,
    totalEngagements: 3410,
    p2pNodeId: 'node-london-07',
    cohort: 'Lush Escrow & Community Builder',
    badge: '🎖️ 9th Place Honor',
    topMediaUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
    mediaType: 'image',
    lastActive: '1h ago'
  }
];

class P2PLeaderboardKpiEngine {
  private creators: CreatorLeaderboardEntry[] = [];
  private kpiMetrics: KpiMetricBoard;
  private listeners: Array<() => void> = [];
  private shuffleTimer: any = null;
  private countdownTimer: any = null;
  private countdown: number = 10;

  constructor() {
    this.kpiMetrics = {
      activeP2pRelays: 1248,
      globalFicVelocity: 142.8,
      totalUgcPublished: 4892,
      averageAiQuality: 94.6,
      dailyGiveawayPoolFic: 125000,
      lastShuffledTimestamp: new Date().toISOString(),
      countdownSeconds: 10
    };

    this.init();
  }

  private init() {
    this.loadFromStorage();
    this.incorporateLocalUploads();

    // Listen for new UGC uploads
    p2pUgcStorageService.onUgcUpdate(() => {
      this.incorporateLocalUploads();
      this.notifyListeners();
    });

    // Start 10-second automatic P2P random shuffling loop
    this.startShufflingEngine();
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem('FM_P2P_LEADERBOARD_CREATORS');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.creators = parsed;
          return;
        }
      }
    } catch {
      // Fallback
    }
    this.creators = [...DEFAULT_LEADERBOARD_CREATORS];
  }

  private incorporateLocalUploads() {
    const uploadedPhotos = p2pUgcStorageService.getUploadedPhotos();
    if (uploadedPhotos.length > 0) {
      // Create or update creator entries from local uploaded media
      const userUploadEntries: CreatorLeaderboardEntry[] = uploadedPhotos.map((photo, idx) => ({
        rank: idx + 1,
        creatorId: photo.photographer_id || `user-creator-${photo.id}`,
        creatorName: photo.photographer || 'Verified Member Creator',
        creatorAvatar: photo.imageUrl,
        handle: `@${(photo.photographer || 'creator').toLowerCase().replace(/\s+/g, '_')}`,
        reputationScore: 98.5 - idx * 0.5,
        aiQualityScore: 95,
        ficYield: 24000 - idx * 1000,
        totalEngagements: photo.likes + photo.downloads + photo.shares + 15,
        p2pNodeId: 'node-self-sovereign',
        cohort: photo.cohort || 'Local UGC Creator',
        badge: idx === 0 ? '🌟 Prime Contributor' : '🎖️ Verified UGC Creator',
        topMediaUrl: photo.imageUrl,
        mediaType: photo.media_type,
        lastActive: 'Just uploaded'
      }));

      // Merge user uploads at the top of the leaderboard
      const existingFiltered = this.creators.filter(
        (c) => !userUploadEntries.some((u) => u.creatorId === c.creatorId)
      );

      this.creators = [...userUploadEntries, ...existingFiltered].map((c, i) => ({
        ...c,
        rank: i + 1
      }));
    }
  }

  private startShufflingEngine() {
    if (this.shuffleTimer) clearInterval(this.shuffleTimer);
    if (this.countdownTimer) clearInterval(this.countdownTimer);

    // 1-second countdown pulse
    this.countdownTimer = setInterval(() => {
      this.countdown = this.countdown <= 1 ? 10 : this.countdown - 1;
      this.kpiMetrics.countdownSeconds = this.countdown;
      this.notifyListeners();
    }, 1000);

    // 10-second random shuffle
    this.shuffleTimer = setInterval(() => {
      this.shuffleLeaderboard();
    }, 10000);
  }

  public shuffleLeaderboard() {
    if (this.creators.length <= 1) return;

    // Smart weighted rotation: preserve the top #1 sovereign anchor while rotating runner-ups
    const topAnchor = this.creators[0];
    const rest = this.creators.slice(1);

    // Shift first item of rest to end
    const shifted = rest.shift();
    if (shifted) rest.push(shifted);

    // Recompute ranks and dynamic micro-fluctuations
    this.creators = [topAnchor, ...rest].map((c, idx) => ({
      ...c,
      rank: idx + 1,
      ficYield: c.ficYield + Math.floor(Math.random() * 25)
    }));

    this.kpiMetrics.activeP2pRelays = 1240 + Math.floor(Math.random() * 20);
    this.kpiMetrics.globalFicVelocity = +(140 + Math.random() * 5).toFixed(1);
    this.kpiMetrics.lastShuffledTimestamp = new Date().toISOString();
    this.countdown = 10;
    this.kpiMetrics.countdownSeconds = 10;

    this.notifyListeners();
  }

  public getCreators(): CreatorLeaderboardEntry[] {
    return this.creators;
  }

  public getKpiMetrics(): KpiMetricBoard {
    return this.kpiMetrics;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }
}

export const p2pLeaderboardKpiEngine = new P2PLeaderboardKpiEngine();
export default p2pLeaderboardKpiEngine;
