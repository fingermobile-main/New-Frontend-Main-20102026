export type BroadcastChannelId =
  | 'general-living-room'
  | 'creators-salon'
  | 'event-promotions'
  | 'sovereign-trading'
  | 'vip-lounge'
  | 'direct-walls';

export interface BroadcastChannel {
  id: BroadcastChannelId;
  name: string;
  badge: string;
  description: string;
  iconColor: string;
}

export interface BroadcastPost {
  id: number | string;
  creator_id: number;
  content_text: string;
  media_urls: string[];
  media_type?: 'image' | 'video';
  privacy_type: string;
  channel_id: BroadcastChannelId;
  channel_name: string;
  expires_at: string;
  created_at: string;
  username?: string;
  first_name?: string;
  avatar_url?: string;
  gem_cost?: number;
  banner_style?: 'neon-sapphire' | 'emerald-sovereign' | 'sunset-amber' | 'cyber-amethyst';
  reactions?: Record<string, number>;
  analytics?: BroadcastAnalytics;
  isCurrentUserSender?: boolean;
}

export interface BroadcastAnalytics {
  broadcastId: number | string;
  totalImpressions: number;
  openRate: number; // percentage, e.g. 78.4
  directReplyRate: number; // percentage, e.g. 19.2
  autoRepliesTriggered: number;
  autoRepliesBreakdown: {
    greeting: number;
    away: number;
    quickReplies: number;
    eventManagement: number;
  };
  ignoredCount: number;
  topChannels: Array<{ channel: string; reach: number }>;
  hourlyEngagement: Array<{ hour: string; views: number }>;
  sentimentSummary: {
    positive: number;
    neutral: number;
    inquiry: number;
  };
}

export interface QuickReplyItem {
  id: string;
  shortcut: string;
  title: string;
  content: string;
  category: 'pricing' | 'hours' | 'portfolio' | 'support' | 'booking' | 'custom';
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  usageCount: number;
}

export interface GreetingMessageConfig {
  enabled: boolean;
  inactivityDays: number; // e.g. 14 days
  selectedPreset: 'standard' | 'booking' | 'custom';
  standardText: string;
  bookingText: string;
  customText: string;
}

export interface AwayMessageConfig {
  enabled: boolean;
  workingHours: string;
  daysActive: string;
  selectedPreset: 'after_hours' | 'holiday' | 'custom';
  afterHoursText: string;
  holidayText: string;
  customText: string;
  emergencyEmail: string;
  holidayStartDate?: string;
  holidayEndDate?: string;
}

export interface EventAutoReplySuiteConfig {
  enabled: boolean;
  agencyName: string;
  emergencyPhone: string;
  portfolioUrl: string;
  faqPricingUrl: string;
  bookingCalendarUrl: string;
  emergencyContactName: string;
  generalInquirySubject: string;
  generalInquiryText: string;
  afterHoursBusyText: string;
  onSiteEventDayText: string;
}

export interface AutoReplySettings {
  greeting: GreetingMessageConfig;
  away: AwayMessageConfig;
  quickReplies: QuickReplyItem[];
  eventManagement: EventAutoReplySuiteConfig;
}
