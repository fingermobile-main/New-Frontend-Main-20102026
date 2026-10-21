import { AutoReplySettings, BroadcastChannel, BroadcastPost } from './types';

export const BROADCAST_CHANNELS: BroadcastChannel[] = [
  {
    id: 'general-living-room',
    name: '#general-living-room',
    badge: 'Digital Living Room',
    description: 'P2P community lounge for general platform announcements & chatter',
    iconColor: 'text-purple-400'
  },
  {
    id: 'creators-salon',
    name: '#creators-salon',
    badge: 'Creator Drops',
    description: 'Exclusive 24h drop alerts, art showcases, and creative broadcasts',
    iconColor: 'text-pink-400'
  },
  {
    id: 'event-promotions',
    name: '#event-promotions',
    badge: 'Events & Venues',
    description: 'Conferences, live sets, workshops, and agency event highlights',
    iconColor: 'text-emerald-400'
  },
  {
    id: 'sovereign-trading',
    name: '#sovereign-trading',
    badge: 'Gem Exchange',
    description: 'P2P Gem minting, badge trading, and micro-currency opportunities',
    iconColor: 'text-amber-400'
  },
  {
    id: 'vip-lounge',
    name: '#vip-lounge',
    badge: 'Passholders Only',
    description: 'Gated broadcasts for sovereign badge and pass holders',
    iconColor: 'text-indigo-400'
  },
  {
    id: 'direct-walls',
    name: '@direct-member-walls',
    badge: 'Direct Walls',
    description: 'Pushed directly to active follower profiles & living room walls',
    iconColor: 'text-sky-400'
  }
];

