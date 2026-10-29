/**
 * Swarm Trends & Intelligence Constants - FingerMobile Protocol™
 * Synchronized with PostgreSQL `trends` and `trending_cache` tables.
 */

export interface TrendItemDefinition {
  id: string;
  topic: string;
  title: string;
  description: string;
  category: string;
  trendType: 'hashtag' | 'topic' | 'event' | 'sound' | 'article' | 'token';
  isTrending: boolean;
  isViral: boolean;
  popularityScore: number;
  reachCount: number;
  postCount: number;
  viewCount: number;
  status: 'active' | 'archived' | 'moderated';
}

export const TREND_CATEGORIES = [
  'All Categories',
  'Tech & Sovereign Computing',
  'Ecosystem & DeFi',
  'Global Commerce & Trade',
  'Music & Entertainment',
  'Culture & Creative',
  'Sports & Gaming',
  'Governance & Charter'
] as const;

export const TREND_TIMEFRAMES = [
  { id: '1h', label: 'Past 1 Hour', hours: 1 },
  { id: '24h', label: 'Past 24 Hours', hours: 24 },
  { id: '7d', label: 'Past 7 Days', hours: 168 },
  { id: '30d', label: 'Past 30 Days', hours: 720 },
  { id: 'all_time', label: 'All Time Velocity', hours: 0 }
] as const;

export const SEEDED_POSTGRES_TRENDS: TrendItemDefinition[] = [
  {
    id: 'df38d73c-93c4-4526-8643-328fe340b0be',
    topic: 'FingerBio-Hardware',
    title: 'FingerBio™ Biometric Authentication Wave',
    description: 'Surge in biometric hardware passkey adoptions across West Africa',
    category: 'Tech & Sovereign Computing',
    trendType: 'hashtag',
    isTrending: true,
    isViral: true,
    popularityScore: 98.4,
    reachCount: 45200,
    postCount: 1840,
    viewCount: 128000,
    status: 'active'
  },
  {
    id: '4d2ad1b1-4c2c-471b-a94c-38c967995aff',
    topic: 'Infinite-Coin-Lion',
    title: 'Infinite Coin (FIC) Medallion Release',
    description: 'Global circulation of the 24k gold lion sovereign token package',
    category: 'Ecosystem & DeFi',
    trendType: 'token',
    isTrending: true,
    isViral: true,
    popularityScore: 96.1,
    reachCount: 78500,
    postCount: 3120,
    viewCount: 240000,
    status: 'active'
  },
  {
    id: '39a89990-9e74-4162-a93f-77d0c5a1eec0',
    topic: 'Flamingo-Luxury',
    title: 'Flamingo Haute Couture Spring Runway',
    description: 'Independent designers showcase African luxury goods in Lagos and Paris',
    category: 'Global Commerce & Trade',
    trendType: 'event',
    isTrending: true,
    isViral: false,
    popularityScore: 89.7,
    reachCount: 31200,
    postCount: 940,
    viewCount: 84000,
    status: 'active'
  },
  {
    id: 'bc8d0249-3024-4cc0-8c79-a07a9fd5b326',
    topic: 'Dancia-4Tv-SoundRiver',
    title: 'Dancia-4Tv®™© Acoustic Sound River',
    description: 'Real-time studio streaming and high-fidelity Afrobeats audio stems',
    category: 'Music & Entertainment',
    trendType: 'sound',
    isTrending: true,
    isViral: false,
    popularityScore: 91.2,
    reachCount: 54000,
    postCount: 1420,
    viewCount: 115000,
    status: 'active'
  }
];

export default SEEDED_POSTGRES_TRENDS;
