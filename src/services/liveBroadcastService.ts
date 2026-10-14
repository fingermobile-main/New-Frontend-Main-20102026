/**
 * FingerMobile Protocol™ - WebRTC Live Broadcast & Event Scheduling Service
 * Manages "Join Me Live" link generation, WebRTC peer sessions, Platform Events, Platform Gems,
 * and Broadcast Studio Capacity Tiers (Free 20-50, Pro 2,000, Sovereign Master 200,000).
 */

export type BroadcastTierKey = 'FREE' | 'PRO_2000' | 'MASTER_200000';

export interface BroadcastTier {
  tierKey: BroadcastTierKey;
  name: string;
  capacityLimit: number;
  monthlyCostFic: number;
  monthlyCostGems: number;
  monetizationEnabled: boolean;
  canSendGifts: boolean;
  canReceiveGifts: boolean;
  canSendCoupons: boolean;
  canReceiveCoupons: boolean;
  canEarnRewards: boolean;
  allowedProductsScope: 'NONE' | 'LIMITED' | 'UNRESTRICTED';
  description: string;
}

export interface ScheduledBroadcastEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  scheduledStartTime: string; // ISO string
  durationMinutes: number;
  hostName: string;
  hostAvatar?: string;
  hostHandle?: string;
  joinLink: string;
  guestAccessMode: 'OPEN_VIEWER' | 'INTERACTIVE_COHOST' | 'VIP_BACKSTAGE';
  coHosts?: string[];
  tierKey: BroadcastTierKey;
  capacityLimit: number;
  currentAttendees: number;
  monetizationEnabled: boolean;
  allowedProductsScope: 'NONE' | 'LIMITED' | 'UNRESTRICTED';
  createdAt: string;
  isLiveNow?: boolean;
}

export interface JoinRequestResult {
  success: boolean;
  code?: string;
  message: string;
  currentAttendees?: number;
  capacityLimit?: number;
  upgradeRequired?: boolean;
  data?: Record<string, unknown>;
}

export interface ItemActionResult {
  success: boolean;
  code?: string;
  message: string;
  allowedAction: boolean;
  upgradeRequired?: boolean;
  data?: Record<string, unknown>;
}

export const CANONICAL_TIERS: Record<BroadcastTierKey, BroadcastTier> = {
  FREE: {
    tierKey: 'FREE',
    name: 'Free Tier (Standard)',
    capacityLimit: 50,
    monthlyCostFic: 0,
    monthlyCostGems: 0,
    monetizationEnabled: false,
    canSendGifts: false,
    canReceiveGifts: false,
    canSendCoupons: false,
    canReceiveCoupons: false,
    canEarnRewards: false,
    allowedProductsScope: 'NONE',
    description:
      'Limit: 20-50 Join Requests. Cannot send items, cannot receive/send or earn coupons, gift cards, and other items & products.'
  },
  PRO_2000: {
    tierKey: 'PRO_2000',
    name: 'Pro Creator Tier',
    capacityLimit: 2000,
    monthlyCostFic: 250,
    monthlyCostGems: 500,
    monetizationEnabled: true,
    canSendGifts: true,
    canReceiveGifts: true,
    canSendCoupons: true,
    canReceiveCoupons: true,
    canEarnRewards: true,
    allowedProductsScope: 'LIMITED',
    description:
      'Capacity: 2,000 participants. Get FIC/Monthly Subscription. Monetized. Member can send/get limited Gifts, coupons, and gift cards.'
  },
  MASTER_200000: {
    tierKey: 'MASTER_200000',
    name: 'Sovereign Master Tier',
    capacityLimit: 200000,
    monthlyCostFic: 1200,
    monthlyCostGems: 2500,
    monetizationEnabled: true,
    canSendGifts: true,
    canReceiveGifts: true,
    canSendCoupons: true,
    canReceiveCoupons: true,
    canEarnRewards: true,
    allowedProductsScope: 'UNRESTRICTED',
    description:
      'Capacity: 200,000 participants. Get FIC/Monthly Subscription. Monetized. Member can send/get/earn Gifts, coupons, gift cards, and other items & products.'
  }
};

const STORAGE_KEY = 'fingermobile_scheduled_broadcasts';
const ACTIVE_TIER_KEY = 'fingermobile_live_studio_tier';

