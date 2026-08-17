/**
 * FINGERMOBILE DISCOVERY PROTOCOL
 * PURPOSE: Behavioral Scoring, IP Proximity, and Geographical Shuffling Discovery Algorithms.
 */

import logger from '../utils/logger';
import { Member } from '../types';

export interface DiscoveryPreferences {
  primaryOption: 'multiDiversity' | 'geographical' | 'full';
  nationsLimit?: number; // For geographical option
  membersCount?: number; // For geographical option
}

export interface MemberActivity {
  memberId: string;
  timestamp: Date;
  action: 'view' | 'like' | 'follow' | 'share' | 'comment';
  targetMemberId?: string;
  targetContentId?: string;
}

export interface SearchParams {
  query?: string;
  location?: string;
  interests?: string[];
  genres?: string[];
  minFollowers?: number;
  maxDistance?: number;
}

export interface LocationWithCity {
  country: string;
  region?: string;
  city?: string;
}

export interface DiscoverableMember extends Omit<Member, 'location'> {
  location: LocationWithCity;
  handle: string;
  followerCount: number;
  bio?: string;
  posts: number;
}

export interface DiscoveryResult {
  members: Member[];
  algorithm: 'multiDiversity' | 'geographical' | 'full';
  metadata: {
    totalProcessed: number;
    countriesIncluded: number;
    timestamp: Date;
  };
}

// --- SAFE RUNTIME LOCATION HELPERS ---
function getLocationCountry(
  location: string | { country: string; region?: string; city?: string } | undefined
): string | undefined {
  if (typeof location === 'string') return location;
  if (location && typeof location === 'object' && 'country' in location) return location.country;
  return undefined;
}

function getLocationRegion(
  location: string | { country: string; region?: string; city?: string } | undefined
): string | undefined {
  if (location && typeof location === 'object' && 'region' in location && location.region) return location.region;
  return undefined;
}

// Global mutable repository for behavioral historical scoring analysis
const memberActivityHistory: MemberActivity[] = [];

// Base Repository Layer Mock Assets
const mockMembersStore: Member[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    username: 'johndoe',
    role: 'admin',
    isVerified: true,
    permissions: ['read', 'write', 'admin'],
    currentPlan: 'Creator Pro',
    location: { country: 'United States', region: 'California', city: 'Los Angeles' }
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Doe',
    username: 'janedoe',
    role: 'user',
    permissions: ['read', 'write', 'viewer'],
    currentPlan: 'Basic',
    location: { country: 'Canada', region: 'Ontario', city: 'Toronto' }
  },
  {
    id: '3',
    email: 'johnsmith@example.com',
    name: 'John Smith',
    username: 'johnsmith',
    role: 'user',
    permissions: ['read', 'comment'],
    currentPlan: 'Free',
    location: { country: 'United Kingdom', region: 'England', city: 'London' }
  }
];

/**
 * Filtered Search query processor over system profiles
 */
export const searchMembers = async (params: SearchParams): Promise<Member[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return mockMembersStore.filter((member) => {
    if (params.query) {
      const query = params.query.toLowerCase();
      const countryStr = getLocationCountry(member.location) || '';
      const regionStr = getLocationRegion(member.location) || '';

      const matchesQuery =
        (member.username || '').toLowerCase().includes(query) ||
        (member.bio || '').toLowerCase().includes(query) ||
        countryStr.toLowerCase().includes(query) ||
        regionStr.toLowerCase().includes(query);

      if (!matchesQuery) return false;
    }

    if (params.location) {
      const locationQuery = params.location.toLowerCase();
      const countryStr = getLocationCountry(member.location) || '';
      const regionStr = getLocationRegion(member.location) || '';

      if (!countryStr.toLowerCase().includes(locationQuery) && !regionStr.toLowerCase().includes(locationQuery)) {
        return false;
      }
    }

    if (params.interests && params.interests.length > 0 && member.preferences?.interests) {
      const hasCommonInterest = params.interests.some((interest) =>
        member.preferences?.interests?.includes(interest)
      );
      if (!hasCommonInterest) return false;
    }

    if (params.genres && params.genres.length > 0 && member.preferences?.genres) {
      const hasCommonGenre = params.genres.some((genre) =>
        member.preferences?.genres?.includes(genre)
      );
      if (!hasCommonGenre) return false;
    }

    if (params.minFollowers !== undefined && (member.followerCount ?? 0) < params.minFollowers) {
      return false;
    }

    return true;
  });
};

