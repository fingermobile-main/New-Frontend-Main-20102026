import React, {} from 'react';
import { ComponentProps } from './editor-components';

export interface CodeChange {file: string;
  lineNumber: number;
  changeType: "add" | "delete" | "modify";
  content: string;
  description?: string;
}

// ── Additional type stubs for pages that reference them ────────────────────

export interface CourseCategory {id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Instructor {id: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  rating?: number;
}

export interface Testimonial {id: string;
  author: string;
  content: string;
  rating?: number;
  avatarUrl?: string;
}

export interface GalleryItem {id: string;
  title: string;
  imageUrl: string;
  description?: string;
  category?: string;
  tags?: string[];
  createdAt?: string;
  [key: string]: any;
}

export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sortBy?: string;
  search?: string;
}

export interface Module {id: string;
  title: string;
  description?: string;
  duration?: number;
  lessons?: string[];
}

export interface DownloadedItem {id: string;
  title: string;
  url: string;
  type: string;
  downloadedAt: string;
  size?: number;
  content?: string;
  [key: string]: any;
}

export interface CommunitySummary {id: string;
  name: string;
  memberCount: number;
  type: string; // Added to distinguish between Hallmarks, Gems, Groups, etc.
  postCount?: number;
  description?: string;
  avatarUrl?: string;
  slug?: string;
}

export interface UgcAnalyticsData {totalPosts: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  engagementRate: number;
  topPosts?: Array<{id: string;
  title: string;
  views: number }>;
}

export interface ChatContact {id: string;
  name: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface Contact {id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  animatedAvatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface PayoutData {
  id?: string;
memberId: string;
amount: number;
  currency?: string;
  status?: string;
  method?: string;
bankName: string;
accountNumber: string;
  requestedAt?: string;
  processedAt?: string;
}

export interface CampaignAnalytics {campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: {total: number;
  data: any[];
  };
ctr: number;
  roas?: number;
  reach?: {total: number;
  data: any[];
  };
  engagement?: {total: number;
  data: any[];
  };
}

export interface Campaign {id: string;
  name: string;
  title?: string; // Alias for name
  description?: string;
  status: string;
  budget: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  startDate: string;
  endDate?: string;
  expiryDate?: string; // Alias for endDate
  targetAudience?: string;
  analytics?: CampaignAnalytics;
  [key: string]: any; // Allow additional properties
}

export interface ModuleStatus {moduleId: string;
  name: string;
  module?: string;
  engine?: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: number;
  lastChecked: string;
}

export interface ComplianceStatus {id: string;
  name?: string;
  framework?: string;
  status: 'compliant' | 'non-compliant' | 'pending' | 'Active';
  lastAudit?: string;
  notes?: string;
}

export interface LoyaltyTier {id: string;
  name: string;
  minPoints: number;
  maxPoints?: number;
  benefits: string[];
  color?: string;
  icon?: string;
  threshold?: number;
  pointsRequired?: number;
}

export interface MessageItem {id: string;
  senderId: string;
  receiverId?: string;
  text: string;
  message?: string;
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
  sender?: 'me' | 'other';
}

export interface AppliedFilters {
  query?: string;
  category?: string;
  priceRange?: string;
  rating?: number;
  [key: string]: any;
}

// ── Missing types required by contexts ─────────────────────────────────────

export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
  isFullscreen: boolean;
  isMuted: boolean;
  quality: string;
  subtitleTrack: string | null;
  [key: string]: any;
}

export interface GiftOption {
  id: string;
  name: string;
  cost: number;
  currency: string;
  icon?: string;
  emoji?: string;
  category?: string;
  popularity?: number;
  [key: string]: any;
}