export const DEFAULT_AUTO_REPLY_SETTINGS: AutoReplySettings = {
  greeting: {
    enabled: true,
    inactivityDays: 14,
    selectedPreset: 'standard',
    standardText:
      'Hello! Thanks for reaching out to [Business Name]. We have received your message and a team member will reply shortly. In the meantime, you can check our catalog here: [Link].',
    bookingText:
      'Hi there! Welcome to [Business Name]. Let us know how we can help you today. Need a booking? Tap here: [Booking Link].',
    customText: ''
  },
  away: {
    enabled: true,
    workingHours: '9:00 AM to 6:00 PM',
    daysActive: 'Monday–Saturday',
    selectedPreset: 'after_hours',
    afterHoursText:
      'Thanks for messaging [Business Name]. Our working hours are [X am] to [X pm], [Monday–Saturday]. We will reply as soon as we open. For urgent inquiries, email [Email Address].',
    holidayText:
      'Hello! We are currently away from [Start Date] to [End Date] for the holidays. We will respond to your message right after we return. Thank you for your patience!',
    customText: '',
    emergencyEmail: 'priority-dispatch@fingermobileprotocol.com',
    holidayStartDate: 'Dec 24, 2026',
    holidayEndDate: 'Jan 02, 2027'
  },
  quickReplies: [
    {
      id: 'qr-1',
      shortcut: '/pricing',
      title: 'Pricing / Menu Inquiry',
      content:
        'Thanks for asking about our rates! You can view our full price list and services right here: https://fingermobileprotocol.com/pricing',
      category: 'pricing',
      mediaUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      mediaType: 'image',
      usageCount: 142
    },
    {
      id: 'qr-2',
      shortcut: '/hours',
      title: 'Location & Operating Hours',
      content:
        'Hello! We are located at Victoria Island Innovation District, Lagos. Our doors are open Mon–Sat from 9:00 AM to 7:00 PM. See you soon!',
      category: 'hours',
      usageCount: 89
    },
    {
      id: 'qr-3',
      shortcut: '/portfolio',
      title: 'Portfolio & Case Studies Showcase',
      content:
        'Explore our verified event portfolio, video recaps, and live case studies here: https://fingermobileprotocol.com/portfolio',
      category: 'portfolio',
      mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
      mediaType: 'image',
      usageCount: 76
    },
    {
      id: 'qr-4',
      shortcut: '/booking',
      title: 'Instant Calendar Booking',
      content:
        'Schedule a 1-on-1 strategy session or venue consultation directly on our calendar: https://calendly.com/fingermobile-events',
      category: 'booking',
      usageCount: 110
    },
    {
      id: 'qr-5',
      shortcut: '/urgent',
      title: 'Urgent Event Day Hotline',
      content:
        'Need urgent event-day coordination? Call our on-site event dispatcher directly at +234 (0) 800-FINGER-HOTLINE.',
      category: 'support',
      usageCount: 34
    },
    {
      id: 'qr-6',
      shortcut: '/5d-emoji',
      title: 'FingerMobile 5D Glass Emoji Reaction',
      content:
        'Official FingerMobile 5D Dimensional Emoji asset! Crafted with glossy glass and polished metallic textures.',
      category: 'support',
      mediaUrl: '/assets/emojis/fingermobile_5d_emoji.jpg',
      mediaType: 'image',
      usageCount: 58
    },
    {
      id: 'qr-7',
      shortcut: '/ceramic-emoji',
      title: 'Ceramic Candy-Coated 3D Emoji',
      content:
        'Official Ceramic Surprised 3D Emoji! Shiny polished white ceramic with glossy candy finish.',
      category: 'support',
      mediaUrl: '/assets/emojis/ceramic_surprised_emoji.jpg',
      mediaType: 'image',
      usageCount: 47
    }
  ],
  eventManagement: {
    enabled: true,
    agencyName: 'FingerMobile Sovereign Events & Experiences',
    emergencyPhone: '+234 802 888 4321',
    portfolioUrl: 'https://fingermobileprotocol.com/events/showcase',
    faqPricingUrl: 'https://fingermobileprotocol.com/events/pricing-faq',
    bookingCalendarUrl: 'https://calendly.com/fingermobile-events/reserve',
    emergencyContactName: 'Kemi Adeleke (Head of Production)',
    generalInquirySubject:
      'Thanks for reaching out to [Event Agency Name]! We got your message.',
    generalInquiryText:
      'Hi [First Name],\n\nThank you for contacting us about your upcoming event! We have received your inquiry and our team is reviewing your details.\n\nYou can expect a personal response from us within 24 hours / 1 business day. In the meantime, feel free to check out our Portfolio/Services ([Link to Portfolio/Services]) or view our FAQ & Pricing Guide ([Link to FAQ / Pricing Guide]).\n\nBest regards,\nThe [Event Agency Name] Team',
    afterHoursBusyText:
      'Thanks for messaging [Event Agency Name]! We are currently on-site or offline. We’ve logged your request and will reply by 9:00 AM tomorrow. Need urgent event help? Call us directly at [Phone Number].',
    onSiteEventDayText:
      'Hello! Our team is currently executing an event today and has limited access to messages. We will catch up on all inquiries first thing on Monday. For urgent event-day support, please call [Name] at [Phone Number].'
  }
};