const INITIAL_SCHEDULED_EVENTS: ScheduledBroadcastEvent[] = [
  {
    id: 'broadcast_event_tech_01',
    title: 'Sovereign WebRTC Protocol Keynote & AMA Session',
    description:
      'Deep dive into decentralized WebRTC live broadcasting, latency reduction & FIC token tipping mechanics.',
    category: 'Tech & Protocol',
    scheduledStartTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 60,
    hostName: 'Mr. Mbah Israel Obinna',
    hostHandle: '@israelobinna',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    joinLink: `${window.location.origin}/forum?joinLive=broadcast_event_tech_01`,
    guestAccessMode: 'INTERACTIVE_COHOST',
    coHosts: ['@eunicembah', '@superadmin'],
    tierKey: 'MASTER_200000',
    capacityLimit: 200000,
    currentAttendees: 1420,
    monetizationEnabled: true,
    allowedProductsScope: 'UNRESTRICTED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'broadcast_event_music_02',
    title: 'BeatwaveNG Live Studio Jam & Producer Showcase',
    description:
      'Exclusive acoustic studio sessions with Lagos top sovereign afrobeat producers and vocalists.',
    category: 'Music & Beatwave',
    scheduledStartTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 90,
    hostName: 'Amara Kalu',
    hostHandle: '@amarakalu',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200',
    joinLink: `${window.location.origin}/forum?joinLive=broadcast_event_music_02`,
    guestAccessMode: 'OPEN_VIEWER',
    coHosts: ['@beatwave_ng'],
    tierKey: 'PRO_2000',
    capacityLimit: 2000,
    currentAttendees: 310,
    monetizationEnabled: true,
    allowedProductsScope: 'LIMITED',
    createdAt: new Date().toISOString()
  }
];

class LiveBroadcastService {
  private static instance: LiveBroadcastService;

  private constructor() {}

  public static getInstance(): LiveBroadcastService {
    if (!LiveBroadcastService.instance) {
      LiveBroadcastService.instance = new LiveBroadcastService();
    }
    return LiveBroadcastService.instance;
  }

  /**
   * Get active user's Studio Broadcast Tier
   */
  public getActiveStudioTier(): BroadcastTierKey {
    try {
      const stored = localStorage.getItem(ACTIVE_TIER_KEY) as BroadcastTierKey;
      if (stored && CANONICAL_TIERS[stored]) {
        return stored;
      }
    } catch {
      /* ignore */
    }
    return 'FREE';
  }

  /**
   * Set user's active Studio Broadcast Tier
   */
  public setActiveStudioTier(tier: BroadcastTierKey): void {
    try {
      localStorage.setItem(ACTIVE_TIER_KEY, tier);
    } catch {
      /* ignore */
    }
  }

  /**
   * Get all tier models
   */
  public getTiers(): BroadcastTier[] {
    return Object.values(CANONICAL_TIERS);
  }