export const getMemberById = async (id: string): Promise<Member | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockMembersStore.find((m) => m.id === id) || null;
};

export const getCurrentUserProfile = async (): Promise<Member | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockMembersStore[0] || null;
};

export const updateMemberProfile = async (id: string, updates: Partial<Member>): Promise<Member> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const idx = mockMembersStore.findIndex((m) => m.id === id);
  if (idx === -1) throw new Error(`Member ID lookup failed context: ${id}`);

  const updatedMember = { ...mockMembersStore[idx], ...updates };
  mockMembersStore[idx] = updatedMember;
  return updatedMember;
};

export const toggleFollow = async (followerId: string, targetId: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const fIdx = mockMembersStore.findIndex((m) => m.id === followerId);
  const tIdx = mockMembersStore.findIndex((m) => m.id === targetId);
  if (fIdx === -1 || tIdx === -1) throw new Error('Target identities not unified');
  return Math.random() > 0.5;
};

// --- STRATEGIC AGGREGATION OBJECT MODULE ---
export const memberDiscoveryService = {
  async discoverMembers(filters?: {
    location?: LocationWithCity;
    interests?: string[];
    minFollowers?: number;
    maxDistance?: number;
  }): Promise<DiscoverableMember[]> {
    const mockDiscoverySet: DiscoverableMember[] = [
      {
        id: 'discoverable-member-1',
        email: 'discovered1@example.com',
        name: 'Discovered User 1',
        username: 'discovered1',
        role: 'user',
        permissions: [],
        handle: '@discovered1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        following: [],
        location: { country: 'United States', region: 'California', city: 'Los Angeles' },
        bio: 'Tech enthusiast and content creator',
        followerCount: 1250,
        posts: 128
      },
      {
        id: 'discoverable-member-2',
        email: 'discovered2@example.com',
        name: 'Discovered User 2',
        username: 'discovered2',
        role: 'user',
        permissions: [],
        handle: '@discovered2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        following: [],
        location: { country: 'Canada', region: 'Ontario', city: 'Toronto' },
        bio: 'Photographer and travel blogger',
        followerCount: 2100,
        posts: 320
      }
    ];

    let results = [...mockDiscoverySet];

    if (filters?.location?.city) {
      const filterCity = filters.location.city.toLowerCase();
      results = results.filter((m) => m.location.city?.toLowerCase().includes(filterCity));
    }
    if (filters?.location?.country) {
      const filterCountry = filters.location.country.toLowerCase();
      results = results.filter((m) => m.location.country.toLowerCase().includes(filterCountry));
    }
    if (filters?.minFollowers) {
      results = results.filter((m) => (m.followerCount || 0) >= filters.minFollowers!);
    }
    return results;
  },

  async getRecommendedMembers(userId: string, count = 10): Promise<DiscoverableMember[]> {
    const all = await this.discoverMembers();
    return all.slice(0, count);
  },

  async getNearbyMembers(userLocation: LocationWithCity, radiusKm = 50): Promise<DiscoverableMember[]> {
    const all = await this.discoverMembers();
    return all.filter((m) => m.location.country === userLocation.country);
  },

  async searchMembers(
    query: string,
    filters?: { location?: LocationWithCity; interests?: string[] }
  ): Promise<DiscoverableMember[]> {
    const all = await this.discoverMembers(filters);
    if (!query) return all;
    const cleanQuery = query.toLowerCase();
    return all.filter(
      (m) =>
        (m.name || '').toLowerCase().includes(cleanQuery) ||
        (m.handle || '').toLowerCase().includes(cleanQuery) ||
        (m.bio || '').toLowerCase().includes(cleanQuery)
    );
  },

  async followMember(memberId: string): Promise<boolean> {
    console.info(`Following member node: ${memberId}`);
    return true;
  },

  async unfollowMember(memberId: string): Promise<boolean> {
    console.info(`Unfollowing member node: ${memberId}`);
    return true;
  }
};

// --- SCORING ENGINE INTERNAL UTILS ---
const getMemberLocation = async (memberId: string): Promise<LocationWithCity> => {
  return { country: 'United States', region: 'California', city: 'Los Angeles' };
};

