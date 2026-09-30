// Dashboard Constants for mock data

export const MOCK_CAMPAIGNS = [
  {id: '1',
    title: 'Summer Sale 2024',
    name: 'Summer Sale 2024',
    description: 'Summer promotional campaign',
    status: 'active' as const,
    budget: 5000,
    spent: 3200,
    impressions: 125000,
    clicks: 8500,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    targetAudience: '18-35 years'
  },
  {id: '2',
    title: 'Product Launch',
    name: 'Product Launch',
    description: 'New product launch campaign',
    status: 'paused' as const,
    budget: 10000,
    spent: 4500,
    impressions: 85000,
    clicks: 5200,
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    targetAudience: 'All users'
  }
];

export const MOCK_PLATFORM_ROLES = [
  {id: '1',
    name: 'Admin',
    description: 'Full platform access',
    permissions: ['all']
  },
  {id: '2',
    name: 'Moderator',
    description: 'Content moderation access',
    permissions: ['moderate_content', 'view_reports']
  }
];

export const MOCK_MODULE_STATUSES = [
  {name: 'Authentication',
    status: 'online' as const,
    lastUpdated: new Date().toISOString(),
    responseTime: 45
  },
  {name: 'Payments',
    status: 'online' as const,
    lastUpdated: new Date().toISOString(),
    responseTime: 120
  }
];

export const MOCK_COMPLIANCE_STATUSES = [
  {policyId: '1',
    memberId: 'user1',
    accepted: true,
    acceptedAt: new Date().toISOString(),
    requiresRenewal: false
  }
];

export const CHAT_CONTACTS = [
  {id: '1',
    name: 'John Doe',
    avatar: '/avatars/john.png',
    lastSeen: new Date().toISOString(),
    unreadCount: 2,
    isOnline: true
  },
  {id: '2',
    name: 'Jane Smith',
    avatar: '/avatars/jane.png',
    lastSeen: new Date().toISOString(),
    unreadCount: 0,
    isOnline: false
  }
];

export const NIGERIAN_BANKS = [
  {id: 'zenith',
    name: 'Zenith Bank',
    code: '057' },
  {id: 'gtb',
    name: 'Guaranty Trust Bank',
    code: '058' },
  {id: 'uba',
    name: 'United Bank for Africa',
    code: '033' },
  {id: 'fidelity',
    name: 'Fidelity Bank',
    code: '070' },
  {id: 'access',
    name: 'Access Bank',
    code: '044' },
  {id: 'fcmb',
    name: 'First City Monument Bank',
    code: '214' },
  {id: 'ecobank',
    name: 'Ecobank',
    code: '050' },
  {id: 'providus',
    name: 'Providus Bank',
    code: '101' },
  {id: 'opay',
    name: 'Opay',
    code: '999' },
  {id: 'moniepoint',
    name: 'Moniepoint',
    code: '505' }
];

export const LIVE_STREAMS = [
  {id: '1',
    title: 'Live Gaming Session',
    streamerId: 'streamer1',
    viewerCount: 1250,
    thumbnailUrl: '/streams/gaming.jpg',
    isLive: true,
    category: 'Gaming'
  }
];

export const GALLERY_ITEMS_DATA = [
  {id: '1',
    title: 'Sunset Beach',
    imageUrl: '/gallery/sunset.jpg',
    description: 'Beautiful sunset at the beach',
    createdAt: new Date().toISOString()
  }
];

export const BUSINESS_OFFICES_DATA = [
  {id: '1',
    name: 'Lagos Headquarters',
    address: '123 Victoria Island',
    city: 'Lagos',
    country: 'Nigeria',
    phone: '+234 800 123 4567',
    email: 'lagos@company.com'
  }
];

export const FINGERWARS_LEADERBOARD = [
  {id: '1',
    playerId: 'player1',
    playerName: 'ProGamer',
    score: 15000,
    rank: 1
  }
];

export const PRODUCT_FILTERS = {
  categories: ['Electronics', 'Fashion', 'Home', 'Sports'],
  priceRanges: [
    {
      min: 0,
      max: 50
    },
    {
      min: 50,
      max: 100
    },
    {
      min: 100,
      max: 500
    }
  ],
  brands: ['Brand A', 'Brand B', 'Brand C']
};