  /**
   * Generate an instant "Join Me Live" link
   */
  public generateJoinLiveLink(
    streamId?: string,
    guestMode: 'OPEN_VIEWER' | 'INTERACTIVE_COHOST' | 'VIP_BACKSTAGE' = 'INTERACTIVE_COHOST'
  ): string {
    const id = streamId || `live_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const origin = window.location.origin || 'http://localhost:3000';
    return `${origin}/forum?joinLive=${encodeURIComponent(id)}&mode=${guestMode}`;
  }

  /**
   * Generate a formatted invitation card text
   */
  public generateInviteMessage(event: {
    title: string;
    joinLink: string;
    scheduledStartTime?: string;
    hostName?: string;
    category?: string;
    capacityLimit?: number;
    tierKey?: BroadcastTierKey;
  }): string {
    const timeText = event.scheduledStartTime
      ? `\n🗓️ Date & Time: ${new Date(event.scheduledStartTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}`
      : '\n🔴 Live Status: BROADCASTING NOW';

    const capText = event.capacityLimit
      ? `\n👥 Stage Capacity: ${event.capacityLimit.toLocaleString()} Participants`
      : '';

    return `🎙️ JOIN ME LIVE on FingerMobile Protocol!
📢 Session: "${event.title}"${timeText}
🏷️ Category: ${event.category || 'General'}${capText}
🔗 Join Live Link: ${event.joinLink}

✨ Sovereign WebRTC HD Audio/Video • Interactive Stage Access`;
  }

  /**
   * Get all scheduled broadcasts
   */
  public getScheduledEvents(): ScheduledBroadcastEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SCHEDULED_EVENTS;
  }

  /**
   * Save a newly scheduled live broadcast linked to Platform Events & Platform Gems
   */
  public async scheduleBroadcast(
    eventData: Omit<
      ScheduledBroadcastEvent,
      'id' | 'createdAt' | 'joinLink' | 'currentAttendees' | 'capacityLimit' | 'monetizationEnabled' | 'allowedProductsScope'
    > & {
      id?: string;
      capacityLimit?: number;
      monetizationEnabled?: boolean;
      allowedProductsScope?: 'NONE' | 'LIMITED' | 'UNRESTRICTED';
    }
  ): Promise<ScheduledBroadcastEvent> {
    const id = eventData.id || `event_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const tierConfig = CANONICAL_TIERS[eventData.tierKey] || CANONICAL_TIERS.FREE;
    const joinLink = this.generateJoinLiveLink(id, eventData.guestAccessMode);

    const newEvent: ScheduledBroadcastEvent = {
      ...eventData,
      id,
      joinLink,
      capacityLimit: tierConfig.capacityLimit,
      currentAttendees: 0,
      monetizationEnabled: tierConfig.monetizationEnabled,
      allowedProductsScope: tierConfig.allowedProductsScope,
      createdAt: new Date().toISOString()
    };

    // Save locally
    const current = this.getScheduledEvents();
    const updated = [newEvent, ...current.filter((e) => e.id !== id)];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }

    // Synchronize with backend API (creates record in platform_events & live_streams)
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('fingermobile_token');
      await fetch('/api/live-stream/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          streamId: newEvent.id,
          title: newEvent.title,
          description: newEvent.description,
          category: newEvent.category,
          scheduledStartTime: newEvent.scheduledStartTime,
          durationMinutes: newEvent.durationMinutes,
          tierKey: newEvent.tierKey,
          guestAccessMode: newEvent.guestAccessMode,
          coHosts: newEvent.coHosts
        })
      });
    } catch {
      // offline fallback
    }

    return newEvent;
  }

  /**
   * Request to Join Live Broadcast (Capacity Limits: 50 on Free, 2000 on Pro, 200000 on Master)
   */
  public async requestJoinLive(
    streamId: string,
    participant: { userId: string; username: string; userAvatar?: string; requestedRole?: string }
  ): Promise<JoinRequestResult> {
    const currentEvents = this.getScheduledEvents();
    const event = currentEvents.find((e) => e.id === streamId);
    const tierKey = event?.tierKey || this.getActiveStudioTier();
    const tierConfig = CANONICAL_TIERS[tierKey];

    // Local Capacity Check
    const currentAttendees = event?.currentAttendees || 0;
    if (currentAttendees >= tierConfig.capacityLimit) {
      return {
        success: false,
        code: 'CAPACITY_EXCEEDED',
        message: `Join Request Limit Reached (${currentAttendees}/${tierConfig.capacityLimit} max). Host must upgrade to Pro Creator (2,000 capacity) or Sovereign Master (200,000 capacity) to accept more members.`,
        currentAttendees,
        capacityLimit: tierConfig.capacityLimit,
        upgradeRequired: true
      };
    }

    // Try backend call
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('fingermobile_token');
      const res = await fetch(`/api/live-stream/${streamId}/join-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(participant)
      });
      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          code: data.code || 'CAPACITY_EXCEEDED',
          message: data.message || 'Join limit reached for this session',
          currentAttendees: data.currentCount,
          capacityLimit: data.capacityLimit,
          upgradeRequired: true
        };
      }
    } catch {
      /* ignore */
    }

    // Increment local attendee count
    if (event) {
      event.currentAttendees += 1;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentEvents));
      } catch {
        /* ignore */
      }
    }

    return {
      success: true,
      message: `Successfully admitted to live broadcast stage under ${tierConfig.name}!`,
      currentAttendees: (event?.currentAttendees || 0),
      capacityLimit: tierConfig.capacityLimit
    };
  }

  /**
   * Execute Live Stream Item Action (Enforces Free Restrictions vs Pro vs Master)
   */
  public async executeItemAction(
    streamId: string,
    action: {
      actionType: 'GIFT' | 'COUPON' | 'GIFT_CARD' | 'PRODUCT_PURCHASE' | 'FIC_TIP';
      itemTitle: string;
      itemValueGems?: number;
      itemValueFic?: number;
      senderId?: string;
      recipientId?: string;
    }
  ): Promise<ItemActionResult> {
    const currentEvents = this.getScheduledEvents();
    const event = currentEvents.find((e) => e.id === streamId);
    const tierKey = event?.tierKey || this.getActiveStudioTier();

    // 1. FREE TIER ENFORCEMENT
    if (tierKey === 'FREE') {
      return {
        success: false,
        code: 'FREE_TIER_RESTRICTION',
        message:
          'Free Tier Restriction: Members cannot send items, receive/send or earn coupons, gift cards, and other items & products. Upgrade to Pro Creator (2,000 capacity) or Sovereign Master (200,000 capacity) to enable monetization.',
        allowedAction: false,
        upgradeRequired: true
      };
    }

    // 2. PRO CREATOR TIER ENFORCEMENT
    if (tierKey === 'PRO_2000') {
      if (action.actionType === 'PRODUCT_PURCHASE' || action.actionType === 'GIFT_CARD') {
        return {
          success: false,
          code: 'TIER_LIMITED_FEATURE',
          message:
            'Pro Creator Tier supports limited Gifts and Coupons only. Sovereign Gift Cards and full product catalogue purchases require Sovereign Master Tier (200,000 capacity).',
          allowedAction: false,
          upgradeRequired: true
        };
      }
    }

    // 3. MASTER TIER & ALLOWED PRO TIER
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('fingermobile_token');
      await fetch(`/api/live-stream/${streamId}/item-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(action)
      });
    } catch {
      /* ignore */
    }

    return {
      success: true,
      message: `Action "${action.itemTitle}" executed successfully under ${CANONICAL_TIERS[tierKey].name}`,
      allowedAction: true
    };
  }

  /**
   * Upgrade Studio Broadcast Tier (2,000 or 200,000 Capacity)
   */
  public async upgradeStudioTier(
    streamId: string | undefined,
    targetTier: BroadcastTierKey,
    paymentMethod: 'FIC' | 'GEMS' | 'SUBSCRIPTION' = 'FIC'
  ): Promise<BroadcastTier> {
    this.setActiveStudioTier(targetTier);

    if (streamId) {
      const currentEvents = this.getScheduledEvents();
      const event = currentEvents.find((e) => e.id === streamId);
      if (event) {
        event.tierKey = targetTier;
        event.capacityLimit = CANONICAL_TIERS[targetTier].capacityLimit;
        event.monetizationEnabled = CANONICAL_TIERS[targetTier].monetizationEnabled;
        event.allowedProductsScope = CANONICAL_TIERS[targetTier].allowedProductsScope;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(currentEvents));
        } catch {
          /* ignore */
        }
      }
    }

    // Sync with backend API
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('fingermobile_token');
      await fetch('/api/live-stream/upgrade-tier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          streamId,
          targetTier,
          paymentMethod
        })
      });
    } catch {
      /* ignore */
    }

    return CANONICAL_TIERS[targetTier];
  }

  /**
   * Delete or cancel a scheduled broadcast
   */
  public deleteScheduledEvent(id: string): void {
    const current = this.getScheduledEvents();
    const filtered = current.filter((e) => e.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch {
      /* ignore */
    }
  }

  /**
   * Generate Google Calendar Quick Add URL
   */
  public generateGoogleCalendarUrl(event: ScheduledBroadcastEvent): string {
    const start = new Date(event.scheduledStartTime);
    const end = new Date(start.getTime() + (event.durationMinutes || 60) * 60000);

    const formatGCalDate = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', `🔴 Join Live: ${event.title}`);
    url.searchParams.set('dates', `${formatGCalDate(start)}/${formatGCalDate(end)}`);
    url.searchParams.set(
      'details',
      `${event.description}\n\nJoin Live Broadcast Link: ${event.joinLink}\nCapacity: ${event.capacityLimit.toLocaleString()} Participants`
    );
    url.searchParams.set('location', 'FingerMobile WebRTC Studio');

    return url.toString();
  }

  /**
   * Generate downloadable .ics calendar file
   */
  public downloadIcsCalendar(event: ScheduledBroadcastEvent): void {
    const start = new Date(event.scheduledStartTime);
    const end = new Date(start.getTime() + (event.durationMinutes || 60) * 60000);

    const formatDateIcs = (d: Date) =>
      d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FingerMobile Protocol//WebRTC Live Studio//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${event.id}@fingermobileprotocol.com`,
      `DTSTAMP:${formatDateIcs(new Date())}`,
      `DTSTART:${formatDateIcs(start)}`,
      `DTEND:${formatDateIcs(end)}`,
      `SUMMARY:🔴 Join Live: ${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')} - Join: ${event.joinLink}`,
      'LOCATION:FingerMobile WebRTC Live Studio',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const liveBroadcastService = LiveBroadcastService.getInstance();