export const SAMPLE_BROADCAST_POSTS: BroadcastPost[] = [
  {
    id: 101,
    creator_id: 1,
    username: 'sovereign_curator',
    first_name: 'Amara',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    channel_id: 'creators-salon',
    channel_name: '#creators-salon',
    privacy_type: 'public',
    banner_style: 'neon-sapphire',
    gem_cost: 25,
    content_text:
      'Genesis Drop live! Mint your verified Sovereign Living Room badge now. Limited 100 editions minted on-chain. Holders receive instant access to private salon sessions and VIP broadcasts.',
    media_urls: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'],
    media_type: 'image',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    reactions: { 'thumbs-up': 38, 'star-eyes': 54, 'crown-royalty': 22, 'headphones-music': 19 },
    isCurrentUserSender: true,
    analytics: {
      broadcastId: 101,
      totalImpressions: 1840,
      openRate: 82.5,
      directReplyRate: 21.4,
      autoRepliesTriggered: 64,
      autoRepliesBreakdown: {
        greeting: 28,
        away: 14,
        quickReplies: 16,
        eventManagement: 6
      },
      ignoredCount: 9,
      topChannels: [
        { channel: '#creators-salon', reach: 890 },
        { channel: '#general-living-room', reach: 560 },
        { channel: '@direct-member-walls', reach: 390 }
      ],
      hourlyEngagement: [
        { hour: '0h', views: 320 },
        { hour: '4h', views: 580 },
        { hour: '8h', views: 420 },
        { hour: '12h', views: 290 },
        { hour: '16h', views: 150 },
        { hour: '20h', views: 80 }
      ],
      sentimentSummary: {
        positive: 78,
        neutral: 18,
        inquiry: 4
      }
    }
  },
  {
    id: 102,
    creator_id: 2,
    username: 'lagos_events_agency',
    first_name: 'Tunde',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    channel_id: 'event-promotions',
    channel_name: '#event-promotions',
    privacy_type: 'public',
    banner_style: 'emerald-sovereign',
    gem_cost: 25,
    content_text:
      'Eko Tech Summit 2026 registration is officially open! 300+ founders and digital pioneers gathering at Landmark Centre. Book your VIP pass with Gems for priority front-row seating.',
    media_urls: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'],
    media_type: 'image',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 19 * 60 * 60 * 1000).toISOString(),
    reactions: { 'thumbs-up': 62, 'cool-sunglasses': 41, 'blowing-love': 35, 'star-eyes': 28 },
    isCurrentUserSender: false,
    analytics: {
      broadcastId: 102,
      totalImpressions: 2420,
      openRate: 88.1,
      directReplyRate: 26.5,
      autoRepliesTriggered: 89,
      autoRepliesBreakdown: {
        greeting: 35,
        away: 20,
        quickReplies: 22,
        eventManagement: 12
      },
      ignoredCount: 14,
      topChannels: [
        { channel: '#event-promotions', reach: 1420 },
        { channel: '#general-living-room', reach: 680 },
        { channel: '@direct-member-walls', reach: 320 }
      ],
      hourlyEngagement: [
        { hour: '0h', views: 450 },
        { hour: '4h', views: 780 },
        { hour: '8h', views: 560 },
        { hour: '12h', views: 380 },
        { hour: '16h', views: 180 },
        { hour: '20h', views: 70 }
      ],
      sentimentSummary: {
        positive: 84,
        neutral: 12,
        inquiry: 4
      }
    }
  },
  {
    id: 103,
    creator_id: 3,
    username: 'digital_salon_master',
    first_name: 'Zainab',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    channel_id: 'general-living-room',
    channel_name: '#general-living-room',
    privacy_type: 'public',
    banner_style: 'sunset-amber',
    gem_cost: 25,
    content_text:
      'Tonight at 8 PM: Sovereign Living Room acoustic listening session! Audio room link broadcasted to all followers. Send Gem tips directly to musicians during the set.',
    media_urls: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80'],
    media_type: 'image',
    created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 17 * 60 * 60 * 1000).toISOString(),
    reactions: { 'blowing-love': 89, 'crown-royalty': 53, 'star-eyes': 44, 'headphones-music': 31 },
    isCurrentUserSender: false,
    analytics: {
      broadcastId: 103,
      totalImpressions: 3120,
      openRate: 91.2,
      directReplyRate: 32.0,
      autoRepliesTriggered: 112,
      autoRepliesBreakdown: {
        greeting: 44,
        away: 25,
        quickReplies: 31,
        eventManagement: 12
      },
      ignoredCount: 16,
      topChannels: [
        { channel: '#general-living-room', reach: 1890 },
        { channel: '#creators-salon', reach: 780 },
        { channel: '@direct-member-walls', reach: 450 }
      ],
      hourlyEngagement: [
        { hour: '0h', views: 610 },
        { hour: '4h', views: 920 },
        { hour: '8h', views: 780 },
        { hour: '12h', views: 480 },
        { hour: '16h', views: 240 },
        { hour: '20h', views: 90 }
      ],
      sentimentSummary: {
        positive: 89,
        neutral: 9,
        inquiry: 2
      }
    }
  }
];
