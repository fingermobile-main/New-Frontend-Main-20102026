import type { Member, ForumCategory, Topic, Hashtag, NavigationSection, Post, Notification } from './types';

// --- LOYALTY TIERS ---
export const LOYALTY_TIERS = [
  {id: 'bronze',
    name: 'Bronze',
    threshold: 0 },
  {id: 'silver',
    name: 'Silver',
    threshold: 100 },
  {id: 'gold',
    name: 'Gold',
    threshold: 500 },
  {id: 'platinum',
    name: 'Platinum',
    threshold: 1000 },
  {id: 'diamond',
    name: 'Diamond',
    threshold: 5000 }
];

// --- EVENTS ---
export const EVENTS = [
  {id: '1',
    title: 'Tech Conference 2023',
    description: 'Annual technology conference featuring industry leaders',
    imageUrl: '/path/to/event-image.jpg',
    date: '2023-10-15',
    startTime: '09:00',
    endTime: '18:00',
    location: 'Virtual',
    ticketPrice: 50,
    organizerId: 'organizer1',
    maxAttendees: 500,
    availableSeats: 350,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {id: '2',
    title: 'Blockchain Workshop',
    description: 'Hands-on workshop on blockchain development',
    imageUrl: '/path/to/workshop-image.jpg',
    date: '2023-11-20',
    startTime: '10:00',
    endTime: '16:00',
    location: 'Online',
    ticketPrice: 75,
    organizerId: 'organizer2',
    maxAttendees: 100,
    availableSeats: 45,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// --- MEMBERS ---
export const MOCK_MEMBERS: Member[] = [
  {id: '1',
    email: 'info@fingermobileprotocol.com',
    name: 'Mbah Obinna',
    membername: 'mbah',
    handle: 'mbah',
    role: 'admin',
    phoneVerified: true,
    twoFactorEnabled: true,
    multiFactorEnabled: true,
    biometricEnrolled: true,
    joinDate: '2023-01-01',
    posts: 0,
    followerCount: 0,
    following: [],
    isSubscribed: true,
    isVerified: true,
    permissions: ['read', 'write', 'admin'],
    // Removed loyaltyTier as it doesn't exist in the Member interface
    currentPlan: 'Creator Pro',
    username: 'adminuser' // Added required property
  },
  {id: '2',
    email: 'jane@example.com',
    name: 'Jane Doe',
    membername: 'janedoe',
    handle: 'janedoe',
    username: 'janedoe', // Added required property
    role: 'user',
    phoneVerified: true,
    twoFactorEnabled: false,
    multiFactorEnabled: false,
    biometricEnrolled: false,
    joinDate: '2023-01-01',
    posts: 0,
    followerCount: 0,
    following: [],
    isSubscribed: true,
    isVerified: false,
    permissions: ['read', 'write', 'viewer'],
    currentPlan: 'Basic'
  },
  {id: '3',
    email: 'john@example.com',
    name: 'John Smith',
    membername: 'johnsmith',
    handle: 'johnsmith',
    username: 'johnsmith', // Added required property
    role: 'user',
    phoneVerified: true,
    twoFactorEnabled: false,
    multiFactorEnabled: false,
    biometricEnrolled: false,
    joinDate: '2023-01-01',
    posts: 0,
    followerCount: 0,
    following: [],
    isSubscribed: true,
    isVerified: false,
    permissions: ['read', 'comment'],
    currentPlan: 'Free'
    // Removed verificationTier as it doesn't exist in the Member interface
  }
];

// --- FORUM CATEGORIES ---
export const MOCK_FORUM_CATEGORIES: ForumCategory[] = [
  {id: 'cat-1',
    name: 'General Discussion',
    description: 'Talk about anything and everything',
    slug: 'general-discussion',
    postCount: 1250,
    rank: 1,
    headerType: 'IMAGE',
    headerImage: '/images/general-discussion-header.jpg',
    headerTitle: 'General Discussion',
    headerTextColor: {
      color: '#ffffff',
      opacity: 1 },
    headerBackgroundColor: {color: '#000000',
      opacity: 0.7 },
    headerImageOverlayColor: {color: '#0000ff',
      opacity: 0.3 },
    pageUrl: '/forums/general-discussion',
    parentId: '',
    postViewCount: 12500,
    priority: 1
  },
  {id: 'cat-2',
    name: 'Tech Support',
    description: 'Get help with technical issues',
    slug: 'tech-support',
    postCount: 850,
    rank: 2,
    headerType: 'COLOR',
    headerImage: '/images/tech-support-header.jpg',
    headerTitle: 'Tech Support',
    headerTextColor: {
      color: '#ffffff',
      opacity: 1 },
    headerBackgroundColor: {color: '#000000',
      opacity: 0.7 },
    headerImageOverlayColor: {color: '#0000ff',
      opacity: 0.3 },
    pageUrl: '/forums/tech-support',
    parentId: '',
    postViewCount: 8500,
    priority: 2
  },
  {id: 'cat-3',
    name: 'Feature Requests',
    description: 'Suggest new features and improvements',
    slug: 'feature-requests',
    postCount: 420,
    rank: 3,
    headerType: 'IMAGE',
    headerImage: '/images/feature-requests-header.jpg',
    headerTitle: 'Feature Requests',
    headerTextColor: {
      color: '#ffffff',
      opacity: 1 },
    headerBackgroundColor: {color: '#000000',
      opacity: 0.7 },
    headerImageOverlayColor: {color: '#0000ff',
      opacity: 0.3 },
    pageUrl: '/forums/feature-requests',
    parentId: '',
    postViewCount: 4200,
    priority: 3
  }
];

// --- TRENDS ---
export const MOCK_TRENDS = [
  {id: 'trend-1',
    title: 'New Music Release',
    description: 'Latest trending song',
    category: 'music',
    postsCount: 1250, // Changed from postCount to postsCount,
    isTrending: true, // Added required isTrending property,
    priority: 1       // Added priority property
  },
  {id: 'trend-2',
    title: 'Tech Innovation',
    description: 'Latest tech trends',
    category: 'technology',
    postsCount: 980, // Changed from postCount to postsCount,
    isTrending: true, // Added required isTrending property,
    priority: 2       // Added priority property
  },
  {id: 'trend-3',
    title: 'Sports Highlights',
    description: 'Top sports moments',
    category: 'sports',
    postsCount: 750, // Changed from postCount to postsCount,
    isTrending: false, // Added required isTrending property,
    priority: 3       // Added priority property
  }
];

// --- SUGGESTED MEMBERS ---
export const MOCK_SUGGESTED_MEMBERS = [
  {id: 'member-1',
    name: 'Jane Cooper',
    username: '@janec',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    reason: 'Popular creator'
  },
  {id: 'member-2',
    name: 'John Doe',
    username: '@johnd',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    reason: 'Similar interests'
  },
  {id: 'member-3',
    name: 'Emily Smith',
    username: '@emilys',
    avatar: 'https://randomuser.me/api/portraits/women/46.jpg',
    reason: 'Friend connection'
  }
];

// --- TOPICS ---
export const MOCK_TOPICS: Topic[] = [
  {id: 'topic-1',
    name: 'Welcome to our community',  // Changed from title to name,
    description: 'General discussion about our community',
    isTrending: true,
    coverImageUrl: '/images/welcome-cover.jpg',
    postsCount: 150,
    followers: 120,
    isFollowing: true,
    icon: 'home'
  },
  {id: 'topic-2',
    name: 'Feature suggestions',      // Changed from title to name,
    description: 'Ideas for improving our platform',
    isTrending: false,
    coverImageUrl: '/images/features-cover.jpg',
    postsCount: 89,
    followers: 75,
    isFollowing: false,
    icon: 'lightbulb'
  }
];

// --- HASHTAGS ---
export const MOCK_HASHTAGS: Hashtag[] = [
  {id: 'hashtag-1',
    name: 'technology',                // Changed from tag to name,
    isTrending: true,
    category: 'tech',
    frequency: 250
  },
  {id: 'hashtag-2',
    name: 'music',                     // Changed from tag to name,
    isTrending: true,
    category: 'entertainment',
    frequency: 180
  },
  {id: 'hashtag-3',
    name: 'gaming',                    // Changed from tag to name,
    isTrending: false,
    category: 'entertainment',
    frequency: 120
  }
];

// --- NAVIGATION SECTIONS ---
export const MOCK_NAVIGATION_SECTIONS: NavigationSection[] = [
  {id: 'nav-section-1',
    title: 'Main Menu',
    icon: 'menu',
    route: '/',
    links: [
      {
        name: 'Home',
        path: '/',
        icon: 'home' },
      {name: 'About',
        path: '/about',
        icon: 'info' },
      {name: 'Settings',
        path: '/settings',
        icon: 'cog' }
    ],
    badge: 3                             // Added optional badge property
  }
];


// --- ADVERTISEMENTS ---
export const MOCK_ADVERTISEMENTS = [
  {id: 'adv-1',
    title: 'Summer Sale',
    content: 'Up to 50% off on summer collection',
    imageUrl: '/images/summer-sale.jpg',
    targetUrl: '/summer-sale',
    priority: 1,
    startDate: '2023-06-01',
    endDate: '2023-08-31',
    isActive: true
  }
];

// --- PROGRAMS ---
export const MOCK_PROGRAMS = [
  {id: 'prog-1',
    title: 'Digital Marketing Course',
    description: 'Learn digital marketing from industry experts',
    thumbnailUrl: '/images/digital-marketing-course.jpg',
    category: 'education',
    isLive: false,
    viewCount: 1200,
    duration: '8 weeks'
  }
];

// --- CONSTANTS ---
export const APP_CONSTANTS = {MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB,
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/gif'],
  SUPPORTED_VIDEO_FORMATS: ['video/mp4', 'video/webm', 'video/ogg'],
  DEFAULT_PAGE_SIZE: 20,
  MAX_NOTIFICATIONS: 50
};

// Added the missing MOCK_CATEGORIES alias for MOCK_FORUM_CATEGORIES to prevent errors
export const MOCK_CATEGORIES: ForumCategory[] = MOCK_FORUM_CATEGORIES;

// Re-export dashboard constants (campaigns, courses, live streams, etc.)
export * from './constants/dashboardConstants';

// Constants for the application
export const DEFAULT_POSTS: Post[] = [
  {id: 'post-1',
    author: {
      id: 'author-1',
      name: 'John Doe',
      avatar: '' },
    content: 'Just started a new project! Excited to see where it goes.',
    timestamp: '2023-06-01T12:30:00Z',
    likes: 25,
    shares: 5,
    comments: 10,
    mediaUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80',
    mediaAlt: 'Person working on a laptop',
    location: 'Home Office',
    tags: ['project', 'coding', 'excitement'],
    type: 'image',
    createdAt: new Date('2023-06-01T12:30:00Z').toISOString(),
    // ... other properties as needed ...
  },
  {id: 'post-2',
    author: {
      id: 'author-2',
      name: 'Jane Smith',
      avatar: '' },
    content: 'Just finished a marathon! Can\'t wait to do it again.',
    timestamp: '2023-06-03T14:45:00Z',
    likes: 42,
    shares: 7,
    comments: 12,
    mediaUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80',
    mediaAlt: 'Person running on a track',
    location: 'City Park',
    tags: ['marathon', 'fitness', 'achievement'],
    type: 'image',
    createdAt: new Date('2023-06-03T14:45:00Z').toISOString(),
    // ... other properties as needed ...
  },
  {id: 'post-3',
    author: {
      id: 'author-3',
      name: 'Emily Johnson',
      avatar: '' },
    content: 'Just got a new job! Starting next week.',
    timestamp: '2023-06-05T10:30:00Z',
    likes: 89,
    shares: 35,
    comments: 26,
    location: 'Tech Office',
    tags: ['career', 'job', 'excitement'],
    type: 'text',
    createdAt: new Date('2023-06-05T10:30:00Z').toISOString(),
    // ... other properties as needed ...
  },
  {id: 'post-4',
    author: {
      id: 'author-4',
      name: 'Michael Brown',
      avatar: '' },
    content: 'Just bought a new car! Can\'t wait to drive it.',
    timestamp: '2023-06-07T08:15:00Z',
    likes: 76,
    shares: 19,
    comments: 14,
    mediaUrl: 'https://images.unsplash.com/photo-1519422052565-7772bc734d40?w=800&q=80',
    mediaAlt: 'New car parked in a driveway',
    location: 'Home',
    tags: ['car', 'purchase', 'excitement'],
    type: 'image',
    createdAt: new Date('2023-06-07T08:15:00Z').toISOString(),
    // ... other properties as needed ...
  },
  {id: 'post-5',
    author: {
      id: 'author-5',
      name: 'Sarah Lee',
      avatar: '' },
    content: 'Just finished a book! Can\'t wait to read the next one.',
    timestamp: '2023-06-09T14:45:00Z',
    likes: 42,
    shares: 7,
    comments: 12,
    mediaUrl: 'https://images.unsplash.com/photo-1519422052565-7772bc734d40?w=800&q=80',
    mediaAlt: 'Person reading a book',
    location: 'Coffee Shop',
    tags: ['books', 'reading', 'education'],
    type: 'image',
    createdAt: new Date('2023-06-09T14:45:00Z').toISOString(),
    // ... other properties as needed ...
  },
  {id: 'post-6',
    author: {
      id: 'author-6',
      name: 'David Kim',
      avatar: '' },
    content: 'Just started a new hobby! Can\'t wait to see where it goes.',
    timestamp: '2023-06-11T10:30:00Z',
    likes: 89,
    shares: 35,
    comments: 26,
    location: 'Home',
    tags: ['hobby', 'excitement'],
    type: 'text',
    createdAt: new Date('2023-06-11T10:30:00Z').toISOString(),
    // ... other properties as needed ...
  },
  {id: 'post-7',
    author: {
      id: 'author-7',
      name: 'Sam Rivera',
      avatar: '' },
    content: 'Just finished my latest painting! Can\'t wait to share it with the world.',
    timestamp: '2023-06-10T14:45:00Z',
    likes: 42,
    shares: 7,
    comments: 12,
    mediaUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    mediaAlt: 'Abstract painting with vibrant colors',
    location: 'Art Studio',
    tags: ['art', 'painting', 'creativity'],
    type: 'image',
    createdAt: new Date('2023-06-10T14:45:00Z').toISOString(),
    // ... other properties as needed ...
  },
  {id: 'post-8',
    author: {
      id: 'author-8',
      name: 'Alex Johnson',
      avatar: '' },
    content: 'Beautiful sunset from my evening hike today.',
    timestamp: '2023-06-12T19:30:00Z',
    likes: 128,
    shares: 24,
    comments: 18,
    mediaUrl: 'https://images.unsplash.com/photo-1506260408121-e3dc3b7f0a0d?w=800&q=80',
    mediaAlt: 'Mountain sunset with silhouettes of trees',
    location: 'Mountainside Trail',
    tags: ['nature', 'hiking', 'sunset'],
    type: 'image',
    createdAt: new Date('2023-06-12T19:30:00Z').toISOString(),
    // ... other properties as needed ...
  },
  {id: 'post-9',
    author: {
      id: 'author-9',
      name: 'Taylor Kim',
      avatar: '' },
    content: 'Excited to announce the launch of our new mobile app! Available now on both iOS and Android.',
    timestamp: '2023-06-15T10:30:00Z',
    likes: 89,
    shares: 35,
    comments: 26,
    location: 'Tech Office',
    tags: ['technology', 'mobile', 'apps', 'launch'],
    type: 'text',
    createdAt: new Date('2023-06-15T10:30:00Z').toISOString(),
    // ... other properties as needed ...
  },
  {id: 'post-10',
    author: {
      id: 'author-10',
      name: 'Jordan Williams',
      avatar: '' },
    content: 'My morning routine that keeps me productive throughout the day.',
    timestamp: '2023-06-18T08:15:00Z',
    likes: 76,
    shares: 19,
    comments: 14,
    mediaUrl: 'https://images.unsplash.com/photo-1554692918-e3dc3b7f0a0d?w=800&q=80',
    mediaAlt: 'Coffee and planner on a table',
    location: 'Home',
    tags: ['productivity', 'morning', 'routine', 'wellness'],
    type: 'image',
    createdAt: new Date('2023-06-18T08:15:00Z').toISOString(),
    // ... other properties as needed ...
  }
];

// Add the missing MOCK_POSTS export
export const MOCK_POSTS: Post[] = DEFAULT_POSTS;

// Define UserRole enum if not already defined elsewhere
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

// Use the correct role constant;
export const DEFAULT_USER_ROLE: UserRole = UserRole.USER;

// --- CHAT CONTACTS ---
export const CHAT_CONTACTS = [
  {id: 'contact-1',
    name: 'Alice Johnson',
    avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
    animatedAvatarUrl: 'https://randomuser.me/api/portraits/women/1.gif',
    lastSeen: '2 minutes ago',
    unreadCount: 3,
    isOnline: true,
    lastMessage: 'Hey! How are you doing?'
  },
  {id: 'contact-2',
    name: 'Bob Smith',
    avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    animatedAvatarUrl: 'https://randomuser.me/api/portraits/men/2.gif',
    lastSeen: '1 hour ago',
    unreadCount: 0,
    isOnline: false,
    lastMessage: 'Thanks for your help!'
  },
  {id: 'contact-3',
    name: 'Carol Williams',
    avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg',
    animatedAvatarUrl: 'https://randomuser.me/api/portraits/women/3.gif',
    lastSeen: '5 minutes ago',
    unreadCount: 1,
    isOnline: true,
    lastMessage: 'See you tomorrow!'
  },
  {id: 'contact-4',
    name: 'David Brown',
    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    animatedAvatarUrl: 'https://randomuser.me/api/portraits/men/4.gif',
    lastSeen: '1 day ago',
    unreadCount: 0,
    isOnline: false,
    lastMessage: 'Great work on the project!'
  },
  {id: 'contact-5',
    name: 'Emma Davis',
    avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg',
    animatedAvatarUrl: 'https://randomuser.me/api/portraits/women/5.gif',
    lastSeen: 'Just now',
    unreadCount: 5,
    isOnline: true,
    lastMessage: 'Can we schedule a meeting?'
  }
];

// --- NOTIFICATIONS ---
export const NOTIFICATIONS: Notification[] = [
  {
    id: '1', // Now id is part of the Notification interface
    type: 'comment',
    read: false,
    member: 'John Doe',
    memberAvatar: 'https://placehold.co/40x40',
    action: 'commented on your post',
    timestamp: '2 hours ago',
    content: 'This is a great post!'
  },
  {
    id: '2', // Now id is part of the Notification interface
    type: 'like',
    read: true,
    member: 'Jane Smith',
    memberAvatar: 'https://placehold.co/40x40',
    action: 'liked your post',
    timestamp: '4 hours ago',
    content: ''
  },
  {
    id: '3', // Now id is part of the Notification interface
    type: 'follow',
    read: false,
    member: 'Bob Johnson',
    memberAvatar: 'https://placehold.co/40x40',
    action: 'started following you',
    timestamp: '1 day ago',
    content: ''
  },
  {
    id: '4', // Now id is part of the Notification interface
    type: 'mention',
    read: true,
    member: 'Alice Williams',
    memberAvatar: 'https://placehold.co/40x40',
    action: 'mentioned you in a comment',
    timestamp: '2 days ago',
    content: ''
  },
  {
    id: '5', // Now id is part of the Notification interface
    type: 'message',
    read: false,
    member: 'Charlie Brown',
    memberAvatar: 'https://placehold.co/40x40',
    action: 'sent you a message',
    timestamp: '3 days ago',
    content: 'Hello there!'
  },
  {
    id: '6', // Now id is part of the Notification interface
    type: 'subscription',
    read: false,
    member: 'Diana Prince',
    memberAvatar: 'https://placehold.co/40x40',
    action: 'subscribed to your premium content',
    timestamp: '1 week ago',
    content: ''
  }
];