const getNationsList = async (limit = 10): Promise<string[]> => {
  const nations = [
    'United States',
    'United Kingdom',
    'Canada',
    'Germany',
    'Nigeria',
    'South Africa',
    'Kenya',
    'Brazil',
    'India',
    'Japan'
  ];
  return [...nations].sort(() => 0.5 - Math.random()).slice(0, limit);
};

const calculatePreferenceSimilarity = (m1: Member, m2: Member): number => {
  if (!m1.preferences || !m2.preferences) return 0;

  const m1Interests = m1.preferences.interests || [];
  const m2Interests = m2.preferences.interests || [];
  const commonInterests = m1Interests.filter((i) => m2Interests.includes(i));
  const interestScore = commonInterests.length * 3;

  const m1Genres = m1.preferences.genres || [];
  const m2Genres = m2.preferences.genres || [];
  const commonGenres = m1Genres.filter((g) => m2Genres.includes(g));
  const genreScore = commonGenres.length * 2.5;

  const m1Values = m1.preferences.values || [];
  const m2Values = m2.preferences.values || [];
  const commonValues = m1Values.filter((v) => m2Values.includes(v));
  const valueScore = commonValues.length * 3.5;

  const engDiff = Math.abs((m1.engagementRate || 0) - (m2.engagementRate || 0));
  const engScore = Math.max(0, 10 - engDiff * 100) * 0.1;

  return Math.min(100, interestScore + genreScore + valueScore + engScore);
};

const calculateActivitySimilarity = (m1Id: string, m2Id: string): number => {
  const m1Acts = memberActivityHistory.filter((a) => a.memberId === m1Id);
  const m2Acts = memberActivityHistory.filter((a) => a.memberId === m2Id);

  let common = 0;
  m1Acts.forEach((a1) => {
    const matched = m2Acts.some(
      (a2) => a1.targetContentId && a2.targetContentId === a1.targetContentId && a1.action === a2.action
    );
    if (matched) common++;
  });
  return Math.min(30, common * 3);
};

const calculateNetworkProximity = (
  m1Id: string,
  m2Id: string,
  network: Map<string, string[]>
): number => {
  const c1 = network.get(m1Id) || [];
  const c2 = network.get(m2Id) || [];
  const mutual = c1.filter((id) => c2.includes(id)).length;
  return Math.min(20, mutual * 2);
};

const calculateRecencyScore = (member: Member): number => {
  if (!member.lastActive) return 0;
  const targetDate = typeof member.lastActive === 'string' ? new Date(member.lastActive) : member.lastActive;
  const deltaHours = (Date.now() - targetDate.getTime()) / (1000 * 60 * 60);

  if (deltaHours < 1) return 15;
  if (deltaHours < 24) return 12;
  if (deltaHours < 168) return 8;
  return 1;
};

const calculateDiversityScore = (member: Member, suggested: Member[]): number => {
  if (suggested.length === 0) return 10;
  let diffSum = 0;

  suggested.forEach((s) => {
    const locDiff = getLocationCountry(member.location) !== getLocationCountry(s.location) ? 5 : 0;
    const memberInterests = member.preferences?.interests || [];
    const suggestedInterests = s.preferences?.interests || [];
    const commonInt = memberInterests.filter((i) => suggestedInterests.includes(i));
    const intDiff = commonInt.length === 0 ? 3 : 0;
    diffSum += locDiff + intDiff;
  });
  return Math.min(15, diffSum / suggested.length);
};

const fetchMembersFromCountries = async (countries: string[], limit: number): Promise<Member[]> => {
  const samplePipeline: Member[] = [
    {
      id: 'p-1',
      email: 'john@example.com',
      name: 'John Doe',
      username: 'johndoe',
      role: 'admin',
      isVerified: true,
      permissions: ['read', 'write', 'admin'],
      currentPlan: 'Creator Pro',
      location: { country: 'United States', region: 'California' }
    },
    {
      id: 'p-2',
      email: 'jane@example.com',
      name: 'Jane Doe',
      username: 'janedoe',
      role: 'user',
      permissions: ['read', 'write', 'viewer'],
      currentPlan: 'Basic',
      location: { country: 'Canada', region: 'Ontario' }
    },
    {
      id: 'p-3',
      email: 'johnsmith@example.com',
      name: 'John Smith',
      username: 'johnsmith',
      role: 'user',
      permissions: ['read', 'comment'],
      currentPlan: 'Free',
      location: { country: 'Nigeria', region: 'Lagos' }
    }
  ];

  const matched = samplePipeline.filter((m) => {
    const country = getLocationCountry(m.location);
    return country ? countries.includes(country) : false;
  });
  return matched.sort(() => 0.5 - Math.random()).slice(0, limit);
};

const fetchRandomMembers = async (limit: number): Promise<Member[]> => {
  return [...mockMembersStore].sort(() => 0.5 - Math.random()).slice(0, limit);
};

// --- ENGINE SUITE TOP-LEVEL EXPORTS ---
export const generateDiscoverySuggestions = async (
  preferences: DiscoveryPreferences
): Promise<DiscoveryResult> => {
  let discoveredMembers: Member[] = [];
  let countriesIncluded = 0;
  let totalProcessed = 0;

  switch (preferences.primaryOption) {
    case 'multiDiversity': {
      const nations = await getNationsList(10);
      countriesIncluded = nations.length;
      discoveredMembers = await fetchMembersFromCountries(nations, 500);
      totalProcessed = 500;
      break;
    }
    case 'geographical': {
      const geoNations = await getNationsList(preferences.nationsLimit || 30);
      countriesIncluded = geoNations.length;
      discoveredMembers = await fetchMembersFromCountries(geoNations, preferences.membersCount || 5000);
      totalProcessed = preferences.membersCount || 5000;
      break;
    }
    case 'full': {
      discoveredMembers = await fetchRandomMembers(1000);
      countriesIncluded = 25;
      totalProcessed = 1000;
      break;
    }
  }

  return {
    members: discoveredMembers,
    algorithm: preferences.primaryOption,
    metadata: { totalProcessed, countriesIncluded, timestamp: new Date() }
  };
};

export const rankDiscoveredMembers = async (
  currentMember: Member,
  discoveredMembers: Member[],
  network: Map<string, string[]>
): Promise<Member[]> => {
  const scoresComputed = await Promise.all(
    discoveredMembers.map(async (member) => {
      try {
        const preference = calculatePreferenceSimilarity(currentMember, member);
        const activity = calculateActivitySimilarity(String(currentMember.id), String(member.id));
        const networkScore = calculateNetworkProximity(String(currentMember.id), String(member.id), network);
        const recency = calculateRecencyScore(member);
        const diversity = calculateDiversityScore(member, []);

        const totalScore =
          preference * 0.4 + activity * 0.2 + networkScore * 0.15 + recency * 0.1 + diversity * 0.15;

        return { member, score: totalScore };
      } catch (err) {
        logger.error('Error computing metric weights:', err);
        return { member, score: 0 };
      }
    })
  );

  return scoresComputed.sort((a, b) => b.score - a.score).map((item) => item.member);
};

export const applyPreferenceFiltering = async (
  currentMember: Member,
  discoveredMembers: Member[]
): Promise<Member[]> => {
  const pairs = discoveredMembers.map((member) => ({
    member,
    score: calculatePreferenceSimilarity(currentMember, member)
  }));
  return pairs.sort((a, b) => b.score - a.score).map((p) => p.member);
};

export const applyProximityFiltering = async (
  memberId: string,
  discoveredMembers: Member[]
): Promise<(Member & { proximityScore: number })[]> => {
  const memberLoc = await getMemberLocation(memberId);
  const targetCountry = getLocationCountry(memberLoc);
  const targetRegion = getLocationRegion(memberLoc);

  const calculated = discoveredMembers.map((member) => {
    let score = 0;
    const mCountry = getLocationCountry(member.location);
    const mRegion = getLocationRegion(member.location);

    if (mCountry === targetCountry) {
      score = 100;
      if (mRegion === targetRegion) score = 200;
    }
    return { ...member, proximityScore: score };
  });

  return calculated.sort((a, b) => b.proximityScore - a.proximityScore);
};

export const adjustDiscoveryBasedOnFeedback = (
  memberId: string,
  feedback: { targetMemberId: string; action: 'positive' | 'negative' }
): void => {
  memberActivityHistory.push({
    memberId,
    timestamp: new Date(),
    action: feedback.action === 'positive' ? 'follow' : 'view',
    targetMemberId: feedback.targetMemberId
  });
};

export default {
  generateDiscoverySuggestions,
  rankDiscoveredMembers,
  applyPreferenceFiltering,
  applyProximityFiltering,
  adjustDiscoveryBasedOnFeedback,
  memberDiscoveryService
};